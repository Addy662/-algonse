import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function ResetPassword() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState(null)
  const [message, setMessage]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [validSession, setValid]  = useState(false)
  const navigate                  = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setValid(true)
    })
  }, [])

  const handleReset = async () => {
    setError(null)
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setMessage('Password updated! Redirecting to login...')
    setTimeout(() => navigate('/login'), 2000)
    setLoading(false)
  }

  const inp = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '14px',
    marginTop: '6px', marginBottom: '14px',
    outline: 'none', boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f5' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', border: '1px solid #f0f0f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#00b386', marginBottom: '6px' }}>AlgoNSE</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a' }}>Set new password</div>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>Choose a strong password</div>
        </div>

        {!validSession ? (
          <div style={{ textAlign: 'center', color: '#e05252', fontSize: '14px' }}>
            ⚠️ Invalid or expired reset link. Please request a new one.
            <div style={{ marginTop: '16px' }}>
              <span onClick={() => navigate('/login')} style={{ color: '#00b386', cursor: 'pointer', fontWeight: '600' }}>← Back to Login</span>
            </div>
          </div>
        ) : (
          <>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>NEW PASSWORD</label>
            <input style={inp} type="password" placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} />

            <label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>CONFIRM PASSWORD</label>
            <input style={inp} type="password" placeholder="Repeat password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset()} />

            {error   && <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#e05252', marginBottom: '14px' }}>⚠️ {error}</div>}
            {message && <div style={{ background: '#e6faf5', border: '1px solid #b2eada', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#00b386', marginBottom: '14px' }}>✅ {message}</div>}

            <button onClick={handleReset} disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              background: loading ? '#ccc' : '#00b386', color: '#fff',
              fontSize: '15px', fontWeight: '600', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword