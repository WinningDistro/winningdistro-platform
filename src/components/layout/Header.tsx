import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Distribution', href: '/distribution' },
    { name: 'Marketing', href: '/marketing' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Who We Are', href: '/about' },
    { name: 'Blog', href: '/blog' },
    ...(isAuthenticated
      ? [{ name: 'Dashboard', href: '/dashboard' }]
      : [
          { name: 'Join', href: '/join' },
          { name: 'Login', href: '/login' },
        ]
    ),
  ];

  return (
    <header className="bg-black border-b-4 border-green">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="logo-icon" />
            <span className="text-xl font-bold text-gold">WinningDistro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-bold transition-colors hover:text-green ${
                  location.pathname === item.href ? 'text-green' : 'text-gold'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Notifications & User Menu */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2">
                <NotificationDropdown />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gold hover:text-green p-2">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-green" align="end">
                    <div className="px-3 py-2">
                      <p className="text-gold font-medium">{user.artistName || user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-green" />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="text-white hover:text-gold cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:text-gold cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gold hover:text-green">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-green w-[300px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="logo-icon" />
                    <span className="text-lg font-bold text-gold">WinningDistro</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gold hover:text-green"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-bold transition-colors hover:text-green py-2 ${
                        location.pathname === item.href ? 'text-green' : 'text-gold'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
