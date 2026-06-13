import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Flag
} from 'lucide-react';
import { cn } from '../utils';
import type { View, UserProfile } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, user }) => {
  const navItems: { icon: any; label: View; displayLabel: string }[] = [
    { icon: LayoutDashboard, label: 'Board', displayLabel: 'Board' },
    { icon: CheckSquare, label: 'My Tasks', displayLabel: 'My Tasks' },
    { icon: Calendar, label: 'Calendar', displayLabel: 'Calendar' },
    { icon: Flag, label: 'Priority', displayLabel: 'Status' },
  ];

  return (
    <aside className="hidden lg:flex lg:sticky top-0 left-0 z-40 w-72 bg-bg-sidebar border-r border-border-main flex-col h-screen shadow-xl">
        <div className="p-8 flex items-center gap-4 border-b border-border-main/50">
          <div className="p-2 rounded-xl">
            <img src="/favicon.png" alt="Task Tracker Logo" className="w-16 h-16" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Task Tracker</h1>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Pro Edition</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onViewChange(item.label)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                activeView === item.label 
                  ? "bg-gradient-to-r from-brand-blue/10 to-accent/10 text-accent border border-accent/20 shadow-md" 
                  : "text-text-muted hover:bg-bg-input hover:text-text-primary border border-transparent"
              )}
            >
              {activeView === item.label && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-lg shadow-accent/50" />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                activeView === item.label ? "text-accent" : "text-text-muted group-hover:text-text-primary"
              )} />
              <span className="font-bold text-sm relative z-10">{item.displayLabel}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <p className="text-center text-text-muted text-xs font-bold">
            Made by{' '}
            <a 
              href="https://kirtandel.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-brand-blue transition-colors"
            >
              kirtandel
            </a>
          </p>
        </div>
      </aside>
  );
};

export default Sidebar;
