import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<"portfolio" | "more" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // small timeout to prevent menus from closing immediately when moving
  // cursor from the button into the submenu (prevents flicker)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  function handleMenuEnter(menu: "portfolio" | "more") {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpenMenu(menu);
  }

  function handleMenuLeave() {
    // delay closing slightly to allow pointer to reach submenu
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 150);
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setSidebarOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
    };
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 shadow-md" ref={containerRef}>

      {/* Mobile header (visible under lg) */}
      <div className="flex items-center h-10 bg-[#1E1E25] px-4 justify-center lg:hidden">
        <div className="absolute left-4">
        </div>

        <Link to="/" aria-label="Home" className="text-center text-lg font-bold text-white">DIKONAKAYA</Link>

        <div className="absolute right-4">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-1 rounded-md text-white bg-transparent hover:bg-white/5"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Desktop header (lg+) - original content */}
      <div className="hidden lg:block">

        {/* Upper Div */}
        <div className="items-center h-10 bg-[#1E1E25]">

          {/* Left: Logo */}
          <div className="flex items-center px-4">
            <Link to="/" aria-label="Home" className="absolute left-6 top-0 h-full flex items-center gap-3 text-3xl font-bold text-white z-50">
              DIKONAKAYA
            </Link>
          </div>

          {/* Center */}
          <nav className="flex justify-center px-24">
          </nav>

          {/* Right: Status */}
          <div className="mt-1.5 flex items-center justify-end px-4">
            <Link
              to="/contact"
              aria-label="Commissions - Contact"
              className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-[#FFFFFF] hover:text-[#373944] transition-colors"
            >
              Commissions Open
            </Link>
          </div>
        </div>

        {/* Lower Div */}
        <div className="items-center h-10 bg-[#373944]">

          {/* Left */}
          <div className="relative items-center px-4 h-10 overflow-hidden">
            <div className="absolute left-0 top-0 h-10 w-[255px] bg-[#1E1E25] pointer-events-none" />
            <svg
              className="absolute left-[255px] top-0 h-10 w-28 pointer-events-none text-[#1E1E25]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,100 C0,90 0,0 45,0 L0,0 L0,0 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Center */}
          <nav className="-mt-10 flex lg:justify-center px-24">
            <ul className="flex items-center text-sm">

              {/* Portfolio (dropdown) */}
              <li
                className="relative"
                onMouseEnter={() => handleMenuEnter("portfolio")}
                onMouseLeave={() => handleMenuLeave()}
              >
                <Link
                  to="/"
                  aria-expanded={openMenu === "portfolio"}
                  className={`flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#1E1E25]`}
                >
                  <span className={`${location.pathname === "/" ? "text-slate-400" : "text-white"}`}>Art Portfolio</span>
                </Link>

                <ul
                  aria-hidden={openMenu !== "portfolio"}
                  className={`absolute left-0 mt-2 w-40 bg-[rgba(0,0,0,0.5)] border border-[rgba(0,0,0,0.2)] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "portfolio" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}
                >
                  <li>
                    <Link to="/#pixelart" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Pixel Art</Link>
                  </li>
                  <li>
                    <Link to="/#photography" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Photography</Link>
                  </li>
                </ul>
              </li>

              {/* Projects */}
              <li>
                <Link to="#projects" className="flex items-center px-3 py-2.5 hover:bg-[#1E1E25] transition-colors relative z-10">Projects</Link>
              </li>

              {/* Store */}
              <li>
                <Link to="#store" className="flex items-center px-3 py-2.5 hover:bg-[#1E1E25] transition-colors relative z-10">Store</Link>
              </li>

              {/* More */}
              <li
                className="relative"
                onMouseEnter={() => handleMenuEnter("more")}
                onMouseLeave={() => handleMenuLeave()}
              >
                <button
                  aria-expanded={openMenu === "more"}
                  className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#1E1E25] transition-colors"
                >
                  <span className="text-white">More</span>
                  <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 1.25L5 5.5L9.25 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <ul
                  aria-hidden={openMenu !== "more"}
                  className={`absolute left-0 mt-2 w-48 bg-[rgba(0,0,0,0.5)] border border-[rgba(0,0,0,0.2)] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "more" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}
                >
                  <li>
                    <Link to="#about" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">About Me</Link>
                  </li>
                  <li>
                    <Link to="#socials" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Socials</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Contact</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {/* Right */}
          <div className="col-span-3 flex items-center justify-end">
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className={`fixed inset-0 z-50 pointer-events-none ${sidebarOpen ? 'pointer-events-auto' : ''}`} aria-hidden={!sidebarOpen}>
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Drawer */}
        <aside className={`fixed right-0 top-0 h-full w-72 bg-[#373944] p-4 transform transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-white">Menu</div>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-white p-1">✕</button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded text-white ${location.pathname === "/" ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="/#pixelart"
              className={`px-3 py-2 rounded text-white ${location.hash === "#pixelart" ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)} v
            >
              Pixel Art
            </Link>
            <Link
              to="/#photography"
              className={`px-3 py-2 rounded text-white ${location.hash === "#photography" ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              Photography
            </Link>
            <Link
              to="/#projects"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#projects" || location.pathname === "/projects") ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/#store"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#store" || location.pathname === "/store") ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              Store
            </Link>
            <Link
              to="/#about"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#about" || location.pathname === "/about") ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              About Me
            </Link>
            <Link
              to="/#socials"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#socials" || location.pathname === "/socials") ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              Socials
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#contact" || location.pathname === "/contact") ? "bg-[#1E1E25]" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Header;
