// Sources: owner-supplied master brief and the owner's résumé (Recruiting 2028).
// Fields marked TODO are placeholders; empty strings and empty arrays are hidden on the site.

export type Stat = { label: string; value: string };
export type Place = { id: string; name: string; center: [number, number] };

export type Activity = {
  id: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  stats: Stat[];
  splits: Stat[];
  href?: string;
  date: string;
};

export type Segment = {
  id: string;
  company: string;
  role: string;
  context?: string;
  place: Place['id'];
  dates: string;
  highlights: string[];
};

export type Interest = { id: string; label: string; group: string; note: string };

export const profile = {
  name: 'Sriram Kakumanu',
  initials: 'SK',
  school: 'The University of Texas at Austin',
  classYear: '2028',
  tagline: 'Product. Technology. Human behavior.',
  bio: 'I study business and psychology, with a focus on product and technology.',
  degrees: ['BBA, Management Information Systems', 'BA, Psychology'],
  minors: ['Computer Science', 'Statistics & Data Science'],
  avatar: '/media/avatar.jpg',
  honors: [
    { title: 'Product@TX Product Design Competition', result: '1st Place', when: 'Spring 2026' },
    { title: 'Build Teams Demo Day', result: 'Best Overall', when: 'Fall 2025' },
    { title: 'Build Teams Demo Day', result: 'Best Tech', when: 'Spring 2025' },
  ],
};

export const places: Place[] = [
  { id: 'austin', name: 'Austin, TX', center: [-97.7394, 30.2862] },
  { id: 'austin-north', name: 'Austin, TX', center: [-97.7175, 30.404] },
  { id: 'the-woodlands', name: 'The Woodlands, TX', center: [-95.4613, 30.1658] },
  { id: 'san-jose', name: 'San Jose, CA', center: [-121.8935, 37.3307] },
];

export const activities: Activity[] = [
  {
    id: 'studysense',
    name: 'StudySense',
    type: 'Learning',
    summary: 'Personalized AI tutoring.',
    description: 'A personalized AI tutoring product. Real-time voice tutoring was prioritized from direct user interviews.',
    stats: [
      { label: 'Active users', value: '8,000+' },
      { label: 'Week-4 retention', value: '68%' },
      { label: 'Stack', value: 'Django · React' },
    ],
    splits: [
      { label: 'Product', value: 'Personalized AI tutoring' },
      { label: 'Growth', value: '8,000+ active users with 68% Week-4 retention' },
      { label: 'Discovery', value: 'Direct user interviews made real-time voice tutoring the first feature to ship, as the highest-value need' },
      { label: 'Stack', value: 'Django, React, PostgreSQL' },
    ],
    href: 'https://www.studysense.org/',
    date: 'Jun 2025 – Present',
  },
  {
    id: 'plateconnect',
    name: 'PlateConnect',
    type: 'Food systems',
    summary: 'Surplus food redistribution.',
    description: 'A platform connecting restaurants, grocery stores, food banks, and charities to reduce waste and redistribute food.',
    stats: [
      { label: 'Fulfillment', value: '+25%' },
      { label: 'Partners', value: '20+ locations' },
      { label: 'Stack', value: 'SwiftUI · Firebase' },
    ],
    splits: [
      { label: 'Problem', value: 'Restaurants need fast reporting. Coordinators need enough detail to decide on a pickup.' },
      { label: 'Requirements', value: 'Translated restaurant and charity workflows into MVP requirements, balancing inventory, capacity, and delivery timing.' },
      { label: 'Approach', value: 'Photo-based reporting, low-friction quantity input, matching by proximity and urgency, and in-app messaging.' },
      { label: 'Diagnosis', value: 'Found a ~33% match failure rate across timing and capacity constraints, improving total fulfillment efficiency by 25%.' },
      { label: 'Partnerships', value: "20+ retail and grocery locations, including Dunkin' and Salad and Go, with UX iterated on their feedback." },
      { label: 'Stack', value: 'SwiftUI, Dart, Firebase' },
    ],
    date: 'Nov 2022 – May 2025',
  },
  {
    id: 'credit-card-advisor',
    name: 'Credit Card Advisor',
    type: 'Prototype',
    summary: 'Rule-based recommendations.',
    description: 'A rule-based credit card advisor built with Claude Code.',
    stats: [
      { label: 'Engine', value: 'Rule-based' },
      { label: 'Built with', value: 'Claude Code' },
      { label: 'Status', value: 'Prototype' },
    ],
    splits: [
      { label: 'Implementation', value: 'AI-assisted, built with Claude Code' },
      { label: 'Data', value: 'Manual card-data snapshot' },
      { label: 'Status', value: 'Prototype. No live demo or verified user adoption.' },
    ],
    date: '',
  },
];

