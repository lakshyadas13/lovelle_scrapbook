'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import { useRouter } from 'next/navigation';
import { PROFILE_TITLE_PRESETS, AVATAR_PRESETS } from '@/config/platform';

export default function LoginPage() {
  const router = useRouter();
  const { 
    currentUser, 
    signUp, 
    signIn, 
    isLoading, 
    error 
  } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('Little Dreamer');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    triggerSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'dashboard');

    const effectiveTitle = customTitle.trim() || selectedTitle;

    try {
      if (mode === 'signup') {
        await signUp(
          email.trim(), 
          password, 
          displayName.trim() || 'Doodle Friend', 
          effectiveTitle, 
          selectedAvatar
        );
        router.push('/');
      } else {
        await signIn(email.trim(), password);
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 pt-28 pb-12 flex items-center justify-center min-h-[85vh] doodle-bg-dots">
      <div className="taped-paper sketchy-border p-6 sm:p-8 max-w-lg w-full relative bg-white transition-all duration-300">
        <span className="material-symbols-outlined absolute -top-5 -left-3 text-tertiary/40 text-4xl floating-heart">favorite</span>
        <span className="material-symbols-outlined absolute top-1/2 -right-5 text-secondary/30 text-3xl doodle-sparkle">auto_awesome</span>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-400 rounded font-patrick text-red-700 text-base">
            ⚠️ {error}
          </div>
        )}

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/85 z-50 flex flex-col items-center justify-center rounded">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-patrick text-xl text-primary mt-3">Opening your scrapbook...</p>
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === 'signin' && (
          <>
            <h2 className="font-gloria text-3xl text-primary text-center mb-1">Welcome Back</h2>
            <p className="font-patrick text-lg text-on-surface-variant text-center mb-6">Open your cozy digital scrapbook pages.</p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="e.g. cozy@scrapbook.com"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-4"
              >
                Open My Scrapbook 📖✨
              </button>

              <p className="font-patrick text-center text-lg mt-4 text-on-surface-variant">
                New to Lovelle Scrapbook?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('signup')}
                  className="text-primary underline font-bold"
                >
                  Create Your Free Account
                </button>
              </p>
            </form>
          </>
        )}

        {/* MODE 2: SIGN UP */}
        {mode === 'signup' && (
          <>
            <h2 className="font-gloria text-3xl text-primary text-center mb-1">Join Lovelle Scrapbook</h2>
            <p className="font-patrick text-lg text-on-surface-variant text-center mb-6">
              Create your profile to start curating memories.
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="e.g. Maya or Sam"
                  required
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Choose a Doodle Avatar</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 bg-primary-container/10 rounded border border-dashed border-primary/30">
                  {AVATAR_PRESETS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`w-10 h-10 rounded-full border-2 overflow-hidden p-0.5 bg-white transition-all ${
                        selectedAvatar === av.url ? 'border-primary ring-2 ring-primary/40 scale-110' : 'border-outline-variant/50 hover:scale-105'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile Title Selector */}
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Cute Profile Title (Optional)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PROFILE_TITLE_PRESETS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedTitle(item.label);
                        setCustomTitle('');
                      }}
                      className={`px-2.5 py-1 rounded-full font-patrick text-sm transition-all border ${
                        selectedTitle === item.label && !customTitle
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white text-on-surface border-outline-variant hover:bg-primary-container/20'
                      }`}
                    >
                      {item.emoji} {item.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full h-9 px-3 doodle-border bg-surface-container-lowest font-patrick text-sm placeholder:text-outline"
                  placeholder="Or type a custom title (e.g. Tea Enthusiast, Story Collector)"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="e.g. cozy@scrapbook.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-patrick text-lg text-primary block mb-1">Create Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 doodle-border bg-surface-container-lowest font-patrick text-lg"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <button 
                type="submit"
                className="sticker-btn w-full py-3 bg-primary text-white text-xl active:translate-y-1 transition-all mt-4"
              >
                Create Account & Scrapbook 🎨✨
              </button>

              <p className="font-patrick text-center text-lg mt-4 text-on-surface-variant">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setMode('signin')}
                  className="text-primary underline font-bold"
                >
                  Sign In
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
