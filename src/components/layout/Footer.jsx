import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Camera, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#1e293b', color: '#93c5fd', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: 20, fontFamily: 'serif' }}>M</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, color: '#eff6ff' }}>
                  Móveis Ocidental
                </div>
                <div style={{ fontSize: 10, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Móveis & Decoração
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#94a3b8' }}>
              Mais de 15 anos transformando ambientes com móveis de qualidade e design atemporal.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[
                { icon: Camera, href: '#' },
                { icon: Globe, href: '#' },
                { icon: MessageCircle, href: 'https://wa.me/5511999999999' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(168,130,77,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#60a5fa', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: "'Inter', sans-serif", color: '#eff6ff', fontSize: 16, marginBottom: 20, fontWeight: 600 }}>
              Navegação
            </h4>
            {[
              { to: '/', label: 'Início' },
              { to: '/catalogo', label: 'Catálogo' },
              { to: '/#sobre', label: 'Sobre Nós' },
              { to: '/#contato', label: 'Contato' },
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: 'block', fontSize: 14, color: '#94a3b8',
                  textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Categorias */}
          <div>
            <h4 style={{ fontFamily: "'Inter', sans-serif", color: '#eff6ff', fontSize: 16, marginBottom: 20, fontWeight: 600 }}>
              Categorias
            </h4>
            {['Sofás', 'Mesas', 'Camas', 'Armários', 'Cadeiras', 'Decoração'].map(cat => (
              <Link
                key={cat}
                to={`/catalogo?categoria=${cat.toLowerCase()}`}
                style={{
                  display: 'block', fontSize: 14, color: '#94a3b8',
                  textDecoration: 'none', marginBottom: 10,
                }}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Contato */}
          <div>
            <h4 style={{ fontFamily: "'Inter', sans-serif", color: '#eff6ff', fontSize: 16, marginBottom: 20, fontWeight: 600 }}>
              Contato
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: '#94a3b8' }}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: 2, color: '#2563eb' }} />
                Av. das Flores, 1234 — Jardim Europa, São Paulo/SP
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#94a3b8' }}>
                <Phone size={16} style={{ color: '#2563eb' }} />
                (11) 3456-7890
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: '#94a3b8' }}>
                <Clock size={16} style={{ flexShrink: 0, marginTop: 2, color: '#2563eb' }} />
                <div>
                  Seg–Sex: 9h às 18h<br />
                  Sáb: 9h às 14h<br />
                  Dom: Fechado
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(168,130,77,0.2)',
          paddingTop: 24, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12, fontSize: 13, color: '#475569',
        }}>
          <span>© 2024 Móveis Ocidental. Todos os direitos reservados.</span>
          <Link
            to="/admin"
            style={{ color: '#475569', textDecoration: 'none', fontSize: 12 }}
          >
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}
