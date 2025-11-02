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

  const GAP = 16; // gap between images in px
  const TARGET_ROW_HEIGHT = 300;

  // Load images and compute aspect ratios
  useEffect(() => {
    const promises = images.map(
      (src) =>
        new Promise<ImageData>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            resolve({
              src,
              width: img.width,
              height: img.height,
              aspectRatio: img.width / img.height,
            });
          };
        })
    );

    Promise.all(promises).then(setImageData);
  }, [images]);

  // Function to calculate rows
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

  // Recalculate rows whenever images load
  useEffect(() => {
    calculateRows();
  }, [imageData]);

  // Use ResizeObserver to recalc rows whenever container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      calculateRows();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [imageData]);

  return (
    <div className="w-full">
      {title && <h3 className="text-3xl font-Akrobat font-semibold text-white mb-4">{title}</h3>}
      {title && <div className="h-[2px] bg-white w-[480px] mx-auto mb-6" aria-hidden="true" />}

      <div ref={containerRef} className="w-full flex flex-col gap-4">
        {rows.map((row, rowIndex) => {
          const totalGap = GAP * (row.images.length - 1);
          const scaledWidths = row.images.map((img) => img.aspectRatio * TARGET_ROW_HEIGHT * row.scale);

          // Fix rounding error so total row width equals container width
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
                    className="rounded-md overflow-hidden p-0 border-0 focus:outline-none"
                    aria-label={`Open image ${idx + 1} of row ${rowIndex + 1}`}
                  >
                    <div
                      className={`rounded-md ${showBorder ? 'border-[2px] border-white' : ''} overflow-hidden`}
                      style={{ width, height }}
                    >
                      <img src={img.src} alt="" className="w-full h-full block object-cover" loading="lazy" />
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" role="dialog" aria-modal="true">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-2 top-2 text-white bg-black/50 rounded-full p-2"
            >
              ✕
            </button>
            <img src={lightbox} alt="lightbox" className="w-full h-[70vh] object-contain rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
