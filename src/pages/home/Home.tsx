import React from 'react'
import { motion } from 'framer-motion'
import { homeData } from './home.data'

export default function Hero() {
  return (
    <section className="py-20">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          {homeData.title}
        </h1>
        <p className="mt-6 max-w-2xl text-slate-300">
          {homeData.subtitle}
        </p>
        <div className="mt-8 flex gap-4">
          <a className="btn bg-slate-800 hover:bg-slate-700" href="#projects">View Projects</a>
          <a className="btn border border-slate-700 hover:border-slate-600" href="#contact">Contact</a>
        </div>
      </motion.div>
    </section>
  )
}
