/**
 * Privacy Policy and Terms of Service — one copy, shown on the website and in the app
 * (copied to the app by scripts/syncData.js). Written for India's Digital Personal Data
 * Protection Act, 2023 (DPDP). Have a lawyer read it before launch.
 */
export const LEGAL_UPDATED = '6 November 2026'
export const LEGAL_CONTACT = {
  phone: '+91 83285 55396',
  whatsapp: '+91 83285 55396',
  post: 'iN Empower, Ongole, Prakasam District, Andhra Pradesh, India',
}

/**
 * Government services (owner, 2 Nov 2026 — legal report): every page of these groups says we are
 * not a government office, in the app and on the website.
 */
export const GOV_GROUPS = ['identity', 'mro', 'rto', 'municipal', 'collector', 'revenue', 'startup']
export const GOV_NOTICE = {
  en: 'We are not a government office. Government fees are paid at the official rate.',
  te: 'మేము ప్రభుత్వ కార్యాలయం కాదు. ప్రభుత్వ ఫీజులు అధికారిక రేటు ప్రకారమే చెల్లించబడతాయి.',
}
export const isGovService = (s) => !!s && GOV_GROUPS.includes(s.category)
export const govNotice = (lang) => GOV_NOTICE[lang === 'te' ? 'te' : 'en']

/**
 * Complaints (Consumer Protection (E-Commerce) Rules, 2020 — owner, 6 Nov 2026): the Grievance
 * Officer, how to complain, and the 48-hour / one-month promise. No days are given for refunds.
 * REGISTERED: the company's registered name and address — filled in after registration, shown when set.
 */
export const GRIEVANCE_OFFICER = 'Megha Kalyan'
export const REGISTERED = { name: '', address: '' }
const COMPLAINTS = {
  en: {
    title: 'Complaints',
    lead: 'Something not right? Tell us and we will put it right.',
    how: 'Call or WhatsApp our team with your reference number (IN-…) and what went wrong.',
    officerH: 'Grievance Officer',
    officer: `${GRIEVANCE_OFFICER}, Grievance Officer, iN Empower`,
    times: 'We acknowledge every complaint within 48 hours and resolve it within one month.',
    moneyH: 'Work Done or Money Back',
    money: 'If we cannot get the work done, iN Empower pays you back for the part that was not done. Government fees already paid to an office for you are not refunded — you get the office\'s receipt.',
    office: 'Office', registered: 'Registered name', regAddress: 'Registered address',
    rules: 'As the Consumer Protection (E-Commerce) Rules, 2020 require.',
    call: 'Call', whatsapp: 'WhatsApp', terms: 'Read the Terms',
  },
  te: {
    title: 'ఫిర్యాదులు',
    lead: 'ఏదైనా సరిగా లేదా? మాకు చెప్పండి, సరిచేస్తాము.',
    how: 'మీ రిఫరెన్స్ నంబర్ (IN-…), ఏమి జరిగిందో మా బృందానికి కాల్ లేదా WhatsApp చేసి చెప్పండి.',
    officerH: 'ఫిర్యాదుల అధికారి (గ్రీవెన్స్ ఆఫీసర్)',
    officer: `${GRIEVANCE_OFFICER}, ఫిర్యాదుల అధికారి, iN Empower`,
    times: 'ప్రతి ఫిర్యాదు అందినట్లు 48 గంటల్లో తెలియజేసి, ఒక నెలలోపు పరిష్కరిస్తాము.',
    moneyH: 'పని పూర్తి లేదా డబ్బు వాపస్',
    money: 'పని పూర్తి చేయలేకపోతే, పూర్తి కాని భాగానికి iN Empower మీ డబ్బు వాపస్ ఇస్తుంది. మీ కోసం కార్యాలయానికి ఇప్పటికే చెల్లించిన ప్రభుత్వ ఫీజులు వాపస్ రావు — ఆ కార్యాలయం రసీదు మీకు ఇస్తాము.',
    office: 'కార్యాలయం', registered: 'నమోదైన పేరు', regAddress: 'నమోదైన చిరునామా',
    rules: 'వినియోగదారుల రక్షణ (ఇ-కామర్స్) నియమాలు, 2020 ప్రకారం.',
    call: 'కాల్', whatsapp: 'WhatsApp', terms: 'నిబంధనలు చదవండి',
  },
}
export const complaintsText = (lang) => COMPLAINTS[lang === 'te' ? 'te' : 'en']

