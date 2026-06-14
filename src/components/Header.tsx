import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import type { UserProfile } from '../types';
import ConfirmModal from './ConfirmModal';

interface HeaderProps {
  user: UserProfile;
  onLogout?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onSettingsClick }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };
  return (
    <>
      <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 bg-inherit border-b border-border-main/50">
      <div className="flex items-center gap-3">
        <img src="/favicon.png" alt="Task Tracker Logo" className="w-8 h-8 lg:w-10 lg:h-10" />
        <span className="text-lg lg:text-xl font-bold text-text-primary tracking-tight">Task Tracker</span>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        {onLogout && (
          <button 
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-bg-card rounded-xl shadow-md text-text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all border border-border-main/50 hover:border-brand-red/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-bold">Logout</span>
          </button>
        )}
        
        <div 
          className="flex items-center gap-2 lg:gap-3 ml-2 cursor-pointer group"
          onClick={onSettingsClick}
        >
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-accent-soft to-accent/20 text-accent font-bold flex items-center justify-center border-2 border-transparent group-hover:border-accent transition-all overflow-hidden shadow-md group-hover:shadow-lg">
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
    
    <ConfirmModal
      isOpen={showLogoutConfirm}
      onClose={() => setShowLogoutConfirm(false)}
      onConfirm={confirmLogout}
      title="Logout"
      message="Are you sure you want to logout? You'll need to sign in again to access your tasks."
      confirmText="Logout"
      cancelText="Cancel"
      variant="danger"
    />
  </>
  );
};

export default Header;
