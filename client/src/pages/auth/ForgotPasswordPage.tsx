import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/FeedbackComponents';
import { ArrowLeft, Send } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
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
                Account Recovery
              </span>
              <h1 className="text-3xl font-serif text-ink font-normal">Reset Password</h1>
              <p className="text-xs text-charcoal-muted font-sans">
                Enter your account email address to receive password reset instructions.
              </p>
            </div>

            {submitted ? (
              <Alert variant="success" title="Reset Email Sent">
                If an account exists for {email}, a secure password reset link has been dispatched. Please check your inbox.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" variant="cta" fullWidth size="lg" leftIcon={<Send className="w-4 h-4" />}>
                  Send Password Reset Link
                </Button>
              </form>
            )}

            <div className="pt-4 border-t border-mist text-center">
              <RouterLink to="/auth/login" className="inline-flex items-center gap-1 text-xs font-bold text-charcoal hover:text-ink">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </RouterLink>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
