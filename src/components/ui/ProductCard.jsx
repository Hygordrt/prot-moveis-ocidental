import { Link } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';
import Badge from './Badge';
import { availabilityMap, categories } from '../../data/products';

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProductCard({ product }) {
  const avail = availabilityMap[product.availability] || availabilityMap.disponivel;
  const cat = categories.find(c => c.id === product.category);
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto: *${product.name}*\nPreço: ${fmt(product.price)}\n\nGostaria de mais informações.`
  );

  return (
    <div
      className="product-card"
      style={{
        background: 'white', borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image */}
      <Link
        to={`/produto/${product.id}`}
        style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: '16px 16px 0 0', overflow: 'hidden', flexShrink: 0 }}
      >
        <div style={{ aspectRatio: '4/3', background: '#eff6ff', overflow: 'hidden' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
            className="product-img"
          />
        </div>
        {product.isNew && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#2563eb', color: 'white',
            fontSize: 10, fontWeight: 700, letterSpacing: 1,
            padding: '3px 8px', borderRadius: 100, textTransform: 'uppercase',
          }}>
            Novo
          </div>
        )}
      </Link>

      {/* Body */}
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, display: 'block' }}>
          {cat?.label}
        </span>

        <Link to={`/produto/${product.id}`} style={{ textDecoration: 'none', marginBottom: 8 }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 14, fontWeight: 600, color: '#1e293b',
            lineHeight: 1.4, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ marginBottom: 10 }}>
          <Badge label={avail.label} color={avail.color} />
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
            {fmt(product.price)}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link
              to={`/produto/${product.id}`}
              title="Ver produto"
              style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#2563eb', textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              <Eye size={16} />
            </Link>
            <a
              href={`https://wa.me/5511999999999?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 36, height: 36, borderRadius: 8, background: '#25D366',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', textDecoration: 'none', flexShrink: 0,
              }}
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .product-card:hover .product-img { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
