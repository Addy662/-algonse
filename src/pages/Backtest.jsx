import { useState } from 'react'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function Backtest() {
  const [stock, setStock]       = useState('RELIANCE')
  const [strategy, setStrategy] = useState('rsi')
  const [capital, setCapital]   = useState(500000)
  const [period, setPeriod]     = useState('1Y')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const runBacktest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`http://localhost:5000/api/backtest/${stock}/${strategy}/${period}`)
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setResult(data)
    } catch (e) {
      setError('Cannot connect to backend. Make sure Python server is running.')
    } finally {
      setLoading(false)
    }
  }

  const finalValue = result ? Math.round(capital * (1 + result.total_return / 100)) : null

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Backtest Engine</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
          Test strategies on real historical NSE data — see actual returns before risking money
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>Configuration</h2>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>STOCK / INDEX</label>
          <select value={stock} onChange={e => setStock(e.target.value)} style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px',
            marginTop: '6px', marginBottom: '16px', background: '#fff'
          }}>
            {['RELIANCE','HDFCBANK','TCS','INFY','WIPRO','ICICIBANK','ADANIENT','BAJFINANCE','NIFTY50','BANKNIFTY'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>STRATEGY</label>
          <select value={strategy} onChange={e => setStrategy(e.target.value)} style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px',
            marginTop: '6px', marginBottom: '16px', background: '#fff'
          }}>
            <option value="rsi">RSI Reversal</option>
            <option value="macd">MACD Crossover</option>
            <option value="ma">Moving Average Cross</option>
            <option value="bb">Bollinger Bands</option>
            <option value="momentum">Momentum Breakout</option>
          </select>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>PERIOD</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', marginBottom: '16px' }}>
            {['3M','6M','1Y','3Y'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer',
                background: period === p ? '#00b386' : '#fff',
                color: period === p ? '#fff' : '#888',
                border: `1px solid ${period === p ? '#00b386' : '#e0e0e0'}`
              }}>{p}</button>
            ))}
          </div>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>CAPITAL (₹)</label>
          <input type="number" value={capital} onChange={e => setCapital(Number(e.target.value))} style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px',
            marginTop: '6px', marginBottom: '24px'
          }} />

          <button onClick={runBacktest} disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: loading ? '#ccc' : '#00b386', color: '#fff',
            fontSize: '15px', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Running backtest...' : 'Run Backtest'}
          </button>

          {error && (
            <div style={{ marginTop: '14px', background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '8px', padding: '12px', color: '#e05252', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        <div>
          {!result && !loading && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '60px', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>Configure and run your backtest</div>
              <div style={{ fontSize: '14px' }}>Results will show real returns based on actual NSE historical data</div>
            </div>
          )}

          {loading && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '60px', textAlign: 'center', color: '#888' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>Running backtest on real data...</div>
              <div style={{ fontSize: '14px' }}>Fetching historical prices and simulating trades</div>
            </div>
          )}

          {result && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Return',   value: `${result.total_return > 0 ? '+' : ''}${result.total_return}%`, color: result.total_return > 0 ? '#00b386' : '#e05252' },
                  { label: 'Final Value',    value: `₹${finalValue.toLocaleString('en-IN')}`, color: '#1a1a1a' },
                  { label: 'Sharpe Ratio',   value: result.sharpe,          color: '#1a1a1a' },
                  { label: 'Max Drawdown',   value: `-${result.max_drawdown}%`, color: '#e05252' },
                  { label: 'Win Rate',       value: `${result.win_rate}%`,  color: '#1a1a1a' },
                  { label: 'Total Trades',   value: result.total_trades,    color: '#1a1a1a' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '18px 20px' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{stat.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>Monthly Returns</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
                  {result.monthly_returns.map((val, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '10px', color: val >= 0 ? '#00b386' : '#e05252', fontWeight: '600' }}>
                        {val > 0 ? '+' : ''}{val}%
                      </div>
                      <div style={{
                        width: '100%', borderRadius: '4px',
                        background: val >= 0 ? '#00b386' : '#e05252',
                        height: `${Math.max(Math.abs(val) * 8, 4)}px`
                      }} />
                      <div style={{ fontSize: '10px', color: '#888' }}>{months[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Strategy Summary</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                  The <strong>{strategy.toUpperCase()}</strong> strategy on <strong>{stock}</strong> over <strong>{period}</strong> generated
                  a return of <strong style={{ color: result.total_return > 0 ? '#00b386' : '#e05252' }}>{result.total_return > 0 ? '+' : ''}{result.total_return}%</strong> with
                  a win rate of <strong>{result.win_rate}%</strong> across <strong>{result.total_trades} trades</strong>.
                  The maximum drawdown was <strong style={{ color: '#e05252' }}>-{result.max_drawdown}%</strong> and
                  the Sharpe ratio of <strong>{result.sharpe}</strong> indicates
                  {result.sharpe > 1.5 ? ' excellent ' : result.sharpe > 1 ? ' good ' : ' moderate '}
                  risk-adjusted returns.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Backtest