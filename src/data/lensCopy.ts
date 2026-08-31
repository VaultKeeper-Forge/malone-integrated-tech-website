export interface LensCopyEntry {
  key: string;
  region: 'navigation' | 'hero' | 'services' | 'outcomes' | 'working' | 'capabilities' | 'process' | 'research' | 'proof' | 'contact' | 'footer';
  technical: string;
  everyday: string;
}

export const lensPrototypeCopy: LensCopyEntry[] = [
  {
    key: 'home.hero.eyebrow',
    region: 'hero',
    technical: 'Technology systems for homes and small businesses',
    everyday: 'Technology help and connected systems for homes and small businesses'
  },
  {
    key: 'home.hero.heading',
    region: 'hero',
    technical: 'Technology that works together—and keeps the work moving.',
    everyday: 'Technology that works together—and helps you keep going.'
  },
  {
    key: 'home.hero.detail',
    region: 'hero',
    technical:
      'Malone Integrated Tech solves local technology problems and builds connected websites, workflows, and assistant systems for people and small businesses.',
    everyday:
      'We solve everyday technology problems and build websites, workflows, and assistant tools for people and small businesses.'
  },
  {
    key: 'home.hero.support',
    region: 'hero',
    technical:
      'From an on-site support visit to a connected business system, we start with the smallest useful move and expand only when the next layer earns its place.',
    everyday:
      'Start with one useful fix. Add more only when it is worth it.'
  },
  {
    key: 'home.services.eyebrow',
    region: 'services',
    technical: 'Services & Starting Prices',
    everyday: 'Ways we can help and what they start at'
  },
  {
    key: 'home.services.heading',
    region: 'services',
    technical: 'Start with the smallest useful move',
    everyday: 'Choose the simplest useful place to begin'
  },
  {
    key: 'home.services.detail',
    region: 'services',
    technical:
      'Choose local hands-on help, define the right first step, or build a connected system around the work that needs to move.',
    everyday:
      'Get help in person, figure out the right first step, or build a system that connects the work.'
  },
  {
    key: 'home.services.local.heading',
    region: 'services',
    technical: 'Local technology help',
    everyday: 'Hands-on technology help nearby'
  },
  {
    key: 'home.services.local.detail',
    region: 'services',
    technical:
      'Hands-on help for computers, printers, Wi-Fi, devices, accounts, backups, and setup.',
    everyday:
      'Get in-person help with computers, printers, Wi-Fi, devices, accounts, backups, and setup.'
  },
  {
    key: 'home.services.first-move.heading',
    region: 'services',
    technical: 'Find the right first move',
    everyday: 'Figure out what to do first'
  },
  {
    key: 'home.services.first-move.detail',
    region: 'services',
    technical: 'Define the problem before buying a larger build.',
    everyday: 'Understand the problem before paying for a bigger project.'
  },
  {
    key: 'home.services.build.heading',
    region: 'services',
    technical: 'Build or connect the operation',
    everyday: 'Build or connect the way the business runs'
  },
  {
    key: 'home.services.build.detail',
    region: 'services',
    technical:
      'Websites, forms, workflows, assistants, portals, and connected operating systems.',
    everyday:
      'Build websites, forms, workflows, assistants, private workspaces, and connected business systems.'
  },
  {
    key: 'home.services.action',
    region: 'services',
    technical: 'Compare all services and prices',
    everyday: 'See every service and starting price'
  },
  {
    key: 'home.outcomes.eyebrow',
    region: 'outcomes',
    technical: 'Customer Outcomes',
    everyday: 'What gets better'
  },
  {
    key: 'home.outcomes.heading',
    region: 'outcomes',
    technical: 'Less searching. Fewer broken handoffs. Clearer ownership.',
    everyday: 'Find things faster. Lose fewer details. Know who owns what.'
  },
  {
    key: 'home.outcomes.detail',
    region: 'outcomes',
    technical:
      'The goal is practical: make important work easier to find, move, review, and hand off.',
    everyday:
      'Make important work easier to find, complete, check, and pass to the next person.'
  },
  {
    key: 'home.outcomes.findable.heading',
    region: 'outcomes',
    technical: 'Keep the work findable',
    everyday: 'Keep important work easy to find'
  },
  {
    key: 'home.outcomes.findable.detail',
    region: 'outcomes',
    technical:
      'Organize the files, decisions, requests, and operating notes the work depends on.',
    everyday:
      'Keep the files, decisions, requests, and notes together so people can find them.'
  },
  {
    key: 'home.outcomes.handoffs.heading',
    region: 'outcomes',
    technical: 'Make the tools pass information correctly',
    everyday: 'Help your tools share the right information'
  },
  {
    key: 'home.outcomes.handoffs.detail',
    region: 'outcomes',
    technical:
      'Connect forms, calendars, email, websites, and approved automations around the workflow already in use.',
    everyday:
      'Connect forms, calendars, email, websites, and approved automations around the way you already work.'
  },
  {
    key: 'home.outcomes.control.heading',
    region: 'outcomes',
    technical: 'Keep people in control',
    everyday: 'Keep people in charge'
  },
  {
    key: 'home.outcomes.control.detail',
    region: 'outcomes',
    technical:
      'Use clear ownership, review points, and recovery paths instead of invisible automation.',
    everyday:
      'Make ownership, check-ins, and recovery clear instead of hiding decisions inside automation.'
  },
  {
    key: 'home.working.eyebrow',
    region: 'working',
    technical: 'Working Together',
    everyday: 'What working together looks like'
  },
  {
    key: 'home.working.heading',
    region: 'working',
    technical: 'How clients work with Malone',
    everyday: 'How we work with you'
  },
  {
    key: 'home.working.detail',
    region: 'working',
    technical: 'The work stays understandable from the first problem through the final handoff.',
    everyday: 'You can follow the work from the first problem to the final handoff.'
  },
  {
    key: 'home.working.problem.heading',
    region: 'working',
    technical: 'Tell us what is not working.',
    everyday: 'Tell us where things are getting stuck.'
  },
  {
    key: 'home.working.problem.detail',
    region: 'working',
    technical: 'Start with the immediate problem, the tools involved, and the useful outcome.',
    everyday: 'Share the problem, the tools involved, and what would make things better.'
  },
  {
    key: 'home.working.boundary.heading',
    region: 'working',
    technical: 'See the boundary before work begins.',
    everyday: 'Know the boundary before work starts.'
  },
  {
    key: 'home.working.boundary.detail',
    region: 'working',
    technical:
      'Malone confirms the scope, starting price, responsibilities, and known third-party costs in writing.',
    everyday:
      'We put the scope, starting price, responsibilities, and known outside costs in writing.'
  },
  {
    key: 'home.working.checkpoints.heading',
    region: 'working',
    technical: 'Review visible checkpoints.',
    everyday: 'Review clear checkpoints.'
  },
  {
    key: 'home.working.checkpoints.detail',
    region: 'working',
    technical: 'Consequential changes and scope expansion require clear review and approval.',
    everyday: 'Important changes and added work need clear review and approval.'
  },
  {
    key: 'home.working.ownership.heading',
    region: 'working',
    technical: 'Own the result.',
    everyday: 'Keep what was built for you.'
  },
  {
    key: 'home.working.ownership.detail',
    region: 'working',
    technical:
      'Receive the approved deliverables, account ownership, and practical operating notes needed for handoff.',
    everyday:
      'Receive the approved work, ownership of your accounts, and useful notes for taking over.'
  },
  {
    key: 'home.projects-route.eyebrow',
    region: 'proof',
    technical: 'Projects & Proof',
    everyday: 'Work and examples'
  },
  {
    key: 'home.projects-route.heading',
    region: 'proof',
    technical: 'See current work and honest project status',
    everyday: 'See what is active, being tested, or still being explored'
  },
  {
    key: 'home.projects-route.detail',
    region: 'proof',
    technical:
      'Live client work, pilots, and research are labeled separately so you can see what is active, what is being tested, and what remains exploratory.',
    everyday:
      'We label client work, small trials, and research clearly so you know what is ready and what is still being explored.'
  },
  {
    key: 'home.projects-route.action',
    region: 'proof',
    technical: 'View projects & proof',
    everyday: 'See projects and examples'
  },
  {
    key: 'home.capabilities.eyebrow',
    region: 'capabilities',
    technical: 'What We Build',
    everyday: 'What we can help with'
  },
  {
    key: 'home.capabilities.heading',
    region: 'capabilities',
    technical: 'Capabilities engineered for real workflows',
    everyday: 'AI tools built around how you work'
  },
  {
    key: 'home.capabilities.detail',
    region: 'capabilities',
    technical:
      'No generic assistant layer. We build systems around how people and small teams already work, then make the connections durable.',
    everyday:
      'We organize the tools and information you already use, then connect them so fewer details get lost.'
  },
  {
    key: 'home.capabilities.architecture.heading',
    region: 'capabilities',
    technical: 'Systems Architecture',
    everyday: 'Organize your information'
  },
  {
    key: 'home.capabilities.architecture.detail',
    region: 'capabilities',
    technical:
      'Assistant systems, context architecture, continuity, and knowledge systems shaped around the way work actually moves.',
    everyday:
      'We design the structure behind your assistant so it can find the right information, remember what matters, and follow how your work moves.'
  },
  {
    key: 'home.capabilities.human-ai.heading',
    region: 'capabilities',
    technical: 'Human-AI Integration',
    everyday: 'AI with human control'
  },
  {
    key: 'home.capabilities.human-ai.detail',
    region: 'capabilities',
    technical:
      'Practical AI deployment, human oversight, interfaces, and workflows that stay understandable to the people using them.',
    everyday:
      'We put AI into your day-to-day work with clear human control and tools people can actually understand.'
  },
  {
    key: 'home.capabilities.integration.heading',
    region: 'capabilities',
    technical: 'Workflow & Tool Integration',
    everyday: 'Connect your tools'
  },
  {
    key: 'home.capabilities.integration.detail',
    region: 'capabilities',
    technical:
      'Applications, automation, connectors, and existing business systems joined through reliable integration patterns.',
    everyday:
      'We join your apps, automations, and business systems so information moves reliably instead of falling through the cracks.'
  },
  {
    key: 'home.process.eyebrow',
    region: 'process',
    technical: 'How It Works',
    everyday: 'How it comes together'
  },
  {
    key: 'home.process.heading',
    region: 'process',
    technical: 'How the system moves',
    everyday: 'Information into action'
  },
  {
    key: 'home.process.detail',
    region: 'process',
    technical:
      'A controlled signal path from raw input to useful work that stays coherent over time.',
    everyday:
      'We gather what matters, understand it, connect the right tools, and keep work moving.'
  },
  {
    key: 'home.process.capture.heading',
    region: 'process',
    technical: 'Capture',
    everyday: 'Gather'
  },
  {
    key: 'home.process.capture.detail',
    region: 'process',
    technical: 'Map source channels, owners, and consent boundaries before integration begins.',
    everyday:
      'Identify where important information comes from, who owns it, and what should be saved.'
  },
  {
    key: 'home.process.context.heading',
    region: 'process',
    technical: 'Context',
    everyday: 'Understand'
  },
  {
    key: 'home.process.context.detail',
    region: 'process',
    technical: 'Resolve ambiguity through versioned context and explicit fallback states.',
    everyday:
      'Work out what the information means and what to do when something is unclear.'
  },
  {
    key: 'home.process.tools.heading',
    region: 'process',
    technical: 'Tools',
    everyday: 'Connect'
  },
  {
    key: 'home.process.tools.detail',
    region: 'process',
    technical:
      'Compose calibrated tool chains with explicit ownership and deterministic handoffs.',
    everyday:
      'Bring the right apps and automations together with clear responsibility at every handoff.'
  },
  {
    key: 'home.process.action.heading',
    region: 'process',
    technical: 'Action',
    everyday: 'Follow through'
  },
  {
    key: 'home.process.action.detail',
    region: 'process',
    technical: 'Execute with visible approval gates and auditable transition points.',
    everyday:
      'Complete the work with visible approval points and a clear record of what changed.'
  },
  {
    key: 'home.process.continuity.heading',
    region: 'process',
    technical: 'Continuity',
    everyday: 'Pick up where you left off'
  },
  {
    key: 'home.process.continuity.detail',
    region: 'process',
    technical:
      'Persist state safely so operations remain stable across long conversations.',
    everyday:
      'Save the right working state so the system stays useful across long projects and conversations.'
  },
  {
    key: 'home.hero.status',
    region: 'hero',
    technical: 'Systems aligned',
    everyday: 'Everything connected'
  },
  {
    key: 'home.hero.system-label',
    region: 'hero',
    technical: 'Technology systems for homes and small businesses',
    everyday: 'Technology help and connected systems for homes and small businesses'
  },
  {
    key: 'home.hero.primary-action',
    region: 'hero',
    technical: 'See services & starting prices',
    everyday: 'See services and starting prices'
  },
  {
    key: 'home.hero.secondary-action',
    region: 'hero',
    technical: 'Request a fit check',
    everyday: 'Ask if Malone is a fit'
  },
  {
    key: 'home.hero.principle.human',
    region: 'hero',
    technical: 'Clear scope',
    everyday: 'Know what is included'
  },
  {
    key: 'home.hero.principle.context',
    region: 'hero',
    technical: 'Human approval',
    everyday: 'People approve important changes'
  },
  {
    key: 'home.hero.principle.continuity',
    region: 'hero',
    technical: 'Accounts you own',
    everyday: 'Keep control of your accounts'
  },
  {
    key: 'home.hero.scroll-cue',
    region: 'hero',
    technical: 'Explore service paths',
    everyday: 'See where to start'
  },
  {
    key: 'home.process.input-label',
    region: 'process',
    technical: 'Input',
    everyday: 'What comes in'
  },
  {
    key: 'home.process.output-label',
    region: 'process',
    technical: 'Sustained execution',
    everyday: 'Work keeps moving'
  },
  {
    key: 'home.research.heading',
    region: 'research',
    technical: 'Research with engineering discipline',
    everyday: 'Research that makes AI more useful'
  },
  {
    key: 'home.research.detail',
    region: 'research',
    technical:
      'Focused investigation into how assistants can stay present, useful, and accountable across longer human relationships.',
    everyday:
      'We study how assistants can remain useful over time while people stay informed and in control.'
  },
  {
    key: 'home.research.wearable.heading',
    region: 'research',
    technical: 'Wearable AI',
    everyday: 'AI that moves with you'
  },
  {
    key: 'home.research.wearable.detail',
    region: 'research',
    technical: 'Signal-aware assistant pathways for ambient input streams and user state handoff.',
    everyday:
      'Ways for an assistant to notice useful information around you and remember it from one moment to the next.'
  },
  {
    key: 'home.research.ambient.heading',
    region: 'research',
    technical: 'Ambient Capture',
    everyday: 'Useful context around you'
  },
  {
    key: 'home.research.ambient.detail',
    region: 'research',
    technical: 'Context-first capture approaches with strict data governance and low-friction review.',
    everyday: 'Ways to collect useful information with clear privacy controls and an easy review process.'
  },
  {
    key: 'home.research.continuity.heading',
    region: 'research',
    technical: 'Human-AI Continuity',
    everyday: 'An assistant that remembers'
  },
  {
    key: 'home.research.continuity.detail',
    region: 'research',
    technical: 'Longitudinal behavior persistence for repeated context-heavy workflows.',
    everyday: 'Ways for assistants to remember what matters across repeated tasks and longer projects.'
  },
  {
    key: 'home.proof.heading',
    region: 'proof',
    technical: 'Systems in practice',
    everyday: 'Real examples of AI at work'
  },
  {
    key: 'home.proof.detail',
    region: 'proof',
    technical:
      'Representative systems, prototypes, and integration patterns shown honestly at their current stage.',
    everyday:
      'Examples of systems we are building and testing, each labeled clearly so you know what is ready and what is still being explored.'
  },
  {
    key: 'home.proof.knowledge.heading',
    region: 'proof',
    technical: 'Knowledge Assist Rollout',
    everyday: 'Find team knowledge'
  },
  {
    key: 'home.proof.knowledge.detail',
    region: 'proof',
    technical:
      'Pilot for operational knowledge routing and recurring triage where context is often fragmented.',
    everyday:
      'A small trial that helps teams find useful workplace information and answer repeated questions without losing the thread.'
  },
  {
    key: 'home.proof.knowledge.outcome',
    region: 'proof',
    technical: 'Representative workflow for review; no public outcome claim yet.',
    everyday: 'This example is still under review. We are not claiming public results yet.'
  },
  {
    key: 'home.proof.support.heading',
    region: 'proof',
    technical: 'Support Concierge Prototype',
    everyday: 'Get customers the right help'
  },
  {
    key: 'home.proof.support.detail',
    region: 'proof',
    technical: 'Prototype handling for recurring support flows with strict escalation rules and guardrails.',
    everyday:
      'An early version that handles common support requests and brings in a person when needed.'
  },
  {
    key: 'home.proof.support.outcome',
    region: 'proof',
    technical: 'Prototype direction for review; no public outcome claim yet.',
    everyday: 'This early version is still under review. We are not claiming public results yet.'
  },
  {
    key: 'home.proof.connector.heading',
    region: 'proof',
    technical: 'Connector Reliability Layer',
    everyday: 'Keep tools in sync'
  },
  {
    key: 'home.proof.connector.detail',
    region: 'proof',
    technical: 'Reference implementation for syncing project context across tool stacks.',
    everyday: 'A working example that keeps project information up to date across connected tools.'
  },
  {
    key: 'home.proof.connector.outcome',
    region: 'proof',
    technical: 'Reference pattern for review; no public outcome claim yet.',
    everyday: 'This working pattern is still under review. We are not claiming public results yet.'
  },
  {
    key: 'home.proof.note-label',
    region: 'proof',
    technical: 'Current note',
    everyday: 'What this means'
  },
  {
    key: 'home.contact.eyebrow',
    region: 'contact',
    technical: 'Start a conversation',
    everyday: 'Tell us what you need'
  },
  {
    key: 'home.contact.heading',
    region: 'contact',
    technical: 'Have a system that is not working together?',
    everyday: 'Where is your work getting stuck?'
  },
  {
    key: 'home.contact.detail',
    region: 'contact',
    technical:
      'Let us map the friction, align the tools, and define a practical path from scattered signals to sustained execution.',
    everyday:
      'We help find the problem, connect the pieces, and choose the next step.'
  },
  {
    key: 'home.contact.action',
    region: 'contact',
    technical: 'Map your system',
    everyday: 'Start here'
  },
  {
    key: 'home.footer.system-label',
    region: 'footer',
    technical: 'Integrated assistant systems',
    everyday: 'AI tools that work together'
  },
  {
    key: 'home.navigation.capabilities',
    region: 'navigation',
    technical: 'Capabilities',
    everyday: 'What we do'
  },
  {
    key: 'home.navigation.process',
    region: 'navigation',
    technical: 'Process',
    everyday: 'How it works'
  },
  {
    key: 'home.navigation.research-short',
    region: 'navigation',
    technical: 'R&D',
    everyday: 'Research'
  },
  {
    key: 'home.navigation.research',
    region: 'navigation',
    technical: 'Research & Development',
    everyday: 'What we are exploring'
  },
  {
    key: 'home.navigation.work',
    region: 'navigation',
    technical: 'Current Work',
    everyday: 'Examples'
  },
  {
    key: 'home.navigation.services',
    region: 'navigation',
    technical: 'Services',
    everyday: 'Ways we can help'
  },
  {
    key: 'home.navigation.contact',
    region: 'navigation',
    technical: 'Start a project',
    everyday: 'Tell us what you need'
  },
  {
    key: 'home.capabilities.status',
    region: 'capabilities',
    technical: 'Ready',
    everyday: 'Ready to help'
  },
  {
    key: 'home.research.status.exploratory',
    region: 'research',
    technical: 'exploratory',
    everyday: 'early research'
  },
  {
    key: 'home.status.pilot',
    region: 'research',
    technical: 'pilot',
    everyday: 'small trial'
  },
  {
    key: 'home.proof.status.research',
    region: 'proof',
    technical: 'research',
    everyday: 'early version'
  },
  {
    key: 'home.proof.status.production',
    region: 'proof',
    technical: 'production',
    everyday: 'working system'
  },
  {
    key: 'home.research.constraint.medical',
    region: 'research',
    technical: 'No clinical or medical claims',
    everyday: 'Safety'
  },
  {
    key: 'home.research.constraint.consent',
    region: 'research',
    technical: 'Clear user consent pathways',
    everyday: 'Choice'
  },
  {
    key: 'home.research.constraint.signal',
    region: 'research',
    technical: 'Low-noise signal design',
    everyday: 'Signals'
  },
  {
    key: 'home.research.constraint.retention',
    region: 'research',
    technical: 'Retention policy controls',
    everyday: 'Storage'
  },
  {
    key: 'home.research.constraint.review',
    region: 'research',
    technical: 'Manual review checkpoints',
    everyday: 'Review'
  },
  {
    key: 'home.research.constraint.privacy',
    region: 'research',
    technical: 'Privacy audit notes',
    everyday: 'Privacy'
  },
  {
    key: 'home.research.constraint.memory',
    region: 'research',
    technical: 'Versioned memory snapshots',
    everyday: 'Memory'
  },
  {
    key: 'home.research.constraint.replay',
    region: 'research',
    technical: 'Replay-safe states',
    everyday: 'Recovery'
  },
  {
    key: 'home.research.constraint.decisions',
    region: 'research',
    technical: 'Decision auditability',
    everyday: 'Decisions'
  },
  {
    key: 'home.proof.frame.1',
    region: 'proof',
    technical: 'Case frame / 01',
    everyday: 'Example / 01'
  },
  {
    key: 'home.proof.frame.2',
    region: 'proof',
    technical: 'Case frame / 02',
    everyday: 'Example / 02'
  },
  {
    key: 'home.proof.frame.3',
    region: 'proof',
    technical: 'Case frame / 03',
    everyday: 'Example / 03'
  },
  {
    key: 'home.proof.tag.assistant-systems',
    region: 'proof',
    technical: 'assistant systems',
    everyday: 'AI assistance'
  },
  {
    key: 'home.proof.tag.routing',
    region: 'proof',
    technical: 'routing',
    everyday: 'send to the right place'
  },
  {
    key: 'home.proof.tag.handoff',
    region: 'proof',
    technical: 'handoff',
    everyday: 'smooth handoffs'
  },
  {
    key: 'home.proof.tag.support',
    region: 'proof',
    technical: 'support',
    everyday: 'customer help'
  },
  {
    key: 'home.proof.tag.escalation',
    region: 'proof',
    technical: 'escalation',
    everyday: 'bring in a person'
  },
  {
    key: 'home.proof.tag.pilot-protocol',
    region: 'proof',
    technical: 'pilot protocol',
    everyday: 'small trial plan'
  },
  {
    key: 'home.proof.tag.integration',
    region: 'proof',
    technical: 'integration',
    everyday: 'connected tools'
  },
  {
    key: 'home.proof.tag.observability',
    region: 'proof',
    technical: 'observability',
    everyday: 'visible health'
  },
  {
    key: 'home.proof.tag.traceability',
    region: 'proof',
    technical: 'traceability',
    everyday: 'clear history'
  },
  {
    key: 'home.contact.status',
    region: 'contact',
    technical: 'Channel open',
    everyday: 'Ready when you are'
  }
];

