import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/routeUtils';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, login, returnUrl, setReturnUrl, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated && user) {
      const dest = returnUrl || getDashboardRoute(user.role);
      setReturnUrl(null);
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, returnUrl, navigate, setReturnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const authUser = await login(email, password);
      const dest = returnUrl || getDashboardRoute(authUser.role);
      setReturnUrl(null);
      navigate(dest, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="narrow" className="max-w-md w-full">
          <div className="bg-bone p-8 rounded-2xl border border-mist shadow-card space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                Account Sign In
              </span>
              <h1 className="text-3xl font-serif text-ink font-normal">Welcome Back</h1>
              <p className="text-xs text-charcoal-muted font-sans">
                Sign in to manage your local service bookings and verified schedule.
              </p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-right">
                  <RouterLink to="/auth/forgot-password" className="text-xs font-semibold text-mineral hover:underline">
                    Forgot password?
                  </RouterLink>
                </div>
              </div>

              <Button type="submit" variant="cta" fullWidth size="lg" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Sign In
              </Button>
            </form>

            <div className="pt-4 border-t border-mist space-y-2 text-center text-xs text-charcoal-subtle">
              <div>
                Don't have an account?{' '}
                <RouterLink to="/signup/customer" className="font-bold text-brand hover:underline">
                  Create Account
                </RouterLink>
              </div>

              <div className="pt-1 text-[11px] text-charcoal-muted">
                Are you a service professional?{' '}
                <RouterLink to="/signup/provider" className="font-bold text-slate hover:underline">
                  Become a Provider
                </RouterLink>
              </div>
            </div>

            <div className="p-3 bg-parchment rounded border border-mist/60 flex items-center gap-2 text-[11px] text-charcoal-muted">
              <ShieldCheck className="w-4 h-4 text-mineral shrink-0" />
              <span>Encrypted connection. Your credentials are never shared.</span>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
