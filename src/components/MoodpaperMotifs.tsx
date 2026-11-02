import React from 'react';
import { VisualMotif, ExtractedMetric } from '../services/editorialVisualService';

interface MotifProps {
  motif: VisualMotif;
  reducedMotion: boolean;
  metric: ExtractedMetric | null;
}

export const MoodpaperMotifGraphic: React.FC<MotifProps> = ({
  motif,
  reducedMotion,
  metric
}) => {
  const driftClass = reducedMotion ? '' : 'animate-moodpaper-drift';
  const pulseClass = reducedMotion ? '' : 'animate-moodpaper-pulse';

  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block select-none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${motif} editorial graphic`}
    >
      <defs>
        {/* Subtle Canvas Dot Grid Pattern */}
        <pattern id="mp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1" fill="#191715" fillOpacity="0.08" />
        </pattern>

        {/* Paper Texture Diagonal Stripes */}
        <pattern id="mp-stripes" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#0f766e" strokeWidth="1" strokeOpacity="0.05" />
        </pattern>

        {/* Gradients */}
        <linearGradient id="grad-canvas" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#faf6f0" />
          <stop offset="50%" stopColor="#f7f2eb" />
          <stop offset="100%" stopColor="#fde8df" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id="grad-teal-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        <linearGradient id="grad-orb-space" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="70%" stopColor="#134e4a" />
          <stop offset="100%" stopColor="#191715" />
        </linearGradient>

        <linearGradient id="grad-sun" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde8df" />
          <stop offset="50%" stopColor="#f5cbbe" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>

        <linearGradient id="grad-tech-wafer" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>

        <linearGradient id="grad-market-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* 1. Base Canvas Background */}
      <rect width="800" height="450" fill="url(#grad-canvas)" />
      <rect width="800" height="450" fill="url(#mp-grid)" />

      {/* Architectural Corner Registration Marks */}
      <g stroke="#191715" strokeWidth="1.2" strokeOpacity="0.3">
        {/* Top-left */}
        <line x1="28" y1="36" x2="44" y2="36" />
        <line x1="36" y1="28" x2="36" y2="44" />
        {/* Top-right */}
        <line x1="756" y1="36" x2="772" y2="36" />
        <line x1="764" y1="28" x2="764" y2="44" />
        {/* Border rule guidelines */}
        <line x1="56" y1="36" x2="744" y2="36" strokeDasharray="3 6" strokeOpacity="0.15" />
      </g>

      {/* 2. Specific Procedural Motif Rendering */}
      {motif === 'space' && (
        <g className={driftClass}>
          {/* Orbital Ellipses */}
          <ellipse
            cx="440"
            cy="195"
            rx="280"
            ry="85"
            fill="none"
            stroke="#0f766e"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.4"
            transform="rotate(-12 440 195)"
          />
          <ellipse
            cx="440"
            cy="195"
            rx="210"
            ry="62"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            transform="rotate(-12 440 195)"
          />
          <ellipse
            cx="440"
            cy="195"
            rx="140"
            ry="40"
            fill="none"
            stroke="#82351f"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            strokeOpacity="0.6"
            transform="rotate(-12 440 195)"
          />

          {/* Central Celestial Orb */}
          <circle cx="440" cy="195" r="54" fill="url(#grad-orb-space)" />
          {/* Moon/Planetary Crescent Shadow */}
          <path
            d="M 440 141 A 54 54 0 0 1 440 249 A 36 54 0 0 0 440 141 Z"
            fill="#e0f2fe"
            fillOpacity="0.22"
          />
          {/* Planetary Ring Front Pass */}
          <path
            d="M 230 238 Q 440 280 650 152"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Satellite / Beacon Node */}
          <circle cx="610" cy="165" r="7" fill="#0f766e" stroke="#ffffff" strokeWidth="2" />
          <circle cx="610" cy="165" r="14" fill="none" stroke="#0f766e" strokeWidth="1" strokeDasharray="2 3" />

          {/* Constellation Nodes and Vector Lines */}
          <g stroke="#0f766e" strokeWidth="1" strokeOpacity="0.45" fill="#0f766e">
            <line x1="200" y1="110" x2="260" y2="135" />
            <line x1="260" y1="135" x2="310" y2="95" />
            <line x1="310" y1="95" x2="350" y2="140" />
            <circle cx="200" cy="110" r="3" />
            <circle cx="260" cy="135" r="3.5" fill="#e0f2fe" stroke="#0f766e" />
            <circle cx="310" cy="95" r="3" />
            <circle cx="350" cy="140" r="3.5" />
          </g>

          {/* Technical Telemetry Radar Sweep */}
          <circle cx="440" cy="195" r="95" fill="none" stroke="#0f766e" strokeWidth="0.8" strokeDasharray="3 8" strokeOpacity="0.3" />
          <text x="445" y="112" fontFamily="monospace" fontSize="9" fill="#0f766e" fillOpacity="0.6">ORBIT // 01-E</text>
        </g>
      )}

      {motif === 'technology' && (
        <g>
          {/* Microchip Die Package Core */}
          <g transform="translate(370, 105)">
            {/* Outer Chip Substrate */}
            <rect x="0" y="0" width="180" height="180" rx="18" fill="#ffffff" stroke="#0f766e" strokeWidth="2.5" />
            <rect x="8" y="8" width="164" height="164" rx="14" fill="#faf6f0" stroke="#e7ded3" strokeWidth="1" />

            {/* Inner Silicon Die with Subtle Pulse */}
            <rect
              x="35"
              y="35"
              width="110"
              height="110"
              rx="10"
              fill="url(#grad-tech-wafer)"
              stroke="#0f766e"
              strokeWidth="2"
              className={pulseClass}
            />

            {/* Circuit Core Pattern */}
            <circle cx="90" cy="90" r="28" fill="#0f766e" fillOpacity="0.12" />
            <circle cx="90" cy="90" r="16" fill="#0f766e" />
            <circle cx="90" cy="90" r="7" fill="#ffffff" />

            {/* Silicon Pin Indicators */}
            <text x="44" y="55" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#0f766e">CORE // 3nm</text>
            <text x="44" y="135" fontFamily="monospace" fontSize="7" fill="#5c554e">NEURAL BUS</text>
          </g>

          {/* Radiating Integrated Circuit Traces */}
          <g stroke="#0f766e" strokeWidth="2" fill="none" strokeLinecap="round">
            {/* Left bus lines */}
            <path d="M 370 145 L 300 145 L 260 185 L 180 185" />
            <path d="M 370 195 L 280 195 L 240 235 L 190 235" />
            <path d="M 370 245 L 310 245 L 270 275 L 220 275" />

            {/* Right bus lines */}
            <path d="M 550 145 L 620 145 L 660 115 L 720 115" />
            <path d="M 550 195 L 640 195 L 680 165 L 740 165" />
            <path d="M 550 245 L 610 245 L 650 275 L 710 275" />

            {/* Top bus lines */}
            <path d="M 430 105 L 430 55 L 410 35" />
            <path d="M 490 105 L 490 55 L 510 35" />
          </g>

          {/* Trace Terminating Pin Pads */}
          <g fill="#0f766e" stroke="#ffffff" strokeWidth="2">
            <circle cx="180" cy="185" r="5" />
            <circle cx="190" cy="235" r="5" />
            <circle cx="220" cy="275" r="5" />
            <circle cx="720" cy="115" r="5" />
            <circle cx="740" cy="165" r="5" />
            <circle cx="710" cy="275" r="5" />
            <circle cx="410" cy="35" r="4.5" />
            <circle cx="510" cy="35" r="4.5" />
          </g>
        </g>
      )}

      {motif === 'finance' && (
        <g>
          {/* Classical Architectural Bank Pillars / Vault Motif */}
          <g stroke="#0f766e" strokeWidth="1.5" fill="none" opacity="0.6">
            {/* Pediment Arch */}
            <path d="M 190 170 L 290 110 L 390 170 Z" fill="#faf6f0" fillOpacity="0.8" />
            <line x1="180" y1="170" x2="400" y2="170" strokeWidth="2.5" />
            <line x1="185" y1="175" x2="395" y2="175" strokeWidth="1.5" />

            {/* Fluted Columns */}
            <line x1="215" y1="175" x2="215" y2="295" strokeWidth="3" />
            <line x1="265" y1="175" x2="265" y2="295" strokeWidth="3" />
            <line x1="315" y1="175" x2="315" y2="295" strokeWidth="3" />
            <line x1="365" y1="175" x2="365" y2="295" strokeWidth="3" />
            <line x1="195" y1="295" x2="385" y2="295" strokeWidth="3" />
          </g>

          {/* Rising Financial Trend Vector & Market Area Fill */}
          <path
            d="M 160 310 C 280 300, 380 230, 480 200 C 580 170, 640 120, 720 90 L 720 310 L 160 310 Z"
            fill="url(#grad-market-area)"
          />
          <path
            d="M 160 310 C 280 300, 380 230, 480 200 C 580 170, 640 120, 720 90"
            fill="none"
            stroke="#0f766e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Coordinate Vector Peak Arrow */}
          <circle cx="720" cy="90" r="7" fill="#0f766e" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="480" cy="200" r="5" fill="#82351f" stroke="#ffffff" strokeWidth="2" />

          {/* Ledger Telemetry Baseline */}
          <g stroke="#191715" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="3 4">
            <line x1="160" y1="140" x2="720" y2="140" />
            <line x1="160" y1="220" x2="720" y2="220" />
            <line x1="160" y1="300" x2="720" y2="300" />
          </g>
          <text x="640" y="80" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#0f766e">MARKET INDEX // ACCEL</text>
        </g>
      )}

      {motif === 'climate' && (
        <g>
          {/* Radiant Solar Disc */}
          <g transform="translate(320, 185)">
            <circle cx="0" cy="0" r="42" fill="url(#grad-sun)" stroke="#0f766e" strokeWidth="2" />
            <circle cx="0" cy="0" r="26" fill="#ffffff" fillOpacity="0.8" />

            {/* Geometric Radiating Rays */}
            <g stroke="#0f766e" strokeWidth="2" strokeLinecap="round">
              <line x1="0" y1="-56" x2="0" y2="-72" />
              <line x1="0" y1="56" x2="0" y2="72" />
              <line x1="-56" y1="0" x2="-72" y2="0" />
              <line x1="56" y1="0" x2="72" y2="0" />
              <line x1="-40" y1="-40" x2="-52" y2="-52" strokeWidth="1.5" />
              <line x1="40" y1="-40" x2="52" y2="-52" strokeWidth="1.5" />
              <line x1="-40" y1="40" x2="-52" y2="52" strokeWidth="1.5" />
              <line x1="40" y1="40" x2="52" y2="52" strokeWidth="1.5" />
            </g>
          </g>

          {/* Wind Turbine Spirals & Atmospheric Vortex */}
          <g stroke="#0f766e" strokeWidth="2" fill="none" opacity="0.6">
            <path d="M 500 130 C 560 100, 620 150, 610 210 C 600 270, 520 280, 480 250" strokeWidth="2.5" />
            <path d="M 520 145 C 570 120, 600 160, 590 200 C 580 240, 530 250, 500 230" strokeWidth="1.5" strokeDasharray="3 4" />
          </g>

          {/* Botanical Leaf Vein Filigree */}
          <path
            d="M 580 90 Q 670 110 710 190 Q 640 210 580 90 Z"
            fill="#e0f2fe"
            fillOpacity="0.4"
            stroke="#047857"
            strokeWidth="1.8"
          />
          <line x1="580" y1="90" x2="710" y2="190" stroke="#047857" strokeWidth="1.5" />
          <line x1="620" y1="125" x2="655" y2="120" stroke="#047857" strokeWidth="1.2" />
          <line x1="650" y1="150" x2="685" y2="148" stroke="#047857" strokeWidth="1.2" />

          {/* Clean Energy Undulating Wave Contours */}
          <path
            d="M 120 285 Q 260 250 400 285 T 680 285 T 760 285"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />
          <path
            d="M 140 305 Q 280 270 420 305 T 700 305 T 780 305"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </g>
      )}

      {motif === 'politics' && (
        <g>
          {/* Classical Capitol Dome & Column Rotunda Geometry */}
          <g transform="translate(380, 85)" stroke="#191715" strokeWidth="1.8" fill="none">
            {/* Dome Arc */}
            <path d="M 0 100 A 75 75 0 0 1 150 100 Z" fill="#faf6f0" fillOpacity="0.9" />
            <circle cx="75" cy="22" r="6" fill="#82351f" />
            <line x1="75" y1="28" x2="75" y2="40" strokeWidth="2.5" />

            {/* Pediment Architrave */}
            <rect x="-15" y="100" width="180" height="14" rx="2" fill="#faf6f0" stroke="#191715" strokeWidth="2" />

            {/* Symmetrical Columns */}
            <line x1="10" y1="114" x2="10" y2="210" strokeWidth="3" />
            <line x1="45" y1="114" x2="45" y2="210" strokeWidth="3" />
            <line x1="105" y1="114" x2="105" y2="210" strokeWidth="3" />
            <line x1="140" y1="114" x2="140" y2="210" strokeWidth="3" />
            <rect x="-25" y="210" width="200" height="12" rx="2" fill="#ffffff" stroke="#191715" strokeWidth="2" />
          </g>

          {/* Balanced Scales of Justice Geometry */}
          <g transform="translate(620, 165)" stroke="#82351f" strokeWidth="1.5" fill="none">
            <line x1="0" y1="0" x2="0" y2="70" strokeWidth="2.5" stroke="#191715" />
            <line x1="-45" y1="15" x2="45" y2="15" strokeWidth="2" />
            {/* Left Pan */}
            <line x1="-45" y1="15" x2="-60" y2="45" />
            <line x1="-45" y1="15" x2="-30" y2="45" />
            <path d="M -65 45 Q -45 58 -25 45 Z" fill="#fde8df" stroke="#82351f" />
            {/* Right Pan */}
            <line x1="45" y1="15" x2="30" y2="45" />
            <line x1="45" y1="15" x2="60" y2="45" />
            <path d="M 25 45 Q 45 58 65 45 Z" fill="#fde8df" stroke="#82351f" />
          </g>

          {/* Civic Rosette Seal */}
          <circle cx="230" cy="195" r="45" fill="none" stroke="#82351f" strokeWidth="1.8" strokeDasharray="3 4" />
          <circle cx="230" cy="195" r="32" fill="#faf6f0" stroke="#0f766e" strokeWidth="1.5" />
          <text x="230" y="200" textAnchor="middle" fontFamily="serif" fontSize="14" fontWeight="bold" fill="#82351f">LEX</text>
        </g>
      )}

      {motif === 'world' && (
        <g>
          {/* Orthographic Globe Wireframe */}
          <g transform="translate(420, 195)">
            <circle cx="0" cy="0" r="100" fill="#faf6f0" stroke="#0369a1" strokeWidth="2" />
            {/* Equator & Parallels */}
            <line x1="-100" y1="0" x2="100" y2="0" stroke="#0369a1" strokeWidth="1.5" />
            <ellipse cx="0" cy="-45" rx="88" ry="16" fill="none" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.6" />
            <ellipse cx="0" cy="45" rx="88" ry="16" fill="none" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.6" />

            {/* Meridians */}
            <ellipse cx="0" cy="0" rx="45" ry="100" fill="none" stroke="#0369a1" strokeWidth="1.5" />
            <ellipse cx="0" cy="0" rx="75" ry="100" fill="none" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
            <line x1="0" y1="-100" x2="0" y2="100" stroke="#0369a1" strokeWidth="1.8" />
          </g>

          {/* 8-Point Navigation Compass Rose */}
          <g transform="translate(630, 150)">
            <circle cx="0" cy="0" r="34" fill="#ffffff" stroke="#0f766e" strokeWidth="1.5" />
            <polygon points="0,-28 6,-8 0,0 -6,-8" fill="#0f766e" />
            <polygon points="0,28 6,8 0,0 -6,8" fill="#82351f" />
            <polygon points="28,0 8,6 0,0 8,-6" fill="#0f766e" fillOpacity="0.6" />
            <polygon points="-28,0 -8,6 0,0 -8,-6" fill="#0f766e" fillOpacity="0.6" />
            <text x="0" y="-32" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#0f766e">N</text>
          </g>

          {/* Geodesic Great-Circle Trajectory */}
          <path
            d="M 180 260 Q 320 120 480 150 T 700 210"
            fill="none"
            stroke="#82351f"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          <circle cx="180" cy="260" r="5" fill="#82351f" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="480" cy="150" r="5" fill="#0f766e" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="700" cy="210" r="5" fill="#82351f" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      )}

      {motif === 'culture' && (
        <g>
          {/* Amphitheater / Stadium Elliptical Geometry */}
          <g transform="translate(410, 205)">
            <ellipse cx="0" cy="0" rx="220" ry="85" fill="none" stroke="#9e4429" strokeWidth="1.5" strokeOpacity="0.4" />
            <ellipse cx="0" cy="0" rx="170" ry="64" fill="none" stroke="#9e4429" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="120" ry="44" fill="#faf6f0" stroke="#0f766e" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="70" ry="26" fill="#fde8df" stroke="#82351f" strokeWidth="1.5" />
          </g>

          {/* Kinetic Terracotta & Peach Ribbons */}
          <path
            d="M 180 140 C 260 90, 360 270, 480 130 C 560 50, 680 160, 720 220"
            fill="none"
            stroke="#9e4429"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 210 160 C 290 110, 380 290, 500 150 C 580 70, 700 180, 740 240"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Chromatic Cultural Discs */}
          <circle cx="260" cy="180" r="28" fill="#fde8df" fillOpacity="0.7" stroke="#9e4429" strokeWidth="1.5" />
          <circle cx="285" cy="165" r="22" fill="#e0f2fe" fillOpacity="0.7" stroke="#0f766e" strokeWidth="1.5" />
        </g>
      )}

      {motif === 'editorial' && (
        <g>
          {/* Classic Broadsheet Architectural Linework */}
          <rect x="220" y="90" width="360" height="200" fill="#ffffff" stroke="#191715" strokeWidth="2" rx="4" />
          <line x1="220" y1="135" x2="580" y2="135" stroke="#191715" strokeWidth="1.8" />
          <line x1="340" y1="135" x2="340" y2="290" stroke="#191715" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="460" y1="135" x2="460" y2="290" stroke="#191715" strokeWidth="1" strokeDasharray="2 3" />

          {/* Stylized Typography Blocks */}
          <rect x="240" y="105" width="160" height="14" fill="#0f766e" rx="2" />
          <line x1="240" y1="155" x2="320" y2="155" stroke="#191715" strokeWidth="3" />
          <line x1="240" y1="170" x2="320" y2="170" stroke="#5c554e" strokeWidth="1.5" />
          <line x1="240" y1="185" x2="310" y2="185" stroke="#5c554e" strokeWidth="1.5" />
          <line x1="240" y1="200" x2="320" y2="200" stroke="#5c554e" strokeWidth="1.5" />

          <line x1="360" y1="155" x2="440" y2="155" stroke="#191715" strokeWidth="3" />
          <line x1="360" y1="170" x2="440" y2="170" stroke="#5c554e" strokeWidth="1.5" />
          <line x1="360" y1="185" x2="430" y2="185" stroke="#5c554e" strokeWidth="1.5" />

          <line x1="480" y1="155" x2="560" y2="155" stroke="#191715" strokeWidth="3" />
          <line x1="480" y1="170" x2="550" y2="170" stroke="#5c554e" strokeWidth="1.5" />

          {/* Central Editorial Seal */}
          <circle cx="400" cy="225" r="28" fill="#fde8df" stroke="#0f766e" strokeWidth="2" />
          <text x="400" y="231" textAnchor="middle" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#0f766e">M</text>
        </g>
      )}

      {/* 3. Global Framing Border Rule */}
      <rect
        x="16"
        y="16"
        width="768"
        height="418"
        fill="none"
        stroke="#191715"
        strokeWidth="1.5"
        strokeOpacity="0.25"
        rx="8"
      />
    </svg>
  );
};
