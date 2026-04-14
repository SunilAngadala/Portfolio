import { useEffect, useState } from 'react'
import cAndsImage from '../assets/c&s.jpg'
import cAndsWholesaleGrocersImage from '../assets/C&SWholesaleGrocers.jpg'
import servicesImage from '../assets/services.jpg'
import tomsImage from '../assets/toms.jpg'
import unitedAirlineImage from '../assets/United airline.jpg'
import { featuredWork } from '../content/portfolio'

function renderProjectVisual(visual: string) {
  switch (visual) {
    case 'grocery-platform':
      return (
        <div className="project-illustration project-illustration-single">
          <div className="project-media-card project-media-card-primary">
            <img className="project-media-image" src={cAndsImage} alt="" />
            <div className="project-media-overlay">
              <span className="project-media-kicker">C&amp;S Wholesale Grocers</span>
              <strong>Headless CMS Platform</strong>
            </div>
          </div>
        </div>
      )
    case 'grocery-operations':
      return (
        <div className="project-illustration project-illustration-collage">
          <div className="project-media-card project-media-card-wide project-media-card-contain">
            <img className="project-media-image" src={cAndsWholesaleGrocersImage} alt="" />
            <div className="project-media-overlay">
              <span className="project-media-kicker">C&amp;S Wholesale Grocers</span>
              <strong>Real-time Operations</strong>
            </div>
          </div>
          <div className="project-media-card project-media-card-accent project-media-card-small project-media-card-dashboard-mini">
            <div className="project-dashboard-header project-dashboard-header-mini">
              <span className="project-media-kicker">Real-time Operations</span>
              <strong>Live Dashboards</strong>
            </div>
            <div className="project-dashboard-bars project-dashboard-bars-mini">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )
    case 'airline-retail':
      return (
        <div className="project-illustration project-illustration-collage">
          <div className="project-media-card project-media-card-wide">
            <img className="project-media-image" src={unitedAirlineImage} alt="" />
            <div className="project-media-overlay">
              <span className="project-media-kicker">United Airlines</span>
              <strong>Frontend Modernization</strong>
            </div>
          </div>
          <div className="project-media-card project-media-card-accent project-media-card-small">
            <img className="project-media-image" src={tomsImage} alt="" />
            <div className="project-media-overlay project-media-overlay-compact">
              <span className="project-media-kicker">TOMS</span>
            </div>
          </div>
        </div>
      )
    case 'services':
      return (
        <div className="project-illustration project-illustration-single">
          <div className="project-media-card project-media-card-primary">
            <img className="project-media-image" src={servicesImage} alt="" />
            <div className="project-media-overlay">
              <span className="project-media-kicker">Services and Internal Tools</span>
              <strong>CRM and Business Workflow Delivery</strong>
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div className="project-illustration project-illustration-single">
          <div className="project-media-card project-media-card-primary">
            <img className="project-media-image" src={servicesImage} alt="" />
          </div>
        </div>
      )
  }
}

function ProjectsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % featuredWork.length)
    }, 3200)

    return () => {
      window.clearInterval(timer)
    }
  }, [autoPlay])

  const activeProject = featuredWork[activeIndex]

  const showSlide = (index: number) => {
    setActiveIndex(index)
    setAutoPlay(false)
  }

  const showPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? featuredWork.length - 1 : currentIndex - 1,
    )
    setAutoPlay(false)
  }

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % featuredWork.length)
    setAutoPlay(false)
  }

  return (
    <div className="route-shell projects-route">
      <section className="projects-carousel reveal" id="projects-featured">
        <div className="projects-stage" id="projects-visuals">
          {featuredWork.map((item, index) => (
            <article
              className={
                index === activeIndex
                  ? 'project-slide project-slide-active'
                  : 'project-slide'
              }
              key={item.title}
              aria-hidden={index !== activeIndex}
            >
              <div className="project-slide-copy">
                <p className="project-company">{item.company}</p>
                <h2>{item.title}</h2>
                <p className="project-slide-summary">{item.summary}</p>
                <p className="project-impact">{item.impact}</p>
                <div className="tag-list" id={index === activeIndex ? 'projects-stack' : undefined}>
                  {item.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>

              <div className="project-slide-visual" aria-hidden="true">
                {renderProjectVisual(item.visual)}
              </div>
            </article>
          ))}
        </div>

        <aside className="projects-sidebar">
          <div className="projects-sidebar-top">
            <p className="eyebrow">Selected work</p>
            <div className="projects-sidebar-current">
              <h3>{activeProject.title}</h3>
              <p>{activeProject.company}</p>
            </div>
            <p className="projects-sidebar-status">
              {autoPlay ? 'Auto-sliding' : 'Paused after selection'}
            </p>
          </div>

          <div className="projects-slide-list" role="tablist" aria-label="Project slides">
            {featuredWork.map((item, index) => (
              <button
                key={item.title}
                className={
                  index === activeIndex
                    ? 'project-selector project-selector-active'
                    : 'project-selector'
                }
                onClick={() => showSlide(index)}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
              >
                <span>{`0${index + 1}`}</span>
                <strong>{item.title}</strong>
                <small>{item.company}</small>
              </button>
            ))}
          </div>

          <div className="projects-controls">
            <button className="button button-secondary" onClick={showPrevious} type="button">
              Previous
            </button>
            <button className="button button-primary" onClick={showNext} type="button">
              Next Slide
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default ProjectsPage