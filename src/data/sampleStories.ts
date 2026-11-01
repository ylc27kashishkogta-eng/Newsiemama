import { Story } from '../types';

export const SAMPLE_STORIES: Story[] = [
  // --- FINANCE (Stocks, Startups, Personal Finance, Business, Economy, Tech) ---
  {
    id: 'story-fin-1',
    title: 'RBI Signals Measured Liquidity Path as Core Inflation Moderates to 3.8%',
    deck: 'Monetary Policy Committee maintains neutral stance while opening room for selective growth support in manufacturing and capex sectors.',
    content: 'MUMBAI — In this illustrative broadsheet scenario based on macroeconomic reporting from The Economic Times, the Reserve Bank of India’s forward guidance indicates a steady monetary posture heading into the fiscal quarter. Core price pressures across industrial inputs and urban consumables have cooled to a 14-month low of 3.8%, providing domestic manufacturers margin stability. In the scenario statement, Governor and MPC members reiterated that macro prudential vigilance remains paramount while borrowing rates for corporate bonds are projected to remain stable through mid-2027.',
    sourceName: 'The Economic Times (Topic Hub)',
    canonicalUrl: 'https://economictimes.indiatimes.com/news/economy/policy',
    publishedAt: '2026-11-01T06:30:00Z',
    timeAgo: '1h ago',
    category: 'finance',
    financeSubcategory: 'economy',
    readingMinutes: 3,
    isLeadStory: true,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Markets & Economy',
    keyBullets: [
      'Core inflation moderated to 3.8%, easing pressure on household budgets.',
      'RBI holds repo rate steady while maintaining liquidity neutrality.',
      'Corporate bond yields stabilize, lowering debt financing friction for manufacturing.'
    ],
    vibeSummary: 'Inflation chilled to 3.8% — RBI is staying cool and keeping borrowing costs steady so factories can cook.',
    playcards: [
      { label: 'The Pulse', title: 'What Happened?', body: 'India’s core inflation dropped to 3.8%, giving the central bank breathing room to pause rate hikes.', type: 'what' },
      { label: 'Wallet Check', title: 'Why It Matters', body: 'Stable interest rates mean EMIs won’t spike and businesses can budget their expansion with confidence.', type: 'why' },
      { label: 'Next Chapter', title: 'What Could Happen Next (Analysis)', body: 'Analysts anticipate potential selective liquidity injections toward renewable infrastructure before year-end.', type: 'next' },
    ]
  },
  {
    id: 'story-fin-2',
    title: 'Indian Tech IPO Queue Swells to $4.2B as Late-Stage Profitability Crosses 70%',
    deck: 'Consumer tech and SaaS startups demonstrate positive EBITDA, prompting a wave of domestic market listings on NSE and BSE.',
    content: 'BENGALURU — Following two years of disciplined cost realignment, Indian late-stage technology ventures are initiating draft red herring prospectus filings at record velocity. According to market data from Mint, over a dozen companies in logistics tech, vertical SaaS, and digital healthcare have achieved sustained EBITDA margins above 15%. Institutional fund managers report robust domestic retail and anchor investor demand, shifting the capital landscape away from foreign venture debt toward domestic public equity.',
    sourceName: 'Mint Startups (Topic Hub)',
    canonicalUrl: 'https://www.livemint.com/companies/start-ups',
    publishedAt: '2026-11-01T05:15:00Z',
    timeAgo: '2h ago',
    category: 'finance',
    financeSubcategory: 'startups',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Startups & Venture Capital',
    keyBullets: [
      'Over 12 Indian tech startups preparing IPOs representing $4.2B in target valuation.',
      'Average EBITDA margins among listing candidates rose from -12% in 2024 to +16% in 2026.',
      'Domestic institutional buyers now anchor 60% of pre-IPO tranches.'
    ],
    vibeSummary: 'Startups stopped burning cash and actually turned profitable — now a \$4.2B IPO lineup is hitting the markets.',
    playcards: [
      { label: 'The Pivot', title: 'Growth to Profit', body: 'The era of reckless cash burning is over; startups hitting public markets are sporting clean, positive unit economics.', type: 'what' },
      { label: 'Market Shift', title: 'Domestic Muscle', body: 'Local Indian retail and mutual fund investors are dominating IPO allocations rather than Wall Street mega-funds.', type: 'why' },
      { label: 'Forecast', title: 'Valuation Reality (Analysis)', body: 'Retail listings will face strict scrutiny over price-to-earnings multiples in secondary trading.', type: 'next' },
    ]
  },
  {
    id: 'story-fin-3',
    title: 'Nifty Reclaims Record Highs on Foreign Institutional Inflows and Capital Goods Surge',
    deck: 'Heavy engineering, power equipment, and private banking lead broad-based index rally as global asset allocators reweight into emerging markets.',
    content: 'MUMBAI — Domestic equity indices surged to fresh all-time highs today, supported by net foreign portfolio inflows exceeding ₹3,400 crore in early morning trade. Strong earnings surprises in capital equipment manufacturers and private commercial lenders offset modest corrections in FMCG counters. Market strategists cite resilient domestic capex cycles and political stability as key drivers sustaining the valuation multiple above 21x forward earnings.',
    sourceName: 'The Economic Times (Markets)',
    canonicalUrl: 'https://economictimes.indiatimes.com/markets',
    publishedAt: '2026-11-01T04:20:00Z',
    timeAgo: '3h ago',
    category: 'finance',
    financeSubcategory: 'stocks',
    readingMinutes: 2,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Stock Markets',
    keyBullets: [
      'Nifty and Sensex hit record highs with ₹3,400 crore in single-day FII purchases.',
      'Heavy engineering and energy infrastructure stocks gained between 3.2% and 5.1%.',
      'Index valuation stands at 21.4x forward earnings, backed by domestic SIP inflows.'
    ],
    vibeSummary: 'Bulls are charging hard: heavy engineering stocks and FII cash pushed the Nifty to brand new highs.',
    playcards: [
      { label: 'Market High', title: 'Nifty Breaks Records', body: 'Domestic markets reached historic peaks as global money poured ₹3,400 crore into Indian equities in a single session.', type: 'what' },
      { label: 'Sector Drivers', title: 'Where Money Is Moving', body: 'Capital goods and green energy equipment led the charge, reflecting real factories being built on the ground.', type: 'why' },
      { label: 'Watchlist', title: 'What To Watch (Analysis)', body: 'Valuations are rich; watch quarterly earnings delivery closely to confirm price momentum is justified.', type: 'next' }
    ]
  },
  {
    id: 'story-fin-4',
    title: 'Zero-Commission Bond Platforms Draw 3.8 Million First-Time Retail Debt Investors',
    deck: 'Simplified KYC and fractionalized state development loans enable everyday savers to lock in 7.4% fixed sovereign yields.',
    content: 'NEW DELHI — Retail participation in sovereign and corporate debt has accelerated rapidly via mobile investment platforms. Over 3.8 million young salaried professionals opened direct bond accounts this year, motivated by simplified fractional purchases starting at ₹1,000. Financial advisors note that retail portfolios are increasingly diversifying beyond equity index funds into laddered government securities to lock in multi-year fixed income cushions.',
    sourceName: 'Livemint (Personal Finance)',
    canonicalUrl: 'https://www.livemint.com/money/personal-finance',
    publishedAt: '2026-10-31T20:10:00Z',
    timeAgo: '11h ago',
    category: 'finance',
    financeSubcategory: 'personal_finance',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Personal Finance',
    keyBullets: [
      '3.8 million new retail investors entered sovereign debt markets via mobile apps.',
      'Minimum ticket size lowered to ₹1,000 for government bonds yielding 7.2% to 7.5%.',
      'Young investors (ages 20-30) now represent 48% of direct retail bond volume.'
    ],
    vibeSummary: 'Bonds aren’t just for grandparents anymore — Gen Z is locking in 7.4% safe government yields from phone apps.',
    playcards: [
      { label: 'The Shift', title: 'Retail Debt Boom', body: 'Mobile apps make buying government bonds as easy as buying a fractional share, attracting 3.8 million new users.', type: 'what' },
      { label: 'The Math', title: 'Why It Matters', body: 'Locking in 7.4% fixed sovereign yield gives early-career builders a risk-free foundation alongside stock portfolios.', type: 'why' },
      { label: 'Roadmap', title: 'Liquidity Evolution (Analysis)', body: 'Secondary market trade liquidity is improving, making early exits before bond maturity simpler.', type: 'next' }
    ]
  },

  // --- TECHNOLOGY & AI ---
  {
    id: 'story-tech-1',
    title: 'Open-Weight AI Models Challenge Commercial Cloud Dominance Across Indian Enterprises',
    deck: 'New benchmark shows fine-tuned multilingual open models achieving 94% accuracy parity at one-third the token inference expense.',
    content: 'BENGALURU — In this illustrative technology scenario based on reporting from Mint, Indian enterprise technology leaders are accelerating migration away from closed API endpoints toward self-hosted open-weight language models. Benchmark data released by the National Consortium for AI Innovation confirms that models trained on high-quality Indic tokens deliver superior conversational accuracy for banking and customer support workflows. CIOs report server hardware payback within seven months, citing significant data sovereignty benefits and reduced dollar-denominated cloud expenditure.',
    sourceName: 'Mint Tech (Topic Hub)',
    canonicalUrl: 'https://www.livemint.com/technology',
    publishedAt: '2026-11-01T03:15:00Z',
    timeAgo: '4h ago',
    category: 'tech',
    readingMinutes: 4,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Technology & AI',
    keyBullets: [
      'Open-weight Indic models reach 94% performance parity with proprietary APIs.',
      'Inference costs reduced by 67% when self-hosting on localized GPU clusters.',
      'Data localization compliance is driving Indian fintechs to host models on-prem.'
    ],
    vibeSummary: 'Open-source AI is having its Linux moment — Indian companies are ditching pricey closed APIs to run models on their own iron.',
    playcards: [
      { label: 'The Breakthrough', title: 'Open-Weight Power', body: 'Fine-tuned open models are now neck-and-neck with giant closed cloud models for enterprise language tasks.', type: 'what' },
      { label: 'The Savings', title: 'Why Companies Care', body: 'Running local weights cuts cloud bills by over 60% while guaranteeing customer data never leaves Indian borders.', type: 'why' },
      { label: 'Forward Look', title: 'What To Watch (Analysis)', body: 'Hardware supply chains for on-prem AI accelerators will be the new procurement battleground.', type: 'next' }
    ]
  },
  {
    id: 'story-tech-2',
    title: 'Semiconductor Cluster in Sanand Breaks Ground on Commercial 3D Packaging Cleanroom',
    deck: 'Advanced packaging facility begins equipment tool-in, positioning India in the high-density heterogeneous computing supply chain.',
    content: 'AHMEDABAD — In this manufacturing scenario reflecting reporting from The Economic Times on Gujarat’s semiconductor cluster, commercial chip packaging infrastructure reached a milestone with the commencement of cleanroom tool-in. The joint venture facility, developed under the India Semiconductor Mission, focuses on advanced 2.5D and 3D heterogeneous integration for telecommunications and automotive microcontrollers. First test wafer output is targeted for early Q2 2027, backed by supply agreements with domestic and international Tier-1 electronics manufacturers.',
    sourceName: 'The Economic Times (Tech Hub)',
    canonicalUrl: 'https://economictimes.indiatimes.com/tech',
    publishedAt: '2026-11-01T01:50:00Z',
    timeAgo: '5h ago',
    category: 'tech',
    readingMinutes: 4,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Technology & AI',
    keyBullets: [
      'Cleanroom tool-in begins at Sanand advanced 3D chip packaging facility.',
      'Focus on 2.5D integration for auto microcontrollers and telecom transceivers.',
      'First sample runs scheduled for early Q2 2027 with international automotive buyers.'
    ],
    vibeSummary: 'Cleanroom machines are officially rolling into Sanand — India is securing its place in the physical silicon chip supply chain.',
    playcards: [
      { label: 'Silicon Step', title: 'Cleanroom Tool-In', body: 'Heavy robotics and precision lithography gear are being installed at India’s flagship semiconductor hub in Gujarat.', type: 'what' },
      { label: 'Global Supply', title: 'Why It Matters', body: '3D packaging connects multiple microchips into single super-efficient packages, vital for EVs and AI devices.', type: 'why' },
      { label: 'Timeline', title: 'What’s Next (Analysis)', body: 'Initial test wafers roll off the line next spring to complete automotive reliability certifications.', type: 'next' }
    ]
  },

  // --- POLITICS & GOVERNANCE ---
  {
    id: 'story-pol-1',
    title: 'Dedicated Freight Corridors Cut Western Transit Time Between Delhi and Mumbai by 38 Hours',
    deck: 'Logistics efficiency metrics confirm freight speed gains, easing maritime container turnaround at Nhava Sheva and Mundra ports.',
    content: 'NEW DELHI — In this infrastructure scenario reflecting reporting from The Indian Express, the complete operationalization of the 1,506-km Western Dedicated Freight Corridor (WDFC) has reduced cargo transit durations between national capital freight hubs and the maritime terminals of Gujarat and Maharashtra by nearly two days. Average locomotive speeds have risen from 25 km/h on shared tracks to 68 km/h on the automated double-stack electric lines. The Ministry of Railways reported an 18% reduction in aggregate logistics costs for automotive and export-bound apparel manufacturers.',
    sourceName: 'The Indian Express (Business Hub)',
    canonicalUrl: 'https://indianexpress.com/article/business',
    publishedAt: '2026-11-01T02:40:00Z',
    timeAgo: '4h ago',
    category: 'policy',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Policy & Governance',
    keyBullets: [
      'Western Dedicated Freight Corridor fully connects Dadri terminal to JNPT port.',
      'Locomotive average velocity jumped from 25 km/h to 68 km/h on dedicated double-stack tracks.',
      'Export cargo transport costs declined 18% for manufacturing clusters in north India.'
    ],
    vibeSummary: 'Freight trains got their own VIP express lane, slashing 38 hours off the Delhi-to-Mumbai cargo route.',
    playcards: [
      { label: 'Speed Boost', title: 'Cargo Express', body: 'The dedicated 1,506-km track takes giant freight trains off passenger lines, speeding up delivery by almost two whole days.', type: 'what' },
      { label: 'Economic Impact', title: 'Cheaper Goods', body: 'Lower freight shipping costs make Indian exports cheaper overseas and ease highway truck congestion.', type: 'why' },
      { label: 'Policy Push', title: 'Next Steps (Analysis)', body: 'Watch for the Eastern corridor connector trials to integrate coal and mineral belts across Odisha and Bengal.', type: 'next' }
    ]
  },
  {
    id: 'story-pol-2',
    title: 'National Digital Agriculture Mission Connects 40 Million Farmers to Real-Time Soil Sensor Grids',
    deck: 'Micro-weather forecasting and satellite-guided moisture advisories reduce pesticide consumption by 22% in pilot agrarian zones.',
    content: 'CHANDIGARH — In this agritech scenario reflecting reporting from India Today on the Digital Agriculture Mission and AgriStack, state agriculture departments reported marked fertilizer savings following the rollout of the digital agrarian registry and hyperlocal microclimate advisory network. Farmers receive vernacular WhatsApp and SMS telemetry providing actionable irrigation schedules based on soil nitrogen saturation and impending precipitation. Agronomists note a 14% improvement in crop yield consistency across participating wheat and pulse agrarian belts.',
    sourceName: 'India Today (India Hub)',
    canonicalUrl: 'https://www.indiatoday.in/india',
    publishedAt: '2026-10-31T19:30:00Z',
    timeAgo: '12h ago',
    category: 'policy',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Policy & Governance',
    keyBullets: [
      'AgriStack digital registry links 40 million verified agricultural land parcels.',
      'Hyperlocal soil telemetry sent in 11 vernacular languages directly via WhatsApp.',
      'Pesticide over-spraying dropped 22% in northern pilot districts during harvest prep.'
    ],
    vibeSummary: 'Satellite data and smart soil sensors in farmer group chats just cut chemical waste by 22% and boosted crop health.',
    playcards: [
      { label: 'Digital Fields', title: 'AgriStack Live', body: 'Satellite passes and ground moisture sensors send daily vernacular recommendations straight to farmers’ phones.', type: 'what' },
      { label: 'Real Savings', title: 'Why It Matters', body: 'Farmers spend less on unnecessary chemical fertilizers while preserving ground water levels.', type: 'why' },
      { label: 'Scale Up', title: 'Expansion (Analysis)', body: 'Government aims to expand the sensor grid to 80 million holdings before the upcoming Kharif cycle.', type: 'next' }
    ]
  },

  // --- WORLD INTELLIGENCE ---
  {
    id: 'story-wor-1',
    title: 'India-EU Comprehensive Trade Dialogue Enters Decisive Phase on Carbon Border Mechanism',
    deck: 'Negotiators propose compliance alignment pathways for Indian steel and aluminum exports under bilateral climate verification pact.',
    content: 'BRUSSELS — In this international trade scenario based on reporting from The Indian Express, senior trade officials from New Delhi and the European Commission concluded their fourteenth round of discussions with notable progress on decarbonization standards. Under the evolving compromise framework, certified energy-efficient Indian industrial producers will receive reciprocal credits against the Carbon Border Adjustment Mechanism (CBAM), averting punitive import tariffs while encouraging continuous green hydrogen adoption.',
    sourceName: 'The Indian Express (World Hub)',
    canonicalUrl: 'https://indianexpress.com/section/world',
    publishedAt: '2026-10-31T21:40:00Z',
    timeAgo: '10h ago',
    category: 'world',
    readingMinutes: 4,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow World Intelligence',
    keyBullets: [
      'Fourteenth round of India-EU FTA talks outlines CBAM reciprocal carbon credits.',
      'Indian low-carbon steel mills to receive benchmark certification from European auditors.',
      'Mutual recognition pact could shield over $8B in engineering and metals trade.'
    ],
    vibeSummary: 'New Delhi and Brussels are hashing out carbon tariff compromises so green steel exports don’t get slapped with penalties.',
    playcards: [
      { label: 'Diplomacy', title: 'Carbon Border Talks', body: 'Trade negotiators made breakthrough headway on how Europe’s carbon tax will apply to Indian metal exports.', type: 'what' },
      { label: 'Trade Balance', title: 'Why It Matters', body: 'Averting unilateral tariffs protects billions in industrial trade while incentivizing clean manufacturing.', type: 'why' },
      { label: 'The Horizon', title: 'Ratification (Analysis)', body: 'Legal text scrub is slated for spring summits, pending final agreement on pharmaceutical intellectual property rules.', type: 'next' }
    ]
  },
  {
    id: 'story-wor-2',
    title: 'Global Chip Consortium Standardizes Optical Interconnects for Next-Gen Supercomputing',
    deck: 'International hardware coalition ratifies photonic bus standard, cutting server interconnect latency by 80% across data centers.',
    content: 'SAN JOSE / TOKYO — In a collaborative announcement reported by global technology desks, the International Optical Computing Alliance (IOCA) ratified version 1.0 of the Silicon Photonics Interconnect standard. By swapping copper wiring with microscopic laser waveguides inside server racks, data centers can transmit petabytes of data with 80% lower heat dissipation. Cloud architects hailed the milestone as indispensable for scaling multi-datacenter AI models without blowing through regional electrical grid limits.',
    sourceName: 'BBC News World (Tech)',
    canonicalUrl: 'https://www.bbc.com/news/world',
    publishedAt: '2026-10-31T17:15:00Z',
    timeAgo: '14h ago',
    category: 'world',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow World Intelligence',
    keyBullets: [
      'Standardized silicon optical waveguides replace traditional copper bus architecture.',
      'Inter-rack communications latency dropped from microseconds to nanosecond scales.',
      'Power consumption per terabit transferred decreased by a factor of 4.5.'
    ],
    vibeSummary: 'Engineers are replacing copper cables with tiny lasers inside AI supercomputers to keep data centers from overheating.',
    playcards: [
      { label: 'Laser Wires', title: 'Photonic Standard', body: 'The world’s biggest chipmakers agreed on a unified optical standard that routes data using light pulses instead of electricity.', type: 'what' },
      { label: 'Power Thrift', title: 'Why It Matters', body: 'Data centers use massive amounts of electricity; photonic connections drop cooling and transmission energy demands drastically.', type: 'why' },
      { label: 'Deployment', title: 'What’s Next (Analysis)', body: 'First commercial photonic blade servers will debut in early 2027 enterprise server catalogs.', type: 'next' }
    ]
  },

  // --- CLIMATE & ENERGY ---
  {
    id: 'story-cli-1',
    title: 'Global Renewable Energy Additions Surge 32% as Grid-Scale Battery Storage Prices Plummet',
    deck: 'Lithium iron phosphate cell costs hit record low of $48/kWh, making 6-hour solar-plus-storage cheaper than peaker gas in major markets.',
    content: 'LONDON — In this global energy scenario based on international energy reporting covered by BBC News World, clean energy deployment expanded at its fastest recorded pace over the past twelve months, driven by steep deflation in stationary storage battery modules. Industry benchmark data confirms that utility-scale solar paired with multi-hour storage now represents the lowest levelized cost of electricity across Southern Europe, India, and the American Southwest. The report notes that grid interconnection queue backlogs remain the primary bottleneck to further acceleration.',
    sourceName: 'BBC News World (Topic Hub)',
    canonicalUrl: 'https://www.bbc.com/news/world',
    publishedAt: '2026-10-31T23:10:00Z',
    timeAgo: '8h ago',
    category: 'climate',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Climate & Energy',
    keyBullets: [
      'Stationary LFP battery cell costs dropped to $48 per kWh, an all-time industry low.',
      'Utility solar paired with 6-hour storage beats natural gas peaker plants on total cost.',
      'Interconnection delays remain the top constraint for transmission grid operators.'
    ],
    vibeSummary: 'Giant grid batteries got insanely cheap (\$48/kWh) — solar + batteries now beat gas peaker plants on price all day.',
    playcards: [
      { label: 'Battery Price Drop', title: 'LFP Deflation', body: 'Battery manufacturing scale caused storage costs to drop under $50/kWh, crossing the key tipping point for clean grids.', type: 'what' },
      { label: 'Peak Power', title: 'Why It Matters', body: 'Utilities can now store afternoon sunshine and discharge it during evening peak demand hours cheaper than fossil gas.', type: 'why' },
      { label: 'Bottleneck', title: 'The Roadblock (Analysis)', body: 'Transmission grid hookup queues take 3-5 years; solving grid regulatory approvals is now the urgent priority.', type: 'next' }
    ]
  },
  {
    id: 'story-cli-2',
    title: 'Offshore Floating Wind Farm Generates First Clean Megawatts Off Western Coastline',
    deck: 'Deep-water tethered turbines harness Arabian Sea monsoon currents to supply uninterrupted green power to industrial coastal zones.',
    content: 'KOCHI — Marking a key frontier for marine renewables, India’s first commercial pilot floating wind turbine platform successfully synchronized with the western regional power grid. Positioned 24 nautical miles offshore in waters over 90 meters deep, the semi-submersible platform captures consistent maritime gale winds unavailable to near-shore installations. Electrical telemetry confirmed an 88% capacity utilization factor over its initial 72-hour operational run.',
    sourceName: 'The Economic Times (Energy)',
    canonicalUrl: 'https://economictimes.indiatimes.com/industry/energy',
    publishedAt: '2026-10-31T15:30:00Z',
    timeAgo: '16h ago',
    category: 'climate',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Climate & Energy',
    keyBullets: [
      'First semi-submersible floating turbine synchronized to the national electrical grid.',
      'Deep-water placement unlocks strong, steady offshore winds with 88% capacity factor.',
      'Subsea high-voltage transmission cable lands directly into industrial port grid.'
    ],
    vibeSummary: 'Floating deep-sea wind turbines off the coast just plugged into the grid, tapping steady monsoon winds.',
    playcards: [
      { label: 'Deep Water Wind', title: 'Floating Turbines', body: 'Engineers tethered massive wind turbines in deep coastal waters where ocean winds blow steady day and night.', type: 'what' },
      { label: 'Clean Baseline', title: 'Why It Matters', body: 'Unlike solar that stops at night, deep-water offshore wind delivers high-uptime baseload green electricity.', type: 'why' },
      { label: 'Scale Up', title: 'Commercial Array (Analysis)', body: 'Plans are in place to expand the array to 20 floating turbines by late 2027.', type: 'next' }
    ]
  },

  // --- SCIENCE & SPACE ---
  {
    id: 'story-sci-1',
    title: 'ISRO Completes Critical Autonomous Docking Test for Next-Generation Orbital Station',
    deck: 'Space Docking Experiment (SpaDeX) craft achieve sub-millimeter latching alignment in low Earth orbit, advancing Bharatiya Antariksh Station roadmap.',
    content: 'SRIHARIKOTA — Based on reporting of ISRO’s Space Docking Experiment (SpaDeX) covered by India Today Science, the Indian Space Research Organisation demonstrated autonomous rendezvous, docking, and power transfer trials involving twin robotic orbital modules (SDX01 Chaser and SDX02 Target). Telemetry from the ISTRAC network verified that indigenous laser rangefinders and optical guidance sensors achieved automated rendezvous without manual ground intervention. The milestone satisfies the core technical prerequisite for the planned assembly of India’s modular Bharatiya Antariksh Station.',
    sourceName: 'India Today Science (Topic Hub)',
    canonicalUrl: 'https://www.indiatoday.in/science',
    publishedAt: '2026-11-01T01:20:00Z',
    timeAgo: '6h ago',
    category: 'science',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Science & Space',
    keyBullets: [
      'SpaDeX twin satellites completed automated latching alignment in 400-km orbit.',
      'Indigenous optical navigation achieved sub-millimeter positioning accuracy.',
      'Core technical milestone cleared for building India’s future Bharatiya Antariksh Station.'
    ],
    vibeSummary: 'ISRO pulled off an autonomous space docking with laser precision — paving the path for India’s own space station.',
    playcards: [
      { label: 'Space Latch', title: 'Orbital Docking', body: 'Two robotic satellites found each other in space, matched speeds, and latched together with zero manual control.', type: 'what' },
      { label: 'Station Ready', title: 'Why It Matters', body: 'You can’t build a modular space station without autonomous docking. This proves India has the precision tech to build one.', type: 'why' },
      { label: 'Mission Log', title: 'The Next Flight (Analysis)', body: 'The next phase will test pressurized transfer tunnels and uncrewed cargo module handshakes.', type: 'next' }
    ]
  },
  {
    id: 'story-sci-2',
    title: 'Giant Metrewave Radio Telescope Detects Pre-Galactic Hydrogen Bubbles in Deep Cosmos',
    deck: 'Pune radio observatory maps ancient epoch of reionization, capturing signals from the universe’s first cosmic dawn.',
    content: 'PUNE — Astrophysicists operating the Giant Metrewave Radio Telescope (GMRT) in Khodad published groundbreaking findings confirming direct radio emission detections of neutral hydrogen during the cosmic dawn. By filtering out terrestrial radio interference using novel machine learning deconvolution algorithms, the team identified 21-centimeter emission bubbles formed when the earliest stars ignited 13 billion years ago. The discovery provides astronomers with empirical validation of cosmological expansion models.',
    sourceName: 'The Indian Express (Science)',
    canonicalUrl: 'https://indianexpress.com/section/technology/science',
    publishedAt: '2026-10-31T18:45:00Z',
    timeAgo: '13h ago',
    category: 'science',
    readingMinutes: 4,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Science & Space',
    keyBullets: [
      'GMRT radio dishes in Pune detect 21cm hydrogen signals from 13 billion years ago.',
      'AI deconvolution filters removed terrestrial radio background noise with 99.8% precision.',
      'First direct observational confirmation of cosmic reionization bubbles.'
    ],
    vibeSummary: 'Astronomers in Pune used AI-powered radio dishes to listen to the whisper of the very first stars born 13 billion years ago.',
    playcards: [
      { label: 'Cosmic Dawn', title: 'First Stars Heard', body: 'Radio dishes outside Pune detected signals from ancient hydrogen clouds that existed right when the universe first lit up.', type: 'what' },
      { label: 'Big Science', title: 'Why It Matters', body: 'It gives scientists real observational data about how the universe evolved from a dark soup into galaxies and solar systems.', type: 'why' },
      { label: 'Deep Sky', title: 'Global Grid (Analysis)', body: 'GMRT findings will now synchronize with Square Kilometre Array (SKA) deep sky calibration runs.', type: 'next' }
    ]
  },

  // --- SPORTS & CULTURE ---
  {
    id: 'story-spo-1',
    title: 'Women’s Premier League Expansion Adds Two Franchises as Viewership Sets Global Mark',
    deck: 'Historic 185 million digital viewers tune in, prompting board to sanction new teams in Ahmedabad and Lucknow for upcoming season.',
    content: 'MUMBAI — In a landmark development for international sports entertainment, the Board of Control for Cricket in India (BCCI) confirmed the expansion of the Women’s Premier League (WPL) from five to seven franchises starting next winter. Broadcast audit figures verified that aggregate digital and linear viewership crossed 185 million viewers, making it the fastest-growing women’s sports league in history. Franchise valuations exceeded early analyst projections by 40%, driven by heavy brand sponsorships and packed stadium attendance.',
    sourceName: 'The Indian Express (Sports)',
    canonicalUrl: 'https://indianexpress.com/section/sports',
    publishedAt: '2026-11-01T04:00:00Z',
    timeAgo: '3h ago',
    category: 'sports_culture',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Sports & Culture',
    keyBullets: [
      'WPL expands from 5 to 7 teams with new franchises in Ahmedabad and Lucknow.',
      '185 million unique digital viewers tuned in across the previous season.',
      'Commercial sponsorships and merchandise sales tripled year-over-year.'
    ],
    vibeSummary: 'WPL is dominating global sports — 185M viewers watched, and two brand-new teams are officially joining the league.',
    playcards: [
      { label: 'League Surge', title: 'Two New Teams', body: 'The Women’s Premier League is adding franchises in Ahmedabad and Lucknow following record-shattering viewership.', type: 'what' },
      { label: 'Culture Wave', title: 'Why It Matters', body: 'WPL is now one of the highest-value sports leagues on earth, transforming career paths for female athletes worldwide.', type: 'why' },
      { label: 'Next Season', title: 'Player Auction (Analysis)', body: 'The upcoming mega-auction is expected to see record-breaking international bidding wars.', type: 'next' }
    ]
  },
  {
    id: 'story-spo-2',
    title: 'Independent Indian Game Studios Win Global Indie Showcase Accolades for Heritage RPGs',
    deck: 'Rich local mythologies and hand-painted miniature aesthetics capture player attention on Steam and international gaming festivals.',
    content: 'HYDERABAD / TOKYO — Indie video game studios from Hyderabad, Pune, and Kochi took center stage at the International Indie Showcase, bagging top awards for narrative design and visual art. Developers utilized hand-painted traditional Kalamkari and miniature art textures to render rich, immersive story worlds inspired by historical coastal trade expeditions. Over 800,000 wishlist additions were logged in 48 hours, highlighting a surging international appetite for authentic South Asian storytelling in interactive media.',
    sourceName: 'Mint Culture (Arts & Media)',
    canonicalUrl: 'https://www.livemint.com/news/india',
    publishedAt: '2026-10-31T16:20:00Z',
    timeAgo: '15h ago',
    category: 'sports_culture',
    readingMinutes: 3,
    sourceMode: 'snapshot',
    isDemoStory: true,
    editorialNature: 'illustrative_demo',
    sourceTypeLabel: 'Illustrative Sample (Prototype Demo)',
    curatedReason: 'Because you follow Sports & Culture',
    keyBullets: [
      'Three Indian indie game studios won top jury awards at Tokyo Indie Showcase.',
      'Art direction incorporates real handcrafted Kalamkari and temple fresco textures.',
      'Over 800,000 global players wishlisted the games within two days of launch trailers.'
    ],
    vibeSummary: 'Indian indie game devs won big in Tokyo with gorgeous handcrafted Kalamkari art games — 800K wishlists in 48 hours.',
    playcards: [
      { label: 'Indie Victory', title: 'Global Gaming Awards', body: 'Indian indie studios wowed international critics with story-driven games rooted in heritage folklore and hand-drawn art.', type: 'what' },
      { label: 'Art Revival', title: 'Why It Matters', body: 'Heritage art styles are finding massive new global audiences through high-end interactive video game engines.', type: 'why' },
      { label: 'Release Date', title: 'What’s Next (Analysis)', body: 'Worldwide console and PC launch windows are slated for autumn across all major digital storefronts.', type: 'next' }
    ]
  }
];
