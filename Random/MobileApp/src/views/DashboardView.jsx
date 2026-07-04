import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudSun, 
  Sparkles, 
  Quote, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  Droplet, 
  PlusCircle, 
  Smile, 
  Activity, 
  Heart,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { db, getTodayDateString } from '../utils/db';
import confetti from 'canvas-confetti';

const AFFIRMATION_POOL = {
  SelfLove: ["I am enough just as I am.", "I honor my need to rest and recharge.", "I speak to myself with kindness and compassion."],
  Confidence: ["I trust my inner wisdom and ability.", "I believe in my dreams and my capability to realize them.", "I walk tall and speak my truth."],
  Peace: ["My mind is quiet, my breath is deep, and my heart is open.", "I release what I cannot control and embrace peace.", "I am grounded in the present moment."],
  Productivity: ["I focus on progress, not perfection.", "Every small step brings me closer to my goals.", "I have the focus and energy to achieve my tasks today."],
};

const QUOTE_POOL = {
  Motivation: ["You do not rise to the level of your goals. You fall to the level of your systems. — James Clear", "The secret of getting ahead is getting started. — Mark Twain"],
  Discipline: ["Discipline is choosing between what you want now and what you want most. — Abraham Lincoln", "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle"],
  Mindfulness: ["Be here now. — Ram Dass", "Quiet the mind and the soul will speak. — Ma Jaya Sati Bhagavati"],
  Growth: ["Out of difficulties grow miracles. — Jean de la Bruyère", "The only limit to our realization of tomorrow is our doubts of today. — Franklin D. Roosevelt"]
};

