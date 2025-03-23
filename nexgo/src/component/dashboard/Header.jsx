import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const Header = ({ sidebarWidth, className }) => {
  const location = useLocation();

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/admin') return [{ label: 'Dashboard', path: '/admin' }];

    const segments = path.split('/').filter((segment) => segment !== '');

    return [
      { label: 'Dashboard', path: '/admin' },
      ...segments.map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: `/${segments.slice(0, index + 1).join('/')}`,
      })),
    ];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header
      className={cn(
        'w-full fixed top-0 right-0 z-20 h-16 border-b border-border backdrop-blur-md bg-background/80 flex items-center justify-between px-6 transition-all duration-300',
        className
      )}
      style={{ width: `calc(100% - ${sidebarWidth}px)` }}
    >
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <span
              className={cn(
                'text-sm transition-colors',
                index === breadcrumbs.length - 1
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {crumb.label}
            </span>
            {index < breadcrumbs.length - 1 && (
              <span className="text-muted-foreground">/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="py-1.5 pl-10 pr-4 bg-secondary border-0 rounded-md text-sm focus:ring-1 focus:ring-primary focus-visible:outline-none transition-all duration-200 w-36 focus:w-60"
          />
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;