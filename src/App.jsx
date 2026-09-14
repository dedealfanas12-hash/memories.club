import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type, Image as ImageIcon, Square, Circle, Trash2, Copy, ArrowUp, ArrowDown,
  Download, Link2, Plus, X, ChevronLeft, Loader2, Palette, BookmarkPlus, LayoutTemplate,
} from 'lucide-react';
import { storage } from './lib/storage';

/* ---------------------------------------------------------------
   Tokens
----------------------------------------------------------------*/
const INK = '#2B2420';
const PAPER = '#F6F3EE';
const BRAND = '#7A2E4D';
const GOLD = '#C99A3E';
const MUTED = '#8A7F73';

const CANVAS_W = 540;
const CANVAS_H = 720;

const CATEGORIES = [
  { id: 'wedding', label: 'Pernikahan', emoji: '💍' },
  { id: 'birthday', label: 'Ulang Tahun', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💕' },
  { id: 'graduation', label: 'Wisuda', emoji: '🎓' },
  { id: 'other', label: 'Lainnya', emoji: '✨' },
];

const TEMPLATE_NAMES = {
  wedding: ['Klasik Elegan', 'Modern Minimalis'],
  birthday: ['Sunset Ceria', 'Pesta Pastel'],
  anniversary: ['Blush Romantis', 'Emas Klasik'],
  graduation: ['Wisuda Formal', 'Semangat Baru'],
  other: ['Kartu Serbaguna', 'Perayaan Ceria'],
};
const TEMPLATE_COUNT = 2;

const FONTS = ['Poppins', 'Playfair Display', 'Dancing Script', 'Montserrat', 'Fraunces'];

const BG_PRESETS = [
  { type: 'solid', color: '#F4F1EC' },
  { type: 'solid', color: '#1B2A3D' },
  { type: 'gradient', from: '#FDF6EE', to: '#EFDCC0' },
  { type: 'gradient', from: '#FF9A56', to: '#D6456F' },
  { type: 'gradient', from: '#FFF0F3', to: '#FFD3DE' },
  { type: 'gradient', from: '#123258', to: '#0B1B2E' },
];

function uid() { return Math.random().toString(36).slice(2, 10); }
function fmtDate(ts) {
  try { return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch (e) { return ''; }
}

/* ---------------------------------------------------------------
   Element + template builders
----------------------------------------------------------------*/
function makeTextEl(props) {
  return {
    id: uid(), type: 'text', x: 70, y: 300, width: 400, height: 60, rotation: 0,
    text: 'Tulis teks di sini', fontSize: 24, fontFamily: 'Poppins', color: '#333333',
    fontWeight: 400, textAlign: 'center', zIndex: 1, ...props,
  };
}
function makeShapeEl(shapeType, props) {
  return {
    id: uid(), type: 'shape', shapeType, x: 220, y: 340, width: 100, height: 100, rotation: 0,
    fill: GOLD, opacity: 1, rx: 0, zIndex: 0, ...props,
  };
}
function makeImageEl(href, props) {
  return {
    id: uid(), type: 'image', x: 140, y: 150, width: 260, height: 260, rotation: 0,
    href, rx: 14, zIndex: 1, ...props,
  };
}

const TEMPLATE_BUILDERS = {
  wedding: [
    () => ({
      title: 'Undangan Pernikahan',
      background: { type: 'gradient', from: '#FDF6EE', to: '#EFDCC0' },
      elements: [
        makeShapeEl('circle', { x: 195, y: 36, width: 150, height: 150, fill: '#E8D5B5', opacity: 0.5, zIndex: 0 }),
        makeTextEl({ text: 'Kami mengundang', x: 70, y: 128, width: 400, height: 30, fontSize: 16, fontFamily: 'Montserrat', color: '#A88A5A', fontWeight: 600, zIndex: 1 }),
        makeTextEl({ text: 'Alya & Bima', x: 40, y: 250, width: 460, height: 90, fontSize: 56, fontFamily: 'Dancing Script', color: '#5C4630', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Sabtu, 20 Desember 2026', x: 70, y: 470, width: 400, height: 30, fontSize: 18, fontFamily: 'Poppins', color: '#5C4630', zIndex: 1 }),
        makeTextEl({ text: 'Gedung Serbaguna, Jakarta', x: 70, y: 505, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#8A7561', zIndex: 1 }),
      ],
    }),
    () => ({
      title: 'Undangan Pernikahan',
      background: { type: 'solid', color: '#FBF3EF' },
      elements: [
        makeShapeEl('rect', { x: 240, y: 208, width: 60, height: 3, fill: '#B99C86', opacity: 1, zIndex: 1 }),
        makeTextEl({ text: 'Undangan pernikahan', x: 70, y: 168, width: 400, height: 26, fontSize: 14, fontFamily: 'Montserrat', color: '#B99C86', fontWeight: 600, zIndex: 1 }),
        makeTextEl({ text: 'Salma & Fajar', x: 40, y: 300, width: 460, height: 60, fontSize: 42, fontFamily: 'Montserrat', color: '#3D332C', fontWeight: 700, zIndex: 1 }),
        makeShapeEl('rect', { x: 240, y: 400, width: 60, height: 3, fill: '#B99C86', opacity: 1, zIndex: 1 }),
        makeTextEl({ text: 'Minggu, 11 Januari 2027', x: 70, y: 460, width: 400, height: 30, fontSize: 17, fontFamily: 'Poppins', color: '#3D332C', zIndex: 1 }),
        makeTextEl({ text: 'The Ballroom, Bandung', x: 70, y: 494, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#8A7A6C', zIndex: 1 }),
      ],
    }),
  ],
  birthday: [
    () => ({
      title: 'Undangan Ulang Tahun',
      background: { type: 'gradient', from: '#FF9A56', to: '#D6456F' },
      elements: [
        makeShapeEl('circle', { x: 44, y: 64, width: 34, height: 34, fill: '#ffffff', opacity: 0.35, zIndex: 0 }),
        makeShapeEl('circle', { x: 444, y: 110, width: 22, height: 22, fill: '#ffffff', opacity: 0.3, zIndex: 0 }),
        makeShapeEl('circle', { x: 460, y: 520, width: 50, height: 50, fill: '#ffffff', opacity: 0.25, zIndex: 0 }),
        makeTextEl({ text: "You're invited", x: 70, y: 150, width: 400, height: 30, fontSize: 17, fontFamily: 'Montserrat', color: '#ffffff', fontWeight: 600, zIndex: 1 }),
        makeTextEl({ text: 'Ulang Tahun ke-17\nKeisha', x: 40, y: 250, width: 460, height: 120, fontSize: 40, fontFamily: 'Playfair Display', color: '#ffffff', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Minggu, 5 Oktober 2026 pukul 16.00', x: 70, y: 500, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#ffffff', zIndex: 1 }),
        makeTextEl({ text: 'Rumah Keisha, Bandung', x: 70, y: 528, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#FFE8EC', zIndex: 1 }),
      ],
    }),
    () => ({
      title: 'Undangan Ulang Tahun',
      background: { type: 'gradient', from: '#E0C3FC', to: '#8EC5FC' },
      elements: [
        makeShapeEl('circle', { x: 60, y: 80, width: 20, height: 20, fill: '#FFD966', opacity: 0.9, zIndex: 0 }),
        makeShapeEl('circle', { x: 420, y: 60, width: 16, height: 16, fill: '#FF8FA3', opacity: 0.9, zIndex: 0 }),
        makeShapeEl('circle', { x: 460, y: 210, width: 24, height: 24, fill: '#B0F2C2', opacity: 0.9, zIndex: 0 }),
        makeShapeEl('circle', { x: 50, y: 560, width: 18, height: 18, fill: '#FFD966', opacity: 0.9, zIndex: 0 }),
        makeShapeEl('circle', { x: 470, y: 580, width: 22, height: 22, fill: '#FF8FA3', opacity: 0.9, zIndex: 0 }),
        makeTextEl({ text: 'Pesta ulang tahun', x: 70, y: 160, width: 400, height: 30, fontSize: 17, fontFamily: 'Poppins', color: '#4A3B63', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Dafa\nUlang Tahun ke-10', x: 40, y: 250, width: 460, height: 120, fontSize: 38, fontFamily: 'Poppins', color: '#3A2E52', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Sabtu, 7 Maret 2026 pukul 10.00', x: 70, y: 500, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#3A2E52', zIndex: 1 }),
        makeTextEl({ text: 'Taman Bermain Ceria', x: 70, y: 528, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#584A73', zIndex: 1 }),
      ],
    }),
  ],
  anniversary: [
    () => ({
      title: 'Undangan Anniversary',
      background: { type: 'gradient', from: '#FFF0F3', to: '#FFD3DE' },
      elements: [
        makeShapeEl('circle', { x: 220, y: 76, width: 100, height: 100, fill: '#F49CAE', opacity: 0.35, zIndex: 0 }),
        makeTextEl({ text: '7 tahun bersama', x: 70, y: 160, width: 400, height: 30, fontSize: 16, fontFamily: 'Montserrat', color: '#C6607A', fontWeight: 600, zIndex: 1 }),
        makeTextEl({ text: 'Dinda & Raka', x: 40, y: 250, width: 460, height: 80, fontSize: 46, fontFamily: 'Dancing Script', color: '#8C3B52', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Merayakan cinta kami', x: 70, y: 336, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#A85A72', zIndex: 1 }),
        makeTextEl({ text: 'Jumat, 14 Februari 2027', x: 70, y: 500, width: 400, height: 30, fontSize: 16, fontFamily: 'Poppins', color: '#8C3B52', zIndex: 1 }),
      ],
    }),
    () => ({
      title: 'Undangan Anniversary',
      background: { type: 'gradient', from: '#5C1A33', to: '#3D0F21' },
      elements: [
        makeShapeEl('circle', { x: 210, y: 60, width: 120, height: 120, fill: GOLD, opacity: 0.2, zIndex: 0 }),
        makeTextEl({ text: '25 tahun pernikahan', x: 70, y: 150, width: 400, height: 30, fontSize: 15, fontFamily: 'Montserrat', color: GOLD, fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Bapak Hartono &\nIbu Sulastri', x: 40, y: 240, width: 460, height: 100, fontSize: 30, fontFamily: 'Playfair Display', color: '#ffffff', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Pesta emas kebersamaan kami', x: 70, y: 358, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#E8CFA9', zIndex: 1 }),
        makeTextEl({ text: 'Sabtu, 9 Mei 2026', x: 70, y: 500, width: 400, height: 30, fontSize: 16, fontFamily: 'Poppins', color: '#ffffff', zIndex: 1 }),
        makeTextEl({ text: 'Kediaman Keluarga, Yogyakarta', x: 70, y: 530, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#E8CFA9', zIndex: 1 }),
      ],
    }),
  ],
  graduation: [
    () => ({
      title: 'Undangan Wisuda',
      background: { type: 'gradient', from: '#123258', to: '#0B1B2E' },
      elements: [
        makeShapeEl('circle', { x: 210, y: 56, width: 120, height: 120, fill: GOLD, opacity: 0.22, zIndex: 0 }),
        makeTextEl({ text: 'Wisuda sarjana', x: 70, y: 150, width: 400, height: 30, fontSize: 15, fontFamily: 'Montserrat', color: GOLD, fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Nabila Putri', x: 40, y: 246, width: 460, height: 70, fontSize: 42, fontFamily: 'Playfair Display', color: '#ffffff', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Fakultas Ilmu Komunikasi', x: 70, y: 326, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#C7D3E0', zIndex: 1 }),
        makeTextEl({ text: 'Sabtu, 28 November 2026', x: 70, y: 500, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#ffffff', zIndex: 1 }),
      ],
    }),
    () => ({
      title: 'Undangan Wisuda',
      background: { type: 'solid', color: '#FAF6F0' },
      elements: [
        makeShapeEl('rect', { x: 0, y: 0, width: 540, height: 14, fill: '#0B6E4F', opacity: 1, zIndex: 0 }),
        makeShapeEl('circle', { x: 200, y: 60, width: 140, height: 140, fill: '#0B6E4F', opacity: 0.12, zIndex: 0 }),
        makeTextEl({ text: 'Wisuda sarjana', x: 70, y: 160, width: 400, height: 30, fontSize: 16, fontFamily: 'Montserrat', color: '#0B6E4F', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Rangga Saputra', x: 40, y: 250, width: 460, height: 60, fontSize: 38, fontFamily: 'Montserrat', color: '#233329', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Fakultas Teknik Informatika', x: 70, y: 320, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#5C6B61', zIndex: 1 }),
        makeTextEl({ text: 'Jumat, 12 Februari 2027', x: 70, y: 500, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#233329', zIndex: 1 }),
        makeTextEl({ text: 'Auditorium Kampus', x: 70, y: 528, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#5C6B61', zIndex: 1 }),
      ],
    }),
  ],
  other: [
    () => ({
      title: 'Undangan Acara',
      background: { type: 'solid', color: '#F4F1EC' },
      elements: [
        makeShapeEl('rect', { x: 50, y: 50, width: 440, height: 620, fill: '#ffffff', opacity: 0.7, zIndex: 0, rx: 18 }),
        makeTextEl({ text: 'Judul Acara', x: 70, y: 190, width: 400, height: 50, fontSize: 34, fontFamily: 'Playfair Display', color: '#333333', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Tulis detail acara kamu di sini', x: 70, y: 268, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#666666', zIndex: 1 }),
        makeTextEl({ text: 'Tanggal • Waktu', x: 70, y: 500, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#333333', zIndex: 1 }),
        makeTextEl({ text: 'Lokasi acara', x: 70, y: 528, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#666666', zIndex: 1 }),
      ],
    }),
    () => ({
      title: 'Undangan Acara',
      background: { type: 'gradient', from: '#3AAFA9', to: '#FEB139' },
      elements: [
        makeShapeEl('circle', { x: 200, y: 50, width: 140, height: 140, fill: '#ffffff', opacity: 0.15, zIndex: 0 }),
        makeTextEl({ text: 'Kamu diundang', x: 70, y: 160, width: 400, height: 30, fontSize: 16, fontFamily: 'Montserrat', color: '#ffffff', fontWeight: 600, zIndex: 1 }),
        makeTextEl({ text: 'Judul Acara Kamu', x: 40, y: 250, width: 460, height: 60, fontSize: 34, fontFamily: 'Playfair Display', color: '#ffffff', fontWeight: 700, zIndex: 1 }),
        makeTextEl({ text: 'Tulis detail acara kamu di sini', x: 70, y: 330, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#FFF7E8', zIndex: 1 }),
        makeTextEl({ text: 'Tanggal • Waktu', x: 70, y: 500, width: 400, height: 30, fontSize: 15, fontFamily: 'Poppins', color: '#ffffff', zIndex: 1 }),
        makeTextEl({ text: 'Lokasi acara', x: 70, y: 528, width: 400, height: 30, fontSize: 14, fontFamily: 'Poppins', color: '#FFF7E8', zIndex: 1 }),
      ],
    }),
  ],
};

function buildTemplate(catId, variant = 0) {
  const builders = TEMPLATE_BUILDERS[catId] || TEMPLATE_BUILDERS.other;
  const build = builders[variant] || builders[0];
  return { ...build(), category: catId, id: `preview-${catId}-${variant}` };
}

/* ---------------------------------------------------------------
   Canvas rendering
----------------------------------------------------------------*/
function ElementShapeInner({ el }) {
  if (el.type === 'shape' && el.shapeType === 'circle') {
    return <ellipse cx={el.width / 2} cy={el.height / 2} rx={el.width / 2} ry={el.height / 2} fill={el.fill} opacity={el.opacity} />;
  }
  if (el.type === 'shape') {
    return <rect width={el.width} height={el.height} fill={el.fill} opacity={el.opacity} rx={el.rx || 0} />;
  }
  if (el.type === 'image') {
    return (
      <image href={el.href} width={el.width} height={el.height} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${el.id})`} />
    );
  }
  if (el.type === 'text') {
    const lines = String(el.text || '').split('\n');
    const lineHeight = Math.round(el.fontSize * 1.28);
    const totalHeight = lines.length * lineHeight;
    const startY = Math.max(el.fontSize, (el.height - totalHeight) / 2 + el.fontSize * 0.88);
    const anchor = el.textAlign === 'left' ? 'start' : el.textAlign === 'right' ? 'end' : 'middle';
    const xPos = el.textAlign === 'left' ? 0 : el.textAlign === 'right' ? el.width : el.width / 2;
    return (
      <text fontSize={el.fontSize} fontFamily={el.fontFamily} fill={el.color} fontWeight={el.fontWeight} textAnchor={anchor}>
        {lines.map((ln, i) => (
          <tspan key={i} x={xPos} y={startY + i * lineHeight}>{ln || ' '}</tspan>
        ))}
      </text>
    );
  }
  return null;
}

function CanvasElement({ el, isSelected, readOnly, onSelectAndMove, onResizeStart }) {
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  const handles = [
    { key: 'nw', hx: 0, hy: 0, cursor: 'nwse-resize' },
    { key: 'ne', hx: el.width, hy: 0, cursor: 'nesw-resize' },
    { key: 'sw', hx: 0, hy: el.height, cursor: 'nesw-resize' },
    { key: 'se', hx: el.width, hy: el.height, cursor: 'nwse-resize' },
  ];
  return (
    <g transform={`rotate(${el.rotation} ${cx} ${cy}) translate(${el.x} ${el.y})`}>
      {el.type === 'image' && (
        <defs>
          <clipPath id={`clip-${el.id}`}>
            <rect width={el.width} height={el.height} rx={el.rx || 0} />
          </clipPath>
        </defs>
      )}
      <g
        onPointerDown={!readOnly ? (e) => onSelectAndMove(e, el) : undefined}
        style={{ cursor: readOnly ? 'default' : 'move' }}
      >
        <rect width={el.width} height={el.height} fill="transparent" />
        <ElementShapeInner el={el} />
      </g>
      {isSelected && (
        <>
          <rect data-noexport="true" x={0} y={0} width={el.width} height={el.height} fill="none" stroke={BRAND} strokeWidth={1.5} strokeDasharray="6 4" pointerEvents="none" />
          {handles.map((h) => (
            <rect
              data-noexport="true"
              key={h.key}
              x={h.hx - 7}
              y={h.hy - 7}
              width={14}
              height={14}
              rx={3}
              fill="#fff"
              stroke={BRAND}
              strokeWidth={2}
              style={{ cursor: h.cursor }}
              onPointerDown={(e) => { e.stopPropagation(); onResizeStart(e, el, h.key); }}
            />
          ))}
        </>
      )}
    </g>
  );
}

function InvitationCanvas({ invitation, readOnly, selectedId, svgRefProp, onPointerDownMove, onPointerDownResize, onBackgroundClick }) {
  const bg = invitation.background;
  const elements = [...invitation.elements].sort((a, b) => a.zIndex - b.zIndex);
  const gradId = `bg-${invitation.id}`;
  return (
    <svg
      ref={svgRefProp}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{
        width: '100%', maxWidth: 420, height: 'auto', touchAction: 'none',
        borderRadius: 18, boxShadow: '0 16px 44px rgba(43,36,32,0.22)',
        display: 'block', background: '#fff',
      }}
    >
      {bg.type === 'gradient' && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg.from} />
            <stop offset="100%" stopColor={bg.to} />
          </linearGradient>
        </defs>
      )}
      <rect
        x={0} y={0} width={CANVAS_W} height={CANVAS_H}
        fill={bg.type === 'gradient' ? `url(#${gradId})` : bg.color}
        onPointerDown={!readOnly ? onBackgroundClick : undefined}
      />
      {elements.map((el) => (
        <CanvasElement
          key={el.id}
          el={el}
          readOnly={readOnly}
          isSelected={!readOnly && selectedId === el.id}
          onSelectAndMove={onPointerDownMove}
          onResizeStart={onPointerDownResize}
        />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------
   Small UI atoms  (all custom colors come from the mk- classes
   defined in the <GlobalStyle> block, since arbitrary Tailwind
   bracket classes like border-[#xxxxxx] don't render here)
----------------------------------------------------------------*/
function IconBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ fontFamily: 'Poppins' }}
      className="mk-icon-btn flex items-center justify-center w-10 h-10 rounded-xl transition"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, children, disabled, full }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: disabled ? '#C9BEB0' : BRAND, fontFamily: 'Poppins' }}
      className={`text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition ${full ? 'w-full' : ''} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------
   Property panel
----------------------------------------------------------------*/
function PropertyPanel({ el, onChange, onDelete, onDuplicate, onLayer, onReplaceImage }) {
  if (!el) {
    return (
      <div className="mk-card-dashed rounded-2xl p-5 text-center text-sm" style={{ color: MUTED, fontFamily: 'Poppins' }}>
        Pilih salah satu elemen di kanvas untuk mengeditnya, atau tambah elemen baru dari toolbar di atas kanvas.
      </div>
    );
  }
  return (
    <div className="mk-card rounded-2xl bg-white p-4 flex flex-col gap-4" style={{ fontFamily: 'Poppins' }}>
      {el.type === 'text' && (
        <>
          <textarea
            value={el.text}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={2}
            className="mk-input w-full resize-none rounded-lg p-2 text-sm"
          />
          <div className="flex gap-2">
            <select value={el.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })} className="mk-input flex-1 rounded-lg p-2 text-sm">
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            <input type="color" value={el.color} onChange={(e) => onChange({ color: e.target.value })} className="mk-card w-10 h-10 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: MUTED }}>Ukuran</span>
            <input type="range" min="12" max="72" value={el.fontSize} onChange={(e) => onChange({ fontSize: +e.target.value })} className="flex-1" />
          </div>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((a) => (
              <button key={a} onClick={() => onChange({ textAlign: a })}
                className="flex-1 py-1.5 rounded-lg text-xs capitalize"
                style={{ border: `1px solid ${el.textAlign === a ? BRAND : '#E7DFD2'}`, color: el.textAlign === a ? BRAND : INK, fontWeight: el.textAlign === a ? 600 : 400 }}>
                {a === 'left' ? 'Kiri' : a === 'center' ? 'Tengah' : 'Kanan'}
              </button>
            ))}
            <button onClick={() => onChange({ fontWeight: el.fontWeight >= 700 ? 400 : 700 })}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ border: `1px solid ${el.fontWeight >= 700 ? BRAND : '#E7DFD2'}`, color: el.fontWeight >= 700 ? BRAND : INK }}>
              B
            </button>
          </div>
        </>
      )}

      {el.type === 'shape' && (
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: MUTED }}>Warna</span>
          <input type="color" value={el.fill} onChange={(e) => onChange({ fill: e.target.value })} className="mk-card w-10 h-10 rounded-lg" />
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs" style={{ color: MUTED }}>Transparansi</span>
            <input type="range" min="0.1" max="1" step="0.05" value={el.opacity} onChange={(e) => onChange({ opacity: +e.target.value })} className="flex-1" />
          </div>
        </div>
      )}

      {el.type === 'image' && (
        <div className="flex flex-col gap-3">
          <button onClick={onReplaceImage} className="mk-input mk-hover-brand text-sm rounded-lg py-2">Ganti foto</button>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: MUTED }}>Sudut membulat</span>
            <input type="range" min="0" max="60" value={el.rx} onChange={(e) => onChange({ rx: +e.target.value })} className="flex-1" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: MUTED }}>Rotasi</span>
        <input type="range" min="-180" max="180" value={el.rotation} onChange={(e) => onChange({ rotation: +e.target.value })} className="flex-1" />
      </div>

      <div className="mk-divider-top flex items-center justify-between pt-3">
        <div className="flex gap-1.5">
          <IconBtn onClick={onDuplicate} title="Duplikat"><Copy size={16} /></IconBtn>
          <IconBtn onClick={() => onLayer('up')} title="Naikkan lapisan"><ArrowUp size={16} /></IconBtn>
          <IconBtn onClick={() => onLayer('down')} title="Turunkan lapisan"><ArrowDown size={16} /></IconBtn>
        </div>
        <IconBtn onClick={onDelete} title="Hapus"><Trash2 size={16} /></IconBtn>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Gallery screen
----------------------------------------------------------------*/
function GalleryScreen({ myInvitations, loadingList, myTemplates, loadingTemplates, onStartBuiltin, onContinue, onUseSavedTemplate }) {
  const [filter, setFilter] = useState('all');
  const builtins = CATEGORIES.flatMap((cat) =>
    Array.from({ length: TEMPLATE_COUNT }, (_, v) => ({
      cat, variant: v, name: (TEMPLATE_NAMES[cat.id] && TEMPLATE_NAMES[cat.id][v]) || cat.label, tpl: buildTemplate(cat.id, v),
    }))
  );
  const shown = filter === 'all' ? builtins : builtins.filter((b) => b.cat.id === filter);

  return (
    <div className="min-h-screen" style={{ background: PAPER }}>
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
        <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-sm mb-1">Bikin kartu digital untuk momen spesialmu</p>
        <h1 style={{ fontFamily: 'Fraunces', color: INK }} className="text-4xl sm:text-5xl font-semibold">Memories Club</h1>
      </header>

      {(loadingList || myInvitations.length > 0) && (
        <div className="max-w-5xl mx-auto px-6 pb-4">
          <h2 style={{ fontFamily: 'Poppins', color: INK }} className="text-sm font-semibold mb-3">Undangan saya</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {loadingList && <div className="text-sm" style={{ color: MUTED, fontFamily: 'Poppins' }}>Memuat…</div>}
            {myInvitations.map((inv) => {
              const cat = CATEGORIES.find((c) => c.id === inv.category);
              return (
                <button key={inv.id} onClick={() => onContinue(inv.id)}
                  className="mk-card mk-hover-brand shrink-0 w-44 rounded-xl bg-white p-3 text-left transition">
                  <div className="text-2xl mb-1">{cat ? cat.emoji : '✨'}</div>
                  <p style={{ fontFamily: 'Poppins', color: INK }} className="text-sm font-medium truncate">{inv.title}</p>
                  <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-xs">{fmtDate(inv.updatedAt)}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(loadingTemplates || myTemplates.length > 0) && (
        <div className="max-w-5xl mx-auto px-6 pb-4">
          <h2 style={{ fontFamily: 'Poppins', color: INK }} className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <LayoutTemplate size={15} /> Template saya
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {loadingTemplates && <div className="text-sm" style={{ color: MUTED, fontFamily: 'Poppins' }}>Memuat…</div>}
            {myTemplates.map((t) => {
              const cat = CATEGORIES.find((c) => c.id === t.category);
              return (
                <button key={t.id} onClick={() => onUseSavedTemplate(t.id)}
                  className="mk-card mk-hover-brand shrink-0 w-44 rounded-xl bg-white p-3 text-left transition">
                  <div className="text-2xl mb-1">{cat ? cat.emoji : '✨'}</div>
                  <p style={{ fontFamily: 'Poppins', color: INK }} className="text-sm font-medium truncate">{t.name}</p>
                  <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-xs">Dibuat sendiri</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 style={{ fontFamily: 'Poppins', color: INK }} className="text-sm font-semibold mb-4">Pilih momen, mulai dari desain siap pakai</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => setFilter('all')}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{ border: `1px solid ${filter === 'all' ? BRAND : '#E7DFD2'}`, color: filter === 'all' ? '#fff' : INK, background: filter === 'all' ? BRAND : '#fff', fontFamily: 'Poppins' }}>
            Semua
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setFilter(cat.id)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium"
              style={{ border: `1px solid ${filter === cat.id ? BRAND : '#E7DFD2'}`, color: filter === cat.id ? '#fff' : INK, background: filter === cat.id ? BRAND : '#fff', fontFamily: 'Poppins' }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map(({ cat, variant, name, tpl }) => (
            <div key={`${cat.id}-${variant}`} className="mk-card rounded-2xl bg-white p-4 flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-between">
                <span style={{ fontFamily: 'Poppins', color: INK }} className="text-sm font-medium">{cat.emoji} {name}</span>
              </div>
              <div style={{ width: '100%', maxWidth: 200 }}>
                <InvitationCanvas invitation={tpl} readOnly />
              </div>
              <PrimaryButton onClick={() => onStartBuiltin(cat.id, variant)} full>
                <Plus size={16} /> Pakai desain ini
              </PrimaryButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Editor screen
----------------------------------------------------------------*/
function EditorScreen({
  invitation, selectedEl, selectedId, svgRef, shareUrl, saveStatus, templateSaveStatus,
  onBack, onTitleChange, onBackgroundChange, onAddText, onAddShape, onAddImageClick,
  onUpdateSelected, onDeleteSelected, onDuplicateSelected, onLayer, onReplaceImage,
  onPointerDownMove, onPointerDownResize, onBackgroundClick, onSaveShare, onExport, onCloseShare, onSaveAsTemplate,
}) {
  const [showBg, setShowBg] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState(invitation.title);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAPER }}>
      <header className="mk-header flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-20">
        <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ fontFamily: 'Poppins', color: MUTED }}>
          <ChevronLeft size={18} /> Kembali
        </button>
        <input
          value={invitation.title}
          onChange={(e) => onTitleChange(e.target.value)}
          style={{ fontFamily: 'Poppins', color: INK, width: '40%' }}
          className="text-sm font-medium text-center bg-transparent outline-none truncate"
        />
        <div className="flex items-center gap-2">
          <IconBtn onClick={onExport} title="Unduh gambar"><Download size={16} /></IconBtn>
          <IconBtn onClick={() => { setTemplateName(invitation.title); setShowTemplateModal(true); }} title="Simpan sebagai template"><BookmarkPlus size={16} /></IconBtn>
          <PrimaryButton onClick={onSaveShare}>
            {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
            Simpan &amp; bagikan
          </PrimaryButton>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 max-w-6xl w-full mx-auto p-4 sm:p-6">
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 justify-center relative">
            <IconBtn onClick={onAddText} title="Tambah teks"><Type size={16} /></IconBtn>
            <IconBtn onClick={onAddImageClick} title="Tambah foto"><ImageIcon size={16} /></IconBtn>
            <IconBtn onClick={() => onAddShape('rect')} title="Tambah kotak"><Square size={16} /></IconBtn>
            <IconBtn onClick={() => onAddShape('circle')} title="Tambah lingkaran"><Circle size={16} /></IconBtn>
            <IconBtn onClick={() => setShowBg((v) => !v)} title="Warna latar"><Palette size={16} /></IconBtn>
            {showBg && (
              <div className="mk-card absolute z-30 top-11 right-0 bg-white rounded-xl p-2 flex gap-1.5 shadow-lg">
                {BG_PRESETS.map((bgp, i) => (
                  <button key={i} onClick={() => { onBackgroundChange(bgp); setShowBg(false); }}
                    className="mk-swatch w-7 h-7 rounded-full"
                    style={{ background: bgp.type === 'solid' ? bgp.color : `linear-gradient(180deg, ${bgp.from}, ${bgp.to})` }} />
                ))}
              </div>
            )}
          </div>

          <InvitationCanvas
            invitation={invitation}
            svgRefProp={svgRef}
            selectedId={selectedId}
            onPointerDownMove={onPointerDownMove}
            onPointerDownResize={onPointerDownResize}
            onBackgroundClick={onBackgroundClick}
          />
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <PropertyPanel
            el={selectedEl}
            onChange={(patch) => onUpdateSelected(selectedId, patch)}
            onDelete={() => onDeleteSelected(selectedId)}
            onDuplicate={() => onDuplicateSelected(selectedId)}
            onLayer={(dir) => onLayer(selectedId, dir)}
            onReplaceImage={() => onReplaceImage(selectedId)}
          />
        </div>
      </div>

      {showTemplateModal && (
        <div className="mk-overlay fixed inset-0 flex items-center justify-center p-6 z-40" onClick={() => setShowTemplateModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 style={{ fontFamily: 'Fraunces', color: INK }} className="text-lg font-semibold">Simpan sebagai template</h3>
              <button onClick={() => setShowTemplateModal(false)}><X size={18} /></button>
            </div>
            <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-sm">
              Desain ini (tata letak, warna, foto) akan tersimpan di "Template saya" supaya bisa dipakai lagi untuk acara berikutnya.
            </p>
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Nama template"
              className="mk-input rounded-lg p-2 text-sm"
              style={{ fontFamily: 'Poppins' }}
            />
            <PrimaryButton onClick={() => { onSaveAsTemplate(templateName || invitation.title); setShowTemplateModal(false); }} full disabled={!templateName.trim()}>
              {templateSaveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <BookmarkPlus size={16} />}
              Simpan template
            </PrimaryButton>
          </div>
        </div>
      )}

      {shareUrl && (
        <div className="mk-overlay fixed inset-0 flex items-center justify-center p-6 z-40" onClick={onCloseShare}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 style={{ fontFamily: 'Fraunces', color: INK }} className="text-lg font-semibold">Tersimpan</h3>
              <button onClick={onCloseShare}><X size={18} /></button>
            </div>
            <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-sm">
              Bagikan link ini ke tamu — siapa pun yang membukanya bisa melihat undanganmu. Kalau kamu sudah publish artifact ini di Claude, link ini juga bisa dibuka tanpa akun.
            </p>
            <div className="mk-card flex items-center gap-2 rounded-lg p-2">
              <input readOnly value={shareUrl} className="flex-1 text-xs outline-none" style={{ fontFamily: 'Poppins' }} />
              <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="shrink-0">
                <Copy size={16} color={BRAND} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Guest screen
----------------------------------------------------------------*/
function GuestScreen({ invitation, onExport, svgRef }) {
  const [opened, setOpened] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === invitation.category) || CATEGORIES[CATEGORIES.length - 1];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: PAPER }}>
      {!opened ? (
        <div className="flex flex-col items-center text-center gap-6" style={{ animation: 'memoriesClubFade 0.6s ease' }}>
          <div className="text-6xl">{cat.emoji}</div>
          <div>
            <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-sm mb-1">Ada undangan spesial untukmu</p>
            <h1 style={{ fontFamily: 'Fraunces', color: INK }} className="text-3xl font-semibold">{invitation.title}</h1>
          </div>
          <button onClick={() => setOpened(true)} style={{ background: BRAND, fontFamily: 'Poppins' }}
            className="text-white px-8 py-3 rounded-full font-medium shadow-lg hover:opacity-90 transition">
            Buka undangan
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5" style={{ animation: 'memoriesClubReveal 0.5s ease' }}>
          <InvitationCanvas invitation={invitation} readOnly svgRefProp={svgRef} />
          <button onClick={onExport} style={{ fontFamily: 'Poppins', color: INK }}
            className="mk-input flex items-center gap-2 text-sm rounded-full px-4 py-2 bg-white">
            <Download size={15} /> Unduh gambar
          </button>
          <p style={{ fontFamily: 'Poppins', color: '#B5AA9C' }} className="text-xs">Dibuat dengan Memories Club</p>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Global style block: fonts, keyframes, and the mk- utility
   classes that stand in for Tailwind's arbitrary-value classes
----------------------------------------------------------------*/
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@600;700&family=Montserrat:wght@400;600;700&display=swap');
      @keyframes memoriesClubFade { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
      @keyframes memoriesClubReveal { from { opacity: 0; transform: scale(0.94);} to { opacity: 1; transform: scale(1);} }
      .mk-card { border: 1px solid #E7DFD2; }
      .mk-card-dashed { border: 1px dashed #DDD3C4; }
      .mk-divider-top { border-top: 1px solid #F0EAE0; }
      .mk-icon-btn { border: 1px solid #E4DCCF; color: #2B2420; background: #ffffff; }
      .mk-icon-btn:hover { border-color: #C99A3E; }
      .mk-hover-brand:hover { border-color: #7A2E4D; }
      .mk-swatch { border: 1px solid rgba(0,0,0,0.12); }
      .mk-input { border: 1px solid #E7DFD2; outline: none; }
      .mk-input:focus { border-color: #7A2E4D; }
      .mk-header { background: rgba(255,255,255,0.85); border-bottom: 1px solid #E7DFD2; }
      .mk-overlay { background: rgba(0,0,0,0.4); }
    `}</style>
  );
}

/* ---------------------------------------------------------------
   App
----------------------------------------------------------------*/
export default function App() {
  const [screen, setScreen] = useState('gallery');
  const [invitation, setInvitation] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [myInvitations, setMyInvitations] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [myTemplates, setMyTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templateSaveStatus, setTemplateSaveStatus] = useState('');

  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const fileInputRef = useRef(null);
  const replaceTargetRef = useRef(null);

  // Detect guest link on load
  useEffect(() => {
    const hash = window.location.hash || '';
    const m = hash.match(/view=([a-z0-9]+)/i);
    if (m) {
      setScreen('guest-loading');
      (async () => {
        try {
          const res = await storage.get(`invite:${m[1]}`, true);
          if (res && res.value) {
            setInvitation(JSON.parse(res.value));
            setScreen('guest');
          } else {
            setScreen('guest-notfound');
          }
        } catch (e) {
          setScreen('guest-notfound');
        }
      })();
    }
  }, []);

  // Load "my invitations" and "my templates" whenever gallery is shown
  useEffect(() => {
    if (screen !== 'gallery') return;
    setLoadingList(true);
    (async () => {
      try {
        const res = await storage.get('my-invitations', false);
        setMyInvitations(res && res.value ? JSON.parse(res.value) : []);
      } catch (e) {
        setMyInvitations([]);
      }
      setLoadingList(false);
    })();
    setLoadingTemplates(true);
    (async () => {
      try {
        const res = await storage.get('my-templates', false);
        setMyTemplates(res && res.value ? JSON.parse(res.value) : []);
      } catch (e) {
        setMyTemplates([]);
      }
      setLoadingTemplates(false);
    })();
  }, [screen]);

  // Keyboard delete
  useEffect(() => {
    function onKey(e) {
      if (screen !== 'editor' || !selectedId) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteElement(selectedId);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, selectedId]);

  function svgPoint(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function toLocalDelta(dx, dy, rotationDeg) {
    const rad = (-rotationDeg * Math.PI) / 180;
    return { dx: dx * Math.cos(rad) - dy * Math.sin(rad), dy: dx * Math.sin(rad) + dy * Math.cos(rad) };
  }

  const onPointerMove = useCallback((e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = svgPoint(e);
    const rawDx = p.x - drag.start.x;
    const rawDy = p.y - drag.start.y;
    if (drag.mode === 'move') {
      updateElement(drag.elId, { x: drag.startEl.x + rawDx, y: drag.startEl.y + rawDy });
    } else if (drag.mode === 'resize') {
      const { dx, dy } = toLocalDelta(rawDx, rawDy, drag.startEl.rotation);
      let { x, y, width, height } = drag.startEl;
      const min = 24;
      if (drag.handle.includes('e')) width = Math.max(min, drag.startEl.width + dx);
      if (drag.handle.includes('s')) height = Math.max(min, drag.startEl.height + dy);
      if (drag.handle.includes('w')) { width = Math.max(min, drag.startEl.width - dx); x = drag.startEl.x + (drag.startEl.width - width); }
      if (drag.handle.includes('n')) { height = Math.max(min, drag.startEl.height - dy); y = drag.startEl.y + (drag.startEl.height - height); }
      updateElement(drag.elId, { x, y, width, height });
    }
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }, [onPointerMove]);

  function handleSelectAndMove(e, el) {
    e.stopPropagation();
    setSelectedId(el.id);
    const p = svgPoint(e);
    dragRef.current = { mode: 'move', elId: el.id, start: p, startEl: { x: el.x, y: el.y, rotation: el.rotation } };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function handleResizeStart(e, el, handle) {
    e.stopPropagation();
    setSelectedId(el.id);
    const p = svgPoint(e);
    dragRef.current = { mode: 'resize', elId: el.id, handle, start: p, startEl: { x: el.x, y: el.y, width: el.width, height: el.height, rotation: el.rotation } };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function updateElement(id, patch) {
    setInvitation((prev) => prev && ({ ...prev, elements: prev.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)) }));
  }

  function deleteElement(id) {
    setInvitation((prev) => prev && ({ ...prev, elements: prev.elements.filter((el) => el.id !== id) }));
    setSelectedId(null);
  }

  function duplicateElement(id) {
    if (!invitation) return;
    const el = invitation.elements.find((e) => e.id === id);
    if (!el) return;
    const newId = uid();
    const maxZ = Math.max(0, ...invitation.elements.map((e) => e.zIndex));
    const newEl = { ...el, id: newId, x: el.x + 18, y: el.y + 18, zIndex: maxZ + 1 };
    setInvitation((prev) => ({ ...prev, elements: [...prev.elements, newEl] }));
    setSelectedId(newId);
  }

  function changeLayer(id, direction) {
    setInvitation((prev) => {
      const sorted = [...prev.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === id);
      const swapIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const zA = sorted[idx].zIndex;
      const zB = sorted[swapIdx].zIndex;
      return {
        ...prev,
        elements: prev.elements.map((e) => {
          if (e.id === sorted[idx].id) return { ...e, zIndex: zB };
          if (e.id === sorted[swapIdx].id) return { ...e, zIndex: zA };
          return e;
        }),
      };
    });
  }

  function addText() {
    if (!invitation) return;
    const maxZ = Math.max(0, ...invitation.elements.map((e) => e.zIndex));
    const el = makeTextEl({ zIndex: maxZ + 1 });
    setInvitation((prev) => ({ ...prev, elements: [...prev.elements, el] }));
    setSelectedId(el.id);
  }

  function addShape(shapeType) {
    if (!invitation) return;
    const maxZ = Math.max(0, ...invitation.elements.map((e) => e.zIndex));
    const el = makeShapeEl(shapeType, { zIndex: maxZ + 1 });
    setInvitation((prev) => ({ ...prev, elements: [...prev.elements, el] }));
    setSelectedId(el.id);
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width, h = img.height;
          const maxDim = 700;
          if (Math.max(w, h) > maxDim) {
            const scale = maxDim / Math.max(w, h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.onerror = reject;
        img.src = ev.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageFile(file) {
    if (!file || !invitation) return;
    try {
      const dataUrl = await compressImageFile(file);
      if (replaceTargetRef.current) {
        updateElement(replaceTargetRef.current, { href: dataUrl });
        replaceTargetRef.current = null;
      } else {
        const maxZ = Math.max(0, ...invitation.elements.map((e) => e.zIndex));
        const el = makeImageEl(dataUrl, { zIndex: maxZ + 1 });
        setInvitation((prev) => ({ ...prev, elements: [...prev.elements, el] }));
        setSelectedId(el.id);
      }
    } catch (e) {
      // ignore silently, user can retry
    }
  }

  function requestReplaceImage(id) {
    replaceTargetRef.current = id;
    fileInputRef.current.click();
  }

  function requestAddImage() {
    replaceTargetRef.current = null;
    fileInputRef.current.click();
  }

  async function handleSaveShare() {
    if (!invitation) return;
    setSaveStatus('saving');
    try {
      await storage.set(`invite:${invitation.id}`, JSON.stringify(invitation), true);
      let list = [];
      try {
        const res = await storage.get('my-invitations', false);
        list = res && res.value ? JSON.parse(res.value) : [];
      } catch (e) { list = []; }
      const idx = list.findIndex((x) => x.id === invitation.id);
      const entry = { id: invitation.id, title: invitation.title, category: invitation.category, updatedAt: Date.now() };
      if (idx >= 0) list[idx] = entry; else list.unshift(entry);
      await storage.set('my-invitations', JSON.stringify(list), false);
      const url = window.location.href.split('#')[0] + '#view=' + invitation.id;
      setShareUrl(url);
      setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('');
    }
  }

  async function handleSaveAsTemplate(name) {
    if (!invitation) return;
    setTemplateSaveStatus('saving');
    try {
      const newId = uid();
      const finalName = (name || '').trim() || invitation.title;
      const templateData = {
        id: newId, name: finalName, category: invitation.category,
        background: invitation.background, elements: invitation.elements, createdAt: Date.now(),
      };
      await storage.set(`template:${newId}`, JSON.stringify(templateData), false);
      let list = [];
      try {
        const res = await storage.get('my-templates', false);
        list = res && res.value ? JSON.parse(res.value) : [];
      } catch (e) { list = []; }
      list.unshift({ id: newId, name: finalName, category: invitation.category, updatedAt: Date.now() });
      await storage.set('my-templates', JSON.stringify(list), false);
      setTemplateSaveStatus('saved');
      setMyTemplates(list);
    } catch (e) {
      setTemplateSaveStatus('');
    }
  }

  function handleExportPNG() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.querySelectorAll('[data-noexport="true"]').forEach((n) => n.remove());
    const svgString = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W * scale;
      canvas.height = CANVAS_H * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.download = `${(invitation.title || 'undangan').replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }, 'image/png');
    };
    img.src = url;
  }

  async function continueEditing(id) {
    try {
      const res = await storage.get(`invite:${id}`, true);
      if (res && res.value) {
        setInvitation(JSON.parse(res.value));
        setSelectedId(null);
        setShareUrl('');
        setSaveStatus('');
        setScreen('editor');
      }
    } catch (e) {
      // ignore
    }
  }

  function startFromBuiltin(catId, variant) {
    const tpl = buildTemplate(catId, variant);
    setInvitation({ ...tpl, id: uid(), createdAt: Date.now() });
    setSelectedId(null);
    setShareUrl('');
    setSaveStatus('');
    setScreen('editor');
  }

  async function useSavedTemplate(templateId) {
    try {
      const res = await storage.get(`template:${templateId}`, false);
      if (res && res.value) {
        const t = JSON.parse(res.value);
        setInvitation({ category: t.category, background: t.background, elements: t.elements, id: uid(), title: t.name, createdAt: Date.now() });
        setSelectedId(null);
        setShareUrl('');
        setSaveStatus('');
        setScreen('editor');
      }
    } catch (e) {
      // ignore, user can retry
    }
  }

  const selectedEl = invitation && selectedId ? invitation.elements.find((e) => e.id === selectedId) : null;

  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => { const f = e.target.files && e.target.files[0]; handleImageFile(f); e.target.value = ''; }}
    />
  );

  if (screen === 'guest-loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: PAPER }}>
        <GlobalStyle />
        <Loader2 className="animate-spin" color={BRAND} size={28} />
      </div>
    );
  }

  if (screen === 'guest-notfound') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 p-6 text-center" style={{ background: PAPER }}>
        <GlobalStyle />
        <p className="text-4xl mb-2">🔍</p>
        <h1 style={{ fontFamily: 'Fraunces', color: INK }} className="text-2xl font-semibold">Undangan tidak ditemukan</h1>
        <p style={{ fontFamily: 'Poppins', color: MUTED }} className="text-sm max-w-xs">Link ini mungkin sudah tidak berlaku, atau undangannya belum disimpan oleh pembuatnya.</p>
      </div>
    );
  }

  if (screen === 'guest' && invitation) {
    return (
      <>
        <GlobalStyle />
        <GuestScreen invitation={invitation} onExport={handleExportPNG} svgRef={svgRef} />
      </>
    );
  }

  if (screen === 'editor' && invitation) {
    return (
      <>
        <GlobalStyle />
        {hiddenFileInput}
        <EditorScreen
          invitation={invitation}
          selectedEl={selectedEl}
          selectedId={selectedId}
          svgRef={svgRef}
          shareUrl={shareUrl}
          saveStatus={saveStatus}
          templateSaveStatus={templateSaveStatus}
          onBack={() => setScreen('gallery')}
          onTitleChange={(v) => setInvitation((prev) => ({ ...prev, title: v }))}
          onBackgroundChange={(bg) => setInvitation((prev) => ({ ...prev, background: bg }))}
          onAddText={addText}
          onAddShape={addShape}
          onAddImageClick={requestAddImage}
          onUpdateSelected={(id, patch) => updateElement(id, patch)}
          onDeleteSelected={deleteElement}
          onDuplicateSelected={duplicateElement}
          onLayer={changeLayer}
          onReplaceImage={requestReplaceImage}
          onPointerDownMove={handleSelectAndMove}
          onPointerDownResize={handleResizeStart}
          onBackgroundClick={() => setSelectedId(null)}
          onSaveShare={handleSaveShare}
          onExport={handleExportPNG}
          onCloseShare={() => setShareUrl('')}
          onSaveAsTemplate={handleSaveAsTemplate}
        />
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <GalleryScreen
        myInvitations={myInvitations}
        loadingList={loadingList}
        myTemplates={myTemplates}
        loadingTemplates={loadingTemplates}
        onStartBuiltin={startFromBuiltin}
        onContinue={continueEditing}
        onUseSavedTemplate={useSavedTemplate}
      />
    </>
  );
}
