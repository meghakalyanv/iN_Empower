/**
 * Property & Real Estate — shared by the website and the mobile app (same business, same data).
 * Edit here only; the app copies it with `npm run sync-data`.
 *
 * - propertyIntents: Buy / Sell / Rent & Lease / Paperwork. Each one is shaped like a
 *   service in servicesData (sections with headings), so the app's step-by-step
 *   screen and the website's step flow can both walk the customer through it.
 * - propertyTypes: Plots, Houses & flats, Agricultural land, Commercial — each with a
 *   deep local guide (what to check, papers, costs, steps, traps, local notes).
 * - trustPromises: what we do for buyers who cannot be here in person.
 *
 * Listings themselves are NOT here: the team adds and removes them in the admin
 * panel (/admin/properties), stored in the Supabase table `property_listings`.
 *
 * Rules for this content:
 * - We do not claim to be a RERA-registered agent.
 * - Charges are always "ask us for a quote".
 * - Government rates change: always say we confirm the current figure before payment.
 */

export const PROPERTY_CATEGORY = 'real-estate'

export const propertyIntro = {
  title: 'Property & Real Estate',
  te: 'ఆస్తి & రియల్ ఎస్టేట్',
  subtitle: 'Buy, sell or rent in Prakasam District — with every paper checked before you pay.',
  promise: 'We check the papers before you pay any advance. You see everything on video and get a progress update at each step, even if you live in another city or abroad.',
  quote: 'Our charges depend on the work. Ask us for a quote — you will know the full amount before we start.',
}

// Towns people ask about most. Markapur and Kanigiri are in the new Markapuram
// district (from Jan 2026) and Chirala is in Bapatla district — we still serve them.
export const propertyTowns = ['Ongole', 'Kandukur', 'Addanki', 'Chimakurthy', 'Darsi', 'Singarayakonda', 'Markapur', 'Chirala']

/* ─────────────────────────── Trust: even when you are not here ─────────────────────────── */
export const trustPromises = [
  {
    id: 'video',
    icon: 'video-outline',
    title: 'Video site visit',
    text: 'Our Local Buddy walks the property with you on a live WhatsApp video call — boundaries, road, neighbours, water, power lines. You also get the recording and photos with the date and location.',
  },
  {
    id: 'title',
    icon: 'file-search-outline',
    title: 'Legal title check report',
    text: 'An advocate checks the 30-year chain of sale deeds, the EC, Adangal / 1-B, the 22A prohibited list and approvals. You get a written report in simple words before you pay any advance.',
  },
  {
    id: 'poa',
    icon: 'account-switch-outline',
    title: 'Power of Attorney help',
    text: 'If you cannot come for registration, we draft a Special Power of Attorney so a person you trust can sign for you. From abroad you sign it at the Indian Embassy or Consulate, or notarised and apostilled; it must be stamped here within 3 months of reaching India.',
  },
  {
    id: 'updates',
    icon: 'progress-check',
    title: 'Progress updates at each step',
    text: 'Every step — documents collected, title report ready, slot booked, registered, name changed in records — shows in your Profile under My requests, with photos where it helps.',
  },
  {
    id: 'paperwork',
    icon: 'file-document-edit-outline',
    title: 'Perfect paperwork',
    text: 'Agreement of sale, sale deed and every form is checked line by line: names, survey numbers, extent, boundaries, amounts. After registration you get clear scans of everything.',
  },
]

