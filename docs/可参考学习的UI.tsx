
import React from 'react';
import { Language } from '../types';

// Container with retro border
export const RetroContainer: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => {
  return (
    <div className={`relative border-2 border-emerald-900 bg-black/90 p-4 ${className} shadow-[0_0_15px_rgba(16,185,129,0.1)]`}>
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500"></div>

      {title && (
        <div className="absolute -top-3 left-4 bg-black px-2 text-xs text-emerald-500 font-bold tracking-widest uppercase">
          [{title}]
        </div>
      )}
      {children}
    </div>
  );
};

// Retro Button
export const RetroButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean; className?: string }> = ({ onClick, children, disabled, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative w-full text-left px-6 py-4 my-2
        border border-emerald-900/50 hover:border-emerald-500
        transition-all duration-300
        bg-black/50 hover:bg-emerald-900/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm md:text-base text-gray-300 group-hover:text-emerald-400 group-hover:text-glow transition-colors w-full">
          <span className="opacity-0 group-hover:opacity-100 mr-2 absolute left-2">&gt;</span>
          {children}
        </span>
      </div>
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-1 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </button>
  );
};

// Bi-directional Stat Bar for range -100 to 100
export const StatBar: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = "bg-emerald-600" }) => {
  // Convert -100..100 to 0..100% for CSS positioning
  const percent = Math.min(Math.max((value + 100) / 2, 0), 100);

  // Calculate width and left position based on distance from center (50%)
  const width = Math.abs(value) / 2; // e.g. value 50 means 25% width
  const left = value >= 0 ? 50 : 50 - width;

  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
        <span>{label.toUpperCase()}</span>
        <span>{value > 0 ? `+${value}` : value}</span>
      </div>
      <div className="w-full h-2 bg-gray-900 border border-gray-800 relative">
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-600 -translate-x-1/2 z-10"></div>

        {/* Fill */}
        <div
          className={`absolute top-0 bottom-0 ${color} transition-all duration-1000 ease-out`}
          style={{
            left: `${left}%`,
            width: `${width}%`
          }}
        ></div>

        {/* Grid lines over bar */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          {[...Array(11)].map((_, i) => (
            <div key={i} className={`w-[1px] h-full ${i === 5 ? 'bg-transparent' : 'bg-black/30'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LanguageToggle: React.FC<{ language: Language; onToggle: () => void }> = ({ language, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="border border-emerald-900 px-3 py-1 text-xs text-emerald-500 hover:bg-emerald-900/50 hover:text-emerald-300 transition-colors uppercase tracking-wider"
    >
      [{language === 'en' ? 'EN' : '中文'}]
    </button>
  );
};

export const RetroModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto pt-6">
        <RetroContainer title={title} className="bg-black border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-amber-500 hover:text-white"
          >
            [X]
          </button>
          <div className="mt-4">
            {children}
          </div>
        </RetroContainer>
      </div>
    </div>
  );
};
