polydioms/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── client.ts          ← Netlify API fetch helper
│   ├── components/
│   │   ├── FlipCard.tsx
│   │   ├── AnswerChoices.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Game.tsx
│   │   └── Leaderboard.tsx
│   ├── store/
│   │   └── authStore.ts       ← Zustand auth state
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── vite.config.ts
├── package.json
└── tsconfig.json