export default function DashboardView({ activeView, setActiveView }) {
  const [dbData, setDbData] = useState(db.getData());
  const [time, setTime] = useState(new Date());
  
  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerInterval = useRef(null);

  // Quote & Affirmation States
  const [affirmationCategory, setAffirmationCategory] = useState('SelfLove');
  const [currentAffirmation, setCurrentAffirmation] = useState(AFFIRMATION_POOL.SelfLove[0]);
  const [quoteCategory, setQuoteCategory] = useState('Mindfulness');
  const [currentQuote, setCurrentQuote] = useState(QUOTE_POOL.Mindfulness[0]);

  // Mood inputs
  const [selectedMood, setSelectedMood] = useState('');
  const [moodReason, setMoodReason] = useState('');

  // Daily Planner Date
  const todayStr = getTodayDateString();
  const planner = db.getPlannerForDate(todayStr);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync with DB changes
  useEffect(() => {
    const handleDbUpdate = () => {
      setDbData({ ...db.getData() });
    };
    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (timerActive) {
      timerInterval.current = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Focus timer complete!
          setTimerActive(false);
          clearInterval(timerInterval.current);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          const res = db.addXP(60);
          alert(`Great job! You completed a 25-minute Focus Session. +60 XP earned!`);
          db.save();
        }
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
    }
    return () => clearInterval(timerInterval.current);
  }, [timerActive, timerMinutes, timerSeconds]);

  // Water click handler
  const handleAddWater = () => {
    db.addWaterCup(todayStr);
    confetti({ particleCount: 30, spread: 50, colors: ['#60a5fa', '#93c5fd'] });
  };

  // Toggle habit check on dashboard
  const handleToggleHabit = (id) => {
    db.toggleHabit(id, todayStr);
  };

  // Toggle Planner Priorities
  const handleTogglePriority = (index) => {
    const updatedPriorities = [...planner.priorities];
    updatedPriorities[index].completed = !updatedPriorities[index].completed;
    db.savePlannerForDate(todayStr, { priorities: updatedPriorities });
    if (updatedPriorities[index].completed) {
      db.addXP(10);
      confetti({ particleCount: 20, spread: 40 });
    }
  };

  // Mood submit handler
  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) return;
    db.addJournal({
      type: 'feeling',
      title: `Feeling ${selectedMood}`,
      mood: selectedMood,
      why: moodReason || 'Just taking an intentional check-in.',
      whatHappened: 'Self reflection on the main dashboard widget.',
      whatHelps: 'Keep breathing deeply and focus on the priority tasks.'
    });
    setMoodReason('');
    confetti({ particleCount: 50, spread: 60, colors: ['#a78bfa', '#34d399'] });
    alert(`Your mood "${selectedMood}" has been logged into your Feeling Journal. +40 XP earned!`);
  };

  const getGreeting = () => {
    const hrs = time.getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Simple dynamic calculation for scores
  const getWellnessScore = () => {
    // Water (max 8) + Completed Habits percentage + logged mood
    const water = dbData.healthPlanner.waterIntake[todayStr] || 0;
    const waterPart = Math.min(100, (water / 8) * 100);
    
    const totalHabits = dbData.habits.length;
    const completedHabits = dbData.habits.filter(h => h.history[todayStr]).length;
    const habitPart = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 80;

    const moodLogged = dbData.journals.some(j => j.date === todayStr && j.type === 'feeling');
    const moodPart = moodLogged ? 100 : 40;

    return Math.round((waterPart + habitPart + moodPart) / 3);
  };

  const getProductivityScore = () => {
    // priorities completed + goal progresses
    const prioritiesTotal = planner.priorities.length;
    const prioritiesComp = planner.priorities.filter(p => p.completed).length;
    const priorityPart = prioritiesTotal > 0 ? (prioritiesComp / prioritiesTotal) * 100 : 70;

    const activeGoals = dbData.goals.length;
    const averageGoalProgress = activeGoals > 0 
      ? dbData.goals.reduce((acc, curr) => acc + curr.progress, 0) / activeGoals 
      : 50;

    return Math.round((priorityPart + averageGoalProgress) / 2);
  };

  const cycleAffirmation = () => {
    const list = AFFIRMATION_POOL[affirmationCategory];
    const index = Math.floor(Math.random() * list.length);
    setCurrentAffirmation(list[index]);
  };

  const cycleQuote = () => {
    const list = QUOTE_POOL[quoteCategory];
    const index = Math.floor(Math.random() * list.length);
    setCurrentQuote(list[index]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Card */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, var(--panel-bg) 100%)'
      }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>🍃 Mindful Space</span>
          <h1>{getGreeting()}, {dbData.user.name}</h1>
          <p style={{ marginTop: '4px' }}>Take a slow breath. Today is about consistency, not perfection.</p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '12px 18px', background: 'rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Time</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className="glass-panel" style={{ padding: '12px 18px', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CloudSun size={32} style={{ color: 'var(--color-orange)' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Today\'s Mood Weather</span>
              <span style={{ fontWeight: '600' }}>Calm Sunshine, 72°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout of widgets */}
      <div className="grid-cols-3">

        {/* 1. Score Metrics Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3>Life Balance Score</h3>
          <p style={{ fontSize: '0.85rem' }}>Dynamic calculation based on water, habit completion, and planning.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <div>
              <div className="flex-between" style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={14} style={{ color: 'var(--color-pink)' }} /> Wellness Index
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-pink)' }}>{getWellnessScore()}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getWellnessScore()}%`, height: '100%', background: 'linear-gradient(90deg, #f472b6 0%, #ec4899 100%)' }}></div>
              </div>
            </div>

            <div>
              <div className="flex-between" style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} style={{ color: 'var(--color-green)' }} /> Focus & Productivity
                </span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-green)' }}>{getProductivityScore()}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getProductivityScore()}%`, height: '100%', background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)' }}></div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.1)',
            padding: '12px',
            borderRadius: '12px',
            marginTop: '10px',
            fontSize: '0.85rem',
            border: '1px solid var(--panel-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} style={{ color: 'var(--accent-color)' }} />
            <span>Tip: Logging mood trends boosts wellness score by 20 points!</span>
          </div>
        </div>

        {/* 2. Today's Habits Tracker */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <h3>Habit Streaks</h3>
            <button className="secondary" onClick={() => setActiveView('habits-goals')} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Manage</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '180px', paddingRight: '4px' }}>
            {dbData.habits.map((h) => {
              const completed = h.history[todayStr];
              return (
                <div 
                  key={h.id} 
                  onClick={() => handleToggleHabit(h.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderRadius: '10px',
                    background: completed ? 'rgba(52, 211, 153, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${completed ? 'rgba(52, 211, 153, 0.2)' : 'var(--panel-border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: completed ? 'var(--color-green)' : 'var(--text-primary)', textDecoration: completed ? 'line-through' : 'none' }}>
                    {h.title}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🔥 {h.streak}d</span>
                    {completed ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--color-green)' }} />
                    ) : (
                      <Circle size={18} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Water Intake Widget */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div className="flex-between">
              <h3>Water Hydration</h3>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-blue)' }}>
                {(dbData.healthPlanner.waterIntake[todayStr] || 0) * 250} ml
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Daily Target: 2000 ml (8 cups)</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '10px 0' }}>
            {Array.from({ length: 8 }).map((_, index) => {
              const currentCups = dbData.healthPlanner.waterIntake[todayStr] || 0;
              const active = index < currentCups;
              return (
                <Droplet
                  key={index}
                  size={24}
                  style={{
                    color: active ? 'var(--color-blue)' : 'var(--text-muted)',
                    fill: active ? 'var(--color-blue)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={handleAddWater}
                />
              );
            })}
          </div>

          <button className="primary" onClick={handleAddWater} style={{ width: '100%', justifyContent: 'center' }}>
            <Droplet size={16} /> Drink Cup (+250ml)
          </button>
        </div>

      </div>

      {/* Row 2: Mood Checker, Priorities, Focus Timer */}
      <div className="grid-cols-3">

        {/* 4. Daily Mood Tracker Widget */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3>Mood Check-in</h3>
          <p style={{ fontSize: '0.85rem' }}>How are you feeling right now? Your logs sync with your journals.</p>
          
          <form onSubmit={handleMoodSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '4px 0' }}>
              {['Calm', 'Motivated', 'Happy', 'Relaxed', 'Stressed', 'Sad'].map((m) => (
                <span
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`mood-tag ${selectedMood === m ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  {m === 'Calm' ? '🧘 ' : m === 'Motivated' ? '⚡ ' : m === 'Happy' ? '☀️ ' : m === 'Relaxed' ? '🌾 ' : m === 'Stressed' ? '🔥 ' : '🌧️ '}
                  {m}
                </span>
              ))}
            </div>

            <textarea
              placeholder="What is influencing your energy state? (Optional)"
              value={moodReason}
              onChange={(e) => setMoodReason(e.target.value)}
              style={{ fontSize: '0.8rem', resize: 'none', height: '60px' }}
            />

            <button type="submit" className="primary" style={{ justifyContent: 'center', padding: '8px 12px', fontSize: '0.85rem' }} disabled={!selectedMood}>
              Save Mood Entry
            </button>
          </form>
        </div>

        {/* 5. Today's Top Priorities */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <h3>Today\'s Priorities</h3>
            <button className="secondary" onClick={() => setActiveView('planner')} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Planner</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '180px' }}>
            {planner.priorities.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                No priorities logged in your Daily Planner for today.
              </p>
            ) : (
              planner.priorities.map((p, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleTogglePriority(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '8px',
                    background: p.completed ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.completed ? (
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-color)' }} />
                  ) : (
                    <Circle size={16} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span style={{ fontSize: '0.85rem', textDecoration: p.completed ? 'line-through' : 'none', color: p.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {p.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Focus Pomodoro Timer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', textAlign: 'center' }}>
          <div>
            <h3>Focus Timer</h3>
            <p style={{ fontSize: '0.85rem' }}>Pomodoro sessions build long-term discipline. (+60 XP)</p>
          </div>

          <div style={{ margin: '10px 0' }}>
            <span style={{ fontSize: '2.8rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--accent-color)', letterSpacing: '2px' }}>
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              className={timerActive ? 'secondary' : 'primary'} 
              onClick={() => setTimerActive(!timerActive)}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {timerActive ? <Pause size={16} /> : <Play size={16} />}
              {timerActive ? 'Pause' : 'Start'}
            </button>
            <button 
              className="secondary" 
              onClick={() => {
                setTimerActive(false);
                setTimerMinutes(25);
                setTimerSeconds(0);
              }}
              style={{ width: '40px', justifyContent: 'center', padding: '0' }}
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Affirmations and Quotes */}
      <div className="grid-cols-2">
        
        {/* 7. Affirmations Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={18} style={{ color: 'var(--accent-color)' }} /> Daily Affirmation</h3>
            <select 
              value={affirmationCategory} 
              onChange={(e) => {
                setAffirmationCategory(e.target.value);
                setCurrentAffirmation(AFFIRMATION_POOL[e.target.value][0]);
              }}
              style={{ width: '130px', padding: '4px 8px', fontSize: '0.75rem' }}
            >
              <option value="SelfLove">❤️ Self Love</option>
              <option value="Confidence">⚡ Confidence</option>
              <option value="Peace">🕊️ Peace</option>
              <option value="Productivity">🎯 Focus</option>
            </select>
          </div>

          <div style={{ 
            padding: '20px', 
            borderRadius: '12px', 
            background: 'rgba(0,0,0,0.1)', 
            border: '1px solid var(--panel-border)',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '1rem',
            fontStyle: 'italic',
            lineHeight: '1.5'
          }}>
            "{currentAffirmation}"
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary" onClick={cycleAffirmation} style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}>
              Another Affirmation
            </button>
            <button 
              className="secondary" 
              onClick={() => {
                const favs = [...dbData.affirmations.favorites];
                if (!favs.includes(currentAffirmation)) {
                  favs.push(currentAffirmation);
                  db.updateData({ affirmations: { ...dbData.affirmations, favorites: favs } });
                  alert('Added to your Affirmation Favorites! ❤️');
                }
              }}
              style={{ padding: '8px', width: '40px', justifyContent: 'center' }}
              title="Add to Favorites"
            >
              ❤️
            </button>
          </div>
        </div>

        {/* 8. Quotes Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Quote size={18} style={{ color: 'var(--color-green)' }} /> Inspirational Quote</h3>
            <select 
              value={quoteCategory} 
              onChange={(e) => {
                setQuoteCategory(e.target.value);
                setCurrentQuote(QUOTE_POOL[e.target.value][0]);
              }}
              style={{ width: '130px', padding: '4px 8px', fontSize: '0.75rem' }}
            >
              <option value="Mindfulness">🧘 Mindfulness</option>
              <option value="Motivation">⚡ Motivation</option>
              <option value="Discipline">🥋 Discipline</option>
              <option value="Growth">🌱 Growth</option>
            </select>
          </div>

          <div style={{ 
            padding: '20px', 
            borderRadius: '12px', 
            background: 'rgba(0,0,0,0.1)', 
            border: '1px solid var(--panel-border)',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            lineHeight: '1.5'
          }}>
            "{currentQuote}"
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="secondary" onClick={cycleQuote} style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}>
              Another Quote
            </button>
            <button 
              className="secondary" 
              onClick={() => {
                const favs = [...dbData.quotes.favorites];
                if (!favs.includes(currentQuote)) {
                  favs.push(currentQuote);
                  db.updateData({ quotes: { ...dbData.quotes, favorites: favs } });
                  alert('Added to your Favorite Quotes! 🌟');
                }
              }}
              style={{ padding: '8px', width: '40px', justifyContent: 'center' }}
              title="Add to Favorites"
            >
              🌟
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
