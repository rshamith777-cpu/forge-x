import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, ShieldCheck, CheckCircle2, AlertTriangle, Play, Pause, 
  Square, Calendar, UserPlus, Filter, Award, Sparkles, Bot, ArrowRight,
  TrendingUp, Activity, Check, X, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  initials: string;
  status: 'ONLINE' | 'ON_INCIDENT' | 'IN_LAB' | 'BREAK' | 'OFFLINE';
  activeTask: string;
  hoursToday: number;
  weeklyHours: number;
  slaAdherencePct: number;
  isAI?: boolean;
}

export interface TimesheetEntry {
  id: string;
  memberId: string;
  memberName: string;
  role: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  durationHours: number;
  taskWorked: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'FLAGGED_OVERTIME';
  approvedBy?: string;
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'MEM-01',
    name: 'Ananya R.',
    role: 'Operations Lead',
    avatarBg: 'linear-gradient(135deg, #0284c7, #2563eb)',
    initials: 'AR',
    status: 'ON_INCIDENT',
    activeTask: 'Incident INC-101 (ApexCloud Outage)',
    hoursToday: 7.2,
    weeklyHours: 36.5,
    slaAdherencePct: 99.4
  },
  {
    id: 'MEM-02',
    name: 'Marcus Chen',
    role: 'Incident Responder',
    avatarBg: 'linear-gradient(135deg, #059669, #10b981)',
    initials: 'MC',
    status: 'ONLINE',
    activeTask: 'VIP Context Drift Queue & Triage',
    hoursToday: 6.5,
    weeklyHours: 32.0,
    slaAdherencePct: 98.1
  },
  {
    id: 'MEM-03',
    name: 'Elena Rostova',
    role: 'Compliance & Audit Officer',
    avatarBg: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    initials: 'ER',
    status: 'ONLINE',
    activeTask: 'SOC-2 Decision Ledger Verification',
    hoursToday: 5.8,
    weeklyHours: 29.5,
    slaAdherencePct: 100.0
  },
  {
    id: 'MEM-04',
    name: 'David Vance',
    role: 'Security Engineer',
    avatarBg: 'linear-gradient(135deg, #dc2626, #ef4444)',
    initials: 'DV',
    status: 'IN_LAB',
    activeTask: 'Sybil Burst Attack Matrix Validation',
    hoursToday: 6.8,
    weeklyHours: 34.2,
    slaAdherencePct: 97.5
  },
  {
    id: 'MEM-05',
    name: 'Sarah Jenkins',
    role: 'VP of Operations',
    avatarBg: 'linear-gradient(135deg, #d97706, #f59e0b)',
    initials: 'SJ',
    status: 'ONLINE',
    activeTask: 'Candidate Playbook V2 Sign-off',
    hoursToday: 4.5,
    weeklyHours: 24.0,
    slaAdherencePct: 100.0
  },
  {
    id: 'MEM-AI',
    name: 'Synapse-X AI Teammate',
    role: 'Autonomous AI Teammate',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    initials: 'SX',
    status: 'ONLINE',
    activeTask: 'Continuous Real-Time Moss Sub-10ms Ingestion',
    hoursToday: 24.0,
    weeklyHours: 168.0,
    slaAdherencePct: 100.0,
    isAI: true
  }
];

