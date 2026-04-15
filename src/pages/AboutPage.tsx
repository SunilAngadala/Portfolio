import aboutImage from '../assets/About.jpg'
import { skillGroups } from '../content/portfolio'

function AboutPage() {
  return (
    <div className="route-shell">
      <section className="about-hero" id="about-engineering">
        <div className="about-copy reveal reveal-delay-1">
          <p className="eyebrow">About Me</p>
          <h2 className="about-heading">A builder who thinks in layers.</h2>

          <div className="about-bio">
            <p>
              I am a builder who has lived inside systems for a long time. Not just someone who
              writes UI, but someone who thinks in layers — how things connect, how data flows,
              and how users move through invisible structures. My journey reflects depth more than
              noise. I have worked across frontend, backend, real-time systems, microservices, and
              integrations, but what defines me is not the tools — it's the way I try to understand
              why systems behave the way they do.
            </p>
            <p>
              There is also a quiet restlessness in me. I'm not satisfied with surface-level work.
              Whether it's exploring AI tools, building a personal site, or questioning architecture
              patterns, I keep moving toward something more meaningful — something aligned, not just
              functional.
            </p>
            <p>
              At the same time, I carry responsibility and pressure — career direction, expectations,
              and growth. But instead of stopping, I continue searching, adapting, and rebuilding.
              That persistence is part of who I am.
            </p>
            <p>
              I am not starting from zero. I am transitioning — from execution to intent, from
              building features to understanding systems deeply.
            </p>
          </div>

          <blockquote className="about-quote">
            I care about how systems work, not just how code runs.
          </blockquote>
        </div>

        <div className="about-photo-wrap reveal reveal-delay-2">
          <div className="about-photo-frame">
            <img src={aboutImage} alt="Sunil Angadala" className="about-photo-img" />
            <div className="about-photo-badge">
              <strong>15+</strong>
              <span>Years of engineering</span>
            </div>
          </div>

          <div className="about-focus-panel reveal reveal-delay-3" id="about-focus">
            <p className="eyebrow">Current focus</p>
            <ul>
              <li>Component-driven frontend architecture</li>
              <li>Real-time data interfaces for operational teams</li>
              <li>Node.js services and microservice integration</li>
              <li>Chatbot workflows with Google Dialogflow and Amazon Lex POCs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section" id="about-capabilities">
        <div className="section-heading reveal">
          <p className="eyebrow">Capabilities</p>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <article
              className={`skill-card reveal reveal-delay-${(index % 3) + 1}`}
              key={group.title}
            >
              <h3>{group.title}</h3>
              <div className="tag-list">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage