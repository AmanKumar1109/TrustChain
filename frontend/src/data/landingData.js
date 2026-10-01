export const NAV_ITEMS = [
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'For Brands', href: '#for-brands' },
  { name: 'Rewards', href: '#rewards' },
  { name: 'Fraud Map', href: '#fraud-map' },
  { name: 'Pricing', href: '#pricing' },
];

export const PROBLEM_DATA = {
  headlineStat: '₹1,00,000 Crore',
  headlineSub: 'Annual loss suffered by Indian industries due to fake and counterfeit goods every year.',
  quote: '“Digital assets ko ownership mila, physical goods ko nahi.”',
  quoteAuthor: 'The Trust Deficit in Physical Supply Chains',
  sectors: [
    {
      id: 'medicine',
      title: 'Pharma & Medicine',
      stat: '30% of drugs',
      desc: 'Sub-standard and spurious medicines circulate without verification, endangering critical patient lives daily.',
      icon: 'pill',
      color: 'from-red-500/20 to-orange-500/10',
      tag: 'Critical Health Risk',
    },
    {
      id: 'electronics',
      title: 'Electronics & Hardware',
      stat: '₹22,000 Cr Fake Spares',
      desc: 'Counterfeit chargers, lithium batteries, and processors cause severe fire hazards and device failures.',
      icon: 'cpu',
      color: 'from-amber-500/20 to-yellow-500/10',
      tag: 'Safety Hazard',
    },
    {
      id: 'cosmetics',
      title: 'Cosmetics & Skincare',
      stat: '1 in 3 Products Fake',
      desc: 'Toxic heavy metals and banned parabens packaged inside duplicate brand bottles destroy skin health.',
      icon: 'sparkles',
      color: 'from-purple-500/20 to-pink-500/10',
      tag: 'Toxic Adulteration',
    },
    {
      id: 'luxury',
      title: 'Luxury, FMCG & Apparel',
      stat: '42% Market Infiltration',
      desc: 'High-end streetwear, watches, and agrochemicals lose brand equity to hyper-realistic first copies.',
      icon: 'gem',
      color: 'from-cyan-500/20 to-blue-500/10',
      tag: 'Brand Dilution',
    },
  ],
};

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Dual-Layer Tagging at Factory',
    desc: 'Each physical product is tagged with an encrypted tamper-evident QR / NFC chip paired with a unique cryptographic key at the manufacturing line.',
    badge: 'Hardware Binding',
  },
  {
    step: '02',
    title: 'Cryptographic Twin on Blockchain',
    desc: 'The product’s digital identity is minted on an immutable public ledger containing batch number, manufacturing date, and plant certificate.',
    badge: 'Zero-Gas Mint',
  },
  {
    step: '03',
    title: 'Supply Chain Custody Handshake',
    desc: 'Distributors, CFA agents, and verified retailers log cryptographic handshakes at every transit hop, preventing grey market diversion.',
    badge: 'Chain of Custody',
  },
  {
    step: '04',
    title: 'Instant Consumer Scan',
    desc: 'The buyer scans the public QR code on their phone camera. No special app or wallet required; genuine status verified in 400 milliseconds.',
    badge: 'Instant Trust',
  },
  {
    step: '05',
    title: 'Proof of Purchase & Rewards Claim',
    desc: 'Customer scratches the private verification layer, verifies via instant SMS/WhatsApp OTP, activates digital warranty, and earns loyalty tokens.',
    badge: 'Ownership & Rewards',
  },
];

export const WEB3_INVISIBLE_POINTS = [
  {
    id: 'no-wallet',
    icon: 'wallet-cards',
    title: 'No Crypto Wallet Needed',
    desc: 'Users never need MetaMask, seed phrases, or private key management. Native account abstraction creates an invisible secure identity under the hood.',
    pill: 'Zero Friction',
  },
  {
    id: 'no-gas',
    icon: 'zap-off',
    title: 'Zero Gas Fees for Consumers',
    desc: 'Every verification, ownership claim, and digital warranty activation is completely sponsored via meta-transactions. Consumers pay exactly ₹0.',
    pill: '100% Free for Buyers',
  },
  {
    id: 'otp-claim',
    icon: 'message-square-code',
    title: 'OTP se Seamless Claim',
    desc: 'Claim genuine ownership and transfer warranties using just your phone number or WhatsApp OTP. Web3 security with Web2 familiarity.',
    pill: 'Instant Onboarding',
  },
];

