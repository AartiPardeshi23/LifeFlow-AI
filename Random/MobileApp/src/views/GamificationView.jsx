import React, { useState, useEffect } from 'react';
import { Award, Flame, Trees, Zap, Compass, Star, MessageSquare } from 'lucide-react';
import { db } from '../utils/db';
import confetti from 'canvas-confetti';

export default function GamificationView() {
  const [dbData, setDbData] = useState(db.getData());
  const [activeGamifyTab, setActiveGamifyTab] = useState('tree'); // 'tree', 'badges', 'community'
  const [communityWallText, setCommunityWallText] = useState('');
  const [wallEntries, setWallEntries] = useState([
    { name: 'Anonymous', text: 'Grateful for clean water and the sun rising today.', date: '2026-07-04' },
    { name: 'KindSoul', text: 'Offered help to my neighbor carrying groceries. Felt wonderful!', date: '2026-07-03' }
  ]);

  useEffect(() => {
    const handleDbUpdate = () => {
      setDbData({ ...db.getData() });
    };
    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  const handlePostWall = (e) => {
    e.preventDefault();
    if (!communityWallText.trim()) return;
    const newEntry = {
      name: 'Anonymous',
      text: communityWallText,
      date: new Date().toISOString().split('T')[0]
    };
    setWallEntries([newEntry, ...wallEntries]);
    setCommunityWallText('');
    db.addXP(25);
    confetti({ particleCount: 30, colors: ['#a78bfa', '#34d399'] });
    alert('Thank you for posting on the Gratitude Wall! +25 XP');
  };

  const currentLevel = dbData.user.level;
  const currentXP = dbData.user.xp;
  const levelXP = currentLevel * 200;
  const progressPercent = Math.min(100, Math.round((currentXP / levelXP) * 100));

  // --- SVG Dynamic Growth Tree Renderer ---
  const renderSVGTree = () => {
    // Determine branches and leaves based on level
    const trunkHeight = 100 + currentLevel * 10;
    
    return (
      <svg width="220" height="260" viewBox="0 0 220 260" style={{ overflow: 'visible' }}>
        {/* Pot/Ground Base */}
        <ellipse cx="110" cy="240" rx="45" ry="12" fill="rgba(255, 255, 255, 0.1)" stroke="var(--panel-border)" strokeWidth="1" />
        <path d="M 80 240 L 90 255 L 130 255 L 140 240 Z" fill="rgba(167, 139, 250, 0.2)" stroke="var(--panel-border)" strokeWidth="1.5" />
        
        {/* Seedling Trunk - Level 1+ */}
        <path 
          d={`M 107 240 Q 110 180 110 ${240 - trunkHeight}`} 
          fill="none" 
          stroke="#b45309" 
          strokeWidth={currentLevel > 2 ? "9" : "6"} 
          strokeLinecap="round" 
        />

        {/* Level 2+ Left Branch */}
        {currentLevel >= 2 && (
          <path 
            d={`M 110 ${200} Q 90 170 75 160`} 
            fill="none" 
            stroke="#b45309" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
        )}

        {/* Level 2+ Right Branch */}
        {currentLevel >= 2 && (
          <path 
            d={`M 110 ${180} Q 130 150 145 140`} 
            fill="none" 
            stroke="#b45309" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
        )}

        {/* Level 3+ Foliage (Green leaves) */}
        {currentLevel >= 3 && (
          <>
            {/* Top crown */}
            <circle cx="110" cy={240 - trunkHeight} r="24" fill="var(--color-green)" opacity="0.8" />
            <circle cx="95" cy={230 - trunkHeight} r="18" fill="var(--color-teal)" opacity="0.85" />
            <circle cx="125" cy={230 - trunkHeight} r="18" fill="var(--color-green)" opacity="0.85" />
            
            {/* Left foliage */}
            <circle cx="70" cy="155" r="16" fill="var(--color-green)" opacity="0.85" />
            
            {/* Right foliage */}
            <circle cx="145" cy="135" r="16" fill="var(--color-teal)" opacity="0.85" />
          </>
        )}

        {/* Level 4+ Flowers (Blossoms) */}
        {currentLevel >= 4 && (
          <>
            <circle cx="110" cy={230 - trunkHeight} r="6" fill="var(--color-pink)" />
            <circle cx="85" cy="220 - trunkHeight" r="5" fill="var(--color-pink)" />
            <circle cx="130" cy="210 - trunkHeight" r="5" fill="var(--color-pink)" />
            <circle cx="68" cy="152" r="5" fill="var(--color-pink)" />
            <circle cx="148" cy="132" r="5" fill="var(--color-pink)" />
          </>
        )}

        {/* Level 5+ Fruit/Golden Apples */}
        {currentLevel >= 5 && (
          <>
            <circle cx="102" cy={245 - trunkHeight} r="4" fill="var(--color-yellow)" />
            <circle cx="118" cy={245 - trunkHeight} r="4" fill="var(--color-yellow)" />
            <circle cx="74" cy="162" r="4" fill="var(--color-yellow)" />
            <circle cx="140" cy="142" r="4" fill="var(--color-yellow)" />
          </>
        )}
      </svg>
    );
  };

  const getTreeStageName = () => {
    if (currentLevel === 1) return "Tiny Seedling";
    if (currentLevel === 2) return "Young Sprout";
    if (currentLevel === 3) return "Leafy Sapling";
    if (currentLevel === 4) return "Blossoming Tree";
    return "Golden Fruit Tree";
  };

  const getTreeStageDescription = () => {
    if (currentLevel === 1) return "Your tree has sprouted! Complete 3 tasks to trigger green leaves.";
    if (currentLevel === 2) return "Strong stems are emerging. Focus on habits to add leaf foliage.";
    if (currentLevel === 3) return "Your tree is green and healthy! Keep consistent to trigger spring blossoms.";
    if (currentLevel === 4) return "Gorgeous pink blossoms are in bloom. Almost fully grown!";
    return "Your tree is loaded with golden apples. You have reached peak productivity!";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🌳 Level & Growth Gamification
        </h1>
        <p style={{ marginTop: '4px' }}>Watch your digital garden grow as you cultivate daily positive habits and mindfulness.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeGamifyTab === 'tree' ? 'active' : ''}`} onClick={() => setActiveGamifyTab('tree')}>
          🌳 Dynamic Growth Tree
        </button>
        <button className={`tab-btn ${activeGamifyTab === 'badges' ? 'active' : ''}`} onClick={() => setActiveGamifyTab('badges')}>
          🏆 Achievement Badges
        </button>
        <button className={`tab-btn ${activeGamifyTab === 'community' ? 'active' : ''}`} onClick={() => setActiveGamifyTab('community')}>
          🤝 Kindness Wall & Community Feed
        </button>
      </div>

      {/* Active Area */}
      <div>
        
        {/* TAB 1: Growth Tree */}
        {activeGamifyTab === 'tree' && (
          <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
            
            {/* Tree Canvas (Left 2 cols) */}
            <div style={{ gridColumn: 'span 2' }} className="glass-panel">
              <div className="flex-between">
                <h3>My Growth Tree Visualizer</h3>
                <span className="badge badge-purple">{getTreeStageName()}</span>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>As you level up, your seed grows branches, leaves, blossoms, and fruits.</p>

              <div className="tree-container" style={{ padding: '30px 0' }}>
                {renderSVGTree()}
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.1)',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid var(--panel-border)'
              }}>
                <span style={{ fontWeight: '600', color: 'var(--accent-color)', fontSize: '0.9rem', display: 'block' }}>
                  Stage: {getTreeStageName()}
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {getTreeStageDescription()}
                </p>
              </div>
            </div>

            {/* Level Stats Summary (Right 1 col) */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3>Current Progression</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="flex-between" style={{ fontSize: '0.9rem' }}>
                  <span>Level Status:</span>
                  <strong>Level {currentLevel}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                </div>
                <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>{currentXP} / {levelXP} XP</span>
                  <span>{100 - progressPercent}% to Level {currentLevel + 1}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <div className="flex-between" style={{ padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Flame size={14} style={{ color: 'var(--color-orange)' }} /> Daily Streak
                  </span>
                  <strong>{dbData.user.dailyStreak} Days</strong>
                </div>

                <div className="flex-between" style={{ padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <Zap size={14} style={{ color: 'var(--color-yellow)' }} /> Focus Sessions
                  </span>
                  <strong>4 Completed</strong>
                </div>
              </div>

              <button 
                className="secondary" 
                onClick={() => {
                  db.addXP(40);
                  confetti({ particleCount: 50 });
                  alert('XP added! Test levels up.');
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                +40 XP (Developer Test Mode)
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: Badges */}
        {activeGamifyTab === 'badges' && (
          <div className="glass-panel">
            <h3>Unlocked Achievements & Medals</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>No penalty loops exist in LifeFlow AI. We celebrate constructive steps, large or small.</p>

            <div className="grid-cols-3">
              {dbData.achievements.map((ach) => (
                <div 
                  key={ach.id}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: ach.unlocked ? 'rgba(167, 139, 250, 0.1)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${ach.unlocked ? 'var(--accent-color)' : 'var(--panel-border)'}`,
                    opacity: ach.unlocked ? 1 : 0.45,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '2.5rem' }}>{ach.icon}</span>
                  <h4 style={{ fontSize: '1.05rem', color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{ach.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ach.desc}</p>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>+{ach.xp} XP Awarded</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Community / Wall */}
        {activeGamifyTab === 'community' && (
          <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
            
            {/* Gratitude Wall entry form */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3>Post to Anonymous Gratitude Wall</h3>
              <p style={{ fontSize: '0.85rem' }}>Share positive items to spread good energy. Postings are completely anonymous and filtered.</p>
              
              <form onSubmit={handlePostWall} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea 
                  placeholder="Today I am grateful for..."
                  value={communityWallText}
                  onChange={(e) => setCommunityWallText(e.target.value)}
                  style={{ height: '100px', fontSize: '0.85rem' }}
                  required
                />
                <button type="submit" className="primary" style={{ justifyContent: 'center' }}><Star size={16} /> Post on Wall (+25 XP)</button>
              </form>
            </div>

            {/* Gratitude Wall entries list (Right 2 cols) */}
            <div style={{ gridColumn: 'span 2' }} className="glass-panel">
              <h3>Kindness Wall Feed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                {wallEntries.map((e, idx) => (
                  <div key={idx} style={{
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--accent-color)' }}>👤 {e.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.date}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                      "{e.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
