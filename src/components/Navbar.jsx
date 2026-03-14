import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

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
      <div style={{ fontSize: '20px', fontWeight: '700', color: '#00b386' }}>
        AlgoNSE
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a href="#features" style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Features</a>
        <a href="#pricing" style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Pricing</a>
        <a href="#about" style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>About</a>
        <button style={{
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