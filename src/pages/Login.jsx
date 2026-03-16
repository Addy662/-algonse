import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = () => {
    localStorage.setItem('algonse_user', JSON.stringify({ name: form.name || form.email, email: form.email }))
    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '14px',
    marginTop: '6px', marginBottom: '14px',
    outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f7f7f5'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '40px',
        width: '100%', maxWidth: '420px', border: '1px solid #f0f0f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#00b386', marginBottom: '6px' }}>AlgoNSE</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a' }}>{isSignup ? 'Create account' : 'Welcome back'}</div>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>{isSignup ? 'Start trading smarter today' : 'Sign in to your account'}</div>
        </div>

        {isSignup && (
          <>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>FULL NAME</label>
            <input style={inputStyle} placeholder="Aryan Gupta" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </>
        )}

        <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>EMAIL</label>
        <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

        <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>PASSWORD</label>
        <input style={inputStyle} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

        {isSignup && (
          <div style={{ background: '#f7fffe', border: '1px solid #e0faf5', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#555', marginBottom: '14px' }}>
            ✅ Free plan includes 5 stocks, basic signals, paper trading
          </div>
        )}

        <button onClick={handleSubmit} style={{
          width: '100%', padding: '13px', borderRadius: '10px',
          background: '#00b386', color: '#fff', fontSize: '15px',
          fontWeight: '600', border: 'none', cursor: 'pointer', marginBottom: '16px'
        }}>
          {isSignup ? 'Create Account' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#888' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setIsSignup(!isSignup)} style={{ color: '#00b386', cursor: 'pointer', fontWeight: '600' }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0', fontSize: '12px', color: '#aaa' }}>
          Not SEBI registered · For educational use only
        </div>
      </div>
    </div>
  )
}

export default Login