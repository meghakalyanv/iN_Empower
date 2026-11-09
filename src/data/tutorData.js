// ============================================================
// tutorData.js — Educational content for the Tutor page
// ============================================================

export const domains = [
  {
    id: 'education',
    icon: 'GraduationCap',
    iconColor: '#213361',
    title: 'Education & Career',
    tagline: 'Your certificates decide your career — not just your grades.',
    why: 'Without proper certificates, college admissions get rejected, scholarships are denied, and job applications fail at the verification stage. In India, a missing or misspelled document can cost you an entire academic year.',
    scenario: {
      name: 'Ravi',
      location: 'Ongole',
      story: 'Ravi scored 95% in Intermediate but lost his EAMCET engineering seat because his Caste Certificate had his father\'s name misspelled. By the time it was corrected through the MRO office, the counseling window had closed. He lost one full year.'
    },
    documents: [
      'Birth Certificate (for age proof)',
      'Caste / Community Certificate (for reservations)',
      'Income Certificate (for fee concessions & scholarships)',
      'Transfer Certificate (TC) from previous school',
      'Nativity / Residence Certificate (for local quota seats)'
    ],
    usedIn: [
      'College admissions & counseling (EAMCET, NEET, JEE)',
      'Scholarship applications (Post-Matric, Pre-Matric)',
      'Government job applications & competitive exams',
      'Study abroad applications & passport',
      'School transfers between states'
    ],
    serviceLinks: [
      { label: 'Birth Certificate', path: '/contact?service=identity&subService=birth-certificate' },
      { label: 'Caste Certificate', path: '/contact?service=identity&subService=caste-community-certificate' },
      { label: 'Income Certificate', path: '/contact?service=identity&subService=income-certificate' },
      { label: 'College Admissions Help', path: '/contact?service=education&subService=college-admissions' }
    ],
    stats: { affected: '1 in 4', description: 'students face document issues during college admissions in AP' }
  },
  {
    id: 'identity',
    icon: 'Contact',
    iconColor: '#8B2127',
    title: 'Identity & Civil Rights',
    tagline: 'Without documents, you don\'t exist in the eyes of the law.',
    why: 'Your identity documents are the foundation of your legal existence. Without them, you cannot vote, open a bank account, claim government benefits, get married officially, or even prove your own age. Millions of Indians — especially women, elderly, and rural communities — live without these basic proofs.',
    scenario: {
      name: 'Lakshmi',
      location: 'Prakasam District',
      story: 'Lakshmi, a 60-year-old widow, couldn\'t claim her husband\'s pension because she had no Marriage Certificate. They married 40 years ago when registration wasn\'t common in villages. Without it, the pension office refused to recognize her as the legal spouse.'
    },
    documents: [
      'Birth Certificate (foundational identity)',
      'Aadhaar Card (universal ID)',
      'PAN Card (financial identity)',
      'Voter ID (electoral rights)',
      'Passport (international identity)',
      'Marriage Certificate (spousal proof)',
      'Death Certificate (for survivor claims)'
    ],
    usedIn: [
      'Opening bank accounts & getting loans',
      'Government schemes (PM-Kisan, Aarogyasri, NREGA)',
      'Voter registration & elections',
      'Pension claims & insurance settlements',
      'Legal identity for women and children'
    ],
    serviceLinks: [
      { label: 'Birth Certificate', path: '/contact?service=identity&subService=birth-certificate' },
      { label: 'Marriage Certificate', path: '/contact?service=identity&subService=marriage-certificate' },
      { label: 'Passport Application', path: '/contact?service=identity&subService=passport-application' },
      { label: 'Death Certificate', path: '/contact?service=identity&subService=death-certificate' }
    ],
    stats: { affected: '68%', description: 'of rural Indians lack a registered Marriage Certificate' }
  },
  {
    id: 'property',
    icon: 'Building',
    iconColor: '#E87A5D',
    title: 'Property & Land',
    tagline: 'If it\'s not on paper, it\'s not yours.',
    why: 'India\'s land records are notoriously complex and outdated. Improper documentation leads to property disputes, fraudulent sales, inability to get bank loans, and even government acquisition without fair compensation. A single missing mutation entry can invalidate decades of ownership.',
    scenario: {
      name: 'The Reddy Family',
      location: 'Chimakurthy',
      story: 'A family inherited 5 acres of agricultural land but never did the Patta Transfer (mutation) after the grandfather passed away. When they tried to sell it 15 years later, the revenue records still showed the deceased grandfather as the owner — leading to a 3-year legal battle and ₹2 lakh in lawyer fees.'
    },
    documents: [
      'Sale Deed (registered property transfer)',
      'Encumbrance Certificate (EC — no hidden claims)',
      'Pattadar Passbook (revenue ownership record)',
      'Pahani / Adangal (land cultivation record)',
      'FMB (Field Measurement Book — boundary map)',
      'Land Mutation / Patta Transfer'
    ],
    usedIn: [
      'Buying or selling property',
      'Getting home loans from banks',
      'Building construction permits',
      'Resolving boundary & inheritance disputes',
      'Government land acquisition compensation'
    ],
    serviceLinks: [
      { label: 'Property Registration', path: '/contact?service=property&subService=property-registration-sale-deed' },
      { label: 'Land Survey & Records', path: '/contact?service=property&subService=land-survey-records-fmb-adangal' },
      { label: 'Land Mutation', path: '/contact?service=property&subService=land-mutation-patta-transfer' },
      { label: 'Pahani / Adangal', path: '/contact?service=mro&subService=pahani-adangal' }
    ],
    stats: { affected: '45%', description: 'of land in India has disputed or unclear ownership records' }
  },
  {
    id: 'vehicles',
    icon: 'CarFront',
    iconColor: '#D4A373',
    title: 'Vehicles & Transport',
    tagline: 'One missing document can cost you your vehicle — and your freedom.',
    why: 'Driving without a valid licence, expired RC, or lapsed insurance doesn\'t just mean fines — it can mean vehicle seizure, criminal liability in accidents, and denial of insurance claims when you need them most.',
    scenario: {
      name: 'Suresh',
      location: 'Ongole',
      story: 'Suresh was stopped at a routine checkpoint with an expired RC. His vehicle was seized for 45 days, and he paid ₹15,000 in fines and towing charges — more than 5× the cost of a simple RC renewal that would have taken just 2 days with proper help.'
    },
    documents: [
      'Learner\'s Licence → Permanent Driving Licence',
      'Vehicle Registration Certificate (RC)',
      'Vehicle Insurance (mandatory third-party)',
      'PUC Certificate (Pollution Under Control)',
      'Road Tax & Green Tax receipts',
      'Commercial Permits & Fitness Certificate'
    ],
    usedIn: [
      'Daily driving — traffic checkpoints are everywhere',
      'Vehicle sale or purchase (transfer of ownership)',
      'Insurance claims after accidents',
      'Commercial transport operations',
      'Avoiding criminal liability in road accidents'
    ],
    serviceLinks: [
      { label: 'Driving Licence', path: '/contact?service=rto&subService=learners-driving-license' },
      { label: 'Vehicle Registration (RC)', path: '/contact?service=rto&subService=vehicle-registration-rc' },
      { label: 'Permits & Fitness', path: '/contact?service=rto&subService=permits-fitness' },
      { label: 'Road Tax & Green Tax', path: '/contact?service=rto&subService=road-tax-green-tax' }
    ],
    stats: { affected: '₹15,000+', description: 'average penalty for driving with expired vehicle documents in AP' }
  },
  {
    id: 'municipal',
    icon: 'Landmark',
    iconColor: '#2F5233',
    title: 'Municipal & Urban Living',
    tagline: 'The city doesn\'t care about your intentions — only your paperwork.',
    why: 'Property tax defaults lead to property seizure. Operating a business without a Trade Licence is illegal and can result in sealing. Building without municipal approval can result in demolition notices. Even water and drainage connections require documentation.',
    scenario: {
      name: 'Prasad',
      location: 'Ongole',
      story: 'A shop owner had his business sealed by the Municipal Corporation because he had been operating for 3 years without a Trade Licence — he didn\'t even know it was required. He lost 2 weeks of business and paid ₹25,000 in penalties before getting the licence.'
    },
    documents: [
      'Property Tax Assessment & Receipts',
      'Trade Licence (for any commercial activity)',
      'Building Plan Approval & Occupancy Certificate',
      'Water & Drainage Connection permits',
      'Vacant Land Tax (VLT) for empty plots'
    ],
    usedIn: [
      'Running any business or shop legally',
      'Owning property without risk of seizure',
      'Getting construction and renovation permits',
      'Accessing municipal water and drainage',
      'Avoiding demolition notices on buildings'
    ],
    serviceLinks: [
      { label: 'Property Tax', path: '/contact?service=municipal&subService=property-tax' },
      { label: 'Trade Licence', path: '/contact?service=municipal&subService=trade-license' },
      { label: 'Building Approvals', path: '/contact?service=municipal&subService=building-approvals' },
      { label: 'Utility Connections', path: '/contact?service=municipal&subService=utility-connections' }
    ],
    stats: { affected: '40%', description: 'of small businesses in Indian towns operate without a Trade Licence' }
  },
  {
    id: 'startup',
    icon: 'Rocket',
    iconColor: '#8B5A2B',
    title: 'Business & Startup',
    tagline: 'You can\'t build a business on a handshake. You need registration.',
    why: 'Without proper business registration, you cannot open a business bank account, file GST returns, bid for government tenders, list on e-commerce platforms, or raise investment. Informal businesses also face legal liability and cannot protect their personal assets.',
    scenario: {
      name: 'Priya',
      location: 'Ongole',
      story: 'Priya wanted to sell her homemade pickles on Amazon and Flipkart but couldn\'t list her products without GST registration and an FSSAI licence. The registration process confused her, and she lost 6 months of peak festive season sales — her biggest revenue opportunity.'
    },
    documents: [
      'Business Registration (Sole Prop / Partnership / LLP / Pvt Ltd)',
      'GST Registration',
      'MSME / Udyam Registration',
      'FSSAI Licence (for food businesses)',
      'Shop & Establishment Licence',
      'Professional Tax Registration'
    ],
    usedIn: [
      'Opening business bank accounts',
      'Filing GST and income tax',
      'Bidding for government tenders',
      'Listing on e-commerce platforms',
      'Raising investment and getting business loans'
    ],
    serviceLinks: [
      { label: 'Sole Proprietorship', path: '/contact?service=startup&subService=sole-proprietorship' },
      { label: 'Partnership Firm', path: '/contact?service=startup&subService=partnership-firm' },
      { label: 'LLP Registration', path: '/contact?service=startup&subService=limited-liability-partnership-llp' },
      { label: 'Private Limited Company', path: '/contact?service=startup&subService=private-limited-company' }
    ],
    stats: { affected: 'Only 12%', description: 'of Indian MSMEs are formally registered with the government' }
  },
  {
    id: 'legal',
    icon: 'Scale',
    iconColor: '#213361',
    title: 'Legal & Safety Net',
    tagline: 'In court, the person with the documents wins. Always.',
    why: 'When disputes arise — whether about land, family, consumer rights, or accidents — having proper documentation is the difference between winning and losing in court. Without evidence on paper, even the truth cannot protect you.',
    scenario: {
      name: 'Kumar\'s Family',
      location: 'Prakasam District',
      story: 'After a road accident, the victim\'s family couldn\'t file for Motor Accident Claims Tribunal (MACT) compensation because they had no proof of the deceased\'s income — no Income Certificate, no salary slips, no ITR. The compensation awarded was a fraction of what they deserved.'
    },
    documents: [
      'All identity & property documents (as evidence)',
      'Legal Heir Certificate',
      'Succession Certificate',
      'Power of Attorney',
      'Notarized Affidavits',
      'FIR copies and court orders'
    ],
    usedIn: [
      'Civil and criminal court cases',
      'Motor accident compensation claims',
      'Insurance settlements and disputes',
      'Inheritance and property succession',
      'Consumer complaints and grievances'
    ],
    serviceLinks: [
      { label: 'Legal Case Follow-Up', path: '/contact?service=court&subService=legal-case-follow-up' },
      { label: 'Lawyer Suggestion', path: '/contact?service=court&subService=lawyer-suggestion-vetting' }
    ],
    stats: { affected: '3.5 Crore', description: 'pending court cases in India — many stuck due to missing documentation' }
  }
]

