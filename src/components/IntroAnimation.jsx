import React, { useState, useEffect, useRef, useCallback } from 'react';

const IntroAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState('init');
  const [visibleCount, setVisibleCount] = useState(-1);
  const [showSkip, setShowSkip] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const text = "Yadnesh AI";

  const finishIntro = useCallback(() => {
    localStorage.setItem('yadnesh_intro_seen', 'true');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setPhase('done');
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const hasSeen = localStorage.getItem('yadnesh_intro_seen');
    if (hasSeen === 'true') {
      onComplete();
      return;
    }

    setPhase('typing');

    // Show skip button after 1s
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    // Typing effect
    let count = -1;
    const typeInterval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= text.length) {
        clearInterval(typeInterval);
      }
    }, 100);

    // Hold phase
    const holdTimer = setTimeout(() => setPhase('holding'), 1500);

    // Dissolve phase
    const dissolveTimer = setTimeout(() => {
      setPhase('dissolving');
      startDissolve();
    }, 2500);

    // Done
    const doneTimer = setTimeout(() => {
      finishIntro();
    }, 4000);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(typeInterval);
      clearTimeout(holdTimer);
      clearTimeout(dissolveTimer);
      clearTimeout(doneTimer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [finishIntro, onComplete, text.length]);

  const startDissolve = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = 'white';
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 50 : 80;
    
    ctx.font = `bold ${fontSize}px Manrope, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const particles = [];
    
    const step = isMobile ? 2 : 3;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 128) {
          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            alpha: 1,
            size: Math.random() * 2 + 1,
          });
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particles;

    animateParticles();
  };

  const animateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeParticles = 0;
    
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;
      
      activeParticles++;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.015;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    
    if (activeParticles > 0) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }
  };

  if (phase === 'init' || phase === 'done') return null;

  return (
    <div className="fixed inset-0 bg-[#0a0e1a] z-[100] flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none"
      />
      
      {phase !== 'dissolving' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white font-bold font-heading text-[50px] md:text-[80px] leading-none flex">
            {text.split('').map((char, i) => (
              <span 
                key={i}
                className="inline-block transition-all duration-300 ease-out"
                style={{
                  opacity: visibleCount >= i ? 1 : 0,
                  transform: visibleCount >= i ? 'scale(1)' : 'scale(0.8)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>
      )}

      {showSkip && (
        <button 
          onClick={finishIntro}
          className="skip-btn absolute bottom-8 right-8 text-white/50 hover:text-white transition-colors text-sm font-medium tracking-wider uppercase z-10 cursor-pointer"
        >
          Skip
        </button>
      )}
    </div>
  );
};

export default IntroAnimation;
