import PageIntro from '../components/PageIntro'
import { skillGroups } from '../content/portfolio'

function AboutPage() {
  return (
    <div className="route-shell">
      <PageIntro
        eyebrow="About"
        title="Engineering for products that need structure, speed, and longevity"
        description="Senior frontend and full-stack engineering experience focused on scalable UI architecture, modernization work, and dependable enterprise delivery."
      />

      <section className="about-grid content-section-tight">
        <article className="about-panel reveal reveal-delay-1" id="about-engineering">
          <p>
            I work at the intersection of frontend architecture, platform
            thinking, and delivery execution. My background spans Angular,
            React, Node.js, headless CMS platforms, chatbot integrations, and
            real-time systems used by enterprise teams in production.
          </p>
          <p>
            Over the years, my focus has been consistent: build maintainable
            interfaces, modernize legacy stacks without disrupting delivery,
            create systems that stay understandable as products grow, and
            explore conversational experiences through Google Dialogflow and
            Amazon Lex proof-of-concepts.
          </p>
        </article>

        <article className="focus-panel reveal reveal-delay-2" id="about-focus">
          <h3>Current focus</h3>
          <ul>
            <li>Component-driven frontend architecture</li>
            <li>Real-time data interfaces for operational teams</li>
            <li>Node.js services and microservice integration</li>
            <li>Chatbot workflows with Google Dialogflow and Amazon Lex POCs</li>
          </ul>
        </article>
      </section>

      <section className="content-section" id="about-capabilities">
        <div className="section-heading reveal">
          <p className="eyebrow">Capabilities</p>
          <h2>Core technologies and delivery strengths</h2>
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