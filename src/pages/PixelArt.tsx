import { useLocation } from 'react-router-dom'
import PortfolioGrid from '../components/PortfolioGrid'
import { usePixelArt } from '../hooks'

export default function PixelArt() {
    const { sets } = usePixelArt()
    const { state } = useLocation()
    return (
        <section className="bg-[#1E1E25] min-h-screen">
            <div className="flex items-start justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <div className="w-full">
                    <PortfolioGrid title="PIXEL ART" sets={sets} showBorder={false} targetRowHeight={250} initialOpenSrc={state?.openSrc} />
                </div>
            </div>
        </section>
    )
}
