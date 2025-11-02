import React, { useState, useEffect, useRef } from 'react';

type Props = {
  title?: string;
  images: string[];
  showBorder?: boolean;
};

type ImageData = {
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  title: string;
  description: string;
};

type RowData = {
  images: ImageData[];
  scale: number;
};

const PortfolioGrid: React.FC<Props> = ({ title, images, showBorder = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const GAP = 16; // px gap between images
  const TARGET_ROW_HEIGHT = 300;

  // Load images and compute aspect ratios, add placeholder titles/descriptions
  useEffect(() => {
    const promises = images.map(
      (src, index) =>
        new Promise<ImageData>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            resolve({
              src,
              width: img.width,
              height: img.height,
              aspectRatio: img.width / img.height,
              title: `Placeholder Title ${index + 1}`,
              description: `Placeholder description for image ${index + 1}`,
            });
          };
        })
    );

    Promise.all(promises).then(setImageData);
  }, [images]);

  // Calculate justified rows
  const calculateRows = () => {
    if (!containerRef.current || !imageData.length) return;
    const containerWidth = containerRef.current.offsetWidth;
    const tempRows: RowData[] = [];

    let currentRow: ImageData[] = [];
    let currentRowWidth = 0;

    imageData.forEach((img, index) => {
      const scaledWidth = img.aspectRatio * TARGET_ROW_HEIGHT;
      const gap = currentRow.length > 0 ? GAP : 0;

      if (currentRowWidth + scaledWidth + gap <= containerWidth) {
        currentRow.push(img);
        currentRowWidth += scaledWidth + gap;
      } else {
        const totalGap = GAP * (currentRow.length - 1);
        const scale = (containerWidth - totalGap) / currentRowWidth;
        tempRows.push({ images: currentRow, scale });

        currentRow = [img];
        currentRowWidth = scaledWidth;
      }

      if (index === imageData.length - 1 && currentRow.length) {
        const totalGap = GAP * (currentRow.length - 1);
        const scale = (containerWidth - totalGap) / currentRowWidth;
        tempRows.push({ images: currentRow, scale });
      }
    });

    setRows(tempRows);
  };

  useEffect(() => {
    calculateRows();
  }, [imageData]);

  // Recalculate on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => calculateRows());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [imageData]);

  // Close lightbox on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="w-full">
      {title && <h3 className="text-3xl font-Akrobat font-semibold text-white mb-4">{title}</h3>}
      {title && <div className="h-[2px] bg-white w-[480px] mx-auto mb-6" aria-hidden="true" />}

      <div ref={containerRef} className="w-full flex flex-col gap-4">
        {rows.map((row, rowIndex) => {
          const totalGap = GAP * (row.images.length - 1);
          const scaledWidths = row.images.map((img) => img.aspectRatio * TARGET_ROW_HEIGHT * row.scale);

          const totalWidth = scaledWidths.reduce((acc, w) => acc + w, 0) + totalGap;
          const diff = containerRef.current!.offsetWidth - totalWidth;
          if (diff !== 0) {
            for (let i = 0; i < Math.round(diff); i++) {
              scaledWidths[i % scaledWidths.length] += 1;
            }
          }

          return (
            <div key={rowIndex} className="flex gap-4">
              {row.images.map((img, idx) => {
                const width = scaledWidths[idx];
                const height = TARGET_ROW_HEIGHT * row.scale;

                return (
                  <button
                    key={idx}
                    onClick={() => setLightbox(img.src)}
                    className="relative overflow-hidden p-0 border-0 focus:outline-none rounded-md"
                    aria-label={`Open image ${idx + 1} of row ${rowIndex + 1}`}
                  >
                    {/* Container grows on hover */}
                    <div className="relative group">
                      {/* Border container (does not scale) */}
                      <div
                        className={`relative rounded-md overflow-hidden ${showBorder ? 'border-[2px] border-white' : ''}`}
                        style={{ width, height }}
                      >
                        {/* Image scales independently */}
                        <img
                          src={img.src}
                          alt=""
                          className="w-full h-full object-cover block transition-transform duration-300 ease-in-out group-hover:scale-[1.1]"
                        />
                      </div>

                      {/* Overlay / text appears only on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>

                        {/* Text */}
                        <div className="relative flex flex-col justify-start p-4 text-left text-white">
                          <h4 className="text-lg font-semibold">{img.title}</h4>
                          <p className="text-sm mt-1">{img.description}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-2 top-2 text-white bg-black/50 rounded-full p-2 z-10"
            >
              ✕
            </button>
            <img
              src={lightbox}
              alt="lightbox"
              className="w-full h-[70vh] object-contain rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
