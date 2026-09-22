import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Cpu, Database, Activity, Lock } from 'lucide-react';
import { SignInModal } from '../auth/SignInModal';

interface CinematicLandingViewProps {
  onEnterOperations: () => void;
  onSignIn?: (role: 'Operations Lead' | 'VP of Operations' | 'Compliance Officer') => void;
  initialShowLogin?: boolean;
}

export const CinematicLandingView: React.FC<CinematicLandingViewProps> = ({ 
  onEnterOperations, 
  onSignIn,
  initialShowLogin = false 
}) => {
  const [signInOpen, setSignInOpen] = useState(initialShowLogin);

  useEffect(() => {
    if (initialShowLogin) {
      setSignInOpen(true);
    }
  }, [initialShowLogin]);
  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#02060f',
      color: '#ffffff',
      overflowX: 'hidden',
      fontFamily: "'Rowdies', sans-serif"
    }}>
      {/* 1. Fullscreen Looping Video Background */}
      <video
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.72
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
      />

      {/* 2. Atmospheric Gradient Veil */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `
          radial-gradient(110% 70% at 50% 45%, 
            rgba(4, 8, 18, 0.40) 0%, 
            rgba(4, 8, 18, 0.65) 60%, 
            rgba(2, 6, 15, 0.94) 100%),
          linear-gradient(180deg, 
            rgba(2, 6, 15, 0.70) 0%, 
            rgba(2, 6, 15, 0.15) 30%, 
            rgba(2, 6, 15, 0.25) 70%, 
            rgba(2, 6, 15, 0.90) 100%)
        `
      }} />

      {/* 3. Top Navigation Bar */}
      <header style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(2, 6, 15, 0.50)'
      }}>
        {/* Brand Left */}
        <div 
          onClick={onEnterOperations}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(37, 99, 235, 0.45)'
          }}>
            <svg style={{ width: '22px', height: '16px', fill: '#ffffff' }} viewBox="0 0 23 17" aria-hidden="true">
              <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z"/>
              <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z"/>
              <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z"/>
              <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z"/>
            </svg>
          </div>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '15px',
            letterSpacing: '0.08em',
            color: '#ffffff',
            textShadow: '0 0 12px rgba(56, 189, 248, 0.4)'
          }}>
            FORGE X
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <span 
            onClick={onEnterOperations}
            style={{ fontSize: '13.5px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 300, transition: 'color 0.2s' }}
          >
            How It Works
          </span>
          <span 
            onClick={onEnterOperations}
            style={{ fontSize: '13.5px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 300, transition: 'color 0.2s' }}
          >
            Policies
          </span>
          <span 
            onClick={onEnterOperations}
            style={{ fontSize: '13.5px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 300, transition: 'color 0.2s' }}
          >
            Scenarios
          </span>
          <span 
            onClick={onEnterOperations}
            style={{ fontSize: '13.5px', color: '#cbd5e1', cursor: 'pointer', fontWeight: 300, transition: 'color 0.2s' }}
          >
            Audit Ledger
          </span>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            DEMO ENVIRONMENT
          </span>

          <button
            onClick={() => setSignInOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 700,
              padding: '8px 18px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Lock size={13} color="#38bdf8" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onEnterOperations}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: '#ffffff',
              fontFamily: "'Rowdies', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              padding: '9px 20px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 18px rgba(37, 99, 235, 0.45)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Enter Operations</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* 4. Center Hero Section - Perfectly Centered in Viewport */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        minHeight: 'calc(100vh - 84px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px 24px 60px 24px',
        boxSizing: 'border-box'
      }}>
        {/* Center Logo Emblem */}
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.40), rgba(99, 102, 241, 0.40))',
          border: '1px solid rgba(255, 255, 255, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.40), inset 0 0 15px rgba(255, 255, 255, 0.20)',
          marginBottom: '26px'
        }}>
          <svg style={{ width: '42px', height: '30px', fill: '#ffffff' }} viewBox="0 0 23 17" aria-hidden="true">
            <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z"/>
            <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z"/>
            <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z"/>
            <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z"/>
          </svg>
        </div>

        {/* Retro Main Heading in Press Start 2P */}
        <h1 style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '44px',
          color: '#ffffff',
          letterSpacing: '0.06em',
          margin: '0 0 22px 0',
          lineHeight: 1.3,
          textShadow: '0 0 28px rgba(255, 255, 255, 0.35), 0 4px 12px rgba(0, 0, 0, 0.8)'
        }}>
          FORGE X
        </h1>

        {/* Crisp Enterprise Positioning */}
        <h2 style={{
          fontFamily: "'Rowdies', sans-serif",
          fontSize: '27px',
          fontWeight: 400,
          color: '#f8fafc',
          letterSpacing: '0.01em',
          margin: '0 0 16px 0',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)'
        }}>
          Operational decisions, governed by evidence.
        </h2>

        {/* Supporting description - Text directly on video with high contrast */}
        <p style={{
          fontFamily: "'Rowdies', sans-serif",
          fontSize: '16px',
          fontWeight: 300,
          color: '#cbd5e1',
          maxWidth: '740px',
          lineHeight: 1.65,
          margin: '0 auto 36px auto',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
        }}>
          Resolve incidents, enforce operating policies, test changes before rollout, and maintain a trustworthy record of every important decision.
        </p>

        {/* Primary CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onEnterOperations}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: '#ffffff',
              fontFamily: "'Rowdies', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              padding: '14px 36px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.55)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <span>Enter Daily Workspace</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={() => setSignInOpen(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.16)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#38bdf8',
              fontFamily: "'Rowdies', sans-serif",
              fontSize: '14.5px',
              fontWeight: 700,
              padding: '14px 30px',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Lock size={16} />
            <span>Sign In / IAM Access</span>
          </button>

          <button
            onClick={onEnterOperations}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: '#e2e8f0',
              fontFamily: "'Rowdies', sans-serif",
              fontSize: '14.5px',
              fontWeight: 400,
              padding: '14px 28px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
          >
            <span>Explore Platform</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Feature Highlights Row - Clean text directly over video */}
        <div style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '46px',
          padding: '12px 28px',
          borderRadius: '999px',
          background: 'rgba(2, 6, 15, 0.55)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.09)'
        }}>
          <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CheckCircle2 size={15} color="#34d399" /> Incident Resolution
          </span>
          <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CheckCircle2 size={15} color="#38bdf8" /> Process Compliance
          </span>
          <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CheckCircle2 size={15} color="#818cf8" /> Scenario Planning
          </span>
          <span style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <CheckCircle2 size={15} color="#fbbf24" /> Risk Stress Testing
          </span>
        </div>
      </main>

      {/* 5. Minimal Bottom Footer Bar */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '18px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(2, 6, 15, 0.60)',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span>SYSTEM OPERATIONAL • APEXCLOUD OPERATIONS</span>
        </div>
        <div>
          <span>FORGE X Platform • Deterministic Decision Governance</span>
        </div>
      </footer>

      {/* Enterprise Sign-In Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignInSuccess={(role) => {
          setSignInOpen(false);
          if (onSignIn) {
            onSignIn(role);
          } else {
            onEnterOperations();
          }
        }}
      />
    </div>
  );
};
