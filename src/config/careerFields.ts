import { TopicCategory } from '../types';

export interface LinkedInSearchTheme {
  title: string;
  description: string;
  query: string;
  badge?: string;
}

export interface CareerTopicConfig {
  id: string;
  label: string;
  description: string;
  linkedinSearchQuery: string;
  linkedinJobQuery: string;
  jobSearchKeywords: string;
  jobCategoryTag?: string; // Jobicy category tag if relevant
  searchThemes?: LinkedInSearchTheme[];
}

export interface CareerFieldConfig {
  id: string;
  label: string;
  shortLabel?: string;
  matchingTopicCategory?: TopicCategory;
  iconName: string;
  badgeClass: string;
  description: string;
  topics: CareerTopicConfig[];
}

/**
 * Centrally configurable career fields and topic hierarchy.
 * Allows adding, renaming, or removing fields/topics in one place.
 */
export const CAREER_FIELDS_CONFIG: CareerFieldConfig[] = [
  {
    id: 'technology',
    label: 'Technology & Computing',
    shortLabel: 'Technology',
    matchingTopicCategory: 'tech',
    iconName: 'Cpu',
    badgeClass: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
    description: 'Software engineering, machine learning systems, cloud platforms, and cybersecurity.',
    topics: [
      {
        id: 'ai-ml',
        label: 'AI & Machine Learning',
        description: 'Large language models, computer vision, PyTorch, model optimization, and AI agents.',
        linkedinSearchQuery: 'artificial intelligence machine learning generative AI engineering',
        linkedinJobQuery: 'Machine Learning Engineer AI',
        jobSearchKeywords: 'machine learning ai engineer data science',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'LLM Systems & Architectures',
            description: 'Engineering real-world LLM pipelines and autonomous agents',
            query: '"LLM architecture" OR "generative AI systems" engineering',
            badge: 'Engineering',
          },
          {
            title: 'Model Evaluation & Alignment',
            description: 'Testing, red-teaming, and benchmarking state-of-the-art models',
            query: '"model evaluation" OR "AI safety" OR "benchmark"',
            badge: 'Research',
          },
          {
            title: 'AI Career Transitions & Tips',
            description: 'Practical advice on moving into AI engineering from traditional SWE',
            query: '"AI engineer" career transition advice lessons learned',
            badge: 'Career Advice',
          },
          {
            title: 'Open Hiring Posts (#Hiring)',
            description: 'Recent hiring posts from AI leads and founders',
            query: '#hiring ("machine learning" OR "AI engineer" OR "data scientist")',
            badge: 'Hiring',
          },
        ],
      },
      {
        id: 'software-dev',
        label: 'Software Development',
        description: 'Frontend, backend, distributed architectures, API design, and systems engineering.',
        linkedinSearchQuery: 'software engineering full stack backend systems architecture',
        linkedinJobQuery: 'Software Engineer Developer Full Stack',
        jobSearchKeywords: 'software engineer developer react node python',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Production Engineering Stories',
            description: 'Post-mortems, scaling challenges, and distributed systems lessons',
            query: '"software engineering" production incident postmortem lessons',
            badge: 'Architecture',
          },
          {
            title: 'Modern Web & Full-Stack Trends',
            description: 'React, TypeScript, Next.js, and server-driven modern tooling',
            query: 'frontend architecture typescript react performance',
            badge: 'Frontend',
          },
          {
            title: 'Code Quality & Tech Debt',
            description: 'Refactoring strategies, code reviews, and test discipline',
            query: '"clean code" OR "tech debt" refactoring practices',
            badge: 'Best Practices',
          },
          {
            title: 'Software Engineer Openings (#Hiring)',
            description: 'Active openings from engineering managers looking for builders',
            query: '#hiring "software engineer" remote OR hybrid',
            badge: 'Hiring',
          },
        ],
      },
      {
        id: 'data-analytics',
        label: 'Data & Analytics',
        description: 'Data engineering pipelines, dbt, SQL warehouses, analytics, and business intelligence.',
        linkedinSearchQuery: 'data engineering analytics dbt sql bigquery data platform',
        linkedinJobQuery: 'Data Engineer Analytics',
        jobSearchKeywords: 'data engineer analytics sql python dbt',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Modern Data Stack & Warehousing',
            description: 'Warehouse modeling, Lakehouses, Iceberg, and pipeline orchestration',
            query: '"data engineering" dbt warehouse lakehouse',
            badge: 'Data Stack',
          },
          {
            title: 'Analytics Leadership & Impact',
            description: 'Translating raw telemetry into executive decision frameworks',
            query: '"data analytics" business impact metrics leadership',
            badge: 'Strategy',
          },
        ],
      },
      {
        id: 'cybersecurity',
        label: 'Cybersecurity & InfoSec',
        description: 'Application security, SOC operations, zero-trust infrastructure, and incident response.',
        linkedinSearchQuery: 'cybersecurity infosec application security zero trust incident response',
        linkedinJobQuery: 'Cybersecurity Information Security Engineer',
        jobSearchKeywords: 'cybersecurity security infosec compliance',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Threat Intel & Vulnerability Reports',
            description: 'Zero-day disclosures, supply-chain risks, and threat analysis',
            query: 'cybersecurity threat intelligence vulnerability analysis',
            badge: 'Threat Intel',
          },
          {
            title: 'Security Certifications & Path',
            description: 'Guidance on CISSP, OSCP, cloud security certifications',
            query: 'cybersecurity certification career advice CISSP',
            badge: 'Career Path',
          },
        ],
      },
      {
        id: 'product-management',
        label: 'Product Management',
        description: 'Technical product discovery, user journeys, roadmapping, and release prioritization.',
        linkedinSearchQuery: 'product management technical product manager roadmap user research',
        linkedinJobQuery: 'Product Manager TPM',
        jobSearchKeywords: 'product manager product owner agile',
        jobCategoryTag: 'product',
        searchThemes: [
          {
            title: 'Discovery & Spec Writing',
            description: 'Validating user problems and writing high-clarity PRDs',
            query: '"product management" PRD discovery prioritization framework',
            badge: 'Frameworks',
          },
          {
            title: 'PM Interview & Career Growth',
            description: 'Product sense breakdowns and career transition narratives',
            query: '"product manager" career growth lessons leadership',
            badge: 'Career Tips',
          },
        ],
      },
      {
        id: 'cloud-devops',
        label: 'Cloud & DevOps',
        description: 'Kubernetes, Terraform, AWS/GCP architecture, CI/CD pipelines, and site reliability.',
        linkedinSearchQuery: 'devops cloud infrastructure kubernetes terraform SRE platform engineering',
        linkedinJobQuery: 'DevOps Platform Engineer SRE Cloud',
        jobSearchKeywords: 'devops cloud kubernetes aws terraform sre',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Platform Engineering & Internal Developer Platforms',
            description: 'Developer velocity, golden paths, and infrastructure abstraction',
            query: '"platform engineering" developer experience internal developer platform',
            badge: 'Platform',
          },
          {
            title: 'FinOps & Cloud Cost Optimization',
            description: 'Controlling cloud spend across multi-region deployments',
            query: 'FinOps "cloud cost optimization" AWS GCP infrastructure',
            badge: 'FinOps',
          },
        ],
      },
    ],
  },
  {
    id: 'business',
    label: 'Business & Finance',
    shortLabel: 'Business',
    matchingTopicCategory: 'finance',
    iconName: 'TrendingUp',
    badgeClass: 'bg-[#f0fdfa] text-[#0f766e] border-[#99f6e4]',
    description: 'Financial analysis, venture capital, strategic marketing, management consulting, and startups.',
    topics: [
      {
        id: 'marketing',
        label: 'Growth & Marketing',
        description: 'B2B go-to-market, performance marketing, brand storytelling, and user acquisition.',
        linkedinSearchQuery: 'b2b marketing growth strategy demand generation content marketing',
        linkedinJobQuery: 'Growth Marketing Manager Marketing Specialist',
        jobSearchKeywords: 'marketing growth content copywriter seo',
        jobCategoryTag: 'marketing',
        searchThemes: [
          {
            title: 'B2B GTM Playbooks',
            description: 'Proven launch playbooks, outbound strategy, and conversion funnels',
            query: '"B2B marketing" go-to-market strategy playbooks',
            badge: 'GTM Playbook',
          },
          {
            title: 'AI in Content & Campaigns',
            description: 'How modern growth marketers are testing and deploying AI tools',
            query: '"AI marketing" campaign performance workflows',
            badge: 'AI Workflows',
          },
        ],
      },
      {
        id: 'finance',
        label: 'Finance & Investment',
        description: 'Equity research, venture capital, corporate FP&A, portfolio risk, and fintech.',
        linkedinSearchQuery: 'corporate finance investment banking venture capital equity research FP&A',
        linkedinJobQuery: 'Financial Analyst FP&A Investment Associate',
        jobSearchKeywords: 'finance financial analyst accounting controller',
        jobCategoryTag: 'finance',
        searchThemes: [
          {
            title: 'Macro Perspectives & Valuation',
            description: 'Market liquidity, interest rate regimes, and DCF sensitivity',
            query: '"corporate finance" valuation market analysis liquidity',
            badge: 'Valuation',
          },
          {
            title: 'FP&A Automation & Tooling',
            description: 'Next-gen planning software and automated financial model reviews',
            query: 'FP&A financial modeling automation forecasting',
            badge: 'FP&A',
          },
        ],
      },
      {
        id: 'consulting',
        label: 'Consulting & Strategy',
        description: 'Management consulting, commercial due diligence, transformation, and operations.',
        linkedinSearchQuery: 'management consulting corporate strategy digital transformation operations',
        linkedinJobQuery: 'Strategy Consultant Management Consultant',
        jobSearchKeywords: 'consultant strategy operations analyst',
        jobCategoryTag: 'business',
        searchThemes: [
          {
            title: 'Problem Structuring & Minto Pyramid',
            description: 'Synthesizing messy stakeholder inputs into structured recommendations',
            query: '"management consulting" problem solving framework pyramid principle',
            badge: 'Problem Solving',
          },
          {
            title: 'Consulting Exit Paths',
            description: 'Transitioning from consulting into operating and founder roles',
            query: '"management consultant" exit opportunities career lessons',
            badge: 'Career Path',
          },
        ],
      },
      {
        id: 'entrepreneurship',
        label: 'Entrepreneurship & Startups',
        description: 'Zero-to-one building, fundraising, founder lessons, and product-market fit.',
        linkedinSearchQuery: 'startup founder product market fit venture capital bootstrapping',
        linkedinJobQuery: 'Founder In Residence Early Stage Startup Lead',
        jobSearchKeywords: 'startup founder operations generalist',
        jobCategoryTag: 'business',
        searchThemes: [
          {
            title: 'Founders on Zero to One',
            description: 'Unfiltered lessons on finding initial paying customers',
            query: '"startup founder" "product market fit" lessons learned',
            badge: 'Founder Stories',
          },
          {
            title: 'Seed & Series A Fundraising Climate',
            description: 'Pitch deck feedback and investor perspectives',
            query: 'seed fundraising pitch deck advice venture capital',
            badge: 'Fundraising',
          },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: 'Design & Creative',
    shortLabel: 'Design',
    iconName: 'Palette',
    badgeClass: 'bg-[#fdf4ff] text-[#a21caf] border-[#f5d0fe]',
    description: 'User experience design, design systems, visual identity, and brand craftsmanship.',
    topics: [
      {
        id: 'ux-ui',
        label: 'UX & UI Design',
        description: 'Design systems, interaction ergonomics, micro-interactions, and usability testing.',
        linkedinSearchQuery: 'UI UX design systems interaction design Figma user research',
        linkedinJobQuery: 'Product Designer UI UX Designer',
        jobSearchKeywords: 'ux ui designer product designer figma',
        jobCategoryTag: 'design',
        searchThemes: [
          {
            title: 'Design Systems in Production',
            description: 'Token architectures, accessibility conformance, and handoff rituals',
            query: '"design system" Figma design tokens accessibility',
            badge: 'Design Systems',
          },
          {
            title: 'Portfolio Reviews & Case Studies',
            description: 'What design leads look for in case studies and critique sessions',
            query: '"product design" portfolio case study tips critique',
            badge: 'Portfolio',
          },
        ],
      },
      {
        id: 'graphic-design',
        label: 'Graphic & Visual Design',
        description: 'Typography, brand books, editorial layout, packaging, and digital illustration.',
        linkedinSearchQuery: 'graphic design brand identity visual design typography art direction',
        linkedinJobQuery: 'Graphic Designer Visual Designer Brand Designer',
        jobSearchKeywords: 'graphic designer visual illustrator brand',
        jobCategoryTag: 'design',
        searchThemes: [
          {
            title: 'Typography & Editorial Craft',
            description: 'Type selection, grid systems, and expressive visual language',
            query: 'typography graphic design brand identity visual craft',
            badge: 'Craftsmanship',
          },
        ],
      },
      {
        id: 'product-design',
        label: 'Product Design',
        description: 'End-to-end design strategy from discovery workshops to production validation.',
        linkedinSearchQuery: 'product design user experience customer journey prototyping',
        linkedinJobQuery: 'Lead Product Designer Staff Designer',
        jobSearchKeywords: 'product designer lead designer ux',
        jobCategoryTag: 'design',
        searchThemes: [
          {
            title: 'Product Design Leadership',
            description: 'Influencing product roadmap through design craft and user empathy',
            query: '"product designer" product leadership user research roadmap',
            badge: 'Leadership',
          },
        ],
      },
    ],
  },
  {
    id: 'healthcare',
    label: 'Healthcare & Life Sciences',
    shortLabel: 'Healthcare',
    iconName: 'Stethoscope',
    badgeClass: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    description: 'Clinical healthtech, medical informatics, regulatory trials, and biotechnology.',
    topics: [
      {
        id: 'clinical-tech',
        label: 'Clinical & Medical Tech',
        description: 'Electronic health records, telemedicine platforms, and medical imaging software.',
        linkedinSearchQuery: 'healthtech medical technology digital health EHR telemedicine',
        linkedinJobQuery: 'Healthtech Specialist Medical Informatics Clinical',
        jobSearchKeywords: 'health healthcare medical clinical informatics',
        jobCategoryTag: 'supporting',
        searchThemes: [
          {
            title: 'Digital Health Innovation',
            description: 'Patient outcomes, telehealth scaling, and regulatory pathways (FDA/CDSCO)',
            query: '"digital health" healthtech telemedicine clinical workflows',
            badge: 'Innovation',
          },
        ],
      },
      {
        id: 'health-informatics',
        label: 'Health Informatics & AI',
        description: 'Clinical data models, FHIR standards, epidemiological analytics, and diagnostic AI.',
        linkedinSearchQuery: 'health informatics clinical data science FHIR healthcare analytics',
        linkedinJobQuery: 'Health Informatics Clinical Data Analyst',
        jobSearchKeywords: 'health informatics clinical data healthcare',
        jobCategoryTag: 'supporting',
        searchThemes: [
          {
            title: 'FHIR & Health Data Interoperability',
            description: 'Modern healthcare API standards and unified patient records',
            query: 'FHIR health informatics interoperability healthcare data',
            badge: 'Standards',
          },
        ],
      },
      {
        id: 'biotech-pharma',
        label: 'Biotech & Pharma',
        description: 'Drug discovery, clinical trials, bioinformatics, and precision medicine.',
        linkedinSearchQuery: 'biotechnology pharmaceutical clinical trials bioinformatics',
        linkedinJobQuery: 'Biotech Scientist Clinical Trials Associate',
        jobSearchKeywords: 'biotech pharmaceutical clinical science',
        jobCategoryTag: 'supporting',
        searchThemes: [
          {
            title: 'Computational Biology & Discovery',
            description: 'AI for molecule screening and trial design acceleration',
            query: 'biotech "computational biology" drug discovery clinical trials',
            badge: 'Discovery',
          },
        ],
      },
    ],
  },
  {
    id: 'education',
    label: 'Education & Learning',
    shortLabel: 'Education',
    iconName: 'GraduationCap',
    badgeClass: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
    description: 'Educational technology, instructional design, STEM pedagogy, and higher ed research.',
    topics: [
      {
        id: 'edtech',
        label: 'EdTech & E-Learning',
        description: 'Adaptive learning systems, learning management platforms, and student engagement.',
        linkedinSearchQuery: 'edtech online learning adaptive learning educational technology LMS',
        linkedinJobQuery: 'EdTech Instructional Designer Learning Specialist',
        jobSearchKeywords: 'edtech education learning instructor trainer',
        jobCategoryTag: 'supporting',
        searchThemes: [
          {
            title: 'Personalized & Adaptive Learning',
            description: 'How AI and adaptive tutors change classroom outcomes',
            query: 'edtech "adaptive learning" personalized education pedagogy',
            badge: 'Pedagogy',
          },
        ],
      },
      {
        id: 'instructional-design',
        label: 'Curriculum & Instructional Design',
        description: 'Microlearning modules, instructional scaffolding, and corporate training programs.',
        linkedinSearchQuery: 'instructional design curriculum development learning experience L&D',
        linkedinJobQuery: 'Instructional Designer Learning and Development',
        jobSearchKeywords: 'instructional design curriculum training L&D',
        jobCategoryTag: 'supporting',
        searchThemes: [
          {
            title: 'Modern L&D Frameworks',
            description: 'Designing high-impact onboarding and skill upskilling pathways',
            query: '"instructional design" learning development adult learning',
            badge: 'L&D Strategy',
          },
        ],
      },
      {
        id: 'academic-research',
        label: 'Higher Education & Research',
        description: 'Academic administration, grant writing, faculty research, and institutional leadership.',
        linkedinSearchQuery: 'higher education academic research university administration scholarly publishing',
        linkedinJobQuery: 'Academic Researcher University Program Manager',
        jobSearchKeywords: 'academic research university education professor',
        jobCategoryTag: 'supporting',
        searchThemes: [
          {
            title: 'Research Grants & Scholarly Impact',
            description: 'Funding strategies and interdisciplinary lab management',
            query: '"higher education" academic research university leadership grants',
            badge: 'Academia',
          },
        ],
      },
    ],
  },
  {
    id: 'climate',
    label: 'Climate & Clean Energy',
    shortLabel: 'Climate',
    matchingTopicCategory: 'climate',
    iconName: 'Leaf',
    badgeClass: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]',
    description: 'Grid-scale renewables, energy storage, carbon accounting, and industrial decarbonization.',
    topics: [
      {
        id: 'renewable-energy',
        label: 'Renewables & Grid Tech',
        description: 'Solar PV infrastructure, offshore wind, smart inverters, and battery energy storage (BESS).',
        linkedinSearchQuery: 'renewable energy solar wind energy storage battery BESS clean tech',
        linkedinJobQuery: 'Renewable Energy Engineer Clean Tech Energy Storage',
        jobSearchKeywords: 'renewable energy solar wind battery engineer',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Grid Storage & Transmission',
            description: 'Overcoming curtailment and deploying utility-scale batteries',
            query: '"renewable energy" grid interconnection BESS energy storage',
            badge: 'Grid Systems',
          },
        ],
      },
      {
        id: 'sustainability-esg',
        label: 'Sustainability & ESG',
        description: 'Carbon disclosures, lifecycle assessment (LCA), supply chain scope 3 audits.',
        linkedinSearchQuery: 'sustainability corporate ESG carbon accounting lifecycle assessment LCA',
        linkedinJobQuery: 'Sustainability Manager ESG Analyst Carbon Accounting',
        jobSearchKeywords: 'sustainability esg carbon analyst environment',
        jobCategoryTag: 'business',
        searchThemes: [
          {
            title: 'Scope 3 Disclosures & Standards',
            description: 'Complying with CSRD, SEC, and global reporting directives',
            query: 'sustainability ESG "Scope 3" carbon accounting reporting',
            badge: 'Compliance',
          },
        ],
      },
    ],
  },
  {
    id: 'science',
    label: 'Science & Deep Tech',
    shortLabel: 'Science',
    matchingTopicCategory: 'science',
    iconName: 'Rocket',
    badgeClass: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
    description: 'Aerospace, satellite communications, quantum computing, and materials science.',
    topics: [
      {
        id: 'aerospace',
        label: 'Aerospace & Space Systems',
        description: 'Satellite payloads, launch vehicles, orbital mechanics, and propulsion.',
        linkedinSearchQuery: 'aerospace engineering satellites space technology launch vehicle ISRO NASA',
        linkedinJobQuery: 'Aerospace Engineer Satellite Systems Spacecraft',
        jobSearchKeywords: 'aerospace satellite space engineer physics',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Commercial Satellite Ecosystems',
            description: 'Low-earth orbit constellations and Earth-observation analytics',
            query: 'aerospace "satellite constellation" space tech commercial launch',
            badge: 'Space Tech',
          },
        ],
      },
      {
        id: 'quantum-computing',
        label: 'Quantum & Deep Tech',
        description: 'Qubits, quantum algorithms, cryogenics, and advanced semiconductor materials.',
        linkedinSearchQuery: 'quantum computing quantum algorithms qubits deep tech materials science',
        linkedinJobQuery: 'Quantum Engineer Quantum Software Developer Deep Tech',
        jobSearchKeywords: 'quantum computing research physics deep tech',
        jobCategoryTag: 'dev',
        searchThemes: [
          {
            title: 'Quantum Hardware & Algorithm Milestones',
            description: 'Error mitigation and hybrid classical-quantum solver pipelines',
            query: '"quantum computing" algorithms hardware error correction',
            badge: 'Deep Tech',
          },
        ],
      },
    ],
  },
  {
    id: 'policy',
    label: 'Policy & Governance',
    shortLabel: 'Policy',
    matchingTopicCategory: 'policy',
    iconName: 'Building2',
    badgeClass: 'bg-[#fff7ed] text-[#c2410c] border-[#ffedd5]',
    description: 'Digital public infrastructure, tech law, regulatory compliance, and civic modernization.',
    topics: [
      {
        id: 'digital-governance',
        label: 'Digital Public Infrastructure',
        description: 'Open protocols, digital identity, payments rails, and civic data systems.',
        linkedinSearchQuery: 'digital public infrastructure public policy e-governance civic tech',
        linkedinJobQuery: 'Public Policy Manager Civic Tech Government Affairs',
        jobSearchKeywords: 'policy government compliance regulatory legal',
        jobCategoryTag: 'business',
        searchThemes: [
          {
            title: 'Global DPI Architecture',
            description: 'Lessons from UPI, ONDC, and open digital public rail rollouts',
            query: '"digital public infrastructure" UPI open protocol e-governance',
            badge: 'Civic Rail',
          },
        ],
      },
      {
        id: 'tech-law',
        label: 'Tech Law & Compliance',
        description: 'Data privacy regulations, AI governance frameworks, antitrust, and IP rights.',
        linkedinSearchQuery: 'technology law data privacy AI governance compliance regulatory affairs',
        linkedinJobQuery: 'Legal Counsel Technology Compliance Privacy Officer',
        jobSearchKeywords: 'legal counsel compliance privacy regulatory lawyer',
        jobCategoryTag: 'business',
        searchThemes: [
          {
            title: 'AI Governance & Privacy Directives',
            description: 'Navigating EU AI Act, DPDP Act, and enterprise compliance mandates',
            query: '"AI governance" regulatory compliance data privacy legal',
            badge: 'Legal & Risk',
          },
        ],
      },
    ],
  },
  {
    id: 'sports_culture',
    label: 'Sports & Culture',
    shortLabel: 'Sports & Arts',
    matchingTopicCategory: 'sports_culture',
    iconName: 'Sparkles',
    badgeClass: 'bg-[#fff1f2] text-[#be123c] border-[#ffe4e6]',
    description: 'Sports analytics, entertainment media, game design, and digital arts.',
    topics: [
      {
        id: 'sports-analytics',
        label: 'Sports Analytics & Management',
        description: 'Athlete telemetry, biometric data models, team valuation, and franchise operations.',
        linkedinSearchQuery: 'sports analytics sports management telemetry franchise operations',
        linkedinJobQuery: 'Sports Analyst Sports Management Business Operations',
        jobSearchKeywords: 'sports analytics management entertainment media',
        jobCategoryTag: 'business',
        searchThemes: [
          {
            title: 'Player Performance Modeling',
            description: 'Computer vision tracking and workload management in professional leagues',
            query: '"sports analytics" tracking data biomechanics performance',
            badge: 'Sports Science',
          },
        ],
      },
      {
        id: 'entertainment-gaming',
        label: 'Gaming & Interactive Media',
        description: 'Game design, narrative direction, Unreal Engine, and creator economy platforms.',
        linkedinSearchQuery: 'game development game design interactive media creator economy',
        linkedinJobQuery: 'Game Designer Technical Artist Community Manager',
        jobSearchKeywords: 'game designer game developer 3d artist unity unreal',
        jobCategoryTag: 'design',
        searchThemes: [
          {
            title: 'Game Economy & Real-time 3D',
            description: 'Spatial computing and procedural generation in next-gen titles',
            query: '"game development" game design real-time rendering engine',
            badge: 'Game Tech',
          },
        ],
      },
    ],
  },
];

/**
 * Helper to determine the best default field based on the user's primary interest category.
 */
export function getDefaultFieldIdForTopic(topicCategory?: TopicCategory | string): string {
  if (!topicCategory) return 'technology';

  const normalized = topicCategory.toLowerCase();
  const directMatch = CAREER_FIELDS_CONFIG.find(
    (field) => field.matchingTopicCategory === normalized || field.id === normalized
  );

  if (directMatch) return directMatch.id;

  if (normalized === 'economy' || normalized === 'finance') return 'business';
  if (normalized === 'world') return 'policy';
  if (normalized === 'sports_culture') return 'sports_culture';

  return 'technology';
}
