import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Projects from './pages/Projects'
import PixelArt from './pages/PixelArt'
import Photography from './pages/Photography'
import Admin from './pages/Admin'
import Footer from './components/Footer'
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#373944] to-[#1E1E25] text-[#FFFFFF]">
      <Analytics />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pixelart" element={<PixelArt />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