/* ─────────────────────────── The four property types: deep guides ─────────────────────────── */
export const propertyTypes = [
  {
    id: 'prop-plots',
    title: 'Plots & House Sites',
    te: 'ప్లాట్లు & ఇంటి స్థలాలు',
    choice: 'Plot / House site',
    subtitle: 'Residential plots in approved layouts and open house sites.',
    intro: 'Most problems with plots come from three things: the layout is not approved, the seller does not have a clean title, or the plot on the ground does not match the plot in the papers. Check all three before paying anything.',
    guide: [
      {
        heading: 'What to check before you pay',
        items: [
          'Layout approval: the layout must be approved by DTCP or the Urban Development Authority (around Ongole this is OUDA), with a layout permit (LP) number. Your plot number must be in the approved layout plan.',
          'A panchayat receipt or a "final approval coming soon" letter is not layout approval.',
          'Plot on the ground matches the papers: a licensed surveyor measures it against the layout plan and the FMB / survey sketch.',
          'Road in front: the width in the plan is really there, and the plot is not on land kept for a road, park or open space.',
          'The survey number is not on the 22A prohibited list (government, assigned, endowment and other restricted land) on the IGRS AP website.',
          'No court case or bank loan on the land: EC for 30 years, and an eCourts search on the owner\'s name.',
        ],
      },
      {
        heading: 'Papers that prove a clean title',
        items: [
          'Seller\'s registered sale deed (or gift / partition / settlement deed) — original.',
          'Link documents: every earlier deed for the last 30 years, showing how each owner got the land.',
          'Encumbrance Certificate (EC) for at least 30 years, from IGRS AP.',
          'Layout approval copy with LP number and the approved plan.',
          'For land that was farm land: Adangal and 1-B from Meebhoomi before the layout, and the planning approval for the change of use.',
          'Property / vacant land tax receipts with no dues.',
          'If the seller got it by inheritance: family member certificate or legal heir certificate, and signatures of all heirs.',
          'If someone sells on behalf of the owner: a registered Power of Attorney that is still valid.',
        ],
      },
      {
        heading: 'Costs to plan for',
        items: [
          'Stamp duty, transfer duty and registration fee: about 7.5% in total of the government market value or the price you pay, whichever is higher. We confirm the current rate on IGRS AP before you pay.',
          'The government market value for your area is on the IGRS AP website (Market Value search).',
          'Advocate title check, surveyor and document writer charges.',
          'If the layout is not approved: regularisation (LRS) fees later, and banks usually will not give a loan.',
          'Our charges: ask us for a quote.',
        ],
      },
      {
        heading: 'How the purchase goes',
        items: [
          'Shortlist plots — we visit and show you on video.',
          'Title check report from our advocate — before any advance.',
          'Price check against the government market value and nearby sales.',
          'Agreement of sale with a small token advance, clear dates and refund terms if the papers fail.',
          'Sale deed drafted and checked line by line.',
          'Slot booked on IGRS AP; duty paid online.',
          'Registration at the Sub-Registrar office: buyer, seller and two witnesses with Aadhaar (or your Power of Attorney holder).',
          'Name updated in records and vacant land tax moved to your name — we follow up until it shows.',
        ],
      },
      {
        heading: 'Common traps in our area',
        items: [
          'The same plot sold to two buyers — the EC and a fresh check just before registration catch this.',
          'Plots in unapproved layouts sold cheap with promises of approval later.',
          'Plots carved out of the layout\'s road, park or open space.',
          'Assigned land (D-patta / DKT patta) given by the government to landless families, sold without permission to transfer.',
          'Price far below the area rate — often a disputed or court-case property.',
          'Large cash advances without a written receipt.',
        ],
      },
    ],
  },
  {
    id: 'prop-houses',
    title: 'Houses, Flats & Villas',
    te: 'ఇళ్లు, ఫ్లాట్లు & విల్లాలు',
    choice: 'House / Villa',
    subtitle: 'Ready houses, flats in apartments and villas — new or resale.',
    intro: 'With a building you are buying the land and the construction. The land needs a clean title; the building needs approval and must be built as approved.',
    guide: [
      {
        heading: 'What to check before you pay',
        items: [
          'Building plan approval from the municipality, panchayat or OUDA, and that the building matches the plan — extra floors or setback violations cause trouble later.',
          'Occupancy certificate for apartments and larger buildings.',
          'New projects: projects on more than 500 sq.m of land or with more than 8 flats must be registered with AP RERA — check the project on the AP RERA website.',
          'Flats: your undivided share of land (UDS) is written in the sale deed, and parking is clearly allotted.',
          'Property tax, electricity and water bills are paid up to date and in the seller\'s name.',
          'Structure: cracks, dampness, plumbing and wiring — we can bring an engineer for a check.',
        ],
      },
      {
        heading: 'Papers that prove a clean title',
        items: [
          'Seller\'s registered sale deed and 30 years of link documents for the land.',
          'Encumbrance Certificate (EC) for at least 30 years.',
          'Approved building plan and building permit.',
          'Occupancy certificate (for apartments / larger buildings).',
          'Property tax receipts, electricity and water connection in the seller\'s name.',
          'Flats: builder\'s development agreement with the landowner, and the association / society NOC for resale.',
          'Bank loan on the house? A loan closure letter and the original deeds returned by the bank.',
        ],
      },
      {
        heading: 'Costs to plan for',
        items: [
          'Stamp duty, transfer duty and registration fee: about 7.5% in total of the government market value or the price, whichever is higher — confirmed on IGRS AP before you pay.',
          'New flats from a builder: GST may apply on under-construction flats; ready flats with an occupancy certificate usually have none.',
          'Corpus fund and maintenance deposit for apartments.',
          'Name change for property tax, electricity and water.',
          'Our charges: ask us for a quote.',
        ],
      },
      {
        heading: 'How the purchase goes',
        items: [
          'Shortlist — video walk-through of every room, the roof and the surroundings.',
          'Title and approval check by our advocate, and an engineer\'s check if you want.',
          'Agreement of sale. For a RERA project, the builder cannot take more than 10% of the price before a registered agreement for sale.',
          'Home loan, if needed — we can help through our Bank Loan Support.',
          'Sale deed drafted and checked; slot booked; registration at the Sub-Registrar office.',
          'Possession with keys, meter readings and a handover video.',
          'Property tax, electricity and water moved to your name.',
        ],
      },
      {
        heading: 'Common traps in our area',
        items: [
          'Extra floors built without approval — the bank may refuse a loan and the municipality can act.',
          'Flats sold without the land share (UDS) written in the deed.',
          'Builder taking most of the money before the building is ready, with no RERA registration.',
          'Seller still has a bank loan on the house.',
          'Joint family house sold without all family members signing.',
        ],
      },
    ],
  },
  {
    id: 'prop-agri',
    title: 'Agricultural Land',
    te: 'వ్యవసాయ భూమి',
    choice: 'Agricultural land',
    subtitle: 'Farm land, orchards and aqua ponds.',
    intro: 'For farm land, the revenue records (Adangal and 1-B) matter as much as the sale deed. Who holds the land on the ground, and whether it can be sold at all, are the key checks.',
    guide: [
      {
        heading: 'What to check before you pay',
        items: [
          'Adangal and 1-B on Meebhoomi show the seller as owner, with the same survey number and extent as the deed.',
          'After the AP land resurvey, check the new land parcel (LP) number and FMB / sketch; the 14-digit ULPIN (Bhu-Aadhaar) identifies the land but is not proof of ownership.',
          'The land is not on the 22A prohibited list and is not assigned, inam, endowment (temple) or wakf land.',
          'Who is cultivating it now — a tenant or someone else in possession is a serious risk.',
          'Water: bore well, canal or tank access, and the electricity service connection for the motor.',
          'Road access to the land, and boundaries walked with the neighbours and a surveyor.',
        ],
      },
      {
        heading: 'Papers that prove a clean title',
        items: [
          'Registered sale deed and 30 years of link documents.',
          'Pattadar passbook in the seller\'s name.',
          'Adangal and 1-B (Meebhoomi), and the FMB / survey sketch.',
          'Encumbrance Certificate (EC) for at least 30 years.',
          'Land revenue receipts with no dues.',
          'Inherited land: family member / legal heir certificate and signatures of all heirs.',
          'Crop loan or KCC on the land? A no-dues letter from the bank.',
        ],
      },
      {
        heading: 'Who can buy, and using it for other purposes',
        items: [
          'NRIs and OCI card holders cannot buy agricultural land, plantations or farmhouses in India (they can inherit). We tell you this before anything else.',
          'Land ceiling laws limit how much farm land one family can hold.',
          'Andhra Pradesh removed the NALA conversion fee in 2025. Building houses or a layout on farm land still needs approval from the planning authority (DTCP / OUDA); we confirm the current process for your village.',
          'Aqua ponds and land near the sea may need extra permissions — we check before you buy.',
        ],
      },
      {
        heading: 'Costs to plan for',
        items: [
          'Stamp duty, transfer duty and registration fee on the government market value per acre (or the price, if higher) — about 7.5% in total; confirmed on IGRS AP before you pay.',
          'Surveyor for measuring and fixing boundaries.',
          'Mutation (name change in Adangal / 1-B) and a new pattadar passbook.',
          'Our charges: ask us for a quote.',
        ],
      },
      {
        heading: 'Common traps in our area',
        items: [
          'Assigned (D-patta) land sold through notary agreements — such sales are not valid.',
          'Deed extent more than the land on the ground — get it measured.',
          'Sale by one family member when the land belongs to all heirs.',
          'Land under a crop loan or a court case.',
          'Sales on unregistered agreements or "GPA sales" instead of a registered sale deed.',
        ],
      },
    ],
  },
  {
    id: 'prop-commercial',
    title: 'Commercial Property',
    te: 'వాణిజ్య ఆస్తి',
    choice: 'Commercial (shop / godown / land)',
    subtitle: 'Shops, offices, godowns and roadside commercial land.',
    intro: 'For commercial property the use matters as much as the title: the land must be allowed for business, and the road, access and permissions must fit the business you plan.',
    guide: [
      {
        heading: 'What to check before you pay',
        items: [
          'Land use in the master plan allows commercial use for this site.',
          'Building approval is for commercial use, and the building matches it.',
          'Road width and access: highway land usually needs separate access permission, and buildings must keep back from the highway.',
          'Fire safety NOC for larger buildings, and parking as per approval.',
          'Existing tenants: their lease papers, deposits and how they will leave or stay.',
          'Clean title — same 30-year checks as any property.',
        ],
      },
      {
        heading: 'Papers that prove a clean title',
        items: [
          'Registered sale deed and 30 years of link documents.',
          'Encumbrance Certificate (EC) for at least 30 years.',
          'Approved building plan for commercial use and occupancy certificate.',
          'Property tax (commercial rate) receipts with no dues.',
          'Trade licence history, if the property was used for business.',
          'Current lease agreements, if tenants are in the building.',
        ],
      },
      {
        heading: 'Costs to plan for',
        items: [
          'Stamp duty, transfer duty and registration fee — about 7.5% in total, confirmed on IGRS AP before you pay.',
          'Commercial property tax is higher than residential.',
          'GST may apply on commercial rent you collect — check with your auditor.',
          'Our charges: ask us for a quote.',
        ],
      },
      {
        heading: 'How the purchase goes',
        items: [
          'Shortlist and video visit — frontage, road, parking and neighbouring businesses.',
          'Title, land-use and approval check by our advocate.',
          'Agreement of sale with clear handover date and tenant terms.',
          'Sale deed drafted and checked; slot booked; registration at the Sub-Registrar office.',
          'Property tax and electricity moved to your name; trade licence guidance for your business.',
        ],
      },
      {
        heading: 'Common traps in our area',
        items: [
          'Residential building used as shops without approval for commercial use.',
          'Highway-facing land with no legal access from the highway.',
          'Tenants who refuse to vacate after the sale.',
          'Unpaid commercial tax and electricity dues left with the building.',
        ],
      },
    ],
  },
]

