export interface ServiceOffer {
  id: string;
  name: string;
  priceLabel: string;
  priceMin: number;
  priceMax?: number;
  summary: string;
  idealFor: string;
  timeline: string;
  includes: string[];
  note?: string;
  featured?: boolean;
}

export interface ServiceCategory {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  offers: ServiceOffer[];
}

export interface CarePlan {
  id: string;
  name: string;
  priceLabel: string;
  priceMin: number;
  summary: string;
  includes: string[];
}

export interface ServiceAddOn {
  name: string;
  priceLabel: string;
  detail: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'start',
    eyebrow: 'Start with clarity',
    title: 'Find the right-sized first move',
    summary:
      'Use a focused diagnostic when the problem is real but the right build is not obvious yet.',
    offers: [
      {
        id: 'fit-check',
        name: 'Free Fit Check',
        priceLabel: 'Free',
        priceMin: 0,
        summary:
          'A short conversation to define the problem, test fit, and decide whether a paid engagement makes sense.',
        idealFor: 'New inquiries and one clearly stated problem.',
        timeline: '20-minute call',
        includes: ['Problem framing', 'Fit and urgency check', 'Recommended next step']
      },
      {
        id: 'systems-map',
        name: 'Business Systems Map',
        priceLabel: '$250',
        priceMin: 250,
        summary:
          'A practical map of the tools, handoffs, and friction currently shaping the work.',
        idealFor: 'Businesses that know work is scattered but need a sensible order of operations.',
        timeline: '3–5 business days',
        includes: ['Current-state workflow map', 'Friction and risk notes', 'Prioritized action plan'],
        featured: true
      },
      {
        id: 'digital-health-review',
        name: 'Digital Health & Security Review',
        priceLabel: '$500',
        priceMin: 500,
        summary:
          'A configuration-level review of accounts, access, backups, domains, devices, and common exposure points.',
        idealFor: 'Small teams that want to clean up their digital foundation before adding more tools.',
        timeline: '5–7 business days',
        includes: ['Account and access inventory', 'Risk-ranked findings', 'Remediation checklist'],
        note: 'This is a practical systems review, not a penetration test or compliance audit.'
      },
      {
        id: 'rescue-session',
        name: 'Rescue Session',
        priceLabel: '$350 minimum',
        priceMin: 350,
        summary:
          'Focused diagnosis and recovery for a broken site, automation, account handoff, or connected workflow.',
        idealFor: 'Urgent, bounded problems with enough access and context to investigate safely.',
        timeline: 'Scheduled by urgency',
        includes: ['Triage and diagnosis', 'Bounded repair attempt', 'Findings and next-step note'],
        note: 'Final cost is confirmed before work expands beyond the initial session.'
      }
    ]
  },
  {
    id: 'digital-presence',
    eyebrow: 'Build the digital front door',
    title: 'Give customers a clear place to find, trust, and reach you',
    summary:
      'Every website package is responsive, accessible, connected to accounts you own, and built around a defined business action.',
    offers: [
      {
        id: 'digital-front-door',
        name: 'Digital Front Door',
        priceLabel: '$1,250',
        priceMin: 1250,
        summary:
          'A polished one-page presence that explains the business and gives customers a direct next step.',
        idealFor: 'New businesses, local operators, and simple service offerings.',
        timeline: '1–2 weeks',
        includes: ['Single responsive page', 'Contact path', 'Basic search and social metadata']
      },
      {
        id: 'connected-business-website',
        name: 'Connected Business Website',
        priceLabel: '$2,500',
        priceMin: 2500,
        summary:
          'A multi-page business website with clear services, trust signals, inquiry routing, and owner-ready handoff.',
        idealFor: 'Established small businesses ready for a credible, useful web presence.',
        timeline: '2–4 weeks',
        includes: ['Up to five core pages', 'Inquiry or booking connection', 'Analytics-ready foundation'],
        featured: true
      },
      {
        id: 'store-service-catalog',
        name: 'Store or Service Catalog',
        priceLabel: '$3,500–$7,500',
        priceMin: 3500,
        priceMax: 7500,
        summary:
          'A structured catalog or commerce-ready experience for products, services, inventory, or requests.',
        idealFor: 'Businesses that need customers to browse, select, request, or buy online.',
        timeline: '4–8 weeks',
        includes: ['Catalog structure', 'Search or filtering', 'Checkout or request workflow']
      },
      {
        id: 'secure-client-portal',
        name: 'Secure Client Portal',
        priceLabel: '$5,000–$10,000',
        priceMin: 5000,
        priceMax: 10000,
        summary:
          'A private client workspace for files, requests, project status, approvals, and controlled access.',
        idealFor: 'Service firms that need a safer, more organized client experience.',
        timeline: '6–10 weeks',
        includes: ['Role-based sign-in', 'Client workspace', 'Request and document workflows']
      }
    ]
  },
  {
    id: 'operations',
    eyebrow: 'Connect the operation',
    title: 'Make the systems behind the business work together',
    summary:
      'These builds connect information, tools, and approval points so less work falls between applications or lives only in one person’s head.',
    offers: [
      {
        id: 'connected-office',
        name: 'Connected Office Setup',
        priceLabel: '$900',
        priceMin: 900,
        summary:
          'A clean operational setup for shared files, business email, calendars, access, and dependable handoffs.',
        idealFor: 'Owner-led teams moving beyond scattered personal accounts and ad hoc sharing.',
        timeline: '1–2 weeks',
        includes: ['Account and folder structure', 'Access model', 'Owner handoff guide']
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        priceLabel: '$750–$1,250',
        priceMin: 750,
        priceMax: 1250,
        summary:
          'One bounded workflow automated across the tools you already use, with visible failure and review states.',
        idealFor: 'Repeated intake, follow-up, routing, reporting, or recordkeeping work.',
        timeline: '1–3 weeks',
        includes: ['Workflow design', 'One production automation', 'Runbook and recovery path']
      },
      {
        id: 'ai-knowledge-assistant',
        name: 'AI Knowledge Assistant',
        priceLabel: '$2,500–$4,000',
        priceMin: 2500,
        priceMax: 4000,
        summary:
          'A controlled assistant that can find, summarize, and route approved business knowledge.',
        idealFor: 'Teams with useful documents and recurring questions but fragmented retrieval.',
        timeline: '3–6 weeks',
        includes: ['Knowledge source design', 'Assistant interface', 'Guardrails and operator guide']
      },
      {
        id: 'managed-operations-system',
        name: 'Managed Operations System',
        priceLabel: '$5,000–$10,000',
        priceMin: 5000,
        priceMax: 10000,
        summary:
          'A connected operating layer spanning intake, client work, knowledge, approvals, and status reporting.',
        idealFor: 'Businesses ready to replace disconnected workflows with one coherent system.',
        timeline: '6–12 weeks',
        includes: ['Systems architecture', 'Connected workflows', 'Owner controls and operating runbook'],
        featured: true
      },
      {
        id: 'prototype-sprint',
        name: 'Prototype / R&D Sprint',
        priceLabel: '$2,500',
        priceMin: 2500,
        summary:
          'A time-boxed build to test a new workflow, interface, AI capability, or technical direction.',
        idealFor: 'High-uncertainty ideas that need evidence before a full build.',
        timeline: '2–3 weeks',
        includes: ['Experiment brief', 'Working prototype', 'Findings and go/no-go recommendation']
      },
      {
        id: 'custom-orchestration',
        name: 'Custom Orchestration',
        priceLabel: 'From $7,500',
        priceMin: 7500,
        summary:
          'A custom integration program for multi-system operations, specialized interfaces, or unusually complex constraints.',
        idealFor: 'Organizations whose core process cannot be solved by a single packaged build.',
        timeline: 'Scoped after systems mapping',
        includes: ['Architecture and delivery plan', 'Milestone-based implementation', 'Acceptance and handoff package']
      }
    ]
  }
];

