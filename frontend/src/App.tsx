import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { SellerProductFormPage } from './pages/SellerProductFormPage';
import SellerInventoryPage from './pages/SellerInventoryPage';
import SellerWarehousesPage from './pages/SellerWarehousesPage';
import SellerWarehouseDetailPage from './pages/SellerWarehouseDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SellerOrdersPage from './pages/SellerOrdersPage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import { ManufacturingPage } from './pages/ManufacturingPage';
import { BOMFormPage } from './pages/BOMFormPage';
import { BOMDetailPage } from './pages/BOMDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AIPage } from './pages/AIPage';
import { QuoteBuilderPage } from './pages/QuoteBuilderPage';
import { useAuthStore } from './store/auth';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Buyer & Seller shared */}
          <Route path="/inquiries" element={<ProtectedRoute><InquiriesPage /></ProtectedRoute>} />
          <Route path="/messages/:inquiryId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

          {/* SELLER only */}
          <Route path="/seller" element={<ProtectedRoute role="SELLER"><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/seller/products/new" element={<ProtectedRoute role="SELLER"><SellerProductFormPage /></ProtectedRoute>} />
          <Route path="/seller/products/:id/edit" element={<ProtectedRoute role="SELLER"><SellerProductFormPage /></ProtectedRoute>} />
          <Route path="/seller/inventory" element={<ProtectedRoute role="SELLER"><SellerInventoryPage /></ProtectedRoute>} />
          <Route path="/seller/warehouses" element={<ProtectedRoute role="SELLER"><SellerWarehousesPage /></ProtectedRoute>} />
          <Route path="/seller/warehouses/:id" element={<ProtectedRoute role="SELLER"><SellerWarehouseDetailPage /></ProtectedRoute>} />
          <Route path="/seller/orders" element={<ProtectedRoute role="SELLER"><SellerOrdersPage /></ProtectedRoute>} />
          <Route path="/seller/customers" element={<ProtectedRoute role="SELLER"><CustomersPage /></ProtectedRoute>} />
          <Route path="/seller/invoices" element={<ProtectedRoute role="SELLER"><InvoicesPage /></ProtectedRoute>} />
          <Route path="/seller/manufacturing" element={<ProtectedRoute role="SELLER"><ManufacturingPage /></ProtectedRoute>} />
          <Route path="/seller/manufacturing/new" element={<ProtectedRoute role="SELLER"><BOMFormPage /></ProtectedRoute>} />
          <Route path="/seller/manufacturing/:id" element={<ProtectedRoute role="SELLER"><BOMDetailPage /></ProtectedRoute>} />
          <Route path="/seller/analytics" element={<ProtectedRoute role="SELLER"><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/seller/ai" element={<ProtectedRoute role="SELLER"><AIPage /></ProtectedRoute>} />

          {/* Quotes */}
          <Route path="/seller/quotes/new/:inquiryId" element={<ProtectedRoute role="SELLER"><QuoteBuilderPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
