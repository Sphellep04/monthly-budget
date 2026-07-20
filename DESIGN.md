# Design Brief

## Direction

Premium Clarity Budget Tool - A refined, elevated financial companion that combines clarity with polished micro-interactions and premium visual depth. Precision-engineered interface for confident spending decisions.

## Tone

Premium fintech aesthetic-restrained elegance, smooth transitions, intentional depth layering, and trust-building clarity. Functional beauty without overstatement. Every interaction feels considered and refined.

## Differentiation

Elevated card depth with shadow hierarchy, polished focus rings and input states, backdrop-blurred modals, smooth micro-interactions on hover/active, and refined typography rhythm that creates visual confidence.

## Color Palette

| Token      | Light OKLCH | Dark OKLCH   | Role                        |

| ---------- | ----------- | ------------ | --------------------------- |
| background | 0.98 0 0    | 0.12 0 0     | Primary surface             |
| foreground | 0.2 0 0     | 0.92 0 0     | Text & content              |
| card       | 1.0 0 0     | 0.15 0 0     | Category cards, elevated UI |
| primary    | 0.52 0.15 250 | 0.65 0.15 250 | Core actions, nav active  |
| secondary  | 0.65 0.18 48 | 0.75 0.18 48 | CTAs, accent highlights     |
| muted      | 0.94 0.02 0 | 0.22 0.01 0  | Dividers, subtle backgrounds |
| success    | 0.6 0.18 142 | 0.7 0.18 142 | On-budget indicator         |
| warning    | 0.75 0.18 48 | 0.68 0.18 48 | Over-budget warning         |
| destructive| 0.55 0.22 25 | 0.65 0.19 22 | Delete actions              |

## Typography

- Display: Bricolage Grotesque - page headings, month selector, category titles
- Body: DM Sans - all body copy, labels, form inputs
- Mono: Geist Mono - budget amounts, transaction values
- Scale: h1 `text-3xl font-display font-600`, h2 `text-xl font-display font-500`, label `text-sm font-body font-500`, body `text-base font-body font-400`

## Elevation & Depth

Three-tier shadow hierarchy: `shadow-subtle` for form inputs/interactive elements, `shadow-elevated` for cards on hover/popovers, `shadow-premium` for modals/dialogs. Depth via shadows + background color shifts. No glow or ambient effects.

## Structural Zones

| Zone       | Background         | Border             | Notes                               |
| ---------- | ------------------ | ------------------ | ----------------------------------- |
| Header     | card bg with border | border-b           | Month selector, login, summary stat |
| Dashboard  | background (muted) | none               | Grid of category cards, alternating |
| Card (cat) | card               | border-sm, subtle  | Progress bar inside, status badge   |
| Sidebar    | sidebar bg         | sidebar-border-r   | Nav links with primary active state |
| Footer     | muted/30           | border-t           | Total spent summary, archive link   |

## Spacing & Rhythm

16px base unit grid-category cards spaced 1.5rem apart, section headings with 2rem top margin, form inputs with 0.75rem label gap. Micro-spacing: 4px between badge and amount, 8px button padding.

## Component Patterns

- **Buttons**: `rounded-md`, primary color, `button-hover` (opacity-90 + scale-98 on active), smooth cubic-bezier transition
- **Cards**: `rounded-lg`, `bg-card`, `border-border`, `card-hover` (shadow-elevated on hover), 200ms spring transition
- **Progress Bar**: `h-2 rounded-full`, success/warning/destructive colors, animated fill on load (slide-up + fade-in)
- **Badge**: `rounded-full px-2 py-1`, muted background, contextual status color with increased chroma
- **Form Input**: `border-border rounded-md px-3 py-2`, `input-focus` with 2px offset ring, error state in destructive color with bold border
- **Modal**: `bg-card shadow-premium`, backdrop blur (via CSS), refined padding (24px), focus trap with focus-ring utility

## Motion

- **Entrance**: Category cards use `animate-fade-in` + staggered delay (100ms), progress bars `animate-slide-up` on mount
- **Hover**: Cards gain `shadow-elevated`, buttons scale 98% on active, form inputs focus-ring appears
- **Transitions**: All interactive elements use 0.3s cubic-bezier(0.4, 0, 0.2, 1) smooth curve, buttons use 0.2s spring for snappy feedback
- **Decorative**: None-only functional interactions

## Constraints

- No full-page gradients or ambient effects
- No animations beyond accordion expand/progress bar fill
- All currency amounts use monospace font
- Status colors (success/warning) only on progress bar and badge, never as primary CTA
- Light mode requires 7:1 text contrast minimum; dark mode 6:1 minimum

## Signature Detail

Refined shadow hierarchy and polished micro-interactions: card elevation on hover, spring transitions on buttons, focus rings with 2px offset, and staggered entrance animations. Premium feel through considered depth and smooth motion, not decoration. Progress bars remain primary status indicator with animated fills and contextual color states.


