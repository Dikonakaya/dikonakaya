import React from 'react'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="py-2 text-sm text-slate-400">
        <div className="grid max-w-6xl mx-auto" style={{ gridTemplateColumns: '50% 50%' }}>
          <div className="flex items-center space-x-4">
            <div>
              <img src={logo} alt="dikonakaya logo" className="h-[100px] w-auto" />
            </div>
            <div className="text-white">
              <p>Dikonakaya is a freelance pixel artist</p>
              <p>and photographer based in the Philippines</p>
            </div>
          </div>
          <div>
            YouTube
          </div>
        </div>
        <div className="h-[2px] bg-white w-[480px] mx-auto m-2 text-center" aria-hidden="true" />
        <div className="text-center">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}
