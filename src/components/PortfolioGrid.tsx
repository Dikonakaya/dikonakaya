import React, { useEffect, useRef, useState } from "react";
import Lightbox from "../modals/Lightbox";

// -------------------------------
// Type Definitions
// -------------------------------

// Represents a single portfolio image
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

// Represents a set/collection of images
export type PortfolioSet = {
  setTitle: string;
  year?: number;
  description?: string;
  tags?: string[];
  camera?: string;
  lens?: string;
  images: PortfolioImage[];
};

// Props passed into PortfolioGrid component
type Props = {
  title?: string;           // Optional title for the grid
  sets: PortfolioSet[];     // Array of image sets to display
  showBorder?: boolean;     // Whether to display a border around images
};

// Internal image type with extra metadata for layout calculations
type PortfolioImageWithMeta = PortfolioImage & {
  width: number;
  height: number;
  aspectRatio: number;
  resizedSrc: string;       // Can be a resized data URL for faster loading
  originalIndex?: number;   // original position in the merged images array
};

// Row layout data
type RowData = {
  images: PortfolioImageWithMeta[];
  scale: number;            // Scale factor applied to images to fit row
  capped: boolean;          // Whether row is capped at MAX_ROW_HEIGHT
};

// -------------------------------
// Constants
// -------------------------------
const MAX_WIDTH = 1920;           // Maximum width for resized images
const GAP = 8;                    // Gap between images in pixels
const TARGET_ROW_HEIGHT = 300;    // Desired height of each row
const MAX_ROW_HEIGHT = 500;       // Maximum allowed height for any row