export const shockingStats = [
  { value: '68%', label: 'of rural Indians lack a registered Marriage Certificate' },
  { value: '45%', label: 'of land in India has disputed or unclear ownership' },
  { value: '12%', label: 'of Indian MSMEs are formally registered' },
  { value: '30%+', label: 'of birth registrations in AP are delayed beyond 1 year' },
  { value: '3.5Cr', label: 'court cases pending — many due to missing documents' },
  { value: '40%', label: 'of small businesses operate without a Trade Licence' }
]

export const checklistItems = [
  {
    stage: 'Every Indian Citizen',
    domainId: 'identity',
    items: [
      { name: 'Birth Certificate', critical: true, service: 'identity', subService: 'birth-certificate' },
      { name: 'Aadhaar Card', critical: true, service: 'identity', subService: 'aadhaar-card' },
      { name: 'PAN Card', critical: true, service: 'identity', subService: 'pan-card' },
      { name: 'Voter ID', critical: false, service: 'identity', subService: 'voter-id' },
      { name: 'Passport', critical: false, service: 'identity', subService: 'passport-application' },
      { name: 'Income Certificate', critical: false, service: 'identity', subService: 'income-certificate' },
      { name: 'Caste / Community Certificate', critical: false, service: 'identity', subService: 'caste-community-certificate' }
    ]
  },
  {
    stage: 'Married / Family',
    domainId: 'identity',
    items: [
      { name: 'Marriage Certificate', critical: true, service: 'identity', subService: 'marriage-certificate' },
      { name: 'Spouse\'s Aadhaar linked', critical: false, service: 'identity', subService: 'aadhaar-card' },
      { name: 'Joint Property Documents', critical: false, service: 'property', subService: 'property-registration-sale-deed' },
      { name: 'Children\'s Birth Certificates', critical: true, service: 'identity', subService: 'birth-certificate' },
      { name: 'Family Ration Card', critical: false, service: 'mro', subService: 'ration-card' },
      { name: 'Nominee updated in Insurance & Bank', critical: true, service: 'identity', subService: 'nominee-update' }
    ]
  },
  {
    stage: 'Property Owner',
    domainId: 'property',
    items: [
      { name: 'Registered Sale Deed', critical: true, service: 'property', subService: 'property-registration-sale-deed' },
      { name: 'Encumbrance Certificate (EC)', critical: true, service: 'property', subService: 'encumbrance-certificate' },
      { name: 'Pattadar Passbook / Title Deed', critical: true, service: 'property', subService: 'pattadar-passbook' },
      { name: 'Property Tax Receipts (current year)', critical: true, service: 'municipal', subService: 'property-tax' },
      { name: 'Building Approval / Plan Sanction', critical: false, service: 'municipal', subService: 'building-approvals' },
      { name: 'Land Mutation completed', critical: true, service: 'property', subService: 'land-mutation-patta-transfer' }
    ]
  },
  {
    stage: 'Vehicle Owner',
    domainId: 'vehicles',
    items: [
      { name: 'Valid Driving Licence', critical: true, service: 'rto', subService: 'learners-driving-license' },
      { name: 'Vehicle RC (Registration Certificate)', critical: true, service: 'rto', subService: 'vehicle-registration-rc' },
      { name: 'Vehicle Insurance (not expired)', critical: true, service: 'rto', subService: 'vehicle-insurance' },
      { name: 'PUC Certificate (valid)', critical: true, service: 'rto', subService: 'puc-certificate' },
      { name: 'Road Tax paid', critical: false, service: 'rto', subService: 'road-tax-green-tax' },
      { name: 'Fitness Certificate (commercial)', critical: false, service: 'rto', subService: 'permits-fitness' }
    ]
  },
  {
    stage: 'Business Owner',
    domainId: 'startup',
    items: [
      { name: 'Business Registration (any form)', critical: true, service: 'startup', subService: 'sole-proprietorship' },
      { name: 'GST Registration', critical: true, service: 'startup', subService: 'gst-registration' },
      { name: 'MSME / Udyam Registration', critical: false, service: 'startup', subService: 'msme-udyam' },
      { name: 'Trade Licence', critical: true, service: 'municipal', subService: 'trade-license' },
      { name: 'Shop & Establishment Licence', critical: false, service: 'startup', subService: 'shop-establishment' },
      { name: 'FSSAI (if food business)', critical: false, service: 'startup', subService: 'fssai-licence' }
    ]
  }
]

