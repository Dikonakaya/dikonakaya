/**
 * Projects Page
 * 
 * Displays the ProjectGrid component showcasing major projects
 * like Minecraft texture packs and other creative works.
 * 
 * @author Dikonakaya
 */

import ProjectGrid from '../components/ProjectGrid'

export default function Projects() {
    return (
        <section className="overflow-x-hidden min-h-[80vh] flex flex-col">
            <div className="flex-1 flex items-start justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <div className="w-full">
                    <div id="projects" className="scroll-mt-24">
                        <ProjectGrid title="PROJECTS" />
                    </div>
                </div>
            </div>
        </section>
    )
}
