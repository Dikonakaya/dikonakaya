import React from "react";
import ProjectGrid from "../components/ProjectGrid";
import { projectsData } from "../data/projects.data";

export default function Projects() {

    return (
        <section className="overflow-x-hidden min-h-screen flex flex-col">
            <div className="flex-1 flex items-start justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <div className="w-full gap-8">
                    <div id="projects" className="scroll-mt-[6rem]">
                        <ProjectGrid title="PROJECTS" showBorder={false} />
                    </div>
                </div>
            </div>
        </section>
    );
}
