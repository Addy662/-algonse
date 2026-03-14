import { useState } from 'react'

const allSignals = [
  { stock: 'HDFCBANK', type: 'Equity', strategy: 'RSI Reversal', signal: 'BUY', entry: '₹1,634', target: '₹1,710', sl: '₹1,590', rr: '1:2', time: '10:32 AM', confidence: 85 },
  { stock: 'INFY', type: 'Equity', strategy: 'MACD Cross', signal: 'BUY', entry: '₹1,782', target: '₹1,860', sl: '₹1,740', rr: '1:2', time: '10:45 AM', confidence: 78 },
  { stock: 'TCS', type: 'Equity', strategy: 'Bollinger Band', signal: 'SELL', entry: '₹3,912', target: '₹3,720', sl: '₹3,980', rr: '1:3', time: '11:02 AM', confidence: 82 },
  { stock: 'WIPRO', type: 'Equity', strategy: 'Momentum', signal: 'SELL', entry: '₹456', target: '₹430', sl: '₹468', rr: '1:2', time: '11:15 AM', confidence: 71 },
  { stock: 'NIFTY 22500 CE', type: 'F&O', strategy: 'Options Buy', signal: 'BUY', entry: '₹142', target: '₹200', sl: '₹110', rr: '1:2', time: '09:45 AM', confidence: 76 },
  { stock: 'BANKNIFTY 48000 PE', type: 'F&O', strategy: 'Options Buy', signal: 'BUY', entry: '₹88', target: '₹140', sl: '₹60', rr: '1:2', time: '09:52 AM', confidence: 69 },
  { stock: 'RELIANCE 2900 CE', type: 'F&O', strategy: 'Options Sell', signal: 'SELL', entry: '₹34', target: '₹10', sl: '₹50', rr: '1:3', time: '10:10 AM', confidence: 74 },
  { stock: 'ADANIENT', type: 'Equity', strategy: 'Moving Average', signal: 'SELL', entry: '₹2,341', target: '₹2,200', sl: '₹2,400', rr: '1:2', time: '11:30 AM', confidence: 80 },
]

const signalColor = {
  BUY: { bg: '#e6faf5', color: '#00b386' },
  SELL: { bg: '#fef0f0', color: '#e05252' },
}

function Signals() {
  const [filter, setFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const filtered = allSignals
    .filter(s => filter === 'ALL' || s.signal === filter)
    .filter(s => typeFilter === 'ALL' || s.type === typeFilter)

  const buyCount = allSignals.filter(s => s.signal === 'BUY').length
  const sellCount = allSignals.filter(s => s.signal === 'SELL').length

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Live Signals</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Real-time buy/sell signals across NSE equities and F&O</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px 24px' }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>Total Signals Today</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>{allSignals.length}</div>
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

      <div style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: '14px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid #f0f0f0',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'BUY', 'SELL'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid',
                cursor: 'pointer',
                background: filter === f ? '#00b386' : '#fff',
                color: filter === f ? '#fff' : '#888',
                borderColor: filter === f ? '#00b386' : '#e0e0e0'
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'Equity', 'F&O'].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid',
                cursor: 'pointer',
                background: typeFilter === f ? '#1a1a1a' : '#fff',
                color: typeFilter === f ? '#fff' : '#888',
                borderColor: typeFilter === f ? '#1a1a1a' : '#e0e0e0'
              }}>{f}</button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {['Stock', 'Type', 'Strategy', 'Signal', 'Entry', 'Target', 'Stop Loss', 'R:R', 'Confidence', 'Time'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#888',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '13px' }}>{s.stock}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: s.type === 'F&O' ? '#f0f0ff' : '#f5f5f5',
                    color: s.type === 'F&O' ? '#5555cc' : '#555',
                    fontSize: '11px', fontWeight: '600',
                    padding: '3px 8px', borderRadius: '4px'
                  }}>{s.type}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#666' }}>{s.strategy}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: signalColor[s.signal].bg,
                    color: signalColor[s.signal].color,
                    fontSize: '12px', fontWeight: '700',
                    padding: '4px 10px', borderRadius: '6px'
                  }}>{s.signal}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500' }}>{s.entry}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#00b386', fontWeight: '500' }}>{s.target}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#e05252', fontWeight: '500' }}>{s.sl}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#888' }}>{s.rr}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '50px', height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.confidence}%`, height: '100%', background: '#00b386', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#666' }}>{s.confidence}%</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#888' }}>{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Signals