import React, { useEffect, useRef, useState } from "react";
import { projectsData } from "../data/projects.data";

// -------------------------------
// Type Definitions (copied)
// -------------------------------
export type PortfolioImage = {
    src: string;
    title?: string;
    description?: string;
    tags?: string[];
    date?: string;
    other?: string;
};

export type PortfolioSet = {
    setTitle: string;
    year?: number;
    description?: string;
    tags?: string[];
    other?: string;
    images: PortfolioImage[];
};

type Props = {
    title?: string;
    // `sets` is optional now — if not provided or empty, we fall back to `projectData`
    sets?: PortfolioSet[];
    showBorder?: boolean;
};

type PortfolioImageWithMeta = PortfolioImage & {
    width: number;
    height: number;
    aspectRatio: number;
    resizedSrc: string;
    originalIndex?: number;
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

const ProjectGrid: React.FC<Props> = ({ title, sets, showBorder = true }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [imageData, setImageData] = useState<Array<PortfolioImageWithMeta | null>>([]);
    const [rows, setRows] = useState<RowData[]>([]);
    const [isPreloading, setIsPreloading] = useState(false);

    // If `sets` was provided and non-empty, keep prior behavior.
    // Otherwise, derive images from `projectData` (imported from src/data/projects.data.ts).
    const sourceSets = sets && sets.length > 0 ? sets : undefined;

    const mergedImages: PortfolioImage[] = sourceSets
        ? sourceSets.flatMap((set) =>
            set.images.map((img) => ({
                ...img,
                title: img.title ?? set.setTitle,
                description: img.description ?? set.description,
                tags: img.tags ?? set.tags ?? [],
                other: img.other ?? set.other,
                date: img.date ?? (set.year ? `${set.year}-01-01` : undefined),
            }))
        )
        : // fallback: use projectsData
        projectsData.flatMap((proj) =>
            (proj.images || []).map((img) => ({
                src: img.src,
                title: img.title ?? proj.name,
                description: img.description ?? proj.description,
                tags: proj.tags ?? [],
                other: undefined,
                date: proj.year ? `${proj.year}-01-01` : undefined,
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
        setImageData(new Array(mergedImages.length).fill(null));

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

    return (
        <div className="w-full">
            {title && (
                <>
                    <h3 className="text-center text-3xl font-semibold text-white mt-16 mb-4">{title}</h3>
                    <div className="h-[2px] bg-white w-full max-w-[600px] mx-auto mb-8" aria-hidden="true" />
                </>
            )}

            <div ref={containerRef} className="w-full flex flex-col gap-4">
                {isPreloading && <div className="text-center text-sm text-slate-300 mb-2">Loading projects…</div>}

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

                                return (
                                    <div
                                        key={idx}
                                        className="relative overflow-visible p-0 border-0 rounded-md transition-transform duration-[300ms] ease-in-out hover:scale-[1.02]"
                                    >
                                        <div className="relative group">
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

                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[300ms] ease-in-out pointer-events-none">
                                                <div className="absolute rounded-md inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                                                <div className="relative flex flex-col justify-start p-4 text-left text-white">
                                                    <h4 className="text-lg font-semibold">{img.title}</h4>
                                                    <p className="text-sm mt-1">{img.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectGrid;
