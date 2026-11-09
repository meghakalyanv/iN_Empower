/**
 * Desktop home page text, English and Telugu side by side.
 * The phone home page (MobileHome) uses LanguageContext STRINGS instead.
 * Please have a Telugu speaker review before launch.
 */
import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { placeDeep, currentCity, quickTowns, listedCities, cityName, regionName, stateName } from '../data/cities'

export const HOME_TEXT = {
  en: {
    pageTitle: 'iN Empower | Your Verified Local Buddy in Prakasam District',
    hero: {
      label: 'The Ultimate Local Authority',
      line1a: 'Your ', line1b: 'Verified Local Buddy', line1c: ',',
      line2: 'Across Prakasam District.',
      text: 'Experience seamless execution across Prakasam District. We connect families, businesses, and visitors with meticulously verified Local Buddies—transforming complex government procedures and essential property services into a flawless, trust-driven experience.',
      explore: 'Explore Services →', how: 'How It Works',
      alt: 'Kalamkari style painting of a customer signing papers with a trusted smile while a Local Buddy in a Namaste gesture greets him in a red sandalwood office',
    },
    ticker: ['3-Tier Verified Buddies', 'Work Done or Money Back', 'Background Checked', 'Government ID Verified', '90+ Local Services', 'Starting in Ongole, Prakasam', 'Clear quote before any work starts', 'Money Back if Not Done', 'Help in Telugu & English', 'Built for Your Hometown'],
    problem: {
      label: 'The Crisis', title: 'Why India Needs a', hi: 'Trust Engine',
      text: 'Millions face the same broken cycle — talent drains away, local services remain unverified, and customers have zero trust in unknown Local Buddies.',
      items: [
        { title: 'Talent Drain', desc: 'Educated youth leave regional cities for metros, creating overcrowded cities and underdeveloped hometown economies. Local potential goes untapped.' },
        { title: 'The Missing Link', desc: 'There is no centralized system to connect trusted local people or provide verified services. Result: untapped talent and lost local opportunities.' },
        { title: 'Customer Fear', desc: 'Visitors and customers lack trust in unknown Local Buddies and unverified service providers. Safety, reliability, and transparency are major concerns.' },
      ],
    },
    solution: {
      label: 'The Solution', title: 'The iN Empower', hi: 'Trust Engine',
      text: 'A Human-Verified Authority Platform that connects families, travellers and businesses with trusted local individuals — with clear quotes, and your money back if the work isn’t done.',
      items: [
        { title: 'Human-Verified', desc: 'Every local individual is physically screened, verified, and trusted — ensuring safe and reliable interactions every time.' },
        { title: 'Beyond Algorithms', desc: 'We go beyond AI-based matching with real human verification that evaluates skills, assets, and intent at a personal level.' },
        { title: 'Work Done or Money Back', desc: 'You get a clear quote before anything starts. If we can’t get your work done, we pay you back. No surprises.' },
        { title: 'Every Corner of Prakasam', desc: 'Serving towns and villages across Prakasam District — ensuring equal opportunity and faster, safer service delivery.' },
      ],
    },
    vision: {
      visionTitle: 'Our Vision', vision: 'To empower the heart of India—our local communities. We dream of a future where families stay together, where local talent is nurtured, and every hometown blossoms into a thriving, self-sustaining family.',
      missionTitle: 'Our Mission', mission: 'To create a safe, welcoming space where travelers, businesses, and locals can connect with complete peace of mind. We take the worry out of the equation so you can focus on building meaningful relationships.',
      alt: 'Kalamkari style painting of an Indian Local Buddy shaking hands with a happy customer at a Collector Office',
      chLabel: 'The Challenge', chTitle: 'Reconnecting', chHi: 'Our Communities',
      chText: 'In a rapidly changing world, many of our vibrant local communities are losing their brightest sparks. Here is why we care deeply about this.',
      challenges: [
        { title: 'Leaving Home', desc: 'Every year, millions of talented youth have to leave their families behind for big cities just to find opportunities. We believe no one should have to choose between their career and their loved ones.' },
        { title: 'Hidden Potential', desc: 'There is so much incredible talent in our hometowns waiting to be discovered. We just need a caring bridge to connect this local brilliance with those who need it most.' },
        { title: 'The Need for Safety', desc: 'It is natural to feel uncertain when asking for help in a new place. We understand that feeling safe, respected, and knowing you are in good hands is the most important thing.' },
      ],
      prLabel: 'Our Promise', prTitle: 'Empowering', prHi: 'Every Hometown',
      prText: 'We are nurturing local talent to build a loving, supportive ecosystem—helping everyone thrive in three meaningful ways.',
      promises: [
        { title: 'Earning with Dignity', desc: 'Anyone can immediately share their unique skills and local knowledge to support themselves. No barriers—just your natural talent and a supportive community.' },
        { title: 'Keeping Families Together', desc: 'By creating genuine opportunities right at home, we help keep families united and breathe fresh life back into our beloved hometowns.' },
        { title: 'Growing Together', desc: 'We help you grow into community leaders and trusted guides. It is about building long-term confidence, identity, and a deep sense of hometown pride.' },
      ],
      jLabel: 'How We Care', jTitle: 'Our Journey', jHi: 'Together',
      jText: 'From understanding your needs to watching you succeed—here is how iN Empower builds relationships across Prakasam District.',
      journey: [
        { title: 'Listening to Communities', desc: 'We take the time to understand the unique skills, stories, and dreams of each local neighborhood.' },
        { title: 'Meeting Our Buddies', desc: 'We personally meet and get to know every individual, ensuring they are reliable, kind, and ready to help.' },
        { title: 'Sharing Your Gifts', desc: 'We beautifully showcase your verified skills so that anyone who needs a helping hand can easily find you.' },
        { title: 'Keeping You Safe', desc: 'You get a clear quote before any work starts, and your money back if the work isn’t done — so everyone feels protected and respected.' },
        { title: 'Celebrating Success', desc: 'We celebrate every milestone, tracking how our communities are growing happier and healthier together.' },
        { title: 'Learning & Growing', desc: 'We provide gentle guidance and training, helping our buddies unlock their full potential and blossom.' },
        { title: 'A Place to Belong', desc: 'We are setting up warm, welcoming physical spaces where our buddies can gather, support each other, and belong.' },
        { title: 'Cherishing Our Roots', desc: 'We ensure that the prosperity stays within the community, letting hometowns flourish and families stay close.' },
        { title: 'Welcoming the World', desc: 'We proudly connect our trusted local friends with people from all over the world, spreading Indian hospitality globally.' },
      ],
    },
    how: {
      label: 'The Process', titleA: 'Simple ', titleHi: '4-Step', titleB: ' Journey',
      text: "Getting started with iN Empower is straightforward. We navigate the complexities of local environments, like government offices, so you don't have to. Here's how it works from start to finish.",
      alt: 'Kalamkari style painting of a clean, professional Indian government office environment',
      steps: [
        { title: 'Tell Us What You Need', desc: 'Submit your service request through our platform. Share the details of what you need — from documents to services.' },
        { title: 'We Match & Verify', desc: 'Our team identifies the best verified Local Buddy for your task. Every Local Buddy is human-verified with a 3-tier trust process.' },
        { title: 'Clear Quote', desc: 'Before any work starts, our team tells you exactly what it costs. No hidden charges.' },
        { title: 'Work Done or Money Back', desc: 'Your Local Buddy completes the task and you check it. If anything can’t be done, we pay you back for that part. Rate your experience and build the trust network.' },
      ],
    },
    marquee: ['Identity & Records', 'Property Services', 'RTO Services', 'Startup Registration', 'Municipal Services', 'Court & Legal', 'MRO & Revenue', 'Education Services', 'Professional Drivers', 'Home Chefs', 'Granite & Tiles', 'Construction Sand', 'Logistics', 'Catering Services'],
    catalog: {
      label: 'What We Offer', title: 'Comprehensive', hi: 'Service Catalog',
      text: "We're here to make your life easier — whether it's a government task, a professional need, or a personal milestone. Explore our trusted services, designed with care for people like you.",
      btn: 'View Full Service Catalog →',
    },
    supplies: {
      label: 'Verified Local Suppliers', title: 'Direct from', hi: 'Ongole Businesses',
      text: 'We connect you with trusted local suppliers for all your construction, event, and business needs. Verified quality, transparent pricing.',
      items: ['Granite & Tiles', 'Construction Sand', 'Logistics', 'Catering'],
      btn: 'Explore All Local Supplies →',
    },
    promos: [
      { title: 'Local Supplies', desc: 'Granite, sand, tiles, transport — directly from verified Ongole businesses with transparent pricing.', cta: 'Browse Supplies →' },
      { title: 'Part-time Jobs', desc: 'Flexible earning opportunities for youth — drivers, chefs, local guides. Start earning from your hometown.', cta: 'Find Opportunities →' },
      { title: 'Free Workshops', desc: 'Skill-building workshops on farming, finance, yoga, and more — empowering communities through knowledge.', cta: 'Explore Workshops →' },
    ],
    segments: {
      label: 'For Everyone', title: 'Tailored for', hi: 'Every Segment',
      text: "Whether you're a family, a traveller or a business — iN Empower adapts to your needs.",
      tabs: { travelers: 'Families & Travellers', businesses: 'Businesses' },
      travelers: [
        { title: '🧳 Lifestyle Support', intro: 'Need help navigating a new city? Our verified Local Buddies provide daily support including:',
          list: ['Local guidance and orientation', 'Verified driver services (hourly/daily)', 'Home chef services for events or daily meals', 'Government paperwork assistance', 'Local recommendations and bookings'] },
        { title: '✅ Our Promises', intro: 'Every traveler interaction is protected by our trust framework:',
          bold: [['Work done or money back', ' — a clear quote first, and a refund for any part not done'], ['3-Tier Verified', ' Local Buddies with Trust Seals'], ['Progress updates', ' in My requests on the website and app'], ['Background-checked', ' individuals only']] },
      ],
      businesses: [
        { title: '🏢 Business Expansion Support', intro: 'Expanding to a new city? Our platform provides end-to-end support:',
          list: ['Property research and registration assistance', 'Startup registration (Proprietorship to Pvt Ltd)', 'Municipal approvals and trade licences', 'Local legal and CA partner connections', 'Land records verification via Meebhoomi'] },
        { title: '📊 Professional Back-Office', intro: "Our CA partner firm handles the complexity so you don't have to:",
          bold: [['Document Auditing', ' before submission'], ['IGRS AP Portal', ' pre-validation'], ['Legal compliance', ' verification'], ['Property ID', ' geo-verification'], ['End-to-end', ' process management']] },
      ],
    },
    verify: {
      label: 'Safety First', title: 'Our 3-Tier', hi: 'Verification',
      text: 'Every Local Buddy must pass a rigorous, tiered verification process before they appear on our platform.',
      tiers: [
        { badge: 'Tier 1 — Mandatory', title: 'Identity & Legal', desc: 'The foundational layer of trust — every Local Buddy must pass this.', items: ['Government ID verification (Aadhaar/Voter ID)', 'Valid Driving Licence (for drivers)', 'Criminal background check (e-KYC)', 'Health/Hygiene certificate (for chefs)'] },
        { badge: 'Tier 2 — Proficiency', title: 'Practical Assessment', desc: 'Hands-on validation by our field team ensures real-world competency.', items: ['Local Buddy-led physical road test (drivers)', 'Taste & skill verification (chefs)', 'Safety & sanitation standards check', 'Vehicle condition inspection'] },
        { badge: 'Tier 3 — Trust Seal', title: 'The "iN Empower" Seal', desc: 'The final stamp of approval — displayed on profiles for customer confidence.', items: ['Digital Trust Seal on profile', 'iN Empower digital ID card', 'Professional branding kit', 'Customer review monitoring'] },
      ],
      payLabel: 'No Surprises', payTitle: 'How', payHi: 'Payment Works',
      payText: 'Simple and fair for customers and Local Buddies: you know the price first, pay an advance to iN Empower to begin, and get your money back for any work we can’t do.',
      pay: [
        { title: 'You Ask', desc: 'Tell us what you need — in Telugu or English.' },
        { title: 'Clear Quote', desc: 'Our team tells you the price, the advance and when the balance is due — before any work starts.' },
        { title: 'You Pay iN Empower', desc: 'Pay the advance to begin, and the balance as agreed in your quote.' },
        { title: 'Work Done or Money Back', desc: 'Your Local Buddy completes the task. If anything can’t be done, we pay you back for that part.' },
      ],
    },
    values: {
      label: 'What Matters Most', title: 'Our Core', hi: 'Values',
      items: [
        { title: 'Compassion First', desc: 'Every interaction is rooted in empathy, kindness, and human connection.' },
        { title: 'Hometown Pride', desc: 'We believe in nurturing communities from within, honoring their unique spirit.' },
        { title: 'Peace of Mind', desc: 'We communicate openly so you always feel safe, heard, and understood.' },
        { title: 'Growing Together', desc: 'We focus on building lasting relationships that enrich lives over the long term.' },
      ],
    },
    faq: {
      label: 'Got Questions?', title: 'Frequently', hi: 'Asked',
      items: [
        { q: 'What exactly is a "Local Buddy" in iN Empower?', a: 'A "Local Buddy" is a locally-based, human-verified individual who acts as your trusted representative. They physically handle tasks like visiting government offices, managing paperwork, or providing services like driving and cooking — all vetted through our 3-tier verification process.' },
        { q: 'When do I pay?', a: 'Our team gives you a clear quote before any work starts — no hidden charges. You pay an advance to iN Empower to begin, and the balance as agreed in your quote. If the work isn’t done, we pay you back for the part that wasn’t done. If you cancel before work starts, we return your advance, minus anything already spent for you (like government fees or materials).' },
        { id: 'where', q: 'Is iN Empower available in my city?', a: 'We serve Prakasam District, Andhra Pradesh — Ongole, Chirala, Kandukur and the surrounding mandals and villages.' },
        { q: 'What documents do I need to provide for government services?', a: "Each service has specific document requirements which are listed on our Services page. Generally, you'll need your Aadhaar card, relevant identity proofs, and service-specific documents. Our team will guide you through the exact checklist during the booking process so nothing is missed." },
        { q: 'Can I become an iN Empower Local Buddy?', a: "Absolutely! If you have local knowledge and skills, you can apply to become a Local Buddy. You'll go through our 3-tier verification process — Identity & Legal checks, a Practical Proficiency test, and earn the iN Empower Trust Seal. Once verified, you'll start receiving service requests and earning income. Apply on our “Become a Local Buddy” page (link at the bottom of every page)." },
        { q: "What happens if I'm not satisfied with a service?", a: 'Tell us on WhatsApp or by phone. Our team will look into it with your Local Buddy and put it right.' },
      ],
    },
    cta: {
      title: 'Ready to Experience', hi: 'Trusted Local Services',
      text: 'Be among the first in Ongole to let a verified Local Buddy handle government services, property matters, and more — hassle-free.',
      btn: 'Get Started Today →',
    },
    stats: ['Local Services', 'Service Categories', 'Languages: Telugu & English', 'Buddy Verification'],
    tierSuffix: '-Tier',
    notFound: {
      title: 'Page Not Found',
      text: 'Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      btn: 'Return to Homepage',
    },
  },

  te: {
    pageTitle: 'iN Empower | ప్రకాశం జిల్లాలో మీ నమ్మకమైన లోకల్ బడ్డీ',
    hero: {
      label: 'మీ ఊరిలో నమ్మకమైన తోడు',
      line1a: 'మీ ', line1b: 'ధృవీకరించిన లోకల్ బడ్డీ', line1c: ',',
      line2: 'ప్రకాశం జిల్లా అంతటా.',
      text: 'ప్రకాశం జిల్లా అంతటా మీ పనులు సులభంగా పూర్తవుతాయి. కుటుంబాలు, వ్యాపారాలు, బయటి నుంచి వచ్చేవారిని జాగ్రత్తగా ధృవీకరించిన లోకల్ బడ్డీలతో కలుపుతాము — కష్టమైన ప్రభుత్వ పనులు, ముఖ్యమైన ఆస్తి సేవలను నమ్మకంగా, సాఫీగా పూర్తి చేస్తాము.',
      explore: 'సేవలు చూడండి →', how: 'ఇది ఎలా పనిచేస్తుంది',
      alt: 'కలంకారీ చిత్రం: లోకల్ బడ్డీ నమస్కారం చేస్తుండగా ఒక వినియోగదారు నమ్మకంతో పత్రాలపై సంతకం చేస్తున్నారు',
    },
    ticker: ['3 దశల ధృవీకరణ పొందిన బడ్డీలు', 'పని పూర్తి, లేదా డబ్బు వాపసు', 'నేపథ్యం తనిఖీ చేసినవారు', 'ప్రభుత్వ గుర్తింపు ధృవీకరణ', '90+ స్థానిక సేవలు', 'ఒంగోలు, ప్రకాశం నుంచి ప్రారంభం', 'పని మొదలయ్యే ముందే స్పష్టమైన ధర', 'పని కాకపోతే డబ్బు వాపసు', 'తెలుగు & ఇంగ్లీష్‌లో సహాయం', 'మీ సొంత ఊరి కోసం'],
    problem: {
      label: 'సమస్య', title: 'భారతదేశానికి ఎందుకు కావాలి', hi: 'నమ్మకమైన వ్యవస్థ',
      text: 'లక్షల మంది ఒకే చక్రంలో చిక్కుకున్నారు — ప్రతిభ ఊరు వదిలి వెళ్ళిపోతోంది, స్థానిక సేవలు ధృవీకరణ లేకుండా ఉన్నాయి, తెలియని వ్యక్తులపై వినియోగదారులకు నమ్మకం లేదు.',
      items: [
        { title: 'ప్రతిభ వలస', desc: 'చదువుకున్న యువత చిన్న పట్టణాలు వదిలి మహానగరాలకు వెళ్తున్నారు. నగరాలు కిక్కిరిసిపోతున్నాయి, సొంత ఊర్లు వెనుకబడుతున్నాయి. స్థానిక ప్రతిభ వృథా అవుతోంది.' },
        { title: 'తప్పిపోయిన లంకె', desc: 'నమ్మకమైన స్థానిక వ్యక్తులను కలిపే లేదా ధృవీకరించిన సేవలు అందించే ఒక వ్యవస్థ లేదు. ఫలితం: వాడని ప్రతిభ, కోల్పోయిన అవకాశాలు.' },
        { title: 'వినియోగదారుల భయం', desc: 'తెలియని వ్యక్తులు, ధృవీకరణ లేని సేవలపై ప్రజలకు నమ్మకం ఉండదు. భద్రత, నమ్మకం, పారదర్శకత పెద్ద సమస్యలు.' },
      ],
    },
    solution: {
      label: 'పరిష్కారం', title: 'iN Empower', hi: 'నమ్మకమైన వ్యవస్థ',
      text: 'కుటుంబాలు, ప్రయాణికులు, వ్యాపారాలను నమ్మకమైన స్థానిక వ్యక్తులతో కలిపే మనుషులే ధృవీకరించిన వేదిక — ముందే స్పష్టమైన ధర, పని కాకపోతే డబ్బు వాపసు.',
      items: [
        { title: 'మనుషులే ధృవీకరిస్తారు', desc: 'ప్రతి స్థానిక వ్యక్తిని నేరుగా కలిసి, తనిఖీ చేసి, నమ్మకం కలిగాకే తీసుకుంటాము — ప్రతిసారీ సురక్షితమైన, నమ్మకమైన సేవ.' },
        { title: 'యంత్రాలకు మించి', desc: 'కంప్యూటర్ సరిపోల్చడం మాత్రమే కాదు — నైపుణ్యం, వనరులు, ఉద్దేశాన్ని మనుషులే వ్యక్తిగతంగా పరిశీలిస్తారు.' },
        { title: 'పని పూర్తి, లేదా డబ్బు వాపసు', desc: 'ఏదైనా మొదలయ్యే ముందే స్పష్టమైన ధర చెబుతాము. మేము మీ పని పూర్తి చేయలేకపోతే, మీ డబ్బు వాపసు ఇస్తాము. ఆశ్చర్యాలు ఉండవు.' },
        { title: 'ప్రకాశంలో ప్రతి మూల', desc: 'ప్రకాశం జిల్లాలోని పట్టణాలు, గ్రామాలన్నింటికీ సేవలు — అందరికీ సమాన అవకాశం, వేగమైన, సురక్షితమైన సేవ.' },
      ],
    },
    vision: {
      visionTitle: 'మా దృష్టి', vision: 'భారతదేశానికి గుండె అయిన మన స్థానిక సమాజాలను బలోపేతం చేయడం. కుటుంబాలు కలిసి ఉండే, స్థానిక ప్రతిభ ఎదిగే, ప్రతి ఊరు స్వయం సమృద్ధిగా వికసించే భవిష్యత్తు మా కల.',
      missionTitle: 'మా లక్ష్యం', mission: 'ప్రయాణికులు, వ్యాపారాలు, స్థానికులు పూర్తి నిశ్చింతతో కలవగలిగే సురక్షితమైన, ఆత్మీయమైన వేదికను సృష్టించడం. చింత మేము తీసుకుంటాము — మీరు మంచి సంబంధాలపై దృష్టి పెట్టండి.',
      alt: 'కలంకారీ చిత్రం: కలెక్టర్ కార్యాలయం వద్ద లోకల్ బడ్డీ సంతోషంగా ఉన్న వినియోగదారుతో కరచాలనం చేస్తున్నారు',
      chLabel: 'సవాలు', chTitle: 'మన సమాజాలను', chHi: 'మళ్ళీ కలుపుదాం',
      chText: 'వేగంగా మారుతున్న ప్రపంచంలో మన ఊర్లు తమ ప్రతిభావంతులను కోల్పోతున్నాయి. అందుకే మాకు ఇది ఎంతో ముఖ్యం.',
      challenges: [
        { title: 'ఇల్లు వదిలి వెళ్ళడం', desc: 'ప్రతి సంవత్సరం లక్షల మంది ప్రతిభావంతులైన యువత అవకాశాల కోసం కుటుంబాన్ని వదిలి పెద్ద నగరాలకు వెళ్ళాల్సి వస్తోంది. ఉద్యోగమా, కుటుంబమా అని ఎవరూ ఎంచుకోవాల్సిన అవసరం ఉండకూడదు.' },
        { title: 'దాగి ఉన్న ప్రతిభ', desc: 'మన ఊర్లలో ఎంతో ప్రతిభ వెలుగులోకి రావడానికి ఎదురుచూస్తోంది. ఆ ప్రతిభను అవసరమైనవారితో కలిపే ఒక ఆత్మీయ వారధి కావాలి.' },
        { title: 'భద్రత అవసరం', desc: 'కొత్త చోట సహాయం అడగడానికి సంకోచం సహజం. సురక్షితంగా, గౌరవంగా, మంచి చేతుల్లో ఉన్నామనే భావనే అన్నింటికంటే ముఖ్యం.' },
      ],
      prLabel: 'మా హామీ', prTitle: 'ప్రతి ఊరికీ', prHi: 'బలం',
      prText: 'స్థానిక ప్రతిభను పెంచి, ఆత్మీయమైన సహాయ వ్యవస్థను నిర్మిస్తున్నాము — మూడు విధాలుగా అందరూ ఎదిగేలా.',
      promises: [
        { title: 'గౌరవంగా సంపాదన', desc: 'ఎవరైనా తమ నైపుణ్యం, స్థానిక జ్ఞానంతో వెంటనే సంపాదించవచ్చు. అడ్డంకులు లేవు — మీ ప్రతిభ, తోడుగా సమాజం.' },
        { title: 'కుటుంబాలు కలిసి', desc: 'సొంత ఊరిలోనే నిజమైన అవకాశాలు సృష్టించి, కుటుంబాలను కలిపి ఉంచుతాము, మన ఊర్లకు కొత్త జీవం తెస్తాము.' },
        { title: 'కలిసి ఎదుగుదాం', desc: 'మీరు సమాజ నాయకులుగా, నమ్మకమైన మార్గదర్శకులుగా ఎదగడానికి సహాయం చేస్తాము — ఆత్మవిశ్వాసం, గుర్తింపు, సొంత ఊరిపై గర్వం.' },
      ],
      jLabel: 'మేము ఎలా చూసుకుంటాము', jTitle: 'మన ప్రయాణం', jHi: 'కలిసి',
      jText: 'మీ అవసరం అర్థం చేసుకోవడం నుంచి మీ విజయం వరకు — ప్రకాశం జిల్లా అంతటా iN Empower సంబంధాలను ఇలా నిర్మిస్తుంది.',
      journey: [
        { title: 'సమాజాల మాట వినడం', desc: 'ప్రతి ప్రాంతం యొక్క నైపుణ్యాలు, కథలు, కలలను అర్థం చేసుకోవడానికి సమయం కేటాయిస్తాము.' },
        { title: 'మా బడ్డీలను కలవడం', desc: 'ప్రతి వ్యక్తిని నేరుగా కలిసి తెలుసుకుంటాము — నమ్మకమైనవారు, మంచివారు, సహాయానికి సిద్ధంగా ఉన్నవారని నిర్ధారిస్తాము.' },
        { title: 'మీ నైపుణ్యాన్ని చూపించడం', desc: 'మీ ధృవీకరించిన నైపుణ్యాలను అందంగా చూపిస్తాము — సహాయం కావలసినవారు మిమ్మల్ని సులభంగా కనుగొంటారు.' },
        { title: 'మిమ్మల్ని సురక్షితంగా ఉంచడం', desc: 'పని మొదలయ్యే ముందే స్పష్టమైన ధర చెబుతాము; పని కాకపోతే మీ డబ్బు వాపసు — అందరికీ రక్షణ, గౌరవం.' },
        { title: 'విజయాన్ని పండుగ చేయడం', desc: 'ప్రతి మైలురాయిని జరుపుకుంటాము, మన సమాజాలు ఎలా సంతోషంగా, ఆరోగ్యంగా ఎదుగుతున్నాయో గమనిస్తాము.' },
        { title: 'నేర్చుకోవడం & ఎదగడం', desc: 'సున్నితమైన మార్గదర్శనం, శిక్షణ ఇచ్చి మా బడ్డీలు పూర్తి సామర్థ్యంతో ఎదిగేలా చేస్తాము.' },
        { title: 'మనదనే చోటు', desc: 'మా బడ్డీలు కలవడానికి, ఒకరికొకరు తోడుగా ఉండటానికి ఆత్మీయమైన కేంద్రాలను ఏర్పాటు చేస్తున్నాము.' },
        { title: 'మూలాలను గౌరవించడం', desc: 'సంపద సమాజంలోనే ఉండేలా చూస్తాము — ఊర్లు వికసిస్తాయి, కుటుంబాలు దగ్గరగా ఉంటాయి.' },
        { title: 'ప్రపంచానికి స్వాగతం', desc: 'మా నమ్మకమైన స్థానిక మిత్రులను ప్రపంచం నలుమూలల ప్రజలతో గర్వంగా కలుపుతాము — భారతీయ ఆతిథ్యాన్ని పంచుతాము.' },
      ],
    },
    how: {
      label: 'ప్రక్రియ', titleA: 'సులభమైన ', titleHi: '4 దశల', titleB: ' ప్రయాణం',
      text: 'iN Empower తో ప్రారంభించడం చాలా సులభం. ప్రభుత్వ కార్యాలయాల లాంటి చోట్ల ఉండే చిక్కులను మేము చూసుకుంటాము — మీరు కాదు. మొదటి నుంచి చివరి వరకు ఇలా జరుగుతుంది.',
      alt: 'కలంకారీ చిత్రం: శుభ్రమైన భారతీయ ప్రభుత్వ కార్యాలయం',
      steps: [
        { title: 'మీకు ఏమి కావాలో చెప్పండి', desc: 'మా వేదిక ద్వారా మీ అభ్యర్థన పంపండి. పత్రాల నుంచి సేవల వరకు — మీ అవసరం వివరాలు చెప్పండి.' },
        { title: 'సరైన బడ్డీ, ధృవీకరణ', desc: 'మీ పనికి సరైన ధృవీకరించిన లోకల్ బడ్డీని మా బృందం ఎంచుకుంటుంది. ప్రతి బడ్డీ 3 దశల నమ్మక తనిఖీ పాస్ అయినవారే.' },
        { title: 'స్పష్టమైన ధర', desc: 'పని మొదలయ్యే ముందే ఎంత ఖర్చవుతుందో మా బృందం ఖచ్చితంగా చెబుతుంది. దాచిన ఛార్జీలు ఉండవు.' },
        { title: 'పని పూర్తి, లేదా డబ్బు వాపసు', desc: 'మీ లోకల్ బడ్డీ పని పూర్తి చేస్తారు, మీరు చూసుకుంటారు. ఏదైనా చేయలేకపోతే, ఆ భాగానికి మీ డబ్బు వాపసు ఇస్తాము. మీ అనుభవాన్ని రేట్ చేయండి.' },
      ],
    },
    marquee: ['గుర్తింపు & రికార్డులు', 'ఆస్తి సేవలు', 'RTO సేవలు', 'స్టార్టప్ రిజిస్ట్రేషన్', 'మున్సిపల్ సేవలు', 'కోర్టు & న్యాయ', 'MRO & రెవెన్యూ', 'విద్యా సేవలు', 'వృత్తిపరమైన డ్రైవర్లు', 'హోమ్ చెఫ్‌లు', 'గ్రానైట్ & టైల్స్', 'నిర్మాణ ఇసుక', 'రవాణా', 'కేటరింగ్ సేవలు'],
    catalog: {
      label: 'మేము అందించేవి', title: 'పూర్తి', hi: 'సేవల జాబితా',
      text: 'ప్రభుత్వ పని అయినా, వృత్తిపరమైన అవసరమైనా, జీవితంలో ముఖ్యమైన సందర్భమైనా — మీ జీవితాన్ని సులభం చేయడానికి మేమున్నాం. మీలాంటి వారి కోసం శ్రద్ధగా రూపొందించిన మా సేవలు చూడండి.',
      btn: 'పూర్తి సేవల జాబితా చూడండి →',
    },
    supplies: {
      label: 'ధృవీకరించిన స్థానిక సరఫరాదారులు', title: 'నేరుగా', hi: 'ఒంగోలు వ్యాపారాల నుంచి',
      text: 'నిర్మాణం, శుభకార్యాలు, వ్యాపార అవసరాలన్నింటికీ నమ్మకమైన స్థానిక సరఫరాదారులతో కలుపుతాము. ధృవీకరించిన నాణ్యత, పారదర్శక ధరలు.',
      items: ['గ్రానైట్ & టైల్స్', 'నిర్మాణ ఇసుక', 'రవాణా', 'కేటరింగ్'],
      btn: 'అన్ని స్థానిక సామగ్రి చూడండి →',
    },
    promos: [
      { title: 'స్థానిక సామగ్రి', desc: 'గ్రానైట్, ఇసుక, టైల్స్, రవాణా — ధృవీకరించిన ఒంగోలు వ్యాపారాల నుంచి నేరుగా, పారదర్శక ధరలతో.', cta: 'సామగ్రి చూడండి →' },
      { title: 'పార్ట్-టైమ్ ఉద్యోగాలు', desc: 'యువతకు సౌకర్యవంతమైన సంపాదన — డ్రైవర్లు, వంటవారు, స్థానిక గైడ్‌లు. సొంత ఊరిలోనే సంపాదించండి.', cta: 'అవకాశాలు చూడండి →' },
      { title: 'ఉచిత వర్క్‌షాప్‌లు', desc: 'వ్యవసాయం, ఆర్థికం, యోగా మరియు మరిన్నింటిపై నైపుణ్య వర్క్‌షాప్‌లు — జ్ఞానంతో సమాజానికి బలం.', cta: 'వర్క్‌షాప్‌లు చూడండి →' },
    ],
    segments: {
      label: 'అందరి కోసం', title: 'ప్రతి ఒక్కరి', hi: 'అవసరానికి తగినట్లు',
      text: 'మీరు కుటుంబమైనా, ప్రయాణికులైనా, వ్యాపారమైనా — iN Empower మీ అవసరాలకు తగినట్లు మారుతుంది.',
      tabs: { travelers: 'కుటుంబాలు & ప్రయాణికులు', businesses: 'వ్యాపారాలు' },
      travelers: [
        { title: '🧳 రోజువారీ సహాయం', intro: 'కొత్త ఊరిలో దారి తెలియడం లేదా? మా ధృవీకరించిన లోకల్ బడ్డీలు రోజూ సహాయం చేస్తారు:',
          list: ['స్థానిక మార్గదర్శనం, పరిచయం', 'ధృవీకరించిన డ్రైవర్ సేవలు (గంటకు/రోజుకు)', 'శుభకార్యాలు లేదా రోజువారీ భోజనానికి హోమ్ చెఫ్', 'ప్రభుత్వ పత్రాల పనిలో సహాయం', 'స్థానిక సూచనలు, బుకింగ్‌లు'] },
        { title: '✅ మా వాగ్దానాలు', intro: 'ప్రతి ప్రయాణికుడి సేవకు మా నమ్మక వ్యవస్థ రక్షణ:',
          bold: [['పని పూర్తి, లేదా డబ్బు వాపసు', ' — ముందు స్పష్టమైన ధర, పూర్తి కాని భాగానికి డబ్బు వాపసు'], ['3 దశల ధృవీకరణ', ' పొందిన, ట్రస్ట్ సీల్ ఉన్న లోకల్ బడ్డీలు'], ['పురోగతి సమాచారం', ' — వెబ్‌సైట్, యాప్‌లో "నా అభ్యర్థనలు"లో'], ['నేపథ్యం తనిఖీ చేసిన', ' వ్యక్తులు మాత్రమే']] },
      ],
      businesses: [
        { title: '🏢 వ్యాపార విస్తరణ సహాయం', intro: 'కొత్త ఊరికి వ్యాపారం విస్తరిస్తున్నారా? మొదటి నుంచి చివరి వరకు సహాయం:',
          list: ['ఆస్తి పరిశోధన, రిజిస్ట్రేషన్ సహాయం', 'స్టార్టప్ రిజిస్ట్రేషన్ (ప్రొప్రైటర్‌షిప్ నుంచి ప్రైవేట్ లిమిటెడ్ వరకు)', 'మున్సిపల్ అనుమతులు, ట్రేడ్ లైసెన్సులు', 'స్థానిక న్యాయ, CA భాగస్వాములతో పరిచయం', 'మీభూమి ద్వారా భూమి రికార్డుల తనిఖీ'] },
        { title: '📊 వృత్తిపరమైన బ్యాక్-ఆఫీస్', intro: 'చిక్కులన్నీ మా CA భాగస్వామి సంస్థ చూసుకుంటుంది:',
          bold: [['పత్రాల తనిఖీ', ' — సమర్పించే ముందే'], ['IGRS AP పోర్టల్', ' ముందస్తు తనిఖీ'], ['న్యాయ నిబంధనల', ' తనిఖీ'], ['ఆస్తి ID', ' స్థల ధృవీకరణ'], ['మొదటి నుంచి చివరి వరకు', ' ప్రక్రియ నిర్వహణ']] },
      ],
    },
    verify: {
      label: 'భద్రతే ముందు', title: 'మా 3 దశల', hi: 'ధృవీకరణ',
      text: 'మా వేదికపై కనిపించే ముందు ప్రతి లోకల్ బడ్డీ కఠినమైన, దశలవారీ ధృవీకరణ పాస్ కావాలి.',
      tiers: [
        { badge: 'దశ 1 — తప్పనిసరి', title: 'గుర్తింపు & చట్టపరమైన తనిఖీ', desc: 'నమ్మకానికి పునాది — ప్రతి లోకల్ బడ్డీ ఇది పాస్ కావాలి.', items: ['ప్రభుత్వ గుర్తింపు ధృవీకరణ (ఆధార్/ఓటర్ ID)', 'చెల్లుబాటయ్యే డ్రైవింగ్ లైసెన్స్ (డ్రైవర్లకు)', 'నేర నేపథ్య తనిఖీ (e-KYC)', 'ఆరోగ్య/పరిశుభ్రత సర్టిఫికేట్ (వంటవారికి)'] },
        { badge: 'దశ 2 — నైపుణ్యం', title: 'ప్రాక్టికల్ పరీక్ష', desc: 'మా క్షేత్ర బృందం నేరుగా పరీక్షించి నిజమైన నైపుణ్యాన్ని నిర్ధారిస్తుంది.', items: ['డ్రైవర్లకు రోడ్ టెస్ట్', 'వంటవారికి రుచి & నైపుణ్య పరీక్ష', 'భద్రత & పరిశుభ్రత ప్రమాణాల తనిఖీ', 'వాహన స్థితి తనిఖీ'] },
        { badge: 'దశ 3 — ట్రస్ట్ సీల్', title: '"iN Empower" సీల్', desc: 'చివరి ఆమోద ముద్ర — వినియోగదారుల నమ్మకం కోసం ప్రొఫైల్‌పై కనిపిస్తుంది.', items: ['ప్రొఫైల్‌పై డిజిటల్ ట్రస్ట్ సీల్', 'iN Empower డిజిటల్ ID కార్డ్', 'వృత్తిపరమైన బ్రాండింగ్ కిట్', 'వినియోగదారుల సమీక్షల పర్యవేక్షణ'] },
      ],
      payLabel: 'ఆశ్చర్యాలు లేవు', payTitle: 'చెల్లింపు', payHi: 'ఎలా జరుగుతుంది',
      payText: 'వినియోగదారులకు, లోకల్ బడ్డీలకు సులభం, న్యాయం: ముందు ధర తెలుస్తుంది, పని మొదలుపెట్టడానికి iN Empowerకు అడ్వాన్స్ చెల్లిస్తారు, మేము చేయలేని పనికి డబ్బు వాపసు.',
      pay: [
        { title: 'మీరు అడుగుతారు', desc: 'మీకు ఏమి కావాలో చెప్పండి — తెలుగు లేదా ఇంగ్లీష్‌లో.' },
        { title: 'స్పష్టమైన ధర', desc: 'పని మొదలయ్యే ముందే ధర, అడ్వాన్స్, మిగతా మొత్తం ఎప్పుడు చెల్లించాలో మా బృందం చెబుతుంది.' },
        { title: 'iN Empowerకు చెల్లింపు', desc: 'మొదలుపెట్టడానికి అడ్వాన్స్, మిగతా మొత్తం కోట్‌లో చెప్పినట్లు చెల్లించండి.' },
        { title: 'పని పూర్తి, లేదా డబ్బు వాపసు', desc: 'లోకల్ బడ్డీ పని పూర్తి చేస్తారు. ఏదైనా చేయలేకపోతే, ఆ భాగానికి మీ డబ్బు వాపసు ఇస్తాము.' },
      ],
    },
    values: {
      label: 'మాకు ముఖ్యమైనవి', title: 'మా ముఖ్య', hi: 'విలువలు',
      items: [
        { title: 'కరుణ ముందు', desc: 'ప్రతి పరిచయం సానుభూతి, దయ, మానవ సంబంధంపై ఆధారపడి ఉంటుంది.' },
        { title: 'సొంత ఊరిపై గర్వం', desc: 'సమాజాలను లోపలి నుంచే బలపరుస్తూ, వాటి ప్రత్యేకతను గౌరవిస్తాము.' },
        { title: 'నిశ్చింత', desc: 'మీరు ఎప్పుడూ సురక్షితంగా, వినబడుతున్నట్లు, అర్థం చేసుకోబడినట్లు అనిపించేలా బహిరంగంగా మాట్లాడతాము.' },
        { title: 'కలిసి ఎదుగుదాం', desc: 'జీవితాలను సుసంపన్నం చేసే దీర్ఘకాల సంబంధాలను నిర్మిస్తాము.' },
      ],
    },
    faq: {
      label: 'ప్రశ్నలు ఉన్నాయా?', title: 'తరచుగా అడిగే', hi: 'ప్రశ్నలు',
      items: [
        { q: 'iN Empower లో "లోకల్ బడ్డీ" అంటే ఎవరు?', a: '"లోకల్ బడ్డీ" అంటే మీ తరపున పనిచేసే, మనుషులే ధృవీకరించిన స్థానిక వ్యక్తి. ప్రభుత్వ కార్యాలయాలకు వెళ్ళడం, పత్రాల పని, డ్రైవింగ్, వంట వంటి సేవలను వారు నేరుగా చేస్తారు — అందరూ మా 3 దశల ధృవీకరణ పాస్ అయినవారే.' },
        { q: 'నేను ఎప్పుడు చెల్లించాలి?', a: 'పని మొదలయ్యే ముందే మా బృందం స్పష్టమైన ధర చెబుతుంది — దాచిన ఛార్జీలు లేవు. పని మొదలుపెట్టడానికి iN Empowerకు అడ్వాన్స్ చెల్లిస్తారు, మిగతా మొత్తం కోట్‌లో చెప్పినట్లు. పని పూర్తి చేయలేకపోతే, పూర్తి కాని భాగానికి మీ డబ్బు వాపసు ఇస్తాము. పని మొదలయ్యే ముందే రద్దు చేస్తే, మీ కోసం ఇప్పటికే ఖర్చు చేసినది (ప్రభుత్వ ఫీజులు, సామగ్రి వంటివి) తీసివేసి అడ్వాన్స్ వాపసు ఇస్తాము.' },
        { id: 'where', q: 'నా ఊరిలో iN Empower ఉందా?', a: 'మేము ఆంధ్రప్రదేశ్‌లోని ప్రకాశం జిల్లాలో సేవలు అందిస్తాము — ఒంగోలు, చీరాల, కందుకూరు మరియు చుట్టుపక్కల మండలాలు, గ్రామాలు.' },
        { q: 'ప్రభుత్వ సేవలకు ఏ పత్రాలు ఇవ్వాలి?', a: 'ప్రతి సేవకు కావలసిన పత్రాలు మా సేవల పేజీలో ఉన్నాయి. సాధారణంగా ఆధార్ కార్డ్, గుర్తింపు రుజువులు, ఆ సేవకు సంబంధించిన పత్రాలు కావాలి. బుకింగ్ సమయంలో మా బృందం పూర్తి జాబితా చెబుతుంది — ఏదీ మిస్ కాదు.' },
        { q: 'నేను iN Empower లోకల్ బడ్డీ కావచ్చా?', a: 'తప్పకుండా! మీకు స్థానిక జ్ఞానం, నైపుణ్యం ఉంటే లోకల్ బడ్డీగా దరఖాస్తు చేయండి. గుర్తింపు & చట్టపరమైన తనిఖీ, ప్రాక్టికల్ పరీక్ష తర్వాత iN Empower ట్రస్ట్ సీల్ పొందుతారు. ధృవీకరణ అయ్యాక అభ్యర్థనలు వస్తాయి, సంపాదన మొదలవుతుంది. ప్రతి పేజీ కింద ఉన్న “లోకల్ బడ్డీగా సంపాదించండి” లింక్‌లో దరఖాస్తు చేయండి.' },
        { q: 'సేవ నచ్చకపోతే ఏమవుతుంది?', a: 'వాట్సాప్ లేదా ఫోన్‌లో మాకు చెప్పండి. మా బృందం మీ లోకల్ బడ్డీతో మాట్లాడి సరిచేస్తుంది.' },
      ],
    },
    cta: {
      title: 'నమ్మకమైన స్థానిక సేవలను', hi: 'అనుభవించడానికి సిద్ధమా',
      text: 'ప్రభుత్వ సేవలు, ఆస్తి పనులు మరియు మరిన్నింటిని ధృవీకరించిన లోకల్ బడ్డీకి అప్పగించే ఒంగోలులోని మొదటివారిలో ఒకరు కండి — ఎలాంటి ఇబ్బంది లేకుండా.',
      btn: 'ఈరోజే ప్రారంభించండి →',
    },
    stats: ['స్థానిక సేవలు', 'సేవల విభాగాలు', 'భాషలు: తెలుగు & ఇంగ్లీష్', 'బడ్డీ ధృవీకరణ'],
    tierSuffix: ' దశల',
    notFound: {
      title: 'పేజీ కనబడలేదు',
      text: 'క్షమించండి! మీరు వెతుకుతున్న పేజీ తీసివేయబడి ఉండవచ్చు, పేరు మారి ఉండవచ్చు, లేదా ప్రస్తుతం అందుబాటులో లేకపోవచ్చు.',
      btn: 'హోమ్ పేజీకి వెళ్ళండి',
    },
  },
}

