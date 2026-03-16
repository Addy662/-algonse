import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ALL_STOCKS = [
  // NIFTY 50
  'RELIANCE','HDFCBANK','TCS','INFY','ICICIBANK','HINDUNILVR','ITC','SBIN',
  'BHARTIARTL','KOTAKBANK','BAJFINANCE','ASIANPAINT','MARUTI','NTPC','TITAN',
  'SUNPHARMA','ULTRACEMCO','WIPRO','BAJAJFINSV','ONGC','TECHM','NESTLEIND',
  'ADANIENT','POWERGRID','HCLTECH','TATAMOTORS','JSWSTEEL','TATASTEEL',
  'INDUSINDBK','DRREDDY','CIPLA','DIVISLAB','EICHERMOT','COALINDIA',
  'BPCL','GRASIM','HEROMOTOCO','HINDALCO','BRITANNIA','APOLLOHOSP',
  'LTIM','LT','ADANIPORTS','TATACONSUM','SBILIFE','HDFCLIFE','AXISBANK',
  'MM','UPL','VEDL',
  // NIFTY NEXT 50
  'BAJAJ-AUTO','GODREJCP','DABUR','MARICO','BERGEPAINT','MCDOWELL-N',
  'COLPAL','PIDILITIND','AMBUJACEM','ACC','BANKBARODA','PNB','CANBK',
  'UNIONBANK','IDFCFIRSTB','FEDERALBNK','RBLBANK','BANDHANBNK',
  'MUTHOOTFIN','CHOLAFIN','RECLTD','PFC','IRCTC','CONCOR','ZOMATO',
  'NYKAA','PAYTM','POLICYBZR','DELHIVERY','CARTRADE',
  // INDICES
  'NIFTY50','BANKNIFTY','NIFTYIT','NIFTYPHARMA','NIFTYAUTO','NIFTYMETAL',
  'NIFTYFMCG','NIFTYREALTY','SENSEX',
]

function Search() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [stockData, setStockData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (query.length < 1) { setResults([]); return }
    const q = query.toUpperCase()
    setResults(ALL_STOCKS.filter(s => s.includes(q)).slice(0, 12))
  }, [query])

  const handleSelect = (stock) => {
    navigate(`/charts?stock=${stock}`)
  }

  return (
    <div style={{ padding: '32px 5%', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Search</h1>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Search any NSE/BSE stock or index</p>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type stock name e.g. RELIANCE, TCS, NIFTY..."
          style={{
            width: '100%', padding: '14px 20px', fontSize: '16px',
            border: '1.5px solid #e0e0e0', borderRadius: '12px',
            outline: 'none', boxSizing: 'border-box',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}
          onFocus={e => e.target.style.borderColor = '#00b386'}
          onBlur={e => e.target.style.borderColor = '#e0e0e0'}
        />
        <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
      </div>

      {results.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
          {results.map((stock, i) => (
            <div key={stock} onClick={() => handleSelect(stock)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', cursor: 'pointer',
              borderTop: i > 0 ? '1px solid #f5f5f5' : 'none',
              background: '#fff'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f7fffe'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#e6faf5', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#00b386'
                }}>
                  {stock.slice(0, 3)}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>{stock}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>NSE · Equity</div>
                </div>
              </div>
              <span style={{ fontSize: '13px', color: '#00b386' }}>View Chart →</span>
            </div>
          ))}
        </div>
      )}

      {query.length === 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#888', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular Stocks</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['NIFTY50','BANKNIFTY','RELIANCE','HDFCBANK','TCS','INFY','ADANIENT','TATAMOTORS','ZOMATO','IRCTC'].map(s => (
              <button key={s} onClick={() => handleSelect(s)} style={{
                padding: '7px 14px', borderRadius: '20px', fontSize: '13px',
                fontWeight: '500', cursor: 'pointer', border: '1px solid #e0e0e0',
                background: '#fff', color: '#555'
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Search