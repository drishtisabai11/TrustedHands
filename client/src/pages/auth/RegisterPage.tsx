import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerCustomer, returnUrl, setReturnUrl, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated) {
      if (returnUrl) {
        const dest = returnUrl;
        setReturnUrl(null);
        navigate(dest);
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, returnUrl, navigate, setReturnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please recheck your passwords.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Terms of Service to create an account.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await registerCustomer(email, password, fullName, phone);
      if (returnUrl) {
        const dest = returnUrl;
        setReturnUrl(null);
        navigate(dest);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Account registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="narrow" className="max-w-lg w-full">
          <div className="bg-bone p-8 rounded-lg border border-mist shadow-card space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                Customer Registration
              </span>
              <h1 className="text-3xl font-serif text-ink font-normal">Create Account</h1>
              <p className="text-xs text-charcoal-muted font-sans">
                Join Trusted Hands to book vetted service professionals with escrow protection.
              </p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="e.g. Vikramaditya"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Singh"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Checkbox
                label="I accept the Terms of Service & Privacy Policy"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />

              <Button type="submit" variant="cta" fullWidth size="lg" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Account
              </Button>
            </form>

            <div className="pt-4 border-t border-mist text-center text-xs text-charcoal-subtle">
              Already have an account?{' '}
              <RouterLink to="/auth/login" className="font-bold text-mineral hover:underline">
                Sign In
              </RouterLink>
            </div>

            <div className="p-3 bg-parchment rounded border border-mist/60 flex items-center gap-2 text-[11px] text-charcoal-muted">
              <ShieldCheck className="w-4 h-4 text-mineral shrink-0" />
              <span>We never sell your contact information or spam your inbox.</span>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
