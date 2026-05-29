# Battleship Game

A modern Battleship game built with Vue 3, TypeScript, and Vite. Play against an AI opponent in this classic naval strategy game.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix Vue** - Unstyled, accessible components (shadcn-vue compatible)
- **Lucide Vue** - Beautiful icon library

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Vue components
│   ├── ui/         # shadcn-vue UI components
│   ├── game/       # Game-specific components
│   └── common/     # Shared components
├── views/          # Page-level components
├── composables/    # Vue composables for shared logic
├── game/           # Core game logic
│   ├── engine/     # Game state management
│   ├── ai/         # AI opponent logic
│   └── types/      # Game-related TypeScript types
├── constants/      # Game constants
├── utils/          # Utility functions
├── stores/         # Pinia stores
└── router/         # Vue Router configuration
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint and Format

```bash
npm run lint
npm run format
```

## Deployment

This project is configured for GitHub Pages deployment. The base URL is set to `/battleship-game/` in `vite.config.ts`.

To deploy:
1. Build the project: `npm run build`
2. Deploy the `dist` folder to GitHub Pages

## Game Features (To Be Implemented)

- Classic Battleship gameplay
- AI opponent with difficulty levels
- Ship placement interface
- Turn-based combat
- Visual feedback for hits and misses
- Game statistics and history
