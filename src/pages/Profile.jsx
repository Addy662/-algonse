import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [message, setMessage]   = useState(null)
  const [pwForm, setPwForm]     = useState({ current: '', newPw: '', confirm: '' })
  const [pwError, setPwError]   = useState(null)
  const navigate                = useNavigate()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  const saveName = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ full_name: profile.full_name }).eq('id', profile.id)
    setMessage('Name updated!')
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const changePassword = async () => {
    setPwError(null)
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match'); return }
    if (pwForm.newPw.length < 6) { setPwError('Password must be at least 6 characters'); return }
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw })
    if (error) { setPwError(error.message); return }
    setPwForm({ current: '', newPw: '', confirm: '' })
    setMessage('Password changed successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const planColor = { free: '#888', pro: '#00b386', elite: '#185FA5' }
  const inp = {
    width:'100%', padding:'10px 14px', borderRadius:'8px',
    border:'1px solid #e0e0e0', fontSize:'14px', marginTop:'5px',
    marginBottom:'12px', boxSizing:'border-box', outline:'none'
  }

  if (loading) return <div style={{ padding:'60px', textAlign:'center', color:'#888' }}>Loading...</div>

  return (
    <div style={{ padding:'32px 5%', maxWidth:'800px', margin:'0 auto' }}>
      <h1 style={{ fontSize:'24px', fontWeight:'700', color:'#1a1a1a', marginBottom:'6px' }}>My Profile</h1>
      <p style={{ fontSize:'14px', color:'#888', marginBottom:'28px' }}>Manage your account details</p>

      {message && <div style={{ background:'#e6faf5', border:'1px solid #b2eada', borderRadius:'8px', padding:'12px 16px', fontSize:'13px', color:'#00b386', marginBottom:'20px' }}>✅ {message}</div>}

      {/* Plan card */}
      <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:'14px', padding:'24px', marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'13px', color:'#888', marginBottom:'4px' }}>Current Plan</div>
            <div style={{ fontSize:'22px', fontWeight:'700', color: planColor[profile?.plan] || '#888', textTransform:'capitalize' }}>
              {profile?.plan || 'Free'}
            </div>
            <div style={{ fontSize:'13px', color:'#888', marginTop:'4px' }}>
              Member since {new Date(profile?.created_at).toLocaleDateString('en-IN', { month:'long', year:'numeric' })}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'12px', color:'#888', marginBottom:'8px' }}>Usage this month</div>
            <div style={{ fontSize:'13px', color:'#555' }}>Backtests: <strong>{profile?.backtests_run || 0}</strong></div>
            <div style={{ fontSize:'13px', color:'#555' }}>Signals viewed: <strong>{profile?.signals_viewed || 0}</strong></div>
          </div>
        </div>
        {profile?.plan === 'free' && (
          <div style={{ marginTop:'16px', padding:'12px 16px', background:'#f7fffe', border:'1px solid #e0faf5', borderRadius:'8px', fontSize:'13px', color:'#555' }}>
            Upgrade to <strong style={{ color:'#00b386' }}>Pro ₹499/month</strong> for unlimited signals, all strategies, F&O signals and WhatsApp alerts.
          </div>
        )}
      </div>

      {/* Personal info */}
      <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:'14px', padding:'24px', marginBottom:'20px' }}>
        <h2 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'18px' }}>Personal Information</h2>
        <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>FULL NAME</label>
        <input style={inp} value={profile?.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} />
        <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>EMAIL</label>
        <input style={{...inp, background:'#fafafa', color:'#888'}} value={profile?.email || ''} disabled />
        <button onClick={saveName} disabled={saving} style={{
          padding:'10px 20px', borderRadius:'8px', background:'#00b386', color:'#fff',
          fontSize:'14px', fontWeight:'600', border:'none', cursor:'pointer'
        }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Change password */}
      <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:'14px', padding:'24px' }}>
        <h2 style={{ fontSize:'15px', fontWeight:'600', marginBottom:'18px' }}>Change Password</h2>
        {pwError && <div style={{ background:'#fef0f0', border:'1px solid #f5c0c0', borderRadius:'8px', padding:'10px', fontSize:'13px', color:'#e05252', marginBottom:'12px' }}>⚠️ {pwError}</div>}
        <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>NEW PASSWORD</label>
        <input style={inp} type="password" placeholder="Min 6 characters" value={pwForm.newPw} onChange={e => setPwForm({...pwForm, newPw: e.target.value})} />
        <label style={{ fontSize:'12px', fontWeight:'600', color:'#555' }}>CONFIRM PASSWORD</label>
        <input style={inp} type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} />
        <button onClick={changePassword} style={{
          padding:'10px 20px', borderRadius:'8px', background:'#1a1a1a', color:'#fff',
          fontSize:'14px', fontWeight:'600', border:'none', cursor:'pointer'
        }}>Change Password</button>
      </div>
    </div>
  )
}

export default Profile