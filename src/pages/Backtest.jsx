import { useState } from 'react'
import API_BASE from '../config'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const STRATEGIES = [
  { value: 'rsi',            label: 'RSI Reversal',         desc: 'Buy oversold, sell overbought' },
  { value: 'macd',           label: 'MACD Crossover',       desc: 'Buy/sell on MACD line cross' },
  { value: 'bb',             label: 'Bollinger Bands',      desc: 'Trade band breakouts' },
  { value: 'ma_cross',       label: 'MA Cross (20/50)',     desc: 'Golden/death cross' },
  { value: 'ema_cross',      label: 'EMA Cross (9/21)',     desc: 'Fast EMA crosses slow' },
  { value: 'ema_trend',      label: 'EMA Trend (200)',      desc: 'Trade above/below 200 EMA' },
  { value: 'momentum',       label: 'Momentum + Volume',    desc: 'Price momentum with volume surge' },
  { value: 'stochastic',     label: 'Stochastic',           desc: 'Stochastic oscillator signals' },
  { value: 'rsi_macd',       label: 'RSI + MACD Combined',  desc: 'Both indicators must agree' },
  { value: 'bb_rsi',         label: 'BB + RSI Combined',    desc: 'Band touch + RSI extreme' },
  { value: 'triple_ema',     label: 'Triple EMA',           desc: '9/21/50 EMA alignment' },
  { value: 'willr',          label: "Williams %R",          desc: 'Overbought/oversold oscillator' },
  { value: 'cci',            label: 'CCI',                  desc: 'Commodity Channel Index' },
  { value: 'volume_breakout',label: 'Volume Breakout',      desc: 'Price move + volume surge' },
  { value: 'supertrend',     label: 'Supertrend',           desc: 'ATR-based trend following' },
  { value: 'mean_reversion', label: 'Mean Reversion',       desc: 'Triple confirmation reversal' },
  { value: 'trend_following',label: 'Trend Following',      desc: 'EMA + MACD + price trend' },
  { value: 'breakout',       label: '20-Day Breakout',      desc: 'Price breaks 20-day high/low' },
  { value: 'combined',       label: 'AlgoNSE Combined',     desc: 'Our proprietary multi-indicator' },
]

const STOCKS = ['RELIANCE','HDFCBANK','TCS','INFY','WIPRO','ICICIBANK','ADANIENT',
  'BAJFINANCE','TATAMOTORS','AXISBANK','KOTAKBANK','SBIN','ITC','HINDUNILVR',
  'MARUTI','TITAN','SUNPHARMA','BHARTIARTL','NTPC','ONGC','TECHM','HCLTECH',
  'JSWSTEEL','TATASTEEL','LT','ZOMATO','IRCTC','NIFTY50','BANKNIFTY']

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '16px 18px' }}>
      <div style={{ fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: color || '#1a1a1a' }}>{value}</div>
      {sub && <div style={{ fontSize: '11px', color: '#aaa', marginTop: '3px' }}>{sub}</div>}
    </div>
  )
}

