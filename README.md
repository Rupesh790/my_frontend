# IndiaTrade Frontend

React + Vite trading dashboard with Google OAuth authentication and real-time market widgets.

## Tech Stack

- React 19 + Vite 8
- React Router DOM 7
- Django REST Framework backend (separate repo)
- Google OAuth + JWT (SimpleJWT)

## Getting Started

```bash
npm install
cp .env.example .env   # configure API URL and Google client ID
npm run dev            # http://localhost:3000
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Django API base URL |
| `VITE_GOOGLE_LINK` | Google OAuth authorization URL |
| `VITE_GOOGLELOGIN` | Backend Google login endpoint |
| `VITE_USERME` | Authenticated user profile endpoint |
| `VITE_REFRESHTOKEN` | JWT refresh endpoint |
| `VITE_BLACKLIST` | JWT blacklist (logout) endpoint |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/           # API client utilities
├── components/    # Shared UI components
├── context/       # Auth context provider
├── googlelogin/   # Auth pages and services
├── pages/         # Route pages
└── styles/        # Global CSS and design tokens
```
