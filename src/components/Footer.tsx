import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { scrollToTop } from '../Shared'
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
  const nav = useNavigate()
  const isAbout = location.pathname === '/about'
  const [hovered, setHovered] = useState<string | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [mouseDownOutside, setMouseDownOutside] = useState(false)

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass)
      setErr(''); setShowLogin(false); nav('/admin')
    } catch { setErr('Invalid credentials') }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowLogin(false)
    if (showLogin) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showLogin])

  useEffect(() => {
    if (showLogin) {
      const scrollY = window.scrollY
      document.body.style.overflowY = 'scroll'; document.body.style.position = 'fixed'; document.body.style.width = '100%'; document.body.style.top = `-${scrollY}px`
    }
    return () => { const top = document.body.style.top; document.body.style.overflowY = ''; document.body.style.position = ''; document.body.style.width = ''; document.body.style.top = ''; if (top) window.scrollTo(0, -parseInt(top)) }
  }, [showLogin])

  const socials = isAbout ? [...defaultSocials, ...extendedSocials] : defaultSocials

  const loginModal = showLogin && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onMouseDown={() => setMouseDownOutside(true)} onMouseUp={() => mouseDownOutside && setShowLogin(false)}>
      <div className="bg-[#373944] rounded-md animate-[fadeSlide_.2s]" onMouseDown={e => { e.stopPropagation(); setMouseDownOutside(false) }} onMouseUp={e => e.stopPropagation()}>
        <div className="px-4 pt-1 w-full bg-[#1E1E25] text-white font-bold rounded-t-md">DIKONAKAYA</div>
        <div className="px-4 py-2">
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="min-w-[16rem] px-5 py-1 my-2 block border border-white/10 rounded-md bg-[#0b0b0d] text-white placeholder:text-slate-500" />
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="min-w-[16rem] px-5 py-1 my-2 block border border-white/10 rounded-md pr-10 bg-[#0b0b0d] text-white placeholder:text-slate-500" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPass ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
            </button>
          </div>
          <div className="flex items-center justify-end">
            {err && <p className="mr-4 text-red-400">{err}</p>}
            <button onClick={login} className="px-5 py-1 my-2 rounded-md font-bold bg-green-600 text-white hover:bg-white hover:text-[#373944] transition-colors">LOGIN</button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isAbout) {
    return (
      <>
        <footer id="socials" className="bg-[#373944] w-full pt-16">
          <div className="relative">
            <FooterCurve />
            <div className="pt-12 pb-6 text-sm text-slate-400">
              <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
                <div className="flex items-center gap-6 -ml-4">
                  <img src={logo} alt="dikonakaya logo" className="h-24 w-auto cursor-pointer select-none" draggable={false} onClick={() => setShowLogin(true)} onContextMenu={e => e.preventDefault()} onMouseDown={e => e.preventDefault()} />
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
        {loginModal}
      </>
    )
  }

  return (
    <>
      <footer className="bg-[#373944] w-full pt-16">
        <div className="relative">
          <FooterCurve />
          <div className="pt-12 pb-6 text-sm text-slate-400">
            <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 items-start">
              <div className="flex items-center justify-center gap-4">
                <img src={logo} alt="dikonakaya logo" className="h-20 md:h-24 lg:h-28 aspect-square object-contain cursor-pointer select-none" draggable={false} onClick={() => setShowLogin(true)} onContextMenu={e => e.preventDefault()} onMouseDown={e => e.preventDefault()} />
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
      {loginModal}
    </>
  )
}
