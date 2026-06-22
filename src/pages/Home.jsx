import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, MapPin, Clock, Phone, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

const categoryImages = {
  sofas: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  mesas: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=600&q=80',
  camas: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
  armarios: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  cadeiras: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
  decoracao: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
};

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80',
    title: 'Transforme seu espaço',
    sub: 'Móveis artesanais com alma e qualidade atemporal',
  },
  {
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80',
    title: 'Conforto que você merece',
    sub: 'Sofás premium para momentos especiais em família',
  },
  {
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=80',
    title: 'Seu quarto dos sonhos',
    sub: 'Quartos planejados com elegância e funcionalidade',
  },
];

const testimonials = [
  { name: 'Maria S.', text: 'Qualidade impecável! O sofá chegou rápido e superou todas as expectativas.', stars: 5 },
  { name: 'João M.', text: 'Atendimento pelo WhatsApp foi incrível, muito atencioso e profissional.', stars: 5 },
  { name: 'Ana R.', text: 'A mesa de jantar ficou perfeita na sala. Todo mundo pergunta onde comprei!', stars: 5 },
];

export default function Home() {
  const { products } = useApp();
  const [heroIdx, setHeroIdx] = useState(0);
  const featured = products.filter(p => p.featured).slice(0, 6);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: '#f0f6ff' }}>
      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden' }}>
        {heroImages.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              opacity: i === heroIdx ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(20,14,10,0.75) 0%, rgba(20,14,10,0.3) 60%, transparent 100%)',
            }} />
          </div>
        ))}

        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          padding: '0 24px', maxWidth: 1280, margin: '0 auto', left: 0, right: 0,
        }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{
              display: 'inline-block', background: 'rgba(37,99,235,0.9)',
              color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase', padding: '6px 16px', borderRadius: 100, marginBottom: 20,
            }}>
              15 anos de qualidade
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(36px, 5vw, 68px)',
              color: 'white', lineHeight: 1.1, marginBottom: 20,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}>
              {heroImages[heroIdx].title}
            </h1>
            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.85)',
              marginBottom: 36, lineHeight: 1.6,
            }}>
              {heroImages[heroIdx].sub}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                to="/catalogo"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#2563eb', color: 'white',
                  padding: '14px 28px', borderRadius: 100,
                  textDecoration: 'none', fontSize: 15, fontWeight: 600,
                  transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(168,130,77,0.4)',
                }}
              >
                Ver Catálogo <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.15)', color: 'white',
                  padding: '14px 28px', borderRadius: 100,
                  textDecoration: 'none', fontSize: 15, fontWeight: 600,
                  backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <MessageCircle size={18} />
                Fale conosco
              </a>
            </div>
          </div>
        </div>

        {/* Hero Nav */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              style={{
                width: i === heroIdx ? 24 : 8, height: 8,
                borderRadius: 4, background: i === heroIdx ? '#2563eb' : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setHeroIdx(i => (i - 1 + heroImages.length) % heroImages.length)}
          style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
            width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setHeroIdx(i => (i + 1) % heroImages.length)}
          style={{
            position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
            width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ padding: 'clamp(48px,8vw,96px) 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
              Nossa história
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#1e293b', margin: '12px 0 20px', lineHeight: 1.2 }}>
              Artesanato e paixão por móveis desde 2008
            </h2>
            <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.8, marginBottom: 16 }}>
              Nascemos de uma paixão pela marcenaria artesanal e pelo design funcional. Cada peça que sai do nosso showroom carrega horas de trabalho cuidadoso, materiais selecionados e o olhar de quem entende de móveis de verdade.
            </p>
            <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.8, marginBottom: 28 }}>
              Atendemos mais de 3.000 famílias em São Paulo, transformando casas em lares com móveis que duram gerações. Nossa equipe especializada auxilia na escolha do móvel ideal para cada ambiente.
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              {[['15+', 'Anos de experiência'], ['3.000+', 'Clientes satisfeitos'], ['500+', 'Produtos em catálogo']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#2563eb' }}>{n}</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80" alt="Showroom" style={{ borderRadius: 16, width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80" alt="Móveis" style={{ borderRadius: 16, width: '100%', aspectRatio: '1', objectFit: 'cover', marginTop: 20 }} />
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={{ background: '#eff6ff', padding: 'clamp(48px,8vw,80px) 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
              Explore nosso acervo
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#1e293b', margin: '10px 0 0' }}>
              Categorias em destaque
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    borderRadius: 16, overflow: 'hidden', position: 'relative',
                    aspectRatio: '3/4', cursor: 'pointer', transition: 'transform 0.3s',
                  }}
                  className="cat-card"
                >
                  <img
                    src={categoryImages[cat.id]}
                    alt={cat.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    className="cat-img"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(20,14,10,0.8) 0%, transparent 50%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 16, left: 16, right: 16,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: 16, fontWeight: 600 }}>
                      {cat.label}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          .cat-card:hover { transform: translateY(-4px); }
          .cat-card:hover .cat-img { transform: scale(1.08); }
        `}</style>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
              Mais pedidos
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#1e293b', margin: '10px 0 0' }}>
              Produtos em destaque
            </h2>
          </div>
          <Link
            to="/catalogo"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#2563eb', textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ background: '#1e293b', padding: 'clamp(48px,8vw,80px) 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
              O que dizem nossos clientes
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#eff6ff', margin: '10px 0 0' }}>
              Depoimentos
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 28,
                border: '1px solid rgba(168,130,77,0.2)',
              }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} size={16} fill="#2563eb" color="#2563eb" />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: '#93c5fd', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ fontSize: 14, color: '#2563eb', fontWeight: 600 }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" style={{ padding: 'clamp(48px,8vw,80px) 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
          <div>
            <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
              Onde nos encontrar
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#1e293b', margin: '10px 0 24px' }}>
              Visite nossa loja
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={18} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>Endereço</div>
                  <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                    Av. das Flores, 1234 — Jardim Europa<br />São Paulo/SP — CEP: 01310-100
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={18} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>Horário de Funcionamento</div>
                  <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.8 }}>
                    Segunda a Sexta: 9h às 18h<br />
                    Sábado: 9h às 14h<br />
                    Domingo: Fechado
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={18} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>Telefone</div>
                  <div style={{ fontSize: 14, color: '#334155' }}>(11) 3456-7890</div>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre os móveis."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 28,
                background: '#25D366', color: 'white',
                padding: '14px 28px', borderRadius: 100,
                textDecoration: 'none', fontSize: 15, fontWeight: 600,
                boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'all 0.2s',
              }}
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', minHeight: 320, background: '#dbeafe' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6500!3d-23.5500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAwLjAiUyA0NsKwMzknMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da loja"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
