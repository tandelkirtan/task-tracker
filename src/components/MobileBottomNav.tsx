import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Flag, Plus } from 'lucide-react';
import { cn } from '../utils';
import type { View } from '../types';

interface MobileBottomNavProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onAddTask: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeView, onViewChange, onAddTask }) => {
  const navItems = [
    { label: 'Board' as View, displayLabel: 'Board', icon: LayoutDashboard },
    { label: 'My Tasks' as View, displayLabel: 'My Tasks', icon: CheckSquare },
    { label: 'Calendar' as View, displayLabel: 'Calendar', icon: Calendar },
    { label: 'Priority' as View, displayLabel: 'Status', icon: Flag },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-main/50 z-50 px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Left side: Board and My Tasks */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.label}
              onClick={() => onViewChange(item.label)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                activeView === item.label
                  ? "text-accent bg-accent/10"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-input/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.displayLabel}</span>
            </button>
          ))}
        </div>

        {/* Middle: Add Task button - embossed */}
        <button
          onClick={onAddTask}
          className="relative -top-4 w-14 h-14 bg-gradient-to-br from-brand-blue to-accent rounded-full shadow-xl shadow-brand-blue/30 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all border-4 border-bg-card"
        >
          <Plus className="w-7 h-7" />
        </button>

        {/* Right side: Calendar and Status */}
        <div className="flex items-center gap-1 flex-1 justify-start">
          {navItems.slice(2, 4).map((item) => (
            <button
              key={item.label}
              onClick={() => onViewChange(item.label)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                activeView === item.label
                  ? "text-accent bg-accent/10"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-input/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.displayLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
