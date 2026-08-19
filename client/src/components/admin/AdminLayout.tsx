import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  CreditCard,
  Star,
  Bell,
  FileText,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Providers', path: '/admin/providers', icon: ShieldCheck },
    { label: 'Services', path: '/admin/services', icon: Wrench },
    { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Content (CMS)', path: '/admin/content', icon: FileText },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearchQuery.trim()) return;
    setIsSearching(true);
    setShowSearchModal(true);
    try {
      const res = await adminService.globalSearch(globalSearchQuery.trim());
      setSearchResults(res);
    } catch {
      setSearchResults({ customers: [], providers: [], bookings: [], services: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (targetUrl: string) => {
    setShowSearchModal(false);
    setGlobalSearchQuery('');
    navigate(targetUrl);
  };

  return (
    <div className="min-h-screen bg-parchment flex font-sans text-charcoal antialiased">
      {/* Sidebar Desktop & Tablet */}
      <aside
        className={`hidden md:flex flex-col bg-burgundy text-parchment transition-all duration-200 border-r border-burgundy/80 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-parchment/10">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-md bg-parchment text-burgundy flex items-center justify-center shrink-0 font-serif font-bold text-xl">
              TH
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-serif text-lg leading-tight tracking-tight text-parchment font-bold">
                  Trusted Hands
                </span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-seafoam">
                  Admin Console
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-mist/70 hover:text-parchment p-1 rounded-md transition-colors"
            title="Toggle sidebar width"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin/overview' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-crimson text-parchment shadow-sm font-semibold'
                    : 'text-mist/80 hover:bg-parchment/10 hover:text-parchment'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-parchment' : 'text-seafoam'}`} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-parchment/10">
          <button
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-mist/80 hover:bg-crimson/20 hover:text-parchment transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0 text-seafoam" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-xs" onClick={() => setIsMobileDrawerOpen(false)} />
          <aside className="relative w-72 max-w-[80vw] bg-burgundy text-parchment flex flex-col h-full shadow-2xl z-10">
            <div className="h-20 px-5 flex items-center justify-between border-b border-parchment/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-parchment text-burgundy flex items-center justify-center font-serif font-bold text-lg">
                  TH
                </div>
                <span className="font-serif text-lg font-bold text-parchment">Trusted Hands Admin</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-mist p-1 hover:text-parchment"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/admin/overview' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-crimson text-parchment font-semibold' : 'text-mist/80 hover:bg-parchment/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-seafoam" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-parchment/10">
              <button
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-mist hover:bg-crimson/20"
              >
                <LogOut className="w-5 h-5 text-seafoam" />
                <span>Logout Admin</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="h-20 bg-parchment/95 backdrop-blur-md border-b border-mist/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg border border-mist bg-bone text-charcoal hover:text-ink"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl text-ink font-semibold tracking-tight">
                Operational Control Center
              </h1>
              <p className="text-xs text-charcoal-muted hidden sm:block">
                Platform Monitoring & Marketplace Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <Search className="w-4 h-4 text-mineral absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search customers, providers, booking IDs..."
                className="w-64 lg:w-80 pl-9 pr-4 py-2 bg-bone border border-mist rounded-lg text-xs focus:outline-none focus:border-crimson text-charcoal transition-all"
              />
            </form>

            {/* Notifications Bell */}
            <Link
              to="/admin/notifications"
              className="p-2 rounded-lg border border-mist bg-bone text-charcoal-muted hover:text-ink hover:border-mineral relative transition-colors"
              title="Admin Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson"></span>
            </Link>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-mist">
              <div className="w-9 h-9 rounded-full bg-crimson text-parchment font-semibold text-sm flex items-center justify-center border border-burgundy">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-ink leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] font-sans text-mineral font-medium">System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Global Search Results Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-bone border border-mist rounded-xl shadow-modal w-full max-w-2xl p-6 relative animate-in zoom-in-95 duration-150 font-sans">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 text-charcoal-muted hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl text-ink mb-1">Global Admin Search Results</h3>
            <p className="text-xs text-charcoal-muted mb-4">Query: "{globalSearchQuery}"</p>

            {isSearching ? (
              <div className="py-8 text-center text-charcoal-muted text-sm">Searching across platform records...</div>
            ) : searchResults ? (
              <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
                {/* Bookings */}
                {searchResults.bookings?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-crimson mb-2">Bookings</h4>
                    <div className="space-y-2">
                      {searchResults.bookings.map((b: any) => (
                        <div
                          key={b._id}
                          onClick={() => handleResultClick(`/admin/bookings/${b._id}`)}
                          className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson cursor-pointer flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-bold text-ink">#{b.bookingNumber}</span> — {b.service?.title}
                            <div className="text-[11px] text-charcoal-muted">Customer: {b.customer?.name}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-seafoam/20 text-ink font-semibold">
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Providers */}
                {searchResults.providers?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-crimson mb-2">Providers</h4>
                    <div className="space-y-2">
                      {searchResults.providers.map((p: any) => (
                        <div
                          key={p._id}
                          onClick={() => handleResultClick(`/admin/providers/${p._id}`)}
                          className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson cursor-pointer flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-bold text-ink">{p.businessName || p.user?.name}</span> ({p.city})
                            <div className="text-[11px] text-charcoal-muted">{p.headline}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-mint text-ink font-semibold">
                            {p.verificationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customers */}
                {searchResults.customers?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-crimson mb-2">Customers</h4>
                    <div className="space-y-2">
                      {searchResults.customers.map((c: any) => (
                        <div
                          key={c._id}
                          onClick={() => handleResultClick(`/admin/customers/${c._id}`)}
                          className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson cursor-pointer flex justify-between items-center text-xs"
                        >
                          <div>
                            <span className="font-bold text-ink">{c.name}</span> — {c.email}
                          </div>
                          <span className="px-2 py-0.5 rounded bg-mist text-ink font-semibold">
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.bookings?.length === 0 &&
                  searchResults.providers?.length === 0 &&
                  searchResults.customers?.length === 0 && (
                    <div className="py-6 text-center text-xs text-charcoal-muted">
                      No matching records found for "{globalSearchQuery}".
                    </div>
                  )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
