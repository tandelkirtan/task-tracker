import React from 'react';
import {
  User,
  Bell,
  Shield,
  Lock,
  AlertTriangle,
  ChevronLeft,
  Mail
} from 'lucide-react';
import type { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser
}) => {

  return (
    <div className="px-8 py-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary">Settings</h2>
          <p className="text-text-muted text-sm mt-1 font-medium">
            Manage your profile and application preferences.
          </p>
        </div>

        <div className="bg-bg-card rounded-[40px] border border-border-main shadow-sm overflow-hidden transition-all duration-300">
          {/* Profile Section */}
          <div className="p-10 border-b border-border-main/50">
            <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
              <User className="w-6 h-6 text-brand-blue" />
              Profile Information
            </h3>

            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                    className="w-full px-6 py-4 bg-bg-input border-2 border-transparent focus:border-brand-blue/20 focus:bg-bg-card rounded-[20px] outline-none transition-all font-bold text-text-primary shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                    className="w-full px-6 py-4 bg-bg-input border-2 border-transparent focus:border-brand-blue/20 focus:bg-bg-card rounded-[20px] outline-none transition-all font-bold text-text-primary shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={user.bio}
                  onChange={(e) => onUpdateUser({ ...user, bio: e.target.value })}
                  className="w-full px-6 py-4 bg-bg-input border-2 border-transparent focus:border-brand-blue/20 focus:bg-bg-card rounded-[20px] outline-none transition-all font-bold text-text-primary resize-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Security & Notifications */}
          <div className="p-10">
            <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-blue" />
              Security & Notifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-bg-input rounded-[24px] border border-border-main shadow-sm">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-brand-blue" />
                    <span className="text-sm font-bold text-text-primary">Push Notifications</span>
                  </div>
                  <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 bg-bg-input rounded-[24px] border border-border-main shadow-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-blue" />
                    <span className="text-sm font-bold text-text-primary">Email Alerts</span>
                  </div>
                  <div className="w-12 h-6 bg-border-main rounded-full relative cursor-pointer border border-border-main">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-text-muted rounded-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <button className="w-full flex items-center justify-between p-5 bg-bg-input rounded-[24px] border border-border-main hover:bg-bg-card transition-all text-left shadow-sm group">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-brand-blue" />
                    <span className="text-sm font-bold text-text-primary group-hover:text-brand-blue transition-colors">
                      Change Password
                    </span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-text-muted rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-brand-red/5 rounded-[24px] border border-brand-red/10 hover:bg-brand-red/10 transition-all text-left group shadow-sm">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-brand-red" />
                    <span className="text-sm font-bold text-brand-red">Delete Account</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
