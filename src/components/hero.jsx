function Hero() {
  return (
    <section style={{
      padding: '80px 5% 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>

      <div style={{ flex: 1 }}>
        <div style={{
          display: 'inline-block',
          background: '#e6faf5',
          color: '#00b386',
          fontSize: '13px',
          fontWeight: '600',
          padding: '6px 14px',
          borderRadius: '20px',
          marginBottom: '20px'
        }}>
          Built for NSE & BSE traders
        </div>

        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          lineHeight: '1.15',
          color: '#1a1a1a',
          marginBottom: '20px'
        }}>
          Trade smarter with <br />
          <span style={{ color: '#00b386' }}>algo-powered</span> signals
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.7',
          marginBottom: '36px',
          maxWidth: '480px'
        }}>
          Backtest strategies, get live buy/sell signals, and automate your trades on NSE & BSE — no coding required.
        </p>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button style={{
            background: '#00b386',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600'
          }}>
            Start Free Trial
          </button>
          <button style={{
            background: '#fff',
            color: '#1a1a1a',
            padding: '14px 28px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            border: '1.5px solid #e0e0e0'
          }}>
            Watch Demo
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '32px',
          marginTop: '48px'
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>5+</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Strategies</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>NSE & BSE</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Markets covered</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Free</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>To get started</div>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        background: '#f7fffe',
        border: '1.5px solid #e0faf5',
        borderRadius: '16px',
        padding: '32px',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {[
          { stock: 'HDFCBANK', signal: 'BUY', price: '₹1,634', change: '+2.1%', color: '#00b386', bg: '#e6faf5' },
          { stock: 'TCS', signal: 'SELL', price: '₹3,912', change: '-1.4%', color: '#e05252', bg: '#fef0f0' },
          { stock: 'INFY', signal: 'BUY', price: '₹1,782', change: '+1.8%', color: '#00b386', bg: '#e6faf5' },
          { stock: 'NIFTY50', signal: 'HOLD', price: '₹22,450', change: '+0.3%', color: '#f5a623', bg: '#fff8ed' },
        ].map((item) => (
          <div key={item.stock} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: '10px',
            padding: '14px 18px'
          }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.stock}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.price}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: item.change.startsWith('+') ? '#00b386' : '#e05252', fontWeight: '500' }}>{item.change}</span>
              <span style={{
                background: item.bg,
                color: item.color,
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>{item.signal}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Hero