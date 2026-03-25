# SketchBoard - Real-Time Collaborative Whiteboard

A production-grade Nx monorepo for a real-time collaborative drawing and brainstorming session.

## Architecture Overview

- **Monorepo**: Powered by [Nx](https://nx.dev) and [pnpm](https://pnpm.io).
- **Frontend**: [React](https://reactjs.org) + [Vite](https://vitejs.dev) + [Zustand](https://github.com/pmndrs/zustand) + [Tailwind CSS](https://tailwindcss.com).
- **Backend**: [Node.js](https://nodejs.org) + [Express](https://expressjs.com) + [Socket.io](https://socket.io).
- **Libraries**:
  - `libs/types`: Shared TypeScript interfaces.
  - `libs/board-logic`: Core session and board logic (pure functions).
  - `libs/hooks`: Shared React hooks and Zustand store.
  - `libs/services`: WebSocket client abstraction.
  - `libs/utils`: General helpers and session utilities.

## Features

- Real-time stroke-by-stroke collaborative drawing.
- Scalable room-based presence architecture.
- Real-time chat and session management.
- Responsive, dark-themed productivity UI.
- Modular, type-safe codebase.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Running Locally

To run both the frontend and backend concurrently:

```bash
pnpm dev
```

Or run them individually:

- Frontend: `pnpm dev:web`
- Backend: `pnpm dev:server`

### Building for Production

```bash
pnpm build
```

## Project Structure

```text
apps/
  web/          # React frontend
  server/       # Express WebSocket server
libs/
  board-logic/  # Pure session logic
  hooks/        # React hooks and shared state
  services/     # WebSocket client
  types/        # Shared TS types
  ui/           # Reusable UI components
  utils/        # Helpers and utilities
```
