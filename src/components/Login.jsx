import React, { useState } from 'react';
import { Globe, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const { signIn, signUp, loginWithGoogle, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        setSuccess('Login successful!');
      } else {
        await signUp(email, password, name);
        setSuccess('Registration successful! Please check your email to verify your account.');
        // Clear form
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-bg-card rounded-[32px] lg:rounded-[40px] border border-border-main shadow-2xl p-6 lg:p-10">
          {/* Logo */}
          <div className="text-center mb-4 lg:mb-8">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <img src="/favicon.png" alt="Task Tracker Logo" className="w-12 h-12 lg:w-16 lg:h-16" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-text-primary mb-1 lg:mb-2">Task Tracker</h1>
            <p className="text-text-muted text-[10px] lg:text-xs font-medium">
              {isLogin ? 'Sign in to manage your tasks' : 'Create your account to get started'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 bg-brand-red/10 border border-brand-red/20 rounded-xl">
              <p className="text-[10px] lg:text-[11px] font-bold text-brand-red">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-3 lg:mb-4 p-2.5 lg:p-3 bg-brand-green/10 border border-brand-green/20 rounded-xl">
              <p className="text-[10px] lg:text-[11px] font-bold text-brand-green">{success}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-3 bg-bg-input hover:bg-bg-card border-2 border-border-main hover:border-brand-blue/30 px-4 lg:px-6 py-3 lg:py-3.5 rounded-2xl font-bold text-text-primary transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/10 group mb-4 lg:mb-6"
          >
            <GoogleIcon />
            <span className="text-xs lg:text-sm">{isSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-4 lg:mb-6">
            <div className="flex-1 h-px bg-border-main/50"></div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border-main/50"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5 lg:mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3.5 bg-bg-input border-2 border-border-main rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-brand-blue focus:outline-none transition-colors font-medium text-xs lg:text-sm"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5 lg:mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3.5 bg-bg-input border-2 border-border-main rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-brand-blue focus:outline-none transition-colors font-medium text-xs lg:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5 lg:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3.5 bg-bg-input border-2 border-border-main rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-brand-blue focus:outline-none transition-colors font-medium text-xs lg:text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-accent hover:from-brand-blue/90 hover:to-accent/90 px-4 lg:px-6 py-3 lg:py-3.5 rounded-2xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/20 group"
            >
              <span className="text-xs lg:text-sm">{isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
              <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-4 lg:mt-6 text-center">
            <p className="text-text-muted text-[10px] lg:text-xs font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-brand-blue font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-4 lg:mt-6 text-[9px] lg:text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60 text-center">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