/** "Is iN Empower available in my city?" — written from the cities in Admin → Cities. */
export function whereAnswer(lang = 'en') {
  const c = currentCity()
  const towns = quickTowns(c).slice(0, 3).map((t) => (lang === 'te' && t.te) || t.name)
  const others = listedCities().filter((x) => x.id !== c.id)
  const live = others.filter((x) => x.status === 'live').map((x) => cityName(x, lang))
  const soon = others.filter((x) => x.status === 'soon').map((x) => cityName(x, lang))
  if (lang === 'te') {
    const st = stateName(c, 'te')
    const inState = st ? `${st}${st.endsWith('్') ? '\u200c' : ''}లోని ` : ''
    return [
      `మేము ${inState}${regionName(c, 'te')}లో సేవలు అందిస్తాము — ${towns.join(', ')} మరియు చుట్టుపక్కల ఊళ్ళు, గ్రామాలు.`,
      live.length ? `${live.join(', ')}లో కూడా ఉన్నాం.` : '',
      soon.length ? `త్వరలో: ${soon.join(', ')}.` : '',
      'మీ నగరం లేదా? పైన 📍 నొక్కి మాకు చెప్పండి.',
    ].filter(Boolean).join(' ')
  }
  const st = stateName(c)
  return [
    `We serve ${regionName(c)}${st ? `, ${st}` : ''} — ${towns.join(', ')} and the nearby towns and villages.`,
    live.length ? `We're also in ${live.join(', ')}.` : '',
    soon.length ? `Coming soon: ${soon.join(', ')}.` : '',
    'Not in your city yet? Tap 📍 at the top and tell us.',
  ].filter(Boolean).join(' ')
}

/** The home text in the chosen language, with the place names of the customer's city. */
export function useHomeText() {
  const { lang } = useLanguage()
  const cityId = currentCity().id
  return useMemo(() => {
    const H = placeDeep(HOME_TEXT[lang] || HOME_TEXT.en)
    const where = whereAnswer(lang === 'te' ? 'te' : 'en')
    return { ...H, faq: { ...H.faq, items: H.faq.items.map((it) => (it.id === 'where' ? { ...it, a: where } : it)) } }
  }, [lang, cityId])
}
