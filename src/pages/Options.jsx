import API_BASE from '../config'
import { useState, useEffect } from 'react'

const INDICES = ['NIFTY50','BANKNIFTY','RELIANCE','HDFCBANK','TCS','INFY']

function Options() {
  const [ticker, setTicker]   = useState('NIFTY50')
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [activeTab, setActiveTab] = useState('chain')

  // P&L simulator state
  const [simStrike, setSimStrike]   = useState('')
  const [simType, setSimType]       = useState('CALL')
  const [simPremium, setSimPremium] = useState('')
  const [simQty, setSimQty]         = useState(50)
  const [simAction, setSimAction]   = useState('BUY')

  const fetchOptions = async (t) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`${API_BASE}/api/options/${t}`)
      const d = await res.json()
      if (d.error) { setError(d.error); return }
      setData(d)
    } catch(e) {
      setError('Cannot connect to backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOptions(ticker) }, [ticker])

  // P&L simulation
  const simPnLPoints = () => {
    if (!simStrike || !simPremium || !data) return []
    const strike = parseFloat(simStrike)
    const premium = parseFloat(simPremium)
    const cp = data.currentPrice
    const range = cp * 0.1
    const points = []
    for (let p = cp - range; p <= cp + range; p += range / 10) {
      let pnl = 0
      if (simType === 'CALL' && simAction === 'BUY')  pnl = (Math.max(0, p - strike) - premium) * simQty
      if (simType === 'CALL' && simAction === 'SELL') pnl = (premium - Math.max(0, p - strike)) * simQty
      if (simType === 'PUT'  && simAction === 'BUY')  pnl = (Math.max(0, strike - p) - premium) * simQty
      if (simType === 'PUT'  && simAction === 'SELL') pnl = (premium - Math.max(0, strike - p)) * simQty
      points.push({ price: Math.round(p), pnl: Math.round(pnl) })
    }
    return points
  }

  const simPoints = simPnLPoints()
  const maxPnL = simPoints.length ? Math.max(...simPoints.map(p => p.pnl)) : 0
  const minPnL = simPoints.length ? Math.min(...simPoints.map(p => p.pnl)) : 0
  const maxAbs = Math.max(Math.abs(maxPnL), Math.abs(minPnL)) || 1

  const tabStyle = (t) => ({
    padding: '7px 18px', borderRadius: '20px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer', border: '1px solid',
    background: activeTab === t ? '#00b386' : '#fff',
    color: activeTab === t ? '#fff' : '#888',
    borderColor: activeTab === t ? '#00b386' : '#e0e0e0'
  })

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1400px', margin: '0 auto' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Options Desk</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Options chain, max pain, P&L simulator and F&O signals</p>
      </div>

      {/* Ticker selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {INDICES.map(s => (
          <button key={s} onClick={() => setTicker(s)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
            fontWeight: '500', cursor: 'pointer', border: '1px solid',
            background: ticker === s ? '#1a1a1a' : '#fff',
            color: ticker === s ? '#fff' : '#555',
            borderColor: ticker === s ? '#1a1a1a' : '#e0e0e0'
          }}>{s}</button>
        ))}
      </div>

      {/* Summary bar */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Current Price', value: `₹${data.currentPrice.toLocaleString('en-IN')}`, color: '#1a1a1a' },
            { label: 'Max Pain',      value: `₹${data.maxPain?.toLocaleString('en-IN') || '—'}`, color: '#f5a623' },
            { label: 'Expiry',        value: data.expiry, color: '#1a1a1a' },
            { label: 'F&O Signals',   value: data.fnoSignals?.length || 0, color: '#00b386' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{c.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>Fetching options data...</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>This may take 10–15 seconds</div>
        </div>
      )}

      {error && (
        <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '12px', padding: '16px 20px', color: '#e05252', fontSize: '14px' }}>
          ⚠️ {error} — Note: Options data requires yfinance to have access. Some tickers may not have options.
        </div>
      )}

      {data && !loading && (
        <>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button style={tabStyle('chain')}    onClick={() => setActiveTab('chain')}>Options Chain</button>
            <button style={tabStyle('maxpain')}  onClick={() => setActiveTab('maxpain')}>Max Pain</button>
            <button style={tabStyle('simulator')}onClick={() => setActiveTab('simulator')}>P&L Simulator</button>
            <button style={tabStyle('signals')}  onClick={() => setActiveTab('signals')}>F&O Signals</button>
          </div>

          {/* OPTIONS CHAIN */}
          {activeTab === 'chain' && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    <th colSpan={5} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#00b386', textAlign: 'center', borderRight: '2px solid #f0f0f0' }}>CALLS</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', background: '#f5f5f5' }}>STRIKE</th>
                    <th colSpan={5} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '700', color: '#e05252', textAlign: 'center', borderLeft: '2px solid #f0f0f0' }}>PUTS</th>
                  </tr>
                  <tr style={{ background: '#fafafa', fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>
                    {['OI','Volume','IV','Bid/Ask','LTP','Strike','LTP','Bid/Ask','IV','Volume','OI'].map((h,i) => (
                      <th key={i} style={{
                        padding: '8px 12px', textAlign: i < 5 ? 'right' : i === 5 ? 'center' : 'left',
                        borderRight: i === 4 ? '2px solid #f0f0f0' : 'none',
                        borderLeft: i === 6 ? '2px solid #f0f0f0' : 'none',
                        background: i === 5 ? '#f5f5f5' : 'transparent'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.calls.map((call, i) => {
                    const put = data.puts.find(p => p.strike === call.strike)
                    const atm = Math.abs(call.strike - data.currentPrice) < data.currentPrice * 0.005
                    return (
                      <tr key={i} style={{
                        borderTop: '1px solid #f5f5f5',
                        background: atm ? '#fffbea' : call.inTheMoney ? '#f0fff8' : '#fff'
                      }}>
                        {/* CALLS */}
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', color: '#555' }}>{call.openInterest.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', color: '#555' }}>{call.volume.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', color: '#555' }}>{call.iv}%</td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', color: '#555' }}>{call.bid}/{call.ask}</td>
                        <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'right', fontWeight: '600', color: '#00b386', borderRight: '2px solid #f0f0f0' }}>{call.lastPrice}</td>
                        {/* STRIKE */}
                        <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '700', textAlign: 'center', background: atm ? '#fff3cd' : '#f5f5f5', color: atm ? '#f5a623' : '#1a1a1a' }}>
                          {call.strike.toLocaleString('en-IN')}
                          {atm && <div style={{ fontSize: '9px', color: '#f5a623' }}>ATM</div>}
                        </td>
                        {/* PUTS */}
                        {put ? <>
                          <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'left', fontWeight: '600', color: '#e05252', borderLeft: '2px solid #f0f0f0' }}>{put.lastPrice}</td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'left', color: '#555' }}>{put.bid}/{put.ask}</td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'left', color: '#555' }}>{put.iv}%</td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'left', color: '#555' }}>{put.volume.toLocaleString()}</td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', textAlign: 'left', color: '#555' }}>{put.openInterest.toLocaleString()}</td>
                        </> : <td colSpan={5} />}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* MAX PAIN */}
          {activeTab === 'maxpain' && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '28px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Max Pain Analysis</h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: '1.7' }}>
                Max Pain is the strike price where option buyers lose the most money at expiry. Market makers tend to push price toward this level near expiry.
              </p>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '28px' }}>
                <div style={{ background: '#fff8ed', border: '1px solid #fde9b2', borderRadius: '12px', padding: '20px 28px' }}>
                  <div style={{ fontSize: '13px', color: '#f5a623', fontWeight: '600', marginBottom: '6px' }}>MAX PAIN STRIKE</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>₹{data.maxPain?.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: '#f7fffe', border: '1px solid #e0faf5', borderRadius: '12px', padding: '20px 28px' }}>
                  <div style={{ fontSize: '13px', color: '#00b386', fontWeight: '600', marginBottom: '6px' }}>CURRENT PRICE</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>₹{data.currentPrice?.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '12px', padding: '20px 28px' }}>
                  <div style={{ fontSize: '13px', color: '#e05252', fontWeight: '600', marginBottom: '6px' }}>DISTANCE TO MAX PAIN</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>
                    {data.maxPain ? `${((data.maxPain - data.currentPrice) / data.currentPrice * 100).toFixed(2)}%` : '—'}
                  </div>
                </div>
              </div>

              {/* OI bar chart */}
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Open Interest by Strike</h3>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '160px', minWidth: '600px' }}>
                  {data.calls.map((c, i) => {
                    const put = data.puts.find(p => p.strike === c.strike)
                    const maxOI = Math.max(...data.calls.map(x => x.openInterest), ...data.puts.map(x => x.openInterest)) || 1
                    const callH = Math.round((c.openInterest / maxOI) * 120)
                    const putH  = put ? Math.round((put.openInterest / maxOI) * 120) : 0
                    const isMax = c.strike === data.maxPain
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '120px' }}>
                          <div style={{ width: '8px', height: `${callH}px`, background: isMax ? '#f5a623' : '#00b386', borderRadius: '2px 2px 0 0', minHeight: '2px' }} />
                          <div style={{ width: '8px', height: `${putH}px`,  background: isMax ? '#f5a623' : '#e05252', borderRadius: '2px 2px 0 0', minHeight: '2px' }} />
                        </div>
                        <div style={{ fontSize: '9px', color: isMax ? '#f5a623' : '#888', fontWeight: isMax ? '700' : '400', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                          {c.strike.toLocaleString('en-IN')}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px', fontSize: '12px', color: '#888' }}>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#00b386', borderRadius: '2px', marginRight: '4px' }} />Call OI</span>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#e05252', borderRadius: '2px', marginRight: '4px' }} />Put OI</span>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#f5a623', borderRadius: '2px', marginRight: '4px' }} />Max Pain</span>
                </div>
              </div>
            </div>
          )}

          {/* P&L SIMULATOR */}
          {activeTab === 'simulator' && (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px' }}>Configure Position</h2>

                <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>OPTION TYPE</label>
                <div style={{ display: 'flex', gap: '8px', margin: '6px 0 14px' }}>
                  {['CALL','PUT'].map(t => (
                    <button key={t} onClick={() => setSimType(t)} style={{
                      flex: 1, padding: '9px', borderRadius: '8px', fontSize: '14px',
                      fontWeight: '600', cursor: 'pointer',
                      background: simType === t ? '#1a1a1a' : '#fff',
                      color: simType === t ? '#fff' : '#888',
                      border: `1px solid ${simType === t ? '#1a1a1a' : '#e0e0e0'}`
                    }}>{t}</button>
                  ))}
                </div>

                <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>ACTION</label>
                <div style={{ display: 'flex', gap: '8px', margin: '6px 0 14px' }}>
                  {['BUY','SELL'].map(a => (
                    <button key={a} onClick={() => setSimAction(a)} style={{
                      flex: 1, padding: '9px', borderRadius: '8px', fontSize: '14px',
                      fontWeight: '600', cursor: 'pointer',
                      background: simAction === a ? (a === 'BUY' ? '#00b386' : '#e05252') : '#fff',
                      color: simAction === a ? '#fff' : '#888',
                      border: `1px solid ${simAction === a ? (a === 'BUY' ? '#00b386' : '#e05252') : '#e0e0e0'}`
                    }}>{a}</button>
                  ))}
                </div>

                {[
                  { label: 'STRIKE PRICE (₹)', key: 'simStrike', val: simStrike, set: setSimStrike, placeholder: `e.g. ${Math.round(data.currentPrice/100)*100}` },
                  { label: 'PREMIUM PAID (₹)', key: 'simPremium', val: simPremium, set: setSimPremium, placeholder: 'e.g. 150' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>{f.label}</label>
                    <input type="number" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      border: '1px solid #e0e0e0', fontSize: '14px',
                      marginTop: '5px', marginBottom: '12px'
                    }} />
                  </div>
                ))}

                <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>LOT SIZE / QTY</label>
                <input type="number" value={simQty} onChange={e => setSimQty(parseInt(e.target.value))} style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  border: '1px solid #e0e0e0', fontSize: '14px',
                  marginTop: '5px', marginBottom: '12px'
                }} />

                <div style={{ background: '#f7fffe', border: '1px solid #e0faf5', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#555', lineHeight: '1.7' }}>
                  <strong>Current Price:</strong> ₹{data.currentPrice.toLocaleString('en-IN')}<br/>
                  <strong>Max Profit:</strong> <span style={{ color: '#00b386' }}>{simAction === 'SELL' && simPremium ? `₹${Math.round(parseFloat(simPremium) * simQty).toLocaleString('en-IN')}` : 'Unlimited'}</span><br/>
                  <strong>Max Loss:</strong> <span style={{ color: '#e05252' }}>{simAction === 'BUY' && simPremium ? `₹${Math.round(parseFloat(simPremium) * simQty).toLocaleString('en-IN')}` : 'Unlimited'}</span>
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>P&L at Expiry</h2>
                {simPoints.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📉</div>
                    <div>Enter strike price and premium to see P&L chart</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', marginBottom: '8px' }}>
                      {simPoints.map((pt, i) => {
                        const isPos = pt.pnl >= 0
                        const h = Math.round((Math.abs(pt.pnl) / maxAbs) * 90)
                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '200px', justifyContent: 'center', gap: '2px' }}>
                            {isPos && <div style={{ width: '100%', height: `${h}px`, background: '#00b386', borderRadius: '2px 2px 0 0', minHeight: '2px' }} />}
                            <div style={{ width: '1px', height: '2px', background: '#e0e0e0' }} />
                            {!isPos && <div style={{ width: '100%', height: `${h}px`, background: '#e05252', borderRadius: '0 0 2px 2px', minHeight: '2px' }} />}
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '16px' }}>
                      <span>₹{simPoints[0]?.price.toLocaleString('en-IN')}</span>
                      <span style={{ color: '#f5a623', fontWeight: '600' }}>Current: ₹{data.currentPrice.toLocaleString('en-IN')}</span>
                      <span>₹{simPoints[simPoints.length-1]?.price.toLocaleString('en-IN')}</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#fafafa' }}>
                          {['Price at Expiry','P&L (₹)','P&L (%)'].map(h => (
                            <th key={h} style={{ padding: '8px 12px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {simPoints.filter((_, i) => i % 2 === 0).map((pt, i) => (
                          <tr key={i} style={{ borderTop: '1px solid #f5f5f5' }}>
                            <td style={{ padding: '8px 12px' }}>₹{pt.price.toLocaleString('en-IN')}</td>
                            <td style={{ padding: '8px 12px', fontWeight: '600', color: pt.pnl >= 0 ? '#00b386' : '#e05252' }}>
                              {pt.pnl >= 0 ? '+' : ''}₹{pt.pnl.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '8px 12px', color: pt.pnl >= 0 ? '#00b386' : '#e05252' }}>
                              {simPremium ? `${((pt.pnl / (parseFloat(simPremium) * simQty)) * 100).toFixed(1)}%` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}

          {/* F&O SIGNALS */}
          {activeTab === 'signals' && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
              {data.fnoSignals?.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>No strong F&O signals right now</div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>Try a different ticker or check back when volume picks up</div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      {['Type','Strike','Premium','Open Interest','IV','Signal','Reason'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.fnoSignals.map((s, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: s.type === 'CALL' ? '#e6faf5' : '#fef0f0',
                            color: s.type === 'CALL' ? '#00b386' : '#e05252',
                            fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px'
                          }}>{s.type}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '14px' }}>₹{s.strike.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px' }}>₹{s.premium}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px' }}>{s.oi.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px' }}>{s.iv}%</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: s.signal === 'BUY' ? '#e6faf5' : '#fff8ed',
                            color: s.signal === 'BUY' ? '#00b386' : '#f5a623',
                            fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px'
                          }}>{s.signal}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#666' }}>{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Options