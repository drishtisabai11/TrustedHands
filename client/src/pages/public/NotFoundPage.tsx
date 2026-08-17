import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-24">
        <Container size="narrow" className="text-center space-y-6">
          <span className="font-serif text-6xl text-mineral block">404</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
            Page Not Found
          </h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            The page or marketplace resource you requested does not exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <RouterLink to="/">
              <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
                Return to Homepage
              </Button>
            </RouterLink>
            <RouterLink to="/providers">
              <Button variant="cta" size="md" leftIcon={<Search className="w-4 h-4" />}>
                Browse Verified Professionals
              </Button>
            </RouterLink>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
