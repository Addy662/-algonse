import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Signals from './pages/Signals'
import Backtest from './pages/Backtest'
import PaperTrading from './pages/PaperTrading'
import './App.css'

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/signals"     element={<Signals />} />
        <Route path="/backtest"    element={<Backtest />} />
        <Route path="/paper"       element={<PaperTrading />} />
      </Routes>
    </div>
  )
}

export default App