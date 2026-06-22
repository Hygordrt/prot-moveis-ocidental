import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(240,246,255,0.97)' : 'rgba(240,246,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: scrolled ? '1px solid #dbeafe' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: 20, fontFamily: 'serif' }}>M</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: '#1e293b', lineHeight: 1 }}>
                Móveis Ocidental
              </div>
              <div style={{ fontSize: 11, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase' }}>
                Móveis & Decoração
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  color: location.pathname === l.to ? '#2563eb' : '#1e3a5f',
                  borderBottom: location.pathname === l.to ? '2px solid #2563eb' : '2px solid transparent',
                  paddingBottom: 2, transition: 'all 0.2s',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os móveis."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#25D366', color: 'white',
                padding: '8px 16px', borderRadius: 100,
                textDecoration: 'none', fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
              }}
            >
              <MessageCircle size={16} />
              <span className="hide-mobile">WhatsApp</span>
            </a>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="hamburger-btn"
              style={{
                display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', padding: 6, color: '#1e3a5f',
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#f0f6ff', borderTop: '1px solid #dbeafe',
          padding: '16px 24px 24px',
        }}>
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: 'block', padding: '12px 0', textDecoration: 'none',
                fontSize: 16, fontWeight: 500, color: '#1e3a5f',
                borderBottom: '1px solid #e0eaff',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .hide-mobile { display: none; }
        }
      `}</style>
    </header>
  );
}
