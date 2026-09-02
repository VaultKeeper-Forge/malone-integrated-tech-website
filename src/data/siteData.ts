export type Severity = 'production' | 'pilot' | 'research';

export interface Capability {
  id: string;
  title: string;
  description: string;
  status?: string;
  href: string;
  cta: string;
}

export interface ProcessStep {
  title: string;
  detail: string;
}

export interface ProofCase {
  title: string;
  summary: string;
  outcome: string;
  status: Severity;
  tags: string[];
}

export interface ResearchFocus {
  title: string;
  summary: string;
  constraints: string[];
  status: string;
}

export interface SiteCopy {
  brand: string;
  domain: string;
  hero: {
    eyebrow: string;
    line: string;
    detail: string;
    principles: string[];
  };
  capabilities: Capability[];
  process: ProcessStep[];
  proof: ProofCase[];
  research: ResearchFocus[];
}

export type FeaturedWorkKind = 'active-client' | 'owner-operated';

export type FeaturedWorkStage = 'live-wip' | 'active-build' | 'live-production' | 'complete';

export interface FeaturedWork {
  id: string;
  kind: FeaturedWorkKind;
  statusLabel: string;
  stage: FeaturedWorkStage;
  name: string;
  location: string;
  summary: string;
  currentNote: string;
  liveSurfaceNote: string;
  nextNote?: string;
  cta: string;
  url: string;
  linkLabel: string;
  tags: string[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    label: string;
    fallbackLabel: string;
  };
  frontSummary?: string;
  frontNote?: string;
}

export const siteCopy: SiteCopy = {
  brand: 'Malone Integrated Tech',
  domain: 'maloneintegratedtech.com',
  hero: {
    eyebrow: 'Websites + IT help + smarter systems',
    line: 'Websites, IT help, and smarter business systems.',
    detail:
      'From everyday computer problems to professional websites, connected tools, automation, and AI assistants, Malone Integrated Tech builds practical technology around the way you actually work.',
    principles: ['Clear scope', 'Straightforward pricing', 'You own your accounts and data']
  },
  capabilities: [
    {
      id: 'website',
      title: 'Build it',
      description:
        'Professional websites, rebuilds, updates, and client-facing digital experiences for local and home businesses.',
      status: 'Websites',
      href: '/services#digital-presence',
      cta: 'See website options'
    },
    {
      id: 'technology-help',
      title: 'Fix it',
      description:
        'Computer and device help, troubleshooting, setup, tune-ups, accounts, files, access, and in-home support.',
      status: 'Technology help',
      href: '/services#start',
      cta: 'Find the right first step'
    },
    {
      id: 'business-systems',
      title: 'Connect it',
      description:
        'Portals, workflow automation, AI, ForgeMesh, and custom business systems that connect the tools you already use.',
      status: 'Business systems',
      href: '/services#operations',
      cta: 'See connected systems'
    },
  ],
  process: [
    {
      title: 'Understand the problem',
      detail: 'We look at what is actually frustrating, broken, slow, or disconnected.'
    },
    {
      title: 'Build the smallest useful solution',
      detail: 'Website, setup, automation, AI assistant, or connected workflow - only what the job earns.'
    },
    {
      title: 'Hand you something you can use',
      detail: 'Clear scope, visible checkpoints, owner-held accounts, and a practical handoff.'
    }
  ],
  proof: [
    {
      title: 'Knowledge Assist Rollout',
      summary:
        'Pilot for operational knowledge routing and recurring triage where context is often fragmented.',
      outcome: 'Representative workflow for review; no public outcome claim yet.',
      status: 'pilot',
      tags: ['assistant systems', 'routing', 'handoff']
    },
    {
      title: 'Support Concierge Prototype',
      summary: 'Prototype handling for recurring support flows with strict escalation rules and guardrails.',
      outcome: 'Prototype direction for review; no public outcome claim yet.',
      status: 'research',
      tags: ['support', 'escalation', 'pilot protocol']
    },
    {
      title: 'Connector Reliability Layer',
      summary: 'Reference implementation for syncing project context across tool stacks.',
      outcome: 'Reference pattern for review; no public outcome claim yet.',
      status: 'production',
      tags: ['integration', 'observability', 'traceability']
    }
  ],
  research: [
    {
      title: 'Wearable AI',
      summary:
        'Signal-aware assistant pathways for ambient input streams and user state handoff.',
      constraints: [
        'No clinical or medical claims',
        'Clear user consent pathways',
        'Low-noise signal design'
      ],
      status: 'exploratory'
    },
    {
      title: 'Ambient Capture',
      summary: 'Context-first capture approaches with strict data governance and low-friction review.',
      constraints: ['Retention policy controls', 'Manual review checkpoints', 'Privacy audit notes'],
      status: 'exploratory'
    },
    {
      title: 'Human-AI Continuity',
      summary: 'Longitudinal behavior persistence for repeated context-heavy workflows.',
      constraints: ['Versioned memory snapshots', 'Replay-safe states', 'Decision auditability'],
      status: 'pilot'
    }
  ]
};

