'use client';

import { useState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import { ENABLE_100_DAYS_EVENT } from '@/config/event';
import { LOVE_REASONS } from '@/config/reasons';
import { triggerSparkles } from '@/utils/sparkles';

// ----------------------------------------------------
// Custom Self-Contained Canvas Confetti Component
// ----------------------------------------------------
function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height - 20;
        this.size = Math.random() * 8 + 6;
        const colors = ['#f8c8dc', '#ffc6d0', '#ffd8e7', '#fbb3c1', '#795465', '#6c586d', '#864e5a', '#FFD54F'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = Math.random() * 2 + 1.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        if (this.y > height) {
          this.y = -20;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const particles: Particle[] = Array.from({ length: 120 }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
    />
  );
}

// ----------------------------------------------------
// Custom Self-Contained Floating Hearts Component
// ----------------------------------------------------
function FloatingHearts({ active }: { active: boolean }) {
  const [hearts, setHearts] = useState<Array<{ id: number; icon: string; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    if (!active) {
      setHearts([]);
      return;
    }

    const heartIcons = ['💕', '❤️', '💖', '💗', '💓', '💝'];
    const generatedHearts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      icon: heartIcons[i % heartIcons.length],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 4, // 4 to 9s
      size: Math.random() * 1.5 + 1 // 1 to 2.5rem
    }));
    setHearts(generatedHearts);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart-element text-center select-none"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}rem`,
          }}
        >
          {h.icon}
        </span>
      ))}
    </div>
  );
}

