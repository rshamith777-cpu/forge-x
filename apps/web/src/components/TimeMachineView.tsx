import React, { useState, useEffect } from 'react';
import { 
  Clock, ShieldCheck, AlertOctagon, EyeOff, CheckCircle2, 
  HelpCircle, ArrowRight, Database, History, Calendar, FileText
} from 'lucide-react';
import { fetchTimeMachineTimeline, inspectTimeMachine } from '../lib/api';

export const TimeMachineView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [timeline, setTimeline] = useState<any>(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState<string>("2026-08-01T10:30:00+00:00");
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTimeMachineTimeline().then((res: any) => {
      setTimeline(res);
      if (res?.checkpoints?.length > 0) {
        // default to 10:30 AM (peak incident)
        const peak = res.checkpoints.find((c: any) => c.label.includes("10:30")) || res.checkpoints[2];
        setSelectedTimestamp(peak.timestamp);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedTimestamp) {
      setLoading(true);
      inspectTimeMachine(selectedTimestamp).then((data: any) => {
        setSnapshot(data);
        setLoading(false);
      });
    }
  }, [selectedTimestamp]);

  const state = snapshot?.state;

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">TEMPORAL RECONSTRUCTION</span>
            <span className="badge badge-emerald">HINDSIGHT BIAS ELIMINATOR</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History color="#38bdf8" size={28} /> Organizational Time Machine
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            "What did the organization actually know at that minute?" — Strict chronological state isolation. Zero future knowledge leaked.
          </p>
        </div>

        <div style={{ 
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.3)', 
          borderRadius: '8px', 
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <EyeOff size={16} color="#34d399" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
            Hindsight Barrier Active
          </span>
        </div>
      </div>

      {/* Interactive Time Slider / Milestones Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#38bdf8" /> Incident Investigation Timeline (August 1, 2026)
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Selected Moment: <strong style={{ color: '#38bdf8' }}>{selectedTimestamp}</strong>
          </div>
        </div>

        {/* Milestone Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {timeline?.checkpoints?.map((chk: any, i: number) => {
            const isSelected = selectedTimestamp === chk.timestamp;
            return (
              <button
                key={i}
                onClick={() => setSelectedTimestamp(chk.timestamp)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#38bdf8' : '#e2e8f0' }}>
                    {chk.label}
                  </span>
                  {chk.active_incident && (
                    <span className="badge badge-rose" style={{ fontSize: '9px', padding: '1px 5px' }}>SEV-1</span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: isSelected ? '#e2e8f0' : 'var(--text-muted)', lineHeight: '1.3' }}>
                  {chk.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress Timeline Graphic */}
        <div style={{ position: 'relative', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '14px' }}>
          <div style={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            bottom: 0, 
            width: selectedTimestamp.includes("08:00") ? '10%' : 
                   selectedTimestamp.includes("09:30") ? '35%' : 
                   selectedTimestamp.includes("10:15") ? '60%' : 
                   selectedTimestamp.includes("10:30") ? '75%' : '100%',
            background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
            borderRadius: '3px'
          }} />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', color: '#fff' }}>Reconstructing Historical State...</div>
      ) : state && (
        <>
          {/* Isolation Counters Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>EVENTS KNOWN BEFORE TS</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                {state.total_events_known?.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>
                Accessible evidence base
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FUTURE EVENTS MASKED</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#fb7185', marginTop: '4px' }}>
                {state.future_events_masked?.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: '#fb7185', marginTop: '4px' }}>
                Blocked from agent reasoning
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DECISIONS COMMITTED</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                {state.total_decisions_known}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Historical precedents recorded
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ACTIVE INCIDENT STATUS</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: state.active_incident.active ? '#f43f5e' : '#34d399', marginTop: '8px' }}>
                {state.active_incident.severity}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {state.active_incident.description}
              </div>
            </div>
          </div>

          {/* Dual Columns: What Was Known vs What We Did Not Know */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Left Column: Reconstructed Known Reality */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle2 size={18} color="#34d399" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                  What the Organization Knew at {selectedTimestamp.split('T')[1].substring(0, 5)} UTC
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  RECENT AUDITABLE DECISIONS:
                </div>
                {state.recent_decisions?.map((d: any, idx: number) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>{d.id}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{d.timestamp?.split('T')[1]?.substring(0, 8)}</span>
                    </div>
                    <div style={{ color: '#e2e8f0', marginBottom: '4px' }}>{d.situation?.substring(0, 90)}...</div>
                    <span className="badge badge-indigo">{d.action_taken}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: "WHAT DID WE NOT KNOW?" (Section 15) */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <HelpCircle size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fbbf24' }}>
                  What We Did NOT Know (Unknown Unknowns)
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {state.what_we_did_not_know_then?.map((unk: string, idx: number) => (
                  <div key={idx} style={{ 
                    background: 'rgba(245, 158, 11, 0.08)', 
                    borderLeft: '3px solid #f59e0b', 
                    padding: '14px', 
                    borderRadius: '0 8px 8px 0',
                    fontSize: '13px',
                    color: '#fde68a'
                  }}>
                    • {unk}
                  </div>
                ))}

                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                    RECOMMENDED MITIGATION:
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Launch adversarial stress-testing in the Red Team cockpit to convert these unknown blindspots into formal Decision Genome exceptions before next outage window.
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => onNavigate('red-team')}
                    style={{ marginTop: '12px', padding: '8px 14px', fontSize: '12px' }}
                  >
                    Open Red Team Cockpit <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