function Backtest() {
  const [stock, setStock]       = useState('NIFTY50')
  const [strategy, setStrategy] = useState('combined')
  const [capital, setCapital]   = useState(500000)
  const [period, setPeriod]     = useState('1Y')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const runBacktest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res  = await fetch(`${API_BASE}/api/backtest/${stock}/${strategy}/${period}`)
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setResult(data)
      setActiveTab('overview')
    } catch(e) {
      setError('Cannot connect to backend.')
    } finally {
      setLoading(false)
    }
  }

  const finalValue = result ? Math.round(capital * (1 + result.total_return / 100)) : null
  const profit     = result ? Math.round(finalValue - capital) : null
  const selectedStrategy = STRATEGIES.find(s => s.value === strategy)

  const tabStyle = (t) => ({
    padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
    fontWeight: '500', cursor: 'pointer', border: '1px solid',
    background: activeTab === t ? '#1a1a1a' : '#fff',
    color: activeTab === t ? '#fff' : '#888',
    borderColor: activeTab === t ? '#1a1a1a' : '#e0e0e0'
  })

  return (
    <div style={{ padding: '32px 5%', maxWidth: '1300px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>Backtest Engine</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Test 19 strategies on real NSE historical data — up to 5 years</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>

        {/* Config panel */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px' }}>Configuration</h2>

          <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Stock / Index</label>
          <select value={stock} onChange={e => setStock(e.target.value)} style={{
            width: '100%', padding: '9px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px',
            marginTop: '5px', marginBottom: '14px', background: '#fff'
          }}>
            {STOCKS.map(s => <option key={s}>{s}</option>)}
          </select>

          <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Strategy</label>
          <select value={strategy} onChange={e => setStrategy(e.target.value)} style={{
            width: '100%', padding: '9px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px',
            marginTop: '5px', marginBottom: '6px', background: '#fff'
          }}>
            {STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {selectedStrategy && (
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '14px', padding: '8px 10px', background: '#f7f7f5', borderRadius: '6px' }}>
              {selectedStrategy.desc}
            </div>
          )}

          <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Period</label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '5px', marginBottom: '14px' }}>
            {['3M','6M','1Y','3Y','5Y'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                flex: 1, padding: '7px', borderRadius: '7px', fontSize: '12px',
                fontWeight: '500', cursor: 'pointer',
                background: period === p ? '#00b386' : '#fff',
                color: period === p ? '#fff' : '#888',
                border: `1px solid ${period === p ? '#00b386' : '#e0e0e0'}`
              }}>{p}</button>
            ))}
          </div>

          <label style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase' }}>Capital (₹)</label>
          <input type="number" value={capital} onChange={e => setCapital(Number(e.target.value))} style={{
            width: '100%', padding: '9px 12px', borderRadius: '8px',
            border: '1px solid #e0e0e0', fontSize: '14px',
            marginTop: '5px', marginBottom: '20px', boxSizing: 'border-box'
          }} />

          <button onClick={runBacktest} disabled={loading} style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: loading ? '#ccc' : '#00b386', color: '#fff',
            fontSize: '15px', fontWeight: '600', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Running...' : 'Run Backtest'}
          </button>

          {error && (
            <div style={{ marginTop: '12px', background: '#fef0f0', border: '1px solid #f5c0c0', borderRadius: '8px', padding: '10px', color: '#e05252', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div style={{ marginTop: '16px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
              <div style={{ marginBottom: '6px' }}>⏳ Downloading {period} of data...</div>
              <div>Running {selectedStrategy?.label} strategy...</div>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div>
          {!result && !loading && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '80px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Configure and run your backtest</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Uses real NSE historical data from Yahoo Finance</div>
            </div>
          )}

          {loading && (
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '80px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Backtesting on real data...</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Simulating every trade over {period}</div>
            </div>
          )}

          {result && (
            <>
              {/* Summary header */}
              <div style={{ background: result.total_return >= 0 ? '#e6faf5' : '#fef0f0', border: `1px solid ${result.total_return >= 0 ? '#b2eada' : '#f5c0c0'}`, borderRadius: '14px', padding: '20px 24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>{stock} · {selectedStrategy?.label} · {period}</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: result.total_return >= 0 ? '#00b386' : '#e05252' }}>
                    {result.total_return >= 0 ? '+' : ''}{result.total_return}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>
                    ₹{capital.toLocaleString('en-IN')} → ₹{finalValue.toLocaleString('en-IN')}
                    <span style={{ color: result.total_return >= 0 ? '#00b386' : '#e05252', marginLeft: '8px', fontWeight: '600' }}>
                      ({result.total_return >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN')})
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['overview','monthly','equity','trades'].map(t => (
                    <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    <StatCard label="Total Return"     value={`${result.total_return >= 0 ? '+' : ''}${result.total_return}%`} color={result.total_return >= 0 ? '#00b386' : '#e05252'} />
                    <StatCard label="Win Rate"         value={`${result.win_rate}%`} color={result.win_rate >= 50 ? '#00b386' : '#e05252'} sub={`${Math.round(result.total_trades * result.win_rate / 100)} wins / ${result.total_trades} trades`} />
                    <StatCard label="Sharpe Ratio"     value={result.sharpe} color={result.sharpe >= 1 ? '#00b386' : result.sharpe >= 0 ? '#f5a623' : '#e05252'} sub={result.sharpe >= 1.5 ? 'Excellent' : result.sharpe >= 1 ? 'Good' : result.sharpe >= 0 ? 'Average' : 'Poor'} />
                    <StatCard label="Profit Factor"    value={result.profit_factor} color={result.profit_factor >= 1.5 ? '#00b386' : result.profit_factor >= 1 ? '#f5a623' : '#e05252'} sub="Avg win / avg loss" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    <StatCard label="Max Drawdown"     value={`-${result.max_drawdown}%`} color="#e05252" sub="Worst single trade" />
                    <StatCard label="Avg Win"          value={`+${result.avg_win}%`} color="#00b386" />
                    <StatCard label="Avg Loss"         value={`-${result.avg_loss}%`} color="#e05252" />
                    <StatCard label="Expectancy"       value={`${result.expectancy > 0 ? '+' : ''}${result.expectancy}%`} color={result.expectancy >= 0 ? '#00b386' : '#e05252'} sub="Per trade average" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    <StatCard label="Best Trade"       value={`+${result.best_trade}%`} color="#00b386" />
                    <StatCard label="Worst Trade"      value={`${result.worst_trade}%`} color="#e05252" />
                    <StatCard label="Max Consec. Wins" value={result.max_consec_wins} color="#00b386" />
                    <StatCard label="Max Consec. Loss" value={result.max_consec_losses} color="#e05252" />
                  </div>

                  {/* Strategy explanation */}
                  <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '20px 24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Strategy Analysis</h3>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.9' }}>
                      The <strong>{selectedStrategy?.label}</strong> strategy on <strong>{stock}</strong> over <strong>{period}</strong> generated
                      a total return of <strong style={{ color: result.total_return >= 0 ? '#00b386' : '#e05252' }}>{result.total_return >= 0 ? '+' : ''}{result.total_return}%</strong> across <strong>{result.total_trades} trades</strong>.
                      The win rate of <strong>{result.win_rate}%</strong> means {Math.round(result.total_trades * result.win_rate / 100)} trades were profitable.
                      Average winning trade returned <strong style={{ color: '#00b386' }}>+{result.avg_win}%</strong> while
                      average losing trade lost <strong style={{ color: '#e05252' }}>-{result.avg_loss}%</strong>.
                      The Sharpe ratio of <strong>{result.sharpe}</strong> indicates <strong>{result.sharpe >= 1.5 ? 'excellent' : result.sharpe >= 1 ? 'good' : result.sharpe >= 0 ? 'average' : 'poor'}</strong> risk-adjusted returns.
                      {result.profit_factor >= 1.5 ? ' The profit factor above 1.5 suggests this strategy has an edge.' : result.profit_factor < 1 ? ' The profit factor below 1 means losses outweigh gains — consider a different strategy.' : ''}
                      {result.expectancy > 0 ? ` On average, each trade is expected to return +${result.expectancy}% — a positive expectancy is essential for a viable strategy.` : ` Negative expectancy means this strategy loses money on average per trade.`}
                    </p>
                  </div>
                </>
              )}

              {/* MONTHLY TAB */}
              {activeTab === 'monthly' && (
                <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>Monthly Returns Breakdown</h3>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', marginBottom: '12px' }}>
                    {result.monthly_returns.map((val, i) => {
                      const maxAbs = Math.max(...result.monthly_returns.map(Math.abs)) || 1
                      const h = Math.max(Math.abs(val) / maxAbs * 150, 3)
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '180px', justifyContent: 'flex-end', gap: '4px' }}>
                          <div style={{ fontSize: '10px', color: val >= 0 ? '#00b386' : '#e05252', fontWeight: '600' }}>
                            {val > 0 ? '+' : ''}{val}%
                          </div>
                          <div style={{ width: '100%', background: val >= 0 ? '#00b386' : '#e05252', borderRadius: '3px 3px 0 0', height: `${h}px` }} />
                          <div style={{ fontSize: '10px', color: '#888' }}>{months[i]}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
                    <StatCard label="Best Month"  value={`+${Math.max(...result.monthly_returns).toFixed(2)}%`} color="#00b386" />
                    <StatCard label="Worst Month" value={`${Math.min(...result.monthly_returns).toFixed(2)}%`} color="#e05252" />
                    <StatCard label="Avg Month"   value={`${(result.monthly_returns.reduce((a,b)=>a+b,0)/12).toFixed(2)}%`} color="#1a1a1a" />
                  </div>
                </div>
              )}

              {/* EQUITY CURVE TAB */}
              {activeTab === 'equity' && (
                <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>Equity Curve</h3>
                  <div style={{ position: 'relative', height: '220px', marginBottom: '12px' }}>
                    <svg width="100%" height="220" viewBox={`0 0 ${result.equity_curve.length} 220`} preserveAspectRatio="none">
                      {(() => {
                        const min = Math.min(...result.equity_curve)
                        const max = Math.max(...result.equity_curve)
                        const range = max - min || 1
                        const points = result.equity_curve.map((v, i) => `${i},${220 - ((v - min) / range * 200 + 10)}`).join(' ')
                        const areaPoints = `0,220 ${points} ${result.equity_curve.length - 1},220`
                        return (
                          <>
                            <polygon points={areaPoints} fill="rgba(0,179,134,0.1)" />
                            <polyline points={points} fill="none" stroke="#00b386" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                            <line x1="0" y1="110" x2={result.equity_curve.length} y2="110" stroke="#f0f0f0" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                          </>
                        )
                      })()}
                    </svg>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                    <span>Start: ₹{capital.toLocaleString('en-IN')}</span>
                    <span style={{ color: result.total_return >= 0 ? '#00b386' : '#e05252', fontWeight: '600' }}>
                      End: ₹{finalValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {/* TRADES TAB */}
              {activeTab === 'trades' && (
                <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontSize: '14px', fontWeight: '600' }}>
                    Last 20 Trades
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#fafafa' }}>
                        {['#','Entry Date','Exit Date','Entry ₹','Exit ₹','Return','Result'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '600', color: '#888', textAlign: 'left', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.trades.map((t, i) => (
                        <tr key={i} style={{ borderTop: '1px solid #f5f5f5', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '10px 14px', fontSize: '12px', color: '#aaa' }}>{result.total_trades - result.trades.length + i + 1}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px' }}>{t.entry_date}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px' }}>{t.exit_date}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px' }}>₹{t.entry?.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px' }}>₹{t.exit?.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                          <td style={{ padding: '10px 14px', fontSize: '12px', fontWeight: '600', color: t.return >= 0 ? '#00b386' : '#e05252' }}>
                            {t.return >= 0 ? '+' : ''}{t.return}%
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ background: t.return >= 0 ? '#e6faf5' : '#fef0f0', color: t.return >= 0 ? '#00b386' : '#e05252', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px' }}>
                              {t.return >= 0 ? 'WIN' : 'LOSS'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Backtest