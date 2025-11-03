// src/pages/Projects.tsx
import React from "react";
import PortfolioGrid from "../components/PortfolioGrid";
import { portfolioData } from "../data/portfolio.data";

export default function Projects() {

    return (
        <section className="bg-[#1E1E25] overflow-x-hidden">
            <div className="flex items-start justify-center p-8 mt-10 h-full bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <div className="w-full gap-8">
                    <div id="pixelart" className="scroll-mt-[6rem]">
                        <PortfolioGrid
                            title="PIXEL ART"
                            sets={portfolioData.filter(s =>
                                ["Minecraft Armor", "Pixel Art Characters", "Pixel Art Portraits", "Chest Portraits", "Minecraft GUI", "Pixel Art Banners", "More GUI"].includes(s.setTitle)
                            )}
                            showBorder={false}
                        />
                    </div>

                    <div id="photography" className="scroll-mt-[6rem]">
                        <PortfolioGrid
                            title="PHOTOGRAPHY"
                            sets={portfolioData.filter(s =>
                                ["Mini Cooper", "Tofu60 V1", "RK87", "Jris65", "2025 Keyboard Collection"].includes(s.setTitle)
                            )}
                            showBorder={true}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
