import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  FileText, 
  GitPullRequest, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  Filter, 
  Search,
  Zap,
  Sliders,
  ExternalLink,
  ChevronRight,
  Database,
  X
} from 'lucide-react';
import { fetchRiskFindings } from '../../lib/api';

interface RiskFinding {
  id: string;
  test: string;
  policy: string;
  weakness: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'MITIGATION REQUIRED' | 'PATCHED IN V2' | 'ACTIVE MONITORING' | 'RESOLVED';
  recommended_patch: string;
}

interface RiskData {
  open_vulnerabilities: number;
  high_risk_policies: number;
  new_patterns: number;
  tests_this_month: number;
  findings: RiskFinding[];
}

interface RiskStressTestingViewProps {
  onNavigateToScenario?: (scenarioName?: string) => void;
  onNavigateToPolicy?: (policyId: string) => void;
}

export const RiskStressTestingView: React.FC<RiskStressTestingViewProps> = ({
  onNavigateToScenario,
  onNavigateToPolicy
}) => {
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState<RiskFinding | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'mitigation' | 'patched'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Stress Test Execution State
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; exploitsFound: number; message: string; timestamp: string } | null>(null);

  // Policy Patch Modal State
  const [patchModalOpen, setPatchModalOpen] = useState(false);
  const [patchStep, setPatchStep] = useState<1 | 2 | 3 | 4>(1);
  const [patchTitle, setPatchTitle] = useState('');
  const [patchRule, setPatchRule] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchRiskFindings();
        setData(res);
      } catch (err) {
        console.error('Failed to load risk findings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRunStressTest = (finding: RiskFinding) => {
    setRunningTestId(finding.id);
    setTestResult(null);

    // Simulate adversarial execution with realistic timing
    setTimeout(() => {
      setRunningTestId(null);
      const isPatched = finding.status === 'PATCHED IN V2';
      setTestResult({
        id: finding.id,
        success: isPatched,
        exploitsFound: isPatched ? 0 : 3,
        message: isPatched
          ? `Policy rules enforced: 0 of 500 adversarial submissions penetrated bounds.`
          : `Vulnerability verified: 3 sub-threshold claims bypassed approval limit within 12m window. Total exposure: $2,850.`,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 1200);
  };

  const handleOpenPatchModal = (finding: RiskFinding) => {
    setSelectedFinding(finding);
    setPatchTitle(`Patch for ${finding.test} (${finding.policy})`);
    setPatchRule(finding.recommended_patch);
    setPatchStep(1);
    setPatchModalOpen(true);
  };

  const filteredFindings = data?.findings.filter(f => {
    if (activeTab === 'high' && f.risk_level !== 'HIGH' && f.risk_level !== 'CRITICAL') return false;
    if (activeTab === 'mitigation' && f.status !== 'MITIGATION REQUIRED') return false;
    if (activeTab === 'patched' && f.status !== 'PATCHED IN V2') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.test.toLowerCase().includes(q) || f.policy.toLowerCase().includes(q) || f.weakness.toLowerCase().includes(q);
    }
    return true;
  }) || [];

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1400px', margin: '0 auto', textAlign: 'left', fontFamily: "'Rowdies', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '20px',
              color: '#ffffff',
              letterSpacing: '0.04em',
              margin: 0
            }}>
              Risk & Stress Testing
            </h1>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              LIVE GOVERNANCE GUARD
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', fontWeight: 300, margin: 0 }}>
            Find weaknesses and loopholes in operating rules before they become customer incidents.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#64748b',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '5px 12px',
            borderRadius: '6px'
          }}>
            DEMO ENVIRONMENT • SYNTHETIC ENTERPRISE DATA
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
            <span>Open Vulnerabilities</span>
            <AlertTriangle size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
            {data?.open_vulnerabilities ?? 4}
          </div>
          <p style={{ color: '#fbbf24', fontSize: '12px', margin: '6px 0 0 0' }}>2 require immediate mitigation</p>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
            <span>High-Risk Policies</span>
            <ShieldAlert size={16} color="#f87171" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
            {data?.high_risk_policies ?? 2}
          </div>
          <p style={{ color: '#f87171', fontSize: '12px', margin: '6px 0 0 0' }}>POL-OPS-012, POL-SLA-ENT</p>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
            <span>New Patterns Discovered</span>
            <Zap size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
            {data?.new_patterns ?? 3}
          </div>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '6px 0 0 0' }}>Discovered via audit mining</p>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.10)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
            <span>Tests This Month</span>
            <CheckCircle2 size={16} color="#34d399" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
            {data?.tests_this_month ?? 126}
          </div>
          <p style={{ color: '#34d399', fontSize: '12px', margin: '6px 0 0 0' }}>97.6% policy resilience</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(15, 23, 42, 0.5)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {[
            { id: 'all', label: 'All Findings' },
            { id: 'high', label: 'High & Critical' },
            { id: 'mitigation', label: 'Mitigation Required' },
            { id: 'patched', label: 'Patched' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                border: 'none',
                fontFamily: "'Rowdies', sans-serif",
                background: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search vulnerabilities, rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: '6px',
              background: 'rgba(2, 6, 15, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: '12.5px',
              fontFamily: "'Rowdies', sans-serif",
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Test Execution Output Banner if active */}
      {testResult && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '10px',
          border: testResult.success ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
          background: testResult.success ? 'rgba(6, 78, 59, 0.35)' : 'rgba(120, 53, 15, 0.35)',
          color: testResult.success ? '#a7f3d0' : '#fde68a',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {testResult.success ? (
              <CheckCircle2 size={18} color="#34d399" style={{ marginTop: '2px', flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={18} color="#fbbf24" style={{ marginTop: '2px', flexShrink: 0 }} />
            )}
            <div style={{ fontSize: '13px' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                Stress Test Result: {testResult.id} • <span style={{ fontFamily: 'monospace', fontWeight: 400, fontSize: '11.5px', opacity: 0.8 }}>Ran at {testResult.timestamp}</span>
              </div>
              <div>{testResult.message}</div>
            </div>
          </div>
          <button 
            onClick={() => setTestResult(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, cursor: 'pointer', fontSize: '12px' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stress Test Findings Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredFindings.map((finding) => (
          <div 
            key={finding.id}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  background: finding.risk_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : finding.risk_level === 'HIGH' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  color: finding.risk_level === 'CRITICAL' ? '#f87171' : finding.risk_level === 'HIGH' ? '#fbbf24' : '#38bdf8',
                  border: `1px solid ${finding.risk_level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.3)' : finding.risk_level === 'HIGH' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
                }}>
                  {finding.risk_level} RISK
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  {finding.test}
                </h3>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  Target: {finding.policy}
                </span>
              </div>

              <span style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                padding: '4px 10px',
                borderRadius: '6px',
                background: finding.status === 'MITIGATION REQUIRED' ? 'rgba(239, 68, 68, 0.15)' : finding.status === 'PATCHED IN V2' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                color: finding.status === 'MITIGATION REQUIRED' ? '#f87171' : finding.status === 'PATCHED IN V2' ? '#34d399' : '#38bdf8',
                border: `1px solid ${finding.status === 'MITIGATION REQUIRED' ? 'rgba(239, 68, 68, 0.3)' : finding.status === 'PATCHED IN V2' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
              }}>
                {finding.status}
              </span>
            </div>

            {/* Content Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', fontSize: '13px' }}>
              <div style={{ background: 'rgba(2, 6, 15, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>
                  Identified Weakness
                </span>
                <p style={{ color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                  {finding.weakness}
                </p>
              </div>

              <div style={{ background: 'rgba(2, 6, 15, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>
                  Recommended Patch
                </span>
                <p style={{ color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                  {finding.recommended_patch}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '6px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  disabled={runningTestId === finding.id}
                  onClick={() => handleRunStressTest(finding)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12.5px',
                    fontFamily: "'Rowdies', sans-serif",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {runningTestId === finding.id ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Running Stress Test...
                    </>
                  ) : (
                    <>
                      <Play size={14} />
                      Run Test
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedFinding(finding)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '12.5px',
                    fontFamily: "'Rowdies', sans-serif",
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={14} />
                  View Evidence
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {finding.status === 'MITIGATION REQUIRED' && (
                  <button
                    onClick={() => handleOpenPatchModal(finding)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      background: '#f59e0b',
                      color: '#020617',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      fontFamily: "'Rowdies', sans-serif",
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <GitPullRequest size={14} />
                    Create Policy Patch
                  </button>
                )}

                {onNavigateToScenario && (
                  <button
                    onClick={() => onNavigateToScenario(finding.test)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '12.5px',
                      fontFamily: "'Rowdies', sans-serif",
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sliders size={14} />
                    Simulate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Patch Modal */}
      {patchModalOpen && selectedFinding && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          fontFamily: "'Rowdies', sans-serif"
        }}>
          <div style={{
            width: '560px',
            background: '#0d1527',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Create Policy Patch</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Mitigate {selectedFinding.test} on {selectedFinding.policy}
                </p>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                Step {patchStep} of 4
              </span>
            </div>

            {patchStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Patch Title</label>
                  <input
                    type="text"
                    value={patchTitle}
                    onChange={(e) => setPatchTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(2, 6, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Root Cause Vulnerability</label>
                  <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', color: '#e2e8f0', fontSize: '12.5px' }}>
                    {selectedFinding.weakness}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Proposed Rule Amendment</label>
                  <textarea
                    rows={3}
                    value={patchRule}
                    onChange={(e) => setPatchRule(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'rgba(2, 6, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '12.5px', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            {patchStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ padding: '14px', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '8px', color: '#bfdbfe' }}>
                  <strong>Impact Analysis:</strong> Applying this rule blocks 100% of sub-threshold split claims within 1 hour windows with zero impact on single legitimate enterprise submissions.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '14px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontFamily: 'monospace' }}>Exposure Reduction</span>
                    <span style={{ fontSize: '18px', color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>-$42,000 / mo</span>
                  </div>
                  <div style={{ padding: '14px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontFamily: 'monospace' }}>Review Friction Added</span>
                    <span style={{ fontSize: '18px', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>&lt; 0.4%</span>
                  </div>
                </div>
              </div>
            )}

            {patchStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <p style={{ color: '#cbd5e1', margin: '0 0 4px 0' }}>Required Authorizations for <strong>{selectedFinding.policy}</strong>:</p>
                <div style={{ padding: '12px 14px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Operations Lead (Ananya R.)</span>
                  <span style={{ color: '#34d399', fontSize: '11.5px', fontFamily: 'monospace' }}>✓ Signed</span>
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(2, 6, 15, 0.6)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Risk Officer</span>
                  <span style={{ color: '#38bdf8', fontSize: '11.5px', fontFamily: 'monospace' }}>Pending Approval</span>
                </div>
              </div>
            )}

            {patchStep === 4 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={44} color="#34d399" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '16px', color: '#fff', margin: '0 0 6px 0' }}>Policy Patch Ready for Deployment</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  Patch #PAT-2026-09 will be committed to the cryptographic audit ledger and deployed to the active decision engine.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <button
                onClick={() => setPatchModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {patchStep > 1 && patchStep < 4 && (
                  <button
                    onClick={() => setPatchStep((s) => (s - 1) as any)}
                    style={{ padding: '8px 16px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.06)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12.5px', cursor: 'pointer' }}
                  >
                    Back
                  </button>
                )}

                {patchStep < 4 ? (
                  <button
                    onClick={() => setPatchStep((s) => (s + 1) as any)}
                    style={{ padding: '8px 18px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setPatchModalOpen(false);
                      if (data) {
                        setData({
                          ...data,
                          findings: data.findings.map(f => 
                            f.id === selectedFinding.id 
                              ? { ...f, status: 'PATCHED IN V2', risk_level: 'LOW' }
                              : f
                          )
                        });
                      }
                    }}
                    style={{ padding: '8px 20px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Publish to Production Rules
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Viewer Drawer */}
      {selectedFinding && !patchModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 110,
          fontFamily: "'Rowdies', sans-serif"
        }}>
          <div style={{
            width: '460px',
            height: '100%',
            background: '#0d1527',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Stress Test Evidence</h3>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>{selectedFinding.id} • {selectedFinding.test}</span>
                </div>
                <button
                  onClick={() => setSelectedFinding(null)}
                  style={{ background: 'rgba(255, 255, 255, 0.06)', border: 'none', color: '#cbd5e1', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>Attack Vector</span>
                  <div style={{ fontFamily: 'monospace', color: '#e2e8f0', fontSize: '12px' }}>
                    POST /api/incidents/submit-claim [Burst: 3 reqs / 420s]
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>Trigger Condition</span>
                  <div style={{ fontFamily: 'monospace', color: '#e2e8f0', fontSize: '12px' }}>
                    Sub-account cluster requesting $490 credits below Lead ceiling ($500).
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(2, 6, 15, 0.7)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '4px' }}>Affected Policy Standard</span>
                  <div style={{ fontFamily: 'monospace', color: '#e2e8f0', fontSize: '12px' }}>
                    POL-OPS-012 § 4.2 (Threshold vs rolling customer session window).
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>Hash: e3b0c44298...</span>
              <button
                onClick={() => {
                  const finding = selectedFinding;
                  setSelectedFinding(null);
                  handleOpenPatchModal(finding);
                }}
                style={{ padding: '9px 18px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Policy Patch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
