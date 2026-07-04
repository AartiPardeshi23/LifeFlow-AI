import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Wind, 
  Smile, 
  MailOpen, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw 
} from 'lucide-react';
import { db } from '../utils/db';
import confetti from 'canvas-confetti';

const KINDNESS_IDEAS = [
  "Send a message to a colleague thanking them for a specific piece of support.",
  "Leave a kind, anonymous positive note in a public book or workspace.",
  "Write an explicit list of three things you appreciate about a close friend, and send it to them.",
  "Pay for the coffee of the person behind you in line.",
  "Check in on an elderly neighbor or friend you haven't spoken to in a while.",
  "Plant a seed or water a drying public plant.",
  "Forgive someone for a minor grievance and move forward peacefully."
];

export default function WellnessView() {
  const [activeWellnessTab, setActiveWellnessTab] = useState('breathing'); // 'breathing', 'meditation', 'selfcare', 'letters'
  
  // --- 1. Breathing Exercise states ---
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathState, setBreathState] = useState('Idle'); // 'Inhale', 'Hold', 'Exhale', 'Hold Empty'
  const [breathCountdown, setBreathCountdown] = useState(4);
  const breathInterval = useRef(null);

  // --- 2. Meditation Timer states ---
  const [medTimeSelected, setMedTimeSelected] = useState(5); // 5, 10, 15, 20 mins
  const [medSecondsLeft, setMedSecondsLeft] = useState(300);
  const [medActive, setMedActive] = useState(false);
  const medInterval = useRef(null);

  // --- 3. Self-care Checklist states ---
  const [selfCareList, setSelfCareList] = useState([
    { text: 'Drink a glass of warm water in the morning', completed: true },
    { text: 'Take a 10-minute quiet stretch', completed: false },
    { text: 'Sit in stillness without look at phone for 15 mins', completed: false },
    { text: 'Eat a nutritious, unprocessed lunch', completed: true }
  ]);
  const [newSelfCareItem, setNewSelfCareItem] = useState('');

  // --- 4. Letters to Self states ---
  const [letters, setLetters] = useState([
    { id: 'l1', target: 'Future Self', date: '2026-07-04', unlockDate: '2027-01-01', content: 'Dear Future Self, I hope you are building beautiful code and maintaining your morning stretching. Remember why you started LifeFlow.' }
  ]);
  const [newLetterTarget, setNewLetterTarget] = useState('Future Self');
  const [newLetterUnlock, setNewLetterUnlock] = useState('');
  const [newLetterContent, setNewLetterContent] = useState('');

  // Kindness State
  const [currentKindness, setCurrentKindness] = useState(KINDNESS_IDEAS[0]);

  // Breathing Box Timer
  useEffect(() => {
    if (breathingActive) {
      breathInterval.current = setInterval(() => {
        setBreathCountdown(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Cycle breathing state (Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s)
            setBreathState(curr => {
              if (curr === 'Idle' || curr === 'Hold Empty') {
                return 'Inhale';
              } else if (curr === 'Inhale') {
                return 'Hold';
              } else if (curr === 'Hold') {
                return 'Exhale';
              } else {
                return 'Hold Empty';
              }
            });
            return 4; // Reset to 4s
          }
        });
      }, 1000);
    } else {
      clearInterval(breathInterval.current);
      setBreathState('Idle');
      setBreathCountdown(4);
    }
    return () => clearInterval(breathInterval.current);
  }, [breathingActive]);

  // Meditation Countdown
  useEffect(() => {
    if (medActive) {
      medInterval.current = setInterval(() => {
        setMedSecondsLeft(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            setMedActive(false);
            clearInterval(medInterval.current);
            db.addXP(100);
            confetti({ particleCount: 150, spread: 80 });
            alert(`🧘 Namaste. Your ${medTimeSelected}-minute Meditation is complete. +100 XP gained!`);
            return medTimeSelected * 60;
          }
        });
      }, 1000);
    } else {
      clearInterval(medInterval.current);
    }
    return () => clearInterval(medInterval.current);
  }, [medActive, medTimeSelected]);

  // Sync initial countdown with time selected
  const handleMedTimeChange = (mins) => {
    setMedTimeSelected(mins);
    setMedSecondsLeft(mins * 60);
    setMedActive(false);
  };

  // Kindness roll
  const rollKindness = () => {
    const idx = Math.floor(Math.random() * KINDNESS_IDEAS.length);
    setCurrentKindness(KINDNESS_IDEAS[idx]);
    confetti({ particleCount: 15, colors: ['#fbcfe8'] });
  };

  // Self care actions
  const addSelfCare = () => {
    if (!newSelfCareItem) return;
    setSelfCareList([...selfCareList, { text: newSelfCareItem, completed: false }]);
    setNewSelfCareItem('');
  };

  const toggleSelfCare = (idx) => {
    const list = [...selfCareList];
    list[idx].completed = !list[idx].completed;
    setSelfCareList(list);
    if (list[idx].completed) {
      db.addXP(10);
      confetti({ particleCount: 10 });
    }
  };

  const removeSelfCare = (idx) => {
    setSelfCareList(selfCareList.filter((_, i) => i !== idx));
  };

  // Letters actions
  const handleSaveLetter = (e) => {
    e.preventDefault();
    if (!newLetterContent || !newLetterUnlock) return;
    const newL = {
      id: 'l_' + Date.now(),
      target: newLetterTarget,
      date: new Date().toISOString().split('T')[0],
      unlockDate: newLetterUnlock,
      content: newLetterContent
    };
    setLetters([...letters, newL]);
    setNewLetterUnlock('');
    setNewLetterContent('');
    db.addXP(50);
    confetti({ particleCount: 60 });
    alert('Letter successfully sealed in your Digital Vault! ✉️');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🧘 Wellness Center
        </h1>
        <p style={{ marginTop: '4px' }}>Nurture your mindset with box breathing, self-guided meditation, acts of kindness, and digital time capsules.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeWellnessTab === 'breathing' ? 'active' : ''}`} onClick={() => setActiveWellnessTab('breathing')}>
          🌬️ Box Breathing Guide
        </button>
        <button className={`tab-btn ${activeWellnessTab === 'meditation' ? 'active' : ''}`} onClick={() => setActiveWellnessTab('meditation')}>
          🧘 Meditation Timer
        </button>
        <button className={`tab-btn ${activeWellnessTab === 'selfcare' ? 'active' : ''}`} onClick={() => setActiveWellnessTab('selfcare')}>
          🌸 Self-Care Rituals
        </button>
        <button className={`tab-btn ${activeWellnessTab === 'letters' ? 'active' : ''}`} onClick={() => setActiveWellnessTab('letters')}>
          ✉️ Letters to Self
        </button>
      </div>

      {/* Active Work panel */}
      <div className="grid-cols-3" style={{ gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Main interactive card (Left 2 cols) */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB 1: Box Breathing */}
          {activeWellnessTab === 'breathing' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <div>
                <h3>Box Breathing Exercise</h3>
                <p style={{ fontSize: '0.85rem' }}>Used by athletes and practitioners to instantly clear cortisol and focus the mind.</p>
              </div>

              {/* Breathing Box Visualizer */}
              <div className="breathing-box-container">
                <div className={`breathing-circle ${
                  breathState === 'Inhale' ? 'inhale' : 
                  breathState === 'Hold' ? 'hold' : 
                  breathState === 'Exhale' ? 'exhale' : ''
                }`}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {breathState === 'Idle' ? 'Ready?' : breathState}
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '4px' }}>
                      {breathCountdown}s
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button 
                  className={breathingActive ? 'secondary' : 'primary'} 
                  onClick={() => setBreathingActive(!breathingActive)}
                  style={{ width: '160px', justifyContent: 'center' }}
                >
                  {breathingActive ? 'Pause Guide' : 'Start Box Breathing'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>💨 1. Inhale 4s</span>
                <span>🛑 2. Hold 4s</span>
                <span>🌬️ 3. Exhale 4s</span>
                <span>🛑 4. Hold Empty 4s</span>
              </div>
            </div>
          )}

          {/* TAB 2: Meditation Timer */}
          {activeWellnessTab === 'meditation' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
              <div>
                <h3>Self-Guided Meditation Timer</h3>
                <p style={{ fontSize: '0.85rem' }}>Select a duration, sit comfortably, close your eyes, and focus on the breath. (+100 XP)</p>
              </div>

              {/* Time Selector pills */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[3, 5, 10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleMedTimeChange(mins)}
                    className={medTimeSelected === mins ? 'primary' : 'secondary'}
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    ⏱️ {mins} Min
                  </button>
                ))}
              </div>

              <div style={{ margin: '14px 0' }}>
                <span style={{ fontSize: '3.6rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-color)' }}>
                  {String(Math.floor(medSecondsLeft / 60)).padStart(2, '0')}:
                  {String(medSecondsLeft % 60).padStart(2, '0')}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  className={medActive ? 'secondary' : 'primary'} 
                  onClick={() => setMedActive(!medActive)}
                  style={{ width: '130px', justifyContent: 'center' }}
                >
                  {medActive ? <Pause size={16} /> : <Play size={16} />}
                  {medActive ? 'Pause' : 'Begin Session'}
                </button>
                <button 
                  className="secondary" 
                  onClick={() => {
                    setMedActive(false);
                    setMedSecondsLeft(medTimeSelected * 60);
                  }}
                  style={{ width: '40px', padding: '0', justifyContent: 'center' }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Self-care checklist */}
          {activeWellnessTab === 'selfcare' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3>Self-Care Daily Checklists</h3>
              <p style={{ fontSize: '0.85rem' }}>Nurture your body and mind with small habits that prevent burnout.</p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Read physical book, walk in nature" 
                  value={newSelfCareItem}
                  onChange={(e) => setNewSelfCareItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSelfCare()}
                />
                <button className="primary" onClick={addSelfCare}><Plus size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {selfCareList.map((item, idx) => (
                  <div key={idx} className="flex-between" style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => toggleSelfCare(idx)}>
                      {item.completed ? <CheckCircle size={16} style={{ color: 'var(--color-green)' }} /> : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {item.text}
                      </span>
                    </div>
                    <button className="secondary" onClick={() => removeSelfCare(idx)} style={{ padding: '4px', background: 'transparent' }}>
                      <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Letters to Self */}
          {activeWellnessTab === 'letters' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Form to seal letter */}
              <form onSubmit={handleSaveLetter} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Write Letter to Future / Past Self</h3>
                <p style={{ fontSize: '0.85rem' }}>Write thoughts, achievements, fears, or encouragements. Sealed digital vault.</p>
                
                <div className="grid-cols-2" style={{ gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deliver to:</label>
                    <select value={newLetterTarget} onChange={(e) => setNewLetterTarget(e.target.value)}>
                      <option value="Future Self">✉️ Future Self</option>
                      <option value="Past Self Reflection">📝 Past Self (Reflection)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Unlock Date:</label>
                    <input type="date" value={newLetterUnlock} onChange={(e) => setNewLetterUnlock(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Letter Body</label>
                  <textarea 
                    placeholder="Write your letter here... it will remain sealed in your database."
                    value={newLetterContent}
                    onChange={(e) => setNewLetterContent(e.target.value)}
                    style={{ minHeight: '130px', fontFamily: 'var(--font-serif)', lineHeight: '1.6' }}
                    required
                  />
                </div>

                <button type="submit" className="primary" style={{ justifyContent: 'center' }}><MailOpen size={16} /> Seal & Save Letter (+50 XP)</button>
              </form>

              {/* Sealed list */}
              <div className="glass-panel">
                <h3>Sealed Letters Vault</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  {letters.map((l) => (
                    <div key={l.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                      <div className="flex-between">
                        <span className="badge badge-purple">{l.target}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created: {l.date} | Unlocks: {l.unlockDate}</span>
                      </div>
                      <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "{l.content}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Acts of Kindness (Right 1 col) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.05) 0%, var(--panel-bg) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smile size={18} style={{ color: 'var(--color-pink)' }} /> Acts of Kindness
            </h3>
            <p style={{ fontSize: '0.85rem' }}>Empathy is the core of mindfulness. Perform a small act of kindness today.</p>
            
            <div style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              background: 'rgba(0,0,0,0.1)', 
              border: '1px solid var(--panel-border)',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}>
              "{currentKindness}"
            </div>

            <button className="secondary" onClick={rollKindness} style={{ width: '100%', justifyContent: 'center' }}>
              <Sparkles size={14} /> New Kindness Idea
            </button>
          </div>

          <div className="glass-panel">
            <h3>Mindfulness Mantra</h3>
            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '6px' }}>
              "Feelings are just visitors, let them come and go." — Mooji
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
