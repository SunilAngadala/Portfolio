import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { metrics, strengths } from '../content/portfolio'

const homeHighlights = [
  {
    title: 'Current focus',
    body: 'Architecture-led frontend strategy, cross-team technical direction, and scalable delivery for enterprise products.',
  },
  {
    title: 'Core stack',
    body: 'React, Angular, TypeScript, Node.js, real-time systems, and CMS-backed enterprise platforms.',
  },
]

function HomePage() {
  return (
    <div className="route-shell home-route">
      <section className="hero-section section-grid" id="home-strengths">
        <div className="hero-copy reveal reveal-delay-1">
          <p className="eyebrow">15+ years leading enterprise platform delivery</p>
          <h1 className="hero-title">
            Architecting enterprise platforms and leading frontend modernization.
          </h1>
          <p className="hero-text">
            Positioned for architect, principal engineer, and lead engineering roles,
            with deep experience in React, Angular, Node.js, real-time systems,
            and large-scale product delivery across distributed teams.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" to="/projects">
              View Selected Work
            </Link>
            <Link className="button button-secondary" to="/about">
              Learn More
            </Link>
          </div>

          <ul className="hero-signals" aria-label="Core strengths">
            {strengths.map((strength, index) => (
              <li key={strength}>
                <span>{`0${index + 1}`}</span>
                <p>{strength}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual reveal reveal-delay-2">
          <div className="hero-visual-main" aria-hidden="true">
            <div className="illustration-card">
              <img className="hero-illustration" src={heroImage} alt="Developer illustration" />
            </div>
            <div className="floating-card card-a">
              <span>React</span>
              <strong>Reusable UI systems</strong>
            </div>
            <div className="floating-card card-b">
              <span>Real-time</span>
              <strong>Socket.io + Redis</strong>
            </div>
            <div className="floating-card card-c">
              <span>Platform</span>
              <strong>CMS + APIs + CI/CD</strong>
            </div>
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
          </div>

          <div className="hero-side-stack">
            {homeHighlights.map((item, index) => (
              <article
                className={`hero-side-card reveal reveal-delay-${(index % 3) + 1}`}
                key={item.title}
              >
                <p className="eyebrow">{item.title}</p>
                <p>{item.body}</p>
              </article>
            ))}

            <div className="hero-side-note reveal reveal-delay-3">
              <p className="eyebrow">Selected direction</p>
              <p>Architecture ownership, platform modernization, and technical leadership for complex enterprise products.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-strip reveal reveal-delay-2" aria-label="Professional summary" id="home-metrics">
        {metrics.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="content-section route-preview-grid" id="home-routes">
        <article className="snapshot-card reveal reveal-delay-1">
          <p className="eyebrow">About</p>
          <h2>Architecture-led engineering</h2>
          <p>
            Product delivery shaped by reusable UI systems, clean frontend
            structure, and pragmatic technical decisions.
          </p>
          <Link to="/about">Open About</Link>
        </article>

        <article className="snapshot-card reveal reveal-delay-2">
          <p className="eyebrow">Experience</p>
          <h2>Enterprise delivery history</h2>
          <p>
            Senior roles across real-time dashboards, headless CMS platforms,
            modernization initiatives, and full product delivery.
          </p>
          <Link to="/experience">Open Experience</Link>
        </article>

        <article className="snapshot-card reveal reveal-delay-3">
          <p className="eyebrow">Projects</p>
          <h2>Selected work highlights</h2>
          <p>
            Representative work across CMS architecture, real-time operations,
            and enterprise frontend modernization.
          </p>
          <Link to="/projects">Open Projects</Link>
        </article>
      </section>
    </div>
  )
}

export default HomePage