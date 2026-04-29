import { useLocation } from 'react-router-dom'
import PortfolioGrid from '../components/PortfolioGrid'
import { usePhotography } from '../hooks'

export default function Photography() {
    const { sets } = usePhotography()
    const { state } = useLocation()
    return (
        <section className="bg-[#1E1E25] min-h-screen">
            <div className="flex items-start justify-center p-8 bg-gradient-to-b from-[#373944] to-[#1E1E25]">
                <div className="w-full">
                    <PortfolioGrid title="PHOTOGRAPHY" sets={sets} showBorder={true} targetRowHeight={350} initialOpenSrc={state?.openSrc} />
                </div>
            </div>
        </section>
    )
}
