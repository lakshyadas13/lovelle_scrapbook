'use client';

import { useEffect, useState } from 'react';
import { useStore, Mood } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';
import Link from 'next/link';
import { THEME_OPTIONS, ScrapbookThemeKey } from '@/config/platform';

const MOOD_ASSETS = {
  happy: { emoji: '😊', label: 'Happy', bg: 'bg-yellow-100/60' },
  inspired: { emoji: '✨', label: 'Inspired', bg: 'bg-primary-container/30' },
  cozy: { emoji: '☕', label: 'Cozy', bg: 'bg-amber-100/60' },
  dreaming: { emoji: '💭', label: 'Dreaming', bg: 'bg-purple-100/40' },
  sleepy: { emoji: '😴', label: 'Sleepy', bg: 'bg-blue-100/40' },
  in_love: { emoji: '🥰', label: 'Grateful', bg: 'bg-rose-100/60' },
  miss_you: { emoji: '🥺', label: 'Yearning', bg: 'bg-tertiary-container/30' },
  angry: { emoji: '😤', label: 'Frustrated', bg: 'bg-red-100/50' },
};

const HIGHLIGHT_ICONS = [
  { icon: 'restaurant', color: 'text-secondary' },
  { icon: 'auto_awesome', color: 'text-primary' },
  { icon: 'coffee', color: 'text-tertiary' },
  { icon: 'favorite', color: 'text-secondary' },
];

