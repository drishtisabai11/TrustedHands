import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Bookmark,
  MapPin,
  Star,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
  DollarSign,
  Clock,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'CUSTOMER' | 'PROVIDER';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const customerNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', path: '/dashboard/bookings', icon: CalendarDays },
    { label: 'Saved Professionals', path: '/dashboard/saved', icon: Bookmark },
    { label: 'Addresses', path: '/dashboard/addresses', icon: MapPin },
    { label: 'Reviews', path: '/dashboard/reviews', icon: Star },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const providerNavItems = [
    { label: 'Overview', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', path: '/provider/bookings', icon: Briefcase },
    { label: 'Calendar', path: '/provider/calendar', icon: CalendarDays },
    { label: 'Availability', path: '/provider/availability', icon: Clock },
    { label: 'Services Offered', path: '/provider/services', icon: Wrench },
    { label: 'Earnings & Ledger', path: '/provider/earnings', icon: DollarSign },
    { label: 'Reviews & Feedback', path: '/provider/reviews', icon: Star },
    { label: 'Profile & Portfolio', path: '/provider/profile', icon: User },
    { label: 'Notifications', path: '/provider/notifications', icon: Bell },
    { label: 'Settings', path: '/provider/settings', icon: Settings },
  ];

  const navItems = role === 'PROVIDER' ? providerNavItems : customerNavItems;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-parchment text-ink flex flex-col font-sans">
      {/* HEADER BAR */}
      <header className="bg-bone border-b border-mist/60 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Mobile Toggle */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-charcoal hover:bg-mist/40 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Logo size="sm" />

              <span className="hidden sm:inline-block h-4 w-px bg-mist"></span>

              <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-parchment text-charcoal border border-mist">
                {role === 'PROVIDER' ? 'Provider Workspace' : 'Customer Workspace'}
              </span>
            </div>

            {/* Right: Notifications, Role Switch & Profile Avatar */}
            <div className="flex items-center space-x-3">
              <Link
                to={role === 'PROVIDER' ? '/provider/notifications' : '/dashboard/notifications'}
                className="p-2 text-charcoal hover:text-brand relative rounded-full hover:bg-mist/30 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full ring-2 ring-bone"></span>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none rounded-full p-1 hover:ring-2 hover:ring-brand/30 transition-all"
                >
                  <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
                  <span className="text-sm font-medium text-ink hidden md:inline">{user?.name?.split(' ')[0]}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-bone rounded-lg shadow-modal border border-mist py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-mist">
                      <p className="text-xs font-semibold text-charcoal-subtle uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-ink truncate">{user?.name}</p>
                      <p className="text-xs text-charcoal-muted truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={role === 'PROVIDER' ? '/provider/profile' : '/dashboard/profile'}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink hover:bg-parchment"
                      >
                        <User className="w-4 h-4 mr-2 text-charcoal" /> Profile Details
                      </Link>
                      <Link
                        to={role === 'PROVIDER' ? '/provider/settings' : '/dashboard/settings'}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-ink hover:bg-parchment"
                      >
                        <Settings className="w-4 h-4 mr-2 text-charcoal" /> Settings
                      </Link>

                      {/* Switch Role Option if applicable */}
                      {user?.role === 'PROVIDER' && role === 'CUSTOMER' && (
                        <Link
                          to="/provider/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-brand font-medium hover:bg-parchment"
                        >
                          <Briefcase className="w-4 h-4 mr-2 text-brand" /> Switch to Provider Dashboard
                        </Link>
                      )}
                      {user?.role === 'PROVIDER' && role === 'PROVIDER' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-sage-dark font-medium hover:bg-parchment"
                        >
                          <User className="w-4 h-4 mr-2 text-sage-dark" /> Switch to Customer View
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-mist pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-brand hover:bg-brand/10 font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-2 text-brand" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex gap-8">
        {/* DESKTOP SIDEBAR */}
        <aside className="w-64 shrink-0 hidden md:block">
          <nav className="bg-bone border border-mist/80 rounded-xl p-3 shadow-subtle sticky top-24 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && item.path !== '/provider/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand text-bone shadow-sm'
                      : 'text-ink hover:text-brand hover:bg-parchment/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-bone' : 'text-charcoal'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-bone/80" />}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-mist/60 px-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-muted hover:text-brand hover:bg-brand/10 transition-all"
              >
                <LogOut className="w-4 h-4 text-brand" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-bone border-r border-mist pt-5 pb-4">
              <div className="px-4 flex items-center justify-between pb-4 border-b border-mist">
                <span className="font-serif font-bold text-slate text-lg">
                  Trusted<span className="text-brand">Hands</span> Nav
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-charcoal hover:bg-mist/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex-1 h-0 overflow-y-auto px-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && item.path !== '/provider/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-3 rounded-lg text-sm font-medium ${
                        isActive ? 'bg-brand text-bone' : 'text-ink hover:bg-parchment'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-bone' : 'text-charcoal'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-mist">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-brand text-brand font-medium hover:bg-brand hover:text-bone transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN EDITORIAL CONTENT PAGE AREA */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bone border-t border-mist z-30 shadow-modal px-2 py-1.5 flex justify-around items-center">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-brand' : 'text-charcoal-muted hover:text-ink'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
