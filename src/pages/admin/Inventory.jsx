import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { availabilityMap, categories } from '../../data/products';
import Badge from '../../components/ui/Badge';

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Inventory() {
  const { products, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && p.category !== catFilter) return false;
    if (statusFilter === 'em_estoque' && p.availability !== 'disponivel') return false;
    if (statusFilter === 'estoque_baixo' && !(p.quantity > 0 && p.quantity <= 3)) return false;
    if (statusFilter === 'esgotado' && p.quantity > 0) return false;
    return true;
  });

  function getStockStatus(p) {
    if (p.quantity === 0) return { label: 'Esgotado', color: 'red' };
    if (p.quantity <= 3) return { label: 'Estoque baixo', color: 'yellow' };
    return { label: 'Em estoque', color: 'green' };
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1e293b', marginBottom: 4 }}>Estoque</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{filtered.length} produto{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/admin/cadastrar"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#2563eb', color: 'white', textDecoration: 'none',
            padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          }}
        >
          <Plus size={16} /> Adicionar produto
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#2563eb' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            style={{
              width: '100%', padding: '10px 12px 10px 38px',
              border: '2px solid #dbeafe', borderRadius: 10, fontSize: 13,
              background: 'white', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{
            padding: '10px 32px 10px 12px', border: '2px solid #dbeafe',
            borderRadius: 10, fontSize: 13, background: 'white', outline: 'none',
            appearance: 'none', cursor: 'pointer',
          }}>
            <option value="">Todas as categorias</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#2563eb' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
            padding: '10px 32px 10px 12px', border: '2px solid #dbeafe',
            borderRadius: 10, fontSize: 13, background: 'white', outline: 'none',
            appearance: 'none', cursor: 'pointer',
          }}>
            <option value="">Todos os status</option>
            <option value="em_estoque">Em estoque</option>
            <option value="estoque_baixo">Estoque baixo</option>
            <option value="esgotado">Esgotado</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#2563eb' }} />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead style={{ background: '#eff6ff' }}>
              <tr>
                {['Produto', 'Categoria', 'Custo', 'Venda', 'Total', 'Reservado', 'Disponível', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 14px',
                    fontSize: 11, fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const stock = getStockStatus(p);
                const avail = p.quantity - (p.reserved || 0);
                const cat = categories.find(c => c.id === p.category);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eff6ff', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f6ff'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.images[0]} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.name}
                          </div>
                          {p.isNew && <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 700 }}>NOVO</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#1e3a5f' }}>{cat?.label}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#6b7280' }}>{fmt(p.costPrice)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{fmt(p.price)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{p.quantity}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#eab308', fontWeight: 600 }}>{p.reserved || 0}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: avail <= 0 ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                      {Math.max(0, avail)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <Badge label={stock.label} color={stock.color} />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link
                          to={`/admin/cadastrar?edit=${p.id}`}
                          style={{
                            width: 32, height: 32, borderRadius: 8, background: '#eff6ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#2563eb', textDecoration: 'none', transition: 'all 0.2s',
                          }}
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          style={{
                            width: 32, height: 32, borderRadius: 8, background: '#fef2f2',
                            border: 'none', cursor: 'pointer', color: '#ef4444',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#1e293b', marginBottom: 8 }}>Excluir produto?</h3>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
              <strong>{confirmDelete.name}</strong> será removido permanentemente.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmDelete(null)} style={{
                flex: 1, padding: '12px', border: '2px solid #dbeafe', borderRadius: 10,
                background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1e3a5f',
              }}>
                Cancelar
              </button>
              <button onClick={() => { deleteProduct(confirmDelete.id); setConfirmDelete(null); }} style={{
                flex: 1, padding: '12px', background: '#ef4444', border: 'none',
                borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white',
              }}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
