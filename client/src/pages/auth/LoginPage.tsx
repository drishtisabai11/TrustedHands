import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, returnUrl, setReturnUrl, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      if (returnUrl) {
        const dest = returnUrl;
        setReturnUrl(null);
        navigate(dest);
      } else {
        navigate('/');
      }
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
          <div className="bg-bone p-8 rounded-lg border border-mist shadow-card space-y-6">
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

            <div className="pt-4 border-t border-mist text-center text-xs text-charcoal-subtle">
              Don't have an account?{' '}
              <RouterLink to="/auth/register" className="font-bold text-mineral hover:underline">
                Create Account
              </RouterLink>
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
