import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/FormControls';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/routeUtils';
import { OFFICIAL_CATEGORIES } from '../../constants/categories';
import { ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';

export const ProviderRegisterPage: React.FC = () => {
  const { registerProvider, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState(OFFICIAL_CATEGORIES[0].name);
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [hourlyRate, setHourlyRate] = useState('499');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated && user) {
      navigate(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please recheck your passwords.');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Terms of Service to create a provider account.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const newUser = await registerProvider({
        email,
        password,
        name: fullName,
        phone,
        headline: headline || `${category} Specialist`,
        city,
        state,
        hourlyRate: parseFloat(hourlyRate) || 499,
      });

      // Explicitly redirect provider to Provider Dashboard
      navigate(getDashboardRoute(newUser.role));
    } catch (err: any) {
      setError(err.message || 'Provider registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="narrow" className="max-w-xl w-full">
          <div className="bg-bone p-8 rounded-2xl border border-mist shadow-card space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate flex items-center justify-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Service Provider Onboarding
              </span>
              <h1 className="text-3xl font-serif text-ink font-bold">Become a Service Provider</h1>
              <p className="text-xs text-charcoal-muted font-sans">
                Join the Trusted Hands provider network to receive direct job requests and manage your schedule.
              </p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="e.g. Rajesh"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="e.g. Kumar"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="rajesh.electrician@trustedhands.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Professional Headline"
                  placeholder="e.g. Government Licensed Electrician & Wiring Specialist"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Primary Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={OFFICIAL_CATEGORIES.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                  }))}
                />
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <Input
                    label="Hourly Rate (₹)"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Checkbox
                label="I agree to the Provider Terms, Code of Conduct & Background Check authorization"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />

              <Button type="submit" variant="cta" fullWidth size="lg" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Complete Provider Sign Up
              </Button>
            </form>

            <div className="pt-4 border-t border-mist flex flex-col sm:flex-row justify-between items-center text-xs text-charcoal-subtle gap-2">
              <span>Already a provider? <RouterLink to="/auth/login" className="font-bold text-brand hover:underline">Sign In</RouterLink></span>
              <RouterLink to="/signup/customer" className="text-mineral hover:underline font-semibold">Looking to hire? Register as Customer</RouterLink>
            </div>

            <div className="p-3 bg-parchment rounded border border-mist/60 flex items-center gap-2 text-[11px] text-charcoal-muted">
              <ShieldCheck className="w-4 h-4 text-mineral shrink-0" />
              <span>Provider accounts undergo identity and background check verification.</span>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderRegisterPage;
