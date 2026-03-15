import { useState, useEffect } from 'react'

const STORAGE_KEY = 'algonse_trades'

function PaperTrading() {
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [prices, setPrices] = useState({})
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [form, setForm] = useState({ stock: 'RELIANCE', type: 'BUY', price: '', qty: '', note: '' })
  const [activeTab, setActiveTab] = useState('open')

  const STOCKS = ['RELIANCE','HDFCBANK','TCS','INFY','WIPRO','ICICIBANK','ADANIENT','BAJFINANCE','NIFTY50','BANKNIFTY']

  useEffect(() => {
    fetch('http://localhost:5000/api/stocks')
      .then(r => r.json())
      .then(data => {
        const p = {}
        data.forEach(s => { p[s.name] = s.price })
        setPrices(p)
        setLoadingPrices(false)
      })
      .catch(() => setLoadingPrices(false))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades))
  }, [trades])

  const addTrade = () => {
    if (!form.price || !form.qty) return
    const trade = {
      id: Date.now(),
      stock: form.stock,
      type: form.type,
      entryPrice: parseFloat(form.price),
      qty: parseInt(form.qty),
      note: form.note,
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
      status: 'OPEN',
      exitPrice: null,
      exitDate: null,
    }
    setTrades(prev => [trade, ...prev])
    setForm({ stock: 'RELIANCE', type: 'BUY', price: '', qty: '', note: '' })
  }

  const closeTrade = (id) => {
    const trade = trades.find(t => t.id === id)
    const currentPrice = prices[trade.stock]
    if (!currentPrice) return alert('Price not available. Refresh prices first.')
    setTrades(prev => prev.map(t => t.id === id ? {
      ...t,
      status: 'CLOSED',
      exitPrice: currentPrice,
      exitDate: new Date().toLocaleDateString('en-IN'),
    } : t))
  }

  const deleteTrade = (id) => {
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  const getPnL = (trade) => {
    const exit = trade.exitPrice || prices[trade.stock] || trade.entryPrice
    const diff = trade.type === 'BUY' ? exit - trade.entryPrice : trade.entryPrice - exit
    return diff * trade.qty
  }

  const getPnLPct = (trade) => {
    const exit = trade.exitPrice || prices[trade.stock] || trade.entryPrice
    const diff = trade.type === 'BUY' ? exit - trade.entryPrice : trade.entryPrice - exit
    return ((diff / trade.entryPrice) * 100).toFixed(2)
  }

  const openTrades  = trades.filter(t => t.status === 'OPEN')
  const closedTrades = trades.filter(t => t.status === 'CLOSED')
  const totalPnL    = trades.reduce((sum, t) => sum + getPnL(t), 0)
  const openPnL     = openTrades.reduce((sum, t) => sum + getPnL(t), 0)
  const realizedPnL = closedTrades.reduce((sum, t) => sum + getPnL(t), 0)
  const winTrades   = closedTrades.filter(t => getPnL(t) > 0).length
  const winRate     = closedTrades.length > 0 ? Math.round((winTrades / closedTrades.length) * 100) : 0

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #e0e0e0', fontSize: '14px',
    marginTop: '5px', marginBottom: '12px', background: '#fff',
    color: '#1a1a1a'
  }

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Paper Trading</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
          Log and track trades with real NSE prices — zero real money at risk
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Total P&L',     value: `${totalPnL >= 0 ? '+' : ''}₹${Math.round(totalPnL).toLocaleString('en-IN')}`,    up: totalPnL >= 0 },
          { label: 'Unrealised P&L', value: `${openPnL >= 0 ? '+' : ''}₹${Math.round(openPnL).toLocaleString('en-IN')}`,     up: openPnL >= 0 },
          { label: 'Realised P&L',  value: `${realizedPnL >= 0 ? '+' : ''}₹${Math.round(realizedPnL).toLocaleString('en-IN')}`, up: realizedPnL >= 0 },
          { label: 'Win Rate',      value: `${winRate}%`,  up: winRate >= 50 },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{c.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: c.up ? '#00b386' : '#e05252' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>

        {/* Log Trade Form */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px' }}>Log New Trade</h2>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>STOCK</label>
          <select value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} style={inputStyle}>
            {STOCKS.map(s => <option key={s}>{s}</option>)}
          </select>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>TYPE</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '5px', marginBottom: '12px' }}>
            {['BUY','SELL'].map(t => (
              <button key={t} onClick={() => setForm({...form, type: t})} style={{
                flex: 1, padding: '9px', borderRadius: '8px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
                background: form.type === t ? (t === 'BUY' ? '#00b386' : '#e05252') : '#fff',
                color: form.type === t ? '#fff' : '#888',
                border: `1px solid ${form.type === t ? (t === 'BUY' ? '#00b386' : '#e05252') : '#e0e0e0'}`
              }}>{t}</button>
            ))}
          </div>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>
            ENTRY PRICE (₹)
            {prices[form.stock] && (
              <span
                onClick={() => setForm({...form, price: prices[form.stock]})}
                style={{ color: '#00b386', cursor: 'pointer', marginLeft: '8px', fontWeight: '600' }}>
                Use live: ₹{prices[form.stock]?.toLocaleString('en-IN')}
              </span>
            )}
          </label>
          <input
            type="number" value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            placeholder="Enter price" style={inputStyle}
          />

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>QUANTITY</label>
          <input
            type="number" value={form.qty}
            onChange={e => setForm({...form, qty: e.target.value})}
            placeholder="No. of shares" style={inputStyle}
          />

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>NOTE (optional)</label>
          <input
            type="text" value={form.note}
            onChange={e => setForm({...form, note: e.target.value})}
            placeholder="e.g. RSI signal, support level" style={inputStyle}
          />

          {form.price && form.qty && (
            <div style={{ background: '#f7fffe', border: '1px solid #e0faf5', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>Trade Value</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
                ₹{(parseFloat(form.price) * parseInt(form.qty || 0)).toLocaleString('en-IN')}
              </div>
            </div>
          )}

          <button onClick={addTrade} style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: '#00b386', color: '#fff', fontSize: '15px',
            fontWeight: '600', border: 'none', cursor: 'pointer'
          }}>
            Log Trade
          </button>
        </div>

        {/* Trades Table */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '8px', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
              {['open','closed'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '6px 16px', borderRadius: '20px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer', border: '1px solid',
                  background: activeTab === tab ? '#00b386' : '#fff',
                  color: activeTab === tab ? '#fff' : '#888',
                  borderColor: activeTab === tab ? '#00b386' : '#e0e0e0'
                }}>{tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'open' ? openTrades.length : closedTrades.length})</button>
              ))}
              {loadingPrices && <span style={{ fontSize: '12px', color: '#888', alignSelf: 'center', marginLeft: '8px' }}>⏳ Loading live prices...</span>}
            </div>

            {(activeTab === 'open' ? openTrades : closedTrades).length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>
                  {activeTab === 'open' ? 'No open trades yet' : 'No closed trades yet'}
                </div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>
                  {activeTab === 'open' ? 'Log a trade using the form on the left' : 'Close an open trade to see it here'}
                </div>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Stock','Type','Entry','Qty','Value','CMP','P&L','P&L %', activeTab === 'open' ? 'Action' : 'Exit Date'].map(h => (
                      <th key={h} style={{
                        padding: '11px 16px', fontSize: '11px', fontWeight: '600',
                        color: '#888', textAlign: 'left', textTransform: 'uppercase',
                        letterSpacing: '0.5px', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'open' ? openTrades : closedTrades).map((trade, i) => {
                    const pnl    = getPnL(trade)
                    const pnlPct = getPnLPct(trade)
                    const cmp    = trade.exitPrice || prices[trade.stock] || trade.entryPrice
                    return (
                      <tr key={trade.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ fontWeight: '600', fontSize: '13px' }}>{trade.stock}</div>
                          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{trade.date} · {trade.note}</div>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span style={{
                            background: trade.type === 'BUY' ? '#e6faf5' : '#fef0f0',
                            color: trade.type === 'BUY' ? '#00b386' : '#e05252',
                            fontSize: '12px', fontWeight: '700',
                            padding: '3px 8px', borderRadius: '5px'
                          }}>{trade.type}</span>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: '13px' }}>₹{trade.entryPrice.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13px' }}>{trade.qty}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13px' }}>₹{(trade.entryPrice * trade.qty).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13px' }}>₹{cmp?.toLocaleString('en-IN') || '—'}</td>
                        <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '600', color: pnl >= 0 ? '#00b386' : '#e05252' }}>
                          {pnl >= 0 ? '+' : ''}₹{Math.round(pnl).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '600', color: pnlPct >= 0 ? '#00b386' : '#e05252' }}>
                          {pnlPct >= 0 ? '+' : ''}{pnlPct}%
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          {activeTab === 'open' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button onClick={() => closeTrade(trade.id)} style={{
                                padding: '5px 12px', fontSize: '12px', fontWeight: '600',
                                borderRadius: '6px', border: '1px solid #00b386',
                                background: '#fff', color: '#00b386', cursor: 'pointer'
                              }}>Close</button>
                              <button onClick={() => deleteTrade(trade.id)} style={{
                                padding: '5px 12px', fontSize: '12px', fontWeight: '600',
                                borderRadius: '6px', border: '1px solid #e0e0e0',
                                background: '#fff', color: '#e05252', cursor: 'pointer'
                              }}>Delete</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#888' }}>{trade.exitDate}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaperTrading