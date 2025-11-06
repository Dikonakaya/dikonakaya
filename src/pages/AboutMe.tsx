import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

type Skill = {
    title: string
    since?: string
    specialization?: string
    programs?: string
}

type Job = {
    title: string
    company: string
    period: string
    description: string
}

const hardSkills: Skill[] = [
    { title: 'Programmer', since: 'Self-Taught Since 2015\nBS Computer Science Major in Data Science Since 2026' },
    { title: 'Pixel Artist', since: 'Since 2018' },
    { title: 'Photographer', since: 'Since 2024' },
    { title: 'Graphics Designer', since: 'Since 2016' },
    { title: 'Video Editor', since: 'Since 2016', specialization: 'Gaming Videos & Vlogs', programs: 'Adobe Premiere Pro, Audacity' },
    { title: 'Minecraft 3D Model Maker', since: 'Since 2022', specialization: 'Blocks & Weapons', programs: 'Blockbench' },
    { title: 'Digital/Traditional Artist (Hobby Only)', since: 'Since 2018', programs: 'Clip Studio Paint' },
]

const workExperience: Job[] = [
    { title: 'Texture Artist', company: 'Lunar Studios', period: '2023 - 2024', description: 'Part of the texture artist team; contributed textures and basic 3D modelling for various Minecraft projects.' },
    { title: 'Texture Artist', company: 'Pixelmon Realms', period: 'Since 2023', description: 'Worked on monthly content updates and texture assets for a Pokemon-inspired Minecraft server.' },
    { title: 'Pixel Artist', company: 'MobBlocks', period: 'Since 2022', description: 'Created pixel art assets for Minecraft Marketplace releases.' },
    { title: 'Freelancer', company: '(Discord & Fiverr)', period: 'Since 2020', description: 'Commissioned pixel art and graphics.' },
]

export default function AboutMe() {
    return (
        <section className="bg-gradient-to-b from-[#373944] to-[#1E1E25] min-h-screen flex flex-col py-12">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-6 -ml-4">
                    <img src={logo} alt="dikonakaya logo" className="h-24 w-auto" />
                    <h3 className="text-left text-4xl font-semibold text-white -ml-4 mt-8">ABOUT ME</h3>
                </div>
                <div className="h-[2px] bg-white w-full max-w-[900px] mt-2 mb-6" aria-hidden="true" />
            </div>
            <div className="flex-1 flex flex-col items-center px-6">
                <div className="w-full max-w-4xl rounded-md p-8">

                    <p className="-mt-6 text-sm text-slate-300 text-center">
                        Hello everyone o// I'm Dikonakaya and I'm a pixel artist, photographer, software developer, and content creator. I like watching anime, playing video games, making art, and learning new things. Below is a summary of some hard skills and professional experience I've garnered over the years. If you're interested in working with me or just want to say hi, feel free to reach out via the contact page! I hope you're having a wonderful week and take care :D
                    </p>

                    {/* Experience & Skills */}
                    <div id="experience" className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left */}
                        <div className="bg-black/30 rounded-md p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Hard Skills</h3>
                            <div className="space-y-3">
                                {hardSkills.map((s) => (
                                    <div key={s.title} className="p-3 rounded-md bg-black/50 hover:bg-black/70 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-white font-medium">{s.title}</div>
                                                {s.since && (
                                                    <div className="text-xs text-slate-400">
                                                        {s.since.split(/<br\s*\/?>|\n/).map((line, i) => (
                                                            <div key={i}>{line}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                {s.specialization && <div className="text-xs text-slate-300">{s.specialization}</div>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {s.programs && <div><strong>Programs:</strong> {s.programs}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="bg-black/30 rounded-md p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Work Experience</h3>
                            <div className="space-y-4">
                                {workExperience.map((j) => (
                                    <div key={j.company + j.title} className="p-3 rounded-md bg-black/50 hover:bg-black/70 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-white font-medium">{j.title} <span className="text-slate-300">- {j.company}</span></div>
                                                <div className="text-xs text-slate-400">{j.period}</div>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-300">{j.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center mt-6">
                        <Link to="/contact" onClick={() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { } }}>
                            <button className="inline-flex items-center justify-center px-4 py-2 min-w-[160px] rounded-md bg-green-600 text-white text-base font-medium hover:bg-white hover:text-[#373944] transition-colors">
                                Contact Me
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="h-[2px] bg-white w-full max-w-[900px] mt-2 mb-6" aria-hidden="true" />
            </div>
        </section>
    )
}
