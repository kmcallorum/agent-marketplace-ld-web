import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Github, LogOut, User, Plus, Shield, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks';
import { Button, Avatar } from '@/components/common';
import { SearchBar } from '@/components/search';
import { GITHUB_OAUTH_URL } from '@/utils/constants';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = GITHUB_OAUTH_URL;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-xl text-neutral-900 hidden sm:block">
                Agent Marketplace
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/search"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/categories"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Categories
              </Link>
              <Link
                to="/trending"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Trending
              </Link>
              <Link
                to="/help"
                className="text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
            </nav>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => navigate('/publish')}
                  className="hidden sm:flex"
                >
                  Publish
                </Button>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100"
                  >
                    <Avatar
                      src={user.avatar_url}
                      alt={user.username}
                      size="sm"
                    />
                    <span className="hidden sm:block text-sm font-medium text-neutral-700">
                      {user.username}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                        <Link
                          to={`/users/${user.username}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Menu className="w-4 h-4" />
                          Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin
                          </Link>
                        )}
                        <hr className="my-1 border-neutral-200" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Github className="w-4 h-4" />}
                onClick={handleLogin}
              >
                Login with GitHub
              </Button>
            )}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="mb-4">
              <SearchBar />
            </div>
            <nav className="flex flex-col gap-2">
              <Link
                to="/search"
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                to="/categories"
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/trending"
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <Link
                to="/help"
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-50 rounded-lg flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
              {isAuthenticated && (
                <Link
                  to="/publish"
                  className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Publish Agent
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