export default function HomePage() {
  const { 
    currentUser, 
    activeScrapbook, 
    scrapbooks,
    members,
    moods, 
    interactiveCounters, 
    dailyHighlights, 
    vaultLetters,
    memories,
    cardDecks,
    updateMood, 
    incrementCounter,
    addDailyHighlight,
    createScrapbook,
    createInvite,
    joinScrapbook,
    isLoading
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [daysCount, setDaysCount] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Modals state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Form states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteTag, setNoteTag] = useState('SmallJoy');

  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookDesc, setNewBookDesc] = useState('');
  const [newBookTheme, setNewBookTheme] = useState<ScrapbookThemeKey>('pink_doodle');
  const [newBookPrivacy, setNewBookPrivacy] = useState<'private' | 'collaborative'>('private');

  const [joinCode, setJoinCode] = useState('');
  const [inviteCodeText, setInviteCodeText] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Preview theme selection for public landing page
  const [previewTheme, setPreviewTheme] = useState<ScrapbookThemeKey>('pink_doodle');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live Counter Calculation
  useEffect(() => {
    if (!activeScrapbook?.start_date || !activeScrapbook.show_counter) return;

    const startDate = new Date(activeScrapbook.start_date);

    const updateCounter = () => {
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      
      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        setDaysCount({ days, hours, minutes, seconds });
      } else {
        setDaysCount({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, [activeScrapbook?.start_date, activeScrapbook?.show_counter]);

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    try {
      await createScrapbook({
        title: newBookTitle.trim(),
        description: newBookDesc.trim() || undefined,
        theme: newBookTheme,
        privacy: newBookPrivacy,
      });
      setIsNewBookModalOpen(false);
      setNewBookTitle('');
      setNewBookDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenInviteModal = async () => {
    if (!activeScrapbook) return;
    try {
      const code = await createInvite(activeScrapbook.id);
      setInviteCodeText(code);
      setIsInviteModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      await joinScrapbook(joinCode.trim());
      setIsJoinModalOpen(false);
      setJoinCode('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addDailyHighlight({
      title: noteTitle.trim(),
      description: noteDescription.trim() || 'Recorded in scrapbook highlights.',
      time: timeStr,
      tags: [noteTag],
      image_url: null,
    });

    setNoteTitle('');
    setNoteDescription('');
    setIsNoteModalOpen(false);
  };

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen doodle-bg-dots flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-patrick text-2xl text-primary mt-4 animate-bounce">Opening Lovelle Scrapbook...</p>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 1: PUBLIC LANDING PAGE (Unauthenticated visitors)
  // =========================================================================
  if (!currentUser) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 pt-24 pb-16 doodle-bg-dots min-h-screen">
        {/* Hero Section */}
        <section className="text-center py-12 px-2 max-w-4xl mx-auto relative">
          <div className="taped-paper sketchy-border p-8 sm:p-12 bg-white relative">
            <span className="material-symbols-outlined absolute -top-5 -left-3 text-tertiary/40 text-5xl floating-heart">favorite</span>
            <span className="material-symbols-outlined absolute -bottom-5 -right-3 text-primary/40 text-5xl doodle-sparkle">auto_awesome</span>

            <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container font-patrick text-base font-bold mb-4 rotate-1">
              ✨ Welcome to Lovelle Scrapbook
            </span>

            <h1 className="font-gloria text-3xl sm:text-5xl md:text-6xl text-primary mb-4 leading-tight">
              A Cozy Digital Scrapbook for Cherished Moments
            </h1>

            <p className="font-patrick text-xl sm:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
              Capture daily highlights, celebrate milestones, pin polaroid memories, write future time-capsule letters, and collaborate with loved ones or journal solo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/login"
                className="sticker-btn px-8 py-3.5 bg-primary text-white font-patrick text-2xl active:scale-95 transition-all shadow-md"
              >
                Create Your Free Scrapbook 💌
              </Link>
              <Link
                href="/login"
                className="sketchy-border px-6 py-3 bg-white text-primary font-patrick text-xl hover:bg-primary-container/20 transition-colors"
              >
                Sign In to Existing Book
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="py-12 px-2">
          <h2 className="font-gloria text-3xl text-center text-primary mb-3">Everything in Your Digital Scrapbook</h2>
          <p className="font-patrick text-xl text-center text-on-surface-variant max-w-xl mx-auto mb-10">
            Thoughtfully designed with wobbly doodle borders, stickers, tape strips, and playful animations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="taped-paper sketchy-border p-6 bg-white hover:-rotate-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-primary mb-2">auto_awesome</span>
              <h3 className="font-gloria text-2xl text-on-surface mb-2">Daily Highlights</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                Jot down little victories, cozy coffee moments, and gentle joys that make every day special.
              </p>
            </div>

            <div className="polaroid p-6 bg-white flex flex-col items-center text-center hover:rotate-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2">photo_library</span>
              <h3 className="font-gloria text-2xl text-on-surface mb-2">Polaroid Timeline</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                Pin photos with handwritten captions and dates to revisit favorite travels, dates, and milestones.
              </p>
            </div>

            <div className="taped-paper sketchy-border p-6 bg-amber-50/70 hover:-rotate-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-tertiary mb-2">drafts</span>
              <h3 className="font-gloria text-2xl text-on-surface mb-2">Letter Vault</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                Write heartfelt time capsules to open on rainy days, sad moments, or celebration milestones.
              </p>
            </div>

            <div className="taped-paper sketchy-border p-6 bg-white hover:rotate-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-primary mb-2">psychology_alt</span>
              <h3 className="font-gloria text-2xl text-on-surface mb-2">Things to Work On</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                Track gentle habits, personal promises, and growth notes in a safe and supportive space.
              </p>
            </div>

            <div className="taped-paper sketchy-border p-6 bg-white hover:-rotate-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-secondary mb-2">calendar_today</span>
              <h3 className="font-gloria text-2xl text-on-surface mb-2">Plans & Bucket Lists</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                Organize weekend outings, shared goals, date nights, and checklists together.
              </p>
            </div>

            <div className="taped-paper sketchy-border p-6 bg-white hover:rotate-1 transition-transform">
              <span className="material-symbols-outlined text-4xl text-tertiary mb-2">style</span>
              <h3 className="font-gloria text-2xl text-on-surface mb-2">Custom Card Decks</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                Create decks of appreciation cards, daily affirmations, or memory reveals to open one by one.
              </p>
            </div>
          </div>
        </section>

        {/* Theme Showcase */}
        <section id="themes" className="py-12 px-2">
          <div className="taped-paper sketchy-border p-8 bg-white max-w-4xl mx-auto">
            <h2 className="font-gloria text-3xl text-center text-primary mb-2">Selectable Aesthetic Themes</h2>
            <p className="font-patrick text-lg text-center text-on-surface-variant mb-6">
              Every scrapbook can have its own personality—from soft pinks to vintage journal parchment.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {(Object.keys(THEME_OPTIONS) as ScrapbookThemeKey[]).map((key) => {
                const opt = THEME_OPTIONS[key];
                const active = previewTheme === key;
                return (
                  <button
                    key={key}
                    onClick={() => setPreviewTheme(key)}
                    className={`p-3 rounded-md border-2 font-patrick text-center transition-all ${
                      active ? 'border-primary ring-2 ring-primary/40 bg-primary-container/20 font-bold scale-105' : 'border-outline-variant hover:bg-surface-variant/30'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-1 border border-black/20"
                      style={{ backgroundColor: opt.previewColor }}
                    ></div>
                    <span className="text-base block truncate">{opt.name}</span>
                  </button>
                );
              })}
            </div>

            <div className={`p-6 rounded border-2 border-dashed border-primary/30 text-center ${THEME_OPTIONS[previewTheme].cardBg}`}>
              <h4 className="font-gloria text-2xl text-primary mb-1">{THEME_OPTIONS[previewTheme].name}</h4>
              <p className="font-patrick text-lg text-on-surface-variant italic">&quot;{THEME_OPTIONS[previewTheme].tagline}&quot;</p>
            </div>
          </div>
        </section>

        {/* Sample Scrapbook Cards Preview */}
        <section id="preview" className="py-12 px-2">
          <h2 className="font-gloria text-3xl text-center text-primary mb-8">Sample Pages Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="taped-paper sketchy-border p-6 bg-white rotate-1">
              <span className="font-patrick text-xs text-primary uppercase font-bold tracking-wider">Sample Daily Highlight</span>
              <h3 className="font-gloria text-xl text-on-surface mt-1 mb-2">Afternoon Bookshop Discovery ☕</h3>
              <p className="font-patrick text-lg text-on-surface-variant">
                &quot;Found an old secondhand bookstore with jazz playing on vinyl. Picked up a vintage poetry book and sketched a cup of tea.&quot;
              </p>
              <div className="flex justify-between items-center mt-4 pt-2 border-t border-dashed border-outline-variant font-patrick text-sm text-outline">
                <span>By Little Dreamer</span>
                <span>03:40 PM</span>
              </div>
            </div>

            <div className="polaroid p-6 bg-white -rotate-1 flex flex-col justify-between">
              <div>
                <span className="font-patrick text-xs text-secondary uppercase font-bold tracking-wider">Sample Polaroid Memory</span>
                <div className="w-full h-40 bg-amber-100/60 rounded my-2 flex items-center justify-center border border-dashed border-outline-variant">
                  <span className="font-patrick text-xl text-outline">📸 [Memory Photo]</span>
                </div>
                <h3 className="font-gloria text-xl text-on-surface">Campfire Under Starlight</h3>
              </div>
              <span className="font-patrick text-sm text-outline text-right mt-2">August 14th</span>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section className="text-center py-12">
          <Link
            href="/login"
            className="sticker-btn px-10 py-4 bg-primary text-white font-patrick text-2xl active:scale-95 transition-all shadow-lg"
          >
            Start Your Scrapbook Today 🎨✨
          </Link>
        </section>
      </main>
    );
  }

  // =========================================================================
  // SCENARIO 2: AUTHENTICATED DASHBOARD (Logged-in user)
  // =========================================================================
  const totalTaps = interactiveCounters.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <main className="max-w-[1440px] mx-auto px-4 pt-24 pb-12 doodle-bg-dots min-h-screen">
      {/* Top Banner: Active Scrapbook Overview & Action Buttons */}
      <section className="mb-8 px-2">
        <div className="taped-paper sketchy-border p-6 sm:p-8 bg-white relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-primary-container text-on-primary-container font-patrick text-sm font-bold">
                {THEME_OPTIONS[activeScrapbook?.theme || 'pink_doodle']?.name || 'Pink Doodle'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-variant font-patrick text-xs text-on-surface-variant uppercase">
                {activeScrapbook?.privacy === 'collaborative' ? '👥 Collaborative' : '🔒 Private'}
              </span>
              <span className="font-patrick text-xs text-outline">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </span>
            </div>

            <h1 className="font-gloria text-3xl sm:text-4xl text-primary mb-1">
              {activeScrapbook?.title || 'My Scrapbook'}
            </h1>
            <p className="font-patrick text-lg text-on-surface-variant max-w-xl">
              {activeScrapbook?.description || 'Your cozy space for cherished memories and daily joys.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setIsNewBookModalOpen(true)}
              className="sketchy-border px-4 py-2 bg-white text-primary font-patrick text-base hover:bg-primary-container/20 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              New Scrapbook
            </button>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="sketchy-border px-4 py-2 bg-white text-secondary font-patrick text-base hover:bg-secondary-container/20 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">key</span>
              Join with Code
            </button>

            <button
              onClick={handleOpenInviteModal}
              className="sticker-btn px-4 py-2 bg-primary text-white font-patrick text-base active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">group_add</span>
              Invite Member
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section: Live Journey / Milestone Counter */}
      {activeScrapbook?.show_counter && (
        <section className="mb-10 px-2">
          <div className="taped-paper sketchy-border p-6 sm:p-8 flex flex-col items-center justify-center text-center relative bg-white">
            <span className="material-symbols-outlined absolute -top-4 -left-2 text-tertiary/40 text-4xl floating-heart">favorite</span>
            <span className="material-symbols-outlined absolute top-1/2 -right-4 text-secondary/30 text-3xl doodle-sparkle">auto_awesome</span>
            
            <p className="font-patrick text-lg text-primary uppercase tracking-widest mb-2">Memory Journey Tally</p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5 mb-4 select-none font-gloria text-primary">
              <div className="flex flex-col items-center">
                <span className="text-[44px] sm:text-[64px] md:text-[72px] leading-none counter-pop min-w-[60px] sm:min-w-[80px]">
                  {daysCount.days}
                </span>
                <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">days</span>
              </div>
              <span className="text-2xl sm:text-4xl self-start mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[44px] sm:text-[64px] md:text-[72px] leading-none counter-pop min-w-[45px] sm:min-w-[60px]">
                  {String(daysCount.hours).padStart(2, '0')}
                </span>
                <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">hours</span>
              </div>
              <span className="text-2xl sm:text-4xl self-start mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[44px] sm:text-[64px] md:text-[72px] leading-none counter-pop min-w-[45px] sm:min-w-[60px]">
                  {String(daysCount.minutes).padStart(2, '0')}
                </span>
                <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">mins</span>
              </div>
              <span className="text-2xl sm:text-4xl self-start mt-2">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[44px] sm:text-[64px] md:text-[72px] leading-none counter-pop min-w-[45px] sm:min-w-[60px] text-secondary">
                  {String(daysCount.seconds).padStart(2, '0')}
                </span>
                <span className="font-patrick text-xs sm:text-sm text-on-surface-variant lowercase">secs</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={(e) => {
                  triggerSparkles(e.clientX, e.clientY, 'dashboard');
                  setCheckedIn(true);
                  incrementCounter();
                }}
                disabled={checkedIn}
                className={`sketchy-border px-6 py-2.5 font-patrick text-lg flex items-center justify-center gap-2 active:translate-y-1 transition-all ${
                  checkedIn 
                    ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-75' 
                    : 'bg-primary-container text-on-primary-container hover:scale-[1.02]'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {checkedIn ? 'check_circle' : 'circle'}
                </span>
                {checkedIn ? 'Checked In Today!' : 'Daily Check-in'}
              </button>

              <button 
                onClick={(e) => {
                  triggerSparkles(e.clientX, e.clientY, 'tapper');
                  setIsNoteModalOpen(true);
                }}
                className="sketchy-border bg-white text-primary px-6 py-2.5 font-patrick text-lg flex items-center justify-center gap-2 active:translate-y-1 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined">edit_note</span>
                Write Daily Highlight
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bento Grid Stats & Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-2">
        {/* Mood Widget */}
        <div className="md:col-span-8 taped-paper sketchy-border p-6 relative bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-gloria text-2xl text-primary">Scrapbook Mood Board</h3>
            <span className="material-symbols-outlined text-secondary">mood</span>
          </div>

          {/* Members' Moods */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-start border-b-2 border-dashed border-outline-variant pb-4">
            {members.map((m) => {
              const userMoodRecord = moods.find((mood) => mood.user_id === m.user_id);
              const moodKey = userMoodRecord?.mood_type || 'happy';
              const asset = MOOD_ASSETS[moodKey] || MOOD_ASSETS.happy;
              return (
                <div key={m.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-variant/30 border border-outline-variant/50">
                  <img
                    src={m.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg'}
                    alt={m.display_name || 'Member'}
                    className="w-10 h-10 rounded-full border border-primary object-cover"
                  />
                  <div>
                    <span className="font-patrick text-xs text-outline block">{m.member_nickname || m.display_name}</span>
                    <span className="font-patrick text-base font-bold text-primary">{asset.label} {asset.emoji}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Mood selection selectors */}
          <p className="font-patrick text-base text-on-surface-variant mb-3">Tap to update how you feel right now:</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 items-center">
            {(Object.keys(MOOD_ASSETS) as Array<keyof typeof MOOD_ASSETS>).map((key) => {
              const details = MOOD_ASSETS[key];
              const isMyMood = moods.find((m) => m.user_id === currentUser?.id)?.mood_type === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => {
                    triggerSparkles(e.clientX, e.clientY, 'dashboard');
                    updateMood(key);
                  }}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isMyMood ? 'scale-105 font-bold' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
                    isMyMood ? 'border-primary ring-2 ring-primary/40 ' + details.bg : 'border-outline-variant/60 bg-white'
                  }`}>
                    {details.emoji}
                  </div>
                  <span className="font-patrick text-xs">{details.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Cheer Counter Card */}
        <div className="md:col-span-4 polaroid flex flex-col items-center text-center bg-white justify-between min-h-[280px]">
          <h3 className="font-gloria text-2xl text-primary mb-1">Cheer Tapper</h3>
          
          <div className="my-auto flex flex-col items-center">
            <span className="material-symbols-outlined text-tertiary text-4xl heart-pulsate mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <div className="text-[56px] font-gloria text-primary leading-none select-none">
              {totalTaps}
            </div>
            <p className="font-patrick text-base text-on-surface-variant max-w-[200px] mx-auto mt-2">
              Total cheer taps & appreciations recorded!
            </p>
          </div>

          <div className="w-full mt-3 px-2">
            <Link href="/progress" className="w-full">
              <button className="sticker-btn w-full py-2 bg-secondary text-white text-base rounded-sm active:translate-y-1 transition-transform">
                Open Fun Activities
              </button>
            </Link>
          </div>
        </div>

        {/* Letter Vault Card */}
        <div className="md:col-span-6 taped-paper sketchy-border p-6 bg-amber-50/70 flex flex-col justify-between min-h-[260px] hover:rotate-1 transition-transform">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-gloria text-2xl text-primary flex items-center gap-2">
                <span>💌 Letter Vault</span>
              </h3>
              <span className="bg-primary-container text-on-primary-container font-patrick px-2.5 py-0.5 rounded-full text-sm">
                {vaultLetters.length} letters
              </span>
            </div>
            <p className="font-patrick text-base text-on-surface-variant mb-4 leading-relaxed">
              Store thoughtful time capsules to open when feeling overwhelmed, celebrating milestones, or needing motivation.
            </p>
          </div>

          <Link href="/love-letters" className="w-full">
            <button className="sticker-btn w-full py-2 bg-primary text-white text-base rounded-sm active:scale-98 transition-transform font-patrick">
              Open Letter Vault
            </button>
          </Link>
        </div>

        {/* Memory Polaroid Timeline Card */}
        <div className="md:col-span-6 polaroid flex flex-col items-center bg-white justify-between min-h-[260px] hover:-rotate-1 transition-transform">
          <div className="w-full">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-gloria text-2xl text-primary flex items-center gap-2">
                <span>📸 Polaroid Timeline</span>
              </h3>
              <span className="bg-secondary-container text-on-secondary-container font-patrick px-2.5 py-0.5 rounded-full text-sm">
                {memories.length} photos
              </span>
            </div>
          </div>

          <div className="w-full flex-grow flex items-center justify-center py-2">
            {memories.length > 0 ? (
              <div className="flex gap-3 items-center w-full max-w-[320px] bg-surface-container-lowest border border-outline-variant p-2 shadow-sm rounded-sm">
                <div className="w-16 h-16 bg-cover bg-center rounded-sm flex-shrink-0" style={{ backgroundImage: `url(${memories[0].image_url})` }}></div>
                <div className="flex-grow min-w-0">
                  <p className="font-gloria text-base text-on-surface truncate">{memories[0].title}</p>
                  <p className="font-patrick text-xs text-outline">{new Date(memories[0].memory_date).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="font-patrick text-base text-outline italic">No polaroids pinned yet. Pin your first one!</p>
            )}
          </div>

          <div className="w-full mt-3 px-1">
            <Link href="/memory-timeline" className="w-full">
              <button className="sticker-btn w-full py-2 bg-secondary text-white text-base rounded-sm active:scale-98 transition-transform font-patrick">
                View Memory Timeline
              </button>
            </Link>
          </div>
        </div>

        {/* Daily Highlights Section */}
        <div className="md:col-span-12 mt-2 px-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-gloria text-2xl text-primary">Daily Highlights ✨</h3>
            <Link href="/good-things" className="font-patrick text-lg text-secondary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyHighlights.slice(0, 4).map((thing, idx) => {
              const iconStyle = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
              return (
                <div 
                  key={thing.id} 
                  className="taped-paper sketchy-border p-4 flex flex-col gap-1.5 bg-white hover:scale-[1.01] transition-transform"
                >
                  <span className={`material-symbols-outlined ${iconStyle.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {iconStyle.icon}
                  </span>
                  <h4 className="font-gloria text-base text-on-surface line-clamp-1">{thing.title}</h4>
                  <p className="font-patrick text-sm text-on-surface-variant line-clamp-3">{thing.description}</p>
                  <span className="font-patrick text-xs text-outline text-right mt-auto pt-1">{thing.time}</span>
                </div>
              );
            })}

            {dailyHighlights.length === 0 && (
              <div className="col-span-full taped-paper sketchy-border p-6 text-center bg-white">
                <p className="font-patrick text-lg text-outline italic">No scrapbook memories recorded today. Tap Write Daily Highlight!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: WRITE DAILY HIGHLIGHT */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="taped-paper sketchy-border p-6 max-w-md w-full relative bg-white">
            <h3 className="font-gloria text-2xl text-primary mb-3">Add Daily Highlight ✍️</h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Title</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Afternoon stroll in the park"
                  className="w-full px-3 py-2 doodle-border font-patrick text-lg"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-base text-primary block mb-1">Description</label>
                <textarea
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  placeholder="What made this moment special?"
                  rows={3}
                  className="w-full px-3 py-2 doodle-border font-patrick text-base"
                />
              </div>

              <div>
                <label className="font-patrick text-base text-primary block mb-1">Category Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  {['SmallJoy', 'Milestone', 'CozyMoment', 'Gratitude'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNoteTag(t)}
                      className={`px-2.5 py-0.5 rounded-full font-patrick text-sm border ${
                        noteTag === t ? 'bg-primary text-white border-primary' : 'bg-surface-variant/40 border-outline-variant'
                      }`}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="sticker-btn flex-1 py-2 bg-primary text-white font-patrick text-lg"
                >
                  Pin Highlight ✨
                </button>
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="sketchy-border px-4 py-2 font-patrick text-lg text-outline hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE NEW SCRAPBOOK */}
      {isNewBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="taped-paper sketchy-border p-6 max-w-md w-full relative bg-white">
            <h3 className="font-gloria text-2xl text-primary mb-3">Create New Scrapbook 📖</h3>
            <form onSubmit={handleCreateBook} className="space-y-3">
              <div>
                <label className="font-patrick text-base text-primary block mb-1">Scrapbook Title</label>
                <input
                  type="text"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  placeholder="e.g. Travel Journal, Family Memories, Cozy Days"
                  className="w-full px-3 py-2 doodle-border font-patrick text-lg"
                  required
                />
              </div>

              <div>
                <label className="font-patrick text-base text-primary block mb-1">Description (Optional)</label>
                <textarea
                  value={newBookDesc}
                  onChange={(e) => setNewBookDesc(e.target.value)}
                  placeholder="What is this scrapbook about?"
                  rows={2}
                  className="w-full px-3 py-2 doodle-border font-patrick text-base"
                />
              </div>

              <div>
                <label className="font-patrick text-base text-primary block mb-1">Theme Selection</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEME_OPTIONS) as ScrapbookThemeKey[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setNewBookTheme(k)}
                      className={`p-2 rounded border text-left font-patrick text-sm flex items-center gap-2 ${
                        newBookTheme === k ? 'border-primary bg-primary-container/20 font-bold' : 'border-outline-variant'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: THEME_OPTIONS[k].previewColor }}></span>
                      <span className="truncate">{THEME_OPTIONS[k].name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-patrick text-base text-primary block mb-1">Privacy</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewBookPrivacy('private')}
                    className={`p-2 rounded border font-patrick text-sm ${
                      newBookPrivacy === 'private' ? 'border-primary bg-primary-container/20 font-bold' : 'border-outline-variant'
                    }`}
                  >
                    🔒 Private (Solo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewBookPrivacy('collaborative')}
                    className={`p-2 rounded border font-patrick text-sm ${
                      newBookPrivacy === 'collaborative' ? 'border-secondary bg-secondary-container/20 font-bold' : 'border-outline-variant'
                    }`}
                  >
                    👥 Collaborative
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="sticker-btn flex-1 py-2 bg-primary text-white font-patrick text-lg"
                >
                  Create Scrapbook 🎨
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewBookModalOpen(false)}
                  className="sketchy-border px-4 py-2 font-patrick text-lg text-outline hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVITE COLLABORATOR */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="taped-paper sketchy-border p-6 max-w-md w-full relative bg-white text-center">
            <h3 className="font-gloria text-2xl text-primary mb-2">Invite Collaborator 💌</h3>
            <p className="font-patrick text-base text-on-surface-variant mb-4">
              Share this invite code with a friend, partner, or family member to collaborate on this scrapbook:
            </p>

            <div className="p-4 bg-primary-container/20 rounded border-2 border-primary border-dashed mb-4">
              <span className="font-gloria text-3xl text-primary block select-all tracking-widest">{inviteCodeText}</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteCodeText);
                setCopiedInvite(true);
                setTimeout(() => setCopiedInvite(false), 2000);
              }}
              className="sticker-btn w-full py-2.5 bg-primary text-white font-patrick text-lg mb-2"
            >
              {copiedInvite ? 'Copied to Clipboard! ✨' : 'Copy Invite Code 📋'}
            </button>

            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="w-full text-center text-outline underline font-patrick text-base mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: JOIN SCRAPBOOK WITH CODE */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="taped-paper sketchy-border p-6 max-w-md w-full relative bg-white">
            <h3 className="font-gloria text-2xl text-secondary mb-2">Join a Scrapbook 🔑</h3>
            <p className="font-patrick text-base text-on-surface-variant mb-4">
              Enter the 6-digit invite code provided by the scrapbook owner:
            </p>

            <form onSubmit={handleJoinBook} className="space-y-4">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. A1B2C3"
                className="w-full h-12 px-4 doodle-border font-patrick text-2xl uppercase tracking-widest text-center font-bold"
                maxLength={6}
                required
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="sticker-btn flex-1 py-2 bg-secondary text-white font-patrick text-lg"
                >
                  Join Scrapbook ✨
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="sketchy-border px-4 py-2 font-patrick text-lg text-outline hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
