import { useState } from 'react'
import { experience } from '../content/portfolio'

function ExperiencePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeExperience = experience[activeIndex]

  return (
    <div className="route-shell experience-route">
      <section className="experience-layout reveal reveal-delay-1">
        <div className="experience-layout-grid">
          <div className="experience-list" id="experience-timeline" role="tablist" aria-label="Experience roles">
          {experience.map((item, index) => (
            <button
              key={`${item.company}-${item.period}`}
              className={
                index === activeIndex
                  ? 'experience-list-item experience-list-item-active'
                  : 'experience-list-item'
              }
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span className="experience-list-period">{item.period}</span>
              <div className="experience-list-copy">
                <strong>{item.role}</strong>
                <small>{item.company}</small>
              </div>
            </button>
          ))}
          </div>

          <article className="experience-focus-card reveal reveal-delay-2" id="experience-detail">
            <div className="experience-focus-topline">
              <p className="experience-focus-period">{activeExperience.period}</p>
              <span className="experience-focus-index">{`0${activeIndex + 1}`}</span>
            </div>

            <div className="experience-focus-header">
              <div>
                <h2>{activeExperience.role}</h2>
                <p className="timeline-company">{activeExperience.company}</p>
              </div>
              <div className="experience-focus-accent" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <ul className="experience-focus-points" id="experience-contributions">
              {activeExperience.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

          </article>
        </div>
      </section>
    </div>
  )
}

export default ExperiencePage