/* ─────────────────────────── Shared question lists ─────────────────────────── */
const TYPE_CHOICES = ['Plot / House site', 'House / Villa', 'Flat / Apartment', 'Agricultural land', 'Commercial (shop / godown / land)']
const WHERE = { heading: 'Where in Prakasam?', pick: 'one', items: [...propertyTowns, 'Anywhere — help me decide'] }
const LIVING = { heading: 'Where do you live now?', pick: 'one', items: ['In Prakasam District', 'Elsewhere in India', 'Abroad (NRI / OCI)'] }
const WHEN = { heading: 'When do you want to do this?', pick: 'one', items: ['Within a month', 'In 1–3 months', 'In 3–6 months', 'Just exploring for now'] }
const FEE_NOTE = 'Our charges depend on the work — ask us for a quote. You will know the full amount before we start.'

/* ─────────────────────────── Buy · Sell · Rent · Paperwork ─────────────────────────── */
export const propertyIntents = [
  {
    id: 'property-buy',
    category: PROPERTY_CATEGORY,
    title: 'Buy a Property',
    short: 'Buy',
    te: 'ఆస్తి కొనండి',
    subtitle: 'We find, check and register it for you.',
    sections: [
      {
        heading: 'Good to Know',
        items: [
          'We check the papers before you pay any advance.',
          'You can do the whole purchase without coming here: video visits, a written title report and a Power of Attorney for registration.',
          'NRIs and OCI card holders can buy houses, flats and plots, but not agricultural land.',
        ],
      },
      { heading: 'What kind of property?', pick: 'one', items: TYPE_CHOICES },
      WHERE,
      { heading: 'Your budget', pick: 'one', items: ['Under ₹10 lakh', '₹10–25 lakh', '₹25–50 lakh', '₹50 lakh – ₹1 crore', 'Above ₹1 crore'] },
      LIVING,
      {
        heading: 'What do you need?',
        items: [
          'Find properties that fit',
          'I have found one — check it',
          'Video site visit',
          'Legal title check report',
          'Price check against the government value',
          'Agreement and sale deed drafting',
          'Registration and name change in records',
          'Power of Attorney (I cannot come)',
          'Home or property loan',
        ],
      },
      WHEN,
      {
        heading: 'Documents Required',
        items: [
          'Aadhaar card',
          'PAN card',
          'Two passport-size photos',
          'NRI / OCI: passport and OCI card (for Power of Attorney and registration)',
          'Property papers you already have (if you found a property)',
        ],
      },
      {
        heading: 'How It Works',
        items: [
          'We call you to understand exactly what you want.',
          'We shortlist properties and show them to you on video.',
          'Our advocate checks the papers and gives you a written report.',
          'We draft the agreement and sale deed and book the registration slot.',
          'You (or your Power of Attorney holder) register at the Sub-Registrar office.',
          'We follow up until your name is in the records, with updates in My requests.',
        ],
      },
      {
        heading: 'Please Note',
        items: [
          'We guide the purchase and handle the paperwork; the decision to buy is always yours.',
          'Government fees are paid directly to the government, never in cash to us.',
          FEE_NOTE,
        ],
      },
    ],
  },
  {
    id: 'property-sell',
    category: PROPERTY_CATEGORY,
    title: 'Sell a Property',
    short: 'Sell',
    te: 'ఆస్తి అమ్మండి',
    subtitle: 'Right price, checked buyers, clean registration.',
    sections: [
      {
        heading: 'Good to Know',
        items: [
          'Buyers pay more, and faster, when the papers are ready: EC, Adangal / 1-B or tax receipts in your name.',
          'If the price is ₹50 lakh or more, the buyer deducts 1% TDS and pays it to the government — you get a Form 16B certificate.',
          'Held for more than 2 years? Long-term capital gains tax may apply; buying another house or capital gains bonds can reduce it. Talk to your auditor — we can connect you.',
        ],
      },
      { heading: 'What are you selling?', pick: 'one', items: TYPE_CHOICES },
      WHERE,
      { heading: 'Do you know the price you want?', pick: 'one', items: ['Yes, I have a price in mind', 'No — help me find the right price'] },
      LIVING,
      {
        heading: 'What do you need?',
        items: [
          'Price check (government value and nearby sales)',
          'List it with iN Empower',
          'Photos and video of the property',
          'Find and check buyers',
          'Fix paper problems first (EC, mutation, tax dues)',
          'Agreement and sale deed',
          'Registration (Power of Attorney if I cannot come)',
          'TDS and capital gains guidance',
        ],
      },
      WHEN,
      {
        heading: 'Documents Required',
        items: [
          'Your registered sale deed (or gift / partition / settlement deed)',
          'Earlier link documents, if you have them',
          'Encumbrance Certificate (we can get it)',
          'Property tax / land revenue receipts',
          'Farm land: pattadar passbook, Adangal and 1-B',
          'Aadhaar and PAN of every owner',
        ],
      },
      {
        heading: 'How It Works',
        items: [
          'We check your papers and fix any gaps before listing.',
          'We take photos and a video and suggest a fair price.',
          'Your property is listed only after our checks.',
          'We screen buyers and arrange visits — in person or on video.',
          'We draft the agreement and sale deed and see the registration through.',
        ],
      },
      {
        heading: 'Please Note',
        items: [
          'The final price and buyer are always your decision.',
          FEE_NOTE,
        ],
      },
    ],
  },
  {
    id: 'property-rent',
    category: PROPERTY_CATEGORY,
    title: 'Rent & Lease',
    short: 'Rent & Lease',
    te: 'అద్దె & లీజు',
    subtitle: 'Find a home or tenant, with a proper agreement.',
    sections: [
      {
        heading: 'Good to Know',
        items: [
          'Most homes use an 11-month rental agreement on stamp paper. A lease for longer than a year must be registered at the Sub-Registrar office.',
          'Write the rent, deposit, notice period, maintenance and yearly increase clearly in the agreement.',
          'Owners: give your tenant\'s details to the local police station for verification.',
        ],
      },
      { heading: 'You are…', pick: 'one', items: ['Looking for a place to rent', 'An owner looking for a tenant'] },
      { heading: 'What kind of place?', pick: 'one', items: ['House / portion', 'Flat', 'Shop / office', 'Godown / warehouse', 'Agricultural land (lease)'] },
      WHERE,
      { heading: 'Monthly rent', pick: 'one', items: ['Under ₹5,000', '₹5,000–10,000', '₹10,000–20,000', '₹20,000–50,000', 'Above ₹50,000'] },
      {
        heading: 'What do you need?',
        items: [
          'Find a place / find a tenant',
          'Video visit of the place',
          'Tenant background check',
          'Rental agreement drafting',
          'Registered lease (longer than a year)',
          'Move-in photos and inventory',
          'Police verification help',
        ],
      },
      WHEN,
      {
        heading: 'Documents Required',
        items: [
          'Aadhaar card of owner and tenant',
          'Owner: proof of ownership (sale deed or tax receipt)',
          'Tenant: work or business details and previous address',
          'Two passport-size photos of the tenant',
        ],
      },
      {
        heading: 'Please Note',
        items: [
          'Rent and deposit are paid between owner and tenant directly, never through cash to us.',
          FEE_NOTE,
        ],
      },
    ],
  },
  {
    id: 'property-paperwork',
    category: PROPERTY_CATEGORY,
    title: 'Property Paperwork',
    short: 'Paperwork',
    te: 'ఆస్తి పత్రాలు',
    subtitle: 'EC, mutation, deeds, POA, approvals — done right.',
    sections: [
      {
        heading: 'Good to Know',
        items: [
          'A sale deed must be presented for registration within 4 months of signing.',
          'A Power of Attorney signed abroad must be stamped in India within 3 months of reaching India.',
          'After registration, check that your name appears in Meebhoomi (farm land) or the property tax records (town property).',
        ],
      },
      {
        heading: 'What do you need?',
        items: [
          'Encumbrance Certificate (EC)',
          'Adangal / 1-B / pattadar passbook',
          'Mutation (name change in records)',
          'Sale deed drafting and registration',
          'Gift, partition or settlement deed',
          'Legal heir / family member certificate',
          'Legal title check report',
          'Power of Attorney (GPA / SPA)',
          'Building plan approval',
          'Layout / building regularisation (LRS / BPS)',
          'Property tax name transfer',
          'Electricity / water name change',
          'Survey and boundary fixing (FMB)',
        ],
      },
      { heading: 'Which property?', pick: 'one', items: TYPE_CHOICES },
      WHERE,
      LIVING,
      {
        heading: 'Documents Required',
        items: [
          'Copies of the property papers you have',
          'Aadhaar and PAN of the owner(s)',
          'Survey number or door number of the property',
        ],
      },
      {
        heading: 'Please Note',
        items: [
          'Government fees are paid directly to the government online.',
          FEE_NOTE,
        ],
      },
    ],
  },
]

