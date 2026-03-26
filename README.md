# SketchBoard

SketchBoard is a high-performance, real-time collaborative whiteboard platform designed for distributed teams. Built with a modern **Nx monorepo** architecture, it enables instant visual communication through a seamless, low-latency drawing experience across all device types.

## 1. Project Overview
Distributed teams often struggle with the friction of sharing quick visual concepts. SketchBoard solves this by providing "Instant-Join" collaborative rooms. It prioritizes:
- **Zero-Latency Feel**: Optimistic UI updates and efficient WebSocket broadcasting.
- **Cross-Device Consistency**: A normalized coordinate system ensures drawings look identical on mobile and desktop.
- **Responsive-First Design**: A UI that adapts from a full-featured desktop suite to a thumb-friendly mobile drawer system.

## 2. Key Features
- **Real-Time Collaboration**: Instant stroke synchronization and member presence via WebSockets.
- **Adaptive Workspace**: Multi-sidebar desktop layout that collapses into elegant drawers on mobile.
- **Precision Tools**: Pen, Line, and Eraser tools with tool-specific cursors and custom width/color controls.
- **Smart Scaling**: Normalized (0.0 - 1.0) coordinate system for perfect cross-device alignment.
- **Native Sharing**: Integration with the Web Share API for native mobile sharing.
- **Safety**: Guarded operations like "Clear Board" to prevent accidental data loss.

## 3. Architecture
The project leverages an **Nx Monorepo** for strict separation of concerns and high code reusability.

- **`apps/web`**: A React (Vite) application focused on high-performance canvas rendering and UI state.
- **`apps/server`**: A Node.js environment handling WebSocket orchestration, room management, and state persistence.
- **`libs/`**: The core "brain" of the application, shared between both apps:
    - `ui`: A Tailwind CSS component library.
    - `hooks`: Component-agnostic logic (e.g., `useBoardStore` via Zustand).
    - `services`: Singleton providers for WebSockets (`socketService`).
    - `types`: Unified TypeScript definitions for cross-end contract safety.
    - `board-logic`: Shared geometric calculations and state transition rules.

## 4. Folder Structure
```text
sketch-board/
├── apps/
│   ├── web/          # React + Vite (Frontend)
│   └── server/       # Node.js + Socket.io (Backend)
├── libs/
│   ├── ui/           # Atomic UI components & tailwind config
│   ├── hooks/        # Shared React hooks & Zustand stores
│   ├── services/     # WebSocket & API clients
│   ├── types/        # Shared DTOs and Interfaces
│   ├── board-logic/  # Canvas & coordinate math
│   └── utils/        # Generic helpers
├── package.json
└── nx.json           # Monorepo orchestration
```

## 5. Tech Stack
| Tool | Purpose | Rationale |
| :--- | :--- | :--- |
| **React + Vite** | Frontend | Minimal bundle size and extremely fast HMR for canvas-heavy work. |
| **Socket.IO** | Real-Time | Robust event-driven communication with automatic reconnection and room support. |
| **Zustand** | State Management | Light-weight, high-performance state outside the React render cycle. |
| **Tailwind CSS v4** | Styling | Modern, utility-first styling with native CSS variable support and high performance. |
| **Nx** | Monorepo | Enables shared types and services, ensuring the server and client are always in sync. |

## 6. Real-Time System Design
The system uses an **Event-Driven Architecture** via WebSockets:
- **`draw_event`**: Broadcasts stroke segments in real-time.
- **`delete_stroke`**: Synchronizes precision deletions across all clients.
- **`clear_board`**: Resets the shared state for all room members.
- **`user_update`**: Real-time presence tracking (joined/left).

**State Sync Strategy**: The server acts as the "source of truth," maintaining the board state in memory while broadcasting delta updates to clients to keep network traffic minimal.

## 7. State Management
We utilize **Zustand** specifically to separate UI state from the high-frequency "Board State."
- **UI State**: Handled locally in components or hooks (e.g., `activeTool`, `isChatOpen`).
- **Sync State**: Managed in `useBoardStore`, where deep comparisons and ID-based upserts prevent redundant re-renders even with thousands of stroke segments.

## 8. Performance & Scaling
- **Coordinate Normalization**: All points are stored as percentages (0-1). This prevents offset issues when users have different screen resolutions.
- **Request Batching**: Drawing segments are broadcasted instantly for "live" feel, but consolidated into singular strokes upon `mouseUp`.
- **Touch Optimization**: `touch-action: none` prevents browser scrolling, ensuring every touch interaction is captured for the canvas.

## 9. Challenges & Solutions
- **The Offset Problem**: Drawing on mobile appeared in different places on desktop.
    - *Solution*: Moved to a normalized coordinate system where points are relative to the canvas aspect ratio.
- **Eraser Precision**: Simple "clear all" erasers felt clunky.
    - *Solution*: Implemented ID-based segment tracking so the eraser selectively removes specific strokes.

## 10. Future Improvements
- **Persistence Layer**: Integrate Redis or MongoDB for long-term board storage.
- **Multi-Room Hub**: A dashboard for managing multiple boards.
- **AI-Assistance**: "Smart Shapes" to clean up hand-drawn diagrams into perfect vectors.
- **PDF Export**: High-resolution exports of the canvas.

## 11. Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Running Locally
You can run both apps concurrently using Nx:
```bash
npx nx run-many --target=serve --all
```
Alternatively, run them separately:
- **Frontend**: `npx nx serve web`
- **Backend**: `npx nx serve server`

## 12. Deployment
- **Frontend**: Optimized for Vercel/Netlify via `npx nx build web`.
- **Backend**: Requires a persistent connection environment (Render/GCP/AWS) to support WebSockets.
