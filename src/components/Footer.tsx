import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { scrollToTop } from '../utils/scroll'
import logo from '../assets/logo.png'
import { IconType } from 'react-icons'
import { FaYoutube, FaTwitter, FaInstagram, FaTwitch, FaFacebook, FaDiscord, FaGithub, FaLinkedin, FaCrown, FaGlobe, FaPatreon } from 'react-icons/fa'
import { SiKofi } from 'react-icons/si'

// Social media link type definition
type Social = { name: string; href: string; Icon: IconType; color: string }

// Primary social links shown on all pages
const defaultSocials: Social[] = [
  { name: 'YouTube', href: 'https://www.youtube.com/@dikonakaya', Icon: FaYoutube, color: '#FF0000' },
  { name: 'Twitter', href: 'https://twitter.com/dikonakayach', Icon: FaTwitter, color: '#1DA1F2' },
  { name: 'Instagram', href: 'https://www.instagram.com/dikonakaya.png/', Icon: FaInstagram, color: '#FF7A08' },
  { name: 'Twitch', href: 'https://www.twitch.tv/dikonakaya', Icon: FaTwitch, color: '#9146FF' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61575071376793', Icon: FaFacebook, color: '#1877F2' },
  { name: 'Discord', href: 'https://discord.com/invite/GBrAhGK6kE', Icon: FaDiscord, color: '#5865F2' },
]

// Additional social links shown only on About page
const extendedSocials: Social[] = [
  { name: 'GitHub', href: 'https://github.com/dikonakaya', Icon: FaGithub, color: '#24292E' },
  { name: 'LinkedIn', href: '', Icon: FaLinkedin, color: '#0A66C2' },
  { name: 'Patreon', href: '', Icon: FaPatreon, color: '#ff424d' },
  { name: 'Throne', href: 'https://throne.com/dikonakaya', Icon: FaCrown, color: '#D4AF37' },
  { name: 'Ko-fi', href: 'https://ko-fi.com/dikonakaya', Icon: SiKofi, color: '#29abe0' },
  { name: 'PMC', href: 'https://www.planetminecraft.com/member/dikonakaya', Icon: FaGlobe, color: '#2E8B57' },
]

/** Decorative curved SVG that creates a smooth transition from content to footer */
const FooterCurve = () => (
  <svg className="absolute -top-[83px] left-0 w-full h-20 md:h-28 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <mask id="footer-hole-mask">
        <rect x="0" y="0" width="100" height="100" fill="white" />
        <path d="M0 0 C25 50 75 50 100 0 L100 0 L0 0 Z" transform="rotate(180 50 50)" fill="black" />
      </mask>
    </defs>
    <rect x="0" y="0" width="100" height="100" fill="var(--footer-bg, #1E1E25)" mask="url(#footer-hole-mask)" />
  </svg>
)

/** Horizontal divider line with responsive max-width */
const Divider = () => (
  <div aria-hidden="true" className="h-[2px] bg-white w-full max-w-[90%] sm:max-w-[600px] md:max-w-[900px] mx-auto" />
)

type SocialLinkProps = { social: Social; hovered: string | null; setHovered: (name: string | null) => void }

/**
 * Individual social media link with icon and label
 * Features hover animation and brand color highlighting
 */
const SocialLink = ({ social, hovered, setHovered }: SocialLinkProps) => {
  const isHovered = hovered === social.name
  // Calculate min-width based on longest social names (Facebook, LinkedIn, etc)
  const needsWiderBox = ['Facebook', 'LinkedIn', 'Patreon'].includes(social.name)
  const minWidth = needsWiderBox ? 'min-w-[60px]' : 'min-w-[50px]'

  return (
    <a
      href={social.href}
      aria-label={social.name}
      className="inline-flex text-white"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(social.name)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(social.name)}
      onBlur={() => setHovered(null)}
    >
      <div className={`flex flex-col items-center justify-center h-14 ${minWidth} px-1 gap-1 transition-transform duration-200 ${isHovered ? '-translate-y-1 scale-105' : ''}`}>
        <social.Icon className="h-6 w-6 transition-colors" style={{ color: isHovered ? social.color : undefined }} />
        <span className="text-xs text-center whitespace-nowrap transition-colors" style={{ color: isHovered ? social.color : undefined }}>{social.name}</span>
      </div>
    </a>
  )
}

export default function Footer() {
  const location = useLocation()
  const isAbout = location.pathname === '/about'
  const [hovered, setHovered] = useState<string | null>(null)

  const socials = isAbout ? [...defaultSocials, ...extendedSocials] : defaultSocials

  if (isAbout) {
    return (
      <footer id="socials" className="bg-[#373944] w-full pt-16">
        <div className="relative">
          <FooterCurve />
          <div className="pt-12 pb-6 text-sm text-slate-400">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
              <div className="flex items-center gap-6 -ml-4">
                <img src={logo} alt="dikonakaya logo" className="h-24 w-auto" />
                <h3 className="text-left text-4xl font-semibold text-white -ml-4 mt-8">SOCIALS</h3>
              </div>
              <Divider />
            </div>
            <div className="max-w-6xl mx-auto flex items-center justify-center mt-4">
              <div className="grid grid-cols-3 md:grid-cols-6 grid-rows-2 gap-x-12 gap-y-8 text-center place-items-center">
                {socials.map((s) => <SocialLink key={s.name} social={s} hovered={hovered} setHovered={setHovered} />)}
              </div>
            </div>
            <div className="my-4"><Divider /></div>
            <div className="text-center">© {new Date().getFullYear()}</div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-[#373944] w-full pt-16">
      <div className="relative">
        <FooterCurve />
        <div className="pt-12 pb-6 text-sm text-slate-400">
          <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 items-start">
            <div className="flex items-center justify-center gap-4">
              <img src={logo} alt="dikonakaya logo" className="h-20 md:h-24 lg:h-28 aspect-square object-contain" />
              <div className="text-white">
                <p>Dikonakaya is a freelance pixel artist</p>
                <p>and photographer based in the Philippines &lt;3</p>
                <br />
                <Link to="/contact" className="text-white hover:text-slate-400 transition-colors" onClick={scrollToTop}>
                  Get in touch!
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 grid-rows-2 gap-y-4 text-center place-items-center">
              {socials.map((s) => <SocialLink key={s.name} social={s} hovered={hovered} setHovered={setHovered} />)}
            </div>
          </div>
          <div className="my-4 max-w-[1200px] mx-auto"><Divider /></div>
          <div className="text-center">© {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  )
}
