/**
 * Travel packages, vehicle rentals and flight routes — shared by the website and the mobile app (same business, same data).
 * Edit here only; the app copies it with `npm run sync-data`.
 */
export const tourPackages = [
  { id: 1, title: 'Srisailam Temple & Dam', tagline: 'Spiritual & Scenic', duration: '2 Days / 1 Night', price: '₹3,499', highlights: ['Srisailam Jyotirlinga Darshan', 'Srisailam Dam boating', 'Nallamala Forest drive', 'AC bus transport included'], image: '/images/tour_srisailam.webp' },
  { id: 2, title: 'Vizag Beach Getaway', tagline: 'Sun, Sand & Submarines', duration: '3 Days / 2 Nights', price: '₹5,999', highlights: ['RK Beach & Rushikonda', 'Submarine Museum & Kailasagiri', 'Araku Valley coffee plantations', 'Hotel + breakfast included'], image: '/images/tour_vizag.webp' },
  { id: 3, title: 'Tirupati Balaji Darshan', tagline: 'Divine Blessings', duration: '2 Days / 1 Night', price: '₹2,999', highlights: ['VIP Darshan arrangement', 'Tirumala Laddu prasadam', 'Sri Padmavathi Temple visit', 'AC transport from Ongole'], image: '/images/tour_tirupati.webp' },
  { id: 4, title: 'Goa Fun Escape', tagline: 'Beaches & Nightlife', duration: '4 Days / 3 Nights', price: '₹8,499', highlights: ['North & South Goa beaches', 'Water sports package', 'Night cruise & Dudhsagar Falls', 'Flight + hotel included'], image: '/images/tour_goa.webp' },
]

export const carCategories = [
  { id: 1, name: 'Hatchback', example: 'Swift, i10', hourly: '₹149', daily: '₹1,299', features: ['5 Seater', 'AC', 'Fuel included'] },
  { id: 2, name: 'Sedan', example: 'Dzire, Amaze', hourly: '₹199', daily: '₹1,799', features: ['5 Seater', 'AC', 'Fuel included'] },
  { id: 3, name: 'SUV', example: 'Creta, Seltos', hourly: '₹299', daily: '₹2,499', features: ['5-7 Seater', 'AC', 'Fuel included'] },
  { id: 4, name: 'Premium', example: 'Fortuner, Crysta', hourly: '₹499', daily: '₹4,999', features: ['7 Seater', 'AC', 'Chauffeur option'] },
]

export const bikeCategories = [
  { id: 1, name: 'Scooter', example: 'Activa, Jupiter', hourly: '₹49', daily: '₹399', features: ['Helmet included', 'Fuel extra'] },
  { id: 2, name: 'Standard Bike', example: 'Pulsar, FZ', hourly: '₹79', daily: '₹599', features: ['Helmet included', 'Fuel extra'] },
  { id: 3, name: 'Royal Enfield', example: 'Classic 350', hourly: '₹149', daily: '₹999', features: ['Helmet included', 'Saddle bags'] },
]

export const flightRoutes = [
  { from: 'Vijayawada', to: 'Hyderabad', price: '₹2,499', duration: '1h' },
  { from: 'Vijayawada', to: 'Bangalore', price: '₹3,299', duration: '1.5h' },
  { from: 'Vijayawada', to: 'Delhi', price: '₹4,999', duration: '2.5h' },
  { from: 'Vijayawada', to: 'Mumbai', price: '₹3,799', duration: '2h' },
]

