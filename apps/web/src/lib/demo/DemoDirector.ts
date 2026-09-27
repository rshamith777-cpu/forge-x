export type DemoScene = 
  | 'ingestion' 
  | 'pipeline' 
  | 'summary' 
  | 'observe' 
  | 'decision-dna' 
  | 'digital-twin' 
  | 'moss-query' 
  | 'fork-reality' 
  | 'forge-lab' 
  | 'complete';

export interface DemoStep {
  timeMs: number;
  scene: DemoScene;
  route: string;
  action: string;
  target?: string;
  narration: string;
  voiceText: string;
}

export const DEMO_SCRIPT: DemoStep[] = [
  {
    timeMs: 0,
    scene: 'ingestion',
    route: '/app/ingestion',
    action: 'generate_demo',
    target: '#btn-generate-demo-org',
    narration: 'First, FORGE X needs evidence. We can upload organizational data or generate a complete demonstration organization.',
    voiceText: 'First, FORGE X needs evidence. We can upload organizational data or generate a complete demonstration organization.'
  },
  {
    timeMs: 22000,
    scene: 'pipeline',
    route: '/app/ingestion',
    action: 'show_pipeline',
    target: '#ingestion-pipeline-card',
    narration: 'Once the data is processed, FORGE X reconstructs how the organization actually operates.',
    voiceText: 'Once the data is processed through our eight-stage pipeline, FORGE X reconstructs how the organization actually operates.'
  },
  {
    timeMs: 45000,
    scene: 'summary',
    route: '/app/ingestion',
    action: 'show_summary',
    target: '#ingestion-summary-card',
    narration: '5,000 events, 500 decisions, and 23 policies are unified into a living organizational model.',
    voiceText: 'Five thousand events, five hundred decisions, and twenty-three corporate policies are unified into a living organizational model.'
  },
  {
    timeMs: 70000,
    scene: 'observe',
    route: '/app/observe',
    action: 'show_workflow',
    target: '[data-demo-target="discovered-workflow"]',
    narration: 'In Observe, FORGE X compares documented SOPs against discovered reality, uncovering hidden shortcuts and bottlenecks.',
    voiceText: 'In Observe, FORGE X discovers how the organization actually works. Notice the documented forty-eight hour manager queue versus the discovered sixty-five minute Slack war-room shortcut.'
  },
  {
    timeMs: 105000,
    scene: 'decision-dna',
    route: '/app/decide',
    action: 'trigger_decision',
    target: 'button:contains("EXECUTE DECISION HOT PATH")',
    narration: 'Decision DNA captures every judgment with complete provenance, citing policies and real event traces.',
    voiceText: 'Decision DNA compiles every judgment into a structured trace: evidence, tacit assumptions, policy constraints, and reasoning.'
  },
  {
    timeMs: 140000,
    scene: 'digital-twin',
    route: '/app/twin',
    action: 'show_twin_graph',
    target: '#digital-twin-graph',
    narration: 'These relationships form our Organizational Digital Twin.',
    voiceText: 'These relationships form our Organizational Digital Twin. People, Policies, Decisions, Systems, and Evidence connected in real time.'
  },
  {
    timeMs: 175000,
    scene: 'moss-query',
    route: '/app/twin',
    action: 'ask_moss',
    target: '#btn-ask-moss',
    narration: 'Now we can ask why a process is slow and trace the answer back to organizational evidence.',
    voiceText: 'Now we can ask why high-value refund cases take longer, and trace the answer back to organizational evidence using Moss.'
  },
  {
    timeMs: 210000,
    scene: 'fork-reality',
    route: '/app/scenarios',
    action: 'run_fork_reality',
    target: 'button:contains("Run Scenario")',
    narration: 'Finally, Fork Reality lets us explore what happens if we change the process.',
    voiceText: 'Finally, Fork Reality lets us explore what happens if we change business rules, simulating cycle time and fraud risk across one thousand Monte Carlo iterations.'
  },
  {
    timeMs: 250000,
    scene: 'forge-lab',
    route: '/app/forgelab',
    action: 'run_forge_lab',
    target: 'button:contains("RUN EMPIRICAL")',
    narration: 'FORGE LAB tests whether the compiled organizational intelligence can be trusted under adversarial attacks.',
    voiceText: 'FORGE LAB tests whether the compiled organizational intelligence can be trusted, validating that Candidate V2 neutralizes the one hundred bot Sybil burst attack.'
  },
  {
    timeMs: 290000,
    scene: 'complete',
    route: '/app/twin',
    action: 'complete',
    target: '#digital-twin-graph',
    narration: 'Decisions don\'t just run. They get compiled, tested, and audited.',
    voiceText: 'FORGE X. Decisions don\'t just run. They get compiled, tested, and audited.'
  }
];

export class DemoDirector {
  private isRunning = false;
  private isPaused = false;
  private elapsedMs = 0;
  private timerId: any = null;
  private onStateUpdate: (state: any) => void = () => {};

  constructor(onStateUpdate?: (state: any) => void) {
    if (onStateUpdate) {
      this.onStateUpdate = onStateUpdate;
    }
  }

  public start() {
    this.reset();
    this.isRunning = true;
    this.timerId = setInterval(() => this.tick(), 100);
    this.notify();
  }

  public pause() {
    this.isPaused = true;
    this.notify();
  }

  public resume() {
    this.isPaused = false;
    this.notify();
  }

  public reset() {
    if (this.timerId) clearInterval(this.timerId);
    this.isRunning = false;
    this.isPaused = false;
    this.elapsedMs = 0;
    this.notify();
  }

  private tick() {
    if (this.isPaused) return;
    this.elapsedMs += 100;
    
    if (this.elapsedMs >= 300000) {
      this.complete();
    }
    this.notify();
  }

  private complete() {
    this.isRunning = false;
    if (this.timerId) clearInterval(this.timerId);
  }

  private notify() {
    const currentStep = DEMO_SCRIPT.slice().reverse().find(step => this.elapsedMs >= step.timeMs) || DEMO_SCRIPT[0];
    this.onStateUpdate({
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      elapsedMs: this.elapsedMs,
      currentStep,
      scene: currentStep.scene,
      route: currentStep.route
    });
  }
}