/* ─────────────────────────── Listings (stored in Supabase) ─────────────────────────── */
// Values used by the admin panel and shown on listing cards.
export const LISTING_PURPOSES = [
  { value: 'sale', label: 'For sale' },
  { value: 'rent', label: 'For rent / lease' },
]
export const LISTING_TYPES = [
  { value: 'plot', label: 'Plot / House site' },
  { value: 'house', label: 'House / Villa' },
  { value: 'flat', label: 'Flat / Apartment' },
  { value: 'agri', label: 'Agricultural land' },
  { value: 'commercial', label: 'Commercial' },
]
export const LISTING_STATUSES = [
  { key: 'live', label: 'Live' },
  { key: 'hidden', label: 'Hidden' },
  { key: 'sold', label: 'Sold / Rented' },
  { key: 'removed', label: 'Removed' },
]
// Checks the team can tick for each listing; shown to customers as badges.
export const LISTING_CHECKS = [
  { key: 'title', label: 'Title checked by advocate' },
  { key: 'ec', label: '30-year EC checked' },
  { key: 'approval', label: 'Approval checked' },
  { key: 'site', label: 'Site visited by our team' },
]
export const listingTypeLabel = (v) => LISTING_TYPES.find(t => t.value === v)?.label || 'Property'
export const listingPurposeLabel = (v) => LISTING_PURPOSES.find(t => t.value === v)?.label || ''

/** Customer message for a listing enquiry. */
export function listingEnquiry(l) {
  return [
    `Hello, I am interested in this property: ${l.title}.`,
    `${listingTypeLabel(l.type)} · ${l.location || ''}${l.area ? ' · ' + l.area : ''}${l.price ? ' · ' + l.price : ''}`,
    `Listing ref: ${String(l.id || '').slice(0, 8)}`,
  ].join('\n')
}
