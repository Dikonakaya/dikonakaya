// src/components/PortfolioGrid.tsx
import React, { useEffect, useRef, useState } from "react";

export type PortfolioImage = {
  src: string;
  title?: string;
  description?: string;
  tags?: string[];
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
};

export type PortfolioSet = {
  setTitle: string;
  year?: number;
  description?: string;
  tags?: string[];
  camera?: string;
  lens?: string;
  images: PortfolioImage[];
};

type Props = {
  title?: string;
  sets: PortfolioSet[];
  showBorder?: boolean;
};

type PortfolioImageWithMeta = PortfolioImage & {
  width: number;
  height: number;
  aspectRatio: number;
  resizedSrc: string;
};

type RowData = {
  images: PortfolioImageWithMeta[];
  scale: number;
  capped: boolean;
};

const MAX_WIDTH = 1920;
const GAP = 8;
const TARGET_ROW_HEIGHT = 300;
const MAX_ROW_HEIGHT = 500;

const PortfolioGrid: React.FC<Props> = ({ title, sets, showBorder = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageData, setImageData] = useState<PortfolioImageWithMeta[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const mergedImages: PortfolioImage[] = sets.flatMap((set) =>
    set.images.map((img) => ({
      ...img,
      title: img.title ?? set.setTitle,
      description: img.description ?? set.description,
      tags: img.tags ?? set.tags ?? [],
      camera: img.camera ?? set.camera,
      lens: img.lens ?? set.lens,
      date: img.date ?? (set.year ? `${set.year}-01-01` : undefined),
    }))
  );

  const resizeImageDataUrl = (imgEl: HTMLImageElement) => {
    if (!imgEl.width || imgEl.width <= MAX_WIDTH) return imgEl.src;
    const scale = MAX_WIDTH / imgEl.width;
    const canvas = document.createElement("canvas");
    canvas.width = MAX_WIDTH;
    canvas.height = Math.round(imgEl.height * scale);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  };

  useEffect(() => {
    let mounted = true;
    setIsPreloading(true);

    const promises = mergedImages.map(
      (it) =>
        new Promise<PortfolioImageWithMeta>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = it.src;
          img.onload = () => {
            const resizedSrc = resizeImageDataUrl(img);
            const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
            const height = Math.round((img.height * width) / img.width);
            resolve({ ...it, width, height, aspectRatio: width / height, resizedSrc });
          };
          img.onerror = () => {
            const fallbackWidth = Math.min(MAX_WIDTH, 1200);
            resolve({
              ...it,
              width: fallbackWidth,
              height: Math.round(fallbackWidth * 0.66),
              aspectRatio: fallbackWidth / Math.round(fallbackWidth * 0.66),
              resizedSrc: it.src,
            });
          };
        })
    );

    Promise.all(promises).then((arr) => {
      if (!mounted) return;
      setImageData(arr);
      setIsPreloading(false);
    });

    return () => {
      mounted = false;
    };
  }, [sets]);

  const calculateRows = () => {
    if (!containerRef.current || imageData.length === 0) return;
    const containerWidth = containerRef.current.offsetWidth;
    const tempRows: RowData[] = [];

    let currentRow: PortfolioImageWithMeta[] = [];
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
        const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT;
        tempRows.push({ images: currentRow, scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale, capped });

        currentRow = [img];
        currentRowWidth = scaledWidth;
      }

      if (index === imageData.length - 1 && currentRow.length) {
        const totalGap = GAP * (currentRow.length - 1);
        const scale = (containerWidth - totalGap) / currentRowWidth;
        const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT;
        tempRows.push({ images: currentRow, scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale, capped });
      }
    });

    setRows(tempRows);
  };

  useEffect(() => {
    calculateRows();
  }, [imageData]);

  useEffect(() => {
    if (!containerRef.current) return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => calculateRows());
    });
    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [imageData]);

  useEffect(() => {
    if (lightboxIndex !== null) setLightboxVisible(true);
    else {
      const t = setTimeout(() => setLightboxVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [lightboxIndex]);

  const openLightboxAt = (index: number) => setLightboxIndex(index);
  const nextLightbox = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % imageData.length));
  const prevLightbox = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + imageData.length) % imageData.length));

  return (
    <div className="w-full">
      {title && (
        <>
          <h3 className="text-3xl font-semibold text-white mb-4">{title}</h3>
          <div className="h-[2px] bg-white w-[480px] mx-auto mb-6" aria-hidden="true" />
        </>
      )}

      <div ref={containerRef} className="w-full flex flex-col gap-4">
        {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Preparing images…</div>}

        {rows.map((row, rowIndex) => {
          const totalGap = GAP * (row.images.length - 1);
          const scaledWidths = row.images.map((img) => img.aspectRatio * TARGET_ROW_HEIGHT * row.scale);

          return (
            <div
              key={rowIndex}
              className={`flex ${row.capped ? "justify-center" : ""} gap-4 transition-all duration-300 ease-in-out`}
              style={{
                transform: `scale(${row.capped ? 0.98 : 1})`,
                opacity: 1,
              }}
            >
              {row.images.map((img, idx) => {
                const width = scaledWidths[idx];
                const height = Math.round(TARGET_ROW_HEIGHT * row.scale);
                const flattenedIndex = imageData.findIndex(
                  (x) => x.resizedSrc === img.resizedSrc && x.title === img.title
                );

                return (
                  <button
                    key={idx}
                    onClick={() => openLightboxAt(flattenedIndex === -1 ? 0 : flattenedIndex)}
                    className="relative overflow-visible p-0 border-0 focus:outline-none rounded-md transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                  >
                    <div className="relative group">
                      <div
                        className={`relative rounded-md overflow-hidden ${showBorder ? "border-[2px] border-white" : ""}`}
                        style={{ width, height }}
                      >
                        <img
                          src={img.resizedSrc}
                          alt={img.title || ""}
                          className="w-full h-full object-cover block transition-transform duration-300 ease-in-out group-hover:scale-[1.05] will-change-transform"
                          loading="lazy"
                        />
                      </div>

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
                        <div className="absolute rounded-md inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
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

      {(lightboxIndex !== null || lightboxVisible) && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-250 ${
            lightboxIndex !== null ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prevLightbox}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 text-white rounded-full p-3"
            >
              ‹
            </button>

            <div className="w-full max-w-[1400px] bg-transparent flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-center">
                <img
                  src={imageData[lightboxIndex ?? 0]?.resizedSrc || ""}
                  alt={imageData[lightboxIndex ?? 0]?.title || ""}
                  className="max-h-[82vh] w-auto object-contain rounded-md"
                />
              </div>

              {lightboxIndex !== null && (
                <div className="w-full bg-black/40 p-4 rounded-md text-white max-w-[1400px]">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{imageData[lightboxIndex].title}</h2>
                      <p className="text-sm text-slate-200 mt-1">{imageData[lightboxIndex].description}</p>
                      <div className="mt-3 text-sm">
                        <strong>Camera:</strong> {imageData[lightboxIndex].camera || "—"} &nbsp; • &nbsp;
                        <strong>Lens:</strong> {imageData[lightboxIndex].lens || "—"}
                      </div>
                    </div>

                    <div className="min-w-[180px] text-sm">
                      <div className="mb-2">
                        <strong>Details</strong>
                      </div>
                      <div className="text-slate-200">
                        <div className="mt-2">
                          <strong>Year:</strong>{" "}
                          {imageData[lightboxIndex].date
                            ? new Date(imageData[lightboxIndex].date).getFullYear()
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                      {(imageData[lightboxIndex].tags || []).map((t) => (
                        <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded text-slate-100">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={prevLightbox}
                        className="px-3 py-2 bg-white/10 rounded hover:bg-white/20"
                      >
                        Prev
                      </button>
                      <button
                        onClick={nextLightbox}
                        className="px-3 py-2 bg-white/10 rounded hover:bg-white/20"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={nextLightbox}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 text-white rounded-full p-3"
            >
              ›
            </button>
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-6 top-6 z-50 bg-black/40 hover:bg-black/60 text-white rounded-full p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
