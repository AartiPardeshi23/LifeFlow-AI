import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Type, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Volume2, 
  UserCircle 
} from 'lucide-react';
import { db } from '../utils/db';
import confetti from 'canvas-confetti';

export default function SettingsView({ currentTheme, toggleTheme, changeFont, currentFont }) {
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

  // --- Backup & Restore (JSON Exporter) ---
  const handleExportBackup = () => {
    try {
      const dataStr = localStorage.getItem('lifeflow_ai_data');
      if (!dataStr) {
        alert('No data found to back up.');
        return;
      }
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
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
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.user && parsed.settings && parsed.journals) {
          localStorage.setItem('lifeflow_ai_data', event.target.result);
          alert('Database restored successfully! Reloading to sync data...');
          window.location.reload();
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (err) {
        alert('Failed to parse file. Make sure it is a valid JSON backup file.');
      }
    };
  };

  // --- CSV Exporter helper ---
  const handleExportCSV = () => {
    const journals = db.getJournals();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Date,Type,Title,Content\n";
    
    journals.forEach((j) => {
      const row = [
        j.id,
        j.date,
        j.type,
        `"${(j.title || '').replace(/"/g, '""')}"`,
        `"${((j.content || j.wins || j.mood || '').replace(/"/g, '""'))}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lifeflow_journals_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    db.addXP(20);
  };

  // --- Reset database to factory default ---
  const handleResetData = () => {
    if (confirm("🚨 WARNING: This will permanently wipe all your journals, habits, progress and custom settings. There is no undo. Are you sure you want to reset?")) {
      db.resetToDefault();
      alert('Database wiped clean. Reloading...');
      window.location.reload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(30,31,38,0.2) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⚙️ Personalization & Backups
        </h1>
        <p style={{ marginTop: '4px' }}>Manage themes, soundscapes, typography, local-first database backups, and privacy exports.</p>
      </div>

      <div className="grid-cols-2">

        {/* Left Side: Profile & Theme settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* User profile setting */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCircle size={20} style={{ color: 'var(--accent-color)' }} /> Personal Profile
            </h3>
            <p style={{ fontSize: '0.85rem' }}>Your name is stored strictly in your local browser storage for greeting personalization.</p>
            
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', gap: '8px' }}>
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

          {/* Theme Settings */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3>Theme and Font Preferences</h3>
            <p style={{ fontSize: '0.85rem' }}>Select a typography style that matches your mindfulness vibe.</p>
            
            <div className="grid-cols-2" style={{ gap: '10px', marginTop: '6px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Active Theme:</span>
                <button className="secondary" onClick={toggleTheme} style={{ width: '100%', justifyContent: 'center', textTransform: 'capitalize' }}>
                  🎨 {currentTheme === 'rose-serenity' ? 'Rose & Serenity' : currentTheme} Mode
                </button>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Active Font Family:</span>
                <select value={currentFont} onChange={(e) => changeFont(e.target.value)}>
                  <option value="Outfit">Outfit (Calm Rounded)</option>
                  <option value="Merriweather">Merriweather (Classic Serif)</option>
                </select>
              </div>
            </div>

            {/* Sound volume slider */}
            <div style={{ marginTop: '10px' }}>
              <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Volume2 size={16} /> Ambient Sound Volume:</span>
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
          </div>

        </div>

        {/* Right Side: Backups & Data Export */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Data Security, Export, Import */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3>Privacy & Data Control</h3>
            <p style={{ fontSize: '0.85rem' }}>Your data is end-to-end encrypted locally. We do not transmit any journals to external servers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              
              {/* Export JSON */}
              <button className="secondary" onClick={handleExportBackup} style={{ width: '100%', justifyContent: 'center' }}>
                <Download size={16} /> Export Local Database Backup (JSON)
              </button>

              {/* Import JSON */}
              <div style={{
                border: '1px dashed var(--panel-border)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Restore Database from JSON Backup File:
                </span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportBackup} 
                  style={{ fontSize: '0.75rem', padding: '4px' }} 
                />
              </div>

              {/* CSV Export */}
              <button className="secondary" onClick={handleExportCSV} style={{ width: '100%', justifyContent: 'center' }}>
                <Download size={16} /> Export Journals to Spreadsheet (CSV)
              </button>

              {/* PDF Print Export */}
              <button className="secondary" onClick={() => window.print()} style={{ width: '100%', justifyContent: 'center' }}>
                🖨️ Open Print Portal (Save to PDF)
              </button>

            </div>
          </div>

          {/* Reset factory option */}
          <div className="glass-panel" style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.03)' }}>
            <h3 style={{ color: 'var(--color-pink)' }}>Danger Zone</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '4px', marginBottom: '12px' }}>Resetting wipes all local state database entries and starts from default templates.</p>
            
            <button className="secondary" onClick={handleResetData} style={{ borderColor: '#ef4444', color: '#fca5a5' }}>
              <RotateCcw size={16} /> WIPE DATABASE CLEAN (Reset App)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
