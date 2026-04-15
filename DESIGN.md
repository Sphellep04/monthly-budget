# Design Brief

## Direction

Clarity-First Budget Companion — A professional yet approachable personal finance tool that prioritizes visual hierarchy and at-a-glance spending status through structured layouts and strategic color coding.

## Tone

Modern financial interface designed with restraint—minimalist decoration, high contrast, and trust-building clarity over decorative flourish. The focus is on data legibility and confidence in spending decisions.

## Differentiation

Category cards with integrated progress bars, status indicators (green/amber/red), and context-aware typography that positions spending psychology ahead of abstract numbers.

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

- Display: Bricolage Grotesque — page headings, month selector, category titles
- Body: DM Sans — all body copy, labels, form inputs
- Mono: Geist Mono — budget amounts, transaction values
- Scale: h1 `text-3xl font-display font-600`, h2 `text-xl font-display font-500`, label `text-sm font-body font-500`, body `text-base font-body font-400`

## Elevation & Depth

Subtle layering via background colors and minimal shadows—card surfaces elevated above background via color, not depth effects. One shadow scale: `shadow-sm` for popover/dropdown, no glow or ambient effects.

## Structural Zones

| Zone       | Background         | Border             | Notes                               |
| ---------- | ------------------ | ------------------ | ----------------------------------- |
| Header     | card bg with border | border-b           | Month selector, login, summary stat |
| Dashboard  | background (muted) | none               | Grid of category cards, alternating |
| Card (cat) | card               | border-sm, subtle  | Progress bar inside, status badge   |
| Sidebar    | sidebar bg         | sidebar-border-r   | Nav links with primary active state |
| Footer     | muted/30           | border-t           | Total spent summary, archive link   |

## Spacing & Rhythm

16px base unit grid—category cards spaced 1.5rem apart, section headings with 2rem top margin, form inputs with 0.75rem label gap. Micro-spacing: 4px between badge and amount, 8px button padding.

## Component Patterns

- Buttons: rounded-md, primary color, hover opacity-90, secondary for destructive with destructive color
- Cards: rounded-lg, bg-card, border-border, shadow-sm hover state
- Progress Bar: `h-2 rounded-full`, success color with animated fill on load
- Badge: `rounded-full px-2 py-1`, muted background with foreground text, contextual color override for status
- Form Input: `border-border rounded-md px-3 py-2`, focus ring-primary

## Motion

- Entrance: Category cards fade in with staggered timing (100ms between each) on dashboard load
- Hover: Progress bars expand opacity, cards lift with subtle shadow increase
- Decorative: None—interactions are functional only

## Constraints

- No full-page gradients or ambient effects
- No animations beyond accordion expand/progress bar fill
- All currency amounts use monospace font
- Status colors (success/warning) only on progress bar and badge, never as primary CTA
- Light mode requires 7:1 text contrast minimum; dark mode 6:1 minimum

## Signature Detail

Progress bars with animated fill on mount and contextual color state changes—the primary visual device for budget status, allowing users to glance and understand spending position without reading numbers.
