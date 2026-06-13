import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import type { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-inherit border-b border-border-main/50">
      <div /> {/* Spacer for flex-between */}
      
      <div className="flex items-center gap-6">
        <button className="p-2.5 bg-bg-card rounded-xl shadow-md text-text-muted hover:text-text-primary transition-colors relative border border-border-main/50 hover:shadow-lg hover:scale-105">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-red rounded-full border-2 border-bg-card" />
        </button>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-card rounded-xl shadow-md text-text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all border border-border-main/50 hover:border-brand-red/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold hidden sm:block">Logout</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 ml-2 cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-soft to-accent/20 text-accent font-bold flex items-center justify-center border-2 border-transparent group-hover:border-accent transition-all overflow-hidden shadow-md group-hover:shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.split(' ').map(n => n[0]).join('').toUpperCase()
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-text-primary leading-none">{user.name}</p>
            <p className="text-[11px] font-bold text-text-muted mt-1 uppercase tracking-widest opacity-70">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
