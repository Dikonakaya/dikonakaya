import React, { useState } from 'react'

type Props = {
  title?: string
  images: string[]
}

const PortfolioGrid: React.FC<Props> = ({ title, images }) => {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(src)}
            className="block w-full aspect-square bg-gray-800 bg-center bg-cover rounded-md overflow-hidden focus:outline-none"
            style={{ backgroundImage: `url(${src})` }}
            aria-label={`Open ${title} image ${i + 1}`}
          />
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" role="dialog" aria-modal="true">
          <div className="relative max-w-4xl w-full mx-4">
            <button onClick={() => setLightbox(null)} className="absolute right-2 top-2 text-white bg-black/50 rounded-full p-2">✕</button>
            <img src={lightbox} alt="lightbox" className="w-full h-[70vh] object-contain rounded-md" />
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioGrid
