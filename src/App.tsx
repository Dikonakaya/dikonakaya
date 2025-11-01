import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/home/Home'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <Home />
        {/* other sections (About, Projects, Contact) will go here */}
      </main>
      <Footer />
    </div>
  )
}
