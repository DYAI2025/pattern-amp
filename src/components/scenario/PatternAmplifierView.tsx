/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  Sliders, 
  HelpCircle,
  AlertTriangle,
  Flame,
  Globe,
  Wind,
  CloudUpload,
  Check
} from 'lucide-react';
import { 
  project3DTo2D, 
  SVGPoint2D 
} from './vectorProjection';
import { 
  generateGrowthBranches, 
  UserPatternState, 
  DEFAULT_PATTERN_STATE 
} from './branchGrowthEngine';
import { 
  uploadCalibration, 
  fetchCalibration, 
  isSupabaseConfigured 
} from '../../lib/supabase';
import { GrowthBranch } from './patternAmplifierTypes';
import { TendencyCategory, ScenarioBranch } from '../../types';

interface PatternAmplifierViewProps {
  onSelectBranch: (id: string | null) => void;
  selectedBranchId: string | null;
  reducedMotion: boolean;
  externalPatternState?: UserPatternState | null;
  onPatternStateChange?: (state: UserPatternState) => void;
}

export default function PatternAmplifierView({
  onSelectBranch,
  selectedBranchId,
  reducedMotion: parentReducedMotion,
  externalPatternState,
  onPatternStateChange
}: PatternAmplifierViewProps) {
  // State 1: Active Pattern State (allows empty test toggling)
  const [patternState, setPatternState] = useState<UserPatternState | null>(DEFAULT_PATTERN_STATE);
  
  // Calibration saving to Supabase states
  const [isUploadingCalib, setIsUploadingCalib] = useState<boolean>(false);
  const [calibStatus, setCalibStatus] = useState<string | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    async function loadSavedCalib() {
      if (isSupabaseConfigured) {
        const saved = await fetchCalibration();
        if (saved) {
          setPatternState(saved);
          if (onPatternStateChange) onPatternStateChange(saved);
        }
      }
    }
    loadSavedCalib();
  }, []);

  // Synchronize with external pattern states (e.g., loaded test users)
  useEffect(() => {
    if (externalPatternState) {
      setPatternState(externalPatternState);
    }
  }, [externalPatternState]);

  const handleSliderChange = (field: keyof UserPatternState, val: number) => {
    if (!patternState) return;
    const newState = { ...patternState, [field]: val };
    setPatternState(newState);
    if (onPatternStateChange) {
      onPatternStateChange(newState);
    }
  };

  const handleSaveCalibrationToSupabase = async () => {
    if (!patternState) return;
    setIsUploadingCalib(true);
    setCalibStatus("Uploading calibration standard...");
    const res = await uploadCalibration(patternState);
    setIsUploadingCalib(false);
    if (res.success) {
      setCalibStatus("SUCCESSFULLY UPLOADED!");
      setTimeout(() => setCalibStatus(null), 3000);
    } else {
      setCalibStatus(`FAILED: ${res.error || 'Check configuration'}`);
      setTimeout(() => setCalibStatus(null), 5000);
    }
  };

  
  // State 2: Simulated hypothesis availability
  const [hasWorkingHypotheses, setHasWorkingHypotheses] = useState<boolean>(true);

  // Animation playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [currentStep, setCurrentStep] = useState<number>(18);
  const [maxSteps] = useState<number>(18);

  // Calibration settings sliders toggled status
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Local state controls for interactive details
  const [hoveredBranch, setHoveredBranch] = useState<GrowthBranch | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 450;
  const originX = 300;
  const originY = 360;

  // Zoom factor for better or closer projection
  const [zoom, setZoom] = useState<number>(1.25);

  // Map amplifier type to real mock branch identifier
  const mapAmplifierToMOCKId = (id: string): string => {
    if (id.startsWith('amp-resonance')) return 'br-1';
    if (id.startsWith('amp-coherence')) return 'br-4';
    if (id.startsWith('amp-activation')) return 'br-3';
    if (id.startsWith('amp-withdrawal')) return 'br-5';
    if (id.startsWith('amp-friction')) return 'br-6';
    if (id.startsWith('amp-tension')) return 'br-2';
    return 'br-1';
  };

  // Generate branches based on active pattern state
  const branches = patternState ? generateGrowthBranches(patternState, maxSteps) : [];

  // Find the currently selected branch and its coherence delta (delta between baseline and projected coherence)
  const selectedBranch = selectedBranchId 
    ? branches.find(b => mapAmplifierToMOCKId(b.id) === selectedBranchId) 
    : null;
  const coherenceDelta = selectedBranch ? selectedBranch.coherenceDelta : 1.5;

  let mostSignificantAxis: 'X' | 'Y' | 'Z' | null = null;
  let dominantValue = 0;
  let dominantSign: 'positive' | 'negative' | null = null;

  if (selectedBranch && selectedBranch.path && selectedBranch.path.length > 0) {
    const lastPoint = selectedBranch.path[selectedBranch.path.length - 1];
    const absX = Math.abs(lastPoint.x);
    const absY = Math.abs(lastPoint.y);
    const absZ = Math.abs(lastPoint.z);

    if (absX >= absY && absX >= absZ) {
      mostSignificantAxis = 'X';
      dominantValue = lastPoint.x;
      dominantSign = lastPoint.x >= 0 ? 'positive' : 'negative';
    } else if (absY >= absX && absY >= absZ) {
      mostSignificantAxis = 'Y';
      dominantValue = lastPoint.y;
      dominantSign = lastPoint.y >= 0 ? 'positive' : 'negative';
    } else {
      mostSignificantAxis = 'Z';
      dominantValue = lastPoint.z;
      dominantSign = lastPoint.z >= 0 ? 'positive' : 'negative';
    }
  }

  // Speed time mapping
  const getSpeedMs = () => {
    if (speed === 'slow') return 180;
    if (speed === 'fast') return 35;
    return 80;
  };

  // Playback timer ticker effect
  useEffect(() => {
    if (parentReducedMotion) {
      setCurrentStep(maxSteps);
      setIsPlaying(false);
      return;
    }

    if (!isPlaying) return;

    if (currentStep >= maxSteps) {
      // Loop or pause at end
      setIsPlaying(false);
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= maxSteps) {
          clearInterval(intervalId);
          setIsPlaying(false);
          return maxSteps;
        }
        return prev + 1;
      });
    }, getSpeedMs());

    return () => clearInterval(intervalId);
  }, [isPlaying, currentStep, speed, parentReducedMotion, maxSteps]);

  // Reset helper
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  // Retrieve tendency visually distinct styles
  const getTendencyVisuals = (type: string) => {
    switch (type) {
      case 'resonance':
        return { stroke: '#00f5a0', glowColor: 'rgba(0, 245, 160, 0.45)', shadow: 'shadow-emerald-500/20', text: 'text-emerald-400' };
      case 'friction':
        return { stroke: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.45)', shadow: 'shadow-rose-500/20', text: 'text-rose-400' };
      case 'activation':
        return { stroke: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.45)', shadow: 'shadow-blue-500/20', text: 'text-blue-400' };
      case 'withdrawal':
        return { stroke: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.45)', shadow: 'shadow-purple-500/20', text: 'text-purple-400' };
      case 'coherence':
        return { stroke: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.45)', shadow: 'shadow-cyan-500/20', text: 'text-cyan-400' };
      case 'tension':
      default:
        return { stroke: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.45)', shadow: 'shadow-amber-500/20', text: 'text-amber-400' };
    }
  };

  // Calculate and draw coordinate vector system axes labels
  // X (Activation/Agency), Y (Coherence/Tension), Z (Externalization/Internalization)
  const axes = [
    { label: '+X Agency', pt: { x: 120, y: 0, z: 0 }, color: '#ec4899', desc: 'Active Expression', axis: 'X' as const, isPositive: true },
    { label: '-X Stabilization', pt: { x: -120, y: 0, z: 0 }, color: '#f43f5e', desc: 'Waiting/Retreat', axis: 'X' as const, isPositive: false },
    { label: '+Y Coherence', pt: { x: 0, y: 120, z: 0 }, color: '#06b6d4', desc: 'Harmonic Union', axis: 'Y' as const, isPositive: true },
    { label: '-Y Conflict', pt: { x: 0, y: -120, z: 0 }, color: '#ef4444', desc: 'Tension/Friction', axis: 'Y' as const, isPositive: false },
    { label: '+Z Outward', pt: { x: 0, y: 0, z: 120 }, color: '#f59e0b', desc: 'Contact/Visibility', axis: 'Z' as const, isPositive: true },
    { label: '-Z depth', pt: { x: 0, y: 0, z: -120 }, color: '#a855f7', desc: 'Internal Processing', axis: 'Z' as const, isPositive: false }
  ];

  // Helper to convert list of points into SVG relative coordinates
  const renderBranchPath = (branch: GrowthBranch) => {
    // Determine sliced path up to current animated tick/step
    const walkPoints = parentReducedMotion 
      ? branch.path 
      : branch.path.slice(0, currentStep + 1);

    if (walkPoints.length < 2) return '';

    return walkPoints.reduce((acc, pt, index) => {
      const projected = project3DTo2D(pt, originX, originY, zoom);
      if (index === 0) {
        return `M ${projected.x},${projected.y}`;
      }
      return `${acc} L ${projected.x},${projected.y}`;
    }, '');
  };

  // Helper to place specific glyph character markers on paths
  const getBranchGlyphPlacement = (branch: GrowthBranch) => {
    const totalCount = branch.path.length;
    const walkCount = parentReducedMotion 
      ? totalCount 
      : Math.min(currentStep + 1, totalCount);

    if (walkCount < 6) return []; // not enough grown yet

    // Project point at 60% grown for visual consistency
    const markerIndex = Math.floor(walkCount * 0.65);
    const pt3d = branch.path[markerIndex];
    if (!pt3d) return [];

    const projected = project3DTo2D(pt3d, originX, originY, zoom);
    
    // Select specific symbol representing strongest force
    let markerSymbol = '☉'; // natal
    if (branch.tendencyType === 'resonance') markerSymbol = '✓'; // quiz balance
    if (branch.tendencyType === 'coherence') markerSymbol = '甲'; // bazi
    if (branch.tendencyType === 'friction') markerSymbol = '⚝'; // hypotheses conflict
    if (branch.tendencyType === 'withdrawal') markerSymbol = '💬'; // agent voice
    if (branch.tendencyType === 'tension') markerSymbol = '⌇'; // transit shift

    return [{
      x: projected.x,
      y: projected.y,
      scale: projected.scale,
      symbol: markerSymbol,
      label: symbolToLabel(markerSymbol)
    }];
  };

  const symbolToLabel = (sym: string) => {
    switch (sym) {
      case '☉': return 'Western Natal Influencers';
      case '甲': return 'BaZi Day Master Energy';
      case '✓': return 'Quiz Multi-axis Matrix';
      case '💬': return 'Agent Consensus Observations';
      case '⚝': return 'Working Hypotheses Tension';
      case '⌇': return 'Transit Daily Field Weather';
      default: return 'Pattern System Support';
    }
  };

  return (
    <div id="pattern-amplifier" className="relative border border-slate-800 bg-[#04060b] rounded-2xl p-6 backdrop-blur-md overflow-hidden transition-all space-y-5 shadow-2xl">
      
      {/* 1. SECTION TITLING & STATUS BADGES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded text-indigo-400 border border-indigo-500/20 tracking-wider font-bold animate-pulse">
              LIVE AMPLIFIER ACTIVE
            </span>
            {parentReducedMotion && (
              <span className="text-[9px] font-mono bg-amber-950/30 text-amber-500 border border-amber-500/25 px-1.5 py-0.2 rounded uppercase font-bold">
                Reduced Motion
              </span>
            )}
            {!patternState && (
              <span className="text-[9px] font-mono bg-red-950/30 text-red-500 border border-red-505/25 px-1.5 py-0.1 rounded font-bold uppercase animate-pulse">
                STATE DETACHED
              </span>
            )}
          </div>
          
          <h3 className="text-sm font-sans font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={13} className="text-cyan-400 animate-pulse" />
            <span>Pattern Amplifier Projection</span>
          </h3>
          <p className="text-[10px] font-mono text-slate-500 leading-none uppercase tracking-wide">
            Interactive simulation of pattern-tendency growth vectors relative to birth baseline
          </p>
        </div>

        {/* Action Toggles for Empty State Demonstrations */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPatternState(prev => prev ? null : DEFAULT_PATTERN_STATE)}
            className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
              patternState 
                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' 
                : 'bg-indigo-950/40 border-indigo-505 text-indigo-400 font-bold'
            }`}
            title="Toggle empty state where UserPatternState is missing"
          >
            {patternState ? 'Detach State' : 'Load Pattern State'}
          </button>
          
          <button
            onClick={() => setHasWorkingHypotheses(prev => !prev)}
            className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
              hasWorkingHypotheses 
                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' 
                : 'bg-amber-950/40 border-amber-505 text-amber-500 font-bold'
            }`}
            title="Toggle empty state where hypotheses is empty"
          >
            {hasWorkingHypotheses ? 'Unload Hypotheses' : 'Load Hypotheses'}
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1 px-2.5 rounded bg-slate-900 border border-slate-800 text-slate-350 hover:text-white flex items-center gap-1.5 text-[9px] font-mono cursor-pointer transition-colors"
          >
            <Sliders size={9} />
            <span>CALIBRATION</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC CALIBRATION CONFIG PANEL */}
      {showConfig && patternState && (
        <div className="p-4 bg-slate-950/85 border border-slate-850 rounded-xl space-y-4 animate-fadeIn">
          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
            Adjust Active Amplification Multipliers
          </div>
          <p className="text-[9.5px] text-slate-500">
            Finetune elements weight coefficients. Deterministic vectors respond instantly dynamically below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono uppercase text-slate-400">
                <span>Natal Wood Strength</span>
                <span>{Math.round(patternState.natalWoodStrength * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={patternState.natalWoodStrength}
                onChange={(e) => handleSliderChange('natalWoodStrength', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono uppercase text-slate-400">
                <span>Natal Metal Strength</span>
                <span>{Math.round(patternState.natalMetalStrength * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={patternState.natalMetalStrength}
                onChange={(e) => handleSliderChange('natalMetalStrength', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono uppercase text-slate-400">
                <span>Transit Pressure coeff</span>
                <span>{Math.round(patternState.transitPressure * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={patternState.transitPressure}
                onChange={(e) => handleSliderChange('transitPressure', parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono uppercase text-slate-400">
                <span>Quiz Discipline Delta</span>
                <span>{Math.round(patternState.quizDiscipline * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={patternState.quizDiscipline}
                onChange={(e) => handleSliderChange('quizDiscipline', parseFloat(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono uppercase text-slate-400">
                <span>Skeptic Agent Warning</span>
                <span>{Math.round(patternState.skepticDamping * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={patternState.skepticDamping}
                onChange={(e) => handleSliderChange('skepticDamping', parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 flex flex-col items-stretch sm:items-end justify-end col-span-1 sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-900 flex-row sm:flex-row gap-2.5">
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full">
                {calibStatus && (
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase transition-all ${
                    calibStatus.includes('SUCCESS') 
                      ? 'bg-emerald-950/40 text-emerald-450 border border-emerald-500/20 text-emerald-400' 
                      : 'bg-indigo-950/45 text-indigo-400 border border-indigo-505/20'
                  }`}>
                    {calibStatus}
                  </span>
                )}
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleSaveCalibrationToSupabase}
                    disabled={isUploadingCalib}
                    className="text-[9px] font-mono text-emerald-400 hover:text-emerald-300 disabled:opacity-50 flex items-center gap-1 uppercase tracking-wider bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded cursor-pointer hover:bg-emerald-900/10 transition-colors font-bold"
                    title="Upload multipliers to Supabase scenario_calibrations"
                  >
                    <CloudUpload size={10} /> Save to Supabase
                  </button>

                  <button 
                    onClick={() => setPatternState(DEFAULT_PATTERN_STATE)}
                    className="text-[9px] font-mono text-indigo-400 hover:text-white flex items-center gap-1 uppercase tracking-wider bg-slate-900 border border-slate-800 px-2.5 py-1 rounded cursor-pointer hover:bg-slate-850 transition-colors"
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLAYBACK CONTROLS & SPEED SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-slate-800/80">
        
        {/* Play Pause buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!patternState || parentReducedMotion}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-950/20 text-amber-400 border-amber-500/20 hover:bg-amber-900/10'
                : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-950/40 disabled:opacity-30'
            }`}
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={!patternState || parentReducedMotion}
            className="cursor-pointer px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors disabled:opacity-30"
          >
            <RotateCcw size={10} />
            <span>RESET</span>
          </button>
        </div>

        {/* Dynamic Horizontal slider status indicator */}
        <div className="flex-1 max-w-[120px] sm:max-w-[200px] flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-600 uppercase text-[9px] shrink-0">Progress:</span>
          <div className="relative flex-1 h-1 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_8px_cyan]"
              style={{ width: `${(currentStep / maxSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-slate-400 font-bold shrink-0">{currentStep}/{maxSteps}t</span>
        </div>

        {/* Speed button selector */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase mr-1">Speed:</span>
          {(['slow', 'normal', 'fast'] as const).map((s) => {
            const isSel = speed === s;
            return (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                disabled={!patternState || parentReducedMotion}
                className={`cursor-pointer text-[9px] font-mono uppercase font-bold px-2 py-1 rounded transition-colors ${
                  isSel
                    ? 'bg-[#0b1329] text-indigo-400 border border-indigo-500/30 font-extrabold'
                    : 'bg-slate-950 text-slate-500 hover:text-slate-350 hover:bg-slate-900 disabled:opacity-30'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CORE VIEWPORT CONTAINER (With Empty State Catchers) */}
      <div className="relative border border-slate-800 bg-[#020305] rounded-xl overflow-hidden flex flex-col justify-center items-center" style={{ minHeight: '410px' }}>
        
        {/* EMPTY STATE A: NO PATTERN STATE */}
        {!patternState ? (
          <div className="absolute inset-0 z-15 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full border border-red-500/20 bg-red-950/10 flex items-center justify-center">
              <ShieldAlert size={20} className="text-red-400 animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-sm font-sans font-bold text-red-400 uppercase tracking-widest">
                Calibration Signal Terminated
              </h4>
              <p className="text-xs text-slate-500 font-mono leading-relaxed">
                Pattern Amplifier needs a UserPatternState. Load mock data or build pattern state.
              </p>
            </div>
            <button
              onClick={() => setPatternState(DEFAULT_PATTERN_STATE)}
              className="px-4 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              Reconstruct Mock State Engine
            </button>
          </div>
        ) : (
          <>
            {/* SVG Render Layer */}
            <svg 
              viewBox={`0 0 ${width} ${height}`}
              className="w-full max-w-[550px] overflow-visible rounded select-none touch-none"
            >
              <defs>
                {/* Visual glows and styling masks */}
                <filter id="amp-coherence-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="amp-tension-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="amp-radial-fog-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#020305" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* CONFIDENCE FOG BACKGROUND - visual representation of prediction depth limit */}
              <ellipse 
                cx={originX} 
                cy={originY - 140} 
                rx="190" 
                ry="130" 
                fill="url(#amp-radial-fog-gradient)" 
                pointerEvents="none" 
              />

              {/* HORIZON CALIBRATIVE ARC BOUNDARY MARKERS */}
              <g opacity="0.1" stroke="#ffffff" strokeWidth="0.5" fill="none">
                <circle cx={originX} cy={originY} r="90" strokeDasharray="3 3" />
                <circle cx={originX} cy={originY} r="180" strokeDasharray="3 3" />
                <circle cx={originX} cy={originY} r="270" strokeDasharray="3 3" />
              </g>

              {/* RENDER MODEL PROJECTION AXES VECTORS */}
              <g>
                {axes.map((ax, idx) => {
                  const projectedTarget = project3DTo2D(ax.pt, originX, originY, zoom);
                  const isNegative = ax.label.startsWith('-');
                  
                  // Highlight relevant axes based on selected branch's most significant contributing force vector
                  const isMainAxis = ax.axis === mostSignificantAxis;
                  const isDirectionalMatch = isMainAxis && (
                    (ax.isPositive && dominantValue >= 0) || 
                    (!ax.isPositive && dominantValue < 0)
                  );
                  
                  let lineOpacity = 0.3;
                  if (mostSignificantAxis) {
                    if (isMainAxis) {
                      lineOpacity = isDirectionalMatch ? 1.0 : 0.6;
                    } else {
                      lineOpacity = 0.15; // dim other axes to bring focus to the relevant axis
                    }
                  }

                  let strokeWidth = 1;
                  if (mostSignificantAxis && isMainAxis) {
                    strokeWidth = isDirectionalMatch ? 2.5 : 1.5;
                  }

                  return (
                    <g key={idx} className="transition-all duration-300">
                      {isDirectionalMatch && !parentReducedMotion && (
                        <>
                          {/* 1. BROAD AMB GLO BACKDROP PULSE */}
                          <motion.line
                            x1={originX}
                            y1={originY}
                            x2={projectedTarget.x}
                            y2={projectedTarget.y}
                            stroke={ax.color}
                            strokeWidth={strokeWidth + 8}
                            strokeLinecap="round"
                            opacity={0.25}
                            filter="url(#amp-coherence-glow)"
                            animate={{
                              opacity: [0.15, 0.40, 0.15],
                              strokeWidth: [strokeWidth + 6, strokeWidth + 12, strokeWidth + 6]
                            }}
                            transition={{
                              duration: 2.0,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />

                          {/* 2. DYNAMIC OUTWARD FLOWING MARGIN/CURRENT LIGHT DUMP */}
                          <motion.line
                            x1={originX}
                            y1={originY}
                            x2={projectedTarget.x}
                            y2={projectedTarget.y}
                            stroke="#ffffff"
                            strokeWidth={strokeWidth + 1}
                            strokeLinecap="round"
                            strokeDasharray="6 8"
                            animate={{
                              strokeDashoffset: [0, -28]
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            opacity={0.6}
                          />

                          {/* 3. FLUID FLOATING KINETIC FORCE PARTICLES GOING OUTWARDS */}
                          <motion.circle
                            cx={originX}
                            cy={originY}
                            r="5.5"
                            fill={ax.color}
                            filter="url(#amp-coherence-glow)"
                            animate={{
                              cx: [originX, projectedTarget.x],
                              cy: [originY, projectedTarget.y],
                              r: [3.5, 6.5, 3.5],
                              opacity: [0.95, 0.6, 0]
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                          <motion.circle
                            cx={originX}
                            cy={originY}
                            r="4.5"
                            fill="#ffffff"
                            animate={{
                              cx: [originX, projectedTarget.x],
                              cy: [originY, projectedTarget.y],
                              r: [2.5, 4.5, 2.5],
                              opacity: [0.9, 0.5, 0]
                            }}
                            transition={{
                              duration: 1.8,
                              delay: 0.9,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />

                          {/* 4. EXPANDING IMPACT RADAR WAVES AT TIP */}
                          <circle
                            cx={projectedTarget.x}
                            cy={projectedTarget.y}
                            r={1.5}
                            fill="#ffffff"
                          />
                          <motion.circle
                            cx={projectedTarget.x}
                            cy={projectedTarget.y}
                            r="8"
                            fill="none"
                            stroke={ax.color}
                            strokeWidth="1.5"
                            animate={{
                              scale: [1, 2.5],
                              opacity: [0.8, 0]
                            }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                          <motion.circle
                            cx={projectedTarget.x}
                            cy={projectedTarget.y}
                            r="12"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1"
                            animate={{
                              scale: [1, 3.2],
                              opacity: [0.6, 0]
                            }}
                            transition={{
                              duration: 1.4,
                              delay: 0.4,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                        </>
                      )}
                      <line
                        x1={originX}
                        y1={originY}
                        x2={projectedTarget.x}
                        y2={projectedTarget.y}
                        stroke={ax.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={isNegative ? '3 3' : 'none'}
                        opacity={lineOpacity}
                        className="transition-all duration-300"
                      />
                      {/* Axis tip arrow */}
                      {!isNegative && (
                        isDirectionalMatch && !parentReducedMotion ? (
                          <motion.circle
                            cx={projectedTarget.x}
                            cy={projectedTarget.y}
                            fill={ax.color}
                            opacity={lineOpacity}
                            animate={{
                              r: [3.5, 5.2, 3.5],
                              opacity: [0.75, 1.0, 0.75]
                            }}
                            transition={{
                              duration: 2.0,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        ) : (
                          <circle
                            cx={projectedTarget.x}
                            cy={projectedTarget.y}
                            r={isDirectionalMatch ? "3.5" : "2"}
                            fill={ax.color}
                            opacity={lineOpacity}
                            className="transition-all duration-300"
                          />
                        )
                      )}
                      {/* Label along tip */}
                      {isDirectionalMatch && !parentReducedMotion ? (
                        <motion.text
                          x={projectedTarget.x + (projectedTarget.x > originX ? 5 : -5)}
                          y={projectedTarget.y + (projectedTarget.y > originY ? 4 : -4)}
                          fill={ax.color}
                          fontFamily="monospace"
                          fontSize="9px"
                          fontWeight="bold"
                          textAnchor={projectedTarget.x > originX ? 'start' : 'end'}
                          animate={{
                            opacity: [0.75, 1.0, 0.75],
                            scale: [0.96, 1.05, 0.96],
                          }}
                          transition={{
                            duration: 2.0,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{
                            transformOrigin: `${projectedTarget.x + (projectedTarget.x > originX ? 5 : -5)}px ${projectedTarget.y + (projectedTarget.y > originY ? 4 : -4)}px`
                          }}
                          className="font-extrabold"
                        >
                          {ax.label}
                          <tspan fill="#ffffff" fontWeight="black" dx="4">
                            ({dominantValue > 0 ? '+' : ''}{dominantValue})
                          </tspan>
                          {" ★"}
                        </motion.text>
                      ) : (
                        <text
                          x={projectedTarget.x + (projectedTarget.x > originX ? 5 : -5)}
                          y={projectedTarget.y + (projectedTarget.y > originY ? 4 : -4)}
                          fill={ax.color}
                          fontFamily="monospace"
                          fontSize={isDirectionalMatch ? "9px" : "8px"}
                          fontWeight="bold"
                          textAnchor={projectedTarget.x > originX ? 'start' : 'end'}
                          opacity={lineOpacity}
                          className={`transition-all duration-300 ${isDirectionalMatch ? 'animate-pulse font-extrabold' : ''}`}
                        >
                          {ax.label}
                          {isDirectionalMatch && (
                            <tspan fill="#ffffff" fontWeight="black" dx="4">
                              ({dominantValue > 0 ? '+' : ''}{dominantValue})
                            </tspan>
                          )}
                          {isDirectionalMatch ? " ★" : ""}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* ORIGIN HUB NODE AT USER PATTERN STATE WITH COHERENCE PULSE */}
              <g transform={`translate(${originX}, ${originY})`} className="cursor-help">
                {/* Dynamically controlled Real-Time Coherence Pulse Rings */}
                {!parentReducedMotion && (
                  <>
                    {/* Concentric Pulse Ring 1: Scales outer bounds & opacity based on coherenceDelta */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="9"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{
                        scale: [1, 1.3 + coherenceDelta * 0.3],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: Math.max(0.6, 2.5 - (coherenceDelta * 0.3)),
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    {/* Concentric Pulse Ring 2: Delayed secondary echo */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="9"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{
                        scale: [1, 1.15 + coherenceDelta * 0.25],
                        opacity: [0.6, 0],
                      }}
                      transition={{
                        duration: Math.max(0.6, 2.5 - (coherenceDelta * 0.3)),
                        delay: Math.max(0.3, 1.25 - (coherenceDelta * 0.15)),
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    {/* Passive Ambient background radial glow adjusting with coherenceDelta */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="14"
                      fill="#06b6d4"
                      opacity="0.2"
                      filter="url(#amp-coherence-glow)"
                      animate={{
                        scale: [0.9, 1.05 + (coherenceDelta * 0.05), 0.9],
                        opacity: [0.12, 0.22 + (coherenceDelta * 0.03), 0.12]
                      }}
                      transition={{
                        duration: Math.max(1.0, 3.2 - (coherenceDelta * 0.4)),
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}

                <circle r="9" fill="#090d1a" stroke="#4f46e5" strokeWidth="2" />
                <circle r="4" fill="#6366f1" className="animate-pulse" />
                
                <text y="-14" fill="#a5b4fc" fontSize="8px" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  ORIGIN STATE
                </text>

                {/* Live Real-Time Coherence Delta Tag Indicator */}
                {selectedBranch && (
                  <text y="24" fill="#06b6d4" fontSize="7px" fontFamily="monospace" textAnchor="middle" fontWeight="bold" className="uppercase tracking-wider">
                    Pulse: +{(coherenceDelta).toFixed(1)} Coh
                  </text>
                )}
              </g>

              {/* RENDER ACTIVE BENT TRAJECTORY BRANCHES */}
              {branches.map((branch) => {
                const isSelected = selectedBranchId === mapAmplifierToMOCKId(branch.id);
                const visual = getTendencyVisuals(branch.tendencyType);
                const isSplit = !!branch.parentId;
                
                // Confidence values mapped directly to visual clarity / confidence fog
                // high confidence (>=0.85) = thin clear thick outline
                // mid confidence (0.60-0.84) = semi transparent
                // low confidence (<0.60) = blurry or misty dashed sequence
                const isLowConfidence = branch.confidence < 0.6;
                const pathStrokeWidth = branch.branchWeight + (isSelected ? 3 : 0);
                const pathOpacity = isSelected 
                  ? 1.0 
                  : isLowConfidence 
                    ? 0.35 
                    : branch.confidence;
                const isDashedStyle = branch.isDashed || isLowConfidence || isSplit;

                // Glowing filters
                let pathFilter = undefined;
                if (!parentReducedMotion) {
                  if (branch.coherenceDelta > 3.0) pathFilter = 'url(#amp-coherence-glow)';
                  else if (branch.tensionDelta > 2.5) pathFilter = 'url(#amp-tension-glow)';
                }

                // Render vector points string
                const dPath = renderBranchPath(branch);
                if (!dPath) return null;

                // Handle hover interactions
                const handleBranchHoverOn = (e: React.MouseEvent<SVGPathElement | SVGTextElement>) => {
                  setHoveredBranch(branch);
                  
                  // Position relative
                  const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (svgRect) {
                    setHoverPosition({
                      x: e.clientX - svgRect.left + 15,
                      y: e.clientY - svgRect.top - 10
                    });
                  }
                };

                const handleBranchClick = () => {
                  const correspondingMockBranchId = mapAmplifierToMOCKId(branch.id);
                  onSelectBranch(correspondingMockBranchId);
                };

                return (
                  <g key={branch.id}>
                    {/* Layer 1: Tension alert pulsating vibe aura */}
                    {branch.tensionDelta > 2.8 && !parentReducedMotion && (
                      <path
                        d={dPath}
                        fill="none"
                        stroke="#f50035"
                        strokeWidth={pathStrokeWidth + 4}
                        strokeLinecap="round"
                        opacity={0.18}
                        className="animate-pulse"
                      />
                    )}

                    {/* Layer 2: Core branch spline path */}
                    <path
                      d={dPath}
                      fill="none"
                      stroke={visual.stroke}
                      strokeWidth={pathStrokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={isDashedStyle ? '5 5' : undefined}
                      opacity={pathOpacity}
                      filter={pathFilter}
                      className="cursor-pointer transition-all duration-300 hover:stroke-white"
                      onMouseMove={handleBranchHoverOn}
                      onMouseLeave={() => setHoveredBranch(null)}
                      onClick={handleBranchClick}
                    />

                    {/* Selected path dashed halo indicator */}
                    {isSelected && (
                      <path
                        d={dPath}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        opacity="0.9"
                        pointerEvents="none"
                      />
                    )}

                    {/* Source Glyphs along the trajectory line */}
                    {getBranchGlyphPlacement(branch).map((gl, i) => (
                      <g 
                        key={i} 
                        transform={`translate(${gl.x}, ${gl.y}) scale(${gl.scale})`}
                        className="cursor-pointer transition-all hover:scale-125"
                        onClick={handleBranchClick}
                        onMouseMove={(e) => {
                          setHoveredBranch(branch);
                          const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                          if (svgRect) {
                            setHoverPosition({
                              x: e.clientX - svgRect.left + 15,
                              y: e.clientY - svgRect.top - 10
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredBranch(null)}
                      >
                        <circle
                          r="10"
                          fill="#030407"
                          stroke={visual.stroke}
                          strokeWidth={isSelected ? '2' : '1'}
                          className="shadow-xl"
                        />
                        <text
                          fill={visual.stroke}
                          fontSize="9px"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          alignmentBaseline="middle"
                          textAnchor="middle"
                          y="0.5"
                        >
                          {gl.symbol}
                        </text>
                        {/* Title anchor indicator line */}
                        <text
                          y="-13"
                          fill="#64748b"
                          fontSize="6.5px"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {branch.title.split(' ')[0]}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>

            {/* EMPTY STATE B: NO WORKING HYPOTHESES */}
            {!hasWorkingHypotheses && (
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-amber-950/80 border border-amber-500/20 rounded-lg flex items-center gap-3 text-[10.5px] text-amber-400 font-mono select-none animate-fadeIn">
                <AlertTriangle size={15} className="shrink-0 text-amber-400 animate-bounce" />
                <div className="leading-snug">
                  <span className="font-bold uppercase block text-[9px] tracking-widest text-amber-500">Deterred Hypothesis Mode</span>
                  No working hypotheses yet. Branch splitting uses chart, daily field, and quiz mock data only.
                </div>
              </div>
            )}
          </>
        )}

        {/* 4. INTERACTIVE HOVER FLOATING DETAILS TOOLTIP CARD */}
        {hoveredBranch && hoverPosition && (
          <div 
            className="absolute p-3.5 bg-slate-950/95 border border-slate-800 rounded-xl space-y-2 text-[11px] leading-relaxed shadow-2xl z-30 pointer-events-none max-w-[270px] animate-fadeIn"
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`
            }}
          >
            <div className="flex justify-between items-center gap-2">
              <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                hoveredBranch.tendencyType === 'resonance' ? 'bg-emerald-950 text-emerald-400' :
                hoveredBranch.tendencyType === 'coherence' ? 'bg-cyan-950 text-cyan-400' :
                hoveredBranch.tendencyType === 'friction' ? 'bg-red-950 text-red-400' :
                hoveredBranch.tendencyType === 'withdrawal' ? 'bg-purple-950 text-purple-400' :
                'bg-amber-950 text-amber-500'
              }`}>
                ✦ {hoveredBranch.tendencyType}
              </span>
              <span className="text-[8.5px] font-mono text-slate-500 font-bold uppercase">
                {Math.round(hoveredBranch.confidence * 100)}% Confidence
              </span>
            </div>

            <div>
              <h5 className="font-bold text-slate-100 font-sans leading-tight text-xs uppercase">
                {hoveredBranch.title}
              </h5>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                {hoveredBranch.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-900 text-[10px] font-mono">
              <div>
                <span className="text-slate-500 block text-[8px] uppercase">Coherence</span>
                <span className="text-cyan-400 font-bold">+{hoveredBranch.coherenceDelta} points</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[8px] uppercase">Tension</span>
                <span className="text-rose-400 font-bold">+{hoveredBranch.tensionDelta} drag</span>
              </div>
            </div>

            {hoveredBranch.notToInfer && hoveredBranch.notToInfer.length > 0 && (
              <div className="pt-1.5 border-t border-slate-900 text-[9px] text-[#93c5fd]/80">
                <span className="uppercase text-[8px] text-slate-500 block font-mono">Not-to-Infer:</span>
                <p className="italic leading-normal select-none">
                  &ldquo;{hoveredBranch.notToInfer[0]}&rdquo;
                </p>
              </div>
            )}
            
            <div className="text-[8.5px] text-slate-500 font-mono uppercase text-center pt-1 animate-pulse tracking-widest font-bold">
              ⚡ Click branch to lock cockpit
            </div>
          </div>
        )}

        {/* 5. VISIBLE COMPULSORY EPISTEMIC SAFETY decal */}
        <div className="absolute top-2.5 right-2.5 p-1 px-2 rounded bg-black/80 border border-slate-900 text-[8.5px] text-slate-500 font-mono tracking-tight flex items-center gap-1">
          <ShieldAlert size={10} className="text-indigo-400 animate-pulse" />
          <span>Pattern Amplifier previews tendency growth, not external events.</span>
        </div>

        {/* Axes Projection indicators HUD inside cockpit */}
        <div className="absolute bottom-2.5 left-2.5 p-2 bg-[#05070c]/95 border border-slate-800 rounded font-mono text-[8px] text-slate-500 space-y-1 z-10 shadow-lg min-w-[170px]">
          <div className="font-bold text-slate-300 uppercase tracking-widest border-b border-slate-800/80 pb-1 mb-1 text-[8.5px] flex items-center gap-1">
            <Sparkles size={10} className="text-cyan-400" />
            <span>Projected Axes Semantics</span>
          </div>
          
          <div className={`flex items-center justify-between p-0.5 px-1 rounded transition-colors ${
            mostSignificantAxis === 'X' 
              ? 'bg-pink-950/20 text-pink-400 border border-pink-500/20 font-bold' 
              : 'text-slate-500'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-1.5 h-1.5 rounded-full bg-pink-500 ${mostSignificantAxis === 'X' ? 'with-ping animate-ping' : ''}`}></span>
              <span className="truncate">X-Axis: Action / Agency</span>
            </div>
            {mostSignificantAxis === 'X' && (
              <span className="text-[9px] font-bold text-pink-300 shrink-0 select-none">
                ({dominantValue > 0 ? '+' : ''}{dominantValue})
              </span>
            )}
          </div>

          <div className={`flex items-center justify-between p-0.5 px-1 rounded transition-colors ${
            mostSignificantAxis === 'Y' 
              ? 'bg-cyan-950/20 text-cyan-400 border border-cyan-500/20 font-bold' 
              : 'text-slate-500'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${mostSignificantAxis === 'Y' ? 'with-ping animate-ping' : ''}`}></span>
              <span className="truncate">Y-Axis: Coherence</span>
            </div>
            {mostSignificantAxis === 'Y' && (
              <span className="text-[9px] font-bold text-cyan-300 shrink-0 select-none">
                ({dominantValue > 0 ? '+' : ''}{dominantValue})
              </span>
            )}
          </div>

          <div className={`flex items-center justify-between p-0.5 px-1 rounded transition-colors ${
            mostSignificantAxis === 'Z' 
              ? 'bg-purple-950/20 text-purple-400 border border-purple-500/20 font-bold' 
              : 'text-slate-500'
          }`}>
            <div className="flex items-center gap-1.5 truncate">
              <span className={`w-1.5 h-1.5 rounded-full bg-purple-500 ${mostSignificantAxis === 'Z' ? 'with-ping animate-ping' : ''}`}></span>
              <span className="truncate">Z-Axis: Visibility</span>
            </div>
            {mostSignificantAxis === 'Z' && (
              <span className="text-[9px] font-bold text-purple-300 shrink-0 select-none">
                ({dominantValue > 0 ? '+' : ''}{dominantValue})
              </span>
            )}
          </div>

          <div className="pt-1 border-t border-slate-900 text-[7px] text-slate-600 uppercase italic">
            *Cabin projection coordinate scales
          </div>
        </div>
      </div>

      {/* DETAILED DEVIATION DIAGNOSTICS FOR SELECTED BRANCH */}
      <AnimatePresence mode="wait">
        {selectedBranch && mostSignificantAxis && (
          <motion.div
            key={selectedBranch.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="p-4 bg-[#05070c]/50 border border-slate-800/80 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: getTendencyVisuals(selectedBranch.tendencyType).stroke }} />
                <h4 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider">
                  DEVIATION DIAGNOSTICS: {selectedBranch.title.toUpperCase()}
                </h4>
              </div>
              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase border border-indigo-500/25 bg-indigo-950/25 px-2 py-0.5 rounded tracking-wider">
                Axis {mostSignificantAxis} Dominant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Force Deviation breakdown */}
              <div className="p-3 bg-black/40 border border-slate-950 rounded-lg space-y-1.5 col-span-1 md:col-span-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Primary Force Driver Analysis
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">
                  {(() => {
                    const signStr = dominantSign || 'positive';
                    switch (selectedBranch.tendencyType) {
                      case 'activation':
                        if (mostSignificantAxis === 'X') {
                          return "Deviates strongly along the X-Axis (+X Agency) because of the intensive career expansion and proactive outer development forces. This indicates that career outreach is the single most dominant energetic force pulling this path outwards from baseline stability.";
                        }
                        if (mostSignificantAxis === 'Z') {
                          return "Deviates strongly along the Z-Axis (+Z Outward visibility) driven by high contact needs. This highlights that external visibility or social exposure is the strongest force dictating this trajectory's reach.";
                        }
                        return "Deviates toward the Y-Axis (+Y Coherence) as alignment forces of agency seek structural stabilization.";
                        
                      case 'resonance':
                        if (mostSignificantAxis === 'Y') {
                          return "Deviates primarily along the Y-Axis (+Y Coherence) because of optimal harmonic alignment. This indicates that quiz baseline integration and agent agreement vectors are perfectly synchronized to build mutual resonance.";
                        }
                        if (mostSignificantAxis === 'X') {
                          return "Driven significantly by the X-Axis (+X Agency) where expansion forces provide optimal forward momentum for balanced growth.";
                        }
                        return "Nurtured by the Z-Axis (+Z Outward) ensuring self-expression is outward-facing and clear.";

                      case 'coherence':
                        if (mostSignificantAxis === 'Y') {
                          return "Deviates primarily along the Y-Axis (+Y Coherence) because Saturn ordering coordinates and Metal structure requirements pull the path into self-organized order, preferring robust scaffolding over high-speed changes.";
                        }
                        if (mostSignificantAxis === 'X') {
                          return "Deviates significantly along the X-Axis (-X Stabilization) representing a calculated retreat into disciplined bounds to support self-containment.";
                        }
                        return "Deviates along the Z-Axis (-Z Depth) suggesting that internal processing is the backbone of the structural coherence.";

                      case 'friction':
                        if (mostSignificantAxis === 'Y') {
                          return "Deviates strongly into the negative Y-Axis (-Y Conflict) due to severe element clashing (excessive wood expansion hitting rigid metal boundaries). This creates high system friction and cognitive drag, warning of potential exhaustion.";
                        }
                        if (mostSignificantAxis === 'X') {
                          return "Deviates primarily along the X-Axis (+X Agency) as the impulse to speed forward override baseline structured scaffolding, generating elevated stress.";
                        }
                        return "Driven by the Z-Axis (+Z Outward) highlighting heavy exposure constraints causing cognitive burnout under pressure.";

                      case 'withdrawal':
                        if (mostSignificantAxis === 'Z') {
                          return "Deviates deeply along the Z-Axis (-Z Depth) due to the Scorpio Moon subconscious withdrawal and defensive processing requirements. This indicates a strong psychological drive to restore energy in a private fortress.";
                        }
                        if (mostSignificantAxis === 'X') {
                          return "Deviates primarily along the X-Axis (-X Stabilization) showing selective inaction as a mechanism to preserve sovereignty and block critical feedback.";
                        }
                        return "Grounded along the Y-Axis (+Y Coherence) seeking a peaceful baseline state free of interpersonal friction.";

                      case 'tension':
                      default:
                        if (mostSignificantAxis === 'Y') {
                          return "Deviates sharply into the negative Y-Axis (-Y Conflict) representing severe tension. The system experiences a severe pull between absolute freedom (wood) and absolute structure (metal).";
                        }
                        if (mostSignificantAxis === 'Z') {
                          return "Deviates along the Z-Axis (+Z Outward or -Z Depth) representing a double-bind dilemma where external visibility demands conflict with internal processing needs.";
                        }
                        return "Deviates along the X-Axis (+X Agency) representation of forced initiative in an undecided structural environment.";
                    }
                  })()}
                </p>
              </div>

              {/* Dynamic Coordinate read-out */}
              <div className="p-3 bg-black/40 border border-slate-950 rounded-lg flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-900">
                    Coordinate Vector
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-2 font-mono text-[9px] text-center">
                    <div className={`p-1 rounded ${mostSignificantAxis === 'X' ? 'bg-pink-950/30 border border-pink-500/20' : 'bg-slate-950/30 text-slate-500'}`}>
                      <span className="block text-[8px] text-slate-500 uppercase">dX</span>
                      <span className={`font-bold ${mostSignificantAxis === 'X' ? 'text-pink-400 text-[10px]' : 'text-slate-300'}`}>
                        {selectedBranch.path[selectedBranch.path.length - 1].x}
                      </span>
                    </div>
                    <div className={`p-1 rounded ${mostSignificantAxis === 'Y' ? 'bg-cyan-950/30 border border-cyan-500/20' : 'bg-slate-950/30 text-slate-500'}`}>
                      <span className="block text-[8px] text-slate-500 uppercase">dY</span>
                      <span className={`font-bold ${mostSignificantAxis === 'Y' ? 'text-cyan-400 text-[10px]' : 'text-slate-300'}`}>
                        {selectedBranch.path[selectedBranch.path.length - 1].y}
                      </span>
                    </div>
                    <div className={`p-1 rounded ${mostSignificantAxis === 'Z' ? 'bg-purple-950/30 border border-purple-500/20' : 'bg-slate-950/30 text-slate-500'}`}>
                      <span className="block text-[8px] text-slate-500 uppercase">dZ</span>
                      <span className={`font-bold ${mostSignificantAxis === 'Z' ? 'text-purple-400 text-[10px]' : 'text-slate-300'}`}>
                        {selectedBranch.path[selectedBranch.path.length - 1].z}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[8.5px] font-mono text-slate-500 leading-snug">
                  * dX, dY, dZ represent the finalized 3D projection endpoint displacements.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FOOTER SAFETY REMINISCENCE PANEL */}
      <div className="p-3.5 bg-indigo-950/10 border border-indigo-505/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-5 text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="text-indigo-400 animate-spin-slow shrink-0" />
          <div className="text-[10px] leading-normal font-sans text-slate-300">
            <span className="font-bold text-indigo-400 uppercase tracking-widest text-[9px] block">Model projection limitations:</span>
            Branches may amplify based on cumulative feedback coordinates over the chosen scrubber horizon depths. This maps subjective resonance vectors, not deterministic fate.
          </div>
        </div>
      </div>

    </div>
  );
}
