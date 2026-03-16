import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Signals from './pages/Signals'
import Backtest from './pages/Backtest'
import PaperTrading from './pages/PaperTrading'
import Charts from './pages/Charts'
import Options from './pages/Options'
import Login from './pages/Login'
import Search from './pages/Search'
import './App.css'

function LandingPage() {
  return <><Hero /><Features /><Pricing /><Footer /></>
}

function AppLayout() {
  const loc         = useLocation()
  const isLanding   = loc.pathname === '/'
  const isLogin     = loc.pathname === '/login'
  const showSidebar = !isLanding && !isLogin

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{
        marginLeft: showSidebar ? '220px' : '0',
        flex: 1, minHeight: '100vh',
        background: showSidebar ? '#f7f7f5' : '#fff'
      }}>
        {isLanding && <Navbar />}
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signals"   element={<Signals />} />
          <Route path="/charts"    element={<Charts />} />
          <Route path="/backtest"  element={<Backtest />} />
          <Route path="/paper"     element={<PaperTrading />} />
          <Route path="/options"   element={<Options />} />
          <Route path="/search"    element={<Search />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return <AppLayout />
}

export default App