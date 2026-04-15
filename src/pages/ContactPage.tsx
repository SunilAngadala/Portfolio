import { useState } from 'react'
import { contact, education, resumeFile } from '../content/portfolio'

function ContactPage() {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null)

  const copyValue = async (value: string, field: 'email' | 'phone') => {
    await navigator.clipboard.writeText(value)
    setCopiedField(field)
    window.setTimeout(() => {
      setCopiedField((currentField) => (currentField === field ? null : currentField))
    }, 1500)
  }

  return (
    <div className="route-shell contact-route">
      <section className="contact-flight content-section-tight">
        <article className="contact-card contact-card-primary reveal reveal-delay-1" id="contact-methods">
          <p className="eyebrow">Professional contact</p>
          <div className="contact-method-grid">
            <div className="contact-method contact-method-inline">
              <a className="contact-method-link" href={`mailto:${contact.email}`}>
                <span>Email</span>
                <strong>{contact.email}</strong>
              </a>
              <button
                aria-label="Copy email"
                className="copy-button"
                onClick={() => void copyValue(contact.email, 'email')}
                type="button"
              >
                {copiedField === 'email' ? '✓' : '⧉'}
              </button>
            </div>

            <div className="contact-method contact-method-inline">
              <a className="contact-method-link" href={`tel:${contact.phoneLink}`}>
                <span>Phone</span>
                <strong>{contact.phoneDisplay}</strong>
              </a>
              <button
                aria-label="Copy phone number"
                className="copy-button"
                onClick={() => void copyValue(contact.phoneDisplay, 'phone')}
                type="button"
              >
                {copiedField === 'phone' ? '✓' : '⧉'}
              </button>
            </div>

            <a
              className="contact-method"
              href="https://github.com/SunilAngadala"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>GitHub</span>
              <strong>github.com/SunilAngadala</strong>
            </a>

            <a className="contact-method" href={resumeFile} target="_blank" rel="noopener noreferrer" id="contact-resume">
                <span>Resume</span>
                <strong>View Resume</strong>
            </a>
          </div>
        </article>

        <aside className="contact-dragonfly reveal reveal-delay-2" aria-hidden="true">
          <div className="dragonfly-scene">
            <div className="dragonfly-group dragonfly-group-a">
              <div className="dragonfly dragonfly-small">
                <span className="dragonfly-wing wing-left-top"></span>
                <span className="dragonfly-wing wing-right-top"></span>
                <span className="dragonfly-wing wing-left-bottom"></span>
                <span className="dragonfly-wing wing-right-bottom"></span>
                <span className="dragonfly-body"></span>
                <span className="dragonfly-tail"></span>
              </div>
            </div>

            <div className="dragonfly-group dragonfly-group-b">
              <div className="dragonfly dragonfly-medium">
                <span className="dragonfly-wing wing-left-top"></span>
                <span className="dragonfly-wing wing-right-top"></span>
                <span className="dragonfly-wing wing-left-bottom"></span>
                <span className="dragonfly-wing wing-right-bottom"></span>
                <span className="dragonfly-body"></span>
                <span className="dragonfly-tail"></span>
              </div>
            </div>

            <div className="dragonfly-group dragonfly-group-c">
              <div className="dragonfly dragonfly-small">
                <span className="dragonfly-wing wing-left-top"></span>
                <span className="dragonfly-wing wing-right-top"></span>
                <span className="dragonfly-wing wing-left-bottom"></span>
                <span className="dragonfly-wing wing-right-bottom"></span>
                <span className="dragonfly-body"></span>
                <span className="dragonfly-tail"></span>
              </div>
            </div>
            <span className="dragonfly-link dragonfly-link-a"></span>
            <span className="dragonfly-link dragonfly-link-b"></span>
            <span className="dragonfly-signal signal-a"></span>
            <span className="dragonfly-signal signal-b"></span>
            <span className="dragonfly-orb orb-a"></span>
            <span className="dragonfly-orb orb-b"></span>
            <span className="dragonfly-orb orb-c"></span>
          </div>

          <div className="contact-education-float" id="contact-education">
            <p className="eyebrow">Education</p>
            <ul>
              {education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default ContactPage