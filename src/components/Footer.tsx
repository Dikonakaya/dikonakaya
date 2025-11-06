import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { scrollToTop } from '../utils/scrollToTop'
import logo from '../assets/logo.png'
import { IconType } from 'react-icons'
import { FaYoutube, FaTwitter, FaInstagram, FaTwitch, FaFacebook, FaDiscord, FaGithub, FaLinkedin, FaCrown, FaGlobe, FaBroadcastTower, FaPatreon } from 'react-icons/fa'
import { SiKofi } from 'react-icons/si'
import lineReveal from '../utils/lineReveal'

export default function Footer() {
  const location = useLocation()
  const isAbout = location.pathname === '/about'
  const defaultSocials: { name: string; href: string; Icon: IconType; color: string }[] = [
    { name: 'YouTube', href: 'https://www.youtube.com/@dikonakaya', Icon: FaYoutube, color: '#FF0000' },
    { name: 'Twitter', href: 'https://twitter.com/dikonakayach', Icon: FaTwitter, color: '#1DA1F2' },
    { name: 'Instagram', href: 'https://www.instagram.com/dikonakaya.png/', Icon: FaInstagram, color: '#FF7A08' },
    { name: 'Twitch', href: 'https://www.twitch.tv/dikonakaya', Icon: FaTwitch, color: '#9146FF' },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61575071376793', Icon: FaFacebook, color: '#1877F2' },
    { name: 'Discord', href: 'https://discord.com/invite/GBrAhGK6kE', Icon: FaDiscord, color: '#5865F2' },
  ]

  const extendedSocials: { name: string; href: string; Icon: IconType; color: string }[] = [
    { name: 'GitHub', href: 'https://github.com/dikonakaya', Icon: FaGithub, color: '#24292E' },
    { name: 'LinkedIn', href: '', Icon: FaLinkedin, color: '#0A66C2' },
    { name: 'Patreon', href: '', Icon: FaPatreon, color: '#ff424d' },
    { name: 'Throne', href: 'https://throne.com/dikonakaya', Icon: FaCrown, color: '#D4AF37' },
    { name: 'Ko-fi', href: 'https://ko-fi.com/dikonakaya', Icon: SiKofi, color: '#29abe0' },
    { name: 'PMC', href: 'https://www.planetminecraft.com/member/dikonakaya', Icon: FaGlobe, color: '#2E8B57' },
  ]

  const footerSocials = isAbout ? [...defaultSocials, ...extendedSocials] : defaultSocials

  const [hovered, setHovered] = useState<string | null>(null)

  // separate divider hooks so each divider animates independently
  // pass a session key so once a divider is revealed it stays revealed for the session
  const { ref: dividerRefAboutTop, revealed: dividerInViewAboutTop } = lineReveal('footer-about-top')
  const { ref: dividerRefAboutBottom, revealed: dividerInViewAboutBottom } = lineReveal('footer-about-bottom')
  const { ref: dividerRefMain, revealed: dividerInViewMain } = lineReveal('footer-main')

  if (isAbout) {
    return (
      <footer id="socials" className="bg-[#373944] w-full pt-16">
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
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
              <div className="flex items-center gap-6 -ml-4">
                <img src={logo} alt="dikonakaya logo" className="h-24 w-auto" />
                <h3 className="text-left text-4xl font-semibold text-white -ml-4 mt-8">SOCIALS</h3>
              </div>
              <div
                ref={dividerRefAboutTop}
                aria-hidden="true"
                className={`h-[2px] bg-white w-full max-w-[900px] mx-auto origin-center transform ${dividerInViewAboutTop ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
                style={{ transition: 'transform 2000ms ease-out, opacity 2000ms ease-out' }}
              />
            </div>
            <div className="max-w-6xl mx-auto flex items-center justify-center mt-4">
              <div className="grid grid-cols-3 md:grid-cols-6 grid-rows-2 gap-x-12 gap-y-8 text-center place-items-center">
                {footerSocials.map((s) => {
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
                      <div className={`flex flex-col items-center justify-center h-14 w-14 gap-1 transform origin-center transition-transform duration-200 ease-out ${isHovered ? '-translate-y-1 scale-105' : ''}`}>
                        <s.Icon className="h-6 w-6 transition-colors block" aria-hidden style={{ color: isHovered ? s.color : undefined }} />
                        <span className={`text-xs transition-colors ${s.name === 'Facebook' ? 'pl-0.5' : ''} ${s.name === 'Ko-fi' ? 'pr-1' : ''}`} style={{ color: isHovered ? s.color : undefined }}>{s.name}</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            <div
              ref={dividerRefAboutBottom}
              aria-hidden="true"
              className={`my-4 h-[2px] bg-white w-full max-w-[900px] mx-auto origin-center transform ${dividerInViewAboutBottom ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
              style={{ transition: 'transform 2000ms ease-out, opacity 2000ms ease-out' }}
            />
            <div className="text-center">© {new Date().getFullYear()}</div>
          </div>
        </div>
      </footer>
    )
  }

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
              <div className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-4 text-center place-items-center">
                {footerSocials.map((s) => {
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
                      <div className={`flex flex-col items-center justify-center h-14 w-14 gap-1 transform origin-center transition-transform duration-200 ease-out ${isHovered ? '-translate-y-1 scale-105' : ''}`}>
                        <s.Icon className="h-6 w-6 transition-colors block" aria-hidden style={{ color: isHovered ? s.color : undefined }} />
                        <span className={`text-xs transition-colors ${s.name === 'Facebook' ? 'pl-0.5' : ''}`} style={{ color: isHovered ? s.color : undefined }}>{s.name}</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div
            ref={dividerRefMain}
            aria-hidden="true"
            className={`my-4 h-[2px] bg-white w-full max-w-[1200px] mx-auto origin-center transform ${dividerInViewMain ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
            style={{ transition: 'transform 2000ms ease-out, opacity 2000ms ease-out' }}
          />
          <div className="text-center">© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  )
}
