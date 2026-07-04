import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import PlannerView from './views/PlannerView';
import JournalView from './views/JournalView';
import PlannersView from './views/PlannersView';
import HabitsGoalsView from './views/HabitsGoalsView';
import VisionPurposeView from './views/VisionPurposeView';
import WellnessView from './views/WellnessView';
import AnalyticsView from './views/AnalyticsView';
import GamificationView from './views/GamificationView';
import SettingsView from './views/SettingsView';
import AICoach from './components/AICoach';
import { db } from './utils/db';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState(db.getData().settings.theme || 'dark');
  const [font, setFont] = useState(db.getData().settings.fontFamily || 'Outfit');
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevelNum, setNewLevelNum] = useState(1);

  // Sync theme with HTML data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen to Database XP levels updates to trigger global congratulations modal!
  useEffect(() => {
    let lastLevel = db.getData().user.level;

    const handleLevelUpCheck = () => {
      const currentLevel = db.getData().user.level;
      if (currentLevel > lastLevel) {
        // Leveled up! Trigger modal
        setNewLevelNum(currentLevel);
        setShowLevelUpModal(true);
        lastLevel = currentLevel;
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 }
        });
      }
    };

    window.addEventListener('lifeflow_db_update', handleLevelUpCheck);
    return () => window.removeEventListener('lifeflow_db_update', handleLevelUpCheck);
  }, []);

  const toggleTheme = () => {
    let nextTheme = 'dark';
    if (theme === 'dark') nextTheme = 'light';
    else if (theme === 'light') nextTheme = 'rose-serenity';
    else nextTheme = 'dark';
    setTheme(nextTheme);
    db.updateData({ settings: { ...db.getData().settings, theme: nextTheme } });
  };

  const changeFont = (newFont) => {
    setFont(newFont);
    db.updateData({ settings: { ...db.getData().settings, fontFamily: newFont } });
  };

  return (
    <div 
      className="app-container" 
      style={{ 
        fontFamily: font === 'Merriweather' ? 'var(--font-serif)' : 'var(--font-sans)',
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        transition: 'background 0.5s ease'
      }}
    >
      {/* 1. Sidebar Navigation */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        currentTheme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* 2. Main Workspace Dashboard */}
      <main className="main-content">
        {activeView === 'dashboard' && <DashboardView activeView={activeView} setActiveView={setActiveView} />}
        {activeView === 'planner' && <PlannerView />}
        {activeView === 'journals' && <JournalView />}
        {activeView === 'planners' && <PlannersView />}
        {activeView === 'habits-goals' && <HabitsGoalsView />}
        {activeView === 'vision-purpose' && <VisionPurposeView />}
        {activeView === 'wellness' && <WellnessView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'gamification' && <GamificationView />}
        {activeView === 'settings' && (
          <SettingsView 
            currentTheme={theme} 
            toggleTheme={toggleTheme} 
            changeFont={changeFont} 
            currentFont={font} 
          />
        )}
      </main>

      {/* 3. Floating AI Coach Widget */}
      <AICoach currentTheme={theme} />

      {/* 4. Level-up Overlay Modal */}
      {showLevelUpModal && (
        <div className="level-up-modal">
          <div className="level-up-content">
            <span style={{ fontSize: '4rem', display: 'block', animation: 'bounce 1s infinite' }}>🌳</span>
            <h2 style={{ color: 'var(--accent-color)', marginTop: '10px' }}>Level Up Complete!</h2>
            <p style={{ margin: '12px 0', fontSize: '0.95rem' }}>
              Congratulations! Your focus and consistency has elevated you to <strong>Level {newLevelNum}</strong>.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your Growth Tree has sprouted new leaves and branches! Keep up the daily check-ins.
            </p>
            <button className="primary" onClick={() => setShowLevelUpModal(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Continue Growing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
