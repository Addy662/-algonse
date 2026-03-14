function Features() {
  const features = [
    {
      icon: '📈',
      title: 'Live Buy/Sell Signals',
      desc: 'Get real-time signals for NSE & BSE stocks based on proven technical strategies like RSI, MACD, and Bollinger Bands.'
    },
    {
      icon: '🔁',
      title: 'Backtest Any Strategy',
      desc: 'Test your strategy on years of historical data before risking real money. See win rate, returns, and drawdown instantly.'
    },
    {
      icon: '⚡',
      title: 'F&O Signal Engine',
      desc: 'Options and futures signals with strike price recommendations, expiry selection, and premium entry points.'
    },
    {
      icon: '📊',
      title: 'Portfolio Tracker',
      desc: 'Track all your positions, P&L, and performance in one clean dashboard. Works with Zerodha, Angel One, and more.'
    },
    {
      icon: '🔔',
      title: 'Smart Alerts',
      desc: 'Get notified on WhatsApp or email the moment a signal triggers. Never miss a trade opportunity again.'
    },
    {
      icon: '🛡️',
      title: 'Risk Management',
      desc: 'Built-in stop loss, position sizing, and risk-per-trade calculator to protect your capital at all times.'
    }
  ]

  return (
    <section id="features" style={{
      padding: '80px 5%',
      background: '#f9f9f9'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block',
            background: '#e6faf5',
            color: '#00b386',
            fontSize: '13px',
            fontWeight: '600',
            padding: '6px 14px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            Everything you need
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '14px'
          }}>
            Built for serious traders
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Everything you need to trade smarter — from signal generation to execution, all in one place.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: '#fff',
              border: '1px solid #f0f0f0',
              borderRadius: '14px',
              padding: '28px 24px',
              transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.07)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '10px'
              }}>{f.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#777',
                lineHeight: '1.7'
              }}>{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Features