import React, { useEffect, useState } from 'react';

export const DemoMousePointer: React.FC<{ activeTarget?: string; clicked?: boolean }> = ({ activeTarget, clicked }) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (!activeTarget) return;
    const updateTarget = () => {
      let el: Element | null = null;
      try {
        el = document.querySelector(`[data-demo-target="${activeTarget}"]`);
        if (!el) {
          // If the target is a text search like "button:contains('Text')"
          if (activeTarget.includes(':contains("')) {
            const match = activeTarget.match(/(.*?):contains\("(.*?)"\)/);
            if (match) {
              const tag = match[1] || '*';
              const text = match[2];
              const elements = Array.from(document.querySelectorAll(tag));
              el = elements.find(e => e.textContent?.includes(text)) || null;
            }
          } else {
            el = document.querySelector(activeTarget);
          }
        }
      } catch (e) {
        console.warn("Invalid demo target selector:", activeTarget);
      }
      
      if (el) {
        const rect = el.getBoundingClientRect();
        setPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    updateTarget();
    const t = setTimeout(updateTarget, 600); // Wait for potential route animations
    return () => clearTimeout(t);
  }, [activeTarget]);

  useEffect(() => {
    if (clicked) {
      setIsClicking(true);
      const t = setTimeout(() => setIsClicking(false), 400);
      return () => clearTimeout(t);
    }
  }, [clicked]);

  return (
    <>
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, left: 0, 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          zIndex: 10000,
          pointerEvents: 'none'
        }}
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))' }}>
          <path d="M0 0L24 24L14 24L20 36L14 36L8 24L0 32L0 0Z" fill="white" stroke="black" strokeWidth="1"/>
        </svg>
      </div>
      {isClicking && (
        <div 
          style={{
            position: 'fixed',
            top: position.y - 15,
            left: position.x - 15,
            width: 30, height: 30,
            borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.4)',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'demo-ripple 0.4s ease-out forwards'
          }}
        />
      )}
      <style>{`
        @keyframes demo-ripple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </>
  );
};
