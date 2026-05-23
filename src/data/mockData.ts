/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ScenarioBranch,
  Hypothesis,
  AgentReflection,
  NatalInfluence,
  PatternMemory
} from '../types';

export const MOCK_NATAL_INFLUENCES: NatalInfluence[] = [
  {
    id: 'nat-1',
    symbol: '☉',
    label: 'Sun in Taurus / 10th House',
    category: 'Western',
    strength: 'high',
    explanation: 'Drives structured, visible persistence in career, seeking robust status baselines.'
  },
  {
    id: 'nat-2',
    symbol: '☽',
    label: 'Moon in Scorpio / 4th House',
    category: 'Western',
    strength: 'medium',
    explanation: 'Deep emotional need for privacy and control over the psychological foundation.'
  },
  {
    id: 'nat-3',
    symbol: '甲',
    label: 'Jia Wood Day Master',
    category: 'BaZi',
    strength: 'high',
    explanation: 'Represents growth, unyielding upward expansion, and strategy under high pressure.'
  },
  {
    id: 'nat-4',
    symbol: '寅',
    label: 'Tiger in Day Branch',
    category: 'BaZi',
    strength: 'medium',
    explanation: 'Acts as a strong roots system supporting the Jia Wood with decisive action.'
  },
  {
    id: 'nat-5',
    symbol: '木',
    label: 'Wood Element Dominant',
    category: 'Wu-Xing',
    strength: 'high',
    explanation: 'Generates intense creative drive, initiative, but potential for stubborn overshooting.'
  },
  {
    id: 'nat-6',
    symbol: '金',
    label: 'Metal Element Deficient',
    category: 'Wu-Xing',
    strength: 'high',
    explanation: 'Leads to structure-seeking behaviors and difficulties establishing rigid routines.'
  },
  {
    id: 'nat-7',
    symbol: 'VI',
    label: 'Sector 6 (Rhythm & Flow)',
    category: 'Soulprint',
    strength: 'high',
    explanation: 'Governs daily systems; high reactivity to chaotic working environments.'
  },
  {
    id: 'nat-8',
    symbol: 'XII',
    label: 'Sector 12 (Integration Void)',
    category: 'Soulprint',
    strength: 'low',
    explanation: 'Holds subconscious blindspots surrounding collective duty and submission.'
  }
];

