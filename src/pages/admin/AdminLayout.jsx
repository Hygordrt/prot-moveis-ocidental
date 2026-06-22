import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, PlusSquare,
  LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/estoque', icon: Package, label: 'Estoque' },
  { to: '/admin/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { to: '/admin/cadastrar', icon: PlusSquare, label: 'Cadastrar Produto' },
];

export default function AdminLayout() {
  const { isAdminLoggedIn, adminLogout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdminLoggedIn) {
    navigate('/admin');
    return null;
  }

  function logout() {
    adminLogout();
    navigate('/admin');
  }

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(168,130,77,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: 'white', fontSize: 18, fontFamily: 'serif' }}>M</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: '#eff6ff' }}>
              Móveis Ocidental
            </div>
            <div style={{ fontSize: 10, color: '#2563eb', letterSpacing: 1 }}>ADMIN</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 10, marginBottom: 4,
                textDecoration: 'none',
                background: active ? 'rgba(168,130,77,0.2)' : 'transparent',
                color: active ? '#93c5fd' : '#94a3b8',
                fontWeight: active ? 600 : 400, fontSize: 14,
                transition: 'all 0.2s',
              }}
            >
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(168,130,77,0.2)' }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
          color: '#475569', textDecoration: 'none', padding: '8px 14px',
        }}>
          Ver site
        </Link>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 14px', borderRadius: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#ef4444', fontSize: 14, fontWeight: 500,
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#eff6ff' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 240, background: '#1e293b', flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }} className="admin-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 260,
            background: '#1e293b', overflowY: 'auto',
          }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <header style={{
          background: 'white', padding: '12px 20px',
          borderBottom: '1px solid #dbeafe',
          display: 'flex', alignItems: 'center', gap: 12,
          position: 'sticky', top: 0, zIndex: 100,
        }} className="admin-topbar">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e3a5f', padding: 4 }}
            className="mobile-menu-btn"
          >
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1e293b', fontWeight: 600 }}>
            {navItems.find(n => n.to === location.pathname)?.label || 'Admin'}
          </span>
        </header>

        <main style={{ flex: 1, padding: 'clamp(16px, 3vw, 32px)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-topbar { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
