import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 5%',
      height: '64px',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      background: '#fff',
      zIndex: 100
    }}>
      <Link to="/" style={{ fontSize: '20px', fontWeight: '700', color: '#00b386', textDecoration: 'none' }}>
        AlgoNSE
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link to="/#features" style={{ fontSize: '14px', color: '#555', fontWeight: '500', textDecoration: 'none' }}>Features</Link>
        <Link to="/#pricing" style={{ fontSize: '14px', color: '#555', fontWeight: '500', textDecoration: 'none' }}>Pricing</Link>
        <Link to="/dashboard" style={{ fontSize: '14px', color: '#555', fontWeight: '500', textDecoration: 'none' }}>Dashboard</Link>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#00b386',
            color: '#fff',
            padding: '8px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
          Get Started
        </button>
      </div>
    </nav>
  )
}

export default Navbar