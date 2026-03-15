import { useState, useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

const STOCKS = ['RELIANCE','HDFCBANK','TCS','INFY','WIPRO','ICICIBANK','ADANIENT','BAJFINANCE','NIFTY50','BANKNIFTY']

function Charts() {
  const [ticker, setTicker]     = useState('NIFTY50')
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [activeIndicator, setActiveIndicator] = useState('RSI')

  const priceRef = useRef(null)
  const indicatorRef = useRef(null)
  const priceChart = useRef(null)
  const indicatorChart = useRef(null)

  const fetchChart = async (t) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/chart/${t}`)
      const d = await res.json()
      setData(d)
    } catch(e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchChart(ticker) }, [ticker])

  useEffect(() => {
    if (!data || !priceRef.current || !indicatorRef.current) return

    // Cleanup old charts
    if (priceChart.current) priceChart.current.remove()
    if (indicatorChart.current) indicatorChart.current.remove()

    const chartOpts = {
      layout: { background: { color: '#fff' }, textColor: '#1a1a1a' },
      grid: { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
      rightPriceScale: { borderColor: '#f0f0f0' },
      timeScale: { borderColor: '#f0f0f0', timeVisible: true },
      crosshair: { mode: 1 },
    }

    // Price chart
    priceChart.current = createChart(priceRef.current, { ...chartOpts, height: 320 })
    const lineSeries = priceChart.current.addLineSeries({ color: '#00b386', lineWidth: 2 })
    const priceData = data.dates.map((d, i) => ({ time: d, value: data.prices[i] })).filter(p => p.value)
    lineSeries.setData(priceData)

    // Indicator chart
    indicatorChart.current = createChart(indicatorRef.current, { ...chartOpts, height: 180 })

    if (activeIndicator === 'RSI') {
      const rsiSeries = indicatorChart.current.addLineSeries({ color: '#5555cc', lineWidth: 1.5 })
      const rsiData = data.dates.map((d, i) => data.rsi[i] != null ? ({ time: d, value: data.rsi[i] }) : null).filter(Boolean)
      rsiSeries.setData(rsiData)
      // Overbought/oversold lines
      const ob = indicatorChart.current.addLineSeries({ color: '#e05252', lineWidth: 1, lineStyle: 2 })
      const os = indicatorChart.current.addLineSeries({ color: '#00b386', lineWidth: 1, lineStyle: 2 })
      ob.setData(data.dates.map(d => ({ time: d, value: 70 })))
      os.setData(data.dates.map(d => ({ time: d, value: 30 })))
    } else if (activeIndicator === 'MACD') {
      const macdSeries   = indicatorChart.current.addLineSeries({ color: '#185FA5', lineWidth: 1.5 })
      const signalSeries = indicatorChart.current.addLineSeries({ color: '#e05252', lineWidth: 1.5 })
      const histSeries   = indicatorChart.current.addHistogramSeries({ color: '#00b386' })
      macdSeries.setData(data.dates.map((d,i) => ({ time: d, value: data.macd[i] })))
      signalSeries.setData(data.dates.map((d,i) => ({ time: d, value: data.macd_signal[i] })))
      histSeries.setData(data.dates.map((d,i) => ({ time: d, value: data.macd_hist[i], color: data.macd_hist[i] >= 0 ? '#00b386' : '#e05252' })))
    }

    // Sync crosshair
    priceChart.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
      indicatorChart.current.timeScale().setVisibleLogicalRange(range)
    })
    indicatorChart.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
      priceChart.current.timeScale().setVisibleLogicalRange(range)
    })

    priceChart.current.timeScale().fitContent()
    indicatorChart.current.timeScale().fitContent()

  }, [data, activeIndicator])

  // Responsive resize
  useEffect(() => {
    const handleResize = () => {
      if (priceChart.current && priceRef.current)
        priceChart.current.applyOptions({ width: priceRef.current.clientWidth })
      if (indicatorChart.current && indicatorRef.current)
        indicatorChart.current.applyOptions({ width: indicatorRef.current.clientWidth })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const currentPrice = data?.prices?.[data.prices.length - 1]
  const prevPrice    = data?.prices?.[data.prices.length - 2]
  const change       = currentPrice && prevPrice ? ((currentPrice - prevPrice) / prevPrice * 100).toFixed(2) : null
  const currentRsi   = data?.rsi?.filter(Boolean).slice(-1)[0]

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Charts</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Price chart with technical indicators</p>
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
        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', alignItems: 'baseline' }}>
          <span style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>₹{currentPrice.toLocaleString('en-IN')}</span>
          {change && <span style={{ fontSize: '16px', fontWeight: '600', color: parseFloat(change) >= 0 ? '#00b386' : '#e05252' }}>
            {change >= 0 ? '+' : ''}{change}%
          </span>}
          {currentRsi && <span style={{ fontSize: '14px', color: '#888' }}>
            RSI: <strong style={{ color: currentRsi > 65 ? '#e05252' : currentRsi < 35 ? '#00b386' : '#f5a623' }}>{currentRsi}</strong>
          </span>}
        </div>
      )}

      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '80px', textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>Loading chart data...</div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '20px' }}>
          <div ref={priceRef} style={{ width: '100%' }} />

          <div style={{ display: 'flex', gap: '8px', margin: '16px 0 8px' }}>
            <span style={{ fontSize: '12px', color: '#888', alignSelf: 'center' }}>Indicator:</span>
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

          <div ref={indicatorRef} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  )
}

export default Charts