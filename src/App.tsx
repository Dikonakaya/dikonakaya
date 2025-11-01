import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/home/Home'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#373944] text-[#FFFFFF]">
      <Navbar />
      <main>
        <Home />
        {/* other sections (About, Projects, Contact) will go here */}
      </main>
      <Footer />
    </div>
  )
}
