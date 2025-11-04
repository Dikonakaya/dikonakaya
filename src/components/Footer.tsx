import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { scrollToTop } from '../utils/scrollToTop'
import logo from '../assets/logo.png'
import { IconType } from 'react-icons'
import { FaYoutube, FaTwitter, FaInstagram, FaTwitch, FaFacebook, FaDiscord } from 'react-icons/fa'
// Using Tailwind CSS transitions instead of framer-motion to avoid TypeScript issues
// Framer Motion is installed, but CSS transforms provide a simple, smooth hover here.

export default function Footer() {
  const social: { name: string; href: string; Icon: IconType; color: string }[] = [
    { name: 'YouTube', href: 'https://www.youtube.com/@dikonakaya', Icon: FaYoutube, color: '#FF0000' },
    { name: 'Twitter', href: '#', Icon: FaTwitter, color: '#1DA1F2' },
    { name: 'Instagram', href: 'https://www.instagram.com/dikonakaya.png/', Icon: FaInstagram, color: '#FF7A08' },
    { name: 'Twitch', href: 'https://www.twitch.tv/dikonakaya', Icon: FaTwitch, color: '#9146FF' },
    { name: 'Facebook', href: '#', Icon: FaFacebook, color: '#1877F2' },
    { name: 'Discord', href: 'https://discord.com/invite/GBrAhGK6kE', Icon: FaDiscord, color: '#5865F2' },
  ]

  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <footer className="bg-[#373944] w-full pt-16">
      <div className="relative">
        <svg
          className="absolute -top-20 left-0 w-full h-20 md:h-28 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <mask id="footer-hole-mask">
              <rect x="0" y="0" width="100" height="100" fill="white" />
              <path d="M0 0 C25 50 75 50 100 0 L100 0 L0 0 Z" transform="rotate(180 50 50)" fill="black" />
            </mask>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="var(--footer-bg, #1E1E25)" mask="url(#footer-hole-mask)" />
        </svg>

        <div className="pt-12 pb-6 text-sm text-slate-400">
          <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 items-start">

            {/* Left */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={logo}
                alt="dikonakaya logo"
                className="h-20 md:h-24 lg:h-28 aspect-square object-contain"
              />
              <div className="text-white">
                <p>Dikonakaya is a freelance pixel artist</p>
                <p>and photographer based in the Philippines &lt;3</p><br />
                <Link to="/contact" className="text-white hover:text-slate-400 transition-colors" onClick={() => { scrollToTop() }}>
                  Get in touch!
                </Link>
              </div>
            </div>

            {/* Right */}
            <div>
              <div className="grid grid-cols-3 grid-rows-2 gap-4 text-center place-items-center">
                {social.map((s) => {
                  const isHovered = hovered === s.name
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      aria-label={s.name}
                      className="inline-flex text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHovered(s.name)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(s.name)}
                      onBlur={() => setHovered(null)}
                    >
                      <div className={`flex flex-col items-center justify-center h-14 gap-1 transform transition-transform duration-200 ease-out ${isHovered ? '-translate-y-1 scale-105' : ''}`}>
                        <s.Icon className="h-6 w-6 transition-colors" aria-hidden style={{ color: isHovered ? s.color : undefined }} />
                        <span className={`text-xs transition-colors ${s.name === 'Facebook' ? 'pl-0.5' : ''}`} style={{ color: isHovered ? s.color : undefined }}>{s.name}</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="h-[2px] bg-white w-full max-w-[1200px] mx-auto my-4" aria-hidden="true" />
          <div className="text-center">© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  )
}
