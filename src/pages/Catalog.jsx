import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories, materials, colors } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

const sortOptions = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'popular', label: 'Mais vendidos' },
];

export default function Catalog() {
  const { products } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState('recent');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  function toggleArr(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  const filtered = useMemo(() => {
    let res = products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedMaterials.length && !selectedMaterials.includes(p.material)) return false;
      if (selectedColors.length && !selectedColors.includes(p.color)) return false;
      if (p.price < minPrice || (maxPrice > 0 && p.price > maxPrice)) return false;
      if (onlyAvailable && p.availability !== 'disponivel') return false;
      return true;
    });
    if (sort === 'price_asc') res.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') res.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') res.sort((a, b) => b.soldCount - a.soldCount);
    else res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res;
  }, [products, search, selectedCategories, selectedMaterials, selectedColors, minPrice, maxPrice, onlyAvailable, sort]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const activeFilters = [
    ...selectedCategories.map(c => ({ key: 'cat_' + c, label: categories.find(x => x.id === c)?.label, clear: () => toggleArr(selectedCategories, setSelectedCategories, c) })),
    ...selectedMaterials.map(m => ({ key: 'mat_' + m, label: m, clear: () => toggleArr(selectedMaterials, setSelectedMaterials, m) })),
    ...selectedColors.map(c => ({ key: 'col_' + c, label: c, clear: () => toggleArr(selectedColors, setSelectedColors, c) })),
    onlyAvailable ? { key: 'avail', label: 'Só disponíveis', clear: () => setOnlyAvailable(false) } : null,
  ].filter(Boolean);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setOnlyAvailable(false);
    setSearch('');
  };

  const inputBase = {
    width: '100%', padding: '7px 8px', border: '1.5px solid #dbeafe',
    borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box',
    background: 'white', color: '#1e293b',
  };

  const FilterPanel = () => (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Categoria</div>
        {categories.map(cat => (
          <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={selectedCategories.includes(cat.id)}
              onChange={() => toggleArr(selectedCategories, setSelectedCategories, cat.id)}
              style={{ accentColor: '#2563eb', width: 15, height: 15, cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#334155' }}>{cat.icon} {cat.label}</span>
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Faixa de Preço</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Mín (R$)</div>
            <input type="number" value={minPrice} min={0}
              onChange={e => setMinPrice(Math.max(0, Number(e.target.value)))}
              style={inputBase} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Máx (R$)</div>
            <input type="number" value={maxPrice} min={minPrice}
              onChange={e => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
              style={inputBase} />
          </div>
        </div>
        <input type="range" min={0} max={10000} step={100} value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 4 }}>
          <span>R$ {minPrice.toLocaleString('pt-BR')}</span>
          <span>R$ {maxPrice.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Material</div>
        {materials.map(m => (
          <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={selectedMaterials.includes(m)}
              onChange={() => toggleArr(selectedMaterials, setSelectedMaterials, m)}
              style={{ accentColor: '#2563eb', width: 15, height: 15, cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#334155' }}>{m}</span>
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Cor</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {colors.map(c => (
            <button key={c} onClick={() => toggleArr(selectedColors, setSelectedColors, c)}
              style={{
                padding: '3px 10px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
                border: selectedColors.includes(c) ? '2px solid #2563eb' : '2px solid #dbeafe',
                background: selectedColors.includes(c) ? '#eff6ff' : 'white',
                color: selectedColors.includes(c) ? '#2563eb' : '#334155',
                fontWeight: selectedColors.includes(c) ? 600 : 400, transition: 'all 0.2s',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 11, color: '#1e293b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Disponibilidade</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setOnlyAvailable(v => !v)}>
          <div style={{
            width: 38, height: 21, borderRadius: 11,
            background: onlyAvailable ? '#2563eb' : '#dbeafe',
            position: 'relative', transition: 'all 0.2s', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: 2.5, left: onlyAvailable ? 19 : 2.5,
              width: 16, height: 16, borderRadius: '50%', background: 'white',
              transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </div>
          <span style={{ fontSize: 13, color: '#334155', userSelect: 'none' }}>Somente disponíveis</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: '#f0f6ff' }}>
      <div style={{ background: '#1e293b', padding: '36px 24px' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto'}}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'white', fontSize: 'clamp(26px,4vw,40px)', marginBottom: 6 }}>
            Catálogo de Móveis
          </h1>
          <p style={{ color: '#93c5fd', fontSize: 14 }}>
            {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 8px 48px' }}>
        {/* Search + sort bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#2563eb' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome..."
              style={{
                width: '100%', padding: '10px 12px 10px 38px',
                border: '2px solid #dbeafe', borderRadius: 10, fontSize: 14,
                background: 'white', outline: 'none', boxSizing: 'border-box', color: '#1e293b',
              }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{
                padding: '10px 32px 10px 12px', border: '2px solid #dbeafe',
                borderRadius: 10, fontSize: 14, background: 'white',
                outline: 'none', appearance: 'none', cursor: 'pointer', minWidth: 148, color: '#1e293b',
              }}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#2563eb' }} />
          </div>
          <button onClick={() => setFilterOpen(v => !v)} className="filter-toggle-btn"
            style={{
              display: 'none', alignItems: 'center', gap: 8, padding: '10px 16px',
              border: '2px solid #dbeafe', borderRadius: 10, background: 'white',
              fontSize: 14, cursor: 'pointer', color: '#1e3a5f', fontWeight: 500,
            }}>
            <SlidersHorizontal size={16} />
            Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>Ativos:</span>
            {activeFilters.map(f => (
              <button key={f.key} onClick={f.clear}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: '#eff6ff', border: '1px solid #93c5fd',
                  borderRadius: 100, padding: '3px 10px', fontSize: 12,
                  color: '#1e3a5f', cursor: 'pointer', fontWeight: 500,
                }}>
                {f.label} <X size={11} />
              </button>
            ))}
            <button onClick={clearAll} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Limpar tudo
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <div className="filter-sidebar" style={{
            width: 210, flexShrink: 0, background: 'white',
            borderRadius: 14, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            position: 'sticky', top: 88, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1e293b', fontSize: 15 }}>Filtros</span>
              {activeFilters.length > 0 && (
                <button onClick={clearAll} style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Limpar
                </button>
              )}
            </div>
            <FilterPanel />
          </div>

          {/* Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#1e293b', marginBottom: 8 }}>Nenhum produto encontrado</h3>
                <p style={{ color: '#64748b', fontSize: 15 }}>Tente ajustar os filtros ou o termo de busca.</p>
                <button onClick={clearAll} style={{
                  marginTop: 20, padding: '10px 24px', background: '#2563eb',
                  color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                }}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {paginated.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button onClick={() => setPage(p => p + 1)}
                      style={{
                        padding: '11px 36px', background: 'white',
                        border: '2px solid #2563eb', borderRadius: 10,
                        color: '#2563eb', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      }}>
                      Carregar mais ({filtered.length - paginated.length} restantes)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)' }} onClick={() => setFilterOpen(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: 'white', borderRadius: '20px 20px 0 0',
              padding: 24, maxHeight: '85vh', overflowY: 'auto',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: '#1e293b' }}>Filtros</span>
              <button onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155' }}>
                <X size={24} />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setFilterOpen(false)}
              style={{
                width: '100%', marginTop: 20, padding: '14px',
                background: '#2563eb', color: 'white', border: 'none',
                borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>
              Ver {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .filter-sidebar { display: none !important; }
          .filter-toggle-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
