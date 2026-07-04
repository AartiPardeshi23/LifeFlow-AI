# LifeFlow AI – Implementation Plan

LifeFlow AI is a premium, all-in-one personal growth, planning, and mindfulness platform designed to combine the features of Notion, Headspace, Calm, Todoist, and Day One. The application is built using a modern component-based React architecture, styled with custom Vanilla CSS for visual excellence, and runs entirely in the browser with local-first persistence (LocalStorage/IndexedDB) to maintain privacy and offline accessibility.

## User Review Required

> [!IMPORTANT]
> **Key Design and Engineering Decisions:**
> 1. **Framework & Styling**: We will use **Vite + React (JavaScript)** to build a modular, component-based frontend. Styling will use custom **Vanilla CSS** (CSS variables for light/dark mode, backdrop filters, flexbox/grid layouts) to guarantee precise, premium styling without being bound to Tailwind frameworks, as per developer guidelines.
> 2. **Data Persistence & Privacy**: To respect the "privacy-first design" and "offline support" requirements, data will be stored locally in the browser using a structured **LocalDatabase** model (stored in `localStorage` or `IndexedDB`). We will include full Backup/Restore (JSON export/import) and PDF/CSV export for user data control.
> 3. **Interactive Components**:
>    - **Vision Board**: Drag-and-drop workspace using interactive absolute positioning and drag state hooks.
>    - **Growth Tree**: An SVG-based growth tree visualization that adds leaves/flowers dynamically as the user's level and XP increase.
>    - **Background Audio**: Built-in nature sounds (Rain, Forest, Ocean Waves, White Noise) with a premium audio controller.
>    - **AI Coach**: A simulated, client-side empathetic AI wizard that evaluates user inputs (journals, mood, goals) and generates encouraging, constructive feedback, schedule advice, and SMART goal steps in real-time.

## Open Questions

> [!NOTE]
> None at the moment. You can approve the plan or write custom feedback in the text box.

---

## Proposed Changes

### Core Architecture & Configuration

#### [NEW] [package.json](file:///c:/Users/hp/Downloads/Random/package.json)
Initialize standard React + Vite template. Install minimal packages:
- `lucide-react` (premium clean SVG icons)
- `recharts` (custom interactive charts for analytics)
- `canvas-confetti` (for gamification level-up and milestone celebrations)

#### [NEW] [vite.config.js](file:///c:/Users/hp/Downloads/Random/vite.config.js)
Configure the Vite build system and define local build behavior.

---

### UI & Styling System

#### [NEW] [index.css](file:///c:/Users/hp/Downloads/Random/src/index.css)
Establish the premium global design system:
- **Calming Palette**: Pastel gradients, soft glassmorphism shadows, backdrop-filter backings.
- **Dynamic Themes**: CSS Variables for `--bg-gradient`, `--panel-bg`, `--text-primary`, `--accent-color`, etc. supporting smooth dark/light mode switches.
- **Typography**: Import Google Fonts *Outfit* (rounded, calming) and *Merriweather* (serif, premium writing font for journals).
- **Animations**: Soft transitions for navigation hover states, pulse indicators, and sliding panels.

---

### Database and Data Model

#### [NEW] [db.js](file:///c:/Users/hp/Downloads/Random/src/utils/db.js)
Create a centralized local storage manager providing:
- Structured storage for: Goals, Habits, Journal entries, Planners (Health, Meal, Diet, Finance, Reading, etc.), Calendar Events, To-Do lists, Vision boards, and User Settings.
- Standard mock data to populate the app on first launch (so the user is greeted by a fully functional dashboard).
- Backup & Restore routines (JSON importing/exporting).
- CSV & PDF exporter helpers.

---

### Component Architecture

The interface will be split into a left-side **Glassmorphic Navigation Bar** and a main **Dynamic Workspace Area** depending on the selected view:

#### 1. Sidebar Navigation (`src/components/Sidebar.jsx`)
A clean, premium floating sidebar. Provides quick switching between:
- 🏡 Dashboard
- 📅 Daily Planner & Calendar
- 📝 Journal System (Daily, Gratitude, Feeling, Mental Health)
- 🗂️ Planners (Work, Finance, Travel, Study, Meal, Health, Reading)
- 🎯 Habits & SMART Goals
- 🖼️ Vision Board & Life Purpose
- 🧘 Wellness Center (Breathing, Meditation, Pomodoro, Soundscapes)
- 📊 Insights & Analytics
- 🏆 Achievements & Growth Tree
- ⚙️ Personalization & Settings

