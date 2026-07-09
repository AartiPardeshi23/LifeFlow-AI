import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  Circle, 
  Award, 
  Flame, 
  Percent, 
  Sparkles, 
  Layout, 
  TrendingUp 
} from 'lucide-react';
import { db, getTodayDateString } from '../utils/db';
import confetti from 'canvas-confetti';

export default function HabitsGoalsView() {
  const [habits, setHabits] = useState(db.getHabits());
  const [goals, setGoals] = useState(db.getGoals());
  const [activeSubTab, setActiveSubTab] = useState('habits'); // 'habits', 'goals'
  const todayStr = getTodayDateString();
  const activeGoals = goals.filter(g => g.progress < 100);
  const completedGoals = goals.filter(g => g.progress === 100);

  // --- Habit Form States ---
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Mindfulness');

  // --- Goal Form States ---
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Personal Growth');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalMotivation, setNewGoalMotivation] = useState('');
  const [newGoalReward, setNewGoalReward] = useState('');
  const [newGoalImage, setNewGoalImage] = useState('');
  const [newGoalMilestonesText, setNewGoalMilestonesText] = useState('');

  const refreshList = () => {
    setHabits([...db.getHabits()]);
    setGoals([...db.getGoals()]);
  };

  // --- Habits Actions ---
  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    db.addHabit({
      title: newHabitTitle,
      category: newHabitCategory
    });
    setNewHabitTitle('');
    refreshList();
  };

  const handleToggleHabit = (id, dateStr) => {
    db.toggleHabit(id, dateStr);
    refreshList();
    confetti({ particleCount: 20, spread: 40 });
  };

  const handleDeleteHabit = (id) => {
    if (confirm('Delete this habit tracker?')) {
      db.deleteHabit(id);
      refreshList();
    }
  };

  // Generate last 5 days array for the grid
  const getLastFiveDays = () => {
    const arr = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const name = d.toLocaleDateString(undefined, { weekday: 'narrow' });
      arr.push({ dateStr: str, label: name });
    }
    return arr;
  };
  const lastFiveDays = getLastFiveDays();

  // --- Goals Actions ---
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalDeadline) {
      alert('Please enter Goal Title and Deadline.');
      return;
    }

    const milestoneList = newGoalMilestonesText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((text, idx) => ({
        id: `m_${Date.now()}_${idx}`,
        text: text.trim(),
        completed: false
      }));

    db.addGoal({
      title: newGoalTitle,
      category: newGoalCategory,
      deadline: newGoalDeadline,
      motivation: newGoalMotivation,
      reward: newGoalReward,
      visionImage: newGoalImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      milestones: milestoneList,
      progress: 0
    });

    // Clear form
    setNewGoalTitle('');
    setNewGoalDeadline('');
    setNewGoalMotivation('');
    setNewGoalReward('');
    setNewGoalImage('');
    setNewGoalMilestonesText('');
    
    refreshList();
    confetti({ particleCount: 80, spread: 60 });
    alert('SMART Goal successfully created! 🎯');
  };

  const handleToggleMilestone = (goalId, milestoneId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    db.updateGoal(goalId, { milestones: updatedMilestones });
    refreshList();
    // Confetti on milestone complete
    const updatedGoal = db.getGoals().find(g => g.id === goalId);
    if (updatedGoal.progress === 100) {
      confetti({ particleCount: 100, spread: 80 });
      alert(`🎉 Congratulations! You have fully completed the goal: "${goal.title}"! Reward: ${goal.reward}`);
    } else {
      confetti({ particleCount: 20 });
    }
  };

  const handleDeleteGoal = (id) => {
    if (confirm('Are you sure you want to delete this SMART goal?')) {
      db.deleteGoal(id);
      refreshList();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎯 Habits & SMART Goals
        </h1>
        <p style={{ marginTop: '4px' }}>Establish small daily systems (habits) while pursuing large milestone targets (SMART goals).</p>
      </div>

      {/* Selector Tabs */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeSubTab === 'habits' ? 'active' : ''}`} onClick={() => setActiveSubTab('habits')}>
          🔄 Habit Tracking & Streaks
        </button>
        <button className={`tab-btn ${activeSubTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveSubTab('goals')}>
          🏆 SMART Goal Boards
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        
        {/* SUBTAB 1: Habits */}
        {activeSubTab === 'habits' && (
          <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
            
            {/* Create Habit panel (Left 1 col) */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3>Add New Habit</h3>
              <form onSubmit={handleAddHabit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Habit Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Read 15 pages, 10k steps" 
                    value={newHabitTitle}
                    onChange={(e) => setNewHabitTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                  <select value={newHabitCategory} onChange={(e) => setNewHabitCategory(e.target.value)}>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Health">Health</option>
                    <option value="Growth">Growth</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>
                <button type="submit" className="primary" style={{ justifyContent: 'center' }}><Plus size={16} /> Create Habit</button>
              </form>

              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontWeight: '600', display: 'block', marginBottom: '4px' }}>🔥 Consistency over Perfection:</span>
                Habits accumulate into identities. Check them daily to gain +20 XP.
              </div>
            </div>

            {/* Habits list & Grid (Right 2 cols) */}
            <div style={{ gridColumn: 'span 2' }} className="glass-panel">
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3>Daily Consistency Grid</h3>
                <span className="badge badge-purple">Last 5 Days Status</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {habits.map((habit) => (
                  <div key={habit.id} style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--panel-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {/* Header: Title + Category + Delete button */}
                    <div className="flex-between">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{habit.category}</span>
                          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{habit.title}</h4>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                          Active streak: <strong style={{ color: 'var(--color-orange)' }}>🔥 {habit.streak} Days</strong>
                        </span>
                      </div>
                      <button className="secondary" onClick={() => handleDeleteHabit(habit.id)} style={{ padding: '6px', background: 'transparent', border: 'none' }}>
                        <Trash2 size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>

                    {/* Last 5 days checklist bubbles */}
                    <div style={{ display: 'flex', gap: '6px', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                      {lastFiveDays.map((day) => {
                        const checked = habit.history[day.dateStr];
                        const isToday = day.dateStr === todayStr;
                        return (
                          <div 
                            key={day.dateStr}
                            onClick={() => handleToggleHabit(habit.id, day.dateStr)}
                            style={{
                              flex: 1,
                              height: '34px',
                              borderRadius: '17px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              background: checked 
                                ? 'var(--color-green)' 
                                : isToday 
                                  ? 'rgba(167, 139, 250, 0.15)' 
                                  : 'rgba(255,255,255,0.05)',
                              color: checked ? '#141517' : 'var(--text-secondary)',
                              border: isToday ? '1px solid var(--accent-color)' : '1px solid var(--panel-border)',
                              transition: 'all 0.2s'
                            }}
                            title={`${day.dateStr}: ${checked ? 'Completed' : 'Pending'}`}
                          >
                            {day.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 2: SMART Goals */}
        {activeSubTab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
              
              {/* Create Goal Form (Left 1 col) */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Add SMART Goal</h3>
                <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Goal Title</label>
                    <input type="text" placeholder="e.g. Build LifeFlow App" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} required />
                  </div>
                  
                  <div className="grid-cols-2" style={{ gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category</label>
                      <select value={newGoalCategory} onChange={(e) => setNewGoalCategory(e.target.value)}>
                        <option value="Personal Growth">Growth</option>
                        <option value="Health">Health</option>
                        <option value="Career">Career</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Deadline</label>
                      <input type="date" value={newGoalDeadline} onChange={(e) => setNewGoalDeadline(e.target.value)} required />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Motivation (Why does this matter?)</label>
                    <input type="text" placeholder="To improve my development skills" value={newGoalMotivation} onChange={(e) => setNewGoalMotivation(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reward (After Completion)</label>
                    <input type="text" placeholder="Buy myself a new keyboard" value={newGoalReward} onChange={(e) => setNewGoalReward(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vision Image URL (Optional)</label>
                    <input type="url" placeholder="https://images.unsplash.com/..." value={newGoalImage} onChange={(e) => setNewGoalImage(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Milestones (One per line)</label>
                    <textarea 
                      placeholder="Milestone 1&#10;Milestone 2&#10;Milestone 3"
                      value={newGoalMilestonesText}
                      onChange={(e) => setNewGoalMilestonesText(e.target.value)}
                      style={{ height: '80px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <button type="submit" className="primary" style={{ justifyContent: 'center' }}><Plus size={16} /> Save SMART Goal</button>
                </form>
              </div>

              {/* Goals Grid Board (Right 2 cols) */}
              <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-cols-2" style={{ gap: '20px' }}>
                  {activeGoals.length === 0 ? (
                    <div className="glass-panel" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', background: 'rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</span>
                      <h4 style={{ color: 'var(--text-primary)' }}>No Active Goals</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Establish a new SMART goal on the left to start tracking your milestones!
                      </p>
                    </div>
                  ) : (
                    activeGoals.map((goal) => (
                      <div key={goal.id} className="glass-panel" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        overflow: 'hidden',
                        padding: '0px'
                      }}>
                        {/* Vision Board Image header */}
                        <div style={{ height: '120px', width: '100%', position: 'relative' }}>
                          <img 
                            src={goal.visionImage} 
                            alt={goal.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)'
                          }}></div>
                          <span className="badge badge-purple" style={{ position: 'absolute', top: '10px', left: '10px' }}>{goal.category}</span>
                          <button 
                            onClick={() => handleDeleteGoal(goal.id)}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              background: 'rgba(0,0,0,0.4)',
                              padding: '6px',
                              borderRadius: '8px',
                              color: 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{goal.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🎯 Target date: {goal.deadline}</span>
                          
                          <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                            <strong>Why:</strong> "{goal.motivation}"
                          </p>

                          {/* Progress bar */}
                          <div style={{ margin: '4px 0' }}>
                            <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                              <span>Completion Progress:</span>
                              <strong>{goal.progress}%</strong>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${goal.progress}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                            </div>
                          </div>

                          {/* Milestones list */}
                          <div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Milestones:</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                              {goal.milestones.map((m) => (
                                <div 
                                  key={m.id}
                                  onClick={() => handleToggleMilestone(goal.id, m.id)}
                                  style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px', 
                                    fontSize: '0.75rem', 
                                    cursor: 'pointer',
                                    background: m.completed ? 'rgba(0,0,0,0.1)' : 'transparent',
                                    padding: '4px',
                                    borderRadius: '4px'
                                  }}
                                >
                                  {m.completed ? <CheckSquare size={14} style={{ color: 'var(--accent-color)' }} /> : <Circle size={14} style={{ color: 'var(--text-muted)' }} />}
                                  <span style={{ textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                    {m.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {goal.reward && (
                            <div style={{
                              background: 'rgba(52, 211, 153, 0.1)',
                              border: '1px solid rgba(52, 211, 153, 0.2)',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              marginTop: '6px',
                              textAlign: 'center',
                              color: 'var(--color-green)'
                            }}>
                              🏆 Reward: {goal.reward}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Goal Tracker History (Bottom full width) */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.03) 0%, var(--panel-bg) 100%)' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                  📜 Goal Tracker History
                </h3>
                <span className="badge badge-green">{completedGoals.length} Completed</span>
              </div>

              {completedGoals.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                  No completed goals in your history yet. Stay focused and cross those milestones! 🏆
                </div>
              ) : (
                <div className="grid-cols-2" style={{ gap: '20px' }}>
                  {completedGoals.map((goal) => (
                    <div key={goal.id} className="glass-panel" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      overflow: 'hidden',
                      padding: '0px',
                      background: 'rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.15)'
                    }}>
                      {/* Vision Board Image header */}
                      <div style={{ height: '100px', width: '100%', position: 'relative' }}>
                        <img 
                          src={goal.visionImage} 
                          alt={goal.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(70%) opacity(80%)' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.85) 100%)'
                        }}></div>
                        <span className="badge badge-purple" style={{ position: 'absolute', top: '10px', left: '10px', opacity: 0.8 }}>{goal.category}</span>
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          display: 'flex',
                          gap: '6px',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            background: 'rgba(52, 211, 153, 0.9)',
                            color: '#141517',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Sparkles size={10} /> Completed
                          </span>
                          <button 
                            onClick={() => handleDeleteGoal(goal.id)}
                            style={{
                              background: 'rgba(0,0,0,0.5)',
                              padding: '5px',
                              borderRadius: '6px',
                              color: 'var(--text-primary)',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '12px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>{goal.title}</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Target date: {goal.deadline}</span>
                          {goal.completedAt && (
                            <span style={{ color: 'var(--color-green)', fontWeight: '500' }}>
                              Achieved on: {goal.completedAt}
                            </span>
                          )}
                        </div>

                        {goal.reward && (
                          <div style={{
                            background: 'rgba(52, 211, 153, 0.08)',
                            border: '1px solid rgba(52, 211, 153, 0.15)',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            color: 'var(--color-green)',
                            fontWeight: '600'
                          }}>
                            🏆 Reward Unlocked: {goal.reward}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
