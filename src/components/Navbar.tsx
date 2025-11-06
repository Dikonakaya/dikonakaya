import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { scrollToTop } from "../utils/scrollToTop";
import { scrollToId } from "../utils/scrollToId";

const Navbar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<"portfolio" | "more" | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMoreActive = ["/about", "/contact", "/socials"].includes(location.pathname);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(t);
  }, [location.hash]);



  function handleMenuEnter(menu: "portfolio" | "more") {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpenMenu(menu);
  }

  function handleMenuLeave() {
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 150);
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpenMenu(null);
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

      {/* Mobile header */}
      <div className="flex items-center h-10 bg-[#1E1E25] px-4 justify-center lg:hidden">
        <div className="absolute left-4" />
        <Link
          to="/"
          aria-label="Home"
          className="text-center text-lg font-bold text-white"
          onClick={(e) => {
            if (location.pathname === "/") {
              e.preventDefault();
              if (location.hash) {
                navigate("/", { replace: true });
              }
            }
            scrollToTop();
          }}
        >
          DIKONAKAYA
        </Link>
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

      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="items-center h-10 bg-[#1E1E25]">
          <div className="flex items-center px-4">
            <Link
              to="/"
              aria-label="Home"
              className="absolute left-6 top-0 h-full flex items-center gap-3 text-3xl font-bold text-white z-50"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  if (location.hash) {
                    navigate("/", { replace: true });
                  }
                }
                scrollToTop();
              }}
            >
              DIKONAKAYA
            </Link>
          </div>

          <nav className="flex justify-center px-24" />

          <div className="mt-1.5 flex items-center justify-end px-4">
            <Link
              to="/contact"
              aria-label="Commissions - Contact"
              className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-white hover:text-[#373944]"
              onClick={(e) => {
                scrollToTop();
              }}
            >
              Commissions Open
            </Link>
          </div>
        </div>

        <div className="items-center h-10 bg-[#373944]">
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

          <nav className="-mt-10 flex lg:justify-center px-24">
            <ul className="flex items-center text-sm">
              {/* Portfolio dropdown */}
              <li
                className="relative"
                onMouseEnter={() => handleMenuEnter("portfolio")}
                onMouseLeave={() => handleMenuLeave()}
              >
                <Link
                  to="/"
                  aria-expanded={openMenu === "portfolio"}
                  className={`flex items-center gap-2 px-3 py-2.5 transition-colors hover:bg-[#1E1E25]`}
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      if (location.hash) {
                        navigate("/", { replace: true });
                      }
                    }
                    scrollToTop();
                  }}
                >
                  <span className={`${location.pathname === "/" ? "text-slate-400" : "text-white"}`}>
                    Art Portfolio
                  </span>
                </Link>

                <ul
                  aria-hidden={openMenu !== "portfolio"}
                  className={`absolute left-0 mt-2 w-40 bg-[rgba(0,0,0,0.5)] border border-[rgba(0,0,0,0.2)] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "portfolio" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"
                    }`}
                >
                  <li>
                    <Link
                      to="/#pixelart"
                      onClick={(e) => {
                        if (location.pathname === "/" && location.hash === "#pixelart") {
                          e.preventDefault();
                          scrollToId("pixelart");
                        }
                        setOpenMenu(null);
                      }}
                      className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-black focus:bg-black"
                    >
                      Pixel Art
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#photography"
                      onClick={(e) => {
                        if (location.pathname === "/" && location.hash === "#photography") {
                          e.preventDefault();
                          scrollToId("photography");
                        }
                        setOpenMenu(null);
                      }}
                      className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-black focus:bg-black"
                    >
                      Photography
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  to="/projects"
                  className={`flex items-center px-3 py-2.5 transition-colors relative z-10 ${location.pathname === "/projects" ? "text-slate-400" : "text-white"} hover:bg-[#1E1E25]`}
                  onClick={(e) => {
                    scrollToTop();
                  }}
                >
                  Projects
                </Link>
              </li>

              <li>
                <Link to="#store" className="flex items-center px-3 py-2.5 hover:bg-[#1E1E25] transition-colors relative z-10">
                  Store
                </Link>
              </li>

              {/* More dropdown */}
              <li
                className="relative"
                onMouseEnter={() => handleMenuEnter("more")}
                onMouseLeave={() => handleMenuLeave()}
              >
                <button aria-expanded={openMenu === "more"} className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#1E1E25] transition-colors">
                  <span className={`${isMoreActive ? "text-slate-400" : "text-white"}`}>More</span>
                  <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.75 1.25L5 5.5L9.25 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <ul
                  aria-hidden={openMenu !== "more"}
                  className={`absolute left-0 mt-2 w-48 bg-[rgba(0,0,0,0.5)] border border-[rgba(0,0,0,0.2)] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "more" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"
                    }`}
                >
                  <li>
                    <Link to="/about" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-black focus:bg-black"
                      onClick={(e) => {
                        scrollToTop();
                      }}>
                      About Me
                    </Link>
                  </li>
                  <li>
                    <Link to="#socials" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-black focus:bg-black">
                      Socials
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-black focus:bg-black"
                      onClick={(e) => {
                        scrollToTop();
                      }}
                    >
                      Contact
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
      <div className={`fixed inset-0 z-50 pointer-events-none ${sidebarOpen ? "pointer-events-auto" : ""}`} aria-hidden={!sidebarOpen}>
        <div className={`fixed inset-0 bg-black/40 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`fixed right-0 top-0 h-full w-72 bg-[#373944] p-4 transform transition-transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-white">Menu</div>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-white p-1">✕</button>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded text-white ${(location.pathname === "/" && !location.hash) ? "bg-[#1E1E25]" : ""}`}
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  if (location.hash) navigate("/", { replace: true });
                }
                setSidebarOpen(false);
                scrollToTop();
              }}
            >
              Portfolio
            </Link>

            <Link
              to="/#pixelart"
              onClick={(e) => {
                if (location.pathname === "/" && location.hash === "#pixelart") {
                  e.preventDefault();
                  scrollToId("pixelart");
                }
                setSidebarOpen(false);
              }}
              className={`px-3 py-2 rounded text-white ${location.hash === "#pixelart" ? "bg-[#1E1E25]" : ""}`}
            >
              Pixel Art
            </Link>

            <Link
              to="/#photography"
              onClick={(e) => {
                if (location.pathname === "/" && location.hash === "#photography") {
                  e.preventDefault();
                  scrollToId("photography");
                }
                setSidebarOpen(false);
              }}
              className={`px-3 py-2 rounded text-white ${location.hash === "#photography" ? "bg-[#1E1E25]" : ""}`}
            >
              Photography
            </Link>

            <Link
              to="/projects"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#contact" || location.pathname === "/projects") ? "bg-[#1E1E25]" : ""}`}
              onClick={(e) => {
                scrollToTop();
                setSidebarOpen(false);
              }}
            >
              Projects
            </Link>
            <Link to="/#store" className={`px-3 py-2 rounded text-white ${(location.hash === "#store" || location.pathname === "/store") ? "bg-[#1E1E25]" : ""}`} onClick={() => setSidebarOpen(false)}>
              Store
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#contact" || location.pathname === "/about") ? "bg-[#1E1E25]" : ""}`}
              onClick={(e) => {
                scrollToTop();
                setSidebarOpen(false);
              }}
            >
              About Me
            </Link>
            <Link to="/#socials" className={`px-3 py-2 rounded text-white ${(location.hash === "#socials" || location.pathname === "/socials") ? "bg-[#1E1E25]" : ""}`} onClick={() => setSidebarOpen(false)}>
              Socials
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded text-white ${(location.hash === "#contact" || location.pathname === "/contact") ? "bg-[#1E1E25]" : ""}`}
              onClick={(e) => {
                scrollToTop();
                setSidebarOpen(false);
              }}
            >
              Contact
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Navbar;