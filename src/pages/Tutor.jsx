import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import SectionHeader from '../components/SectionHeader'
import CTABanner from '../components/CTABanner'
import KalamkariIcon from '../components/KalamkariIcon'
import { domains, shockingStats, checklistItems, beforeAfterData, assessmentFlows, processSteps, trustSignals } from '../data/tutorData'

/* ─── Animated Counter Hook ─── */
function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (!startOnView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const numericEnd = parseFloat(end.replace(/[^0-9.]/g, ''))
          if (isNaN(numericEnd)) { setCount(end); return }
          const startTime = performance.now()
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * numericEnd))
            if (progress < 1) requestAnimationFrame(animate)
            else setCount(numericEnd)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration, startOnView])

  return { ref, count }
}

/* ─── Stat Card ─── */
function StatCard({ value, label, index }) {
  const isNumeric = /^[\d.]+/.test(value.replace(/[^0-9.]/g, ''))
  const prefix = value.match(/^[^0-9]*/)?.[0] || ''
  const suffix = value.match(/[^0-9]*$/)?.[0] || ''
  const { ref, count } = useCounter(value, 2000)

  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="tutor-stat-card-v2" ref={ref}>
        <h3 className="tutor-stat-value-v2">
          {isNumeric ? `${prefix}${count}${suffix}` : value}
        </h3>
        <p className="tutor-stat-label-v2">{label}</p>
      </div>
    </ScrollReveal>
  )
}

