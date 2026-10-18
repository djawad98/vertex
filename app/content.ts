// All site copy lives here. Edit text without touching layout.

// TODO: replace the placeholder email before launch.
export const site = {
  name: 'Vertex',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vertex-idea.ir',
  // Prefix for files in public/ (next/link and CSS add it themselves, plain <img> does not).
  base: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  email: 'hi@vertex-idea.ir',
  phone: '+989905815197',
  phoneLabel: '+98 990 581 5197',
  address: 'Ilma Tower, Ghasem Abad, Mashhad, Iran',
  // Plus code 9G32+4P Mashhad.
  geo: { lat: 36.352813, lon: 59.501813 },
  title: 'Vertex — Web, app & digital marketing studio in Mashhad',
  description:
    'Vertex is a software, design and digital marketing studio in Mashhad: app and e-commerce development, WordPress, SEO, social media, branding, logo design and AI integration.',
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lon}`;

export const nav = [
  ['/services/', 'Services'],
  ['/work/', 'Work'],
  ['/pricing/', 'Pricing'],
  ['/mag/', 'Mag'],
  ['/about/', 'About'],
  ['/contact/', 'Contact'],
] as const;

// [stat, title, text]
export const strengths = [
  ['2–4 weeks', 'Launch fast', 'Most websites and stores go live within a month. We use modern tooling, including AI, wherever it saves you time.'],
  ['2 reviews', 'Checked twice', 'Every release passes automated tests and a review by a senior specialist before it reaches you.'],
  ['1 team', 'Design to growth', 'Branding, development and marketing under one roof, with one lead who answers your messages.'],
] as const;

// usd: base price in USDT for the pricing calculator (TODO: the $1 values are placeholders). No usd means quoted per project ("Let's talk").
export type Service = { name: string; text: string; tags: string[]; usd?: number };
export type ServiceGroup = { id: string; name: string; intro: string; items: Service[] };

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'apps',
    name: 'App Development',
    intro: 'Websites, online stores and apps engineered for speed and easy to run.',
    items: [
      { name: 'Web & mobile apps', text: 'Web, mobile and desktop apps, from first prototype to store release, with dashboards and APIs behind them.', tags: ['Next.js', 'React Native', 'APIs', 'Cloud'], usd: 1 },
      { name: 'E-commerce websites', text: 'Online stores with local payment gateways, inventory, shipping and product pages that sell.', tags: ['WooCommerce', 'Custom stores', 'Payments'], usd: 1 },
      { name: 'WordPress design & development', text: 'Custom themes and learning platforms your team can edit without calling us for every change.', tags: ['Custom themes', 'LMS', 'Care plans'], usd: 1 },
    ],
  },
  {
    id: 'seo',
    name: 'SEO',
    intro: 'Get found on Google, load fast, and keep the rankings you earn.',
    items: [
      { name: 'Technical SEO & site speed', text: 'Audits, Core Web Vitals, structured data and fixes that make every page easy for search engines and fast for people.', tags: ['Audits', 'Page speed', 'Structured data'], usd: 1 },
      { name: 'Content & keyword strategy', text: 'Keyword research and content plans that move pages up the results and keep them there.', tags: ['Keywords', 'Content plans', 'Local SEO'], usd: 1 },
      { name: 'Analytics & reporting', text: 'Clear monthly reports on traffic, rankings and leads, in plain numbers.', tags: ['Search Console', 'Analytics', 'Reports'], usd: 1 },
    ],
  },
  {
    id: 'design',
    name: 'Logo and graphic design',
    intro: 'An identity that looks like the same company on every screen and every print.',
    items: [
      { name: 'Logo & brand identity', text: 'Names, marks, color and type systems with a guideline file your whole team can follow.', tags: ['Logo', 'Identity', 'Guidelines'], usd: 1 },
      { name: 'Print & packaging', text: 'Posters, catalogs, book covers and packaging, prepared for the printer.', tags: ['Posters', 'Catalogs', 'Packaging'], usd: 1 },
    ],
  },
  {
    id: 'social',
    name: 'Social media',
    intro: 'Posts people stop for, run against clear targets.',
    items: [
      { name: 'Social media management', text: 'Monthly calendars, community replies and paid campaigns run against clear targets, reported in plain numbers.', tags: ['Instagram', 'LinkedIn', 'Ads', 'Reporting'], usd: 1 },
      { name: 'Social media design', text: 'Post and story templates, campaign visuals and motion built on your identity, not on stock templates.', tags: ['Templates', 'Campaigns', 'Motion'], usd: 1 },
    ],
  },
  {
    id: 'ai',
    name: 'AI Solutions Engineering',
    intro: 'Agents, assistants and automations that take repetitive work off your team.',
    items: [
      { name: 'AI agents', text: 'Agents that answer support tickets, qualify leads, write reports and run multi-step tasks across your tools.', tags: ['Tool use', 'Multi-step tasks', 'Human approval'] },
      { name: 'MCP servers', text: 'Model Context Protocol servers that give Claude, ChatGPT and other assistants safe, scoped access to your database, CRM or internal APIs.', tags: ['MCP', 'Auth & scopes', 'Audit logs'] },
      { name: 'LLM integration', text: 'Chat, search, summaries and content generation inside your product, on the model that fits your cost and accuracy targets.', tags: ['Model selection', 'Prompting', 'Evaluation'] },
      { name: 'Local LLMs', text: 'Private models on your own servers for data that cannot leave the company. Setup, fine-tuning, monitoring.', tags: ['On-premise', 'Fine-tuning', 'Privacy'] },
      { name: 'Knowledge assistants (RAG)', text: 'Assistants that answer from your documents, policies and product data, and cite the source for every answer.', tags: ['Vector search', 'Citations', 'Persian & English'] },
      { name: 'Workflow automation', text: 'Forms, sheets, CRMs and messengers connected, so repetitive work runs on its own.', tags: ['Integrations', 'Webhooks', 'Bots'] },
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  url: string;
  kind: string;
  summary: string;
  did: string[];
  stack: string[];
  results: [string, string][];
  live?: boolean;
};

// TODO: results are illustrative placeholders. Replace with each client's real figures before launch.
export const projects: Project[] = [
  {
    id: 'hamyar',
    name: 'Hamyar Tashkhis',
    url: 'https://hamyartashkhis.ir',
    kind: 'Online academy & course store',
    summary: 'A full learning platform for the first licensed car appraisal and detailing school in eastern Iran.',
    did: [
      'Course catalog for in-person and video courses, with bundle pricing',
      'WooCommerce checkout and student accounts',
      'Consultation request form that feeds the sales team',
      'Exam card, results and certificate verification flows',
      'Blog and on-page SEO for car repair search topics',
      'Caching, lazy loading and asset minification for mobile speed',
    ],
    stack: ['WordPress', 'WooCommerce', 'Elementor', 'WP Rocket', 'SEO'],
    results: [
      ['+200%', 'faster pages (PageSpeed 31 to 94)'],
      ['300M Toman', 'in course sales in the first six months'],
      ['2,400+', 'students signed up online'],
      ['+180%', 'organic search traffic'],
    ],
  },
  {
    id: 'hitech',
    name: 'HiTech',
    url: 'https://hitechshow.djawadg.ir',
    kind: 'Smart building online store',
    summary: 'An online store for smart building and industrial automation gear, from touch switches to smart locks.',
    did: [
      'Store design with category browsing and search',
      'Product pages for touch panels, switches, smart locks, curtains and remote controllers',
      'Brand pages for every distributed manufacturer',
      'Free consultation and project request flow',
      'Guides and articles that rank for smart home searches',
      'Mobile-first layout tuned for fast product browsing',
    ],
    stack: ['E-commerce', 'UI/UX', 'Responsive', 'SEO', 'Content'],
    results: [
      ['139', 'products live in three weeks'],
      ['+250%', 'consultation requests'],
      ['1.2s', 'load time on mobile'],
      ['Top 3', 'on Google for smart lock searches in Mashhad'],
    ],
  },
  {
    id: 'subchi',
    name: 'Subchi',
    url: 'https://subchi.ir',
    live: false, // site currently suspended; set true to show the link again
    kind: 'AI subtitle & transcription app',
    summary: 'Turns meetings, classes, podcasts and videos into editable text and ready-to-use subtitles.',
    did: [
      'Product brand, landing page and pricing pages',
      'Upload, progress and transcript editor screens',
      'Speech-to-text pipeline with a Persian language model',
      'Subtitle export in common formats',
      'Social media launch kit',
    ],
    stack: ['Next.js', 'Node.js', 'Speech AI', 'UI/UX', 'Branding'],
    results: [
      ['10,000+', 'hours of audio transcribed'],
      ['95%', 'transcription accuracy in Persian'],
      ['4×', 'faster subtitle turnaround'],
      ['+320%', 'sign-ups after the launch campaign'],
    ],
  },
];

// [file, name, big]: big logos take a 2×2 tile in the logo grid.
export const logos: [string, string, boolean?][] = [
  ['logo-gishot', 'Gishot', true],
  ['logo-sayna', 'Sayna Company'],
  ['logo-vatan', 'Vatan Polymer'],
  ['logo-theater', 'Theater Online', true],
  ['logo-rezvaniyon', 'Rezvaniyon News Agency'],
  ['logo-azizzadeh', 'Aboubakr Azizzadeh Dental Clinic'],
  ['logo-salor', 'Salor Furniture'],
  ['logo-paytakht', 'Mobile Paytakht'],
  ['logo-fakhraei', 'Fakhraei Dried Fruits'],
];

// [file, title, kind, width, height]
export const prints = [
  ['poster-aban', 'Aban', 'Film poster', 560, 700],
  ['catalog-vatan', 'Vatan Polymer', 'Product catalog', 1050, 700],
  ['poster-awakening', 'Awakening', 'Poster', 560, 700],
  ['book-kids', 'Children’s story book', 'Illustration & layout', 933, 700],
  ['poster-weapon', 'The Gentle Weapon', 'Poster', 560, 700],
  ['catalog-fortexa', 'Fortexa', 'Company catalog', 875, 700],
  ['poster-hope', 'Hope', 'Key visual', 1120, 700],
  ['book-blockchain', 'Blockchain Startup', 'Book cover', 966, 700],
  ['catalog-alphabet', 'City Alphabet', 'Catalog', 875, 700],
] as const;

export const team = [
  { name: 'Javad Ghased', role: 'Founder', photo: 'javad' },
  { name: 'Mohammadreza Akmali', role: 'Design & graphic lead', photo: 'mohammadreza', url: 'https://makmali.ir' },
  { name: 'Danial Naghavi', role: 'Tech lead', photo: 'danial' },
  { name: 'Hana Alavizade', role: 'Marketing & public relations', photo: null },
];
