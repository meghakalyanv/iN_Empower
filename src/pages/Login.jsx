import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useStrings } from '../context/LanguageContext'
import { readPhone } from '../data/phone'

const TEXT = {
  en: {
    codeSent: 'We sent a 6-digit code to your email.', welcomeBack: 'Welcome back! 🙏', badMobile: 'Please enter a valid mobile number (from abroad: start with + and the country code)',
    created: 'Account created successfully! Welcome to iN Empower 🙏', resent: 'A new code is on its way.',
    hello: 'Cheers! 🙏', signInSub: 'Sign in to access your dashboard', email: 'Email Address', create: 'Create account',
    sending: 'Sending...', next: 'Next →', verify: "Verify It's You",
    weEmailed: 'We emailed', codeHelp: 'Enter the 6-digit code from the email — or, if the email has a', signInLink: 'sign-in link', justTap: ', just tap it.',
    code: 'Security Code', codeHint: 'Enter 6-digit code', resend: "Didn't get it? Resend code", back: '← Back', verifying: 'Verifying...', signIn: 'Sign In',
    createTitle: 'Create Your Account', nameSub: 'Tell us your name', first: 'First Name *', firstHint: 'Enter your first name',
    last: 'Last Name', optional: '(optional)', lastHint: 'Enter your last name', signInInstead: 'Sign in instead',
    about: 'About You', aboutSub: 'Your birthday and gender', dob: 'Date of Birth *', gender: 'Gender *', pickGender: 'Select gender',
    female: 'Female', male: 'Male', noSay: 'Rather not say', custom: 'Custom',
    contact: 'Your Contact Details', contactSub: "You'll sign in with your email. We'll call you on your mobile about your requests.",
    emailReq: 'Email Address *', mobile: 'Mobile Number *', almost: 'Almost There!', creating: 'Creating...', createBtn: 'Create Account',
  },
  te: {
    codeSent: 'మీ ఇమెయిల్‌కు 6 అంకెల కోడ్ పంపాము.', welcomeBack: 'మళ్ళీ స్వాగతం! 🙏', badMobile: 'దయచేసి సరైన మొబైల్ నంబర్ ఇవ్వండి (విదేశాల నుంచి: + మరియు దేశ కోడ్‌తో)',
    created: 'ఖాతా సృష్టించబడింది! iN Empower కు స్వాగతం 🙏', resent: 'కొత్త కోడ్ పంపుతున్నాము.',
    hello: 'నమస్కారం! 🙏', signInSub: 'మీ డాష్‌బోర్డ్ చూడటానికి సైన్ ఇన్ చేయండి', email: 'ఇమెయిల్ చిరునామా', create: 'కొత్త ఖాతా',
    sending: 'పంపుతోంది...', next: 'తరువాత →', verify: 'మీరేనని నిర్ధారించండి',
    weEmailed: 'మేము ఇమెయిల్ పంపాము:', codeHelp: 'ఇమెయిల్‌లోని 6 అంకెల కోడ్ ఇక్కడ ఇవ్వండి — లేదా ఇమెయిల్‌లో', signInLink: 'సైన్-ఇన్ లింక్', justTap: ' ఉంటే దాన్ని నొక్కండి.',
    code: 'సెక్యూరిటీ కోడ్', codeHint: '6 అంకెల కోడ్ ఇవ్వండి', resend: 'కోడ్ రాలేదా? మళ్ళీ పంపండి', back: '← వెనుకకు', verifying: 'తనిఖీ చేస్తోంది...', signIn: 'సైన్ ఇన్',
    createTitle: 'మీ ఖాతా సృష్టించండి', nameSub: 'మీ పేరు చెప్పండి', first: 'మొదటి పేరు *', firstHint: 'మీ మొదటి పేరు',
    last: 'ఇంటి పేరు', optional: '(ఐచ్ఛికం)', lastHint: 'మీ ఇంటి పేరు', signInInstead: 'బదులుగా సైన్ ఇన్ చేయండి',
    about: 'మీ గురించి', aboutSub: 'మీ పుట్టిన తేదీ మరియు లింగం', dob: 'పుట్టిన తేదీ *', gender: 'లింగం *', pickGender: 'లింగం ఎంచుకోండి',
    female: 'స్త్రీ', male: 'పురుషుడు', noSay: 'చెప్పకూడదనుకుంటున్నాను', custom: 'ఇతర',
    contact: 'మీ సంప్రదింపు వివరాలు', contactSub: 'మీరు ఇమెయిల్‌తో సైన్ ఇన్ చేస్తారు. మీ అభ్యర్థనల గురించి మీ మొబైల్‌కు ఫోన్ చేస్తాము.',
    emailReq: 'ఇమెయిల్ చిరునామా *', mobile: 'మొబైల్ నంబర్ *', almost: 'దాదాపు పూర్తయింది!', creating: 'సృష్టిస్తోంది...', createBtn: 'ఖాతా సృష్టించండి',
  },
}

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  
  // Login State
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [authCode, setAuthCode] = useState('')
  
  // Signup State
  const [signupStep, setSignupStep] = useState(1)
  const [signupData, setSignupData] = useState({
    firstName: '', lastName: '', dob: '', gender: '', email: '', phone: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { t } = useStrings(TEXT)

  // Scroll effect on navbar
  useEffect(() => {
    const navbar = document.querySelector('.navbar')
    if (navbar) navbar.classList.add('scrolled')
  }, [])

  // Only ever send people to a page on this website after sign-in
  const safeRedirect = () => {
    const redirect = searchParams.get('redirect')
    return redirect && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.startsWith('/\\') ? redirect : '/dashboard'
  }

  // Already signed in? Go straight to the dashboard.
  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u) navigate(safeRedirect(), { replace: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, searchParams])

  const goAfterLogin = () => navigate(safeRedirect())

  const handleStep1 = async (e) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    try {
      await api.requestAuthCode(email, { createUser: false })
      setStep(2)
      addToast(t('codeSent'))
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStep2 = async (e) => {
    e.preventDefault()
    if (!authCode) return
    setIsSubmitting(true)
    try {
      await api.verifyAuthCode(email, authCode)
      addToast(t('welcomeBack'))
      goAfterLogin()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- SIGNUP HANDLERS ---
  const handleSignupStep1 = (e) => {
    e.preventDefault()
    if (!signupData.firstName) return
    setSignupStep(2)
  }

  const handleSignupStep2 = (e) => {
    e.preventDefault()
    if (!signupData.dob || !signupData.gender) return
    setSignupStep(3)
  }

  const handleSignupStep3 = async (e) => {
    e.preventDefault()
    if (!signupData.email) return
    // Indian mobile, or a number from abroad with + and the country code (NRIs)
    if (!readPhone(signupData.phone).ok) {
      addToast(t('badMobile'), 'error')
      return
    }
    setIsSubmitting(true)
    try {
      await api.requestAuthCode(signupData.email, { createUser: true, profile: signupData })
      setSignupStep(4)
      addToast(t('codeSent'))
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignupStep4 = async (e) => {
    e.preventDefault()
    if (!authCode) return
    setIsSubmitting(true)
    try {
      await api.verifyAuthCode(signupData.email, authCode)
      addToast(t('created'))
      goAfterLogin()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendCode = async (targetEmail, isSignup) => {
    try {
      await api.requestAuthCode(targetEmail, isSignup ? { createUser: true, profile: signupData } : { createUser: false })
      addToast(t('resent'))
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '1rem',
    background: 'var(--bg-primary)', transition: 'all var(--transition-fast)', outline: 'none'
  }

  // Step indicator for signup
  const StepIndicator = ({ current, total }) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i + 1 === current ? '2rem' : '0.5rem',
          height: '0.5rem',
          borderRadius: 'var(--radius-full)',
          background: i + 1 <= current 
            ? 'linear-gradient(90deg, #FF9933, #138808)' 
            : 'var(--border)',
          transition: 'all 0.3s ease'
        }} />
      ))}
    </div>
  )

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        
        {/* iN Empower branding */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            <span style={{ color: '#FF9933' }}>iN</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>Empower</span>
          </span>
        </div>

        {/* ===================== LOGIN MODE ===================== */}
        {mode === 'login' && step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{t('hello')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('signInSub')}</p>
            <form onSubmit={handleStep1}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label htmlFor="loginEmail" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('email')}</label>
                <input type="email" id="loginEmail" placeholder="name@example.com" required
                  value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0' }} onClick={() => { setMode('signup'); setSignupStep(1) }}>
                  {t('create')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('sending') : t('next')}
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'login' && step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{t('verify')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {t('weEmailed')} <strong>{email}</strong>. {t('codeHelp')} <strong>{t('signInLink')}</strong>{t('justTap')}
            </p>
            <form onSubmit={handleStep2}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label htmlFor="authCode" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('code')}</label>
                <input type="text" id="authCode" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder={t('codeHint')} required
                  value={authCode} onChange={e => setAuthCode(e.target.value.replace(/\D/g, ''))} disabled={isSubmitting}
                  style={inputStyle}
                />
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0', fontSize: '0.85rem' }} onClick={() => resendCode(email, false)}>
                  {t('resend')}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0' }} onClick={() => { setStep(1); setAuthCode('') }}>
                  {t('back')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('verifying') : t('signIn')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================== SIGNUP MODE ===================== */}
        {mode === 'signup' && signupStep === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <StepIndicator current={1} total={4} />
            <h2 style={{ marginBottom: '0.5rem' }}>{t('createTitle')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('nameSub')}</p>
            <form onSubmit={handleSignupStep1}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('first')}</label>
                <input type="text" required value={signupData.firstName} onChange={e => setSignupData({...signupData, firstName: e.target.value})} style={inputStyle} placeholder={t('firstHint')} />
              </div>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('last')} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{t('optional')}</span></label>
                <input type="text" value={signupData.lastName} onChange={e => setSignupData({...signupData, lastName: e.target.value})} style={inputStyle} placeholder={t('lastHint')} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0' }} onClick={() => { setMode('login'); setStep(1) }}>
                  {t('signInInstead')}
                </button>
                <button type="submit" className="btn btn-primary">{t('next')}</button>
              </div>
            </form>
          </div>
        )}

        {mode === 'signup' && signupStep === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <StepIndicator current={2} total={4} />
            <h2 style={{ marginBottom: '0.5rem' }}>{t('about')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('aboutSub')}</p>
            <form onSubmit={handleSignupStep2}>
              <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('dob')}</label>
                <input type="date" required value={signupData.dob} onChange={e => setSignupData({...signupData, dob: e.target.value})} style={inputStyle} />
              </div>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('gender')}</label>
                <select required value={signupData.gender} onChange={e => setSignupData({...signupData, gender: e.target.value})} style={inputStyle}>
                  <option value="" disabled>{t('pickGender')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="male">{t('male')}</option>
                  <option value="other">{t('noSay')}</option>
                  <option value="custom">{t('custom')}</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0' }} onClick={() => setSignupStep(1)}>
                  {t('back')}
                </button>
                <button type="submit" className="btn btn-primary">{t('next')}</button>
              </div>
            </form>
          </div>
        )}

        {mode === 'signup' && signupStep === 3 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <StepIndicator current={3} total={4} />
            <h2 style={{ marginBottom: '0.5rem' }}>{t('contact')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('contactSub')}</p>
            <form onSubmit={handleSignupStep3}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('emailReq')}</label>
                <input type="email" placeholder="name@example.com" required value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div className="form-group" style={{ textAlign: 'left', marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('mobile')}</label>
                <input type="tel" inputMode="tel" placeholder="98765 43210" required value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} disabled={isSubmitting} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0' }} onClick={() => setSignupStep(2)}>
                  {t('back')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('sending') : t('next')}
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'signup' && signupStep === 4 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <StepIndicator current={4} total={4} />
            <h2 style={{ marginBottom: '0.5rem' }}>{t('almost')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('weEmailed')} <strong>{signupData.email}</strong>. {t('codeHelp')} <strong>{t('signInLink')}</strong>{t('justTap')}</p>
            <form onSubmit={handleSignupStep4}>
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>{t('code')}</label>
                <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder={t('codeHint')} required value={authCode} onChange={e => setAuthCode(e.target.value.replace(/\D/g, ''))} disabled={isSubmitting} style={inputStyle} />
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0', fontSize: '0.85rem' }} onClick={() => resendCode(signupData.email, true)}>
                  {t('resend')}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" style={{ color: 'var(--accent-blue)', padding: '0.5rem 0' }} onClick={() => { setSignupStep(3); setAuthCode('') }}>
                  {t('back')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('creating') : t('createBtn')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
