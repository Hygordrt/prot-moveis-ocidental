import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MessageCircle, Copy, Check, ChevronLeft, ChevronRight,
  ZoomIn, X, ArrowLeft, Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { availabilityMap, categories } from '../data/products';
import Badge from '../components/ui/Badge';
import ProductCard from '../components/ui/ProductCard';

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Product() {
  const { id } = useParams();
  const { products } = useApp();
  const product = products.find(p => p.id === Number(id));
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px' }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <h2 style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', margin: '16px 0 8px' }}>Produto não encontrado</h2>
        <Link to="/catalogo" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>← Voltar ao catálogo</Link>
      </div>
    );
  }

  const avail = availabilityMap[product.availability];
  const cat = categories.find(c => c.id === product.category);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto:\n\n*${product.name}*\nPreço: ${fmt(product.price)}\n\nGostaria de fazer um pedido.`
  );

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function prevImg() { setImgIdx(i => (i - 1 + product.images.length) % product.images.length); }
  function nextImg() { setImgIdx(i => (i + 1) % product.images.length); }

  return (
    <div style={{ paddingTop: 72, background: '#f0f6ff', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background: '#eff6ff', padding: '12px 24px', borderBottom: '1px solid #dbeafe' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b' }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Início</Link>
          <span>/</span>
          <Link to="/catalogo" style={{ color: '#2563eb', textDecoration: 'none' }}>Catálogo</Link>
          <span>/</span>
          <Link to={`/catalogo?categoria=${product.category}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{cat?.label}</Link>
          <span>/</span>
          <span style={{ color: '#1e3a5f', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <Link to="/catalogo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#2563eb', textDecoration: 'none', fontSize: 14, fontWeight: 500,
          marginBottom: 24,
        }}>
          <ArrowLeft size={16} /> Voltar ao catálogo
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, marginBottom: 64 }}>
          {/* Gallery */}
          <div>
            <div style={{
              position: 'relative', borderRadius: 20, overflow: 'hidden',
              aspectRatio: '4/3', background: '#eff6ff', marginBottom: 12, cursor: 'zoom-in',
            }}
              onClick={() => setLightbox(true)}
            >
              <img
                src={product.images[imgIdx]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                background: 'rgba(0,0,0,0.4)', borderRadius: 8,
                padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
                color: 'white', fontSize: 12,
              }}>
                <ZoomIn size={14} /> Ampliar
              </div>
              {product.images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); prevImg(); }} style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ChevronLeft size={18} color="#1e3a5f" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); nextImg(); }} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <ChevronRight size={18} color="#1e3a5f" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setImgIdx(i)}
                    style={{
                      width: 72, height: 72, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                      border: i === imgIdx ? '2px solid #2563eb' : '2px solid transparent',
                      opacity: i === imgIdx ? 1 : 0.6, transition: 'all 0.2s', flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                {cat?.label}
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(24px, 3vw, 36px)', color: '#1e293b',
              lineHeight: 1.2, marginBottom: 16,
            }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: 20 }}>
              <Badge label={avail.label} color={avail.color} size="lg" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#1e293b', fontFamily: "'Inter', sans-serif" }}>
                {fmt(product.price)}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                Consulte condições de pagamento no WhatsApp
              </div>
            </div>

            <p style={{ fontSize: 15, color: '#1e3a5f', lineHeight: 1.8, marginBottom: 28 }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/5511999999999?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: 200,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: '#25D366', color: 'white',
                  padding: '16px 24px', borderRadius: 12,
                  textDecoration: 'none', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'all 0.2s',
                }}
              >
                <MessageCircle size={20} />
                Fazer Pedido pelo WhatsApp
              </a>
              <button
                onClick={copyLink}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '16px 20px', borderRadius: 12,
                  border: '2px solid #dbeafe', background: 'white',
                  color: '#1e3a5f', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} />}
                {copied ? 'Copiado!' : 'Copiar link'}
              </button>
            </div>

            {/* Specs */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#1e293b', marginBottom: 16 }}>
                Especificações Técnicas
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={i} style={{ borderBottom: i < product.specs.length - 1 ? '1px solid #eff6ff' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 13, color: '#64748b', fontWeight: 500, width: '45%' }}>{s.label}</td>
                      <td style={{ padding: '10px 0', fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>
                Mesma categoria
              </span>
              <h2 style={{ fontSize: 28, color: '#1e293b', margin: '8px 0 0' }}>
                Produtos relacionados
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.1)', border: 'none',
              borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white',
            }}
          >
            <X size={22} />
          </button>
          <img
            src={product.images[imgIdx]}
            alt={product.name}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
            onClick={e => e.stopPropagation()}
          />
          {product.images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prevImg(); }} style={{
                position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: 48, height: 48, cursor: 'pointer', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={e => { e.stopPropagation(); nextImg(); }} style={{
                position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
                width: 48, height: 48, cursor: 'pointer', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
