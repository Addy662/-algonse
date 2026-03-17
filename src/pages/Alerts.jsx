import { useState, useEffect } from 'react'
import API_BASE from '../config'

function Alerts() {
  const [alerts, setAlerts]   = useState([])
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const checkAlerts = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API_BASE}/api/alerts/check`)
      const data = await res.json()
      setAlerts(data)
      setLastChecked(new Date().toLocaleTimeString('en-IN'))
    } catch(e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkAlerts()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(checkAlerts, 60000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const buyAlerts  = alerts.filter(a => a.signal === 'BUY')
  const sellAlerts = alerts.filter(a => a.signal === 'SELL')

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Signal Alerts</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            {lastChecked ? `Last checked at ${lastChecked}` : 'Checking signals...'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555' }}>
            <span>Auto-refresh (1 min)</span>
            <div onClick={() => setAutoRefresh(a => !a)} style={{
              width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
              background: autoRefresh ? '#00b386' : '#e0e0e0',
              position: 'relative', transition: 'background 0.2s'
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '2px', transition: 'left 0.2s',
                left: autoRefresh ? '20px' : '2px'
              }} />
            </div>
          </div>
          <button onClick={checkAlerts} disabled={loading} style={{
            padding: '9px 18px', borderRadius: '8px', fontSize: '13px',
            fontWeight: '600', background: '#00b386', color: '#fff',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Checking...' : 'Check Now'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>Total Signals</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>{alerts.length}</div>
        </div>
        <div style={{ background: '#e6faf5', border: '1px solid #b2eada', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#00b386', marginBottom: '6px' }}>BUY Signals</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#00b386' }}>{buyAlerts.length}</div>
        </div>
        <div style={{ background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ fontSize: '12px', color: '#e05252', marginBottom: '6px' }}>SELL Signals</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#e05252' }}>{sellAlerts.length}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>Scanning 20 stocks for signals...</div>
        </div>
      ) : alerts.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>No strong signals right now</div>
          <div style={{ fontSize: '14px', color: '#888' }}>Market is in HOLD territory — check back later</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {alerts.map((alert, i) => (
            <div key={i} style={{
              background: '#fff', border: `1.5px solid ${alert.signal === 'BUY' ? '#b2eada' : '#f5c0c0'}`,
              borderRadius: '12px', padding: '18px 20px',
              borderLeft: `4px solid ${alert.signal === 'BUY' ? '#00b386' : '#e05252'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '16px', color: '#1a1a1a', marginBottom: '4px' }}>{alert.stock}</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{alert.date} · {alert.time}</div>
                </div>
                <span style={{
                  background: alert.signal === 'BUY' ? '#e6faf5' : '#fef0f0',
                  color: alert.signal === 'BUY' ? '#00b386' : '#e05252',
                  fontSize: '13px', fontWeight: '700',
                  padding: '5px 12px', borderRadius: '6px'
                }}>{alert.signal}</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>PRICE</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>₹{alert.price?.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '2px' }}>RSI</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: alert.rsi < 35 ? '#00b386' : alert.rsi > 65 ? '#e05252' : '#f5a623' }}>{alert.rsi}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Alerts