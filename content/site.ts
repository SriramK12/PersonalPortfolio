// Source: owner-supplied master brief. Disputed metrics and ownership are omitted.
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
  date: string; // TODO: e.g. 'Spring 2025'
};

export type Segment = {
  id: string;
  company: string;
  role: string;
  context?: string;
  place: Place['id'];
  dates: string; // TODO: e.g. 'Jun – Aug 2025'
  highlights: string[]; // TODO: one line per result or responsibility
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
};

// TODO: confirm cities. Houston (Avion Wealth) and San Jose (Adobe) are defaults, not verified facts.
export const places: Place[] = [
  { id: 'austin', name: 'Austin, TX', center: [-97.7394, 30.2862] },
  { id: 'austin-north', name: 'Austin, TX', center: [-97.7175, 30.404] },
  { id: 'houston', name: 'Houston, TX', center: [-95.364, 29.758] },
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
      { label: 'Product', value: 'AI tutoring' },
      { label: 'Stack', value: 'Django · React' },
      { label: 'Data', value: 'PostgreSQL' },
    ],
    splits: [
      { label: 'Product', value: 'Personalized AI tutoring' },
      { label: 'Stack', value: 'Django, React, PostgreSQL' },
      { label: 'Discovery', value: 'Direct user interviews prioritized real-time voice tutoring' },
    ],
    href: 'https://www.studysense.org/',
    date: '',
  },
  {
    id: 'plateconnect',
    name: 'PlateConnect',
    type: 'Food systems',
    summary: 'Surplus food redistribution.',
    description: 'An iOS product connecting surplus restaurant food with food banks and charities.',
    stats: [
      { label: 'Platform', value: 'iOS' },
      { label: 'Users', value: 'Two-sided' },
      { label: 'Matching', value: 'Proximity' },
    ],
    splits: [
      { label: 'Problem', value: 'Restaurants need fast reporting. Coordinators need enough detail to decide on a pickup.' },
      { label: 'Approach', value: 'Photo-based reporting, low-friction quantity input, matching by proximity and urgency, and in-app messaging.' },
    ],
    date: '',
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
  { id: 'seg-ibm', company: 'IBM', role: 'Product Management Intern', context: 'watsonx.data Intelligence', place: 'austin-north', dates: '', highlights: [] },
  { id: 'seg-avion', company: 'Avion Wealth', role: 'Product Strategy Intern', place: 'houston', dates: '', highlights: [] },
  { id: 'seg-drink-barcode', company: 'Drink Barcode', role: 'Product Management Intern', place: 'austin', dates: '', highlights: [] },
  { id: 'seg-adobe', company: 'Adobe', role: 'Product Management & Strategy', context: 'Student Insider', place: 'san-jose', dates: '', highlights: [] },
  { id: 'seg-convergent', company: 'Texas Convergent', role: 'Product Lead', context: 'Digital Arts & Media Team', place: 'austin', dates: '', highlights: [] },
  { id: 'seg-texas-consulting', company: 'Texas Consulting / HP', role: 'Technical Lead Developer', context: 'Client project', place: 'austin', dates: '', highlights: [] },
];

export const interests: Interest[] = [
  { id: 'travel', label: 'Travel', group: 'Outdoors', note: 'Flight path' },
  { id: 'hiking', label: 'Hiking', group: 'Outdoors', note: 'Barton Creek Greenbelt' },
  { id: 'photography', label: 'Photography', group: 'Everyday', note: 'Downtown photo walk' },
  { id: 'food', label: 'Food', group: 'Everyday', note: 'South Congress to Rainey' },
  { id: 'tennis', label: 'Tennis', group: 'Sport', note: 'Around campus' },
];

// TODO: add LinkedIn, email, and résumé when approved. Empty href entries are hidden.
export const links: { label: string; handle: string; href: string }[] = [
  { label: 'GitHub', handle: '@SriramK12', href: 'https://github.com/SriramK12' },
  { label: 'LinkedIn', handle: '', href: '' },
  { label: 'Email', handle: '', href: '' },
  { label: 'Résumé', handle: 'PDF', href: '' },
];

export const placeById = (id: string) => places.find((p) => p.id === id)!;
