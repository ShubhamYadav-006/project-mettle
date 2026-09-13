# ⚔️ METTLE — UI/UX Design System & Production Specification

> **Version:** 4.0 — Gamified Productivity Production Standard  
> **Brand Name:** Mettle  
> **Target Stack:** React 18 + Tailwind CSS (v3.4) + CSS Custom Properties (Theming) + Lucide Icons + Web Audio API  
> **Aesthetic Identity:** Monochrome + Electric Lime (`#B5E34A`) with Cyberpunk & Midnight Skins  
> **Design Philosophy:** Minimalist wireframe precision. High-density actionable cards. Smooth 60fps micro-interactions. Real-world discipline becomes visible character growth.

---

## 📑 Table of Contents

- [1. Brand Identity & Product Philosophy](#1-brand-identity--product-philosophy)
- [2. Color System & Design Tokens](#2-color-system--design-tokens)
- [3. Global Animation System & Tokens](#3-global-animation-system--tokens)
- [4. Typography & Hierarchy](#4-typography--hierarchy)
- [5. Navigation & Header Specification](#5-navigation--header-specification)
- [6. High-Density Quest Cards](#6-high-density-quest-cards)
- [7. RPG Engine & Level Progression](#7-rpg-engine--level-progression)
- [8. Attribute Radar & Character Stats](#8-attribute-radar--character-stats)
- [9. Reward Bazaar & Economy](#9-reward-bazaar--economy)
- [10. Audio Synthesis & Micro-Interactions](#10-audio-synthesis--micro-interactions)
- [11. Production Error Boundaries & Accessibility](#11-production-error-boundaries--accessibility)

---

## 1. Brand Identity & Product Philosophy

Mettle converts everyday academic, routine, and discipline efforts into a tangible RPG character progression engine.

### The Core Loop:
```text
┌────────────────────────┐
│  REAL-WORLD TASK DONE  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   COMPLETE IN METTLE   │ (XP, Gold, Attribute Point, Streak Sync, Sound & XP Particles)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  CHARACTER & ATTRIBUTE │ (Smooth SVG Radar Morph, Non-linear Level Up Modal)
│      PROGRESSION       │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ REPEAT FOR CONSISTENCY │ (Pulsing Streaks, Bazaar Rewards, Skin Unlocks)
└────────────────────────┘
```

---

## 2. Color System & Design Tokens

Mettle uses a dual-mode **Monochrome + Electric Lime** design system configured via CSS Custom Properties in `index.css`:

### 2.1 CSS Variables (`:root` - Light Mode)
```css
--bg-primary: #F7F7F7;
--bg-secondary: #F1F1F1;
--bg-surface: #FFFFFF;
--bg-elevated: #FFFFFF;

--text-primary: #111111;
--text-secondary: #5F5F5F;
--text-muted: #8A8A8A;

--accent: #B5E34A;
--accent-hover: #A4D13D;
--accent-text: #111111;
--accent-soft: rgba(181, 227, 74, 0.12);
--accent-border: rgba(181, 227, 74, 0.35);

--border: #E2E2E2;
--border-strong: #CCCCCC;

--gold: #C99628;
--danger: #D95C55;
--success: #3FA56F;
```

### 2.2 Dark Mode (`.dark`)
```css
--bg-primary: #0D0D0D;
--bg-secondary: #141414;
--bg-surface: #1A1A1A;
--bg-elevated: #222222;

--text-primary: #F5F5F5;
--text-secondary: #A6A6A6;
--text-muted: #707070;

--accent: #B5E34A;
--accent-hover: #C5F05C;
--accent-soft: rgba(181, 227, 74, 0.10);
--accent-border: rgba(181, 227, 74, 0.25);

--border: #2A2A2A;
--border-strong: #3A3A3A;

--gold: #E6B84D;
--danger: #F27A72;
--success: #65C99A;
```

### 2.3 Theme Skins
- **Default**: Monochrome + Electric Lime
- **`theme-cyberpunk`**: Neon Cyan (`#00F0FF`) & Magenta highlights
- **`theme-midnight`**: Deep Sapphire & Gold accents

---

## 3. Global Animation System & Tokens

All animations are GPU-accelerated (`transform`, `opacity`) ensuring 60fps performance across desktop and mobile devices:

| Keyframe / Class | Duration & Easing | Purpose |
| :--- | :--- | :--- |
| **`pageEnter`** | `220ms ease-out` | Smooth page transition on navigation tab switches. |
| **`checkPop`** | `280ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Tactile spring bounce when marking quests complete. |
| **`xpFloat`** | `750ms cubic-bezier(0.16, 1, 0.3, 1)` | Floating `+XX XP` particle badge moving `-36px` upward. |
| **`modalPop`** | `260ms cubic-bezier(0.16, 1, 0.3, 1)` | Spring scale-in (`0.94 -> 1.0`) for level-ups and dialogs. |
| **`toastIn` / `toastOut`**| `300ms cubic-bezier(0.16, 1, 0.3, 1)` | Slide & fade-in for gamified notifications. |
| **`flameFlicker`** | `2.5s ease-in-out infinite` | Pulsating warm glow on the daily streak counter. |
| **`skeletonSweep`** | `1.6s ease-in-out infinite` | Shimmer placeholder effect during data fetching. |
| **`@media (prefers-reduced-motion)`** | Overridden to `none !important` | Full accessibility compliance for users requesting reduced motion. |

---

## 4. Typography & Hierarchy

- **Brand & Display Headings**: `Space Grotesk`, sans-serif (`font-display`, `font-bold` / `font-black`)
- **Body & UI Elements**: `Inter`, system-ui, sans-serif (`font-sans`)
- **Data, Stats & Numbers**: `JetBrains Mono` / monospace (`font-mono`) with `AnimatedNumber` numeric interpolation

---

## 5. Navigation & Header Specification

The top navigation bar is a minimal, wireframe-segmented bar:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Mettle          │ Lvl 3 Shubham │ 🔥 1 day │ 🪙 40 │ ☾ / ☼ │ ⋮              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Components:
1. **Brand**: Title-case `Mettle` button linking to the Dashboard.
2. **Player Badge**: Displays `Lvl {level} {firstName}`. Opens Profile.
3. **Streak Pill**: Animated flame icon with animated day ticker.
4. **Treasury Counter**: Displays coin icon with animated gold balance. Opens Bazaar/Shop.
5. **Theme Switcher**: Smooth 360-degree rotating toggle between Light (`☼`) and Dark (`☾`) modes.
6. **Options Dropdown (`⋮`)**: Opens clean menu for Profile, Stats, and Centered Logout Confirmation Modal.

---

## 6. High-Density Quest Cards

Quest cards are engineered for fast visual scanning and instant action:
- **Checkbox Completion Button**: Single-click completion triggering instant XP, Gold, Stat calculations, `XpFloatingBadge` floating particle animation, synthesizer chord, and celebratory toast.
- **Difficulty Badges**:
  - `Trivial`: Gray badge (`+15 XP`, `+5 Gold`)
  - `Easy`: Green badge (`+30 XP`, `+10 Gold`)
  - `Medium`: Yellow badge (`+60 XP`, `+20 Gold`)
  - `Hard`: Orange badge (`+120 XP`, `+45 Gold`)
  - `Epic`: Purple badge (`+250 XP`, `+100 Gold`)
- **Interactive Elevation**: Subtle lift (`-2px`) and glowing border on card hover.

---

## 7. RPG Engine & Level Progression

Progression follows a strict **non-linear mathematical formula** executed authoritatively by the backend:

$$\text{Required Cumulative XP for Level } N = \text{round}\left(250 \times (N - 1)^{1.5}\right)$$

### Milestone Thresholds:
- **Level 1**: 0 XP *(Novice Scholar)*
- **Level 2**: 250 XP *(Novice Scholar)*
- **Level 3**: 707 XP *(Apprentice Scholar)*
- **Level 4**: 1,299 XP *(Apprentice Scholar)*
- **Level 5**: 2,000 XP *(Disciplined Practitioner)*
- **Level 6**: 2,795 XP *(Disciplined Practitioner)*
- **Level 7**: 3,674 XP *(Adept Knight)*
- **Level 10**: 6,750 XP *(Elite Vanguard)*
- **Level 15**: 13,095 XP *(Master Paragon)*
- **Level 20**: 20,705 XP *(Grandmaster of Mettle)*

---

## 8. Attribute Radar & Character Stats

Characters build 5 core life attributes stored in PostgreSQL:
1. **Intellect**: Developed through deep study, research, and problem-solving quests.
2. **Discipline**: Built by morning routines, adherence, and difficult commitments.
3. **Strength**: Built through physical fitness, workout, and health quests.
4. **Creativity**: Developed via design, building, and innovative projects.
5. **Consistency**: Cultivated automatically through daily active habit streaks.

**Radar Component ([RadarChart.jsx](file:///d:/MERN_PRACTICE/Mettle/frontend/src/components/RadarChart.jsx))**:
- Smooth SVG polygon morphing (`transition: all 700ms cubic-bezier(0.16, 1, 0.3, 1)`).
- Vertex hover halos and numeric stat chips.

---

## 9. Reward Bazaar & Economy

- **Virtual Currency**: Gold earned exclusively through verified quest completion and level-up rewards.
- **Item Catalog**:
  - `item_streak_freeze`: Streak Freeze Shield (Protects streak from breaking on missed days).
  - `item_focus_elixir`: Focus Elixir (Consumable XP multiplier).
  - Custom user milestone vouchers and Theme Skins.
- **Instant Feedback**: Toast alerts (`notify.success` / `notify.error`) on purchase and theme equipping.

---

## 10. Audio Synthesis & Micro-Interactions

- **Zero Asset Dependencies**: Sound synthesis is powered dynamically via the browser Web Audio API (`AudioContext`).
- **Complete Sound**: Uplifting harmonic two-tone chord on quest completion (`523.25 Hz -> 659.25 Hz`).
- **Click Sound**: Soft acoustic click (`800 Hz -> 200 Hz`) on navigation and button interaction.
- **Level-Up Fanfare**: Multi-tone ascending chord progression accompanied by confetti bursts.

---

## 11. Production Error Boundaries & Accessibility

- **Global Error Boundary**: Catch-all `<ErrorBoundary />` displays a clean recovery view if unexpected UI exceptions occur.
- **Mobile First Navigation**: Segmented mobile bottom tab bar (`Dashboard`, `Quests`, `Character`, `Shop`, `Profile`).
- **Full Keyboard Navigation**: Every interactive element supports `Tab`, `Enter`, and `Space`.
- **WCAG 2.1 AA Compliant**: High-contrast ratios across both Light and Dark themes.