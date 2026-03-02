# Study Platform

A personal study platform built with Next.js for exam preparation.

## Features

- 📚 Theory content with structured sections
- ✍️ Interactive exercises with detailed explanations
- 🃏 Flashcard system with spaced repetition
- 📊 Progress tracking with heatmap and statistics
- ☁️ Cloud sync with Supabase (auth + database)
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 15 + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State:** Zustand (with localStorage persist)
- **Auth & DB:** Supabase (PostgreSQL + Auth)
- **Animations:** Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
