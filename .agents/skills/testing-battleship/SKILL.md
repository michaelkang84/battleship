---
name: testing-battleship-game
description: Test the battleship game UI end-to-end. Use when verifying UI changes, theme updates, or game flow functionality.
---

# Testing the Battleship Game

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)

## Dev Server
```bash
cd /home/ubuntu/repos/battleship-game
npm run dev
# Runs on http://localhost:5173/battleship-game/
```

## Key Routes
- **Home**: `/battleship-game/`
- **Game**: `/battleship-game/game` (options → placement → countdown → battle → gameOver)
- **Instructions**: `/battleship-game/instructions`

## Game Flow Phases
The game progresses through distinct phases, each triggered by user action:
1. **Options** — Select difficulty (Easy/Medium/Hard). Click "Continue to Ship Placement"
2. **Placement** — Place ships on grid. Click ships in palette, then click board cells. Use "Random" button for quick placement. Click "Ready for Battle!" when all 5 ships placed.
3. **Countdown** — Automatic 3-2-1-BATTLE! animation (~6 seconds)
4. **Battle** — Click enemy board cells to attack. AI responds after each turn.
5. **Game Over** — Shows victory/defeat. "Play Again" resets to options.

## Testing Theme Changes
When testing theme/color changes, verify these key areas:
- Home page: title gradient, button colors, wave/bubble colors
- Options: heading gradient, selected card border/glow, button color
- Placement: heading, ship cell colors, badge, board cell backgrounds
- Countdown: number colors (primary/secondary/accent for 3/2/1)
- Battle: view toggle active state, turn indicator dot, fleet count colors
- Instructions: heading, card backgrounds, ship squares, badge colors
- Semantic colors (hit=red, miss=blue) should NOT change with theme

## Build & Lint
```bash
npm run lint   # ESLint
npm run build  # vue-tsc + vite build
```

## Key Files for Theming
- `src/assets/index.css` — CSS custom properties (primary, secondary, accent, etc.)
- `tailwind.config.js` — Color scales, keyframe animations, glow effects
- `src/components/common/FloatingElements.vue` — Hardcoded bubble colors
- `src/components/common/WaveBackground.vue` — Hardcoded wave colors
- `index.html` — Dark mode class toggle

## Devin Secrets Needed
None — this is a frontend-only app with no authentication.