// -------------------------------
// PortfolioGrid Component
// -------------------------------
const PortfolioGrid: React.FC<Props> = ({ title, sets, showBorder = true }) => {
  // Ref to the container div to measure its width
  const containerRef = useRef<HTMLDivElement | null>(null);

  // State to store processed image data
  const [imageData, setImageData] = useState<Array<PortfolioImageWithMeta | null>>([]);
  const [rows, setRows] = useState<RowData[]>([]);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  // Preloading state
  const [isPreloading, setIsPreloading] = useState(false);

  // -------------------------------
  // Merge image sets and inherit metadata
  // -------------------------------
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

  // -------------------------------
  // Resize image using a canvas for large images
  // -------------------------------
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

  // -------------------------------
  // Preload images and calculate metadata
  // -------------------------------
  useEffect(() => {
    // Incremental loading while preserving original order: prefill an array of
    // null slots equal to mergedImages.length and insert each loaded image at
    // its original index. The UI will re-render and recalc rows as slots fill.
    let mounted = true;
    setIsPreloading(true);
    setImageData(new Array(mergedImages.length).fill(null)); // reset slots

    let loadedCount = 0;

    mergedImages.forEach((it, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = it.src;

      const handleLoaded = () => {
        if (!mounted) return;
        const resizedSrc = resizeImageDataUrl(img);
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const height = Math.round((img.height * width) / img.width);
        const item: PortfolioImageWithMeta = { ...it, width, height, aspectRatio: width / height, resizedSrc, originalIndex: idx };

        setImageData((prev) => {
          const copy = prev.slice();
          copy[idx] = item;
          return copy;
        });

        loadedCount++;
        if (loadedCount === mergedImages.length) setIsPreloading(false);
      };

      const handleError = () => {
        if (!mounted) return;
        const fallbackWidth = Math.min(MAX_WIDTH, 1200);
        const item: PortfolioImageWithMeta = {
          ...it,
          width: fallbackWidth,
          height: Math.round(fallbackWidth * 0.66),
          aspectRatio: fallbackWidth / Math.round(fallbackWidth * 0.66),
          resizedSrc: it.src,
          originalIndex: idx,
        };

        setImageData((prev) => {
          const copy = prev.slice();
          copy[idx] = item;
          return copy;
        });

        loadedCount++;
        if (loadedCount === mergedImages.length) setIsPreloading(false);
      };

      img.onload = handleLoaded;
      img.onerror = handleError;
    });

    return () => {
      mounted = false;
    };
  }, [sets]);

  // -------------------------------
  // Calculate rows based on container width
  // -------------------------------
  const calculateRows = () => {
    if (!containerRef.current) return;
    const loadedImages = imageData.filter((x): x is PortfolioImageWithMeta => x !== null);
    if (loadedImages.length === 0) {
      setRows([]);
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const tempRows: RowData[] = [];

    let currentRow: PortfolioImageWithMeta[] = [];
    let currentRowWidth = 0;

    loadedImages.forEach((img, index) => {
      const scaledWidth = img.aspectRatio * TARGET_ROW_HEIGHT;
      const gap = currentRow.length > 0 ? GAP : 0;

      if (currentRowWidth + scaledWidth + gap <= containerWidth) {
        currentRow.push(img);
        currentRowWidth += scaledWidth + gap;
      } else {
        const totalGap = GAP * (currentRow.length - 1);
        const scale = (containerWidth - totalGap) / currentRowWidth;
        const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT;

        tempRows.push({
          images: currentRow,
          scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale,
          capped,
        });

        currentRow = [img];
        currentRowWidth = scaledWidth;
      }

      // Push last row
      if (index === loadedImages.length - 1 && currentRow.length) {
        const totalGap = GAP * (currentRow.length - 1);
        const scale = (containerWidth - totalGap) / currentRowWidth;
        const capped = TARGET_ROW_HEIGHT * scale > MAX_ROW_HEIGHT;
        tempRows.push({
          images: currentRow,
          scale: capped ? MAX_ROW_HEIGHT / TARGET_ROW_HEIGHT : scale,
          capped,
        });
      }
    });

    setRows(tempRows);
  };

  // -------------------------------
  // Recalculate rows whenever images are loaded
  // -------------------------------
  useEffect(() => {
    calculateRows();
  }, [imageData]);

  // -------------------------------
  // Recalculate rows on container resize
  // -------------------------------
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

  // Helper to find next/previous loaded image index (skips null slots)
  const findNextLoaded = (start: number, dir: 1 | -1) => {
    const n = imageData.length;
    if (n === 0) return start;
    let i = start;
    do {
      i = (i + dir + n) % n;
      if (imageData[i] !== null) return i;
    } while (i !== start);
    return start;
  };

  // -------------------------------
  // Lightbox keyboard navigation (ESC, Arrow keys)
  // -------------------------------
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null); // ESC closes lightbox
      else if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? null : findNextLoaded(i, 1)));
      else if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i === null ? null : findNextLoaded(i, -1)));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, imageData.length]);

  // -------------------------------
  // Lightbox navigation helpers
  // -------------------------------
  const openLightboxAt = (index: number) => setLightboxIndex(index);
  const nextLightbox = () => setLightboxIndex((i) => (i === null ? null : findNextLoaded(i, 1)));
  const prevLightbox = () => setLightboxIndex((i) => (i === null ? null : findNextLoaded(i, -1)));

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="w-full">
      {/* Optional title */}
      {title && (
        <>
          <h3 className="text-center text-3xl font-semibold text-white mt-16 mb-4">{title}</h3>
          <div className="h-[2px] bg-white w-full max-w-[600px] mx-auto mb-8" aria-hidden="true" />
        </>
      )}

      {/* Portfolio rows */}
      <div ref={containerRef} className="w-full flex flex-col gap-4">
        {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Loading images…</div>}

        {rows.map((row, rowIndex) => {
          const scaledWidths = row.images.map((img) => img.aspectRatio * TARGET_ROW_HEIGHT * row.scale);

          return (
            <div
              key={rowIndex}
              className={`flex ${row.capped ? "justify-center" : ""} gap-4 transition-all duration-[2000ms] ease-in-out`}
              style={{ transform: `scale(${row.capped ? 0.98 : 1})`, opacity: 1 }}
            >
              {row.images.map((img, idx) => {
                const width = scaledWidths[idx];
                const height = Math.round(TARGET_ROW_HEIGHT * row.scale);
                const flattenedIndex = img.originalIndex ?? imageData.findIndex(
                  (x) => x !== null && x.resizedSrc === img.resizedSrc && x.title === img.title
                );

                return (
                  <button
                    key={idx}
                    onClick={() => openLightboxAt(flattenedIndex === -1 ? 0 : flattenedIndex)}
                    className="relative overflow-visible p-0 border-0 focus:outline-none rounded-md transition-transform duration-[300ms] ease-in-out hover:scale-[1.02]"
                  >
                    <div className="relative group">
                      {/* Image container */}
                      <div
                        className={`relative rounded-md overflow-hidden ${showBorder ? "border-[2px] border-white" : ""}`}
                        style={{ width, height }}
                      >
                        <img
                          src={img.resizedSrc}
                          alt={img.title || ""}
                          className="w-full h-full object-cover block transition-transform duration-[1000ms] ease-in-out group-hover:scale-[1.05] will-change-transform"
                          loading="lazy"
                        />
                      </div>

                      {/* Overlay with title/description */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] ease-in-out pointer-events-none">
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

      {/* Lightbox (extracted to a separate component) */}
      <Lightbox
        images={imageData}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={nextLightbox}
        onPrev={prevLightbox}
      />
    </div>
  );
};

export default PortfolioGrid;
