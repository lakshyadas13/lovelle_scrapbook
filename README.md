#  Lovelle Scrapbook

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

<p align="center">
  <b>A delightful, collaborative digital scrapbook web platform designed with hand-drawn doodles, polaroid timelines, letter time capsules, and real-time synchronization.</b>
</p>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Database & Security](#-database--security) • [Project Structure](#-project-structure) • [License](#-license)

</div>

---

##  About Lovelle Scrapbook

**Lovelle Scrapbook** transforms traditional journaling and memory keeping into an interactive, collaborative digital experience. Whether you want to preserve couple milestones, document road trips with friends, maintain a family archive, or keep a private personal journal, Lovelle provides a warm, tactile aesthetic filled with sketchy borders, pastel hues, washi tape, and sticker badges.

Every scrapbook is an isolated collaborative canvas equipped with real-time updates powered by Supabase, custom invite codes, and fine-grained access control.

---

##  Key Features

###  Multi-Tenant Scrapbooks & Collaboration
- **Multiple Scrapbooks:** Create and switch between distinct scrapbooks (e.g., *"Our Journey"*, *"Euro Trip 2026"*, *"Family Archive"*).
- **Invite Links & Codes:** Share 8-character invite codes to invite partners, friends, or family members.
- **Role-Based Access Control:** Manage permissions seamlessly with `owner`, `editor`, and `viewer` roles.

###  Whimsical Doodly Aesthetic
- **5 Curated Themes:** Switch between *Pink Doodle*, *Lavender Dreams*, *Vintage Journal*, *Cozy Memories*, and *Minimal Pastel*.
- **Cute Avatars & Profile Titles:** Personalize your presence with 8 hand-drawn SVG doodle avatars and playful titles (*Chief Memory Keeper*, *Snack Connoisseur*, *Adventure Planner*, etc.).
- **Tactile UI Elements:** Paper textures, sketchy doodle borders, postcard stamps, washi tape effects, and confetti celebrations.

###  Memory Modules & Tools
- **Daily Highlights:** Post daily wins, gratitudes, and photos with author tags and date filters.
- **Letter Vault & Time Capsules:** Write letters sealed with vintage wax seals and set unlock dates for future time capsules.
- **Polaroid Timeline:** Clip polaroids to an interactive clothesline rope with handwritten captions, rotation effects, and automatic image compression.
- **Things to Work On (Oopsie Jar):** A gentle, collaborative space to log cute quirks, constructive habits, and apologies with resolution tags.
- **Plans & Bucket Lists:** Categorized activity checklists with priority flags and checkmark animations.
- **Appreciation & Cheer Counter:** Real-time synchronized counters to cheer each other on and track collective milestones.
- **Customizable Decks:** Interactive flash-card decks for memories, date ideas, or conversation prompts.
- **Instant Sandbox Mode:** Works offline with `localStorage` fallbacks if Supabase credentials are not yet configured.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS animations |
| **Typography** | Google Fonts ([Caveat](https://fonts.google.com/specimen/Caveat), [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand), [Gaegu](https://fonts.google.com/specimen/Gaegu)) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with Realtime WebSockets |
| **Icons & Effects** | [Lucide React](https://lucide.dev/), `canvas-confetti` |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Realtime) |
| **Security** | Row Level Security (RLS) with membership validation functions |

---

##  Quick Start

### 1. Prerequisites
- **Node.js** (v18.18 or newer recommended)
- **npm**, **pnpm**, or **yarn**
- A free **[Supabase](https://supabase.com/)** account

### 2. Clone the Repository
```bash
git clone https://github.com/lakshyadas13/lovelle_scrapbook.git
cd lovelle_scrapbook
```

### 3. Configure the Backend Database (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Navigate to the **SQL Editor** tab.
3. Open [`backend/schema.sql`](file:///Users/lakshyadas/Downloads/work%20work%20work/VB/app/backend/schema.sql), copy its entire content, paste it into the editor, and click **Run**.
4. Confirm that your tables are created under **Table Editor**:
   - `profiles`, `scrapbooks`, `scrapbook_members`, `scrapbook_invites`
   - `daily_highlights`, `oopsie_items`, `plans_checklist`, `vault_letters`, `memories`, `interactive_counters`, `card_decks`, `deck_cards`
5. Under **Authentication** ➜ **Providers** ➜ **Email**: Ensure Email authentication is enabled.

### 4. Set Up Environment Variables
Navigate to the frontend folder and configure your environment file:
```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env` and insert your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
> *(Found in Supabase under Project Settings ➜ API)*

### 5. Install Dependencies & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Database & Security

All scrapbook data is protected using PostgreSQL **Row Level Security (RLS)**.

- **Automated Profiles:** Supabase Auth triggers automatically generate a record in `public.profiles` whenever a new user signs up.
- **Membership Verification:** Data access is verified through the `is_scrapbook_member(p_scrapbook_id, p_user_id)` database function, ensuring users can only read or write content belonging to scrapbooks they are members of.
- **Real-Time Publications:** Tables are registered to `supabase_realtime` so updates are instantly pushed to all active collaborators.
- **Client-Side Image Optimization:** Images uploaded to the scrapbook are compressed on the client via HTML5 Canvas before storage, eliminating the need for complex external storage bucket setups.

---

##  Project Structure

```
lovelle_scrapbook/
├── backend/
│   └── schema.sql                # Complete PostgreSQL DDL, RLS policies, triggers & functions
├── frontend/
│   ├── public/                   # Static icons and assets
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── good-things/      # Daily Highlights module
│   │   │   ├── love-letters/     # Letter Vault & Time Capsules
│   │   │   ├── memory-timeline/  # Polaroid Clothesline Timeline
│   │   │   ├── oopsie/           # Things to Work On (Oopsie Jar)
│   │   │   ├── plans/            # Plans & Bucket Lists
│   │   │   ├── progress/         # Appreciation & Cheer Counters
│   │   │   ├── decks/            # Custom Card Decks
│   │   │   ├── login/            # Authentication & Onboarding
│   │   │   ├── layout.tsx        # App root layout & Google Font loaders
│   │   │   └── page.tsx          # Public landing & Scrapbook dashboard
│   │   ├── components/           # Reusable UI components (Navbar, Modals, AuthWrapper)
│   │   ├── config/               # Platform themes, avatars, and defaults
│   │   ├── store/                # Zustand multi-tenant store with Realtime subscriptions
│   │   ├── types/                # TypeScript interface definitions
│   │   └── utils/                # Image compression & formatting helpers
│   ├── .env.example              # Template for environment variables
│   ├── package.json              # Frontend scripts & dependencies
│   └── tsconfig.json             # TypeScript configuration
├── .gitignore                    # Git ignore specifications
└── README.md                     # Project documentation
```

---

##  Contributing

Contributions, feature ideas, and feedback are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

Distributed under the MIT License. See `LICENSE` for more information.
