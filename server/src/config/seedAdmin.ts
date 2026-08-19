import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { CANONICAL_CATEGORIES } from '../constants/categories';

export const seedInitialAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@trustedhands.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecret123!';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail.toLowerCase(),
        passwordHash,
        name: 'Platform Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
      });
      console.log(`[Seed] Created initial admin user: ${adminEmail}`);
    } else if (existingAdmin.role !== 'ADMIN') {
      existingAdmin.role = 'ADMIN';
      existingAdmin.status = 'ACTIVE';
      await existingAdmin.save();
      console.log(`[Seed] Promoted user to ADMIN role: ${adminEmail}`);
    }

    // Seed canonical categories if empty
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(CANONICAL_CATEGORIES);
      console.log(`[Seed] Seeded ${CANONICAL_CATEGORIES.length} canonical categories.`);
    }
  } catch (error) {
    console.error('[Seed] Admin & Category seeding error:', error);
  }
};
