# METTLE — UI/UX Design System & Production Specification

> **Version:** 3.0 — Distinctive Product Redesign  
> **Target:** React + Tailwind CSS + Vanilla CSS Tokens + SVG  
> **Primary Theme:** Obsidian / Warm Neutral Dark  
> **Design Philosophy:** Less dashboard. Less decoration. More identity. More progression.  
>
> **Core Idea:**  
> *Real-world effort becomes visible character growth.*

---

## 1. Product Design Philosophy

METTLE is not a conventional productivity dashboard.

It should feel like a personal progression instrument where the user's real-world actions gradually build their character.

### Core User Loop:
```
I HAVE WORK TO DO
        ↓
I COMPLETE A QUEST
        ↓
MY CHARACTER GROWS
        ↓
MY PROGRESS BECOMES VISIBLE
        ↓
I WANT TO COME BACK TOMORROW
```

### UI Priorities (in strict order):
1. **Today**
2. **Action**
3. **Progress**
4. **Character**
5. **Reward**
6. **History**

*Everything else is secondary.*

---

## 2. Anti-AI Design Rules

METTLE must **NOT** look like a generated SaaS template.

### Avoid the Following Patterns:
- Excessive glassmorphism
- Excessive rounded cards
- Excessive gradients
- Neon purple dashboards
- Glowing borders everywhere
- Floating decorative blobs
- Random gradient backgrounds
- Excessive shadows
- Excessive badges
- Emoji-based UI
- Four identical statistic cards
- Cards inside cards inside cards
- Generic *"Welcome back!"*
- Generic SaaS hero sections
- Giant empty dashboard areas
- Unnecessary illustrations
- Excessive icon usage
- Unnecessary animations
- Excessive blur
- Excessive pill-shaped UI

### 🏆 Golden Rule:
> **NOT EVERYTHING NEEDS TO BE A CARD.**

### Use:
- Whitespace
- Typography
- Dividers
- Alignment
- Hierarchy
- Scale
- Restrained color

*...to create structure.*

---

## 3. Brand Personality

### METTLE Should Feel:
- Confident
- Disciplined
- Focused
- Mature
- Tactile
- Slightly mysterious
- Rewarding
- Personal
- Premium

### It Should NOT Feel:
- Childish
- Fantasy-heavy
- Corporate
- Cyberpunk-heavy
- Cartoonish
- Overly futuristic
- Gamified for the sake of gamification

> *The RPG layer should feel earned, not decorative.*

---

## 4. Visual Direction

The visual language is inspired by:
- Character sheets
- Field journals
- Training logs
- Modern editorial interfaces
- Premium dark-mode applications
- Tactical interfaces
- Progression systems

The combination creates a visual identity unique to METTLE.

### Design Principle:
```
EDITORIAL STRUCTURE
        +
TACTILE RPG FEEDBACK
        +
MODERN PRODUCT USABILITY
```

---

## 5. Color System

The default interface should be predominantly neutral.

### 5.1 Base Tokens

```css
--color-bg: #0c0d0f;
--color-surface: #131518;
--color-surface-raised: #191c20;

--color-text-primary: #f2f0ea;
--color-text-secondary: #a6a7aa;
--color-text-muted: #6f7277;

--color-border: rgba(255, 255, 255, 0.09);
--color-border-strong: rgba(255, 255, 255, 0.16);
```

> **Rule:** Do not create a gradient background. The background should remain visually quiet.

---

## 6. Accent System

Use **one primary product accent** rather than multiple competing neon colors.

```css
--color-accent: #d8ff55;
--color-accent-soft: rgba(216, 255, 85, 0.12);
--color-accent-border: rgba(216, 255, 85, 0.30);
```

### The Accent Represents:
**METTLE / PROGRESS / ACTION**

### It Should Primarily Appear On:
- XP indicators
- Completion states
- Primary CTA
- Active navigation
- Important progression
- Level-up moments

> *Do not use it everywhere.*

---

## 7. Attribute Colors

Attributes retain individual identities, but colors remain restrained.

| Attribute | Color | Usage / Association |
| :--- | :--- | :--- |
| **Mind** | `#6EA8FE` | Learning / coding / academics |
| **Will** | `#B18CFF` | Discipline / routines / habits |
| **Body** | `#F27A72` | Fitness / gym / physical health |
| **Craft** | `#E58AB8` | Creativity / design / writing |
| **Habit** | `#65C99A` | Consistency / daily streaks |
| **Gold** | `#E6B84D` | Economy & rewards treasury |

### Usage Rules:
- Use attribute colors primarily for small indicators, SVG charts, progress markers, and subtle labels.
- **Never make entire cards brightly colored.**

