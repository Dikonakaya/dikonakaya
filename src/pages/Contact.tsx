import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import { Divider } from '../Shared'

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', discord: '', subject: '', message: '' })
    const [status, setStatus] = useState<null | 'sending' | 'sent' | 'error'>(null)
    const [submittedName, setSubmittedName] = useState<string | null>(null)
    const recaptchaRef = useRef<ReCAPTCHA>(null)
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined
    const navigate = useNavigate()
    const redirectTimer = useRef<number | null>(null)

    const updateField = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }))

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

            if (!resp.ok) {
                console.error('Contact send failed', await resp.json().catch(() => ({})))
                setStatus('error')
                return
            }

            setSubmittedName(formData.name || null)
            setStatus('sent')
            setFormData({ name: '', email: '', discord: '', subject: '', message: '' })
            recaptchaRef.current?.reset?.()
            setRecaptchaToken(null)
        } catch (err) {
            console.error(err)
            setStatus('error')
        }
    }

    useEffect(() => {
        if (status === 'sent') {
            redirectTimer.current = window.setTimeout(() => navigate('/'), 8000)
        }
        return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current) }
    }, [status, navigate])

    const inputClass = 'mt-1 w-full rounded-md bg-[#0b0b0d] border border-white/5 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500'

    return (
        <section className="bg-[#1E1E25] min-h-[35vw] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <h3 className="text-center text-3xl font-semibold text-white mt-6 mb-4">
                    {status === 'sent' ? 'MESSAGE SENT' : 'CONTACT ME'}
                </h3>
                <Divider className="w-full max-w-[900px] mb-6" />

                <div className="w-full max-w-3xl bg-black/30 backdrop-blur-sm rounded-md p-8">
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
                                <textarea required value={formData.message} onChange={updateField('message')} className={`${inputClass} h-40 resize-none`} placeholder="Tell me what you're looking for..." />
                            </div>

                            {siteKey && (
                                <div className="md:col-span-2 flex justify-center">
                                    <ReCAPTCHA sitekey={siteKey} ref={recaptchaRef} onChange={setRecaptchaToken as any} />
                                </div>
                            )}

                            <div className="md:col-span-2 flex flex-col items-center gap-2 mt-2">
                                {status === 'sending' && <div className="text-base text-slate-400">Sending...</div>}
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
        </section>
    )
}
