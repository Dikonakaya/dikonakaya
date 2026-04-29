import { useRef, useEffect, useCallback, useState } from 'react'

export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
export const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '_')

// Line reveal hook
export function useLineReveal() {
    const ref = useRef<HTMLDivElement | null>(null)
    const [revealed, setRevealed] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect() } }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return { ref, revealed }
}

// Animated reveal divider
export const Divider = ({ className }: { className?: string }) => {
    const { ref, revealed } = useLineReveal()
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={`h-[2px] bg-white mx-auto origin-center transition-all duration-[2000ms] ease-out ${revealed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} ${className ?? 'w-full max-w-[900px]'}`}
        />
    )
}

// Section title component
export const SectionTitle = ({ title, dividerClass }: { title: string; dividerClass?: string; titleClass?: string }) => {
    const { ref, revealed } = useLineReveal()
    return (
        <>
            <h3 className={`text-center text-3xl font-semibold text-white mb-4 `}>{title}</h3>
            <div
                ref={ref}
                aria-hidden="true"
                className={`h-[2px] bg-white mx-auto mb-8 origin-center transition-all duration-[2000ms] ease-out ${revealed ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} ${dividerClass ?? 'w-full max-w-[600px]'}`}
            />
        </>
    )
}

const sizes: Record<string, string> = { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem', '7xl': '4.5rem', '8xl': '6rem', '9xl': '8rem' }

let _monoTabPx: string | null = null
const getMonoTabPx = () => {
    if (_monoTabPx !== null) return _monoTabPx
    const el = document.createElement('span')
    el.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1rem'
    el.textContent = '0000'
    document.body.appendChild(el)
    _monoTabPx = el.getBoundingClientRect().width + 'px'
    document.body.removeChild(el)
    return _monoTabPx
}

export const DiscordFormatTextField = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => {
    const ref = useRef<HTMLTextAreaElement>(null)
    const g = '<span class="text-gray-500">'
    const fmt = (s: string) => {
        const marks: string[] = []
        const mark = (h: string) => { marks.push(h); return `\uE010${marks.length - 1}\uE011` }

        Object.keys(sizes).forEach(z => (s = s.replace(new RegExp(`<${z}>`, 'g'), mark(`${g}&lt;${z}&gt;</span>`))))

        s = s.replace(/\\\*/g, '\uE000').replace(/\\_/g, '\uE001')
            .replace(/<link="([^"]+)">(.+?)<\/link>/g, (_, u, t) => mark(`${g}&lt;link="${u}"&gt;</span><a>`) + t + mark(`</a>${g}&lt;/link&gt;</span>`))
            .replace(/<(#[0-9a-fA-F]{3,6})>/g, (_, c) => mark(`${g}&lt;${c}&gt;</span></span><span style="color:${c}">`))
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*\*(.+?)\*\*\*/g, (_, t) => mark(`${g}***</span><b><i>${t}</i></b>${g}***</span>`))
            .replace(/\*\*__(.+?)__\*\*/g, (_, t) => mark(`${g}**__</span><b><u>${t}</u></b>${g}__**</span>`))
            .replace(/__\*\*(.+?)\*\*__/g, (_, t) => mark(`${g}__**</span><u><b>${t}</b></u>${g}**__</span>`))
            .replace(/\*\*(.+?)\*\*/g, (_, t) => mark(`${g}**</span><b>${t}</b>${g}**</span>`))
            .replace(/__(.+?)__/g, (_, t) => mark(`${g}__</span><u>${t}</u>${g}__</span>`))
            .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, (_, t) => mark(`${g}*</span><i>${t}</i>${g}*</span>`))
            .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, (_, t) => mark(`${g}_</span><i>${t}</i>${g}_</span>`))
            .replace(/~~(.+?)~~/g, (_, t) => mark(`${g}~~</span><s>${t}</s>${g}~~</span>`))
            .replace(/\uE010(\d+)\uE011/g, (_, i) => marks[+i])
            .replace(/\uE000/g, `${g}\\</span>*`).replace(/\uE001/g, `${g}\\</span>_`)
            .replace(/\n/g, '<br/>')
        return '<span>' + s + '</span>'
    }
    const resize = useCallback(() => { if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = ref.current.scrollHeight + 'px' } }, [])
    const onTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const t = e.currentTarget, start = t.selectionStart, end = t.selectionEnd
            onChange(value.substring(0, start) + '\t' + value.substring(end))
            setTimeout(() => { t.selectionStart = t.selectionEnd = start + 1 }, 0)
        }
    }
    useEffect(() => { resize() }, [value, resize])
    return (
        <div className="relative block border border-white/10 my-1 w-full font-mono rounded bg-[#0b0b0d]" style={{ tabSize: 4 }}>
            <div className="p-2 whitespace-pre-wrap break-words pointer-events-none min-h-[2.5rem] text-white" style={{ tabSize: 4 }} dangerouslySetInnerHTML={{ __html: fmt(value + (value.endsWith('\n') ? ' ' : '')) || `<span class="text-gray-500">${placeholder}</span>` }} />
            <textarea ref={ref} value={value} onChange={e => onChange(e.target.value)} onKeyDown={onTab} placeholder="" style={{ tabSize: 4 }} className="absolute inset-0 p-2 w-full h-full resize-none bg-transparent text-transparent caret-white whitespace-pre-wrap break-words overflow-hidden min-h-[2.5rem]" />
        </div>
    )
}

