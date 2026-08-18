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
      title: 'Integrated Assistant Systems',
      description:
        'Design and configure assistants that orchestrate work across communication, calendar, and document systems.'
    },
    {
      title: 'Small Business AI Integration',
      description:
        'Deploy practical AI that reduces repetitive overhead while preserving existing team patterns.'
    },
    {
      title: 'Workflow & Tool Integration',
      description:
        'Connect applications and services through reliable integration patterns with versioned interfaces.'
    },
    {
      title: 'Context and Continuity Systems',
      description:
        'Build durable context and continuity layers so teams maintain consistent execution over time.'
    },
    {
      title: 'Applied AI Solutions',
      description:
        'Pilot, evaluate, and harden production-ready AI implementations with transparent tradeoff logs.'
    }
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
      outcome: 'Reduced handoff latency and cleaner action tracking across teams.',
      status: 'pilot',
      tags: ['assistant systems', 'routing', 'handoff']
    },
    {
      title: 'Support Concierge Prototype',
      summary: 'Prototype handling for recurring support flows with strict escalation rules and guardrails.',
      outcome: 'Faster response consistency in routine cases and safer escalation behavior.',
      status: 'research',
      tags: ['support', 'escalation', 'pilot protocol']
    },
    {
      title: 'Connector Reliability Layer',
      summary: 'Reference implementation for syncing project context across tool stacks.',
      outcome: 'Traceable action state and easier maintenance during system changes.',
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
      cadence: '2–4 weeks'
    },
    {
      title: 'Assistant Integration Build',
      summary:
        'Develop production-ready assistant workflows with operational guardrails and onboarding documentation.',
      deliverables: ['Tool contracts', 'Fallback matrix', 'Runbook'],
      cadence: '4–8 weeks'
    },
    {
      title: 'R&D Cohort Support',
      summary:
        'Experimental track for wearable, continuity, and ambient-capture work under review controls.',
      deliverables: ['Experiment protocol', 'Evaluation artifacts', 'Decision summary'],
      cadence: '3–6 weeks'
    }
  ]
};
