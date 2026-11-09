import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHero from '../components/PageHero'
import ScrollReveal from '../components/ScrollReveal'
import { colleges } from '../data/educationData'
import { useStrings } from '../context/LanguageContext'

const TEXT = {
  en: { label: 'Education', title: 'College', hi: 'Admissions', text: 'Choose a college and course to get started with your admission process.',
    view: 'View Details & Courses', back: 'Back to Colleges', campus: 'Campus Overview', courses: 'Courses Offered', apply: 'Apply Now' },
  te: { label: 'విద్య', title: 'కాలేజీ', hi: 'అడ్మిషన్లు', text: 'కాలేజీ, కోర్సు ఎంచుకుని మీ అడ్మిషన్ ప్రక్రియ ప్రారంభించండి.',
    view: 'వివరాలు & కోర్సులు చూడండి', back: 'కాలేజీల జాబితాకు తిరిగి', campus: 'క్యాంపస్ దృశ్యాలు', courses: 'అందుబాటులో ఉన్న కోర్సులు', apply: 'ఇప్పుడే దరఖాస్తు చేయండి' },
}

// Mock data for colleges

export default function CollegeAdmissions() {
  const [selectedCollege, setSelectedCollege] = useState(null)
  const navigate = useNavigate()
  const { t } = useStrings(TEXT)

  const handleCourseSelect = (collegeId, courseName) => {
    // Navigate to contact/GetStarted with service=education and subService as course name
    const subServiceStr = encodeURIComponent(courseName.toLowerCase().replace(/[\s\/&()]+/g, '-'))
    navigate(`/contact?service=education&subService=${subServiceStr}`)
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
          {!selectedCollege ? (
            <div className="colleges-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {colleges.map(college => (
                <ScrollReveal key={college.id}>
                  <div className="glass-card" style={{ cursor: 'pointer', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => setSelectedCollege(college)}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{college.logo}</div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{college.name}</h3>
                    <p className="text-teal" style={{ fontWeight: 600, marginBottom: '1rem' }}>{college.location}</p>
                    <p style={{ marginTop: 'auto', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{college.description}</p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('view')}</button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <button className="btn" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: 'var(--surface)', color: 'var(--text)' }} onClick={() => setSelectedCollege(null)}>
                &larr; {t('back')}
              </button>
              
              <div className="glass-card">
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{selectedCollege.name}</h2>
                <p className="text-teal" style={{ fontWeight: 600, marginBottom: '2rem' }}>{selectedCollege.location}</p>
                
                {/* Images Gallery */}
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{t('campus')}</h3>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '3rem' }}>
                   {selectedCollege.images.map((img, i) => (
                     <div key={i} style={{ minWidth: '280px', height: '180px', borderRadius: 'var(--radius)', overflow: 'hidden', flexShrink: 0 }}>
                       <img loading="lazy" decoding="async" src={img} alt={`Campus ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                   ))}
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
                  {t('courses')}
                </h3>
                
                <div className="courses-list" style={{ display: 'grid', gap: '3rem' }}>
                  {selectedCollege.courses.map((courseGrp, idx) => (
                    <div key={idx}>
                      <h4 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)', fontSize: '1.2rem' }}>
                        {courseGrp.category}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {courseGrp.programs.map((prog, pIdx) => (
                          <div 
                            key={pIdx} 
                            style={{ 
                              padding: '1.2rem', 
                              backgroundColor: 'var(--bg)', 
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '1rem'
                            }}
                          >
                            <span style={{ fontSize: '1rem', fontWeight: 500, lineHeight: '1.4' }}>{prog}</span>
                            <button 
                              className="btn btn-primary btn-sm"
                              style={{ width: '100%', justifyContent: 'center' }}
                              onClick={() => handleCourseSelect(selectedCollege.id, prog)}
                            >
                              {t('apply')}
                            </button>
                          </div>
                        ))}
                      </div>
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
