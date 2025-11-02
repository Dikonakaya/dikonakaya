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
    <header className="w-full sticky top-0 z-50 relative shadow-md">

      {/* Upper Div */}
      <div className="grid grid-cols-12 items-center h-10 bg-[#1E1E25]">

        {/* Left: Logo */}
        <div className="col-span-3 flex items-center px-4">
          <a href="#" className="absolute left-6 top-0 h-full flex items-center gap-3 text-3xl font-bold text-white z-50">
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
            className="inline-flex items-center px-3 py-1 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-[#FFFFFF] hover:text-[#373944] transition-colors"
          >
            Commissions Open
          </a>
        </div>
      </div>

      {/* Lower Div */}
      <div className="grid grid-cols-12 items-center h-10 bg-[#373944]">

        {/* Left */}
        <div className="col-span-3 relative flex items-center px-4 h-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[40%] bg-[#1E1E25] pointer-events-none" />
          <svg
            className="absolute left-[40%] top-0 h-full w-28 pointer-events-none text-[#1E1E25]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,100 C0,90 0,0 45,0 L0,0 L0,0 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Center */}
        <nav className="col-span-6 flex justify-center px-24">
          <ul className="flex items-center text-sm">

            {/* Portfolio (dropdown) */}
            <li
              className="relative"
              onMouseEnter={() => handleMenuEnter("portfolio")}
              onMouseLeave={() => handleMenuLeave()}
            >
              <button
                aria-expanded={openMenu === "portfolio"}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#1E1E25] transition-colors"
              >
                <span className="text-white">Art Portfolio</span>
              </button>

              <ul
                aria-hidden={openMenu !== "portfolio"}
                className={`absolute left-0 mt-2 w-40 bg-[rgba(0,0,0,0.5)] border border-[rgba(0,0,0,0.2)] rounded-md shadow-md text-white py-1 z-50 transition-opacity duration-200 ease-out transform ${openMenu === "portfolio" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0 pointer-events-none"}`}
              >
                <li>
                  <a href="#pixelart" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Pixel Art</a>
                </li>
                <li>
                  <a href="#photography" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Photography</a>
                </li>
              </ul>
            </li>

            {/* Projects */}
            <li>
              <a href="#projects" className="flex items-center px-3 py-2.5 hover:bg-[#1E1E25] transition-colors">Projects</a>
            </li>

            {/* Store */}
            <li>
              <a href="#store" className="flex items-center px-3 py-2.5 hover:bg-[#1E1E25] transition-colors">Store</a>
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
                  <a href="#about" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">About Me</a>
                </li>
                <li>
                  <a href="#socials" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Socials</a>
                </li>
                <li>
                  <a href="#contact" className="block px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-[#1E1E25] focus:bg-[#1E1E25]">Contact</a>
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
