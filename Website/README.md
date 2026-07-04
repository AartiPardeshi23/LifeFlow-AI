# LifeFlow AI – Personal Growth, Planning & Mindfulness Companion

🍃 **LifeFlow AI** is a premium, all-in-one personal growth, planning, and mindfulness dashboard designed to bring structure, clarity, and peaceful productivity to your life. Combining the best elements of **Notion, Headspace, Calm, Todoist, and Day One**, LifeFlow AI is crafted to encourage *consistency over perfection* in a visually stunning, supportive, and non-pressuring environment.

---

## 🎯 Project Vision & Aim

Modern productivity tools often induce anxiety with negative punishment loops and pressure to perform. The aim of **LifeFlow AI** is to help you organize your life while simultaneously improving your mindset, emotional well-being, and long-term habits. 

### Core Philosophy:
* **Celebrate Small Progress**: Earn experience points (XP) and level up by taking small, healthy actions.
* **Empathetic & Non-Judgmental**: No streak-loss punishments. We meet you where you are.
* **Calm Aesthetic**: Soft pastel colors, rounded glassmorphic cards, smooth micro-interactions, and premium typography (*Outfit* & *Merriweather*).
* **Privacy-First & Offline**: Your data belongs entirely to you. Everything is processed locally in the browser.

---

## 🌟 Key Features

### 1. Unified Dashboard
* **Dynamic Welcome**: Greetings shift based on local time.
* **Mood Weather Widget**: Log how you feel and track energy changes.
* **Water Hydration Tracker**: Log cups of water (+250ml) with an interactive droplet meter.
* **Focus Pomodoro Timer**: Set 25-minute quiet sessions to build deep concentration.
* **Affirmations & Quotes Deck**: Favorite and cycle daily positive prompts by category (Self Love, Peace, Confidence).

### 2. Empathy-Driven Journaling System
* **Daily Journal**: Capture wins, obstacles, and lessons.
* **Gratitude Journal**: List three positive focus items and appreciate loved ones.
* **Feeling Journal**: Track specific emotions (Calm, Motivated, Stressed) and detail triggers.
* **Mental Health Tracker**: Track stress, anxiety, burnout, motivation, and sleep hours. Receive automatic, non-diagnostic empathetic self-care suggestions.

### 3. Integrated Life Planners Hub
* **Health & Diet**: Log weight history, set medicine checklists, and track doctor appointments.
* **Meal Planner**: Draft breakfast/lunch/dinner calendars, save ingredients, and check off shopping lists.
* **Finance**: Record income/expenses ledger, calculate budgets, and track monthly bills/subscriptions.
* **Reading Shelf**: Track book reading percentages, save favorite quotes, and log reviews.
* **Travel Planner**: Map packing lists, trip budgets, itineraries, and transport reservations.

### 4. Interactive Vision Board & Purpose
* **Drag-and-Drop Vision Board**: Upload image URLs and quote cards, drag them freely on custom gradient canvases, and design your dream life boards.
* **Life Purpose Log**: Edit your core values, mission statement, and personal Rules of Engagement.

### 5. Wellness Center
* **Box Breathing Visualizer**: Guided inhale (4s) ➔ Hold (4s) ➔ Exhale (4s) ➔ Hold (4s) circle.
* **Meditation Timer**: Guided meditation counter yielding level XP.
* **Letters to Self**: Write digital letters to your future/past self and seal them in your database.
* **Acts of Kindness Deck**: Click to generate small kindness prompts.

### 6. Interactive Gamification & SVG Growth Tree
* **XP & Level System**: Earn experience points by finishing tasks, meditating, or logging water.
* **The Growth Tree**: An interactive, dynamic SVG tree that grows new branches, green leaves, spring blossoms, and golden fruits as your level increases!
* **Community Gratitude Wall**: Anonymously post things you appreciate on a shared community board.

### 7. Empathetic AI Coach
* A floating assistant panel that provides one-click summaries of your journals, suggests SMART goals based on your interests, plans your day, and analyzes your mood trends.

---

## 🛠️ Technology Stack

* **Frontend**: React (component-based frontend)
* **Build System**: Vite (fast developer server and bundle compiles)
* **Data Graphing**: Recharts (smooth interactive charts for biometrics/moods)
* **Soundscapes**: Web Audio API (generates synthetic white noise, ocean waves, and rain sounds locally and 100% offline)
* **Storage**: Local-First (IndexedDB / LocalStorage with schema auto-migration)

---

## 🚀 How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Install Dependencies
Open your terminal (PowerShell or Command Prompt) in the project directory.

* If you are in a standard environment:
  ```bash
  npm install
  ```
* If script execution is disabled on your Windows PowerShell machine, run:
  ```powershell
  npm.cmd install
  ```
  *(Or use Command Prompt: `cmd.exe /c "npm install"`)*

### Step 2: Start Development Server
Launch the local dev build:

* Standard terminal:
  ```bash
  npm run dev
  ```
* PowerShell (with disabled scripts):
  ```powershell
  npm.cmd run dev
  ```

### Step 3: Open Browser
Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 💾 Backups & Exports

* **JSON Database Export**: Go to settings to download a full `.json` backup file of all your data.
* **Restore**: Upload your backup `.json` file to restore your settings and journals on another device.
* **CSV Export**: Export all journaling history into spreadsheets (`.csv`) for personal analysis.
* **PDF Exporter**: Click "Open Print Portal" in settings or press `Ctrl + P` to save clean, print-friendly reports.
