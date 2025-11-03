// src/pages/Home.tsx
import React from "react";
import { motion } from "framer-motion";
import Carousel from "../components/Carousel";
import PortfolioGrid from "../components/PortfolioGrid";
import logo from "../assets/logo.png";
import { portfolioData } from "../data/portfolio.data";

export default function Home() {
  // Pixel art sample converted to object-format (you can replace titles/desc later)
  const pixelArtSet = {
    setTitle: "PIXEL ART",
    year: 2025,
    description: "A selection of pixel artworks.",
    tags: ["pixel", "art"],
    images: [
      {
        src: "https://lh3.googleusercontent.com/sitesv/AAzXCkdQXOmVwjF8e4cTdduagHGY43s6SKqdeK2dT5UpO_2hp0yllgtvLwuAl1Kzp3Hp0hw6mn0llfsfuFqk7uintalI6Uk912gFpzNxACqmFMvB4jndeWBM7S1PLzHJC2WxY6MATSiu1E9C4VEVdfn1fUoDVMulwtAYfZcQT_MYNdFg9OEULkQDl7fFDXSs7bF1k52OYsC87chuZeXJc8T0uOl1h4IimCudIssWapk=w1280",
      },
      {
        src: "https://lh3.googleusercontent.com/sitesv/AAzXCkftXOsGBm6UfeVVpz56bw1KFgB08YzDclJqrzuESv1FGLY5DAO3JkFUfO_DRbRGVbL-YEoyAqgrCiLVO1sgvRTsMiTPWu2sYact4VYcCq-LFkrUyQN15pmmB6cHs-JoPCoe1RgDSI5E1hyz00KVl8HrLjhj1rcj0jIhHnKMukA0om9Y695nxCDf0-Yp-EbyGq3PcmF43s6mBUVLaY4rovgnoUmn_XdAyfIQd4Y=w1280",
      },
      {
        src: "https://lh3.googleusercontent.com/sitesv/AAzXCkfJakXJq5g3XGrExLGVoRxpb1swE5ejSmqIX5LBgjH3F-KzFGFzuI-9kOZBD7ofwLPWIVV0567SV3QQbpiKV4knXbnmLENoCfmAMh6zXf6Z0MfJcBK_dZzs-SNn6rlMEdlF8msrPJvgeI4Ev3UFMD0YXBPQdt-PBpQS2nemBgLjbDL3uzN1av3i=w1280",
      },
    ],
  };

  return (
    <section className="bg-[#1E1E25] overflow-x-hidden">
      <div className="grid w-full grid-cols-1 lg:grid-cols-[30%_70%] min-h-[500px]">
        {/* Left */}
        <div className="flex items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25] shadow-md">
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
        <div className="h-[400px] lg:h-[600px] shadow-md w-full overflow-hidden">
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
