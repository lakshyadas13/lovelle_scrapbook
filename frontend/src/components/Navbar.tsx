'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import { useState, useEffect } from 'react';
import { AVATAR_PRESETS } from '@/config/platform';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentUser, 
    scrapbooks, 
    activeScrapbook, 
    setActiveScrapbook, 
    signOut 
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [isBookMenuOpen, setIsBookMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTopHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerSparkles(e.clientX, e.clientY, 'tapper');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/good-things', label: 'Highlights', icon: 'auto_awesome' },
    { href: '/plans', label: 'Plans', icon: 'calendar_today' },
    { href: '/oopsie', label: 'Work On', icon: 'psychology_alt' },
    { href: '/progress', label: 'Counters', icon: 'favorite' },
  ];

  const desktopNavItems = [
    ...navItems,
    { href: '/memory-timeline', label: 'Timeline', icon: 'photo_library' },
    { href: '/love-letters', label: 'Letter Vault', icon: 'mail' },
    { href: '/decks', label: 'Card Decks', icon: 'style' },
  ];

  const userAvatar = currentUser?.avatar_url || AVATAR_PRESETS[0].url;

  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-sm border-b-2 border-primary/20">
        <div className="flex justify-between items-center w-full px-4 py-2.5 max-w-[1440px] mx-auto">
          {/* Left Brand & Scrapbook Selector */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline rotate-[-3deg] shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer bg-white flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 45 C50 65 52 80 50 92" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
                  <path d="M50 75 C35 70 28 58 32 48 C36 50 42 62 50 72" fill="#81C784" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 82 C65 78 72 68 68 58 C64 60 58 70 50 78" fill="#81C784" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 12 C40 28 60 28 50 12Z" fill="#FF8FA3" stroke="#C2185B" strokeWidth="2.5" />
                  <path d="M50 45 C28 42 22 20 40 18 C50 25 48 38 50 45Z" fill="#FF6B8B" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 45 C72 42 78 20 60 18 C50 25 52 38 50 45Z" fill="#FF6B8B" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 45 C38 42 38 18 50 15 C62 18 62 42 50 45Z" fill="#FF4081" stroke="#C2185B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-gloria text-xl sm:text-2xl font-bold text-primary hover:opacity-85 transition-opacity cursor-pointer">
                Lovelle Scrapbook
              </span>
            </Link>

            {/* Scrapbook Switcher Button (Authenticated only) */}
            {currentUser && activeScrapbook && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsBookMenuOpen(!isBookMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-primary-container/30 border border-primary/30 rounded-full font-patrick text-sm text-primary hover:bg-primary-container/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">auto_stories</span>
                  <span className="max-w-[130px] truncate font-bold">{activeScrapbook.title}</span>
                  <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                </button>

                {isBookMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border-2 border-outline-variant shadow-lg rounded-md p-2 z-50 animate-scaleUp">
                    <p className="font-patrick text-xs text-outline px-2 py-1 uppercase tracking-wider">Your Scrapbooks</p>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {scrapbooks.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setActiveScrapbook(b.id);
                            setIsBookMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded font-patrick text-base flex items-center justify-between ${
                            b.id === activeScrapbook.id
                              ? 'bg-primary-container text-on-primary-container font-bold'
                              : 'hover:bg-surface-variant/40 text-on-surface'
                          }`}
                        >
                          <span className="truncate">{b.title}</span>
                          {b.id === activeScrapbook.id && (
                            <span className="material-symbols-outlined text-sm text-primary">check</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-dashed border-outline-variant mt-2 pt-2">
                      <Link
                        href="/"
                        onClick={() => setIsBookMenuOpen(false)}
                        className="w-full text-left px-3 py-1 text-primary font-patrick text-sm flex items-center gap-1 hover:underline"
                      >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        Manage & Create Scrapbooks
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Desktop Navigation Links */}
          {currentUser ? (
            <nav className="hidden lg:flex items-center gap-4">
              {desktopNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 font-patrick text-base cursor-pointer ${
                      isActive 
                        ? 'bg-primary-container text-on-primary-container border-2 border-primary/20 rotate-1 font-bold' 
                        : 'text-on-surface-variant hover:bg-primary-container/20'
                    }`}>
                      <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="font-patrick text-lg text-on-surface-variant hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#themes" className="font-patrick text-lg text-on-surface-variant hover:text-primary transition-colors">
                Themes
              </Link>
              <Link href="/#preview" className="font-patrick text-lg text-on-surface-variant hover:text-primary transition-colors">
                Doodle Preview
              </Link>
            </nav>
          )}

          {/* Right Action / Profile Menu */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleTopHeartClick}
              className="text-primary hover:bg-primary-container/20 transition-all p-2 rounded-full active:scale-90"
              aria-label="Sparkle Love"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-primary-container/20 transition-all cursor-pointer border border-primary/30"
                  title="My Profile"
                >
                  <img
                    src={userAvatar}
                    alt={currentUser.display_name}
                    className="w-8 h-8 rounded-full object-cover bg-white"
                  />
                  <span className="hidden sm:inline font-patrick text-base font-bold text-primary pr-2">
                    {currentUser.display_name}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-outline-variant shadow-lg rounded-md p-3 z-50 animate-scaleUp">
                    <div className="flex items-center gap-3 pb-3 border-b border-dashed border-outline-variant">
                      <img src={userAvatar} alt="avatar" className="w-10 h-10 rounded-full border border-primary" />
                      <div className="overflow-hidden">
                        <p className="font-gloria text-base text-primary truncate">{currentUser.display_name}</p>
                        <p className="font-patrick text-xs text-secondary truncate">{currentUser.profile_title || 'Little Dreamer'}</p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1">
                      <Link
                        href="/"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full text-left px-2 py-1.5 font-patrick text-base text-on-surface hover:bg-surface-variant/40 rounded flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">book</span>
                        My Scrapbooks
                      </Link>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-2 py-1.5 font-patrick text-base text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="sticker-btn px-4 py-1.5 bg-primary text-white font-patrick text-base active:scale-95 transition-all"
                >
                  Log In / Join 💌
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Nav Bar (Mobile Only - Authenticated) */}
      {currentUser && (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white/95 border-t-2 border-primary/20 pb-safe pt-1 shadow-[0_-4px_0_rgba(129,116,120,0.05)]">
          <div className="flex justify-around items-center w-full px-1 max-w-[1440px] mx-auto h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              if (item.href === '/plans') {
                return (
                  <Link key={item.href} href={item.href} className="flex flex-col items-center relative -top-3">
                    <div className={`w-13 h-13 border-2 rounded-full flex items-center justify-center shadow-lg rotate-2 active:scale-90 transition-transform ${
                      isActive 
                        ? 'bg-primary text-white border-white scale-105' 
                        : 'bg-primary-container text-on-primary-container border-primary'
                    }`}>
                      <span className="material-symbols-outlined text-2xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                        {item.icon}
                      </span>
                    </div>
                    <span className={`font-patrick text-xs mt-0.5 font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  <span className={`flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'text-primary scale-105 font-bold' 
                      : 'text-on-surface-variant/70 active:scale-95'
                  }`}>
                    <span className="material-symbols-outlined text-2xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {item.icon}
                    </span>
                    <span className="font-patrick text-xs">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
