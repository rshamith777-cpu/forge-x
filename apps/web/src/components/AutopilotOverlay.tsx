import React, { useState, useEffect, useRef } from 'react';
import { DemoDirector, DEMO_SCRIPT } from '../lib/demo/DemoDirector';
import { DemoVoiceController } from '../lib/demo/DemoVoiceController';
import { DemoMousePointer } from './DemoMousePointer';

export const AutopilotOverlay: React.FC<{ navigateTo?: (p: string) => void }> = ({ navigateTo }) => {
  const [demoState, setDemoState] = useState({ isRunning: false, isPaused: false, elapsedMs: 0, currentStep: DEMO_SCRIPT[0] });
  const [director] = useState(() => new DemoDirector(setDemoState));
  const voice = useRef(new DemoVoiceController());
  const lastStepRef = useRef<number>(-1);
  const [pointerClicked, setPointerClicked] = useState(false);

  useEffect(() => {
    if (!demoState.isRunning) {
      lastStepRef.current = -1;
      voice.current.stop();
      return;
    }
    
    if (demoState.isPaused) {
      voice.current.pause();
    } else {
      voice.current.resume();
    }

    const step = demoState.currentStep;
    if (step.timeMs !== lastStepRef.current && !demoState.isPaused) {
      lastStepRef.current = step.timeMs;
      
      // Navigate
      if (navigateTo && step.route) {
        navigateTo(step.route);
      }
      
      // Voice
      if (step.voiceText) {
        voice.current.speak(step.voiceText);
      }

      // Simulate specific automated UI interactions
      setTimeout(() => {
        try {
          if (step.action === 'generate_demo' || step.action === 'trigger_decision' || step.action === 'ask_moss' || step.action === 'run_fork_reality' || step.action === 'run_forge_lab' || step.action === 'complete') {
             setPointerClicked(true);
             setTimeout(() => setPointerClicked(false), 500);
          }
          
          if (step.action === 'generate_demo') {
            const btn = document.getElementById('btn-generate-demo-org') || Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Generate Demo Organization'));
            if (btn) (btn as HTMLButtonElement).click();
          } else if (step.action === 'trigger_decision') {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent?.includes('EXECUTE DECISION HOT PATH') || b.textContent?.includes('Trigger Decision'));
            if (btn) btn.click();
          } else if (step.action === 'ask_moss') {
            const btn = document.getElementById('btn-ask-moss') || Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Ask Moss'));
            if (btn) (btn as HTMLButtonElement).click();
          } else if (step.action === 'run_fork_reality') {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent?.includes('Run Scenario') || b.textContent?.includes('Run Simulation'));
            if (btn) btn.click();
          } else if (step.action === 'run_forge_lab') {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.textContent?.includes('RUN EMPIRICAL') || b.textContent?.includes('RUN ADVERSARIAL'));
            if (btn) btn.click();
          }
        } catch (e) {
          console.warn('Demo UI trigger failed:', e);
        }
      }, 800); // Wait for route transition + pointer to arrive
    }
  }, [demoState.currentStep, demoState.isRunning, demoState.isPaused, navigateTo]);

  useEffect(() => {
    const handleStartDemo = () => {
      director.start();
    };
    window.addEventListener('forge:start-demo', handleStartDemo);
    return () => window.removeEventListener('forge:start-demo', handleStartDemo);
  }, [director]);

  if (!demoState.isRunning) {
    return (
      <button 
        id="btn-autopilot-demo-trigger"
        onClick={() => director.start()} 
        style={{ 
          position: 'fixed', 
          bottom: 24, 
          left: 260, 
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', 
          color: '#ffffff', 
          padding: '11px 20px', 
          borderRadius: '30px', 
          fontWeight: 800, 
          fontSize: '12.5px',
          zIndex: 9998, 
          border: '1px solid rgba(255, 255, 255, 0.4)', 
          cursor: 'pointer', 
          boxShadow: '0 0 25px rgba(6, 182, 212, 0.55)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease'
        }}
      >
        <span>⚡ 5-MIN JUDGE DEMO MODE</span>
      </button>
    );
  }

  const nextStepIndex = DEMO_SCRIPT.findIndex(s => s.timeMs > demoState.elapsedMs);
  const nextStep = nextStepIndex !== -1 ? DEMO_SCRIPT[nextStepIndex] : null;

  return (
    <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', top: 24, right: 24, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '24px', borderRadius: '12px', width: '320px', zIndex: 9999, backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, color: 'var(--accent-cyan)' }}>⚡ AUTOPILOT ACTIVE</h3>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          0{Math.floor(demoState.elapsedMs / 60000)}:{String(Math.floor((demoState.elapsedMs % 60000)/1000)).padStart(2, '0')} / 02:00
        </span>
      </div>
      
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>VOICE: ON</span>
        <span style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>POINTER: ACTIVE</span>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600, letterSpacing: '0.05em' }}>
        STAGE: {demoState.currentStep.scene.toUpperCase().replace('-', ' ')}
      </div>

      <div style={{ 
        fontStyle: 'italic', 
        marginBottom: '24px', 
        color: 'var(--text-primary)', 
        lineHeight: 1.5,
        background: 'rgba(0,0,0,0.3)',
        padding: '12px',
        borderRadius: '8px',
        borderLeft: '3px solid var(--accent-cyan)'
      }}>
        "{demoState.currentStep.narration}"
      </div>
      
      {nextStep && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <span>NEXT:</span>
          <span>{nextStep.scene.toUpperCase().replace('-', ' ')}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => demoState.isPaused ? director.resume() : director.pause()} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          {demoState.isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={() => director.reset()} style={{ flex: 1, padding: '8px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          Exit
        </button>
      </div>
      
      <DemoMousePointer activeTarget={demoState.currentStep.target} clicked={pointerClicked} />
    </div>
  );
};
