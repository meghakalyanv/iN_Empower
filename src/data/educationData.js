/**
 * College admissions and home tuition content — shared by the website and the mobile app (same business, same data).
 * Edit here only; the app copies it with `npm run sync-data`.
 */
export const colleges = [
  {
    id: 'qis-college',
    name: 'QIS COLLEGE OF ENGINEERING & TECHNOLOGY',
    logo: '🎓',
    location: 'Ongole, A.P.',
    description: 'Autonomous Engineering College in the State of Andhra Pradesh (ESTD: 1998). NAAC A+ Accredited.',
    images: [
      'https://qiscet.edu.in/qiscet/images/qiscetGal_1.jpg',
      'https://qiscet.edu.in/qiscet/images/qiscetGal_2.jpg',
      'https://qiscet.edu.in/qiscet/images/qiscetGal_3.jpg',
      'https://qiscet.edu.in/qiscet/images/qiscetGal_4.jpg',
      'https://qiscet.edu.in/qiscet/images/SA112.jpg'
    ],
    courses: [
      {
        category: 'B.Tech',
        programs: [
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
          'Mechanical Engineering'
        ]
      },
      {
        category: 'M.Tech',
        programs: [
          'Artificial Intelligence and Machine Learning',
          'Computer Science and Engineering',
          'VLSI and Embedded Systems',
          'Transportation Engineering',
          'Structural Engineering',
          'Power Electronics and Power Systems',
          'Thermal Engineering'
        ]
      },
      {
        category: 'Management & Computer Applications',
        programs: [
          'MBA',
          'MBA (Hospital & Health Care Management)',
          'MBA (Artificial Intelligence & Data Science)',
          'MBA (Corporate Communication & Event Management)',
          'BCA',
          'MCA with AI'
        ]
      },
      {
        category: 'QIS COLLEGE OF PHARMACY',
        programs: [
          'B.Pharm',
          'Pharm.D',
          'Pharm.D (PB)',
          'M.PHARM: Pharmaceutics',
          'M.PHARM: Pharmaceutical Analysis',
          'M.PHARM: Pharmacology',
          'M.PHARM: Pharmaceutical Regulatory Affairs'
        ]
      }
    ]
  }
]

export const educationLevels = [
  {
    id: 'primary',
    name: 'Primary (Classes 1-5)',
    icon: '/images/icon_kalamkari_primary.webp',
    description: 'Build a strong foundation for your child with our expert primary tutors.',
    subjects: [
      'Mathematics',
      'Science',
      'English',
      'Hindi / Regional Language'
    ]
  },
  {
    id: 'secondary',
    name: 'Secondary (Classes 6-10)',
    icon: '/images/icon_kalamkari_secondary.webp',
    description: 'Focused learning for board exam preparation and deeper understanding.',
    subjects: [
      'Mathematics',
      'Physical Science (Physics, Chemistry)',
      'Biological Science (Biology)',
      'Social Studies',
      'English'
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate (11th & 12th)',
    icon: '/images/icon_kalamkari_intermediate.webp',
    description: 'Expert guidance for MPC, BiPC, CEC, MEC, and competitive exams.',
    subjects: [
      'Mathematics (A & B)',
      'Physics',
      'Chemistry',
      'Botany & Zoology',
      'Accounts & Commerce',
      'Economics',
      'Civics'
    ]
  },
  {
    id: 'graduation',
    name: 'Graduation (Degree & B.Tech)',
    icon: '/images/icon_kalamkari_education.webp',
    description: 'Specialized tutoring for degree and engineering subjects.',
    subjects: [
      'Engineering Mathematics',
      'Computer Science (C, C++, Java, Python)',
      'Financial Accounting',
      'Advanced Physics',
      'Advanced Chemistry',
      'Business Statistics'
    ]
  }
]
