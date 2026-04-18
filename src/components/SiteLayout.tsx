import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { resumeFile } from '../content/portfolio'
import ThemeSlider from './ThemeSlider'

const brandTitles = ['System Traveller', 'Layer Navigator', 'Depth Seeker']

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: "Systems I've Built" },
  { to: '/contact', label: "Let's Connect" },
  { to: '/analytics', label: 'Analytics' },
]

const routeMeta = {
  '/': {
    label: 'Home',
    breadcrumb: 'Overview',
    highlights: [
      { label: 'Strengths', targetId: 'home-strengths' },
      { label: 'Metrics', targetId: 'home-metrics' },
    ],
  },
  '/about': {
    label: 'About',
    breadcrumb: 'Profile',
    highlights: [
      { label: 'Engineering focus', targetId: 'about-engineering' },
      { label: 'Current focus', targetId: 'about-focus' },
      { label: 'Technology stack', targetId: 'about-capabilities' },
    ],
  },
  '/experience': {
    label: 'Experience',
    breadcrumb: 'Career Path',
    highlights: [
      { label: 'Role timeline', targetId: 'experience-timeline' },
      { label: 'Delivery phases', targetId: 'experience-detail' },
    ],
  },
  '/projects': {
    label: 'Projects',
    breadcrumb: 'Selected Work',
    highlights: [
      { label: 'Featured builds', targetId: 'projects-featured' },
      { label: 'Project visuals', targetId: 'projects-visuals' },
      { label: 'Tech stack', targetId: 'projects-stack' },
    ],
  },
  '/contact': {
    label: "Let's Connect",
    breadcrumb: 'Connect',
    highlights: [
      { label: 'Email and socials', targetId: 'contact-methods' },
      { label: 'Resume access', targetId: 'contact-resume' },
      { label: 'Education', targetId: 'contact-education' },
    ],
  },
  '/analytics': {
    label: 'Analytics',
    breadcrumb: 'Metrics',
    highlights: [
      { label: 'Overview', targetId: 'top' },
      { label: 'Top pages', targetId: 'top' },
      { label: 'Traffic sources', targetId: 'top' },
    ],
  },
} as const

function SiteLayout() {
  const location = useLocation()
  const [titleIndex, setTitleIndex] = useState(0)
  const [titleVisible, setTitleVisible] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleVisible(false)
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % brandTitles.length)
        setTitleVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Close mobile nav and more dropdown on route change
  useEffect(() => {
    setMobileNavOpen(false)
    setMobileMoreOpen(false)
  }, [location.pathname])

  // Close More dropdown on outside click
  useEffect(() => {
    if (!mobileMoreOpen) return undefined
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMobileMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileMoreOpen])

  const currentRoute = routeMeta[location.pathname as keyof typeof routeMeta] ?? {
    label: 'Portfolio',
    breadcrumb: 'Section',
    highlights: [
      { label: 'Overview', targetId: 'top' },
      { label: 'Details', targetId: 'top' },
      { label: 'Navigation', targetId: 'top' },
    ],
  }
  const [activeHighlight, setActiveHighlight] = useState<string>(
    currentRoute.highlights[0]?.targetId ?? 'top',
  )

  useEffect(() => {
    const initialHighlight = currentRoute.highlights[0]?.targetId ?? 'top'
    const frameId = window.requestAnimationFrame(() => {
      setActiveHighlight(initialHighlight)
    })

    const elements = currentRoute.highlights
      .map((item) => document.getElementById(item.targetId))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return () => {
        window.cancelAnimationFrame(frameId)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)

        if (visibleEntries.length === 0) {
          return
        }

        setActiveHighlight(visibleEntries[0].target.id)
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [currentRoute.highlights, location.pathname])

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId)
    const header = document.querySelector('.site-header')

    if (!element) {
      return
    }

    setActiveHighlight(targetId)

    const headerOffset = header instanceof HTMLElement ? header.offsetHeight + 18 : 0
    const elementTop = element.getBoundingClientRect().top + window.scrollY

    window.scrollTo({
      top: Math.max(0, elementTop - headerOffset),
      behavior: 'smooth',
    })
  }

  return (
    <div className="page-shell" id="top">
      <header className="site-header">
        <div className="site-header-main">
          {/* Desktop brand — hidden on mobile */}
          <NavLink className="brand" to="/" end aria-label="Sunil Angadala home">
            <span className="brand-mark">SA</span>
            <span className="brand-copy">
              <strong>Sunil Angadala</strong>
              <span
                className="brand-subtitle"
                style={{ opacity: titleVisible ? 1 : 0 }}
              >
                {brandTitles[titleIndex]}
              </span>
            </span>
          </NavLink>

          {/* Mobile-only: hamburger Menu button */}
          <button
            className="site-mobile-menu-btn"
            onClick={() => setMobileNavOpen((v) => !v)}
            type="button"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
          >
            <span className="site-mobile-menu-icon">{mobileNavOpen ? '✕' : '☰'}</span>
          </button>

          {/* Mobile-only: center brand + breadcrumb */}
          <div className="site-mobile-topbar-center">
            <div className="site-mobile-topbar-brand">
              <span className="brand-mark">SA</span>
              <strong className="site-mobile-topbar-name">Sunil Angadala</strong>
            </div>
            {location.pathname !== '/' && (
              <div className="site-mobile-topbar-crumb">
                <Link className="site-mobile-topbar-home" to="/">Home</Link>
                <span className="site-mobile-topbar-sep">›</span>
                <span className="site-mobile-topbar-page">{currentRoute.label}</span>
              </div>
            )}
          </div>

          <nav
            className={mobileNavOpen ? 'site-nav site-nav-mobile-open' : 'site-nav'}
            aria-label="Primary navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop: Download Resume */}
          <a className="button button-secondary" data-umami-event="Download Resume" href={resumeFile} download>
            Download Resume
          </a>
          <ThemeSlider />

          {/* Mobile-only: More (⋮) with Download Resume dropdown */}
          <div className="site-mobile-more-wrap" ref={moreRef}>
            <button
              className="site-mobile-more-btn"
              onClick={() => setMobileMoreOpen((v) => !v)}
              type="button"
              aria-label="More options"
              aria-expanded={mobileMoreOpen}
            >
              <span className="site-mobile-more-icon">⋮</span>
            </button>
            {mobileMoreOpen && (
              <div className="site-mobile-more-dropdown" role="menu">
                <a
                  className="site-mobile-more-item"
                  data-umami-event="Download Resume"
                  href={resumeFile}
                  download
                  role="menuitem"
                  onClick={() => setMobileMoreOpen(false)}
                >
                  Download Resume ↓
                </a>
                <div className="site-mobile-more-divider" />
                <div className="site-mobile-more-theme">
                  <ThemeSlider />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="site-subnav" aria-label="Section breadcrumb and quick links">
          <div className="subnav-menu-pill">
            <span>Explore</span>
          </div>

          <div className="site-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{currentRoute.breadcrumb}</span>
          </div>

          <div className="site-subnav-links">
            <span className="site-subnav-current">{currentRoute.label}</span>
            {currentRoute.highlights.map((item) => (
              <button
                className={
                  item.targetId === activeHighlight
                    ? 'site-subnav-highlight site-subnav-highlight-active'
                    : 'site-subnav-highlight'
                }
                key={item.label}
                onClick={() => scrollToSection(item.targetId)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-note">All rights reserved to Sunil Angadala @2026</p>
      </footer>
    </div>
  )
}

export default SiteLayout