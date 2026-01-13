import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Home,
  Search,
  TrendingUp,
  Grid,
  Star,
  Settings,
  Package,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '@/hooks';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  requiresAuth?: boolean;
}

const mainItems: SidebarItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', href: '/' },
  { icon: <Search className="w-5 h-5" />, label: 'Browse', href: '/search' },
  { icon: <Grid className="w-5 h-5" />, label: 'Categories', href: '/categories' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Trending', href: '/trending' },
];

const userItems: SidebarItem[] = [
  {
    icon: <Package className="w-5 h-5" />,
    label: 'My Agents',
    href: '/dashboard',
    requiresAuth: true,
  },
  {
    icon: <Star className="w-5 h-5" />,
    label: 'Starred',
    href: '/starred',
    requiresAuth: true,
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    label: 'Analytics',
    href: '/analytics',
    requiresAuth: true,
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings',
    href: '/settings',
    requiresAuth: true,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const renderItem = (item: SidebarItem) => {
    if (item.requiresAuth && !isAuthenticated) return null;

    const isActive = location.pathname === item.href;

    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onClose}
        className={clsx(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-neutral-600 hover:bg-neutral-100'
        )}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed lg:sticky top-16 left-0 z-50 lg:z-0',
          'w-64 h-[calc(100vh-4rem)] bg-white border-r border-neutral-200',
          'transform transition-transform lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-4 space-y-6">
          <div className="space-y-1">{mainItems.map(renderItem)}</div>

          {isAuthenticated && (
            <>
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Your Account
                </h3>
                <div className="space-y-1">{userItems.map(renderItem)}</div>
              </div>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
