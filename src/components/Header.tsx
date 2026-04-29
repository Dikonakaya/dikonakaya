import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo_head.png'
import { scrollToTop, scrollToId } from '../functions'

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<'portfolio' | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    return () => clearTimeout(t)
  }, [location.hash])

  const handleMenuEnter = () => {
    if (closeTimeout.current) { clearTimeout(closeTimeout.current); closeTimeout.current = null }
    setOpenMenu('portfolio')
  }

  const handleMenuLeave = () => {
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 150)
  }

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenMenu(null); setSidebarOpen(false) }
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
    if (location.pathname === '/') {
      e.preventDefault()
      scrollToId(hash)
    }
    setOpenMenu(null)
    setSidebarOpen(false)
  }

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
            <Link
              to="/#contact"
              aria-label="Commissions - Contact"
              className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-white hover:text-[#373944]"
              onClick={(e) => handleHashLink('contact', e)}
            >
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
              {/* Home dropdown */}
              <li className="relative" onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
                <Link
                  to="/"
                  aria-expanded={openMenu === 'portfolio'}
                  className="flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#1E1E25]"
                  onClick={(e) => { handleHomeClick(e); setOpenMenu(null) }}
                >
                  <span className={location.pathname === '/' ? 'text-slate-400' : 'text-white'}>Home</span>
                </Link>
                <ul
                  aria-hidden={openMenu !== 'portfolio'}
                  className={`absolute left-0 mt-2 w-40 bg-black/50 border border-black/20 rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ${openMenu === 'portfolio' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                >
                  <li>
                    <Link to="/#contact" onClick={(e) => { handleHashLink('contact', e); setOpenMenu(null) }} className="block px-4 py-2 transition-colors hover:bg-black">Contact</Link>
                  </li>
                  <li>
                    <Link to="/#about" onClick={(e) => { handleHashLink('about', e); setOpenMenu(null) }} className="block px-4 py-2 transition-colors hover:bg-black">About Me</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  to="/pixelart"
                  className={`flex items-center px-3 py-2.5 transition-colors relative z-10 hover:bg-[#1E1E25] ${location.pathname === '/pixelart' ? 'text-slate-400' : 'text-white'}`}
                  onClick={scrollToTop}
                >
                  Pixel Art
                </Link>
              </li>
              <li>
                <Link
                  to="/photography"
                  className={`flex items-center px-3 py-2.5 transition-colors relative z-10 hover:bg-[#1E1E25] ${location.pathname === '/photography' ? 'text-slate-400' : 'text-white'}`}
                  onClick={scrollToTop}
                >
                  Photography
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className={`flex items-center px-3 py-2.5 transition-colors relative z-10 hover:bg-[#1E1E25] ${location.pathname === '/projects' ? 'text-slate-400' : 'text-white'}`}
                  onClick={scrollToTop}
                >
                  Projects
                </Link>
              </li>
              <li><a href="https://ko-fi.com/dikonakaya" target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2.5 transition-colors relative z-10 hover:bg-[#1E1E25]">Store</a></li>
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
            <Link to="/" className={`px-3 py-2 rounded text-white ${location.pathname === '/' && !location.hash ? 'bg-[#1E1E25]' : ''}`} onClick={(e) => { handleHomeClick(e); setSidebarOpen(false) }}>Home</Link>
            <Link to="/pixelart" className={`px-3 py-2 rounded text-white ${location.pathname === '/pixelart' ? 'bg-[#1E1E25]' : ''}`} onClick={() => { scrollToTop(); setSidebarOpen(false) }}>Pixel Art</Link>
            <Link to="/photography" className={`px-3 py-2 rounded text-white ${location.pathname === '/photography' ? 'bg-[#1E1E25]' : ''}`} onClick={() => { scrollToTop(); setSidebarOpen(false) }}>Photography</Link>
            <Link to="/projects" className={`px-3 py-2 rounded text-white ${location.pathname === '/projects' ? 'bg-[#1E1E25]' : ''}`} onClick={() => { scrollToTop(); setSidebarOpen(false) }}>Projects</Link>
            <a href="https://ko-fi.com/dikonakaya" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded text-white" onClick={() => setSidebarOpen(false)}>Store</a>
            <Link to="/#about" className="px-3 py-2 rounded text-white" onClick={(e) => { handleHashLink('about', e); setSidebarOpen(false) }}>About Me</Link>
            <Link to="/#contact" className="px-3 py-2 rounded text-white" onClick={(e) => { handleHashLink('contact', e); setSidebarOpen(false) }}>Contact</Link>
          </nav>
        </aside>
      </div>
    </header>
  )
}
