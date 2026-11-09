/**
 * Supplies list — shared by the website (pages/Supplies.jsx) and the mobile app.
 * Edit here only; the app copies it with `npm run sync-data`.
 */
export const supplyCategories = [
  {
    id: 'granite',
    icon: 'Mountain', iconColor: '#8B2127',
    title: 'Granite',
    tagline: 'Premium polished granite and natural stone for residential and commercial projects.',
    description: "Prakasam district is world-renowned for its Black Galaxy granite. iN Empower connects you directly with the best local quarries and processing units in Chimakurthy and Ongole, ensuring you get export-quality stone for your flooring, countertops, and elevations without the middleman markup.",
    beneficiaries: ['Home Owners', 'Commercial Builders', 'Interior Designers', 'Export Agents', 'Monument Crafters'],
    highlights: ['Direct-from-quarry Black Galaxy granite', 'Custom cutting and edge polishing', 'Export-quality slabs and tiles', 'Bulk order handling & transportation'],
    image: '/images/supply_granite.webp'
  },
  {
    id: 'tiles',
    icon: 'LayoutGrid', iconColor: '#D4A373',
    title: 'Tiles',
    tagline: 'High-quality vitrified, ceramic, and designer tiles for every flooring need.',
    description: "From vitrified and ceramic to designer mosaic tiles, Ongole's growing construction market demands quality flooring and wall solutions. We connect you with trusted local tile dealers who offer competitive rates, expert installation guidance, and warranty-backed products for homes, offices, and commercial spaces.",
    beneficiaries: ['New Home Constructions', 'Office Renovations', 'Hotel & Restaurant Owners', 'Hospital Builders', 'Retail Showrooms'],
    highlights: ['Vitrified, ceramic, porcelain & natural stone', 'Wall tiles, bathroom tiles & outdoor pavers', 'Expert installation partner network', 'Showroom visits with our Local Buddy'],
    image: '/images/supply_tiles.webp'
  },
  {
    id: 'sand',
    icon: 'Box', iconColor: '#2F5233',
    title: 'Sand',
    tagline: 'Free government sand booked for you, with the lorry — or M-Sand from licensed crusher units.',
    description: "In Andhra Pradesh, river sand is free from the government — you pay only the official charges and the transport. We book it for you on the government's sand booking system (AP Sand Management System) and send a lorry or tractor to your site. Need M-Sand (manufactured sand)? We get it from licensed crusher units in Prakasam district, with a GST bill. We never resell river sand.",
    beneficiaries: ['Individual Home Builders', 'Construction Contractors', 'Real Estate Developers', 'Government Projects', 'Infrastructure Companies'],
    // Legal report (owner, 2 Nov 2026): AP free sand policy — river sand is never resold; M-Sand is bought with a bill
    highlights: ['River sand: free from the government, booked for you', 'You pay only the official charges and transport', 'M-Sand from licensed crusher units, with a bill', 'Delivered to your site by lorry or tractor'],
    image: '/images/supply_sand.webp'
  },
  {
    id: 'cement',
    icon: 'Package', iconColor: '#708090',
    title: 'Cement',
    tagline: 'High-quality cement from top brands for strong and durable construction.',
    description: "Cement is the core binding material for any structure. iN Empower connects you with verified wholesale dealers and distributors in Prakasam district. Whether you need PPC, OPC 43, or OPC 53 grade cement for residential, commercial, or industrial projects, we ensure competitive pricing and timely delivery directly to your site.",
    beneficiaries: ['Home Builders', 'Construction Contractors', 'Real Estate Developers', 'Civil Engineers'],
    highlights: ['Top brands available (UltraTech, Ramco, Bharathi, etc.)', 'Wholesale pricing', 'Direct-to-site delivery', 'ISI-marked bags from authorised dealers'],
    image: '/images/supply_construction.webp'
  },
  {
    id: 'tmt-bars',
    icon: 'MoreHorizontal', iconColor: '#B0C4DE',
    title: 'TMT Bars',
    tagline: 'ISI-marked TMT steel bars (IS 1786) in the grade your engineer specifies.',
    description: "Strong structural foundations rely on good Thermo Mechanically Treated (TMT) steel bars. iN Empower gets you Fe 500, Fe 500D and Fe 550 grade bars from trusted steel dealers in Ongole. We supply only ISI-marked bars (IS 1786) from authorised dealers, at wholesale market rates.",
    beneficiaries: ['Individual Home Builders', 'Structural Engineers', 'Construction Contractors', 'Commercial Developers'],
    highlights: ['Fe 500 & Fe 500D grades available', 'ISI-marked bars only (IS 1786)', 'Certified top brands', 'Transparent weighing and delivery'],
    image: '/images/supply_construction.webp'
  },
  {
    id: 'bricks',
    icon: 'Layers', iconColor: '#CD5C5C',
    title: 'Bricks',
    tagline: 'High-strength traditional red clay bricks for classic construction.',
    description: "Red clay bricks remain a traditional favorite for their thermal insulation and durability. Through iN Empower, you can source uniformly baked, high-compressive-strength red bricks directly from verified kilns around Prakasam district. We handle the logistics to ensure minimal breakage and timely delivery.",
    beneficiaries: ['Home Builders', 'Traditional Architects', 'Masonry Contractors', 'Renovation Specialists'],
    highlights: ['Locally sourced from verified kilns', 'Uniform shape and high strength', 'Excellent thermal insulation', 'Bulk delivery with low breakage rates'],
    image: '/images/supply_construction.webp'
  },
  {
    id: 'cement-bricks',
    icon: 'Grid', iconColor: '#A9A9A9',
    title: 'Cement Bricks',
    tagline: 'Cost-effective and eco-friendly solid and hollow concrete blocks.',
    description: "Concrete bricks and blocks (solid and hollow) offer faster construction times and excellent durability. iN Empower connects you with local manufacturing units for high-quality cement bricks, AAC blocks, and fly ash bricks. Perfect for modern construction looking for cost-efficiency and strength.",
    beneficiaries: ['Commercial Builders', 'Large Scale Developers', 'Modern Home Builders', 'Boundary Wall Contractors'],
    highlights: ['Solid, hollow, and AAC blocks available', 'Cost-effective and eco-friendly', 'Faster construction time', 'Direct from manufacturing units'],
    image: '/images/supply_construction.webp'
  },
  {
    id: 'transport',
    icon: 'Truck', iconColor: '#8B5A2B',
    title: 'Transport',
    tagline: 'Secure and timely goods transport vehicles and freight services.',
    description: "Moving materials safely across Andhra Pradesh or to other states requires reliable transport. We provide access to verified lorry owners, mini-truck operators, and specialized goods carriers in Ongole. Whether it is a mini truck of shop goods or a 20-ton granite load, we ensure your goods are in safe hands. Shifting your house? Packers & Movers (in Hire a professional) pack, move and set up your home.",
    beneficiaries: ['Granite & Stone Exporters', 'Agriculture Produce Farmers', 'Wholesale Traders', 'Shops & Small Businesses', 'Construction Material Suppliers'],
    highlights: ['Verified fleet owners & truck operators', 'Full-load & part-load options', 'Insurance-backed for high-value goods'],
    image: '/images/supply_transport.webp'
  },
  {
    id: 'furniture',
    icon: 'Armchair', iconColor: '#8B2127',
    title: 'Furniture',
    tagline: 'Premium custom and readymade wooden furniture for homes and offices.',
    description: "Ongole has a rich tradition of skilled carpenters and woodworkers. Whether you need custom teak furniture for your new home, modular office setups, or bulk orders for a wedding hall — our verified furniture makers deliver quality craftsmanship with honest pricing and on-time delivery.",
    beneficiaries: ['Home Owners & New Families', 'Offices & Co-working Spaces', 'Hotels & Guest Houses', 'Wedding & Function Halls', 'Schools & Institutions'],
    highlights: ['Custom teak & rosewood furniture', 'Modular kitchen & wardrobe solutions', 'Office & commercial furniture', 'Bulk orders with delivery & installation'],
    image: '/images/supply_furniture.webp'
  },
  {
    id: 'events',
    icon: 'PartyPopper', iconColor: '#D4A373',
    title: 'Events',
    tagline: 'Comprehensive event management, decoration, and venue coordination services.',
    description: "Ongole and Prakasam district are known for grand weddings, temple festivals, and cultural celebrations. iN Empower connects you with verified event managers, decorators, sound and lighting professionals, and venue partners who make your special occasions unforgettable — from intimate poojas to 2,000-guest weddings.",
    beneficiaries: ['Wedding Families', 'Corporate & Business Events', 'Temple & Religious Functions', 'Birthday & Anniversary Celebrations', 'Community & Cultural Organizations'],
    highlights: ['End-to-end wedding planning', 'Stage, lighting & sound setup', 'Flower decoration & mandap design', 'Photography & videography coordination'],
    image: '/images/supply_events.webp'
  },
  {
    id: 'catering',
    icon: 'Utensils', iconColor: '#2F5233',
    title: 'Catering',
    tagline: 'Authentic local cuisine and professional catering services for events of any size.',
    description: "From traditional Andhra wedding feasts on banana leaves to modern corporate buffets, Ongole's catering heritage is legendary. iN Empower connects you with FSSAI-registered caterers who specialize in authentic Prakasam cuisine — think Ongole-style biryani, traditional payasam, and the famous Andhra thali that feeds both body and soul.",
    beneficiaries: ['Wedding Families', 'Corporate Offices', 'Event Organizers', 'Hostels & PG Accommodations', 'Film & Production Crews'],
    highlights: ['Traditional & modern menu options', 'FSSAI-registered kitchen partners', 'Live counters and buffet setups', 'Trained serving staff & presentation'],
    image: '/images/supply_catering.webp'
  },
  {
    id: 'cold-pressed-oils',
    icon: 'Droplet', iconColor: '#8B5A2B',
    title: 'Cold-Pressed Oils',
    tagline: 'Wood-pressed (ganuga) cooking oils, unrefined, from local mills.',
    description: "Groundnut, sesame and coconut oils from local ganugas (wood-pressed oil mills) across Prakasam district — pressed slowly in wooden ganugas and not refined. Every mill we work with holds an FSSAI licence.",
    beneficiaries: ['Health-Conscious Households', 'Ayurvedic Clinics', 'Premium Restaurants & Caterers', 'Organic Food Stores', 'Wholesale Distributors'],
    // Legal report (owner, 2 Nov 2026): FSSAI claims rules — plain facts, no "pure" / "chemical-free"
    highlights: ['Wood-pressed (ganuga), unrefined', 'From FSSAI-licensed local mills', 'Sourced from local Prakasam farmers', 'Available in retail & bulk packaging'],
    image: '/images/supply_coldpressed_oil.webp'
  },
  {
    id: 'invitation-cards',
    icon: 'Mail', iconColor: '#FF69B4',
    title: 'Invitation Cards',
    tagline: 'Beautifully designed invitation cards for all your special occasions.',
    description: 'We connect you with top local designers and printers for high-quality invitation cards. Whether it is a wedding, housewarming, or baby shower, you will find the perfect card to match your theme.',
    beneficiaries: ['Families hosting events', 'Event Planners', 'Wedding Organizers', 'Corporate Event Managers'],
    highlights: ['Customizable designs', 'Premium quality paper', 'Quick turnaround time', 'Options for all occasions'],
    image: '/images/supply_events.webp'
  },
  {
    // Rubber stamps (owner, 2 Nov 2026): office & business; proof on WhatsApp before making; delivered in town
    id: 'rubber-stamps',
    icon: 'Stamp', iconColor: '#3550B8',
    title: 'Rubber Stamps',
    tagline: 'Self-inking stamps, company seals, signature and date stamps.',
    description: 'Rubber stamps and seals for your shop, office, school, society or company. Tell us what the stamp should say; we send you a design proof on WhatsApp to approve before it is made, and our Local Buddy delivers it to your home or office in town.',
    beneficiaries: ['Shops & Businesses', 'Offices & Schools', 'Societies & Associations', 'Doctors, Lawyers & Professionals'],
    highlights: ['Design proof on WhatsApp before making', 'Self-inking, normal and round seals', 'Clear price first', 'Delivered to your home or office in town']
  },
  {
    id: 'upvc-sheets',
    icon: 'Layers', iconColor: '#1F4E8C',
    title: 'UPVC Sheets',
    tagline: 'Rust-free UPVC roofing sheets and PVC wall & ceiling panels.',
    description: "UPVC roofing sheets don't rust, keep sheds and terraces cooler than metal sheets, and stand up to Prakasam's coastal humidity and heavy rain. iN Empower connects you with verified dealers for corrugated and trapezoidal roofing, transparent skylight sheets, and PVC wall and ceiling panels — with fitting by trusted local workers.",
    beneficiaries: ['Home Owners (terraces & parking)', 'Farmers (poultry, dairy & farm sheds)', 'Shops & Godowns', 'Builders & Contractors'],
    highlights: ['Rust-free, no painting needed', 'Cooler and quieter than metal sheets', 'Roofing and wall / ceiling panels', 'Supply with fitting on request'],
    image: '/images/supply_construction.webp'
  },
  {
    id: 'upvc-marble-sheets',
    icon: 'Sparkles', iconColor: '#7A3E2A',
    title: 'PVC Marble Sheets',
    tagline: 'Glossy marble-look wall sheets for halls, TV walls and pooja rooms.',
    description: "PVC marble sheets (UV marble sheets) give walls the rich look of marble at a fraction of the cost and weight. They are waterproof, easy to clean and quick to fix — ideal for TV unit walls, pooja rooms, living rooms and shop interiors. iN Empower helps you choose designs and connects you with verified dealers and fitters near you.",
    beneficiaries: ['Home Owners', 'Interior Designers', 'Shops & Showrooms', 'Function Halls & Offices'],
    highlights: ['Marble look without the weight or cost', 'Waterproof and easy to clean', 'Many designs — white, black, onyx, wooden', 'Supply with fixing on request'],
    image: '/images/supply_interior.webp'
  }
]

