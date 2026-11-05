export interface HistoricalDispatch {
  id: string;
  year: number;
  exactDate: string;
  headline: string;
  summary: string;
  category: 'tech' | 'finance' | 'policy' | 'science' | 'world' | 'climate';
  sourceName: string;
  sourceUrl: string;
  options: number[];
  correctYear: number;
  contextNote: string;
}

export const HISTORICAL_DISPATCHES: HistoricalDispatch[] = [
  {
    id: 'hist-isro-ch3',
    year: 2023,
    exactDate: 'August 23, 2023',
    headline: 'ISRO Chandrayaan-3 Successfully Lands on Lunar South Polar Region',
    summary: 'India became the fourth country in the world to achieve a lunar soft landing and the first in history to touch down near the Moon’s rugged south pole.',
    category: 'science',
    sourceName: 'ISRO Official Record / PIB India',
    sourceUrl: 'https://www.isro.gov.in/Chandrayaan3.html',
    options: [2020, 2021, 2022, 2023],
    correctYear: 2023,
    contextNote: 'The Vikram lander and Pragyan rover conducted in-situ thermal and elemental soil analyses near the Manzinus C crater.',
  },
  {
    id: 'hist-upi-launch',
    year: 2016,
    exactDate: 'April 11, 2016',
    headline: 'NPCI Formally Launches Unified Payments Interface (UPI) Under RBI Framework',
    summary: 'The National Payments Corporation of India rolled out UPI with 21 initial pilot banks, introducing interoperable mobile payment handles and immediate settlement.',
    category: 'finance',
    sourceName: 'Reserve Bank of India & NPCI Archive',
    sourceUrl: 'https://www.npci.org.in/what-we-do/upi/product-overview',
    options: [2014, 2016, 2018, 2020],
    correctYear: 2016,
    contextNote: 'UPI eliminated the need to share IFSC codes or account numbers for peer-to-peer and merchant micro-transfers.',
  },
  {
    id: 'hist-gst-rollout',
    year: 2017,
    exactDate: 'July 1, 2017',
    headline: 'India Implements Goods and Services Tax (GST) at Midnight Parliament Session',
    summary: 'The landmark constitutional reform subsumed 17 central and state levies into a unified dual-structure national indirect tax regime.',
    category: 'policy',
    sourceName: 'Ministry of Finance / The Gazette of India',
    sourceUrl: 'https://www.gst.gov.in',
    options: [2015, 2016, 2017, 2019],
    correctYear: 2017,
    contextNote: 'The reform created the inter-state GST Council to cooperatively calibrate indirect taxation rates across all states.',
  },
  {
    id: 'hist-sensex-50k',
    year: 2021,
    exactDate: 'January 21, 2021',
    headline: 'BSE Benchmark Sensex Breaches Historic 50,000 Mark for the First Time',
    summary: 'Strong foreign institutional capital inflows, post-pandemic economic recovery, and corporate earnings resilience drove the Indian equity index across 50,000.',
    category: 'finance',
    sourceName: 'BSE India Official Historical Archives',
    sourceUrl: 'https://www.bseindia.com',
    options: [2018, 2019, 2020, 2021],
    correctYear: 2021,
    contextNote: 'The milestone came 35 years after the benchmark index was first established in 1986 with a base of 100.',
  },
  {
    id: 'hist-dpdp-act',
    year: 2023,
    exactDate: 'August 11, 2023',
    headline: 'Digital Personal Data Protection Act (DPDP) 2023 Notified in Gazette of India',
    summary: 'Parliament passed and the President assented to India’s comprehensive privacy statute establishing rules for processing digital personal data and penalties for breaches.',
    category: 'policy',
    sourceName: 'The Gazette of India / Ministry of Electronics & IT',
    sourceUrl: 'https://www.meity.gov.in/data-protection-framework',
    options: [2020, 2021, 2022, 2023],
    correctYear: 2023,
    contextNote: 'The legislation mandated clear purpose limitation, data minimization, and established the Data Protection Board of India.',
  },
  {
    id: 'hist-5g-auction',
    year: 2022,
    exactDate: 'August 1, 2022',
    headline: 'Government Concludes Historic 5G Spectrum Auction Generating ₹1.5 Lakh Crore',
    summary: 'India’s Department of Telecommunications completed the week-long spectrum sale across low, mid, and high frequency bands to usher in commercial 5G.',
    category: 'tech',
    sourceName: 'Department of Telecommunications / Press Information Bureau',
    sourceUrl: 'https://pib.gov.in',
    options: [2019, 2021, 2022, 2023],
    correctYear: 2022,
    contextNote: 'The rollout enabled ultra-low-latency cellular broadband across 10,000+ cities and towns within 18 months.',
  },
  {
    id: 'hist-mangalyaan',
    year: 2014,
    exactDate: 'September 24, 2014',
    headline: 'ISRO Mars Orbiter Mission (Mangalyaan) Enters Martian Orbit on Maiden Attempt',
    summary: 'India became the first Asian nation to reach Mars orbit and the first country worldwide to succeed on its maiden interplanetary voyage.',
    category: 'science',
    sourceName: 'ISRO Interplanetary Mission Archive',
    sourceUrl: 'https://www.isro.gov.in/MOM.html',
    options: [2012, 2014, 2016, 2018],
    correctYear: 2014,
    contextNote: 'The mission was globally acclaimed for its cost efficiency ($74 million) and operated for over 7 years in orbit.',
  },
];