// ----------------------------------------------------
// Main Anniversary Page
// ----------------------------------------------------
export default function HundredDaysEventPage() {
  // If the feature flag is disabled, return 404
  if (!ENABLE_100_DAYS_EVENT) {
    notFound();
  }

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Trigger heart burst / sparkles on card change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const winX = window.innerWidth / 2;
      const winY = window.innerHeight / 2 - 50;
      triggerSparkles(winX, winY, 'tapper');
    }
  }, [currentIdx]);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePageTurn = (direction: 'left' | 'right') => {
    const targetOffset = direction === 'left' ? -600 : 600;
    setSwipeOffset(targetOffset);

    setTimeout(() => {
      if (direction === 'left') {
        if (currentIdx < LOVE_REASONS.length - 1) {
          setCurrentIdx((prev) => prev + 1);
          setIsFlipped(false);
        }
      } else {
        if (currentIdx > 0) {
          setCurrentIdx((prev) => prev - 1);
          setIsFlipped(false);
        }
      }
      setSwipeOffset(0);
    }, 250);
  };

  // Drag and touch swipe handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX.current;
    
    // Boundary checks (can't swipe previous on 0, or next on 99)
    if (deltaX > 0 && currentIdx === 0) {
      setSwipeOffset(deltaX * 0.2); // rubber-band effect
    } else if (deltaX < 0 && currentIdx === LOVE_REASONS.length - 1) {
      setSwipeOffset(deltaX * 0.2); // rubber-band effect
    } else {
      setSwipeOffset(deltaX);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(swipeOffset) > 120) {
      if (swipeOffset > 0 && currentIdx > 0) {
        handlePageTurn('right');
      } else if (swipeOffset < 0 && currentIdx < LOVE_REASONS.length - 1) {
        handlePageTurn('left');
      } else {
        setSwipeOffset(0);
      }
    } else {
      setSwipeOffset(0);
    }
  };

  // Stack rendering
  const renderStack = () => {
    const cards = [];
    const maxOffset = 2; // Show up to 3 cards in the deck

    for (let offset = maxOffset; offset >= 0; offset--) {
      const idx = currentIdx + offset;
      if (idx >= LOVE_REASONS.length) continue;

      const reason = LOVE_REASONS[idx];
      const isTop = offset === 0;

      // Card transform styles
      let style: React.CSSProperties = {
        zIndex: 30 - offset * 10,
        opacity: isTop ? 1 : 1 - offset * 0.35,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
      };

      if (isTop) {
        style.transform = `translate3d(${swipeOffset}px, 0, 0) rotate(${swipeOffset * 0.05}deg)`;
      } else if (offset === 1) {
        style.transform = 'scale(0.96) translateY(12px) rotate(2deg)';
      } else if (offset === 2) {
        style.transform = 'scale(0.92) translateY(24px) rotate(-2deg)';
      }

      cards.push(
        <div
          key={reason.id}
          className="absolute inset-0 card-perspective pointer-events-none"
          style={style}
        >
          <div
            className={`card-inner w-full h-full relative duration-500 preserve-3d select-none pointer-events-auto cursor-pointer ${
              isTop && isFlipped ? 'rotated-y-180' : ''
            }`}
            onClick={() => isTop && toggleFlip()}
          >
            {/* CARD FRONT */}
            <div className="card-front absolute inset-0 backface-hidden rounded-2xl sketchy-border bg-white shadow-xl p-6 flex flex-col justify-between items-center bg-radial from-rose-50/20 to-white">
              {/* Taped look */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-rose-200/70 border border-white/40 rotate-1 shadow-sm flex items-center justify-center font-patrick text-xs text-rose-600/80 tracking-wider">
                💕 100 DAYS 💕
              </div>

              {/* Sparkle decorative element */}
              <div className="w-full flex justify-between text-rose-300">
                <span className="material-symbols-outlined text-2xl doodle-sparkle">auto_awesome</span>
                <span className="material-symbols-outlined text-2xl doodle-sparkle" style={{ animationDelay: '0.5s' }}>auto_awesome</span>
              </div>

              {/* Center Content */}
              <div className="flex flex-col items-center justify-center flex-1">
                <h3 className="font-cabin-sketch text-5xl font-bold text-primary mb-6 tracking-wide select-none">
                  Reason #{reason.id}
                </h3>
                
                {/* Heart Doodle */}
                <div className="relative w-32 h-32 flex items-center justify-center select-none">
                  <span 
                    className="material-symbols-outlined text-8xl text-rose-400 absolute animate-pulse"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                  {/* Subtle outline sparkles */}
                  <span className="material-symbols-outlined absolute text-xl text-amber-400 -top-1 -right-1 doodle-sparkle">draw</span>
                  <span className="material-symbols-outlined absolute text-xl text-rose-500 -bottom-1 -left-1 doodle-sparkle" style={{ animationDelay: '0.8s' }}>draw</span>
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="w-full text-center flex flex-col items-center gap-1 select-none">
                <span className="font-patrick text-base text-outline-variant italic flex items-center gap-1">
                  Tap to reveal 💫
                </span>
              </div>
            </div>

            {/* CARD BACK */}
            <div className="card-back absolute inset-0 backface-hidden rounded-2xl sketchy-border bg-white shadow-xl p-6 flex flex-col justify-between bg-radial from-rose-50/40 to-white select-none">
              {/* Taped look */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-rose-200/70 border border-white/40 rotate-1 shadow-sm flex items-center justify-center font-patrick text-xs text-rose-600/80 tracking-wider">
                💕 100 DAYS 💕
              </div>

              {/* Top Title */}
              <div className="w-full border-b-2 border-primary/10 pb-2 flex justify-between items-center text-primary/70">
                <span className="font-gloria text-sm">Reason #{reason.id}</span>
                <span className="material-symbols-outlined text-lg">favorite</span>
              </div>

              {/* The Reason Content */}
              <div className="flex-1 flex items-center justify-center py-4 px-2 overflow-y-auto">
                <p 
                  className={`font-patrick text-center text-primary leading-relaxed whitespace-pre-line ${
                    reason.id === 100 
                      ? 'text-lg sm:text-xl font-bold text-rose-700 md:leading-relaxed'
                      : 'text-2xl text-on-surface-variant'
                  }`}
                >
                  {reason.text}
                </p>
              </div>

              {/* Bottom Tap Instruction */}
              <div className="w-full text-center border-t-2 border-primary/10 pt-2 text-outline-variant">
                <span className="font-patrick text-sm italic">Tap to cover 🌟</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return cards;
  };

  const isFinalCard = currentIdx === LOVE_REASONS.length - 1;

  return (
    <main className="max-w-[1440px] mx-auto px-4 pt-24 pb-12 doodle-bg-dots min-h-screen relative flex flex-col justify-between items-center overflow-x-hidden">
      
      {/* Self-contained CSS Styles */}
      <style>{`
        .card-perspective {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotated-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-10vh) scale(1.3) rotate(360deg);
            opacity: 0;
          }
        }
        .floating-heart-element {
          position: fixed;
          bottom: -10%;
          color: #ffb3c1;
          font-size: 2rem;
          pointer-events: none;
          z-index: 50;
          animation: float-up 7s linear infinite;
        }
      `}</style>

      {/* Confetti & Hearts (triggered on Card 100) */}
      <ConfettiCanvas active={isFinalCard} />
      <FloatingHearts active={isFinalCard} />

      {/* Hero Header */}
      <div className="text-center w-full max-w-2xl mx-auto flex flex-col items-center mb-6">
        <h2 className="font-gloria text-3xl sm:text-4xl text-primary flex items-center gap-2 select-none">
          💕 100 Reasons Why I Love You 💕
        </h2>
        <p className="font-patrick text-lg text-on-surface-variant max-w-lg mt-3 select-none leading-relaxed">
          &quot;Happy 100 Days, Princess. These are just a few of the countless reasons why you’re so special to me.&quot;
        </p>
      </div>

      {/* Card Deck Wrapper */}
      <div className="w-full flex-1 flex flex-col items-center justify-center my-6">
        <div 
          ref={cardContainerRef}
          className="relative w-full max-w-[340px] sm:max-w-[360px] h-[400px] sm:h-[420px] select-none"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {renderStack()}
        </div>

        {/* Progress Tracker */}
        <div className="mt-8 bg-primary-container/40 px-6 py-2 rounded-full border-2 border-primary/20 shadow-sm flex items-center gap-2 font-gloria text-primary text-lg select-none">
          <span>💌</span>
          <span>{currentIdx + 1} / 100</span>
        </div>
      </div>

      {/* Desktop & Mobile Card Controls */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 mt-4">
        <div className="flex justify-center items-center gap-6">
          {/* Previous Button */}
          <button
            onClick={() => handlePageTurn('right')}
            disabled={currentIdx === 0}
            className={`sticker-btn px-6 py-2.5 bg-white text-primary rounded-full font-patrick text-lg flex items-center gap-2 transition-all select-none hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none`}
            title="Previous Reason"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            <span>Back</span>
          </button>

          {/* Next Button */}
          <button
            onClick={() => handlePageTurn('left')}
            disabled={currentIdx === LOVE_REASONS.length - 1}
            className={`sticker-btn px-6 py-2.5 bg-white text-primary rounded-full font-patrick text-lg flex items-center gap-2 transition-all select-none hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none`}
            title="Next Reason"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>

        {/* Happy 100 Days Fade-in Message */}
        <div 
          className="w-full text-center pb-4 select-none duration-1000 transition-all flex justify-center"
          style={{ 
            opacity: isFinalCard ? 1 : 0,
            transform: isFinalCard ? 'translateY(0)' : 'translateY(15px)',
            visibility: isFinalCard ? 'visible' : 'hidden'
          }}
        >
          <div className="taped-paper sketchy-border p-5 bg-white text-center w-full max-w-[340px] sm:max-w-md shadow-md bg-radial from-rose-50/50 to-white rotate-[-1deg]">
            <p className="font-gloria text-lg sm:text-xl text-rose-600 animate-bounce leading-relaxed">
              Happy 100 Days, My Cutkuk, My Vishku, My Cutkunnnuu, My Motkuk 💕
            </p>
          </div>
        </div>
      </div>

    </main>
  );
}
