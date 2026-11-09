import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { quotes } from '../data/jobsData'
import { workshops } from '../data/workshopsData'
import { workshopFee, workshopSeatsInfo } from '../data/catalog'
import { api } from '../services/api'
import { readPhone } from '../data/phone'
import { inCurrentCity } from '../data/cities'

export default function YouthHub() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('jobs')
  const [activeQuoteId, setActiveQuoteId] = useState(3) // ID 3 is Library Assistant

  const [liveJobs, setLiveJobs] = useState([])

  // Jobs posted by local businesses and approved by the team appear first
  useEffect(() => {
    // Jobs in the customer's city (by the town in the job's place)
    api.listPublicJobs().then((rows) => setLiveJobs((rows || []).filter((j) => inCurrentCity(j.location)).map((j, i) => ({
      id: 1000 + i,
      key: j.id,
      icon: '💼',
      title: j.job_title,
      business: j.business_name,
      location: j.location,
      description: j.description || '',
      pay: j.pay_per_hour ?? '—',
    })))).catch(() => {})
  }, [])
  const allJobs = liveJobs

  // Workshops: seats already taken (for "x seats left" / "Full") and the sign-up form
  const [seats, setSeats] = useState({})
  const [registering, setRegistering] = useState(null)
  const loadSeats = () => api.workshopSeats?.().then((m) => setSeats(m || {})).catch(() => {})
  useEffect(() => { loadSeats() }, [])

  const [showFloatingQuote, setShowFloatingQuote] = useState(false)
  const [floatingQuote, setFloatingQuote] = useState(null)

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'workshops' || tabParam === 'jobs') {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  useEffect(() => {
    let timeoutId;
    let intervalId;

    const showNewQuote = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setFloatingQuote(randomQuote)
      setShowFloatingQuote(true)
    }

    // Show first quote after 3 seconds, then every 30 seconds
    timeoutId = setTimeout(() => {
      showNewQuote()
      intervalId = setInterval(showNewQuote, 30000)
    }, 3000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [])

  // Send the customer to the Contact form with their request pre-filled,
  // so applications / registrations are saved as enquiries.
  const openChat = (message, service = 'part-time', subService = '', jobId = '') => {
    const params = new URLSearchParams({ service, message })
    if (subService) params.set('subService', subService)
    // Links the application to its job (Admin → Part-time jobs → applicants)
    if (jobId) params.set('jobId', jobId)
    navigate(`/contact?${params.toString()}`)
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="page-hero" style={{ 
        background: 'linear-gradient(to right, #fdb15b, #ffffff, #4db151)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Top Pill Badge */}
          <p className="label">
            FOR THE YOUTH
          </p>

          {/* Main Heading */}
          <h1 style={{ color: '#0f172a' }}>
            Earn, Learn, and <span style={{color: '#0a2351'}}>Grow</span><br/>
            <span style={{color: '#166534'}}>Locally</span>
          </h1>
          
          {/* Subtitle */}
          <p style={{ color: '#475569', fontWeight: '500', maxWidth: '800px', margin: '0 auto' }}>
            Verified part-time opportunities tailored for Part-time. Work with trusted local businesses, earn a fair hourly wage, and build your resume.
          </p>
        </div>
      </section>

      <div className="container">

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 2rem 0', borderBottom: '1px solid #e2e8f0' }}>
          <button className={`gov-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>Part-Time Jobs</button>
          <button className={`gov-tab ${activeTab === 'workshops' ? 'active' : ''}`} onClick={() => setActiveTab('workshops')}>Workshops</button>
          <button className={`gov-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills</button>
        </div>

        {/* Content */}
        {activeTab === 'jobs' && (
          <div>

            {allJobs.length === 0 && (
              <div className="gov-card" style={{ padding: '2rem', textAlign: 'center', color: '#475569' }}>
                New part-time jobs from local businesses will be listed here soon. Own a business? <Link to="/post-job">Post a job</Link>.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {allJobs.map((job, idx) => {
                const jobQuote = quotes[idx % quotes.length];
                return (
                <ScrollReveal key={job.key || job.id} delay={Math.min(idx, 6) * 0.1}>
                  <div className="gov-card" style={{ position: 'relative' }}>
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ position: 'relative' }}>
                        <div 
                          style={{ width: '50px', height: '50px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', cursor: 'pointer' }}
                          onClick={() => setActiveQuoteId(activeQuoteId === job.id ? null : job.id)}
                        >
                          {job.icon}
                        </div>
                        {activeQuoteId === job.id && (
                          <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '12px',
                            background: 'white',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                            width: 'max-content',
                            maxWidth: '300px',
                            zIndex: 30,
                            border: '1px solid #f1f5f9'
                          }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveQuoteId(null); }}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.2rem',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%'
                              }}
                            >
                              &times;
                            </button>
                            <div style={{ fontStyle: 'italic', color: '#1e293b', fontSize: '1.05rem', marginBottom: '0.75rem', whiteSpace: 'normal', lineHeight: '1.4', paddingRight: '1rem' }}>
                              {jobQuote.text}
                            </div>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>
                              {jobQuote.author}
                            </div>
                            <div style={{
                              position: 'absolute',
                              bottom: '-6px',
                              left: '15px',
                              transform: 'rotate(45deg)',
                              width: '12px',
                              height: '12px',
                              background: 'white',
                              borderRight: '1px solid #f1f5f9',
                              borderBottom: '1px solid #f1f5f9'
                            }}></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#0f172a' }}>{job.title}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{job.business}</div>
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fcfcfc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Location:</span>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{job.location}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Hours:</span>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{job.hours}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.25rem', color: '#f97316', fontWeight: '800' }}>₹{job.pay}/hr</div>
                        <button 
                          style={{ padding: '0.5rem 1.25rem', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                          onClick={() => openChat(`I'm interested in applying for the ${job.title} position at ${job.business}.`, 'part-time', job.title, job.key ? String(job.key) : '')}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'workshops' && (
          <div style={{ marginBottom: '2rem' }}>

            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {workshops.length === 0 && <p style={{ color: '#475569' }}>New workshops are coming soon.</p>}
              {workshops.map((workshop) => {
                const seat = workshopSeatsInfo(workshop, seats[String(workshop.id)])
                return (
                <ScrollReveal key={workshop.id}>
                  <div className="job-card" style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    {workshop.photo && <img src={workshop.photo} alt={workshop.title} loading="lazy" style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }} />}
                    <div style={{ padding: '1.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '12px', 
                          background: '#f8fafc', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '1.5rem',
                          marginRight: '1rem',
                          border: '1px solid #e2e8f0'
                        }}>
                          {workshop.icon}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#0f172a' }}>{workshop.title}</h3>
                        </div>
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                        {workshop.description}
                      </p>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fcfcfc', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Location:</span>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{workshop.location}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Date:</span>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{workshop.date}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: seat.limited ? '0.5rem' : '1rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Fee:</span>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{workshopFee(workshop)}</span>
                      </div>
                      {seat.limited && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                          <span style={{ color: '#64748b' }}>Seats:</span>
                          <span style={{ fontWeight: '700', color: seat.full ? '#B91C1C' : '#0F6B06' }}>{seat.text}</span>
                        </div>
                      )}
                      <button 
                        style={{ 
                          width: '100%', 
                          padding: '0.75rem', 
                          background: 'white', 
                          color: '#0ea5e9', 
                          border: '2px solid #0ea5e9', 
                          borderRadius: '8px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        disabled={seat.full}
                        onMouseOver={(e) => { if (seat.full) return; e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { if (seat.full) return; e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0ea5e9'; }}
                        onClick={() => !seat.full && setRegistering(workshop)}
                      >
                        {seat.full ? 'Full' : 'Register'}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
           <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.5rem', color: '#1e293b' }}>Skill Development Paths</h3>
            <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
              Long-term structured paths to build your career in high-demand fields.
            </p>
            <button style={{ padding: '0.75rem 2rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => openChat('I want to start a skill development path.', 'workshop', 'Skill Development Path')}>View Skill Paths</button>
          </div>
        )}
      </div>

      {/* Floating Quote Popup */}
      {showFloatingQuote && floatingQuote && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          width: 'max-content',
          maxWidth: '350px',
          zIndex: 50,
          border: '1px solid #f1f5f9',
          transition: 'all 0.3s ease-in-out'
        }}>
          <button 
            onClick={() => setShowFloatingQuote(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%'
            }}
          >
            &times;
          </button>
          <div style={{ fontStyle: 'italic', color: '#1e293b', fontSize: '1.1rem', marginBottom: '1rem', whiteSpace: 'normal', lineHeight: '1.5', paddingRight: '1rem' }}>
            {floatingQuote.text}
          </div>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
            {floatingQuote.author}
          </div>
        </div>
      )}
      {registering && <WorkshopSignup workshop={registering} onClose={() => setRegistering(null)} onDone={() => { setRegistering(null); loadSeats() }} />}
    </div>
  )
}



/** Workshop sign-up: saved as an enquiry the team sees under Workshops in the admin portal */
function WorkshopSignup({ workshop, onClose, onDone }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    api.getCurrentUser?.().then((u) => { if (u) { setName((n) => n || u.name || ''); setPhone((p) => p || u.phone || '') } }).catch(() => {})
  }, [])
  const submit = async (e) => {
    e.preventDefault()
    const p = readPhone(phone)
    if (!name.trim() || !p.ok) { setMsg('Please enter your name and a valid mobile number.'); return }
    const digits = p.value
    setBusy(true); setMsg('')
    try {
      await api.submitContactForm({
        name: name.trim(), phone: digits, service: 'workshop', subService: workshop.title, item: workshop.title,
        details: { kind: 'workshop', workshopId: String(workshop.id) },
        message: `I want to register for the ${workshop.title} workshop.`,
      })
      setDone(true)
    } catch (err) {
      setMsg(err.message || 'Could not register. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  const box = { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }
  const card = { background: '#fff', borderRadius: 16, padding: '1.5rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }
  const input = { width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box' }
  return (
    <div style={box} onClick={onClose} role="dialog" aria-modal="true" aria-label={`Register for ${workshop.title}`}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        {done ? (
          <>
            <h3 style={{ marginTop: 0 }}>You're registered 🎉</h3>
            <p style={{ color: '#475569' }}>We'll call you with the details for <strong>{workshop.title}</strong>.</p>
            <button className="btn btn-primary" onClick={onDone}>OK</button>
          </>
        ) : (
          <form onSubmit={submit}>
            <h3 style={{ margin: '0 0 0.25rem' }}>Register: {workshop.title}</h3>
            <p style={{ color: '#475569', margin: '0 0 1rem', fontSize: '0.9rem' }}>{[workshop.date, workshop.location, workshopFee(workshop)].filter(Boolean).join(' · ')}</p>
            <input style={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <input style={input} placeholder="Mobile number" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            {msg && <p style={{ color: '#B91C1C', margin: '0 0 0.75rem', fontSize: '0.9rem' }}>{msg}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Registering…' : 'Confirm'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
