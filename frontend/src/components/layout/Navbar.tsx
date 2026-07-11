import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useUIStore } from '../../store/ui';
import { Button } from '../ui';
import { Menu, X, Search, ShoppingBag, Package, Building2, LogOut, User, LayoutDashboard, PackageOpen, Warehouse, Factory, BarChart3, BrainCircuit, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

function SellerDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const items = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/seller' },
    { label: 'Products', icon: Package, to: '/seller' },
    { label: 'Inventory', icon: PackageOpen, to: '/seller/inventory' },
    { label: 'Warehouses', icon: Warehouse, to: '/seller/warehouses' },
    { label: 'Orders', icon: ShoppingCart, to: '/seller/orders' },
    { label: 'Customers', icon: User, to: '/seller/customers' },
    { label: 'Invoices', icon: ShoppingBag, to: '/seller/invoices' },
    { label: 'Manufacturing', icon: Factory, to: '/seller/manufacturing' },
    { label: 'Analytics', icon: BarChart3, to: '/seller/analytics' },
    { label: 'AI Insights', icon: BrainCircuit, to: '/seller/ai' },
  ];
  return (
    <div ref={ref} className="relative hidden sm:block">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 px-2 py-1 rounded-md hover:bg-brand-50">
        <LayoutDashboard className="w-4 h-4" /> Sell
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {items.map(item => (
            <Link key={item.label} to={item.to} onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <item.icon className="w-4 h-4 text-gray-400" /> {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="w-7 h-7 text-brand-600" />
              <span className="text-xl font-bold text-gray-900">TradeHub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">Products</Link>
              <Link to="/categories" className="text-sm font-medium text-gray-600 hover:text-gray-900">Categories</Link>
              {isAuthenticated && user?.role === 'SELLER' && (
                <Link to="/seller" className="text-sm font-medium text-brand-600 hover:text-brand-700">Sell</Link>
              )}
            </nav>
          </div>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
                <Link to="/inquiries" className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Inquiries</span>
                </Link>
                {user?.role === 'SELLER' && <SellerDropdown />}
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <User className="w-5 h-5" />
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Link>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }} className="hidden sm:flex">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
                <Link to="/register"><Button size="sm">Get Started</Button></Link>
              </>
            )}
            <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </form>
          <Link to="/products" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Products</Link>
          <Link to="/categories" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Categories</Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Orders</Link>
              <Link to="/inquiries" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Inquiries</Link>
              <Link to="/profile" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Profile</Link>
              {user?.role === 'SELLER' && (
                <>
                  <Link to="/seller" className="block text-sm font-medium text-brand-600" onClick={toggleSidebar}>Dashboard</Link>
                  <Link to="/seller/inventory" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Inventory</Link>
                  <Link to="/seller/warehouses" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Warehouses</Link>
                  <Link to="/seller/orders" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Orders</Link>
                  <Link to="/seller/customers" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Customers</Link>
                  <Link to="/seller/invoices" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Invoices</Link>
                  <Link to="/seller/manufacturing" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Manufacturing</Link>
                  <Link to="/seller/analytics" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>Analytics</Link>
                  <Link to="/seller/ai" className="block text-sm font-medium text-gray-600" onClick={toggleSidebar}>AI Insights</Link>
                </>
              )}
              <button onClick={() => { logout(); navigate('/'); toggleSidebar(); }} className="block text-sm font-medium text-red-600">Sign out</button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" onClick={toggleSidebar}><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
              <Link to="/register" onClick={toggleSidebar}><Button size="sm" className="w-full">Get Started</Button></Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
