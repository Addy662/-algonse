import { useState } from 'react'

const results = {
  rsi:      { ret: 34.2, sharpe: 1.84, dd: 11.3, wr: 63, trades: 47, pf: 1.92 },
  macd:     { ret: 28.7, sharpe: 1.52, dd: 14.1, wr: 58, trades: 62, pf: 1.71 },
  ma:       { ret: 22.1, sharpe: 1.21, dd: 17.8, wr: 54, trades: 38, pf: 1.45 },
  bb:       { ret: 31.5, sharpe: 1.68, dd: 12.4, wr: 61, trades: 53, pf: 1.83 },
  momentum: { ret: 41.3, sharpe: 2.01, dd: 9.8,  wr: 66, trades: 29, pf: 2.14 },
}

const monthlyReturns = {
  rsi:      [3.2, -1.4, 5.1, 2.8, -0.9, 4.3, 6.1, -2.1, 3.7, 1.9, 5.4, 6.1],
  macd:     [2.1, -2.1, 4.2, 1.9, -1.8, 3.1, 5.0, -3.2, 2.9, 1.2, 4.8, 5.6],
  ma:       [1.8, -1.9, 3.1, 1.2, -2.1, 2.4, 3.8, -2.8, 2.1, 0.9, 3.9, 4.9],
  bb:       [2.8, -1.2, 4.8, 2.4, -1.1, 3.8, 5.6, -1.8, 3.2, 1.6, 5.1, 5.7],
  momentum: [4.1, -0.9, 6.2, 3.4, -0.6, 5.1, 7.2, -1.4, 4.3, 2.4, 6.3, 7.1],
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function Backtest() {
  const [stock, setStock] = useState('RELIANCE')
  const [strategy, setStrategy] = useState('rsi')
  const [capital, setCapital] = useState(500000)
  const [period, setPeriod] = useState('1Y')
  const [ran, setRan] = useState(false)

  const r = results[strategy]
  const finalValue = capital * (1 + r.ret / 100)

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1200px', margin: '0 auto' }}>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Backtest Engine</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Test any strategy on historical NSE data before risking real money</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>Configuration</h2>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>STOCK / INDEX</label>
          <select value={stock} onChange={e => setStock(e.target.value)} style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px', marginTop: '6px',
            marginBottom: '16px', background: '#fff'
          }}>
            {['RELIANCE','HDFCBANK','TCS','INFY','WIPRO','NIFTY50','BANKNIFTY'].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <label style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>STRATEGY</label>
          <select value={strategy} onChange={e => { setStrategy(e.target.value); setRan(false) }} style={{
            width: '100%', padding: '10px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px', marginTop: '6px',
            marginBottom: '16px', background: '#fff'
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
          <input
            type="number"
            value={capital}
            onChange={e => setCapital(Number(e.target.value))}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              border: '1px solid #e0e0e0', fontSize: '14px', marginTop: '6px',
              marginBottom: '24px'
            }}
          />

          <button onClick={() => setRan(true)} style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: '#00b386', color: '#fff', fontSize: '15px',
            fontWeight: '600', border: 'none', cursor: 'pointer'
          }}>
            Run Backtest
          </button>
        </div>

        <div>
          {!ran ? (
            <div style={{
              background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px',
              padding: '60px', textAlign: 'center', color: '#888'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>Configure and run your backtest</div>
              <div style={{ fontSize: '14px' }}>Select a stock, strategy, period and capital — then click Run Backtest</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Return', value: `+${r.ret}%`, color: '#00b386' },
                  { label: 'Final Value', value: `₹${Math.round(finalValue).toLocaleString('en-IN')}`, color: '#1a1a1a' },
                  { label: 'Sharpe Ratio', value: r.sharpe, color: '#1a1a1a' },
                  { label: 'Max Drawdown', value: `-${r.dd}%`, color: '#e05252' },
                  { label: 'Win Rate', value: `${r.wr}%`, color: '#1a1a1a' },
                  { label: 'Total Trades', value: r.trades, color: '#1a1a1a' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: '#fff', border: '1px solid #f0f0f0',
                    borderRadius: '12px', padding: '18px 20px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{stat.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: '#1a1a1a' }}>Monthly Returns</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
                  {monthlyReturns[strategy].map((val, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '10px', color: val >= 0 ? '#00b386' : '#e05252', fontWeight: '600' }}>
                        {val > 0 ? '+' : ''}{val}%
                      </div>
                      <div style={{
                        width: '100%', borderRadius: '4px',
                        background: val >= 0 ? '#00b386' : '#e05252',
                        height: `${Math.abs(val) * 10}px`,
                        minHeight: '4px'
                      }} />
                      <div style={{ fontSize: '10px', color: '#888' }}>{months[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Strategy Summary</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
                  The <strong>{strategy.toUpperCase()}</strong> strategy on <strong>{stock}</strong> over <strong>{period}</strong>
                  {' '}generated a return of <strong style={{ color: '#00b386' }}>+{r.ret}%</strong> with a win rate of <strong>{r.wr}%</strong> across <strong>{r.trades} trades</strong>.
                  The maximum drawdown was <strong style={{ color: '#e05252' }}>-{r.dd}%</strong> and the Sharpe ratio of <strong>{r.sharpe}</strong> indicates
                  {r.sharpe > 1.5 ? ' excellent ' : r.sharpe > 1 ? ' good ' : ' moderate '}
                  risk-adjusted returns.
                  {r.ret > 30 ? ' This is a strong performing strategy worth considering.' : ' Consider optimising parameters for better results.'}
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