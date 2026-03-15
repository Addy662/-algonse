import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

function Navbar() {
  const loc = useLocation()
  const active = { color: '#00b386', fontWeight: '600' }
  const normal = { color: '#555', fontWeight: '500' }

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 5%', height: '64px', borderBottom: '1px solid #f0f0f0',
      position: 'sticky', top: 0, background: '#fff', zIndex: 100
    }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: '700', color: '#00b386', textDecoration: 'none' }}>
        AlgoNSE
      </Link>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/dashboard"  style={{ fontSize: '14px', textDecoration: 'none', ...(loc.pathname === '/dashboard'  ? active : normal) }}>Dashboard</Link>
        <Link to="/signals"    style={{ fontSize: '14px', textDecoration: 'none', ...(loc.pathname === '/signals'    ? active : normal) }}>Signals</Link>
        <Link to="/backtest"   style={{ fontSize: '14px', textDecoration: 'none', ...(loc.pathname === '/backtest'   ? active : normal) }}>Backtest</Link>
        <Link to="/paper"      style={{ fontSize: '14px', textDecoration: 'none', ...(loc.pathname === '/paper'      ? active : normal) }}>Paper Trading</Link>
        <Link to="/#pricing"   style={{ fontSize: '14px', textDecoration: 'none', ...(loc.pathname === '/pricing'    ? active : normal) }}>Pricing</Link>
        <Link to="/dashboard" style={{
          background: '#00b386', color: '#fff', padding: '8px 20px',
          borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none'
        }}>Get Started</Link>
      </div>
    </nav>
  )
}

export default Navbar
