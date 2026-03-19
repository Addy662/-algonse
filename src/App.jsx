import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Broker from './pages/Broker'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Signals from './pages/Signals'
import Backtest from './pages/Backtest'
import PaperTrading from './pages/PaperTrading'
import ResetPassword from './pages/ResetPassword'
import Charts from './pages/Charts'
import Options from './pages/Options'
import Login from './pages/Login'
import Search from './pages/Search'
import Screener from './pages/Screener'
import Alerts from './pages/Alerts'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import './App.css'

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#888', fontSize:'14px' }}>
      Loading...
    </div>
  )
  if (!session) return <Navigate to="/login" replace />
  return children
}

function LandingPage() {
  return <><Hero /><Features /><Pricing /><Footer /></>
}

function AppLayout() {
  const loc         = useLocation()
  const isLanding   = loc.pathname === '/'
  const isLogin     = loc.pathname === '/login'
  const showSidebar = !isLanding && !isLogin

  return (
    <div style={{ display:'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{ marginLeft: showSidebar ? '220px' : '0', flex:1, minHeight:'100vh', background: showSidebar ? '#f7f7f5' : '#fff' }}>
        {isLanding && <Navbar />}
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/signals"   element={<ProtectedRoute><Signals /></ProtectedRoute>} />
          <Route path="/charts"    element={<ProtectedRoute><Charts /></ProtectedRoute>} />
          <Route path="/backtest"  element={<ProtectedRoute><Backtest /></ProtectedRoute>} />
          <Route path="/paper"     element={<ProtectedRoute><PaperTrading /></ProtectedRoute>} />
          <Route path="/options"   element={<ProtectedRoute><Options /></ProtectedRoute>} />
          <Route path="/search"    element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/screener"  element={<ProtectedRoute><Screener /></ProtectedRoute>} />
          <Route path="/alerts"    element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/broker" element={<ProtectedRoute><Broker /></ProtectedRoute>} />
          <Route path="/broker/callback" element={<Broker />} />
          <Route path="/admin"     element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return <AppLayout />
}

export default App