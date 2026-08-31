export type Severity = 'production' | 'pilot' | 'research';

import { allPublicOffers } from './serviceData';

export interface Capability {
  title: string;
  description: string;
  status?: string;
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
    support: string;
    primaryAction: string;
    secondaryAction: string;
    principles: string[];
  };
  capabilities: Capability[];
  process: ProcessStep[];
  proof: ProofCase[];
  research: ResearchFocus[];
}

export interface HomepageServicePath {
  id: string;
  title: string;
  priceLabel: string;
  meaning: string;
  sourceOfferIds: string[];
}

export interface HomepageOutcome {
  title: string;
  detail: string;
}

export interface HomepageClientStep {
  title: string;
  detail: string;
}

const offerById = new Map(allPublicOffers.map((offer) => [offer.id, offer]));

function requireOffer(id: string) {
  const offer = offerById.get(id);
  if (!offer) throw new Error(`Missing homepage service source: ${id}`);
  return offer;
}

const localSupport = requireOffer('local-onsite-it-support');
const fitCheck = requireOffer('fit-check');
const systemsMap = requireOffer('systems-map');
const digitalFrontDoor = requireOffer('digital-front-door');

export const homepageServicePaths: HomepageServicePath[] = [
  {
    id: 'local-help',
    title: 'Local technology help',
    priceLabel: localSupport.priceLabel,
    meaning:
      'Hands-on help for computers, printers, Wi-Fi, devices, accounts, backups, and setup.',
    sourceOfferIds: [localSupport.id]
  },
  {
    id: 'right-first-move',
    title: 'Find the right first move',
    priceLabel: `${fitCheck.priceLabel} or ${systemsMap.priceLabel} Systems Map`,
    meaning: 'Define the problem before buying a larger build.',
    sourceOfferIds: [fitCheck.id, systemsMap.id]
  },
  {
    id: 'build-or-connect',
    title: 'Build or connect the operation',
    priceLabel: `From ${digitalFrontDoor.priceLabel}`,
    meaning:
      'Websites, forms, workflows, assistants, portals, and connected operating systems.',
    sourceOfferIds: [digitalFrontDoor.id]
  }
];

export const homepageOutcomes: HomepageOutcome[] = [
  {
    title: 'Keep the work findable',
    detail:
      'Organize the files, decisions, requests, and operating notes the work depends on.'
  },
  {
    title: 'Make the tools pass information correctly',
    detail:
      'Connect forms, calendars, email, websites, and approved automations around the workflow already in use.'
  },
  {
    title: 'Keep people in control',
    detail:
      'Use clear ownership, review points, and recovery paths instead of invisible automation.'
  }
];

export const homepageClientSteps: HomepageClientStep[] = [
  {
    title: 'Tell us what is not working.',
    detail: 'Start with the immediate problem, the tools involved, and the useful outcome.'
  },
  {
    title: 'See the boundary before work begins.',
    detail:
      'Malone confirms the scope, starting price, responsibilities, and known third-party costs in writing.'
  },
  {
    title: 'Review visible checkpoints.',
    detail: 'Consequential changes and scope expansion require clear review and approval.'
  },
  {
    title: 'Own the result.',
    detail:
      'Receive the approved deliverables, account ownership, and practical operating notes needed for handoff.'
  }
];

export interface ActiveClient {
  status: string;
  name: string;
  location: string;
  summary: string;
  currentNote: string;
  liveSurfaceNote: string;
  cta: string;
  url: string;
  tags: string[];
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const siteCopy: SiteCopy = {
  brand: 'Malone Integrated Tech',
  domain: 'maloneintegratedtech.com',
  hero: {
    eyebrow: 'Technology systems for homes and small businesses',
    line: 'Technology that works together—and keeps the work moving.',
    detail:
      'Malone Integrated Tech solves local technology problems and builds connected websites, workflows, and assistant systems for people and small businesses.',
    support:
      'From an on-site support visit to a connected business system, we start with the smallest useful move and expand only when the next layer earns its place.',
    primaryAction: 'See services & starting prices',
    secondaryAction: 'Request a fit check',
    principles: ['Clear scope', 'Human approval', 'Accounts you own']
  },
  capabilities: [
    {
      title: 'Systems Architecture',
      description:
        'Assistant systems, context architecture, continuity, and knowledge systems shaped around the way work actually moves.'
    },
    {
      title: 'Human-AI Integration',
      description:
        'Practical AI deployment, human oversight, interfaces, and workflows that stay understandable to the people using them.'
    },
    {
      title: 'Workflow & Tool Integration',
      description:
        'Applications, automation, connectors, and existing business systems joined through reliable integration patterns.'
    },
  ],
  process: [
    {
      title: 'Capture',
      detail: 'Map source channels, owners, and consent boundaries before integration begins.'
    },
    {
      title: 'Context',
      detail: 'Resolve ambiguity through versioned context and explicit fallback states.'
    },
    {
      title: 'Tools',
      detail: 'Compose calibrated tool chains with explicit ownership and deterministic handoffs.'
    },
    {
      title: 'Action',
      detail: 'Execute with visible approval gates and auditable transition points.'
    },
    {
      title: 'Continuity',
      detail: 'Persist state safely so operations remain stable across long conversations.'
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

export const activeClients: ActiveClient[] = [
  {
    status: 'ACTIVE CLIENT / LIVE WIP',
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
    tags: ['client website', 'small business', 'online showroom'],
    image: {
      src: '/clients/red-barons/red-barons-wip-home.webp',
      alt: 'Red Barons Bit of Everything work-in-progress homepage showing the shop logo and Coming Soon message.',
      width: 1440,
      height: 900
    }
  }
];
