import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminLogin() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const ok = adminLogin(user, pass);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Usuário ou senha incorretos. Tente admin / 1234');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e293b 0%, #1e3a5f 100%)',
      padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'white', borderRadius: 24, padding: 40,
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ color: 'white', fontSize: 28, fontFamily: 'serif' }}>M</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#1e293b', margin: '0 0 6px' }}>
            Área Administrativa
          </h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Móveis Ocidental — Painel Admin</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1e3a5f', marginBottom: 6 }}>
              Usuário
            </label>
            <input
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="admin"
              style={{
                width: '100%', padding: '12px 14px', border: '2px solid #dbeafe',
                borderRadius: 10, fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#dbeafe'}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1e3a5f', marginBottom: 6 }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••"
                style={{
                  width: '100%', padding: '12px 44px 12px 14px', border: '2px solid #dbeafe',
                  borderRadius: 10, fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#dbeafe'}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px', fontSize: 13,
              color: '#dc2626', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: loading ? '#60a5fa' : '#2563eb',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Entrando...' : <><LogIn size={18} /> Entrar</>}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
          Demo: usuário <strong>admin</strong> / senha <strong>1234</strong>
        </div>
      </div>
    </div>
  );
}
