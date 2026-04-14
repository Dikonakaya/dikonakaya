import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo_head.png'
import { scrollToTop, scrollToId } from '../Shared'

export default function Navbar() {
  // State
  const [openMenu, setOpenMenu] = useState<'portfolio' | 'about' | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Router hooks
  const location = useLocation()
  const navigate = useNavigate()
  const isAboutActive = location.pathname === '/about'

  // Handle hash-based navigation (smooth scroll to section)
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    return () => clearTimeout(t)
  }, [location.hash])

  // Dropdown menu hover handlers with delay for better UX
  const handleMenuEnter = (menu: 'portfolio' | 'about') => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setOpenMenu(menu)
  }

  const handleMenuLeave = () => {
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 150)
  }

  // Close menus on outside click or Escape key
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setSidebarOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
      if (closeTimeout.current) clearTimeout(closeTimeout.current)
    }
  }, [])

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault()
      if (location.hash) navigate('/', { replace: true })
    }
    scrollToTop()
  }

  const handleHashLink = (hash: string, e: React.MouseEvent) => {
    if (location.pathname === '/' && location.hash === `#${hash}`) {
      e.preventDefault()
      scrollToId(hash)
    }
    setOpenMenu(null)
  }

  const NavLink = ({ to, children, isActive }: { to: string; children: React.ReactNode; isActive?: boolean }) => (
    <Link
      to={to}
      className={`flex items-center px-3 py-2.5 transition-colors relative z-10 hover:bg-[#1E1E25] ${isActive ? 'text-slate-400' : 'text-white'}`}
      onClick={scrollToTop}
    >
      {children}
    </Link>
  )

  return (
    <header className="w-full sticky top-0 z-50 shadow-md" ref={containerRef}>
      {/* Mobile header */}
      <div className="flex items-center h-10 bg-[#1E1E25] px-4 justify-center lg:hidden">
        <div className="absolute left-4" />
        <Link to="/" aria-label="Home" className="text-center text-lg font-bold text-white inline-flex items-center gap-2" onClick={handleHomeClick}>
          <img src={logoUrl} alt="Dikonakaya logo" className="w-[1.6em] h-[1.6em] object-contain -mr-[0.15em]" />
          DIKONAKAYA
        </Link>
        <div className="absolute right-4">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="p-1 rounded-md text-white bg-transparent hover:bg-white/5">
            ☰
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="items-center h-10 bg-[#1E1E25]">
          <div className="flex items-center px-4">
            <Link to="/" aria-label="Home" className="absolute left-6 top-0 h-full flex items-center gap-3 text-3xl font-extrabold text-white z-50" onClick={handleHomeClick}>
              <img src={logoUrl} alt="Dikonakaya logo" className="w-[1.6em] h-[1.6em] object-contain -mr-[0.35em]" />
              DIKONAKAYA
            </Link>
          </div>
          <nav className="flex justify-center px-24" />
          <div className="mt-1.5 flex items-center justify-end px-4">
            <Link to="/contact" aria-label="Commissions - Contact" className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-white hover:text-[#373944]" onClick={scrollToTop}>
              Commissions Open
            </Link>
          </div>
        </div>

        <div className="items-center h-10 bg-[#373944]">
          <div className="relative items-center px-4 h-10 overflow-hidden">
            <div className="absolute left-0 top-0 h-10 w-[300px] bg-[#1E1E25] pointer-events-none" />
            <svg className="absolute left-[300px] top-0 h-10 w-28 pointer-events-none text-[#1E1E25]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 C0,90 0,0 45,0 L0,0 L0,0 Z" fill="currentColor" />
            </svg>
          </div>

          <nav className="-mt-10 flex lg:justify-center px-24">
            <ul className="flex items-center text-sm">
              {/* Portfolio dropdown */}
              <li className="relative" onMouseEnter={() => handleMenuEnter('portfolio')} onMouseLeave={handleMenuLeave}>
                <Link
                  to="/"
                  aria-expanded={openMenu === 'portfolio'}
                  className="flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#1E1E25]"
                  onClick={(e) => { handleHomeClick(e); setOpenMenu(null) }}
                >
                  <span className={location.pathname === '/' ? 'text-slate-400' : 'text-white'}>Art Portfolio</span>
                </Link>
                <ul
                  aria-hidden={openMenu !== 'portfolio'}
                  className={`absolute left-0 mt-2 w-40 bg-black/50 border border-black/20 rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ${openMenu === 'portfolio' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                  <li>
                    <Link to="/#pixelart" onClick={(e) => handleHashLink('pixelart', e)} className="block px-4 py-2 transition-colors hover:bg-black">Pixel Art</Link>
                  </li>
                  <li>
                    <Link to="/#photography" onClick={(e) => handleHashLink('photography', e)} className="block px-4 py-2 transition-colors hover:bg-black">Photography</Link>
                  </li>
                </ul>
              </li>

              <li><NavLink to="/projects" isActive={location.pathname === '/projects'}>Projects</NavLink></li>
              <li><a href="https://ko-fi.com/dikonakaya" target="_blank" className="flex items-center px-3 py-2.5 transition-colors relative z-10 hover:bg-[#1E1E25]">Store</a></li>
              <li><NavLink to="/contact" isActive={location.pathname === '/contact'}>Contact</NavLink></li>

              {/* About dropdown */}
              <li className="relative" onMouseEnter={() => handleMenuEnter('about')} onMouseLeave={handleMenuLeave}>
                <Link
                  to="/about"
                  aria-expanded={openMenu === 'about'}
                  className="flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#1E1E25]"
                  onClick={(e) => {
                    if (location.pathname === '/about') {
                      e.preventDefault()
                      navigate('/about', { replace: true })
                    }
                    scrollToTop()
                    setOpenMenu(null)
                  }}
                >
                  <span className={isAboutActive ? 'text-slate-400' : 'text-white'}>About Me</span>
                </Link>
                <ul
                  aria-hidden={openMenu !== 'about'}
                  className={`absolute left-0 mt-2 w-40 bg-black/50 border border-black/20 rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ${openMenu === 'about' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                  <li>
                    <Link
                      to="/about#socials"
                      onClick={(e) => {
                        if (location.pathname === '/about') {
                          e.preventDefault()
                          navigate('/about#socials', { replace: true })
                          scrollToId('socials')
                        }
                        setOpenMenu(null)
                      }}
                      className={`block px-4 py-2 transition-colors hover:bg-black ${location.pathname === '/about' && location.hash === '#socials' ? 'bg-[#1E1E25]' : ''}`}
                    >
                      Socials
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          <div className="col-span-3 flex items-center justify-end" />
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!sidebarOpen}>
        <div className={`fixed inset-0 bg-black/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`fixed right-0 top-0 h-full w-72 bg-[#373944] p-4 transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-white">Menu</div>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-white p-1">✕</button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link to="/" className={`px-3 py-2 rounded text-white ${location.pathname === '/' && !location.hash ? 'bg-[#1E1E25]' : ''}`} onClick={(e) => { handleHomeClick(e); setSidebarOpen(false) }}>Portfolio</Link>
            <Link to="/#pixelart" className={`px-3 py-2 rounded text-white ${location.hash === '#pixelart' ? 'bg-[#1E1E25]' : ''}`} onClick={(e) => { handleHashLink('pixelart', e); setSidebarOpen(false) }}>Pixel Art</Link>
            <Link to="/#photography" className={`px-3 py-2 rounded text-white ${location.hash === '#photography' ? 'bg-[#1E1E25]' : ''}`} onClick={(e) => { handleHashLink('photography', e); setSidebarOpen(false) }}>Photography</Link>
            <Link to="/projects" className={`px-3 py-2 rounded text-white ${location.pathname === '/projects' ? 'bg-[#1E1E25]' : ''}`} onClick={() => { scrollToTop(); setSidebarOpen(false) }}>Projects</Link>
            <a href="https://ko-fi.com/dikonakaya" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded text-white" onClick={() => setSidebarOpen(false)}>Store</a>
            <Link to="/about" className={`px-3 py-2 rounded text-white ${location.pathname === '/about' && location.hash !== '#socials' ? 'bg-[#1E1E25]' : ''}`} onClick={(e) => { if (location.pathname === '/about') { e.preventDefault(); navigate('/about', { replace: true }) }; scrollToTop(); setSidebarOpen(false) }}>About Me</Link>
            <Link to="/about#socials" className={`px-3 py-2 rounded text-white ${location.pathname === '/about' && location.hash === '#socials' ? 'bg-[#1E1E25]' : ''}`} onClick={(e) => { if (location.pathname === '/about') { e.preventDefault(); navigate('/about#socials', { replace: true }); scrollToId('socials') }; setSidebarOpen(false) }}>Socials</Link>
            <Link to="/contact" className={`px-3 py-2 rounded text-white ${location.pathname === '/contact' ? 'bg-[#1E1E25]' : ''}`} onClick={() => { scrollToTop(); setSidebarOpen(false) }}>Contact</Link>
          </nav>
        </aside>
      </div>
    </header>
  )
}