export const WHY_BLOCKCHAIN_POINTS = [
  {
    title: 'Tamper-Proof Ledger',
    desc: 'Once a batch hash is recorded on-chain, mathematical cryptography prevents unauthorized backdating or forgery.',
    stat: 'SHA-256 Verified',
  },
  {
    title: 'Brand Bhi Record Nahi Badal Sakta',
    desc: 'Unlike centralized databases, even the brand owners or compromised server admins cannot alter historical batch certificates or delete duplicate scan alarms.',
    stat: 'Zero Internal Tampering',
  },
  {
    title: 'Open Decentralized Verification',
    desc: 'Verification does not rely on a single vulnerable cloud server. Anyone worldwide can independently verify product origin 24/7.',
    stat: '100% Uptime Audit',
  },
];

export const ROLE_TABS_DATA = {
  brands: {
    label: 'For Brands',
    headline: 'Stop Revenue Bleed & Reclaim Direct Customer Channels',
    description: 'Protect your brand equity, eliminate grey-market leaks, and turn static packaging into direct verified customer touchpoints.',
    benefits: [
      {
        title: 'Real-Time Counterfeit Interception',
        desc: 'Instant alerts when duplicate codes are scanned in disparate geographical locations simultaneously.',
      },
      {
        title: 'Anti-Diversion & Geo-Fencing',
        desc: 'Detect unauthorized territory sales when products meant for Region A are scanned in Region B.',
      },
      {
        title: 'Zero-Cost Direct-To-Consumer Channel',
        desc: 'Convert offline retail shoppers into verified first-party CRM profiles with post-purchase warranty activations.',
      },
      {
        title: 'Automated Recall Management',
        desc: 'Pinpoint precise affected serial numbers for recall notifications directly to scanned consumers without panic.',
      },
    ],
  },
  retailers: {
    label: 'For Retailers',
    headline: 'Guarantee 100% Genuine Stock & Eliminate Return Fraud',
    description: 'Stock with complete confidence. Prove authenticity to skeptical shoppers and eliminate fake swap returns.',
    benefits: [
      {
        title: 'Verified Supplier Inbound Check',
        desc: 'Scan entire cartons in seconds to verify authentic origin before accepting stock into inventory.',
      },
      {
        title: 'Zero Return Swapping Fraud',
        desc: 'Prevent fraudsters from buying a genuine item and returning a fake copy by validating unique burned tags.',
      },
      {
        title: 'Store Credibility Badge',
        desc: 'Display live Paradox Trust verified store certifications that boost walk-in buyer conversions.',
      },
      {
        title: 'Instant Brand Warranty Handshake',
        desc: 'Activate point-of-sale warranties instantly without paper invoices or delayed manufacturer approval.',
      },
    ],
  },
  consumers: {
    label: 'For Consumers',
    headline: 'Never Buy a Fake Product Again. Get Rewarded for Truth.',
    description: 'Instant certainty in your pocket. Verify food, medicine, cosmetics, and electronics before spending your hard-earned money.',
    benefits: [
      {
        title: '400ms Verification via Camera',
        desc: 'Open your normal phone camera, scan the code, and see authentic provenance directly in your browser.',
      },
      {
        title: 'Tamper-Proof Digital Warranty',
        desc: 'No lost paper bills or fading thermal receipts. Your transferable warranty lives securely on-chain.',
      },
      {
        title: 'Earn Rewards for Scanning',
        desc: 'Every genuine product scan earns you loyalty points, brand discounts, and unlockable cashback tokens.',
      },
      {
        title: 'One-Tap Fake Bounty Report',
        desc: 'Found a suspicious duplicate code? Report with 1 tap and earn bounty points when verified by the network.',
      },
    ],
  },
};

export const FRAUD_HOTSPOTS = [
  { city: 'Mumbai', coordinates: '72.8777, 19.0760', risk: 'High', incidentsBlocked: 1420, topSector: 'Cosmetics & Pharma' },
  { city: 'New Delhi', coordinates: '77.1025, 28.7041', risk: 'Critical', incidentsBlocked: 2340, topSector: 'Automotive & Electronics' },
  { city: 'Bengaluru', coordinates: '77.5946, 12.9716', risk: 'Moderate', incidentsBlocked: 680, topSector: 'Lifestyle & Apparel' },
  { city: 'Kolkata', coordinates: '88.3639, 22.5726', risk: 'High', incidentsBlocked: 1190, topSector: 'FMCG & Spices' },
  { city: 'Ahmedabad', coordinates: '72.5714, 23.0225', risk: 'Moderate', incidentsBlocked: 540, topSector: 'Agrochemicals' },
];

