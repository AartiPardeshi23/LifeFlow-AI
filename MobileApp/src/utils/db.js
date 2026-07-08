// LocalStorage Database Layer for LifeFlow AI

const STORAGE_KEY = 'lifeflow_ai_data';

// Helper to get formatted date string (YYYY-MM-DD)
export const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// Initial default state with rich mock data for first-time use
const defaultDatabase = {
  user: {
    name: 'Seraphina',
    avatar: '',
    joinedDate: '2026-06-01',
    xp: 320,
    level: 3,
    dailyStreak: 5,
    lastActiveDate: getTodayDateString()
  },
  settings: {
    theme: 'dark', // 'light' or 'dark'
    fontFamily: 'Outfit', // 'Outfit' or 'Merriweather'
    backgroundSound: 'none', // 'rain', 'forest', 'waves', 'none'
    soundVolume: 0.5,
    widgets: {
      affirmations: true,
      weather: true,
      water: true,
      habits: true,
      goals: true,
      timer: true,
      quotes: true,
      calendar: true
    }
  },
  achievements: [
    { id: 'first_step', title: 'First Step', desc: 'Write your first journal entry', unlocked: true, xp: 50, icon: '✍️' },
    { id: 'hydration_hero', title: 'Hydration Hero', desc: 'Drink 8 glasses of water in a day', unlocked: true, xp: 50, icon: '💧' },
    { id: 'mindful_session', title: 'Mindfulness Beginner', desc: 'Complete a breathing exercise', unlocked: true, xp: 50, icon: '🧘' },
    { id: 'habit_streak_5', title: 'Five-Day Streak', desc: 'Maintain a 5-day streak on any habit', unlocked: false, xp: 100, icon: '🔥' },
    { id: 'goal_getter', title: 'Dream Weaver', desc: 'Complete a SMART goal milestone', unlocked: true, xp: 100, icon: '🎯' },
    { id: 'zen_master', title: 'Zen Master', desc: 'Spend 30 minutes in Focus Mode', unlocked: false, xp: 150, icon: '🌲' }
  ],
  habits: [
    { id: 'h1', title: 'Morning Meditation', category: 'Mindfulness', streak: 4, history: { '2026-07-03': true, '2026-07-02': true, '2026-07-01': true, '2026-06-30': true }, target: 7, frequency: 'Daily' },
    { id: 'h2', title: 'Drink 2.5L Water', category: 'Health', streak: 5, history: { '2026-07-03': true, '2026-07-02': true, '2026-07-01': true, '2026-06-30': true, '2026-06-29': true }, target: 7, frequency: 'Daily' },
    { id: 'h3', title: 'Read 15 Pages', category: 'Growth', streak: 2, history: { '2026-07-03': true, '2026-07-02': true }, target: 7, frequency: 'Daily' },
    { id: 'h4', title: 'Evening Stretching', category: 'Health', streak: 0, history: { '2026-07-02': true }, target: 5, frequency: 'Daily' }
  ],
  goals: [
    {
      id: 'g1',
      title: 'Run a 10K Marathon',
      category: 'Health',
      deadline: '2026-09-30',
      motivation: 'To boost my endurance and feel energized every day.',
      reward: 'A relaxing weekend spa package.',
      visionImage: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=400&q=80',
      notes: 'Ensure proper warm-ups and dynamic stretching before running.',
      milestones: [
        { id: 'm1_1', text: 'Run 5K without stopping', completed: true },
        { id: 'm1_2', text: 'Complete an 8K run', completed: false },
        { id: 'm1_3', text: 'Build a weekly training schedule', completed: true }
      ],
      progress: 66,
      tasks: ['Buy running shoes', 'Install Nike Run Club app']
    },
    {
      id: 'g2',
      title: 'Build a Personal Growth Web App',
      category: 'Career',
      deadline: '2026-08-15',
      motivation: 'To display my technical capabilities and create something beautiful.',
      reward: 'A mechanical keyboard.',
      visionImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
      notes: 'Keep codebase neat, clean, and focus heavily on user feedback animations.',
      milestones: [
        { id: 'm2_1', text: 'Design database structure & wireframes', completed: true },
        { id: 'm2_2', text: 'Build interactive modules (Vision Board, Growth Tree)', completed: false },
        { id: 'm2_3', text: 'Connect local-first db and export utilities', completed: false }
      ],
      progress: 33,
      tasks: ['Sketch design on iPad', 'Draft layout structure']
    }
  ],
  journals: [
    {
      id: 'j1',
      date: '2026-07-03',
      type: 'daily',
      title: 'A Productive & Mindful Friday',
      content: 'Today went really well. I completed my morning meditation and immediately felt a sense of calm. Managed to work on coding projects for 4 hours. In the evening, I took a long walk near the lake. The sunset was incredible.',
      wins: 'Finished the routing module. Drank all my water.',
      challenges: 'Felt slightly distracted around 2 PM.',
      lessons: 'Turning off notifications on my phone completely resolves afternoon focus slumps.',
      reflection: 'Progress is slow but consistent. I am proud of myself.'
    },
    {
      id: 'j2',
      date: '2026-07-03',
      type: 'gratitude',
      title: 'Gratitude: Simple Pleasures',
      items: [
        'The rich taste of fresh hazelnut coffee this morning.',
        'A warm text message from an old college friend.',
        'A quiet evening with perfect, cool summer breeze.'
      ],
      bestMoment: 'Sitting by the lake watching the ducks swim during sunset.',
      personAppreciate: 'My sister, who always knows how to make me laugh when I am stressed.',
      memories: 'Remembering when we used to build forts in the backyard.'
    },
    {
      id: 'j3',
      date: '2026-07-03',
      type: 'feeling',
      title: 'Feeling Calmer',
      mood: 'Calm', // Happy, Excited, Calm, Relaxed, Sad, Angry, Stressed, Lonely, Confused, Motivated
      why: 'I took things one step at a time today without rushing.',
      whatHappened: 'I prioritized my morning schedule and did box breathing before work.',
      whatHelps: 'Keep doing this: do not check emails before 9:00 AM.'
    },
    {
      id: 'j4',
      date: '2026-07-02',
      type: 'mental_health',
      title: 'Dealing with Mid-week Stress',
      anxiety: 4, // 0-10
      stress: 6, // 0-10
      energy: 5, // 0-10
      motivation: 7, // 0-10
      sleep: 6, // hours
      burnout: 3, // 0-10
      emotionalBalance: 6, // 0-10
      notes: 'Felt a bit of anxiety about deadlines, but writing things down in a structured task list helped me feel in control.',
      suggestions: 'Try a 10-minute progressive muscle relaxation session and go to bed early.'
    }
  ],
  planners: {
    // Keyed by date YYYY-MM-DD
    '2026-07-04': {
      morningRoutine: [
        { text: 'Hydrate (500ml water)', completed: true },
        { text: '10 min Stretching', completed: true },
        { text: 'Read affirmations', completed: true }
      ],
      eveningRoutine: [
        { text: 'Digital detox 1hr before bed', completed: false },
        { text: 'Gratitude log', completed: false },
        { text: 'Prepare clothes for tomorrow', completed: false }
      ],
      priorities: [
        { text: 'Complete the LifeFlow app architecture', completed: true },
        { text: 'Go for a 5K run', completed: false },
        { text: 'Update finance budget tracker', completed: false }
      ],
      timeblocks: [
        { time: '08:00', text: 'Morning routine & breakfast' },
        { time: '09:00', text: 'Coding: React component development' },
        { time: '12:00', text: 'Lunch & walk' },
        { time: '13:00', text: 'Work on LifeFlow AI styling and layout' },
        { time: '16:00', text: 'Run & stretch outdoors' },
        { time: '18:00', text: 'Dinner & meal planning' },
        { time: '20:00', text: 'Reading & Wind-down' }
      ],
      notes: 'Focus on glassmorphism look for the dashboard widgets today.',
      reflection: 'Felt very creative today! The UI transitions look excellent.',
      tomorrowPlan: 'Code the gamification systems and the Growth Tree canvas tomorrow.'
    }
  },
  healthPlanner: {
    weightHistory: [
      { date: '2026-06-15', weight: 68.5 },
      { date: '2026-06-22', weight: 68.0 },
      { date: '2026-06-29', weight: 67.4 },
      { date: '2026-07-04', weight: 67.1 }
    ],
    waterIntake: {
      '2026-07-04': 5, // cups
      '2026-07-03': 8,
      '2026-07-02': 7,
      '2026-07-01': 8
    },
    exerciseHistory: [
      { date: '2026-06-30', type: 'Yoga', duration: 30, calories: 120 },
      { date: '2026-07-01', type: 'Running', duration: 40, calories: 450 },
      { date: '2026-07-03', type: 'Strength', duration: 45, calories: 280 }
    ],
    medications: [
      { name: 'Multivitamin', dosage: '1 tablet', time: '08:30', taken: true },
      { name: 'Omega-3', dosage: '1 capsule', time: '13:00', taken: false }
    ],
    appointments: [
      { doctor: 'Dr. Evans (Dentist)', date: '2026-07-15', time: '14:00', location: 'Dental Care Clinic' }
    ],
    symptomsLog: [
      { date: '2026-07-02', symptom: 'Mild Headache', severity: 'Low' }
    ]
  },
  mealPlanner: {
    weekly: {
      Monday: { breakfast: 'Oatmeal & Bananas', lunch: 'Quinoa Salad', dinner: 'Baked Salmon & Broccoli', snack: 'Almonds' },
      Tuesday: { breakfast: 'Avocado Toast', lunch: 'Salmon leftovers', dinner: 'Lentil Soup', snack: 'Apple slices' },
      Wednesday: { breakfast: 'Smoothie Bowl', lunch: 'Lentil Soup leftovers', dinner: 'Tofu stir-fry', snack: 'Yogurt' },
      Thursday: { breakfast: 'Scrambled Eggs', lunch: 'Tofu stir-fry leftovers', dinner: 'Chicken Fajitas', snack: 'Walnuts' },
      Friday: { breakfast: 'Oatmeal & Bananas', lunch: 'Chicken Fajitas leftovers', dinner: 'Sweet Potato Bowls', snack: 'Mixed Berries' },
      Saturday: { breakfast: 'Pancakes (Healthy)', lunch: 'Chickpea Salad', dinner: 'Mediterranean Bowl', snack: 'Dark Chocolate' },
      Sunday: { breakfast: 'Spinach Omelet', lunch: 'Mediterranean leftovers', dinner: 'Vegetable Curry', snack: 'Hummus' }
    },
    recipes: [
      { name: 'Mediterranean Quinoa Bowl', calories: 450, protein: '15g', ingredients: ['Quinoa', 'Cucumber', 'Olives', 'Hummus', 'Feta', 'Olive Oil'] },
      { name: 'Berry Protein Smoothie', calories: 280, protein: '25g', ingredients: ['Whey protein', 'Almond Milk', 'Strawberries', 'Chia seeds', 'Spinach'] }
    ],
    shoppingList: [
      { item: 'Organic Spinach', bought: false },
      { item: 'Fresh Salmon Fillet', bought: true },
      { item: 'Quinoa (1 bag)', bought: false },
      { item: 'Greek Yogurt', bought: true }
    ],
    dietGoal: 'Mediterranean' // Weight loss, Muscle gain, Healthy eating, Keto, Vegan, Vegetarian, Mediterranean, Intermittent fasting
  },
  financePlanner: {
    budget: 1800, // monthly limit
    income: [
      { id: 'inc1', desc: 'Freelance Design', amount: 2400, date: '2026-07-01' },
      { id: 'inc2', desc: 'Etsy Prints Shop', amount: 450, date: '2026-07-03' }
    ],
    expenses: [
      { id: 'exp1', desc: 'Rent', amount: 1100, category: 'Housing', date: '2026-07-01' },
      { id: 'exp2', desc: 'Groceries', amount: 120, category: 'Food', date: '2026-07-02' },
      { id: 'exp3', desc: 'Coffee Shop', amount: 15, category: 'Leisure', date: '2026-07-03' }
    ],
    savings: {
      goal: 10000,
      current: 4500,
      monthlyTarget: 500
    },
    subscriptions: [
      { name: 'Spotify Premium', amount: 10.99, cycle: 'Monthly', nextBill: '2026-07-15' },
      { name: 'Figma Pro', amount: 15.00, cycle: 'Monthly', nextBill: '2026-07-20' }
    ]
  },
  readingPlanner: {
    books: [
      { id: 'b1', title: 'Atomic Habits', author: 'James Clear', progress: 85, totalPages: 320, quotes: ['"You do not rise to the level of your goals. You fall to the level of your systems."'], notes: 'Crucial reading on incremental progression. Highly applicable to the LifeFlow project.' },
      { id: 'b2', title: 'Stolen Focus', author: 'Johann Hari', progress: 40, totalPages: 350, quotes: ['"An environment that constantly interrupts us leads to cognitive depletion."'], notes: 'Explores the systemic causes of our focus crisis.' }
    ],
    goalYears: 12,
    completedThisYear: 3
  },
  travelPlanner: {
    trips: [
      {
        id: 't1',
        destination: 'Swiss Alps & Zurich',
        date: '2026-09-10',
        budget: 3500,
        itinerary: [
          { day: 1, title: 'Arrive in Zurich & Old Town walk' },
          { day: 2, title: 'Train to Grindelwald & explore valley' },
          { day: 3, title: 'Hike to Bachalpsee Lake' }
        ],
        packing: [
          { item: 'Hiking boots', packed: true },
          { item: 'Windbreaker jacket', packed: false },
          { item: 'Swiss Adapter', packed: true }
        ],
        reservations: [
          { type: 'Flight', details: 'Swiss Air LX 41, Dep: 9:40 AM' },
          { type: 'Hotel', details: 'Grindelwald Sun Valley Lodge (3 nights)' }
        ],
        notes: 'Buy the Swiss Travel Pass 3 days before travel!'
      }
    ]
  },
  todoList: [
    { id: 'td1', title: 'Water the houseplants', list: 'Personal', priority: 'Medium', deadline: '2026-07-04', completed: false, tags: ['Home'], subtasks: [] },
    { id: 'td2', title: 'Draft mockups for design review', list: 'Work', priority: 'High', deadline: '2026-07-05', completed: true, tags: ['Design'], subtasks: [{ text: 'Layout sketch', completed: true }, { text: 'Color picking', completed: true }] },
    { id: 'td3', title: 'Study chapter 4 of Algorithms textbook', list: 'Study', priority: 'High', deadline: '2026-07-06', completed: false, tags: ['CS'], subtasks: [{ text: 'Solve 3 practice exercises', completed: false }] }
  ],
  visionBoards: [
    {
      id: 'vb1',
      title: 'Dream Life & Health',
      bgType: 'gradient',
      bgColor: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      items: [
        { id: 'vi1', type: 'image', content: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=400&q=80', x: 50, y: 50, w: 200, h: 150 },
        { id: 'vi2', type: 'text', content: 'HEALTH IS THE TRUE WEALTH', x: 280, y: 80, color: '#2c3e50', fontSize: '18px' },
        { id: 'vi3', type: 'image', content: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', x: 100, y: 220, w: 180, h: 180 }
      ]
    }
  ],
  lifePurpose: {
    mission: 'To create products that bring clarity, design order, and peaceful productivity to people around the world.',
    values: 'Simplicity, Aesthetic integrity, Daily practice, Emotional support, Continuous discovery.',
    legacy: 'To leave behind a footprint of kindness, useful tools, and inspired developer designs.',
    dreamLife: 'Living in a quiet house surrounded by trees, working on passion projects, with a strong habit of meditation and morning runs.',
    philosophy: 'The quality of your focus determines the quality of your life.',
    rules: [
      'Never read emails before completing morning meditation.',
      'Always express gratitude once a day to someone explicitly.',
      'Sleep by 10:30 PM on weekdays.',
      'Celebrate tiny progressions; they accumulate.'
    ],
    idealSelf: 'A calm, highly focused creator who listens intently, speaks thoughtfully, and exercises daily.'
  },
  affirmations: {
    custom: [
      { text: 'I am allowed to move at my own peaceful pace.', favorite: true },
      { text: 'I choose consistency over perfection today.', favorite: true }
    ],
    favorites: [
      'I am allowed to move at my own peaceful pace.',
      'I choose consistency over perfection today.',
      'My mind is calm, clear, and ready to absorb new ideas.'
    ]
  },
  quotes: {
    favorites: [
      'You do not rise to the level of your goals. You fall to the level of your systems. — James Clear'
    ]
  },
  calendarEvents: [
    { id: 'ev1', title: 'Dentist Checkup', date: '2026-07-15', category: 'Health', time: '14:00', recurring: 'None' },
    { id: 'ev2', title: 'Coding Live Review', date: '2026-07-04', category: 'Work', time: '16:00', recurring: 'None' },
    { id: 'ev3', title: 'Dad\'s Birthday 🎂', date: '2026-07-10', category: 'Personal', time: '00:00', recurring: 'Yearly' }
  ],
  templates: [
    { name: 'Clean Daily Reflection', type: 'journal', code: 'Wins today:\nChallenges:\nLessons learned:\nTomorrow priority:' },
    { name: 'Self-Care Wellness Sunday', type: 'planner', code: 'Morning: Forest Bathing\nAfternoon: Yoga\nEvening: Face mask & reading' }
  ]
};

// Database class to read and write locally
class LifeFlowDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  mergeDeep(target, source) {
    if (typeof target !== 'object' || target === null) return source;
    if (typeof source !== 'object' || source === null) return target;
    
    const output = { ...target };
    Object.keys(source).forEach(key => {
      if (Array.isArray(source[key])) {
        output[key] = source[key];
      } else if (typeof source[key] === 'object' && source[key] !== null) {
        output[key] = this.mergeDeep(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    });
    return output;
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          this.data = this.mergeDeep(JSON.parse(JSON.stringify(defaultDatabase)), parsed);
          this.checkStreak();
          this.save();
        } else {
          this.data = JSON.parse(JSON.stringify(defaultDatabase));
          this.save();
        }
      } else {
        this.data = JSON.parse(JSON.stringify(defaultDatabase));
        this.save();
      }
    } catch (e) {
      console.error('Failed to load local storage database. Resetting storage.', e);
      this.data = JSON.parse(JSON.stringify(defaultDatabase));
      this.save();
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      window.dispatchEvent(new Event('lifeflow_db_update'));
    } catch (e) {
      console.error('Failed to write to local storage', e);
    }
  }

  getData() {
    if (!this.data) {
      this.data = JSON.parse(JSON.stringify(defaultDatabase));
    }
    // Guarantee all top-level keys exist to prevent crashes
    Object.keys(defaultDatabase).forEach(key => {
      if (this.data[key] === undefined || this.data[key] === null) {
        this.data[key] = JSON.parse(JSON.stringify(defaultDatabase[key]));
      }
    });
    return this.data;
  }

  updateData(newData) {
    this.data = { ...this.getData(), ...newData };
    this.save();
    return this.data;
  }

  checkStreak() {
    const today = getTodayDateString();
    const lastActive = this.data.user.lastActiveDate;
    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActive === yesterdayStr) {
      this.data.user.dailyStreak += 1;
    } else {
      this.data.user.dailyStreak = 1;
    }
    this.data.user.lastActiveDate = today;
    this.save();
  }

  addXP(amount) {
    this.data.user.xp += amount;
    const nextLevelXP = this.data.user.level * 200;
    let leveledUp = false;
    if (this.data.user.xp >= nextLevelXP) {
      this.data.user.level += 1;
      this.data.user.xp -= nextLevelXP;
      leveledUp = true;
    }
    this.save();
    return { level: this.data.user.level, xp: this.data.user.xp, leveledUp };
  }

  getJournals() {
    return this.data.journals || [];
  }

  addJournal(entry) {
    const newEntry = {
      id: 'j_' + Date.now(),
      date: getTodayDateString(),
      ...entry
    };
    this.data.journals.unshift(newEntry);
    this.addXP(40);
    this.save();
    return newEntry;
  }

  deleteJournal(id) {
    this.data.journals = this.data.journals.filter(j => j.id !== id);
    this.save();
  }

  getTodos() {
    return this.data.todoList || [];
  }

  addTodo(task) {
    const newTask = {
      id: 'td_' + Date.now(),
      completed: false,
      subtasks: [],
      tags: [],
      ...task
    };
    this.data.todoList.push(newTask);
    this.save();
    return newTask;
  }

  updateTodo(id, updates) {
    this.data.todoList = this.data.todoList.map(t => t.id === id ? { ...t, ...updates } : t);
    if (updates.completed) {
      this.addXP(15);
    }
    this.save();
  }

  deleteTodo(id) {
    this.data.todoList = this.data.todoList.filter(t => t.id !== id);
    this.save();
  }

  getHabits() {
    return this.data.habits || [];
  }

  addHabit(habit) {
    const newHabit = {
      id: 'h_' + Date.now(),
      streak: 0,
      history: {},
      frequency: 'Daily',
      target: 7,
      ...habit
    };
    this.data.habits.push(newHabit);
    this.save();
    return newHabit;
  }

  toggleHabit(id, dateStr) {
    this.data.habits = this.data.habits.map(h => {
      if (h.id === id) {
        const history = { ...h.history };
        if (history[dateStr]) {
          delete history[dateStr];
          h.streak = Math.max(0, h.streak - 1);
        } else {
          history[dateStr] = true;
          h.streak += 1;
          this.addXP(20);
        }
        return { ...h, history };
      }
      return h;
    });
    this.save();
  }

  deleteHabit(id) {
    this.data.habits = this.data.habits.filter(h => h.id !== id);
    this.save();
  }

  getGoals() {
    return this.data.goals || [];
  }

  addGoal(goal) {
    const newGoal = {
      id: 'g_' + Date.now(),
      milestones: [],
      progress: 0,
      tasks: [],
      ...goal
    };
    this.data.goals.push(newGoal);
    this.save();
    return newGoal;
  }

  updateGoal(id, updates) {
    this.data.goals = this.data.goals.map(g => {
      if (g.id === id) {
        const updated = { ...g, ...updates };
        if (updated.milestones && updated.milestones.length > 0) {
          const completedCount = updated.milestones.filter(m => m.completed).length;
          updated.progress = Math.round((completedCount / updated.milestones.length) * 100);
          if (updated.progress === 100) {
            if (!updated.completedAt) {
              updated.completedAt = new Date().toISOString().split('T')[0];
            }
          } else {
            delete updated.completedAt;
          }
        }
        return updated;
      }
      return g;
    });
    this.save();
  }

  deleteGoal(id) {
    this.data.goals = this.data.goals.filter(g => g.id !== id);
    this.save();
  }

  getPlannerForDate(dateStr) {
    if (!this.data.planners[dateStr]) {
      return {
        morningRoutine: [],
        eveningRoutine: [],
        priorities: [],
        timeblocks: [],
        notes: '',
        reflection: '',
        tomorrowPlan: ''
      };
    }
    return this.data.planners[dateStr];
  }

  savePlannerForDate(dateStr, plannerData) {
    this.data.planners[dateStr] = { ...this.getPlannerForDate(dateStr), ...plannerData };
    this.save();
  }

  updateHealthPlanner(fields) {
    this.data.healthPlanner = { ...this.data.healthPlanner, ...fields };
    this.save();
  }

  addWaterCup(dateStr) {
    const current = this.data.healthPlanner.waterIntake[dateStr] || 0;
    this.data.healthPlanner.waterIntake[dateStr] = current + 1;
    this.addXP(5);
    this.save();
  }

  updateMealPlanner(fields) {
    this.data.mealPlanner = { ...this.data.mealPlanner, ...fields };
    this.save();
  }

  updateFinancePlanner(fields) {
    this.data.financePlanner = { ...this.data.financePlanner, ...fields };
    this.save();
  }

  addExpense(exp) {
    const newExp = { id: 'exp_' + Date.now(), date: getTodayDateString(), ...exp };
    this.data.financePlanner.expenses.unshift(newExp);
    this.save();
  }

  addIncome(inc) {
    const newInc = { id: 'inc_' + Date.now(), date: getTodayDateString(), ...inc };
    this.data.financePlanner.income.unshift(newInc);
    this.save();
  }

  getCalendarEvents() {
    return this.data.calendarEvents;
  }

  addCalendarEvent(event) {
    const newEvent = { id: 'ev_' + Date.now(), recurring: 'None', ...event };
    this.data.calendarEvents.push(newEvent);
    this.save();
    return newEvent;
  }

  deleteCalendarEvent(id) {
    this.data.calendarEvents = this.data.calendarEvents.filter(e => e.id !== id);
    this.save();
  }

  getVisionBoards() {
    return this.data.visionBoards;
  }

  saveVisionBoards(boards) {
    this.data.visionBoards = boards;
    this.save();
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(defaultDatabase));
    this.save();
  }
}

export const db = new LifeFlowDatabase();
