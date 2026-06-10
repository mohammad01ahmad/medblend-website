'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Dna3DCanvas = dynamic(() => import('@/components/ui/dna-3d-canvas'), { ssr: false });

const FOUNDING_TEAM = [
  { name: 'Omar Oqaili', role: 'CEO & Founder', image: '/omar-picture.jpeg' },
  { name: 'Rima Khattab', role: 'Director of Marketing', image: '/reema-picture.jpeg' },
  { name: 'Muhammad Ahmad', role: 'Chief Technology Officer', image: '/ahmad2.jpeg' },
] as const;

export default function LandingHero() {
  const router = useRouter();
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sliderBtnRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const sliderTextRef = useRef<HTMLSpanElement>(null);
  const arrowIconRef = useRef<SVGSVGElement>(null);

  const [cardSize, setCardSize] = useState({ w: 950, h: 730 });

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Responsive frame sizing (desktop fluid / tablet scale / phone native layout) ──
  useEffect(() => {
    const adjustScale = () => {
      const frame = frameRef.current;
      const root = rootRef.current;
      if (!frame || !root) return;

      const w = window.innerWidth;

      if (w >= 1200) {
        frame.style.transform = 'none';
        frame.style.width = '100%';
        frame.style.height = '100%';
        frame.style.maxHeight = 'none';
        frame.style.borderRadius = '0px';
        frame.style.border = 'none';
        frame.style.boxShadow = 'none';
        root.style.height = '100vh';
        root.style.minHeight = '';
      } else if (w >= 768) {
        const scale = (w * 0.96) / 1200;
        frame.style.transform = `scale(${scale})`;
        frame.style.width = '1200px';
        frame.style.height = '850px';
        frame.style.maxHeight = 'none';
        frame.style.borderRadius = '40px';
        frame.style.border = '1px solid rgba(255,255,255,0.15)';
        frame.style.boxShadow = '0 30px 100px rgba(0,0,0,0.9), 0 0 100px var(--lh-accent-glow)';
        root.style.height = `${850 * scale + 40}px`;
        root.style.minHeight = '';
      } else {
        // Phone: CSS media queries handle layout — no transform scaling
        frame.style.transform = 'none';
        frame.style.width = '100%';
        frame.style.height = 'auto';
        frame.style.maxHeight = 'none';
        root.style.height = 'auto';
        root.style.minHeight = '100svh';
      }
    };
    adjustScale();
    window.addEventListener('resize', adjustScale);
    return () => window.removeEventListener('resize', adjustScale);
  }, []);

  // ── Slider drag ─────────────────────────────────────────────────────────
  useEffect(() => {
    const sliderBtn = sliderBtnRef.current;
    const sliderTrack = sliderTrackRef.current;
    const sliderText = sliderTextRef.current;
    const arrowIcon = arrowIconRef.current;
    if (!sliderBtn || !sliderTrack || !sliderText || !arrowIcon) return;

    let isDragging = false;
    let startX = 0;
    let maxOffset = 0;
    let currentOffset = 0;
    let isSuccess = false;

    const initSlider = () => {
      maxOffset = sliderTrack.clientWidth - sliderBtn.clientWidth - 8;
    };
    initSlider();
    window.addEventListener('resize', initSlider);

    const onDragStart = (e: MouseEvent | TouchEvent) => {
      if (isSuccess) return;
      isDragging = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      sliderBtn.style.transition = 'none';
      e.preventDefault();
    };

    const onDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || isSuccess) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      currentOffset = Math.max(0, Math.min(x - startX, maxOffset));
      sliderBtn.style.transform = `translateX(${currentOffset}px)`;
      const opacity = 1 - (currentOffset / maxOffset) * 1.2;
      sliderText.style.opacity = String(Math.max(0, opacity));
    };

    const onDragEnd = () => {
      if (!isDragging || isSuccess) return;
      isDragging = false;
      if (currentOffset >= maxOffset * 0.85) {
        isSuccess = true;
        sliderBtn.style.transition = 'transform 0.25s cubic-bezier(0.25,1,0.5,1)';
        sliderBtn.style.transform = `translateX(${maxOffset}px)`;
        sliderText.textContent = 'Welcome to MedBlend!';
        sliderText.style.opacity = '1';
        sliderTrack.classList.add('lh-slider--success');
        arrowIcon.style.transform = 'rotate(360deg)';

        setTimeout(() => {
          router.push('/waitlist');
        }, 800);
      } else {
        sliderBtn.style.transition = 'transform 0.3s ease-out';
        sliderBtn.style.transform = 'translateX(0px)';
        sliderText.style.opacity = '1';
        currentOffset = 0;
      }
    };

    sliderBtn.addEventListener('mousedown', onDragStart as EventListener);
    window.addEventListener('mousemove', onDragMove as EventListener);
    window.addEventListener('mouseup', onDragEnd);
    sliderBtn.addEventListener('touchstart', onDragStart as EventListener, { passive: false });
    window.addEventListener('touchmove', onDragMove as EventListener, { passive: false });
    window.addEventListener('touchend', onDragEnd);

    return () => {
      window.removeEventListener('resize', initSlider);
      sliderBtn.removeEventListener('mousedown', onDragStart as EventListener);
      window.removeEventListener('mousemove', onDragMove as EventListener);
      window.removeEventListener('mouseup', onDragEnd);
      sliderBtn.removeEventListener('touchstart', onDragStart as EventListener);
      window.removeEventListener('touchmove', onDragMove as EventListener);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, []);

  const { w, h } = cardSize;
  const scale = w < 768 ? w / 950 : 1;
  const cTR = 322 * scale; // Top right cutout width (optimized)
  const cBL = 322 * scale; // Bottom left cutout width (optimized)
  const r = 32 * scale;    // Corner radius
  const dynamicPath = `M 0,${r} A ${r},${r} 0 0,1 ${r},0 L ${w - cTR},0 A ${r},${r} 0 0,1 ${w - cTR + r},${r} L ${w - cTR + r},${43 * scale} A ${r},${r} 0 0,0 ${w - cTR + r + 32 * scale},${75 * scale} L ${w - r},${75 * scale} A ${r},${r} 0 0,1 ${w},${75 * scale + r} L ${w},${h - r} A ${r},${r} 0 0,1 ${w - r},${h} L ${cBL},${h} A ${r},${r} 0 0,1 ${cBL - r},${h - r} L ${cBL - r},${h - 43 * scale} A ${r},${r} 0 0,0 ${cBL - r - 32 * scale},${h - 75 * scale} L ${r},${h - 75 * scale} A ${r},${r} 0 0,1 0,${h - 75 * scale - r} Z`;

  return (
    <>
      <style>{`
        /* ─── LandingHero: scoped with "lh-" prefix ─────────────────────── */
        .lh-root {
          /* In normal page flow — not fixed — so the rest of the page scrolls below */
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background: var(--background);
          font-family: 'Inter', sans-serif;
          color: #fff;
          position: relative;
          --lh-accent: var(--pulse);
          --lh-accent-hover: var(--sage);
          --lh-accent-glow: var(--pulse-glow);
        }
        .lh-device-frame {
          position: relative;
          width: 1200px;
          height: 850px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 40px;
          box-shadow: 0 30px 100px rgba(0,0,0,0.9), 0 0 100px var(--lh-accent-glow);
          display: flex;
          overflow: hidden;
          transform-origin: center;
          flex-shrink: 0;
        }
        /* Sidebar */
        .lh-sidebar {
          width: 250px; height: 100%; background: #000;
          padding: 25px 10px 140px 10px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; z-index: 10; flex-shrink: 0;
        }
        .lh-logo-container { display: flex; align-items: center; gap: 0px; margin-bottom: 20px; }
        .lh-logo-img { border-radius: 8px; object-fit: cover; flex-shrink: 0; }
        .lh-logo-text { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
        .lh-sidebar-middle { margin-top: auto; margin-bottom: 35px; margin-left: 20px; }
        .lh-contact-heading { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 20px 0; letter-spacing: -0.5px; }
        .lh-contact-info { display: flex; flex-direction: column; gap: 12px; }
        .lh-contact-link { font-size: 12.5px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; word-break: break-all; }
        .lh-contact-link:hover { color: #fff; }
        .lh-contact-detail { font-size: 12.5px; color: rgba(255,255,255,0.4); line-height: 1.6; }
        /* Main */
        .lh-main { flex: 1; height: 100%; position: relative; }
        /* Top-right buttons */
        .lh-top-right { position: absolute; top: 30px; right: 35px; width: 270px; height: 55px; display: flex; justify-content: center; z-index: 25; }
        .lh-btn-login {
          padding: clamp(8px,0.9%,12px) clamp(18px,2%,30px); border: 1.5px solid rgba(255,255,255,0.35); border-radius: 30px;
          color: #fff; font-size: clamp(11px,1.1vw,14px); font-weight: 600; text-decoration: none;
          background: transparent; transition: all 0.2s;
        }
        .lh-btn-login:hover { background: rgba(255,255,255,0.08); border-color: #fff; }
        .lh-btn-signup {
          width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;
          border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px 22px 10px 22px;
          color: #fff; font-size: clamp(12px, 1.2vw, 14px); font-weight: 600; text-decoration: none; white-space: nowrap;
          background: var(--lh-accent); transition: all 0.2s;
          box-shadow: 0 4px 15px var(--lh-accent-glow);
        }
        .lh-btn-signup:hover { background: var(--lh-accent-hover); border-color: rgba(255,255,255,0.4); transform: translateY(-1px); box-shadow: 0 6px 20px var(--pulse-glow); }
        /* Card border SVG */
        .lh-card-border-svg {
          position: absolute; top: 20px; left: 0; right: 25px; bottom: 25px;
          width: calc(100% - 25px); height: calc(100% - 45px);
          pointer-events: none; z-index: 6;
        }
        /* Purple card */
        .lh-purple-card {
          position: absolute; top: 20px; left: 0; right: 25px; bottom: 25px;
          background: var(--void);
          clip-path: url(#lh-card-clip); overflow: hidden; z-index: 2;
        }
        .lh-purple-card-bg {
          opacity: 0.9;
        }
        .lh-purple-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--sage-soft) 0%, rgba(10,18,14,0.75) 55%, rgba(5,10,8,0.88) 100%);
          z-index: 1; pointer-events: none;
        }
        .lh-nav { position: absolute; top: 2.6%; left: 50%; transform: translateX(-50%); display: flex; width: min(340px, 35%); gap: 8px; z-index: 10; }
        .lh-nav-item {
          flex: 1; padding: 8px 0; font-size: clamp(11px, 1vw, 13px); font-weight: 500;
          display: flex; justify-content: center; align-items: center; box-sizing: border-box;
          color: rgba(255,255,255,0.65); text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15); border-radius: 30px;
          transition: all 0.2s ease; background: rgba(255,255,255,0.02); backdrop-filter: blur(5px);
        }
        .lh-nav-item:hover { color: #fff; border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.06); }
        .lh-nav-item.active { color: #fff; background: rgba(0,0,0,0.65); border-color: rgba(255,255,255,0.1); }
        /* Hero content */
        .lh-hero { position: absolute; left: 5.8%; top: 24%; max-width: 55%; z-index: 10; }
        .lh-hero h1 { font-size: clamp(32px,3.8vw,48px); font-weight: 700; line-height: 1.12; color: #fff; margin: 0 0 16px; letter-spacing: -0.5px; }
        .lh-hero p { font-size: 13.5px; color: rgba(255,255,255,0.65); line-height: 1.45; max-width: 360px; }
        /* Cards stack */
        .lh-cards-stack { position: absolute; right: 30px; top: 15.3%; display: flex; flex-direction: column; gap: clamp(10px, 1.5%, 16px); width: 280px; z-index: 10; }
        .lh-glass-card {
          background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.35); padding: 16px;
          display: flex; justify-content: space-between; align-items: center;
          transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1); cursor: pointer;
        }
        .lh-glass-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 40px var(--lh-accent-glow); }
        .lh-card-left { flex: 1; padding-right: 12px; }
        .lh-stat-number { font-size: clamp(20px, 2.2vw, 26px); font-weight: 700; color: #fff; margin-bottom: 4px; letter-spacing: -0.5px; }
        .lh-card-title { font-size: clamp(11.5px, 1.2vw, 13.5px); font-weight: 600; color: #fff; margin-bottom: 6px; }
        .lh-card-desc { font-size: clamp(8.5px, 0.9vw, 10px); color: rgba(255,255,255,0.5); line-height: 1.4; }
        .lh-team-card { align-items: stretch; padding: 14px 14px 12px; cursor: default; }
        .lh-team-card .lh-card-title { margin-bottom: 10px; letter-spacing: 0.02em; }
        .lh-team-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .lh-team-list li { margin: 0; padding: 0; }
        .lh-team-row {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 9px; border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          text-decoration: none; color: inherit; cursor: pointer;
        }
        .lh-team-row:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
          transform: translateX(2px);
        }
        .lh-team-row img {
          width: clamp(28px, 3vw, 36px); height: clamp(28px, 3vw, 36px); border-radius: 50%; object-fit: cover; flex-shrink: 0;
          border: 1.5px solid var(--sage-glow);
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .lh-team-row:hover img { border-color: var(--sage); box-shadow: 0 0 10px var(--pulse-glow); }
        .lh-team-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
        .lh-member-name {
          font-size: clamp(10px, 1.1vw, 12px); font-weight: 600; color: rgba(255,255,255,0.92);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: 0.01em; line-height: 1.2;
        }
        .lh-member-role {
          font-size: clamp(8px, 0.8vw, 9.5px); font-weight: 500; color: rgba(255,255,255,0.42);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: 0.02em; line-height: 1.2;
        }
        .lh-team-row:hover .lh-member-role { color: var(--sage); }
        .lh-card-arrow { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.75); cursor: pointer; flex-shrink: 0; transition: all 0.25s; }
        .lh-glass-card:hover .lh-card-arrow { background: #fff; color: #000; border-color: #fff; transform: rotate(-45deg); }
        /* Slider */
        .lh-slider-track {
          position: absolute; bottom: 35px; left: 25px; width: 505px; height: 55px;
          background: #000; border: 1.5px solid rgba(255,255,255,0.35); border-radius: 22px;
          display: flex; align-items: center; padding: 4px; box-sizing: border-box;
          z-index: 30; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .lh-slider-track.lh-slider--success { border-color: var(--pulse); box-shadow: 0 0 15px var(--pulse-glow); }
        .lh-slider-track.lh-slider--success .lh-slider-btn { border-color: var(--pulse); color: var(--pulse); }
        .lh-slider-track.lh-slider--success .lh-slider-text { color: var(--sage); font-weight: 600; }
        .lh-slider-btn { width: 46px; height: 46px; border-radius: 50%; background: #000; border: 1.5px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; cursor: grab; z-index: 2; touch-action: none; box-shadow: 0 0 10px rgba(255,255,255,0.1); }
        .lh-slider-btn:active { cursor: grabbing; }
        .lh-slider-btn svg { transition: transform 0.3s; }
        .lh-slider-text { position: absolute; width: 100%; left: 0; text-align: center; font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.45); letter-spacing: 0.8px; pointer-events: none; z-index: 1; transition: opacity 0.3s; }

        /* ─── Phone: native stacked layout (no transform scale) ─────────── */
        @media (max-width: 767px) {
          .lh-root {
            height: auto !important;
            min-height: 100svh;
            padding: max(10px, env(safe-area-inset-top)) 12px max(16px, env(safe-area-inset-bottom));
            overflow: visible;
            align-items: stretch;
            justify-content: flex-start;
          }

          .lh-device-frame {
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            transform: none !important;
            flex-direction: column;
            border-radius: 24px;
            box-shadow: 0 16px 48px rgba(0,0,0,0.75), 0 0 60px var(--lh-accent-glow);
          }

          /* Compact top bar */
          .lh-sidebar {
            width: 100%;
            height: auto;
            padding: 14px 16px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .lh-logo-container { margin-bottom: 0; gap: 8px; }
          .lh-logo-img { width: 44px !important; height: 44px !important; }
          .lh-logo-text { font-size: 17px; }
          .lh-sidebar-middle { display: none; }

          .lh-main {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 0;
          }

          .lh-top-right {
            position: relative;
            top: auto;
            right: auto;
            order: 1;
            display: flex;
            justify-content: center;
            gap: 10px;
            padding: 0;
            margin: 12px 12px 0;
            width: calc(100% - 24px);
            z-index: 25;
          }
          .lh-btn-login,
          .lh-btn-signup {
            padding: 10px 18px;
            font-size: 12px;
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            border-radius: 50px;
          }

          .lh-card-border-svg { display: none; }

          .lh-purple-card {
            position: relative;
            top: auto;
            left: auto;
            right: auto;
            bottom: auto;
            order: 2;
            margin: 12px;
            width: auto;
            clip-path: none;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.12);
            display: flex;
            flex-direction: column;
            gap: 18px;
            padding: 16px 14px 18px;
            min-height: 420px;
          }
          .lh-purple-card-bg { opacity: 0.85; }
          .lh-nav,
          .lh-hero,
          .lh-cards-stack {
            position: relative;
            z-index: 10;
          }

          .lh-nav {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            display: flex;
            width: 100%;
            justify-content: center;
            gap: 8px;
            order: 1;
          }
          .lh-nav-item {
            flex: 1; padding: 8px 0;
            font-size: 11px;
            min-height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .lh-hero {
            position: relative;
            left: auto;
            top: auto;
            max-width: 100%;
            text-align: center;
            order: 2;
            padding: 0 4px;
          }
          .lh-hero h1 {
            font-size: clamp(26px, 7.5vw, 36px);
            margin-bottom: 12px;
          }
          .lh-hero p {
            font-size: 13px;
            max-width: 100%;
            margin: 0 auto;
          }

          .lh-cards-stack {
            position: relative;
            right: auto;
            top: auto;
            width: 100%;
            order: 3;
            gap: 12px;
          }
          .lh-glass-card {
            padding: 14px;
            border-radius: 16px;
          }
          .lh-glass-card:hover {
            transform: none;
          }
          .lh-stat-number { font-size: 22px; }
          .lh-team-row img { width: 38px; height: 38px; }
          .lh-team-list { gap: 8px; }
          .lh-member-name { font-size: 13px; }
          .lh-member-role { font-size: 10.5px; }

          .lh-slider-track {
            position: relative;
            bottom: auto;
            left: auto;
            order: 3;
            width: calc(100% - 24px);
            max-width: 100%;
            margin: 4px 12px 14px;
            height: 52px;
          }
          .lh-slider-btn {
            width: 42px;
            height: 42px;
          }
          .lh-slider-text {
            font-size: 11px;
            letter-spacing: 0.5px;
            padding: 0 48px;
          }
        }

        /* ─── Small phones ─────────────────────────────────────────────── */
        @media (max-width: 399px) {
          .lh-root { padding-left: 8px; padding-right: 8px; }

          .lh-logo-text { font-size: 15px; }
          .lh-top-right {
            flex-direction: column;
            align-items: stretch;
            padding-top: 10px;
          }
          .lh-btn-login,
          .lh-btn-signup {
            justify-content: center;
            width: 100%;
          }

          .lh-purple-card {
            margin: 8px;
            padding: 14px 12px 16px;
            gap: 14px;
          }

          .lh-nav { gap: 6px; }
          .lh-nav-item {
            padding: 6px 0;
            font-size: 10px;
          }

          .lh-hero h1 { font-size: 24px; }

          .lh-card-arrow { width: 28px; height: 28px; }
          .lh-member-name { font-size: 12px; }
          .lh-team-row img { width: 34px; height: 34px; }

          .lh-slider-track {
            width: calc(100% - 16px);
            margin: 4px 8px 12px;
          }
        }

        /* ─── Landscape phone: keep content scrollable ───────────────────── */
        @media (max-width: 767px) and (orientation: landscape) {
          .lh-root { min-height: auto; }
          .lh-purple-card { gap: 12px; padding: 12px; }
          .lh-hero h1 { font-size: 22px; }
          .lh-cards-stack { gap: 8px; }
          .lh-glass-card { padding: 10px 12px; }
        }
      `}</style>


      {/* ── Full-height hero section ──────────────────────────────────────── */}
      <section className="lh-root" ref={rootRef} id="landing-hero">
        <div className="lh-device-frame" ref={frameRef}>

          {/* Left Sidebar */}
          <aside className="lh-sidebar">
            <div className="lh-logo-container">
              <Image
                src="/MedBlend-logo.jpeg"
                alt="MedBlend Logo"
                width={64}
                height={64}
                className="lh-logo-img"
              />
              <span className="lh-logo-text">MedBlendApp</span>
            </div>

            <div className="lh-sidebar-middle">
              <h2 className="lh-contact-heading">Get in Touch</h2>
              <div className="lh-contact-info">
                <a href="mailto:medblendapp@gmail.com" className="lh-contact-link">
                  medblendapp@gmail.com
                </a>
                <div className="lh-contact-detail">Instagram: @medblendapp</div>
                <div className="lh-contact-detail">
                  Real guidance from medical students and doctors.
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lh-main">

            {/* Instagram / LinkedIn */}
            <div className="lh-top-right">
              <a href="/waitlist" className="lh-btn-signup">
                Join the Waitlist
              </a>
            </div>

            {/* Glowing border overlay */}
            <svg className="lh-card-border-svg" width="100%" height="100%">
              <defs>
                <clipPath id="lh-card-clip">
                  <path d={dynamicPath} />
                </clipPath>
              </defs>
              <path d={dynamicPath} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
            </svg>

            {/* Purple display card */}
            <div className="lh-purple-card" ref={cardRef}>
              <Dna3DCanvas className="lh-purple-card-bg" embedded />

              {/* Nav */}
              <nav className="lh-nav">
                <a href="/" className="lh-nav-item active">Home</a>
                <a href="/#about" className="lh-nav-item">About</a>
                <a href="/#team" className="lh-nav-item">Team</a>
                <a href="/FAQ" className="lh-nav-item">FAQ</a>
              </nav>

              {/* Hero text */}
              <div className="lh-hero">
                <h1>Enter Medicine<br />Knowing What<br />To Expect</h1>
                <p>Real guidance from students and doctors who&apos;ve already lived it.</p>
              </div>

              {/* Widget cards */}
              <div className="lh-cards-stack">

                {/* Stats */}
                <div className="lh-glass-card">
                  <div className="lh-card-left">
                    <div className="lh-stat-number">500+</div>
                    <div className="lh-card-desc">Aspiring medical students on our early access waitlist.</div>
                  </div>
                </div>

                {/* Founding Team */}
                <div className="lh-glass-card lh-team-card">
                  <div className="lh-card-left">
                    <div className="lh-card-title">Founding Team</div>
                    <ul className="lh-team-list">
                      {FOUNDING_TEAM.map((member) => (
                        <li key={member.name}>
                          <a href="/#team" className="lh-team-row" aria-label={`Meet ${member.name}, ${member.role}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={member.image} alt={member.name} />
                            <span className="lh-team-info">
                              <span className="lh-member-name">{member.name}</span>
                              <span className="lh-member-role">{member.role}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Verified Mentors */}
                <div className="lh-glass-card">
                  <div className="lh-card-left">
                    <div className="lh-card-title">Verified Mentors</div>
                    <div className="lh-card-desc">
                      Every mentor is verified — real students, residents, and doctors giving real answers.
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </main>

          {/* Swipe slider */}
          <div className="lh-slider-track" ref={sliderTrackRef}>
            <div className="lh-slider-btn" ref={sliderBtnRef}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" ref={arrowIconRef}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <span className="lh-slider-text" ref={sliderTextRef}>Swipe to Join Waitlist</span>
          </div>

        </div>
      </section>
    </>
  );
}

