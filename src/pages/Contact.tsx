// src/pages/Contact.tsx
import React, { useState } from "react";

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [discord, setDiscord] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<null | "sending" | "sent" | "error">(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("sending");

        try {
            const resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, discord, subject, message }),
            });

            if (!resp.ok) {
                const body = await resp.json().catch(() => ({}));
                console.error('Contact send failed', body);
                setStatus('error');
                return;
            }

            setStatus('sent');
            setName(''); setEmail(''); setDiscord(''); setSubject(''); setMessage('');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    }

    return (
        <section className="bg-[#1E1E25] min-h-[35vw] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <h3 className="text-center text-3xl font-semibold text-white mt-6 mb-4">CONTACT ME</h3>
                <div className="h-[2px] bg-white w-full max-w-[600px] mx-auto mb-6" aria-hidden="true" />
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
                                placeholder="Your name"
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
                                placeholder="you@example.com"
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
                                placeholder="Subject"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">Discord (optional)</label>
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

                        <div className="md:col-span-2 flex items-center justify-between mt-2">
                            <div className="text-sm text-slate-400">
                                {status === "sent" ? "Message sent (demo)" : status === "sending" ? "Sending..." : ""}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="inline-flex items-center px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-500 disabled:opacity-60"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