export const featuredWork: FeaturedWork[] = [
  {
    id: 'red-barons',
    kind: 'active-client',
    statusLabel: 'ACTIVE CLIENT / LIVE WIP',
    stage: 'live-wip',
    name: 'Red Barons Bit of Everything',
    location: 'Pine Grove, California',
    summary:
      'Building a new online home for a Pine Grove shop whose in-person experience feels like a museum.',
    currentNote:
      'The branded work-in-progress landing page is live now while the full online showroom continues to take shape.',
    liveSurfaceNote:
      'Live now: contact, directions, store information, and the in-store Google tour.',
    cta: 'View live work in progress',
    url: 'https://www.redbaronsbitofeverything.com/',
    linkLabel: 'View the Red Barons Bit of Everything live work-in-progress website — opens in a new tab.',
    tags: ['client website', 'small business', 'online showroom'],
    image: {
      src: '/clients/red-barons/red-barons-wip-home.webp',
      alt: 'Red Barons Bit of Everything work-in-progress homepage showing the shop logo and Coming Soon message.',
      width: 1440,
      height: 900,
      label: 'LIVE SURFACE',
      fallbackLabel: 'LIVE CLIENT WEBSITE'
    },
    frontSummary:
      'A new online home for a local Pine Grove shop, built to make the business easier to find, understand, and contact.',
    frontNote:
      'Active client work in progress. The live page already provides contact, directions, store information, and the in-store Google tour.'
  },
  {
    id: 'horizon-creations',
    kind: 'owner-operated',
    statusLabel: 'LIVE PRODUCTION / OWNER-OPERATED',
    stage: 'live-production',
    name: 'Horizon Creations',
    location: 'Northern California',
    summary:
      'A handmade leather business running on a custom public site with a private owner-side assistant and continuity layer behind it.',
    currentNote:
      'The production system connects product and inventory state, custom-work intake, social and contact routing, structured business records, and private assistant workflows while keeping the customer experience focused on the craft.',
    liveSurfaceNote:
      'Live now: custom responsive website, honest product and inventory states, custom-work routing, social connections, and secure production deployment.',
    nextNote:
      'Commerce is mapped but not activated. Shopify-backed checkout, inventory, shipping, returns, and order handling are the next gated phase.',
    cta: 'VIEW LIVE PRODUCTION SYSTEM',
    url: 'https://horizoncreations.art/',
    linkLabel: 'View the live Horizon Creations production website — opens in a new tab.',
    tags: [
      'owner-operated',
      'custom web',
      'private assistant',
      'continuity',
      'business systems',
      'social routing',
      'ecommerce next'
    ],
    image: {
      src: '/systems/horizon/horizon-creations-live.webp',
      alt: 'Horizon Creations handmade leather website running as a live Malone owner-operated system.',
      width: 1035,
      height: 846,
      label: 'LIVE PRODUCTION',
      fallbackLabel: 'OWNER-OPERATED SYSTEM'
    },
    frontSummary:
      'A live owner-operated business website connected to real product, contact, custom-work, and private assistant workflows.',
    frontNote:
      'Live production system. Commerce is mapped but not activated.'
  }
];
