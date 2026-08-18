import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Provider } from '../models/Provider';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { OFFICIAL_CATEGORIES, VALID_CATEGORY_NAMES, VALID_CATEGORY_SLUGS } from '../constants/categories';

const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ success: false, message: 'Email, password, and name are required fields.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    });

    await Customer.create({ user: newUser._id });

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      success: true,
      message: 'Customer account registered successfully.',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, headline, bio, city, state, hourlyRate, category } = req.body;

    if (!email || !password || !name || !headline || !city || !state || !hourlyRate) {
      res.status(400).json({ 
        success: false, 
        message: 'Email, password, name, headline, city, state, and hourly rate are required.' 
      });
      return;
    }

    if (category) {
      const isValid = VALID_CATEGORY_NAMES.includes(category) || VALID_CATEGORY_SLUGS.includes(category);
      if (!isValid) {
        res.status(400).json({
          success: false,
          message: `Invalid service category '${category}'. Must be one of the 8 official marketplace categories.`,
        });
        return;
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone,
      role: 'PROVIDER',
      status: 'PENDING_VERIFICATION',
    });

    await Provider.create({
      user: newUser._id,
      headline,
      bio: bio || 'Independent service professional committed to local excellence.',
      city,
      state,
      hourlyRate,
      verificationStatus: 'SUBMITTED',
    });

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      success: true,
      message: 'Provider registration submitted. Document verification pending.',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};
