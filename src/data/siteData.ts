export type Severity = 'production' | 'pilot' | 'research';

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

export interface ServiceTile {
  title: string;
  summary: string;
  deliverables: string[];
  cadence: string;
}

export interface SiteCopy {
  brand: string;
  domain: string;
  hero: {
    line: string;
    detail: string;
  };
  capabilities: Capability[];
  process: ProcessStep[];
  proof: ProofCase[];
  research: ResearchFocus[];
  services: ServiceTile[];
}

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
    line: 'Integrated Assistant Systems for People and Small Businesses',
    detail:
      'From context capture to continuity-aware action, we build integrated assistant systems for practical people-first workflows.'
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
  ],
  services: [
    {
      title: 'Discovery + Systems Map',
      summary:
        'A practical mapping of current workflows, tools, and friction points before implementation.',
      deliverables: ['Workflow map', 'Risk log', 'Priority roadmap'],
      cadence: '2â€“4 weeks'
    },
    {
      title: 'Assistant Integration Build',
      summary:
        'Develop production-ready assistant workflows with operational guardrails and onboarding documentation.',
      deliverables: ['Tool contracts', 'Fallback matrix', 'Runbook'],
      cadence: '4â€“8 weeks'
    },
    {
      title: 'R&D Cohort Support',
      summary:
        'Experimental track for wearable, continuity, and ambient-capture work under review controls.',
      deliverables: ['Experiment protocol', 'Evaluation artifacts', 'Decision summary'],
      cadence: '3â€“6 weeks'
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