export const segments: Segment[] = [
  {
    id: 'seg-ibm', company: 'IBM', role: 'Product Management Intern', context: 'watsonx.data Intelligence', place: 'austin-north', dates: 'May – Aug 2026',
    highlights: [
      'Diagnosed a 90% agent error rate on live governance queries, then shipped an agent skill that lifted accuracy to 97%',
      'Designed and shipped an AI classification-explanation feature; prioritized 10 SAL backlog items into a 2027 roadmap',
      'Scoped 2 new MCP execution tools with engineering, filed 4 GitHub defects, and tested the skill with 5 engineers',
    ],
  },
  {
    id: 'seg-avion', company: 'Avion Wealth', role: 'Product Strategy Intern', place: 'the-woodlands', dates: 'May – Aug 2025',
    highlights: [
      'Evaluated RightCapital, eMoney Advisor, and MoneyGuidePro on data-backed criteria to migrate 400+ portfolios',
      'Cut ~10 minutes of manual data entry per client, speeding setup by ~33%, with standardized Figma workflow templates',
    ],
  },
  {
    id: 'seg-drink-barcode', company: 'Drink Barcode', role: 'Product Management Intern', context: 'Seed-stage hydration brand', place: 'austin', dates: 'Jan – May 2025',
    highlights: [
      'Found creator-funnel drop-off in Snowflake and wireframed fixes, reducing CPA and raising campaign ROI by 18%',
      'Built a Snowflake dashboard showing flat stipends despite uneven ROI, and redesigned creator pay into 3 performance tiers',
      "Benchmarked 25+ CPG brands to assess Sam's Club fit, recommending against the partnership on pricing and assortment",
    ],
  },
  {
    id: 'seg-adobe', company: 'Adobe', role: 'Product Management & Strategy', context: 'Student Insider', place: 'san-jose', dates: 'Aug 2025 – Aug 2026',
    highlights: [
      'Tested 12 UI options with Gen Z users, identifying usability friction and informing the design selected for beta launch',
      'Led user research (surveys, 1:1 interviews) and turned insights into product recommendations for Acrobat and Express teams',
    ],
  },
  {
    id: 'seg-convergent', company: 'Texas Convergent', role: 'Product Lead', context: 'Digital Arts & Media Team', place: 'austin', dates: 'Jan 2025 – May 2026',
    highlights: [
      'Designed and pitched 2 AI tools for cross-functional teams (research summarizer, clothing fit visualizer), reaching prototype',
      'Directed Build Teams Demo Day (20+ teams) and Forge Showcase (3 teams), helping 200+ students showcase projects',
      'Ran the product management curriculum and bi-weekly workshops on prioritization, UI/UX design, and MVP scoping',
    ],
  },
  {
    id: 'seg-texas-consulting', company: 'Texas Consulting / HP', role: 'Technical Lead Developer', context: 'HP client project', place: 'austin', dates: 'Aug 2025 – May 2026',
    highlights: [
      'Partnered with 4+ HP engineers and design leads to define AI-powered PC support requirements, specs, and user flows',
      'Segmented 15,000+ profiles by support needs, prioritizing tailored AI troubleshooting workflows for distinct segments',
    ],
  },
];

export const interests: Interest[] = [
  { id: 'travel', label: 'Travel', group: 'Outdoors', note: 'International' },
  { id: 'hiking', label: 'Hiking', group: 'Outdoors', note: 'Barton Creek Greenbelt' },
  { id: 'photography', label: 'Photography', group: 'Everyday', note: 'Downtown photo walk' },
  { id: 'food', label: 'Food', group: 'Everyday', note: "Thai cuisine and Dunkin'" },
  { id: 'tennis', label: 'Tennis', group: 'Sport', note: 'Doubles' },
];

// TODO: LinkedIn URL (not linked in the résumé PDF). Email and résumé are held until the owner approves publishing them. Empty href entries are hidden.
export const links: { label: string; handle: string; href: string }[] = [
  { label: 'GitHub', handle: '@SriramK12', href: 'https://github.com/SriramK12' },
  { label: 'LinkedIn', handle: '', href: '' },
  { label: 'Email', handle: '', href: '' },
  { label: 'Résumé', handle: 'PDF', href: '' },
];

export const placeById = (id: string) => places.find((p) => p.id === id)!;
