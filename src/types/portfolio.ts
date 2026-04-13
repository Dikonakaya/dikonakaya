/** Single portfolio/project image */
export type PortfolioImage = {
    src: string
    title?: string
    description?: string
    tags?: string[]
    date?: string
    other?: string
    hiddenInGrid?: boolean
}

/** Collection of related images (e.g., a project or photo series) */
export type PortfolioSet = {
    setTitle: string
    year?: number
    description?: string
    tags?: string[]
    other?: string
    collection?: boolean
    images: PortfolioImage[]
}

/** Firebase photography document format */
export type PhotoSet = {
    title: string
    description: string
    details?: string
    images: string[]
    order?: number
    tags: string[]
    year?: number
    collection?: boolean
}

/** Image with computed metadata for justified grid layout */
export type PortfolioImageWithMeta = PortfolioImage & {
    width: number
    height: number
    aspectRatio: number
    resizedSrc: string
    originalIndex?: number
}

/** Row layout data for justified grid algorithm */
export type RowData = {
    images: PortfolioImageWithMeta[]
    scale: number
    capped: boolean  // Whether row hit max height limit
}

/** Project card data structure */
export type Project = {
    name: string
    subtitle?: string
    thumbnail: string
    year?: number
    description?: string
    tags?: string[]
    images?: { src: string; title?: string; description?: string }[]
    viewUrl?: string
    getUrl?: string
}