export const PRIVACY = {
  title: 'Privacy Policy',
  intro: [
    'iN Empower ("we", "us") helps people in Prakasam District (and the other cities listed on our website and app) get everyday work done through verified Local Buddies. This policy explains, in plain words, what personal details we collect, why, who sees them, how long we keep them and what you can ask us to do with them. It applies to our website, our mobile app, Chat Buddy and our WhatsApp and phone conversations.',
    'Under India\'s Digital Personal Data Protection Act, 2023, iN Empower is the "Data Fiduciary" for your details and you are the "Data Principal".',
  ],
  sections: [
    {
      h: '1. What we collect',
      list: [
        'Contact details you give us: name, phone number, email (optional), town or address.',
        'Your request: the service or supplies you ask for and your answers in the steps (for example budget, dates, place), plus any note you add.',
        'Documents and details for the work: only what a job needs (for example for a certificate or Voter ID application), and only when you share them with our team for that job.',
        'Local Buddy applicants: name, phone, town, age group, gender, availability, vehicle and smartphone, education, address and skills.',
        'Sign-in: your email and phone, used to send a one-time code and show your requests.',
        'App and website health: pages opened and app errors, kept without your name or phone number.',
        'Your city: the iN Empower city you choose (for example Ongole), so you see its services and phone number.',
        'Your location — only if you allow it: your phone or browser uses it once to find the nearest iN Empower city and town. The location itself is not sent to us or saved; only the name of the nearest town may be added to a request you send.',
        '"Not in your city yet?": the city name you type, and your name and number if you give them, so we can tell you when we start there.',
      ],
    },
    {
      h: '2. Why we use it',
      list: [
        'To call you back, understand your request and give you a clear quote.',
        'To assign a Local Buddy (and, where needed, a Business Partner such as a supplier) and get the work done.',
        'To send you updates about your request by phone, WhatsApp, SMS or email — including automatic WhatsApp messages to the number you gave when your request moves to the next step (a Local Buddy is assigned, we called you, work started, done or closed). Reply STOP on WhatsApp, or tell us at any time, and we will stop these messages.',
        'To check and contact Local Buddy applicants.',
        'To show the services, towns and phone number of your city, and to plan which cities to start in next.',
        'To keep records the law requires (for example accounts and tax) and to handle complaints.',
        'To fix problems and improve the website and app.',
      ],
      p: ['We use your details only for these purposes. We do not sell your details and we do not use them for advertising by others.'],
    },
    {
      h: '3. Your consent',
      p: [
        'When you send a request, apply as a Local Buddy or sign in, you agree that we may use your details for the purposes above. You can withdraw this consent at any time by telling us (see "Contact us"). Withdrawing does not affect what was done before, but we may not be able to finish a request without your details.',
      ],
    },
    {
      h: '4. Who sees your details',
      list: [
        'Our team at iN Empower.',
        'The Local Buddy assigned to your request — only your name, phone, area and what the job needs.',
        'A Business Partner (such as a supplier, vendor or caterer) — only what is needed to quote: the item or work and your town or village. Partners never get your name, phone number, email or address; your Local Buddy deals with them for you and is there at delivery or work.',
        'Government offices or other authorities — only when you ask us to apply or submit something for you, or when the law requires it.',
        'Companies that run our systems for us: database and sign-in (Supabase), messages (WhatsApp by Meta, SMS and email services). They may store data on servers in India or other countries and may use it only to provide their service to us.',
      ],
    },
    {
      h: '5. How long we keep it',
      p: [
        'We keep your details only as long as needed for the purpose: while your request is open, and afterwards for the time the law requires for records (such as accounts) or to handle a complaint. Requests that never started and Local Buddy applications that were not taken forward are deleted when no longer needed. You can ask us to delete your details earlier (see your rights).',
      ],
    },
    {
      h: '6. Your rights',
      list: [
        'Ask what details we hold about you and who we shared them with.',
        'Ask us to correct, complete or update your details.',
        'Ask us to delete your account and details (unless the law requires us to keep them). In the app: Profile → Settings → "Delete my account". Without the app: inempower.inempower.workers.dev/delete-account. We finish within 7 days and confirm.',
        'Withdraw your consent.',
        'Make a complaint to our grievance contact, and if you are not satisfied, to the Data Protection Board of India.',
        'Nominate a person to use these rights for you if you are unable to.',
      ],
      p: ['To use any of these rights, contact us on WhatsApp or phone. We may ask you to confirm who you are.'],
    },
    {
      h: '7. Children',
      p: [
        'Our services are for adults. Requests about a child (for example home tuition or college admission) must be made by a parent or guardian, and we use the child\'s details only for that request.',
      ],
    },
    {
      h: '8. Keeping your details safe',
      p: [
        'Only our team can see requests; access is protected by sign-in and database rules. Local Buddies see only the jobs given to them. If a data breach affects you, we will tell you and the authorities as the law requires.',
      ],
    },
    {
      h: '9. Changes to this policy',
      p: ['If we change this policy we will update the date at the top and, for important changes, tell you in the app or on WhatsApp.'],
    },
    {
      h: '10. Contact us / grievance contact',
      p: [
        'Questions, requests or complaints about your personal details: contact our Grievance Officer, Megha Kalyan — WhatsApp or call +91 83285 55396, or write to iN Empower, Ongole, Prakasam District, Andhra Pradesh, India. We aim to reply within 7 working days.',
      ],
    },
  ],
}

