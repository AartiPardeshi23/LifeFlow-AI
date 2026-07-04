import React from 'react';
import { 
  Target, 
  Compass, 
  Trees, 
  BarChart3, 
  Award, 
  Settings,
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react';
import { db } from '../utils/db';

export default function MoreMenuView({ 
  setActiveView, 
  onOpenCoach, 
  currentTheme, 
  toggleTheme,
  activeSound,
  setActiveSound,
  isPlaying,
  setIsPlaying
}) {
  const menuItems = [
    { id: 'vision-purpose', label: 'Vision Board', desc: 'Vision & purpose boards', icon: Compass, color: 'var(--color-blue)' },
    { id: 'wellness', label: 'Wellness Space', desc: 'Breathing & soundscapes', icon: Trees, color: 'var(--color-green)' },
    { id: 'analytics', label: 'Analytics', desc: 'Weekly progress insights', icon: BarChart3, color: 'var(--color-purple)' },
    { id: 'gamification', label: 'Achievements', desc: 'Level up your life system', icon: Award, color: 'var(--color-yellow)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>More Features</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Explore other life organization & mindfulness tools</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="glass-panel"
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                alignItems: 'flex-start',
                textAlign: 'left'
              }}
            >
              <div style={{
                background: 'rgba(0,0,0,0.1)',
                padding: '8px',
                borderRadius: '10px',
                color: item.color,
                display: 'flex'
              }}>
                <Icon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.label}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.2' }}>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick AI Coach Banner */}
      <div 
        className="glass-panel"
        onClick={onOpenCoach}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px',
          cursor: 'pointer',
          marginTop: '10px',
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, var(--panel-bg) 100%)',
          border: '1px solid rgba(167, 139, 250, 0.3)'
        }}
      >
        <div style={{
          background: 'var(--accent-gradient)',
          padding: '10px',
          borderRadius: '12px',
          color: 'white',
          display: 'flex'
        }}>
          <Sparkles size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Talk to AI Life Coach</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Get mindful guidance and break down milestones</p>
        </div>
      </div>
    </div>
  );
}
