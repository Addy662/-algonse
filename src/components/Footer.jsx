function Footer() {
  return (
    <footer style={{
      background: '#1a1a1a',
      color: '#fff',
      padding: '60px 5% 32px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '48px'
        }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#00b386', marginBottom: '14px' }}>
              AlgoNSE
            </div>
            <p style={{ fontSize: '14px', color: '#999', lineHeight: '1.8', maxWidth: '260px' }}>
              India's smartest algo trading platform for NSE & BSE. Built for every trader — beginner to pro.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product</div>
            {['Features', 'Pricing', 'Backtest', 'Signals', 'F&O Engine'].map(item => (
              <div key={item} style={{ fontSize: '14px', color: '#999', marginBottom: '10px', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#999'}
              >{item}</div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</div>
            {['About', 'Blog', 'Careers', 'Contact', 'Press'].map(item => (
              <div key={item} style={{ fontSize: '14px', color: '#999', marginBottom: '10px', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#999'}
              >{item}</div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal</div>
            {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Refund Policy'].map(item => (
              <div key={item} style={{ fontSize: '14px', color: '#999', marginBottom: '10px', cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#999'}
              >{item}</div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '13px', color: '#666' }}>
            © 2026 AlgoNSE. All rights reserved.
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Not SEBI registered. For educational purposes only.
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer