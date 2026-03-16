import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const STOCKS = [
  'RELIANCE','HDFCBANK','TCS','INFY','WIPRO','ICICIBANK','ADANIENT',
  'BAJFINANCE','TATAMOTORS','AXISBANK','KOTAKBANK','SBIN','ITC',
  'HINDUNILVR','MARUTI','TITAN','SUNPHARMA','BHARTIARTL','NTPC',
  'ONGC','TECHM','HCLTECH','JSWSTEEL','TATASTEEL','LT','ZOMATO',
  'IRCTC','NYKAA','PAYTM','BAJAJ-AUTO',
]
const INDICES = ['NIFTY50','BANKNIFTY','NIFTYIT','NIFTYPHARMA','NIFTYAUTO']

function Charts() {
  const location = useLocation()
  const params   = new URLSearchParams(location.search)
  const initStock = params.get('stock') || 'NIFTY50'

  const [ticker, setTicker] = useState(initStock)
  const [interval, setInterval] = useState('D')
  const [theme, setTheme]   = useState('light')
  const containerRef = useRef(null)

  const tvSymbol = (t) => {
    const indices = { 'NIFTY50': 'NSE:NIFTY', 'BANKNIFTY': 'NSE:BANKNIFTY', 'NIFTYIT': 'NSE:NIFTYIT', 'NIFTYPHARMA': 'NSE:CNXPHARMA', 'NIFTYAUTO': 'NSE:CNXAUTO', 'SENSEX': 'BSE:SENSEX' }
    return indices[t] || `NSE:${t}`
  }

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      new window.TradingView.widget({
        container_id: 'tv_chart_container',
        symbol: tvSymbol(ticker),
        interval: interval,
        timezone: 'Asia/Kolkata',
        theme: theme,
        style: '1',
        locale: 'en',
        toolbar_bg: theme === 'light' ? '#ffffff' : '#1a1a1a',
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: true,
        height: 600,
        width: '100%',
        studies: [
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies',
          'BB@tv-basicstudies',
        ],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        withdateranges: true,
        hide_side_toolbar: false,
        details: true,
        hotlist: true,
        calendar: true,
      })
    }
    containerRef.current.appendChild(script)

    return () => { if (containerRef.current) containerRef.current.innerHTML = '' }
  }, [ticker, interval, theme])

  return (
    <div style={{ padding: '24px 5%', maxWidth: '1400px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Charts</h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Full featured charts — 100+ indicators, drawing tools, Fibonacci, trendlines</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['1','5','15','60','D','W'].map(i => (
            <button key={i} onClick={() => setInterval(i)} style={{
              padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
              fontWeight: '500', cursor: 'pointer', border: '1px solid',
              background: interval === i ? '#1a1a1a' : '#fff',
              color: interval === i ? '#fff' : '#555',
              borderColor: interval === i ? '#1a1a1a' : '#e0e0e0'
            }}>{i === 'D' ? '1D' : i === 'W' ? '1W' : `${i}m`}</button>
          ))}
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{
            padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
            fontWeight: '500', cursor: 'pointer', border: '1px solid #e0e0e0',
            background: '#fff', color: '#555'
          }}>{theme === 'light' ? '🌙 Dark' : '☀️ Light'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#888', alignSelf: 'center', fontWeight: '600' }}>INDICES:</span>
        {INDICES.map(s => (
          <button key={s} onClick={() => setTicker(s)} style={{
            padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
            fontWeight: '500', cursor: 'pointer', border: '1px solid',
            background: ticker === s ? '#1a1a1a' : '#fff',
            color: ticker === s ? '#fff' : '#555',
            borderColor: ticker === s ? '#1a1a1a' : '#e0e0e0'
          }}>{s}</button>
        ))}
        <span style={{ fontSize: '12px', color: '#888', alignSelf: 'center', fontWeight: '600', marginLeft: '8px' }}>STOCKS:</span>
        {STOCKS.slice(0,15).map(s => (
          <button key={s} onClick={() => setTicker(s)} style={{
            padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
            fontWeight: '500', cursor: 'pointer', border: '1px solid',
            background: ticker === s ? '#00b386' : '#fff',
            color: ticker === s ? '#fff' : '#555',
            borderColor: ticker === s ? '#00b386' : '#e0e0e0'
          }}>{s}</button>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
        <div id="tv_chart_container" ref={containerRef} style={{ width: '100%' }} />
      </div>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
        Powered by TradingView · All indicators, drawing tools, Fibonacci and fullscreen available inside the chart
      </div>
    </div>
  )
}

export default Charts