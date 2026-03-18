import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function Login() {
  const [mode, setMode]         = useState('login') // 'login' | 'signup' | 'forgot'
  const [form, setForm]         = useState({ name: '', email: '', password: '' })
  const [error, setError]       = useState(null)
  const [message, setMessage]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email:    form.email,
          password: form.password,
          options:  { data: { full_name: form.name } }
        })
        if (error) { setError(error.message); return }
        setMessage('Account created! Check your email to verify, then sign in.')

      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email, password: form.password
        })
        if (error) { setError(error.message); return }
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', data.user.id).single()
        if (profile?.is_blocked) {
          await supabase.auth.signOut()
          setError('Your account has been suspended. Contact support.')
          return
        }
        await supabase.from('profiles')
          .update({ last_active: new Date().toISOString() })
          .eq('id', data.user.id)
        navigate('/dashboard')

      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: 'http://localhost:5173/reset-password'
        })
        if (error) { setError(error.message); return }
        setMessage('Password reset email sent! Check your inbox.')
      }
    } catch(e) {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '14px',
    marginTop: '6px', marginBottom: '14px',
    outline: 'none', boxSizing: 'border-box', color: '#1a1a1a'
  }

  const titles = {
    login:  { title: 'Welcome back',       sub: 'Sign in to your account'    },
    signup: { title: 'Create account',     sub: 'Start trading smarter today' },
    forgot: { title: 'Forgot password?',   sub: 'We\'ll email you a reset link' },
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f5' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', border: '1px solid #f0f0f0' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#00b386', marginBottom: '6px' }}>AlgoNSE</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a' }}>{titles[mode].title}</div>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>{titles[mode].sub}</div>
        </div>

        {mode === 'signup' && (
          <>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>FULL NAME</label>
            <input style={inp} placeholder="Your name" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} />
          </>
        )}

        <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>EMAIL</label>
        <input style={inp} type="email" placeholder="you@example.com" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} />

        {mode !== 'forgot' && (
          <>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>PASSWORD</label>
            <input style={inp} type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </>
        )}

        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '14px' }}>
            <span onClick={() => { setMode('forgot'); setError(null); setMessage(null) }}
              style={{ fontSize: '13px', color: '#00b386', cursor: 'pointer', fontWeight: '500' }}>
              Forgot password?
            </span>
          </div>
        )}

        {error   && <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e05252', marginBottom: '14px' }}>⚠️ {error}</div>}
        {message && <div style={{ background: '#e6faf5', border: '1px solid #b2eada', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#00b386', marginBottom: '14px' }}>✅ {message}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '13px', borderRadius: '10px',
          background: loading ? '#ccc' : '#00b386', color: '#fff',
          fontSize: '15px', fontWeight: '600', border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px'
        }}>
          {loading ? 'Please wait...' :
           mode === 'login'  ? 'Sign In' :
           mode === 'signup' ? 'Create Account' :
           'Send Reset Email'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#888' }}>
          {mode === 'login' && (
            <>Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); setError(null); setMessage(null) }}
                style={{ color: '#00b386', cursor: 'pointer', fontWeight: '600' }}>Sign Up</span>
            </>
          )}
          {mode === 'signup' && (
            <>Already have an account?{' '}
              <span onClick={() => { setMode('login'); setError(null); setMessage(null) }}
                style={{ color: '#00b386', cursor: 'pointer', fontWeight: '600' }}>Sign In</span>
            </>
          )}
          {mode === 'forgot' && (
            <span onClick={() => { setMode('login'); setError(null); setMessage(null) }}
              style={{ color: '#00b386', cursor: 'pointer', fontWeight: '600' }}>← Back to Sign In</span>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0', fontSize: '12px', color: '#aaa' }}>
          Not SEBI registered · For educational use only
        </div>
      </div>
    </div>
  )
}

export default Login