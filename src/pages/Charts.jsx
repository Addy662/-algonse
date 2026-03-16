import { useState, useEffect, useRef } from 'react'
import { createChart, LineSeries, HistogramSeries } from 'lightweight-charts'

const STOCKS = ['RELIANCE','HDFCBANK','TCS','INFY','WIPRO','ICICIBANK','ADANIENT','BAJFINANCE','NIFTY50','BANKNIFTY']

function Charts() {
  const [ticker, setTicker]   = useState('NIFTY50')
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeIndicator, setActiveIndicator] = useState('RSI')

  const priceRef   = useRef(null)
  const indRef     = useRef(null)
  const priceChart = useRef(null)
  const indChart   = useRef(null)

  const fetchChart = async (t) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/chart/${t}`)
      const d = await res.json()
      setData(d)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchChart(ticker) }, [ticker])

  useEffect(() => {
    if (!data || !priceRef.current || !indRef.current) return

    if (priceChart.current) { priceChart.current.remove(); priceChart.current = null }
    if (indChart.current)   { indChart.current.remove();   indChart.current = null }

    const w = priceRef.current.clientWidth

    const baseOpts = {
      width: w,
      layout: { background: { color: '#ffffff' }, textColor: '#333' },
      grid:   { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
      timeScale: { timeVisible: true, borderColor: '#e0e0e0' },
      rightPriceScale: { borderColor: '#e0e0e0' },
    }

    // Price chart
    priceChart.current = createChart(priceRef.current, { ...baseOpts, height: 320 })
    const line = priceChart.current.addSeries(LineSeries, { color: '#00b386', lineWidth: 2 })
    line.setData(
      data.dates.map((d, i) => ({ time: d, value: data.prices[i] })).filter(p => p.value != null)
    )
    priceChart.current.timeScale().fitContent()

    // Indicator chart
    indChart.current = createChart(indRef.current, { ...baseOpts, height: 160 })

    if (activeIndicator === 'RSI') {
      const rsi = indChart.current.addSeries(LineSeries, { color: '#5555cc', lineWidth: 1.5 })
      const ob  = indChart.current.addSeries(LineSeries, { color: '#e05252', lineWidth: 1, lineStyle: 2 })
      const os  = indChart.current.addSeries(LineSeries, { color: '#00b386', lineWidth: 1, lineStyle: 2 })
      rsi.setData(data.dates.map((d,i) => data.rsi[i] != null ? { time: d, value: data.rsi[i] } : null).filter(Boolean))
      ob.setData(data.dates.map(d => ({ time: d, value: 70 })))
      os.setData(data.dates.map(d => ({ time: d, value: 30 })))
    } else {
      const macdLine = indChart.current.addSeries(LineSeries,      { color: '#185FA5', lineWidth: 1.5 })
      const sigLine  = indChart.current.addSeries(LineSeries,      { color: '#e05252', lineWidth: 1.5 })
      const hist     = indChart.current.addSeries(HistogramSeries, { color: '#00b386' })
      macdLine.setData(data.dates.map((d,i) => ({ time: d, value: data.macd[i] })))
      sigLine.setData(data.dates.map((d,i)  => ({ time: d, value: data.macd_signal[i] })))
      hist.setData(data.dates.map((d,i)     => ({
        time: d, value: data.macd_hist[i],
        color: data.macd_hist[i] >= 0 ? '#00b386' : '#e05252'
      })))
    }

    indChart.current.timeScale().fitContent()

    priceChart.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
      if (range && indChart.current) indChart.current.timeScale().setVisibleLogicalRange(range)
    })
    indChart.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
      if (range && priceChart.current) priceChart.current.timeScale().setVisibleLogicalRange(range)
    })

  }, [data, activeIndicator])

  useEffect(() => {
    const onResize = () => {
      if (priceChart.current && priceRef.current)
        priceChart.current.applyOptions({ width: priceRef.current.clientWidth })
      if (indChart.current && indRef.current)
        indChart.current.applyOptions({ width: indRef.current.clientWidth })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const currentPrice = data?.prices?.filter(Boolean).slice(-1)[0]
  const prevPrice    = data?.prices?.filter(Boolean).slice(-2)[0]
  const change       = currentPrice && prevPrice ? ((currentPrice - prevPrice) / prevPrice * 100).toFixed(2) : null
  const currentRsi   = data?.rsi?.filter(Boolean).slice(-1)[0]

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Charts</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Live price chart with technical indicators</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {STOCKS.map(s => (
            <button key={s} onClick={() => setTicker(s)} style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
              fontWeight: '500', cursor: 'pointer', border: '1px solid',
              background: ticker === s ? '#00b386' : '#fff',
              color: ticker === s ? '#fff' : '#555',
              borderColor: ticker === s ? '#00b386' : '#e0e0e0'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {currentPrice && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'baseline' }}>
          <span style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>₹{currentPrice.toLocaleString('en-IN')}</span>
          {change && <span style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(change) >= 0 ? '#00b386' : '#e05252' }}>
            {parseFloat(change) >= 0 ? '+' : ''}{change}%
          </span>}
          {currentRsi && <span style={{ fontSize: '14px', color: '#888' }}>
            RSI: <strong style={{ color: currentRsi > 65 ? '#e05252' : currentRsi < 35 ? '#00b386' : '#f5a623' }}>{currentRsi}</strong>
          </span>}
        </div>
      )}

      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '80px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>Loading chart data...</div>
        </div>
      ) : data ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '20px' }}>
          <div ref={priceRef} style={{ width: '100%' }} />
          <div style={{ display: 'flex', gap: '8px', margin: '16px 0 8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Indicator:</span>
            {['RSI','MACD'].map(ind => (
              <button key={ind} onClick={() => setActiveIndicator(ind)} style={{
                padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                fontWeight: '500', cursor: 'pointer', border: '1px solid',
                background: activeIndicator === ind ? '#1a1a1a' : '#fff',
                color: activeIndicator === ind ? '#fff' : '#555',
                borderColor: activeIndicator === ind ? '#1a1a1a' : '#e0e0e0'
              }}>{ind}</button>
            ))}
          </div>
          <div ref={indRef} style={{ width: '100%' }} />
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '80px', textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📡</div>
          <div style={{ fontSize: '15px', color: '#1a1a1a' }}>Make sure Flask backend is running</div>
        </div>
      )}
    </div>
  )
}

export default Charts