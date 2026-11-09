// Real jobs come from the database (approved posts from local businesses and
// jobs the team posts in the admin portal). No sample jobs are shown.
const jobsData = []

export const quotes = [
  { text: '"I don\'t believe in taking right decisions. I take decisions and then make them right."', author: '— Ratan Tata' },
  { text: '"If you want to walk fast, walk alone. But if you want to walk far, walk together."', author: '— Ratan Tata' },
  { text: '"Ups and downs in life are very important to keep us going, because a straight line even in an ECG means we are not alive."', author: '— Ratan Tata' },
  { text: '"Dream, dream, dream. Dreams transform into thoughts and thoughts result in action."', author: '— APJ Abdul Kalam' },
  { text: '"You have to dream before your dreams can come true."', author: '— APJ Abdul Kalam' },
  { text: '"Don\'t take rest after your first victory because if you fail in the second, more lips are waiting to say that your first victory was just luck."', author: '— APJ Abdul Kalam' },
  { text: '"Take up one idea. Make that one idea your life; dream of it, think of it, live on that idea."', author: '— Swami Vivekananda' },
  { text: '"Arise, awake, and stop not till the goal is reached."', author: '— Swami Vivekananda' },
  { text: '"In a day, when you don\'t come across any problems, you can be sure that you are travelling in a wrong path."', author: '— Swami Vivekananda' },
  { text: '"If you don\'t build your dream, someone else will hire you to help them build theirs."', author: '— Dhirubhai Ambani' },
  { text: '"Between your preparation and your goal, there is the bridge called risk. Don\'t be afraid to cross it."', author: '— Dhirubhai Ambani' },
  { text: '"It\'s not about money or connections — it\'s the willingness to outwork and outlearn everyone."', author: '— Mark Cuban (on Indian entrepreneurs)' },
  { text: '"The best way to find yourself is to lose yourself in the service of others."', author: '— Mahatma Gandhi' },
  { text: '"Live as if you were to die tomorrow. Learn as if you were to live forever."', author: '— Mahatma Gandhi' },
  { text: '"People with good values always end up doing well."', author: '— N. R. Narayana Murthy' },
  { text: '"Giving is the greatest act of grace. And my life has been enriched by it."', author: '— Sudha Murty' },
  { text: '"Challenges are what make life interesting. Overcoming them is what makes life meaningful."', author: '— Kiran Mazumdar-Shaw' },
  { text: '"Nothing is impossible. The word itself says I\'m possible."', author: '— Azim Premji' },
  { text: '"People throw stones at you and you convert them into milestones."', author: '— Sachin Tendulkar' },
  { text: '"The process is more important than the result. If the process is right, the results will come."', author: '— MS Dhoni' }
]

