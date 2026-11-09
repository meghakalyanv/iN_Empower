export const chatLocales = {
  en: {
    selectLanguagePrompt: "Welcome to iN Empower! Please select your preferred language.",
    askName: "Hi there! I'm your iN Empower Chat Buddy. 👋 What's your name?",
    askMobile: "Nice to meet you, {name}! 🌟 Could you please share your mobile number? We call you on it and send updates on WhatsApp. (Living abroad? Start with + and your country code, e.g. +1 415 555 0100.)",
    invalidMobile: "Oops! That doesn't look like a valid mobile number. Please type the 10-digit number — or, from abroad, + and your country code.",
    mobileThanks: "Thank you! How can I help you today? Please choose a category or type what you need.",
    needMoreInfo: "I'll need a bit more info to help you with that. Could you describe your need in a few more words?",
    typeArea: "Please type your specific Ward number, Village, or Local Area in {town}:",
    typeSpecificArea: "Please type your town, mandal or village (we deliver across Prakasam District):",
    typeSpecificTown: "Please type your specific town, mandal, or village in Prakasam District:",
    selectSpecificArea: "Great! To help us serve you better in {loc}, please select your specific area or type your Ward number: 📍",
    submitSuccess: "Thanks, {name}! We've received your request. Our team will contact you at {mobile} very soon. Have a great day! 🌟",
    viewDashboard: "View My Dashboard",

    guidedFlows: {
      'photography': {
        serviceCategory: 'photography',
        serviceId: 'photography-services',
        greeting: "Photography is a great way to capture memories! 📸 Let's find you the best photographer, {name}.",
        summary: "Perfect! Here's a summary of your photography requirements:",
        questions: [
          {
            key: 'type',
            ask: "What kind of photography service do you need?",
            options: [
              { label: '💍 Wedding', value: 'Wedding Photography' },
              { label: '🏢 Corporate', value: 'Corporate Photography' },
              { label: '📢 Advertising', value: 'Advertising Photography' },
              { label: '🎉 Event', value: 'Event Photography' },
              { label: '🧑 Portrait', value: 'Portrait Photography' },
              { label: '📦 Product', value: 'Product Photography' },
              { label: '🏠 Real Estate', value: 'Real Estate Photography' },
              { label: '❓ Other', value: 'Other' }
            ]
          },
          {
            key: 'location',
            ask: "Where will the shoot take place?",
            options: [
              { label: '📍 Ongole', value: 'Ongole' },
              { label: '📍 Chirala', value: 'Chirala' },
              { label: '📍 Markapur', value: 'Markapur' },
              { label: '🌍 Other', value: 'Other' }
            ]
          },
          {
            key: 'duration',
            ask: "How long will you need the photographer for?",
            options: [
              { label: '⏳ 1-2 Hours', value: '1-2 Hours' },
              { label: '🕒 Half Day', value: 'Half Day' },
              { label: '⏱️ Full Day', value: 'Full Day' },
              { label: '📅 Multiple Days', value: 'Multiple Days' }
            ]
          }
        ]
      },
      'home-tuitions': {
        greeting: "Wonderful! 🎓 Home Tuitions — great choice, {name}! Let me help you find the perfect tutor. I just need a few details.",
        questions: [
          { ask: "Which education level is this for?", key: 'level', options: [{ label: '🎒 Primary (1-5)', value: 'Primary (Classes 1-5)' }, { label: '🏫 Secondary (6-10)', value: 'Secondary (Classes 6-10)' }, { label: '📚 Intermediate (11-12)', value: 'Intermediate (11th & 12th)' }, { label: '🎓 Graduation / Degree', value: 'Graduation (Degree & B.Tech)' }] },
          {
            ask: "What subject does the student need help with?", key: 'subject', optionsByPrev: {
              'Primary (Classes 1-5)': [{ label: 'Mathematics', value: 'Mathematics' }, { label: 'Science', value: 'Science' }, { label: 'English', value: 'English' }, { label: 'Hindi / Regional', value: 'Hindi / Regional Language' }],
              'Secondary (Classes 6-10)': [{ label: 'Mathematics', value: 'Mathematics' }, { label: 'Physical Science', value: 'Physical Science (Physics, Chemistry)' }, { label: 'Biology', value: 'Biological Science (Biology)' }, { label: 'Social Studies', value: 'Social Studies' }, { label: 'English', value: 'English' }],
              'Intermediate (11th & 12th)': [{ label: 'Mathematics', value: 'Mathematics (A & B)' }, { label: 'Physics', value: 'Physics' }, { label: 'Chemistry', value: 'Chemistry' }, { label: 'Botany & Zoology', value: 'Botany & Zoology' }, { label: 'Accounts & Commerce', value: 'Accounts & Commerce' }, { label: 'Economics', value: 'Economics' }],
              'Graduation (Degree & B.Tech)': [{ label: 'Engg. Mathematics', value: 'Engineering Mathematics' }, { label: 'Computer Science', value: 'Computer Science (C, C++, Java, Python)' }, { label: 'Fin. Accounting', value: 'Financial Accounting' }, { label: 'Adv. Physics', value: 'Advanced Physics' }, { label: 'Adv. Chemistry', value: 'Advanced Chemistry' }, { label: 'Business Stats', value: 'Business Statistics' }]
            }
          },
          { ask: "How many days per week would you like the tuition?", key: 'frequency', options: [{ label: '2 days/week', value: '2 days per week' }, { label: '3 days/week', value: '3 days per week' }, { label: '5 days/week', value: '5 days per week' }, { label: 'Daily', value: 'Daily (6 days)' }] },
          { ask: "What's your preferred timing?", key: 'timing', options: [{ label: '🌅 Morning (6-9 AM)', value: 'Morning (6-9 AM)' }, { label: '☀️ Afternoon (12-3 PM)', value: 'Afternoon (12-3 PM)' }, { label: '🌇 Evening (4-7 PM)', value: 'Evening (4-7 PM)' }, { label: '🌙 Night (7-10 PM)', value: 'Night (7-10 PM)' }] },
          { ask: "Please share your area or locality so we can find a tutor near you.", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Prakasam Dt.' }
        ],
        summary: "Here's a summary of your Home Tuition request:",
        serviceCategory: 'home-tuition',
        serviceId: 'home-tuitions'
      },
      'college-admissions': {
        greeting: "Excellent! 🎓 College Admissions — let me help you get started, {name}!",
        questions: [
          { ask: "What type of program are you looking for?", key: 'program', options: [{ label: '🎓 B.Tech / Engineering', value: 'B.Tech / Engineering' }, { label: '💼 MBA / Management', value: 'MBA / Management' }, { label: '💊 Pharmacy', value: 'Pharmacy (B.Pharm / Pharm.D)' }, { label: '🖥️ BCA / MCA', value: 'BCA / MCA' }, { label: '📐 Other Degree', value: 'Other Degree Program' }] },
          { ask: "Which year of admission?", key: 'year', options: [{ label: '2027-28', value: '2027-28' }, { label: '2028-29', value: '2028-29' }] },
          { ask: "Do you have any preferred college or location in mind?", key: 'preference', freeText: true, placeholder: 'e.g. QIS College Ongole, any Vijayawada college...' }
        ],
        summary: "Here's your College Admission inquiry:",
        serviceCategory: 'education',
        serviceId: 'college-admissions'
      },
      'driving-license': {
        greeting: "Sure thing! 🚗 Let me help you with Driving Licence, {name}.",
        questions: [
          { ask: "What do you need help with?", key: 'type', options: [{ label: "📝 New Learner's Licence", value: "New Learner's Licence" }, { label: '🪪 Permanent DL (New)', value: 'New Permanent Driving Licence' }, { label: '🔄 DL Renewal', value: 'Driving Licence Renewal' }, { label: '📍 Address Change on DL', value: 'Address Change on DL' }, { label: '📋 Duplicate DL', value: 'Duplicate / Lost DL' }] },
          { ask: "Which vehicle type?", key: 'vehicleType', options: [{ label: '🛵 Two Wheeler', value: 'Two Wheeler (MCWG)' }, { label: '🚗 Four Wheeler (LMV)', value: 'Light Motor Vehicle (LMV)' }, { label: '🚛 Heavy Vehicle', value: 'Heavy Motor Vehicle (HMV)' }, { label: 'Both 2W & 4W', value: 'Two Wheeler + Four Wheeler' }] },
          { ask: "Which city/district is your RTO?", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Chirala, Vijayawada...' }
        ],
        summary: "Here's your Driving Licence request:",
        serviceCategory: 'rto',
        serviceId: 'learners-driving-license'
      },
      'birth-certificate': {
        greeting: "Of course! 📋 Birth Certificate — I'll walk you through this, {name}.",
        questions: [
          { ask: "What type of service do you need?", key: 'type', options: [{ label: '🆕 New Registration', value: 'New Birth Registration' }, { label: '⏰ Delayed Registration', value: 'Delayed Birth Registration' }, { label: '✏️ Name Inclusion/Change', value: 'Name Inclusion or Correction' }, { label: '📄 Duplicate Copy', value: 'Duplicate Birth Certificate' }] },
          { ask: "Where was the birth?", key: 'location', freeText: true, placeholder: 'e.g. Hospital name, City...' }
        ],
        summary: "Here's your Birth Certificate request:",
        serviceCategory: 'identity',
        serviceId: 'birth-certificate'
      },
      'property-registration': {
        greeting: "Great choice! 🏠 Property Registration — let me guide you, {name}.",
        questions: [
          { ask: "What type of property transaction?", key: 'type', options: [{ label: '📝 Sale Deed Registration', value: 'Sale Deed Registration' }, { label: '🔄 Transfer of Ownership', value: 'Transfer of Ownership' }, { label: '🏗️ New Property Purchase', value: 'New Property Purchase' }, { label: '📋 Gift Deed', value: 'Gift Deed Registration' }] },
          { ask: "Is the property agricultural land or a building/plot?", key: 'propertyType', options: [{ label: '🌾 Agricultural Land', value: 'Agricultural Land' }, { label: '🏠 Residential Plot/Building', value: 'Residential Plot/Building' }, { label: '🏢 Commercial Property', value: 'Commercial Property' }] },
          { ask: "In which town/village and ward in Prakasam District is the property located?", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Ward 14...' }
        ],
        summary: "Here's your Property Registration request:",
        serviceCategory: 'property',
        serviceId: 'property-registration-sale-deed'
      },
      'startup': {
        greeting: "Exciting! 🚀 Starting a business is a huge step, and I love the energy, {name}! As your dedicated business advisor, I'll help you structure this perfectly.",
        questions: [
          { ask: "First, what type of business structure are you considering?", key: 'type', options: [{ label: '👤 Sole Proprietorship', value: 'Sole Proprietorship' }, { label: '🤝 Partnership Firm', value: 'Partnership Firm' }, { label: '1️⃣ One Person Company', value: 'One Person Company (OPC)' }, { label: '🏢 LLP', value: 'Limited Liability Partnership (LLP)' }, { label: '🏛️ Pvt Ltd Company', value: 'Private Limited Company' }, { label: '❓ Not Sure - Guide Me', value: 'Need Guidance' }] },
          { ask: "What is the primary industry or focus of your business idea?", key: 'businessNature', freeText: true, placeholder: 'e.g. Tech Startup, Restaurant, E-commerce, Export...' },
          { ask: "To help us tailor our advice, have you previously owned or managed a business?", key: 'pastExperience', options: [{ label: '🌟 Yes, I have', value: 'Yes' }, { label: '🌱 No, this is my first', value: 'No' }] },
          { 
            askByPrevKey: 'type',
            askByPrev: {
              'Sole Proprietorship': "For a Sole Proprietorship, it's all about quick execution. What is your primary immediate goal?",
              'Partnership Firm': "Partnerships require clear agreements. What is the primary goal for registering your firm right now?",
              'Private Limited Company': "Private Limited Companies are great for scaling. What is your primary goal for incorporating right now?",
              'One Person Company (OPC)': "OPCs offer great protection for solo founders. What is your primary goal right now?",
              'Limited Liability Partnership (LLP)': "LLPs offer great flexibility. What is your primary goal right now?",
              'Need Guidance': "No problem, we'll figure it out together. What is your main objective for starting a business?",
              'default': "What is your primary goal for registering right now?"
            },
            key: 'primaryGoal', 
            optionsByPrevKey: 'type',
            optionsByPrev: {
              'Private Limited Company': [
                { label: '💰 Seeking Funding/Investors', value: 'Seeking Funding' }, 
                { label: '🛡️ Brand & Asset Protection', value: 'Brand Protection' }, 
                { label: '🏦 Opening a Current Account', value: 'Current Account' }, 
                { label: '🌟 All of the above', value: 'All of the above' },
                { label: '🚀 Just getting started', value: 'Just getting started' }
              ],
              'Sole Proprietorship': [
                { label: '🏦 Opening a Current Account', value: 'Current Account' }, 
                { label: '📝 GST Registration', value: 'GST Registration' }, 
                { label: '🏢 Local Trade License', value: 'Trade License' }, 
                { label: '🌟 All of the above', value: 'All of the above' },
                { label: '🚀 Just getting started', value: 'Just getting started' }
              ],
              'Partnership Firm': [
                { label: '🤝 Drafting Partnership Deed', value: 'Partnership Deed' }, 
                { label: '🏦 Opening a Current Account', value: 'Current Account' }, 
                { label: '📝 GST Registration', value: 'GST Registration' }, 
                { label: '🌟 All of the above', value: 'All of the above' },
                { label: '🚀 Just getting started', value: 'Just getting started' }
              ],
              'Limited Liability Partnership (LLP)': [
                { label: '🛡️ Limited Liability Protection', value: 'Asset Protection' }, 
                { label: '🏦 Opening a Current Account', value: 'Current Account' }, 
                { label: '👨‍💼 Professional Services Setup', value: 'Professional Services' }, 
                { label: '🌟 All of the above', value: 'All of the above' },
                { label: '🚀 Just getting started', value: 'Just getting started' }
              ],
              'default': [
                { label: '💰 Seeking Funding/Investors', value: 'Seeking Funding' }, 
                { label: '🛡️ Brand Protection', value: 'Brand Protection' }, 
                { label: '🏦 Current Account', value: 'Current Account' }, 
                { label: '🌟 All of the above', value: 'All of the above' },
                { label: '🚀 Just getting started', value: 'Just getting started' }
              ]
            }
          },
          { ask: "When are you planning to officially launch or incorporate?", key: 'timeline', options: [{ label: '⚡ Immediately', value: 'Immediately' }, { label: '📅 Within a month', value: 'Within a month' }, { label: '🔍 Still researching', value: 'Still researching' }] }
        ],
        summary: "Thank you for sharing your vision! Here is a summary of your business profile:",
        serviceCategory: 'startup',
        serviceId: 'private-limited-company'
      },
      'professional-services': {
        greeting: "Sure! 👨‍🍳 Professional Services — let me match you with the right professional, {name}.",
        questions: [
          { ask: "What type of professional do you need?", key: 'type', options: [{ label: '🚗 Driver', value: 'Driver' }, { label: '👨‍🍳 Chef/Cook', value: 'Chef/Cook' }, { label: '💄 Makeup Artist', value: 'Professional Makeup Artist' }, { label: '🖨️ Banners & signboards', value: 'Flex Printing Services' }, { label: '✂️ Tailor (Home Visit)', value: 'Tailor Services' }, { label: '👔 Dry Cleaning', value: 'Dry Cleaning & Laundry' }, { label: '⚡ Electrician', value: 'Electrician' }, { label: '❄️ AC Technician', value: 'AC Technician' }, { label: '✨ Cleaning Services', value: 'Cleaning Services' }, { label: '🧼 Car Wash Service', value: 'Car Wash Service' }, { label: '🔧 Plumbing Services', value: 'Plumbing Services' }] },
          { 
            askByPrevKey: 'type',
            askByPrev: {
              'Flex Printing Services': "What exactly do you need printed?",
              'Tailor Services': "What do you need stitched or altered?",
              'Dry Cleaning & Laundry': "What type of clothes need dry cleaning?",
              'Electrician': "What kind of electrical work is required?",
              'AC Technician': "What type of AC service do you need?",
              'Cleaning Services': "Which cleaning services do you need? (You can select one or type multiple)",
              'Car Wash Service': "What type of car wash service do you need?",
              'Plumbing Services': "What kind of plumbing service do you need?",
              'default': "Is this for a one-time event or ongoing/daily?"
            },
            key: 'requirement', freeText: true,
            optionsByPrevKey: 'type',
            optionsByPrev: {
              'Flex Printing Services': [{label: '🚩 Cloth / eco banner', value: 'Cloth / eco-friendly banner'}, {label: '🏪 Signboard', value: 'Signboard'}, {label: '🚗 Vehicle Sticker', value: 'Vehicle Sticker'}, {label: '❓ Other', value: 'Other'}],
              'Tailor Services': [{label: '👔 Men\'s Wear', value: 'Men\'s Wear'}, {label: '👗 Women\'s Wear', value: 'Women\'s Wear'}, {label: '✂️ Alterations', value: 'Alterations'}],
              'Dry Cleaning & Laundry': [{label: '✨ Premium Wear (Suits/Sarees)', value: 'Premium Wear'}, {label: '🧺 Everyday Wash & Fold', value: 'Wash & Fold'}, {label: '💨 Steam Ironing', value: 'Steam Ironing'}],
              'Electrician': [{label: '🔌 Switches & Sockets', value: 'Switches & Sockets'}, {label: '💨 Fans & Ventilation', value: 'Fans & Ventilation'}, {label: '💡 Lighting', value: 'Lighting & Fixtures'}, {label: '⚡ Wiring/Boards', value: 'Wiring'}],
              'AC Technician': [{label: '💧 Jet Cleaning', value: 'Jet Cleaning'}, {label: '💨 Gas Refill', value: 'Gas Refilling'}, {label: '🔧 Repair', value: 'Repair'}, {label: '⚙️ Install/Relocate', value: 'Installation'}],
              'Cleaning Services': [{label: '🏠 Full Home Deep Cleaning', value: 'Full Home Deep Cleaning'}, {label: '🧽 Kitchen/Bathroom Scrubbing', value: 'Kitchen/Bathroom Scrubbing'}, {label: '🛋️ Sofa Shampooing', value: 'Sofa Shampooing'}, {label: '💧 Overhead Water Tank Maintenance', value: 'Overhead Water Tank Maintenance'}],
              'Car Wash Service': [{label: '🚘 Full Service (Pickup & Drop)', value: 'Full Service (Pickup & Drop)'}, {label: '🏠 Body Wash at Home', value: 'Body Wash at Home'}],
              'Plumbing Services': [{label: '🚰 Leak & Pipe Repair', value: 'Leak & Pipe Repair'}, {label: '🚿 Tap/Shower Installation', value: 'Tap/Shower Installation'}, {label: '🚽 Toilet/Washbasin Repair', value: 'Toilet/Washbasin Repair'}, {label: '💧 Motor & Tank issues', value: 'Motor & Tank issues'}],
              'default': [{ label: '📅 One-time Event', value: 'One-time Event' }, { label: '🔄 Daily / Ongoing', value: 'Daily / Ongoing' }, { label: '📆 Weekly', value: 'Weekly Basis' }, { label: '📅 Monthly Subscription', value: 'Monthly Subscription' }]
            }
          },
          { ask: "In which area/city do you need the service?", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Chirala, Markapur...' }
        ],
        summary: "Here's your Professional Service request:",
        serviceCategory: 'drivers',
        serviceId: 'verified-driver-services'
      },
      'interior-design': {
        greeting: "Fantastic! 🪴 Interior Design — I'll help you create your dream space, {name}.",
        questions: [
          { ask: "What type of space are you designing?", key: 'projectType', options: [{ label: '🏠 Residential', value: 'Residential' }, { label: '🏢 Commercial', value: 'Commercial' }, { label: '🍽️ Modular Kitchen', value: 'Modular Kitchen' }, { label: '📐 Vastu Consulting', value: 'Vastu Consulting' }] },
          { ask: "What is the approximate size of the space (e.g., 2BHK, 1500 sq ft)?", key: 'spaceSize', freeText: true, placeholder: 'e.g. 2BHK, 1500 sq ft' },
          { ask: "Do you have a specific style in mind?", key: 'style', options: [{ label: '✨ Modern / Contemporary', value: 'Modern' }, { label: '🏛️ Traditional / Classic', value: 'Traditional' }, { label: '🌱 Minimalist', value: 'Minimalist' }, { label: '🤷 Not sure yet', value: 'Not Sure' }] },
          { ask: "What is your budget range?", key: 'budget', options: [{ label: '💰 Premium (High-end)', value: 'Premium' }, { label: '💵 Standard (Mid-range)', value: 'Standard' }, { label: '🪙 Budget-friendly', value: 'Budget' }] },
          { ask: "Where is the property located?", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Markapur, Chirala' },
          { ask: "When do you plan to start the project?", key: 'timeline', options: [{ label: '🚀 Immediately', value: 'Immediately' }, { label: '📅 In 1-3 months', value: '1-3 months' }, { label: '🔍 Just exploring', value: 'Just exploring' }] }
        ],
        summary: "Here is your Interior Design request:",
        serviceCategory: 'interior',
        serviceId: 'interior-full-home'
      },
      'architecture': {
        greeting: "Great choice! 🏛️ Architecture — let's build something amazing, {name}.",
        questions: [
          { ask: "What type of building project is this?", key: 'buildingType', options: [{ label: '🏠 Residential House', value: 'Residential' }, { label: '🏢 Commercial Building', value: 'Commercial' }, { label: '🏗️ Industrial / Warehouse', value: 'Industrial' }, { label: '🏛️ Institutional / Temple', value: 'Institutional' }] },
          { ask: "What is the approximate plot size?", key: 'plotSize', freeText: true, placeholder: 'e.g. 30x40 ft, 200 sq yards' },
          { ask: "How many floors are you planning?", key: 'floors', options: [{ label: '1 Floor (G)', value: 'G' }, { label: '2 Floors (G+1)', value: 'G+1' }, { label: '3+ Floors', value: 'G+2 or more' }, { label: 'Not decided', value: 'Not decided' }] },
          { ask: "Do you need municipal approvals (e.g., APCRDA)?", key: 'compliance', options: [{ label: '✅ Yes, full approvals', value: 'Yes' }, { label: '❌ No, just the plan', value: 'No' }, { label: '🤷 Not sure', value: 'Not sure' }] },
          { ask: "Where is the site located?", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Prakasam' },
          { ask: "When do you plan to start construction?", key: 'timeline', options: [{ label: '🚀 Immediately', value: 'Immediately' }, { label: '📅 In 1-3 months', value: '1-3 months' }, { label: '🔍 Just exploring', value: 'Just exploring' }] }
        ],
        summary: "Here is your Architecture request:",
        serviceCategory: 'architecture',
        serviceId: 'arch-house-plan'
      },
      'supplies': {
        greeting: "Excellent! 🏗️ Let me help you source exactly what you need, {name}.",
        questions: [
          { ask: "Which supply or service are you looking for?", key: 'category', options: [{ label: '🪨 Granite', value: 'Granite' }, { label: '🚜 Sand', value: 'Sand' }, { label: '📦 Cement', value: 'Cement' }, { label: '🔩 TMT Bars', value: 'TMT Bars' }, { label: '🧱 Bricks', value: 'Bricks' }, { label: '🧱 Cement Bricks', value: 'Cement Bricks' }, { label: '🔲 Tiles', value: 'Tiles' }, { label: '🏠 UPVC Sheets', value: 'UPVC Sheets' }, { label: '🪞 PVC Marble Sheets', value: 'PVC Marble Sheets' }, { label: '🛋️ Furniture', value: 'Furniture' }, { label: '👨‍🍳 Catering', value: 'Catering' }, { label: '🎪 Events', value: 'Events' }, { label: '🚛 Transport', value: 'Transport' }, { label: '🫙 Oils', value: 'Cold-Pressed Oils' }, { label: '✨ Cleaning', value: 'Cleaning Services' }, { label: '💌 Invitation Cards', value: 'Invitation Cards' }] },
          { ask: "Could you describe your requirement? (e.g. quantity, size, or scope)", key: 'requirement', freeText: true, optionsByPrev: {
            'Invitation Cards': [
              { label: '💍 Wedding Cards', value: 'Wedding Cards' },
              { label: '🏠 Housewarming Ceremony', value: 'Housewarming Ceremony' },
              { label: '🧵 Thread Ceremony', value: 'Thread Ceremony' },
              { label: '👶 Naming Ceremony', value: 'Naming Ceremony' },
              { label: '🎂 Birthday Invites', value: 'Birthday Invites' },
              { label: '🍼 Baby Shower', value: 'Baby Shower' },
              { label: '🥻 Half Saree Ceremony', value: 'Half Saree Ceremony' },
              { label: '👔 Dhoti Ceremony', value: 'Dhoti Ceremony' }
            ]
          }, placeholder: 'e.g. 5 truckloads, for a 2BHK house, 500 guests...' },
          { ask: "Where do you need this delivered? (We deliver across Prakasam District)", key: 'location', freeText: true, options: [{ label: 'Ongole', value: 'Ongole' }, { label: 'Prakasam District', value: 'Prakasam District' }, { label: 'Other', value: 'Other' }], placeholder: 'e.g. Ongole, Vijayawada, Guntur' },
          { ask: "When do you need this by?", key: 'timeline', options: [{ label: 'Immediately', value: 'Immediately' }, { label: 'Within a week', value: 'Within a week' }, { label: 'Next month', value: 'Next month' }, { label: 'Just inquiring', value: 'Just inquiring' }] }
        ],
        summary: "Here are the details for your supply requirement:",
        serviceCategory: 'supplies',
        serviceId: 'supplies'
      },
      'pujari': {
        greeting: "Namaskaram, {name}! 🙏 We are here to assist you with finding the right Pujari for your spiritual and religious needs.",
        questions: [
          { ask: "What kind of Puja or ritual are you looking for?", key: 'type', options: [{ label: '👥 Life Milestones', value: 'Life Milestones' }, { label: '🏠 Property & New Beginnings', value: 'Property & New Beginnings' }, { label: '🔥 Vedic Rituals & Pujas', value: 'Vedic Rituals & Pujas' }, { label: '📜 Ancestral Rites', value: 'Ancestral Rites' }] },
          { ask: "Do you have a specific date in mind for the ritual?", key: 'date', freeText: true, placeholder: 'e.g. Next Monday, 15th August' },
          { ask: "Where will the ritual take place?", key: 'location', freeText: true, placeholder: 'e.g. Ongole, Home / Temple' }
        ],
        summary: "Here is a summary of your Pujari requirement:",
        serviceCategory: 'pujari',
        serviceId: 'pujari-life-milestones'
      },
      'property': {
        greeting: "Happy to help, {name}! 🏠 Whether you want to buy, sell or rent in Prakasam District, we check every paper before you pay — and you can do it all even if you live far away. A few quick questions:",
        questions: [
          { ask: "What would you like to do?", key: 'intent', options: [{ label: '🏠 Buy', value: 'Buy' }, { label: '💰 Sell', value: 'Sell' }, { label: '🔑 Rent / Lease', value: 'Rent / Lease' }, { label: '📄 Paperwork only', value: 'Paperwork' }] },
          { ask: "What kind of property?", key: 'propertyType', options: [{ label: '📐 Plot / House site', value: 'Plot / House site' }, { label: '🏠 House / Villa', value: 'House / Villa' }, { label: '🏢 Flat', value: 'Flat / Apartment' }, { label: '🌾 Agricultural land', value: 'Agricultural land' }, { label: '🏪 Commercial', value: 'Commercial' }] },
          { ask: "Which area? (Or type a town or village)", key: 'location', freeText: true, options: [{ label: 'Ongole', value: 'Ongole' }, { label: 'Kandukur', value: 'Kandukur' }, { label: 'Addanki', value: 'Addanki' }, { label: 'Markapur', value: 'Markapur' }, { label: 'Anywhere — help me decide', value: 'Help me decide' }], placeholder: 'e.g. Ongole, Chimakurthy, Singarayakonda...' },
          { ask: "Where do you live now? (We can do everything on video and with a Power of Attorney if you can't come.)", key: 'livingIn', options: [{ label: '📍 In Prakasam', value: 'In Prakasam District' }, { label: '🇮🇳 Elsewhere in India', value: 'Elsewhere in India' }, { label: '✈️ Abroad (NRI)', value: 'Abroad (NRI / OCI)' }] },
          { ask: "When do you want to do this?", key: 'timeline', options: [{ label: '⚡ Within a month', value: 'Within a month' }, { label: '📅 1–3 months', value: '1–3 months' }, { label: '🔍 Just exploring', value: 'Just exploring' }] }
        ],
        summary: "Here is a summary of your property request:",
        serviceCategory: 'real-estate',
        serviceId: 'property'
      },
      'healthcare': {
        greeting: "Of course, {name}. 🏥 iN Empower is here to support you in every aspect of your healthcare journey. Let me gather a few details to assist you better.",
        questions: [
          { ask: "Which healthcare service can we assist you with?", key: 'healthcareType', options: [{ label: '🩺 Medical Advising', value: 'Medical Advising' }, { label: '🚑 Patient Logistics', value: 'Patient Logistics' }, { label: '🛏️ Patient Hospitality', value: 'Patient Hospitality' }, { label: '⚕️ Physiotherapy', value: 'Physiotherapy' }, { label: '❓ Other', value: 'Other' }] },
          { ask: "Could you briefly describe the medical issue or requirement?", key: 'issue', freeText: true, placeholder: 'e.g. bone/joint pain, ambulance needed, post-surgery care...' },
          { ask: "Who requires this assistance?", key: 'patient', options: [{ label: '👤 Myself', value: 'Myself' }, { label: '👨‍👩‍👧 Family Member', value: 'Family Member' }, { label: '🤝 Friend / Relative', value: 'Friend or Relative' }] },
          { ask: "Where are you currently located or looking for care?", key: 'location', freeText: true, options: [{ label: 'Ongole', value: 'Ongole' }, { label: 'Chirala', value: 'Chirala' }, { label: 'Markapur', value: 'Markapur' }, { label: 'Other', value: 'Other' }], placeholder: 'e.g. Ongole, Chirala, Markapur...' }
        ],
        summary: "Here are the details for your healthcare requirement:",
        serviceCategory: 'healthcare',
        serviceId: 'medical-advising'
      },
      'police-services': {
        greeting: "Hello, {name}. At iN EMPOWER, we handle all our services strictly within the legal framework. It looks like you require official Police or Cyber Crime assistance. Let me guide you to the right government authority.",
        questions: [
          { 
            ask: "What kind of legal or police assistance do you need?", 
            key: 'issueType', 
            options: [
              { label: '💻 Report Cyber Crime / Online Fraud', value: 'Cyber Crime' }, 
              { label: '📝 File e-FIR / Police Complaint', value: 'Police Complaint' }, 
              { label: '🚨 Emergency Assistance', value: 'Emergency' }, 
              { label: '🔍 Missing Person / Stolen Property', value: 'Missing or Stolen' }
            ] 
          },
          {
            askByPrevKey: 'issueType',
            askByPrev: {
              'Cyber Crime': "For online fraud or cyber crimes, you must immediately report to the National Cyber Crime Portal or call 1930.",
              'Police Complaint': "You can file an e-FIR or raise a petition via the AP Police Seva portal.",
              'Emergency': "If you are in immediate danger, please dial 112 or 100 immediately. The Disha App is also highly recommended for women's safety.",
              'Missing or Stolen': "For missing persons or stolen vehicles/property, you can check or report via the AP Police portal.",
              'default': "Would you like the official government links for this?"
            },
            key: 'action',
            options: [
              { label: '✅ Show me the official links', value: 'Show Links' },
              { label: '🔙 Go back to main menu', value: 'Main Menu' }
            ]
          }
        ],
        summary: "Important Information regarding Official Police Services:\n\n" +
         "• **Cyber Crime (Online Fraud):** Visit [cybercrime.gov.in](https://cybercrime.gov.in) or dial **1930**.\n" +
         "• **AP Police Services (e-FIR, Missing, Stolen):** Visit [appolice.gov.in](https://appolice.gov.in) or use the **AP Police Seva** App.\n" +
         "• **Emergency:** Dial **112** or **100**.\n\n" +
         "iN EMPOWER is committed to legal and safe practices. We do not provide private investigation or bypass legal procedures.",
        serviceCategory: 'legal',
        serviceId: 'police-guidance'
      },
      'court-services': {
        greeting: "Hello, {name}. Dealing with legal matters requires precision and care. Let me understand your situation better so our legal team can assist you effectively.",
        questions: [
          { 
            ask: "What type of legal assistance do you require?", 
            key: 'legalNeed', 
            options: [
              { label: '⚖️ Court Case Follow-Up', value: 'Case Follow-up' }, 
              { label: '👨‍⚖️ Lawyer / Advocate', value: 'Find a Lawyer' }, 
              { label: '📄 Document Vetting', value: 'Document Vetting' }, 
              { label: '🤔 Legal Advice', value: 'General Advice' }
            ] 
          },
          {
            ask: "What is the nature of the matter?",
            key: 'caseType',
            options: [
              { label: 'Civil Dispute', value: 'Civil' },
              { label: 'Criminal Case', value: 'Criminal' },
              { label: 'Family / Divorce', value: 'Family' },
              { label: 'Property / Real Estate', value: 'Property' },
              { label: 'Corporate / Business', value: 'Corporate' },
              { label: 'Other', value: 'Other' }
            ]
          },
          {
            ask: "What is the current status?",
            key: 'caseStatus',
            options: [
              { label: 'Ongoing in Court', value: 'Ongoing' },
              { label: 'Looking to File', value: 'Looking to file' },
              { label: 'Just Consultation', value: 'Consultation only' }
            ]
          },
          {
            ask: "Could you briefly describe the issue? (Optional)",
            key: 'description',
            freeText: true,
            placeholder: 'e.g., Property dispute in Ongole, need lawyer...'
          }
        ],
        summary: "Thank you for the details. Here is a summary of your legal requirement:",
        serviceCategory: 'court',
        serviceId: 'legal-case-follow-up'
      }
    },

    services: {
      "college-admissions": {
        "title": "కళాశాల ప్రవేశాలు",
        "subtitle": "ఉత్తమ కళాశాలల్లో ప్రవేశాల కోసం సహాయం పొందండి"
      },
      "home-tuitions": {
        "title": "హోమ్ ట్యూషన్స్",
        "subtitle": "అన్ని సబ్జెక్టుల కోసం నిపుణులైన హోమ్ ట్యూటర్లు"
      },
      "birth-certificate": {
        "title": "జనన ధృవీకరణ పత్రం",
        "subtitle": "నమోదు, ఆలస్యమైన నమోదు & పేరు చేర్చడం"
      },
      "marriage-certificate": {
        "title": "వివాహ ధృవీకరణ పత్రం",
        "subtitle": "హిందూ వివాహ చట్టం / ప్రత్యేక వివాహ చట్టం"
      },
      "income-certificate": {
        "title": "ఆదాయ ధృవీకరణ పత్రం",
        "subtitle": "వివిధ ప్రయోజనాల కోసం అధికారిక ఆదాయ రుజువు"
      },
      "caste-community-certificate": {
        "title": "కుల ధృవీకరణ పత్రం",
        "subtitle": "SC / ST / OBC / EWS సర్టిఫికేషన్"
      },
      "nativity-residence-certificate": {
        "title": "నివాస ధృవీకరణ పత్రం (Nativity)",
        "subtitle": "నివాస ధృవీకరణ మరియు నిరంతర నివాస రుజువు"
      },
      "passport-application": {
        "title": "పాస్‌పోర్ట్ దరఖాస్తు",
        "subtitle": "కొత్త పాస్‌పోర్ట్ & పునరుద్ధరణ (Renewal)"
      },
      "family-member-survivorship-certificate": {
        "title": "కుటుంబ సభ్యుల / వారసత్వ ధృవీకరణ పత్రం",
        "subtitle": "పెన్షన్లు, బీమా & ఆస్తి బదిలీ కోసం"
      },
      "pahani-adangal": {
        "title": "పహాణీ / అడంగల్",
        "subtitle": "ఆస్తి యాజమాన్యం & సాగు రికార్డులు"
      },
      "pattadar-passbook": {
        "title": "పట్టాదార్ పాస్‌బుక్",
        "subtitle": "ఆస్తి యాజమాన్యం కోసం మ్యుటేషన్ / టైటిల్ ట్రాన్స్‌ఫర్"
      },
      "land-possession-certificate": {
        "title": "భూమి స్వాధీన ధృవీకరణ పత్రం",
        "subtitle": "రుణాలు & సబ్సిడీల కోసం భూమి భౌతిక స్వాధీనం రుజువు"
      },
      "ews-obc-certificates": {
        "title": "EWS / OBC ధృవీకరణ పత్రాలు",
        "subtitle": "విద్య & ఉపాధి కోటాల కోసం"
      },
      "income-asset-certificate": {
        "title": "ఆదాయం & ఆస్తి ధృవీకరణ పత్రం",
        "subtitle": "ఆర్థిక స్థితికి సంబంధించిన రుజువు"
      },
      "vehicle-registration-rc": {
        "title": "వాహన రిజిస్ట్రేషన్ (RC)",
        "subtitle": "యాజమాన్య బదిలీ & HP తొలగింపు"
      },
      "permits-fitness": {
        "title": "పర్మిట్లు & ఫిట్‌నెస్",
        "subtitle": "వాణిజ్య పర్మిట్లు, ఫిట్‌నెస్ పరీక్షలు & మార్పులు"
      },
      "duplicate-rc-smart-card": {
        "title": "నకిలీ RC స్మార్ట్ కార్డ్ (Duplicate RC)",
        "subtitle": "పోయిన లేదా దెబ్బతిన్న RC కోసం"
      },
      "road-tax-green-tax": {
        "title": "రోడ్ ట్యాక్స్ & గ్రీన్ ట్యాక్స్",
        "subtitle": "వాహనాలకు త్రైమాసిక, జీవితకాల & గ్రీన్ ట్యాక్స్"
      },
      "property-tax": {
        "title": "ఆస్తి పన్ను (Property Tax)",
        "subtitle": "కొత్త అంచనా & పేరు మార్పిడి"
      },
      "trade-license": {
        "title": "ట్రేడ్ లైసెన్స్",
        "subtitle": "వాణిజ్య సంస్థల కోసం కొత్త రిజిస్ట్రేషన్ & పునరుద్ధరణ"
      },
      "building-approvals": {
        "title": "భవన అనుమతులు (Building Approvals)",
        "subtitle": "లేఅవుట్ ప్లాన్‌లు, పర్మిట్లు & టౌన్ ప్లానింగ్ సమర్పణలు"
      },
      "utility-connections": {
        "title": "యుటిలిటీ కనెక్షన్లు",
        "subtitle": "ఆస్తుల కోసం నీరు & డ్రైనేజీ కనెక్షన్లు"
      },
      "vacant-land-tax-vlt": {
        "title": "ఖాళీ స్థలం పన్ను (VLT)",
        "subtitle": "భవనాలు లేని ఓపెన్ ప్లాట్ల అంచనా"
      },
      "society-ngo-registration": {
        "title": "సొసైటీ / NGO రిజిస్ట్రేషన్",
        "subtitle": "సంస్థల చట్టపరమైన సంస్థాపన"
      },
      "arms-license": {
        "title": "ఆయుధ లైసెన్స్ (Arms Licence)",
        "subtitle": "ప్రాథమిక దరఖాస్తు & పునరుద్ధరణ"
      },
      "land-nocs": {
        "title": "భూమి NOCలు",
        "subtitle": "భూ వినియోగం & అభివృద్ధికి No Objection Certificates"
      },
      "land-acquisition-appeals": {
        "title": "భూసేకరణ అప్పీళ్లు",
        "subtitle": "సేకరించిన భూమికి సరైన పరిహారం"
      },
      "electricity-category": {
        "title": "ఎలక్ట్రిసిటీ సేవలు",
        "subtitle": "ఇంటి మరియు వాణిజ్య విద్యుత్ పనులు"
      },
      "electricity-switches-sockets": {
        "title": "స్విచ్‌లు, సాకెట్లు & స్మార్ట్ ఆటోమేషన్",
        "subtitle": "వదులుగా ఉన్న కనెక్షన్లు, కాలిపోయిన సాకెట్లు రిపేర్"
      },
      "electricity-fans-ventilation": {
        "title": "ఫ్యాన్లు & వెంటిలేషన్ సేవలు",
        "subtitle": "సీలింగ్ & ఎగ్జాస్ట్ ఫ్యాన్లు రిపేర్, కొత్త ఫిట్టింగ్"
      },
      "electricity-lighting": {
        "title": "లైటింగ్ & ఫిక్చర్స్",
        "subtitle": "సాధారణ ఇండోర్ లైటింగ్, డెకరేటివ్ ఈవెంట్ సెటప్"
      },
      "electricity-distribution-backup": {
        "title": "డిస్ట్రిబ్యూషన్ బోర్డులు & పవర్ బ్యాకప్",
        "subtitle": "భద్రతా తనిఖీలు, పవర్ బ్యాకప్ సెటప్"
      },
      "electricity-wiring": {
        "title": "ఇంటర్నల్ & ఎక్స్టర్నల్ హౌస్ వైరింగ్",
        "subtitle": "సర్క్యూట్ అప్‌డేట్‌లు మరియు వైరింగ్ రిపేర్"
      },
      "ac-jet-cleaning": {
        "title": "జెట్ క్లీనింగ్ & సర్వీసింగ్",
        "subtitle": "డీప్ ఫోమ్ వాష్ మరియు డ్రైనేజీ ఫ్లష్"
      },
      "ac-gas-leak-refilling": {
        "title": "గ్యాస్ లీక్ & రీఫిల్లింగ్",
        "subtitle": "లీక్ డిటెక్షన్ మరియు కంప్లీట్ గ్యాస్ ఛార్జింగ్"
      },
      "ac-repair-components": {
        "title": "రిపేర్ & విడిభాగాలు",
        "subtitle": "PCB డయాగ్నోస్టిక్స్ మరియు హార్డ్‌వేర్ మార్పు"
      },
      "ac-installation": {
        "title": "ఇన్‌స్టాలేషన్ & తొలగింపు",
        "subtitle": "కొత్త సెటప్, మౌంటింగ్ మరియు సురక్షిత తరలింపు"
      },
      "sole-proprietorship": {
        "title": "సోల్ ప్రొప్రైటర్‌షిప్",
        "subtitle": "పన్ను రిజిస్ట్రేషన్‌లతో ఒకే యజమాని వ్యాపారం"
      },
      "partnership-firm": {
        "title": "పార్టనర్‌షిప్ సంస్థ",
        "subtitle": "బహుళ-భాగస్వాముల వ్యాపారం (2–20 భాగస్వాములు)"
      },
      "one-person-company-opc": {
        "title": "వన్ పర్సన్ కంపెనీ (OPC)",
        "subtitle": "ఒకే యజమాని లిమిటెడ్ లయబిలిటీ కంపెనీ"
      },
      "limited-liability-partnership-llp": {
        "title": "LLP (Limited Liability Partnership)",
        "subtitle": "సౌకర్యవంతమైన భాగస్వామి పాత్రలతో ప్రత్యేక చట్టపరమైన సంస్థ"
      },
      "private-limited-company": {
        "title": "ప్రైవేట్ లిమిటెడ్ కంపెనీ",
        "subtitle": "పెట్టుబడి కోసం అత్యంత సాధారణ స్టార్టప్ నిర్మాణం"
      },
      "property-registration-sale-deed": {
        "title": "ఆస్తి రిజిస్ట్రేషన్ (సేల్ డీడ్)",
        "subtitle": "అత్యంత కీలకమైన ఆస్తి బదిలీ సేవ"
      },
      "land-survey-records-fmb-adangal": {
        "title": "భూమి సర్వే & రికార్డులు (FMB/Adangal)",
        "subtitle": "సరిహద్దు ధృవీకరణ & చట్టపరమైన రికార్డ్ సారం"
      },
      "land-mutation-patta-transfer": {
        "title": "భూమి మ్యుటేషన్ (పట్టా బదిలీ)",
        "subtitle": "కొనుగోలు లేదా వారసత్వం తర్వాత రెవెన్యూ రికార్డుల నవీకరణ"
      },
      "legal-case-follow-up": {
        "title": "లీగల్ కేసు ఫాలో-అప్",
        "subtitle": "మీ కోర్టు కేసును గమనిస్తూ మీకు సమాచారం ఇస్తాము"
      },
      "lawyer-suggestion-vetting": {
        "title": "లాయర్ సూచన & తనిఖీ",
        "subtitle": "నిర్ధారించబడిన స్థానిక న్యాయవాదుల నెట్‌వర్క్"
      },
      "medical-advising": {
        "title": "వైద్య సలహాలు (Medical Advising)",
        "subtitle": "ప్రకాశం జిల్లాలో చికిత్సలు & నిపుణులపై మార్గదర్శకత్వం"
      },
      "physiotherapy": {
        "title": "ఫిజియోథెరపీ (Physiotherapy)",
        "subtitle": "రికవరీ & పునరావాసం కోసం నిపుణులైన ఫిజియోథెరపీ సేవలు"
      },
      "patient-logistics": {
        "title": "రోగి లాజిస్టిక్స్ (Patient Logistics)",
        "subtitle": "రవాణా మరియు మొబిలిటీ పరిష్కారాలు"
      },
      "patient-hospitality": {
        "title": "రోగి హాస్పిటాలిటీ (Patient Hospitality)",
        "subtitle": "రోగులు & సహాయకుల కోసం వసతి మరియు సంరక్షణ"
      },
      "verified-driver-services": {
        "title": "ధృవీకరించబడిన డ్రైవర్ సేవలు",
        "subtitle": "అవసరం మేరకు, రోజువారీ & సబ్‌స్క్రిప్షన్ డ్రైవర్ సేవలు"
      },
      "professional-chef-services": {
        "title": "ప్రొఫెషనల్ చెఫ్ సేవలు",
        "subtitle": "ఈవెంట్‌లు, రోజువారీ భోజనం & సబ్‌స్క్రిప్షన్‌ల కోసం చెఫ్‌లు"
      },
      "professional-makeup-artist": {
        "title": "ప్రొఫెషనల్ మేకప్ ఆర్టిస్ట్",
        "subtitle": "వివాహాలు & ఈవెంట్‌ల కోసం ధృవీకరించబడిన మేకప్ ఆర్టిస్టులు"
      },
      "death-certificate": {
        "title": "మరణ ధృవీకరణ పత్రం",
        "subtitle": "ప్రామాణిక & ఆలస్యమైన నమోదు"
      },
      "granite": {
        "title": "గ్రానైట్ (Granite)",
        "subtitle": "ప్రీమియం పాలిష్ చేసిన గ్రానైట్ మరియు సహజ రాయి"
      },
      "tiles": {
        "title": "టైల్స్ (Tiles)",
        "subtitle": "సిరామిక్, విట్రిఫైడ్ మరియు అలంకార టైల్స్"
      },
      "sand": {
        "title": "ఇసుక (Sand)",
        "subtitle": "విశ్వసనీయ మరియు చట్టబద్ధమైన నిర్మాణ ఇసుక"
      },
      "transport": {
        "title": "రవాణా & లాజిస్టిక్స్",
        "subtitle": "వస్తువుల కోసం భారీ-డ్యూటీ రవాణా"
      },
      "interior-design": {
        "title": "ఇంటీరియర్ డిజైన్",
        "subtitle": "నిపుణులైన ఇంటీరియర్ డిజైనర్లు మరియు డెకరేటర్లు"
      },
      "architecture": {
        "title": "ఆర్కిటెక్చర్",
        "subtitle": "ప్రొఫెషనల్ ఆర్కిటెక్ట్‌లు మరియు ప్లానర్లు"
      },
      "furniture": {
        "title": "ఫర్నిచర్ (Furniture)",
        "subtitle": "కస్టమ్ మరియు రెడీమేడ్ ప్రీమియం ఫర్నిచర్"
      },
      "events": {
        "title": "ఈవెంట్స్ (Events)",
        "subtitle": "ఈవెంట్ మేనేజ్‌మెంట్ మరియు డెకరేషన్ సామాగ్రి"
      },
      "catering": {
        "title": "క్యాటరింగ్ (Catering)",
        "subtitle": "ప్రొఫెషనల్ క్యాటరింగ్ సేవలు"
      },
      "cold-pressed-oils": {
        "title": "కోల్డ్ ప్రెస్డ్ ఆయిల్స్",
        "subtitle": "స్వచ్ఛమైన కోల్డ్ ప్రెస్డ్ నూనెలు"
      },
      "cleaning": {
        "title": "క్లీనింగ్ సేవలు",
        "subtitle": "ప్రొఫెషనల్ డీప్ క్లీనింగ్ మరియు శానిటేషన్"
      }
    },

    categoryLabels: {
      education: 'Education', identity: 'Identity & Records', mro: 'MRO Services',
      rto: 'RTO Services', municipal: 'Municipal Services', collector: 'Collector Office',
      startup: 'Startup Registration', property: 'Property Services', court: 'Court Services',
      healthcare: 'Hospitals & Healthcare', drivers: 'Professional Services', 'real-estate': 'Property & Real Estate',
      photography: 'Photography Services', architecture: 'Architecture', interior: 'Interior Design', loans: 'Bank Loan Support', exim: 'EXIM (Export & Import)',
      pujari: 'Pujari Services', electricity: 'Electrician & Home Repairs', painting: 'Painting & Waterproofing', 'pest-control': 'Pest Control', 'ac-services': 'AC Services', nri: 'NRI & Families Abroad', logistics: 'Logistics, Packers & Movers',
    },


    advisoryResponses: {
      about: {
        keywords: ['what is inempower', 'what is in empower', 'about inempower', 'about in empower', 'tell me about', 'what do you do', 'who are you', 'about your company', 'about your platform', 'what is this app', 'what is this'],
        response: "Great question, {name}! 🇮🇳\n\n**iN Empower** is Prakasam District's trusted platform connecting you with **Verified Local Buddies** — professionals in your own community who help with:\n\n• 🏛️ Government Documentation (Birth, Marriage, Income, Caste Certificates)\n• 🚗 RTO Services (Driving Licence, RC, Road Tax)\n• 🏠 Property Services (Sale Deed, Survey, Mutation)\n• 🚀 Startup Registration (Sole Proprietorship to Pvt Ltd)\n• ⚖️ Court & Legal Services\n• 🏥 Healthcare (Medical Advising, Patient Logistics)\n• 📦 Supplies (Granite, Sand, Tiles, Furniture, Catering & more)\n• 🚚 Packers & Movers (house shifting, bike & car transport)\n• ✈️ NRI & Families Abroad (send items abroad, receive parcels)\n\nEvery Local Buddy undergoes a **3-tier verification** (Identity → Skill → Background Check), and you always get a **clear quote first** — and if we can't get your work done, we pay you back! 🛡️\n\nWe serve **Prakasam District, Andhra Pradesh** — Ongole, Chirala, Markapur, Kandukur and nearby mandals. 🌟",
        followUp: [{ label: '💬 Explore Services', value: 'Services' }, { label: '💳 When Do I Pay?', value: 'How does payment work' }, { label: '❓ More Questions', value: 'help' }]
      },
      escrow: {
        keywords: ['escrow', 'refund', 'money back', 'pay back', 'is my money safe', 'money safe', 'payment safe', 'payment protection', 'how does escrow work', 'how does payment work', 'when do i pay', 'payment', 'secure payment', 'will i get refund', 'refund', 'fraud protection'],
        response: "Good question, {name}! Here's how payment works with iN Empower:\n\n**Step 1** 💬 You tell us what you need\n**Step 2** 📝 Our team gives you a **clear quote** before any work starts — no hidden charges\n**Step 3** 💰 You pay an **advance to iN Empower** to begin, and the balance as agreed in your quote\n**Step 4** ✅ Your verified Local Buddy completes the work\n\n**Work Done or Money Back** — if we can't get the work done, we pay you back for the part that wasn't done. If you cancel before work starts, we return your advance, minus anything already spent for you (like government fees or materials). 🛡️",
        followUp: [{ label: '🚀 Get Started', value: 'Services' }, { label: '👤 Who are Local Buddies?', value: 'Who is a local buddy' }]
      },
      localBuddy: {
        keywords: ['local buddy', 'who is a buddy', 'what is a buddy', 'verified professional', 'how are buddies verified', 'buddy verification', 'can i trust', 'trust', 'is it safe', 'safe', 'reliable', 'genuine'],
        response: "Great concern, {name}! Trust is at the heart of everything we do. 💛\n\nA **Local Buddy** is a verified professional from your own community. Every Buddy goes through our rigorous **3-Tier Verification**:\n\n🟢 **Tier 1 — Identity Verification**: Aadhaar, PAN, and government ID check\n🟡 **Tier 2 — Skill Assessment**: Domain-specific tests to prove expertise\n🟠 **Tier 3 — Background Check**: Criminal record check & reference verification\n\nPlus, you get a **clear quote first**, and if we can't get your work done, we pay you back — **Work Done or Money Back**. 🛡️\n\nWe're starting in **Ongole** and growing across Prakasam district — every Buddy is personally met by our team!",
        followUp: [{ label: '💬 Start a Request', value: 'Services' }, { label: '💳 When Do I Pay?', value: 'How does payment work' }]
      },
      coverage: {
        keywords: ['which area', 'which city', 'where do you operate', 'coverage', 'location', 'which district', 'ongole', 'chirala', 'markapur', 'prakasam', 'andhra pradesh', 'telangana', 'ap', 'hyderabad'],
        response: "We're glad you asked, {name}! 📍\n\n**Currently serving:**\n• 🏠 **Prakasam District, AP** — Ongole, Kandukur, Addanki, Chimakurthy, Darsi and the surrounding mandals\n• 🤝 Nearby towns such as Chirala and Markapur too — just ask\n• 🏘️ Towns, mandals and villages across the district\n\nOutside Prakasam District? Tell us what you need and where — our team will tell you honestly if we can help. 🙏",
        followUp: [{ label: '💬 What I Need', value: 'Services' }, { label: '📦 Supplies', value: 'Supplies' }]
      },
      pricing: {
        keywords: ['price', 'pricing', 'cost', 'how much', 'charges', 'fees', 'expensive', 'cheap', 'affordable', 'rate', 'rates', 'budget'],
        response: "Great question, {name}! 💰\n\n**Our Pricing Philosophy:**\n• ✅ **Transparent** — No hidden charges, ever\n• ✅ **Fair Market Rate** — Competitive with local agents, but with verified Local Buddies\n• ✅ **Service-Specific** — Each service has its own pricing based on complexity\n• ✅ **Work Done or Money Back** — if we can't get the work done, we pay you back for that part\n\n**How to get a quote:**\nSimply tell me what service you need, and after gathering your details through our guided flow, our team will provide a transparent quote before you commit. No obligation! 🙏\n\nWant to get started?",
        followUp: [{ label: '💬 Explore Services', value: 'Services' }, { label: '💳 When Do I Pay?', value: 'How does payment work' }]
      },
      getStarted: {
        keywords: ['how to start', 'how do i start', 'get started', 'how to use', 'how does it work', 'process', 'steps', 'first time', 'new user', 'beginner'],
        response: "Welcome aboard, {name}! Getting started is super simple: 🚀\n\n**Step 1** 💬 Tell me what you need (right here in chat!)\n**Step 2** 📝 I'll guide you through a few questions\n**Step 3** 👤 We match you with the best Local Buddy\n**Step 4** 💬 Our team shares a clear quote\n**Step 5** ✅ Pay the advance, we get it done — then rate us!\n\nYou can start right now by choosing a category below, or just type what you need in plain language. I understand! 😊",
        followUp: [{ label: '🏛️ Services', value: 'Services' }, { label: '📦 Supplies', value: 'Supplies' }, { label: '🏠 Property', value: 'Property' }, { label: '🎓 YouthHub', value: 'youth hub' }]
      },
      partTimeJobs: {
        keywords: ['part time', 'part-time', 'youth job', 'youth jobs', 'job for students', 'earn money', 'side income', 'gig', 'freelance'],
        response: "Great interest, {name}! 💼\n\n**Youth & Part-Time Jobs** is one of iN Empower's exciting features!\n\n• 🎓 Perfect for **students, graduates, and young professionals**\n• 💰 Earn while you learn — flexible hours\n• 🔍 Browse available gigs in your area\n• 📝 Post your skills and let employers find you\n\nWhether you're looking for weekend work, freelance gigs, or entry-level opportunities — we've got you covered! 🌟",
        followUp: [{ label: '👀 Browse Jobs', value: 'youth hub jobs' }, { label: '💬 Other Services', value: 'Services' }]
      },
      workshops: {
        keywords: ['workshop', 'workshops', 'training', 'life skills', 'financial literacy', 'learn', 'skill development', 'upskill'],
        response: "Wonderful curiosity, {name}! 🌟\n\n**iN Empower Workshops** are designed to empower you with real-world skills:\n\n• 💰 **Financial Literacy** — Budgeting, saving, and smart investing\n• 💻 **Digital Skills** — Online safety, digital payments, e-governance\n• 🧠 **Life Skills** — Communication, problem-solving, and career planning\n• 🏢 **Entrepreneurship** — How to start and grow a business\n\nWorkshops are conducted by verified experts and are available both online and in-person in Prakasam District. 🎓",
        followUp: [{ label: '📚 View Workshops', value: 'youth hub workshops' }, { label: '💬 Other Services', value: 'Services' }]
      },
      property: {
        keywords: ['real estate', 'buy property', 'buy land', 'buy a plot', 'buy plot', 'house for sale', 'plot for sale', 'flat for sale', 'sell property', 'sell my land', 'sell land', 'house for rent', 'rent a house', 'property dealer', 'nri property', 'title check', 'invest in property', 'property investment', 'land investment'],
        response: "Good question, {name}! 🏠\n\n**Property & Real Estate** with iN Empower in Prakasam District:\n\n• 🏠 **Buy** — we find options and check the papers before you pay any advance\n• 💰 **Sell** — fair price check, checked buyers, clean registration\n• 🔑 **Rent & Lease** — proper agreements and tenant checks\n• 📄 **Paperwork** — EC, mutation, deeds, Power of Attorney\n\nLiving far away or abroad? We do video site visits, a written title check report and progress updates at every step. Note: NRIs can buy houses, flats and plots, but not agricultural land.\n\nOur charges depend on the work — ask us for a quote.",
        followUp: [{ label: '🏠 Open Property', value: 'property' }, { label: '💬 Other Services', value: 'Services' }]
      },
      photography: {
        keywords: ['photography', 'photographer', 'photo shoot', 'wedding photography', 'corporate photography', 'advertising photography', 'candid photography'],
        response: "Photography captures your best moments! 📸\n\n**iN Empower Photography** provides verified professional photographers for:\n\n• 💍 **Wedding & Candid**\n• 🏢 **Corporate & Events**\n• 📢 **Advertising & Product**\n• 🏠 **Real Estate & Drone**\n\nEvery photographer is background-verified — and if we can't get your shoot done, we pay you back.\n\nWould you like to book a photographer?",
        followUp: [{ label: '📸 Find a Photographer', value: 'photography' }, { label: '💬 Other Services', value: 'Services' }]
      },
      homeTuitions: {
        keywords: ['home tuition info', 'tuition details', 'tutor info', 'about tuitions', 'tuition pricing', 'tuition fees', 'good tutor', 'best tutor', 'tuition near me'],
        response: "Education is close to our heart, {name}! 🎓\n\n**iN Empower Home Tuitions** provides verified tutors for:\n\n• 🎒 **Primary (1-5)** — Maths, Science, English, Hindi\n• 🏫 **Secondary (6-10)** — Maths, Physical Science, Biology, Social, English\n• 📚 **Intermediate (11-12)** — MPC, BiPC, CEC, MEC subjects\n• 🎓 **Graduation** — Engineering, Degree, B.Tech subjects\n\n**Why choose our tutors?**\n✅ All tutors are background-verified\n✅ Matched to your child's learning style\n✅ Flexible timing (Morning, Afternoon, Evening, Night)\n✅ Available 2 to 6 days per week\n\nWant me to help you find the perfect tutor? 😊",
        followUp: [{ label: '🎓 Find a Tutor', value: 'home tuition' }, { label: '📚 View Subjects', value: 'home tuitions page' }]
      }
    },

        intents: {
      NEGATIVE: [
        "No worries at all, {name}! 😊 It was wonderful talking to you. Remember, I'm always here whenever you need help — just click the Chat Buddy button anytime!",
        "Absolutely fine, {name}! Thank you for your time. Wishing you a great day ahead! 🌟 I'll be right here if you ever need assistance.",
        "That's perfectly alright! 😊 Take your time, {name}. Whenever you need help — I'm just a click away. Take care!"
      ],
      GREETING: [
        "Hello again, {name}! 😊 How can I help you today? Feel free to describe what you're looking for.",
        "Hey {name}! 👋 What service can I assist you with today?"
      ],
      GRATITUDE: [
        "You're very welcome, {name}! 😊 It's my pleasure to help. Don't hesitate to reach out anytime!",
        "So glad I could help, {name}! 🙏 Feel free to come back anytime!"
      ],
      FAREWELL: [
        "Goodbye, {name}! 👋 Take care and have a wonderful day! We're always here when you need us. 🌟",
        "See you soon, {name}! 😊 iN Empower is always just a click away. Take care!"
      ],
      AFFIRMATIVE: [
        "Great, {name}! 😊 Please tell me what you're looking for — describe your need in a few words.",
        "Perfect! I'm all ears, {name}. What service or help do you need?"
      ],
      CONFUSED: [
        "No worries, {name}! 😊 Please select a category below that best matches what you need, or try describing it differently:"
      ]
    }
  },

  te: {
    selectLanguagePrompt: "iN Empower కు స్వాగతం! దయచేసి మీ భాషను ఎంచుకోండి.",
    askName: "నమస్కారం! నేను మీ iN Empower చాట్ బడ్డీని. 👋 మీ పేరు ఏమిటి?",
    askMobile: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది, {name}! 🌟 దయచేసి మీ మొబైల్ నంబర్ చెప్పగలరా? ఈ నంబర్‌కు కాల్ చేస్తాము, అప్‌డేట్‌లు WhatsApp లో పంపుతాము. (విదేశాల్లో ఉంటే: + మరియు దేశ కోడ్‌తో మొదలుపెట్టండి, ఉదా. +1 415 555 0100.)",
    invalidMobile: "క్షమించండి! ఇది సరైన మొబైల్ నంబర్ లాగా లేదు. 10 అంకెల నంబర్ — లేదా విదేశాల నుంచి + మరియు దేశ కోడ్‌తో టైప్ చేయండి.",
    mobileThanks: "ధన్యవాదాలు! ఈ రోజు నేను మీకు ఎలా సహాయపడగలను? దయచేసి ఒక వర్గాన్ని ఎంచుకోండి లేదా మీకు ఏమి కావాలో టైప్ చేయండి.",
    needMoreInfo: "మీకు సహాయం చేయడానికి నాకు కొంచెం అదనపు సమాచారం కావాలి. మీకు ఏమి కావాలో మరికొన్ని మాటల్లో వివరించగలరా?",
    typeArea: "దయచేసి {town} లోని మీ ప్రాంతాన్ని టైప్ చేయండి:",
    typeSpecificArea: "దయచేసి మీ ఊరు, మండలం లేదా గ్రామం టైప్ చేయండి (ప్రకాశం జిల్లా అంతటా డెలివరీ చేస్తాము):",
    typeSpecificTown: "దయచేసి ప్రకాశం జిల్లాలో మీ నిర్దిష్ట పట్టణం, మండలం లేదా గ్రామాన్ని టైప్ చేయండి:",
    selectSpecificArea: "చాలా సంతోషం! {loc} లో మీకు మెరుగైన సేవ అందించడానికి, దయచేసి మీ నిర్దిష్ట ప్రాంతాన్ని ఎంచుకోండి: 📍",
    submitSuccess: "ధన్యవాదాలు, {name}! మీ అభ్యర్థనను మేము స్వీకరించాము. మా బృందం మిమ్మల్ని {mobile} లో త్వరలో సంప్రదిస్తుంది. శుభ దినం! 🌟",
    viewDashboard: "నా డాష్‌బోర్డ్ చూడండి",

    guidedFlows: {
      'photography': {
        serviceCategory: 'photography',
        serviceId: 'photography-services',
        greeting: "ఫోటోగ్రఫీ జ్ఞాపకాలను బంధించడానికి ఒక గొప్ప మార్గం! 📸 మీకు ఉత్తమ ఫోటోగ్రాఫర్‌ను కనుగొందాం, {name}.",
        summary: "అద్భుతం! మీ ఫోటోగ్రఫీ అవసరాల సారాంశం ఇక్కడ ఉంది:",
        questions: [
          {
            key: 'type',
            ask: "మీకు ఏ రకమైన ఫోటోగ్రఫీ సేవ కావాలి?",
            options: [
              { label: '💍 పెళ్లి', value: 'Wedding Photography' },
              { label: '🏢 కార్పొరేట్', value: 'Corporate Photography' },
              { label: '📢 అడ్వర్టైజింగ్', value: 'Advertising Photography' },
              { label: '🎉 ఈవెంట్', value: 'Event Photography' },
              { label: '🧑 పోర్ట్రెయిట్', value: 'Portrait Photography' },
              { label: '📦 ప్రోడక్ట్', value: 'Product Photography' },
              { label: '🏠 రియల్ ఎస్టేట్', value: 'Real Estate Photography' },
              { label: '❓ ఇతర', value: 'Other' }
            ]
          },
          {
            key: 'location',
            ask: "షూట్ ఎక్కడ జరుగుతుంది?",
            options: [
              { label: '📍 ఒంగోలు', value: 'Ongole' },
              { label: '📍 చీరాల', value: 'Chirala' },
              { label: '📍 మార్కాపురం', value: 'Markapur' },
              { label: '🌍 ఇతర', value: 'Other' }
            ]
          },
          {
            key: 'duration',
            ask: "ఫోటోగ్రాఫర్ మీకు ఎంత సమయం కావాలి?",
            options: [
              { label: '⏳ 1-2 గంటలు', value: '1-2 Hours' },
              { label: '🕒 హాఫ్ డే', value: 'Half Day' },
              { label: '⏱️ ఫుల్ డే', value: 'Full Day' },
              { label: '📅 బహుళ రోజులు', value: 'Multiple Days' }
            ]
          }
        ]
      },
      'home-tuitions': {
        greeting: "అద్భుతం! 🎓 హోమ్ ట్యూషన్స్ — మంచి ఎంపిక, {name}! సరైన ట్యూటర్ ని కనుగొనడంలో నేను మీకు సహాయపడతాను. నాకు కొన్ని వివరాలు కావాలి.",
        questions: [
          { ask: "ఇది ఏ విద్యా స్థాయికి సంబంధించినది?", key: 'level', options: [{ label: '🎒 ప్రాథమిక (1-5)', value: 'Primary (Classes 1-5)' }, { label: '🏫 సెకండరీ (6-10)', value: 'Secondary (Classes 6-10)' }, { label: '📚 ఇంటర్మీడియట్ (11-12)', value: 'Intermediate (11th & 12th)' }, { label: '🎓 గ్రాడ్యుయేషన్ / డిగ్రీ', value: 'Graduation (Degree & B.Tech)' }] },
          {
            ask: "విద్యార్థికి ఏ సబ్జెక్టులో సహాయం కావాలి?", key: 'subject', optionsByPrev: {
              'Primary (Classes 1-5)': [{ label: 'గణితం (Mathematics)', value: 'Mathematics' }, { label: 'సైన్స్', value: 'Science' }, { label: 'ఇంగ్లీష్', value: 'English' }, { label: 'హిందీ / ప్రాంతీయ భాష', value: 'Hindi / Regional Language' }],
              'Secondary (Classes 6-10)': [{ label: 'గణితం (Mathematics)', value: 'Mathematics' }, { label: 'భౌతిక శాస్త్రం (Physical Science)', value: 'Physical Science (Physics, Chemistry)' }, { label: 'జీవశాస్త్రం (Biology)', value: 'Biological Science (Biology)' }, { label: 'సాంఘిక శాస్త్రం (Social Studies)', value: 'Social Studies' }, { label: 'ఇంగ్లీష్', value: 'English' }],
              'Intermediate (11th & 12th)': [{ label: 'గణితం (Mathematics)', value: 'Mathematics (A & B)' }, { label: 'ఫిజిక్స్ (Physics)', value: 'Physics' }, { label: 'కెమిస్ట్రీ (Chemistry)', value: 'Chemistry' }, { label: 'బాటనీ & జువాలజీ (Botany & Zoology)', value: 'Botany & Zoology' }, { label: 'అకౌంట్స్ & కామర్స్ (Accounts & Commerce)', value: 'Accounts & Commerce' }, { label: 'ఎకనామిక్స్ (Economics)', value: 'Economics' }],
              'Graduation (Degree & B.Tech)': [{ label: 'ఇంజనీరింగ్ మ్యాథమెటిక్స్', value: 'Engineering Mathematics' }, { label: 'కంప్యూటర్ సైన్స్', value: 'Computer Science (C, C++, Java, Python)' }, { label: 'ఫైనాన్షియల్ అకౌంటింగ్', value: 'Financial Accounting' }, { label: 'అడ్వాన్స్డ్ ఫిజిక్స్', value: 'Advanced Physics' }, { label: 'అడ్వాన్స్డ్ కెమిస్ట్రీ', value: 'Advanced Chemistry' }, { label: 'బిజినెస్ స్టాటిస్టిక్స్', value: 'Business Statistics' }]
            }
          },
          { ask: "వారానికి ఎన్ని రోజులు ట్యూషన్ కావాలి?", key: 'frequency', options: [{ label: 'వారానికి 2 రోజులు', value: '2 days per week' }, { label: 'వారానికి 3 రోజులు', value: '3 days per week' }, { label: 'వారానికి 5 రోజులు', value: '5 days per week' }, { label: 'ప్రతిరోజూ (6 రోజులు)', value: 'Daily (6 days)' }] },
          { ask: "మీకు అనుకూలమైన సమయం ఏమిటి?", key: 'timing', options: [{ label: '🌅 ఉదయం (6-9 AM)', value: 'Morning (6-9 AM)' }, { label: '☀️ మధ్యాహ్నం (12-3 PM)', value: 'Afternoon (12-3 PM)' }, { label: '🌇 సాయంత్రం (4-7 PM)', value: 'Evening (4-7 PM)' }, { label: '🌙 రాత్రి (7-10 PM)', value: 'Night (7-10 PM)' }] },
          { ask: "మేము మీకు దగ్గరలో ఉన్న ట్యూటర్ ని కనుగొనడానికి దయచేసి మీ ప్రాంతాన్ని తెలియజేయండి.", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, ప్రకాశం జిల్లా' }
        ],
        summary: "మీ హోమ్ ట్యూషన్ అభ్యర్థన సారాంశం:",
        serviceCategory: 'home-tuition',
        serviceId: 'home-tuitions'
      },
      'college-admissions': {
        greeting: "అద్భుతం! 🎓 కళాశాల ప్రవేశాలు — నేను మీకు సహాయం చేస్తాను, {name}!",
        questions: [
          { ask: "మీరు ఏ ప్రోగ్రాం కోసం చూస్తున్నారు?", key: 'program', options: [{ label: '🎓 B.Tech / ఇంజనీరింగ్', value: 'B.Tech / Engineering' }, { label: '💼 MBA / మేనేజ్‌మెంట్', value: 'MBA / Management' }, { label: '💊 ఫార్మసీ', value: 'Pharmacy (B.Pharm / Pharm.D)' }, { label: '🖥️ BCA / MCA', value: 'BCA / MCA' }, { label: '📐 ఇతర డిగ్రీ', value: 'Other Degree Program' }] },
          { ask: "ఏ ప్రవేశ సంవత్సరం?", key: 'year', options: [{ label: '2027-28', value: '2027-28' }, { label: '2028-29', value: '2028-29' }] },
          { ask: "మీ మనసులో ఏదైనా కళాశాల లేదా ప్రదేశం ఉందా?", key: 'preference', freeText: true, placeholder: 'ఉదా. QIS కళాశాల ఒంగోలు, హైదరాబాద్...' }
        ],
        summary: "మీ కళాశాల ప్రవేశాల అభ్యర్థన:",
        serviceCategory: 'education',
        serviceId: 'college-admissions'
      },
      'driving-license': {
        greeting: "తప్పకుండా! 🚗 డ్రైవింగ్ లైసెన్స్ విషయమై నేను మీకు సహాయం చేస్తాను, {name}.",
        questions: [
          { ask: "మీకు దేనిపై సహాయం కావాలి?", key: 'type', options: [{ label: "📝 కొత్త లెర్నర్ లైసెన్స్", value: "New Learner's Licence" }, { label: '🪪 కొత్త శాశ్వత DL', value: 'New Permanent Driving Licence' }, { label: '🔄 DL పునరుద్ధరణ (Renewal)', value: 'Driving Licence Renewal' }, { label: '📍 DL లో చిరునామా మార్పు', value: 'Address Change on DL' }, { label: '📋 డూప్లికేట్ DL', value: 'Duplicate / Lost DL' }] },
          { ask: "ఏ రకమైన వాహనం?", key: 'vehicleType', options: [{ label: '🛵 టూ వీలర్', value: 'Two Wheeler (MCWG)' }, { label: '🚗 ఫోర్ వీలర్ (LMV)', value: 'Light Motor Vehicle (LMV)' }, { label: '🚛 హెవీ వెహికల్', value: 'Heavy Motor Vehicle (HMV)' }, { label: 'రెండు (2W & 4W)', value: 'Two Wheeler + Four Wheeler' }] },
          { ask: "మీ RTO ఏ నగరం/జిల్లాలో ఉంది?", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, హైదరాబాద్, విజయవాడ...' }
        ],
        summary: "మీ డ్రైవింగ్ లైసెన్స్ అభ్యర్థన:",
        serviceCategory: 'rto',
        serviceId: 'learners-driving-license'
      },
      'birth-certificate': {
        greeting: "తప్పకుండా! 📋 జనన ధృవీకరణ పత్రం (Birth Certificate) — నేను మీకు మార్గనిర్దేశం చేస్తాను, {name}.",
        questions: [
          { ask: "మీకు ఎలాంటి సేవ కావాలి?", key: 'type', options: [{ label: '🆕 కొత్త రిజిస్ట్రేషన్', value: 'New Birth Registration' }, { label: '⏰ ఆలస్యమైన రిజిస్ట్రేషన్', value: 'Delayed Birth Registration' }, { label: '✏️ పేరు చేర్చడం/సవరణ', value: 'Name Inclusion or Correction' }, { label: '📄 డూప్లికేట్ కాపీ', value: 'Duplicate Birth Certificate' }] },
          { ask: "జననం ఎక్కడ జరిగింది?", key: 'location', freeText: true, placeholder: 'ఉదా. ఆసుపత్రి పేరు, నగరం...' }
        ],
        summary: "మీ జనన ధృవీకరణ పత్రం అభ్యర్థన:",
        serviceCategory: 'identity',
        serviceId: 'birth-certificate'
      },
      'property-registration': {
        greeting: "మంచి ఎంపిక! 🏠 ఆస్తి రిజిస్ట్రేషన్ — నేను మీకు సహాయం చేస్తాను, {name}.",
        questions: [
          { ask: "ఏ విధమైన ఆస్తి లావాదేవీ?", key: 'type', options: [{ label: '📝 సేల్ డీడ్ రిజిస్ట్రేషన్', value: 'Sale Deed Registration' }, { label: '🔄 యాజమాన్య మార్పిడి', value: 'Transfer of Ownership' }, { label: '🏗️ కొత్త ఆస్తి కొనుగోలు', value: 'New Property Purchase' }, { label: '📋 గిఫ్ట్ డీడ్', value: 'Gift Deed Registration' }] },
          { ask: "ఆస్తి వ్యవసాయ భూమి లేదా భవనం/ప్లాట్ ఆ?", key: 'propertyType', options: [{ label: '🌾 వ్యవసాయ భూమి', value: 'Agricultural Land' }, { label: '🏠 రెసిడెన్షియల్ ప్లాట్/భవనం', value: 'Residential Plot/Building' }, { label: '🏢 వాణిజ్య ఆస్తి', value: 'Commercial Property' }] },
          { ask: "ప్రకాశం జిల్లాలోని ఏ పట్టణం/గ్రామం మరియు వార్డులో ఆస్తి ఉంది?", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, వార్డు 14...' }
        ],
        summary: "మీ ఆస్తి రిజిస్ట్రేషన్ అభ్యర్థన:",
        serviceCategory: 'property',
        serviceId: 'property-registration-sale-deed'
      },
      'startup': {
        greeting: "అద్భుతం! 🚀 వ్యాపారాన్ని ప్రారంభించడం ఒక పెద్ద అడుగు, నేను మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నాను, {name}! మీ వ్యాపార సలహాదారుగా, దీన్ని పరిపూర్ణంగా ప్లాన్ చేద్దాం.",
        questions: [
          { ask: "మొదట, మీరు ఏ రకమైన వ్యాపార నిర్మాణం కోసం చూస్తున్నారు?", key: 'type', options: [{ label: '👤 సోల్ ప్రొప్రైటర్‌షిప్', value: 'Sole Proprietorship' }, { label: '🤝 భాగస్వామ్య సంస్థ (Partnership)', value: 'Partnership Firm' }, { label: '1️⃣ వన్ పర్సన్ కంపెనీ (OPC)', value: 'One Person Company (OPC)' }, { label: '🏢 LLP', value: 'Limited Liability Partnership (LLP)' }, { label: '🏛️ ప్రైవేట్ లిమిటెడ్ కంపెనీ', value: 'Private Limited Company' }, { label: '❓ ఖచ్చితంగా తెలియదు - గైడ్ చేయండి', value: 'Need Guidance' }] },
          { ask: "మీ వ్యాపారం యొక్క ప్రధాన పరిశ్రమ లేదా స్వభావం ఏమిటి?", key: 'businessNature', freeText: true, placeholder: 'ఉదా. టెక్ స్టార్టప్, రెస్టారెంట్, ఇ-కామర్స్, ఎగుమతి...' },
          { ask: "మా సలహాలను అనుకూలీకరించడానికి, మీరు గతంలో ఏదైనా వ్యాపారాన్ని నిర్వహించారా లేదా స్వంతం చేసుకున్నారా?", key: 'pastExperience', options: [{ label: '🌟 అవును, అనుభవం ఉంది', value: 'Yes' }, { label: '🌱 లేదు, ఇదే నా మొదటి వ్యాపారం', value: 'No' }] },
          { 
            askByPrevKey: 'type',
            askByPrev: {
              'Sole Proprietorship': "సోల్ ప్రొప్రైటర్‌షిప్ త్వరగా ప్రారంభించడానికి అనువైనది. ప్రస్తుతం మీ ప్రధాన లక్ష్యం ఏమిటి?",
              'Partnership Firm': "భాగస్వామ్య సంస్థలకు స్పష్టమైన ఒప్పందాలు అవసరం. రిజిస్ట్రేషన్ చేయడం వెనుక మీ ప్రధాన లక్ష్యం ఏమిటి?",
              'Private Limited Company': "ప్రైవేట్ లిమిటెడ్ కంపెనీలు వ్యాపారాన్ని విస్తరించడానికి గొప్పవి. ప్రస్తుతం మీ ప్రధాన లక్ష్యం ఏమిటి?",
              'One Person Company (OPC)': "OPCలు సోలో వ్యవస్థాపకులకు మంచి రక్షణ ఇస్తాయి. ప్రస్తుతం మీ ప్రధాన లక్ష్యం ఏమిటి?",
              'Limited Liability Partnership (LLP)': "LLPలు గొప్ప సౌలభ్యాన్ని అందిస్తాయి. ప్రస్తుతం మీ ప్రధాన లక్ష్యం ఏమిటి?",
              'Need Guidance': "సమస్య లేదు, మనం కలిసి దీనిని ప్లాన్ చేద్దాం. మీ ప్రధాన లక్ష్యం ఏమిటి?",
              'default': "ప్రస్తుతం రిజిస్ట్రేషన్ చేయడం వెనుక మీ ప్రధాన లక్ష్యం ఏమిటి?"
            },
            key: 'primaryGoal', 
            optionsByPrevKey: 'type',
            optionsByPrev: {
              'Private Limited Company': [
                { label: '💰 ఫండింగ్/పెట్టుబడిదారుల కోసం', value: 'Seeking Funding' }, 
                { label: '🛡️ బ్రాండ్ & ఆస్తుల రక్షణ', value: 'Brand Protection' }, 
                { label: '🏦 కరెంట్ అకౌంట్ తెరవడానికి', value: 'Current Account' }, 
                { label: '🌟 పైన ఉన్నవన్నీ (All of the above)', value: 'All of the above' },
                { label: '🚀 ఇప్పుడే ప్రారంభిస్తున్నాను', value: 'Just getting started' }
              ],
              'Sole Proprietorship': [
                { label: '🏦 కరెంట్ అకౌంట్ తెరవడానికి', value: 'Current Account' }, 
                { label: '📝 GST రిజిస్ట్రేషన్', value: 'GST Registration' }, 
                { label: '🏢 స్థానిక ట్రేడ్ లైసెన్స్', value: 'Trade License' }, 
                { label: '🌟 పైన ఉన్నవన్నీ (All of the above)', value: 'All of the above' },
                { label: '🚀 ఇప్పుడే ప్రారంభిస్తున్నాను', value: 'Just getting started' }
              ],
              'Partnership Firm': [
                { label: '🤝 భాగస్వామ్య ఒప్పందం (Deed)', value: 'Partnership Deed' }, 
                { label: '🏦 కరెంట్ అకౌంట్ తెరవడానికి', value: 'Current Account' }, 
                { label: '📝 GST రిజిస్ట్రేషన్', value: 'GST Registration' }, 
                { label: '🌟 పైన ఉన్నవన్నీ (All of the above)', value: 'All of the above' },
                { label: '🚀 ఇప్పుడే ప్రారంభిస్తున్నాను', value: 'Just getting started' }
              ],
              'Limited Liability Partnership (LLP)': [
                { label: '🛡️ లిమిటెడ్ లయబిలిటీ రక్షణ', value: 'Asset Protection' }, 
                { label: '🏦 కరెంట్ అకౌంట్ తెరవడానికి', value: 'Current Account' }, 
                { label: '👨‍💼 వృత్తిపరమైన సేవల కోసం', value: 'Professional Services' }, 
                { label: '🌟 పైన ఉన్నవన్నీ (All of the above)', value: 'All of the above' },
                { label: '🚀 ఇప్పుడే ప్రారంభిస్తున్నాను', value: 'Just getting started' }
              ],
              'default': [
                { label: '💰 ఫండింగ్/పెట్టుబడిదారుల కోసం', value: 'Seeking Funding' }, 
                { label: '🛡️ బ్రాండ్ రక్షణ', value: 'Brand Protection' }, 
                { label: '🏦 కరెంట్ అకౌంట్', value: 'Current Account' }, 
                { label: '🌟 పైన ఉన్నవన్నీ (All of the above)', value: 'All of the above' },
                { label: '🚀 ఇప్పుడే ప్రారంభిస్తున్నాను', value: 'Just getting started' }
              ]
            }
          },
          { ask: "మీరు ఎప్పుడు అధికారికంగా ప్రారంభించాలని ప్లాన్ చేస్తున్నారు?", key: 'timeline', options: [{ label: '⚡ వెంటనే', value: 'Immediately' }, { label: '📅 ఒక నెల లోపు', value: 'Within a month' }, { label: '🔍 ఇంకా పరిశీలిస్తున్నాను', value: 'Still researching' }] }
        ],
        summary: "మీ వ్యాపార ఆలోచనను పంచుకున్నందుకు ధన్యవాదాలు! మీ ప్రొఫైల్ సారాంశం ఇక్కడ ఉంది:",
        serviceCategory: 'startup',
        serviceId: 'private-limited-company'
      },
      'professional-services': {
        greeting: "తప్పకుండా! 👨‍🍳 వృత్తిపరమైన సేవలు — సరైన నిపుణుడిని కనుగొనడంలో నేను మీకు సహాయపడతాను, {name}.",
        questions: [
          { ask: "మీకు ఎలాంటి నిపుణులు కావాలి?", key: 'type', options: [{ label: '🚗 డ్రైవర్', value: 'Driver' }, { label: '👨‍🍳 చెఫ్/కుక్', value: 'Chef/Cook' }, { label: '💄 మేకప్ ఆర్టిస్ట్', value: 'Professional Makeup Artist' }, { label: '🖨️ బ్యానర్లు & సైన్ బోర్డులు', value: 'Flex Printing Services' }, { label: '✂️ టైలర్ (హోమ్ విజిట్)', value: 'Tailor Services' }, { label: '👔 డ్రై క్లీనింగ్', value: 'Dry Cleaning & Laundry' }, { label: '⚡ ఎలక్ట్రీషియన్ (Electrician)', value: 'Electrician' }, { label: '❄️ AC టెక్నీషియన్', value: 'AC Technician' }, { label: '✨ క్లీనింగ్ సేవలు', value: 'Cleaning Services' }, { label: '🧼 కార్ వాష్ సేవ', value: 'Car Wash Service' }, { label: '🔧 ప్లంబింగ్ సేవలు', value: 'Plumbing Services' }] },
          { 
            askByPrevKey: 'type',
            askByPrev: {
              'Flex Printing Services': "మీరు ఖచ్చితంగా ఏమి ప్రింట్ చేయాలి?",
              'Tailor Services': "మీకు కుట్టడానికి లేదా మార్పులకు ఏమి కావాలి?",
              'Dry Cleaning & Laundry': "ఎలాంటి బట్టలు డ్రై క్లీనింగ్ చేయాలి?",
              'Electrician': "మీకు ఎలాంటి ఎలక్ట్రికల్ పని కావాలి?",
              'AC Technician': "మీకు ఏ రకమైన AC సేవ కావాలి?",
              'Cleaning Services': "మీకు ఏ క్లీనింగ్ సేవలు కావాలి? (మీరు బహుళ ఎంపికలను టైప్ చేయవచ్చు)",
              'Car Wash Service': "మీకు ఏ రకమైన కార్ వాష్ సేవ కావాలి?",
              'Plumbing Services': "మీకు ఎలాంటి ప్లంబింగ్ సేవ కావాలి?",
              'default': "ఇది వన్-టైమ్ ఈవెంట్ కోసమా లేదా రోజువారీ కోసమా?"
            },
            key: 'requirement', freeText: true, 
            optionsByPrevKey: 'type',
            optionsByPrev: {
              'Flex Printing Services': [{label: '🚩 క్లాత్ / పర్యావరణ బ్యానర్', value: 'Cloth / eco-friendly banner'}, {label: '🏪 సైన్‌బోర్డ్', value: 'Signboard'}, {label: '🚗 వెహికల్ స్టిక్కర్', value: 'Vehicle Sticker'}, {label: '❓ ఇతర', value: 'Other'}],
              'Tailor Services': [{label: '👔 మగవారి దుస్తులు', value: 'Men\'s Wear'}, {label: '👗 ఆడవారి దుస్తులు', value: 'Women\'s Wear'}, {label: '✂️ మార్పులు', value: 'Alterations'}],
              'Dry Cleaning & Laundry': [{label: '✨ ప్రీమియం దుస్తులు', value: 'Premium Wear'}, {label: '🧺 రోజువారీ ఉతుకు', value: 'Wash & Fold'}, {label: '💨 స్టీమ్ ఐరనింగ్', value: 'Steam Ironing'}],
              'Electrician': [{label: '🔌 స్విచ్‌లు & సాకెట్లు', value: 'Switches & Sockets'}, {label: '💨 ఫ్యాన్లు & వెంటిలేషన్', value: 'Fans & Ventilation'}, {label: '💡 లైటింగ్ & ఫిక్చర్స్', value: 'Lighting & Fixtures'}, {label: '⚡ వైరింగ్/బోర్డులు', value: 'Wiring'}],
              'AC Technician': [{label: '💧 జెట్ క్లీనింగ్ (Jet Cleaning)', value: 'Jet Cleaning'}, {label: '💨 గ్యాస్ రీఫిల్ (Gas Refill)', value: 'Gas Refilling'}, {label: '🔧 రిపేర్ (Repair)', value: 'Repair'}, {label: '⚙️ ఇన్‌స్టాలేషన్ (Installation)', value: 'Installation'}],
              'Cleaning Services': [{label: '🏠 ఫుల్ హోమ్ డీప్ క్లీనింగ్', value: 'Full Home Deep Cleaning'}, {label: '🧽 వంటగది/బాత్రూమ్ స్క్రబ్బింగ్', value: 'Kitchen/Bathroom Scrubbing'}, {label: '🛋️ సోఫా షాంపూయింగ్', value: 'Sofa Shampooing'}, {label: '💧 ఓవర్‌హెడ్ వాటర్ ట్యాంక్ నిర్వహణ', value: 'Overhead Water Tank Maintenance'}],
              'Car Wash Service': [{label: '🚘 ఫుల్ సర్వీస్ (పికప్ & డ్రాప్)', value: 'Full Service (Pickup & Drop)'}, {label: '🏠 ఇంటి వద్ద బాడీ వాష్', value: 'Body Wash at Home'}],
              'Plumbing Services': [{label: '🚰 లీక్ & పైపు రిపేర్', value: 'Leak & Pipe Repair'}, {label: '🚿 ట్యాప్/షవర్ ఇన్‌స్టాలేషన్', value: 'Tap/Shower Installation'}, {label: '🚽 టాయిలెట్/వాష్ బేసిన్ రిపేర్', value: 'Toilet/Washbasin Repair'}, {label: '💧 మోటార్ & ట్యాంక్ సమస్యలు', value: 'Motor & Tank issues'}],
              'default': [{ label: '📅 వన్-టైమ్ ఈవెంట్', value: 'One-time Event' }, { label: '🔄 రోజువారీ / కొనసాగుతున్నది', value: 'Daily / Ongoing' }, { label: '📆 వారానికొకసారి', value: 'Weekly Basis' }, { label: '📅 నెలవారీ సబ్‌స్క్రిప్షన్', value: 'Monthly Subscription' }]
            }
          },
          { ask: "మీకు ఈ సేవ ఏ ప్రాంతం/నగరంలో కావాలి?", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, హైదరాబాద్...' }
        ],
        summary: "మీ వృత్తిపరమైన సేవ అభ్యర్థన:",
        serviceCategory: 'drivers',
        serviceId: 'verified-driver-services'
      },
      'interior-design': {
        greeting: "అద్భుతం! 🪴 ఇంటీరియర్ డిజైన్ — మీ కలల స్థలాన్ని సృష్టించడంలో నేను సహాయపడతాను, {name}.",
        questions: [
          { ask: "మీరు ఏ రకమైన స్థలాన్ని డిజైన్ చేస్తున్నారు?", key: 'projectType', options: [{ label: '🏠 రెసిడెన్షియల్', value: 'Residential' }, { label: '🏢 కమర్షియల్', value: 'Commercial' }, { label: '🍽️ మాడ్యులర్ కిచెన్', value: 'Modular Kitchen' }, { label: '📐 వాస్తు కన్సల్టింగ్', value: 'Vastu Consulting' }] },
          { ask: "స్థలం అంచనా పరిమాణం ఎంత (ఉదా. 2BHK, 1500 sq ft)?", key: 'spaceSize', freeText: true, placeholder: 'ఉదా. 2BHK, 1500 sq ft' },
          { ask: "మీ మనసులో ఏదైనా నిర్దిష్ట శైలి ఉందా?", key: 'style', options: [{ label: '✨ ఆధునిక (Modern)', value: 'Modern' }, { label: '🏛️ సాంప్రదాయ (Traditional)', value: 'Traditional' }, { label: '🌱 మినిమలిస్ట్ (Minimalist)', value: 'Minimalist' }, { label: '🤷 ఇంకా ఖచ్చితంగా తెలియదు', value: 'Not Sure' }] },
          { ask: "మీ బడ్జెట్ ఎంత?", key: 'budget', options: [{ label: '💰 ప్రీమియం', value: 'Premium' }, { label: '💵 స్టాండర్డ్', value: 'Standard' }, { label: '🪙 బడ్జెట్-ఫ్రెండ్లీ', value: 'Budget' }] },
          { ask: "ప్రాపర్టీ ఎక్కడ ఉంది?", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, హైదరాబాద్' },
          { ask: "మీరు ప్రాజెక్టును ఎప్పుడు ప్రారంభించాలని అనుకుంటున్నారు?", key: 'timeline', options: [{ label: '🚀 తక్షణమే', value: 'Immediately' }, { label: '📅 1-3 నెలల్లో', value: '1-3 months' }, { label: '🔍 కేవలం విచారిస్తున్నాను', value: 'Just exploring' }] }
        ],
        summary: "మీ ఇంటీరియర్ డిజైన్ అభ్యర్థన:",
        serviceCategory: 'interior',
        serviceId: 'interior-full-home'
      },
      'architecture': {
        greeting: "గొప్ప ఎంపిక! 🏛️ ఆర్కిటెక్చర్ — అద్భుతమైనదాన్ని నిర్మిద్దాం, {name}.",
        questions: [
          { ask: "ఇది ఏ రకమైన భవన ప్రాజెక్ట్?", key: 'buildingType', options: [{ label: '🏠 నివాస గృహం (Residential)', value: 'Residential' }, { label: '🏢 వాణిజ్య భవనం (Commercial)', value: 'Commercial' }, { label: '🏗️ పారిశ్రామిక (Industrial)', value: 'Industrial' }, { label: '🏛️ సంస్థాగత / దేవాలయం', value: 'Institutional' }] },
          { ask: "ప్లాట్ అంచనా పరిమాణం ఎంత?", key: 'plotSize', freeText: true, placeholder: 'ఉదా. 30x40 ft, 200 sq yards' },
          { ask: "మీరు ఎన్ని అంతస్తులు ప్లాన్ చేస్తున్నారు?", key: 'floors', options: [{ label: '1 అంతస్తు (G)', value: 'G' }, { label: '2 అంతస్తులు (G+1)', value: 'G+1' }, { label: '3+ అంతస్తులు', value: 'G+2 or more' }, { label: 'ఇంకా నిర్ణయించలేదు', value: 'Not decided' }] },
          { ask: "మీకు మున్సిపల్ అనుమతులు (ఉదా. APCRDA) కావాలా?", key: 'compliance', options: [{ label: '✅ అవును, పూర్తి అనుమతులు', value: 'Yes' }, { label: '❌ వద్దు, కేవలం ప్లాన్ మాత్రమే', value: 'No' }, { label: '🤷 ఖచ్చితంగా తెలియదు', value: 'Not sure' }] },
          { ask: "సైట్ ఎక్కడ ఉంది?", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, ప్రకాశం' },
          { ask: "మీరు నిర్మాణాన్ని ఎప్పుడు ప్రారంభించాలని అనుకుంటున్నారు?", key: 'timeline', options: [{ label: '🚀 తక్షణమే', value: 'Immediately' }, { label: '📅 1-3 నెలల్లో', value: '1-3 months' }, { label: '🔍 కేవలం విచారిస్తున్నాను', value: 'Just exploring' }] }
        ],
        summary: "మీ ఆర్కిటెక్చర్ అభ్యర్థన:",
        serviceCategory: 'architecture',
        serviceId: 'arch-house-plan'
      },
      'supplies': {
        greeting: "అద్భుతం! 🏗️ మీకు కావాల్సిన వాటిని సేకరించడంలో నేను సహాయపడతాను, {name}.",
        questions: [
          { ask: "మీరు దేని కోసం వెతుకుతున్నారు?", key: 'category', options: [{ label: '🪨 గ్రానైట్', value: 'Granite' }, { label: '🚜 ఇసుక (Sand)', value: 'Sand' }, { label: '📦 సిమెంట్', value: 'Cement' }, { label: '🔩 TMT బార్స్', value: 'TMT Bars' }, { label: '🧱 ఇటుకలు', value: 'Bricks' }, { label: '🧱 సిమెంట్ ఇటుకలు', value: 'Cement Bricks' }, { label: '🔲 టైల్స్', value: 'Tiles' }, { label: '🏠 UPVC షీట్లు', value: 'UPVC Sheets' }, { label: '🪞 PVC మార్బుల్ షీట్లు', value: 'PVC Marble Sheets' }, { label: '🛋️ ఫర్నిచర్', value: 'Furniture' }, { label: '👨‍🍳 క్యాటరింగ్', value: 'Catering' }, { label: '🎪 ఈవెంట్స్', value: 'Events' }, { label: '🚛 రవాణా (Transport)', value: 'Transport' }, { label: '🫙 ఆయిల్స్', value: 'Cold-Pressed Oils' }, { label: '✨ క్లీనింగ్', value: 'Cleaning Services' }, { label: '💌 ఇన్విటేషన్ కార్డ్స్', value: 'Invitation Cards' }] },
          { ask: "దయచేసి మీ అవసరాన్ని వివరించగలరా? (ఉదా. పరిమాణం, పరిధి)", key: 'requirement', freeText: true, optionsByPrev: {
            'Invitation Cards': [
              { label: '💍 వెడ్డింగ్ కార్డ్స్', value: 'Wedding Cards' },
              { label: '🏠 గృహప్రవేశం', value: 'Housewarming Ceremony' },
              { label: '🧵 ఉపనయనం (Thread Ceremony)', value: 'Thread Ceremony' },
              { label: '👶 నామకరణం', value: 'Naming Ceremony' },
              { label: '🎂 పుట్టినరోజు ఆహ్వానాలు', value: 'Birthday Invites' },
              { label: '🍼 బేబీ షవర్ (శ్రీమంతం)', value: 'Baby Shower' },
              { label: '🥻 హాఫ్ సారీ ఫంక్షన్', value: 'Half Saree Ceremony' },
              { label: '👔 పంచెకట్టు ఫంక్షన్ (Dhoti Ceremony)', value: 'Dhoti Ceremony' }
            ]
          }, placeholder: 'ఉదా. 5 లారీలు, 2BHK ఇల్లు కోసం, 500 మందికి...' },
          { ask: "ఇది ఎక్కడ డెలివరీ చేయాలి? (ప్రకాశం జిల్లా అంతటా డెలివరీ చేస్తాము)", key: 'location', freeText: true, options: [{ label: 'ఒంగోలు', value: 'Ongole' }, { label: 'ప్రకాశం జిల్లా', value: 'Prakasam District' }, { label: 'ఇతర (Other)', value: 'Other' }], placeholder: 'ఉదా. హైదరాబాద్, తెలంగాణ' },
          { ask: "ఇది మీకు ఎప్పటికల్లా కావాలి?", key: 'timeline', options: [{ label: 'తక్షణమే (Immediately)', value: 'Immediately' }, { label: 'ఒక వారంలో', value: 'Within a week' }, { label: 'వచ్చే నెల', value: 'Next month' }, { label: 'కేవలం విచారిస్తున్నాను', value: 'Just inquiring' }] }
        ],
        summary: "మీ అవసరాల వివరాలు ఇక్కడ ఉన్నాయి:",
        serviceCategory: 'supplies',
        serviceId: 'supplies'
      },
      'pujari': {
        greeting: "నమస్కారం, {name}! 🙏 మీ ఆధ్యాత్మిక మరియు ధార్మిక అవసరాలకు సరైన పూజారిని కనుగొనడంలో మేము మీకు సహాయం చేస్తాము.",
        questions: [
          { ask: "మీరు ఏ రకమైన పూజ లేదా కార్యక్రమం చేయాలనుకుంటున్నారు?", key: 'type', options: [{ label: '👥 జీవిత మైలురాళ్ళు (వివాహం, నామకరణం)', value: 'Life Milestones' }, { label: '🏠 గృహప్రవేశం & కొత్త ప్రారంభాలు', value: 'Property & New Beginnings' }, { label: '🔥 వేద క్రతువులు & పూజలు (సత్యనారాయణ వ్రతం)', value: 'Vedic Rituals & Pujas' }, { label: '📜 పితృ కార్యాలు (శ్రాద్ధం)', value: 'Ancestral Rites' }] },
          { ask: "కార్యక్రమానికి ఏదైనా నిర్దిష్ట తేదీ ఉందా?", key: 'date', freeText: true, placeholder: 'ఉదా. వచ్చే సోమవారం, 15వ తేదీ' },
          { ask: "ఈ కార్యక్రమం ఎక్కడ జరుగుతుంది?", key: 'location', freeText: true, placeholder: 'ఉదా. ఒంగోలు, ఇల్లు / గుడి' }
        ],
        summary: "మీ పూజారి అభ్యర్థన సారాంశం:",
        serviceCategory: 'pujari',
        serviceId: 'pujari-life-milestones'
      },
      'property': {
        greeting: "సంతోషంగా సహాయం చేస్తాను, {name}! 🏠 ప్రకాశం జిల్లాలో కొనాలన్నా, అమ్మాలన్నా, అద్దెకు ఇవ్వాలన్నా — మీరు డబ్బు చెల్లించే ముందే ప్రతి పత్రాన్ని తనిఖీ చేస్తాము. మీరు దూరంగా ఉన్నా అన్నీ పూర్తి చేయవచ్చు. కొన్ని ప్రశ్నలు:",
        questions: [
          { ask: "మీరు ఏమి చేయాలనుకుంటున్నారు?", key: 'intent', options: [{ label: '🏠 కొనాలి', value: 'Buy' }, { label: '💰 అమ్మాలి', value: 'Sell' }, { label: '🔑 అద్దె / లీజు', value: 'Rent / Lease' }, { label: '📄 పత్రాల పని మాత్రమే', value: 'Paperwork' }] },
          { ask: "ఏ రకమైన ఆస్తి?", key: 'propertyType', options: [{ label: '📐 ప్లాట్ / ఇంటి స్థలం', value: 'Plot / House site' }, { label: '🏠 ఇల్లు / విల్లా', value: 'House / Villa' }, { label: '🏢 ఫ్లాట్', value: 'Flat / Apartment' }, { label: '🌾 వ్యవసాయ భూమి', value: 'Agricultural land' }, { label: '🏪 వాణిజ్య ఆస్తి', value: 'Commercial' }] },
          { ask: "ఏ ప్రాంతం? (లేదా ఊరి పేరు టైప్ చేయండి)", key: 'location', freeText: true, options: [{ label: 'ఒంగోలు', value: 'Ongole' }, { label: 'కందుకూరు', value: 'Kandukur' }, { label: 'అద్దంకి', value: 'Addanki' }, { label: 'మార్కాపురం', value: 'Markapur' }, { label: 'ఏదైనా — సలహా ఇవ్వండి', value: 'Help me decide' }], placeholder: 'ఉదా. ఒంగోలు, చీమకుర్తి, సింగరాయకొండ...' },
          { ask: "మీరు ఇప్పుడు ఎక్కడ ఉంటున్నారు? (రాలేకపోతే వీడియో మరియు పవర్ ఆఫ్ అటార్నీతో అన్నీ చేయవచ్చు.)", key: 'livingIn', options: [{ label: '📍 ప్రకాశంలో', value: 'In Prakasam District' }, { label: '🇮🇳 భారతదేశంలో వేరే చోట', value: 'Elsewhere in India' }, { label: '✈️ విదేశాల్లో (NRI)', value: 'Abroad (NRI / OCI)' }] },
          { ask: "ఎప్పుడు చేయాలనుకుంటున్నారు?", key: 'timeline', options: [{ label: '⚡ ఒక నెలలో', value: 'Within a month' }, { label: '📅 1–3 నెలల్లో', value: '1–3 months' }, { label: '🔍 ప్రస్తుతం తెలుసుకుంటున్నాను', value: 'Just exploring' }] }
        ],
        summary: "మీ ఆస్తి అభ్యర్థన సారాంశం:",
        serviceCategory: 'real-estate',
        serviceId: 'property'
      },
      'healthcare': {
        greeting: "తప్పకుండా, {name}. 🏥 iN Empower మీ ఆరోగ్య ప్రయాణంలో ప్రతి అడుగులో మీకు మద్దతు ఇవ్వడానికి ఇక్కడ ఉంది. మీకు మెరుగైన సహాయం చేయడానికి కొన్ని వివరాలను సేకరిస్తాను.",
        questions: [
          { ask: "మేము మీకు ఏ ఆరోగ్య సేవతో సహాయపడగలము?", key: 'healthcareType', options: [{ label: '🩺 వైద్య సలహాలు', value: 'Medical Advising' }, { label: '🚑 రోగి లాజిస్టిక్స్', value: 'Patient Logistics' }, { label: '🛏️ రోగి హాస్పిటాలిటీ', value: 'Patient Hospitality' }, { label: '⚕️ ఫిజియోథెరపీ', value: 'Physiotherapy' }, { label: '❓ ఇతర', value: 'Other' }] },
          { ask: "దయచేసి వైద్యపరమైన సమస్య లేదా అవసరాన్ని క్లుప్తంగా వివరించగలరా?", key: 'issue', freeText: true, placeholder: 'ఉదా. ఎముక/కీళ్ల నొప్పి, అంబులెన్స్ అవసరం...' },
          { ask: "ఈ సహాయం ఎవరికి కావాలి?", key: 'patient', options: [{ label: '👤 నాకు', value: 'Myself' }, { label: '👨‍👩‍👧 కుటుంబ సభ్యుడు', value: 'Family Member' }, { label: '🤝 స్నేహితుడు / బంధువు', value: 'Friend or Relative' }] },
          { ask: "మీరు ప్రస్తుతం ఎక్కడ ఉన్నారు లేదా సంరక్షణ కోసం ఎక్కడ చూస్తున్నారు?", key: 'location', freeText: true, options: [{ label: 'ఒంగోలు', value: 'Ongole' }, { label: 'చీరాల', value: 'Chirala' }, { label: 'మార్కాపురం', value: 'Markapur' }, { label: 'ఇతర (Other)', value: 'Other' }], placeholder: 'ఉదా. ఒంగోలు, హైదరాబాద్...' }
        ],
        summary: "మీ ఆరోగ్య సంరక్షణ అవసరాల వివరాలు ఇక్కడ ఉన్నాయి:",
        serviceCategory: 'healthcare',
        serviceId: 'medical-advising'
      },
      'police-services': {
        greeting: "నమస్కారం, {name}. iN EMPOWER లో మేము మా సేవలన్నింటినీ చట్ట పరిధిలోనే నిర్వహిస్తాము. మీకు పోలీసు లేదా సైబర్ క్రైమ్ సహాయం అవసరం అయినట్లుంది. నేను మీకు సరైన ప్రభుత్వ అధికారుల సమాచారాన్ని అందిస్తాను.",
        questions: [
          { 
            ask: "మీకు ఎలాంటి పోలీసు లేదా న్యాయ సహాయం కావాలి?", 
            key: 'issueType', 
            options: [
              { label: '💻 సైబర్ క్రైమ్ / ఆన్‌లైన్ మోసం', value: 'Cyber Crime' }, 
              { label: '📝 e-FIR / పోలీసు ఫిర్యాదు', value: 'Police Complaint' }, 
              { label: '🚨 అత్యవసర సహాయం (Emergency)', value: 'Emergency' }, 
              { label: '🔍 తప్పిపోయిన వ్యక్తులు / దొంగతనం', value: 'Missing or Stolen' }
            ] 
          },
          {
            askByPrevKey: 'issueType',
            askByPrev: {
              'Cyber Crime': "ఆన్‌లైన్ మోసాల కోసం, మీరు వెంటనే నేషనల్ సైబర్ క్రైమ్ పోర్టల్‌లో రిపోర్ట్ చేయాలి లేదా 1930 కు కాల్ చేయాలి.",
              'Police Complaint': "మీరు AP పోలీస్ సేవా పోర్టల్ ద్వారా e-FIR నమోదు చేయవచ్చు.",
              'Emergency': "మీరు ఆపదలో ఉన్నట్లయితే, దయచేసి వెంటనే 112 లేదా 100 డయల్ చేయండి. మహిళల భద్రత కోసం దిశా యాప్ (Disha App) కూడా ఉపయోగించండి.",
              'Missing or Stolen': "తప్పిపోయిన వ్యక్తులు లేదా వాహనాల కోసం AP పోలీస్ పోర్టల్‌లో రిపోర్ట్ చేయవచ్చు.",
              'default': "దీని కోసం మీకు అధికారిక ప్రభుత్వ లింకులు కావాలా?"
            },
            key: 'action',
            options: [
              { label: '✅ అధికారిక లింకులు చూపించండి', value: 'Show Links' },
              { label: '🔙 ప్రధాన మెనూకు వెళ్లండి', value: 'Main Menu' }
            ]
          }
        ],
        summary: "అధికారిక పోలీసు సేవల గురించి ముఖ్యమైన సమాచారం:\n\n" +
         "• **సైబర్ క్రైమ్ (ఆన్‌లైన్ మోసాలు):** [cybercrime.gov.in](https://cybercrime.gov.in) సందర్శించండి లేదా **1930** డయల్ చేయండి.\n" +
         "• **AP పోలీస్ సేవలు (e-FIR, మొదలైనవి):** [appolice.gov.in](https://appolice.gov.in) సందర్శించండి లేదా **AP Police Seva** యాప్ వాడండి.\n" +
         "• **ఎమర్జెన్సీ (అత్యవసర పరిస్థితి):** వెంటనే **112** లేదా **100** డయల్ చేయండి.\n\n" +
         "iN EMPOWER చట్టబద్ధమైన మరియు సురక్షితమైన పద్ధతులను మాత్రమే అనుసరిస్తుంది. మేము చట్టపరమైన విధానాలను దాటవేసే ప్రైవేట్ సేవలను అందించము.",
        serviceCategory: 'legal',
        serviceId: 'police-guidance'
      },
      'court-services': {
        greeting: "నమస్కారం, {name}. న్యాయపరమైన విషయాలకు చాలా జాగ్రత్త అవసరం. మా న్యాయ బృందం మీకు సరిగ్గా సహాయం చేయడానికి, దయచేసి మీ పరిస్థితిని వివరించండి.",
        questions: [
          { 
            ask: "మీకు ఎలాంటి న్యాయ సహాయం కావాలి?", 
            key: 'legalNeed', 
            options: [
              { label: '⚖️ కోర్టు కేసు ఫాలో-అప్ (Follow-Up)', value: 'Case Follow-up' }, 
              { label: '👨‍⚖️ లాయర్ / న్యాయవాది', value: 'Find a Lawyer' }, 
              { label: '📄 పత్రాల పరిశీలన (Vetting)', value: 'Document Vetting' }, 
              { label: '🤔 న్యాయ సలహా', value: 'General Advice' }
            ] 
          },
          {
            ask: "కేసు లేదా సమస్య యొక్క స్వభావం ఏమిటి?",
            key: 'caseType',
            options: [
              { label: 'సివిల్ వివాదం (Civil)', value: 'Civil' },
              { label: 'క్రిమినల్ కేసు (Criminal)', value: 'Criminal' },
              { label: 'కుటుంబం / విడాకులు (Family)', value: 'Family' },
              { label: 'ఆస్తి / రియల్ ఎస్టేట్ (Property)', value: 'Property' },
              { label: 'కార్పొరేట్ / వ్యాపారం', value: 'Corporate' },
              { label: 'ఇతర (Other)', value: 'Other' }
            ]
          },
          {
            ask: "ప్రస్తుత పరిస్థితి ఏమిటి?",
            key: 'caseStatus',
            options: [
              { label: 'కోర్టులో నడుస్తోంది (Ongoing)', value: 'Ongoing' },
              { label: 'ఫైల్ చేయాలనుకుంటున్నాను', value: 'Looking to file' },
              { label: 'కేవలం సలహా కోసం', value: 'Consultation only' }
            ]
          },
          {
            ask: "సమస్యను క్లుప్తంగా వివరించగలరా? (ఐచ్ఛికం)",
            key: 'description',
            freeText: true,
            placeholder: 'ఉదాహరణకు: ఆస్తి వివాదం, లాయర్ కావాలి...'
          }
        ],
        summary: "వివరాలు పంచుకున్నందుకు ధన్యవాదాలు. మీ న్యాయపరమైన అవసరాల సారాంశం ఇక్కడ ఉంది:",
        serviceCategory: 'court',
        serviceId: 'legal-case-follow-up'
      }
    },

    categoryLabels: {
      education: 'విద్యా సేవలు', identity: 'గుర్తింపు & రికార్డులు', mro: 'MRO సేవలు',
      rto: 'RTO సేవలు', municipal: 'మున్సిపల్ సేవలు', collector: 'కలెక్టర్ కార్యాలయం',
      startup: 'స్టార్టప్ రిజిస్ట్రేషన్', property: 'ఆస్తి సేవలు', court: 'కోర్టు సేవలు',
      healthcare: 'ఆసుపత్రులు & ఆరోగ్య సంరక్షణ', drivers: 'వృత్తిపరమైన సేవలు', 'real-estate': 'ఆస్తి & రియల్ ఎస్టేట్',
      photography: 'ఫోటోగ్రఫీ సేవలు', architecture: 'ఆర్కిటెక్చర్', interior: 'ఇంటీరియర్ డిజైన్', loans: 'బ్యాంక్ లోన్ సహాయం', exim: 'ఎగుమతి & దిగుమతి (EXIM)',
      pujari: 'పూజారి సేవలు', electricity: 'ఎలక్ట్రీషియన్ & ఇంటి మరమ్మతులు', painting: 'పెయింటింగ్ & వాటర్‌ప్రూఫింగ్', 'pest-control': 'పెస్ట్ కంట్రోల్', 'ac-services': 'AC సేవలు', nri: 'NRI & విదేశాల్లోని కుటుంబాలు', logistics: 'లాజిస్టిక్స్, ప్యాకర్స్ & మూవర్స్',
    },


    advisoryResponses: {
      about: {
        keywords: ['inempower అంటే ఏమిటి', 'మీ గురించి', 'ఏమి చేస్తారు', 'మీరు ఎవరు', 'ఈ యాప్ ఏమిటి'],
        response: "మంచి ప్రశ్న, {name}! 🇮🇳\n\n**iN Empower** ప్రకాశం జిల్లాలోని విశ్వసనీయ వేదిక, మిమ్మల్ని **ధృవీకరించబడిన లోకల్ బడ్డీలతో** అనుసంధానం చేస్తుంది.\n\n• 🏛️ ప్రభుత్వ డాక్యుమెంటేషన్\n• 🚗 RTO సేవలు\n• 🏠 ఆస్తి సేవలు\n• 🚀 స్టార్టప్ రిజిస్ట్రేషన్\n• ⚖️ కోర్టు & చట్టపరమైన సేవలు\n• 🏥 ఆరోగ్య సంరక్షణ\n• 📦 సామగ్రి\n• 🚚 ప్యాకర్స్ & మూవర్స్ (ఇల్లు మార్చడం, బైక్ & కారు రవాణా)\n• ✈️ NRI & విదేశాల్లోని కుటుంబాలు\n\nప్రతి బడ్డీ **3-అంచెల ధృవీకరణ** కి లోనవుతారు మరియు మీకు ముందే **స్పష్టమైన కోట్** ఇస్తాము — మేము మీ పని పూర్తి చేయలేకపోతే, మీ డబ్బు వాపసు ఇస్తాము! 🛡️",
        followUp: [{ label: '💬 సేవలు చూడండి', value: 'Services' }, { label: '💳 ఎప్పుడు చెల్లించాలి?', value: 'చెల్లింపు' }]
      },
      escrow: {
        keywords: ['ఎస్క్రో', 'వాపసు', 'డబ్బు వాపసు', 'నా డబ్బు సురక్షితమా', 'చెల్లింపు సురక్షితం', 'చెల్లింపు', 'రీఫండ్'],
        response: "మంచి ప్రశ్న, {name}! iN Empowerలో చెల్లింపు ఇలా జరుగుతుంది: 🛡️\n\n**దశ 1** 💬 మీకు ఏమి కావాలో చెప్పండి\n**దశ 2** 📝 పని మొదలయ్యే ముందే మా బృందం **స్పష్టమైన కోట్** ఇస్తుంది — దాచిన ఛార్జీలు లేవు\n**దశ 3** 💰 పని మొదలుపెట్టడానికి **iN Empowerకు అడ్వాన్స్** చెల్లిస్తారు, మిగతా మొత్తం కోట్‌లో చెప్పినట్లు\n**దశ 4** ✅ ధృవీకరించిన లోకల్ బడ్డీ పని పూర్తి చేస్తారు\n\n**పని పూర్తి, లేదా డబ్బు వాపసు** — పని పూర్తి చేయలేకపోతే, పూర్తి కాని భాగానికి మీ డబ్బు వాపసు ఇస్తాము. పని మొదలయ్యే ముందే రద్దు చేస్తే, మీ కోసం ఇప్పటికే ఖర్చు చేసినది (ప్రభుత్వ ఫీజులు, సామగ్రి వంటివి) తీసివేసి అడ్వాన్స్ వాపసు ఇస్తాము. 🛡️",
        followUp: [{ label: '🚀 ప్రారంభించండి', value: 'Services' }]
      },
      localBuddy: {
        keywords: ['లోకల్ బడ్డీ', 'బడ్డీ ఎవరు', 'నమ్మకం', 'సురక్షితం', 'విశ్వసనీయం'],
        response: "గొప్ప ఆందోళన, {name}! 💛\n\n**లోకల్ బడ్డీ** మీ స్వంత సమాజం నుండి ధృవీకరించబడిన వృత్తిపరమైనవారు.\n\n🟢 **టైర్ 1** — ఆధార్, PAN తనిఖీ\n🟡 **టైర్ 2** — నైపుణ్య అంచన\n🟠 **టైర్ 3** — నేర రికార్డ్ తనిఖీ\n\nమేము **ఒంగోలు**లో ప్రారంభిస్తున్నాం, ప్రకాశం జిల్లా అంతటా విస్తరిస్తున్నాం — ప్రతి బడ్డీని మా బృందం స్వయంగా కలుస్తుంది!",
        followUp: [{ label: '💬 సేవలు', value: 'Services' }]
      },
      pricing: {
        keywords: ['ధర', 'ఖర్చు', 'ఎంత', 'రేటు', 'ఫీజు'],
        response: "మంచి ప్రశ్న, {name}! 💰\n\n• ✅ **పారదర్శకం** — దాచిన ఛార్జీలు లేవు\n• ✅ **న్యాయమైన మార్కెట్ రేటు**\n• ✅ **పని పూర్తి, లేదా డబ్బు వాపసు** — పని చేయలేకపోతే ఆ భాగానికి డబ్బు వాపసు\n\nమీకు ఏమి కావాలో చెప్పండి, మా బృందం పారదర్శక కోట్ అందిస్తారు. 🙏",
        followUp: [{ label: '💬 సేవలు', value: 'Services' }]
      },
      photography: {
        keywords: ['ఫోటోగ్రఫీ', 'ఫోటోగ్రాఫర్', 'ఫోటో షూట్', 'పెళ్లి ఫోటోగ్రఫీ', 'కార్పొరేట్ ఫోటోగ్రఫీ'],
        response: "ఫోటోగ్రఫీ మీ ఉత్తమ క్షణాలను బంధిస్తుంది! 📸\n\n**iN Empower ఫోటోగ్రఫీ** ధృవీకరించబడిన వృత్తిపరమైన ఫోటోగ్రాఫర్లను అందిస్తుంది:\n\n• 💍 **పెళ్లి & ఈవెంట్స్**\n• 🏢 **కార్పొరేట్ & అడ్వర్టైజింగ్**\n• 🏠 **రియల్ ఎస్టేట్ & ప్రొడక్ట్**\n\nప్రతి ఫోటోగ్రాఫర్ ధృవీకరించబడ్డారు — షూట్ పూర్తి చేయలేకపోతే, మీ డబ్బు వాపసు ఇస్తాము.\n\nమీరు ఫోటోగ్రాఫర్‌ను బుక్ చేయాలనుకుంటున్నారా?",
        followUp: [{ label: '📸 ఫోటోగ్రాఫర్‌ను కనుగొనండి', value: 'photography' }, { label: '💬 ఇతర సేవలు', value: 'Services' }]
      },
      getStarted: {
        keywords: ['ఎలా ప్రారంభించాలి', 'ఎలా వాడాలి', 'ప్రక్రియ', 'దశలు'],
        response: "స్వాగతం, {name}! 🚀\n\n**దశ 1** 💬 మీకు ఏమి కావాలో చెప్పండి\n**దశ 2** 📝 నేను కొన్ని ప్రశ్నలు అడుగుతాను\n**దశ 3** 👤 మేము మీకు సరైన బడ్డీని కనుగొంటాము\n**దశ 4** 💬 మా బృందం స్పష్టమైన కోట్ ఇస్తుంది\n**దశ 5** ✅ అడ్వాన్స్ చెల్లించండి, మేము పని పూర్తి చేస్తాము!\n\nకింద ఒక వర్గాన్ని ఎంచుకోండి! 😊",
        followUp: [{ label: '🏛️ సేవలు', value: 'Services' }, { label: '📦 సామగ్రి', value: 'Supplies' }, { label: '🏠 ఆస్తి', value: 'Property' }]
      }
    },

        intents: {
      NEGATIVE: [
        "ఫర్వాలేదు, {name}! 😊 మీతో మాట్లాడటం చాలా సంతోషంగా ఉంది. మీకు ఎప్పుడైనా సహాయం కావాలంటే, ఎప్పుడైనా చాట్ బడ్డీ బటన్ ని క్లిక్ చేయండి!",
        "సమస్య లేదు, {name}! మీ సమయానికి ధన్యవాదాలు. మీకు ఎప్పుడైనా సహాయం అవసరమైతే నేను ఇక్కడే ఉంటాను. 🌟",
        "పర్వాలేదు! 😊 మీ సమయం తీసుకోండి, {name}. మీకు సహాయం కావాల్సినప్పుడు — నేను ఒక క్లిక్ దూరంలో ఉంటాను."
      ],
      GREETING: [
        "నమస్కారం మళ్లీ, {name}! 😊 ఈ రోజు నేను మీకు ఎలా సహాయపడగలను? మీకు ఏమి కావాలో వివరించడానికి సంకోచించకండి.",
        "నమస్కారం {name}! 👋 ఈ రోజు నేను మీకు ఏ సేవతో సహాయపడగలను?"
      ],
      GRATITUDE: [
        "చాలా సంతోషం, {name}! 😊 సహాయం చేయడం నాకు సంతోషంగా ఉంది. ఎప్పుడైనా మమ్మల్ని సంప్రదించండి!",
        "నేను సహాయం చేయగలిగినందుకు సంతోషంగా ఉంది, {name}! 🙏 ఎప్పుడైనా మళ్ళీ రండి!"
      ],
      FAREWELL: [
        "వీడ్కోలు, {name}! 👋 శుభ దినం! మీకు అవసరమైనప్పుడు మేము ఎల్లప్పుడూ ఇక్కడే ఉంటాము. 🌟",
        "త్వరలో మళ్ళీ కలుద్దాం, {name}! 😊 iN Empower ఎల్లప్పుడూ కేవలం ఒక క్లిక్ దూరంలో ఉంటుంది. జాగ్రత్త!"
      ],
      AFFIRMATIVE: [
        "గొప్పది, {name}! 😊 దయచేసి మీకు ఏమి కావాలో చెప్పండి — మీ అవసరాన్ని కొన్ని మాటల్లో వివరించండి.",
        "అద్భుతం! నేను వింటున్నాను, {name}. మీకు ఏ సేవ లేదా సహాయం కావాలి?"
      ],
      CONFUSED: [
        "కంగారు పడకండి, {name}! 😊 దయచేసి మీకు అవసరమైన దానికి సరిపోయే వర్గాన్ని కింద ఎంచుకోండి లేదా దాన్ని వేరే విధంగా వివరించడానికి ప్రయత్నించండి:"
      ]
    }
  }
}

