import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-600" />
              <span className="text-lg font-bold">TradeHub</span>
            </Link>
            <p className="text-sm text-gray-500">India's fastest growing B2B marketplace connecting buyers and suppliers.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">For Buyers</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/products" className="hover:text-brand-600">Browse Products</Link></li>
              <li><Link to="/categories" className="hover:text-brand-600">Categories</Link></li>
              <li><Link to="/register" className="hover:text-brand-600">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/register" className="hover:text-brand-600">Start Selling</Link></li>
              <li><Link to="/seller" className="hover:text-brand-600">Seller Dashboard</Link></li>
              <li><Link to="/register?role=seller" className="hover:text-brand-600">List Products</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@tradehub.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 1800-123-4567</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TradeHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
