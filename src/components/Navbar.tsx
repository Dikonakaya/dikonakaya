import React, { useEffect, useRef, useState } from "react";

const Header: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<"portfolio" | "more" | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header id="SITE_HEADER" className="w-full sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top background bar / layers (visual similarity) */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 items-center h-16">
            {/* Left CTAs (similar to "Commissions Closed" and "?") */}
            <div className="col-span-3 flex items-center space-x-2">
              <a
                href="#"
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-900"
                aria-label="Commissions Closed"
              >
                Commissions Closed
              </a>
              <a
                href="#"
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium border border-gray-200 hover:bg-gray-200"
                aria-label="Help"
              >
                ?
              </a>
            </div>

            {/* Center navigation */}
            <nav className="col-span-6 flex justify-center" aria-label="Site">
              <ul className="flex items-center space-x-6 text-sm text-gray-700">
                {/* Portfolio (dropdown) */}
                <li className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === "portfolio" ? null : "portfolio")}
                    aria-expanded={openMenu === "portfolio"}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    Portfolio
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.75 1.25L5 5.5L9.25 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {openMenu === "portfolio" && (
                    <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md text-gray-700 py-1 z-50">
                      <li>
                        <a href="#characters" className="block px-4 py-2 hover:bg-gray-50">Characters</a>
                      </li>
                      <li>
                        <a href="#environments" className="block px-4 py-2 hover:bg-gray-50">Environments</a>
                      </li>
                      <li>
                        <a href="#icons" className="block px-4 py-2 hover:bg-gray-50">Icons</a>
                      </li>
                      <li>
                        <a href="#other" className="block px-4 py-2 hover:bg-gray-50">Other</a>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Contact */}
                <li>
                  <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
                </li>

                {/* More (dropdown) */}
                <li className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === "more" ? null : "more")}
                    aria-expanded={openMenu === "more"}
                    className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                  >
                    More
                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.75 1.25L5 5.5L9.25 1.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {openMenu === "more" && (
                    <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md text-gray-700 py-1 z-50">
                      <li>
                        <a href="#email" className="block px-4 py-2 hover:bg-gray-50">Email List</a>
                      </li>
                      <li>
                        <a href="#asset-packs" className="block px-4 py-2 hover:bg-gray-50">Asset Packs</a>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </nav>

            {/* Right placeholder for spacing / future controls */}
            <div className="col-span-3 flex justify-end">
              {/* empty for now */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