export const beforeAfterData = [
  {
    icon: '⏳',
    before: { title: 'Weeks of Waiting', description: 'Standing in queues, multiple office visits, confusing procedures — losing precious working days.' },
    after: { title: 'Done in Days', description: 'Your Local Buddy handles everything. Updates on your phone while you focus on your life.' }
  },
  {
    icon: '💸',
    before: { title: 'Hidden Costs & Bribes', description: 'Middlemen charging 3-5x, no receipts, no accountability — and still no guarantee of results.' },
    after: { title: 'Transparent Pricing', description: 'Fixed service fees upfront — and if the work isn’t done, we pay you back.' }
  },
  {
    icon: '📋',
    before: { title: 'Rejected Applications', description: 'Wrong forms, missing documents, spelling mistakes — rejected and you start over from scratch.' },
    after: { title: 'First-Time Approvals', description: 'Expert preparation, pre-verification checks, and guided submissions — right the first time, every time.' }
  },
  {
    icon: '🤝',
    before: { title: 'No One to Trust', description: 'Unknown agents, no track record, no way to verify if someone is genuine or a fraud.' },
    after: { title: 'Verified Local Buddies', description: 'Background-checked, rated by real customers, and monitored by iN Empower — complete accountability.' }
  }
]

export const processSteps = [
  {
    step: 1,
    title: 'Tell Us Your Need',
    description: 'Use our Quick Assessment or simply tell us what document or service you need. Takes less than 2 minutes.',
    icon: '💬'
  },
  {
    step: 2,
    title: 'We Match You',
    description: 'We connect you with a verified, background-checked Local Buddy in your area who specializes in your exact requirement.',
    icon: '🎯'
  },
  {
    step: 3,
    title: 'Buddy Handles It',
    description: 'Your Local Buddy takes care of all the paperwork, office visits, and follow-ups. You get progress updates on your phone.',
    icon: '⚡'
  },
  {
    step: 4,
    title: 'You\'re Done',
    description: 'Receive your completed documents — or your money back if we can’t get them done.',
    icon: '✅'
  }
]

