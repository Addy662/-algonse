import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

const ADMIN_EMAIL = 'your-email@gmail.com' // Replace with your email

function Admin() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const navigate                = useNavigate()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) { navigate('/dashboard'); return }
      loadUsers()
    }
    check()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const updatePlan = async (id, plan) => {
    await supabase.from('profiles').update({ plan }).eq('id', id)
    setUsers(u => u.map(x => x.id === id ? {...x, plan} : x))
  }

  const toggleBlock = async (id, blocked) => {
    await supabase.from('profiles').update({ is_blocked: !blocked }).eq('id', id)
    setUsers(u => u.map(x => x.id === id ? {...x, is_blocked: !blocked} : x))
  }

  const filtered = users
    .filter(u => filter === 'all' || u.plan === filter)
    .filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: users.length,
    free:  users.filter(u => u.plan === 'free').length,
    pro:   users.filter(u => u.plan === 'pro').length,
    elite: users.filter(u => u.plan === 'elite').length,
    blocked: users.filter(u => u.is_blocked).length,
  }

  const planColor = { free:'#888', pro:'#00b386', elite:'#185FA5' }
  const selStyle  = { padding:'6px 10px', borderRadius:'6px', border:'1px solid #e0e0e0', fontSize:'12px', background:'#fff', cursor:'pointer' }

  return (
    <div style={{ padding:'32px 5%', maxWidth:'1300px', margin:'0 auto' }}>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontSize:'24px', fontWeight:'700', color:'#1a1a1a' }}>Admin Dashboard</h1>
        <p style={{ fontSize:'14px', color:'#888', marginTop:'4px' }}>Manage all AlgoNSE users</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'12px', marginBottom:'24px' }}>
        {[
          { label:'Total Users',   value: stats.total,   color:'#1a1a1a' },
          { label:'Free',          value: stats.free,    color:'#888'    },
          { label:'Pro',           value: stats.pro,     color:'#00b386' },
          { label:'Elite',         value: stats.elite,   color:'#185FA5' },
          { label:'Blocked',       value: stats.blocked, color:'#e05252' },
        ].map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:'12px', padding:'16px 18px' }}>
            <div style={{ fontSize:'12px', color:'#888', marginBottom:'4px' }}>{s.label}</div>
            <div style={{ fontSize:'24px', fontWeight:'700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:'14px', overflow:'hidden' }}>
        <div style={{ display:'flex', gap:'12px', padding:'16px 20px', borderBottom:'1px solid #f0f0f0', alignItems:'center', flexWrap:'wrap' }}>
          <input
            placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex:1, minWidth:'200px', padding:'8px 12px', borderRadius:'8px', border:'1px solid #e0e0e0', fontSize:'13px', outline:'none' }}
          />
          <div style={{ display:'flex', gap:'6px' }}>
            {['all','free','pro','elite'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding:'6px 14px', borderRadius:'20px', fontSize:'12px',
                fontWeight:'500', cursor:'pointer', border:'1px solid',
                background: filter === f ? '#1a1a1a' : '#fff',
                color: filter === f ? '#fff' : '#888',
                borderColor: filter === f ? '#1a1a1a' : '#e0e0e0',
                textTransform:'capitalize'
              }}>{f}</button>
            ))}
          </div>
          <button onClick={loadUsers} style={{ padding:'7px 14px', borderRadius:'8px', background:'#00b386', color:'#fff', fontSize:'13px', fontWeight:'600', border:'none', cursor:'pointer' }}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding:'60px', textAlign:'center', color:'#888' }}>
            <div style={{ fontSize:'24px', marginBottom:'10px' }}>⏳</div>
            Loading users...
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#fafafa' }}>
                {['User','Email','Plan','Joined','Last Active','Backtests','Signals','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'11px 14px', fontSize:'11px', fontWeight:'600', color:'#888', textAlign:'left', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding:'40px', textAlign:'center', color:'#888' }}>No users found</td></tr>
              ) : filtered.map((user, i) => (
                <tr key={user.id} style={{ borderTop:'1px solid #f0f0f0', background: user.is_blocked ? '#fff8f8' : i%2===0?'#fff':'#fafafa' }}>
                  <td style={{ padding:'12px 14px', fontWeight:'600', fontSize:'13px' }}>{user.full_name || '—'}</td>
                  <td style={{ padding:'12px 14px', fontSize:'12px', color:'#555' }}>{user.email}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <select value={user.plan || 'free'} onChange={e => updatePlan(user.id, e.target.value)} style={{...selStyle, color: planColor[user.plan] || '#888', fontWeight:'600'}}>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="elite">Elite</option>
                    </select>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:'12px', color:'#888' }}>
                    {new Date(user.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:'12px', color:'#888' }}>
                    {user.last_active ? new Date(user.last_active).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:'13px', textAlign:'center' }}>{user.backtests_run || 0}</td>
                  <td style={{ padding:'12px 14px', fontSize:'13px', textAlign:'center' }}>{user.signals_viewed || 0}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{
                      background: user.is_blocked ? '#fef0f0' : '#e6faf5',
                      color: user.is_blocked ? '#e05252' : '#00b386',
                      fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'4px'
                    }}>{user.is_blocked ? 'BLOCKED' : 'ACTIVE'}</span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={() => toggleBlock(user.id, user.is_blocked)} style={{
                      padding:'5px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:'600',
                      border:'1px solid', cursor:'pointer',
                      background: user.is_blocked ? '#e6faf5' : '#fef0f0',
                      color: user.is_blocked ? '#00b386' : '#e05252',
                      borderColor: user.is_blocked ? '#00b386' : '#e05252',
                    }}>{user.is_blocked ? 'Unblock' : 'Block'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Admin