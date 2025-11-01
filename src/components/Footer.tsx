import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 mt-20">
      <div className="max-w-4xl mx-auto px-6 py-6 text-sm text-slate-400">
        © {new Date().getFullYear()} dikonakaya — Built with React, TypeScript & Tailwind v4
      </div>
    </footer>
  )
}