export const whySupplies = [
  {
    icon: '✅',
    title: 'Verified Suppliers',
    desc: 'Every supplier in our network is personally vetted by our Local Buddy team. We verify licences, quality standards, and track records before connecting them with you.'
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: "No hidden charges, no middleman markups. Get direct-from-source pricing with clear quotations and no surprises — whether it is a truckload of sand or a wedding catering order."
  },
  {
    icon: '🤝',
    title: 'Local Buddy Support',
    desc: "Our on-ground team in Ongole personally coordinates between you and the supplier — from initial inquiry to delivery and post-service support. You are never alone."
  }
]

/**
 * How each supply is ordered: Telugu name, default unit and quantity steps (no unit = a
 * service, ordered without a quantity), other units the customer may pick, and the
 * choices a customer picks so the team can quote correctly (every choice also
 * allows a typed "Other"). Used by the app's supply pages; the website can use it too.
 */
export const supplyOrdering = {
  "granite": {
    "te": "గ్రానైట్",
    "unit": "sq.ft",
    "start": 100,
    "step": 50,
    "options": [
      {
        "label": "Colour",
        "choices": [
          "Black Galaxy",
          "Absolute Black",
          "Steel Grey",
          "Tan Brown",
          "Not sure"
        ]
      },
      {
        "label": "Finish",
        "choices": [
          "Polished",
          "Flamed",
          "Leather",
          "Honed"
        ]
      },
      {
        "label": "Use",
        "choices": [
          "Flooring",
          "Kitchen counter",
          "Steps & elevation",
          "Monument"
        ],
        "multi": true
      },
      {
        "label": "Thickness",
        "choices": [
          "18 mm",
          "20 mm",
          "30 mm"
        ]
      }
    ],
    "units": [
      "sq.ft",
      "sq.m"
    ]
  },
  "tiles": {
    "te": "టైల్స్",
    "unit": "sq.ft",
    "start": 100,
    "step": 50,
    "options": [
      {
        "label": "Type",
        "choices": [
          "Vitrified",
          "Ceramic",
          "Designer / mosaic",
          "Parking (outdoor)"
        ]
      },
      {
        "label": "Where",
        "choices": [
          "Floor",
          "Wall",
          "Bathroom",
          "Kitchen"
        ],
        "multi": true
      },
      {
        "label": "Size",
        "choices": [
          "1×1 ft",
          "2×2 ft",
          "2×4 ft",
          "Not sure"
        ]
      }
    ],
    "units": [
      "sq.ft",
      "sq.m",
      "boxes"
    ]
  },
  "sand": {
    "te": "ఇసుక",
    "unit": "loads",
    "start": 1,
    "step": 1,
    "options": [
      {
        "label": "Type",
        "choices": [
          "River sand — free, we book it",
          "Plastering sand — free, we book it",
          "M-Sand (from a crusher unit)"
        ]
      },
      {
        "label": "Vehicle",
        "choices": [
          "Tractor load",
          "Lorry (10 tons)",
          "Lorry (20 tons)"
        ]
      }
    ],
    "units": [
      "loads",
      "tons",
      "cubic ft"
    ]
  },
  "cement": {
    "te": "సిమెంట్",
    "unit": "bags",
    "start": 50,
    "step": 10,
    "options": [
      {
        "label": "Grade",
        "choices": [
          "OPC 53",
          "OPC 43",
          "PPC"
        ]
      },
      {
        "label": "Brand",
        "choices": [
          "UltraTech",
          "Ramco",
          "Bharathi",
          "Dalmia",
          "Any good brand"
        ]
      }
    ],
    "units": [
      "bags",
      "tonnes"
    ]
  },
  "tmt-bars": {
    "te": "TMT కడ్డీలు",
    "unit": "tonnes",
    "start": 1,
    "step": 1,
    "options": [
      {
        "label": "Grade",
        "choices": [
          "Fe 500",
          "Fe 500D",
          "Fe 550"
        ]
      },
      {
        "label": "Diameter",
        "choices": [
          "8 mm",
          "10 mm",
          "12 mm",
          "16 mm",
          "20 mm"
        ],
        "multi": true
      }
    ],
    "units": [
      "tonnes",
      "kg"
    ]
  },
  "bricks": {
    "te": "ఎర్ర ఇటుకలు",
    "unit": "pieces",
    "start": 1000,
    "step": 500,
    "options": [
      {
        "label": "Type",
        "choices": [
          "Standard red clay",
          "Wire-cut"
        ]
      }
    ],
    "units": [
      "pieces"
    ]
  },
  "cement-bricks": {
    "te": "సిమెంట్ ఇటుకలు",
    "unit": "pieces",
    "start": 1000,
    "step": 500,
    "options": [
      {
        "label": "Type",
        "choices": [
          "Solid blocks",
          "Hollow blocks",
          "AAC blocks",
          "Fly ash bricks"
        ]
      },
      {
        "label": "Thickness",
        "choices": [
          "4 inch",
          "6 inch",
          "8 inch"
        ]
      }
    ],
    "units": [
      "pieces"
    ]
  },
  "transport": {
    "te": "రవాణా",
    "unit": "trips",
    "start": 1,
    "step": 1,
    "options": [
      {
        "label": "Vehicle",
        "choices": [
          "Mini truck (Tata Ace)",
          "Tractor",
          "Lorry (10 tons)",
          "Lorry (20 tons+)"
        ]
      },
      {
        "label": "Distance",
        "choices": [
          "Within Ongole",
          "Within Prakasam District",
          "Outside the district"
        ]
      },
      {
        "label": "Goods",
        "choices": [
          "Building material",
          "Shop / business goods",
          "Farm produce",
          "Other"
        ]
      }
    ],
    "units": [
      "trips"
    ]
  },
  "furniture": {
    "te": "ఫర్నిచర్",
    "unit": "pieces",
    "start": 1,
    "step": 1,
    "options": [
      {
        "label": "Item",
        "choices": [
          "Bed",
          "Sofa",
          "Dining set",
          "Wardrobe",
          "Office furniture",
          "Bulk order"
        ],
        "multi": true
      },
      {
        "label": "Wood",
        "choices": [
          "Teak",
          "Neem",
          "Engineered wood",
          "Not sure"
        ]
      }
    ],
    "units": [
      "pieces"
    ]
  },
  "events": {
    "te": "వేడుకల నిర్వహణ",
    "options": [
      {
        "label": "Occasion",
        "choices": [
          "Wedding",
          "Birthday / anniversary",
          "Pooja / temple festival",
          "Corporate"
        ]
      },
      {
        "label": "Guests",
        "choices": [
          "Up to 100",
          "100–500",
          "500–2,000",
          "2,000+"
        ]
      },
      {
        "label": "Need",
        "choices": [
          "Decoration",
          "Tent & chairs",
          "Sound & lights",
          "Full management"
        ],
        "multi": true
      }
    ]
  },
  "catering": {
    "te": "కేటరింగ్",
    "unit": "plates",
    "start": 50,
    "step": 25,
    "options": [
      {
        "label": "Food",
        "choices": [
          "Veg",
          "Non-veg",
          "Both"
        ]
      },
      {
        "label": "Serving",
        "choices": [
          "Banana-leaf meals",
          "Buffet",
          "Packed boxes"
        ]
      }
    ],
    "units": [
      "plates"
    ]
  },
  "cold-pressed-oils": {
    "te": "గానుగ నూనెలు",
    "unit": "litres",
    "start": 5,
    "step": 1,
    "options": [
      {
        "label": "Oil",
        "choices": [
          "Groundnut",
          "Sesame (gingelly)",
          "Coconut",
          "Sunflower",
          "Mustard"
        ],
        "multi": true
      },
      {
        "label": "Pack",
        "choices": [
          "1 litre bottles",
          "5 litre cans",
          "15 litre tin"
        ]
      }
    ],
    "units": [
      "litres"
    ]
  },
  "rubber-stamps": {
    "te": "రబ్బరు స్టాంపులు",
    "unit": "stamps",
    "start": 1,
    "step": 1,
    "options": [
      {
        "label": "Kind of stamp",
        "choices": [
          "Self-inking stamp",
          "Rubber stamp with ink pad",
          "Round company / society seal",
          "Common seal (embossing)",
          "Signature stamp",
          "Date stamp"
        ],
        "multi": true
      },
      {
        "label": "Size",
        "choices": [
          "Small (1–2 lines)",
          "Medium (3–4 lines)",
          "Large (5–6 lines)",
          "Round seal (about 40 mm)"
        ]
      },
      {
        "label": "Ink colour",
        "choices": [
          "Blue",
          "Violet",
          "Black",
          "Red",
          "Green"
        ]
      },
      {
        "label": "What should the stamp say?",
        "choices": [
          "Name & designation",
          "Shop / company name & address",
          "Society or school name",
          "Paid / Received / Approved"
        ]
      }
    ],
    "units": [
      "stamps"
    ]
  },
  "invitation-cards": {
    "te": "ఆహ్వాన పత్రికలు",
    "unit": "cards",
    "start": 100,
    "step": 50,
    "options": [
      {
        "label": "Occasion",
        "choices": [
          "Wedding",
          "Housewarming",
          "Birthday",
          "Other"
        ]
      },
      {
        "label": "Language",
        "choices": [
          "Telugu",
          "English",
          "Both"
        ]
      },
      {
        "label": "Type",
        "choices": [
          "Printed",
          "Digital (WhatsApp)"
        ],
        "multi": true
      }
    ],
    "units": [
      "cards"
    ]
  },
  "upvc-sheets": {
    "te": "UPVC షీట్లు",
    "unit": "sheets",
    "start": 10,
    "step": 5,
    "units": [
      "sheets",
      "sq.ft"
    ],
    "options": [
      {
        "label": "Use",
        "choices": [
          "Roofing",
          "Wall panels",
          "Ceiling panels"
        ],
        "multi": true
      },
      {
        "label": "Roofing profile",
        "choices": [
          "Corrugated (wave)",
          "Trapezoidal",
          "Transparent / skylight",
          "Not for roofing"
        ]
      },
      {
        "label": "Colour",
        "choices": [
          "White",
          "Blue",
          "Green",
          "Terracotta red",
          "Grey"
        ]
      },
      {
        "label": "Thickness",
        "choices": [
          "2 mm",
          "2.5 mm",
          "3 mm",
          "Not sure"
        ]
      },
      {
        "label": "Sheet length",
        "choices": [
          "8 ft",
          "10 ft",
          "12 ft",
          "Not sure"
        ]
      },
      {
        "label": "Where",
        "choices": [
          "Home terrace",
          "Parking / shed",
          "Poultry or farm shed",
          "Shop / godown"
        ],
        "multi": true
      },
      {
        "label": "Fitting",
        "choices": [
          "Supply only",
          "Supply + fitting"
        ]
      }
    ]
  },
  "upvc-marble-sheets": {
    "te": "PVC మార్బుల్ షీట్లు",
    "unit": "sheets",
    "start": 10,
    "step": 5,
    "units": [
      "sheets",
      "sq.ft"
    ],
    "options": [
      {
        "label": "Where",
        "choices": [
          "Living room wall",
          "TV unit wall",
          "Pooja room",
          "Bedroom",
          "Shop / showroom",
          "Ceiling"
        ],
        "multi": true
      },
      {
        "label": "Design",
        "choices": [
          "White marble",
          "Black marble",
          "Onyx / gold veins",
          "Wooden look",
          "Not sure"
        ]
      },
      {
        "label": "Finish",
        "choices": [
          "High gloss",
          "Matte"
        ]
      },
      {
        "label": "Thickness",
        "choices": [
          "2.5 mm",
          "3 mm",
          "4 mm",
          "Not sure"
        ]
      },
      {
        "label": "Sheet size",
        "choices": [
          "4 × 8 ft (standard)",
          "4 × 10 ft",
          "Not sure"
        ]
      },
      {
        "label": "Fixing",
        "choices": [
          "Supply only",
          "Supply + fixing"
        ]
      }
    ]
  }
}
