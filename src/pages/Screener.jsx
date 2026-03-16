import API_BASE from '../config'
import { useState, useEffect } from 'react'

function Screener() {
  const [stocks, setStocks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    signal: 'ALL',
    rsiMin: 0,
    rsiMax: 100,
    macd: 'ALL',
    bb: 'ALL',
  })
  const [sort, setSort] = useState({ key: 'name', dir: 1 })

  useEffect(() => {
    fetch('${API_BASE}/api/screener')
      .then(r => r.json())
      .then(d => { setStocks(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = stocks
    .filter(s => filters.signal === 'ALL' || s.signal === filters.signal)
    .filter(s => s.rsi >= filters.rsiMin && s.rsi <= filters.rsiMax)
    .filter(s => filters.macd === 'ALL' || (filters.macd === 'BULL' ? s.macd > s.macd_signal : s.macd < s.macd_signal))
    .filter(s => {
      if (filters.bb === 'ALL') return true
      if (filters.bb === 'ABOVE') return s.price > s.bb_upper
      if (filters.bb === 'BELOW') return s.price < s.bb_lower
      return true
    })
    .sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key]
      return typeof av === 'string' ? av.localeCompare(bv) * sort.dir : (av - bv) * sort.dir
    })

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir * -1 } : { key, dir: 1 })
  }

  const signalColor = {
    BUY:  { bg: '#e6faf5', color: '#00b386' },
    SELL: { bg: '#fef0f0', color: '#e05252' },
    HOLD: { bg: '#fff8ed', color: '#f5a623' },
  }

  const selectStyle = {
    padding: '8px 12px', borderRadius: '8px', border: '1px solid #e0e0e0',
    fontSize: '13px', background: '#fff', color: '#1a1a1a', cursor: 'pointer'
  }

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Stock Screener</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Filter stocks by technical indicators in real time</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '20px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>Signal</div>
            <select value={filters.signal} onChange={e => setFilters({...filters, signal: e.target.value})} style={selectStyle}>
              <option value="ALL">All Signals</option>
              <option value="BUY">BUY only</option>
              <option value="SELL">SELL only</option>
              <option value="HOLD">HOLD only</option>
            </select>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>RSI Range</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input type="number" value={filters.rsiMin} onChange={e => setFilters({...filters, rsiMin: +e.target.value})}
                style={{ ...selectStyle, width: '64px' }} min="0" max="100" />
              <span style={{ fontSize: '13px', color: '#888' }}>to</span>
              <input type="number" value={filters.rsiMax} onChange={e => setFilters({...filters, rsiMax: +e.target.value})}
                style={{ ...selectStyle, width: '64px' }} min="0" max="100" />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>MACD</div>
            <select value={filters.macd} onChange={e => setFilters({...filters, macd: e.target.value})} style={selectStyle}>
              <option value="ALL">All</option>
              <option value="BULL">Bullish</option>
              <option value="BEAR">Bearish</option>
            </select>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>Bollinger Band</div>
            <select value={filters.bb} onChange={e => setFilters({...filters, bb: e.target.value})} style={selectStyle}>
              <option value="ALL">All</option>
              <option value="ABOVE">Above upper band</option>
              <option value="BELOW">Below lower band</option>
            </select>
          </div>

          <button onClick={() => setFilters({ signal: 'ALL', rsiMin: 0, rsiMax: 100, macd: 'ALL', bb: 'ALL' })} style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0',
            fontSize: '13px', background: '#fff', color: '#888', cursor: 'pointer'
          }}>Reset</button>

          <div style={{ marginLeft: 'auto', background: '#e6faf5', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#00b386', fontWeight: '600' }}>
            {filtered.length} stocks match
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a' }}>Loading live data...</div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {[
                  { label: 'Stock',      key: 'name'       },
                  { label: 'Price (₹)',  key: 'price'      },
                  { label: 'Change %',   key: 'change'     },
                  { label: 'Vol Ratio',  key: 'vol_ratio'  },
                  { label: 'RSI',        key: 'rsi'        },
                  { label: 'MACD Trend', key: 'macd'       },
                  { label: 'BB Position',key: 'bb_upper'   },
                  { label: 'Signal',     key: 'signal'     },
                  { label: 'Confidence', key: 'confidence' },
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: s.vol_ratio > 1.5 ? '#00b386' : '#888', fontWeight: s.vol_ratio > 1.5 ? '600' : '400' }}>
  {s.vol_ratio}x
</td>
                ].map(h => (
                  <th key={h.key} onClick={() => toggleSort(h.key)} style={{
                    padding: '12px 16px', fontSize: '11px', fontWeight: '600',
                    color: '#888', textAlign: 'left', textTransform: 'uppercase',
                    letterSpacing: '0.5px', cursor: 'pointer', whiteSpace: 'nowrap',
                    userSelect: 'none'
                  }}>
                    {h.label} {sort.key === h.key ? (sort.dir === 1 ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No stocks match your filters</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.name} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '13px 16px', fontWeight: '600', fontSize: '14px' }}>{s.name}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px' }}>₹{s.price?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', fontWeight: '500', color: s.change >= 0 ? '#00b386' : '#e05252' }}>
                    {s.change >= 0 ? '+' : ''}{s.change}%
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '50px', height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.rsi}%`, height: '100%', background: s.rsi > 65 ? '#e05252' : s.rsi < 40 ? '#00b386' : '#f5a623' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{s.rsi}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '13px', color: s.macd > s.macd_signal ? '#00b386' : '#e05252' }}>
                    {s.macd > s.macd_signal ? '▲ Bullish' : '▼ Bearish'}
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: '12px', color: '#666' }}>
                    {s.price > s.bb_upper ? '🔴 Above upper' : s.price < s.bb_lower ? '🟢 Below lower' : '⚪ Inside band'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      background: signalColor[s.signal]?.bg,
                      color: signalColor[s.signal]?.color,
                      fontSize: '12px', fontWeight: '700',
                      padding: '4px 10px', borderRadius: '6px'
                    }}>{s.signal}</span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '50px', height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.confidence}%`, height: '100%', background: '#00b386' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#666' }}>{s.confidence}%</span>
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

export default Screener