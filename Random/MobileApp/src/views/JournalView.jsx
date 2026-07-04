import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Heart, 
  Smile, 
  Activity, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  ChevronRight,
  Save
} from 'lucide-react';
import { db, getTodayDateString } from '../utils/db';
import confetti from 'canvas-confetti';

const MOODS_ARRAY = [
  { label: 'Happy', emoji: '☀️', color: 'var(--mood-happy)' },
  { label: 'Excited', emoji: '⚡', color: 'var(--mood-excited)' },
  { label: 'Calm', emoji: '🧘', color: 'var(--mood-calm)' },
  { label: 'Relaxed', emoji: '🌾', color: 'var(--mood-relaxed)' },
  { label: 'Sad', emoji: '🌧️', color: 'var(--mood-sad)' },
  { label: 'Angry', emoji: '🔥', color: 'var(--mood-angry)' },
  { label: 'Stressed', emoji: '💥', color: 'var(--mood-stressed)' },
  { label: 'Lonely', emoji: '🌌', color: 'var(--mood-lonely)' },
  { label: 'Confused', emoji: '🌀', color: 'var(--mood-confused)' },
  { label: 'Motivated', emoji: '🚀', color: 'var(--mood-motivated)' }
];

export default function JournalView() {
  const [journals, setJournals] = useState(db.getJournals());
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'gratitude', 'feeling', 'mental_health', 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Daily Journal State
  const [dailyTitle, setDailyTitle] = useState('');
  const [dailyContent, setDailyContent] = useState('');
  const [dailyWins, setDailyWins] = useState('');
  const [dailyChallenges, setDailyChallenges] = useState('');
  const [dailyLessons, setDailyLessons] = useState('');

  // Gratitude Journal State
  const [gratTitle, setGratTitle] = useState('');
  const [grat1, setGrat1] = useState('');
  const [grat2, setGrat2] = useState('');
  const [grat3, setGrat3] = useState('');
  const [gratBestMoment, setGratBestMoment] = useState('');
  const [gratAppreciate, setGratAppreciate] = useState('');
  const [gratMemories, setGratMemories] = useState('');

  // Feeling Journal State
  const [feelingTitle, setFeelingTitle] = useState('');
  const [feelingMood, setFeelingMood] = useState('Calm');
  const [feelingWhy, setFeelingWhy] = useState('');
  const [feelingWhatHappened, setFeelingWhatHappened] = useState('');
  const [feelingWhatHelps, setFeelingWhatHelps] = useState('');

  // Mental Health State
  const [mhTitle, setMhTitle] = useState('');
  const [mhAnxiety, setMhAnxiety] = useState(3);
  const [mhStress, setMhStress] = useState(3);
  const [mhEnergy, setMhEnergy] = useState(7);
  const [mhMotivation, setMhMotivation] = useState(7);
  const [mhSleep, setMhSleep] = useState(7);
  const [mhBurnout, setMhBurnout] = useState(2);
  const [mhEmotionalBalance, setMhEmotionalBalance] = useState(8);
  const [mhNotes, setMhNotes] = useState('');

  // Emotional insights text
  const [emotionalInsight, setEmotionalInsight] = useState('');

  useEffect(() => {
    generateEmotionalInsights();
  }, [journals]);

  const refreshList = () => {
    setJournals([...db.getJournals()]);
  };

  const handleSaveDaily = (e) => {
    e.preventDefault();
    if (!dailyTitle.trim() || !dailyContent.trim()) {
      alert('Please fill out the Title and Content field.');
      return;
    }
    db.addJournal({
      type: 'daily',
      title: dailyTitle,
      content: dailyContent,
      wins: dailyWins,
      challenges: dailyChallenges,
      lessons: dailyLessons
    });
    confetti({ particleCount: 80, spread: 60 });
    clearDaily();
    refreshList();
    setActiveTab('history');
  };

  const clearDaily = () => {
    setDailyTitle('');
    setDailyContent('');
    setDailyWins('');
    setDailyChallenges('');
    setDailyLessons('');
  };

  const handleSaveGratitude = (e) => {
    e.preventDefault();
    if (!gratTitle.trim() || !grat1.trim()) {
      alert('Please write at least one thing you are grateful for.');
      return;
    }
    db.addJournal({
      type: 'gratitude',
      title: gratTitle,
      items: [grat1, grat2, grat3].filter(Boolean),
      bestMoment: gratBestMoment,
      personAppreciate: gratAppreciate,
      memories: gratMemories
    });
    confetti({ particleCount: 80, spread: 60 });
    clearGratitude();
    refreshList();
    setActiveTab('history');
  };

  const clearGratitude = () => {
    setGratTitle('');
    setGrat1('');
    setGrat2('');
    setGrat3('');
    setGratBestMoment('');
    setGratAppreciate('');
    setGratMemories('');
  };

  const handleSaveFeeling = (e) => {
    e.preventDefault();
    if (!feelingTitle.trim()) {
      alert('Please provide a title for your feeling log.');
      return;
    }
    db.addJournal({
      type: 'feeling',
      title: feelingTitle,
      mood: feelingMood,
      why: feelingWhy,
      whatHappened: feelingWhatHappened,
      whatHelps: feelingWhatHelps
    });
    confetti({ particleCount: 80, spread: 60 });
    clearFeeling();
    refreshList();
    setActiveTab('history');
  };

  const clearFeeling = () => {
    setFeelingTitle('');
    setFeelingMood('Calm');
    setFeelingWhy('');
    setFeelingWhatHappened('');
    setFeelingWhatHelps('');
  };

  const handleSaveMentalHealth = (e) => {
    e.preventDefault();
    if (!mhTitle.trim()) {
      alert('Please enter a Title for this tracking log.');
      return;
    }
    db.addJournal({
      type: 'mental_health',
      title: mhTitle,
      anxiety: parseInt(mhAnxiety),
      stress: parseInt(mhStress),
      energy: parseInt(mhEnergy),
      motivation: parseInt(mhMotivation),
      sleep: parseFloat(mhSleep),
      burnout: parseInt(mhBurnout),
      emotionalBalance: parseInt(mhEmotionalBalance),
      notes: mhNotes,
      suggestions: getEmpatheticAdvice(parseInt(mhStress), parseInt(mhAnxiety), parseInt(mhBurnout))
    });
    confetti({ particleCount: 80, spread: 60 });
    clearMentalHealth();
    refreshList();
    setActiveTab('history');
  };

  const clearMentalHealth = () => {
    setMhTitle('');
    setMhAnxiety(3);
    setMhStress(3);
    setMhEnergy(7);
    setMhMotivation(7);
    setMhSleep(7);
    setMhBurnout(2);
    setMhEmotionalBalance(8);
    setMhNotes('');
  };

  const getEmpatheticAdvice = (stress, anxiety, burnout) => {
    if (stress > 7 || anxiety > 7 || burnout > 7) {
      return "Your logs show elevated stress levels. Please consider setting aside 15 minutes to step away from all screens. Focus on box breathing: inhale for 4s, hold for 4s, exhale for 4s. Be kind to yourself today; you don't have to carry it all.";
    }
    if (stress > 4 || anxiety > 4) {
      return "Felt a bit of weight today. That is completely okay. Try taking a gentle 15-minute walk outside, or make a warm cup of herbal tea. Focus on a single priority task instead of multitasking.";
    }
    return "Your numbers look balanced today! Take a moment to celebrate this smooth mental state. Writing down one win today can help carry this positivity into tomorrow.";
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      db.deleteJournal(id);
      refreshList();
    }
  };

  // Process emotional trends
  const generateEmotionalInsights = () => {
    const feelingLogs = journals.filter(j => j.type === 'feeling');
    if (feelingLogs.length === 0) {
      setEmotionalInsight("Log a few moods in the Feeling Journal tab to generate insights!");
      return;
    }

    const moodCounts = {};
    feelingLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    });

    // Find dominant mood
    let dominantMood = '';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });

    const totalLogs = feelingLogs.length;
    const dominantPercent = Math.round((maxCount / totalLogs) * 100);

    setEmotionalInsight(`Over your last ${totalLogs} check-ins, your most frequent emotional state was "${dominantMood}" (${dominantPercent}% of entries). You tend to feel motivated when prioritizing routines, and experience slight stress around mid-day deadlines. Continue box breathing to sustain your calm.`);
  };

  const filteredJournals = journals.filter((j) => {
    const matchesSearch = (j.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (j.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (j.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || j.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* View Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          📝 Writing Journals
        </h1>
        <p style={{ marginTop: '4px' }}>Express your thoughts, log your emotional states, and look back at your growth journey.</p>
      </div>

      {/* Tabs list */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
          📓 Daily Journal
        </button>
        <button className={`tab-btn ${activeTab === 'gratitude' ? 'active' : ''}`} onClick={() => setActiveTab('gratitude')}>
          ❤️ Gratitude Journal
        </button>
        <button className={`tab-btn ${activeTab === 'feeling' ? 'active' : ''}`} onClick={() => setActiveTab('feeling')}>
          🎭 Feeling & Mood
        </button>
        <button className={`tab-btn ${activeTab === 'mental_health' ? 'active' : ''}`} onClick={() => setActiveTab('mental_health')}>
          🧠 Mental Health Tracker
        </button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          📚 History Archive
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="grid-cols-3" style={{ gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left 2 Cols: Form Panel depending on selected tab */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {activeTab === 'daily' && (
            <form onSubmit={handleSaveDaily} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3>New Daily Journal Entry</h3>
              <div>
                <input 
                  type="text" 
                  placeholder="Give today a title (e.g. A calm evening in Grindelwald)" 
                  value={dailyTitle}
                  onChange={(e) => setDailyTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <textarea 
                  placeholder="How was your day? Write freely..." 
                  value={dailyContent}
                  onChange={(e) => setDailyContent(e.target.value)}
                  style={{ minHeight: '180px', fontFamily: 'var(--font-serif)', fontSize: '1rem', lineHeight: '1.7' }}
                  required
                />
              </div>

              <div className="grid-cols-3" style={{ gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Today's Wins</label>
                  <input type="text" placeholder="What succeeded?" value={dailyWins} onChange={(e) => setDailyWins(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Challenges</label>
                  <input type="text" placeholder="What was difficult?" value={dailyChallenges} onChange={(e) => setDailyChallenges(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lessons Learned</label>
                  <input type="text" placeholder="Any new takeaway?" value={dailyLessons} onChange={(e) => setDailyLessons(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="primary" style={{ justifyContent: 'center' }}>
                <Save size={16} /> Save Daily Entry (+40 XP)
              </button>
            </form>
          )}

          {activeTab === 'gratitude' && (
            <form onSubmit={handleSaveGratitude} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3>Gratitude & Positive Focus</h3>
              <p style={{ fontSize: '0.85rem' }}>Reflecting on things we appreciate recalibrates the mind to optimism.</p>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Title (e.g. Simple Pleasures of Life)" 
                  value={gratTitle}
                  onChange={(e) => setGratTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Write down 3 things you are grateful for today:</span>
                <input type="text" placeholder="1. ..." value={grat1} onChange={(e) => setGrat1(e.target.value)} required />
                <input type="text" placeholder="2. ..." value={grat2} onChange={(e) => setGrat2(e.target.value)} />
                <input type="text" placeholder="3. ..." value={grat3} onChange={(e) => setGrat3(e.target.value)} />
              </div>

              <div className="grid-cols-2">
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Best Moment Today</label>
                  <input type="text" placeholder="A snapshot you want to keep" value={gratBestMoment} onChange={(e) => setGratBestMoment(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Someone I Appreciate</label>
                  <input type="text" placeholder="Who brought you value?" value={gratAppreciate} onChange={(e) => setGratAppreciate(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Positive Memories</label>
                <textarea 
                  placeholder="Relive a warm memory from the past..." 
                  value={gratMemories} 
                  onChange={(e) => setGratMemories(e.target.value)}
                  style={{ height: '60px' }}
                />
              </div>

              <button type="submit" className="primary" style={{ justifyContent: 'center' }}>
                <Save size={16} /> Save Gratitude Log (+40 XP)
              </button>
            </form>
          )}

          {activeTab === 'feeling' && (
            <form onSubmit={handleSaveFeeling} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3>Feeling & Emotional Check-in</h3>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Feeling entry title (e.g. Navigating deadline anxiety)" 
                  value={feelingTitle}
                  onChange={(e) => setFeelingTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Select your current emotional energy state:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {MOODS_ARRAY.map((m) => (
                    <span
                      key={m.label}
                      onClick={() => setFeelingMood(m.label)}
                      className={`mood-tag ${feelingMood === m.label ? 'active' : ''}`}
                      style={{
                        background: feelingMood === m.label ? 'var(--accent-color)' : 'rgba(0,0,0,0.1)',
                        borderColor: feelingMood === m.label ? 'var(--accent-color)' : 'var(--panel-border)',
                        color: feelingMood === m.label ? '#141517' : 'var(--text-primary)'
                      }}
                    >
                      {m.emoji} {m.label}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Why do I feel this way?</label>
                  <textarea placeholder="Identify the core trigger..." value={feelingWhy} onChange={(e) => setFeelingWhy(e.target.value)} style={{ height: '60px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>What happened? (Context)</label>
                  <textarea placeholder="Log events leading up to this state..." value={feelingWhatHappened} onChange={(e) => setFeelingWhatHappened(e.target.value)} style={{ height: '60px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>What can help me? (Actionable self-care)</label>
                  <textarea placeholder="Write down something kind and helper steps..." value={feelingWhatHelps} onChange={(e) => setFeelingWhatHelps(e.target.value)} style={{ height: '60px' }} />
                </div>
              </div>

              <button type="submit" className="primary" style={{ justifyContent: 'center' }}>
                <Save size={16} /> Save Emotional Log (+40 XP)
              </button>
            </form>
          )}

          {activeTab === 'mental_health' && (
            <form onSubmit={handleSaveMentalHealth} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3>Mental Health Wellness check</h3>
              <p style={{ fontSize: '0.85rem' }}>Track metrics to check burnout trends over time. LifeFlow AI provides suggestions but never diagnoses illnesses.</p>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Log title (e.g. Mid-week Burnout Log)" 
                  value={mhTitle}
                  onChange={(e) => setMhTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-cols-2" style={{ gap: '20px' }}>
                <div>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.85rem' }}>Stress Level</label>
                    <span style={{ fontWeight: 'bold' }}>{mhStress}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={mhStress} onChange={(e) => setMhStress(e.target.value)} style={{ height: '6px' }} />
                </div>

                <div>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.85rem' }}>Anxiety Level</label>
                    <span style={{ fontWeight: 'bold' }}>{mhAnxiety}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={mhAnxiety} onChange={(e) => setMhAnxiety(e.target.value)} style={{ height: '6px' }} />
                </div>

                <div>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.85rem' }}>Energy Index</label>
                    <span style={{ fontWeight: 'bold' }}>{mhEnergy}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={mhEnergy} onChange={(e) => setMhEnergy(e.target.value)} style={{ height: '6px' }} />
                </div>

                <div>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.85rem' }}>Motivation</label>
                    <span style={{ fontWeight: 'bold' }}>{mhMotivation}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={mhMotivation} onChange={(e) => setMhMotivation(e.target.value)} style={{ height: '6px' }} />
                </div>

                <div>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.85rem' }}>Hours of Sleep</label>
                    <span style={{ fontWeight: 'bold' }}>{mhSleep} hrs</span>
                  </div>
                  <input type="range" min="3" max="12" step="0.5" value={mhSleep} onChange={(e) => setMhSleep(e.target.value)} style={{ height: '6px' }} />
                </div>

                <div>
                  <div className="flex-between">
                    <label style={{ fontSize: '0.85rem' }}>Emotional Balance</label>
                    <span style={{ fontWeight: 'bold' }}>{mhEmotionalBalance}/10</span>
                  </div>
                  <input type="range" min="1" max="10" value={mhEmotionalBalance} onChange={(e) => setMhEmotionalBalance(e.target.value)} style={{ height: '6px' }} />
                </div>
              </div>

              <div>
                <div className="flex-between">
                  <label style={{ fontSize: '0.85rem' }}>Burnout Risk</label>
                  <span style={{ fontWeight: 'bold', color: mhBurnout > 7 ? 'var(--color-pink)' : 'inherit' }}>{mhBurnout}/10</span>
                </div>
                <input type="range" min="1" max="10" value={mhBurnout} onChange={(e) => setMhBurnout(e.target.value)} style={{ height: '6px' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>General Log Notes</label>
                <textarea 
                  placeholder="Record symptoms or specific items causing stress..." 
                  value={mhNotes} 
                  onChange={(e) => setMhNotes(e.target.value)}
                  style={{ height: '60px' }}
                />
              </div>

              <button type="submit" className="primary" style={{ justifyContent: 'center' }}>
                <Save size={16} /> Save Mental Health Log (+40 XP)
              </button>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="flex-between">
                <h3>Journal Entries Archive</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ width: '130px', padding: '6px' }}
                  >
                    <option value="all">📁 All Journals</option>
                    <option value="daily">📓 Daily</option>
                    <option value="gratitude">❤️ Gratitude</option>
                    <option value="feeling">🎭 Feeling</option>
                    <option value="mental_health">🧠 Mental Health</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredJournals.length === 0 ? (
                  <p style={{ textAlign: 'center', fontStyle: 'italic', padding: '40px', color: 'var(--text-muted)' }}>
                    No journal entries found matching criteria.
                  </p>
                ) : (
                  filteredJournals.map((j) => (
                    <div key={j.id} style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(0,0,0,0.15)',
                      border: '1px solid var(--panel-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div className="flex-between">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className={`badge ${
                            j.type === 'daily' ? 'badge-purple' : 
                            j.type === 'gratitude' ? 'badge-green' : 
                            j.type === 'feeling' ? 'badge-blue' : 'badge-orange'
                          }`}>
                            {j.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{j.date}</span>
                        </div>
                        <button className="secondary" onClick={() => handleDelete(j.id)} style={{ padding: '4px', background: 'transparent' }}>
                          <Trash2 size={16} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '1.1rem' }}>{j.title}</h4>
                      
                      {j.type === 'daily' && (
                        <>
                          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.95rem' }}>{j.content}</p>
                          <div className="grid-cols-3" style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                            <span>🏆 Wins: {j.wins}</span>
                            <span>⚡ Challenges: {j.challenges}</span>
                            <span>📖 Lessons: {j.lessons}</span>
                          </div>
                        </>
                      )}

                      {j.type === 'gratitude' && (
                        <div>
                          <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {j.items?.map((item, idx) => <li key={idx}>"{item}"</li>)}
                          </ul>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                            <span>🌟 Best: {j.bestMoment}</span>
                            <span>🙌 Appreciate: {j.personAppreciate}</span>
                          </div>
                        </div>
                      )}

                      {j.type === 'feeling' && (
                        <div style={{ fontSize: '0.9rem' }}>
                          <span style={{ display: 'block', fontWeight: '600', color: 'var(--accent-color)' }}>Mood logged: {j.mood}</span>
                          <p style={{ marginTop: '4px' }}><strong>Why:</strong> {j.why}</p>
                          <p style={{ marginTop: '2px' }}><strong>Helps:</strong> {j.whatHelps}</p>
                        </div>
                      )}

                      {j.type === 'mental_health' && (
                        <div style={{ fontSize: '0.85rem' }}>
                          <div className="grid-cols-4" style={{ gap: '8px' }}>
                            <span>Stress: {j.stress}/10</span>
                            <span>Anxiety: {j.anxiety}/10</span>
                            <span>Energy: {j.energy}/10</span>
                            <span>Motivation: {j.motivation}/10</span>
                          </div>
                          {j.suggestions && (
                            <div style={{
                              background: 'rgba(167, 139, 250, 0.1)',
                              border: '1px solid rgba(167, 139, 250, 0.2)',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              marginTop: '8px'
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--accent-color)' }}>
                                <Sparkles size={14} /> Empathy Suggestions:
                              </span>
                              <p style={{ fontSize: '0.8rem', marginTop: '2px', color: 'var(--text-secondary)' }}>{j.suggestions}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Search & Emotional Insights panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Search box */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3>Search Journals</h3>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search words..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveTab('history'); // switch to history to display filtered items
                }}
                style={{ paddingLeft: '36px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Emotional Insights widget */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={18} style={{ color: 'var(--color-pink)' }} /> Mood Analytics
            </h3>
            <div style={{
              background: 'rgba(244, 114, 182, 0.05)',
              border: '1px solid rgba(244, 114, 182, 0.15)',
              padding: '16px',
              borderRadius: '12px'
            }}>
              <span style={{ fontWeight: '600', color: 'var(--color-pink)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Emotional Insights:
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {emotionalInsight}
              </p>
            </div>
          </div>

          {/* Calming quotes card */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, var(--panel-bg) 100%)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Zen Mantra</h3>
            <p style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
              "Let go of how the day should have looked, and honor how it actually is."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
