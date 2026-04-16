import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'accent-hue'
const DEFAULT_HUE = 22

function applyHue(hue: number) {
  document.documentElement.style.setProperty('--accent-hue', String(hue))
}

export default function ThemeSlider() {
  const [hue, setHue] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? Number(stored) : DEFAULT_HUE
  })
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    applyHue(hue)
  }, [hue])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value)
    setHue(val)
    localStorage.setItem(STORAGE_KEY, String(val))
  }

  function handleReset() {
    setHue(DEFAULT_HUE)
    localStorage.removeItem(STORAGE_KEY)
  }

  const presets = [
    { label: 'Ember', hue: 22 },
    { label: 'Violet', hue: 270 },
    { label: 'Cyan', hue: 185 },
    { label: 'Rose', hue: 345 },
    { label: 'Lime', hue: 100 },
    { label: 'Gold', hue: 45 },
  ]

  return (
    <div className="theme-slider-wrap" ref={containerRef}>
      <button
        className="theme-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-label="Customize theme"
      >
        <span
          className="theme-toggle-swatch"
          style={{ background: `hsl(${hue}, 88%, 63%)` }}
        />
        <span className="theme-toggle-label">Customize Theme</span>
      </button>

      {open && (
        <div className="theme-popover">
          <p className="theme-popover-label">Accent colour</p>

          <div className="theme-presets">
            {presets.map((p) => (
              <button
                key={p.hue}
                className={`theme-preset-dot${hue === p.hue ? ' active' : ''}`}
                style={{ background: `hsl(${p.hue}, 88%, 63%)` }}
                title={p.label}
                type="button"
                onClick={() => {
                  setHue(p.hue)
                  localStorage.setItem(STORAGE_KEY, String(p.hue))
                }}
              />
            ))}
          </div>

          <input
            className="theme-hue-slider"
            type="range"
            min={0}
            max={359}
            value={hue}
            onChange={handleChange}
          />

          <button className="theme-reset-btn" type="button" onClick={handleReset}>
            Reset to default
          </button>
        </div>
      )}
    </div>
  )
}