export const subServices = {
  identity: [
    'Birth Certificate',
    'Death Certificate',
    'Marriage Certificate',
    'Income Certificate',
    'Caste / Community Certificate',
    'Nativity / Residence Certificate',
    'Passport Application'
  ],
  mro: [
    'Family Member / Survivorship Certificate',
    'Pahani / Adangal',
    'Pattadar Passbook',
    'Land Possession Certificate',
    'EWS / OBC Certificates',
    'Income & Asset Certificate'
  ],
  rto: [
    "Learner's & Driving Licence",
    'Vehicle Registration (RC)',
    'Permits & Fitness',
    'Duplicate RC Smart Card',
    'Road Tax & Green Tax'
  ],
  municipal: [
    'Property Tax',
    'Trade Licence',
    'Building Approvals',
    'Utility Connections',
    'Vacant Land Tax (VLT)'
  ],
  collector: [

    'Society / NGO Registration',
    'Land NOCs',
    'Land Acquisition Appeals'
  ],
  startup: [
    'Sole Proprietorship',
    'Partnership Firm',
    'One Person Company (OPC)',
    'Limited Liability Partnership (LLP)',
    'Private Limited Company'
  ],
  property: [
    'Property Registration (Sale Deed)',
    'Land Survey & Records (FMB/Adangal)',
    'Land Mutation (Patta Transfer)'
  ],
  court: [
    'Legal Case Follow-Up',
    'Lawyer Suggestion & Vetting'
  ],
  healthcare: [
    'Medical Advising',
    'Patient Logistics',
    'Patient Hospitality'
  ],
  drivers: [
    'Verified Driver Services',
    'Professional Chef Services',
    'Professional Makeup Artist',
    'Car Driving Classes'
  ],
  pujari: [
    'Life Milestones',
    'Property & New Beginnings',
    'Vedic Rituals & Pujas',
    'Ancestral Rites'
  ],
  photography: [
    'Wedding Photography',
    'Corporate Photography',
    'Advertising Photography',
    'Event Photography',
    'Portrait Photography',
    'Product Photography',
    'Real Estate Photography'
  ],
  electricity: [
    'Switches, Sockets & Smart Automation',
    'Fan & Ventilation Servicing',
    'Lighting & Fixture Fittings',
    'Distribution Boards & Power Backup',
    'Internal & External House Wiring',
    'Geyser / Water Heater',
    'Plumbing Services',
    'Water Motor & Tank',
    'Home Appliance Repair',
    'Small Fixes (Handyman)',
    'Something Not Working? Tell Us'
  ],
  'pest-control': [
    'Termite Control (Pre & Post Construction)',
    'Mosquito Control',
    'Rodent Control',
    'Cockroach Control',
    'Flies Control',
    'Bed Bug Control',
    'Spider Control',
    'Snake Rescue & Prevention',
    'Weed Control'
  ],
  painting: [
    'Home Painting (Inside)',
    'Exterior Painting',
    'Waterproofing & Crack Repair',
    'Doors, Windows & Grills',
    'Texture & Accent Walls'
  ],
  ac: [
    'Jet Cleaning & General Servicing',
    'Gas Leak Detection & Refilling',
    'AC Repair & Components',
    'New Unit Installation & Shifting'
  ],
  supplies: [
    'Granite',
    'Tiles',
    'Sand',
    'Transport',
    'Interior Design',
    'Architecture',
    'Furniture',
    'Events',
    'Catering',
    "Cold-Pressed Oil's"
  ],
  logistics: [
    'House Shifting',
    'Office & Shop Shifting',
    'Bike & Car Transport',
    'Move a Few Items',
    'Goods & Materials Transport'
  ],
  nri: [
    'Send Items Abroad',
    'Receive Parcels for Family in India',
    'Visa Services',
    'Parents’ Care Visits',
    'Property Watch',
    'Bills, Tax & Paperwork for NRIs',
  ],
  travel: [
    'Tourism Services',
  ],
  'real-estate': [
    'Buy a Property',
    'Sell a Property',
    'Rent & Lease',
    'Property Paperwork'
  ],
  workshop: [
    'Farming Workshop',
    'Basic Electricity',
    'Diet & Nutrition',
    'Yoga & Wellness',
    'Finance Management'
  ],
  education: [
    'Artificial Intelligence',
    'Artificial Intelligence and Data Science',
    'Artificial Intelligence and Machine Learning',
    'Quantum Computing',
    'Computer Science and Engineering',
    'Computer Science and Engineering (Data Science)',
    'Computer Science and Engineering (IOT and Cyber Security with Block chain Technology)',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'VLSI and Embedded Systems',
    'Transportation Engineering',
    'Structural Engineering',
    'Power Electronics and Power Systems',
    'Thermal Engineering',
    'MBA',
    'MBA (Hospital & Health Care Management)',
    'MBA (Artificial Intelligence & Data Science)',
    'MBA (Corporate Communication & Event Management)',
    'BCA',
    'MCA with AI',
    'B.Pharm',
    'Pharm.D',
    'Pharm.D (PB)',
    'M.PHARM: Pharmaceutics',
    'M.PHARM: Pharmaceutical Analysis',
    'M.PHARM: Pharmacology',
    'M.PHARM: Pharmaceutical Regulatory Affairs'
  ],
  'part-time': jobsData.map(job => job.title)
}

export default jobsData
