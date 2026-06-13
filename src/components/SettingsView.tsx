import React from 'react';
import {
  User,
  Bell,
  Shield,
  Lock,
  AlertTriangle,
  ChevronLeft,
  Mail,
  LogOut
} from 'lucide-react';
import type { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout?: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onLogout
}) => {

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto pb-20 lg:pb-20">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">Settings</h2>
          <p className="text-text-muted text-xs lg:text-sm mt-1 font-medium">
            Manage your profile and application preferences.
          </p>
        </div>

        <div className="bg-bg-card rounded-[32px] lg:rounded-[40px] border border-border-main shadow-sm overflow-hidden transition-all duration-300">
          {/* Profile Section */}
          <div className="p-6 lg:p-10 border-b border-border-main/50">
            <h3 className="text-lg lg:text-xl font-bold text-text-primary mb-4 lg:mb-8 flex items-center gap-3">
              <User className="w-5 h-5 lg:w-6 lg:h-6 text-brand-blue" />
              Profile Information
            </h3>

            <div className="space-y-4 lg:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                    className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-brand-blue/20 focus:bg-bg-card rounded-[16px] lg:rounded-[20px] outline-none transition-all font-bold text-text-primary shadow-sm text-sm lg:text-base"
                  />
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                    className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-brand-blue/20 focus:bg-bg-card rounded-[16px] lg:rounded-[20px] outline-none transition-all font-bold text-text-primary shadow-sm text-sm lg:text-base"
                  />
                </div>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={user.bio}
                  onChange={(e) => onUpdateUser({ ...user, bio: e.target.value })}
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-brand-blue/20 focus:bg-bg-card rounded-[16px] lg:rounded-[20px] outline-none transition-all font-bold text-text-primary resize-none shadow-sm text-sm lg:text-base"
                />
              </div>
            </div>
          </div>

          {/* Security & Notifications */}
          <div className="p-6 lg:p-10">
            <h3 className="text-lg lg:text-xl font-bold text-text-primary mb-4 lg:mb-8 flex items-center gap-3">
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-brand-blue" />
              Security & Notifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center justify-between p-4 lg:p-5 bg-bg-input rounded-[20px] lg:rounded-[24px] border border-border-main shadow-sm">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-brand-blue" />
                    <span className="text-xs lg:text-sm font-bold text-text-primary">Push Notifications</span>
                  </div>
                  <div className="w-10 h-5 lg:w-12 lg:h-6 bg-brand-blue rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-0.5 lg:right-1 top-0.5 lg:top-1 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 lg:p-5 bg-bg-input rounded-[20px] lg:rounded-[24px] border border-border-main shadow-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-brand-blue" />
                    <span className="text-xs lg:text-sm font-bold text-text-primary">Email Alerts</span>
                  </div>
                  <div className="w-10 h-5 lg:w-12 lg:h-6 bg-border-main rounded-full relative cursor-pointer border border-border-main">
                    <div className="absolute left-0.5 lg:left-1 top-0.5 lg:top-1 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-text-muted rounded-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <button className="w-full flex items-center justify-between p-4 lg:p-5 bg-bg-input rounded-[20px] lg:rounded-[24px] border border-border-main hover:bg-bg-card transition-all text-left shadow-sm group">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 lg:w-5 lg:h-5 text-brand-blue" />
                    <span className="text-xs lg:text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors">
                      Change Password
                    </span>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-text-muted rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-4 lg:p-5 bg-brand-red/5 rounded-[20px] lg:rounded-[24px] border border-brand-red/10 hover:bg-brand-red/10 transition-all text-left group shadow-sm">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-brand-red" />
                    <span className="text-xs lg:text-sm font-bold text-brand-red">Delete Account</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="lg:hidden w-full mt-6 flex items-center justify-center gap-2 p-4 bg-brand-red/5 rounded-[20px] border border-brand-red/10 hover:bg-brand-red/10 transition-all group shadow-sm"
              >
                <LogOut className="w-4 h-4 text-brand-red" />
                <span className="text-sm font-bold text-brand-red">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