export const carePlans: CarePlan[] = [
  {
    id: 'site-care',
    name: 'Site Care',
    priceLabel: '$100 / month',
    priceMin: 100,
    summary: 'Keep a Malone-built website healthy after launch.',
    includes: ['Routine updates', 'Availability checks', 'Monthly change allowance']
  },
  {
    id: 'connected-systems-care',
    name: 'Connected Systems Care',
    priceLabel: '$250 / month',
    priceMin: 250,
    summary: 'Maintain a site plus its forms, integrations, and automations.',
    includes: ['Site Care coverage', 'Integration checks', 'Priority troubleshooting']
  },
  {
    id: 'managed-operations-care',
    name: 'Managed Operations',
    priceLabel: '$500 / month',
    priceMin: 500,
    summary: 'Ongoing stewardship for a connected business system.',
    includes: ['System monitoring', 'Operational review', 'Planned improvement time']
  }
];

export const serviceAddOns: ServiceAddOn[] = [
  { name: 'Business email & domain setup', priceLabel: '$250', detail: 'Account, DNS, and handoff setup.' },
  { name: 'Booking & calendar connection', priceLabel: '$350', detail: 'One booking path with confirmation flow.' },
  { name: 'Structured intake form', priceLabel: '$300', detail: 'One routed customer or client intake.' },
  { name: 'Additional website page', priceLabel: '$150', detail: 'Using the approved page system.' },
  { name: 'Additional automation', priceLabel: 'From $750', detail: 'Scoped by systems and failure paths.' },
  { name: 'Owner or team training', priceLabel: '$250', detail: 'One focused live handoff session.' },
  { name: 'Content migration', priceLabel: '$75 / hour', detail: 'Existing copy, files, or catalog data.' },
  { name: 'QR / NFC connection', priceLabel: '$150 + materials', detail: 'One configured physical-to-digital path.' }
];

export const buyingTerms = [
  'Projects under $500 are paid in full before work begins.',
  'Standard projects use a 50% start payment and 50% completion payment.',
  'Projects over $5,000 use written milestones and milestone payments.',
  'Two revision rounds are included unless the proposal says otherwise.',
  'Third-party subscriptions, licenses, hardware, and transaction fees are paid directly by the client.',
  'You own your accounts, domains, data, and approved final deliverables.',
  'Final scope, timeline, and price are confirmed in writing before implementation begins.'
];

export const allPublicOffers = serviceCategories.flatMap((category) => category.offers);