export const TERMS = {
  title: 'Terms of Service',
  intro: [
    'These terms apply when you use the iN Empower website, mobile app, Chat Buddy, WhatsApp or phone service. By sending a request or using our services you agree to them. Please read them with our Privacy Policy.',
  ],
  sections: [
    {
      h: '1. What iN Empower does',
      p: [
        'iN Empower, based in Ongole, helps people in Prakasam District and the other cities listed on our website and app get everyday work done — government certificates and applications, RTO work, property papers, professional services, building supplies and more — through verified Local Buddies and, where needed, Business Partners such as suppliers.',
        'For government work, we help you prepare and submit applications. iN Empower is not a government office and is not part of any government department. Government fees are paid at the official rate and shown separately from our service fee. The decision (for example issuing a certificate or card) is made by the government office, and we cannot promise a particular result or timeline from that office.',
      ],
    },
    {
      h: '2. Quotes and payment',
      p: [
        'Our team shares a clear quote before any work starts. Work begins only after you agree to it. Payment is made to iN Empower: an advance to begin, and the balance as agreed in the quote. Home tuition fees are paid per week or per month, according to the plan chosen. Government fees and materials are shown separately in the quote where they apply.',
      ],
    },
    {
      h: '3. Work Done or Money Back',
      p: [
        'Work is done when the paper, item or result is handed over to you, or when the work is finished and you confirm it.',
        'If we cannot get the work done, iN Empower pays you back for the part of the work that was not done. To claim, call or WhatsApp our team with your reference number (IN-…). We check what was done and pay you back for the rest.',
        'Government fees already paid to an office for you are not refunded; we give you the office\'s receipt.',
        'If you cancel before work starts, we return your advance, minus any costs already spent for you (such as government fees or materials).',
      ],
    },
    {
      h: '4. Local Buddies',
      p: [
        'Local Buddies are checked by our team before they take jobs, and they work on requests that iN Empower assigns and follows up. Please contact iN Empower (not the Local Buddy) about prices, payments, changes or complaints.',
        'When a supplier or other Business Partner is needed, your Local Buddy talks to them for you and is present when goods are delivered or work is done. Partners do not get your contact details, and we do not share theirs; please arrange everything through iN Empower and your Local Buddy.',
      ],
    },
    {
      h: '5. Your part',
      list: [
        'Give true and complete information and genuine documents.',
        'Be available on the phone number you gave, and be present (or have someone present) when work at your place is done.',
        'Use our services only for lawful purposes and do not misuse the website or app.',
      ],
    },
    {
      h: '6. Limits of our responsibility',
      p: [
        'We do our work with care. We are not responsible for delays or refusals caused by government offices, by wrong information or documents given to us, or by events outside our control (such as floods, strikes or system outages). Our total responsibility for a request is limited to the amount you paid for it, except where the law does not allow such a limit. If we cannot get the work done for any of these reasons, section 3 (Work Done or Money Back) still applies.',
      ],
    },
    {
      h: '7. Your account',
      p: [
        'You can stop using our services and ask us to delete your account at any time. We may suspend an account that is used to give false information, misuse the service or harm others, and we will tell you why.',
      ],
    },
    {
      h: '8. Changes and law',
      p: [
        'We may update these terms; the date at the top shows the latest version. These terms are governed by the laws of India, and courts at Ongole, Andhra Pradesh have jurisdiction.',
      ],
    },
    {
      h: '9. Complaints',
      p: [
        'Tell our Grievance Officer, Megha Kalyan: call or WhatsApp +91 83285 55396, or write to iN Empower, Ongole, Prakasam District, Andhra Pradesh, India. Please give your reference number (IN-…).',
        'We acknowledge every complaint within 48 hours and resolve it within one month, as the Consumer Protection (E-Commerce) Rules, 2020 require.',
      ],
    },
    {
      h: '10. Contact us',
      p: ['WhatsApp or call +91 83285 55396, or write to iN Empower, Ongole, Prakasam District, Andhra Pradesh, India.'],
    },
  ],
}
