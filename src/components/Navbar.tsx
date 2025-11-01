import React, { useEffect, useRef, useState } from "react";

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<"portfolio" | "more" | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // small timeout to prevent menus from closing immediately when moving
  // cursor from the button into the submenu (prevents flicker)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("click", onDocClick);
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
    };
  }, []);

  return (
    <header className="w-full sticky top-0 z-50">
      <div className="grid grid-cols-12 items-center h-10 bg-[#1E1E25]">

        {/* Left: Logo */}
        <div className="col-span-3 flex items-center px-4">
          <a href="#" className="flex items-center gap-3">
            DIKONAKAYA
          </a>
        </div>

        {/* Center */}
        <nav className="col-span-6 flex justify-center px-24">
        </nav>

        {/* Right: Status */}
        <div className="col-span-3 flex items-center justify-end px-4">
          <a
            href="#"
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-[#1E1E25] transition-colors"
            aria-label="Commissions Closed"
          >
            Commissions Closed
          </a>
        </div>

      </div>

      <div className="grid grid-cols-12 items-center h-10 bg-[#373944]">

        {/* Left */}
        <div className="col-span-3 relative flex items-center px-4 h-full overflow-hidden">
          {/* solid left quarter */}
          <div className="absolute left-0 top-0 h-full w-[30%] bg-[#1E1E25] pointer-events-none" />

          {/* decorative curved fade starting at the 25% mark and fading to transparent to the right */}
          <svg className="absolute left-[30%] top-0 h-full w-28 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <linearGradient id="curve" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#1E1E25" stopOpacity="1" />
                <stop offset="100%" stopColor="#1E1E25" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* path: curve from top-left of svg to bottom-right, fills area to the left of the curve */}
            <path d="M0,100 C0,90 0,0 45,0 L0,0 L0,0 Z" fill="url(#curve)" />
          </svg>
        </div>

        {/* Center navigation */}
        <nav className="col-span-6 flex justify-center px-24">
          <ul className="flex items-center space-x-6 text-sm">

            {/* Portfolio (dropdown) */}
            <li
              className="relative"
              onMouseEnter={() => handleMenuEnter("portfolio")}
              onMouseLeave={() => handleMenuLeave()}
            >
              <button
                aria-expanded={openMenu === "portfolio"}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1E1E25] transition-colors"
              >
                <span className="text-white">Portfolio</span>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.75 1.25L5 5.5L9.25 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <ul
                aria-hidden={openMenu !== "portfolio"}
                className={`absolute left-0 mt-2 w-40 bg-[#373944] border border-[#33373c] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "portfolio" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}
              >
                <li>
                  <a href="#characters" className="block px-4 py-2 hover:bg-[#2f3237]">Characters</a>
                </li>
                <li>
                  <a href="#environments" className="block px-4 py-2 hover:bg-[#2f3237]">Environments</a>
                </li>
                <li>
                  <a href="#icons" className="block px-4 py-2 hover:bg-[#2f3237]">Icons</a>
                </li>
                <li>
                  <a href="#other" className="block px-4 py-2 hover:bg-[#2f3237]">Other</a>
                </li>
              </ul>
            </li>

            {/* Contact */}
            <li>
              <a href="#contact" className="px-2 py-1 rounded hover:bg-[#1E1E25] transition-colors">Contact</a>
            </li>

            {/* More */}
            <li
              className="relative"
              onMouseEnter={() => handleMenuEnter("more")}
              onMouseLeave={() => handleMenuLeave()}
            >
              <button
                aria-expanded={openMenu === "more"}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#1E1E25] transition-colors"
              >
                <span className="text-white">More</span>
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.75 1.25L5 5.5L9.25 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <ul
                aria-hidden={openMenu !== "more"}
                className={`absolute left-0 mt-2 w-48 bg-[#373944] border border-[#33373c] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "more" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}
              >
                <li>
                  <a href="#email" className="block px-4 py-2 hover:bg-[#2f3237]">Email List</a>
                </li>
                <li>
                  <a href="#asset-packs" className="block px-4 py-2 hover:bg-[#2f3237]">Asset Packs</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Right */}
        <div className="col-span-3 flex items-center justify-end">
        </div>

      </div>
    </header>
  );
};

export default Header;