export const MOCK_HYPOTHESES: Hypothesis[] = [
  {
    id: 'hyp-1',
    title: 'The Over-Extension Compensator',
    statement: 'User responds to structure/metal deficiency by initiating raw wood-driven growth, which prompts exhaustion loops.',
    confidence: 84,
    activation: 90,
    status: 'active',
    evidence: 'Observed in 4 separate quiz events where stress spiked during low-structure weeks. Confirmed by Eve strategic reflections.',
    counterEvidence: 'Skeptic Agent noted that user maintained calm during the April travel period despite schedule disintegration.',
    sourceMix: 'Quiz Patterns (45%), Agent Conversations (30%), Natal/Fusion (25%)',
    relatedScenarioBranches: ['br-1', 'br-3'],
    lastUpdated: '2026-05-21 18:20'
  },
  {
    id: 'hyp-2',
    title: 'The Defensive Hermit Anchor',
    statement: 'Moon in Scorpio triggers deep withdrawal under interpersonal tension to protect core strategic agency.',
    confidence: 76,
    activation: 40,
    status: 'active',
    evidence: 'Marked avoidance behaviors logged after three difficult collaborative sprints in the MiroShark simulation run.',
    counterEvidence: 'User actively sought feedback on key personal slides in the last agent chat session.',
    sourceMix: 'Agent Conversations (60%), Natal Scorpio Moon (40%)',
    relatedScenarioBranches: ['br-2', 'br-5'],
    lastUpdated: '2026-05-20 12:10'
  },
  {
    id: 'hyp-3',
    title: 'Adaptive Systemic Structurer',
    statement: 'Active search for external metal scaffolding via visual organization tools stabilizes creative Wood flows.',
    confidence: 65,
    activation: 75,
    status: 'active',
    evidence: 'High score in Quiz Sector 6. Immediate adoption of chronological templates suggested by Levi Strategic.',
    counterEvidence: 'Subconscious drift toward messy brainstorming canvas on Miro boards.',
    sourceMix: 'Quiz Sector 6 (50%), Seven Hypotheses System (30%), Space Weather (20%)',
    relatedScenarioBranches: ['br-4', 'br-1'],
    lastUpdated: '2026-05-22 01:45'
  },
  {
    id: 'hyp-4',
    title: 'The Double-Bind Initiator',
    statement: 'User simultaneously demands absolute structural safety and high-entropy autonomy, generating localized field freeze.',
    confidence: 54,
    activation: 50,
    status: 'emerging',
    evidence: 'Frequent contradictions in quiz responses concerning strict schedules vs absolute freedom.',
    counterEvidence: 'No observable drift in baseline behavior over last 14 days.',
    sourceMix: 'Quiz Contradictions (70%), Agent Memory (30%)',
    relatedScenarioBranches: ['br-2', 'br-6'],
    lastUpdated: '2026-05-22 04:00'
  },
  {
    id: 'hyp-5',
    title: 'Hyper-Vigilant Horizon Scanner',
    statement: 'Transit-driven focus on 90-day risks over-stimulates Scorpio Moon, leading to premature course corrections.',
    confidence: 42,
    activation: 30,
    status: 'emerging',
    evidence: 'Increased scrubber interaction on high horizons. Anxious queries regarding cosmic transits and field weather.',
    counterEvidence: 'Overall calm demeanor in direct chat queries with Eve.',
    sourceMix: 'Transit Field (50%), Western Anchors (30%), User Click Patterns (20%)',
    relatedScenarioBranches: ['br-4', 'br-5'],
    lastUpdated: '2026-05-22 05:00'
  },
  {
    id: 'hyp-6',
    title: 'The Static Comfort Preserver',
    statement: 'Avoidance of difficult growth initiatives by hiding behind comfortable, repetitive Taurus routine-structures.',
    confidence: 22,
    activation: 10,
    status: 'weak',
    evidence: 'Slightly elevated score on baseline retention metrics. Retains comfort templates.',
    counterEvidence: 'Jia Wood dominance usually overrules Taurus inertia, promoting rapid outward leaps.',
    sourceMix: 'Natal Taurus Sun (80%), Quiz Pattern (20%)',
    relatedScenarioBranches: ['br-3', 'br-6'],
    lastUpdated: '2026-05-18 09:12'
  },
  {
    id: 'hyp-7',
    title: 'External Validation Dependent',
    statement: 'Strategic actions are primarily driven by external professional feedback indicators rather than internal rhythm alignment.',
    confidence: 15,
    activation: 5,
    status: 'contradicted',
    evidence: 'Initial quiz answers pointed to peer review sensitivity.',
    counterEvidence: 'Strongly negated by conversational observations: user rejected strategic advice and defended personal timeline despite external pressure.',
    sourceMix: 'Skeptic Agent Analysis (90%), Dialogue Snippets (10%)',
    relatedScenarioBranches: ['br-6'],
    lastUpdated: '2026-05-22 05:22'
  }
];