export const discordFormatText = (raw: string) => {
    if (!raw) return ''
    const marks: string[] = []
    const mark = (h: string) => { marks.push(h); return `\uE010${marks.length - 1}\uE011` }
    let s = raw.replace(/\\\*/g, '\uE000').replace(/\\_/g, '\uE001').replace(/\r\n/g, '\n')

    const sizeKeys = Object.keys(sizes).sort((a, b) => b.length - a.length)
    const sizeRe = new RegExp(`<(/?)(${sizeKeys.join('|')})>`, 'g')
    let sizeOpen = false
    s = s.replace(sizeRe, (_, slash, z) => {
        if (slash) {
            if (sizeOpen) { sizeOpen = false; return mark('</span>') }
            return ''
        }
        const close = sizeOpen ? mark('</span>') : ''
        sizeOpen = true
        return close + mark(`<span style="font-size:${sizes[z]}">`)
    })
    if (sizeOpen) s += mark('</span>')

    s = s.replace(/<(#[0-9a-fA-F]{3,6})>/g, (_, c) => mark(`<span style="color:${c}">`))
        .replace(/<\/(#[0-9a-fA-F]{3,6})>/g, mark('</span>'))
        .replace(/<link="([^"]+)">(.+?)<\/link>/g, (_, u, t) => mark(`<a href="${u}" target="_blank" rel="noopener" class="hover:underline">`) + t + mark('</a>'))
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\uE010(\d+)\uE011/g, (_, i) => marks[+i])
        .replace(/\*\*\*(.+?)\*\*\*/gs, '<b><i>$1</i></b>')
        .replace(/\*\*__(.+?)__\*\*/gs, '<b><u>$1</u></b>')
        .replace(/__\*\*(.+?)\*\*__/gs, '<u><b>$1</b></u>')
        .replace(/\*\*(.+?)\*\*/gs, '<b>$1</b>')
        .replace(/__(.+?)__/gs, '<u>$1</u>')
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gs, '<i>$1</i>')
        .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/gs, '<i>$1</i>')
        .replace(/~~(.+?)~~/gs, '<s>$1</s>')
        .replace(/\uE000/g, '*').replace(/\uE001/g, '_')

    s = s.split('\n').map(line => {
        const m = line.match(/^(\t+)- /)
        if (m) {
            const tabs = m[1].length
            const bullet = tabs === 1 ? '●' : '○'
            const content = line.replace(/^\t+- /, '')
            return '\t'.repeat(tabs) + bullet + ' ' + content
        }
        return line
    }).join('\n')

    const tabPx = getMonoTabPx()
    const ls = `white-space:pre-wrap;tab-size:${tabPx};-moz-tab-size:${tabPx}`
    return s.split(/\n\s*\n+/g).map(p =>
        p.split('\n').map(line => `<div style="${ls}">${line}</div>`).join('')
    ).join('<br/>')
}