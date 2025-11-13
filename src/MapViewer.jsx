import { useEffect, useRef, useState } from 'react'

export default function MapViewer({ src, alt = 'Society Map', className = '' }) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [drag, setDrag] = useState({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 })
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

  const zoomTo = (next, center) => {
    const newScale = clamp(next, 1, 3)
    if (!containerRef.current) { setScale(newScale); return }
    const rect = containerRef.current.getBoundingClientRect()
    const cx = center ? center.x - rect.left : rect.width / 2
    const cy = center ? center.y - rect.top : rect.height / 2
    const ratio = newScale / scale
    const nx = (pos.x - cx) * ratio + cx
    const ny = (pos.y - cy) * ratio + cy
    setPos({ x: nx, y: ny })
    setScale(newScale)
  }

  const onWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    zoomTo(scale + delta, { x: e.clientX, y: e.clientY })
  }

  const onMouseDown = (e) => {
    e.preventDefault()
    setDrag({ active: true, startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y })
  }
  const onMouseMove = (e) => {
    if (!drag.active) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    setPos({ x: drag.origX + dx, y: drag.origY + dy })
  }
  const endDrag = () => setDrag((d) => ({ ...d, active: false }))

  // Touch support
  const touchState = useRef({})
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0]
      touchState.current = { mode: 'pan', startX: t.clientX, startY: t.clientY, origX: pos.x, origY: pos.y }
    } else if (e.touches.length === 2) {
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      const mid = { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 }
      touchState.current = { mode: 'pinch', startDist: dist, startScale: scale, mid }
    }
  }
  const onTouchMove = (e) => {
    if (!touchState.current.mode) return
    if (touchState.current.mode === 'pan' && e.touches.length === 1) {
      const t = e.touches[0]
      const dx = t.clientX - touchState.current.startX
      const dy = t.clientY - touchState.current.startY
      setPos({ x: touchState.current.origX + dx, y: touchState.current.origY + dy })
    } else if (touchState.current.mode === 'pinch' && e.touches.length === 2) {
      const [a, b] = e.touches
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      const ratio = dist / touchState.current.startDist
      zoomTo(clamp(touchState.current.startScale * ratio, 1, 3), touchState.current.mid)
    }
  }
  const onTouchEnd = () => { touchState.current = {} }

  const resetView = () => {
    setScale(1)
    if (!containerRef.current) { setPos({ x: 0, y: 0 }); return }
    const rect = containerRef.current.getBoundingClientRect()
    setPos({ x: rect.width * 0.1, y: rect.height * 0.1 })
  }

  useEffect(() => { resetView() }, [src])

  return (
    <div className={`relative ${className}`}>
      <div className="absolute right-3 top-3 z-20 bg-white/90 backdrop-blur rounded shadow border divide-x overflow-hidden">
        <button className="px-3 py-2 hover:bg-gray-100" onClick={() => zoomTo(scale + 0.15)}>+
        </button>
        <button className="px-3 py-2 hover:bg-gray-100" onClick={() => zoomTo(scale - 0.15)}>-</button>
        <button className="px-3 py-2 hover:bg-gray-100" onClick={resetView}>Reset</button>
      </div>
      <div
        ref={containerRef}
        className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gray-100 rounded"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="pointer-events-none absolute top-0 left-0 origin-top-left shadow"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transition: drag.active ? 'none' : 'transform 120ms ease-out' }}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-500">No map available</div>
        )}
      </div>
    </div>
  )
}