const DEFAULT_TIMESHEETS: TimesheetEntry[] = [
  {
    id: 'TS-901',
    memberId: 'MEM-01',
    memberName: 'Ananya R.',
    role: 'Operations Lead',
    date: '2026-09-26',
    shiftStart: '08:00 AM',
    shiftEnd: '03:15 PM',
    durationHours: 7.25,
    taskWorked: 'P0 Incident Resolution & Voucher Authorization',
    status: 'PENDING_APPROVAL'
  },
  {
    id: 'TS-902',
    memberId: 'MEM-02',
    memberName: 'Marcus Chen',
    role: 'Incident Responder',
    date: '2026-09-26',
    shiftStart: '09:00 AM',
    shiftEnd: '03:30 PM',
    durationHours: 6.5,
    taskWorked: 'ApexCloud Service Disruption Triage',
    status: 'PENDING_APPROVAL'
  },
  {
    id: 'TS-903',
    memberId: 'MEM-04',
    memberName: 'David Vance',
    role: 'Security Engineer',
    date: '2026-09-26',
    shiftStart: '08:30 AM',
    shiftEnd: '03:20 PM',
    durationHours: 6.8,
    taskWorked: 'Red Team Sybil 100-Bot Simulation',
    status: 'APPROVED',
    approvedBy: 'Operations Lead'
  },
  {
    id: 'TS-904',
    memberId: 'MEM-03',
    memberName: 'Elena Rostova',
    role: 'Compliance & Audit Officer',
    date: '2026-09-25',
    shiftStart: '09:00 AM',
    shiftEnd: '05:00 PM',
    durationHours: 8.0,
    taskWorked: 'Time-Machine Replay & Ledger Audit',
    status: 'APPROVED',
    approvedBy: 'Operations Lead'
  }
];

