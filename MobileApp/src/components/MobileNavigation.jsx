import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  BookOpen, 
  FolderHeart, 
  Menu,
  Sparkles,
  Target
} from 'lucide-react';

export default function MobileNavigation({ activeView, setActiveView, onOpenCoach }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'planner', label: 'Planner', icon: CalendarRange },
    { id: 'journals', label: 'Journals', icon: BookOpen },
    { id: 'habits-goals', label: 'Habits & Goals', icon: Target },
    { id: 'planners', label: 'Life Planners', icon: FolderHeart },
    { id: 'more', label: 'More', icon: Menu }
  ];

  return (
    <div className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id || (tab.id === 'more' && ['vision-purpose', 'wellness', 'analytics', 'gamification'].includes(activeView));
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            style={{ width: 'auto', flex: 1 }}
          >
            <Icon size={18} />
            <span style={{ fontSize: '0.6rem', whiteSpace: 'nowrap' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
