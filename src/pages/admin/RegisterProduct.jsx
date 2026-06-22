import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, X, FileSpreadsheet, Check, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories, materials, colors } from '../../data/products';

const mockImportData = [
  { nome: 'Sofá 2 Lugares Bege', categoria: 'Sofás', custo: 'R$ 1.200,00', venda: 'R$ 2.100,00', qtd: 3 },
  { nome: 'Mesa de Centro Vidro', categoria: 'Mesas', custo: 'R$ 350,00', venda: 'R$ 680,00', qtd: 5 },
  { nome: 'Cadeira Gamer Ergonômica', categoria: 'Cadeiras', custo: 'R$ 500,00', venda: 'R$ 890,00', qtd: 8 },
];

const emptyForm = {
  name: '', category: '', description: '', costPrice: '', price: '',
  quantity: '', material: '', color: '', width: '', height: '', depth: '',
  availability: 'disponivel',
};

export default function RegisterProduct() {
  const { addProduct, products, updateProduct } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get('edit') ? Number(params.get('edit')) : null;
  const editing = editId ? products.find(p => p.id === editId) : null;

  const [mode, setMode] = useState('form');
  const [form, setForm] = useState(editing ? {
    name: editing.name, category: editing.category, description: editing.description,
    costPrice: editing.costPrice, price: editing.price, quantity: editing.quantity,
    material: editing.material, color: editing.color,
    width: editing.dimensions?.width || '', height: editing.dimensions?.height || '',
    depth: editing.dimensions?.depth || '', availability: editing.availability,
  } : emptyForm);
  const [previews, setPreviews] = useState(editing?.images || []);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleImageFiles(files) {
    Array.from(files).forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target.result]);
      reader.readAsDataURL(f);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      costPrice: Number(form.costPrice),
      price: Number(form.price),
      quantity: Number(form.quantity),
      dimensions: { width: Number(form.width), height: Number(form.height), depth: Number(form.depth) },
      images: previews.length ? previews : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
      specs: [
        { label: 'Largura', value: `${form.width} cm` },
        { label: 'Altura', value: `${form.height} cm` },
        { label: 'Profundidade', value: `${form.depth} cm` },
        { label: 'Material', value: form.material },
        { label: 'Cor', value: form.color },
      ],
      isNew: !editing,
      featured: false,
    };
    if (editing) {
      updateProduct(editId, data);
    } else {
      addProduct(data);
    }
    setSaved(true);
    setTimeout(() => navigate('/admin/estoque'), 1200);
  }

  const Field = ({ label, required, children }) => (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1e3a5f', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '2px solid #dbeafe',
    borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box',
    background: 'white', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#1e293b', marginBottom: 4 }}>
          {editing ? 'Editar Produto' : 'Cadastrar Produto'}
        </h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          {editing ? `Editando: ${editing.name}` : 'Adicionar novo produto ao catálogo'}
        </p>
      </div>

      {!editing && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#eff6ff', borderRadius: 12, padding: 4 }}>
          {[['form', '📝 Formulário'], ['import', '📊 Importar planilha']].map(([m, l]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: mode === m ? 'white' : 'transparent',
              color: mode === m ? '#2563eb' : '#64748b',
              boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {mode === 'form' ? (
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1e293b', marginBottom: 20 }}>
              Informações básicas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Nome do produto" required>
                  <input required value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="Ex: Sofá Retrátil Premium" />
                </Field>
              </div>
              <Field label="Categoria" required>
                <select required value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Selecione...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Disponibilidade">
                <select value={form.availability} onChange={e => set('availability', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="disponivel">Disponível</option>
                  <option value="ultimas_unidades">Últimas unidades</option>
                  <option value="sob_encomenda">Sob encomenda</option>
                  <option value="indisponivel">Indisponível</option>
                </select>
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Descrição">
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="Descreva o produto, materiais, diferenciais..."
                  />
                </Field>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1e293b', marginBottom: 20 }}>
              Preço e Estoque
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <Field label="Preço de custo (R$)" required>
                <input type="number" required min="0" step="0.01" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} style={inputStyle} placeholder="0,00" />
              </Field>
              <Field label="Preço de venda (R$)" required>
                <input type="number" required min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} style={inputStyle} placeholder="0,00" />
              </Field>
              <Field label="Quantidade inicial" required>
                <input type="number" required min="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} style={inputStyle} placeholder="0" />
              </Field>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1e293b', marginBottom: 20 }}>
              Especificações técnicas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <Field label="Material">
                <select value={form.material} onChange={e => set('material', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Selecione...</option>
                  {materials.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Cor">
                <select value={form.color} onChange={e => set('color', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Selecione...</option>
                  {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Largura (cm)">
                <input type="number" value={form.width} onChange={e => set('width', e.target.value)} style={inputStyle} placeholder="0" />
              </Field>
              <Field label="Altura (cm)">
                <input type="number" value={form.height} onChange={e => set('height', e.target.value)} style={inputStyle} placeholder="0" />
              </Field>
              <Field label="Profundidade (cm)">
                <input type="number" value={form.depth} onChange={e => set('depth', e.target.value)} style={inputStyle} placeholder="0" />
              </Field>
            </div>
          </div>

          {/* Photo upload */}
          <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#1e293b', marginBottom: 20 }}>
              Fotos do produto
            </h3>
            <div
              style={{
                border: `2px dashed ${dragOver ? '#2563eb' : '#dbeafe'}`,
                borderRadius: 12, padding: '32px 24px', textAlign: 'center',
                background: dragOver ? '#eff6ff' : '#f0f6ff',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16,
              }}
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files); }}
            >
              <ImageIcon size={36} color="#2563eb" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1e3a5f', marginBottom: 4 }}>
                Arraste as fotos aqui ou clique para selecionar
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>PNG, JPG ou WEBP • Múltiplas fotos</div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => handleImageFiles(e.target.files)} />
            </div>
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={src} alt="" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => setPreviews(prev => prev.filter((_, j) => j !== i))}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#ef4444', border: 'none', cursor: 'pointer',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <div style={{
                        position: 'absolute', bottom: 2, left: 2, right: 2,
                        background: 'rgba(168,130,77,0.9)', color: 'white',
                        fontSize: 9, textAlign: 'center', borderRadius: 4, padding: '1px 2px',
                      }}>
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/estoque')} style={{
              padding: '12px 24px', border: '2px solid #dbeafe', borderRadius: 10,
              background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1e3a5f',
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={saved} style={{
              padding: '12px 32px', background: saved ? '#22c55e' : '#2563eb', border: 'none',
              borderRadius: 10, cursor: saved ? 'default' : 'pointer', fontSize: 14, fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s',
            }}>
              {saved ? <><Check size={16} /> Salvo!</> : (editing ? 'Salvar alterações' : 'Cadastrar produto')}
            </button>
          </div>
        </form>
      ) : (
        /* Import mode */
        <div style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#1e293b', marginBottom: 8 }}>
            Importar via planilha ou nota fiscal
          </h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            Faça upload de um arquivo CSV, XLSX ou XML para importar múltiplos produtos de uma vez.
          </p>

          <div
            style={{
              border: '2px dashed #dbeafe', borderRadius: 12, padding: '48px 24px',
              textAlign: 'center', background: '#f0f6ff', cursor: 'pointer', marginBottom: 20,
            }}
            onClick={() => document.getElementById('csvInput').click()}
          >
            <FileSpreadsheet size={40} color="#2563eb" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1e3a5f', marginBottom: 4 }}>
              {importFile ? importFile.name : 'Arraste o arquivo ou clique para selecionar'}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Formatos suportados: CSV, XLSX, XML</div>
            <input
              id="csvInput" type="file" accept=".csv,.xlsx,.xml" style={{ display: 'none' }}
              onChange={e => { setImportFile(e.target.files[0]); setImportPreview(true); }}
            />
          </div>

          {importPreview && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e3a5f', marginBottom: 10 }}>
                  Prévia dos produtos a importar ({mockImportData.length} itens):
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                    <thead style={{ background: '#eff6ff' }}>
                      <tr>
                        {['Nome', 'Categoria', 'Custo', 'Venda', 'Qtd'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockImportData.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eff6ff' }}>
                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e293b' }}>{row.nome}</td>
                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e3a5f' }}>{row.categoria}</td>
                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#6b7280' }}>{row.custo}</td>
                          <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{row.venda}</td>
                          <td style={{ padding: '10px 12px', fontSize: 13, color: '#1e3a5f' }}>{row.qtd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => { setImportFile(null); setImportPreview(false); }} style={{
                  padding: '10px 20px', border: '2px solid #dbeafe', borderRadius: 10,
                  background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1e3a5f',
                }}>
                  Cancelar
                </button>
                <button onClick={() => { setSaved(true); setTimeout(() => navigate('/admin/estoque'), 1000); }} style={{
                  padding: '10px 24px', background: '#2563eb', border: 'none',
                  borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'white',
                }}>
                  Confirmar importação
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
