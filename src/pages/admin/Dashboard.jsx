import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';
import { Package, DollarSign, TrendingUp, Clock, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { salesByMonth } from '../../data/orders';
import { availabilityMap } from '../../data/products';

const fmt = v => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, padding: 24,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { products, orders } = useApp();

  const totalItems = products.reduce((s, p) => s + p.quantity, 0);
  const totalSold = orders.filter(o => o.status === 'vendido').reduce((s, o) => s + o.total, 0);
  const totalCost = orders.filter(o => o.status === 'vendido').reduce((s, o) => {
    return s + o.products.reduce((ps, item) => {
      const prod = products.find(p => p.id === item.productId);
      return ps + (prod?.costPrice || 0) * item.quantity;
    }, 0);
  }, 0);
  const totalProfit = totalSold - totalCost;
  const reserved = orders.filter(o => o.status === 'reservado').length;

  const topProducts = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const statusColor = { vendido: '#22c55e', reservado: '#eab308', cancelado: '#ef4444' };
  const statusLabel = { vendido: 'Vendido', reservado: 'Reservado', cancelado: 'Cancelado' };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1e293b', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Visão geral do seu negócio</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <MetricCard icon={Package} label="Total em estoque" value={totalItems} sub="unidades disponíveis" color="#2563eb" />
        <MetricCard icon={DollarSign} label="Faturamento total" value={fmt(totalSold)} sub="pedidos vendidos" color="#22c55e" />
        <MetricCard icon={ShoppingBag} label="Custo total" value={fmt(totalCost)} sub="valor pago" color="#6b7280" />
        <MetricCard icon={TrendingUp} label="Lucro total" value={fmt(totalProfit)} sub="margem bruta" color="#3b82f6" />
        <MetricCard icon={Clock} label="Reservas abertas" value={reserved} sub="aguardando confirmação" color="#eab308" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Sales chart */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#1e293b', marginBottom: 20 }}>
            Vendas × Custo por Mês
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesByMonth} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eff6ff" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Bar dataKey="sales" name="Vendas" fill="#2563eb" radius={[4,4,0,0]} />
              <Bar dataKey="cost" name="Custo" fill="#dbeafe" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#1e293b', marginBottom: 20 }}>
            Produtos Mais Vendidos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: i === 0 ? '#2563eb' : '#eff6ff',
                  color: i === 0 ? 'white' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <img src={p.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.soldCount} vendidos</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
                  {fmt(p.price)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#1e293b', marginBottom: 20 }}>
          Últimas Movimentações
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eff6ff' }}>
                {['Pedido', 'Cliente', 'Produto', 'Valor', 'Status', 'Data'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #eff6ff' }}>
                  <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 600, color: '#2563eb' }}>{o.id}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: '#1e293b' }}>{o.client}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: '#1e3a5f', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.products[0]?.name}{o.products.length > 1 ? ` +${o.products.length - 1}` : ''}
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{fmt(o.total)}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: statusColor[o.status] + '15',
                      color: statusColor[o.status], fontSize: 11, fontWeight: 600,
                      padding: '3px 8px', borderRadius: 100,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor[o.status] }} />
                      {statusLabel[o.status]}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: '#64748b' }}>
                    {new Date(o.date + 'T00:00').toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
