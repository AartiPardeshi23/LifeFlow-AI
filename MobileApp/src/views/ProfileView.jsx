import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  Download, 
  RotateCcw, 
  Sparkles,
  Flame,
  Award,
  Volume2,
  VolumeX
} from 'lucide-react';
import { db } from '../utils/db';
import confetti from 'canvas-confetti';

export default function ProfileView({ 
  currentTheme, 
  toggleTheme, 
  changeFont, 
  currentFont,
  activeSound,
  setActiveSound,
  isPlaying,
  setIsPlaying
}) {
  const [dbData, setDbData] = useState(db.getData());
  const [userName, setUserName] = useState(dbData.user.name);
  const [soundVol, setSoundVol] = useState(dbData.settings.soundVolume);

  useEffect(() => {
    const handleDbUpdate = () => {
      const data = db.getData();
      setDbData({ ...data });
      setUserName(data.user.name);
      setSoundVol(data.settings.soundVolume);
    };
    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    db.updateData({
      user: {
        ...dbData.user,
        name: userName
      }
    });
    confetti({ particleCount: 30 });
    alert('Profile name updated! 😊');
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setSoundVol(vol);
    db.updateData({
      settings: {
        ...dbData.settings,
        soundVolume: vol
      }
    });
  };

  const handleExportBackup = () => {
    try {
      const dataStr = localStorage.getItem('lifeflow_ai_data');
      if (!dataStr) {
        alert('No data found to back up.');
        return;
      }
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = 'lifeflow_ai_backup_' + new Date().toISOString().split('T')[0] + '.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      db.addXP(20);
    } catch (e) {
      alert('Failed to generate export file.');
    }
  };

  const handleImportBackup = (e) => {
    const fileReader = new FileReader();
    if (!e.target.files[0]) return;
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.user && parsed.settings && parsed.journals) {
          localStorage.setItem('lifeflow_ai_data', event.target.result);
          alert('Database restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (err) {
        alert('Failed to parse file.');
      }
    };
  };

  const handleExportCSV = () => {
    const journals = db.getJournals();
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Date,Type,Title,Content\n';
    journals.forEach((j) => {
      const row = [
        j.id,
        j.date,
        j.type,
        `"${(j.title || '').replace(/"/g, '""')}"`,
        `"${((j.content || j.wins || j.mood || '').replace(/"/g, '""'))}"`
      ].join(',');
      csvContent += row + '\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lifeflow_journals_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    db.addXP(20);
  };

  const handleResetData = () => {
    if (confirm('🚨 WARNING: This will permanently wipe all your journals, habits, progress and settings. Are you sure you want to reset?')) {
      db.resetToDefault();
      alert('Database wiped clean. Reloading...');
      window.location.reload();
    }
  };

  const level = dbData.user.level;
  const xp = dbData.user.xp;
  const nextLevelXp = level * 200;
  const xpPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Profile Card */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, var(--panel-bg) 100%)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)'
        }}>
          {dbData.user.name ? dbData.user.name[0].toUpperCase() : 'U'}
        </div>
        
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{dbData.user.name || 'User Profile'}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mindful Member since June 2026</span>
        </div>

        {/* Level and Streak Badges */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
          <div style={{ 
            flex: 1, 
            background: 'rgba(0,0,0,0.15)', 
            padding: '10px', 
            borderRadius: '12px', 
            border: '1px solid var(--panel-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Award size={18} style={{ color: 'var(--accent-color)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Status</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Level {level}</strong>
          </div>

          <div style={{ 
            flex: 1, 
            background: 'rgba(0,0,0,0.15)', 
            padding: '10px', 
            borderRadius: '12px', 
            border: '1px solid var(--panel-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Flame size={18} style={{ color: 'var(--color-orange)' }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Streak</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-orange)' }}>🔥 {dbData.user.dailyStreak} Days</strong>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ width: '100%', marginTop: '4px' }}>
          <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
            <span>Level {level} Progress</span>
            <strong>{xp} / {nextLevelXp} XP</strong>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${xpPercent}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '6px' }}>
          Edit Profile Name
        </h3>
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <input 
            type="text" 
            placeholder="Edit Display Name" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <button type="submit" className="primary"><Save size={16} /> Save</button>
        </form>
      </div>

      {/* Theme and Preferences */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '6px' }}>
          App Customization
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Active Theme:</span>
            <button className="secondary" onClick={toggleTheme} style={{ width: '100%', justifyContent: 'center', textTransform: 'capitalize' }}>
              🎨 {currentTheme === 'rose-serenity' ? 'Rose & Serenity' : currentTheme} Mode
            </button>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>App Font:</span>
            <select value={currentFont} onChange={(e) => changeFont(e.target.value)}>
              <option value="Outfit">Outfit (Calm Rounded)</option>
              <option value="Merriweather">Merriweather (Classic Serif)</option>
            </select>
          </div>

          <div>
            <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
              <span>Ambient Sound Volume:</span>
              <strong>{Math.round(soundVol * 100)}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={soundVol} 
              onChange={handleVolumeChange}
              style={{ height: '6px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <div className="flex-between" style={{ marginBottom: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ambient Soundscape:</span>
              <button 
                onClick={() => {
                  if (activeSound === 'none') {
                    setActiveSound('rain');
                  }
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  background: isPlaying ? 'rgba(96, 165, 250, 0.15)' : 'rgba(0,0,0,0.1)',
                  border: isPlaying ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid var(--panel-border)',
                  borderRadius: '6px',
                  padding: '0 8px',
                  height: '24px',
                  fontSize: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: isPlaying ? 'var(--accent-color)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {isPlaying ? <Volume2 size={12} style={{ color: 'var(--accent-color)' }} /> : <VolumeX size={12} />}
                <span>{isPlaying ? 'On' : 'Off'}</span>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['rain', 'waves', 'forest'].map((sound) => {
                const isActive = activeSound === sound && isPlaying;
                return (
                  <button
                    key={sound}
                    onClick={() => {
                      if (activeSound === sound) {
                        setIsPlaying(!isPlaying);
                      } else {
                        setActiveSound(sound);
                        setIsPlaying(true);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                      background: isActive ? 'rgba(167, 139, 250, 0.2)' : 'rgba(0,0,0,0.1)',
                      color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                      border: isActive ? '1px solid var(--accent-color)' : '1px solid var(--panel-border)',
                      cursor: 'pointer',
                      fontWeight: isActive ? '600' : '400',
                      transition: 'all 0.2s',
                      justifyContent: 'center'
                    }}
                  >
                    {sound === 'waves' ? '🌊 Ocean' : sound === 'rain' ? '🌧️ Rain' : '🌲 Wind'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Data Backups & Exports */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '6px' }}>
          Local Database & Privacy
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>All data is stored directly in your browser. We never track or sell your logs.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
          <button className="secondary" onClick={handleExportBackup} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
            <Download size={14} /> Export Backup (JSON)
          </button>

          <button className="secondary" onClick={handleExportCSV} style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
            <Download size={14} /> Export Journals (CSV)
          </button>

          <div style={{
            border: '1px dashed var(--panel-border)',
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Restore from Backup file:
            </span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportBackup} 
              style={{ fontSize: '0.75rem', padding: '4px', width: '100%' }} 
            />
          </div>

          <button className="secondary" onClick={handleResetData} style={{ 
            width: '100%', 
            justifyContent: 'center', 
            background: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.15)',
            fontSize: '0.8rem'
          }}>
            <RotateCcw size={14} style={{ color: '#ef4444' }} /> Wipe Local Database
          </button>
        </div>
      </div>

    </div>
  );
}
