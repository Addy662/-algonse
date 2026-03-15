import { useState, useEffect } from 'react'

const signalColor = {
  BUY:  { bg: '#e6faf5', color: '#00b386' },
  SELL: { bg: '#fef0f0', color: '#e05252' },
  HOLD: { bg: '#fff8ed', color: '#f5a623' },
}

function Signals() {
  const [stocks, setStocks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    fetch('http://localhost:5000/api/stocks')
      .then(r => r.json())
      .then(data => { setStocks(data); setLoading(false) })
      .catch(() => { setError('Cannot connect to backend.'); setLoading(false) })
  }, [])

  const filtered = filter === 'ALL' ? stocks : stocks.filter(s => s.signal === filter)
  const buyCount  = stocks.filter(s => s.signal === 'BUY').length
  const sellCount = stocks.filter(s => s.signal === 'SELL').length

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Live Signals</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
          Real buy/sell signals calculated from live NSE data using RSI, MACD, Bollinger Bands & Moving Averages
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px 24px' }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>Total Signals</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>{stocks.length}</div>
        </div>
        <div style={{ background: '#e6faf5', border: '1px solid #b2eada', borderRadius: '12px', padding: '20px 24px' }}>
          <div style={{ fontSize: '13px', color: '#00b386', marginBottom: '6px' }}>BUY Signals</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#00b386' }}>{buyCount}</div>
        </div>
        <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '12px', padding: '20px 24px' }}>
          <div style={{ fontSize: '13px', color: '#e05252', marginBottom: '6px' }}>SELL Signals</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#e05252' }}>{sellCount}</div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '12px', padding: '16px 20px', color: '#e05252', fontSize: '14px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '8px', padding: '18px 24px', borderBottom: '1px solid #f0f0f0' }}>
          {['ALL', 'BUY', 'SELL', 'HOLD'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '13px',
              fontWeight: '500', border: '1px solid', cursor: 'pointer',
              background: filter === f ? '#00b386' : '#fff',
              color: filter === f ? '#fff' : '#888',
              borderColor: filter === f ? '#00b386' : '#e0e0e0'
            }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>Calculating live signals...</div>
            <div style={{ fontSize: '13px', marginTop: '6px' }}>Fetching NSE data and running indicators</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Stock', 'Price (₹)', 'Change', 'RSI', 'MACD Trend', 'Signal', 'Confidence', 'BB Position'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', fontSize: '11px', fontWeight: '600',
                    color: '#888', textAlign: 'left', textTransform: 'uppercase',
                    letterSpacing: '0.5px', whiteSpace: 'nowrap'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.name} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '13px' }}>{s.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500' }}>
                    {s.price.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: s.change >= 0 ? '#00b386' : '#e05252' }}>
                    {s.change >= 0 ? '+' : ''}{s.change}%
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '50px', height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${s.rsi}%`, height: '100%',
                          background: s.rsi > 65 ? '#e05252' : s.rsi < 40 ? '#00b386' : '#f5a623'
                        }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{s.rsi}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: s.macd > s.macd_signal ? '#00b386' : '#e05252' }}>
                    {s.macd > s.macd_signal ? '▲ Bullish' : '▼ Bearish'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: signalColor[s.signal].bg,
                      color: signalColor[s.signal].color,
                      fontSize: '12px', fontWeight: '700',
                      padding: '4px 10px', borderRadius: '6px'
                    }}>{s.signal}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '50px', height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.confidence}%`, height: '100%', background: '#00b386' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{s.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: '#666' }}>
                    {s.price > s.bb_upper ? '🔴 Above upper' : s.price < s.bb_lower ? '🟢 Below lower' : '⚪ Inside band'}
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

export default Signals