import React, { useState, useRef } from 'react';
import { 
  UploadCloud, Database, Cpu, CheckCircle2, AlertTriangle, ArrowRight, 
  FileText, Layers, ShieldCheck, Zap, Sparkles, RefreshCw, XCircle, 
  ExternalLink, HardDrive, GitBranch, Terminal, Shield, Users, Radio,
  Building
} from 'lucide-react';
import { useOrgData } from '../../context/OrgDataContext';
import { ORGANIZATIONS, type OrganizationProfile } from '../layout/AppShell';

export interface DataIngestionViewProps {
  onNavigateToTwin?: () => void;
  onNavigateToObserve?: () => void;
  onNavigateToDecide?: () => void;
  currentOrg?: OrganizationProfile;
  onSelectOrg?: (org: OrganizationProfile) => void;
}

export const DataIngestionView: React.FC<DataIngestionViewProps> = ({
  onNavigateToTwin,
  onNavigateToObserve,
  onNavigateToDecide,
  currentOrg: propOrg,
  onSelectOrg: propOnSelectOrg
}) => {
  const {
    isLoaded,
    currentOrg: contextOrg,
    setCurrentOrg: setContextOrg,
    datasetSummary,
    pipelineStatus,
    pipelineSteps,
    currentStepIndex,
    uploadedFiles,
    schemaFields,
    unsupportedFields,
    errorMessage,
    generateDemoOrganization,
    uploadFiles,
    updateSchemaMapping,
    confirmAndBuildModel,
    resetOrganization
  } = useOrgData();

  const [activeTab, setActiveTab] = useState<'generate' | 'upload' | 'connect'>('generate');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const ok = await uploadFiles(e.dataTransfer.files);
      if (ok) {
        setUploadSuccessMessage(`Successfully staged ${e.dataTransfer.files.length} file(s). Review detected schema mapping below.`);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const ok = await uploadFiles(e.target.files);
      if (ok) {
        setUploadSuccessMessage(`Successfully staged ${e.target.files.length} file(s). Review detected schema mapping below.`);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Enterprise Connectors (with honest Coming Soon status)
  const CONNECTORS = [
    {
      id: 'github',
      name: 'GitHub Enterprise',
      icon: '🐙',
      domain: 'Code, PRs & Commit History',
      description: 'Ingest development telemetry, pull request reviews, and engineering release velocity.',
      status: 'Coming Soon',
      compliance: 'SOC2 Type II + OAuth 2.0'
    },
    {
      id: 'jira',
      name: 'Jira Service Management',
      icon: '🔷',
      domain: 'Tickets & Approval Ladders',
      description: 'Extract service queues, manager approval workflows, and SLA escalation trails.',
      status: 'Coming Soon',
      compliance: 'Atlassian Connect API'
    },
    {
      id: 'slack',
      name: 'Slack Enterprise Grid',
      icon: '💬',
      domain: 'Incident Channels & War Rooms',
      description: 'Reconstruct tacit bypass consensus, peer approvals, and real-time operational troubleshooting.',
      status: 'Coming Soon',
      compliance: 'Enterprise Discovery API'
    },
    {
      id: 'crm',
      name: 'Salesforce & HubSpot CRM',
      icon: '💼',
      domain: 'Customer Tiers & MRR Accounts',
      description: 'Correlate customer lifetime value, churn risk scores, and executive retention agreements.',
      status: 'Coming Soon',
      compliance: 'REST OAuth Sync'
    },
    {
      id: 'database',
      name: 'PostgreSQL / Snowflake Data Warehouse',
      icon: '🗄️',
      domain: 'Transactional Ledger Records',
      description: 'Stream historical settlement vouchers, ledger payouts, and financial balance transfers.',
      status: 'Coming Soon',
      compliance: 'Read-Only Enclave Replica'
    },
    {
      id: 'cloud-storage',
      name: 'Cloud Storage (AWS S3 / GCP GCS)',
      icon: '☁️',
      domain: 'Raw Evidence & Audit Blobs',
      description: 'Mount object storage containing uncompressed server logs, signed PDFs, and compliance receipts.',
      status: 'Coming Soon',
      compliance: 'KMS Encrypted IAM Roles'
    }
  ];

  return (
    <div style={{ padding: '28px 32px 60px 32px', maxWidth: '1440px', margin: '0 auto', textAlign: 'left', fontFamily: 'var(--font-body)' }}>
      {/* 1. Header & Subtitle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        paddingBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontWeight: 700
            }}>
              STAGE 01: EVIDENCE COMPILATION
            </span>
            <span style={{
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 8px',
              borderRadius: '4px',
              background: isLoaded ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: isLoaded ? '#34d399' : '#f87171',
              border: isLoaded ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
              fontWeight: 700
            }}>
              {isLoaded ? 'ORGANIZATION LOADED' : 'AWAITING EVIDENCE INGESTION'}
            </span>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            Data Ingestion
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 400, margin: 0, maxWidth: '800px' }}>
            Give FORGE X the evidence it needs to understand how your organization actually works.
          </p>
        </div>

        {/* Global Dataset Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isLoaded && (
            <button
              id="btn-reset-organization"
              onClick={resetOrganization}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f87171',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={14} /> Clear Organization Data
            </button>
          )}

          <button
            id="btn-goto-twin-top"
            onClick={onNavigateToTwin}
            disabled={!isLoaded}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: isLoaded ? 'linear-gradient(135deg, #06b6d4, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: isLoaded ? '#ffffff' : '#64748b',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isLoaded ? 'pointer' : 'not-allowed',
              boxShadow: isLoaded ? '0 4px 18px rgba(6, 182, 212, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Explore Organizational Twin</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Error Message Toast / Banner */}
      {errorMessage && (
        <div style={{
          marginBottom: '24px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fca5a5',
          fontSize: '13.5px'
        }}>
          <AlertTriangle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{errorMessage}</div>
        </div>
      )}

      {/* Empty State Banner if not loaded */}
      {!isLoaded && pipelineStatus === 'idle' && (
        <div style={{
          marginBottom: '28px',
          background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(2, 6, 15, 0.6) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '14px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', letterSpacing: '0.05em', marginBottom: '4px' }}>
              COLD START • SYSTEM READY
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              No organizational data loaded
            </div>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '4px' }}>
              Upload real organizational logs or generate a full deterministic demo company to begin.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('upload')}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Upload Data
            </button>
            <button
              onClick={generateDemoOrganization}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
              }}
            >
              Generate Demo Organization
            </button>
          </div>
        </div>
      )}

      {/* ENTERPRISE DATASET & MULTI-TENANT ORGANIZATIONAL FABRIC SELECTOR */}
      <div style={{
        background: 'rgba(6, 12, 24, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '26px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} color="#38bdf8" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                SELECT TARGET ENTERPRISE DATASET (SYNCHRONIZES ALL PAGES)
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Selecting an organization immediately focuses the Digital Twin, Incidents, Policies, Decisions, and Audit Ledger around this dataset.
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            ACTIVE: {(propOrg || contextOrg || ORGANIZATIONS[0]).name} ({(propOrg || contextOrg || ORGANIZATIONS[0]).tier})
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
          {ORGANIZATIONS.map(org => {
            const activeCurrent = propOrg || contextOrg || ORGANIZATIONS[0];
            const isSelected = org.id === activeCurrent.id;
            return (
              <div
                key={org.id}
                onClick={() => {
                  if (setContextOrg) setContextOrg(org);
                  if (propOnSelectOrg) propOnSelectOrg(org);
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(6, 182, 212, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `2px solid ${org.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: org.avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    {org.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                      {org.name}
                    </div>
                    <div style={{ fontSize: '10.5px', color: org.accentColor, fontWeight: 600 }}>
                      {org.tier}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4, marginBottom: '8px' }}>
                  {org.domain}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                  <span>Policy: {org.activePolicyId}</span>
                  <span>SLA: {org.slaHours}h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Mode Selector Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px'
      }}>
        <button
          id="tab-generate-mode"
          onClick={() => setActiveTab('generate')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'generate' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
            color: activeTab === 'generate' ? '#38bdf8' : '#94a3b8',
            fontSize: '13.5px',
            fontWeight: activeTab === 'generate' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderBottom: activeTab === 'generate' ? '2px solid #38bdf8' : '2px solid transparent'
          }}
        >
          <Sparkles size={16} color={activeTab === 'generate' ? '#38bdf8' : '#64748b'} />
          <span>GENERATE DEMO ORGANIZATION</span>
          <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.25)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
            RECOMMENDED
          </span>
        </button>

        <button
          id="tab-upload-mode"
          onClick={() => setActiveTab('upload')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'upload' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
            color: activeTab === 'upload' ? '#38bdf8' : '#94a3b8',
            fontSize: '13.5px',
            fontWeight: activeTab === 'upload' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderBottom: activeTab === 'upload' ? '2px solid #38bdf8' : '2px solid transparent'
          }}
        >
          <UploadCloud size={16} color={activeTab === 'upload' ? '#38bdf8' : '#64748b'} />
          <span>UPLOAD DATA</span>
        </button>

        <button
          id="tab-connect-mode"
          onClick={() => setActiveTab('connect')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'connect' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
            color: activeTab === 'connect' ? '#38bdf8' : '#94a3b8',
            fontSize: '13.5px',
            fontWeight: activeTab === 'connect' ? 700 : 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderBottom: activeTab === 'connect' ? '2px solid #38bdf8' : '2px solid transparent'
          }}
        >
          <Radio size={16} color={activeTab === 'connect' ? '#38bdf8' : '#64748b'} />
          <span>CONNECT DATA</span>
          <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px' }}>
            ENTERPRISE
          </span>
        </button>
      </div>

      {/* MODE C: GENERATE DEMO ORGANIZATION */}
      {activeTab === 'generate' && (
        <div style={{
          background: 'rgba(6, 12, 24, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.5)'
                }}>
                  <Sparkles size={20} color="#ffffff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Generate Demo Organization
                  </h2>
                  <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 600, margin: '2px 0 0 0' }}>
                    Explore FORGE X using a realistic organizational dataset.
                  </p>
                </div>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                Generates a deterministic, reproducible organizational dataset across the <strong>Customer Support & Refund Operations</strong> domain. This creates authentic operational relationships between People, Departments, Events, Cases, Decisions, Policies, Workflows, Systems, and Evidence.
              </p>

              {/* Realistic Workflow Diagram preview */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  SYNTHESIZED WORKFLOW DOMAIN: CUSTOMER SUPPORT / REFUND OPERATIONS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12.5px', color: '#e2e8f0', fontWeight: 600 }}>
                  <span style={{ padding: '4px 10px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px' }}>Customer Request</span>
                  <span style={{ color: '#38bdf8' }}>→</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px' }}>Support Review</span>
                  <span style={{ color: '#38bdf8' }}>→</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px' }}>Policy Check</span>
                  <span style={{ color: '#38bdf8' }}>→</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px' }}>Finance Review</span>
                  <span style={{ color: '#38bdf8' }}>→</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.4)' }}>Manager Approval (Bottleneck)</span>
                  <span style={{ color: '#38bdf8' }}>→</span>
                  <span style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>Resolution</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '10px' }}>
                  ⚡ Includes discovered alternate paths: <strong>65-minute Slack war-room fast-track</strong> where senior staff bypass the 48h manager queue to protect enterprise client retention.
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-generate-demo-org"
                onClick={generateDemoOrganization}
                disabled={pipelineStatus === 'running'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 28px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  cursor: pipelineStatus === 'running' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 25px rgba(6, 182, 212, 0.45)',
                  opacity: pipelineStatus === 'running' ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {pipelineStatus === 'running' ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Compiling Organizational Dataset...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Demo Organization</span>
                  </>
                )}
              </button>
            </div>

            {/* Dataset Breakdown Card */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
                DETERMINISTIC DATASET SPEC
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Operational Events</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ffffff' }}>5,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Decision Records</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ffffff' }}>500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Customer Cases</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ffffff' }}>120</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Corporate Policies</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ffffff' }}>23</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Employees & Actors</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ffffff' }}>20</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Integrated Systems</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ffffff' }}>12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Evidence Relationships</span>
                  <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#34d399' }}>850 Links</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE A: UPLOAD DATA */}
      {activeTab === 'upload' && (
        <div style={{
          background: 'rgba(6, 12, 24, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
            Upload Organizational Evidence
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0' }}>
            Upload system exports, ticketing journals, SOP handbooks, or event traces to compile your Organizational Digital Twin.
          </p>

          {/* Drag & Drop Upload Zone */}
          <div
            id="drag-drop-upload-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            style={{
              border: isDragging ? '2px dashed #38bdf8' : '2px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
              background: isDragging ? 'rgba(6, 182, 212, 0.08)' : 'rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '24px'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".csv,.json,.xlsx,.pdf,.docx,.sql"
              style={{ display: 'none' }}
            />

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#38bdf8'
            }}>
              <UploadCloud size={28} />
            </div>

            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
              Drag & drop files here
            </div>
            <div style={{ fontSize: '14px', color: '#38bdf8', fontWeight: 600, marginBottom: '14px' }}>
              or Browse Files
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              <span>Supported:</span>
              <strong style={{ color: '#f1f5f9' }}>CSV, JSON, XLSX, PDF, DOCX, SQL</strong>
            </div>
          </div>

          {/* Evidence Classification Categories */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
              AUTOMATIC EVIDENCE CLASSIFICATION CATEGORIES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'Event Logs',
                'Decision Records',
                'Customer Cases',
                'Policies / SOPs',
                'Workflow Data',
                'System Logs',
                'Other Evidence'
              ].map(cat => (
                <span key={cat} style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '12px',
                  color: '#cbd5e1'
                }}>
                  • {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Staged Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '12px',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>STAGED FILES ({uploadedFiles.length})</span>
                <span style={{ color: '#94a3b8' }}>Client-side validated</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '6px',
                    fontSize: '12.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={16} color="#38bdf8" />
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{file.name}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#38bdf8',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {file.classification}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Schema Detection UI */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={16} color="#38bdf8" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                    AI Schema Detection & Field Mapping
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                  Review detected columns and confirm mappings before compiling the organizational model.
                </div>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                8/8 CORE SCHEMAS DETECTED
              </span>
            </div>

            {/* Schema Mapping Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Detected Field</th>
                    <th style={{ padding: '8px 12px' }}>Inferred Type</th>
                    <th style={{ padding: '8px 12px' }}>Sample Value</th>
                    <th style={{ padding: '8px 12px' }}>Target Entity Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaFields.map((field) => (
                    <tr key={field.sourceField} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: "'JetBrains Mono', monospace", color: '#38bdf8', fontWeight: 600 }}>
                        {field.sourceField}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>
                        {field.detectedType}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#cbd5e1', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                        {field.sampleValue}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <select
                          value={field.targetEntity}
                          onChange={(e) => updateSchemaMapping(field.sourceField, e.target.value)}
                          style={{
                            background: 'rgba(6, 12, 24, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#34d399',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Event Time">Event Time</option>
                          <option value="Actor">Actor</option>
                          <option value="Organization Unit">Organization Unit</option>
                          <option value="Event Type">Event Type</option>
                          <option value="Case ID">Case ID</option>
                          <option value="Decision">Decision</option>
                          <option value="Policy">Policy</option>
                          <option value="System">System</option>
                          <option value="Metadata">Metadata</option>
                          <option value="Ignore">Ignore Field</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Unrecognized / Unsupported Fields Display */}
            {unsupportedFields.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px 16px',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={13} />
                  UNRECOGNIZED NON-STANDARD FIELDS (EXCLUDED FROM GRAPH COMPILATION):
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {unsupportedFields.map(field => (
                    <span key={field} style={{
                      padding: '3px 8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {field} (Skipped safely)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm & Build Button */}
            <button
              id="btn-confirm-schema-build"
              onClick={confirmAndBuildModel}
              disabled={pipelineStatus === 'running'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: pipelineStatus === 'running' ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Confirm & Build Organizational Model</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE B: CONNECT DATA (ENTERPRISE CONNECTORS) */}
      {activeTab === 'connect' && (
        <div style={{
          background: 'rgba(6, 12, 24, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Enterprise Integration Connectors
            </h2>
            <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px' }}>
              EXTENSIBILITY ROADMAP
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0' }}>
            Direct streaming connections to production operational systems. These connectors are scheduled for release; current hackathon judging is powered by the local evidence datastore.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {CONNECTORS.map((c) => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px' }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#38bdf8' }}>{c.domain}</div>
                      </div>
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#94a3b8',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {c.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5, margin: '8px 0 14px 0' }}>
                    {c.description}
                  </p>
                </div>

                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  <span>Security: {c.compliance}</span>
                  <span style={{ color: '#475569' }}>OAuth Enclave</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DATA PROCESSING PIPELINE UI */}
      {(pipelineStatus === 'running' || pipelineStatus === 'completed') && (
        <div
          id="ingestion-pipeline-card"
          style={{
            background: 'rgba(6, 12, 24, 0.75)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
            marginBottom: '28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                INGESTION PIPELINE EXECUTION
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                color: pipelineStatus === 'completed' ? '#34d399' : '#38bdf8',
                fontWeight: 700
              }}>
                {pipelineStatus === 'completed' ? '✓ 8/8 STAGES VERIFIED' : `STAGE ${currentStepIndex + 1} OF 8 RUNNING...`}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            <div style={{
              height: '100%',
              width: `${(currentStepIndex / 8) * 100}%`,
              background: pipelineStatus === 'completed' ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Pipeline 8-Stage Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {pipelineSteps.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isCurrent = step.status === 'running';

              return (
                <div
                  key={step.id}
                  style={{
                    background: isDone ? 'rgba(16, 185, 129, 0.08)' : (isCurrent ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)'),
                    border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : (isCurrent ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)'),
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  <div style={{ marginTop: '2px' }}>
                    {isDone ? (
                      <CheckCircle2 size={16} color="#34d399" />
                    ) : isCurrent ? (
                      <RefreshCw size={16} color="#38bdf8" className="animate-spin" />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #475569' }} />
                    )}
                  </div>

                  <div>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: 700,
                      color: isDone ? '#ffffff' : (isCurrent ? '#38bdf8' : '#64748b')
                    }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {step.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. INGESTION SUMMARY */}
      {isLoaded && (
        <div
          id="ingestion-summary-card"
          style={{
            background: 'rgba(6, 12, 24, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(20px)',
            marginBottom: '28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.45)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#34d399" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  DATA INGESTED & ORGANIZATIONAL MODEL READY
                </h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
                The evidence layer is populated. All downstream modules (Observe, Decision DNA, Digital Twin, Fork Reality, FORGE LAB) are synchronized.
              </p>
            </div>

            <button
              id="btn-explore-twin"
              onClick={onNavigateToTwin}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.45)'
              }}
            >
              <span>Explore Organizational Twin →</span>
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div id="ingestion-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>EVENTS</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.events.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '2px' }}>Logs & Traces</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>DECISIONS</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#34d399', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.decisions.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#34d399', marginTop: '2px' }}>Atomic Genomes</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>CUSTOMER CASES</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#fbbf24', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.customerCases}
              </div>
              <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '2px' }}>Support & SLA</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>POLICIES</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#a78bfa', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.policies}
              </div>
              <div style={{ fontSize: '10px', color: '#a78bfa', marginTop: '2px' }}>Active Rules & SOPs</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>PEOPLE</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.people}
              </div>
              <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '2px' }}>Key Decision Makers</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>WORKFLOWS</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#f43f5e', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.workflows}
              </div>
              <div style={{ fontSize: '10px', color: '#f43f5e', marginTop: '2px' }}>Doc vs Discovered</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>SYSTEMS</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.systems}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Integrated Tools</div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>EVIDENCE LINKS</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#34d399', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                {datasetSummary.evidenceLinks}
              </div>
              <div style={{ fontSize: '10px', color: '#34d399', marginTop: '2px' }}>Trace Connections</div>
            </div>
          </div>

          {/* Quick Workflow Jumper */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>
              Connected Workflow Steps:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={onNavigateToObserve}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                1. Observe Workflows →
              </button>
              <button
                onClick={onNavigateToDecide}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                2. Decision DNA →
              </button>
              <button
                onClick={onNavigateToTwin}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                3. Digital Twin Graph →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
