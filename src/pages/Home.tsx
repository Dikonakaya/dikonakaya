// src/pages/Home.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import PortfolioGrid from "../components/PortfolioGrid";
import logo from "../assets/logo.png";
import { portfolioData } from "../data/portfolio.data";
import { scrollToTop } from "../utils/scrollToTop";

export default function Home() {

  return (
    <section className="bg-[#1E1E25] overflow-x-hidden">
      <div className="-mb-20 grid w-full grid-cols-1 lg:grid-cols-[30%_70%] items-stretch">

        {/* Left */}
        <div className="h-[400px] xl:h-[600px] p-4 md:p-6 lg:p-8 flex items-center justify-center bg-gradient-to-b from-[#373944] to-[#1E1E25] shadow-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
            <img src={logo} alt="…" className="h-[120px] md:h-[160px] lg:h-[180px] xl:h-[300px] w-auto mx-auto" />
            <h1 className="text-2xl md:text-4xl lg:text-4xl xl:text-6xl font-bold leading-snug md:leading-tight text-white text-center">DIKONAKAYA</h1>
            <p className="mt-2 md:mt-4 max-w-md md:max-w-2xl text-slate-400 text-sm md:text-base text-center leading-snug md:leading-tight">
              Pixel Artist
              <br />
              Photographer
              <br />
              Software Developer
            </p>
            <div className="mt-4 md:mt-6 flex justify-center gap-3 flex-nowrap">
              <Link
                to="/projects"
                className="inline-flex items-center px-3 py-2 rounded-md bg-black text-white text-sm md:text-base font-medium hover:bg-[#FFFFFF] hover:text-[#373944] transition-colors flex-none whitespace-nowrap"
                aria-label="View Projects"
                onClick={() => {
                  scrollToTop();
                }}
              >
                View Projects
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center px-3 py-2 rounded-md bg-black text-white text-sm md:text-base font-medium hover:bg-[#FFFFFF] hover:text-[#373944] transition-colors flex-none whitespace-nowrap"
                aria-label="Contact Me"
                onClick={() => {
                  scrollToTop();
                }}
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div className="hidden lg:block lg:h-[400px] xl:h-[600px] shadow-md w-full overflow-hidden">
          <Carousel />
        </div>
      </div>

      <div className="flex items-start justify-center p-8 mt-10 h-full bg-gradient-to-b from-[#373944] to-[#1E1E25]">
        <div className="w-full gap-8">
          <div id="pixelart" className="scroll-mt-[6rem]">
            <PortfolioGrid
              title="PIXEL ART"
              sets={portfolioData.filter(s =>
                ["Minecraft Armor", "Pixel Art Characters", "Pixel Art Portraits", "Chest Portraits", "Minecraft GUI", "Pixel Art Banners", "More GUI"].includes(s.setTitle)
              )}
              showBorder={false}
            />
          </div>

          <div id="photography" className="scroll-mt-[6rem]">
            <PortfolioGrid
              title="PHOTOGRAPHY"
              sets={portfolioData.filter(s =>
                ["Mini Cooper", "Tofu60 V1", "RK87", "Jris65", "2025 Keyboard Collection"].includes(s.setTitle)
              )}
              showBorder={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
