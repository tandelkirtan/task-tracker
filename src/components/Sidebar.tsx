import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Flag, 
  Settings, 
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../utils';
import type { View, UserProfile } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { icon: any; label: View; displayLabel: string }[] = [
    { icon: LayoutDashboard, label: 'Board', displayLabel: 'Board' },
    { icon: CheckSquare, label: 'My Tasks', displayLabel: 'My Tasks' },
    { icon: Calendar, label: 'Calendar', displayLabel: 'Calendar' },
    { icon: Flag, label: 'Priority', displayLabel: 'Status' },
    { icon: Settings, label: 'Settings', displayLabel: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-2 bg-bg-card rounded-xl shadow-md border border-border-main"
      >
        {isOpen ? <X className="w-6 h-6 text-text-primary" /> : <Menu className="w-6 h-6 text-text-primary" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 w-72 bg-bg-sidebar border-r border-border-main flex flex-col h-screen transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center gap-4 border-b border-border-main/50">
          <div className="bg-gradient-to-br from-brand-blue to-accent p-2 rounded-xl shadow-lg shadow-brand-blue/30">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Task Manager</h1>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Pro Edition</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onViewChange(item.label);
                setIsOpen(false);
              }}
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
          <div className="bg-gradient-to-br from-bg-input to-bg-card rounded-[32px] p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl border border-border-main/50">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-bg-card rounded-2xl shadow-md flex items-center justify-center mb-4 border border-border-main/30">
                 <img src="/src/assets/hero.png" alt="Stay organized" className="w-9 h-9 object-contain" />
              </div>
              <p className="text-text-primary font-bold text-sm leading-snug">
                Stay organized.<br />Get things done. 🚀
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 flex-1 bg-brand-blue/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-brand-blue to-accent rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-brand-blue">75%</span>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br from-brand-blue/10 to-accent/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