export const TeamWorkforceView: React.FC = () => {
  const currentRole = localStorage.getItem('forge_role') || 'Operations';
  const fullRole = localStorage.getItem('forge_full_role') || currentRole;
  const teamCode = localStorage.getItem('forge_team_code') || 'FORGE-ALPHA';
  const memberName = localStorage.getItem('forge_member_name') || 'Ananya R.';

  // Check if current user is manager / higher authority
  const isHigherAuthority = 
    fullRole.toLowerCase().includes('executive') || 
    fullRole.toLowerCase().includes('lead') || 
    fullRole.toLowerCase().includes('admin') || 
    currentRole === 'Executive' || 
    currentRole === 'Operations';

  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(DEFAULT_TIMESHEETS);
  const [activeTab, setActiveTab] = useState<'roster' | 'timesheets' | 'analytics'>('roster');
  
  // Personal Shift Clock State
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [shiftSeconds, setShiftSeconds] = useState<number>(25920); // ~7.2 hrs in seconds

  // Add Member Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<string>('Incident Responder');

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setShiftSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isOnBreak]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Manager Actions: Approve Timesheet
  const handleApproveTimesheet = (id: string) => {
    setTimesheets(prev => prev.map(ts => {
      if (ts.id === id) {
        return { ...ts, status: 'APPROVED', approvedBy: `${memberName} (${fullRole})` };
      }
      return ts;
    }));
  };

  // Manager Actions: Approve All Pending
  const handleApproveAllPending = () => {
    setTimesheets(prev => prev.map(ts => {
      if (ts.status === 'PENDING_APPROVAL') {
        return { ...ts, status: 'APPROVED', approvedBy: `${memberName} (High Command Bulk)` };
      }
      return ts;
    }));
  };

  // Manager Actions: Reassign Task
  const handleReassignTask = (memberId: string) => {
    const newTask = prompt("Enter new task / incident assignment:");
    if (!newTask) return;
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, activeTask: newTask, status: 'ONLINE' };
      }
      return m;
    }));
  };

  // Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMem: TeamMember = {
      id: `MEM-${Math.floor(Math.random() * 900 + 100)}`,
      name: newMemberName.trim(),
      role: newMemberRole,
      avatarBg: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
      initials: newMemberName.trim().slice(0, 2).toUpperCase(),
      status: 'ONLINE',
      activeTask: 'Triage Standby & Shadowing',
      hoursToday: 0.0,
      weeklyHours: 0.0,
      slaAdherencePct: 100.0
    };

    setMembers(prev => [...prev, newMem]);
    setNewMemberName('');
    setShowAddModal(false);
  };

  return (
    <div style={{
      padding: '28px 36px 60px 36px',
      maxWidth: '1440px',
      margin: '0 auto',
      textAlign: 'left',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Top Banner / Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Team & Workforce Command
            </h1>
            <span style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)'
            }}>
              TEAM: {teamCode}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, fontWeight: 400 }}>
            Real-time workforce shifts, incident allocations, timesheet verifications, and SOC-2 time governance.
          </p>
        </div>

        {/* Authority Level Badge */}
        <div style={{
          background: isHigherAuthority ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isHigherAuthority ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '12px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: isHigherAuthority ? '#0284c7' : '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isHigherAuthority ? <Award size={18} color="#ffffff" /> : <Users size={18} color="#ffffff" />}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: isHigherAuthority ? '#38bdf8' : '#94a3b8', textTransform: 'uppercase' }}>
              {isHigherAuthority ? 'HIGHER AUTHORITY • MANAGER' : 'TEAM MEMBER ACCESS'}
            </div>
            <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>
              {memberName} ({fullRole})
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Metric 1 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '18px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Active Members Online</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>5 Human + 1 AI</span>
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span>100% Team Coverage</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '18px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Hours Logged Today</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
            30.8 hrs
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Across 5 active operators
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '18px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>SLA Compliance Rate</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#34d399' }}>
            99.2%
          </div>
          <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>
            +0.4% above enterprise target
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '18px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Timesheets Pending Sign-off</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b' }}>
            {timesheets.filter(t => t.status === 'PENDING_APPROVAL').length} Shifts
          </div>
          <div style={{ fontSize: '11px', color: isHigherAuthority ? '#38bdf8' : '#94a3b8', marginTop: '4px' }}>
            {isHigherAuthority ? 'Requires your sign-off' : 'Pending manager review'}
          </div>
        </div>
      </div>

      {/* Personal Live Shift Clock Controller */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(99, 102, 241, 0.1))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
          }}>
            <Clock size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Your Active Shift Timer</span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                background: isClockedIn && !isOnBreak ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isClockedIn && !isOnBreak ? '#34d399' : '#fbbf24',
                border: `1px solid ${isClockedIn && !isOnBreak ? '#10b981' : '#f59e0b'}`
              }}>
                {isClockedIn ? (isOnBreak ? 'ON BREAK' : 'CLOCKED IN (ACTIVE)') : 'CLOCKED OUT'}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Operator: <strong style={{ color: '#ffffff' }}>{memberName}</strong> • Team: <strong style={{ color: '#38bdf8' }}>{teamCode}</strong>
            </div>
          </div>
        </div>

        {/* Live Duration and Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today's Logged Duration
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>
              {formatDuration(shiftSeconds)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {isClockedIn && (
              <button
                onClick={() => setIsOnBreak(!isOnBreak)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isOnBreak ? <Play size={14} /> : <Pause size={14} />}
                <span>{isOnBreak ? 'Resume Shift' : 'Take Break'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (isClockedIn) {
                  setIsClockedIn(false);
                  alert("Shift ended. Your timesheet entry has been submitted for manager sign-off.");
                } else {
                  setIsClockedIn(true);
                  setIsOnBreak(false);
                }
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: isClockedIn ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #0284c7, #2563eb)',
                border: `1px solid ${isClockedIn ? '#ef4444' : '#38bdf8'}`,
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isClockedIn ? <Square size={14} /> : <Play size={14} />}
              <span>{isClockedIn ? 'Clock Out' : 'Clock In Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <button
            onClick={() => setActiveTab('roster')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'roster' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'roster' ? '#38bdf8' : '#94a3b8',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={16} />
            <span>Active Team Roster ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timesheets')}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'timesheets' ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === 'timesheets' ? '#38bdf8' : '#94a3b8',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={16} />
            <span>Timesheet & Time Approvals</span>
            {timesheets.filter(t => t.status === 'PENDING_APPROVAL').length > 0 && (
              <span style={{
                fontSize: '10px',
                background: '#f59e0b',
                color: '#000000',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 800
              }}>
                {timesheets.filter(t => t.status === 'PENDING_APPROVAL').length}
              </span>
            )}
          </button>
        </div>

        {/* Manager Controls: Add Member & Bulk Approve */}
        {isHigherAuthority && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={14} />
              <span>Add Member / Agent</span>
            </button>

            {activeTab === 'timesheets' && (
              <button
                onClick={handleApproveAllPending}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle2 size={14} />
                <span>Approve All Pending Timesheets</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* TAB 1: ACTIVE TEAM ROSTER */}
      {activeTab === 'roster' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {members.map(member => (
            <div
              key={member.id}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: `1px solid ${member.isAI ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '14px',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Left Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: member.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: '#ffffff',
                  boxShadow: member.isAI ? '0 0 15px rgba(6, 182, 212, 0.5)' : 'none'
                }}>
                  {member.isAI ? <Bot size={22} /> : member.initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{member.name}</span>
                    {member.isAI && (
                      <span style={{
                        fontSize: '9px',
                        background: 'rgba(6, 182, 212, 0.2)',
                        color: '#38bdf8',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        AUTONOMOUS AI
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {member.role}
                  </div>
                </div>
              </div>

              {/* Status & Active Task */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: member.status === 'ONLINE' ? 'rgba(16, 185, 129, 0.2)' : (
                      member.status === 'ON_INCIDENT' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)'
                    ),
                    color: member.status === 'ONLINE' ? '#34d399' : (
                      member.status === 'ON_INCIDENT' ? '#f87171' : '#38bdf8'
                    ),
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {member.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>
                  {member.activeTask}
                </div>
              </div>

              {/* Work Hours & Performance */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Today / Week</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    {member.hoursToday}h <span style={{ color: '#64748b' }}>/ {member.weeklyHours}h</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>SLA Quality</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#34d399' }}>
                    {member.slaAdherencePct}%
                  </div>
                </div>

                {/* Manager Actions */}
                {isHigherAuthority && !member.isAI && (
                  <button
                    onClick={() => handleReassignTask(member.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Reassign Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TIMESHEETS & TIME APPROVALS */}
      {activeTab === 'timesheets' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr 1fr 1fr',
            padding: '14px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase'
          }}>
            <div>Member</div>
            <div>Date</div>
            <div>Shift Window</div>
            <div>Task / Duty</div>
            <div>Status</div>
            <div style={{ textAlign: 'right' }}>Manager Sign-Off</div>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timesheets.map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr 1.5fr 1fr 1fr',
                  padding: '16px 20px',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '13px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{entry.memberName}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{entry.role}</div>
                </div>

                <div style={{ color: '#cbd5e1' }}>
                  {entry.date}
                </div>

                <div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{entry.shiftStart} - {entry.shiftEnd}</div>
                  <div style={{ fontSize: '11px', color: '#38bdf8' }}>{entry.durationHours} hours total</div>
                </div>

                <div style={{ color: '#cbd5e1', fontSize: '12px' }}>
                  {entry.taskWorked}
                </div>

                <div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: entry.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: entry.status === 'APPROVED' ? '#34d399' : '#fbbf24',
                    border: `1px solid ${entry.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                  }}>
                    {entry.status.replace('_', ' ')}
                  </span>
                  {entry.approvedBy && (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                      By: {entry.approvedBy}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  {entry.status === 'PENDING_APPROVAL' ? (
                    isHigherAuthority ? (
                      <button
                        onClick={() => handleApproveTimesheet(entry.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Approve Shift
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Pending Manager</span>
                    )
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: '#34d399', fontSize: '12px' }}>
                      <CheckCircle2 size={14} />
                      <span>Certified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '30px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>
              Add Team Member / AI Agent
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>
              Assign a new operator or dedicated AI agent to Team <strong>{teamCode}</strong>:
            </p>

            <form onSubmit={handleAddMember}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>
                  Member Name / Callsign
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: '#e2e8f0' }}>
                  Role & Authority Tier
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Incident Responder">Incident Responder (Standard)</option>
                  <option value="Operations Lead">Operations Lead (Manager)</option>
                  <option value="Security Engineer">Security Engineer (Red Team)</option>
                  <option value="Compliance Officer">Compliance Officer (Audit)</option>
                  <option value="Autonomous AI Agent">Dedicated Autonomous AI Agent</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Confirm & Provision Access
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
