import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/auth/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="narrow" className="max-w-md w-full">
          <div className="bg-bone p-8 rounded-lg border border-mist shadow-card space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                Security Update
              </span>
              <h1 className="text-3xl font-serif text-ink font-normal">Set New Password</h1>
              <p className="text-xs text-charcoal-muted font-sans">
                Choose a strong new password for your Trusted Hands account.
              </p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            {submitted ? (
              <Alert variant="success" title="Password Updated">
                Your password has been reset successfully. Redirecting you to sign in...
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button type="submit" variant="cta" fullWidth size="lg" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                  Save New Password
                </Button>
              </form>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
