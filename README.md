# Wołkowyja Bonfire Event Platform 2026

A modern, responsive web application for managing private bonfire events. Built with vanilla JavaScript, Leaflet.js, Supabase real-time synchronization, and GitHub Pages deployment.

## Features

- **Event Information & Real-Time Countdown**: Event schedules, arrival windows, and RSVP deadlines.
- **Location & Google Maps Integration**: Interactive map pin with direct link to Google Maps navigation app.
- **Arrival & Contact Guide**: Step-by-step navigation instructions for the final 10-minute arrival segment with host contact actions.
- **RSVP & Alcohol Preference Management**: Attendance confirmation form capturing attendee count, alcohol choices, and contributed items.
- **Equipment & Supply Checklist**: Real-time shared supply tracking with item assignment and progress tracking.
- **Supabase Realtime Sync**: Dual-mode data persistence using Supabase PostgreSQL with automated `localStorage` fallback.

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design Tokens), JavaScript (ES Modules)
- **Mapping**: Leaflet.js (CartoDB Dark Tiles)
- **Icons**: Lucide Icons (SVG)
- **Database / Backend**: Supabase JS Client (`@supabase/supabase-js`)
- **Build Tool**: Vite

## Getting Started

### Installation
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Documentation
For complete deployment and database schema configuration instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).
