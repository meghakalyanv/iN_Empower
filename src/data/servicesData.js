// Home repairs (owner, 30 Oct 2026): the price is told after the check, before any work;
// we bring genuine spare parts and show the part price before fitting.
// Painting & waterproofing (owner, 30 Oct 2026): free site visit first, we bring the paint, touch-ups are charged
// Pest control (owner, 2 Nov 2026): free inspection first, approved chemicals, homes and businesses
const PEST_PROMISE = [
  'A pest control expert visits free, checks the place and tells you one clear price before any work — no charge if you say no.',
  'Only approved chemicals, used the right way; odourless gel in kitchens.',
  'Before the work we tell you which rooms to keep closed and for how long, and what to do about children, pets and food.',
  'For homes, shops, restaurants, offices and godowns.'
]

const PAINT_PROMISE = [
  'A supervisor visits free, measures the walls and tells you one clear price before any work — no charge if you say no.',
  'Colour help on the visit: the supervisor brings shade cards and helps you choose.',
  'We bring the paint; you pick the brand (Asian Paints, Berger, Nerolac, Indigo and others) and its cost is shown in the price.',
  'Furniture and floors are covered before work; the house is cleaned every day and fully at the end.',
  'A supervisor checks the work every day and does a final check with you.',
  'Touch-ups after the job are done on request, at a small charge told to you first.'
]

const REPAIR_PROMISE = [
  'Our technician checks the problem first and tells you the price before starting any work.',
  'We bring genuine spare parts and show you the part price before fitting it.'
]

