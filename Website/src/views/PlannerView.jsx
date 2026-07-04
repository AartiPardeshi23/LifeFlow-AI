import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save, 
  CheckSquare, 
  Sparkles, 
  BookOpen,
  Calendar
} from 'lucide-react';
import { db, getTodayDateString } from '../utils/db';
import confetti from 'canvas-confetti';

export default function PlannerView() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [planner, setPlanner] = useState(db.getPlannerForDate(selectedDate));
  const dateInputRef = useRef(null);
  
  // Input fields
  const [newMorningTask, setNewMorningTask] = useState('');
  const [newEveningTask, setNewEveningTask] = useState('');
  const [newTimeblockTime, setNewTimeblockTime] = useState('09:00');
  const [newTimeblockText, setNewTimeblockText] = useState('');

  // Priority local state (Top 3)
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');

  useEffect(() => {
    const data = db.getPlannerForDate(selectedDate);
    setPlanner(data);
    setP1(data.priorities[0]?.text || '');
    setP2(data.priorities[1]?.text || '');
    setP3(data.priorities[2]?.text || '');
  }, [selectedDate]);

  const savePlanner = (updatedFields) => {
    const updated = { ...planner, ...updatedFields };
    setPlanner(updated);
    db.savePlannerForDate(selectedDate, updated);
  };

  const handleDateChange = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Morning routine helpers
  const addMorning = () => {
    if (!newMorningTask.trim()) return;
    const morning = [...planner.morningRoutine, { text: newMorningTask, completed: false }];
    savePlanner({ morningRoutine: morning });
    setNewMorningTask('');
  };

  const toggleMorning = (idx) => {
    const morning = [...planner.morningRoutine];
    morning[idx].completed = !morning[idx].completed;
    savePlanner({ morningRoutine: morning });
    if (morning[idx].completed) {
      db.addXP(10);
      confetti({ particleCount: 15, spread: 30 });
    }
  };

  const removeMorning = (idx) => {
    const morning = planner.morningRoutine.filter((_, i) => i !== idx);
    savePlanner({ morningRoutine: morning });
  };

  // Evening routine helpers
  const addEvening = () => {
    if (!newEveningTask.trim()) return;
    const evening = [...planner.eveningRoutine, { text: newEveningTask, completed: false }];
    savePlanner({ eveningRoutine: evening });
    setNewEveningTask('');
  };

  const toggleEvening = (idx) => {
    const evening = [...planner.eveningRoutine];
    evening[idx].completed = !evening[idx].completed;
    savePlanner({ eveningRoutine: evening });
    if (evening[idx].completed) {
      db.addXP(10);
      confetti({ particleCount: 15, spread: 30 });
    }
  };

  const removeEvening = (idx) => {
    const evening = planner.eveningRoutine.filter((_, i) => i !== idx);
    savePlanner({ eveningRoutine: evening });
  };

  // Priorities save
  const handleSavePriorities = () => {
    const priorities = [
      { text: p1 || 'Priority 1', completed: planner.priorities[0]?.completed || false },
      { text: p2 || 'Priority 2', completed: planner.priorities[1]?.completed || false },
      { text: p3 || 'Priority 3', completed: planner.priorities[2]?.completed || false }
    ];
    savePlanner({ priorities });
    db.addXP(15);
    alert('Top 3 Priorities saved for today! 🎯');
  };

  // Timeblocking helpers
  const addTimeblock = () => {
    if (!newTimeblockText.trim()) return;
    const timeblocks = [...planner.timeblocks, { time: newTimeblockTime, text: newTimeblockText }];
    // Sort timeblocks by time chronologically
    timeblocks.sort((a, b) => a.time.localeCompare(b.time));
    savePlanner({ timeblocks });
    setNewTimeblockText('');
  };

  const removeTimeblock = (idx) => {
    const timeblocks = planner.timeblocks.filter((_, i) => i !== idx);
    savePlanner({ timeblocks });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Date Navigation Header */}
      <div className="glass-panel flex-between" style={{ padding: '16px 24px' }}>
        <button className="secondary" onClick={() => handleDateChange(-1)}>
          <ChevronLeft size={16} /> Yesterday
        </button>
        <div 
          className="date-picker-trigger"
          onClick={() => {
            if (dateInputRef.current) {
              try {
                dateInputRef.current.showPicker();
              } catch (e) {
                // Fallback for older browsers
                dateInputRef.current.focus();
                dateInputRef.current.click();
              }
            }
          }}
          style={{ 
            textAlign: 'center', 
            position: 'relative', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar 
              size={18} 
              className="today-jump-icon" 
              style={{ color: 'var(--accent-color)', cursor: 'pointer' }}
              title="Jump to Today"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(getTodayDateString());
              }}
            />
            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedDate} • click to jump to any date</span>
          <input 
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
              }
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: -1
            }}
          />
        </div>
        <button className="secondary" onClick={() => handleDateChange(1)}>
          Tomorrow <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid-cols-2">
        {/* Left Side: Routines & Priorities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top 3 Priorities */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎯 Today's Top 3 Focus Priorities
            </h3>
            <p style={{ fontSize: '0.85rem' }}>Setting clear priorities is key to an intentional day. Syncs with dashboard checklist.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Core Priority 1 (e.g. Code database modules)" 
                value={p1} 
                onChange={(e) => setP1(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Core Priority 2 (e.g. Run 5K)" 
                value={p2} 
                onChange={(e) => setP2(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Core Priority 3 (e.g. Call family)" 
                value={p3} 
                onChange={(e) => setP3(e.target.value)} 
              />
            </div>
            <button className="primary" onClick={handleSavePriorities} style={{ justifyContent: 'center' }}>
              <Save size={16} /> Save Priorities
            </button>
          </div>

          {/* Morning Routine Checklist */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ color: 'var(--color-orange)' }}>🌅 Morning Routine</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Add morning habit (e.g. Cold shower, meditate)" 
                value={newMorningTask}
                onChange={(e) => setNewMorningTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMorning()}
              />
              <button className="primary" onClick={addMorning} style={{ padding: '10px' }}><Plus size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {planner.morningRoutine.map((item, idx) => (
                <div key={idx} className="flex-between" style={{
                  padding: '8px 12px',
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => toggleMorning(idx)}>
                    <input type="checkbox" checked={item.completed} onChange={() => {}} style={{ width: '16px', height: '16px' }} />
                    <span style={{ 
                      fontSize: '0.85rem', 
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>{item.text}</span>
                  </div>
                  <button className="secondary" onClick={() => removeMorning(idx)} style={{ padding: '4px', background: 'transparent' }}>
                    <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine Checklist */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ color: 'var(--color-purple)' }}>🌃 Evening Routine</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Add evening routine (e.g. Read 10 pages, reflect)" 
                value={newEveningTask}
                onChange={(e) => setNewEveningTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEvening()}
              />
              <button className="primary" onClick={addEvening} style={{ padding: '10px' }}><Plus size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {planner.eveningRoutine.map((item, idx) => (
                <div key={idx} className="flex-between" style={{
                  padding: '8px 12px',
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => toggleEvening(idx)}>
                    <input type="checkbox" checked={item.completed} onChange={() => {}} style={{ width: '16px', height: '16px' }} />
                    <span style={{ 
                      fontSize: '0.85rem', 
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>{item.text}</span>
                  </div>
                  <button className="secondary" onClick={() => removeEvening(idx)} style={{ padding: '4px', background: 'transparent' }}>
                    <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Hourly Timeblocking & Notes/Reflections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Time Blocking / Hourly Planner */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ color: 'var(--color-blue)' }}>📅 Hourly Time Blocking</h3>
            <p style={{ fontSize: '0.85rem' }}>Map tasks to specific hourly slots for high productivity.</p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="time" 
                value={newTimeblockTime} 
                onChange={(e) => setNewTimeblockTime(e.target.value)} 
                style={{ width: '100px' }}
              />
              <input 
                type="text" 
                placeholder="Focus activity description" 
                value={newTimeblockText}
                onChange={(e) => setNewTimeblockText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTimeblock()}
              />
              <button className="primary" onClick={addTimeblock} style={{ padding: '10px' }}><Plus size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {planner.timeblocks.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', margin: '15px 0' }}>
                  No timeblocks booked yet. Lock in your hours!
                </p>
              ) : (
                planner.timeblocks.map((tb, idx) => (
                  <div key={idx} className="flex-between" style={{
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="badge badge-purple" style={{ fontFamily: 'monospace' }}>{tb.time}</span>
                      <span style={{ fontSize: '0.85rem' }}>{tb.text}</span>
                    </div>
                    <button className="secondary" onClick={() => removeTimeblock(idx)} style={{ padding: '4px', background: 'transparent' }}>
                      <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reflections, Notes & Tomorrow planning */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ color: 'var(--color-pink)' }}>📝 Notes, reflections & looking ahead</h3>
            
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Today's Reflections & Learnings</span>
              <textarea 
                placeholder="What went well today? What can be improved?" 
                value={planner.reflection || ''}
                onChange={(e) => savePlanner({ reflection: e.target.value })}
                style={{ fontSize: '0.85rem', height: '60px', resize: 'none' }}
              />
            </div>

            <div style={{ marginTop: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Planning for Tomorrow</span>
              <textarea 
                placeholder="Identify the key goals and setup for tomorrow." 
                value={planner.tomorrowPlan || ''}
                onChange={(e) => savePlanner({ tomorrowPlan: e.target.value })}
                style={{ fontSize: '0.85rem', height: '60px', resize: 'none' }}
              />
            </div>

            <div style={{ marginTop: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>General Planner Notes</span>
              <textarea 
                placeholder="Miscellaneous notes and thoughts..." 
                value={planner.notes || ''}
                onChange={(e) => savePlanner({ notes: e.target.value })}
                style={{ fontSize: '0.85rem', height: '60px', resize: 'none' }}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
