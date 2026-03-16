import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const loc = useLocation()
  const isActive = (path) => loc.pathname === path

  const linkStyle = (path) => ({
    fontSize: '14px', textDecoration: 'none', fontWeight: isActive(path) ? '600' : '500',
    color: isActive(path) ? '#00b386' : '#555'
  })

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 4%', height: '64px', borderBottom: '1px solid #f0f0f0',
      position: 'sticky', top: 0, background: '#fff', zIndex: 100
    }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: '700', color: '#00b386', textDecoration: 'none' }}>
        AlgoNSE
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/dashboard"  style={linkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/signals"    style={linkStyle('/signals')}>Signals</Link>
        <Link to="/charts"     style={linkStyle('/charts')}>Charts</Link>
        <Link to="/backtest"   style={linkStyle('/backtest')}>Backtest</Link>
        <Link to="/paper"      style={linkStyle('/paper')}>Paper Trading</Link>
        <Link to="/options"    style={linkStyle('/options')}>Options</Link>
        <Link to="/dashboard" style={{
          background: '#00b386', color: '#fff', padding: '8px 18px',
          borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none'
        }}>Get Started</Link>
      </div>
    </nav>
  )
}

export default Navbar