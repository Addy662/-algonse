import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function Login() {
  const [isSignup, setIsSignup]   = useState(false)
  const [form, setForm]           = useState({ name: '', email: '', password: '' })
  const [error, setError]         = useState(null)
  const [message, setMessage]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const navigate                  = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email:    form.email,
          password: form.password,
          options:  { data: { full_name: form.name } }
        })
        if (error) { setError(error.message); return }
        setMessage('Account created! Check your email to verify, then sign in.')
      } else {
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
        await supabase.from('profiles').update({ last_active: new Date().toISOString() }).eq('id', data.user.id)
        navigate('/dashboard')
      }
    } catch(e) {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const inp = {
    width:'100%', padding:'12px 14px', borderRadius:'10px',
    border:'1.5px solid #e0e0e0', fontSize:'14px',
    marginTop:'6px', marginBottom:'14px',
    outline:'none', boxSizing:'border-box', color:'#1a1a1a'
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7f5' }}>
      <div style={{ background:'#fff', borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'420px', border:'1px solid #f0f0f0' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontSize:'24px', fontWeight:'700', color:'#00b386', marginBottom:'6px' }}>AlgoNSE</div>
          <div style={{ fontSize:'22px', fontWeight:'700', color:'#1a1a1a' }}>{isSignup ? 'Create account' : 'Welcome back'}</div>
          <div style={{ fontSize:'14px', color:'#888', marginTop:'6px' }}>{isSignup ? 'Start trading smarter today' : 'Sign in to your account'}</div>
        </div>

        {isSignup && (
          <>
            <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>FULL NAME</label>
            <input style={inp} placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </>
        )}

        <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>EMAIL</label>
        <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />

        <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>PASSWORD</label>
        <input style={inp} type="password" placeholder="••••••••" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

        {error && <div style={{ background:'#fef0f0', border:'1px solid #f5c0c0', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'#e05252', marginBottom:'14px' }}>⚠️ {error}</div>}
        {message && <div style={{ background:'#e6faf5', border:'1px solid #b2eada', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'#00b386', marginBottom:'14px' }}>✅ {message}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width:'100%', padding:'13px', borderRadius:'10px',
          background: loading ? '#ccc' : '#00b386', color:'#fff',
          fontSize:'15px', fontWeight:'600', border:'none',
          cursor: loading ? 'not-allowed' : 'pointer', marginBottom:'16px'
        }}>
          {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
        </button>

        <div style={{ textAlign:'center', fontSize:'14px', color:'#888' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => { setIsSignup(!isSignup); setError(null); setMessage(null) }}
            style={{ color:'#00b386', cursor:'pointer', fontWeight:'600' }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </div>

        <div style={{ textAlign:'center', marginTop:'24px', paddingTop:'24px', borderTop:'1px solid #f0f0f0', fontSize:'12px', color:'#aaa' }}>
          Not SEBI registered · For educational use only
        </div>
      </div>
    </div>
  )
}

export default Login