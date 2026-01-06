export function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function scrollToTop() {
    document.body.scrollTo?.({ top: 0, behavior: 'smooth' }) ??
        (document.documentElement.scrollTop = 0)
}