---

## 8. Typography

### Typefaces:
- **Display:** `Outfit`
- **Interface:** `Inter`

### Role Distribution:
- **`Outfit`:** Page titles, level numbers, XP values, major progression, character identity.
- **`Inter`:** Body text, labels, metadata, navigation, form inputs.

---

## 9. Typography Hierarchy

Large numbers communicate importance.

### Examples:
```text
LEVEL
12
```
*(rather than "Level 12")*

```text
2,840
XP
```

- Use typography as a foundational design element.
- Do not make every heading bold and oversized.

---

## 10. Layout Philosophy

- **Grid:** 12-column responsive layout.
- **Maximum Content Width:** `1200px`
- **Desktop Architecture:** `260px` fixed navigation + Main content area.

> The main content should **NOT** be a grid of identical cards.

### Use:
- Asymmetric layouts
- Large primary areas
- Smaller supporting information
- Editorial spacing
- Horizontal sections
- Occasional full-width sections

---

## 11. Application Shell

### Desktop Structure:
```text
┌──────────────┬──────────────────────────────────┐
│              │             HEADER               │
│    METTLE    ├──────────────────────────────────┤
│              │                                  │
│    TODAY     │                                  │
│    QUESTS    │           MAIN CONTENT           │
│    CHARACTER │                                  │
│    REWARDS   │                                  │
│    HISTORY   │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

### Sidebar Layout:
```text
METTLE

TODAY
QUESTS
CHARACTER
REWARDS
HISTORY

────────────────
LEVEL 12
2,840 XP
────────────────

"Small actions.
Strong character."
```

> The sidebar should be visually quiet. Do not turn it into a glowing gaming HUD.

---

## 12. Mobile Navigation

- Use a compact bottom navigation bar.
- **Primary Items:** `Today` · `Quests` · `Character` · `Rewards`
- A central `+` button may be used for quick quest creation.
- The button should feel like a physical tactile action control, not a floating neon orb.

---

## 13. Global Header

The header should be minimal.

### Elements Displayed:
```text
STREAK 07   •   GOLD 1,240   •   LVL 12   •   Profile
```

- Do not put every possible control in the header.
- Audio controls should be secondary.

---

## 14. Dashboard — "TODAY"

The dashboard is conceptually named: **TODAY**.

### Copywriting:
- **Avoid:** *"Welcome back, Shubham!"*
- **Prefer:**
  ```text
  TODAY
  Thursday, September 12

  Build your mettle.
  ```

> *The user should immediately see what matters today.*

---

## 15. Dashboard Structure

```text
TODAY
│
├── Character / Progress
│
├── Today's Progress
│
├── Active Quests
│
├── Attributes
│
└── Recent Activity
```

---

## 16. Hero / Character Progress

Do not create a giant decorative hero card. Instead create a strong **horizontal progression section**.

### Example:
```text
LEVEL 12  NOVICE SCHOLAR

2,840 XP
───────────────────────────────
660 XP until Level 13

METTLE SCORE
742
```

- Character avatar sits beside this information.
- Keep it restrained and sharp.

---

## 17. XP Visualization

XP is one of the strongest visual anchors.

### Implementation:
- Clean horizontal progress
- Animated fill
- Numerical values
- Level marker

### Example:
```text
LEVEL 12
2,840 / 3,500 XP
━━━━━━━━━━━━━━━━━━━━━━━●━━━━
LEVEL 13
```

> *Avoid excessive glowing effects.*

---

## 18. Today's Progress

Create one clear visual summary:

```text
TODAY'S PROGRESS

4 / 7
QUESTS COMPLETE

████████████████░░░░░
```

### Supporting Information:
```text
+320 XP   •   +45 Gold   •   +1 Discipline
```

> *Do not split these into separate fragmented statistic cards.*

---

## 19. Quest System

Quests are the core interaction and should feel like entries in a personal mission log.

### Quest Entry Example:
```text
01
READ 30 PAGES
Mind · Medium

+80 XP   +15 GOLD                       [ COMPLETE ]
────────────────────────────────────────────────────
```

*Each quest must have strong typographical hierarchy.*

---

## 20. Quest Interaction

Completion should be satisfying, crisp, and fast.

### State Progression:
- **Pending:** `[ ○ ] READ 30 PAGES`
- **Completed:** 
  ```text
  [ ✓ ] READ 30 PAGES
        +80 XP   +15 GOLD
  ```

### Micro-Feedback:
- Subtle scale transition
- Check animation
- XP number transition
- Progress bar increment

> *Avoid giant screen explosions for every standard daily quest.*

---

## 21. Fast Quest Creation

Provide a quick inline creation field:

```text
Add a quest...                                [ Create ]
```

- Clicking advanced options reveals: `category`, `difficulty`, `due date`, `reward`.
- Do not force users through a full modal for simple tasks.

---

## 22. Character Page

The Character page functions as the user's personal identity screen.

### Structure:
```text
CHARACTER