export const LIVE_STATS = [
  { id: 'verified', label: 'Products Verified', value: '28,45,920+', numeric: 2845920, suffix: '+', change: '+18.4% this month' },
  { id: 'fakes', label: 'Fakes Intercepted', value: '41,280+', numeric: 41280, suffix: '+', change: '₹14.2 Cr saved' },
  { id: 'brands', label: 'Brands Onboarded', value: '184+', numeric: 184, suffix: '+', change: 'Across 14 categories' },
  { id: 'cities', label: 'Cities Monitored', value: '52+', numeric: 52, suffix: '+', change: 'Pan-India coverage' },
];

export const REWARDS_ITEMS = {
  scanPoints: '50 - 250 Points per Scan',
  streaks: [
    { title: 'Scout Badge', desc: 'Scan 5 unique brand products', reward: '+150 Pts' },
    { title: 'Guardian Streak', desc: 'Verify weekly grocery purchases 4 weeks in a row', reward: '+500 Pts' },
    { title: 'Truth Bounty', desc: 'Report an unverified counterfeit product', reward: '+1,500 Pts' },
  ],
  redeemOffers: [
    { brand: 'Boat Lifestyle', offer: 'Flat 20% Off on Audio Gear', pointsNeeded: '400 Pts' },
    { brand: 'Minimalist', offer: 'Free Niacinamide Serum on Orders', pointsNeeded: '650 Pts' },
    { brand: 'Amazon Pay', offer: '₹200 Instant Shopping Voucher', pointsNeeded: '800 Pts' },
    { brand: 'Paradox Vault', offer: 'Exclusive Verified Buyer NFT Badge', pointsNeeded: '1,000 Pts' },
  ],
};

