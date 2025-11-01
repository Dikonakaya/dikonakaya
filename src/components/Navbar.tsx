import React from 'react'

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">dikonakaya</div>
        <nav className="space-x-4 text-sm text-slate-300">
          <a href="#projects" className="hover:text-white">Projects</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
      </div>
    </header>
  )
}
