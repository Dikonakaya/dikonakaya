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

const PortfolioGrid: React.FC<Props> = ({ title, images, showBorder = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const GAP = 16; // Tailwind gap-4
  const TARGET_ROW_HEIGHT = 300; // Base row height

  // Load images and get real aspect ratios
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

  // Calculate justified rows
  useEffect(() => {
    if (!containerRef.current || !imageData.length) return;
    const containerWidth = containerRef.current.offsetWidth;
    const tempRows: any[] = [];

    let currentRow: ImageData[] = [];
    let currentRowWidth = 0;

    imageData.forEach((img, index) => {
      const scaledWidth = img.aspectRatio * TARGET_ROW_HEIGHT;
      const gap = currentRow.length > 0 ? GAP : 0;

      if (currentRowWidth + scaledWidth + gap <= containerWidth) {
        currentRow.push(img);
        currentRowWidth += scaledWidth + gap;
      } else {
        // Scale current row to fit container
        const scale = (containerWidth - GAP * (currentRow.length - 1)) / currentRowWidth;
        tempRows.push({ images: currentRow, scale });
        currentRow = [img];
        currentRowWidth = scaledWidth;
      }

      // Last row
      if (index === imageData.length - 1 && currentRow.length) {
        const scale = (containerWidth - GAP * (currentRow.length - 1)) / currentRowWidth; // stretch last row
        tempRows.push({ images: currentRow, scale });
      }
    });

    setRows(tempRows);
  }, [imageData, containerRef.current?.offsetWidth]);

  return (
    <div className="w-full">
      {title && <h3 className="text-3xl font-Akrobat font-semibold text-white mb-4">{title}</h3>}
      {title && <div className="h-[2px] bg-white w-[480px] mx-auto mb-6" aria-hidden="true" />}

      <div ref={containerRef} className="w-full flex flex-col gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.images.map((img: ImageData, idx: number) => {
              const height = TARGET_ROW_HEIGHT * row.scale;
              const width = height * img.aspectRatio;
              return (
                <button
                  key={idx}
                  onClick={() => setLightbox(img.src)}
                  className="rounded-md overflow-hidden p-0 border-0 focus:outline-none"
                  aria-label={`Open image ${idx + 1} of row ${rowIndex + 1}`}
                >
                  <img
                    src={img.src}
                    alt=""
                    className={`block rounded-md object-contain ${showBorder ? 'border-[2px] border-white' : ''}`}
                    style={{ width, height }}
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        ))}
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
            <img
              src={lightbox}
              alt="lightbox"
              className="w-full h-[70vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