/* ─── Trust Signal Bar ─── */
function TrustBar() {
  return (
    <section className="tutor-trust-bar">
      <div className="container">
        <div className="tutor-trust-grid">
          {trustSignals.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="tutor-trust-item">
                <span className="tutor-trust-value">{item.value}</span>
                <span className="tutor-trust-label">{item.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How We Help — Process Steps ─── */
function ProcessSection() {
  const navigate = useNavigate()

  return (
    <section className="tutor-section-block tutor-section-alt">
      <div className="container">
        <SectionHeader
          label="How It Works"
          title="Getting Documents is"
          titleHighlight="Simple With Us"
          description="No more confusing procedures, office visits, or middlemen. Here's exactly how iN Empower works — in 4 simple steps."
        />

        <div className="tutor-process-grid">
          {processSteps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <div className="tutor-process-card">
                <div className="tutor-process-number">{step.step}</div>
                <div className="tutor-process-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                {i < processSteps.length - 1 && (
                  <div className="tutor-process-connector" aria-hidden="true">→</div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/contact')}>
              Get Started — Talk to a Local Buddy →
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─── Quick Assessment Wizard ─── */
function QuickAssessmentWizard() {
  const [step, setStep] = useState(0) // 0=situation, 1+=questions, last=results
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()
  const panelRef = useRef(null)

  const totalSteps = selectedFlow ? selectedFlow.questions.length + 2 : 3 // situation + questions + results
  const stepLabels = selectedFlow
    ? ['Your Situation', ...selectedFlow.questions.map(q => q.question.split('?')[0].trim().slice(0, 20) + '…'), 'Your Action Plan']
    : ['Your Situation', 'Details', 'Your Action Plan']

  const scrollToPanel = () => {
    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleFlowSelect = (flow) => {
    setSelectedFlow(flow)
    setAnswers([])
    setStep(1)
    scrollToPanel()
  }

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)

    if (newAnswers.length < selectedFlow.questions.length) {
      setStep(step + 1)
    } else {
      setStep(selectedFlow.questions.length + 1) // results step
    }
    scrollToPanel()
  }

  const goBack = () => {
    if (step === 1) {
      setSelectedFlow(null)
      setAnswers([])
      setStep(0)
    } else {
      setAnswers(prev => prev.slice(0, -1))
      setStep(step - 1)
    }
  }

  const resetWizard = () => {
    setStep(0)
    setSelectedFlow(null)
    setAnswers([])
  }

  const handleServiceClick = (svc) => {
    navigate(`/contact?service=${svc.service}&subService=${svc.subService}`)
  }

  const isResults = selectedFlow && step === selectedFlow.questions.length + 1
  const currentQuestion = selectedFlow && step >= 1 && step <= selectedFlow.questions.length
    ? selectedFlow.questions[step - 1]
    : null

  const priorityConfig = {
    critical: { label: 'Must Do', color: '#8B0000', bg: 'rgba(139,0,0,0.06)', border: 'rgba(139,0,0,0.2)', icon: '🔴' },
    important: { label: 'Should Do', color: '#B8860B', bg: 'rgba(218,165,32,0.06)', border: 'rgba(218,165,32,0.2)', icon: '🟡' },
    recommended: { label: 'Good to Have', color: '#138808', bg: 'rgba(19,136,8,0.06)', border: 'rgba(19,136,8,0.2)', icon: '🟢' }
  }

  return (
    <section className="tutor-section-block" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-surface) 100%)', position: 'relative', overflow: 'hidden', paddingBottom: 0 }} ref={panelRef}>
      {/* Subtle decorative glow */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-teal-glow)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeader
          label="Quick Assessment"
          title="What's Your"
          titleHighlight="Situation?"
          description="Tell us what's happening in your life. We'll tell you exactly which services and documents you need — and help you get started."
        />

        {/* Progress Steps */}
        <ScrollReveal>
          <div className="wizard-progress">
            {stepLabels.map((label, i) => (
              <div key={i} className={`wizard-progress-step ${step >= i ? 'active' : ''} ${step === i ? 'current' : ''}`}>
                <div className="wizard-progress-dot">
                  {step > i ? '✓' : i + 1}
                </div>
                <span className="wizard-progress-label">{label}</span>
                {i < stepLabels.length - 1 && <div className={`wizard-progress-line ${step > i ? 'active' : ''}`} />}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Step 0: Select Life Situation */}
        {step === 0 && (
          <ScrollReveal>
            <div className="wizard-situation-grid">
              {assessmentFlows.map((flow) => (
                <button
                  key={flow.id}
                  className="wizard-situation-card"
                  onClick={() => handleFlowSelect(flow)}
                  style={{ '--flow-color': flow.color }}
                >
                  <div className="wizard-situation-icon">{flow.icon}</div>
                  <div className="wizard-situation-text">
                    <h4>{flow.label}</h4>
                    <p>{flow.description}</p>
                  </div>
                  <span className="wizard-situation-arrow">→</span>
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Steps 1-N: Contextual Questions */}
        {currentQuestion && (
          <ScrollReveal>
            <div className="wizard-question-panel">
              <div className="wizard-question-header">
                <span className="wizard-question-flow-badge" style={{ background: selectedFlow.color, color: '#fff' }}>
                  {selectedFlow.icon} {selectedFlow.label}
                </span>
                <h3>{currentQuestion.question}</h3>
              </div>
              <div className="wizard-option-grid">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    className="wizard-option-btn"
                    onClick={() => handleAnswer(option)}
                    style={{ '--flow-color': selectedFlow.color }}
                  >
                    <span className="wizard-option-label">{option.label}</span>
                    {option.urgency === 'high' && <span className="wizard-option-urgent">Urgent</span>}
                    {option.urgency === 'medium' && <span className="wizard-option-caution">Act Soon</span>}
                  </button>
                ))}
              </div>
              <button className="btn btn-outline btn-sm" onClick={goBack} style={{ marginTop: '1rem' }}>
                ← Back
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* Results: Personalized Action Plan */}
        {isResults && selectedFlow && (
          <ScrollReveal>
            <div className="wizard-action-plan">
              {/* Plan Header */}
              <div className="wizard-plan-header">
                <span className="wizard-question-flow-badge" style={{ background: selectedFlow.color, color: '#fff' }}>
                  {selectedFlow.icon} {selectedFlow.label}
                </span>
                <h3>Your Personalized Action Plan</h3>
                <p>Based on your answers, here's exactly what you need to do — and we can help with every step.</p>
              </div>

              {/* Services by Priority */}
              <div className="wizard-services-section">
                <h4>📋 Services You Need</h4>
                <div className="wizard-services-list">
                  {selectedFlow.results.services.map((svc, i) => {
                    const pc = priorityConfig[svc.priority]
                    return (
                      <button
                        key={i}
                        className="wizard-service-row"
                        onClick={() => handleServiceClick(svc)}
                        style={{ '--priority-bg': pc.bg, '--priority-border': pc.border }}
                      >
                        <span className="wizard-service-priority-dot">{pc.icon}</span>
                        <div className="wizard-service-info">
                          <span className="wizard-service-name">{svc.name}</span>
                          <span className="wizard-service-priority-label" style={{ color: pc.color }}>{pc.label}</span>
                        </div>
                        <span className="wizard-service-cta">Get Help →</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Documents Required */}
              <div className="wizard-docs-section">
                <h4>📄 Documents You'll Need</h4>
                <div className="wizard-docs-list">
                  {selectedFlow.results.documents.map((doc, i) => (
                    <div key={i} className="wizard-doc-item">
                      <span className="wizard-doc-bullet">•</span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline & Warning */}
              <div className="wizard-plan-meta">
                <div className="wizard-plan-timeline">
                  <span className="wizard-plan-meta-icon">⏱️</span>
                  <div>
                    <strong>Expected Timeline</strong>
                    <p>{selectedFlow.results.timeline}</p>
                  </div>
                </div>
                <div className="wizard-plan-warning">
                  <span className="wizard-plan-meta-icon">⚠️</span>
                  <div>
                    <strong>Important to Know</strong>
                    <p>{selectedFlow.results.warning}</p>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="wizard-plan-cta">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate(`/contact?service=${selectedFlow.results.services[0].service}&subService=${selectedFlow.results.services[0].subService}&message=I need help with: ${selectedFlow.label}`)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Start Now — Talk to a Local Buddy →
                </button>
                <button className="btn btn-outline btn-sm" onClick={resetWizard} style={{ marginTop: '0.75rem' }}>
                  ← Assess Another Situation
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}
        {/* Beautiful Wave Divider to remove blunt space */}
        <div style={{ position: 'relative', width: '100%', height: '80px', marginTop: '3rem', overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', fill: 'var(--bg-secondary)' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.65,135.53,200.7,122.9,242.49,115.39,282.88,88.4,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}

/* ─── Before vs After Comparison (Redesigned) ─── */
function BeforeAfterSection() {
  const navigate = useNavigate()

  return (
    <section className="tutor-section-block tutor-section-alt">
      <div className="container">
        <SectionHeader
          label="The iN Empower Difference"
          title="Without Us vs"
          titleHighlight="With Us"
          description="See how iN Empower transforms the painful document process into a smooth, trustworthy experience."
        />

        <div className="ba-comparison-table">
          {/* Table Header */}
          <div className="ba-table-header">
            <div className="ba-table-header-icon"></div>
            <div className="ba-table-header-before">
              <span className="ba-header-badge ba-header-badge-before">❌ Without Us</span>
            </div>
            <div className="ba-table-header-after">
              <span className="ba-header-badge ba-header-badge-after">✅ With iN Empower</span>
            </div>
          </div>

          {/* Rows */}
          {beforeAfterData.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="ba-table-row">
                <div className="ba-row-icon">{item.icon}</div>
                <div className="ba-row-before">
                  <h4>{item.before.title}</h4>
                  <p>{item.before.description}</p>
                </div>
                <div className="ba-row-divider" aria-hidden="true">
                  <span>→</span>
                </div>
                <div className="ba-row-after">
                  <h4>{item.after.title}</h4>
                  <p>{item.after.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/contact')}>
              Experience the Difference →
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ─── Domain Card with Progress ─── */
function DomainCard({ domain, index, expanded, onToggle }) {
  const isOpen = expanded === domain.id

  return (
    <ScrollReveal delay={index * 0.08}>
      <div className={`tutor-domain-card ${isOpen ? 'expanded' : ''}`}>
        {/* Card Header — always visible */}
        <button className="tutor-domain-header" onClick={() => onToggle(domain.id)}>
          <div className="tutor-domain-icon-wrap">
            <KalamkariIcon iconName={domain.icon} iconColor={domain.iconColor} size={52} />
          </div>
          <div className="tutor-domain-header-text">
            <h3>{domain.title}</h3>
            <p>{domain.tagline}</p>
          </div>
          <span className="tutor-domain-toggle">{isOpen ? '−' : '+'}</span>
        </button>

        {/* Expandable Body */}
        <div className={`tutor-domain-body ${isOpen ? 'open' : ''}`}>
          <div className="tutor-domain-body-inner">
            {/* Why It Matters */}
            <div className="tutor-section">
              <h4 className="tutor-section-title">💡 Why It Matters</h4>
              <p>{domain.why}</p>
            </div>

            {/* Real Story */}
            <div className="tutor-scenario">
              <div className="tutor-scenario-badge">Real Story</div>
              <p>
                <strong>{domain.scenario.name}</strong> from {domain.scenario.location}: "{domain.scenario.story}"
              </p>
            </div>

            {/* Two columns: Documents + Where Used */}
            <div className="tutor-two-col">
              <div className="tutor-section">
                <h4 className="tutor-section-title">📋 Documents You Need</h4>
                <ul>
                  {domain.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                </ul>
              </div>
              <div className="tutor-section">
                <h4 className="tutor-section-title">🎯 Where They're Used</h4>
                <ul>
                  {domain.usedIn.map((use, i) => <li key={i}>{use}</li>)}
                </ul>
              </div>
            </div>

            {/* Quick Stat */}
            <div className="tutor-domain-stat">
              <strong>{domain.stats.affected}</strong> {domain.stats.description}
            </div>

            {/* Action Links */}
            <div className="tutor-domain-actions">
              {domain.serviceLinks.map((link, i) => (
                <Link key={i} to={link.path} className="btn btn-outline btn-sm">{link.label}</Link>
              ))}
              <Link
                to={`/contact?service=${domain.id === 'vehicles' ? 'rto' : domain.id}`}
                className="btn btn-primary btn-sm tutor-domain-get-started"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

/* ─── Interactive Checklist with Smart Recommendations ─── */
function DocumentChecklist({ checked, setChecked }) {
  const [activeStage, setActiveStage] = useState(0)
  const navigate = useNavigate()

  const toggle = (stageName, itemName) => {
    const key = `${stageName}::${itemName}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems = checklistItems.reduce((sum, s) => sum + s.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const score = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  const getScoreMessage = () => {
    if (score === 100) return { text: 'You\'re fully documented! You\'re prepared for anything life throws at you.', color: '#138808' }
    if (score >= 70) return { text: 'Good progress! But some critical gaps remain. Don\'t wait for a crisis.', color: '#DAA520' }
    if (score >= 40) return { text: 'You\'re at risk. Several important documents are missing. Start fixing this today.', color: '#E87A5D' }
    return { text: 'Urgent attention needed! You\'re vulnerable without proper documentation.', color: '#8B0000' }
  }

  const scoreMsg = getScoreMessage()

  /* Smart Recommendations - find unchecked items */
  const getMissingServices = () => {
    const missing = []
    checklistItems.forEach(stage => {
      stage.items.forEach(item => {
        const key = `${stage.stage}::${item.name}`
        if (!checked[key] && item.critical) {
          missing.push(item)
        }
      })
    })
    return missing.slice(0, 6) // Show max 6 recommendations
  }

  const missingServices = getMissingServices()

  return (
    <section className="tutor-section-block" id="checklist">
      <div className="container">
        <SectionHeader
          label="Self Assessment"
          title="How Document-Ready"
          titleHighlight="Are You?"
          description="Check off the documents you already have. See your readiness score and identify the gaps before they become problems."
        />

        {/* Score Display */}
        <ScrollReveal>
          <div className="tutor-score-card">
            <div className="tutor-score-ring">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={scoreMsg.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${score * 2.64} 264`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                  style={{ fontSize: '1.5rem', fontWeight: 800, fill: scoreMsg.color, fontFamily: 'var(--font-heading)' }}>
                  {score}%
                </text>
              </svg>
            </div>
            <div className="tutor-score-text">
              <h3 style={{ color: scoreMsg.color }}>Document Readiness Score</h3>
              <p>{scoreMsg.text}</p>
              <p className="tutor-score-count">{checkedCount} of {totalItems} documents checked</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Stage Tabs */}
        <div className="tutor-stage-tabs">
          {checklistItems.map((stage, i) => (
            <button
              key={i}
              className={`tutor-stage-tab ${activeStage === i ? 'active' : ''}`}
              onClick={() => setActiveStage(i)}
            >
              {stage.stage}
            </button>
          ))}
        </div>

        {/* Checklist Grid */}
        <div className="tutor-checklist-grid">
          {checklistItems[activeStage].items.map((item, i) => {
            const key = `${checklistItems[activeStage].stage}::${item.name}`
            const isChecked = checked[key]
            return (
              <label key={i} className={`tutor-check-item ${isChecked ? 'checked' : ''} ${item.critical ? 'critical' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!isChecked}
                  onChange={() => toggle(checklistItems[activeStage].stage, item.name)}
                />
                <span className="tutor-check-box">{isChecked ? '✓' : ''}</span>
                <span className="tutor-check-label">
                  {item.name}
                  {item.critical && <span className="tutor-critical-badge">Essential</span>}
                </span>
              </label>
            )
          })}
        </div>

        {/* Smart Recommendation Panel */}
        {checkedCount > 0 && missingServices.length > 0 && (
          <ScrollReveal>
            <div className={`tutor-smart-cta ${score < 50 ? 'urgent' : score < 80 ? 'warning' : 'good'}`}>
              <div className="tutor-smart-cta-header">
                <span className="tutor-smart-cta-icon">
                  {score < 50 ? '🚨' : score < 80 ? '⚠️' : '💪'}
                </span>
                <div>
                  <h4>
                    {score < 50
                      ? 'Urgent — Get These Documents Now!'
                      : score < 80
                        ? 'Almost There — Complete Your Documents'
                        : 'Great Progress — Fix the Last Few!'}
                  </h4>
                  <p>Based on your gaps, here are the services you need:</p>
                </div>
              </div>
              <div className="tutor-smart-cta-services">
                {missingServices.map((item, i) => (
                  <Link
                    key={i}
                    to={`/contact?service=${item.service}&subService=${item.subService}`}
                    className="tutor-smart-service-chip"
                  >
                    {item.name} →
                  </Link>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                onClick={() => navigate('/contact')}
              >
                {score < 50 ? 'Get Emergency Help →' : score < 80 ? 'Complete Your Documents →' : 'Fix the Last Few →'}
              </button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

/* ─── Floating Sticky Action Bar ─── */
function FloatingActionBar() {
  const [visible, setVisible] = useState(false)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const pageHeight = document.body.scrollHeight
      const viewportHeight = window.innerHeight

      // Show after scrolling 400px
      if (scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
      }

      // Hide when near the bottom CTA section
      if (scrollY + viewportHeight > pageHeight - 300) {
        setHide(true)
      } else {
        setHide(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible || hide) return null

  return (
    <div className="floating-action-bar">
      <div className="floating-action-inner">
        <span className="floating-action-text">
          📋 Ready to get your documents sorted?
        </span>
        <Link to="/contact" className="btn btn-primary btn-sm floating-action-btn">
          Talk to a Local Buddy →
        </Link>
      </div>
    </div>
  )
}

/* ─── Main Tutor Page ─── */
export default function Tutor() {
  const [expanded, setExpanded] = useState(null)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    document.title = "Tutor | iN Empower — Why Your Documents Matter"
  }, [])

  const handleToggle = (id) => {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <>
      {/* ━━━ HERO ━━━ */}
      <PageHero
        label="Learn • Understand • Act"
        title="Why Your Documents"
        titleHighlight="Matter"
      >
        <p style={{ maxWidth: '800px', margin: '0 auto', textWrap: 'balance', lineHeight: 1.7 }}>
          <strong style={{ fontSize: '1.15em' }}>92% of Indians don't have all their documents in order.</strong><br />
          Missing or incomplete documents cause delays, financial losses, and denied opportunities every single day.
          This page will help you understand exactly why each document matters — and what's at risk without it.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <a href="#domains" className="btn btn-primary">Explore the 7 Life Domains ↓</a>
          <a href="#checklist" className="btn btn-outline">Check Your Readiness →</a>
        </div>
      </PageHero>

      {/* ━━━ 1. SHOCKING STATS — Create urgency immediately ━━━ */}
      <section className="tutor-section-block tutor-stats-section">
        <div className="container">
          <SectionHeader
            label="The Hard Truth"
            title="Numbers That Should"
            titleHighlight="Worry You"
            description="These aren't just statistics — they represent real people losing real opportunities every day."
          />

          <div className="tutor-stats-grid-v2">
            {shockingStats.map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 2. TRUST BAR — Quick credibility ━━━ */}
      <TrustBar />

      {/* ━━━ 3. QUICK ASSESSMENT — Interactive engagement ━━━ */}
      <QuickAssessmentWizard />

      {/* ━━━ 4. THE 7 LIFE DOMAINS — Core educational content ━━━ */}
      <section className="tutor-section-block tutor-section-alt" id="domains" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <SectionHeader
            label="The 7 Life Domains"
            title="Where Documents"
            titleHighlight="Change Everything"
            titleStyle={{ whiteSpace: 'nowrap' }}
            description="Every aspect of your life in India — from education to business to legal safety — depends on having the right documents. Tap any card to see the real impact."
          />

          <div className="tutor-domains-list">
            {domains.map((domain, i) => (
              <DomainCard
                key={domain.id}
                domain={domain}
                index={i}
                expanded={expanded}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 5. BEFORE VS AFTER — The iN Empower Difference ━━━ */}
      <BeforeAfterSection />

      {/* ━━━ 6. HOW WE HELP — Process Steps (NEW) ━━━ */}
      <ProcessSection />

      {/* ━━━ 7. SELF ASSESSMENT CHECKLIST ━━━ */}
      <DocumentChecklist checked={checked} setChecked={setChecked} />

      {/* ━━━ 8. FINAL CTA ━━━ */}
      <CTABanner
        title="Don't Wait for"
        titleHighlight="a Crisis"
        description="Every year, millions of Indians lose opportunities, money, and peace of mind because of missing documents. iN Empower's verified Local Buddies help you get every document in order — hassle-free."
        buttonText="Explore All Services →"
      />

      {/* ━━━ FLOATING ACTION BAR ━━━ */}
      <FloatingActionBar />
    </>
  )
}
