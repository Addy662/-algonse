import { useState } from 'react'

const stocks = [
  { name: 'RELIANCE', price: '₹2,847', change: '+1.2%', signal: 'HOLD', rsi: 58, up: true },
  { name: 'HDFCBANK', price: '₹1,634', change: '+2.1%', signal: 'BUY', rsi: 42, up: true },
  { name: 'TCS', price: '₹3,912', change: '-1.4%', signal: 'SELL', rsi: 71, up: false },
  { name: 'INFY', price: '₹1,782', change: '+1.8%', signal: 'BUY', rsi: 38, up: true },
  { name: 'WIPRO', price: '₹456', change: '-0.9%', signal: 'SELL', rsi: 67, up: false },
  { name: 'NIFTY50', price: '₹22,450', change: '+0.3%', signal: 'BUY', rsi: 55, up: true },
  { name: 'BANKNIFTY', price: '₹48,230', change: '+0.7%', signal: 'HOLD', rsi: 52, up: true },
  { name: 'ADANIENT', price: '₹2,341', change: '-2.1%', signal: 'SELL', rsi: 72, up: false },
]

const signalColor = {
  BUY: { bg: '#e6faf5', color: '#00b386' },
  SELL: { bg: '#fef0f0', color: '#e05252' },
  HOLD: { bg: '#fff8ed', color: '#f5a623' }
}

function MetricCard({ label, value, sub, subUp }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: '12px',
      padding: '20px 24px'
    }}>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ fontSize: '13px', color: subUp ? '#00b386' : '#e05252', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('all')

  const filtered = activeTab === 'all' ? stocks
    : stocks.filter(s => s.signal === activeTab.toUpperCase())

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Paper trading mode — no real money at risk</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <MetricCard label="Portfolio Value" value="₹5,24,300" sub="+₹12,420 today" subUp={true} />
        <MetricCard label="Today's P&L" value="+₹12,420" sub="+2.4%" subUp={true} />
        <MetricCard label="Open Positions" value="4" sub="2 profit · 2 loss" subUp={true} />
        <MetricCard label="Win Rate" value="67%" sub="Last 30 trades" subUp={true} />
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
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>Watchlist & Signals</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'buy', 'sell', 'hold'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid',
                cursor: 'pointer',
                background: activeTab === tab ? '#00b386' : '#fff',
                color: activeTab === tab ? '#fff' : '#888',
                borderColor: activeTab === tab ? '#00b386' : '#e0e0e0'
              }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {['Stock', 'Price', 'Change', 'RSI', 'Signal', 'Action'].map(h => (
                <th key={h} style={{
                  padding: '12px 24px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#888',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock, i) => (
              <tr key={stock.name} style={{
                borderTop: '1px solid #f0f0f0',
                background: i % 2 === 0 ? '#fff' : '#fafafa'
              }}>
                <td style={{ padding: '14px 24px', fontWeight: '600', fontSize: '14px' }}>{stock.name}</td>
                <td style={{ padding: '14px 24px', fontSize: '14px' }}>{stock.price}</td>
                <td style={{ padding: '14px 24px', fontSize: '14px', color: stock.up ? '#00b386' : '#e05252', fontWeight: '500' }}>{stock.change}</td>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '60px', height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${stock.rsi}%`, height: '100%', borderRadius: '3px',
                        background: stock.rsi > 65 ? '#e05252' : stock.rsi < 40 ? '#00b386' : '#f5a623'
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', color: '#666' }}>{stock.rsi}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <span style={{
                    background: signalColor[stock.signal].bg,
                    color: signalColor[stock.signal].color,
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>{stock.signal}</span>
                </td>
                <td style={{ padding: '14px 24px' }}>
                  <button style={{
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    color: '#1a1a1a',
                    cursor: 'pointer'
                  }}>Trade</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard