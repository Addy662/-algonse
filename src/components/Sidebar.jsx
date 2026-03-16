import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { path: '/dashboard',   icon: '▦',  label: 'Dashboard'     },
  { path: '/signals',     icon: '⚡',  label: 'Signals'       },
  { path: '/charts',      icon: '📈',  label: 'Charts'        },
  { path: '/backtest',    icon: '🔁',  label: 'Backtest'      },
  { path: '/paper',       icon: '📋',  label: 'Paper Trading' },
  { path: '/options',     icon: '⚙️',  label: 'Options Desk'  },
  { path: '/screener',    icon: '🔍',  label: 'Screener'      },
]

function Sidebar() {
  const loc      = useLocation()
  const navigate = useNavigate()
  const user     = JSON.parse(localStorage.getItem('algonse_user') || '{}')
  const isActive = (path) => loc.pathname === path

  const logout = () => {
    localStorage.removeItem('algonse_user')
    navigate('/login')
  }

  // Don't show sidebar on landing or login pages
  if (loc.pathname === '/' || loc.pathname === '/login') return null

  return (
    <div style={{
      width: '220px', minHeight: '100vh', background: '#fff',
      borderRight: '1px solid #f0f0f0', display: 'flex',
      flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Link to="/" style={{ fontSize: '20px', fontWeight: '700', color: '#00b386', textDecoration: 'none' }}>
          AlgoNSE
        </Link>
        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>NSE · BSE · F&O</div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Link to="/search" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#f7f7f5', borderRadius: '8px', padding: '8px 12px',
            fontSize: '13px', color: '#888', cursor: 'pointer'
          }}>
            <span>🔍</span><span>Search stocks...</span>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '2px',
              background: isActive(item.path) ? '#e6faf5' : 'transparent',
              color: isActive(item.path) ? '#00b386' : '#555',
              fontWeight: isActive(item.path) ? '600' : '400',
              fontSize: '14px', cursor: 'pointer',
              transition: 'background 0.15s'
            }}
              onMouseEnter={e => { if (!isActive(item.path)) e.currentTarget.style.background = '#f7f7f5' }}
              onMouseLeave={e => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#e6faf5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#00b386'
          }}>
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>{user.name || 'User'}</div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>Free Plan</div>
          </div>
        </div>
        <button onClick={logout} style={{
          width: '100%', padding: '8px', borderRadius: '8px',
          background: '#fff', border: '1px solid #e0e0e0',
          fontSize: '13px', color: '#888', cursor: 'pointer'
        }}>Sign Out</button>
      </div>
    </div>
  )
}

export default Sidebar