import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  isAdmin?: boolean;
}

export function Navbar({ isAdmin = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(isAdmin ? '/admin/login' : '/');
  };

  const publicNavItems = [
    { label: 'Courses', path: '/courses' },
    { label: 'Talks', path: '/talks' },
    { label: 'Books', path: '/books' },
    { label: 'Downloads', path: '/downloads' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Courses', path: '/admin/courses' },
    { label: 'Talks', path: '/admin/talks' },
    { label: 'Books', path: '/admin/books' },
    { label: 'Downloads', path: '/admin/downloads' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Registrations', path: '/admin/registrations' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  const navItems = isAdmin ? adminNavItems : publicNavItems;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="GuZo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-heading text-xl font-semibold text-[#111827]">
                GuZo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-[#7B6CFF]'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {!isAdmin && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <Link to="/dashboard">
                        <Button
                          variant="ghost"
                          className="text-[#6B7280] hover:text-[#111827]"
                        >
                          <User className="w-4 h-4 mr-2" />
                          My Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-[#6B7280] hover:text-[#111827]"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link to="/login">
                        <Button variant="ghost" className="text-[#6B7280] hover:text-[#111827]">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-6">
                          Join Free
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-[#6B7280] hover:text-[#111827]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#111827]" />
              ) : (
                <Menu className="w-6 h-6 text-[#111827]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-heading font-medium ${
                  location.pathname === item.path
                    ? 'text-[#7B6CFF]'
                    : 'text-[#111827]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!isAdmin && !user && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="text-[#6B7280] text-lg">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-[#7B6CFF] hover:bg-[#6B5CFF] text-white rounded-full px-8 py-6 text-lg">
                    Join Free
                  </Button>
                </Link>
              </div>
            )}
            {!isAdmin && user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-heading font-medium text-[#111827]"
                >
                  My Dashboard
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="text-[#6B7280]"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </>
            )}
            {isAdmin && (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                variant="ghost"
                className="text-[#6B7280]"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
