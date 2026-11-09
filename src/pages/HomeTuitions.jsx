import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import { educationLevels } from '../data/educationData'
import { useStrings } from '../context/LanguageContext'

const TEXT = {
  en: { label: 'Education', title: 'Home', hi: 'Tuitions', text: 'Find expert home tutors tailored for Primary, Secondary, Intermediate, and Graduation students.',
    view: 'View Subjects', back: 'Back to Education Levels', pick: 'Select a Subject', find: 'Find Tutor' },
  te: { label: 'విద్య', title: 'హోమ్', hi: 'ట్యూషన్లు', text: 'ప్రాథమిక, ఉన్నత పాఠశాల, ఇంటర్మీడియట్, డిగ్రీ విద్యార్థులకు తగిన నిపుణులైన హోమ్ ట్యూటర్లను కనుగొనండి.',
    view: 'సబ్జెక్టులు చూడండి', back: 'తరగతుల జాబితాకు తిరిగి', pick: 'సబ్జెక్ట్ ఎంచుకోండి', find: 'ట్యూటర్ కావాలి' },
}

// Data for Home Tuitions

export default function HomeTuitions() {
  const [selectedLevel, setSelectedLevel] = useState(null)
  const navigate = useNavigate()
  const { t } = useStrings(TEXT)

  const handleSubjectSelect = (levelName, subjectName) => {
    // Navigate to contact/GetStarted with service=education and subService as subject name
    const subServiceStr = encodeURIComponent(`Home Tuition - ${levelName} - ${subjectName}`)
    navigate(`/contact?service=home-tuition&subService=${subServiceStr}`)
  }

  return (
    <>
      <PageHero
        label={t('label')}
        title={t('title')}
        titleHighlight={t('hi')}
        description={t('text')}
      />
      <section className="section-compact" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {!selectedLevel ? (
            <div className="levels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {educationLevels.map(level => (
                <ScrollReveal key={level.id}>
                  <div className="glass-card" style={{ cursor: 'pointer', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => setSelectedLevel(level)}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                      {level.icon && level.icon.startsWith('/') ? (
                        <img loading="lazy" decoding="async" src={level.icon} alt={level.name} style={{ width: '4rem', height: '4rem', objectFit: 'contain' }} />
                      ) : (
                        level.icon
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{level.name}</h3>
                    <p style={{ marginTop: 'auto', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{level.description}</p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('view')}</button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <button className="btn" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: 'var(--surface)', color: 'var(--text)' }} onClick={() => setSelectedLevel(null)}>
                &larr; {t('back')}
              </button>
              
              <div className="glass-card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                    {selectedLevel.icon && selectedLevel.icon.startsWith('/') ? (
                      <img loading="lazy" decoding="async" src={selectedLevel.icon} alt={selectedLevel.name} style={{ width: '3rem', height: '3rem', objectFit: 'contain' }} />
                    ) : (
                      selectedLevel.icon
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{selectedLevel.name}</h2>
                  <p className="text-teal" style={{ fontWeight: 500 }}>{selectedLevel.description}</p>
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem', fontSize: '1.3rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
                  {t('pick')}
                </h3>
                
                <div className="subjects-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {selectedLevel.subjects.map((subject, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        padding: '1.2rem', 
                        backgroundColor: 'var(--bg)', 
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: '1.4', color: 'var(--accent-gold)' }}>{subject}</span>
                      <button 
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => handleSubjectSelect(selectedLevel.name, subject)}
                      >
                        {t('find')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </>
  )
}
