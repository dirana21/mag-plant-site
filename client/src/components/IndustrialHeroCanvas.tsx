import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, RotateCcw, ArrowRight, CheckCircle2, ShieldCheck, Flame, Volume2, VolumeX } from 'lucide-react';

type PressStage = 'IDLE' | 'COMPRESSING' | 'VULCANIZING' | 'OPENING' | 'FINISHED';

export const IndustrialHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stage, setStage] = useState<PressStage>('IDLE');
  const [progress, setProgress] = useState(0); // 0 to 100%
  const [tonnage, setTonnage] = useState(0); // 0 to 500 Tons
  const [soundEnabled, setSoundEnabled] = useState(true);

  // References to keep sync inside requestAnimationFrame
  const stageRef = useRef<PressStage>('IDLE');
  const progressRef = useRef(0);
  const tonnageRef = useRef(0);
  const soundEnabledRef = useRef(soundEnabled);

  // Interval & timeout handles
  const compressTimerRef = useRef<any>(null);
  const vulcanizeTimerRef = useRef<any>(null);
  const finishTimeoutRef = useRef<any>(null);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Clean up any active timers on unmount
  useEffect(() => {
    return () => {
      if (compressTimerRef.current) clearInterval(compressTimerRef.current);
      if (vulcanizeTimerRef.current) clearInterval(vulcanizeTimerRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, []);

  // Web Audio Context for realistic deep mechanical hydraulics & steam
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioClass) audioCtxRef.current = new AudioClass();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playHydraulicHum = () => {
    if (!soundEnabledRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      // Deep low-frequency hydraulic pump motor
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 1.2);

      // Low pass filter to remove harshness, leaving deep rumble
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch (_) {}
  };

  const playHydraulicLock = () => {
    if (!soundEnabledRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      // Deep solid low-pitch metallic thud upon 500-ton die closure
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(70, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.3);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch (_) {}
  };

  const playPneumaticSteam = () => {
    if (!soundEnabledRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const bufferSize = ctx.sampleRate * 0.9;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.85);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (_) {}
  };

  // Launch the Pressing Sequence
  const handleStartPressing = () => {
    if (stage !== 'IDLE' && stage !== 'FINISHED') return;
    initAudio();
    playHydraulicHum();

    setStage('COMPRESSING');
    stageRef.current = 'COMPRESSING';
    setProgress(0);
    progressRef.current = 0;
    setTonnage(0);
    tonnageRef.current = 0;

    if (compressTimerRef.current) clearInterval(compressTimerRef.current);
    if (vulcanizeTimerRef.current) clearInterval(vulcanizeTimerRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

    // 1. Descending & Compressing (1.2 seconds)
    let currentT = 0;
    compressTimerRef.current = setInterval(() => {
      currentT += 35;
      if (currentT >= 500) {
        currentT = 500;
        clearInterval(compressTimerRef.current);
        setTonnage(500);
        tonnageRef.current = 500;
        setStage('VULCANIZING');
        stageRef.current = 'VULCANIZING';
        playHydraulicLock();

        // 2. Vulcanizing Delay (1.8 seconds with progress 0 -> 100%)
        let p = 0;
        vulcanizeTimerRef.current = setInterval(() => {
          p += 5;
          setProgress(p);
          progressRef.current = p;
          if (p >= 100) {
            clearInterval(vulcanizeTimerRef.current);
            setStage('OPENING');
            stageRef.current = 'OPENING';
            playPneumaticSteam();

            // 3. Opening & Product Release (1.0 second)
            finishTimeoutRef.current = setTimeout(() => {
              setStage('FINISHED');
              stageRef.current = 'FINISHED';
            }, 1000);
          }
        }, 85);
      } else {
        setTonnage(currentT);
        tonnageRef.current = currentT;
      }
    }, 80);
  };

  const handleReset = () => {
    if (compressTimerRef.current) clearInterval(compressTimerRef.current);
    if (vulcanizeTimerRef.current) clearInterval(vulcanizeTimerRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);

    setStage('IDLE');
    stageRef.current = 'IDLE';
    setProgress(0);
    progressRef.current = 0;
    setTonnage(0);
    tonnageRef.current = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Steam particles
    interface Steam {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }
    const steamList: Steam[] = [];

    // Crumb particles in mold
    const crumbCount = 35;
    const crumbs: { x: number; y: number; r: number; color: string }[] = [];
    for (let i = 0; i < crumbCount; i++) {
      crumbs.push({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 20,
        r: Math.random() * 3 + 1.5,
        color: Math.random() > 0.3 ? '#334155' : '#10b981'
      });
    }

    let time = 0;
    let pistonY = 0; // Current piston vertical offset

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const cx = width > 768 ? width * 0.56 : width * 0.5;
      const cy = height * 0.46;

      const currentStage = stageRef.current;

      // Calculate piston gap according to active stage
      let targetPistonGap = 85; // Rest position gap
      if (currentStage === 'COMPRESSING') {
        targetPistonGap = 85 - (tonnageRef.current / 500) * 65; // descend down
      } else if (currentStage === 'VULCANIZING') {
        targetPistonGap = 20; // locked closed under 500T!
      } else if (currentStage === 'OPENING' || currentStage === 'FINISHED') {
        targetPistonGap = 85; // piston opens back up
      }

      pistonY += (targetPistonGap - pistonY) * 0.14;

      // 1. Background Radial Lighting
      const bgGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.min(width, height) * 0.48);
      if (currentStage === 'VULCANIZING') {
        bgGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)'); // Hot thermal orange
        bgGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
      } else if (currentStage === 'FINISHED') {
        bgGlow.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); // Success emerald
        bgGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      } else {
        bgGlow.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
        bgGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      }
      bgGlow.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Rotating Tread Halo
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.2);
      ctx.strokeStyle = currentStage === 'VULCANIZING' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(52, 211, 153, 0.35)';
      ctx.lineWidth = 1.5;
      const treadCount = 28;
      const outerR = 175;
      const innerR = 162;
      ctx.beginPath();
      for (let i = 0; i < treadCount; i++) {
        const a1 = (i / treadCount) * Math.PI * 2;
        const a2 = ((i + 0.5) / treadCount) * Math.PI * 2;
        ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
        ctx.lineTo(Math.cos(a2) * innerR, Math.sin(a2) * innerR);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // 3. Draw The 500-Ton Hydraulic Press Machinery
      ctx.save();
      ctx.translate(cx, cy);

      // Heavy Press Column Pillars (left and right steel columns)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;

      // Left Column
      ctx.beginPath();
      ctx.roundRect(-105, -150, 22, 300, 4);
      ctx.fill();
      ctx.stroke();

      // Right Column
      ctx.beginPath();
      ctx.roundRect(83, -150, 22, 300, 4);
      ctx.fill();
      ctx.stroke();

      // Heavy Top Header Crossbeam
      const beamGrad = ctx.createLinearGradient(-110, -150, 110, -110);
      beamGrad.addColorStop(0, '#334155');
      beamGrad.addColorStop(0.5, '#1e293b');
      beamGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = beamGrad;
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.roundRect(-115, -160, 230, 32, 6);
      ctx.fill();
      ctx.stroke();

      // Central Hydraulic Cylinder (Stationary housing at top)
      ctx.fillStyle = '#475569';
      ctx.fillRect(-28, -128, 56, 45);

      // Hydraulic Moving Shaft (moves downward)
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-18, -pistonY - 60, 36, 50);

      // MOVING TOP DIE PLATE (Piston Head)
      const dieGrad = ctx.createLinearGradient(-75, -pistonY, 75, -pistonY + 24);
      dieGrad.addColorStop(0, '#334155');
      dieGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = dieGrad;
      ctx.strokeStyle = currentStage === 'VULCANIZING' ? '#f59e0b' : '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-75, -pistonY - 24, 150, 24, 6);
      ctx.fill();
      ctx.stroke();

      // Pressure Heat Glow when Vulcanizing
      if (currentStage === 'VULCANIZING') {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#fbbf24';
        ctx.strokeRect(-72, -pistonY - 2, 144, 2);
        ctx.shadowBlur = 0;
      }

      // BOTTOM STATIONARY MOLD BED
      ctx.fillStyle = dieGrad;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-85, 30, 170, 30, 6);
      ctx.fill();
      ctx.stroke();

      // 4. WHAT IS INSIDE THE MOLD?
      // A) Before or during compression: Raw Rubber Crumb + Steel Insert
      if (currentStage === 'IDLE' || currentStage === 'COMPRESSING') {
        // Draw uncompressed crumb particles
        crumbs.forEach(c => {
          ctx.beginPath();
          ctx.arc(c.x, 15 + c.y * (pistonY / 85), c.r, 0, Math.PI * 2);
          ctx.fillStyle = c.color;
          ctx.fill();
        });

        // Steel reinforcement insert sitting in mold
        ctx.fillStyle = '#94a3b8';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-35, 12, 70, 8);
        ctx.strokeRect(-35, 12, 70, 8);
      }

      // B) During Vulcanizing: Hot Molten Mass in Mold
      if (currentStage === 'VULCANIZING') {
        ctx.fillStyle = '#b45309'; // Red-hot rubber
        ctx.beginPath();
        ctx.roundRect(-55, -pistonY, 110, pistonY + 30, 4);
        ctx.fill();

        ctx.fillStyle = '#fef08a'; // Glowing core
        ctx.fillRect(-25, 0, 50, 6);

        // Spawn thermal steam sparks from sides
        if (Math.random() < 0.4) {
          steamList.push({
            x: cx + (Math.random() > 0.5 ? -70 : 70),
            y: cy + 5,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 2 - 1,
            radius: Math.random() * 8 + 4,
            alpha: 0.6
          });
        }
      }

      // C) When Finished: THE FINISHED PRODUCT! (MAG Heavy Block Pallet)
      if (currentStage === 'OPENING' || currentStage === 'FINISHED') {
        // Render detailed finished rubber pallet
        ctx.save();
        // Subtle hover float when finished
        const floatOffset = currentStage === 'FINISHED' ? Math.sin(time * 2) * 4 : 0;
        ctx.translate(0, floatOffset);

        // Pallet main deck (dense vulcanized black rubber)
        const palletGrad = ctx.createLinearGradient(-60, 5, 60, 25);
        palletGrad.addColorStop(0, '#1e293b');
        palletGrad.addColorStop(0.5, '#0f172a');
        palletGrad.addColorStop(1, '#1e293b');

        ctx.fillStyle = palletGrad;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;

        // Top deck slab
        ctx.beginPath();
        ctx.roundRect(-60, 2, 120, 12, 3);
        ctx.fill();
        ctx.stroke();

        // 3 Support blocks under pallet deck
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        // Left block
        ctx.fillRect(-55, 14, 25, 14);
        ctx.strokeRect(-55, 14, 25, 14);
        // Center block
        ctx.fillRect(-12, 14, 24, 14);
        ctx.strokeRect(-12, 14, 24, 14);
        // Right block
        ctx.fillRect(30, 14, 25, 14);
        ctx.strokeRect(30, 14, 25, 14);

        // Integrated steel reinforcement strip (glowing silver)
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fillRect(-45, 6, 90, 4);

        // Quality Stamp MAG
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('MAG BLOCK ★ 6.5T', 0, 24);

        ctx.restore();
      }

      ctx.restore();

      // 5. Draw Venting Steam Clouds
      for (let i = steamList.length - 1; i >= 0; i--) {
        const s = steamList[i];
        s.x += s.vx;
        s.y += s.vy;
        s.radius += 0.35;
        s.alpha *= 0.94;

        ctx.fillStyle = 'rgba(241, 245, 249, 0.4)';
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (s.alpha <= 0.02) steamList.splice(i, 1);
      }

      // 6. HUD Telemetry Bar at bottom of canvas
      ctx.save();
      const hudY = height - 52;
      const hudX = 20;

      // Status pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = currentStage === 'VULCANIZING' ? '#f59e0b' : currentStage === 'FINISHED' ? '#10b981' : '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, 175, 36, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = currentStage === 'VULCANIZING' ? '#f59e0b' : currentStage === 'FINISHED' ? '#34d399' : '#10b981';
      ctx.beginPath();
      ctx.arc(hudX + 16, hudY + 18, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`ТИСК: ${tonnageRef.current} Т / 500 Т`, hudX + 28, hudY + 15);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(
        currentStage === 'IDLE'
          ? 'СТАН: ГОТОВИЙ ДО ЗАПУСКУ'
          : currentStage === 'COMPRESSING'
          ? 'СТАН: ОПУСКАННЯ ПРЕСА...'
          : currentStage === 'VULCANIZING'
          ? `ВУЛКАНІЗАЦІЯ 165°C: ${progressRef.current}%`
          : 'СТАН: ВИРІБ СФОРМОВАНО',
        hudX + 28,
        hudY + 28
      );

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[600px] flex items-center justify-center overflow-hidden select-none">
      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Top Sound Toggle Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs backdrop-blur-md"
          title={soundEnabled ? 'Вимкнути звук' : 'Увімкнути звук'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          <span className="text-[10px] hidden sm:inline">{soundEnabled ? 'Звук: Увімкнено' : 'Звук: Вимкнено'}</span>
        </button>
      </div>

      {/* 1. IDLE STATE: PROMINENT INDUSTRIAL ACTION BUTTON */}
      {stage === 'IDLE' && (
        <div className="absolute bottom-16 sm:bottom-12 z-20 flex flex-col items-center gap-2 animate-in fade-in duration-300">
          <button
            onClick={handleStartPressing}
            className="group relative px-7 py-4 rounded-2xl font-black font-heading tracking-wider uppercase text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/40 flex items-center gap-3 border-2 border-emerald-300 cursor-pointer"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-950 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-black" />
            </span>
            <span>⚡ Запустити пресування 500 тонн</span>
            <Play className="w-4 h-4 fill-black" />
          </button>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
            Натисніть для запуску повного циклу виготовлення палети
          </span>
        </div>
      )}

      {/* 2. COMPRESSING & VULCANIZING OVERLAY: REAL PROCESS WITH PROGRESS */}
      {(stage === 'COMPRESSING' || stage === 'VULCANIZING') && (
        <div className="absolute bottom-16 sm:bottom-12 z-20 max-w-sm w-full px-4 animate-in fade-in duration-200">
          <div className="bg-slate-950/90 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white flex items-center gap-1.5">
                {stage === 'COMPRESSING' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-cyan-400">Опускання гідравлічного поршня...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-amber-400">Гаряча вулканізація (165°C / 500Т)</span>
                  </>
                )}
              </span>
              <span className="text-white font-mono">{progress}%</span>
            </div>

            {/* Industrial Progress Bar */}
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  stage === 'COMPRESSING'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-300'
                }`}
                style={{ width: `${stage === 'COMPRESSING' ? (tonnage / 500) * 100 : progress}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 text-center font-mono">
              {stage === 'COMPRESSING' ? 'Формування геометрії прес-форми...' : 'Спікання гумового масиву зі сталевим армуванням...'}
            </p>
          </div>
        </div>
      )}

      {/* 3. FINISHED STATE: CELEBRATION & PRODUCT CARD */}
      {stage === 'FINISHED' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl shadow-emerald-500/20 space-y-5 text-center relative overflow-hidden">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Виріб успішно спресовано!</span>
            </div>

            {/* Product Snapshot */}
            <div className="space-y-2">
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 mx-auto overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80"
                  alt="Спресована палета"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-lg font-bold font-heading text-white">
                Блочна гумова палета MAG Heavy Block
              </h3>

              {/* Specs chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-[11px] bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-850 font-mono">
                  Вага: 48 кг
                </span>
                <span className="text-[11px] bg-emerald-950/60 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold">
                  Навантаження: 6 500 кг
                </span>
                <span className="text-[11px] bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-850 font-mono">
                  Сталевий пояс 4 мм
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Монолітна структура без внутрішніх пустот сформована під зусиллям 500 тонн. Повністю стійка до солей, мастил та ударів.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Link
                to="/catalog/paleta-blochna-gumova-mag-heavy-block-1200x800"
                className="flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Товар у каталозі</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Спресувати ще раз</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