lensPrototypeCopy.push(
  {
    key: 'home-active-client-status', region: 'proof', technical: 'ACTIVE CLIENT / LIVE WIP',
    everyday: 'A client project currently being built'
  },
  {
    key: 'home-active-client-summary', region: 'proof',
    technical: 'Building a new online home for a Pine Grove shop whose in-person experience feels like a museum.',
    everyday: 'We are helping this local shop turn its one-of-a-kind in-store experience into a website people can understand and use.'
  },
  {
    key: 'home-active-client-note', region: 'proof',
    technical: 'The branded work-in-progress landing page is live now while the full online showroom continues to take shape.',
    everyday: 'A simple first page is live now. The full online store is still being built.'
  },
  {
    key: 'home-active-client-live-surface', region: 'proof',
    technical: 'Live now: contact, directions, store information, and the in-store Google tour.',
    everyday: 'People can already call, get directions, check the shop information, and look around the store online.'
  },
  {
    key: 'home-active-client-cta', region: 'proof', technical: 'View live work in progress',
    everyday: 'See the site being built'
  },
  {
    key: 'projects-active-client-status', region: 'proof', technical: 'ACTIVE CLIENT / LIVE WIP',
    everyday: 'A client project currently being built'
  },
  {
    key: 'projects-active-client-summary', region: 'proof',
    technical: 'Building a new online home for a Pine Grove shop whose in-person experience feels like a museum.',
    everyday: 'We are helping this local shop turn its one-of-a-kind in-store experience into a website people can understand and use.'
  },
  {
    key: 'projects-active-client-note', region: 'proof',
    technical: 'The branded work-in-progress landing page is live now while the full online showroom continues to take shape.',
    everyday: 'A simple first page is live now. The full online store is still being built.'
  },
  {
    key: 'projects-active-client-live-surface', region: 'proof',
    technical: 'Live now: contact, directions, store information, and the in-store Google tour.',
    everyday: 'People can already call, get directions, check the shop information, and look around the store online.'
  },
  {
    key: 'projects-active-client-cta', region: 'proof', technical: 'View live work in progress',
    everyday: 'See the site being built'
  }
);

export const lensRouteCoverage = {
  '/': {
    prototype: ['hero', 'capabilities', 'How It Works', 'research', 'current work', 'contact CTA'],
    preserve: ['brand', 'email', 'URLs', 'status claims', 'final ForgeMesh continuity statement']
  },
  '/services': {
    review: ['page introduction', 'three service headings and summaries'],
    preserve: ['deliverable names', 'cadences']
  },
  '/research': {
    review: ['page introduction', 'three research summaries'],
    preserve: ['program names', 'phase labels', 'constraints and safety limits']
  },
  '/projects': {
    review: ['page introduction', 'three project summaries'],
    preserve: ['project names', 'status labels', 'outcome qualifiers']
  },
  '/contact': {
    review: ['page introduction', 'Contact Desk heading', 'what happens next'],
    preserve: [
      'form labels and visitor entries',
      'validation and confirmation',
      'email and privacy language',
      'booking state'
    ]
  }
} as const;
