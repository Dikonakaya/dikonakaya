import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import Carousel from '../components/Carousel'
import Marquee from '../components/Marquee'
import logo from '../assets/logo.png'
import { Divider, SectionTitle, scrollToTop, scrollToId, discordFormatText } from '../functions'
import { usePhotography, usePixelArt, useSkills, useExperience } from '../hooks'

export default function Home() {
  const { sets: photoSets } = usePhotography()
  const { sets: pixelArtSets } = usePixelArt()
  const { skills } = useSkills()
  const { experience } = useExperience()

  const [formData, setFormData] = useState({ name: '', email: '', discord: '', subject: '', message: '' })
  const [status, setStatus] = useState<null | 'sending' | 'sent' | 'error'>(null)
  const [submittedName, setSubmittedName] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined

  const updateField = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      let token = recaptchaToken
      if (siteKey && !token && recaptchaRef.current) {
        const captcha = recaptchaRef.current as any
        if (typeof captcha.executeAsync === 'function') {
          token = await captcha.executeAsync()
          setRecaptchaToken(token)
        }
      }
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken: token }),
      })
      if (!resp.ok) { setStatus('error'); return }
      setSubmittedName(formData.name || null)
      setStatus('sent')
      setFormData({ name: '', email: '', discord: '', subject: '', message: '' })
      recaptchaRef.current?.reset?.()
      setRecaptchaToken(null)
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'mt-1 w-full rounded-md bg-[#0b0b0d] border border-white/5 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500'

  return (
    <section className="bg-[#1E1E25]">
      {/* Hero */}
      {/* Carousel */}
      <div className="hidden lg:block sticky top-10 lg:top-20 z-0 lg:ml-[33%] lg:h-[400px] xl:h-[600px] shadow-md overflow-hidden">
        <div className="w-full h-full">
          <Carousel />
        </div>
      </div>
      {/* Left */}
      <div className="h-[400px] xl:h-[600px] p-4 md:p-6 lg:p-8 lg:w-[33%] lg:-mt-[400px] xl:-mt-[600px] flex items-center justify-center bg-gradient-to-b from-[#373944] to-[#1E1E25] shadow-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
          <img src={logo} alt="Dikonakaya" className="h-[120px] md:h-[160px] lg:h-[180px] xl:h-[300px] w-auto mx-auto" />
          <h1 className="text-2xl md:text-4xl lg:text-4xl xl:text-6xl font-extrabold leading-snug md:leading-tight text-white text-center">DIKONAKAYA</h1>
          <p className="mt-2 md:mt-4 max-w-md md:max-w-2xl text-slate-400 text-sm md:text-base text-center leading-snug md:leading-tight">
            Pixel Artist<br />Photographer<br />Software Developer
          </p>
          <div className="mt-4 md:mt-6 flex justify-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center px-3 py-2 rounded-md bg-black text-white text-sm md:text-base font-medium hover:bg-white hover:text-[#373944] transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              onClick={scrollToTop}
            >
              View Projects
            </Link>
            <button
              className="inline-flex items-center px-3 py-2 rounded-md bg-black text-white text-sm md:text-base font-medium hover:bg-white hover:text-[#373944] transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              onClick={() => scrollToId('contact')}
            >
              Contact Me
            </button>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
        {/* Pixel Art Marquee */}
        <div id="pixelart" className="pt-8">
          <SectionTitle title="PIXEL ART" dividerClass="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px] mb-5" />
          <Marquee sets={pixelArtSets} height={300} linkTo="/pixelart" duration={200} mobileDuration={360} />
          <Marquee sets={pixelArtSets} height={300} linkTo="/pixelart" duration={200} mobileDuration={360} reverse />
        </div>

        {/* Photography Marquee */}
        <div id="photography" className="pt-8">
          <SectionTitle title="PHOTOGRAPHY" dividerClass="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px] mb-5" />
          <Marquee sets={photoSets} height={400} linkTo="/photography" showBorder duration={240} mobileDuration={400} />
          <Marquee sets={photoSets} height={400} linkTo="/photography" showBorder duration={240} mobileDuration={400} reverse />
        </div>

        {/* Commissions */}
        <div id="about" className="scroll-mt-12 flex flex-col items-center pt-12 pb-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="dikonakaya logo" className="h-24 w-auto" />
            <h3 className="text-3xl font-semibold text-white">COMMISSIONS</h3>
          </div>
          <Divider className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[600px] mt-4 mb-2" />
        </div>

        <p className="text-md text-white text-center max-w-6xl mx-auto px-6 pb-8 mt-2">
          Hello everyone o// I'm Dikonakaya and I do all sorts of art stuff, software development, and content creation.
          I like watching anime, playing video games, making art, and learning new things. Below is a summary of some hard
          skills and professional experience I've garnered over the years. If you're interested in working with me or just
          want to say hi, feel free to reach out! I hope you're having a wonderful week and take care :D
        </p>

        {/* About & Contact */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 px-6 py-4 pb-16 max-w-[1700px] mx-auto w-full">
          {/* Skills & Experience */}
          <div className="scroll-mt-24 w-full lg:flex-1 min-w-0 max-w-2xl lg:max-w-none flex flex-col gap-6">
            <div className="bg-black/30 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
              <div className="space-y-3">
                {skills.map(s => (
                  <div key={s.id} className="p-3 rounded-md bg-black/50 hover:bg-black/70 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-white font-medium">{s.title}</div>
                        {s.year > 0 && <div className="text-xs text-slate-400">Since {s.year}</div>}
                        {s.description && (
                          <div className="text-xs text-slate-400 mt-1" dangerouslySetInnerHTML={{ __html: discordFormatText(s.description) }} />
                        )}
                      </div>
                      {s.status && <div className="text-xs text-slate-300 mt-1 shrink-0">{s.status}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/30 rounded-md p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Work Experience</h3>
              <div className="space-y-4">
                {experience.map(j => (
                  <div key={j.id} className="p-3 rounded-md bg-black/50 hover:bg-black/70 transition-colors">
                    <div className="text-white font-medium">{j.role}{j.company ? <span className="text-slate-300"> - {j.company}</span> : null}</div>
                    <div className="text-xs text-slate-400">{j.period}</div>
                    <div className="mt-2 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: discordFormatText(j.details) }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact */}
          <div id="contact" className="scroll-mt-24 w-full lg:flex-1 min-w-0 max-w-2xl lg:max-w-none">
            <div className="w-full bg-black/30 backdrop-blur-sm rounded-md p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
              {status === 'sent' && <h4 className="text-xl font-bold text-white text-center mb-2">Message Sent</h4>}
              <p className="text-sm text-slate-300 text-center mt-2">
                {status === 'sent'
                  ? submittedName
                    ? `Thanks for messaging ${submittedName}! I'll get back to you as soon as possible! Please await a reply via email or Discord DMs ヾ(•ω•\`)o`
                    : "Thank you for messaging! I will get back to you as soon as possible! Please await a reply via email or Discord DMs ヾ(•ω•`)o"
                  : 'Have a question or want to commission work? Drop a message and I will get back to you.'}
              </p>
              {status !== 'sent' && (
                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300">Name</label>
                    <input type="text" required value={formData.name} onChange={updateField('name')} className={inputClass} placeholder="Nickname" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Email</label>
                    <input type="email" required value={formData.email} onChange={updateField('email')} className={inputClass} placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Subject</label>
                    <input type="text" required value={formData.subject} onChange={updateField('subject')} className={inputClass} placeholder="Title" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Discord (if preferred)</label>
                    <input type="text" value={formData.discord} onChange={updateField('discord')} className={inputClass} placeholder="username#1234" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-slate-300">Message</label>
                    <textarea required value={formData.message} onChange={updateField('message')} className={`${inputClass} h-[10rem] lg:h-[54.25rem] resize-none`} placeholder="Tell me what you're looking for..." />
                  </div>
                  {siteKey && (
                    <div className="md:col-span-2 flex justify-center">
                      <ReCAPTCHA sitekey={siteKey} ref={recaptchaRef} onChange={setRecaptchaToken as any} />
                    </div>
                  )}
                  <div className="md:col-span-2 flex flex-col items-center gap-2 mt-2">
                    {status === 'sending' && <div className="text-base text-slate-400">Sending...</div>}
                    {status === 'error' && <div className="text-base text-red-400">Something went wrong. Please try again.</div>}
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-green-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-all duration-300 hover:-translate-y-1 hover:scale-105 disabled:opacity-60"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

