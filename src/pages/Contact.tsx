// src/pages/Contact.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [discord, setDiscord] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<null | "sending" | "sent" | "error">(null);

    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");

        try {
            const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
            // If a siteKey is configured, require a token from the v2 checkbox widget
            if (siteKey && !recaptchaToken) {
                // attempt to execute grecaptcha if rendered via ref
                if (recaptchaRef.current && typeof (recaptchaRef.current.execute) === 'function') {
                    const t = await (recaptchaRef.current as any).executeAsync();
                    setRecaptchaToken(t);
                } else {
                    setStatus('error');
                    console.error('recaptcha token missing');
                    return;
                }
            }

            const resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, discord, subject, message, recaptchaToken }),
            });

            if (!resp.ok) {
                const body = await resp.json().catch(() => ({}));
                console.error('Contact send failed', body);
                setStatus('error');
                return;
            }

            setStatus('sent');
            setName(''); setEmail(''); setDiscord(''); setSubject(''); setMessage('');
            // reset recaptcha widget
            if (recaptchaRef.current && typeof (recaptchaRef.current.reset) === 'function') {
                (recaptchaRef.current as any).reset();
                setRecaptchaToken(null);
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    }

    const navigate = useNavigate();
    const redirectTimer = useRef<number | null>(null);

    useEffect(() => {
        if (status === 'sent') {
            // show message for 3 seconds then redirect to home
            redirectTimer.current = window.setTimeout(() => {
                navigate('/');
            }, 3000) as unknown as number;
        }
        return () => {
            if (redirectTimer.current) {
                clearTimeout(redirectTimer.current as unknown as number);
                redirectTimer.current = null;
            }
        };
    }, [status, navigate]);

    return (
        <section className="bg-[#1E1E25] min-h-[35vw] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <h3 className="text-center text-3xl font-semibold text-white mt-6 mb-4">CONTACT ME</h3>
                <div className="h-[2px] bg-white w-full max-w-[600px] mx-auto mb-6" aria-hidden="true" />
                {status === 'sent' ? (
                    <div className="w-full max-w-3xl bg-[#0f1113]/30 backdrop-blur-sm] rounded-md p-8 flex items-center justify-center">
                        <div className="text-4xl md:text-6xl font-extrabold text-white text-center">Message sent!</div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl bg-[#0f1113]/30 backdrop-blur-sm] rounded-md p-8">
                        <p className="text-sm text-slate-300 text-center mt-2">Have a question or want to commission work? Drop a message and I will get back to you.</p>

                        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full rounded-md bg-[#0b0b0d] border border-[rgba(255,255,255,0.04)] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="Nickname"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-300">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full rounded-md bg-[#0b0b0d] border border-[rgba(255,255,255,0.04)] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-300">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="mt-1 w-full rounded-md bg-[#0b0b0d] border border-[rgba(255,255,255,0.04)] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="Title"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-300">Discord (if preferred)</label>
                                <input
                                    type="text"
                                    value={discord}
                                    onChange={(e) => setDiscord(e.target.value)}
                                    className="mt-1 w-full rounded-md bg-[#0b0b0d] border border-[rgba(255,255,255,0.04)] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                    placeholder="username#1234"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm text-slate-300">Message</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 w-full h-40 rounded-md bg-[#0b0b0d] border border-[rgba(255,255,255,0.04)] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                                    placeholder="Tell me what you're looking for..."
                                />
                            </div>

                            {siteKey && (
                                <div className="md:col-span-2 flex justify-center">
                                    <ReCAPTCHA
                                        sitekey={siteKey}
                                        ref={recaptchaRef}
                                        onChange={(...args: any[]) => setRecaptchaToken(args[0] as string | null)}
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2 flex flex-col items-center gap-2 mt-2">
                                <div className="text-base text-slate-400 text-center">
                                    {status === "sending" ? "Sending..." : ""}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={status === "sending"}
                                        className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-green-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-colors disabled:opacity-60"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}
