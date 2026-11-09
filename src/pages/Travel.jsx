import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Clock, CheckCircle, Car, Bike, Plane, Wind, Users, Briefcase, IndianRupee } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import { tourPackages, carCategories, bikeCategories, flightRoutes } from '../data/travelData'





export default function Travel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('tours')
  const [rentalType, setRentalType] = useState('cars')

  // Send the customer to the Contact form with their request pre-filled,
  // so it is saved as an enquiry (the old chat trigger used a flow that didn't exist).
  const openChat = (message) => {
    const params = new URLSearchParams({ service: 'travel', message })
    navigate(`/contact?${params.toString()}`)
  }

  return (
    <div className="kalamkari-page-theme" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Immersive Hero Section */}
      <section className="travel-hero-section" style={{ backgroundImage: 'linear-gradient(rgba(15, 43, 74, 0.3), rgba(15, 43, 74, 0.1)), url("/images/travel_hero_kalamkari.webp")' }}>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '4rem 2rem', marginTop: '-4rem' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '300', letterSpacing: '3px', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)', fontFamily: 'serif', color: '#ffffff', margin: '0 0 1rem 0' }}>EXPLORE INDIA</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: '400', letterSpacing: '1px', textShadow: '0 2px 8px rgba(0,0,0,0.8)', color: '#ffffff', opacity: 0.95, margin: 0 }}>Unforgettable journeys begin here.</p>
        </div>

        {/* Floating Booking Widget */}
        <div className="floating-booking-widget" style={{ transform: 'translateY(50%)', bottom: 0, width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div className="travel-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <button className={`filter-tab ${activeTab === 'tours' ? 'active' : ''}`} onClick={() => setActiveTab('tours')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><MapPin size={18} /> Curated Tours</button>
              <button className={`filter-tab ${activeTab === 'rentals' ? 'active' : ''}`} onClick={() => setActiveTab('rentals')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><Car size={18} /> Vehicle Rentals</button>
              <button className={`filter-tab ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => setActiveTab('flights')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><Plane size={18} /> Flight Booking</button>
            </div>

            {activeTab === 'tours' && (
               <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}><MapPin size={14}/> Destination</label>
                    <select aria-label="Destination" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}>
                      <option>All Destinations</option>
                      <option>Goa</option>
                      <option>Kerala</option>
                      <option>Tirupati</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}><Clock size={14}/> Duration</label>
                    <select aria-label="Duration" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }}>
                      <option>Any Duration</option>
                      <option>1-3 Days</option>
                      <option>4-7 Days</option>
                    </select>
                  </div>
                  <button className="premium-bg-blue" style={{ padding: '0.875rem 2.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', height: '52px', fontSize: '1rem', boxShadow: '0 4px 12px rgba(15, 43, 74, 0.2)' }} onClick={() => openChat('Show me tour packages.')}>
                    Search Tours
                  </button>
               </div>
            )}

            {activeTab === 'rentals' && (
               <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}><Car size={14}/> Vehicle Type</label>
                    <select aria-label="Vehicle Type" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} onChange={(e) => setRentalType(e.target.value)} value={rentalType}>
                      <option value="cars">Cars</option>
                      <option value="bikes">Bikes</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}><Calendar size={14}/> Pickup Date</label>
                    <input type="date" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                  </div>
                  <button className="premium-bg-blue" style={{ padding: '0.875rem 2.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', height: '52px', fontSize: '1rem', boxShadow: '0 4px 12px rgba(15, 43, 74, 0.2)' }} onClick={() => openChat(`I want to rent a ${rentalType}.`)}>
                    Find Vehicles
                  </button>
               </div>
            )}

            {activeTab === 'flights' && (
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}><Plane size={14} style={{ transform: 'rotate(-45deg)' }}/> From</label>
                    <input type="text" placeholder="Departure City" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}><MapPin size={14}/> To</label>
                    <input type="text" placeholder="Arrival City" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                  </div>
                  <button className="premium-bg-blue" style={{ padding: '0.875rem 2.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', height: '52px', fontSize: '1rem', boxShadow: '0 4px 12px rgba(15, 43, 74, 0.2)' }} onClick={() => openChat('I want to book a flight.')}>
                    Search Flights
                  </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '12rem', padding: '0 1rem' }}>
        {activeTab === 'tours' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Curated Experiences</div>
              <h2 style={{ fontSize: '3rem', color: 'var(--primary-blue)', fontFamily: 'serif', fontWeight: 'normal', margin: 0 }}>Discover India's Soul</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>Handpicked destinations featuring our exclusive Kalamkari aesthetic interpretations.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
              {tourPackages.map((pkg, idx) => (
                <ScrollReveal key={pkg.id} delay={idx * 0.1}>
                  <div className="premium-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                    <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <img loading="lazy" decoding="async" src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15, 43, 74, 0.9)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>{pkg.price}</div>
                    </div>
                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                       <p style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', margin: '0 0 0.5rem 0', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>{pkg.tagline}</p>
                       <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.75rem', fontFamily: 'serif', color: 'var(--primary-blue)', fontWeight: 'normal' }}>{pkg.title}</h3>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                          <Clock size={16} /> <span>{pkg.duration}</span>
                       </div>

                       <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                         {pkg.highlights.map((h, i) => (
                           <li key={i} style={{ padding: '0.4rem 0', fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                             <CheckCircle size={18} color="var(--accent-teal)" style={{ marginTop: '2px', flexShrink: 0 }} /> <span>{h}</span>
                           </li>
                         ))}
                       </ul>

                       <button 
                         className="premium-bg-blue"
                         style={{ width: '100%', padding: '1rem', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem' }}
                         onClick={() => openChat(`I'm interested in the ${pkg.title} tour package.`)}
                       >
                         Book Experience
                       </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rentals' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Premium Fleet</div>
              <h2 style={{ fontSize: '3rem', color: 'var(--primary-blue)', fontFamily: 'serif', fontWeight: 'normal', margin: 0 }}>Drive in Comfort</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>Well-maintained vehicles for a hassle-free journey across the state.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
              {(rentalType === 'cars' ? carCategories : bikeCategories).map((vehicle, idx) => (
                <ScrollReveal key={vehicle.id} delay={idx * 0.1}>
                  <div className="premium-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', width: '100px', borderRadius: '50%', background: '#f8fafc', margin: '0 auto 1.5rem', border: '1px solid #e2e8f0' }}>
                      {rentalType === 'cars' ? <Car size={40} className="text-accent" /> : <Bike size={40} className="text-accent" />}
                    </div>
                    
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: 'var(--primary-blue)', fontFamily: 'serif' }}>{vehicle.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>e.g. {vehicle.example}</p>
                    </div>
                    
                    <div style={{ display: 'flex', background: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 1, borderRight: '1px solid #cbd5e1', textAlign: 'center', paddingRight: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: '600' }}>Hourly</div>
                        <div style={{ fontSize: '1.5rem', color: 'var(--primary-blue)', fontWeight: 'bold' }}>{vehicle.hourly}</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', paddingLeft: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: '600' }}>Daily</div>
                        <div style={{ fontSize: '1.5rem', color: 'var(--primary-blue)', fontWeight: 'bold' }}>{vehicle.daily}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', flex: 1, alignContent: 'flex-start' }}>
                      {vehicle.features.map((f, i) => (
                        <span key={i} style={{ fontSize: '0.85rem', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)', padding: '0.4rem 1rem', borderRadius: '2rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                           <CheckCircle size={14} /> {f}
                        </span>
                      ))}
                    </div>

                    <button 
                      className="btn btn-outline"
                      style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}
                      onClick={() => openChat(`I want to rent a ${vehicle.name} (${vehicle.example}).`)}
                    >
                      Book Vehicle
                    </button>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'flights' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent-gold)', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Flight Booking</div>
              <h2 style={{ fontSize: '3rem', color: 'var(--primary-blue)', fontFamily: 'serif', fontWeight: 'normal', margin: 0 }}>Popular Routes</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '1rem auto 0' }}>Fly direct from regional airports with competitive pricing.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
              {flightRoutes.map((route, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="premium-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', opacity: 0.05, transform: 'rotate(-45deg)' }}>
                      <Plane size={150} />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: '600' }}>Depart</div>
                        <div style={{ fontSize: '1.75rem', color: 'var(--primary-blue)', fontWeight: 'bold', fontFamily: 'serif' }}>{route.from}</div>
                      </div>
                      
                      <div style={{ flex: 1, padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', background: '#f8fafc', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{route.duration}</div>
                         <div style={{ width: '100%', borderBottom: '2px dashed #cbd5e1', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                           <Plane size={20} color="var(--accent-teal)" style={{ position: 'absolute', top: -10, background: 'white', padding: '0 4px' }} />
                         </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: '600' }}>Arrive</div>
                        <div style={{ fontSize: '1.75rem', color: 'var(--primary-blue)', fontWeight: 'bold', fontFamily: 'serif' }}>{route.to}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', position: 'relative', zIndex: 1 }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Starting from</div>
                        <div style={{ fontSize: '2rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{route.price}</div>
                      </div>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.75rem 2rem', borderRadius: '2rem', fontWeight: 'bold' }} 
                        onClick={() => openChat(`I want to book a flight from ${route.from} to ${route.to}.`)}
                      >
                        Select Flight
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
