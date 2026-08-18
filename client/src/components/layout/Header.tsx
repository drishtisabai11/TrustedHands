import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getDashboardRoute } from '../../utils/routeUtils';
import { Logo } from '../ui/Logo';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/providers?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  const dashboardRoute = getDashboardRoute(user?.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-md border-b border-mist/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Brand Logo & Wordmark */}
          <Logo size="md" />

          {/* Center: Main Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-sans font-medium text-charcoal">
            <RouterLink to="/services" className="hover:text-ink transition-colors">
              Services
            </RouterLink>
            <RouterLink to="/how-it-works" className="hover:text-ink transition-colors">
              How It Works
            </RouterLink>
            <RouterLink to="/about" className="hover:text-ink transition-colors">
              About
            </RouterLink>
          </nav>

          {/* Right: Actions & Primary CTA */}
          <div className="hidden md:flex items-center gap-3 font-sans text-sm">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-charcoal-muted hover:text-ink transition-colors rounded-md border border-mist bg-bone flex items-center gap-2 px-3 text-xs"
            >
              <Search className="w-3.5 h-3.5 text-mineral" />
              <span>Search services...</span>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <RouterLink to={dashboardRoute}>
                  <Button variant="cta" size="sm" className="font-semibold text-xs flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>{user.role === 'PROVIDER' ? 'Provider Dashboard' : 'My Dashboard'}</span>
                  </Button>
                </RouterLink>

                <button
                  onClick={logout}
                  className="p-2 text-charcoal-muted hover:text-brand transition-colors rounded-md border border-mist bg-bone flex items-center gap-1 text-xs"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <RouterLink to="/signup/provider" className="text-xs font-semibold text-charcoal-muted hover:text-ink transition-colors px-2">
                  Become a Provider
                </RouterLink>

                <RouterLink to="/auth/login">
                  <Button variant="text" size="sm" className="text-xs">
                    Login
                  </Button>
                </RouterLink>

                <RouterLink to="/signup/customer">
                  <Button variant="cta" size="sm" className="font-semibold text-xs">
                    Sign Up
                  </Button>
                </RouterLink>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-charcoal hover:text-ink rounded-md border border-mist bg-bone"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-mist bg-bone px-5 pt-4 pb-8 flex flex-col gap-4 font-sans animate-in slide-in-from-top-2 shadow-modal">
            <RouterLink 
              to="/services" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-charcoal hover:text-ink py-2 border-b border-mist/50"
            >
              Services
            </RouterLink>
            <RouterLink 
              to="/how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-charcoal hover:text-ink py-2 border-b border-mist/50"
            >
              How It Works
            </RouterLink>
            <RouterLink 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-charcoal hover:text-ink py-2 border-b border-mist/50"
            >
              About
            </RouterLink>
            
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-2.5 pt-3">
                <RouterLink to={dashboardRoute} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="cta" fullWidth size="md">
                    {user.role === 'PROVIDER' ? 'Provider Dashboard' : 'My Dashboard'}
                  </Button>
                </RouterLink>
                <Button variant="outline" fullWidth size="md" onClick={() => { setIsMobileMenuOpen(false); logout(); }}>
                  Logout ({user.name})
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 pt-3">
                <RouterLink to="/signup/provider" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth size="md">
                    Become a Service Provider
                  </Button>
                </RouterLink>
                <RouterLink to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" fullWidth size="md">
                    Login
                  </Button>
                </RouterLink>
                <RouterLink to="/signup/customer" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="cta" fullWidth size="md">
                    Sign Up
                  </Button>
                </RouterLink>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Quick Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="bg-bone border border-mist rounded-lg shadow-modal w-full max-w-xl p-6 relative font-sans animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-charcoal-subtle hover:text-ink p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl text-ink mb-1">Search Verified Services</h3>
            <p className="text-xs text-charcoal-subtle mb-4">Find electricians, carpenters, cleaners, tutors, and local professionals.</p>
            <form onSubmit={handleQuickSearch} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="e.g. Electrician in Mumbai, Deep cleaning..."
                className="flex-1 px-4 py-2.5 bg-parchment border border-mist rounded-md text-sm focus:outline-none focus:border-mineral"
              />
              <Button type="submit" variant="cta" size="md">
                Search
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
