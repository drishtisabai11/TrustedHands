import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/routeUtils';
import { User, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SignupSelectionPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated && user) {
      navigate(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container size="normal" className="max-w-3xl w-full">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
              Trusted Hands Registration
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-ink font-bold">Choose Your Account Type</h1>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              Select how you would like to join the Trusted Hands network of verified local services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OPTION 1: CUSTOMER */}
            <div className="bg-bone border border-mist hover:border-brand/40 rounded-2xl p-8 shadow-card transition-all duration-200 flex flex-col justify-between space-y-6 group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-parchment border border-mist flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-bone transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">
                    For Homeowners & Clients
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate">Join as a Customer</h2>
                  <p className="text-xs text-charcoal leading-relaxed">
                    Find trusted local professionals, book upfront fixed-rate services, track appointment progress, and manage reviews with escrow protection.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-charcoal-muted pt-2 border-t border-mist/60">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Upfront transparent pricing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Verified background-checked specialists</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Satisfaction-guaranteed escrow payment</span>
                  </li>
                </ul>
              </div>

              <RouterLink to="/signup/customer" className="w-full pt-4">
                <Button variant="cta" fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Sign Up as Customer
                </Button>
              </RouterLink>
            </div>

            {/* OPTION 2: SERVICE PROVIDER */}
            <div className="bg-bone border border-mist hover:border-brand/40 rounded-2xl p-8 shadow-card transition-all duration-200 flex flex-col justify-between space-y-6 group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-parchment border border-mist flex items-center justify-center text-slate group-hover:bg-slate group-hover:text-bone transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">
                    For Independent Specialists
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate">Join as a Service Provider</h2>
                  <p className="text-xs text-charcoal leading-relaxed">
                    Offer your trade skills, receive direct booking requests, manage your weekly availability, showcase portfolio work, and grow your local business.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-charcoal-muted pt-2 border-t border-mist/60">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Direct client job bookings</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Flexible schedule & working hours</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0" />
                    <span>Guaranteed direct earnings payout</span>
                  </li>
                </ul>
              </div>

              <RouterLink to="/signup/provider" className="w-full pt-4">
                <Button variant="outline" fullWidth size="lg" className="border-brand text-brand hover:bg-brand hover:text-bone" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Become a Service Provider
                </Button>
              </RouterLink>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-charcoal-subtle space-y-2">
            <p>
              Already have an account?{' '}
              <RouterLink to="/auth/login" className="font-bold text-brand hover:underline">
                Sign In to Your Dashboard
              </RouterLink>
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default SignupSelectionPage;