LEVEL 12
NOVICE SCHOLAR

METTLE SCORE
742

──────────────────────

ATTRIBUTES
MIND   82
WILL   71
BODY   64
CRAFT  78
HABIT  91

──────────────────────

PROGRESSION
RADAR / SVG CHARACTER MAP
```

---

## 23. Attribute Visualization

Use the 5-axis SVG radar chart with an elegant, minimal presentation.

### Radar Chart Guidelines:
- Thin lines
- Restrained attribute colors
- Subtle fill opacity
- Animate only when values change

> *Do not turn it into a glowing neon spider-web.*

---

## 24. Level Formula

Keep the non-linear progression concept transparent and accessible.

Display it as an optional informational section:

```text
HOW PROGRESSION WORKS

Your required XP increases as you level up,
so higher levels represent sustained effort.

Required XP ∝ (Level − 1)^1.5
```

- Provide an optional *"View formula"* disclosure if needed.

---

## 25. Badges & Achievements

Achievements should feel collectible and prestigious.

### Guidelines:
- Subtle locked state
- Strong typography
- Clean iconography
- Clear requirement threshold
- Unlock timestamp
- Avoid dozens of cluttered badges (*Quality > Quantity*).

---

## 26. Activity History

Use a clean timeline format rather than fragmented cards.

### Example:
```text
TODAY
10:42   Quest completed (+80 XP)
09:20   Reached 2,800 XP milestone
08:10   Morning routine completed (+40 XP)

────────────────

YESTERDAY
...
```

*This establishes a tangible sense of personal history.*

---

## 27. Rewards

Rewards should feel like a personal treasury rather than an ecommerce storefront.

### Structure:
```text
TREASURY
1,240 GOLD

REWARDS
30 MIN GAMING       120 GOLD
ONE EPISODE         180 GOLD
COFFEE BREAK        100 GOLD
```

*Keep cards clean and minimalist.*

---

## 28. Inventory

Inventory clearly communicates collection ownership.

### Example:
```text
YOUR COLLECTION

OWNED
MIDNIGHT THEME      [ EQUIPPED ]
CYBERPUNK THEME     [ OWNED ]
STREAK SHIELD ×2
```

*The active theme must be visually obvious.*

---

## 29. Theme System

Dynamic themes function as cosmetic atmosphere modes rather than conflicting interface structures.

### Supported Themes:
1. **Default:** Obsidian (`#0c0d0f`) + Lime accent (`#d8ff55`).
2. **Cyberpunk:** Cyan (`#06b6d4`) + Magenta (`#ec4899`) accents (used sparingly).
3. **Midnight:** Obsidian (`#020305`) + Emerald (`#10b981`) / Silver.

> **Rule:** All themes preserve identical layout, spacing, typography, usability, and accessibility.

---

## 30. Microinteractions

Animations should communicate direct cause and effect.

- **Quest Completion:** Checkbox fill $\rightarrow$ XP counter increase $\rightarrow$ Progress bar update.
- **Level Up:** XP crosses threshold $\rightarrow$ Brief screen pause $\rightarrow$ `LEVEL UP` fanfare $\rightarrow$ Attribute & title reveal.
- **Reward Purchase:** Purchase click $\rightarrow$ Gold deductions $\rightarrow$ Item transitions into inventory.

> *Avoid animation overload.*

---

## 31. Audio Specifications

Use procedural Web Audio API synthesis (zero external audio files).

### Supported Events:
- Quest completion chime
- Level-up fanfare
- Reward purchase coin drop

### Audio Rules:
- Defaults to appropriate accessibility behavior
- User-controllable global mute toggle
- Never autoplays aggressively
- Respects mute state and reduced-motion preferences

---

## 32. Motion Principles

| Level | Duration | Target Actions |
| :--- | :--- | :--- |
| **Level 1 — Micro** | `100–180ms` | Hover states, buttons, checkboxes |
| **Level 2 — UI** | `200–350ms` | Panels, dialogs, progress bars |
| **Level 3 — Celebration** | `400–900ms` | Level-up celebrations, major achievements |

---

## 33. Reduced Motion

