import React, { useState } from 'react';
import { Globe, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        <div className="bg-bg-card rounded-[40px] border border-border-main shadow-2xl p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-blue/20">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Task Manager</h1>
            <p className="text-text-muted text-xs font-medium">
              {isLogin ? 'Sign in to manage your tasks' : 'Create your account to get started'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-brand-red/10 border border-brand-red/20 rounded-xl">
              <p className="text-[11px] font-bold text-brand-red">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-brand-green/10 border border-brand-green/20 rounded-xl">
              <p className="text-[11px] font-bold text-brand-green">{success}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-3 bg-bg-input hover:bg-bg-card border-2 border-border-main hover:border-brand-blue/30 px-6 py-3.5 rounded-2xl font-bold text-text-primary transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/10 group mb-6"
          >
            <Globe className="w-5 h-5 text-text-muted group-hover:text-brand-blue transition-colors" />
            <span>{isSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border-main/50"></div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border-main/50"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-bg-input border-2 border-border-main rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-brand-blue focus:outline-none transition-colors font-medium text-sm"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-bg-input border-2 border-border-main rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-brand-blue focus:outline-none transition-colors font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-bg-input border-2 border-border-main rounded-2xl text-text-primary placeholder:text-text-muted/50 focus:border-brand-blue focus:outline-none transition-colors font-medium text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-accent hover:from-brand-blue/90 hover:to-accent/90 px-6 py-3.5 rounded-2xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/20 group"
            >
              <span>{isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-text-muted text-xs font-medium">
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
          <p className="mt-6 text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60 text-center">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