export const MOCK_BRANCHES: ScenarioBranch[] = [
  {
    id: 'br-1',
    title: 'Resilient Coherent Progression',
    summary: 'A stable integration path aligning Jia Wood expansion with structured Metal boundaries, raising coherence to historic highs.',
    tendencyType: 'resonance',
    probabilityWeight: 8,
    confidence: 0.95,
    horizonRelevance: 120,
    deviation: -15, // slight smooth curvature
    coherenceDelta: 4.8, // high glow
    tensionDelta: 0.2, // low tension
    isDashed: false, // very solid evidence
    notToInfer: 'Do not assume this happens automatically without deliberate metal scaffold boundary setups.',
    reflectiveQuestion: 'How can you inject rigid structure into your morning routine without making it feel like a cell?',
    whyAppears: 'Appears because current transits support the 10th house Taurus Sun, while your recent quiz entries show sustained discipline.',
    whatResonates: 'Your dominant wood element finds fertile ground; the structural baseline (Metal deficiency) is compensated gracefully.',
    whereFriction: 'Scorpio Moon will struggle with the increased visibility and public accountability of outer growth.',
    increaseCoherence: 'Locking in the 7-day calendar baseline and committing to offline review slots before noon.',
    sources: [
      { name: 'Natal/Fusion', weight: 35, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
      { name: 'Quiz Patterns', weight: 30, confidence: 'high', lastUpdated: '2 hours ago', dataType: 'observed' },
      { name: 'Seven Hypotheses', weight: 20, confidence: 'high', lastUpdated: '2 hours ago', dataType: 'inferred' },
      { name: 'Agent Conversations', weight: 15, confidence: 'medium', lastUpdated: '1 day ago', dataType: 'observed' }
    ],
    relatedHypothesesIds: ['hyp-1', 'hyp-3']
  },
  {
    id: 'br-2',
    title: 'High-Tension Pressure Valve',
    summary: 'A highly charged trajectory where the Scorpio Moon withdraws from sudden demands, resulting in intense internal resistance.',
    tendencyType: 'tension',
    probabilityWeight: 6,
    confidence: 0.8,
    horizonRelevance: 80,
    deviation: 45, // high curving
    coherenceDelta: -2.1,
    tensionDelta: 4.5, // strong friction aura
    isDashed: false,
    notToInfer: 'This is not an emotional breakdown prediction, but a map of structural tension built into your current pace.',
    reflectiveQuestion: 'Are you over-scheduling meetings to hide an underlying anxiety about solitary focus?',
    whyAppears: 'Fueled by conflict between Natal Scorpio Moon and recent Quiz entries showing avoidance of open-ended creative tasks.',
    whatResonates: 'The Scorpio Moon demands safety; the high-volume environment acts as a direct intrusion.',
    whereFriction: 'Severe friction between active professional output requirements and raw regenerative needs.',
    increaseCoherence: 'Create a non-negotiable 48-hour social freeze or move critical milestones outward.',
    sources: [
      { name: 'Natal/Fusion', weight: 40, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
      { name: 'Agent Conversations', weight: 30, confidence: 'medium', lastUpdated: '12 hours ago', dataType: 'observed' },
      { name: 'Transit/Daily Field', weight: 20, confidence: 'high', lastUpdated: 'Current', dataType: 'simulated' },
      { name: 'Seven Hypotheses', weight: 10, confidence: 'low', lastUpdated: '3 hours ago', dataType: 'inferred' }
    ],
    relatedHypothesesIds: ['hyp-2', 'hyp-4']
  },
  {
    id: 'br-3',
    title: 'Quiz-Calibrated Wood Surge',
    summary: 'An active, growth-oriented surge where raw wood initiatives dominate, driven deeply by latest quiz calibration responses.',
    tendencyType: 'activation',
    probabilityWeight: 9, // very thick
    confidence: 0.88,
    horizonRelevance: 100,
    deviation: -30,
    coherenceDelta: 1.5,
    tensionDelta: 2.2,
    isDashed: false,
    notToInfer: 'Do not extrapolate this surge as permanent energy. Wood-burn without Metal hearth structures leads to rapid burnout.',
    reflectiveQuestion: 'What structural element can you build today to serve as a trellis for this wild vine of action?',
    whyAppears: 'Reflects a state where Natal and Quiz agree heavily: your recent high-energy answers match the natal dominant Wood element.',
    whatResonates: 'Creative impulse is flowing intensely; high excitement about multi-tasking.',
    whereFriction: 'Tension arises around finishing details; loose ends will pile up rapidly.',
    increaseCoherence: 'Integrate one rigid checklist or peer-review checkpoint to force alignment and control velocity.',
    sources: [
      { name: 'Quiz Patterns', weight: 55, confidence: 'high', lastUpdated: '2 hours ago', dataType: 'observed' },
      { name: 'Natal/Fusion', weight: 25, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
      { name: 'Agent Conversations', weight: 20, confidence: 'medium', lastUpdated: '1 day ago', dataType: 'observed' }
    ],
    relatedHypothesesIds: ['hyp-1', 'hyp-6']
  },
  {
    id: 'br-4',
    title: 'Transit-Amplified Structure Integration',
    summary: 'A structural alignment path where a temporary transit of Saturn stabilizes Wood over-extension, manifesting as a calm rhythm.',
    tendencyType: 'integration',
    probabilityWeight: 5,
    confidence: 0.75,
    horizonRelevance: 140,
    deviation: 10,
    coherenceDelta: 3.2,
    tensionDelta: 0.8,
    isDashed: false,
    notToInfer: 'This cosmic timing is a supporting current, not a magical solution that implements your systems for you.',
    reflectiveQuestion: 'If this period represents a temporary structural support, what permanent habits will you lay down?',
    whyAppears: 'A dynamic branch showing how a Live Transit temporarily amplifies a deficient pattern (Metal deficiency compensation).',
    whatResonates: 'Sustained focus, ease in discarding distractions, and realistic daily planning.',
    whereFriction: 'Minor resistance from the Scorpio Moon, which prefers hidden, high-entropy pathways over standardized routines.',
    increaseCoherence: 'Adopt and configure a daily tracking spreadsheet or Kanban system.',
    sources: [
      { name: 'Transit/Daily Field', weight: 45, confidence: 'high', lastUpdated: 'Current', dataType: 'simulated' },
      { name: 'Seven Hypotheses', weight: 25, confidence: 'medium', lastUpdated: '2 hours ago', dataType: 'inferred' },
      { name: 'Space Weather', weight: 20, confidence: 'medium', lastUpdated: 'Current', dataType: 'simulated' },
      { name: 'Natal/Fusion', weight: 10, confidence: 'low', lastUpdated: 'Stable', dataType: 'calculated' }
    ],
    relatedHypothesesIds: ['hyp-3', 'hyp-5']
  },
  {
    id: 'br-5',
    title: 'Speculative Subconscious Drift',
    summary: 'An inward-curving, highly misty branch of slow deceleration and subconscious integration with low structural visibility.',
    tendencyType: 'withdrawal',
    probabilityWeight: 3, // very thin
    confidence: 0.35, // low confidence, misty/blurry
    horizonRelevance: 70, // short horizon
    deviation: 65, // high curving inward
    coherenceDelta: -0.5,
    tensionDelta: 1.2,
    isDashed: true, // dashed path for speculative
    notToInfer: 'Do not interpret this inward drift as depression or failure of intent. It is a natural restorative current.',
    reflectiveQuestion: 'Can you give yourself permission to do nothing for three hours without feeling guilt?',
    whyAppears: 'Simulated based on Scorpio Moon anchors with high uncertainty due to a lack of recent conversational check-ins.',
    whatResonates: 'Silent observation, artistic incubation, and dream-work insights.',
    whereFriction: 'Taurus Sun might feel anxious about lack of concrete productive output.',
    increaseCoherence: 'Journaling on raw observations without trying to categorize or solve them.',
    sources: [
      { name: 'Natal/Fusion', weight: 50, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' },
      { name: 'Transit/Daily Field', weight: 30, confidence: 'low', lastUpdated: 'Current', dataType: 'simulated' },
      { name: 'Agent Conversations', weight: 20, confidence: 'low', lastUpdated: '4 days ago', dataType: 'observed' }
    ],
    relatedHypothesesIds: ['hyp-2', 'hyp-5']
  },
  {
    id: 'br-6',
    title: 'Skeptic-Challenged Autonomy Struggle',
    summary: 'A divergentCounterfactual branch displaying deep contradiction between stated professional goals and hidden avoidance patterns.',
    tendencyType: 'friction',
    probabilityWeight: 4,
    confidence: 0.62,
    horizonRelevance: 110,
    deviation: -50,
    coherenceDelta: -1.8,
    tensionDelta: 3.9,
    isDashed: true, // speculative, high skepticism
    notToInfer: 'This conflict does not mean your goals are false. It means your currently proposed timeline is psychologically unviable.',
    reflectiveQuestion: 'Are you using the word "autonomy" as an excuse to avoid hard feedback loops with peers?',
    whyAppears: 'Generated where Natal and Quiz contradict, and where the Skeptic Agent has reduced confidence in your stated priorities.',
    whatResonates: 'Brilliant solitary breakthroughs but with zero external verification or deployment success.',
    whereFriction: 'Severe dissonance between how you describe your progress and actual system deliverables.',
    increaseCoherence: 'Submitting a small, raw draft of a proposal to an ally for ruthless red-pen scrutiny.',
    sources: [
      { name: 'Seven Hypotheses', weight: 40, confidence: 'high', lastUpdated: '2 hours ago', dataType: 'inferred' },
      { name: 'Quiz Patterns', weight: 30, confidence: 'medium', lastUpdated: '2 hours ago', dataType: 'observed' },
      { name: 'Natal/Fusion', weight: 30, confidence: 'high', lastUpdated: 'Stable', dataType: 'calculated' }
    ],
    relatedHypothesesIds: ['hyp-4', 'hyp-6', 'hyp-7']
  }
];

export const MOCK_AGENT_REFLECTIONS: AgentReflection[] = [
  {
    id: 'ref-1',
    agentName: 'Core Signature Agent',
    role: 'Synthesizer of Natal & Current Field State',
    observation: 'The current pattern field is heavily wood-skewed, creating great creative torque but critical structural deficits.',
    caution: 'Avoid starting new secondary initiatives this week; you are hovering near structural exhaustion threshold.',
    reflectiveQuestion: 'If you could absolute delete one active task, which one causes you the most subtle somatic dread?',
    confidence: 88,
    stance: 'cautions'
  },
  {
    id: 'ref-2',
    agentName: 'Western Chart Agent',
    role: 'Deals with Sun/Moon & Angle Anchors',
    observation: 'Saturn transiting the 11th house supports Taurus placement, urging you to create physical routines with allies.',
    caution: 'Scorpio Moon is highly active tonight; emotional reactions regarding autonomy may be magnified.',
    reflectiveQuestion: 'Where are you mistaking a protective emotional shield for a genuine strategic limit?',
    confidence: 78,
    stance: 'reframes'
  },
  {
    id: 'ref-3',
    agentName: 'BaZi Agent',
    role: 'Pillar Harmony Analyst',
    observation: 'Jia Wood stands upright, but Wood dominance requires Fire to vent output or Metal to prune excess branches.',
    caution: 'Without pruning (Metal discipline), your active growth turns into a tangled, unproductive thicket.',
    reflectiveQuestion: 'What is the sharpest, most difficult cut you need to make to your agenda right now?',
    confidence: 82,
    stance: 'supports'
  },
  {
    id: 'ref-4',
    agentName: 'Wu-Xing Balance Agent',
    role: 'Five-Element Flux Calibration',
    observation: 'Metal deficiency is marked (12%). This structure void creates anxiety that you attempt to solve with more Wood growth.',
    caution: 'More wood growth without metal boundaries will only increase systemic anxiety and creative overload.',
    reflectiveQuestion: 'How can you create a boundary that feels supportive like a trellis, rather than oppressive?',
    confidence: 85,
    stance: 'reframes'
  },
  {
    id: 'ref-5',
    agentName: 'Quiz Calibration Agent',
    role: 'Analyzes Subjective Self-Report Logs',
    observation: 'Your last 3 responses show a sharp rise in "Stress-Response Mode 3" (Wood overload and Metal rejection).',
    caution: 'You are rating your consistency highly, but your duration of focused work sessions is dropping rapidly.',
    reflectiveQuestion: 'Is your subjective consistency rating reflective of actual focus, or simply high-paced activity?',
    confidence: 90,
    stance: 'cautions'
  },
  {
    id: 'ref-6',
    agentName: 'Seven Hypotheses Agent',
    role: 'Cross-Hypotheses Integrity Tracker',
    observation: 'Hypothesis 1 (Over-Extension) currently dominates, but Hypothesis 3 (Adaptive Scaffold) represents a powerful emerging response.',
    caution: 'Unchecked, the hermitic Scorpio Moon current might derail the structure integration under pressure.',
    reflectiveQuestion: 'Have you consciously linked your scaffolding habits to your emotional comfort levels?',
    confidence: 72,
    stance: 'supports'
  },
  {
    id: 'ref-7',
    agentName: 'Skeptic Agent',
    role: 'Devils Advocate & Epistemic Guard',
    observation: 'The entire construct of "Wood growth and Scorpio Moon" here is a narrative proxy. You might simply be tired.',
    caution: 'Do not reify these symbols. If you are sleep-deprived, no amount of cosmic compensation will balance your focus.',
    reflectiveQuestion: 'If this entire alignment reading were a fictional mirror, what simple physical truth are you avoiding?',
    confidence: 95,
    stance: 'contradicts'
  },
  {
    id: 'ref-8',
    agentName: 'Eve Reflection Agent',
    role: 'Empathic Subconscious Reader',
    observation: 'You seem to fear that structured routine will kill your creative spontaneous spark.',
    caution: 'This fear keeps you in a wild state that alternates between ecstatic starting and defensive exhausting.',
    reflectiveQuestion: 'How could a strict, boring boundary actually act as a guard protecting your wildest creations?',
    confidence: 80,
    stance: 'reframes'
  },
  {
    id: 'ref-9',
    agentName: 'Levi Strategic Agent',
    role: 'Cold Sovereign Action Planner',
    observation: 'Autonomy is empty if your deliverables fail to execute. You must build hard structural nodes to defend your projects.',
    caution: 'Your Scorpio withdrawal tendencies directly sabotage the team feedback loops required for success.',
    reflectiveQuestion: 'What is the specific milestone date that you will commit to and let others hold you to?',
    confidence: 84,
    stance: 'supports'
  }
];

export const MOCK_PATTERN_MEMORY: PatternMemory = {
  quizSectors: [
    { sector: 'Sector I (Vitality)', value: 45 },
    { sector: 'Sector II (Values)', value: 60 },
    { sector: 'Sector III (Mind)', value: 75 },
    { sector: 'Sector IV (Origin)', value: 30 },
    { sector: 'Sector V (Creation)', value: 85 },
    { sector: 'Sector VI (Rhythm)', value: 90 }, // Wood load
    { sector: 'Sector VII (Partner)', value: 40 },
    { sector: 'Sector VIII (Depth)', value: 70 },
    { sector: 'Sector IX (Horizon)', value: 50 },
    { sector: 'Sector X (Stature)', value: 80 },
    { sector: 'Sector XI (Alliance)', value: 55 },
    { sector: 'Sector XII (Void)', value: 20 }
  ],
  traitAxes: [
    { label: 'Growth Direction', value: 85, leftLabel: 'Preservation (Metal)', rightLabel: 'Expansion (Wood)' },
    { label: 'Cognitive Engine', value: 35, leftLabel: 'Analytic (Western)', rightLabel: 'Synthetic (Fusion)' },
    { label: 'Isolation Baseline', value: 75, leftLabel: 'Interdependent', rightLabel: 'Sovereign (Scorpio)' },
    { label: 'Pace Regulator', value: 90, leftLabel: 'Steady/Incubating', rightLabel: 'Urgent/Initiative' }
  ],
  activationStyle: 'Initiator-Combustor (high initial spark, low heat sustainability)',
  avoidanceStyle: 'Scorpio Deep Withdrawal (hiding plans when criticized)',
  stressResponse: 'Hyper-kinetic system accumulation (taking on more tasks under dread)',
  confidenceByDimension: [
    { dimension: 'Somatic/Rhythm', confidence: 90 },
    { dimension: 'Interpersonal Baseline', confidence: 75 },
    { dimension: 'Strategic Alignment', confidence: 60 },
    { dimension: 'Space Weather Calibration', confidence: 35 }
  ],
  agentObservations: [
    {
      id: 'obs-1',
      sourceAgent: 'Eve Reflection Agent',
      snippet: 'User expressed strong resistance to standard calendar schedules in discussion, calling them "creative handcuffs".',
      tag: 'Scaffold Resistance',
      confidence: 85,
      freshness: '2 hours ago'
    },
    {
      id: 'obs-2',
      sourceAgent: 'Levi Strategic Agent',
      snippet: 'User agreed to post a weekly check-in, but missed the first scheduled deadline by 14 hours.',
      tag: 'Execution Drift',
      confidence: 90,
      freshness: '1 day ago'
    },
    {
      id: 'obs-3',
      sourceAgent: 'Skeptic Agent',
      snippet: 'User attributed fatigue entirely to "Transit magnetic distortion", resisting recommendations concerning screen time.',
      tag: 'Symbolic Projection',
      confidence: 75,
      freshness: '3 days ago'
    }
  ],
  patternDrifts: [
    {
      id: 'drf-1',
      patternName: 'Metal Deficiency Structure-Seeking',
      direction: 'strengthened',
      description: 'Your search for external checklists has intensified since last week (+15%), prompted by high stress logs.'
    },
    {
      id: 'drf-2',
      patternName: 'Scorpio Moon Hermit Withdrawal',
      direction: 'weakened',
      description: 'Avoidance scores fell by 10% after successful collaborative strategy calls with your partners.'
    },
    {
      id: 'drf-3',
      patternName: 'Wood-Metal Boundary Contrast',
      direction: 'contradiction_detected',
      description: 'Simultaneously reported a perfect work routine while logging highly fragmented sleep and work hours.'
    }
  ]
};
