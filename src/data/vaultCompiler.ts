export interface AssistantProfile {
  key: string;
  number: string;
  name: string;
  descriptor: string;
  summary: string;
  examples: string[];
  imageSlug: string;
  originalFile: string;
  alt: string;
}

export const assistantProfiles: AssistantProfile[] = [
  {
    key: 'maker',
    number: '01',
    name: 'Maker Assistant',
    descriptor: 'Curious / inventive / capable',
    summary: 'Keeps plans, references, experiments, and next steps connected while a project changes shape.',
    examples: ['Project notes', 'Parts and references', 'Build follow-through'],
    imageSlug: 'maker-assistant',
    originalFile: 'ROBOT_01_MAKER_ASSISTANT_CANONICAL.jpg',
    alt: 'Mechanical maker assistant in a technical workshop holding one hand near its camera-like head.'
  },
  {
    key: 'bakery',
    number: '02',
    name: 'Bakery Assistant',
    descriptor: 'Warm / organized / steady',
    summary: 'Brings orders, inventory notes, customer details, and recurring production routines into one workable flow.',
    examples: ['Order details', 'Production routines', 'Customer follow-up'],
    imageSlug: 'bakery-assistant',
    originalFile: 'ROBOT_02_BAKERY_ASSISTANT_CANONICAL.jpg',
    alt: 'Friendly cream and copper bakery assistant holding a tray of fresh bread beside a glowing oven.'
  },
  {
    key: 'household',
    number: '03',
    name: 'Household Assistant',
    descriptor: 'Calm / grounded / reliable',
    summary: 'Helps keep routines, household records, maintenance notes, and reminders clear without taking control away.',
    examples: ['Shared routines', 'Home records', 'Maintenance reminders'],
    imageSlug: 'household-assistant',
    originalFile: 'ROBOT_03_HOUSEHOLD_ASSISTANT_CANONICAL.jpg',
    alt: 'Calm dark household assistant folding a towel in a bright organized utility room.'
  },
  {
    key: 'contractor',
    number: '04',
    name: 'Contractor Assistant',
    descriptor: 'Field-ready / direct / durable',
    summary: 'Connects field notes, estimates, schedules, site photos, and client decisions so fewer details fall through.',
    examples: ['Field notes', 'Estimate inputs', 'Schedule handoffs'],
    imageSlug: 'contractor-assistant',
    originalFile: 'ROBOT_04_CONTRACTOR_ASSISTANT_CANONICAL.jpg',
    alt: 'Rugged yellow and black contractor assistant holding a tablet at an outdoor construction site.'
  },
  {
    key: 'research',
    number: '05',
    name: 'Research Assistant',
    descriptor: 'Observant / precise / insightful',
    summary: 'Keeps sources, questions, findings, and uncertainty visible across longer investigations.',
    examples: ['Source trails', 'Research questions', 'Finding continuity'],
    imageSlug: 'research-assistant',
    originalFile: 'ROBOT_05_RESEARCH_ASSISTANT_CANONICAL.jpg',
    alt: 'Dark research assistant reading an open book in a detailed archive and laboratory workspace.'
  },
  {
    key: 'personal-operations',
    number: '06',
    name: 'Personal Operations Assistant',
    descriptor: 'Composed / organized / dependable',
    summary: 'Turns priorities, resources, schedules, and dependencies into a plan you can review and keep moving.',
    examples: ['Priority planning', 'Resource tracking', 'Next-step review'],
    imageSlug: 'personal-operations-assistant',
    originalFile: 'ROBOT_06_PERSONAL_OPERATIONS_ASSISTANT_CANONICAL.jpg',
    alt: 'White and black personal operations assistant writing in a daily planning notebook at a desk.'
  }
];

export const vaultCompilerFlow = [
  {
    number: '01',
    name: 'Collect',
    technical: 'Source-bounded intake',
    everyday: 'Choose the instructions and notes that should be included.'
  },
  {
    number: '02',
    name: 'Review',
    technical: 'Validation and conflict checks',
    everyday: 'See what is missing, duplicated, or unclear before anything is packaged.'
  },
  {
    number: '03',
    name: 'Compile',
    technical: 'Versioned package generation',
    everyday: 'Create a clear, dated package instead of another pile of loose files.'
  },
  {
    number: '04',
    name: 'Approve',
    technical: 'Human-controlled release gate',
    everyday: 'Inspect the result and decide whether it is ready to use.'
  }
] as const;
