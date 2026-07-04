import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Utensils, 
  BookOpen, 
  TrendingUp, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Save, 
  Activity, 
  DollarSign, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';
import { db, getTodayDateString } from '../utils/db';
import confetti from 'canvas-confetti';

export default function PlannersView() {
  const [dbData, setDbData] = useState(db.getData());
  const [activePlannerTab, setActivePlannerTab] = useState('health'); // 'health', 'meal', 'study_work', 'finance', 'reading', 'travel'
  const todayStr = getTodayDateString();

  // Dynamic Reload
  const refreshDb = () => {
    setDbData({ ...db.getData() });
  };

  // --- 1. Health & Diet states ---
  const [newWeight, setNewWeight] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocDate, setNewDocDate] = useState('');
  const [newDocTime, setNewDocTime] = useState('');

  const addWeightLog = (e) => {
    e.preventDefault();
    if (!newWeight) return;
    const history = [...dbData.healthPlanner.weightHistory, { date: todayStr, weight: parseFloat(newWeight) }];
    db.updateHealthPlanner({ weightHistory: history });
    db.addXP(20);
    setNewWeight('');
    refreshDb();
  };

  const addMedication = () => {
    if (!newMedName || !newMedTime) return;
    const meds = [...dbData.healthPlanner.medications, { name: newMedName, dosage: '1 unit', time: newMedTime, taken: false }];
    db.updateHealthPlanner({ medications: meds });
    setNewMedName('');
    setNewMedTime('');
    refreshDb();
  };

  const toggleMedication = (idx) => {
    const meds = [...dbData.healthPlanner.medications];
    meds[idx].taken = !meds[idx].taken;
    db.updateHealthPlanner({ medications: meds });
    if (meds[idx].taken) {
      db.addXP(10);
      confetti({ particleCount: 15 });
    }
    refreshDb();
  };

  const removeMedication = (idx) => {
    const meds = dbData.healthPlanner.medications.filter((_, i) => i !== idx);
    db.updateHealthPlanner({ medications: meds });
    refreshDb();
  };

  const addAppointment = () => {
    if (!newDocName || !newDocDate || !newDocTime) return;
    const apps = [...dbData.healthPlanner.appointments, { doctor: newDocName, date: newDocDate, time: newDocTime, location: 'Clinic' }];
    db.updateHealthPlanner({ appointments: apps });
    setNewDocName('');
    setNewDocDate('');
    setNewDocTime('');
    refreshDb();
  };

  const removeAppointment = (idx) => {
    const apps = dbData.healthPlanner.appointments.filter((_, i) => i !== idx);
    db.updateHealthPlanner({ appointments: apps });
    refreshDb();
  };

  // --- 2. Meal Planner states ---
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeCals, setNewRecipeCals] = useState('');
  const [newRecipeProtein, setNewRecipeProtein] = useState('');
  const [newShopItem, setNewShopItem] = useState('');

  const handleUpdateWeeklyMeal = (day, mealType, val) => {
    const updatedWeekly = { ...dbData.mealPlanner.weekly };
    updatedWeekly[day][mealType] = val;
    db.updateMealPlanner({ weekly: updatedWeekly });
    refreshDb();
  };

  const addRecipe = () => {
    if (!newRecipeName) return;
    const recipes = [...dbData.mealPlanner.recipes, { 
      name: newRecipeName, 
      calories: parseInt(newRecipeCals) || 300, 
      protein: (newRecipeProtein || '15') + 'g', 
      ingredients: [] 
    }];
    db.updateMealPlanner({ recipes });
    setNewRecipeName('');
    setNewRecipeCals('');
    setNewRecipeProtein('');
    refreshDb();
  };

  const removeRecipe = (idx) => {
    const recipes = dbData.mealPlanner.recipes.filter((_, i) => i !== idx);
    db.updateMealPlanner({ recipes });
    refreshDb();
  };

  const addShopItem = () => {
    if (!newShopItem) return;
    const list = [...dbData.mealPlanner.shoppingList, { item: newShopItem, bought: false }];
    db.updateMealPlanner({ shoppingList: list });
    setNewShopItem('');
    refreshDb();
  };

  const toggleShopItem = (idx) => {
    const list = [...dbData.mealPlanner.shoppingList];
    list[idx].bought = !list[idx].bought;
    db.updateMealPlanner({ shoppingList: list });
    refreshDb();
  };

  const removeShopItem = (idx) => {
    const list = dbData.mealPlanner.shoppingList.filter((_, i) => i !== idx);
    db.updateMealPlanner({ shoppingList: list });
    refreshDb();
  };

  // --- 3. Finance states ---
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCat, setNewExpCat] = useState('Food');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [newIncAmount, setNewIncAmount] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmount) return;
    db.addExpense({
      desc: newExpDesc,
      amount: parseFloat(newExpAmount),
      category: newExpCat
    });
    db.addXP(10);
    setNewExpDesc('');
    setNewExpAmount('');
    refreshDb();
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!newIncDesc || !newIncAmount) return;
    db.addIncome({
      desc: newIncDesc,
      amount: parseFloat(newIncAmount)
    });
    db.addXP(10);
    setNewIncDesc('');
    setNewIncAmount('');
    refreshDb();
  };

  // --- 4. Reading states ---
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookPages, setNewBookPages] = useState('');

  const addBook = (e) => {
    e.preventDefault();
    if (!newBookTitle || !newBookAuthor) return;
    const books = [...dbData.readingPlanner.books, {
      id: 'b_' + Date.now(),
      title: newBookTitle,
      author: newBookAuthor,
      totalPages: parseInt(newBookPages) || 300,
      progress: 0,
      notes: '',
      quotes: []
    }];
    db.updateData({ readingPlanner: { ...dbData.readingPlanner, books } });
    db.addXP(30);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookPages('');
    refreshDb();
  };

  const handleUpdateBookProgress = (id, progressVal) => {
    const books = dbData.readingPlanner.books.map(b => b.id === id ? { ...b, progress: parseInt(progressVal) } : b);
    db.updateData({ readingPlanner: { ...dbData.readingPlanner, books } });
    refreshDb();
  };

  const removeBook = (id) => {
    const books = dbData.readingPlanner.books.filter(b => b.id !== id);
    db.updateData({ readingPlanner: { ...dbData.readingPlanner, books } });
    refreshDb();
  };

  // --- 5. Travel Planner states ---
  const [newTripDest, setNewTripDest] = useState('');
  const [newTripDate, setNewTripDate] = useState('');
  const [newTripBudget, setNewTripBudget] = useState('');
  const [newPackItem, setNewPackItem] = useState('');
  const [activeTripIdx, setActiveTripIdx] = useState(0);

  const addTrip = (e) => {
    e.preventDefault();
    if (!newTripDest || !newTripDate) return;
    const trips = [...dbData.travelPlanner.trips, {
      id: 't_' + Date.now(),
      destination: newTripDest,
      date: newTripDate,
      budget: parseInt(newTripBudget) || 1000,
      itinerary: [],
      packing: [],
      reservations: [],
      notes: ''
    }];
    db.updateData({ travelPlanner: { ...dbData.travelPlanner, trips } });
    db.addXP(40);
    setNewTripDest('');
    setNewTripDate('');
    setNewTripBudget('');
    refreshDb();
  };

  const addPackingItem = () => {
    if (!newPackItem || dbData.travelPlanner.trips.length === 0) return;
    const trips = [...dbData.travelPlanner.trips];
    trips[activeTripIdx].packing.push({ item: newPackItem, packed: false });
    db.updateData({ travelPlanner: { ...dbData.travelPlanner, trips } });
    setNewPackItem('');
    refreshDb();
  };

  const togglePackingItem = (tripIdx, packIdx) => {
    const trips = [...dbData.travelPlanner.trips];
    trips[tripIdx].packing[packIdx].packed = !trips[tripIdx].packing[packIdx].packed;
    db.updateData({ travelPlanner: { ...dbData.travelPlanner, trips } });
    refreshDb();
  };

  const removeTrip = (id) => {
    const trips = dbData.travelPlanner.trips.filter(t => t.id !== id);
    db.updateData({ travelPlanner: { ...dbData.travelPlanner, trips } });
    setActiveTripIdx(0);
    refreshDb();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, var(--panel-bg) 100%)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          🗂️ Life Planners Hub
        </h1>
        <p style={{ marginTop: '4px' }}>Manage all domains of your life including health, meals, finances, studies, and travel plans.</p>
      </div>

      {/* Tabs list */}
      <div className="tabs-header">
        <button className={`tab-btn ${activePlannerTab === 'health' ? 'active' : ''}`} onClick={() => setActivePlannerTab('health')}>
          ❤️ Health & Diet
        </button>
        <button className={`tab-btn ${activePlannerTab === 'meal' ? 'active' : ''}`} onClick={() => setActivePlannerTab('meal')}>
          🥗 Meal Planner
        </button>
        <button className={`tab-btn ${activePlannerTab === 'finance' ? 'active' : ''}`} onClick={() => setActivePlannerTab('finance')}>
          💰 Finance & Budget
        </button>
        <button className={`tab-btn ${activePlannerTab === 'reading' ? 'active' : ''}`} onClick={() => setActivePlannerTab('reading')}>
          📚 Reading Bookshelf
        </button>
        <button className={`tab-btn ${activePlannerTab === 'travel' ? 'active' : ''}`} onClick={() => setActivePlannerTab('travel')}>
          ✈️ Travel Trips
        </button>
      </div>

      {/* Tab panel contents */}
      <div>
        
        {/* TAB 1: Health & Diet */}
        {activePlannerTab === 'health' && (
          <div className="grid-cols-2">
            
            {/* Health Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Weight Log History</h3>
                <form onSubmit={addWeightLog} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="number" 
                    step="0.1" 
                    placeholder="Enter current weight (kg/lbs)" 
                    value={newWeight} 
                    onChange={(e) => setNewWeight(e.target.value)} 
                    required
                  />
                  <button type="submit" className="primary"><Plus size={16} /> Log</button>
                </form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginTop: '6px' }}>
                  {dbData.healthPlanner.weightHistory.map((w, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{w.date}</span>
                      <span style={{ fontWeight: 'bold' }}>{w.weight} units</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet Planner Goal */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Diet & Nutrition Target</h3>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Diet Target:</label>
                <select 
                  value={dbData.mealPlanner.dietGoal}
                  onChange={(e) => {
                    db.updateMealPlanner({ dietGoal: e.target.value });
                    refreshDb();
                  }}
                >
                  <option value="Healthy eating">🥦 Healthy eating</option>
                  <option value="Weight loss">⚖️ Weight loss</option>
                  <option value="Muscle gain">💪 Muscle gain</option>
                  <option value="Keto">🥑 Keto</option>
                  <option value="Vegan">🌱 Vegan</option>
                  <option value="Mediterranean">🌾 Mediterranean</option>
                  <option value="Intermittent fasting">⏱️ Intermittent fasting</option>
                </select>
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Active Diet helps filter appropriate weekly meal options. Track your consistency!
                </div>
              </div>
            </div>

            {/* Medications & Appointments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Daily Medications Checklist</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="Medication name" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} />
                  <input type="time" value={newMedTime} onChange={(e) => setNewMedTime(e.target.value)} style={{ width: '100px' }} />
                  <button className="primary" onClick={addMedication}><Plus size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {dbData.healthPlanner.medications.map((m, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => toggleMedication(idx)}>
                        {m.taken ? <CheckCircle2 size={16} style={{ color: 'var(--color-green)' }} /> : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
                        <span style={{ textDecoration: m.taken ? 'line-through' : 'none', color: m.taken ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '0.85rem' }}>
                          {m.name} ({m.time})
                        </span>
                      </div>
                      <button className="secondary" onClick={() => removeMedication(idx)} style={{ padding: '2px', background: 'transparent' }}>
                        <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Doctor Appointments</h3>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Dr. Name / Specialty" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} style={{ flex: 1 }} />
                  <input type="date" value={newDocDate} onChange={(e) => setNewDocDate(e.target.value)} style={{ width: '130px' }} />
                  <input type="time" value={newDocTime} onChange={(e) => setNewDocTime(e.target.value)} style={{ width: '90px' }} />
                  <button className="primary" onClick={addAppointment}><Plus size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {dbData.healthPlanner.appointments.map((a, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <div>
                        <strong>{a.doctor}</strong> - {a.date} at {a.time}
                      </div>
                      <button className="secondary" onClick={() => removeAppointment(idx)} style={{ padding: '2px', background: 'transparent' }}>
                        <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Meal Planner */}
        {activePlannerTab === 'meal' && (
          <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
            
            {/* Weekly Meal Layout (Left 2 cols) */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Weekly Meal Schedule</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {Object.entries(dbData.mealPlanner.weekly).map(([day, meals]) => (
                    <div key={day} style={{ padding: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent-color)' }}>{day}</span>
                      <div className="grid-cols-4" style={{ gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Breakfast</label>
                          <input type="text" value={meals.breakfast} onChange={(e) => handleUpdateWeeklyMeal(day, 'breakfast', e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Lunch</label>
                          <input type="text" value={meals.lunch} onChange={(e) => handleUpdateWeeklyMeal(day, 'lunch', e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Dinner</label>
                          <input type="text" value={meals.dinner} onChange={(e) => handleUpdateWeeklyMeal(day, 'dinner', e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Snacks</label>
                          <input type="text" value={meals.snack} onChange={(e) => handleUpdateWeeklyMeal(day, 'snack', e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shopping List & Recipe Store (Right 1 col) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Shopping List */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3>Shopping List</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="text" placeholder="Add grocery item" value={newShopItem} onChange={(e) => setNewShopItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addShopItem()} />
                  <button className="primary" onClick={addShopItem}><Plus size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {dbData.mealPlanner.shoppingList.map((item, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => toggleShopItem(idx)}>
                        {item.bought ? <CheckCircle2 size={15} style={{ color: 'var(--color-green)' }} /> : <Circle size={15} style={{ color: 'var(--text-muted)' }} />}
                        <span style={{ textDecoration: item.bought ? 'line-through' : 'none', color: item.bought ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                          {item.item}
                        </span>
                      </div>
                      <button className="secondary" onClick={() => removeShopItem(idx)} style={{ padding: '2px', background: 'transparent' }}>
                        <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipe Storage */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3>Recipe Storage</h3>
                <input type="text" placeholder="Recipe Name" value={newRecipeName} onChange={(e) => setNewRecipeName(e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="number" placeholder="Cals" value={newRecipeCals} onChange={(e) => setNewRecipeCals(e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                  <input type="text" placeholder="Protein (g)" value={newRecipeProtein} onChange={(e) => setNewRecipeProtein(e.target.value)} style={{ padding: '6px', fontSize: '0.8rem' }} />
                  <button className="primary" onClick={addRecipe} style={{ padding: '6px 12px' }}><Plus size={16} /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                  {dbData.mealPlanner.recipes.map((r, idx) => (
                    <div key={idx} className="flex-between" style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <div>
                        <strong>{r.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>({r.calories} kcal, {r.protein})</span>
                      </div>
                      <button className="secondary" onClick={() => removeRecipe(idx)} style={{ padding: '2px', background: 'transparent' }}>
                        <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: Finance & Budget */}
        {activePlannerTab === 'finance' && (
          <div className="grid-cols-2">
            
            {/* Ledgers (Income / Expenses) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Add Expense Form */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Log Expense</h3>
                <form onSubmit={handleAddExpense} className="grid-cols-3" style={{ gap: '10px' }}>
                  <input type="text" placeholder="Expense description" value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} required />
                  <input type="number" step="0.01" placeholder="Amount ($)" value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} required />
                  <select value={newExpCat} onChange={(e) => setNewExpCat(e.target.value)}>
                    <option value="Housing">Housing</option>
                    <option value="Food">Food</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Bills">Bills</option>
                    <option value="Travel">Travel</option>
                  </select>
                  <button type="submit" className="primary" style={{ gridColumn: 'span 3', justifyContent: 'center' }}><Plus size={16} /> Save Expense</button>
                </form>
              </div>

              {/* Add Income Form */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Log Income</h3>
                <form onSubmit={handleAddIncome} className="grid-cols-2" style={{ gap: '10px' }}>
                  <input type="text" placeholder="Source description" value={newIncDesc} onChange={(e) => setNewIncDesc(e.target.value)} required />
                  <input type="number" step="0.01" placeholder="Amount ($)" value={newIncAmount} onChange={(e) => setNewIncAmount(e.target.value)} required />
                  <button type="submit" className="primary" style={{ gridColumn: 'span 2', justifyContent: 'center' }}><Plus size={16} /> Save Income</button>
                </form>
              </div>

            </div>

            {/* Savings Goals & Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Financial Dashboard Summary */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Financial Overview</h3>
                
                {/* Math values */}
                {(() => {
                  const totalInc = dbData.financePlanner.income.reduce((sum, item) => sum + item.amount, 0);
                  const totalExp = dbData.financePlanner.expenses.reduce((sum, item) => sum + item.amount, 0);
                  const remainingBudget = dbData.financePlanner.budget - totalExp;
                  const limitPercent = Math.min(100, Math.round((totalExp / dbData.financePlanner.budget) * 100));

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="grid-cols-3" style={{ gap: '10px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Income</span>
                          <span style={{ display: 'block', fontWeight: 'bold', color: 'var(--color-green)' }}>${totalInc.toFixed(2)}</span>
                        </div>
                        <div style={{ background: 'rgba(244, 114, 182, 0.1)', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Expenses</span>
                          <span style={{ display: 'block', fontWeight: 'bold', color: 'var(--color-pink)' }}>${totalExp.toFixed(2)}</span>
                        </div>
                        <div style={{ background: 'rgba(96, 165, 250, 0.1)', padding: '10px', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remaining Budget</span>
                          <span style={{ display: 'block', fontWeight: 'bold', color: remainingBudget >= 0 ? 'var(--color-blue)' : 'var(--color-pink)' }}>
                            ${remainingBudget.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Budget progress bar */}
                      <div>
                        <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span>Monthly Budget Limit Progress:</span>
                          <span>${totalExp.toFixed(0)} / ${dbData.financePlanner.budget}</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${limitPercent}%`, height: '100%', background: limitPercent > 90 ? 'var(--color-pink)' : 'var(--accent-gradient)' }}></div>
                        </div>
                      </div>

                      {/* Subscriptions lists */}
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Active Subscriptions Tracker</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
                          {dbData.financePlanner.subscriptions.map((s, idx) => (
                            <div key={idx} className="flex-between" style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.8rem' }}>
                              <span>{s.name} (${s.amount}/{s.cycle})</span>
                              <span style={{ color: 'var(--text-muted)' }}>Bill date: {s.nextBill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()}

              </div>

            </div>

          </div>
        )}

        {/* TAB 4: Reading Bookshelf */}
        {activePlannerTab === 'reading' && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-between">
              <h3>Reading Progress & Notes</h3>
              <form onSubmit={addBook} style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Book Title" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} required style={{ width: '180px' }} />
                <input type="text" placeholder="Author" value={newBookAuthor} onChange={(e) => setNewBookAuthor(e.target.value)} required style={{ width: '130px' }} />
                <input type="number" placeholder="Total Pages" value={newBookPages} onChange={(e) => setNewBookPages(e.target.value)} style={{ width: '90px' }} />
                <button type="submit" className="primary"><Plus size={16} /> Add Book</button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              {dbData.readingPlanner.books.map((b) => (
                <div key={b.id} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid var(--panel-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div className="flex-between">
                    <div>
                      <h4 style={{ color: 'var(--accent-color)' }}>{b.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>by {b.author}</span>
                    </div>
                    <button className="secondary" onClick={() => removeBook(b.id)} style={{ padding: '4px', background: 'transparent' }}>
                      <Trash2 size={16} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>

                  {/* Progress slider bar */}
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span>Reading Progress:</span>
                      <span>{b.progress}% Completed</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={b.progress}
                      onChange={(e) => handleUpdateBookProgress(b.id, e.target.value)}
                      style={{ height: '6px', cursor: 'pointer' }}
                    />
                  </div>

                  {b.quotes && b.quotes.length > 0 && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '12px', borderLeft: '2px solid var(--accent-color)' }}>
                      {b.quotes[0]}
                    </div>
                  )}

                  {b.notes && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Review Note:</strong> {b.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Travel Trips */}
        {activePlannerTab === 'travel' && (
          <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
            
            {/* Trips List Panel (Left 1 Col) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3>Add New Trip</h3>
                <form onSubmit={addTrip} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" placeholder="Destination (e.g. Alps, Italy)" value={newTripDest} onChange={(e) => setNewTripDest(e.target.value)} required />
                  <input type="date" value={newTripDate} onChange={(e) => setNewTripDate(e.target.value)} required />
                  <input type="number" placeholder="Budget ($)" value={newTripBudget} onChange={(e) => setNewTripBudget(e.target.value)} />
                  <button type="submit" className="primary" style={{ justifyContent: 'center' }}><Plus size={16} /> Create Trip</button>
                </form>
              </div>

              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3>Select Active Trip</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dbData.travelPlanner.trips.map((t, idx) => (
                    <div 
                      key={t.id} 
                      onClick={() => setActiveTripIdx(idx)}
                      style={{ 
                        padding: '10px', 
                        borderRadius: '8px', 
                        background: activeTripIdx === idx ? 'rgba(167, 139, 250, 0.15)' : 'rgba(0,0,0,0.1)',
                        border: activeTripIdx === idx ? '1px solid var(--accent-color)' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                      className="flex-between"
                    >
                      <div>
                        <strong>{t.destination}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.date}</span>
                      </div>
                      <button className="secondary" onClick={(e) => { e.stopPropagation(); removeTrip(t.id); }} style={{ padding: '2px', background: 'transparent' }}>
                        <Trash2 size={14} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trip Details Panel (Right 2 Cols) */}
            <div style={{ gridColumn: 'span 2' }}>
              {dbData.travelPlanner.trips.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
                  <MapPin size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                  <h3>No Trips Scheduled</h3>
                  <p>Input a travel destination on the left to activate the itinerary board.</p>
                </div>
              ) : (
                (() => {
                  const trip = dbData.travelPlanner.trips[activeTripIdx] || dbData.travelPlanner.trips[0];
                  if (!trip) return null;
                  return (
                    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="flex-between">
                        <div>
                          <h2>✈️ {trip.destination}</h2>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Travel Date: {trip.date} | Budget: ${trip.budget}</span>
                        </div>
                      </div>

                      {/* Packing List */}
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Packing List Checklist</h3>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                          <input type="text" placeholder="Add packing item" value={newPackItem} onChange={(e) => setNewPackItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPackingItem()} />
                          <button className="primary" onClick={addPackingItem}><Plus size={16} /></button>
                        </div>
                        <div className="grid-cols-2" style={{ gap: '8px' }}>
                          {trip.packing.map((p, idx) => (
                            <div key={idx} className="flex-between" style={{ padding: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => togglePackingItem(activeTripIdx, idx)}>
                                {p.packed ? <CheckCircle2 size={15} style={{ color: 'var(--color-green)' }} /> : <Circle size={15} style={{ color: 'var(--text-muted)' }} />}
                                <span style={{ textDecoration: p.packed ? 'line-through' : 'none', color: p.packed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                  {p.item}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Itinerary schedule */}
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Trip Itinerary Schedule</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {trip.itinerary.map((it, idx) => (
                            <div key={idx} style={{ padding: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.85rem' }}>
                              <strong>Day {it.day}:</strong> {it.title}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })()
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