export const trustSignals = [
  { value: '90+', label: 'Local Services Covered' },
  { value: '16', label: 'Service Categories' },
  { value: '3-Tier', label: 'Buddy Verification' },
  { value: 'Telugu & English', label: 'Help in Your Language' }
]

export const assessmentFlows = [
  {
    id: 'new-birth',
    icon: '👶',
    label: 'New Birth in Family',
    color: '#D4A373',
    description: 'Register your child and secure their identity',
    questions: [
      {
        question: 'When was the child born?',
        options: [
          { label: 'Within 21 days', tag: 'normal', urgency: 'low' },
          { label: '21 days – 1 year ago', tag: 'delayed', urgency: 'medium' },
          { label: 'More than 1 year ago', tag: 'late', urgency: 'high' }
        ]
      },
      {
        question: 'Where was the child born?',
        options: [
          { label: 'Hospital / Nursing Home', tag: 'hospital' },
          { label: 'Home / Other location', tag: 'home' }
        ]
      }
    ],
    results: {
      services: [
        { name: 'Birth Certificate Registration', service: 'identity', subService: 'birth-certificate', priority: 'critical' },
        { name: 'Aadhaar Enrollment for Child', service: 'identity', subService: 'aadhaar-card', priority: 'important' },
        { name: 'Add Child to Ration Card', service: 'mro', subService: 'ration-card', priority: 'recommended' }
      ],
      documents: ['Hospital Discharge Slip or Form 2', 'Aadhaar cards of both parents', 'Marriage Certificate of parents', 'Notarized affidavit for name inclusion'],
      warning: 'Delayed registration (beyond 21 days) requires additional affidavits and may involve MRO office visits. We handle all of it.',
      timeline: '3–7 working days (normal) | 15–30 days (delayed)'
    }
  },
  {
    id: 'getting-married',
    icon: '💍',
    label: 'Getting Married',
    color: '#2F5233',
    description: 'Legal marriage registration and documentation',
    questions: [
      {
        question: 'What type of marriage?',
        options: [
          { label: 'Hindu Marriage Act', tag: 'hindu' },
          { label: 'Special Marriage Act (inter-faith / court)', tag: 'special' },
          { label: 'Already married — need certificate', tag: 'existing' }
        ]
      },
      {
        question: 'Do both partners have valid ID proofs?',
        options: [
          { label: 'Yes — both have Aadhaar, PAN, etc.', tag: 'ids-ready' },
          { label: 'No — one or both need IDs first', tag: 'ids-needed' }
        ]
      }
    ],
    results: {
      services: [
        { name: 'Marriage Certificate', service: 'identity', subService: 'marriage-certificate', priority: 'critical' },
        { name: 'Aadhaar Name/Address Update', service: 'identity', subService: 'aadhaar-card', priority: 'important' },
        { name: 'Joint Property Registration', service: 'property', subService: 'property-registration-sale-deed', priority: 'recommended' },
        { name: 'Nominee Update in Insurance & Bank', service: 'identity', subService: 'nominee-update', priority: 'recommended' }
      ],
      documents: ['Application Form A (signed by both & 3 witnesses)', 'Age proof of both partners', 'Aadhaar/PAN/Passport of bride and groom', 'Wedding invitation + ceremony photos', 'Notarized affidavit on stamp paper', 'Witness Aadhaar cards and photographs'],
      warning: 'Special Marriage Act requires a 30-day notice period. Plan ahead.',
      timeline: '7–15 working days (Hindu Act) | 45+ days (Special Marriage Act)'
    }
  },
  {
    id: 'buying-property',
    icon: '🏠',
    label: 'Buying / Selling Property',
    color: '#E87A5D',
    description: 'Property registration, verification and transfer',
    questions: [
      {
        question: 'What are you doing?',
        options: [
          { label: 'Buying a new property', tag: 'buying' },
          { label: 'Selling a property', tag: 'selling' },
          { label: 'Inherited property — need transfer', tag: 'inherited' },
          { label: 'Verifying property documents', tag: 'verification' }
        ]
      },
      {
        question: 'What type of property?',
        options: [
          { label: 'Agricultural land', tag: 'agricultural' },
          { label: 'Residential plot / house', tag: 'residential' },
          { label: 'Commercial property', tag: 'commercial' }
        ]
      }
    ],
    results: {
      services: [
        { name: 'Property Registration (Sale Deed)', service: 'property', subService: 'property-registration-sale-deed', priority: 'critical' },
        { name: 'Encumbrance Certificate (EC)', service: 'property', subService: 'encumbrance-certificate', priority: 'critical' },
        { name: 'Land Survey & Records (FMB)', service: 'property', subService: 'land-survey-records-fmb-adangal', priority: 'important' },
        { name: 'Land Mutation (Patta Transfer)', service: 'property', subService: 'land-mutation-patta-transfer', priority: 'important' },
        { name: 'Property Tax Assessment', service: 'municipal', subService: 'property-tax', priority: 'recommended' }
      ],
      documents: ['Original Sale Deed + chain of title documents', 'Encumbrance Certificate (13–30 years)', 'Aadhaar and PAN of buyer & seller', 'Latest property tax receipts', 'For inherited: Death Certificate + Legal Heir Certificate'],
      warning: 'Never buy property without verifying the Encumbrance Certificate (EC). We check the EC and title papers with you before you buy.',
      timeline: '7–15 working days for registration | 15–30 days for mutation'
    }
  },
  {
    id: 'starting-business',
    icon: '🚀',
    label: 'Starting a Business',
    color: '#8B5A2B',
    description: 'Business registration, GST, licences and compliance',
    questions: [
      {
        question: 'How many people are starting this business?',
        options: [
          { label: 'Just me (solo)', tag: 'solo' },
          { label: '2–5 partners', tag: 'partnership' },
          { label: 'Planning to raise investment', tag: 'investment' }
        ]
      },
      {
        question: 'What kind of business?',
        options: [
          { label: 'Shop / Retail / Services', tag: 'retail' },
          { label: 'Food / Restaurant / Catering', tag: 'food' },
          { label: 'Tech / Consulting / Freelance', tag: 'tech' },
          { label: 'Manufacturing / Trading', tag: 'manufacturing' }
        ]
      }
    ],
    results: {
      services: [
        { name: 'Business Registration', service: 'startup', subService: 'sole-proprietorship', priority: 'critical' },
        { name: 'GST Registration', service: 'startup', subService: 'gst-registration', priority: 'critical' },
        { name: 'MSME / Udyam Registration', service: 'startup', subService: 'msme-udyam', priority: 'important' },
        { name: 'Trade Licence', service: 'municipal', subService: 'trade-license', priority: 'important' },
        { name: 'FSSAI Licence (food businesses)', service: 'startup', subService: 'fssai-licence', priority: 'recommended' },
        { name: 'Shop & Establishment Licence', service: 'startup', subService: 'shop-establishment', priority: 'recommended' }
      ],
      documents: ['PAN card and Aadhaar of all partners', 'Address proof for business premises', 'Rent agreement or property document', 'Partnership Deed (if applicable)', 'NOC from property owner'],
      warning: 'Operating without a Trade Licence or GST can result in penalties up to ₹25,000 and business sealing.',
      timeline: '3–7 days (Sole Prop) | 7–15 days (LLP/Pvt Ltd) | 2–5 days (GST)'
    }
  },
  {
    id: 'vehicle-matters',
    icon: '🚗',
    label: 'Vehicle & Driving',
    color: '#D4A373',
    description: 'Driving licence, RC transfer, insurance & permits',
    questions: [
      {
        question: 'What do you need?',
        options: [
          { label: 'New Driving Licence', tag: 'new-dl' },
          { label: 'Renew expired DL / RC', tag: 'renewal' },
          { label: 'Transfer vehicle ownership', tag: 'transfer' },
          { label: 'Commercial permits / fitness', tag: 'commercial' },
          { label: 'Duplicate RC (lost/damaged)', tag: 'duplicate' }
        ]
      }
    ],
    results: {
      services: [
        { name: "Learner's & Driving Licence", service: 'rto', subService: 'learners-driving-license', priority: 'critical' },
        { name: 'Vehicle Registration (RC)', service: 'rto', subService: 'vehicle-registration-rc', priority: 'critical' },
        { name: 'Permits & Fitness Certificate', service: 'rto', subService: 'permits-fitness', priority: 'important' },
        { name: 'Road Tax & Green Tax', service: 'rto', subService: 'road-tax-green-tax', priority: 'recommended' },
        { name: 'Duplicate RC Smart Card', service: 'rto', subService: 'duplicate-rc-smart-card', priority: 'recommended' }
      ],
      documents: ['Age proof (Aadhaar, Birth Certificate, 10th Memo)', 'Address proof (Aadhaar, Voter ID, utility bill)', 'Medical Certificate Form 1A (if 40+ years)', 'Original RC Smart Card (for transfers)', 'Form 29 & 30 with signatures (for transfers)', 'Police FIR copy (for duplicate RC)'],
      warning: 'Driving with expired documents can lead to ₹15,000+ fines and vehicle seizure. We handle renewals quickly.',
      timeline: '1–3 days (LL) | 7–15 days (DL) | 3–7 days (RC Transfer)'
    }
  },
  {
    id: 'education-career',
    icon: '🎓',
    label: 'Education & Admissions',
    color: '#213361',
    description: 'College admissions, certificates, scholarships',
    questions: [
      {
        question: 'What do you need help with?',
        options: [
          { label: 'College admission counseling (EAMCET, NEET, JEE)', tag: 'admissions' },
          { label: 'Missing certificates for admission', tag: 'certificates' },
          { label: 'Scholarship / fee concession documents', tag: 'scholarship' },
          { label: 'Home Tuition for my child', tag: 'tuition' }
        ]
      }
    ],
    results: {
      services: [
        { name: 'College Admissions Help', service: 'education', subService: 'college-admissions', priority: 'critical' },
        { name: 'Caste / Community Certificate', service: 'identity', subService: 'caste-community-certificate', priority: 'important' },
        { name: 'Income Certificate', service: 'identity', subService: 'income-certificate', priority: 'important' },
        { name: 'Nativity / Residence Certificate', service: 'identity', subService: 'nativity-residence-certificate', priority: 'recommended' },
        { name: 'Home Tuitions', service: 'education', subService: 'home-tuitions', priority: 'recommended' }
      ],
      documents: ['Birth Certificate (age proof)', 'Caste / Community Certificate', 'Income Certificate (for scholarships)', 'Transfer Certificate from previous school', 'Nativity / Residence Certificate (for local quota)'],
      warning: '1 in 4 students face document issues during admissions in AP. Don\'t let a missing certificate cost you an entire year.',
      timeline: '3–7 days (certificates) | ongoing (admissions counseling)'
    }
  },
  {
    id: 'lost-someone',
    icon: '🕊️',
    label: 'Death in Family',
    color: '#213361',
    description: 'Death certificate, legal heir, pension & property transfer',
    questions: [
      {
        question: 'When did the death occur?',
        options: [
          { label: 'Within 21 days', tag: 'normal', urgency: 'low' },
          { label: 'More than 21 days ago', tag: 'delayed', urgency: 'medium' },
          { label: 'More than 1 year ago', tag: 'late', urgency: 'high' }
        ]
      },
      {
        question: 'What do you need help with?',
        options: [
          { label: 'Death Certificate registration', tag: 'death-cert' },
          { label: 'Claim pension / insurance / bank funds', tag: 'claims' },
          { label: 'Transfer property to legal heirs', tag: 'property' },
          { label: 'All of the above', tag: 'all' }
        ]
      }
    ],
    results: {
      services: [
        { name: 'Death Certificate', service: 'identity', subService: 'death-certificate', priority: 'critical' },
        { name: 'Family Member / Survivorship Certificate', service: 'mro', subService: 'family-member-survivorship-certificate', priority: 'critical' },
        { name: 'Land Mutation (Patta Transfer)', service: 'property', subService: 'land-mutation-patta-transfer', priority: 'important' },
        { name: 'Legal Case Follow-Up', service: 'court', subService: 'legal-case-follow-up', priority: 'recommended' }
      ],
      documents: ['Proof of birth of the deceased', 'Aadhaar / Ration Card of the deceased', 'Affidavit stating time and place of death', 'Aadhaar of all surviving family members', 'For delayed: NABC and identification proofs'],
      warning: 'Without a Death Certificate and Survivorship Certificate, pension claims, insurance settlements, and property transfers are impossible. We handle the entire process sensitively and efficiently.',
      timeline: '3–7 days (normal) | 15–30 days (delayed) | 30–60 days (property transfer)'
    }
  },
  {
    id: 'government-issue',
    icon: '🏛️',
    label: 'Government Office Issue',
    color: '#2F5233',
    description: 'Stuck applications, grievances, NOCs',
    questions: [
      {
        question: 'What kind of issue are you facing?',
        options: [
          { label: 'Application stuck / no response', tag: 'stuck' },
          { label: 'Need NOC or clearance', tag: 'noc' },
          { label: 'Property tax / trade licence issue', tag: 'municipal' },
          { label: 'Land acquisition / compensation', tag: 'acquisition' },
          { label: 'Building approval / construction permit', tag: 'building' }
        ]
      }
    ],
    results: {
      services: [

        { name: 'Land NOCs', service: 'collector', subService: 'land-nocs', priority: 'important' },
        { name: 'Property Tax', service: 'municipal', subService: 'property-tax', priority: 'important' },
        { name: 'Building Approvals', service: 'municipal', subService: 'building-approvals', priority: 'recommended' },
        { name: 'Land Acquisition Appeals', service: 'collector', subService: 'land-acquisition-appeals', priority: 'recommended' }
      ],
      documents: ['Written petition / grievance letter', 'Copies of all previous correspondence', 'Rejection letters (if any)', 'Aadhaar card and contact details', 'Property / land documents (if applicable)'],
      warning: 'Unresolved grievances can be escalated to the District Collector through Spandana. Our Local Buddies have experience navigating these offices.',
      timeline: '7–30 days depending on the issue and office'
    }
  }
]
