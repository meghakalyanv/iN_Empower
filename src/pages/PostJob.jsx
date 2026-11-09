import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useStrings } from '../context/LanguageContext'
import { celebrate } from '../utils/celebrate'

const TEXT = {
  en: {
    submitted: 'Job submitted! We will review it before it goes live.', title: 'Post a Youth Job', sub: 'Reach verified, energetic local talent. Fill out the details below.',
    job: 'Job Title', jobHint: 'e.g. Cafe Barista', biz: 'Business Name', bizHint: 'Your Local Business', loc: 'Location (Area)', locHint: 'e.g. MG Road',
    pay: 'Hourly Pay (₹)', desc: 'Brief Description', descHint: 'What will the candidate be doing?', posting: 'Posting...', submit: 'Submit Job Offer',
    done: 'Job Submitted!', doneText: 'Thank you! Our team will quickly review your job and publish it for the local Part-time community. You can track it on your dashboard.',
    dash: 'Go to Dashboard', board: 'Return to Jobs Board',
  },
  te: {
    submitted: 'ఉద్యోగం పంపబడింది! ప్రచురించే ముందు మేము పరిశీలిస్తాము.', title: 'యువతకు ఉద్యోగం పోస్ట్ చేయండి', sub: 'ధృవీకరించిన, ఉత్సాహవంతులైన స్థానిక యువతను చేరుకోండి. కింది వివరాలు నింపండి.',
    job: 'ఉద్యోగం పేరు', jobHint: 'ఉదా. కేఫ్ సహాయకుడు', biz: 'వ్యాపారం పేరు', bizHint: 'మీ స్థానిక వ్యాపారం', loc: 'ప్రాంతం', locHint: 'ఉదా. MG రోడ్',
    pay: 'గంటకు జీతం (₹)', desc: 'చిన్న వివరణ', descHint: 'అభ్యర్థి ఏ పని చేయాలి?', posting: 'పోస్ట్ చేస్తోంది...', submit: 'ఉద్యోగ ప్రకటన పంపండి',
    done: 'ఉద్యోగం పంపబడింది!', doneText: 'ధన్యవాదాలు! మా బృందం త్వరగా పరిశీలించి స్థానిక పార్ట్-టైమ్ ఉద్యోగాల జాబితాలో ప్రచురిస్తుంది. మీ డాష్‌బోర్డ్‌లో చూడవచ్చు.',
    dash: 'డాష్‌బోర్డ్‌కు వెళ్ళండి', board: 'ఉద్యోగాల జాబితాకు తిరిగి',
  },
}

export default function PostJob() {
  const [formData, setFormData] = useState({
    jobTitle: '', businessName: '', location: '', pay: '', desc: ''
  })
  const [success, setSuccess] = useState(false)
  const [posting, setPosting] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { t } = useStrings(TEXT)

  // Auth check
  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (!u) navigate('/login?redirect=/post-job', { replace: true })
    })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (posting) return
    setPosting(true)
    try {
      await api.postJob(formData)
      setSuccess(true)
      celebrate()
      addToast(t('submitted'))
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FF9933 0%, var(--bg-primary) 50%, #138808 100%)',
      padding: '6rem 2rem 2rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '600px', width: '100%', padding: '3rem',
        background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(255,255,255,0.5)'
      }}>
        {!success ? (
          <div>
            <div className="card-icon" style={{ margin: '0 auto 1.5rem', background: '#E5E5F2', color: '#000080' }}>💼</div>
            <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>{t('title')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center' }}>
              {t('sub')}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="jobTitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('job')}</label>
                <input type="text" id="jobTitle" placeholder={t('jobHint')} required
                  value={formData.jobTitle} onChange={e => setFormData(p => ({ ...p, jobTitle: e.target.value }))}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '1rem', background: 'var(--bg-primary)', outline: 'none' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="businessName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('biz')}</label>
                <input type="text" id="businessName" placeholder={t('bizHint')} required
                  value={formData.businessName} onChange={e => setFormData(p => ({ ...p, businessName: e.target.value }))}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '1rem', background: 'var(--bg-primary)', outline: 'none' }}
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('loc')}</label>
                  <input type="text" id="location" placeholder={t('locHint')} required
                    value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '1rem', background: 'var(--bg-primary)', outline: 'none' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pay" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('pay')}</label>
                  <input type="number" id="pay" placeholder="150" required
                    value={formData.pay} onChange={e => setFormData(p => ({ ...p, pay: e.target.value }))}
                    style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '1rem', background: 'var(--bg-primary)', outline: 'none' }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="desc" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('desc')}</label>
                <textarea id="desc" rows="3" placeholder={t('descHint')} required
                  value={formData.desc} onChange={e => setFormData(p => ({ ...p, desc: e.target.value }))}
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)', fontSize: '1rem', background: 'var(--bg-primary)', outline: 'none', resize: 'vertical' }}
                />
              </div>
              <button type="submit" disabled={posting} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                {posting ? t('posting') : t('submit')}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeIn 0.5s ease' }}>
            <div className="card-icon" style={{ margin: '0 auto 1.5rem', background: '#138808', color: 'white', border: 'none' }}>✓</div>
            <h2 style={{ marginBottom: '0.5rem' }}>{t('done')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('doneText')}</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('dash')}</Link>
            <Link to="/youth-hub?tab=jobs" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>{t('board')}</Link>
          </div>
        )}
      </div>
    </div>
  )
}
