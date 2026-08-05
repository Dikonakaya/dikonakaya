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
                    <div className="mb-8">
                        <PortfolioGrid title="PORTRAIT PHOTOGRAPHY" sets={sets} display={['portraitphotography']} showBorder={true} targetRowHeight={550} initialOpenSrc={state?.openSrc} />
                    </div>
                    <div className="mb-8">
                        <PortfolioGrid title="CAR PHOTOGRAPHY" sets={sets} display={['carphotography']} showBorder={true} targetRowHeight={350} initialOpenSrc={state?.openSrc} />
                    </div>
                    <div className="mb-8">
                        <PortfolioGrid title="PRODUCT PHOTOGRAPHY" sets={sets} display={['productphotography']} showBorder={true} targetRowHeight={350} initialOpenSrc={state?.openSrc} />
                    </div>
                    <div className="mb-8">
                        <PortfolioGrid title="OTHER PHOTOGRAPHY" sets={sets} display={['otherphotography']} showBorder={true} targetRowHeight={350} initialOpenSrc={state?.openSrc} />
                    </div>
                </div>
            </div>
        </section>
    )
}
