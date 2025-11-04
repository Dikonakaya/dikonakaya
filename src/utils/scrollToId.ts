export function scrollToId(id: string) {
    try {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    } catch {

    }
}