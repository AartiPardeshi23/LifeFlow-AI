import React, { useState, useEffect, useRef } from 'react';
import MobileNavigation from './components/MobileNavigation';
import DashboardView from './views/DashboardView';
import PlannerView from './views/PlannerView';
import JournalView from './views/JournalView';
import PlannersView from './views/PlannersView';
import MoreMenuView from './views/MoreMenuView';
import HabitsGoalsView from './views/HabitsGoalsView';
import VisionPurposeView from './views/VisionPurposeView';
import WellnessView from './views/WellnessView';
import AnalyticsView from './views/AnalyticsView';
import GamificationView from './views/GamificationView';
import ProfileView from './views/ProfileView';
import AICoach from './components/AICoach';
import { db } from './utils/db';
import confetti from 'canvas-confetti';
import { Sparkles, ChevronLeft, Sun, Moon, Volume2, VolumeX, User, Heart } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [theme, setTheme] = useState(db.getData().settings.theme || 'dark');
  const [font, setFont] = useState(db.getData().settings.fontFamily || 'Outfit');
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevelNum, setNewLevelNum] = useState(1);
  const [userData, setUserData] = useState(db.getData().user);
  const [coachOpen, setCoachOpen] = useState(false);

  // Sound Engine States
  const [activeSound, setActiveSound] = useState('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const gainNodeRef = useRef(null);

  // Sync theme with HTML data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen to Database updates
  useEffect(() => {
    let lastLevel = db.getData().user.level;

    const handleDbUpdate = () => {
      const currentData = db.getData();
      setUserData({ ...currentData.user });
      setTheme(currentData.settings.theme || 'dark');
      setFont(currentData.settings.fontFamily || 'Outfit');

      const currentVolume = currentData.settings.soundVolume ?? 0.5;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = currentVolume;
      }

      if (currentData.user.level > lastLevel) {
        setNewLevelNum(currentData.user.level);
        setShowLevelUpModal(true);
        lastLevel = currentData.user.level;
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    };

    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  // Web Audio API Synthesis Engine
  useEffect(() => {
    if (!isPlaying || activeSound === 'none') {
      return;
    }

    let audioCtx = null;
    let noiseSource = null;
    let lfo = null;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        
        if (activeSound === 'forest' || activeSound === 'waves') {
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        } else {
          output[i] = white * 0.08;
        }
      }

      noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = audioCtx.createBiquadFilter();
      const waveGainNode = audioCtx.createGain();
      waveGainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);

      if (activeSound === 'forest') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      } else if (activeSound === 'waves') {
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(0.7, audioCtx.currentTime);
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.09; // 11-second natural wave cycle

        // Modulate filter frequency from 150Hz to 750Hz
        const lfoFilterGain = audioCtx.createGain();
        lfoFilterGain.gain.value = 300;
        lfo.connect(lfoFilterGain);
        lfoFilterGain.connect(filter.frequency);

        // Modulate volume between 0.05 and 0.95 to simulate rolling waves
        waveGainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        const lfoVolumeGain = audioCtx.createGain();
        lfoVolumeGain.gain.value = 0.45;
        lfo.connect(lfoVolumeGain);
        lfoVolumeGain.connect(waveGainNode.gain);

        lfo.start();
      } else if (activeSound === 'rain') {
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
        filter.Q.setValueAtTime(2.0, audioCtx.currentTime);
        lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.08;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 500;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      }

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(db.getData().settings.soundVolume ?? 0.5, audioCtx.currentTime);
      gainNodeRef.current = gainNode;

      noiseSource.connect(filter);
      filter.connect(waveGainNode);
      waveGainNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      noiseSource.start();

    } catch (e) {
      console.warn("Web Audio API not supported or user interaction blocked audio initialization.", e);
    }

    return () => {
      gainNodeRef.current = null;
      if (lfo) {
        try {
          lfo.stop();
        } catch (e) {}
      }
      if (noiseSource) {
        try {
          noiseSource.stop();
        } catch (e) {}
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch (e) {}
      }
    };
  }, [isPlaying, activeSound]);

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

  const isMoreSubView = ['vision-purpose', 'wellness', 'analytics', 'gamification', 'profile'].includes(activeView);

  return (
    <div 
      className="app-container" 
      style={{ 
        fontFamily: font === 'Merriweather' ? 'var(--font-serif)' : 'var(--font-sans)',
        transition: 'background 0.5s ease'
      }}
    >
      {/* 1. Sticky Top Bar */}
      <header className="mobile-top-bar">
        {isMoreSubView ? (
          <button 
            className="secondary" 
            onClick={() => {
              if (activeView === 'profile') {
                setActiveView('dashboard');
              } else {
                setActiveView('more');
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <ChevronLeft size={16} /> Back
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🍃</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>LifeFlow AI</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--panel-border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0
            }}
            title="Switch Theme"
          >
            {theme === 'dark' ? (
              <Sun size={18} style={{ color: '#facc15' }} />
            ) : theme === 'light' ? (
              <Moon size={18} style={{ color: '#a78bfa' }} />
            ) : (
              <Heart size={18} style={{ color: '#f472b6' }} />
            )}
          </button>

          {/* Profile & Settings Button */}
          <button 
            onClick={() => setActiveView('profile')}
            style={{
              background: activeView === 'profile' ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
              border: activeView === 'profile' ? 'none' : '1px solid var(--panel-border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeView === 'profile' ? 'white' : 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0
            }}
            title="User Profile & Settings"
          >
            <User size={18} />
          </button>

          {/* AI Coach */}
          <button 
            onClick={() => setCoachOpen(true)}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(167, 139, 250, 0.3)',
              transition: 'all 0.2s',
              padding: 0
            }}
            title="Chat with AI Coach"
          >
            <Sparkles size={18} />
          </button>
        </div>
      </header>

      {/* 2. Main Content Workspace */}
      <main className="main-content">
        {activeView === 'dashboard' && <DashboardView activeView={activeView} setActiveView={setActiveView} />}
        {activeView === 'planner' && <PlannerView />}
        {activeView === 'journals' && <JournalView />}
        {activeView === 'planners' && <PlannersView />}
        {activeView === 'more' && (
          <MoreMenuView 
            setActiveView={setActiveView} 
            onOpenCoach={() => setCoachOpen(true)}
            currentTheme={theme}
            toggleTheme={toggleTheme}
            activeSound={activeSound}
            setActiveSound={setActiveSound}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        )}
        
        {/* Subviews from More section */}
        {activeView === 'habits-goals' && <HabitsGoalsView />}
        {activeView === 'vision-purpose' && <VisionPurposeView />}
        {activeView === 'wellness' && <WellnessView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'gamification' && <GamificationView />}
        {activeView === 'profile' && (
          <ProfileView 
            currentTheme={theme} 
            toggleTheme={toggleTheme} 
            changeFont={changeFont} 
            currentFont={font} 
            activeSound={activeSound}
            setActiveSound={setActiveSound}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        )}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <MobileNavigation 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenCoach={() => setCoachOpen(true)} 
      />

      {/* 4. AI Coach Slide-up Drawer */}
      <div className={`mobile-coach-backdrop ${coachOpen ? 'open' : ''}`} onClick={() => setCoachOpen(false)} />
      <div className={`mobile-coach-drawer ${coachOpen ? 'open' : ''}`}>
        <div className="mobile-coach-drag-handle" onClick={() => setCoachOpen(false)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--panel-border)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-color)' }} /> AI Growth Coach
          </h3>
          <button 
            onClick={() => setCoachOpen(false)}
            style={{ background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Close
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <AICoach currentTheme={theme} />
        </div>
      </div>

      {/* 5. Global Congratulations Level Up Modal */}
      {showLevelUpModal && (
        <div className="modal-backdrop" style={{ display: 'flex', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ textAlign: 'center', maxWidth: '320px', padding: '24px' }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '10px' }}>👑</span>
            <h2 className="heading-gradient" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Level Up!</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Congratulations! You reached <strong>Level {newLevelNum}</strong> in your growth journey!
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Keep journaling, checking items, and staying consistent.
            </p>
            <button className="primary" onClick={() => setShowLevelUpModal(false)} style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
              Awesome, Let's Go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
