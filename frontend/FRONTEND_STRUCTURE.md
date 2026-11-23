# Frontend Structure

This frontend is organized by responsibility:

- `src/components/layout` - app shell/layout components (`Navbar`, `PageWrapper`)
- `src/components/ui` - reusable UI primitives (`GlowButton`, `Toast`, `ConfidenceMeter`, `ProbabilityBar`)
- `src/components/visual` - visual/animation overlays and scene wrappers (`CustomCursor`, `ScanOverlay`, `ParticleBackground`)
- `src/pages` - route-level pages (`Home`, `Detection`, `About`, `Contact`)
- `src/three` - 3D scene elements (`HeroSphere`, `ParticleField`, `MetalCubeGrid`)
- `src/hooks` - reusable hooks (`useScrollAnimation`, `useMousePosition`)
- `src/utils` - app config and API wrapper (`defectConfig`, `api`)
- `src/styles` - global styles and Tailwind setup (`globals.css`)

## API mode

- Default dev API path: `/api/predict` (proxied by Vite to `http://127.0.0.1:5000`)
- Optional override: set `VITE_API_URL` in `.env`