export const PRICING_PLANS = [
  {
    name: 'Starter',
    subtitle: 'For emerging direct-to-consumer brands looking for instant protection.',
    priceMonthly: 14999,
    priceAnnual: 11999,
    currency: '₹',
    period: '/ month',
    badge: 'Popular for D2C',
    features: [
      'Up to 10,000 Serialized Cryptographic QR Tags / mo',
      'Dual-layer Scratch Tag support',
      'Instant Consumer Mobile Verification Page',
      'Basic Fraud Dashboard & Duplicate Scan Alerts',
      'Email & Community WhatsApp Support',
      'Zero-gas consumer verification',
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    subtitle: 'For scaling national brands facing active grey market and fake copy threats.',
    priceMonthly: 49999,
    priceAnnual: 39999,
    currency: '₹',
    period: '/ month',
    badge: 'Most Recommended',
    features: [
      'Up to 1,00,000 Cryptographic QR / NFC Tags / mo',
      'Real-time Counterfeit Hotspot Map & Geo-fencing',
      'Automated WhatsApp Customer Claim & Digital Warranty',
      'Distributor & Retailer Inbound Scan Portal',
      'Custom Branded Verification Domain (verify.yourbrand.com)',
      'Dedicated Account Manager & Priority Slack Support',
    ],
    cta: 'Scale Your Protection',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'For pharma, FMCG conglomerates, and industrial electronics manufacturers.',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    currency: '',
    period: '',
    badge: 'Conglomerates & Pharma',
    features: [
      'Unlimited Serialized Tag Generations',
      'Existing ERP, SAP & Packaging Line Integration (Zebra/Videojet)',
      'Private Consortium Subnet / Dedicated Validator Node',
      'Custom Smart Contract Rules & Supply Chain Custody Handshake',
      'Forensic Counterfeit Legal Prosecution Evidence Dossiers',
      '24/7 SLA Guarantee & Dedicated Solutions Engineer',
    ],
    cta: 'Talk to Enterprise Solutions',
    highlighted: false,
  },
];

export const FAQ_ITEMS = [
  {
    q: 'QR copy ho sakta hai? How do you prevent cloning?',
    a: 'Ordinary QR codes can be photocopied, but Paradox uses a Dual-Layer Cryptographic Architecture. The outer QR provides batch & factory information. Underneath, a tamper-evident scratch layer or encrypted NFC chip contains a private one-time cryptographic challenge. Once scanned and claimed via OTP, the digital token is burned and tied to that specific consumer. If a duplicate copy of the outer code is scanned anywhere else, our protocol immediately flags it as a "Cloned / Duplicate Copy Detected" and marks the counterfeit location on the Fraud Map.',
  },
  {
    q: 'Blockchain kyu zaroori hai? Why not just use a traditional SQL database?',
    a: 'Centralized databases have single points of failure and trust deficits. A rogue insider at the brand, a hacked cloud database, or a compromised supplier can create extra unauthorized serial numbers or alter past inspection records without detection. On the Paradox public blockchain, every batch is cryptographically signed and immutable. Even the brand founder cannot change past batches or delete a counterfeit scan incident.',
  },
  {
    q: 'Gas fees kaun dega? Does the buyer need crypto or a Web3 wallet?',
    a: 'Consumers pay exactly ₹0 in gas fees. We use native Account Abstraction (ERC-4337) and Meta-Transactions where the gas fee is sponsored behind the scenes by the protocol. The consumer simply scans the code with their default smartphone camera and verifies ownership via SMS or WhatsApp OTP. No crypto wallet, no seed phrase, no crypto knowledge required.',
  },
  {
    q: 'How does a brand integrate this with existing packaging lines?',
    a: 'Zero disruption to your manufacturing speed. We provide direct REST APIs and SDKs that integrate seamlessly into industrial label printing machines (e.g. Domino, Videojet, Zebra) and enterprise ERPs (SAP, Oracle). Serialized codes are generated and printed at line speeds exceeding 600 units per minute.',
  },
  {
    q: 'Can Paradox help us take legal action against counterfeit rings?',
    a: 'Yes. Every fraudulent scan captures timestamp, IP geo-location, mobile device headers, and duplicate frequency. The platform compiles automated Forensic Legal Dossiers admissible as evidence under the Indian IT Act to assist law enforcement in raiding counterfeit manufacturing warehouses.',
  },
];

export const MOCK_VERIFY_DATABASE = {
  'PRD-9842-8821': {
    status: 'GENUINE',
    productName: 'Apex Pro Sound ANC Headphones',
    brand: 'SonicAura Labs',
    batchNo: 'SAL-2024-B88',
    mfgDate: '12 Jan 2026',
    expiryDate: 'N/A',
    factoryLocation: 'Sriperumbudur, Tamil Nadu',
    blockchainTx: '0x8f72...3e19',
    contractAddress: '0x71C...B991',
    custodyChain: [
      { step: 'Minted at Factory', date: '12 Jan 2026', location: 'Plant #4' },
      { step: 'Dispatched to Central Hub', date: '16 Jan 2026', location: 'Bhiwandi Hub' },
      { step: 'Retail Delivery Handshake', date: '21 Jan 2026', location: 'Indiranagar Store' },
    ],
    warrantyStatus: 'Active - 2 Years Manufacturer Warranty',
    rewardPoints: 120,
  },
  'MED-3310-9014': {
    status: 'GENUINE',
    productName: 'VitalGluc 500mg LifeSciences',
    brand: 'Aegis Pharma India',
    batchNo: 'MED-IN-88401',
    mfgDate: '04 Feb 2026',
    expiryDate: 'Jan 2028',
    factoryLocation: 'Baddi, Himachal Pradesh',
    blockchainTx: '0x3a41...9c87',
    contractAddress: '0x99A...F104',
    custodyChain: [
      { step: 'Quality Passed & Minted', date: '04 Feb 2026', location: 'Baddi Cleanroom 2' },
      { step: 'Cold Chain Transit Logged', date: '07 Feb 2026', location: 'Delhi Depot' },
      { step: 'Licensed Pharmacy Stock In', date: '11 Feb 2026', location: 'Apollo Partner' },
    ],
    warrantyStatus: 'Batch Certified Safe for Consumption',
    rewardPoints: 80,
  },
  'FAKE-9999-0000': {
    status: 'COUNTERFEIT',
    productName: 'Suspicious / Cloned Label Detected',
    brand: 'Unknown Origin',
    batchNo: 'INVALID_SIGNATURE',
    mfgDate: 'Unknown',
    warning: 'This serial code has been flagged 14 times across multiple cities in the last 2 hours. DO NOT CONSUME OR USE THIS PRODUCT.',
    blockchainTx: 'UNREGISTERED_IN_LEDGER',
  },
};
