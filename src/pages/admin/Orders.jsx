import { useState } from 'react';
import { Plus, X, Search, ChevronDown, Check, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const statusColor = { vendido: '#22c55e', reservado: '#eab308', cancelado: '#ef4444' };
const statusLabel = { vendido: 'Vendido', reservado: 'Reservado', cancelado: 'Cancelado' };

function StatusBadge({ status }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: statusColor[status] + '18',
      color: statusColor[status], fontSize: 11, fontWeight: 700,
      padding: '4px 10px', borderRadius: 100,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[status] }} />
      {statusLabel[status]}
    </span>
  );
}

export default function Orders() {
  const { orders, products, addOrder, markOrderSold, cancelOrder } = useApp();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ client: '', phone: '', productId: '', quantity: 1, status: 'reservado', notes: '' });

  const filtered = orders.filter(o => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (search && !o.client.toLowerCase().includes(search.toLowerCase()) && !o.id.includes(search)) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  function handleNewOrder(e) {
    e.preventDefault();
    const prod = products.find(p => p.id === Number(newOrder.productId));
    if (!prod) return;
    addOrder({
      client: newOrder.client,
      phone: newOrder.phone,
      products: [{ productId: prod.id, name: prod.name, quantity: Number(newOrder.quantity), price: prod.price }],
      total: prod.price * Number(newOrder.quantity),
      status: newOrder.status,
      notes: newOrder.notes,
    });
    setNewOrderOpen(false);
    setNewOrder({ client: '', phone: '', productId: '', quantity: 1, status: 'reservado', notes: '' });
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '2px solid #dbeafe',
    borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: 'white',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: '#1e293b', marginBottom: 4 }}>Pedidos</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setNewOrderOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#2563eb', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Novo Pedido Manual
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#2563eb' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente ou nº do pedido..." style={{ ...inputStyle, paddingLeft: 36 }} />
        </div>
        <div style={{ position: 'relative' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', appearance: 'none', paddingRight: 32, minWidth: 160 }}>
            <option value="">Todos os status</option>
            <option value="reservado">Reservados</option>
            <option value="vendido">Vendidos</option>
            <option value="cancelado">Cancelados</option>
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#2563eb' }} />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
            <thead style={{ background: '#eff6ff' }}>
              <tr>
                {['Pedido', 'Cliente', 'Produto(s)', 'Valor', 'Status', 'Data', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr
                  key={o.id}
                  style={{ borderBottom: '1px solid #eff6ff', cursor: 'pointer', transition: 'background 0.15s' }}
                  onClick={() => setSelected(o)}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f6ff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 14px', fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{o.id}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{o.client}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{o.phone}</div>
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 13, color: '#1e3a5f', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.products[0]?.name}{o.products.length > 1 ? ` +${o.products.length - 1} item(ns)` : ''}
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{fmt(o.total)}</td>
                  <td style={{ padding: '14px 14px' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: '14px 14px', fontSize: 12, color: '#64748b' }}>
                    {new Date(o.date + 'T00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 500 }}>Ver →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>Nenhum pedido encontrado.</div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setSelected(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: '20px 20px 0 0', padding: 32,
              width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: '#1e293b', marginBottom: 4 }}>
                  {selected.id}
                </h3>
                <StatusBadge status={selected.status} />
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ background: '#f0f6ff', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Dados do cliente</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{selected.client}</div>
              <div style={{ fontSize: 13, color: '#1e3a5f' }}>{selected.phone}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Itens do pedido</div>
              {selected.products.map((item, i) => {
                const prod = products.find(p => p.id === item.productId);
                return (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: i < selected.products.length - 1 ? '1px solid #eff6ff' : 'none' }}>
                    {prod && <img src={prod.images[0]} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Qtd: {item.quantity} × {fmt(item.price)}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 4, borderTop: '2px solid #eff6ff' }}>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>Total</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: '#2563eb' }}>{fmt(selected.total)}</span>
              </div>
            </div>

            {selected.notes && (
              <div style={{ background: '#fef9c3', borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 13, color: '#713f12' }}>
                📝 {selected.notes}
              </div>
            )}

            {selected.status !== 'cancelado' && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {selected.status === 'reservado' && (
                  <button
                    onClick={() => { markOrderSold(selected.id); setSelected(o => ({ ...o, status: 'vendido' })); }}
                    style={{
                      flex: 1, padding: '12px', background: '#22c55e', border: 'none',
                      borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <Check size={16} /> Marcar como Vendido
                  </button>
                )}
                <button
                  onClick={() => { cancelOrder(selected.id); setSelected(o => ({ ...o, status: 'cancelado' })); }}
                  style={{
                    flex: 1, padding: '12px', background: '#fef2f2', border: '2px solid #fecaca',
                    borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                    color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <XCircle size={16} /> Cancelar Reserva
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New order modal */}
      {newOrderOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: '#1e293b' }}>Novo Pedido Manual</h3>
              <button onClick={() => setNewOrderOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleNewOrder} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#1e3a5f', display: 'block', marginBottom: 6 }}>Cliente *</label>
                <input required value={newOrder.client} onChange={e => setNewOrder(o => ({ ...o, client: e.target.value }))} placeholder="Nome do cliente" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#1e3a5f', display: 'block', marginBottom: 6 }}>Telefone</label>
                <input value={newOrder.phone} onChange={e => setNewOrder(o => ({ ...o, phone: e.target.value }))} placeholder="(11) 99999-9999" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#1e3a5f', display: 'block', marginBottom: 6 }}>Produto *</label>
                <select required value={newOrder.productId} onChange={e => setNewOrder(o => ({ ...o, productId: e.target.value }))} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Selecione um produto...</option>
                  {products.filter(p => p.availability !== 'indisponivel').map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1e3a5f', display: 'block', marginBottom: 6 }}>Quantidade</label>
                  <input type="number" min="1" value={newOrder.quantity} onChange={e => setNewOrder(o => ({ ...o, quantity: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#1e3a5f', display: 'block', marginBottom: 6 }}>Status</label>
                  <select value={newOrder.status} onChange={e => setNewOrder(o => ({ ...o, status: e.target.value }))} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido direto</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#1e3a5f', display: 'block', marginBottom: 6 }}>Observações</label>
                <textarea value={newOrder.notes} onChange={e => setNewOrder(o => ({ ...o, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Informações adicionais..." />
              </div>
              {newOrder.productId && newOrder.quantity && (
                <div style={{ background: '#f0f6ff', borderRadius: 10, padding: 12, fontSize: 14, color: '#1e293b' }}>
                  <strong>Total estimado:</strong> {fmt((products.find(p => p.id === Number(newOrder.productId))?.price || 0) * Number(newOrder.quantity))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setNewOrderOpen(false)} style={{
                  flex: 1, padding: '12px', border: '2px solid #dbeafe', borderRadius: 10,
                  background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1e3a5f',
                }}>
                  Cancelar
                </button>
                <button type="submit" style={{
                  flex: 1, padding: '12px', background: '#2563eb', border: 'none',
                  borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'white',
                }}>
                  Criar pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
