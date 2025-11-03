// src/pages/Home.tsx
import React from "react";
import { motion } from "framer-motion";
import Carousel from "../components/Carousel";
import PortfolioGrid from "../components/PortfolioGrid";
import logo from "../assets/logo.png";
import { portfolioData } from "../data/portfolio.data";

export default function Home() {

  return (
    <section className="bg-[#1E1E25] overflow-x-hidden">
      <div className="-mb-20 grid w-full grid-cols-1 lg:grid-cols-[30%_70%] items-stretch">
        {/* Left */}
        <div className="p-8 flex items-center justify-center bg-gradient-to-b from-[#373944] to-[#1E1E25] shadow-md lg:h-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
            <img src={logo} alt="…" className="h-[300px] w-auto" />
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">DIKONAKAYA</h1>
            <p className="mt-6 max-w-2xl text-slate-300">
              Pixel Artist
              <br />
              Photographer
              <br />
              Software Developer
            </p>
            <div className="mt-8 flex gap-4">
              <a className="btn bg-slate-800 hover:bg-slate-700" href="#projects">View Projects</a>
              <a className="btn border border-slate-700 hover:border-slate-600" href="#contact">Contact Me</a>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div className="h-[400px] lg:h-full shadow-md w-full overflow-hidden">
          <Carousel />
        </div>
      </div>

      <div className="flex items-start justify-center p-8 mt-20 h-full bg-gradient-to-b from-[#373944] to-[#1E1E25]">
        <div className="w-full gap-8">
          <div>
            <PortfolioGrid
              title="PIXEL ART"
              sets={portfolioData.filter(s =>
                ["Minecraft Armor", "Pixel Art Characters", "Pixel Art Portraits", "Chest Portraits", "GUI", "Pixel Art Banners", "More GUI"].includes(s.setTitle)
              )}
              showBorder={false}
            />
          </div>

          <div>
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
