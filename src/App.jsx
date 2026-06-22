import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import RegisterProduct from './pages/admin/RegisterProduct';
import Orders from './pages/admin/Orders';

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/catalogo" element={<PublicLayout><Catalog /></PublicLayout>} />
          <Route path="/produto/:id" element={<PublicLayout><Product /></PublicLayout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="estoque" element={<Inventory />} />
            <Route path="cadastrar" element={<RegisterProduct />} />
            <Route path="pedidos" element={<Orders />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
