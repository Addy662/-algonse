import { useState, useEffect } from 'react'
import API_BASE from '../config'

const TABS = ['Overview', 'Positions', 'Orders', 'Trades', 'Place Order']

function Broker() {
  const [token, setToken]         = useState(localStorage.getItem('kite_token') || null)
  const [userId, setUserId]       = useState(localStorage.getItem('kite_user_id') || null)
  const [profile, setProfile]     = useState(null)
  const [pnl, setPnl]             = useState(null)
  const [positions, setPositions] = useState([])
  const [orders, setOrders]       = useState([])
  const [trades, setTrades]       = useState([])
  const [loading, setLoading]     = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const [orderForm, setOrderForm] = useState({
    symbol: 'RELIANCE', exchange: 'NSE', transaction: 'BUY',
    quantity: 1, order_type: 'MARKET', product: 'MIS', price: 0
  })
  const [orderMsg, setOrderMsg]   = useState(null)

  // Check for token in URL after Zerodha redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t      = params.get('token')
    const uid    = params.get('user_id')
    const err    = params.get('error')
    if (t) {
      localStorage.setItem('kite_token', t)
      localStorage.setItem('kite_user_id', uid)
      setToken(t)
      setUserId(uid)
      window.history.replaceState({}, '', '/broker')
    }
    if (err) {
      console.error('Zerodha error:', err)
    }
  }, [])

  const headers = { 'X-Kite-Token': token }

  const fetchAll = async () => {
    if (!token) return
    setLoading(true)
    try {
      const [profRes, pnlRes, posRes, ordRes, traRes] = await Promise.all([
        fetch(`${API_BASE}/api/broker/profile`,   { headers }),
        fetch(`${API_BASE}/api/broker/pnl`,       { headers }),
        fetch(`${API_BASE}/api/broker/positions`, { headers }),
        fetch(`${API_BASE}/api/broker/orders`,    { headers }),
        fetch(`${API_BASE}/api/broker/trades`,    { headers }),
      ])
      setProfile(await profRes.json())
      setPnl(await pnlRes.json())
      setPositions(await posRes.json())
      setOrders(await ordRes.json())
      setTrades(await traRes.json())
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { if (token) fetchAll() }, [token])

  const loginZerodha = async () => {
    const res  = await fetch(`${API_BASE}/api/broker/login-url`)
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const logout = () => {
    localStorage.removeItem('kite_token')
    localStorage.removeItem('kite_user_id')
    setToken(null)
    setProfile(null)
    setPnl(null)
    setPositions([])
    setOrders([])
    setTrades([])
  }

  const placeOrder = async () => {
    setOrderMsg(null)
    try {
      const res  = await fetch(`${API_BASE}/api/broker/place-order`, {
        method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm)
      })
      const data = await res.json()
      if (data.error) { setOrderMsg({ type: 'error', text: data.error }); return }
      setOrderMsg({ type: 'success', text: `Order placed! ID: ${data.order_id}` })
      fetchAll()
    } catch(e) {
      setOrderMsg({ type: 'error', text: 'Failed to place order' })
    }
  }

  const tabStyle = (t) => ({
    padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer', border: '1px solid',
    background: activeTab === t ? '#1a1a1a' : '#fff',
    color: activeTab === t ? '#fff' : '#888',
    borderColor: activeTab === t ? '#1a1a1a' : '#e0e0e0'
  })

  const inp = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #e0e0e0', fontSize: '14px',
    marginTop: '5px', marginBottom: '12px',
    boxSizing: 'border-box', background: '#fff'
  }

  // ── Not connected ──────────────────────────────────────────────
  if (!token) return (
    <div style={{ padding: '32px 5%', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Broker Connection</h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>Connect your Zerodha account to view positions, P&L, orders and place trades directly.</p>

      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Connect Zerodha</h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px', lineHeight: '1.7' }}>
          You'll be redirected to Zerodha's secure login page. After logging in, you'll be brought back to AlgoNSE automatically.
        </p>
        <button onClick={loginZerodha} style={{
          padding: '14px 32px', borderRadius: '10px', background: '#387ed1',
          color: '#fff', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer'
        }}>
          Login with Zerodha
        </button>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
          Powered by Zerodha Kite Connect API · Your credentials are never stored
        </div>
      </div>
    </div>
  )

  // ── Connected ──────────────────────────────────────────────────
  return (
    <div style={{ padding: '32px 5%', maxWidth: '1300px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Broker · Zerodha</h1>
          {profile && !profile.error && (
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
              {profile.user_name} · {profile.user_id} · {profile.email}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchAll} disabled={loading} style={{
            padding: '9px 18px', borderRadius: '8px', background: '#00b386',
            color: '#fff', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer'
          }}>{loading ? 'Refreshing...' : 'Refresh'}</button>
          <button onClick={logout} style={{
            padding: '9px 18px', borderRadius: '8px', background: '#fff',
            color: '#e05252', fontSize: '13px', fontWeight: '600',
            border: '1px solid #e05252', cursor: 'pointer'
          }}>Disconnect</button>
        </div>
      </div>

      {/* P&L Summary */}
      {pnl && !pnl.error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: "Today's P&L",    value: `${pnl.total_pnl >= 0 ? '+' : ''}₹${pnl.total_pnl?.toLocaleString('en-IN')}`,      color: pnl.total_pnl >= 0 ? '#00b386' : '#e05252' },
            { label: 'Realised',       value: `${pnl.realised_pnl >= 0 ? '+' : ''}₹${pnl.realised_pnl?.toLocaleString('en-IN')}`,  color: pnl.realised_pnl >= 0 ? '#00b386' : '#e05252' },
            { label: 'Unrealised',     value: `${pnl.unrealised_pnl >= 0 ? '+' : ''}₹${pnl.unrealised_pnl?.toLocaleString('en-IN')}`, color: pnl.unrealised_pnl >= 0 ? '#00b386' : '#e05252' },
            { label: 'Win Rate',       value: `${pnl.win_rate}%`,  color: pnl.win_rate >= 50 ? '#00b386' : '#e05252' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{c.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Margin */}
      {profile && !profile.error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Available Equity Margin</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>₹{profile.equity_margin?.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Available Commodity Margin</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>₹{profile.commodity_margin?.toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {TABS.map(t => <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>{t}</button>)}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'Overview' && (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Open Positions Summary</h3>
          {positions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No open positions today</div>
          ) : positions.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < positions.length-1 ? '1px solid #f5f5f5' : 'none' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{p.symbol}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{p.exchange} · {p.product} · {p.type} {Math.abs(p.quantity)} qty</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', color: p.pnl >= 0 ? '#00b386' : '#e05252' }}>
                  {p.pnl >= 0 ? '+' : ''}₹{p.pnl?.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>LTP ₹{p.ltp} · Avg ₹{p.avg_price}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POSITIONS */}
      {activeTab === 'Positions' && (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Symbol','Exchange','Product','Type','Qty','Avg Price','LTP','Value','P&L','P&L %'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No open positions</td></tr>
              ) : positions.map((p, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '600', fontSize: '13px' }}>{p.symbol}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#888' }}>{p.exchange}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px' }}>{p.product}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: p.type==='LONG'?'#e6faf5':'#fef0f0', color: p.type==='LONG'?'#00b386':'#e05252', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px' }}>{Math.abs(p.quantity)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px' }}>₹{p.avg_price}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px' }}>₹{p.ltp}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px' }}>₹{p.value?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: p.pnl>=0?'#00b386':'#e05252' }}>
                    {p.pnl>=0?'+':''}₹{p.pnl?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', color: p.pnl_pct>=0?'#00b386':'#e05252' }}>
                    {p.pnl_pct>=0?'+':''}{p.pnl_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ORDERS */}
      {activeTab === 'Orders' && (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Symbol','Type','Order Type','Product','Qty','Price','Avg Price','Status','Time'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No orders today</td></tr>
              ) : orders.map((o, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                  <td style={{ padding: '11px 14px', fontWeight: '600', fontSize: '13px' }}>{o.symbol}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ background: o.transaction==='BUY'?'#e6faf5':'#fef0f0', color: o.transaction==='BUY'?'#00b386':'#e05252', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>{o.transaction}</span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#555' }}>{o.order_type}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#555' }}>{o.product}</td>
                  <td style={{ padding: '11px 14px', fontSize: '13px' }}>{o.quantity}</td>
                  <td style={{ padding: '11px 14px', fontSize: '13px' }}>₹{o.price || '—'}</td>
                  <td style={{ padding: '11px 14px', fontSize: '13px' }}>₹{o.avg_price || '—'}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      background: o.status==='COMPLETE'?'#e6faf5':o.status==='REJECTED'?'#fef0f0':'#fff8ed',
                      color: o.status==='COMPLETE'?'#00b386':o.status==='REJECTED'?'#e05252':'#f5a623',
                      fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px'
                    }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#888' }}>{o.placed_at?.slice(11,16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TRADES */}
      {activeTab === 'Trades' && (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Symbol','Exchange','Type','Product','Qty','Price','Filled At'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No trades today</td></tr>
              ) : trades.map((t, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                  <td style={{ padding: '11px 14px', fontWeight: '600', fontSize: '13px' }}>{t.symbol}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#888' }}>{t.exchange}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ background: t.transaction==='BUY'?'#e6faf5':'#fef0f0', color: t.transaction==='BUY'?'#00b386':'#e05252', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>{t.transaction}</span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px' }}>{t.product}</td>
                  <td style={{ padding: '11px 14px', fontSize: '13px' }}>{t.quantity}</td>
                  <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: '600' }}>₹{t.price}</td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#888' }}>{t.filled_at?.slice(11,16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PLACE ORDER */}
      {activeTab === 'Place Order' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px' }}>Place New Order</h2>

            <div style={{ background: '#fff8ed', border: '1px solid #fde9b2', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#854F0B', marginBottom: '16px' }}>
              ⚠️ This places a REAL order in your Zerodha account. Double-check before submitting.
            </div>

            {orderMsg && (
              <div style={{ background: orderMsg.type==='success'?'#e6faf5':'#fef0f0', border: `1px solid ${orderMsg.type==='success'?'#b2eada':'#f5c0c0'}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: orderMsg.type==='success'?'#00b386':'#e05252', marginBottom: '14px' }}>
                {orderMsg.type==='success'?'✅':'⚠️'} {orderMsg.text}
              </div>
            )}

            <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Symbol</label>
            <input style={inp} value={orderForm.symbol} onChange={e => setOrderForm({...orderForm, symbol: e.target.value.toUpperCase()})} placeholder="e.g. RELIANCE, NIFTY24DEC23000CE" />

            <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Exchange</label>
            <select style={inp} value={orderForm.exchange} onChange={e => setOrderForm({...orderForm, exchange: e.target.value})}>
              <option>NSE</option><option>BSE</option><option>NFO</option><option>BFO</option><option>MCX</option>
            </select>

            <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Transaction</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px', marginBottom: '12px' }}>
              {['BUY','SELL'].map(t => (
                <button key={t} onClick={() => setOrderForm({...orderForm, transaction: t})} style={{
                  flex: 1, padding: '9px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  background: orderForm.transaction===t ? (t==='BUY'?'#00b386':'#e05252') : '#fff',
                  color: orderForm.transaction===t ? '#fff' : '#888',
                  border: `1px solid ${orderForm.transaction===t ? (t==='BUY'?'#00b386':'#e05252') : '#e0e0e0'}`
                }}>{t}</button>
              ))}
            </div>

            <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Order Type</label>
            <select style={inp} value={orderForm.order_type} onChange={e => setOrderForm({...orderForm, order_type: e.target.value})}>
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
              <option value="SL">SL (Stop Loss)</option>
              <option value="SL-M">SL-M (Stop Loss Market)</option>
            </select>

            <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Product</label>
            <select style={inp} value={orderForm.product} onChange={e => setOrderForm({...orderForm, product: e.target.value})}>
              <option value="MIS">MIS (Intraday)</option>
              <option value="CNC">CNC (Delivery)</option>
              <option value="NRML">NRML (F&O)</option>
            </select>

            <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Quantity</label>
            <input style={inp} type="number" value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})} min="1" />

            {orderForm.order_type !== 'MARKET' && (
              <>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Price (₹)</label>
                <input style={inp} type="number" value={orderForm.price} onChange={e => setOrderForm({...orderForm, price: parseFloat(e.target.value)})} step="0.05" />
              </>
            )}

            <button onClick={placeOrder} style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: orderForm.transaction==='BUY'?'#00b386':'#e05252',
              color: '#fff', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer'
            }}>
              Place {orderForm.transaction} Order
            </button>
          </div>

          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Recent Orders</h3>
            {orders.slice(0,10).map((o, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i<9?'1px solid #f5f5f5':'none' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{o.symbol}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{o.order_type} · {o.product} · {o.quantity} qty</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: o.transaction==='BUY'?'#e6faf5':'#fef0f0', color: o.transaction==='BUY'?'#00b386':'#e05252', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>{o.transaction}</span>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Broker