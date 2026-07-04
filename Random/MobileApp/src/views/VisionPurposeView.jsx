import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  Type, 
  Move,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { db } from '../utils/db';
import confetti from 'canvas-confetti';

export default function VisionPurposeView() {
  const [dbData, setDbData] = useState(db.getData());
  const [activeSubTab, setActiveSubTab] = useState('vision'); // 'vision', 'purpose'
  
  // Vision board state
  const [boards, setBoards] = useState(db.getVisionBoards());
  const [activeBoardIdx, setActiveBoardIdx] = useState(0);

  // Forms
  const [newImageInput, setNewImageInput] = useState('');
  const [newTextInput, setNewTextInput] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedBg, setSelectedBg] = useState('linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)');

  // Drag states
  const [draggingItem, setDraggingItem] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const workspaceRef = useRef(null);

  // Purpose states
  const [purpose, setPurpose] = useState(db.getData().lifePurpose);

  useEffect(() => {
    const handleDbUpdate = () => {
      setDbData({ ...db.getData() });
      setBoards(db.getVisionBoards());
      setPurpose(db.getData().lifePurpose);
    };
    window.addEventListener('lifeflow_db_update', handleDbUpdate);
    return () => window.removeEventListener('lifeflow_db_update', handleDbUpdate);
  }, []);

  const saveBoardsToDb = (updatedBoards) => {
    setBoards(updatedBoards);
    db.saveVisionBoards(updatedBoards);
  };

  // --- Board Management ---
  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!newBoardName) return;
    const newBoard = {
      id: 'vb_' + Date.now(),
      title: newBoardName,
      bgType: 'gradient',
      bgColor: selectedBg,
      items: []
    };
    const updated = [...boards, newBoard];
    saveBoardsToDb(updated);
    setActiveBoardIdx(updated.length - 1);
    setNewBoardName('');
    confetti({ particleCount: 50 });
  };

  const handleDeleteBoard = (idx) => {
    if (boards.length <= 1) {
      alert("You should keep at least one Vision Board.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${boards[idx].title}"?`)) {
      const updated = boards.filter((_, i) => i !== idx);
      saveBoardsToDb(updated);
      setActiveBoardIdx(0);
    }
  };

  // --- Element Addition ---
  const addImageToBoard = () => {
    if (!newImageInput) return;
    const currentBoard = boards[activeBoardIdx] || boards[0];
    if (!currentBoard) return;

    const newItem = {
      id: 'vi_' + Date.now(),
      type: 'image',
      content: newImageInput,
      x: 60,
      y: 60,
      w: 160,
      h: 120
    };

    const updatedItems = [...currentBoard.items, newItem];
    const updatedBoards = boards.map((b, i) => i === activeBoardIdx ? { ...b, items: updatedItems } : b);
    saveBoardsToDb(updatedBoards);
    setNewImageInput('');
  };

  const addTextToBoard = () => {
    if (!newTextInput) return;
    const currentBoard = boards[activeBoardIdx] || boards[0];
    if (!currentBoard) return;

    const newItem = {
      id: 'vi_' + Date.now(),
      type: 'text',
      content: newTextInput.toUpperCase(),
      x: 100,
      y: 100,
      color: '#ffffff',
      fontSize: '16px'
    };

    const updatedItems = [...currentBoard.items, newItem];
    const updatedBoards = boards.map((b, i) => i === activeBoardIdx ? { ...b, items: updatedItems } : b);
    saveBoardsToDb(updatedBoards);
    setNewTextInput('');
  };

  const handleRemoveItem = (itemId) => {
    const currentBoard = boards[activeBoardIdx];
    if (!currentBoard) return;
    const updatedItems = currentBoard.items.filter(item => item.id !== itemId);
    const updatedBoards = boards.map((b, i) => i === activeBoardIdx ? { ...b, items: updatedItems } : b);
    saveBoardsToDb(updatedBoards);
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, item, isTouch = false) => {
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    
    // Remember initial offset between cursor click point and element top-left
    dragOffset.current = {
      x: clientX - item.x,
      y: clientY - item.y
    };
    
    setDraggingItem(item.id);
  };

  const handleDragMove = (e, isTouch = false) => {
    if (!draggingItem) return;
    e.preventDefault();

    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();

    // Compute relative click coordinates
    let x = clientX - dragOffset.current.x;
    let y = clientY - dragOffset.current.y;

    // Bounds checking
    x = Math.max(0, Math.min(rect.width - 100, x));
    y = Math.max(0, Math.min(rect.height - 50, y));

    const currentBoard = boards[activeBoardIdx];
    const updatedItems = currentBoard.items.map(item => 
      item.id === draggingItem ? { ...item, x, y } : item
    );

    const updatedBoards = boards.map((b, i) => i === activeBoardIdx ? { ...b, items: updatedItems } : b);
    setBoards(updatedBoards);
  };

  const handleDragEnd = () => {
    if (draggingItem) {
      db.saveVisionBoards(boards);
      setDraggingItem(null);
    }
  };

  // --- Life Purpose Management ---
  const savePurpose = (fields) => {
    const updated = { ...purpose, ...fields };
    setPurpose(updated);
    db.updateData({ lifePurpose: updated });
  };

  const triggerPurposeSave = () => {
    db.addXP(40);
    confetti({ particleCount: 50, colors: ['#a78bfa', '#60a5fa'] });
    alert('Life Purpose Section successfully saved! ✨');
  };

  const activeBoard = boards[activeBoardIdx] || boards[0] || { bgColor: '#1e1f24', items: [], title: 'No Board' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* View Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          ✨ Vision & Life Purpose
        </h1>
        <p style={{ marginTop: '4px' }}>A space to map out your long-term legacy, values, rules, and drag images into interactive Vision Boards.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeSubTab === 'vision' ? 'active' : ''}`} onClick={() => setActiveSubTab('vision')}>
          🖼️ Interactive Vision Board
        </button>
        <button className={`tab-btn ${activeSubTab === 'purpose' ? 'active' : ''}`} onClick={() => setActiveSubTab('purpose')}>
          📜 Mission & Core Values
        </button>
      </div>

      {/* Active Workspace */}
      <div>
        
        {/* TAB 1: Vision Board */}
        {activeSubTab === 'vision' && (
          <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
            
            {/* Control Panel (Left 1 col) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Board Selection */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3>Select Vision Board</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {boards.map((b, idx) => (
                    <div 
                      key={b.id} 
                      onClick={() => setActiveBoardIdx(idx)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        background: activeBoardIdx === idx ? 'rgba(167, 139, 250, 0.15)' : 'rgba(0,0,0,0.1)',
                        border: activeBoardIdx === idx ? '1px solid var(--accent-color)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                      className="flex-between"
                    >
                      <span>{b.title}</span>
                      <button className="secondary" onClick={(e) => { e.stopPropagation(); handleDeleteBoard(idx); }} style={{ padding: '2px', background: 'transparent' }}>
                        <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Board Form */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3>Create Board</h3>
                <form onSubmit={handleCreateBoard} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="text" placeholder="Board Title (e.g. Travel, Health)" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} required />
                  <select value={selectedBg} onChange={(e) => setSelectedBg(e.target.value)}>
                    <option value="linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)">💜 Pastel Purple</option>
                    <option value="linear-gradient(135deg, #fbcfe8 0%, #fbcfe8 100%)">🌸 Pastel Pink</option>
                    <option value="linear-gradient(135deg, #a7f3d0 0%, #bfdbfe 100%)">🌱 Calm Forest</option>
                    <option value="#1e1f24">🖤 Sleek Charcoal</option>
                  </select>
                  <button type="submit" className="primary" style={{ justifyContent: 'center' }}><Plus size={16} /> Add Board</button>
                </form>
              </div>

              {/* Add items to Board */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3>Add Board Elements</h3>
                
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Add Image by URL:</span>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <input type="url" placeholder="https://images.unsplash.com/..." value={newImageInput} onChange={(e) => setNewImageInput(e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                    <button className="primary" onClick={addImageToBoard} style={{ padding: '8px' }}><Plus size={14} /></button>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Add Quote Card:</span>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <input type="text" placeholder="I AM STRONG" value={newTextInput} onChange={(e) => setNewTextInput(e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                    <button className="primary" onClick={addTextToBoard} style={{ padding: '8px' }}><Plus size={14} /></button>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '8px' }}>
                  <HelpCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Drag the elements on the canvas to arrange. Click and hold items to drag!
                </div>
              </div>

            </div>

            {/* Canvas Workspace (Right 2 cols) */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <h3>Workspace: {activeBoard.title}</h3>
                  <span className="badge badge-purple">Click + Drag items</span>
                </div>

                <div 
                  ref={workspaceRef}
                  onMouseMove={(e) => handleDragMove(e, false)}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchMove={(e) => handleDragMove(e, true)}
                  onTouchEnd={handleDragEnd}
                  className="vision-board-workspace"
                  style={{
                    background: activeBoard.bgColor,
                    position: 'relative'
                  }}
                >
                  {activeBoard.items && activeBoard.items.map((item) => (
                    <div
                      key={item.id}
                      className="vision-item"
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        width: item.w ? `${item.w}px` : 'auto',
                        height: item.h ? `${item.h}px` : 'auto',
                        padding: item.type === 'text' ? '12px' : '0px',
                        background: item.type === 'text' ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
                        color: item.type === 'text' ? 'white' : 'inherit',
                        border: draggingItem === item.id ? '2px solid var(--accent-color)' : '1px solid transparent',
                        zIndex: draggingItem === item.id ? 100 : 10
                      }}
                      onMouseDown={(e) => handleDragStart(e, item, false)}
                      onTouchStart={(e) => handleDragStart(e, item, true)}
                    >
                      {item.type === 'image' ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <img src={item.content} alt="Vision" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              padding: '2px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: item.fontSize || '16px', fontWeight: 'bold' }}>{item.content}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                            style={{
                              background: 'transparent',
                              color: 'white',
                              padding: '2px',
                              cursor: 'pointer',
                              border: 'none'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Purpose */}
        {activeSubTab === 'purpose' && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-between">
              <h3>My Life Purpose Statement & Philosophy</h3>
              <button className="primary" onClick={triggerPurposeSave}><Save size={16} /> Save Changes</button>
            </div>

            <div className="grid-cols-2">
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--accent-color)' }}>Mission Statement</label>
                <textarea 
                  placeholder="Define your overarching mission statement here..."
                  value={purpose.mission || ''}
                  onChange={(e) => savePurpose({ mission: e.target.value })}
                  style={{ minHeight: '100px', fontSize: '0.9rem', marginTop: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-green)' }}>Core Values</label>
                <textarea 
                  placeholder="What values act as your compass? (e.g. Integrity, Simplicity, Courage)"
                  value={purpose.values || ''}
                  onChange={(e) => savePurpose({ values: e.target.value })}
                  style={{ minHeight: '100px', fontSize: '0.9rem', marginTop: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-pink)' }}>Legacy Goal</label>
                <textarea 
                  placeholder="What positive footprint do you wish to leave in this world?"
                  value={purpose.legacy || ''}
                  onChange={(e) => savePurpose({ legacy: e.target.value })}
                  style={{ minHeight: '100px', fontSize: '0.9rem', marginTop: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-blue)' }}>Dream Life Description</label>
                <textarea 
                  placeholder="Describe your ideal daily scenario in rich detail..."
                  value={purpose.dreamLife || ''}
                  onChange={(e) => savePurpose({ dreamLife: e.target.value })}
                  style={{ minHeight: '100px', fontSize: '0.9rem', marginTop: '6px' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '16px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-orange)' }}>My Personal Rules & Rules of Engagement</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Editable lists of behaviors you hold yourself accountable to.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {purpose.rules.map((rule, idx) => (
                  <div key={idx} className="flex-between" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <CheckCircle size={15} style={{ color: 'var(--color-orange)' }} />
                      <input 
                        type="text" 
                        value={rule} 
                        onChange={(e) => {
                          const updatedRules = [...purpose.rules];
                          updatedRules[idx] = e.target.value;
                          savePurpose({ rules: updatedRules });
                        }}
                        style={{ border: 'none', background: 'transparent', padding: '0px', width: '400px' }}
                      />
                    </div>
                    <button 
                      className="secondary" 
                      onClick={() => {
                        const updatedRules = purpose.rules.filter((_, i) => i !== idx);
                        savePurpose({ rules: updatedRules });
                      }}
                      style={{ padding: '2px', background: 'transparent' }}
                    >
                      <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                ))}
                
                <button 
                  className="secondary" 
                  onClick={() => {
                    const updatedRules = [...purpose.rules, 'New personal rule'];
                    savePurpose({ rules: updatedRules });
                  }}
                  style={{ alignSelf: 'flex-start', marginTop: '4px' }}
                >
                  <Plus size={16} /> Add Rule
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