const servicesData = [
  // ==================== EDUCATION ====================
  {
    id: 'college-admissions',
    category: 'education',
    icon: 'GraduationCap', iconColor: '#213361',
    title: 'College Admissions',
    subtitle: 'Get help with admissions in top colleges',
    customLink: '/college-admissions',
    sections: []
  },
  {
    id: 'home-tuitions',
    category: 'education',
    icon: 'BookOpen', iconColor: '#8B2127',
    title: 'Home Tuitions',
    subtitle: 'Get expert home tutors for all subjects',
    customLink: '/home-tuitions',
    sections: []
  },
  // ==================== IDENTITY & VITAL RECORDS ====================
  {
    id: 'birth-certificate',
    category: 'identity',
    icon: 'Baby', iconColor: '#D4A373',
    title: 'Birth Certificate',
    subtitle: 'Registration, Delayed Registration & Name Inclusion',
    sections: [
      { heading: 'Data Required', items: [
        "Child's date of birth, gender, exact place of birth",
        'Full names and residential address of parents',
        'For delayed: original application reference or hospital registration number'
      ]},
      { heading: 'Documents Required', items: [
        'Hospital discharge slip or Form 2 (home birth)',
        'For delayed: Original birth certificate, Aadhaar cards of both parents',
        "Notarized affidavit stating child's name",
        'NABC from Gram Panchayat (if delayed beyond 1 year)'
      ]}
    ]
  },

  {
    id: 'marriage-certificate',
    category: 'identity',
    icon: 'HeartHandshake', iconColor: '#2F5233',
    title: 'Marriage Certificate',
    subtitle: 'Hindu Marriage Act / Special Marriage Act',
    sections: [
      { heading: 'Data Required', items: [
        'Full names, religion, caste, professions, DOBs of both partners',
        'Permanent addresses, parent details, marriage date/place',
        'Names and addresses of adult witnesses'
      ]},
      { heading: 'Documents Required', items: [
        'Application Form A signed by bride, groom & 3 witnesses',
        'Age proof (Birth certificate / SSC marks memo)',
        'Identity & Address proofs (Aadhaar, PAN, Passport)',
        'Passport-size photographs, wedding invitation, ceremony photos',
        'Notarized affidavit on stamp paper',
        'Witness Aadhaar cards and photographs'
      ]}
    ]
  },
  {
    id: 'income-certificate',
    category: 'identity',
    icon: 'Banknote', iconColor: '#8B5A2B',
    title: 'Income Certificate',
    subtitle: 'Official income proof for various purposes',
    sections: [
      { heading: 'Data Required', items: [
        'Name, Parent/Husband name, Aadhaar, Gender, DOB, Age',
        'Income details (salary, business, agricultural)',
        'Specific purpose for the certificate'
      ]},
      { heading: 'Documents Required', items: [
        'Application form with Rs. 10 non-judicial paper',
        'Aadhaar card',
        'Ration Card',
        'Residential proof',
        'Income tax return or salary payslip',
        'Certification from two gazetted officers'
      ]}
    ]
  },
  {
    id: 'caste-community-certificate',
    category: 'identity',
    icon: 'Users', iconColor: '#E87A5D',
    title: 'Caste / Community Certificate',
    subtitle: 'SC / ST / OBC / EWS certification',
    sections: [
      { heading: 'Data Required', items: [
        "Name, Parents' Name, Age/DOB, Address",
        'Community details (sub-caste), Aadhaar, Household Survey Number'
      ]},
      { heading: 'Documents Required', items: [
        'Aadhaar card',
        'Ration Card / Voter ID',
        'Address proof (Electricity / Water bill)',
        'School leaving certificate / Transfer Certificate',
        "Parent's Caste Certificate (if available)",
        'Caste report by Patwari or Sarpanch',
        'Income certificate (OBC/EWS non-creamy layer)',
        'EWS: Property declaration + notary affidavit'
      ]}
    ]
  },
  {
    id: 'nativity-residence-certificate',
    category: 'identity',
    icon: 'Home', iconColor: '#213361',
    title: 'Nativity / Residence Certificate',
    subtitle: 'Domicile & continuous residence proof',
    sections: [
      { heading: 'Data Required', items: [
        'Name, DOB, complete address, family details, Aadhaar',
        'Years of continuous residence (4+ or 7+ years)',
        'Purpose of obtaining the certificate'
      ]},
      { heading: 'Documents Required', items: [
        'Identity proof (Aadhaar, PAN, Driving Licence, Voter Card, Passport)',
        'Address proof (land deed, rent agreement, property tax receipts)',
        'Utility bills (minimum 4 years old for continuous proof)',
        'Birth Certificate or School Certificate',
        'Ration Card',
        'Self-declaration affidavit or letter from Village Sarpanch'
      ]}
    ]
  },
  {
    id: 'passport-application',
    category: 'identity',
    icon: 'Plane', iconColor: '#8B2127',
    title: 'Passport Application',
    subtitle: 'Fresh & Renewal applications',
    sections: [
      { heading: 'Data Required', items: [
        'Complete personal details, DOB, family details',
        'Record of all places of stay during previous one year'
      ]},
      { heading: 'Documents Required', items: [
        'Identity proof (Aadhaar, Voter ID, PAN, DL)',
        'Address proof (Utility bill, Aadhaar, Rent Agreement)',
        'DOB proof (Birth certificate, 10th marksheet)',
        'Two passport-size photos (2×2 inch, white background)',
        'Marriage certificate / previous passport (if applicable)'
      ]}
    ]
  },

  {
    id: 'voter-id',
    category: 'identity',
    icon: 'Vote', iconColor: '#213361',
    title: 'Voter ID Services',
    subtitle: 'New voter card, corrections, address change & e-EPIC — we apply online for you',
    sections: [
      { heading: 'New Voter Card (Form 6)', items: [
        'Recent passport-size photo (white background)',
        'Age proof — birth certificate, 10th memo, Aadhaar or PAN',
        'Address proof — Aadhaar, bank passbook, electricity / water bill or rent agreement',
        "A family member's voter ID number (helps find your polling booth)",
        'Mobile number for the OTP'
      ]},
      { heading: 'Correction of Details (Form 8)', items: [
        'Your voter ID (EPIC) number',
        'Proof for the correction — e.g. Aadhaar or 10th memo for name or age',
        'New passport-size photo (to change the photo)',
        'Mobile number for the OTP'
      ]},
      { heading: 'Address Change (Form 8)', items: [
        'Your voter ID (EPIC) number',
        'New address proof — Aadhaar, bank passbook, electricity / water bill or rent agreement',
        'Mobile number for the OTP'
      ]},
      { heading: 'Download e-EPIC / Check Name in Voter List', items: [
        "Your voter ID (EPIC) number, or your name and father's name",
        'Mobile number linked to your voter ID (for the OTP)',
        'District and assembly constituency'
      ]}
    ]
  },

  // ==================== MRO SERVICES ====================
  {
    id: 'family-member-survivorship-certificate',
    category: 'mro',
    icon: 'UsersRound', iconColor: '#D4A373',
    title: 'Family Member / Survivorship Certificate',
    subtitle: 'For pensions, insurance & property transfer',
    sections: [
      { heading: 'Data Required', items: [
        'Name & address of applicant, name of deceased, date of death',
        'Relationship to deceased, purpose, list of surviving family members'
      ]},
      { heading: 'Documents Required', items: [
        'Death Certificate of the deceased',
        'Aadhaar cards of applicant and all family members',
        'Address proof (Ration Card / Voter ID)',
        'Notarized affidavit listing all surviving members',
        'Passport-size photograph and payment challan'
      ]}
    ]
  },
  {
    id: 'pahani-adangal',
    category: 'mro',
    icon: 'Tractor', iconColor: '#2F5233',
    title: 'Pahani / Adangal',
    subtitle: 'Land records extract for ownership & cultivation',
    sections: [
      { heading: 'Data Required', items: [
        'District, Mandal, Village name',
        'Survey Number, Account Number, or Aadhaar Number'
      ]},
      { heading: 'Documents Required', items: [
        'Aadhaar card for identity verification',
        'Specific survey details for Mee Bhoomi portal'
      ]}
    ]
  },
  {
    id: 'pattadar-passbook',
    category: 'mro',
    icon: 'BookMarked', iconColor: '#8B5A2B',
    title: 'Pattadar Passbook',
    subtitle: 'Mutation / Title Transfer for land ownership',
    sections: [
      { heading: 'Data Required', items: [
        'Applicant details including Aadhaar, District, Mandal, Village',
        'Mutation category and property extents'
      ]},
      { heading: 'Documents Required', items: [
        'Form 6A application',
        'Aadhaar / Voter ID, Ration card, passport photo',
        'Sale Deed copy, old Pattadar Passbook / Title deed',
        'Recent tax payment receipts',
        'If inherited: Death Certificate + Legal Heir Certificate'
      ]}
    ]
  },
  {
    id: 'land-possession-certificate',
    category: 'mro',
    icon: 'MapPin', iconColor: '#E87A5D',
    title: 'Land Possession Certificate',
    subtitle: 'Confirm physical occupancy for loans & subsidies',
    sections: [
      { heading: 'Data Required', items: [
        'House number, Door number, Address, property extents',
        'Exact house boundaries information'
      ]},
      { heading: 'Documents Required', items: [
        'Aadhaar Card, Voter ID',
        'Proof of ownership (Sale Deed / Lease Agreement)',
        'Encumbrance Certificate (EC)',
        'Recent Land Tax receipts, Ration Card, Income Certificate',
        'Passport-size photograph'
      ]}
    ]
  },
  {
    id: 'ews-obc-certificates',
    category: 'mro',
    icon: 'ShieldCheck', iconColor: '#213361',
    title: 'EWS / OBC Certificates',
    subtitle: 'Status verification for education & employment quotas',
    sections: [
      { heading: 'Documents Required', items: [
        'Aadhaar card',
        'Ration Card / Voter ID',
        'Address proof (Electricity / Water bill)',
        'School Transfer Certificate',
        'Income report (non-creamy layer proof)',
        'EWS: Property declaration + notarized affidavit'
      ]}
    ]
  },
  {
    id: 'income-asset-certificate',
    category: 'mro',
    icon: 'Landmark', iconColor: '#8B2127',
    title: 'Income & Asset Certificate',
    subtitle: 'Proof of financial status for high-value transactions',
    sections: [
      { heading: 'Documents Required', items: [
        'Aadhaar card',
        'Ration / Rice Card',
        'Residential proof',
        'Income tax return or salary payslip',
        'Application form with Rs. 10 non-judicial paper'
      ]}
    ]
  },

  // ==================== RTO SERVICES ====================
  {
    id: 'learners-driving-license',
    category: 'rto',
    icon: 'CarFront', iconColor: '#D4A373',
    title: "Learner's & Driving Licence",
    subtitle: 'New LL, Permanent DL, Renewal & Address Change',
    sections: [
      { heading: "Learner's Licence", items: [
        'Age proof (Aadhaar, Passport, Birth Certificate, 10th Memo)',
        'Address proof (Aadhaar, Voter ID, Utility Bill)',
        'Medical Certificate Form 1A (if 40+ years)',
        'Passport-size photograph'
      ]},
      { heading: 'Permanent DL', items: [
        'Valid LL (30+ days old, not expired)',
        'Passport photos; Form 5 for commercial DL'
      ]},
      { heading: 'DL Renewal', items: [
        'Original DL card, Address proof',
        'Form 1A Medical Certificate (if required)'
      ]}
    ]
  },
  {
    id: 'vehicle-registration-rc',
    category: 'rto',
    icon: 'FileKey', iconColor: '#2F5233',
    title: 'Vehicle Registration (RC)',
    subtitle: 'Transfer of Ownership & HP Removal',
    sections: [
      { heading: 'Transfer of Ownership', items: [
        'Original RC Smart Card',
        'Form 29 & Form 30 with wet signatures',
        'Aadhaar cards of both buyer and seller',
        'Vehicle Insurance + PUC certificate',
        "Buyer's PAN Card or Form 60"
      ]},
      { heading: 'HP Removal', items: [
        'Original RC, Bank NOC',
        'Form 35 with owner signature + bank seal',
        'Valid Insurance and PUC certificates'
      ]}
    ]
  },
  {
    id: 'permits-fitness',
    category: 'rto',
    icon: 'Wrench', iconColor: '#8B5A2B',
    title: 'Permits & Fitness',
    subtitle: 'Commercial permits, fitness testing & alterations',
    sections: [
      { heading: 'Permits', items: [
        'RC Smart Card, Fitness Certificate',
        'Commercial Vehicle Insurance',
        'Road Tax receipts, PUC certificate'
      ]},
      { heading: 'Fitness & Alteration', items: [
        'Physical vehicle presence at RTO required',
        'RC, Insurance, PUC, tax receipts',
        'Form 22 for modifications'
      ]}
    ]
  },
  {
    id: 'duplicate-rc-smart-card',
    category: 'rto',
    icon: 'CreditCard', iconColor: '#E87A5D',
    title: 'Duplicate RC Smart Card',
    subtitle: 'Replacement for lost, stolen, or damaged RC',
    sections: [
      { heading: 'Documents Required', items: [
        'Form 26 application',
        'Police FIR copy (if lost/stolen)',
        'Notarized affidavit declaring loss',
        'Valid Insurance and PUC certificates',
        'Address Proof (Aadhaar)'
      ]}
    ]
  },
  {
    id: 'road-tax-green-tax',
    category: 'rto',
    icon: 'Leaf', iconColor: '#213361',
    title: 'Road Tax & Green Tax',
    subtitle: 'Quarterly, lifetime & green tax for vehicles',
    sections: [
      { heading: 'Documents Required', items: [
        'RC photocopy',
        'Valid Insurance copy',
        'Fee calculation based on vehicle age & weight'
      ]}
    ]
  },

  // ==================== MUNICIPAL CORPORATION ====================
  {
    id: 'property-tax',
    category: 'municipal',
    icon: 'Receipt', iconColor: '#8B2127',
    title: 'Property Tax',
    subtitle: 'New Assessment & Name Mutation',
    sections: [
      { heading: 'Data Required', items: [
        'Property location, total plot/built-up area',
        'Year of construction, purpose (residential/commercial)'
      ]},
      { heading: 'Documents Required', items: [
        'New: Sale Deed, Building Plan approval, Occupancy certificate',
        'Mutation: Sale Deed/Gift Deed/Will, tax receipts, Death certificate (if inheritance)',
        'Aadhaar Card'
      ]}
    ]
  },
  {
    id: 'trade-license',
    category: 'municipal',
    icon: 'Store', iconColor: '#D4A373',
    title: 'Trade Licence',
    subtitle: 'New Registration & Renewal for commercial establishments',
    sections: [
      { heading: 'Documents Required', items: [
        'Sale Deed or Rent/Lease agreement',
        'NOC from property owner',
        'Proprietor identity (Aadhaar/PAN)',
        'Fire Safety NOC (for larger establishments)',
        'Latest Property Tax receipt'
      ]}
    ]
  },
  {
    id: 'building-approvals',
    category: 'municipal',
    icon: 'Building', iconColor: '#2F5233',
    title: 'Building Approvals',
    subtitle: 'Layout plans, permits & Town Planning submissions',
    sections: [
      { heading: 'Documents Required', items: [
        'Sale Deed and Link Documents',
        'Site Plan and Architectural Blueprints (registered architect or licensed engineer)',
        'Structural stability certificate',
        'Land conversion order (if agricultural to non-agricultural)',
        'Latest Encumbrance Certificate (EC)'
      ]}
    ]
  },
  {
    id: 'utility-connections',
    category: 'municipal',
    icon: 'Droplets', iconColor: '#8B5A2B',
    title: 'Utility Connections',
    subtitle: 'Water & Drainage connections for properties',
    sections: [
      { heading: 'Documents Required', items: [
        'Building Approval / Occupancy Certificate',
        'Latest Property Tax receipt',
        'Registered Sale Deed',
        'Plumbing layout plan (large buildings)'
      ]}
    ]
  },
  {
    id: 'vacant-land-tax-vlt',
    category: 'municipal',
    icon: 'Map', iconColor: '#E87A5D',
    title: 'Vacant Land Tax (VLT)',
    subtitle: 'Assessment for open plots without buildings',
    sections: [
      { heading: 'Documents Required', items: [
        'Sale Deed / Link Document',
        'Latest Encumbrance Certificate (EC)',
        'Aadhaar card of the owner',
        'Location sketch showing plot boundaries'
      ]}
    ]
  },

  // ==================== DISTRICT COLLECTOR ====================

  {
    id: 'society-ngo-registration',
    category: 'collector',
    icon: 'Handshake', iconColor: '#8B2127',
    title: 'Society / NGO Registration',
    subtitle: 'Legal incorporation of organizations',
    sections: [
      { heading: 'Documents Required', items: [
        'Memorandum of Association (MOA) signed by 7+ members',
        'Rules & Regulations document',
        'Aadhaar/PAN of all founding members',
        'NOC from property owner + address proof',
        'Notarized affidavit from President/Secretary'
      ]}
    ]
  },
  {
    id: 'arms-license',
    category: 'collector',
    icon: 'Shield', iconColor: '#D4A373',
    title: 'Arms Licence',
    subtitle: 'Initial application & renewal (high-scrutiny)',
    sections: [
      { heading: 'Documents Required', items: [
        'Application with detailed necessity statement',
        'Medical fitness certificate from government doctor',
        'Address & Identity proof',
        'Two character references from local citizens',
        'Evidence of threats (for self-defence applications)',
        'Personal interview with licensing authority required'
      ]}
    ]
  },
  {
    id: 'land-nocs',
    category: 'collector',
    icon: 'FileCheck', iconColor: '#2F5233',
    title: 'Land NOCs',
    subtitle: 'No Objection Certificates for land usage & development',
    sections: [
      { heading: 'Documents Required', items: [
        'Sale Deed / Title documents',
        'Detailed site plan / layout sketch',
        'Encumbrance Certificate (EC)',
        'Land conversion order (if applicable)',
        'Reports from Town Planning / Revenue Department'
      ]}
    ]
  },
  {
    id: 'land-acquisition-appeals',
    category: 'collector',
    icon: 'Scale', iconColor: '#8B5A2B',
    title: 'Land Acquisition Appeals',
    subtitle: 'Seek fair compensation for acquired land',
    sections: [
      { heading: 'Documents Required', items: [
        'Government acquisition notification / award order',
        'Proof of ownership (Sale Deed / Pattadar Passbook)',
        'Evidence of property value (comparable sales)',
        'Previous legal notices and court correspondence'
      ]}
    ]
  },

  // ==================== STARTUP REGISTRATION ====================
  {
    id: 'sole-proprietorship',
    category: 'startup',
    icon: 'UserPlus', iconColor: '#E87A5D',
    title: 'Sole Proprietorship',
    subtitle: 'Single-owner business with tax registrations',
    sections: [
      { heading: 'Documents Required', items: [
        'PAN card and Aadhaar card',
        "Utility bill in proprietor's name",
        'GST / Udyam / Shop & Establishment licence',
        'Rent agreement or property document'
      ]}
    ]
  },
  {
    id: 'partnership-firm',
    category: 'startup',
    icon: 'Briefcase', iconColor: '#213361',
    title: 'Partnership Firm',
    subtitle: 'Multi-partner business (2–20 partners)',
    sections: [
      { heading: 'Documents Required', items: [
        'Partnership Deed signed by all partners',
        'PAN, Aadhaar, Voter ID or Passport for all partners',
        'Bank statement or utility bill',
        'Rent agreement + NOC from property owner',
        'Form 1 application, DSC for partners'
      ]}
    ]
  },
  {
    id: 'one-person-company-opc',
    category: 'startup',
    icon: 'UserCog', iconColor: '#8B2127',
    title: 'One Person Company (OPC)',
    subtitle: 'Single-owner limited liability company',
    sections: [
      { heading: 'Documents Required', items: [
        'Aadhaar, PAN, Passport/Voter ID for shareholder + nominee',
        "Electricity bill, property tax receipt, owner's NOC",
        'Forms: INC-3 (Nominee), DIR-2 (Director), INC-9 (Declaration)',
        'MoA and AoA',
        'Digital Signature Certificate (DSC)'
      ]}
    ]
  },
  {
    id: 'limited-liability-partnership-llp',
    category: 'startup',
    icon: 'Building2', iconColor: '#D4A373',
    title: 'Limited Liability Partnership (LLP)',
    subtitle: 'Separate legal entity with flexible partner roles',
    sections: [
      { heading: 'Documents Required', items: [
        'PAN, Aadhaar, Passport/DL for all partners',
        'Rent agreement, NOC, utility bill for office',
        'LLP Agreement (filed within 30 days)',
        'Form 9 consent for designated partners',
        'Class 3 DSC for all designated partners'
      ]}
    ]
  },
  {
    id: 'private-limited-company',
    category: 'startup',
    icon: 'Factory', iconColor: '#2F5233',
    title: 'Private Limited Company',
    subtitle: 'Most common startup structure for investment',
    sections: [
      { heading: 'Documents Required', items: [
        'PAN (mandatory), Aadhaar, address proof for directors',
        "Utility bill, rent agreement, owner's NOC for office",
        'SPICe+ form, MoA, AoA, INC-9, DIR-2',
        'Digital Signature Certificate (DSC) for all directors'
      ]}
    ]
  },

  // ==================== REVENUE SERVICES ====================
  {
    id: 'property-registration-sale-deed',
    category: 'revenue',
    icon: 'FileSignature', iconColor: '#8B5A2B',
    title: 'Property Registration (Sale Deed)',
    subtitle: 'The most critical property transfer service',
    sections: [
      { heading: 'Data Required', items: [
        'Full names, Aadhaar & PAN of Seller and Buyer',
        'Survey number, village/ward, mandal, district, total extent',
        'Market value and consideration amount'
      ]},
      { heading: 'Documents Required', items: [
        'Original Sale Deed / Title Deed + chain of title',
        'Encumbrance Certificate (13–30 years)',
        'Aadhaar, PAN + latest property tax receipts',
        'Building plan, occupancy certificate, NOC from society'
      ]}
    ]
  },
  {
    id: 'land-survey-records-fmb-adangal',
    category: 'revenue',
    icon: 'MapPinned', iconColor: '#E87A5D',
    title: 'Land Survey & Records (FMB/Adangal)',
    subtitle: 'Boundary verification & legal record extract',
    sections: [
      { heading: 'Documents Required', items: [
        'District, Mandal, Village + Survey/Subdivision Number',
        'Adangal (ownership), 1-B extract (Record of Rights), FMB sketch',
        'Patta / Pattadar Passbook or title deed'
      ]}
    ]
  },
  {
    id: 'land-mutation-patta-transfer',
    category: 'revenue',
    icon: 'Replace', iconColor: '#213361',
    title: 'Land Mutation (Patta Transfer)',
    subtitle: 'Update revenue records after purchase or inheritance',
    sections: [
      { heading: 'Documents Required', items: [
        'Form 6A application',
        'Sale Deed/Document, old Pattadar Passbook, tax receipt',
        'If inherited: Death Certificate + Legal Heir / Succession Certificate'
      ]}
    ]
  },
  {
    id: 'encumbrance-certificate',
    category: 'revenue',
    icon: 'FileSearch', iconColor: '#D4A373',
    title: 'Encumbrance Certificate (EC)',
    subtitle: 'Verify property is free from legal dues & mortgages',
    sections: [
      { heading: 'Data Required', items: [
        'Full property address with Survey Number / Plot Number',
        'Registration district and sub-registrar office jurisdiction',
        'Period for which EC is required (typically 13–30 years)',
        'Name of current and previous owners'
      ]},
      { heading: 'Documents Required', items: [
        'Application Form (Form 22 for AP)',
        'Certified copy of Sale Deed / Title Deed',
        'Property Tax paid receipts (latest)',
        'Aadhaar Card of the applicant',
        'Survey Number details and village/mandal information',
        'Fee challan (₹200 per year of search period)'
      ]},
      { heading: 'Where EC is Needed', items: [
        'Property purchase — to verify clean title',
        'Home loan application — mandatory for all banks',
        'Property registration — part of due diligence',
        'Land mutation / Patta transfer',
        'Building approval and construction permits',
        'Court disputes and legal proceedings'
      ]}
    ]
  },

  // ==================== COURT SERVICES ====================
  {
    id: 'legal-case-follow-up',
    category: 'court',
    icon: 'Gavel', iconColor: '#8B2127',
    title: 'Legal Case Follow-Up',
    subtitle: 'We follow your court case and keep you updated',
    sections: [
      { heading: 'What We Offer', items: [
        'Tracking your case using the CNR, FIR or case number',
        'Updates on WhatsApp after every hearing date',
        'Collecting copies of orders and judgments for you',
        'Explaining court terms in simple Telugu or English'
      ]},
      { heading: 'Please Note', items: [
        'We are not lawyers: an advocate advises you and appears in court, and you pay the advocate directly',
        'iN Empower takes no commission from lawyers'
      ]}
    ]
  },
  {
    id: 'lawyer-suggestion-vetting',
    category: 'court',
    icon: 'Search', iconColor: '#D4A373',
    title: 'Lawyer Suggestion & Vetting',
    subtitle: 'Curated, verified local lawyer network',
    sections: [
      { heading: 'Our Vetting Process', items: [
        'Categorized by specialization: Property, Criminal, Family, Corporate',
        'Bar Council enrollment verification',
        'Court activity check via e-Courts system',
        'Physical office inspection by our Local Buddy network',
        'Facilitated first consultation meeting'
      ]},
      { heading: 'Please Note', items: [
        'We are not lawyers: an advocate advises you and appears in court, and you pay the advocate directly',
        'iN Empower takes no commission from lawyers'
      ]}
    ]
  },

  // ==================== PROFESSIONAL SERVICES ====================
  {
    id: 'verified-driver-services',
    category: 'drivers',
    icon: 'Car', iconColor: '#2F5233',
    title: 'Verified Driver Services',
    subtitle: 'On-demand, daily & subscription driver hiring',
    sections: [
      { heading: 'Service Models', items: [
        'Hourly (On-Demand): Airport drops, party support',
        'Daily (Short-term): Outstation trips, house guests',
        'Subscription (Monthly): Daily commute, a replacement driver if yours is on leave'
      ]},
      { heading: 'Quality Assurance', items: [
        'Valid DL with "Active" status + Aadhaar + background check',
        'Physical road test for various car models',
        'iN Empower "Trust Seal" on profile'
      ]}
    ]
  },
  // ==================== HOSPITALS & HEALTHCARE ====================
  {
    id: 'medical-advising',
    category: 'healthcare',
    icon: 'Stethoscope', iconColor: '#E87A5D',
    title: 'Medical Advising',
    subtitle: 'Expert guidance on treatments & specialists in Prakasam district',
    sections: [
      { heading: 'OUR ASSISTANCE', items: [
        'Connecting with top specialists and hospitals in Prakasam district',
        'Second opinion coordination and consultation support',
        'Treatment cost estimation and planning'
      ]}
    ]
  },
  {
    id: 'patient-logistics',
    category: 'healthcare',
    icon: 'Ambulance', iconColor: '#213361',
    title: 'Patient Logistics',
    subtitle: 'End-to-end transport and mobility solutions',
    sections: [
      { heading: 'SERVICES PROVIDED', items: [
        'Ambulance booking and coordination',
        'Wheelchair-accessible transport for clinic visits',
        'Inter-city and local patient transfer'
      ]}
    ]
  },
  {
    id: 'patient-hospitality',
    category: 'healthcare',
    icon: 'Bed', iconColor: '#8B2127',
    title: 'Patient Hospitality',
    subtitle: 'Accommodation and care for patients & attendants',
    sections: [
      { heading: 'SUPPORT OFFERED', items: [
        'Short-term accommodation arrangements for family members',
        'Healthy meal delivery to hospital or guest room',
        'Post-discharge care and essential supplies coordination'
      ]}
    ]
  },
  {
    id: 'medicine-delivery',
    category: 'healthcare',
    icon: 'Pill', iconColor: '#2F5233',
    title: 'Medicine Delivery to Home',
    subtitle: 'Doorstep medicine delivery across Prakasam District',
    sections: [
      { heading: 'How It Works', items: [
        'Upload or share your prescription via WhatsApp or app',
        'Our verified pharmacy partner prepares your order',
        'Medicines delivered to your doorstep within 2–4 hours',
        'Pay iN Empower by UPI or cash, as told in your quote'
      ]},
      { heading: 'Coverage & Details', items: [
        'Available across Prakasam District — Ongole, Chirala, Kandukur & surrounding areas',
        'Prescription medicines, OTC drugs, surgical supplies',
        'Chronic medication monthly subscription available',
        'Emergency delivery within 1 hour (subject to availability)'
      ]},
      { heading: 'Documents Required', items: [
        'Valid prescription from a registered medical practitioner',
        'Aadhaar or any government ID for controlled substances',
        'Delivery address and contact number'
      ]}
    ]
  },
  {
    id: 'ambulance-services',
    category: 'healthcare',
    icon: 'Siren', iconColor: '#DC2626',
    title: 'Ambulance Services',
    subtitle: '24/7 emergency & non-emergency ambulance booking',
    sections: [
      { heading: 'Service Types', items: [
        'Emergency Ambulance — BLS (Basic Life Support) equipped',
        'ALS (Advanced Life Support) — for critical patients',
        'Non-emergency patient transport — clinic/hospital visits',
        'Inter-city patient transfer — Prakasam to Hyderabad, Guntur, Vijayawada'
      ]},
      { heading: 'Features', items: [
        '24/7 availability across Prakasam District',
        'Trained paramedic staff on board',
        'Oxygen, stretcher, first-aid equipment included',
        'Coordination with hospital emergency department'
      ]},
      { heading: 'How to Book', items: [
        'Call our emergency helpline or use Chat Buddy',
        'Share pickup location and patient condition',
        'Nearest available ambulance dispatched immediately',
        'Payment to iN Empower — cash, UPI or insurance, as told when you book'
      ]}
    ]
  },
  {
    id: 'physiotherapy',
    category: 'healthcare',
    icon: 'Activity', iconColor: '#213361',
    title: 'Physiotherapy',
    subtitle: 'Expert physiotherapy services for recovery and rehabilitation',
    sections: [
      { heading: 'Service Options', items: [
        'Clinic-Based Services — Advanced equipment and supervised environment',
        'Home-Based Care — Expert physiotherapists at your doorstep'
      ]},
      { heading: 'Conditions Treated', items: [
        'Post-surgical rehabilitation',
        'Sports injuries and pain management',
        'Neurological conditions and mobility issues',
        'Orthopedic and musculoskeletal problems'
      ]}
    ]
  },
  {"id": "surprise-party", "category": "drivers", "icon": "Gift", "iconColor": "#C2185B", "title": "Surprise Party Planning", "subtitle": "Birthdays, anniversaries, proposals, welcome-home & more — at your place or one we suggest", "sections": [{"heading": "What is the occasion?", "pick": "one", "items": ["Birthday", "Wedding anniversary", "Proposal / romantic surprise", "Welcome home (e.g. NRI arrival)", "Farewell / retirement", "Baby shower (Seemantham)", "Naming / cradle ceremony", "Other celebration"]}, {"heading": "Who is the surprise for?", "pick": "one", "items": ["Spouse / partner", "Child", "Parent / grandparent", "Friend", "Colleague / boss", "The whole family"]}, {"heading": "How many guests?", "pick": "one", "items": ["Just the two of us", "Up to 10", "10–30", "30–100", "Above 100"]}, {"heading": "When is the party?", "pick": "one", "items": ["Within 3 days", "This week", "In 1–2 weeks", "Later this month", "Just planning"]}, {"heading": "What time of day?", "pick": "one", "items": ["Morning", "Afternoon", "Evening", "Midnight surprise (12 AM)"]}, {"heading": "Where will the party be?", "pick": "one", "items": ["At our home", "At a place we have already booked", "Please suggest a place"]}, {"heading": "If we suggest a place, which kind do you like?", "pick": "one", "items": ["Restaurant / private dining", "Function hall / banquet", "Rooftop / garden / outdoor", "Hotel room / resort", "Not needed — we have a place"]}, {"heading": "What do you need for the party?", "items": ["Decoration, balloons & flowers", "Cake", "Food / catering", "Photographer & video", "Music / DJ", "Games & a host", "Gifts & return gifts", "Surprise delivery (cake & flowers at the door)"]}, {"heading": "Your budget", "pick": "one", "items": ["Under ₹5,000", "₹5,000–15,000", "₹15,000–50,000", "Above ₹50,000", "Not sure — please advise"]}, {"heading": "How It Works", "items": ["Tell us the occasion, the date and your budget", "Our team calls you to plan the surprise — and keeps it a secret", "You get ideas and a clear quote before anything is booked", "On the day, our team sets everything up before the guests arrive"]}, {"heading": "Good to Know", "items": ["For midnight surprises, please tell us at least 2 days before", "We never contact the person being surprised", "Venue, food and decoration costs are all in the quote — no hidden charges"]}]},
  {
    id: 'professional-chef-services',
    category: 'drivers',
    icon: 'ChefHat', iconColor: '#8B5A2B',
    title: 'Professional Chef Services',
    subtitle: 'Verified chefs for events, daily meals & subscriptions',
    sections: [
      { heading: 'Service Models', items: [
        'Hourly: Event cooking, special occasions',
        'Daily: Hosting events, house guests',
        'Subscription: Regular home meal prep'
      ]},
      { heading: 'Quality Assurance', items: [
        'Verified experience and culinary background',
        'Strict adherence to hygiene & safety standards',
        'Transparent user ratings and reviews visible'
      ]}
    ]
  },
  {
    id: 'professional-makeup-artist',
    category: 'drivers',
    icon: 'Sparkles', iconColor: '#E87A5D',
    title: 'Professional Makeup Artist',
    subtitle: 'Verified makeup artists for weddings & events',
    sections: [
      { heading: 'Service Offerings', items: [
        'Bridal & Pre-Wedding Makeup',
        'Party & Event Makeovers',
        'Professional Photoshoot Styling'
      ]},
      { heading: 'Quality Assurance', items: [
        'Portfolio of past work available for review',
        'Use of premium, skin-safe, authentic products',
        'Professional, punctual, and reliable service'
      ]}
    ]
  },
  {
    id: 'flex-printing-services',
    category: 'drivers',
    icon: 'Printer', iconColor: '#6D28D9',
    title: 'Banner & Sign Printing',
    subtitle: 'Cloth & eco-friendly banners, signboards and stickers — no plastic flex',
    sections: [
      { heading: 'Services Offered', items: [
        'Cloth & eco-friendly banners — birthdays, weddings, events',
        'Shop signboards & name boards',
        'Hoardings on cloth or eco-friendly material',
        'Vehicle branding & stickers',
        'One-way vision window film'
      ]},
      { heading: 'Process', items: [
        'Share your design or we create one for you',
        'Size selection and material choice',
        'Printing within 24–48 hours',
        'Installation support available for large formats'
      ]},
      { heading: 'Quality Assurance', items: [
        'High-resolution, durable printing materials',
        'Timely delivery and installation support',
        'Sample proofs before final print',
        'Competitive pricing from trusted local partners'
      ]},
      // Legal report (owner, 2 Nov 2026): AP banned plastic flex banners from 1 Nov 2022
      { heading: 'Please Note', items: [
        'Plastic flex banners are banned in Andhra Pradesh (since 1 November 2022) — we print on cloth or eco-friendly material only'
      ]}
    ]
  },
  {
    id: 'tailor-services',
    category: 'drivers',
    icon: 'Scissors', iconColor: '#B45309',
    title: 'Tailor Services (Home Visit)',
    subtitle: 'Expert tailors who visit your home for measurements',
    sections: [
      { heading: 'Service Offerings', items: [
        'Home visit for precise body measurements',
        'Men\'s tailoring — shirts, trousers, suits, kurtas',
        'Women\'s tailoring — blouses, salwar kameez, lehengas, dresses',
        'Alterations & fitting adjustments',
        'Custom design stitching from your fabric'
      ]},
      { heading: 'How It Works', items: [
        'Book a tailor visit through Chat Buddy or app',
        'Tailor arrives at your home at scheduled time',
        'Measurements taken and design discussed',
        'Delivery within 3–7 days depending on complexity',
        'Free alteration if fitting needs adjustment'
      ]},
      { heading: 'Quality Assurance', items: [
        'Experienced tailors specializing in custom fits',
        'Precise measurements taken at your convenience',
        'Timely delivery of finished garments',
        'Customer ratings & reviews visible'
      ]}
    ]
  },
  {"id": "driving-classes", "category": "drivers", "icon": "Car", "iconColor": "#1E7A46", "title": "Car Driving Classes", "subtitle": "Learn to drive with a patient, licensed trainer — plus help with your learner's and driving licence", "sections": [{"heading": "What do you need?", "kind": "choose", "items": ["Driving lessons from the start", "Practice — I know a little", "Refresher — I have a licence but lost confidence", "City traffic and highway practice", "Help with the learner's licence (LLR) and driving test"]}, {"heading": "Which car?", "pick": "one", "items": ["Manual (gear) car", "Automatic car"]}, {"heading": "Whose car for the classes?", "pick": "one", "items": ["Trainer's dual-control car", "My own car"]}, {"heading": "How many classes?", "pick": "one", "items": ["10 classes", "15 classes", "20 classes"]}, {"heading": "Preferred time", "pick": "one", "items": ["Early morning (6–8 am)", "Morning (8–11 am)", "Evening (4–7 pm)"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This week", "In 2–4 weeks", "Next month or later"]}, {"heading": "How It Works", "items": ["Tell us your area, the car and the timing", "We arrange a verified, licensed trainer and tell you the fee first", "Classes start near your home or at the driving school", "We help you book the learner's licence and the driving test at the RTO"]}, {"heading": "Good to Know", "items": ["You need a learner's licence (LLR) before practising on public roads — we can get it for you", "After the LLR, you can take the driving test for the permanent licence after 30 days", "A dual-control car lets the trainer brake for you, so first classes feel safe"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "Learner's licence (LLR), if you already have it", "2 passport-size photos"]}]},
  {
    id: 'dry-cleaning-services',
    category: 'drivers',
    icon: 'Shirt', iconColor: '#0891B2',
    title: 'Dry Cleaning & Laundry',
    subtitle: 'Premium doorstep laundry, dry clean & ironing',
    sections: [
      { heading: 'Services Offered', items: [
        'Premium dry cleaning — suits, sarees, lehengas, sherwanis',
        'Wash & fold — everyday clothes, bedsheets, curtains',
        'Steam ironing & pressing',
        'Stain removal & fabric care',
        'Shoe cleaning & leather care'
      ]},
      { heading: 'How It Works', items: [
        'Schedule a doorstep pickup via app or Chat Buddy',
        'Clothes inspected and tagged at your door',
        'Cleaned, pressed, and packaged professionally',
        'Delivered back to your doorstep within 48–72 hours',
        'Express service available (24-hour turnaround)'
      ]},
      { heading: 'Quality Assurance', items: [
        'Safe handling of delicate and premium fabrics',
        'Eco-friendly cleaning solvents',
        'Not happy with an item? We clean it again at no charge',
        'Ironed, folded, and delivered with care'
      ]}
    ]
  },
  {
    id: 'cleaning',
    category: 'drivers',
    icon: 'SprayCan', iconColor: '#E87A5D',
    title: 'Cleaning Services',
    subtitle: 'Professional deep cleaning and sanitation',
    sections: [
      { heading: 'Services Offered', items: [
        'Full home deep cleaning (bedrooms, halls, living areas)',
        'Individual kitchen scrubbing and degreasing',
        'Individual bathroom deep scrubbing and descaling',
        'Sofa and upholstery shampooing',
        'Overhead water tank maintenance and cleaning'
      ]},
      { heading: 'Quality Assurance', items: [
        'Use of eco-friendly, non-toxic, professional-grade chemicals',
        'Trained and background-verified cleaning professionals',
        'Equipment and supplies provided by the team',
        'Missed a spot? We come back and clean it again at no charge'
      ]}
    ]
  },
  {
    id: 'car-wash',
    category: 'drivers',
    icon: 'Car', iconColor: '#0891B2',
    title: 'Car Wash Service',
    subtitle: 'Professional car washing at your home or our facility',
    sections: [
      { heading: 'Service Models', items: [
        'Full Service (Pickup & Drop): Our driver picks up the car from your home, it gets a complete interior & exterior wash, and is delivered back.',
        'Body Wash at Home: Our workers visit your location with equipment and wash the car exterior and basic interior at your place.'
      ]},
      { heading: 'Quality Assurance', items: [
        'Use of microfiber cloths and premium cleaning agents',
        'Careful handling of interiors and electronics',
        'Verified drivers and cleaners for maximum safety'
      ]}
    ]
  },
  {
    id: 'logistics-category',
    category: 'drivers',
    icon: 'Truck',
    iconColor: '#222E62',
    title: 'Logistics, Packers & Movers',
    subtitle: 'House shifting, office moves, bike & car transport, goods transport',
    isCategoryCard: true,
    targetCategory: 'logistics',
    sections: []
  },
  {
    id: 'photography-category',
    category: 'drivers',
    icon: 'Camera', iconColor: '#8B2127',
    title: 'Photography Services',
    subtitle: 'Wedding, corporate, events & commercial photography',
    isCategoryCard: true,
    targetCategory: 'photography',
    sections: []
  },
  {
    id: 'pujari-category',
    category: 'drivers',
    icon: 'Flame',
    iconColor: '#FF9933',
    title: 'Pujari Services',
    subtitle: 'Vedic rituals, chanting mantras & guiding ceremonies',
    isCategoryCard: true,
    targetCategory: 'pujari',
    sections: []
  },
  // Health & hospital help inside Professional services (owner, 2 Nov 2026): opens the same services
  {
    id: 'healthcare-category',
    category: 'drivers',
    icon: 'Stethoscope',
    iconColor: '#E03A2F',
    title: 'Health & Hospital Help',
    subtitle: 'Doctor advice, ambulance, medicines, hospital stay & physiotherapy',
    isCategoryCard: true,
    targetCategory: 'healthcare',
    sections: []
  },
  {
    id: 'electricity-category',
    category: 'drivers',
    icon: 'Zap',
    iconColor: '#F59E0B',
    title: 'Electrician & Home Repairs',
    subtitle: 'Wiring, fans, geysers, plumbing, appliances & small fixes',
    isCategoryCard: true,
    targetCategory: 'electricity',
    sections: []
  },
  {
    id: 'ac-services-category',
    category: 'drivers',
    icon: 'Snowflake',
    iconColor: '#00B4D8',
    title: 'AC Services',
    subtitle: 'Installation, repair, cleaning & gas refilling',
    isCategoryCard: true,
    targetCategory: 'ac-services',
    sections: []
  },
  {
    id: 'architecture-category',
    category: 'drivers',
    icon: 'Ruler',
    iconColor: '#213361',
    title: 'Architecture',
    subtitle: 'House plans, approvals, structural design & 3D',
    isCategoryCard: true,
    targetCategory: 'architecture',
    sections: []
  },
  {
    id: 'painting-category',
    category: 'drivers',
    icon: 'PaintRoller',
    iconColor: '#B8261E',
    title: 'Painting & Waterproofing',
    subtitle: 'Inside and outside painting, waterproofing, doors & grills, texture walls',
    isCategoryCard: true,
    targetCategory: 'painting',
    sections: []
  },
  {
    id: 'interior-category',
    category: 'drivers',
    icon: 'Sofa',
    iconColor: '#8B2127',
    title: 'Interior Design',
    subtitle: 'Full home, modular kitchen, wardrobes & pooja room',
    isCategoryCard: true,
    targetCategory: 'interior',
    sections: []
  },
  {
    id: 'loans-category',
    category: 'drivers',
    icon: 'Landmark',
    iconColor: '#1E6B4A',
    title: 'Bank Loan Support',
    subtitle: 'Gold, crop/KCC, DWCRA, home, business & more — any bank in Prakasam',
    isCategoryCard: true,
    targetCategory: 'loans',
    sections: []
  },
  {
    id: 'exim-category',
    category: 'drivers',
    icon: 'Plane',
    iconColor: '#0F5E7A',
    title: 'EXIM Services (Export & Import)',
    subtitle: 'IEC, export registrations, shipping papers, freight & buyers',
    isCategoryCard: true,
    targetCategory: 'exim',
    sections: []
  },
  // Pest control inside Professional services (owner, 2 Nov 2026), last in the list
  {
    id: 'pest-control-category',
    category: 'drivers',
    icon: 'Bug',
    iconColor: '#2A9D5C',
    title: 'Pest Control',
    subtitle: 'Termites, mosquitoes, rats, cockroaches, bed bugs, snakes & weeds',
    isCategoryCard: true,
    targetCategory: 'pest-control',
    sections: []
  },
  {
    id: 'death-certificate',
    category: 'identity',
    icon: 'Scroll', iconColor: '#213361',
    title: 'Death Certificate',
    subtitle: 'Standard & Delayed Registration',
    sections: [
      { heading: 'Data Required', items: [
        'Full name of the deceased, exact date and time of death',
        'Place and cause of death'
      ]},
      { heading: 'Documents Required', items: [
        'Proof of birth of the deceased',
        'Ration card or Government ID (Aadhaar)',
        'Formal affidavit mentioning place and time of death',
        'For medico-legal: FIR, Form-2, Post Mortem Report',
        'For delayed: NABC, affidavit, identification proofs'
      ]}
    ]
  },
  // ==================== SUPPLIES ====================
  { id: 'granite', category: 'supplies', icon: 'Mountain', iconColor: '#8B2127', title: 'Granite', subtitle: 'Premium polished granite and natural stone' },
  { id: 'tiles', category: 'supplies', icon: 'LayoutGrid', iconColor: '#D4A373', title: 'Tiles', subtitle: 'Ceramic, vitrified, and decorative tiles' },
  { id: 'sand', category: 'supplies', icon: 'Box', iconColor: '#2F5233', title: 'Sand', subtitle: 'Reliable and legally sourced construction sand' },
  { id: 'cement', category: 'supplies', icon: 'Package', iconColor: '#708090', title: 'Cement', subtitle: 'High-quality cement from top brands' },
  { id: 'tmt-bars', category: 'supplies', icon: 'MoreHorizontal', iconColor: '#B0C4DE', title: 'TMT Bars', subtitle: 'Premium grade TMT steel bars' },
  { id: 'bricks', category: 'supplies', icon: 'Layers', iconColor: '#CD5C5C', title: 'Bricks', subtitle: 'High-strength traditional red clay bricks' },
  { id: 'cement-bricks', category: 'supplies', icon: 'Grid', iconColor: '#A9A9A9', title: 'Cement Bricks', subtitle: 'Cost-effective solid and hollow concrete blocks' },
  { id: 'transport', category: 'supplies', icon: 'Truck', iconColor: '#8B5A2B', title: 'Goods Transport', subtitle: 'Heavy-duty transport for materials' },
  { id: 'upvc-sheets', category: 'supplies', icon: 'Layers', iconColor: '#1F4E8C', title: 'UPVC Sheets', subtitle: 'UPVC roofing sheets and PVC wall & ceiling panels' },
  { id: 'upvc-marble-sheets', category: 'supplies', icon: 'Sparkles', iconColor: '#7A3E2A', title: 'PVC Marble Sheets', subtitle: 'Marble-look PVC wall sheets for halls, TV walls and pooja rooms' },
  { id: 'furniture', category: 'supplies', icon: 'Armchair', iconColor: '#8B2127', title: 'Furniture', subtitle: 'Custom and readymade premium furniture' },
  { id: 'events', category: 'supplies', icon: 'PartyPopper', iconColor: '#D4A373', title: 'Events', subtitle: 'Event management and decoration supplies' },
  { id: 'catering', category: 'supplies', icon: 'Utensils', iconColor: '#2F5233', title: 'Catering', subtitle: 'Professional catering services' },
  { id: 'cold-pressed-oils', category: 'supplies', icon: 'Droplet', iconColor: '#8B5A2B', title: 'Cold-Pressed Oils', subtitle: 'Pure, locally extracted cold-pressed oils' },

  // ==================== PHOTOGRAPHY ====================
  { id: 'wedding-photography', category: 'photography', icon: 'Camera', iconColor: '#8B2127', title: 'Wedding Photography', subtitle: 'Pre-wedding, traditional & candid photography', sections: [{heading: "What to Cover", items: ["Engagement", "Pre-wedding shoot", "Haldi & Mehendi", "Wedding ceremony", "Reception"]}, {heading: "Deliverables", items: ["Traditional photos", "Candid photos", "Cinematic video", "Drone shots", "Printed album"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Date and time of the shoot", "Venue or location (town / area)", "Number of hours or days", "Any reference photos you like"]}] },
  { id: 'corporate-photography', category: 'photography', icon: 'Briefcase', iconColor: '#213361', title: 'Corporate Photography', subtitle: 'Corporate events, headshots, and office shoots', sections: [{heading: "What to Cover", items: ["Team & office photos", "Professional headshots", "Conferences & seminars", "Product launches & inaugurations"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Date and time of the shoot", "Venue or location (town / area)", "Number of hours or days", "Any reference photos you like"]}] },
  { id: 'advertising-photography', category: 'photography', icon: 'Megaphone', iconColor: '#FF9933', title: 'Advertising Photography', subtitle: 'Commercial, fashion & advertising campaigns', sections: [{heading: "What to Cover", items: ["Product advertisements", "Social media creatives", "Hoardings & print ads", "Fashion & model shoots"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Date and time of the shoot", "Venue or location (town / area)", "Number of hours or days", "Any reference photos you like"]}] },
  { id: 'event-photography', category: 'photography', icon: 'PartyPopper', iconColor: '#D4A373', title: 'Event Photography', subtitle: 'Birthday parties, gatherings & special occasions', sections: [{heading: "What to Cover", items: ["Birthday party", "Naming ceremony / Annaprasana", "Housewarming", "School & college events", "Temple festivals & community events"]}, {heading: "Deliverables", items: ["Edited photos", "Event video", "Printed album"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Date and time of the shoot", "Venue or location (town / area)", "Number of hours or days", "Any reference photos you like"]}] },
  { id: 'portrait-photography', category: 'photography', icon: 'User', iconColor: '#2F5233', title: 'Portrait Photography', subtitle: 'Professional portraits and portfolio shoots', sections: [{heading: "What to Cover", items: ["Individual portraits", "Family photos", "Maternity shoot", "Baby & kids shoot", "Portfolio for models / actors"]}, {heading: "Where", items: ["Studio", "Outdoor location", "At your home"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Date and time of the shoot", "Venue or location (town / area)", "Number of hours or days", "Any reference photos you like"]}] },
  { id: 'product-photography', category: 'photography', icon: 'Package', iconColor: '#8B5A2B', title: 'Product Photography', subtitle: 'High-quality e-commerce and catalog shoots', sections: [{heading: "What to Cover", items: ["E-commerce (white background)", "Lifestyle product shots", "Catalogue & brochure", "Food & menu photos"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Number of products", "Where they will be used (website, Amazon, print)", "Any reference photos you like"]}] },
  { id: 'real-estate-photography', category: 'photography', icon: 'Home', iconColor: '#E87A5D', title: 'Real Estate Photography', subtitle: 'Property interiors, exteriors, and drone shoots', sections: [{heading: "What to Cover", items: ["House / flat for sale or rent", "Plots & layouts (drone)", "Shops & commercial spaces", "Walk-through video"]}, {heading: "How It Works", items: ["Tell us the date, place and how many hours you need", "We share sample work from verified local photographers and a clear quote", "Confirm and book — the photographer arrives on time", "Edited photos are shared online; prints and albums on request"]}, {heading: "What to Share With Us", items: ["Property address (town / area)", "Size of the property", "Preferred date and time"]}] },

  // ==================== PUJARI ====================
  { id: 'pujari-life-milestones', category: 'pujari', icon: 'Users', iconColor: '#8B2127', title: 'Life Milestones', subtitle: 'Hindu weddings, naming & thread ceremonies', sections: [{heading: "Ceremonies", items: ["Naming ceremony (Namakaranam)", "First feeding (Annaprasana)", "Thread ceremony (Upanayanam)", "Wedding (Vivaham)", "60th birthday (Shashtipoorthi)"]}, {heading: "How It Works", items: ["Tell us the occasion, date and place", "An experienced pujari fixes the muhurtham with you", "We share the puja samagri list — or arrange the items for you", "The pujari arrives on time and performs the ritual in Telugu / Sanskrit"]}] },
  { id: 'pujari-property-beginnings', category: 'pujari', icon: 'Home', iconColor: '#2F5233', title: 'Property & New Beginnings', subtitle: 'Housewarming (Griha Pravesh) & office inaugurations', sections: [{heading: "Ceremonies", items: ["Housewarming (Gruhapravesam)", "Bhoomi puja (foundation)", "Shop / office opening", "Vehicle puja", "Vastu shanti"]}, {heading: "How It Works", items: ["Tell us the occasion, date and place", "An experienced pujari fixes the muhurtham with you", "We share the puja samagri list — or arrange the items for you", "The pujari arrives on time and performs the ritual in Telugu / Sanskrit"]}] },
  { id: 'pujari-vedic-rituals', category: 'pujari', icon: 'Flame', iconColor: '#FF9933', title: 'Vedic Rituals & Pujas', subtitle: 'Satyanarayana Vratam, Navagraha Puja & Homam', sections: [{heading: "Ceremonies", items: ["Satyanarayana Vratam", "Ganapathi Homam", "Navagraha Shanti", "Rudrabhishekam", "Lakshmi Puja", "Chandi Homam"]}, {heading: "How It Works", items: ["Tell us the occasion, date and place", "An experienced pujari fixes the muhurtham with you", "We share the puja samagri list — or arrange the items for you", "The pujari arrives on time and performs the ritual in Telugu / Sanskrit"]}] },
  { id: 'pujari-ancestral-rites', category: 'pujari', icon: 'ScrollText', iconColor: '#D4A373', title: 'Ancestral Rites', subtitle: 'Shraddha and last rites (Apara Kriyas)', sections: [{heading: "Ceremonies", items: ["Annual Sraddham (Taddinam)", "Masikam (monthly rites)", "Pinda Pradanam", "Asthi Nimajjanam"]}, {heading: "How It Works", items: ["Tell us the date and place (home, temple or river ghat)", "An experienced pujari guides the family through every step", "We share the samagri list — or arrange the items for you", "Handled with care and respect for your family's customs"]}] },

  // ==================== ARCHITECTURE ====================
  {"id": "arch-house-plan", "category": "architecture", "icon": "Home", "iconColor": "#213361", "title": "New House Plan", "subtitle": "Floor plan, front elevation and Vastu layout for your new house", "sections": [{"heading": "What do you need?", "items": ["Floor plan (room layout)", "Front elevation design", "Vastu-compliant layout", "3D front view", "Working drawings for construction"]}, {"heading": "Site size", "pick": "one", "items": ["Up to 100 sq. yards", "100–200 sq. yards", "200–300 sq. yards", "Above 300 sq. yards"]}, {"heading": "Which way does the site face?", "pick": "one", "items": ["East facing", "North facing", "West facing", "South facing", "Not sure"]}, {"heading": "How many floors?", "pick": "one", "items": ["Ground floor only", "G+1", "G+2", "G+3 or more"]}, {"heading": "House style", "pick": "one", "items": ["Modern", "Traditional Andhra (courtyard / manduva)", "Contemporary with Vastu", "Not sure"]}, {"heading": "Construction budget", "pick": "one", "items": ["Under ₹20 lakh", "₹20–40 lakh", "₹40–75 lakh", "Above ₹75 lakh"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us about your site and what you want to build", "A registered architect (Council of Architecture) from our network calls you and visits the site", "You get a clear quote for the design work before anything starts", "Drawings are shared step by step; changes are discussed with you"]}, {"heading": "What to Share With Us", "items": ["Site photos and location (on WhatsApp after your request)", "Site measurements or the survey sketch, if you have it", "Any house designs you like (photos or links)"]}]},
  {"id": "arch-approval-drawings", "category": "architecture", "icon": "FileCheck", "iconColor": "#2F5233", "title": "Building Plan Approval", "subtitle": "Approval drawings and online APDPMS submission", "sections": [{"heading": "What do you need?", "items": ["Approval drawings as per AP building rules", "Online submission on APDPMS", "Follow-up with Municipality / Panchayat", "Site measurement"]}, {"heading": "Which local body?", "pick": "one", "items": ["Municipal Corporation (Ongole)", "Municipality", "Gram Panchayat", "Not sure"]}, {"heading": "How many floors?", "pick": "one", "items": ["Ground floor only", "G+1", "G+2", "G+3 or more"]}, {"heading": "Documents Required", "items": ["Registered sale deed / title document", "Link documents (previous deeds)", "Encumbrance Certificate (EC)", "Latest property tax / house tax receipt", "Site sketch or survey plan"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us about your site and what you want to build", "A registered architect or licensed engineer from our network calls you and visits the site", "You get a clear quote for the design work before anything starts", "Drawings are shared step by step; changes are discussed with you"]}]},
  {"id": "arch-structural", "category": "architecture", "icon": "Building", "iconColor": "#3E4A61", "title": "Structural Design", "subtitle": "Columns, footings, beams and slabs designed safely", "sections": [{"heading": "What do you need?", "items": ["Column and footing design", "Beam and slab design", "Soil test arrangement", "Structural stability certificate"]}, {"heading": "Site size", "pick": "one", "items": ["Up to 100 sq. yards", "100–200 sq. yards", "200–300 sq. yards", "Above 300 sq. yards"]}, {"heading": "How many floors?", "pick": "one", "items": ["Ground floor only", "G+1", "G+2", "G+3 or more"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us about your site and what you want to build", "A qualified structural engineer from our network calls you and visits the site", "You get a clear quote for the design work before anything starts", "Drawings are shared step by step; changes are discussed with you"]}]},
  {"id": "arch-3d-elevation", "category": "architecture", "icon": "Layers", "iconColor": "#6B2E5F", "title": "3D Elevation & Walkthrough", "subtitle": "See your house in 3D before you build", "sections": [{"heading": "What do you need?", "items": ["3D front elevation", "Colour and material options", "Interior 3D views", "Walkthrough video"]}, {"heading": "How many floors?", "pick": "one", "items": ["Ground floor only", "G+1", "G+2", "G+3 or more"]}, {"heading": "House style", "pick": "one", "items": ["Modern", "Traditional Andhra (courtyard / manduva)", "Contemporary with Vastu", "Not sure"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us about your site and what you want to build", "A registered architect (Council of Architecture) from our network calls you and visits the site", "You get a clear quote for the design work before anything starts", "Drawings are shared step by step; changes are discussed with you"]}, {"heading": "What to Share With Us", "items": ["Site photos and location (on WhatsApp after your request)", "Site measurements or the survey sketch, if you have it", "Any house designs you like (photos or links)"]}]},
  {"id": "arch-renovation", "category": "architecture", "icon": "Wrench", "iconColor": "#B5523A", "title": "Renovation & Extension", "subtitle": "Add a floor, extend rooms or re-plan an old house", "sections": [{"heading": "What do you need?", "items": ["Add a new floor", "Extend rooms", "Re-plan the layout", "Strength check of the old building", "Approval for the changes"]}, {"heading": "Age of the building", "pick": "one", "items": ["Under 10 years", "10–25 years", "Over 25 years", "Not sure"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us about your site and what you want to build", "A registered architect (Council of Architecture) from our network calls you and visits the site", "You get a clear quote for the design work before anything starts", "Drawings are shared step by step; changes are discussed with you"]}, {"heading": "What to Share With Us", "items": ["Site photos and location (on WhatsApp after your request)", "Site measurements or the survey sketch, if you have it", "Any house designs you like (photos or links)"]}]},
  {"id": "arch-commercial", "category": "architecture", "icon": "Store", "iconColor": "#C2611F", "title": "Commercial Building", "subtitle": "Shops, complexes, function halls, schools and godowns", "sections": [{"heading": "What are you building?", "pick": "one", "items": ["Shops / commercial complex", "Function hall / kalyana mandapam", "School or hospital", "Godown / warehouse", "Rice mill / small factory"]}, {"heading": "What do you need?", "items": ["Plan and elevation", "Approval drawings", "Structural design", "Fire NOC guidance", "3D views"]}, {"heading": "Site size", "pick": "one", "items": ["Up to 100 sq. yards", "100–200 sq. yards", "200–300 sq. yards", "Above 300 sq. yards"]}, {"heading": "How many floors?", "pick": "one", "items": ["Ground floor only", "G+1", "G+2", "G+3 or more"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us about your site and what you want to build", "A registered architect (Council of Architecture) from our network calls you and visits the site", "You get a clear quote for the design work before anything starts", "Drawings are shared step by step; changes are discussed with you"]}, {"heading": "What to Share With Us", "items": ["Site photos and location (on WhatsApp after your request)", "Site measurements or the survey sketch, if you have it", "Any house designs you like (photos or links)"]}]},

  // ==================== INTERIOR DESIGN ====================
  {"id": "interior-full-home", "category": "interior", "icon": "Home", "iconColor": "#8B2127", "title": "Full Home Interiors", "subtitle": "Kitchen, wardrobes, false ceiling, pooja room — all in one", "sections": [{"heading": "What do you need?", "items": ["Modular kitchen", "Wardrobes", "TV unit", "False ceiling", "Pooja room", "Painting and lighting"]}, {"heading": "Home size", "pick": "one", "items": ["1 BHK", "2 BHK", "3 BHK", "Independent house / villa"]}, {"heading": "New or existing home?", "pick": "one", "items": ["New house (just built)", "Existing house (renovation)"]}, {"heading": "Style", "pick": "one", "items": ["Modern", "Traditional (teak and brass)", "Contemporary", "Not sure"]}, {"heading": "Budget", "pick": "one", "items": ["Under ₹3 lakh", "₹3–6 lakh", "₹6–10 lakh", "Above ₹10 lakh"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us the space and what you want", "A verified interior designer visits, measures and understands your needs", "You get a 3D design and a clear quote before work starts", "Work is done by trusted local carpenters and fitters, checked by our team"]}, {"heading": "What to Share With Us", "items": ["Photos of the space (on WhatsApp after your request)", "Room measurements, if you have them", "Design photos you like (Pinterest, Instagram, neighbours' homes)"]}]},
  {"id": "interior-kitchen", "category": "interior", "icon": "ChefHat", "iconColor": "#B7832F", "title": "Modular Kitchen", "subtitle": "Cabinets, granite counter, chimney space and storage", "sections": [{"heading": "What do you need?", "items": ["Cabinets and shutters", "Granite counter top", "Chimney and hob space", "Tall unit and pull-out storage", "Utility / wash area"]}, {"heading": "Kitchen shape", "pick": "one", "items": ["L-shape", "Parallel", "U-shape", "Straight", "Not sure"]}, {"heading": "Material", "pick": "one", "items": ["Plywood (BWP, waterproof)", "Multiwood / PVC", "Stainless steel", "Not sure"]}, {"heading": "Budget", "pick": "one", "items": ["Under ₹1 lakh", "₹1–2 lakh", "₹2–4 lakh", "Above ₹4 lakh"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us the space and what you want", "A verified interior designer visits, measures and understands your needs", "You get a 3D design and a clear quote before work starts", "Work is done by trusted local carpenters and fitters, checked by our team"]}, {"heading": "What to Share With Us", "items": ["Photos of the space (on WhatsApp after your request)", "Room measurements, if you have them", "Design photos you like (Pinterest, Instagram, neighbours' homes)"]}]},
  {"id": "interior-bedroom", "category": "interior", "icon": "Bed", "iconColor": "#213361", "title": "Bedroom & Wardrobes", "subtitle": "Wardrobes, cot with storage, dressing and study units", "sections": [{"heading": "What do you need?", "items": ["Wardrobe (sliding or hinged)", "Cot with storage", "Dressing unit", "Study table", "Wall panelling"]}, {"heading": "How many bedrooms?", "pick": "one", "items": ["1", "2", "3", "4 or more"]}, {"heading": "Budget", "pick": "one", "items": ["Under ₹1 lakh", "₹1–3 lakh", "₹3–5 lakh", "Above ₹5 lakh"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us the space and what you want", "A verified interior designer visits, measures and understands your needs", "You get a 3D design and a clear quote before work starts", "Work is done by trusted local carpenters and fitters, checked by our team"]}, {"heading": "What to Share With Us", "items": ["Photos of the space (on WhatsApp after your request)", "Room measurements, if you have them", "Design photos you like (Pinterest, Instagram, neighbours' homes)"]}]},
  {"id": "interior-living", "category": "interior", "icon": "Sofa", "iconColor": "#2F5233", "title": "Living, Dining & False Ceiling", "subtitle": "TV unit, false ceiling, wall panels and lighting", "sections": [{"heading": "What do you need?", "items": ["TV unit", "False ceiling (gypsum / POP)", "Wall panelling", "Lighting", "Dining area", "Crockery unit"]}, {"heading": "Home size", "pick": "one", "items": ["1 BHK", "2 BHK", "3 BHK", "Independent house / villa"]}, {"heading": "Budget", "pick": "one", "items": ["Under ₹1 lakh", "₹1–3 lakh", "₹3–6 lakh", "Above ₹6 lakh"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us the space and what you want", "A verified interior designer visits, measures and understands your needs", "You get a 3D design and a clear quote before work starts", "Work is done by trusted local carpenters and fitters, checked by our team"]}, {"heading": "What to Share With Us", "items": ["Photos of the space (on WhatsApp after your request)", "Room measurements, if you have them", "Design photos you like (Pinterest, Instagram, neighbours' homes)"]}]},
  {"id": "interior-pooja", "category": "interior", "icon": "Flame", "iconColor": "#C98A1A", "title": "Pooja Room", "subtitle": "Teak mandir, marble or granite platform, Vastu placement", "sections": [{"heading": "What kind?", "pick": "one", "items": ["Separate pooja room", "Pooja unit in the hall or kitchen"]}, {"heading": "Material", "pick": "one", "items": ["Teak wood", "Marble", "Granite", "Not sure"]}, {"heading": "What do you need?", "items": ["Carved door and frame", "Mandir with shelves", "Brass bells and lighting", "Vastu placement (north-east)"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us the space and what you want", "A verified interior designer visits, measures and understands your needs", "You get a 3D design and a clear quote before work starts", "Work is done by trusted local carpenters and fitters, checked by our team"]}, {"heading": "What to Share With Us", "items": ["Photos of the space (on WhatsApp after your request)", "Room measurements, if you have them", "Design photos you like (Pinterest, Instagram, neighbours' homes)"]}]},
  {"id": "interior-commercial", "category": "interior", "icon": "Store", "iconColor": "#1F6F78", "title": "Shop & Office Interiors", "subtitle": "Shops, showrooms, offices, clinics and restaurants", "sections": [{"heading": "What kind of space?", "pick": "one", "items": ["Shop / showroom", "Office", "Clinic / hospital", "Restaurant / café", "Salon / boutique"]}, {"heading": "What do you need?", "items": ["Counters and display racks", "Workstations and cabins", "False ceiling and lighting", "Signboard", "Flooring"]}, {"heading": "Area", "pick": "one", "items": ["Under 300 sq. ft", "300–1,000 sq. ft", "Above 1,000 sq. ft"]}, {"heading": "Budget", "pick": "one", "items": ["Under ₹2 lakh", "₹2–5 lakh", "₹5–10 lakh", "Above ₹10 lakh"]}, {"heading": "When do you want to start?", "pick": "one", "items": ["This month", "In 1–3 months", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us the space and what you want", "A verified interior designer visits, measures and understands your needs", "You get a 3D design and a clear quote before work starts", "Work is done by trusted local carpenters and fitters, checked by our team"]}, {"heading": "What to Share With Us", "items": ["Photos of the space (on WhatsApp after your request)", "Room measurements, if you have them", "Design photos you like (Pinterest, Instagram, neighbours' homes)"]}]},

  // ==================== BANK LOANS ====================
  {"id": "loan-gold", "category": "loans", "icon": "Gem", "iconColor": "#1E6B4A", "title": "Gold Loan", "subtitle": "Money against your gold jewellery — usually the same day", "sections": [{"heading": "Good to Know", "items": ["Banks usually lend up to about 75% of the gold's value", "Bank gold loans are usually cheaper than private pawn shops", "You get your gold back when you repay"]}, {"heading": "Gold weight (approx.)", "pick": "one", "items": ["Under 20 grams", "20–50 grams", "50–100 grams", "Above 100 grams"]}, {"heading": "What is it for?", "pick": "one", "items": ["Farming", "Business", "Family need / medical", "Education"]}, {"heading": "Preferred bank", "pick": "one", "items": ["SBI", "Union Bank", "Canara Bank", "Indian Bank", "Bank of Baroda", "Grameena Bank", "Cooperative bank (DCCB)", "Private bank", "Any — suggest the best"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card (for larger amounts)", "2 passport-size photos", "Your gold jewellery"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-agriculture", "category": "loans", "icon": "Tractor", "iconColor": "#1E6B4A", "title": "Crop Loan & Kisan Credit Card", "subtitle": "Crop loans, KCC new or renewal — tenant farmers too", "sections": [{"heading": "Good to Know", "items": ["KCC covers crops, dairy, poultry and fisheries", "Prompt repayment of crop loans gets an interest benefit from the government", "Tenant farmers can apply with a CCRC (Crop Cultivator Rights Card)"]}, {"heading": "What do you need?", "pick": "one", "items": ["New crop loan / KCC", "KCC renewal", "Dairy / poultry / fisheries loan", "Tractor or farm equipment", "Borewell / drip irrigation"]}, {"heading": "Land you farm", "pick": "one", "items": ["Own land — under 2 acres", "Own land — 2 to 5 acres", "Own land — above 5 acres", "Tenant farmer (koulu)"]}, {"heading": "Preferred bank", "pick": "one", "items": ["SBI", "Union Bank", "Canara Bank", "Indian Bank", "Bank of Baroda", "Grameena Bank", "Cooperative bank (DCCB)", "Private bank", "Any — suggest the best"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Pattadar passbook (or CCRC for tenant farmers)", "Adangal / 1-B", "Crop details for this season", "No-dues from other banks (if asked)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-shg", "category": "loans", "icon": "Users", "iconColor": "#1E6B4A", "title": "DWCRA / SHG Group Loan", "subtitle": "Bank loans for women's self-help groups", "sections": [{"heading": "Good to Know", "items": ["Women's groups get bank loans through SERP (villages) and MEPMA (towns)", "Regular savings and repayment increase the group's next loan", "Members can use their share for small businesses"]}, {"heading": "Your group", "pick": "one", "items": ["New group (first loan)", "Existing group (repeat loan)"]}, {"heading": "Group size", "pick": "one", "items": ["10 members", "11–15 members", "Above 15 members"]}, {"heading": "Preferred bank", "pick": "one", "items": ["SBI", "Union Bank", "Canara Bank", "Indian Bank", "Bank of Baroda", "Grameena Bank", "Cooperative bank (DCCB)", "Private bank", "Any — suggest the best"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Group resolution", "Savings book / group bank passbook", "Aadhaar of all members", "Meeting minutes book", "Grading from SERP / MEPMA (for repeat loans)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-home", "category": "loans", "icon": "Home", "iconColor": "#1E6B4A", "title": "Home Loan", "subtitle": "Build, buy or extend your house", "sections": [{"heading": "Good to Know", "items": ["Banks usually lend 75–90% of the house value", "First-time buyers may get PMAY interest subsidy (income limits apply)", "An approved building plan is needed for construction loans"]}, {"heading": "Loan for", "pick": "one", "items": ["Build a new house", "Buy a house / flat", "Buy plot + build", "Extend / renovate"]}, {"heading": "Loan amount", "pick": "one", "items": ["Under ₹10 lakh", "₹10–25 lakh", "₹25–50 lakh", "Above ₹50 lakh"]}, {"heading": "How do you earn?", "pick": "one", "items": ["Salaried (govt.)", "Salaried (private)", "Business / shop", "Farmer", "Daily wage / other"]}, {"heading": "Do you know your CIBIL score?", "pick": "one", "items": ["Above 750", "650–750", "Below 650", "Don't know"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Bank statement (6 months)", "Salary slips or ITR (2 years)", "Sale deed and link documents", "Encumbrance Certificate (EC)", "Approved plan & estimate (for construction)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-business", "category": "loans", "icon": "Briefcase", "iconColor": "#1E6B4A", "title": "Business Loan (Mudra)", "subtitle": "Start or grow a shop or small business", "sections": [{"heading": "Good to Know", "items": ["Mudra loans: Shishu up to ₹50,000, Kishor up to ₹5 lakh, Tarun up to ₹10 lakh, Tarun Plus up to ₹20 lakh", "Small Mudra loans usually need no collateral", "A simple project report helps get approval"]}, {"heading": "Loan amount", "pick": "one", "items": ["Up to ₹50,000", "₹50,000–5 lakh", "₹5–10 lakh", "Above ₹10 lakh"]}, {"heading": "Your business", "pick": "one", "items": ["New business", "Running for under 2 years", "Running for 2+ years"]}, {"heading": "Do you know your CIBIL score?", "pick": "one", "items": ["Above 750", "650–750", "Below 650", "Don't know"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Udyam registration", "Shop / trade licence", "Business bank statement (6–12 months)", "Quotations for machines or stock", "GST certificate (if any)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-education", "category": "loans", "icon": "GraduationCap", "iconColor": "#1E6B4A", "title": "Education Loan", "subtitle": "For studies in India or abroad", "sections": [{"heading": "Good to Know", "items": ["Loans up to ₹7.5 lakh usually need no collateral", "Apply through the Vidya Lakshmi portal to reach many banks at once", "Repayment usually starts after the course"]}, {"heading": "Where will you study?", "pick": "one", "items": ["In Andhra Pradesh", "Other states in India", "Abroad"]}, {"heading": "Loan amount", "pick": "one", "items": ["Under ₹4 lakh", "₹4–7.5 lakh", "₹7.5–20 lakh", "Above ₹20 lakh"]}, {"heading": "Preferred bank", "pick": "one", "items": ["SBI", "Union Bank", "Canara Bank", "Indian Bank", "Bank of Baroda", "Grameena Bank", "Cooperative bank (DCCB)", "Private bank", "Any — suggest the best"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Admission letter", "Fee structure", "10th, Inter and degree marks memos", "Parent income proof", "Property papers (for larger loans)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-vehicle", "category": "loans", "icon": "Car", "iconColor": "#1E6B4A", "title": "Vehicle Loan", "subtitle": "Two-wheeler, car, auto or goods vehicle", "sections": [{"heading": "Good to Know", "items": ["Banks usually fund 80–90% of the on-road price", "Tractor loans are under Crop Loan & KCC"]}, {"heading": "Vehicle", "pick": "one", "items": ["Two-wheeler", "Car", "Auto", "Goods vehicle"]}, {"heading": "New or used?", "pick": "one", "items": ["New", "Used"]}, {"heading": "How do you earn?", "pick": "one", "items": ["Salaried (govt.)", "Salaried (private)", "Business / shop", "Farmer", "Daily wage / other"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Vehicle quotation", "Income proof", "Driving licence", "Bank statement (6 months)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-property", "category": "loans", "icon": "Landmark", "iconColor": "#1E6B4A", "title": "Loan Against Property", "subtitle": "Mortgage your house, site or shop for a larger loan", "sections": [{"heading": "Good to Know", "items": ["Banks usually lend 50–65% of the property value", "Clear title and EC are the most important papers"]}, {"heading": "Property", "pick": "one", "items": ["House", "Open site / plot", "Shop / commercial", "Agricultural land"]}, {"heading": "Loan amount", "pick": "one", "items": ["Under ₹10 lakh", "₹10–25 lakh", "₹25–50 lakh", "Above ₹50 lakh"]}, {"heading": "How do you earn?", "pick": "one", "items": ["Salaried (govt.)", "Salaried (private)", "Business / shop", "Farmer", "Daily wage / other"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Sale deed and link documents", "Encumbrance Certificate (EC)", "Latest property tax receipt", "Income proof"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-personal", "category": "loans", "icon": "Banknote", "iconColor": "#1E6B4A", "title": "Personal Loan", "subtitle": "For marriage, medical or family needs", "sections": [{"heading": "Good to Know", "items": ["Mostly for salaried people and pensioners", "A CIBIL score above 750 gets faster approval and better rates"]}, {"heading": "Loan amount", "pick": "one", "items": ["Under ₹1 lakh", "₹1–3 lakh", "₹3–5 lakh", "Above ₹5 lakh"]}, {"heading": "How do you earn?", "pick": "one", "items": ["Salaried (govt.)", "Salaried (private)", "Business / shop", "Farmer", "Daily wage / other"]}, {"heading": "Do you know your CIBIL score?", "pick": "one", "items": ["Above 750", "650–750", "Below 650", "Don't know"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "2 passport-size photos", "Salary slips (3 months) or pension order", "Bank statement (6 months)", "Employer ID card"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},
  {"id": "loan-cibil", "category": "loans", "icon": "ShieldCheck", "iconColor": "#1E6B4A", "title": "CIBIL Score Check & Error Correction", "subtitle": "Know your score and get wrong entries corrected", "sections": [{"heading": "Good to Know", "items": ["Your CIBIL score decides if banks give you a loan", "Checking your own score does not reduce it", "Wrong entries (old closed loans) can be disputed and corrected"]}, {"heading": "What do you need?", "pick": "one", "items": ["Check my score", "My loan was rejected — find out why", "Correct a wrong entry", "Tips to keep a good score"]}, {"heading": "Do you know your CIBIL score?", "pick": "one", "items": ["Above 750", "650–750", "Below 650", "Don't know"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Urgently (this week)", "Within a month"]}, {"heading": "Documents Required", "items": ["Aadhaar card", "PAN card", "Loan closure letters / NOCs (if correcting)"]}, {"heading": "How It Works", "items": ["Tell us the loan and your bank", "Your Local Buddy checks eligibility and lists the papers", "We prepare the file and go to the branch with you", "We follow up and update you on WhatsApp"]}, {"heading": "Please Note", "items": ["We explain your report and help you dispute wrong entries with the credit bureau — no one can buy or fix a score", "iN Empower is not a bank or lender — we help you apply and follow up", "The bank decides approval, amount and interest rate", "Our help is free for you — we never charge the borrower"]}]},

  // ==================== EXIM (EXPORT & IMPORT) ====================
  {"id": "exim-iec", "category": "exim", "icon": "FileKey", "iconColor": "#0F5E7A", "title": "Import Export Code (IEC)", "subtitle": "Get your IEC from DGFT — the first step to export or import", "sections": [{"heading": "What do you need?", "items": ["New IEC registration", "Update or link IEC (yearly update)", "GST registration along with IEC", "Udyam registration"]}, {"heading": "Your business type", "pick": "one", "items": ["Proprietor", "Partnership firm", "Company / LLP", "Not registered yet"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "Documents Required", "items": ["PAN card (business or proprietor)", "Aadhaar card", "Cancelled cheque / bank certificate", "Business address proof (rent deed / tax receipt / electricity bill)", "GST certificate (if you have one)", "Digital signature (for companies)"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},
  {"id": "exim-registrations", "category": "exim", "icon": "FileCheck", "iconColor": "#0F5E7A", "title": "Export Registrations (RCMC)", "subtitle": "Export council membership, LUT, port AD code", "sections": [{"heading": "What do you need?", "items": ["RCMC with the export council (CAPEXIL, MPEDA, APEDA, Spices Board, Tobacco Board)", "GST LUT for exports without paying IGST", "AD code registration at the port", "FSSAI / quality registrations for food exports"]}, {"heading": "What do you export or import?", "pick": "one", "items": ["Granite & stone", "Seafood / aqua (shrimp)", "Tobacco", "Chillies & spices", "Rice, pulses & grains", "Cotton & textiles", "Machinery / raw material", "Other"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "Documents Required", "items": ["IEC certificate", "GST certificate", "PAN card", "Bank AD code letter", "Business address proof"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},
  {"id": "exim-documentation", "category": "exim", "icon": "FileSignature", "iconColor": "#0F5E7A", "title": "Shipping Documents", "subtitle": "Invoice, packing list, certificate of origin, shipping bill", "sections": [{"heading": "What do you need?", "items": ["Commercial invoice and packing list", "Certificate of origin", "Phytosanitary / health / quality certificate", "Shipping bill filing (through customs broker)", "Bill of lading follow-up"]}, {"heading": "What do you export or import?", "pick": "one", "items": ["Granite & stone", "Seafood / aqua (shrimp)", "Tobacco", "Chillies & spices", "Rice, pulses & grains", "Cotton & textiles", "Machinery / raw material", "Other"]}, {"heading": "How will it go?", "pick": "one", "items": ["By sea (container)", "By air", "By road (Nepal / Bangladesh)"]}, {"heading": "Which stage are you at?", "pick": "one", "items": ["Order received", "Goods are ready", "Goods at the port", "Payment pending from buyer"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "Documents Required", "items": ["IEC and GST certificates", "Purchase order / buyer contract", "Product details (weight, HS code if known)", "Bank details for receiving payment"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},
  {"id": "exim-logistics", "category": "exim", "icon": "Truck", "iconColor": "#0F5E7A", "title": "Freight & Container Booking", "subtitle": "Container booking, factory stuffing, transport to port, insurance", "sections": [{"heading": "What do you need?", "items": ["Container booking with shipping line", "Stuffing at your factory / granite yard", "Truck transport to the port", "Cargo insurance", "Customs broker (CHA) coordination"]}, {"heading": "Container size", "pick": "one", "items": ["20 ft", "40 ft", "Part load (LCL)", "Not sure"]}, {"heading": "Preferred port", "pick": "one", "items": ["Krishnapatnam", "Chennai", "Visakhapatnam", "Kakinada", "Not sure — suggest the best"]}, {"heading": "What do you export or import?", "pick": "one", "items": ["Granite & stone", "Seafood / aqua (shrimp)", "Tobacco", "Chillies & spices", "Rice, pulses & grains", "Cotton & textiles", "Machinery / raw material", "Other"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},
  {"id": "exim-import", "category": "exim", "icon": "Package", "iconColor": "#0F5E7A", "title": "Import Support", "subtitle": "Bring machinery or raw material in — duty estimate to delivery", "sections": [{"heading": "What do you need?", "items": ["Customs duty estimate", "Import licence / permissions check", "Customs clearance through broker", "Delivery from port to Prakasam"]}, {"heading": "What do you export or import?", "pick": "one", "items": ["Granite & stone", "Seafood / aqua (shrimp)", "Tobacco", "Chillies & spices", "Rice, pulses & grains", "Cotton & textiles", "Machinery / raw material", "Other"]}, {"heading": "Preferred port", "pick": "one", "items": ["Krishnapatnam", "Chennai", "Visakhapatnam", "Kakinada", "Not sure — suggest the best"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "Documents Required", "items": ["IEC certificate", "Supplier invoice and packing list", "Bill of lading / airway bill", "Insurance certificate", "Any product licence (if needed)"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},
  {"id": "exim-buyers", "category": "exim", "icon": "Handshake", "iconColor": "#0F5E7A", "title": "Find Buyers & Export Guidance", "subtitle": "Pricing, samples, buyer checks and trade fairs", "sections": [{"heading": "What do you need?", "items": ["Is my product export-ready? (quality, packing, labels)", "Export pricing (FOB / CIF)", "Sending samples abroad", "Checking a buyer before shipping", "Trade fairs and online B2B listings"]}, {"heading": "What do you export or import?", "pick": "one", "items": ["Granite & stone", "Seafood / aqua (shrimp)", "Tobacco", "Chillies & spices", "Rice, pulses & grains", "Cotton & textiles", "Machinery / raw material", "Other"]}, {"heading": "Have you exported before?", "pick": "one", "items": ["Never", "A few times", "Regularly"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},
  {"id": "exim-incentives", "category": "exim", "icon": "Banknote", "iconColor": "#0F5E7A", "title": "Export Incentives & Finance", "subtitle": "RoDTEP, duty drawback, EPCG and export credit from banks", "sections": [{"heading": "What do you need?", "items": ["RoDTEP and duty drawback claims", "EPCG licence for machinery", "Packing credit / export loan from bank", "ECGC cover against buyer non-payment"]}, {"heading": "What do you export or import?", "pick": "one", "items": ["Granite & stone", "Seafood / aqua (shrimp)", "Tobacco", "Chillies & spices", "Rice, pulses & grains", "Cotton & textiles", "Machinery / raw material", "Other"]}, {"heading": "When do you need this?", "pick": "one", "items": ["This week", "This month", "Just planning"]}, {"heading": "Documents Required", "items": ["IEC and GST certificates", "Shipping bills of past exports", "Bank realisation certificates (BRC / e-BRC)", "Last 2 years financial statements (for loans)"]}, {"heading": "How It Works", "items": ["Tell us your product and what you need", "Our EXIM Buddy explains the steps, papers and costs", "We prepare and file the papers, and coordinate with banks, customs brokers and shipping lines", "You get updates on WhatsApp at every stage"]}, {"heading": "Please Note", "items": ["Customs clearance is done through licensed customs brokers (CHA) we work with", "Government fees, customs duty and freight are extra and shown to you clearly before you pay", "We guide you to buyers but cannot guarantee an order"]}]},

  // ==================== LOGISTICS, PACKERS & MOVERS (Hire a professional, added 26 Oct) ====================
  {"id": "house-shifting", "category": "logistics", "icon": "Home", "iconColor": "#222E62", "title": "House Shifting", "subtitle": "Packing, loading, moving and setting up your home — in town, to another town or state", "sections": [{"heading": "Where are you moving?", "pick": "one", "typeHint": "Type the places, e.g. Ongole → Hyderabad", "items": ["Within the same town", "To another town in Andhra Pradesh", "To another state"]}, {"heading": "How big is the house?", "pick": "one", "items": ["Single room", "1 BHK", "2 BHK", "3 BHK", "Independent house / villa"]}, {"heading": "What do you need?", "kind": "choose", "items": ["Packing with good material (bubble wrap, cartons)", "Loading, transport and unloading", "Open and re-fit cots, wardrobes and furniture", "Unpacking and arranging at the new house", "AC removal and fitting", "TV and washing machine fitting", "Move my bike or car too", "Keep my things in storage for a few days", "A proper bill for my office transfer claim"]}, {"heading": "Any stairs at the old or new house?", "pick": "one", "items": ["No — ground floor at both", "Yes — stairs, no lift", "There is a lift"]}, {"heading": "When are you moving?", "pick": "one", "items": ["This week", "In 2–4 weeks", "Next month or later", "On a muhurtham date we will tell you"]}, {"heading": "How It Works", "items": ["Tell us what you are moving, from where to where, and the date", "A Local Buddy sees your things — at your home or on a video call — and makes a list of every item", "You get one written price before the move: packing, labour, floors, transport and toll all included", "On moving day everything is packed, labelled and loaded in front of you", "At the new house every item is checked with you against the list"]}, {"heading": "Good to Know", "items": ["Book 1–2 weeks early for month-end, weekends and muhurtham days — movers are busiest then", "Keep gold, cash, medicines and important papers with you, not in the truck", "Used household goods do not need an e-way bill; the mover gives you a goods list and a lorry receipt (LR)", "Transit insurance is optional — it covers damage on the road for a small charge on the value you declare", "Moving to another state for more than a year? Your vehicle will need an NOC from the RTO — we can help"]}, {"heading": "Documents Required", "items": ["ID proof (Aadhaar) of the person moving", "New house address with a contact number there", "RC and insurance copy (only if a bike or car is moving)"]}]},
  {"id": "office-shifting", "category": "logistics", "icon": "Building2", "iconColor": "#222E62", "title": "Office & Shop Shifting", "subtitle": "Offices, shops, clinics and godowns moved with care — even on a Sunday or at night", "sections": [{"heading": "What are you moving?", "pick": "one", "items": ["Office", "Shop / showroom", "Clinic or hospital", "School or college", "Godown / warehouse"]}, {"heading": "Where are you moving?", "pick": "one", "typeHint": "Type the places, e.g. Ongole → Hyderabad", "items": ["Within the same town", "To another town in Andhra Pradesh", "To another state"]}, {"heading": "How big is it?", "pick": "one", "items": ["Small (1–2 rooms)", "Medium (3–5 rooms)", "Large (more than 5 rooms)"]}, {"heading": "What do you need?", "kind": "choose", "items": ["Packing of files, computers and stock", "Open and re-fit furniture, racks and counters", "Computer, printer and network set-up at the new place", "Move on a Sunday or at night", "Labels on every box, room by room", "A GST bill"]}, {"heading": "When are you moving?", "pick": "one", "items": ["This week", "In 2–4 weeks", "Next month or later", "On a muhurtham date we will tell you"]}, {"heading": "How It Works", "items": ["Tell us what you are moving, from where to where, and the date", "A Local Buddy visits, lists the furniture, machines and stock, and plans the move with you", "You get one written price before the move — no extra charges on the day", "We move on the day and time you choose, so your work stops for the least time", "At the new place everything is checked with you against the list"]}, {"heading": "Good to Know", "items": ["Moving on a Sunday or at night keeps your business open on working days", "Back up computer data before the move", "Tell your bank, customers and the GST office the new address"]}, {"heading": "Documents Required", "items": ["GST certificate or trade licence (for the bill)", "New address with a contact person there"]}]},
  {"id": "vehicle-transport", "category": "logistics", "icon": "Car", "iconColor": "#222E62", "title": "Bike & Car Transport", "subtitle": "Your bike or car carried safely by truck to another town or state", "sections": [{"heading": "Which vehicle?", "pick": "one", "items": ["Bike / scooter", "Car", "Both bike and car", "Tractor or another vehicle"]}, {"heading": "Where to?", "pick": "one", "typeHint": "Type the places, e.g. Ongole → Hyderabad", "items": ["To another town in Andhra Pradesh", "To another state", "Within the same town"]}, {"heading": "How should it travel?", "pick": "one", "items": ["Open carrier truck (lower price)", "Closed container (best protection)"]}, {"heading": "When do you need it?", "pick": "one", "items": ["This week", "In 2–4 weeks", "Next month or later"]}, {"heading": "How It Works", "items": ["Tell us the vehicle, from where to where, and the date", "You get one written price before we book — transit insurance is optional", "At pickup the scratches and km reading are noted with you, with photos", "The vehicle is delivered to your door; you check it before you sign"]}, {"heading": "Good to Know", "items": ["Keep only a little fuel in the tank; remove helmets, music systems and valuables", "A bike can also go by train parcel — we compare the price and the risk for you", "Staying in another state for more than 12 months? The vehicle must be registered there; the old RTO gives an NOC first — we can get it for you"]}, {"heading": "Documents Required", "items": ["RC (registration certificate) — copy", "Valid insurance — copy", "Owner's ID proof (Aadhaar)"]}]},
  {"id": "item-moving", "category": "logistics", "icon": "Sofa", "iconColor": "#222E62", "title": "Move a Few Items", "subtitle": "A fridge, sofa, cot or almirah — a mini truck with helpers", "sections": [{"heading": "What are you moving?", "kind": "choose", "items": ["Fridge", "Washing machine", "Sofa or dining table", "Cot and mattress", "Almirah / bureau", "TV", "Boxes and bags", "Shop goods or stock"]}, {"heading": "Where to?", "pick": "one", "typeHint": "Type the places, e.g. Ongole → Hyderabad", "items": ["Within the same town", "To another town in Andhra Pradesh", "To another state"]}, {"heading": "Do you need helpers?", "pick": "one", "items": ["Yes — to load and unload", "No — only the vehicle"]}, {"heading": "When do you need it?", "pick": "one", "items": ["Today", "Tomorrow", "This week"]}, {"heading": "How It Works", "items": ["Tell us the items, from where to where, and when", "We tell you the price first — vehicle, helpers and distance", "A mini truck (Tata Ace or similar) comes with helpers; items are wrapped, loaded and placed where you want", "You check every item before the team leaves"]}]},
  {"id": "goods-transport", "category": "logistics", "icon": "Truck", "iconColor": "#222E62", "title": "Goods & Materials Transport", "subtitle": "Lorry, tractor or mini truck for building material, farm produce and shop goods", "customLink": "/supplies?item=transport", "sections": []},

  // ==================== NRI & FAMILIES ABROAD (send abroad, receive parcels — shown in every city) ====================
  {"id": "nri-send-abroad", "category": "nri", "icon": "Plane", "iconColor": "#24578A", "everywhere": true, "title": "Send Items Abroad", "subtitle": "Homemade food, pickles, sweets, clothes, documents and gifts to family abroad", "sections": [{"heading": "What are you sending?", "kind": "choose", "items": ["Homemade pickles & podis", "Sweets & snacks", "Clothes, sarees & gifts", "Documents & certificates", "Medicines (with a prescription)", "Puja items & festival things", "Something else"]}, {"heading": "Which country is it going to?", "pick": "one", "items": ["USA", "UK", "Canada", "Australia", "New Zealand", "UAE", "Saudi Arabia", "Qatar / Kuwait / Oman / Bahrain", "Singapore / Malaysia", "Germany / Europe", "Another country"]}, {"heading": "About how heavy?", "pick": "one", "items": ["Under 2 kg", "2–5 kg", "5–10 kg", "10–25 kg", "More than 25 kg", "Not sure"]}, {"heading": "How should it travel?", "pick": "one", "items": ["Fastest (express courier)", "Normal", "Cheapest — no hurry", "Please advise"]}, {"heading": "Do you need packing?", "pick": "one", "items": ["Please pack it safely (airtight / vacuum)", "It is already packed"]}, {"heading": "How It Works", "items": ["Tell us what you are sending and where", "A Local Buddy collects it from your family in India and checks what is allowed", "We pack and weigh it, then share a clear price with the courier charges before booking", "You get the tracking number on WhatsApp, and updates until it arrives"]}, {"heading": "Good to Know", "items": ["Each country has its own rules — some foods, liquids and medicines are not allowed. We check before packing.", "Medicines need a doctor’s prescription and the bill.", "The price depends on the weight and size after packing; you see it before we book.", "In some countries the receiver may have to pay customs duty."]}, {"heading": "Documents Required", "items": ["Address and phone number of the person receiving it abroad", "ID proof of the sender in India (Aadhaar)", "Prescription and bill for any medicines"]}]},
  {"id": "nri-receive-parcels", "category": "nri", "icon": "Package", "iconColor": "#24578A", "everywhere": true, "title": "Receive Parcels for Family in India", "subtitle": "We collect parcels and courier deliveries for your parents and bring them home", "sections": [{"heading": "What do you need?", "items": ["Collect a parcel from the courier / post office", "Help with customs papers for a parcel from abroad", "Deliver it to my family’s home", "Open, check and send photos on WhatsApp (only if you say so)"]}, {"heading": "What is coming?", "pick": "one", "items": ["Documents", "Gifts & personal items", "Phone / laptop / electronics", "Medicines", "Something else"]}, {"heading": "Who will receive it in India?", "pick": "one", "items": ["My parents", "Grandparents", "Other family", "Me — I am visiting India"]}, {"heading": "How It Works", "items": ["Share the tracking number and who it is for", "A Local Buddy collects it with an authority letter and ID copy", "It is delivered to your family’s home — with photos on WhatsApp", "Any customs duty or fee is shown to you before we pay it"]}, {"heading": "Good to Know", "items": ["Courier offices need an authority letter and the receiver’s ID to hand over a parcel — we help you write it", "Gifts above the duty-free limit and electronics may attract customs duty, paid by the receiver", "We never open a sealed parcel without your permission"]}, {"heading": "Documents Required", "items": ["Tracking / AWB number", "Receiver’s ID proof (Aadhaar) — a copy", "Authority letter signed by the receiver (we help write it)"]}]},

  // ==================== ELECTRICITY ====================
  { 
    id: 'electricity-switches-sockets', 
    category: 'electricity', 
    icon: 'Plug', 
    iconColor: '#F59E0B', 
    title: 'Switches, Sockets & Smart Automation', 
    subtitle: 'Repairs, replacements, and new smart plug installations',
    sections: [
      { heading: 'Repairs & Replacements', items: [
        'Fixing loose connections and burnt-out sockets',
        'Replacing faulty regulator knobs and broken switch plates'
      ]},
      { heading: 'New Installations', items: [
        'Adding modular switchboards',
        'Installing heavy-duty 16A power sockets for refrigerators & washing machines',
        'Setting up smart home automation plugs'
      ]},
      { heading: 'Good to Know', items: REPAIR_PROMISE }
    ]
  },
  { 
    id: 'electricity-fans-ventilation', 
    category: 'electricity', 
    icon: 'Fan', 
    iconColor: '#3B82F6', 
    title: 'Fan & Ventilation Servicing', 
    subtitle: 'Repairs and installations for ceiling fans and exhaust vents',
    sections: [
      { heading: 'Ceiling & Exhaust Fans', items: [
        'Repairing motor humming noises',
        'Replacing worn-out capacitors',
        'Performing structural blade alignments',
        'Hookups and installations for new units'
      ]},
      { heading: 'Specialty Installations', items: [
        'Decorative chandeliers',
        'Commercial-grade wall fans',
        'High-RPM exhaust vents'
      ]},
      { heading: 'Good to Know', items: REPAIR_PROMISE }
    ]
  },
  { 
    id: 'electricity-lighting', 
    category: 'electricity', 
    icon: 'Lightbulb', 
    iconColor: '#EAB308', 
    title: 'Lighting & Fixture Fittings', 
    subtitle: 'Indoor lighting, decorative setups, and outdoor floods',
    sections: [
      { heading: 'Basic Indoor Lighting', items: [
        'Installing or replacing standard tube lights',
        'Setting up LED panels and concealed spot-lamps',
        'Installing outdoor floodlights'
      ]},
      { heading: 'Decorative & Event Setup', items: [
        'Hanging complex multi-tier chandeliers',
        'Balancing and installing pendant lights',
        'Mapping festive balcony strip lighting'
      ]},
      { heading: 'Good to Know', items: REPAIR_PROMISE }
    ]
  },
  { 
    id: 'electricity-distribution-backup', 
    category: 'electricity', 
    icon: 'ZapOff', 
    iconColor: '#EF4444', 
    title: 'Distribution Boards & Power Backup', 
    subtitle: 'Safety overhauls, inverters, and battery configurations',
    sections: [
      { heading: 'Safety Overhauls', items: [
        'Swapping out old ceramic wire fuses',
        'Installing modern Miniature Circuit Breakers (MCBs)',
        'Adding Residual Current Circuit Breakers (RCCBs) to prevent short circuits'
      ]},
      { heading: 'Power Backups', items: [
        'Complete setup for domestic power inverters and batteries',
        'Battery water top-ups',
        'Wiring configuration for backup power integration'
      ]},
      { heading: 'Good to Know', items: REPAIR_PROMISE }
    ]
  },
  { 
    id: 'electricity-wiring', 
    category: 'electricity', 
    icon: 'Cable', 
    iconColor: '#8B5A2B', 
    title: 'Internal & External House Wiring', 
    subtitle: 'Circuit updates and troubleshooting for full-house wiring',
    sections: [
      { heading: 'Circuit Updates', items: [
        'Running new internal hidden lines (using 1.0mm to 4.0mm heavy-gauge wire)',
        'Adding dedicated circuits for heavy appliances like Air Conditioners and high-wattage Geysers'
      ]},
      { heading: 'Troubleshooting', items: [
        'Fixing line-leakage errors and grounding issues',
        'Identifying underground cable breaks',
        'Performing complete full-house raw rewiring'
      ]},
      { heading: 'Good to Know', items: REPAIR_PROMISE }
    ]
  },

  // ---- Home repairs (owner, 30 Oct 2026): the Electrician group is now "Electrician & home repairs" ----
  {
    id: 'home-geyser',
    category: 'electricity',
    icon: 'Heater', iconColor: '#C2410C',
    title: 'Geyser / Water Heater',
    subtitle: 'Repair, new fitting and yearly service',
    sections: [
      { heading: 'What do you need?', items: [
        'No hot water, or too little hot water',
        'Geyser leaking, or tripping the power',
        'Fit a new geyser',
        'Move or remove an old geyser',
        'Yearly service — descaling and safety check'
      ]},
      { heading: 'Which kind of geyser?', pick: 'one', items: ['Electric, with a tank', 'Instant electric', 'Gas geyser', 'Solar water heater', 'Not sure'] },
      { heading: 'Good to Know', items: [...REPAIR_PROMISE, 'Hard water? A yearly descaling keeps the geyser safe and saves power.'] }
    ]
  },
  {
    id: 'plumbing-services',
    category: 'electricity',
    icon: 'Wrench', iconColor: '#B45309',
    title: 'Plumbing Services',
    subtitle: 'Expert plumbers for all repairs and installations',
    sections: [
      { heading: 'Services Offered', items: [
        'Leak & Pipe Repair (fixing leaks, replacing old pipes)',
        'Tap & Shower Installation or replacement',
        'Toilet & Washbasin Repair (blockages, flushes, etc.)',
        'Motor & Overhead Tank repairs and connections'
      ]},
      { heading: 'Our Assurance', items: [
        'Verified and highly experienced plumbers',
        'Transparent pricing before starting the work',
        'Fast response time for emergency leaks',
        'Post-service cleanup and check',
        'We bring genuine spare parts and show you the part price before fitting it.'
      ]}
    ]
  },
  {
    id: 'home-water-motor',
    category: 'electricity',
    icon: 'Droplet', iconColor: '#0B6F71',
    title: 'Water Motor & Tank',
    subtitle: 'Motor not starting, new motor, tank overflow, automatic switch',
    sections: [
      { heading: 'What do you need?', items: [
        'Motor not starting, or making a noise',
        'Motor rewinding, or a new capacitor',
        'Fit a new motor',
        'Automatic water-level switch for the tank',
        'Tank overflowing, or not filling'
      ]},
      { heading: 'Which motor?', pick: 'one', items: ['Motor for the overhead tank', 'Borewell (submersible) motor', 'Sump motor', 'Not sure'] },
      { heading: 'Good to Know', items: [...REPAIR_PROMISE, 'An automatic tank switch stops the overflow and saves water and power.'] }
    ]
  },
  {
    id: 'home-appliance-repair',
    category: 'electricity',
    icon: 'WashingMachine', iconColor: '#3550B8',
    title: 'Home Appliance Repair',
    subtitle: 'Washing machine, fridge, TV, RO purifier, mixer and more',
    sections: [
      { heading: 'Which appliance?', items: ['Washing machine', 'Fridge', 'TV', 'RO water purifier', 'Mixer / grinder', 'Iron box', 'Microwave oven'] },
      { heading: 'What is the problem?', items: [
        'Not turning on',
        'Not cooling or not heating',
        'Water leaking',
        'Making a noise',
        'Shows an error',
        'Needs fitting or a service'
      ]},
      { heading: 'Good to Know', items: [...REPAIR_PROMISE, "Still under the company's warranty? Tell us — we help you book the brand's own service."] }
    ]
  },
  {
    id: 'home-handyman',
    category: 'electricity',
    icon: 'Hammer', iconColor: '#A16207',
    title: 'Small Fixes (Handyman)',
    subtitle: 'Door locks, hinges, curtain rods, drilling and small carpentry',
    sections: [
      { heading: 'What do you need?', items: [
        'Door lock or latch — repair or a new one',
        'Door and window hinges, handles, stoppers',
        'Curtain rods and blinds',
        'Drilling — TV wall mount, shelves, photo frames',
        'Small carpentry — cupboard doors, drawers, cot repair',
        'Mosquito mesh for windows and doors'
      ]},
      { heading: 'Good to Know', items: [...REPAIR_PROMISE, 'Have a list of small jobs? Tell us all of them — one visit can do many.'] }
    ]
  },
  {
    id: 'home-help-not-sure',
    category: 'electricity',
    icon: 'CircleHelp', iconColor: '#222E62',
    title: 'Something Not Working? Tell Us',
    subtitle: 'Describe the problem — we send the right person',
    sections: [
      { heading: 'What is it about?', items: [
        'Power gone in a room or the whole house',
        'Sparks, a burning smell or a shock',
        'Water leaking, or no water',
        'Something broken or stuck',
        'An appliance stopped working',
        'Something else'
      ]},
      { heading: 'Good to Know', items: [
        'Sparks, a burning smell or a shock? Switch off the main power, keep away, and call us right away.',
        REPAIR_PROMISE[0]
      ]}
    ]
  },

  // ---- Visa, study abroad, tourism (owner, 30 Oct 2026) ----
  {
    id: 'visa-services',
    category: 'nri',
    icon: 'Stamp', iconColor: '#24578A',
    everywhere: true,
    title: 'Visa Services',
    subtitle: 'Visit and student visas — form, papers, appointment and follow-up',
    sections: [
      { heading: 'Which visa?', pick: 'one', items: ['Visit / tourist visa', 'Student visa', 'Not sure'] },
      { heading: 'Which country?', pick: 'one', items: ['USA', 'UK', 'Canada', 'Australia', 'New Zealand', 'UAE', 'Singapore / Malaysia', 'Germany / Europe', 'Another country'] },
      { heading: 'What do you need?', kind: 'choose', items: [
        'Fill the visa form online',
        'Check and arrange the papers',
        'Book the biometrics or interview appointment',
        'Practice for the visa interview',
        'Travel insurance and flight tickets'
      ]},
      { heading: 'When do you plan to travel?', pick: 'one', items: ['Within a month', 'In 1–3 months', 'In 3–6 months', 'Not decided'] },
      { heading: 'Documents Required', items: [
        'Passport (valid for at least 6 more months)',
        'Recent photos in the size the country asks for',
        'Bank statements for the last 6 months',
        'Invitation letter from family abroad (visit visa)',
        'Admission letter and fee receipt (student visa)',
        'Income tax returns or salary slips'
      ]},
      { heading: 'How It Works', items: [
        'Tell us the visa and the country',
        'Your Local Buddy checks your papers and lists what is missing',
        'We fill the form, book the appointment and help you prepare for the interview',
        'We follow up and update you on WhatsApp'
      ]},
      { heading: 'Please Note', items: [
        'iN Empower is not an embassy or a visa office — we help you apply correctly',
        'The embassy decides the visa; fees paid to the embassy are not refunded',
        'Our service fee is told to you before we start'
      ]}
    ]
  },
  // NRI: parents' care visits, property watch, bills & paperwork (owner, 31 Oct 2026)
  {"id": "nri-care-visits", "category": "nri", "icon": "HeartHandshake", "iconColor": "#24578A", "everywhere": true, "title": "Parents’ Care Visits", "subtitle": "A trusted Local Buddy visits your parents — check-ins, doctor visits, groceries — and updates you on WhatsApp", "sections": [{"heading": "What should the Buddy do?", "kind": "choose", "items": ["Check-in visit with a photo / video update", "Go with them to the doctor and pick up medicines", "Groceries, house needs and small repairs", "Help in an emergency"]}, {"heading": "How often?", "pick": "one", "items": ["One time", "Every week", "Every month"]}, {"heading": "Who should we visit?", "pick": "one", "items": ["My parents", "My mother", "My father", "Grandparents", "Other family"]}, {"heading": "How It Works", "items": ["Tell us who to visit, where and how often", "We call you (India time) and share a clear price", "A verified Local Buddy visits and sends photos and an update on WhatsApp", "Weekly or monthly visits happen on the days you choose"]}, {"heading": "Good to Know", "items": ["In an emergency we call 108 and send a Buddy as fast as we can", "Where possible the same Buddy visits each time, so your parents know them", "Medicines and groceries are bought as agreed in the quote — we send you the bills"]}]},
  {"id": "nri-property-watch", "category": "nri", "icon": "Eye", "iconColor": "#24578A", "everywhere": true, "title": "Property Watch", "subtitle": "We visit your house or plot, check it and send you photos while you are abroad", "sections": [{"heading": "What do you have here?", "pick": "one", "items": ["House", "Flat", "Plot / house site", "Agricultural land", "Shop / commercial"]}, {"heading": "What should we do?", "kind": "choose", "items": ["Visit and send photos / video on WhatsApp", "Check for encroachment and boundary stones", "Arrange cleaning or repairs", "Meet the tenant and confirm the rent"]}, {"heading": "How often?", "pick": "one", "items": ["One time", "Every week", "Every month"]}, {"heading": "How It Works", "items": ["Tell us the property and its place (a Google Maps pin helps)", "We share a clear price before the first visit", "Your Local Buddy visits, checks and sends photos and a short report on WhatsApp", "If something needs fixing, we send you the quote first"]}, {"heading": "Good to Know", "items": ["The tenant pays rent straight into your bank account — our Buddy meets the tenant and confirms it, and never carries rent money", "If we see encroachment, we tell you the same day and help with the next steps (survey, MRO, lawyer)", "Keys stay with whoever you choose — we can collect them with your letter"]}, {"heading": "Documents Required", "items": ["Property address or Google Maps pin", "A copy of the sale deed or pattadar passbook (to check the boundaries)", "Tenant name and phone number (if rented)"]}]},
  {"id": "nri-bills-paperwork", "category": "nri", "icon": "Receipt", "iconColor": "#24578A", "everywhere": true, "title": "Bills, Tax & Paperwork for NRIs", "subtitle": "Property tax, electricity bills, the pension life certificate and family certificates — done for you", "sections": [{"heading": "What do you need?", "kind": "choose", "items": ["Pay property tax / water tax", "Electricity bill, name change or connection change", "Life certificate for parents’ pension (Jeevan Pramaan)", "A certificate for the family (birth, income, caste…)", "Something else"]}, {"heading": "How often?", "pick": "one", "items": ["One time", "Every year (we remind you)", "Not sure"]}, {"heading": "How It Works", "items": ["Tell us the work and the town", "Your Local Buddy checks the papers and tells you what is missing", "We share a clear price, pay the bill or file the form, and send you the receipt on WhatsApp"]}, {"heading": "Good to Know", "items": ["Bills and government fees are paid as shown on the receipt — our service fee is told to you first", "For the life certificate the pensioner gives a fingerprint — we arrange a doorstep visit or take them to the centre", "Paying property tax on time avoids the penalty"]}, {"heading": "Documents Required", "items": ["An old bill or tax receipt (assessment / service number)", "Aadhaar of the person the work is for", "Pension details (PPO number) for the life certificate"]}]},
  {
    id: 'study-abroad',
    category: 'education',
    icon: 'GraduationCap', iconColor: '#3550B8',
    title: 'Study Abroad Consultancy',
    subtitle: 'Country, course and university, applications, tests, education loan and visa',
    sections: [
      { heading: 'What do you need?', kind: 'choose', items: [
        'Choose the country, course and university',
        'Applications and documents (SOP, LORs, transcripts)',
        'IELTS / TOEFL / GRE guidance and test booking',
        'Education loan',
        'Student visa'
      ]},
      { heading: 'Which level?', pick: 'one', items: ["Bachelor's (after Inter / 12th)", "Master's (after a degree)", 'Diploma or certificate', 'PhD'] },
      { heading: 'Which country?', pick: 'one', items: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'New Zealand', 'Not decided'] },
      { heading: 'When do you want to start?', pick: 'one', items: ['This year', 'Next year', 'Just exploring'] },
      { heading: 'Documents Required', items: [
        '10th and Inter / 12th marks memos',
        "Degree marks memos and certificate (for a master's)",
        'Passport',
        'Test score card (IELTS / TOEFL / GRE), if taken',
        'Work experience letters, if any'
      ]},
      { heading: 'How It Works', items: [
        'Tell us your marks, your budget and the countries you like',
        'We shortlist courses and universities that fit, and explain the full cost',
        'We help with the applications, the test, the education loan and the student visa',
        'We follow up and update you on WhatsApp'
      ]},
      { heading: 'Please Note', items: [
        'We are not an agent of any university — we guide you and help you apply',
        'Universities decide admission, banks decide the loan and embassies decide the visa',
        'Our service fee is told to you before we start'
      ]}
    ]
  },
  {
    id: 'tourism-tours',
    category: 'travel',
    icon: 'Luggage', iconColor: '#0B6F71',
    title: 'Tourism Services',
    subtitle: 'Holiday tours in India and abroad, and day trips nearby — planned for you',
    sections: [
      { heading: 'Which trip?', pick: 'one', items: ['Day trip nearby', 'Holiday tour in India', 'International tour'] },
      { heading: 'What do you need?', kind: 'choose', items: [
        'Full tour package',
        'Hotel stay',
        'Car or bus with a driver',
        'Train or flight tickets',
        'Local guide and sightseeing',
        'Visa help (international tours)'
      ]},
      { heading: 'How many people?', pick: 'one', items: ['1–2', '3–5', '6–10', 'More than 10 (group)'] },
      { heading: 'How many days?', pick: 'one', items: ['1 day', '2–3 days', '4–7 days', 'More than a week'] },
      { heading: 'Budget per person', pick: 'one', items: ['Under ₹5,000', '₹5,000–20,000', '₹20,000–75,000', 'Above ₹75,000', 'Not sure — please advise'] },
      { heading: 'How It Works', items: [
        'Tell us where you want to go, when, and who is coming',
        'We plan the trip and share one clear price for everything before you book',
        'We book the stay, the travel and the sightseeing',
        'Our team is on WhatsApp during your trip'
      ]},
      { heading: 'Good to Know', items: [
        'Day trips near your town: beaches, temples, waterfalls and hills',
        'Popular in India: Araku, Goa, Ooty, Kerala; abroad: Dubai, Singapore, Thailand',
        'Carry an ID proof — and your passport for international tours'
      ]}
    ]
  },

  // ==================== PAINTING & WATERPROOFING (owner, 30 Oct 2026) ====================
  {
    id: 'painting-interior',
    category: 'painting',
    icon: 'Paintbrush', iconColor: '#B8261E',
    title: 'Home Painting (Inside)',
    subtitle: 'Full home, a few rooms or a few walls — new paint or repainting',
    sections: [
      { heading: 'What do you need painted?', pick: 'one', items: ['Full home', 'A few rooms', 'A few walls or one accent wall', 'New house — first painting'] },
      { heading: 'How big is the home?', pick: 'one', items: ['1 BHK', '2 BHK', '3 BHK', '4 BHK or bigger', 'Independent house', 'Shop or office'] },
      { heading: 'Which finish?', pick: 'one', items: ['Regular emulsion', 'Washable (premium)', 'Luxury smooth finish', 'Not sure — show me on the visit'] },
      { heading: 'Is anyone living there?', pick: 'one', items: ['Yes, we live there', 'No, the house is empty'] },
      { heading: 'What do you need along with it?', items: ['Ceiling painting', 'Wall putty and crack filling', 'Damp patch treatment', 'Doors and windows too', 'Nothing else'] },
      { heading: 'Good to Know', items: PAINT_PROMISE }
    ]
  },
  {
    id: 'painting-exterior',
    category: 'painting',
    icon: 'Building2', iconColor: '#B8261E',
    title: 'Exterior Painting',
    subtitle: 'Outside walls of the house, building or compound wall — weather-proof paint',
    sections: [
      { heading: 'What do you need painted?', pick: 'one', items: ['Whole house outside', 'Front side only', 'Compound wall', 'Apartment building', 'Shop or office front'] },
      { heading: 'How many floors?', pick: 'one', items: ['Ground floor only', 'Ground + 1', 'Ground + 2', 'Three floors or more'] },
      { heading: 'Which paint?', pick: 'one', items: ['Regular exterior paint', 'Weather-proof (lasts longer in rain and sun)', 'Not sure — show me on the visit'] },
      { heading: 'What do you need along with it?', items: ['Crack filling', 'Waterproof coating', 'Grills and gate painting', 'Nothing else'] },
      { heading: 'Good to Know', items: [...PAINT_PROMISE, 'Outside painting is best done when it is not raining; we plan the dates with you.'] }
    ]
  },
  {
    id: 'painting-waterproofing',
    category: 'painting',
    icon: 'Umbrella', iconColor: '#B8261E',
    title: 'Waterproofing & Crack Repair',
    subtitle: 'Terrace and wall leaks, damp patches, cracks — fixed before the rain',
    sections: [
      { heading: 'What do you need?', items: [
        'Terrace or roof waterproofing',
        'Damp patches or seepage on inside walls',
        'Outside wall waterproofing',
        'Bathroom or water tank leak',
        'Wall crack filling'
      ]},
      { heading: 'How bad is it?', pick: 'one', items: ['Small patch', 'One room or one wall', 'Many places', 'Not sure — please check'] },
      { heading: 'Good to Know', items: [
        'A supervisor visits free, finds where the water comes from and tells you one clear price — no charge if you say no.',
        'We bring the waterproofing material; you see the brand and its cost in the price.',
        'Your things are covered and the place is cleaned at the end.',
        'Repainting the patched area can be added to the same job.'
      ]}
    ]
  },
  {
    id: 'painting-doors-grills',
    category: 'painting',
    icon: 'DoorOpen', iconColor: '#B8261E',
    title: 'Doors, Windows & Grills',
    subtitle: 'Wood doors and windows, metal grills, gates and railings',
    sections: [
      { heading: 'What do you need?', items: [
        'Wooden doors or windows — paint',
        'Wooden doors or furniture — polish',
        'Metal grills, gates or railings — rust-proof paint',
        'Main door — fresh look'
      ]},
      { heading: 'How many pieces?', pick: 'one', items: ['1–3', '4–8', 'More than 8', 'Not sure'] },
      { heading: 'Good to Know', items: PAINT_PROMISE }
    ]
  },
  {
    id: 'painting-texture',
    category: 'painting',
    icon: 'SwatchBook', iconColor: '#B8261E',
    title: 'Texture & Accent Walls',
    subtitle: 'Texture finishes, stencil designs and feature walls for a room',
    sections: [
      { heading: 'What do you need?', items: [
        'Texture finish on one wall',
        'Stencil design',
        'Feature wall behind the TV or bed',
        'Pooja room wall'
      ]},
      { heading: 'Which room?', pick: 'one', items: ['Living room', 'Bedroom', 'Pooja room', 'Kids room', 'Shop or office'] },
      { heading: 'Good to Know', items: [...PAINT_PROMISE, 'You see design samples on the visit before choosing.'] }
    ]
  },

  // ==================== PEST CONTROL (owner, 2 Nov 2026) ====================
  {
    id: 'pest-termite',
    category: 'pest-control',
    icon: 'ShieldAlert', iconColor: '#2A9D5C',
    title: 'Termite Control (Pre & Post Construction)',
    subtitle: 'White ants in walls, doors and furniture — and anti-termite treatment before you build',
    sections: [
      { heading: 'What do you need?', items: [
        'Termites in a house or building that is already built (post-construction)',
        'Anti-termite treatment for a new building (pre-construction)',
        'Termites in doors, windows or furniture',
        'Termites in a shop, office or godown'
      ]},
      { heading: 'Stage of the building', pick: 'one', items: ['Not built yet — before the foundation', 'Foundation or plinth stage', 'Before the flooring', 'Built and in use'] },
      { heading: 'How big is the place?', pick: 'one', items: ['Up to 1,000 sq ft', '1,000–2,000 sq ft', '2,000–4,000 sq ft', 'More than 4,000 sq ft'] },
      { heading: 'Good to Know', items: [
        ...PEST_PROMISE,
        'Pre-construction: the soil is treated before the foundation and the flooring, so termites cannot come up later.',
        'Post-construction: small holes are drilled along the walls and floor edges, filled with the treatment and sealed neatly.'
      ]}
    ]
  },
  {
    id: 'pest-mosquito',
    category: 'pest-control',
    icon: 'Wind', iconColor: '#2A9D5C',
    title: 'Mosquito Control',
    subtitle: 'Spraying inside, fogging outside, and treating drains where mosquitoes breed',
    sections: [
      { heading: 'What do you need?', items: [
        'Spraying inside the house or shop',
        'Fogging outside — compound, garden, parking',
        'Treating drains and stagnant water (larvae)',
        'Apartment or colony common areas'
      ]},
      { heading: 'What kind of place?', pick: 'one', items: ['House / flat', 'Apartment or colony', 'Shop, office or restaurant', 'School, hospital or godown'] },
      { heading: 'Good to Know', items: [...PEST_PROMISE, 'Empty water from pots, coolers, tyres and flower vases every week — mosquitoes breed in still water.'] }
    ]
  },
  {
    id: 'pest-rodent',
    category: 'pest-control',
    icon: 'Rat', iconColor: '#2A9D5C',
    title: 'Rodent Control',
    subtitle: 'Rats, mice and bandicoots in homes, shops, godowns and restaurants',
    sections: [
      { heading: 'What do you need?', items: [
        'Rats or mice inside the house',
        'Rats in a shop, godown or restaurant',
        'Rats in the ceiling, loft or roof',
        'Bandicoots digging around the compound'
      ]},
      { heading: 'What kind of place?', pick: 'one', items: ['House / flat', 'Shop or office', 'Restaurant or hotel', 'Godown or factory'] },
      { heading: 'How bad is it?', pick: 'one', items: ['Seen once or twice', 'Seen every day', 'Very bad — all over'] },
      { heading: 'Good to Know', items: [
        ...PEST_PROMISE,
        'Traps and baits are placed out of reach of children and pets; we show you where they are.',
        'Closing gaps and holes stops new rats from coming in.'
      ]}
    ]
  },
  {
    id: 'pest-cockroach',
    category: 'pest-control',
    icon: 'Bug', iconColor: '#2A9D5C',
    title: 'Cockroach Control',
    subtitle: 'Odourless gel and spray for kitchens, bathrooms and drains',
    sections: [
      { heading: 'What do you need?', items: [
        'Kitchen',
        'Bathrooms and drains',
        'Whole house',
        'Restaurant, hotel or shop kitchen'
      ]},
      { heading: 'How big is the place?', pick: 'one', items: ['1 BHK', '2 BHK', '3 BHK', '4 BHK or bigger', 'Independent house', 'Shop, restaurant or office'] },
      { heading: 'How bad is it?', pick: 'one', items: ['Seen once or twice', 'Seen every day', 'Very bad — all over'] },
      { heading: 'Good to Know', items: [...PEST_PROMISE, 'The gel has no smell — you can keep using your kitchen; keep food covered on the day of the spray.'] }
    ]
  },
  {
    id: 'pest-flies',
    category: 'pest-control',
    icon: 'BugPlay', iconColor: '#2A9D5C',
    title: 'Flies Control',
    subtitle: 'House flies in homes, restaurants, shops, garbage areas and cattle sheds',
    sections: [
      { heading: 'What do you need?', items: [
        'Inside the house',
        'Restaurant, hotel or food shop',
        'Garbage and drain areas',
        'Cattle shed or poultry shed'
      ]},
      { heading: 'How bad is it?', pick: 'one', items: ['A few flies', 'Many flies every day', 'Very bad — all over'] },
      { heading: 'Good to Know', items: [...PEST_PROMISE, 'Covered garbage bins and clean drains keep flies away for longer.'] }
    ]
  },
  {
    id: 'pest-bedbug',
    category: 'pest-control',
    icon: 'BedDouble', iconColor: '#2A9D5C',
    title: 'Bed Bug Control',
    subtitle: 'Treatment for beds, mattresses, sofas, cupboards and lodge rooms',
    sections: [
      { heading: 'What do you need?', items: [
        'Beds and mattresses',
        'Sofas and chairs',
        'Cupboards and wardrobes',
        'Hostel, lodge or hotel rooms'
      ]},
      { heading: 'How many rooms?', pick: 'one', items: ['1 room', '2 rooms', '3 rooms', '4 rooms or more'] },
      { heading: 'How bad is it?', pick: 'one', items: ['A few bites', 'Bites every night', 'Very bad — all over'] },
      { heading: 'Good to Know', items: [
        ...PEST_PROMISE,
        'Bed bugs usually need two treatments about two weeks apart; we tell you the plan and the price before we start.',
        'After the treatment, wash bed sheets and covers in hot water and dry them in the sun.'
      ]}
    ]
  },
  {
    id: 'pest-spider',
    category: 'pest-control',
    icon: 'BugOff', iconColor: '#2A9D5C',
    title: 'Spider Control',
    subtitle: 'Spiders and cobwebs in homes, shops, offices and godowns',
    sections: [
      { heading: 'What do you need?', items: [
        'Inside the house',
        'Outside walls, compound and garden',
        'Shop, office or godown',
        'Cobweb cleaning with the treatment'
      ]},
      { heading: 'How big is the place?', pick: 'one', items: ['1 BHK', '2 BHK', '3 BHK', '4 BHK or bigger', 'Independent house', 'Shop, office or godown'] },
      { heading: 'Good to Know', items: PEST_PROMISE }
    ]
  },
  {
    id: 'pest-snake',
    category: 'pest-control',
    icon: 'Worm', iconColor: '#2A9D5C',
    title: 'Snake Rescue & Prevention',
    subtitle: 'A trained rescuer catches the snake and releases it safely — and we help keep snakes away',
    sections: [
      { heading: 'What do you need?', items: [
        'A snake is here now — please rescue it',
        'Snakes are seen often — prevention',
        'Seal gaps and holes in walls and drains',
        'Clear bushes and grass around the house'
      ]},
      { heading: 'Where is it?', pick: 'one', items: ['Inside the house', 'Compound or garden', 'Shop, office or godown', 'Open plot or building site'] },
      { heading: 'Please Note', items: [
        'Bitten by a snake? Call 108 at once and go to the nearest government hospital — do not wait.',
        'Snakes are protected by law. Our trained rescuer catches the snake safely and releases it far away — we never kill snakes.',
        'Until the rescuer comes, keep children and pets away, watch the snake from a safe distance, and do not try to catch it.',
        'For a snake inside now, we send a trained rescuer as fast as we can and tell you the charge on the phone first.'
      ]}
    ]
  },
  {
    id: 'pest-weed',
    category: 'pest-control',
    icon: 'Sprout', iconColor: '#2A9D5C',
    title: 'Weed Control',
    subtitle: 'Weed spraying for open plots, compounds, building sites and roadsides',
    sections: [
      { heading: 'What do you need?', items: [
        'Open plot',
        'Compound, parking or around the house',
        'Building site — before construction',
        'Roadside or apartment premises'
      ]},
      { heading: 'How big is the area?', pick: 'one', items: ['Up to 200 sq yards', '200–500 sq yards', '500 sq yards – 1 acre', 'More than 1 acre'] },
      { heading: 'What is growing?', pick: 'one', items: ['Grass and small weeds', 'Thick bushes', 'Parthenium (vayyari bhama)'] },
      { heading: 'Good to Know', items: [
        'An expert visits free, checks the land and tells you one clear price before any work — no charge if you say no.',
        'Only approved weed sprays, kept away from wells, drinking water and neighbours\' crops.',
        'Thick bushes may need cutting first; we tell you before we start.'
      ]}
    ]
  },

  // ==================== AC SERVICES ====================
  { 
    id: 'ac-jet-cleaning', 
    category: 'ac-services', 
    icon: 'Droplets', 
    iconColor: '#00B4D8', 
    title: 'Jet Cleaning & Servicing', 
    subtitle: 'Deep foam wash and drainage flush for peak cooling',
    sections: [
      { heading: 'Filter & Coil Wash', items: [
        'Deep foam or power-jet water washing of indoor unit cooling coils',
        'Cleaning outdoor unit condenser coils to remove compressed dust'
      ]},
      { heading: 'Drainage Flush', items: [
        'Unclogging and clearing the condensate drain tray',
        'Flushing the pipe line to stop water dripping or leaking inside your room'
      ]}
    ]
  },
  { 
    id: 'ac-gas-leak-refilling', 
    category: 'ac-services', 
    icon: 'Wind', 
    iconColor: '#3B82F6', 
    title: 'Gas Leak Fixes & Refilling', 
    subtitle: 'Leak detection and complete refrigerant charging',
    sections: [
      { heading: 'Leakage Detection', items: [
        'Nitrogen pressure testing to find microscopic cracks',
        'Checking for leaks in copper piping or condenser bends'
      ]},
      { heading: 'Refrigerant Charging', items: [
        'Complete top-up or fresh gas refilling',
        'Support for R32, R410A, or R22 gas types to restore full cooling power'
      ]}
    ]
  },
  { 
    id: 'ac-repair-components', 
    category: 'ac-services', 
    icon: 'Wrench', 
    iconColor: '#F59E0B', 
    title: 'Technical Repair & Component Swaps', 
    subtitle: 'PCB diagnostics and hardware replacements',
    sections: [
      { heading: 'PCB Diagnostics', items: [
        'Fixing or replacing faulty electronic circuit boards (PCBs)',
        'Troubleshooting AC units not turning on or flashing error codes'
      ]},
      { heading: 'Hardware Replacements', items: [
        'Changing out faulty fan motors and worn-out capacitors',
        'Replacing non-functional remote sensors or defective compressors'
      ]}
    ]
  },
  { 
    id: 'ac-installation', 
    category: 'ac-services', 
    icon: 'Settings', 
    iconColor: '#EF4444', 
    title: 'Installation & Dismantling', 
    subtitle: 'Fresh setup, mounting, and safe relocation',
    sections: [
      { heading: 'Fresh Setup', items: [
        'Safe masonry drilling, bracket mounting, and indoor/outdoor alignment',
        'Copper insulation profiling for new Split or Window ACs'
      ]},
      { heading: 'Relocation', items: [
        'Pumping down the gas safely',
        'Dismantling the entire setup without line damage',
        'Reinstalling the unit at a new property'
      ]}
    ]
  }
]

// Paused (owner, 2 Nov 2026 — legal report): kept in this file, shown nowhere (website, app, Chat Buddy).
// Arms licence: the decision rests with the police and the Collector — paused until a lawyer approves the wording.
// To switch one back on, take its id out of this list.
export const PAUSED_SERVICES = ['arms-license']
for (let i = servicesData.length - 1; i >= 0; i--) {
  if (PAUSED_SERVICES.includes(servicesData[i].id)) servicesData.splice(i, 1)
}

export default servicesData
