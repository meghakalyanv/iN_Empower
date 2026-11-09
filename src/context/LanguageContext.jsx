import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { placeText } from '../data/cities'

/**
 * Website language: English / తెలుగు. The choice is remembered in this browser.
 * Text lives in STRINGS below; anything without a Telugu line falls back to English.
 * Please have a Telugu speaker review these lines before launch.
 */
const KEY = 'inempower_lang'

const STRINGS = {
  en: {
    langSwitch: 'తెలుగు',
    langSwitchLabel: 'తెలుగు (Telugu)',
    // menus
    navHome: 'Home', navTutor: 'Tutor', navServices: 'Services', navSupplies: 'Supplies', navProperty: 'Property',
    navYouth: 'Youth Hub', navTravel: 'Travel', navDashboard: 'My Dashboard', navLogin: 'Login', navProfile: 'Profile',
    getStarted: 'Get Started',
    // phone home
    mhBadge: 'Work Done or Money Back',
    mhTitle1: 'Your Trusted Buddy', mhTitle2: 'in Your Hometown',
    mhSearch: 'What do you need help with?',
    mhQuick: 'Quick Services',
    mhGov: 'Govt Services', mhProperty: 'Property', mhSupplies: 'Supplies', mhTravel: 'Travel',
    mhTuition: 'Home Tuitions', mhYouth: 'Youth Hub',
    mhPeace: 'Peace of Mind, Every Step',
    mhPeaceText: 'You get a clear quote first, and a background-verified Local Buddy does the job. If we can’t get it done, we pay you back.',
    mhT1: 'Verified Local Buddies', mhT2: 'Work Done or Money Back', mhT3: 'Dedicated Support',
    mhHow: 'How It Works',
    mhS1: 'Request', mhS1t: 'Tell us what you need done in your hometown.',
    mhS2: 'Match', mhS2t: 'We connect you with a verified buddy.',
    mhS3: 'Quote', mhS3t: 'We tell you the price before we start.',
    mhS4: 'Done', mhS4t: 'Job finished — or your money back.',
    mhEarn: 'Earn as a Local Buddy',
    mhEarnText: 'Know your town well? Help people with documents and services and earn from home.',
    mhApply: 'Apply in 3 minutes →',
    mhPromise: 'Our Promise to You',
    mhP1: 'Verified before they meet you.', mhP1t: 'Every Local Buddy passes ID, background and skill checks before taking a single request.',
    mhP2: "Work done, or money back.", mhP2t: 'You get a clear quote before any work starts. If we can’t get your work done, we pay you back.',
    mhP3: 'Help in your language.', mhP3t: 'Talk to us in Telugu or English — by phone, WhatsApp or our Chat Buddy.',
    // contact
    ctLabel: 'Get in Touch', ctTitle: 'Contact', ctHelp1: "We're Here to", ctHelp2: 'Help',
    ctHeroDesc: 'Have questions? Need a service? Our team is ready to connect you with trusted Local Buddies.',
    ctIntro: "Reach out to us directly or fill out the form, and we'll get back to you promptly. iN Empower serves Prakasam District from our hub in Ongole.",
    ctPhone: 'Phone', ctEmail: 'Email', ctHq: 'Headquarters', ctServing: 'Serving all of Prakasam District',
    ctSend: 'Send us a Message', ctName: 'Full Name', ctPhoneNo: 'Phone Number', ctEmailAddr: 'Email Address', ctOptional: '(Optional)',
    ctService: 'Interested Service Category', ctPickService: 'Select a service...', ctSub: 'Sub-Service Category', ctPickSub: 'Select a sub-service...',
    ctMessage: 'Your Message', ctMessageHint: 'Tell us about what you need help with...', ctSubmit: 'Send Message', ctSending: 'Sending...',
    ctSent: 'Message sent successfully! We will contact you soon.',
    // footer, services, supplies
    ftAbout: 'Your Verified Local Buddy across Prakasam District, from Ongole.',
    ftLinks: 'Quick Links', ftTop: 'Top Services', ftPrivacy: 'Privacy Policy', ftTerms: 'Terms of Service', ftComplaints: 'Complaints', ftPartner: 'Join as a Business Partner',
    ftIdentity: 'Identity & Records', ftPropertySvc: 'Property registration & records', ftRto: 'RTO Services', ftStartup: 'Startup Registration', ftPro: 'Professional services',
    ftWhatsApp: 'WhatsApp us', ftPlace: 'Ongole, Andhra Pradesh', ftRights: 'All rights reserved.',
    svHeroText: "We're here to make your life easier — whether it's a government task, a professional need, or a personal milestone. Explore our trusted services, designed with care for people like you.",
    svSearchLabel: 'Search services', svSearchHint: 'Search for a service (e.g., Certificate, Registration, Property)...', svNone: 'No services found matching your search.',
    svBtnDetails: 'View Details', svBtnReq: 'View Requirements', svBtnBook: 'Book Service',
    svOptions: 'Options & Requirements', svCheckAll: 'Check All', svReset: 'Reset', svReady: 'ready', svSkip: 'Skip & Proceed Anyway',
    svLabel: 'All our services', svTitle: 'Our', svTitleHi: 'Services',
    svCtaTitle: 'Need Help With a', svCtaHi: 'Service', svCtaText: 'Our verified Local Buddies are ready to help. Tell us what you need and get a clear quote before any work starts.', svCtaBtn: 'Contact Us →',
    svMissing: "Missing some documents? Don't worry!", svMissingText: 'Just get started below — our team will help you gather what you need.', svStart: 'Get Started →',
    spLabel: 'Source • Supply • Succeed', spTitle: 'Local', spTitleHi: 'Supplies',
    spIntro: 'From granite quarries to cold-pressed oil mills — checked suppliers from Prakasam District, delivered across the district. Need it further away? Ask us.',
    spWhy: 'Why Choose Us', spWhyTitle: 'Trusted Supplies,', spWhyHi: 'Verified Locally',
    spWhyText: "iN Empower's supply network is built on the same trust as all our services — checked, transparent, and backed by real people on the ground.",
    spOffer: 'What We Offer', spWho: 'Who Benefits', spNotSure: 'Not sure what you need?', spNotSureText: 'Our Local Buddy will understand your needs and connect you with the right supplier.',
    spQuote: 'Get a Quote for', spCtaTitle: 'Need a Trusted', spCtaHi: 'Supplier',
    spCtaText: 'Whether it is a truckload of granite or a caterer for 1,000 guests — our local network has you covered. Get a clear quote before you commit.',
    // property
    prWhat: 'What would you like to do?', prStart: 'Start', prListings: 'Properties', prLoading: 'Loading…',
    prNone: 'No properties listed right now',
    prNoneText: 'Tell us what you want and we will find options that pass our checks — or list your own property with us.',
    prTellUs: 'Tell us what you want', prListMine: 'List my property',
    prKnow: 'Know before you buy', prKnowSub: 'A deep guide for each kind of property in our area.',
    prHelpBuy: 'Help me buy', prHelpSell: 'Help me sell', prTrust: "Even if you can't be here", prCharges: 'Our charges.',
    prAsk: 'Ask about this property', prForSale: 'For sale', prForRent: 'For rent',
  },
  te: {
    langSwitch: 'English',
    langSwitchLabel: 'English (ఇంగ్లీష్)',
    navHome: 'హోమ్', navTutor: 'ట్యూటర్', navServices: 'సేవలు', navSupplies: 'సామగ్రి', navProperty: 'ఆస్తి',
    navYouth: 'యూత్ హబ్', navTravel: 'ప్రయాణం', navDashboard: 'నా డాష్‌బోర్డ్', navLogin: 'లాగిన్', navProfile: 'ప్రొఫైల్',
    getStarted: 'ప్రారంభించండి',
    mhBadge: 'పని పూర్తి, లేదా డబ్బు వాపసు',
    mhTitle1: 'మీ నమ్మకమైన బడ్డీ', mhTitle2: 'మీ సొంత ఊరిలో',
    mhSearch: 'మీకు ఏ సహాయం కావాలి?',
    mhQuick: 'త్వరిత సేవలు',
    mhGov: 'ప్రభుత్వ సేవలు', mhProperty: 'ఆస్తి', mhSupplies: 'సామగ్రి', mhTravel: 'ప్రయాణం',
    mhTuition: 'హోమ్ ట్యూషన్లు', mhYouth: 'యూత్ హబ్',
    mhPeace: 'నిశ్చింతగా ఉండండి',
    mhPeaceText: 'ముందుగా స్పష్టమైన ధర చెబుతాము, ధృవీకరించిన లోకల్ బడ్డీ పని చేస్తారు. పని పూర్తి చేయలేకపోతే, మీ డబ్బు వాపసు ఇస్తాము.',
    mhT1: 'ధృవీకరించిన లోకల్ బడ్డీలు', mhT2: 'పని పూర్తి, లేదా డబ్బు వాపసు', mhT3: 'ప్రత్యేక సహాయ బృందం',
    mhHow: 'ఇది ఎలా పనిచేస్తుంది',
    mhS1: 'అభ్యర్థన', mhS1t: 'మీ ఊరిలో ఏ పని కావాలో మాకు చెప్పండి.',
    mhS2: 'జత', mhS2t: 'ధృవీకరించిన బడ్డీతో మిమ్మల్ని కలుపుతాము.',
    mhS3: 'ధర', mhS3t: 'పని మొదలుపెట్టే ముందే ధర చెబుతాము.',
    mhS4: 'పూర్తి', mhS4t: 'పని పూర్తవుతుంది — లేదా మీ డబ్బు వాపసు.',
    mhEarn: 'లోకల్ బడ్డీగా సంపాదించండి',
    mhEarnText: 'మీ ఊరు బాగా తెలుసా? పత్రాలు, సేవల్లో ప్రజలకు సహాయం చేస్తూ ఇంటి నుంచే సంపాదించండి.',
    mhApply: '3 నిమిషాల్లో దరఖాస్తు చేయండి →',
    mhPromise: 'మీకు మా హామీ',
    mhP1: 'మిమ్మల్ని కలిసే ముందే ధృవీకరణ.', mhP1t: 'ప్రతి లోకల్ బడ్డీ ఏ పని తీసుకునే ముందే గుర్తింపు, నేపథ్యం, నైపుణ్య తనిఖీలు పూర్తి చేస్తారు.',
    mhP2: 'పని పూర్తి, లేదా డబ్బు వాపసు.', mhP2t: 'పని మొదలయ్యే ముందే స్పష్టమైన ధర చెబుతాము. మేము మీ పని పూర్తి చేయలేకపోతే, మీ డబ్బు వాపసు ఇస్తాము.',
    mhP3: 'మీ భాషలో సహాయం.', mhP3t: 'తెలుగు లేదా ఇంగ్లీష్‌లో — ఫోన్, వాట్సాప్ లేదా చాట్ బడ్డీ ద్వారా మాట్లాడండి.',
    ctLabel: 'మమ్మల్ని సంప్రదించండి', ctTitle: 'సంప్రదించండి', ctHelp1: 'మీకు సహాయం చేయడానికి', ctHelp2: 'మేమున్నాం',
    ctHeroDesc: 'ప్రశ్నలు ఉన్నాయా? ఏదైనా సేవ కావాలా? నమ్మకమైన లోకల్ బడ్డీలతో మిమ్మల్ని కలపడానికి మా బృందం సిద్ధంగా ఉంది.',
    ctIntro: 'నేరుగా ఫోన్ చేయండి లేదా ఈ ఫారం నింపండి — మేము త్వరగా మిమ్మల్ని సంప్రదిస్తాము. ఒంగోలులోని మా కేంద్రం నుంచి ప్రకాశం జిల్లా అంతటా సేవలు అందిస్తాము.',
    ctPhone: 'ఫోన్', ctEmail: 'ఇమెయిల్', ctHq: 'ప్రధాన కార్యాలయం', ctServing: 'ప్రకాశం జిల్లా అంతటా సేవలు',
    ctSend: 'మాకు సందేశం పంపండి', ctName: 'పూర్తి పేరు', ctPhoneNo: 'ఫోన్ నంబర్', ctEmailAddr: 'ఇమెయిల్ చిరునామా', ctOptional: '(ఐచ్ఛికం)',
    ctService: 'కావలసిన సేవ', ctPickService: 'సేవను ఎంచుకోండి...', ctSub: 'ఉప సేవ', ctPickSub: 'ఉప సేవను ఎంచుకోండి...',
    ctMessage: 'మీ సందేశం', ctMessageHint: 'మీకు ఏ సహాయం కావాలో చెప్పండి...', ctSubmit: 'సందేశం పంపండి', ctSending: 'పంపుతోంది...',
    ctSent: 'సందేశం పంపబడింది! మేము త్వరలో మిమ్మల్ని సంప్రదిస్తాము.',
    ftAbout: 'ఒంగోలు నుంచి — ప్రకాశం జిల్లా అంతటా మీ నమ్మకమైన లోకల్ బడ్డీ.',
    ftLinks: 'త్వరిత లింకులు', ftTop: 'ముఖ్య సేవలు', ftPrivacy: 'గోప్యతా విధానం', ftTerms: 'సేవా నిబంధనలు', ftComplaints: 'ఫిర్యాదులు', ftPartner: 'బిజినెస్ పార్ట్‌నర్‌గా చేరండి',
    ftIdentity: 'గుర్తింపు & రికార్డులు', ftPropertySvc: 'ఆస్తి రిజిస్ట్రేషన్ & రికార్డులు', ftRto: 'RTO సేవలు', ftStartup: 'స్టార్టప్ రిజిస్ట్రేషన్', ftPro: 'వృత్తిపరమైన సేవలు',
    ftWhatsApp: 'వాట్సాప్ చేయండి', ftPlace: 'ఒంగోలు, ఆంధ్రప్రదేశ్', ftRights: 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
    svHeroText: 'ప్రభుత్వ పని అయినా, వృత్తిపరమైన అవసరమైనా, జీవితంలో ముఖ్యమైన సందర్భమైనా — మీ జీవితాన్ని సులభం చేయడానికి మేమున్నాం. మీలాంటి వారి కోసం శ్రద్ధగా రూపొందించిన మా సేవలు చూడండి.',
    svSearchLabel: 'సేవలు వెతకండి', svSearchHint: 'సేవ వెతకండి (ఉదా. ధృవీకరణ పత్రం, రిజిస్ట్రేషన్, ఆస్తి)...', svNone: 'మీరు వెతికిన సేవ దొరకలేదు.',
    svBtnDetails: 'వివరాలు చూడండి', svBtnReq: 'కావలసినవి చూడండి', svBtnBook: 'సేవ బుక్ చేయండి',
    svOptions: 'ఎంపికలు & కావలసినవి', svCheckAll: 'అన్నీ టిక్ చేయండి', svReset: 'రీసెట్', svReady: 'సిద్ధం', svSkip: 'దాటవేసి ముందుకు వెళ్ళండి',
    svLabel: 'మా అన్ని సేవలు', svTitle: 'మా', svTitleHi: 'సేవలు',
    svCtaTitle: 'ఏదైనా సేవలో', svCtaHi: 'సహాయం కావాలా?', svCtaText: 'మా ధృవీకరించిన లోకల్ బడ్డీలు సిద్ధంగా ఉన్నారు. మీకు ఏమి కావాలో చెప్పండి — పని మొదలయ్యే ముందే స్పష్టమైన ధర చెబుతాము.', svCtaBtn: 'మమ్మల్ని సంప్రదించండి →',
    svMissing: 'కొన్ని పత్రాలు లేవా? పర్వాలేదు!', svMissingText: 'కింద ప్రారంభించండి — కావలసినవి సేకరించడంలో మా బృందం సహాయం చేస్తుంది.', svStart: 'ప్రారంభించండి →',
    spLabel: 'సేకరణ • సరఫరా • విజయం', spTitle: 'స్థానిక', spTitleHi: 'సామగ్రి',
    spIntro: 'గ్రానైట్ క్వారీల నుంచి గానుగ నూనె మిల్లుల వరకు — ప్రకాశం జిల్లాలో తనిఖీ చేసిన సరఫరాదారులు, జిల్లా అంతటా డెలివరీ. ఇంకా దూరం కావాలా? అడగండి.',
    spWhy: 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి', spWhyTitle: 'నమ్మకమైన సామగ్రి,', spWhyHi: 'స్థానికంగా ధృవీకరించినది',
    spWhyText: 'iN Empower సరఫరా నెట్‌వర్క్ మా అన్ని సేవల్లాగే నమ్మకంపై నిర్మించబడింది — తనిఖీ చేసినది, పారదర్శకమైనది, క్షేత్రస్థాయిలో నిజమైన వ్యక్తులు.',
    spOffer: 'మేము అందించేవి', spWho: 'ఎవరికి ఉపయోగం', spNotSure: 'ఏమి కావాలో తెలియదా?', spNotSureText: 'మా లోకల్ బడ్డీ మీ అవసరం అర్థం చేసుకుని సరైన సరఫరాదారుతో కలుపుతారు.',
    spQuote: 'ధర తెలుసుకోండి:', spCtaTitle: 'నమ్మకమైన', spCtaHi: 'సరఫరాదారు కావాలా?',
    spCtaText: 'ఒక లారీ గ్రానైట్ అయినా, 1,000 మంది అతిథులకు కేటరింగ్ అయినా — మా స్థానిక నెట్‌వర్క్ చూసుకుంటుంది. ముందే స్పష్టమైన ధర తెలుసుకోండి.',
    prWhat: 'మీరు ఏమి చేయాలనుకుంటున్నారు?', prStart: 'ప్రారంభించండి', prListings: 'ఆస్తులు', prLoading: 'లోడ్ అవుతోంది…',
    prNone: 'ప్రస్తుతం ఆస్తులు జాబితాలో లేవు',
    prNoneText: 'మీకు ఏమి కావాలో చెప్పండి — మా తనిఖీలు పాస్ అయిన ఆస్తులను చూపిస్తాము. లేదా మీ ఆస్తిని మాతో జాబితా చేయండి.',
    prTellUs: 'మీకు ఏమి కావాలో చెప్పండి', prListMine: 'నా ఆస్తిని జాబితా చేయండి',
    prKnow: 'కొనే ముందు తెలుసుకోండి', prKnowSub: 'మన ప్రాంతంలో ప్రతి రకమైన ఆస్తికి పూర్తి గైడ్.',
    prHelpBuy: 'కొనడంలో సహాయం', prHelpSell: 'అమ్మడంలో సహాయం', prTrust: 'మీరు ఇక్కడ లేకపోయినా', prCharges: 'మా ఛార్జీలు.',
    prAsk: 'ఈ ఆస్తి గురించి అడగండి', prForSale: 'అమ్మకానికి', prForRent: 'అద్దెకు',
  },
}

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => STRINGS.en[k] || k })

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(KEY) === 'te' ? 'te' : 'en' } catch { return 'en' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* private mode */ }
  }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  // Place names follow the customer's city (data/cities.js); nothing changes for Ongole
  const t = useCallback((k) => placeText(STRINGS[lang]?.[k] ?? STRINGS.en[k] ?? k), [lang])
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)

/**
 * Page-local text: pass { en: {...}, te: {...} } kept next to the page.
 * Returns { t, lang }; t(key, vars) fills {name}-style blanks and falls back to English.
 */
export function useStrings(dict) {
  const { lang } = useContext(LanguageContext)
  const t = useCallback((k, vars) => {
    let s = dict[lang]?.[k] ?? dict.en[k] ?? k
    if (vars) for (const [n, v] of Object.entries(vars)) s = s.split(`{${n}}`).join(v)
    return placeText(s)
  }, [dict, lang])
  return { t, lang }
}

/** Small "తెలుగు / English" switch button. */
export function LanguageSwitch({ className = '', style }) {
  const { lang, setLang, t } = useLanguage()
  return (
    <button
      type="button"
      className={`lang-switch ${className}`}
      style={style}
      onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
      aria-label={t('langSwitchLabel')}
      lang={lang === 'te' ? 'en' : 'te'}
    >
      {t('langSwitch')}
    </button>
  )
}
