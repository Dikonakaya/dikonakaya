import React from 'react'
import { motion } from 'framer-motion'
import Carousel from '../../components/Carousel'
import PortfolioGrid from '../../components/PortfolioGrid'

export default function Home() {
  return (
    <section className="bg-[#1E1E25]">
      <div className="grid w-full h-[60vh]" style={{ gridTemplateColumns: '30% 70%' }}>
        {/* Left 35% */}
        <div className="flex items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Dikonakaya
            </h1>
            <p className="mt-6 max-w-2xl text-slate-300">
              Pixel Artist
            </p>
            <div className="mt-8 flex gap-4">
              <a className="btn bg-slate-800 hover:bg-slate-700" href="#projects">View Projects</a>
              <a className="btn border border-slate-700 hover:border-slate-600" href="#contact">Contact</a>
            </div>
          </motion.div>
        </div>

        {/* Right 65% - carousel */}
        <div className="h-full">
          <Carousel />
        </div>
      </div>
      <div className="flex items-start justify-center p-8 h-full bg-gradient-to-b from-[#373944] to-[#1E1E25]">
        <div className="w-full grid grid-cols-1 gap-8">
          <div className="text-center">
            {/* Pixel Art grid */}
            <PortfolioGrid
              title="Pixel Art"
              images={[
                'https://i.imgur.com/mRbxWae.jpeg',
                'https://i.imgur.com/Dj39gt9.jpeg',
                'https://i.imgur.com/Lsx3xpq.jpeg',
                'https://i.imgur.com/27S6hV4.jpeg',
                'https://i.imgur.com/dxt23tx.jpeg'
              ]}
            />
          </div>

          <div className="text-center">
            {/* Photography grid */}
            <PortfolioGrid
              title="Photography"
              images={[
                'https://i.imgur.com/PqiFjAc.jpeg',
                'https://i.imgur.com/9SUBbRR.jpeg',
                'https://i.imgur.com/Dj39gt9.jpeg',
                'https://i.imgur.com/27S6hV4.jpeg'
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
