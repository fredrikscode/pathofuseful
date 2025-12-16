# Getting Started - For Beginners

Welcome! This guide will help you get up and running with your new project.

## Step 1: Enter the Development Environment

Since you're on NixOS, all the tools you need are already configured in the `flake.nix` file.

```bash
cd /home/fredrik/bethebot/poe-leveling-craft
nix develop
```

This will download and set up Node.js, npm, TypeScript, and everything else you need WITHOUT installing them globally on your system.

## Step 2: Install Project Dependencies

Once you're in the Nix shell, run:

```bash
npm install
```

This downloads all the React, Vite, TailwindCSS, and other libraries needed for the project.

## Step 3: Start the Development Server

```bash
npm run dev
```

You should see something like:
```
  VITE v6.0.11  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open `http://localhost:5173/` in your browser!

## Step 4: Make Your First Change

1. Open `src/App.tsx` in your favorite text editor
2. Change the text "Welcome!" to something else
3. Save the file
4. Watch your browser automatically update! (This is called "hot reload")

## Project Structure Explained

```
poe-leveling-craft/
├── flake.nix              # Nix development environment config
├── package.json           # Project dependencies and scripts
├── vite.config.ts         # Vite build tool configuration
├── tsconfig.json          # TypeScript compiler settings
├── tailwind.config.js     # TailwindCSS styling config
├── index.html             # Main HTML file
└── src/
    ├── main.tsx           # App entry point
    ├── App.tsx            # Main app component (start here!)
    └── index.css          # Global styles (TailwindCSS imports)
```

## Understanding the Files

### `src/App.tsx` - Your Main Component

This is where you'll spend most of your time. It's written in **TSX** (TypeScript + JSX), which looks like HTML inside JavaScript:

```tsx
<div className="min-h-screen bg-gray-900 text-white">
  <h1>Hello World</h1>
</div>
```

- `className` is how you add CSS classes (uses TailwindCSS utilities)
- Everything inside `return ()` is what gets displayed
- `{count}` is how you insert JavaScript variables into your HTML

### TailwindCSS Classes

Instead of writing CSS files, you use utility classes:

- `bg-gray-900` = dark gray background
- `text-white` = white text
- `p-4` = padding of 1rem
- `rounded-lg` = large rounded corners
- `hover:bg-blue-700` = darker blue on hover

[Full TailwindCSS docs](https://tailwindcss.com/docs)

### React Hooks (useState)

```tsx
const [count, setCount] = useState(0)
```

- `count` is the current value (starts at 0)
- `setCount` is the function to update it
- When you click the button, it calls `setCount(count + 1)`
- React automatically re-renders with the new value

## Next Steps

Now that you have a working environment, here's what we should do:

1. **Copy game data** from the original project (gems, areas, quests)
2. **Create basic components** (RouteDisplay, CraftingPanel, GearRecommendations)
3. **Add state management** with Zustand (track progress, store build data)
4. **Build the route parser** (understand the DSL from the original project)
5. **Add Path of Building import** (so users can paste their build codes)

## Useful Commands While Developing

- `Ctrl+C` in the terminal - Stop the dev server
- `npm run build` - Create a production build (in the `dist/` folder)
- `npm run preview` - Test the production build locally

## Getting Help

If you get errors:

1. Read the error message carefully (they're usually helpful!)
2. Check the browser console (F12 → Console tab)
3. Make sure you're in the Nix shell (`nix develop`)
4. Try deleting `node_modules` and running `npm install` again

## Learning Resources

- [React Tutorial](https://react.dev/learn) - Official React docs (very beginner-friendly)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)

Ready to build something cool! 🚀
