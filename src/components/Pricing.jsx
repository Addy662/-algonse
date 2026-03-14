function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect to get started',
      color: '#1a1a1a',
      bg: '#fff',
      border: '#e0e0e0',
      btnBg: '#fff',
      btnColor: '#1a1a1a',
      btnBorder: '#e0e0e0',
      features: [
        '5 stocks watchlist',
        'Basic RSI signals',
        'Paper trading only',
        'Email alerts',
        '1 month backtest'
      ]
    },
    {
      name: 'Pro',
      price: '₹499',
      period: 'per month',
      desc: 'For active traders',
      color: '#fff',
      bg: '#00b386',
      border: '#00b386',
      btnBg: '#fff',
      btnColor: '#00b386',
      btnBorder: '#fff',
      popular: true,
      features: [
        'Unlimited watchlist',
        'All 5 strategies',
        'Live trade signals',
        'WhatsApp + email alerts',
        '3 year backtest',
        'F&O signals',
        'Priority support'
      ]
    },
    {
      name: 'Elite',
      price: '₹999',
      period: 'per month',
      desc: 'For serious professionals',
      color: '#1a1a1a',
      bg: '#fff',
      border: '#e0e0e0',
      btnBg: '#1a1a1a',
      btnColor: '#fff',
      btnBorder: '#1a1a1a',
      features: [
        'Everything in Pro',
        'Zerodha auto-execution',
        'Custom strategy builder',
        'API access',
        'Portfolio analytics',
        'Dedicated account manager',
        '10 year backtest'
      ]
    }
  ]

  return (
    <section id="pricing" style={{ padding: '80px 5%', background: '#fff' }}>
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
            Simple pricing
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
            Start free, scale as you grow
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.7' }}>
            No hidden charges. Cancel anytime.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              background: plan.bg,
              border: `1.5px solid ${plan.border}`,
              borderRadius: '16px',
              padding: '32px 28px',
              position: 'relative'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1a1a1a',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap'
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ color: plan.color }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{plan.name}</div>
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '20px' }}>{plan.desc}</div>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '40px', fontWeight: '700' }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', opacity: 0.7, marginLeft: '6px' }}>/ {plan.period}</span>
                </div>

                <button style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: plan.btnBg,
                  color: plan.btnColor,
                  border: `1.5px solid ${plan.btnBorder}`,
                  marginBottom: '28px',
                  cursor: 'pointer'
                }}>
                  Get Started
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                      <span style={{ color: plan.popular ? '#fff' : '#00b386', fontWeight: '700' }}>✓</span>
                      <span style={{ opacity: 0.85 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Pricing