#### 2. Dashboard View (`src/views/DashboardView.jsx`)
- Greeting & Current Date/Time
- Calming simulated local weather widget (Sunny/Rainy based on local time/mood)
- Daily affirmation & quote cards (with categories, favorites, and random refresh button)
- Today's Priorities & Time-blocking schedule preview
- Mood selector (Happy, Calm, Stressed, etc.) with quick reflection
- Interactive water tracker (click cup to add 250ml) and progress circles
- Focus timer widget (interactive Pomodoro)
- Productivity Score and Wellness Score meters

#### 3. Planner View (`src/views/PlannerView.jsx`)
- Morning & Evening routine checklists
- Hourly time-blocking calendar
- Daily reflections and tomorrow's planning sections

#### 4. Journal System (`src/views/JournalView.jsx`)
- Tabs for **Daily**, **Gratitude**, **Feeling (Mood tracking & emotional insights)**, and **Mental Health** (anxiety/stress logs with empathetic advice)
- Rich text editors, category tags, search function, and history list
- Mood analytics tracker inside the feeling tab

#### 5. Planners View (`src/views/PlannersView.jsx`)
Multi-tab workspace covering all requested planning systems:
- **Health & Diet**: Weight log, exercises, medication alerts, water, diet goals (Keto, Mediterranean, etc.) with progress lines.
- **Meal Planner**: Weekly breakfast/lunch/dinner layout, recipe store, and dynamic shopping checklist.
- **Study & Work**: Assignments, deadlines, Pomodoro links, projects, and notes.
- **Finance**: Income/Expenses sheet, monthly budget progress bar, savings tracking, subscriptions.
- **Reading**: Bookshelf tracker, quotes log, reading progress slider.
- **Travel**: Trips itinerary planner, packing checklist, reservation organizer.

#### 6. Habit & Goal Manager (`src/views/HabitsGoalsView.jsx`)
- **Habit Tracker**: Unlimited habits, streaks count, weekly completion grid, and completion toggle.
- **SMART Goal Board**: Add goals with Title, Category, Deadline, Milestones checklist, Reward, Vision Image. Tracks progress percentage.

#### 7. Vision Board & Purpose (`src/views/VisionPurposeView.jsx`)
- **Vision Board**: Multiple boards (Career, Travel, Fitness, etc.). Ability to add image URLs, inspiration quotes, resize elements, select canvas backgrounds.
- **Life Purpose**: Rich editing panels for Mission Statement, Core Values, Legacy, Philosophy, and Ideal Future Self.

#### 8. Wellness & Audio Center (`src/views/WellnessView.jsx`)
- **Breathing Exercise Timer**: Visual pulsing circle guiding inhale (4s), hold (4s), exhale (4s) - Box breathing.
- **Meditation Timer**: Calming background timer with ambient bell sounds.
- **Pomodoro Timer**: Work/Break intervals.
- **Audio Soundscapes**: Sound panel playing looped ambient audio (Rain, Forest, Ocean Waves, White Noise) with volume slider.

#### 9. AI Coach Widget (`src/components/AICoach.jsx`)
Floating assistant widget:
- Empathetic AI chatbot interface.
- One-click triggers: "Summarize my Journals", "Suggest SMART Goals", "Plan My Day", "Check Mood Trends", "Generate Affirmation".
- Empathetic, encouraging positive responses constructed dynamically based on the user's active database contents (e.g., reads current mood, habits, and journals to personalize the advice).

#### 10. Analytics Dashboard (`src/views/AnalyticsView.jsx`)
- Visual graphs using `recharts` for: Mood trends, Habit completion rates, Water intake, Sleep cycles, and overall Wellness score.
- Dynamic streak counters and highlights.

#### 11. Gamification Panel (`src/views/GamificationView.jsx`)
- XP & Level meters. Completing items yields confetti and XP!
- **Growth Tree**: Animated SVG tree which starts as a small sapling and grows branches, leaves, and flowers as user level increases.
- Badges display: "Consistent Writer", "Hydration Hero", "Mindfulness Explorer", etc.

---

## Verification Plan

### Automated Tests
We will build a verification run to check:
1. Production bundler run: `npm run build` or `vite build`
2. Lint check or basic test compilation.

### Manual Verification
1. Launch development server: `cmd.exe /c "npm run dev"` or similar.
2. Verify all navigations and tabs in the workspace are functional.
3. Test theme switching (Light/Dark) to ensure consistent visibility.
4. Verify local-first storage: reloading the page keeps the journals, tasks, and habit streaks.
5. Export data to JSON/CSV and import backup.
6. Interact with the breathing timer and the interactive Growth Tree.
