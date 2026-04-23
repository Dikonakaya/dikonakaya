import { useEffect, useState } from 'react'
import { collection, doc, getDocs, orderBy, query, writeBatch } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { db, auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { SectionTitle } from '../Shared'

type EditImage = { url: string; title: string; description: string; details: string; year?: number; tags: string[]; tagsStr: string; display: boolean }
type EditSet = { id: string; docName: string; title: string; description: string; details: string; images: EditImage[]; order: number; tags: string[]; tagsStr: string; year?: number }
type EditCarousel = { id: string; docName: string; title: string; description: string; thumbnail: string; url: string; order: number }
type EditProject = { id: string; docName: string; title: string; description: string; details: string; download: string; tags: string; thumbnail: string; view: string; order: number; year: number }
type CollectionKey = 'photography' | 'pixelart' | 'carousel' | 'projects'

const emptyImg: EditImage = { url: '', title: '', description: '', details: '', tags: [], tagsStr: '', display: true }
const emptySet: EditSet = { id: '', docName: '', title: '', description: '', details: '', images: [], order: 0, tags: [], tagsStr: '' }
const emptyCarousel: EditCarousel = { id: '', docName: '', title: '', description: '', thumbnail: '', url: '', order: 0 }
const emptyProject: EditProject = { id: '', docName: '', title: '', description: '', details: '', download: '', tags: '', thumbnail: '', view: '', order: 0, year: 0 }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseImg = (img: any): EditImage => typeof img === 'string'
    ? { ...emptyImg, url: img }
    : { url: img.url || '', title: img.title || '', description: img.description || '', details: img.details || '', year: img.year, tags: img.tags || [], tagsStr: (img.tags || []).join(', '), display: img.display !== false }

const serImg = (img: EditImage): string | Record<string, unknown> => {
    const tags = img.tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
    if (!img.title && !img.description && !img.details && !img.year && !tags.length && img.display) return img.url
    const o: Record<string, unknown> = { url: img.url }
    if (img.title) o.title = img.title
    if (img.description) o.description = img.description
    if (img.details) o.details = img.details
    if (img.year) o.year = img.year
    if (tags.length) o.tags = tags
    if (!img.display) o.display = false
    return o
}

const DragHandle = () => <div className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing text-slate-400 hover:text-white"><svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg></div>
const DelBtn = ({ onClick }: { onClick: () => void }) => <button onClick={onClick} className="min-w-6 min-h-6 flex items-center justify-center rounded-full bg-red-500 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>

const AdminImg = ({ src, className }: { src: string; className: string }) => {
    const [thumb, setThumb] = useState('')
    useEffect(() => {
        if (!src) return
        const el = new Image()
        el.crossOrigin = 'anonymous'
        el.src = src
        el.onload = () => {
            try {
                const s = Math.min(160 / el.width, 1), cv = document.createElement('canvas')
                cv.width = Math.round(el.width * s); cv.height = Math.round(el.height * s)
                cv.getContext('2d')?.drawImage(el, 0, 0, cv.width, cv.height)
                cv.toBlob(b => setThumb(b ? URL.createObjectURL(b) : src), 'image/jpeg', 0.7)
            } catch { setThumb(src) }
        }
        el.onerror = () => setThumb(src)
    }, [src])
    if (!thumb) return <div className={className + ' bg-slate-700 animate-pulse'} />
    return <img src={thumb} draggable={false} className={className} loading="lazy" />
}

export default function Admin() {
    const nav = useNavigate()
    const [activeCollection, setActiveCollection] = useState<CollectionKey>('photography')
    const [sets, setSets] = useState<EditSet[]>([])
    const [carouselItems, setCarouselItems] = useState<EditCarousel[]>([])
    const [projectItems, setProjectItems] = useState<EditProject[]>([])
    const [edit, setEdit] = useState<EditSet | null>(null)
    const [editCarousel, setEditCarousel] = useState<EditCarousel | null>(null)
    const [editProject, setEditProject] = useState<EditProject | null>(null)
    const [expandedImg, setExpandedImg] = useState<number | null>(null)
    const [toast, setToast] = useState('')
    const [mouseDownInside, setMouseDownInside] = useState(false)
    const [confirm, setConfirm] = useState<{ msg: string; action: () => void } | null>(null)
    const [dragIdx, setDragIdx] = useState<{ type: 'set' | 'image'; idx: number } | null>(null)
    const inp = 'bg-[#0b0b0d] text-white block border border-white/10 p-2 my-1 w-full rounded'

    const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => { if (!user) nav('/'); else load(activeCollection) })
        const onBack = () => { signOut(auth); nav('/') }
        window.addEventListener('popstate', onBack)
        return () => { unsub(); window.removeEventListener('popstate', onBack) }
    }, [nav, activeCollection])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setEdit(null); setEditCarousel(null); setEditProject(null); setExpandedImg(null) } }
        if (edit || editCarousel || editProject) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [edit, editCarousel, editProject])

    useEffect(() => {
        if (edit || editCarousel || editProject || confirm) {
            const scrollY = window.scrollY
            document.body.style.overflowY = 'scroll'; document.body.style.position = 'fixed'; document.body.style.width = '100%'; document.body.style.top = `-${scrollY}px`
        }
        return () => { const top = document.body.style.top; document.body.style.overflowY = ''; document.body.style.position = ''; document.body.style.width = ''; document.body.style.top = ''; if (top) window.scrollTo(0, -parseInt(top)) }
    }, [edit, editCarousel, editProject, confirm])

    const load = async (col: CollectionKey = activeCollection) => {
        const snap = await getDocs(query(collection(db, col), orderBy('order')))
        if (col === 'photography' || col === 'pixelart') {
            setSets(snap.docs.map(d => {
                const data = d.data()
                return { ...emptySet, ...data, id: d.id, docName: d.id, images: (data.images || []).map(parseImg), tags: data.tags || [], tagsStr: (data.tags || []).join(', ') }
            }))
        } else if (col === 'carousel') {
            setCarouselItems(snap.docs.map(d => {
                const data = d.data()
                return { id: d.id, docName: d.id, title: data.title || '', description: data.description || '', thumbnail: data.thumbnail || '', url: data.url || '', order: data.order ?? 0 }
            }))
        } else if (col === 'projects') {
            setProjectItems(snap.docs.map(d => {
                const data = d.data()
                return { id: d.id, docName: d.id, title: data.title || '', description: data.description || '', details: data.details || '', download: data.download || '', tags: data.tags || '', thumbnail: data.thumbnail || '', view: data.view || '', order: data.order ?? 0, year: data.year || 0 }
            }))
        }
    }

    const saveSet = async () => {
        if (!edit) return
        try {
            const batch = writeBatch(db)
            const newId = edit.docName.trim() || `set_${Date.now()}`
            if (edit.id && edit.id !== newId) batch.delete(doc(db, activeCollection, edit.id))
            const tags = edit.tagsStr.split(',').map((t: string) => t.trim()).filter(Boolean)
            batch.set(doc(db, activeCollection, newId), { title: edit.title, description: edit.description, details: edit.details || '', images: edit.images.map(serImg), order: edit.order, tags, year: edit.year || null })
            await batch.commit()
            setEdit(null); setExpandedImg(null); load(); notify('Set saved!')
        } catch { notify('Error saving') }
    }

    const saveCarousel = async () => {
        if (!editCarousel) return
        try {
            const batch = writeBatch(db)
            const newId = editCarousel.docName.trim() || `slide_${Date.now()}`
            if (editCarousel.id && editCarousel.id !== newId) batch.delete(doc(db, 'carousel', editCarousel.id))
            batch.set(doc(db, 'carousel', newId), { title: editCarousel.title, description: editCarousel.description, thumbnail: editCarousel.thumbnail, url: editCarousel.url, order: editCarousel.order })
            await batch.commit()
            setEditCarousel(null); load('carousel'); notify('Slide saved!')
        } catch { notify('Error saving') }
    }

    const saveProject = async () => {
        if (!editProject) return
        try {
            const batch = writeBatch(db)
            const newId = editProject.docName.trim() || `proj_${Date.now()}`
            if (editProject.id && editProject.id !== newId) batch.delete(doc(db, 'projects', editProject.id))
            batch.set(doc(db, 'projects', newId), { title: editProject.title, description: editProject.description, details: editProject.details, download: editProject.download, tags: editProject.tags, thumbnail: editProject.thumbnail, view: editProject.view, order: editProject.order, year: editProject.year || null })
            await batch.commit()
            setEditProject(null); load('projects'); notify('Project saved!')
        } catch { notify('Error saving') }
    }

    const delItem = async (col: CollectionKey, id: string) => {
        try {
            const batch = writeBatch(db)
            batch.delete(doc(db, col, id))
            await batch.commit()
            load(col); notify('Deleted!')
        } catch { notify('Error deleting') }
    }

    const saveOrder = async () => {
        try {
            const batch = writeBatch(db)
            if (activeCollection === 'carousel') {
                carouselItems.forEach((s, i) => batch.update(doc(db, 'carousel', s.id), { order: i }))
            } else if (activeCollection === 'projects') {
                projectItems.forEach((s, i) => batch.update(doc(db, 'projects', s.id), { order: i }))
            } else {
                sets.forEach((s, i) => batch.update(doc(db, activeCollection, s.id), { order: i }))
            }
            await batch.commit()
            notify('Order saved!')
        } catch { notify('Error saving order') }
    }

    const switchCollection = (col: CollectionKey) => {
        setEdit(null); setEditCarousel(null); setEditProject(null); setExpandedImg(null); setActiveCollection(col)
    }

    const reorder = <T,>(arr: T[], from: number, to: number) => { const a = [...arr]; const [item] = a.splice(from, 1); a.splice(to, 0, item); return a }

    const dragSet = (e: React.DragEvent, i: number) => {
        e.preventDefault()
        if (dragIdx?.type === 'set' && dragIdx.idx !== i) {
            if (activeCollection === 'carousel') setCarouselItems(reorder(carouselItems, dragIdx.idx, i).map((s, j) => ({ ...s, order: j })))
            else if (activeCollection === 'projects') setProjectItems(reorder(projectItems, dragIdx.idx, i).map((s, j) => ({ ...s, order: j })))
            else setSets(reorder(sets, dragIdx.idx, i).map((s, j) => ({ ...s, order: j })))
        }
        setDragIdx({ type: 'set', idx: i })
    }

    const dragImage = (e: React.DragEvent, i: number) => { e.preventDefault(); if (!edit || dragIdx?.type !== 'image' || dragIdx.idx === i) return; setEdit({ ...edit, images: reorder(edit.images, dragIdx.idx, i) }); setDragIdx({ type: 'image', idx: i }) }
    const updateImg = (i: number, patch: Partial<EditImage>) => { if (!edit) return; const imgs = [...edit.images]; imgs[i] = { ...imgs[i], ...patch }; setEdit({ ...edit, images: imgs }) }
    const logout = () => { signOut(auth); nav('/') }

    const isPhotoCollection = activeCollection === 'photography' || activeCollection === 'pixelart'

    const sectionLabel = activeCollection === 'photography' ? 'PHOTO SETS'
        : activeCollection === 'pixelart' ? 'PIXEL ART SETS'
        : activeCollection === 'carousel' ? 'CAROUSEL SLIDES'
        : 'PROJECTS'

    return (
        <section className="p-4 mt-4 min-h-screen">
            <SectionTitle title="ADMIN" />
            <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 mb-4 flex-wrap">
                    {(['photography', 'pixelart', 'carousel', 'projects'] as CollectionKey[]).map(col => (
                        <button key={col} onClick={() => switchCollection(col)} className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeCollection === col ? 'bg-white text-[#1E1E25]' : 'bg-black/30 text-white hover:bg-black/50'}`}>
                            {col === 'photography' ? 'PHOTOGRAPHY' : col === 'pixelart' ? 'PIXEL ART' : col === 'carousel' ? 'CAROUSEL' : 'PROJECTS'}
                        </button>
                    ))}
                    <button onClick={logout} className="ml-auto px-5 py-2 rounded-md font-bold text-sm bg-red-500 text-white hover:bg-white hover:text-[#373944] transition-colors">LOGOUT</button>
                </div>

                <h2 className="text-xl font-bold mb-2">{sectionLabel}</h2>

                {isPhotoCollection && sets.map((s, i) => (
                    <div key={s.id} onDragOver={e => dragSet(e, i)} className={`flex items-center gap-2 my-1 ${dragIdx?.type === 'set' && dragIdx.idx === i ? 'opacity-50' : ''}`}>
                        <div draggable onDragStart={() => setDragIdx({ type: 'set', idx: i })} onDragEnd={() => setDragIdx(null)} className="hidden md:block"><DragHandle /></div>
                        <button onClick={() => { setEdit({ ...s }); setExpandedImg(null) }} className="flex-1 flex items-center gap-3 bg-black/30 hover:bg-black/50 rounded-md px-4 py-3 text-left transition-colors">
                            {s.images[0]?.url && <AdminImg src={s.images[0].url} className="w-16 h-12 object-cover rounded flex-shrink-0" />}
                            <div className="min-w-0">
                                <span className="font-bold block">{s.title}</span>
                                <span className="text-sm text-slate-400 truncate block">{s.description}</span>
                            </div>
                            <span className="ml-auto text-xs text-slate-500 flex-shrink-0">{s.images.length} imgs</span>
                        </button>
                    </div>
                ))}

                {activeCollection === 'carousel' && carouselItems.map((item, i) => (
                    <div key={item.id} onDragOver={e => dragSet(e, i)} className={`flex items-center gap-2 my-1 ${dragIdx?.type === 'set' && dragIdx.idx === i ? 'opacity-50' : ''}`}>
                        <div draggable onDragStart={() => setDragIdx({ type: 'set', idx: i })} onDragEnd={() => setDragIdx(null)} className="hidden md:block"><DragHandle /></div>
                        <button onClick={() => setEditCarousel({ ...item })} className="flex-1 flex items-center gap-3 bg-black/30 hover:bg-black/50 rounded-md px-4 py-3 text-left transition-colors">
                            {item.thumbnail && <AdminImg src={item.thumbnail} className="w-16 h-12 object-cover rounded flex-shrink-0" />}
                            <div className="min-w-0">
                                <span className="font-bold block">{item.title}</span>
                                <span className="text-sm text-slate-400 truncate block">{item.description}</span>
                            </div>
                        </button>
                    </div>
                ))}

                {activeCollection === 'projects' && projectItems.map((item, i) => (
                    <div key={item.id} onDragOver={e => dragSet(e, i)} className={`flex items-center gap-2 my-1 ${dragIdx?.type === 'set' && dragIdx.idx === i ? 'opacity-50' : ''}`}>
                        <div draggable onDragStart={() => setDragIdx({ type: 'set', idx: i })} onDragEnd={() => setDragIdx(null)} className="hidden md:block"><DragHandle /></div>
                        <button onClick={() => setEditProject({ ...item })} className="flex-1 flex items-center gap-3 bg-black/30 hover:bg-black/50 rounded-md px-4 py-3 text-left transition-colors">
                            {item.thumbnail && <AdminImg src={item.thumbnail} className="w-16 h-12 object-cover rounded flex-shrink-0" />}
                            <div className="min-w-0">
                                <span className="font-bold block">{item.title}</span>
                                <span className="text-sm text-slate-400 truncate block">{item.description}</span>
                            </div>
                            {item.year > 0 && <span className="ml-auto text-xs text-slate-500 flex-shrink-0">{item.year}</span>}
                        </button>
                    </div>
                ))}

                <div className="my-4 flex justify-end gap-2 flex-wrap">
                    <button onClick={saveOrder} className="px-5 py-1 rounded-md font-bold bg-green-600 text-white hover:bg-white hover:text-[#373944] transition-colors">SAVE ORDER</button>
                    <button onClick={() => {
                        if (activeCollection === 'carousel') setEditCarousel({ ...emptyCarousel, order: carouselItems.length })
                        else if (activeCollection === 'projects') setEditProject({ ...emptyProject, order: projectItems.length })
                        else { setEdit({ ...emptySet, order: sets.length }); setExpandedImg(null) }
                    }} className="px-5 py-1 rounded-md font-bold bg-blue-600 text-white hover:bg-white hover:text-[#373944] transition-colors">NEW</button>
                </div>
            </div>

            {edit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-auto z-50" onMouseDown={() => setMouseDownInside(false)} onMouseUp={() => !mouseDownInside && setEdit(null)}>
                    <div className="bg-[#373944] rounded-md max-w-[90vw] max-h-[90vh] overflow-auto" onMouseDown={e => { e.stopPropagation(); setMouseDownInside(true) }} onMouseUp={e => e.stopPropagation()}>
                        <div className="px-4 pt-1 w-full bg-[#1E1E25] text-white font-bold rounded-t-md">{edit.id ? 'EDIT' : 'NEW'} SET</div>
                        <div className="px-6 pt-4 pb-6">
                            <h3 className="font-bold text-sm">DOCUMENT NAME</h3><input value={edit.docName} onChange={e => setEdit({ ...edit, docName: e.target.value })} className={inp} placeholder="firestore-document-id" />
                            <h3 className="font-bold text-sm">TITLE</h3><input value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">DESCRIPTION</h3><input value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">DETAILS</h3><input value={edit.details || ''} onChange={e => setEdit({ ...edit, details: e.target.value })} className={inp} />
                            <div className="flex gap-2">
                                <div className="flex-1"><h3 className="font-bold text-sm">YEAR</h3><input type="number" value={edit.year || ''} onChange={e => setEdit({ ...edit, year: +e.target.value || undefined })} className={inp} /></div>
                                <div className="flex-1"><h3 className="font-bold text-sm">TAGS (comma-separated)</h3><input value={edit.tagsStr} onChange={e => setEdit({ ...edit, tagsStr: e.target.value })} className={inp} /></div>
                            </div>

                            <div className="flex items-center gap-2 mt-4"><h3 className="font-bold text-sm">IMAGES</h3><button onClick={() => setEdit({ ...edit, images: [...edit.images, { ...emptyImg }] })} className="min-w-5 min-h-5 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">+</button></div>
                            {edit.images.map((img, i) => (
                                <div key={i} className={`ml-4 border-l-2 border-white/10 pl-4 my-1 ${dragIdx?.type === 'image' && dragIdx.idx === i ? 'opacity-50' : ''}`} onDragOver={e => dragImage(e, i)}>
                                    <div className="flex items-center gap-2">
                                        <div draggable onDragStart={() => setDragIdx({ type: 'image', idx: i })} onDragEnd={() => setDragIdx(null)} className="hidden md:block"><DragHandle /></div>
                                        <button onClick={() => setExpandedImg(expandedImg === i ? null : i)} className="text-slate-400 hover:text-white text-xs w-4 flex-shrink-0">{expandedImg === i ? '▼' : '▶'}</button>
                                        <input value={img.url} onChange={e => updateImg(i, { url: e.target.value })} placeholder="Image URL" className="bg-[#0b0b0d] text-white border border-white/10 p-2 my-1 flex-1 min-w-0 rounded" />
                                        <label className="flex items-center gap-1 text-xs cursor-pointer select-none flex-shrink-0" title={img.display ? 'Visible on page + lightbox' : 'Lightbox only'}>
                                            <input type="checkbox" checked={img.display} onChange={e => updateImg(i, { display: e.target.checked })} className="accent-green-500" />
                                            <span className={img.display ? 'text-green-400' : 'text-slate-500'}>{img.display ? 'show' : 'hide'}</span>
                                        </label>
                                        {img.url && <AdminImg src={img.url} className="w-12 h-9 object-cover rounded border border-white/10 flex-shrink-0 hidden md:block" />}
                                        <DelBtn onClick={() => setEdit({ ...edit, images: edit.images.filter((_, j) => j !== i) })} />
                                    </div>
                                    {expandedImg === i && (
                                        <div className="ml-8 mt-1 mb-2 space-y-1">
                                            <input value={img.title} onChange={e => updateImg(i, { title: e.target.value })} placeholder="Title (overrides set)" className="bg-[#0b0b0d] text-white border border-white/10 p-1.5 w-full rounded text-sm" />
                                            <input value={img.description} onChange={e => updateImg(i, { description: e.target.value })} placeholder="Description (overrides set)" className="bg-[#0b0b0d] text-white border border-white/10 p-1.5 w-full rounded text-sm" />
                                            <input value={img.details || ''} onChange={e => updateImg(i, { details: e.target.value })} placeholder="Details (overrides set)" className="bg-[#0b0b0d] text-white border border-white/10 p-1.5 w-full rounded text-sm" />
                                            <div className="flex gap-2">
                                                <input type="number" value={img.year || ''} onChange={e => updateImg(i, { year: +e.target.value || undefined })} placeholder="Year" className="bg-[#0b0b0d] text-white border border-white/10 p-1.5 w-24 rounded text-sm" />
                                                <input value={img.tagsStr} onChange={e => updateImg(i, { tagsStr: e.target.value })} placeholder="Tags (comma-separated)" className="bg-[#0b0b0d] text-white border border-white/10 p-1.5 flex-1 rounded text-sm" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={saveSet} className="px-5 py-1 rounded-md font-bold bg-green-600 text-white hover:bg-white hover:text-[#373944] transition-colors">SAVE</button>
                                <button onClick={() => { setEdit(null); setExpandedImg(null); notify('Changes discarded!') }} className="px-5 py-1 rounded-md font-bold bg-slate-600 text-white hover:bg-white hover:text-[#373944] transition-colors">CANCEL</button>
                                {edit.id && <button onClick={() => setConfirm({ msg: 'Delete this set?', action: () => { delItem(activeCollection, edit.id); setEdit(null); setExpandedImg(null) } })} className="px-5 py-1 rounded-md font-bold bg-red-500 text-white hover:bg-white hover:text-[#373944] transition-colors">DELETE</button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editCarousel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-auto z-50" onMouseDown={() => setMouseDownInside(false)} onMouseUp={() => !mouseDownInside && setEditCarousel(null)}>
                    <div className="bg-[#373944] rounded-md max-w-[90vw] max-h-[90vh] overflow-auto" onMouseDown={e => { e.stopPropagation(); setMouseDownInside(true) }} onMouseUp={e => e.stopPropagation()}>
                        <div className="px-4 pt-1 w-full bg-[#1E1E25] text-white font-bold rounded-t-md">{editCarousel.id ? 'EDIT' : 'NEW'} SLIDE</div>
                        <div className="px-6 pt-4 pb-6 min-w-[340px]">
                            <h3 className="font-bold text-sm">DOCUMENT NAME</h3><input value={editCarousel.docName} onChange={e => setEditCarousel({ ...editCarousel, docName: e.target.value })} className={inp} placeholder="firestore-document-id" />
                            <h3 className="font-bold text-sm">TITLE</h3><input value={editCarousel.title} onChange={e => setEditCarousel({ ...editCarousel, title: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">DESCRIPTION</h3><input value={editCarousel.description} onChange={e => setEditCarousel({ ...editCarousel, description: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">THUMBNAIL URL</h3><input value={editCarousel.thumbnail} onChange={e => setEditCarousel({ ...editCarousel, thumbnail: e.target.value })} className={inp} />
                            {editCarousel.thumbnail && <AdminImg src={editCarousel.thumbnail} className="w-full h-32 object-cover rounded border border-white/10 my-1" />}
                            <h3 className="font-bold text-sm">LINK URL</h3><input value={editCarousel.url} onChange={e => setEditCarousel({ ...editCarousel, url: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">ORDER</h3><input type="number" value={editCarousel.order} onChange={e => setEditCarousel({ ...editCarousel, order: +e.target.value })} className={inp} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={saveCarousel} className="px-5 py-1 rounded-md font-bold bg-green-600 text-white hover:bg-white hover:text-[#373944] transition-colors">SAVE</button>
                                <button onClick={() => { setEditCarousel(null); notify('Changes discarded!') }} className="px-5 py-1 rounded-md font-bold bg-slate-600 text-white hover:bg-white hover:text-[#373944] transition-colors">CANCEL</button>
                                {editCarousel.id && <button onClick={() => setConfirm({ msg: 'Delete this slide?', action: () => { delItem('carousel', editCarousel.id); setEditCarousel(null) } })} className="px-5 py-1 rounded-md font-bold bg-red-500 text-white hover:bg-white hover:text-[#373944] transition-colors">DELETE</button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-auto z-50" onMouseDown={() => setMouseDownInside(false)} onMouseUp={() => !mouseDownInside && setEditProject(null)}>
                    <div className="bg-[#373944] rounded-md max-w-[90vw] max-h-[90vh] overflow-auto" onMouseDown={e => { e.stopPropagation(); setMouseDownInside(true) }} onMouseUp={e => e.stopPropagation()}>
                        <div className="px-4 pt-1 w-full bg-[#1E1E25] text-white font-bold rounded-t-md">{editProject.id ? 'EDIT' : 'NEW'} PROJECT</div>
                        <div className="px-6 pt-4 pb-6 min-w-[340px]">
                            <h3 className="font-bold text-sm">DOCUMENT NAME</h3><input value={editProject.docName} onChange={e => setEditProject({ ...editProject, docName: e.target.value })} className={inp} placeholder="firestore-document-id" />
                            <h3 className="font-bold text-sm">TITLE</h3><input value={editProject.title} onChange={e => setEditProject({ ...editProject, title: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">DESCRIPTION</h3><input value={editProject.description} onChange={e => setEditProject({ ...editProject, description: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">DETAILS</h3><input value={editProject.details} onChange={e => setEditProject({ ...editProject, details: e.target.value })} className={inp} />
                            <h3 className="font-bold text-sm">THUMBNAIL URL</h3><input value={editProject.thumbnail} onChange={e => setEditProject({ ...editProject, thumbnail: e.target.value })} className={inp} />
                            {editProject.thumbnail && <AdminImg src={editProject.thumbnail} className="w-full h-32 object-cover rounded border border-white/10 my-1" />}
                            <div className="flex gap-2">
                                <div className="flex-1"><h3 className="font-bold text-sm">VIEW URL</h3><input value={editProject.view} onChange={e => setEditProject({ ...editProject, view: e.target.value })} className={inp} /></div>
                                <div className="flex-1"><h3 className="font-bold text-sm">DOWNLOAD URL</h3><input value={editProject.download} onChange={e => setEditProject({ ...editProject, download: e.target.value })} className={inp} /></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1"><h3 className="font-bold text-sm">YEAR</h3><input type="number" value={editProject.year || ''} onChange={e => setEditProject({ ...editProject, year: +e.target.value || 0 })} className={inp} /></div>
                                <div className="flex-1"><h3 className="font-bold text-sm">ORDER</h3><input type="number" value={editProject.order} onChange={e => setEditProject({ ...editProject, order: +e.target.value })} className={inp} /></div>
                            </div>
                            <h3 className="font-bold text-sm">TAGS (comma-separated)</h3><input value={editProject.tags} onChange={e => setEditProject({ ...editProject, tags: e.target.value })} className={inp} />
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={saveProject} className="px-5 py-1 rounded-md font-bold bg-green-600 text-white hover:bg-white hover:text-[#373944] transition-colors">SAVE</button>
                                <button onClick={() => { setEditProject(null); notify('Changes discarded!') }} className="px-5 py-1 rounded-md font-bold bg-slate-600 text-white hover:bg-white hover:text-[#373944] transition-colors">CANCEL</button>
                                {editProject.id && <button onClick={() => setConfirm({ msg: 'Delete this project?', action: () => { delItem('projects', editProject.id); setEditProject(null) } })} className="px-5 py-1 rounded-md font-bold bg-red-500 text-white hover:bg-white hover:text-[#373944] transition-colors">DELETE</button>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className="fixed bottom-4 right-4 bg-white text-[#1E1E25] px-4 py-2 rounded-md z-[200] font-bold">{toast}</div>}
            {confirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={() => setConfirm(null)}>
                    <div className="bg-[#373944] rounded-md animate-[fadeSlide_.2s]" onClick={e => e.stopPropagation()}>
                        <div className="px-4 pt-1 w-full bg-[#1E1E25] text-white font-bold rounded-t-md">CONFIRM</div>
                        <div className="px-6 py-4">
                            <p className="mb-4">{confirm.msg}</p>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => { confirm.action(); setConfirm(null) }} className="px-5 py-1 rounded-md font-bold bg-green-600 text-white hover:bg-white hover:text-[#373944] transition-colors">CONFIRM</button>
                                <button onClick={() => setConfirm(null)} className="px-5 py-1 rounded-md font-bold bg-red-500 text-white hover:bg-white hover:text-[#373944] transition-colors">CANCEL</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
