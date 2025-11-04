export function scrollToTop() {
    try {
        const el = document.body;
        if (el && typeof (el as any).scrollTo === "function") {
            (el as HTMLElement).scrollTo({ top: 0, behavior: "smooth" });
        }
    } catch {
        try {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        } catch { }
    }
}