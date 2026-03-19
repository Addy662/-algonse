import API_BASE from '../config'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const signalColor = {
  BUY:  { bg: '#e6faf5', color: '#00b386' },
  SELL: { bg: '#fef0f0', color: '#e05252' },
  HOLD: { bg: '#fff8ed', color: '#f5a623' },
}

function MetricCard({ label, value, sub, subUp, onClick }) {
  return (
    <div onClick={onClick} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px 24px', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ fontSize: '13px', color: subUp ? '#00b386' : '#e05252', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function Dashboard() {
  const [stocks, setStocks]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(null)

  // Broker state
  const kiteToken = localStorage.getItem('kite_token')
  const [brokerPnl, setBrokerPnl]         = useState(null)
  const [brokerProfile, setBrokerProfile] = useState(null)
  const [brokerLoading, setBrokerLoading] = useState(false)

  // Market overview state
  const [market, setMarket] = useState([])

  const navigate = useNavigate()

  const fetchStocks = async () => {
    try {
      setLoading(true)
      setError(null)
      const res  = await fetch(`${API_BASE}/api/stocks`)
      const data = await res.json()
      setStocks(data)
      setLastUpdated(new Date().toLocaleTimeString('en-IN'))
    } catch (e) {
      setError('Cannot connect to backend.')
    } finally {
      setLoading(false)
    }
  }

  const fetchBroker = async () => {
    if (!kiteToken) return
    setBrokerLoading(true)
    try {
      const headers = { 'X-Kite-Token': kiteToken }
      const [profRes, pnlRes] = await Promise.all([
        fetch(`${API_BASE}/api/broker/profile`,   { headers }),
        fetch(`${API_BASE}/api/broker/pnl`,       { headers }),
      ])
      const prof = await profRes.json()
      const pnl  = await pnlRes.json()
      if (!prof.error) setBrokerProfile(prof)
      if (!pnl.error)  setBrokerPnl(pnl)
    } catch(e) {}
    setBrokerLoading(false)
  }

  useEffect(() => {
    fetchStocks()
    fetchBroker()
  }, [])

  // Derive market indices from stocks data
  useEffect(() => {
    if (!stocks.length) return
    const indices = ['NIFTY50', 'BANKNIFTY', 'SENSEX']
    setMarket(stocks.filter(s => indices.includes(s.name)))
  }, [stocks])

  const filtered  = activeTab === 'all' ? stocks : stocks.filter(s => s.signal === activeTab.toUpperCase())
  const buyCount  = stocks.filter(s => s.signal === 'BUY').length
  const sellCount = stocks.filter(s => s.signal === 'SELL').length
  const holdCount = stocks.filter(s => s.signal === 'HOLD').length

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Dashboard</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            {lastUpdated ? `Updated at ${lastUpdated}` : 'Fetching live data...'}
          </p>
        </div>
        <button onClick={() => { fetchStocks(); fetchBroker() }} style={{
          padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
          fontWeight: '600', background: '#00b386', color: '#fff',
          border: 'none', cursor: 'pointer'
        }}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* ── Market Overview ── */}
      {market.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {market.map(m => (
            <div key={m.name} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px', fontWeight: '600' }}>{m.name}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a' }}>
                ₹{m.price.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px', fontWeight: '500', color: m.change >= 0 ? '#00b386' : '#e05252' }}>
                {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Broker Status Card ── */}
      <div style={{
        background: kiteToken ? '#f7fffe' : '#fafafa',
        border: `1px solid ${kiteToken ? '#b2eada' : '#e0e0e0'}`,
        borderRadius: '14px', padding: '20px 24px', marginBottom: '20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: kiteToken ? '#00b386' : '#ccc',
            boxShadow: kiteToken ? '0 0 0 3px rgba(0,179,134,0.2)' : 'none'
          }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
              {kiteToken ? `Zerodha Connected${brokerProfile ? ` · ${brokerProfile.user_name}` : ''}` : 'Broker Not Connected'}
            </div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
              {kiteToken ? 'Live trading enabled' : 'Connect Zerodha to enable live trading'}
            </div>
          </div>
        </div>

        {kiteToken && brokerPnl ? (
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { label: "Today's P&L",  value: `${brokerPnl.total_pnl >= 0 ? '+' : ''}₹${brokerPnl.total_pnl?.toLocaleString('en-IN')}`, up: brokerPnl.total_pnl >= 0 },
              { label: 'Realised',     value: `${brokerPnl.realised_pnl >= 0 ? '+' : ''}₹${brokerPnl.realised_pnl?.toLocaleString('en-IN')}`, up: brokerPnl.realised_pnl >= 0 },
              { label: 'Unrealised',   value: `${brokerPnl.unrealised_pnl >= 0 ? '+' : ''}₹${brokerPnl.unrealised_pnl?.toLocaleString('en-IN')}`, up: brokerPnl.unrealised_pnl >= 0 },
              { label: 'Win Rate',     value: `${brokerPnl.win_rate}%`, up: brokerPnl.win_rate >= 50 },
            ].map(c => (
              <div key={c.label}>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>{c.label}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: c.up ? '#00b386' : '#e05252' }}>{c.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => navigate('/broker')} style={{
            padding: '9px 20px', borderRadius: '8px', fontSize: '13px',
            fontWeight: '600', background: '#387ed1', color: '#fff',
            border: 'none', cursor: 'pointer'
          }}>
            {kiteToken ? 'View Broker' : 'Connect Zerodha'}
          </button>
        )}

        {kiteToken && (
          <button onClick={() => navigate('/broker')} style={{
            padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
            fontWeight: '600', background: '#fff', color: '#00b386',
            border: '1px solid #00b386', cursor: 'pointer'
          }}>View Positions →</button>
        )}
      </div>

      {/* ── Signal Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <MetricCard label="Stocks Tracked" value={stocks.length} sub="NSE Live" subUp={true} />
        <MetricCard label="BUY Signals"  value={buyCount}  sub="Act on these"   subUp={true}  onClick={() => setActiveTab('buy')}  />
        <MetricCard label="SELL Signals" value={sellCount} sub="Exit or short"  subUp={false} onClick={() => setActiveTab('sell')} />
        <MetricCard label="HOLD"         value={holdCount} sub="Wait and watch" subUp={true}  onClick={() => setActiveTab('hold')} />
      </div>

      {error && (
        <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '12px', padding: '16px 20px', color: '#e05252', fontSize: '14px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Signals Table ── */}
      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '80px', textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>Fetching live NSE data...</div>
          <div style={{ fontSize: '14px' }}>This takes 10–20 seconds on first load</div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>Live Watchlist & Signals</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'buy', 'sell', 'hold'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                  fontWeight: '500', border: '1px solid', cursor: 'pointer',
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
                {['Stock', 'Price (₹)', 'Change %', 'RSI', 'MACD', 'Signal', 'Confidence'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock, i) => (
                <tr key={stock.name} onClick={() => navigate(`/charts?stock=${stock.name}`)} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fff8'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa'}
                >
                  <td style={{ padding: '14px 20px', fontWeight: '600', fontSize: '14px' }}>{stock.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500' }}>{stock.price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '500', color: stock.change >= 0 ? '#00b386' : '#e05252' }}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${stock.rsi}%`, height: '100%', borderRadius: '3px', background: stock.rsi > 65 ? '#e05252' : stock.rsi < 40 ? '#00b386' : '#f5a623' }} />
                      </div>
                      <span style={{ fontSize: '13px', color: '#666' }}>{stock.rsi}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: stock.macd > stock.macd_signal ? '#00b386' : '#e05252' }}>
                    {stock.macd > stock.macd_signal ? '▲ Bullish' : '▼ Bearish'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ background: signalColor[stock.signal].bg, color: signalColor[stock.signal].color, fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' }}>
                      {stock.signal}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${stock.confidence}%`, height: '100%', background: '#00b386', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '13px', color: '#666' }}>{stock.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard