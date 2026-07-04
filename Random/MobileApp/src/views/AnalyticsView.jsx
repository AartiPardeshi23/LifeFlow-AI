import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Heart, 
  Droplet, 
  BookOpen, 
  Smile, 
  Sparkles 
} from 'lucide-react';
import { db } from '../utils/db';

const MOOD_VALUES = {
  Happy: 10,
  Excited: 9,
  Calm: 8,
  Relaxed: 8,
  Motivated: 8,
  Confused: 5,
  Lonely: 4,
  Stressed: 3,
  Sad: 2,
  Angry: 1
};

export default function AnalyticsView() {
  const [dbData, setDbData] = useState(db.getData());

  useEffect(() => {
    const handleDbUpdate = () => {
      setDbData({ ...db.getData() });
    };
    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  // --- Process Data for Charts ---

  // 1. Water Intake over the last few days
  const getWaterData = () => {
    const logs = dbData.healthPlanner.waterIntake;
    const sortedDates = Object.keys(logs).sort().slice(-5);
    return sortedDates.map(date => ({
      date: date.substring(5), // MM-DD
      ml: logs[date] * 250
    }));
  };
  const waterData = getWaterData();

  // 2. Mood Trends from feeling journals
  const getMoodData = () => {
    const feelingLogs = dbData.journals
      .filter(j => j.type === 'feeling')
      .reverse(); // chronological
    
    return feelingLogs.map(log => ({
      date: log.date.substring(5),
      score: MOOD_VALUES[log.mood] || 5,
      moodName: log.mood
    }));
  };
  const moodData = getMoodData();

  // 3. Sleep Trends from mental health journals
  const getSleepData = () => {
    const mhLogs = dbData.journals
      .filter(j => j.type === 'mental_health')
      .reverse();
    
    return mhLogs.map(log => ({
      date: log.date.substring(5),
      hours: log.sleep,
      stress: log.stress
    }));
  };
  const sleepData = getSleepData();

  // 4. Habit completion rates per category
  const getHabitData = () => {
    const categories = {};
    dbData.habits.forEach(h => {
      const cat = h.category;
      if (!categories[cat]) {
        categories[cat] = { name: cat, completed: 0, total: 0 };
      }
      categories[cat].total += 1;
      // check if checked today or recently
      const dates = Object.keys(h.history);
      if (dates.length > 0) {
        categories[cat].completed += dates.length;
      }
    });
    return Object.values(categories);
  };
  const habitData = getHabitData();

  // Stats summaries
  const totalJournals = dbData.journals.length;
  const currentLevel = dbData.user.level;
  const activeStreak = dbData.user.dailyStreak;
  const completedGoals = dbData.goals.filter(g => g.progress === 100).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          📊 Analytics & Wellness Insights
        </h1>
        <p style={{ marginTop: '4px' }}>Analyze your biometric and mindful trends over time. Identify trigger patterns to build consistency.</p>
      </div>

      {/* Cards Row (Summary metrics) */}
      <div className="grid-cols-4">
        
        <div className="glass-panel" style={{ textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <Smile size={24} style={{ color: 'var(--color-yellow)', marginBottom: '8px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Daily Streak</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>🔥 {activeStreak} Days</span>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <BookOpen size={24} style={{ color: 'var(--color-purple)', marginBottom: '8px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Total Journals</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>✍️ {totalJournals} Logs</span>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <TrendingUp size={24} style={{ color: 'var(--color-green)', marginBottom: '8px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Goals Completed</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>🎯 {completedGoals} SMART</span>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center', background: 'rgba(0,0,0,0.1)' }}>
          <Sparkles size={24} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Current Level</span>
          <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>🌳 Level {currentLevel}</span>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid-cols-2">

        {/* 1. Mood Trends Line Chart */}
        <div className="glass-panel" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={18} style={{ color: 'var(--color-pink)' }} /> Mood Index Trend</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chronological Check-ins</span>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%', minHeight: 0 }}>
            {moodData.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '60px', color: 'var(--text-muted)' }}>
                Please log a few entries in your Feeling Journal to visualize mood trends.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis domain={[1, 10]} ticks={[2, 4, 6, 8, 10]} stroke="var(--text-secondary)" />
                  <Tooltip 
                    contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--accent-color)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--color-pink)" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Water Hydration Area Chart */}
        <div className="glass-panel" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Droplet size={18} style={{ color: 'var(--color-blue)' }} /> Water Intake (ml)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Hydration Levels</span>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%', minHeight: 0 }}>
            {waterData.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '60px', color: 'var(--text-muted)' }}>
                No water entries logged recently. Click cups on dashboard!
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={waterData}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-blue)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="ml" stroke="var(--color-blue)" fillOpacity={1} fill="url(#colorWater)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Sleep & Stress Chart */}
        <div className="glass-panel" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={18} style={{ color: 'var(--color-purple)' }} /> Sleep vs. Stress Trends</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mental Health Logs</span>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%', minHeight: 0 }}>
            {sleepData.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '60px', color: 'var(--text-muted)' }}>
                Please log a few logs in your Mental Health Journal to compare sleep and stress.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }} />
                  <Line type="monotone" name="Sleep (Hrs)" dataKey="hours" stroke="var(--color-purple)" strokeWidth={2.5} />
                  <Line type="monotone" name="Stress (1-10)" dataKey="stress" stroke="var(--color-orange)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Habits Categories Bar Chart */}
        <div className="glass-panel" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="flex-between">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={18} style={{ color: 'var(--color-green)' }} /> Habits Category Frequency</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completion Counts</span>
          </div>
          <div style={{ flex: 1, width: '100%', height: '100%', minHeight: 0 }}>
            {habitData.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '60px', color: 'var(--text-muted)' }}>
                No active habits in database.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={habitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }} />
                  <Bar dataKey="completed" name="Total Check-ins" fill="var(--color-teal)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