Respect `@media (prefers-reduced-motion: reduce)`:
- Disable confetti particle bursts
- Disable large transform shifts
- Disable excessive shimmers & animated backgrounds
- Keep essential state transitions understandable

---

## 34. Responsive Design

- **320px:** Single-column compact view.
- **375–425px:** Optimized mobile quest experience.
- **768px:** Tablet split layout.
- **1024px:** Desktop navigation becomes persistent.
- **1440px+:** Maximum content container of `1200px` (do not stretch content across entire ultrawide viewports).

---

## 35. Accessibility (WCAG 2.1 AA)

- Full keyboard navigation (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`)
- Visible focus states
- Semantic HTML5 structure
- Proper form labels & accessible modals
- Minimum text contrast ratio of **4.5:1** (higher for display headers)
- Screen reader support (`aria-label`, semantic landmarks)
- Reduced-motion compliance

---

## 36. Component Design Rules

Create and maintain reusable design primitives:
- `Button`
- `Input`
- `ProgressBar`
- `QuestItem`
- `SectionHeader`
- `Stat`
- `AttributeRow`
- `TimelineItem`
- `Modal`
- `Badge`
- `NavigationItem`

> *Do NOT create ad-hoc unique visual treatments for every page. Consistency stems from the primitive system.*

---

## 37. Border Radius

Use restrained rounding:
- **Small Controls:** `6px`
- **Cards & Panels:** `10px`
- **Large Containers:** `14px`

> *Avoid making everything `rounded-full`, `rounded-2xl`, or `rounded-3xl`. Full pills are reserved strictly for filters, statuses, and compact metadata.*

---

## 38. Shadows & Elevation

Use subtle elevation rather than giant glowing shadows:

```css
box-shadow: 0 8px 30px rgba(0, 0, 0, 0.20);
```

*Only elevated surfaces receive shadows.*

---

## 39. Glassmorphism

Glassmorphism effects should be rare and purposeful.

- **Allowed:** Sidebar, floating mobile navigation, selected modal backdrops.
- **Not Allowed:** Every card, every button, every section.

---

## 40. Icons

- Use icons only when they improve comprehension.
- **Primary Library:** `Lucide React`.
- Avoid decorative icon overload.
- Do not use emojis as functional UI icons.

---

## 41. Empty States

Make all empty states actionable:

```text
NO ACTIVE QUESTS

Your quest log is empty.
Create something small. Build momentum.

[ + CREATE QUEST ]
```

---

## 42. Error States

Never leave users with raw or unexplained errors:

```text
COULDN'T COMPLETE QUEST

Your progress wasn't changed.

[ TRY AGAIN ]
```

---

## 43. Loading States

- Use skeletons that match the exact target layout.
- Do not display full-screen blocking spinners unless hydrating initial auth session.

---

## 44. Copywriting & Voice

METTLE language is concise, disciplined, and confident.

### Prefer:
- *"Build your mettle."*
- *"Keep your streak alive."*
- *"One quest at a time."*
- *"Level up through action."*
- *"Your progress is yours."*

### Avoid:
- *"Welcome back to your amazing productivity journey!"*
- *"Let's crush your goals today!"*

*(Avoid generic, noisy, or AI-sounding copy)*

---

## 45. Dashboard Golden Rule

When the user opens METTLE, the interface must answer within **5 seconds**:
```
WHO AM I?
    ↓
WHAT DO I NEED TO DO?
    ↓
WHAT WILL I GET?
    ↓
HOW AM I PROGRESSING?
```

*If the user cannot understand this immediately, simplify the interface.*

---

## 46. Final Visual Quality Test

Before approving any UI change, evaluate:
1. *Does every element have a purpose?*
2. *Is the hierarchy obvious?*
3. *Is there too much decoration?*
4. *Are there too many cards?*
5. *Are there too many colors?*
6. *Does it look like a template?*
7. *Does it look like METTLE?*

> **The final answer to "Does this look AI-generated?" must be an emphatic NO.**

---

## 47. Implementation Requirement

This design specification is an **authoritative implementation specification**:
- Inspect the existing codebase.
- Preserve working backend functionality.
- Preserve existing API contracts.
- Preserve database persistence.
- Preserve authentication.
- Preserve gamification logic.
- Refactor frontend components cleanly.
- Implement the new visual system.
- Test every existing user flow.
- Fix regressions.
- Test responsive layouts and accessibility.
- Run and verify the production build.

---

## 48. Final Product Statement

METTLE should ultimately feel like:

> **"A personal character sheet for real life."**  
> *(Not "another productivity dashboard with XP added to it.")*

**The user's actions are the game.**  
*The UI exists to make that progress visible, meaningful, and motivating.*