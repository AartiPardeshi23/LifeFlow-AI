import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  BookOpen, 
  FolderHeart, 
  Award, 
  Sparkles, 
  Compass, 
  BarChart3, 
  Trees, 
  Settings,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  UserCheck
} from 'lucide-react';
import { db } from '../utils/db';

export default function Sidebar({ activeView, setActiveView, currentTheme, toggleTheme }) {
  const [userData, setUserData] = useState(db.getData().user);
  const [activeSound, setActiveSound] = useState('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [logoShining, setLogoShining] = useState(false);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    const handleDbUpdate = () => {
      setUserData({ ...db.getData().user });
      const currentVolume = db.getData().settings.soundVolume ?? 0.5;
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = currentVolume;
      }
    };
    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  // Set up ambient sounds
  // Note: we can use royalty-free ambient audio URL streams or synthesized Web Audio API for offline support!
  // Synthetic Web Audio API or simple looping tone generators/noise generators are PERFECT for true offline PWA experience.
  // Let's implement a robust client-side Web Audio API white noise / brown noise / pink noise generator or play peaceful synthesized synth waves!
  // This is extremely premium and works 100% offline without needing heavy external audio files!
  useEffect(() => {
    if (!isPlaying || activeSound === 'none') {
      return;
    }

    let audioCtx = null;
    let noiseSource = null;
    let lfo = null;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Let's generate synthetic "Rain" (Pink Noise + Bandpass Filter)
      // or "Ocean Waves" (Filtered Pink Noise modulated by a slow LFO)
      // or "Forest wind" (Filtered White Noise modulated by random slow walk LFO)
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        
        if (activeSound === 'rain' || activeSound === 'waves') {
          // Pink noise filter approximation
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // rescue level
          b6 = white * 0.115926;
        } else {
          // White noise (pure forest rustle style/rain)
          output[i] = white * 0.08;
        }
      }

      noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Create filter
      const filter = audioCtx.createBiquadFilter();
      if (activeSound === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      } else if (activeSound === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, audioCtx.currentTime);
        // Modulate with LFO (low frequency oscillator) to create wave wash effect
        lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.15; // 0.15Hz (slow waves)
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 250;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      } else if (activeSound === 'forest') {
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
        filter.Q.setValueAtTime(2.0, audioCtx.currentTime);
        // Random wind swell
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
      filter.connect(gainNode);
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

  const handleSoundToggle = (soundType) => {
    if (activeSound === soundType) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSound(soundType);
      setIsPlaying(true);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Daily Planner', icon: CalendarRange },
    { id: 'journals', label: 'My Journals', icon: BookOpen },
    { id: 'planners', label: 'Life Planners', icon: FolderHeart },
    { id: 'habits-goals', label: 'Habits & Goals', icon: Award },
    { id: 'vision-purpose', label: 'Vision & Purpose', icon: Sparkles },
    { id: 'wellness', label: 'Wellness Center', icon: Compass },
    { id: 'analytics', label: 'Analytics Insights', icon: BarChart3 },
    { id: 'gamification', label: 'Growth Tree & XP', icon: Trees },
    { id: 'settings', label: 'Personalization', icon: Settings },
  ];

  const levelXP = userData.level * 200;
  const xpPercent = Math.min(100, Math.round((userData.xp / levelXP) * 100));

  return (
    <aside className="sidebar glass-panel" style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '0px',
      borderLeft: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      padding: '24px 16px',
      zIndex: 100,
    }}>
      {/* Brand logo */}
      <div>
        <div 
          onClick={() => {
            setLogoShining(true);
            confetti({ particleCount: 20, spread: 25, origin: { x: 0.08, y: 0.08 } });
            setTimeout(() => setLogoShining(false), 800);
          }}
          className={`logo-container ${logoShining ? 'shining' : ''}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '24px', 
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            padding: '6px',
            borderRadius: '12px'
          }}
        >
          <div 
            className="logo-icon"
            style={{ 
              background: 'var(--accent-gradient)', 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
          >
            🍃
          </div>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-color) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LifeFlow AI
            </span>
            <span style={{ 
              display: 'block', 
              fontSize: '0.7rem', 
              background: 'linear-gradient(135deg, #e5989b 0%, #6b8bb2 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase', 
              letterSpacing: '1.2px', 
              fontWeight: '800' 
            }}>
              Growth & Wellness
            </span>
          </div>
        </div>

        {/* User XP Panel with Gold Border */}
        <div style={{
          background: 'var(--profile-box-bg)',
          padding: '12px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05), inset 0 0 4px rgba(212, 175, 55, 0.05)'
        }}>
          <div className="flex-between" style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCheck size={14} className="badge-purple" style={{ borderRadius: '4px' }} />
              {userData.name}
            </span>
            <span className="badge badge-purple">Lvl {userData.level}</span>
          </div>
          <div style={{ background: 'var(--progressbar-track-bg)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${xpPercent}%`, height: '100%', background: 'var(--accent-gradient)', transition: 'width 0.4s ease' }}></div>
          </div>
          <div className="flex-between" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>
            <span>{userData.xp} / {levelXP} XP</span>
            <span>🔥 {userData.dailyStreak} Day Streak</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                  color: isActive ? 'var(--sidebar-active-text)' : 'var(--text-secondary)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="sidebar-link"
              >
                <Icon size={18} style={{ color: isActive ? 'var(--sidebar-active-text)' : 'var(--text-muted)' }} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Tools (Theme & Sounds) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--panel-border)', paddingTop: '16px' }}>
        
        {/* Soundscapes quick controls */}
        <div>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Ambient Sounds</span>
            {isPlaying && (
              <div className="audio-visualizer">
                <div className="audio-bar"></div>
                <div className="audio-bar"></div>
                <div className="audio-bar"></div>
                <div className="audio-bar"></div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['rain', 'waves', 'forest'].map((sound) => (
              <button
                key={sound}
                onClick={() => handleSoundToggle(sound)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  fontSize: '0.7rem',
                  borderRadius: '6px',
                  textTransform: 'capitalize',
                  background: activeSound === sound && isPlaying ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)',
                  color: activeSound === sound && isPlaying ? 'var(--accent-color)' : 'var(--text-secondary)',
                  border: activeSound === sound && isPlaying ? '1px solid var(--accent-color)' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {sound === 'waves' ? '🌊 ocean' : sound === 'rain' ? '🌧️ rain' : '🌲 wind'}
              </button>
            ))}
          </div>
        </div>

        {/* Theme and Volume bar */}
        <div className="flex-between">
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.1)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              border: 'none'
            }}
            title={`Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span 
              style={{ fontSize: '0.75rem', cursor: 'pointer' }} 
              onClick={() => {
                if (activeSound === 'none') {
                  setActiveSound('rain');
                }
                setIsPlaying(!isPlaying);
              }}
            >
              {isPlaying && activeSound !== 'none' ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={db.getData().settings.soundVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                db.updateData({ settings: { ...db.getData().settings, soundVolume: vol } });
              }}
              style={{ width: '60px', height: '4px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
