import React from 'react'
import { motion } from 'framer-motion'
import Carousel from '../../components/Carousel'
import PortfolioGrid from '../../components/PortfolioGrid'
import logo from '../../assets/logo.png'

export default function Home() {
  return (
    <section className="bg-[#1E1E25]">
      <div className="grid w-full h-[60vh]" style={{ gridTemplateColumns: '30% 70%' }}>

        {/* Left */}
        <div className="flex items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25] shadow-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
            <img src={logo} alt="…" className="h-[300px] w-auto" />
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              DIKONAKAYA
            </h1>
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
        <div className="h-full shadow-md">
          <Carousel />
        </div>
      </div>

      <div className="flex items-start justify-center p-8 h-full bg-gradient-to-b from-[#373944] to-[#1E1E25]">
        <div className="w-full grid grid-cols-1 gap-8">
          <div className="text-center">
            {/* Pixel Art grid */}
            <PortfolioGrid
              title="PIXEL ART"
              images={[
                'https://lh3.googleusercontent.com/sitesv/AAzXCkdQXOmVwjF8e4cTdduagHGY43s6SKqdeK2dT5UpO_2hp0yllgtvLwuAl1Kzp3Hp0hw6mn0llfsfuFqk7uintalI6Uk912gFpzNxACqmFMvB4jndeWBM7S1PLzHJC2WxY6MATSiu1E9C4VEVdfn1fUoDVMulwtAYfZcQT_MYNdFg9OEULkQDl7fFDXSs7bF1k52OYsC87chuZeXJc8T0uOl1h4IimCudIssWapk=w1280',
                'https://lh3.googleusercontent.com/sitesv/AAzXCkftXOsGBm6UfeVVpz56bw1KFgB08YzDclJqrzuESv1FGLY5DAO3JkFUfO_DRbRGVbL-YEoyAqgrCiLVO1sgvRTsMiTPWu2sYact4VYcCq-LFkrUyQN15pmmB6cHs-JoPCoe1RgDSI5E1hyz00KVl8HrLjhj1rcj0jIhHnKMukA0om9Y695nxCDf0-Yp-EbyGq3PcmF43s6mBUVLaY4rovgnoUmn_XdAyfIQd4Y=w1280',
                'https://lh3.googleusercontent.com/sitesv/AAzXCkfJakXJq5g3XGrExLGVoRxpb1swE5ejSmqIX5LBgjH3F-KzFGFzuI-9kOZBD7ofwLPWIVV0567SV3QQbpiKV4knXbnmLENoCfmAMh6zXf6Z0MfJcBK_dZzs-SNn6rlMEdlF8msrPJvgeI4Ev3UFMD0YXBPQdt-PBpQS2nemBgLjbDL3uzN1av3i=w1280',
                'https://lh3.googleusercontent.com/sitesv/AAzXCkeXOu3fABrNyTNK62khUYUHN_tJzwi5KJmN6qhkJYAmjHqCHfmmAV5-t6vaQ0aeZ_4kCguTi5x3RrMXKYXHd6Izw0vZfmVKY3pE9IzfwagezZdGJnfEhqZLGG-wpPbezTP4pljAqypgQjOd-5PArU23xiNpOJX0QguJ96g8WX0Evj4OZSbtQFgg=w1280'
              ]}
              showBorder={false}
            />
          </div>

          <div className="text-center">
            {/* Photography grid */}
            <PortfolioGrid
              title="PHOTOGRAPHY"
              images={[
                'https://i.imgur.com/NLuGcjE.jpeg',
                'https://i.imgur.com/PqiFjAc.jpeg',
                'https://i.imgur.com/9SUBbRR.jpeg',
                'https://i.imgur.com/Dj39gt9.jpeg',
                'https://i.imgur.com/27S6hV4.jpeg'
              ]}
              showBorder={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
