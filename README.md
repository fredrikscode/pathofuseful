# PathOfUseful - PoE Leveling & Crafting Guide

An enhanced Path of Exile leveling guide with integrated crafting recommendations, vendor recipes, and personalized gem tracking.

Forked from [exile-leveling](https://github.com/HeartofPhos/exile-leveling) with additional features and improvements.

## Features

- 📖 **Step-by-step leveling guide** through Acts 1-10 with detailed directions
- 🎯 **Path of Building import** for personalized gem recommendations
- 💎 **Quest Gem Tracker** - automatically shows which quest rewards have gems your build needs
- 🔨 **Crafting Guide** - level-appropriate crafting recipes with base item recommendations
- ⚗️ **Vendor Recipes** - comprehensive vendor recipe guide with item icons and tooltips
- 📊 **Progress Tracking** - check off completed steps with persistent storage
- 🔍 **Lookahead Mode** - focus on only the next N steps to reduce clutter
- 📝 **Step Notes** - add personal notes to any step
- 🎨 **Themes** - choose between modern and exile-leveling themes
- ⚙️ **Bandit Support** - routes automatically adjust based on your bandit choice

## Development Setup (NixOS)

This project uses Nix flakes for a reproducible development environment.

### Getting Started

1. **Enter the development environment:**
   ```bash
   nix develop
   ```

   Or use direnv (recommended):
   ```bash
   direnv allow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit `http://localhost:5173`

### Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Zustand** - State management

## License

MIT - Inspired by [exile-leveling](https://github.com/HeartofPhos/exile-leveling) but built from scratch with additional features.
