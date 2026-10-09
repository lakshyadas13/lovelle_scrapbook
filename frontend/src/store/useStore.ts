import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { ScrapbookThemeKey, AVATAR_PRESETS } from '@/config/platform';

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  profile_title: string;
  created_at?: string;
}

export interface Scrapbook {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  theme: ScrapbookThemeKey;
  privacy: 'private' | 'collaborative';
  start_date: string | null;
  show_counter: boolean;
  created_at: string;
}

export interface ScrapbookMember {
  id: string;
  scrapbook_id: string;
  user_id: string;
  role: 'owner' | 'collaborator' | 'viewer';
  member_nickname: string | null;
  display_name?: string;
  avatar_url?: string | null;
  profile_title?: string;
}

export interface Mood {
  id: string;
  scrapbook_id: string;
  user_id: string;
  mood_type: 'happy' | 'dreaming' | 'sleepy' | 'inspired' | 'cozy' | 'in_love' | 'miss_you' | 'angry';
}

export interface InteractiveCounter {
  id: string;
  scrapbook_id: string;
  user_id: string;
  count: number;
}

export interface DailyHighlight {
  id: string;
  scrapbook_id: string;
  user_id: string;
  title: string;
  description: string;
  time: string;
  tags: string[];
  image_url: string | null;
  created_at: string;
}

export interface ThingToWorkOn {
  id: string;
  scrapbook_id: string;
  user_id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  status: 'pending' | 'promised';
  created_at: string;
}

export interface Plan {
  id: string;
  scrapbook_id: string;
  title: string;
  description: string;
  time: string;
  image_url: string | null;
  tags: string[];
  date: string;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  scrapbook_id: string;
  task: string;
  is_completed: boolean;
  created_at: string;
}

export interface VaultLetter {
  id: string;
  scrapbook_id: string;
  sender_id: string;
  category: 'sad' | 'miss_me' | 'motivation' | 'celebration' | 'general';
  title: string;
  content: string;
  created_at: string;
}

export interface Memory {
  id: string;
  scrapbook_id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  memory_date: string;
  created_at: string;
}

export interface DeckCard {
  id: string;
  deck_id: string;
  card_number: number;
  content: string;
  is_revealed: boolean;
  created_at: string;
}

export interface CardDeck {
  id: string;
  scrapbook_id: string;
  title: string;
  description: string | null;
  icon: string;
  cards?: DeckCard[];
  created_at: string;
}

// Aliases for backwards compatibility with existing UI
export type GoodThing = DailyHighlight;
export type Oopsie = ThingToWorkOn;
export type LoveLetter = VaultLetter;

interface AppState {
  session: Session | null;
  currentUser: Profile | null;
  scrapbooks: Scrapbook[];
  activeScrapbook: Scrapbook | null;
  members: ScrapbookMember[];
  
  // Scrapbook-scoped data
  moods: Mood[];
  interactiveCounters: InteractiveCounter[];
  dailyHighlights: DailyHighlight[];
  thingsToWorkOn: ThingToWorkOn[];
  plans: Plan[];
  checklist: ChecklistItem[];
  vaultLetters: VaultLetter[];
  memories: Memory[];
  cardDecks: CardDeck[];
  
  // Backward compatibility getters
  goodThings: DailyHighlight[];
  oopsies: ThingToWorkOn[];
  loveTaps: { user_id: string; count: number }[];
  loveLetters: VaultLetter[];
  
  isLoading: boolean;
  error: string | null;

  // Actions: Auth & Profile
  setSession: (session: Session | null) => void;
  signUp: (email: string, password: string, displayName: string, profileTitle?: string, avatarUrl?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;

  // Actions: Scrapbooks
  fetchUserScrapbooks: () => Promise<void>;
  setActiveScrapbook: (scrapbookId: string) => Promise<void>;
  createScrapbook: (data: {
    title: string;
    description?: string;
    cover_image_url?: string;
    theme?: ScrapbookThemeKey;
    privacy?: 'private' | 'collaborative';
    start_date?: string;
  }) => Promise<Scrapbook>;
  updateScrapbook: (id: string, updates: Partial<Scrapbook>) => Promise<void>;
  deleteScrapbook: (id: string) => Promise<void>;
  createInvite: (scrapbookId: string) => Promise<string>;
  joinScrapbook: (inviteCode: string) => Promise<string>;
  fetchMembers: (scrapbookId: string) => Promise<void>;

  // Actions: Content
  fetchScrapbookData: (scrapbookId: string) => Promise<void>;
  updateMood: (moodType: Mood['mood_type']) => Promise<void>;
  incrementCounter: () => Promise<void>;
  incrementLoveTaps: () => Promise<void>; // Alias

  addDailyHighlight: (highlight: Omit<DailyHighlight, 'id' | 'scrapbook_id' | 'user_id' | 'created_at'>) => Promise<void>;
  addGoodThing: (thing: Omit<DailyHighlight, 'id' | 'scrapbook_id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteDailyHighlight: (id: string) => Promise<void>;
  deleteGoodThing: (id: string) => Promise<void>;

  addThingToWorkOn: (item: Omit<ThingToWorkOn, 'id' | 'scrapbook_id' | 'status' | 'created_at'>) => Promise<void>;
  addOopsie: (oopsie: Omit<ThingToWorkOn, 'id' | 'scrapbook_id' | 'status' | 'created_at'>) => Promise<void>;
  promiseThingToWorkOn: (id: string) => Promise<void>;
  promiseOopsie: (id: string) => Promise<void>;
  deleteThingToWorkOn: (id: string) => Promise<void>;
  deleteOopsie: (id: string) => Promise<void>;

  addPlan: (plan: Omit<Plan, 'id' | 'scrapbook_id' | 'created_at'>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  addChecklistItem: (task: string) => Promise<void>;
  toggleChecklistItem: (id: string, isCompleted: boolean) => Promise<void>;
  deleteChecklistItem: (id: string) => Promise<void>;

  addVaultLetter: (letter: Omit<VaultLetter, 'id' | 'scrapbook_id' | 'sender_id' | 'created_at'>) => Promise<void>;
  addLoveLetter: (letter: Omit<VaultLetter, 'id' | 'scrapbook_id' | 'sender_id' | 'created_at'>) => Promise<void>;
  deleteVaultLetter: (id: string) => Promise<void>;
  deleteLoveLetter: (id: string) => Promise<void>;

  addMemory: (memory: Omit<Memory, 'id' | 'scrapbook_id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;

  // Card Decks
  fetchCardDecks: (scrapbookId: string) => Promise<void>;
  createCardDeck: (title: string, description?: string, icon?: string, cards?: string[]) => Promise<void>;
  toggleCardReveal: (cardId: string) => Promise<void>;

  subscribeRealtime: () => () => void;
}

const isSupabaseConfigured =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder';

const getLocal = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const removeLocal = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Default Mock Data for local offline sandbox
const MOCK_USER: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  display_name: 'Doodle Creator',
  avatar_url: AVATAR_PRESETS[0].url,
  profile_title: 'Little Dreamer',
};

const MOCK_SCRAPBOOKS: Scrapbook[] = [
  {
    id: 'mock-scrapbook-1',
    owner_id: MOCK_USER.id,
    title: 'Daily Sparks & Sunshine',
    description: 'A cozy journal of gentle moments, warm thoughts, and happy memories.',
    cover_image_url: null,
    theme: 'pink_doodle',
    privacy: 'private',
    start_date: '2026-01-01',
    show_counter: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-scrapbook-2',
    owner_id: MOCK_USER.id,
    title: 'Weekend Adventures',
    description: 'Polaroids, cafe visits, travel lists, and sunny afternoon road trips.',
    cover_image_url: null,
    theme: 'lavender_dreams',
    privacy: 'collaborative',
    start_date: '2026-03-15',
    show_counter: false,
    created_at: new Date().toISOString(),
  },
];

const MOCK_MEMBERS: ScrapbookMember[] = [
  {
    id: 'member-1',
    scrapbook_id: 'mock-scrapbook-1',
    user_id: MOCK_USER.id,
    role: 'owner',
    member_nickname: 'Doodle Creator',
    display_name: 'Doodle Creator',
    avatar_url: MOCK_USER.avatar_url,
    profile_title: 'Little Dreamer',
  },
];

export const useStore = create<AppState>((set, get) => {
  const initialHighlights: DailyHighlight[] = getLocal('lovelle_highlights', [
    {
      id: 'h1',
      scrapbook_id: 'mock-scrapbook-1',
      user_id: MOCK_USER.id,
      title: 'Warm Matcha Latte 🍵',
      description: 'Found a cozy quiet corner by the window, sketched in my notebook, and listened to the rain.',
      time: '10:30 AM',
      tags: ['SmallJoy'],
      image_url: null,
      created_at: new Date().toISOString(),
    },
    {
      id: 'h2',
      scrapbook_id: 'mock-scrapbook-1',
      user_id: MOCK_USER.id,
      title: 'Finished Project Chapter 📚',
      description: 'Checked off the big milestone! Feeling proud and relieved.',
      time: '04:15 PM',
      tags: ['Milestone'],
      image_url: null,
      created_at: new Date().toISOString(),
    },
  ]);

  const initialThingsToWorkOn: ThingToWorkOn[] = getLocal('lovelle_work_on', [
    {
      id: 'w1',
      scrapbook_id: 'mock-scrapbook-1',
      user_id: MOCK_USER.id,
      title: 'Drink more water before noon 💧',
      description: 'Always forget water during morning focus sessions.',
      tags: ['Health', 'Habit'],
      image_url: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    {
      id: 'w2',
      scrapbook_id: 'mock-scrapbook-1',
      user_id: MOCK_USER.id,
      title: 'Step away from screen every hour 🌿',
      description: 'Do a gentle 2-minute stretch.',
      tags: ['Wellness'],
      image_url: null,
      status: 'promised',
      created_at: new Date().toISOString(),
    },
  ]);

  const initialPlans: Plan[] = getLocal('lovelle_plans', [
    {
      id: 'p1',
      scrapbook_id: 'mock-scrapbook-1',
      title: 'Farmers Market Morning',
      description: 'Pick up fresh berries, sourdough, and wild daisies.',
      time: '09:00 AM',
      image_url: null,
      tags: ['Outdoors', 'Cozy'],
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    },
  ]);

  const initialChecklist: ChecklistItem[] = getLocal('lovelle_checklist', [
    { id: 'c1', scrapbook_id: 'mock-scrapbook-1', task: 'Make fresh mint tea', is_completed: true, created_at: new Date().toISOString() },
    { id: 'c2', scrapbook_id: 'mock-scrapbook-1', task: 'Press autumn leaves into scrapbook', is_completed: false, created_at: new Date().toISOString() },
    { id: 'c3', scrapbook_id: 'mock-scrapbook-1', task: 'Write postcard to a friend', is_completed: false, created_at: new Date().toISOString() },
  ]);

  const initialLetters: VaultLetter[] = getLocal('lovelle_letters', [
    {
      id: 'l1',
      scrapbook_id: 'mock-scrapbook-1',
      sender_id: MOCK_USER.id,
      category: 'motivation',
      title: 'Read this when feeling overwhelmed 🌟',
      content: 'Take a deep breath. You are capable, loved, and making progress every single day. Celebrate the little steps!',
      created_at: new Date().toISOString(),
    },
  ]);

  const initialMemories: Memory[] = getLocal('lovelle_memories', [
    {
      id: 'm1',
      scrapbook_id: 'mock-scrapbook-1',
      user_id: MOCK_USER.id,
      title: 'Sunset at the Pier 🌅',
      description: 'Pastel skies and cool ocean breeze.',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      memory_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    },
  ]);

  const initialDecks: CardDeck[] = getLocal('lovelle_decks', [
    {
      id: 'deck-1',
      scrapbook_id: 'mock-scrapbook-1',
      title: 'Daily Sparks of Gratitude ✨',
      description: 'Gentle affirmations and reasons to smile today.',
      icon: 'auto_awesome',
      cards: [
        { id: 'cd-1', deck_id: 'deck-1', card_number: 1, content: 'A warm mug of tea on a chilly morning.', is_revealed: true, created_at: new Date().toISOString() },
        { id: 'cd-2', deck_id: 'deck-1', card_number: 2, content: 'Hearing your favorite song unexpectedly.', is_revealed: false, created_at: new Date().toISOString() },
        { id: 'cd-3', deck_id: 'deck-1', card_number: 3, content: 'Fresh sheets and an early bedtime.', is_revealed: false, created_at: new Date().toISOString() },
        { id: 'cd-4', deck_id: 'deck-1', card_number: 4, content: 'The feeling when a new idea clicks.', is_revealed: false, created_at: new Date().toISOString() },
      ],
      created_at: new Date().toISOString(),
    },
  ]);

  const initialScrapbooks: Scrapbook[] = getLocal('lovelle_scrapbooks', isSupabaseConfigured ? [] : MOCK_SCRAPBOOKS);
  const initialActive = initialScrapbooks.length > 0 ? initialScrapbooks[0] : null;

  return {
    session: null,
    currentUser: getLocal('lovelle_user', isSupabaseConfigured ? null : MOCK_USER),
    scrapbooks: initialScrapbooks,
    activeScrapbook: initialActive,
    members: getLocal('lovelle_members', isSupabaseConfigured ? [] : MOCK_MEMBERS),

    moods: getLocal('lovelle_moods', [
      { id: 'mood-1', scrapbook_id: 'mock-scrapbook-1', user_id: MOCK_USER.id, mood_type: 'inspired' },
    ]),
    interactiveCounters: getLocal('lovelle_counters', [
      { id: 'ctr-1', scrapbook_id: 'mock-scrapbook-1', user_id: MOCK_USER.id, count: 24 },
    ]),
    dailyHighlights: initialHighlights,
    thingsToWorkOn: initialThingsToWorkOn,
    plans: initialPlans,
    checklist: initialChecklist,
    vaultLetters: initialLetters,
    memories: initialMemories,
    cardDecks: initialDecks,

    // Aliases
    goodThings: initialHighlights,
    oopsies: initialThingsToWorkOn,
    loveTaps: [{ user_id: MOCK_USER.id, count: 24 }],
    loveLetters: initialLetters,

    isLoading: false,
    error: null,

    // ==========================================
    // AUTH ACTIONS
    // ==========================================
    setSession: (session) => {
      set({ session });
      if (!session && isSupabaseConfigured) {
        set({
          currentUser: null,
          scrapbooks: [],
          activeScrapbook: null,
          members: [],
          dailyHighlights: [],
          thingsToWorkOn: [],
          plans: [],
          checklist: [],
          vaultLetters: [],
          memories: [],
          cardDecks: [],
          goodThings: [],
          oopsies: [],
          loveTaps: [],
          loveLetters: [],
        });
      }
    },

    signUp: async (email, password, displayName, profileTitle = 'Little Dreamer', avatarUrl = AVATAR_PRESETS[0].url) => {
      set({ isLoading: true, error: null });
      try {
        if (!isSupabaseConfigured) {
          const newUser: Profile = {
            id: 'mock-user-' + Date.now(),
            display_name: displayName,
            avatar_url: avatarUrl,
            profile_title: profileTitle,
          };
          const newScrapbook: Scrapbook = {
            id: 'scrapbook-' + Date.now(),
            owner_id: newUser.id,
            title: `${displayName}'s Scrapbook`,
            description: 'My cozy space for stories, doodles, and highlights.',
            cover_image_url: null,
            theme: 'pink_doodle',
            privacy: 'private',
            start_date: new Date().toISOString().split('T')[0],
            show_counter: true,
            created_at: new Date().toISOString(),
          };
          const newMember: ScrapbookMember = {
            id: 'member-' + Date.now(),
            scrapbook_id: newScrapbook.id,
            user_id: newUser.id,
            role: 'owner',
            member_nickname: displayName,
            display_name: displayName,
            avatar_url: avatarUrl,
            profile_title: profileTitle,
          };
          setLocal('lovelle_user', newUser);
          setLocal('lovelle_scrapbooks', [newScrapbook]);
          setLocal('lovelle_members', [newMember]);
          set({
            currentUser: newUser,
            scrapbooks: [newScrapbook],
            activeScrapbook: newScrapbook,
            members: [newMember],
            isLoading: false,
          });
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              profile_title: profileTitle,
              avatar_url: avatarUrl,
            },
          },
        });

        if (error) throw error;
        if (data.user) {
          // Profile is created by db trigger, let's fetch it
          await get().fetchUserScrapbooks();
        }
      } catch (err: any) {
        set({ error: err.message || 'Failed to sign up', isLoading: false });
        throw err;
      }
    },

    signIn: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        if (!isSupabaseConfigured) {
          const user = getLocal('lovelle_user', MOCK_USER);
          set({ currentUser: user, isLoading: false });
          await get().fetchUserScrapbooks();
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          set({ session: data.session });
          await get().fetchUserScrapbooks();
        }
      } catch (err: any) {
        set({ error: err.message || 'Failed to sign in', isLoading: false });
        throw err;
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        if (isSupabaseConfigured) {
          await supabase.auth.signOut();
        }
        removeLocal('lovelle_user');
        set({
          session: null,
          currentUser: null,
          scrapbooks: [],
          activeScrapbook: null,
          members: [],
          dailyHighlights: [],
          thingsToWorkOn: [],
          plans: [],
          checklist: [],
          vaultLetters: [],
          memories: [],
          cardDecks: [],
          goodThings: [],
          oopsies: [],
          loveTaps: [],
          loveLetters: [],
          isLoading: false,
        });
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    updateProfile: async (updates) => {
      const { currentUser } = get();
      if (!currentUser) return;
      const updated = { ...currentUser, ...updates };

      if (!isSupabaseConfigured) {
        setLocal('lovelle_user', updated);
        set({ currentUser: updated });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updated.display_name,
          avatar_url: updated.avatar_url,
          profile_title: updated.profile_title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (!error) {
        set({ currentUser: updated });
      }
    },

    // ==========================================
    // SCRAPBOOK MANAGEMENT
    // ==========================================
    fetchUserScrapbooks: async () => {
      set({ isLoading: true, error: null });
      try {
        if (!isSupabaseConfigured) {
          const books = getLocal('lovelle_scrapbooks', MOCK_SCRAPBOOKS);
          const active = get().activeScrapbook || books[0] || null;
          set({ scrapbooks: books, activeScrapbook: active, isLoading: false });
          if (active) {
            await get().fetchScrapbookData(active.id);
          }
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          set({ isLoading: false });
          return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          set({ currentUser: profile });
        }

        // Fetch scrapbooks where user is a member
        const { data: memberships, error: memberErr } = await supabase
          .from('scrapbook_members')
          .select('scrapbook_id, role, member_nickname, scrapbooks(*)')
          .eq('user_id', user.id);

        if (memberErr) throw memberErr;

        const books: Scrapbook[] = (memberships || [])
          .map((m: any) => m.scrapbooks)
          .filter(Boolean);

        const currentActiveId = get().activeScrapbook?.id;
        const active = books.find((b) => b.id === currentActiveId) || books[0] || null;

        set({ scrapbooks: books, activeScrapbook: active, isLoading: false });

        if (active) {
          await get().fetchScrapbookData(active.id);
        }
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    setActiveScrapbook: async (scrapbookId: string) => {
      const book = get().scrapbooks.find((b) => b.id === scrapbookId);
      if (book) {
        set({ activeScrapbook: book });
        await get().fetchScrapbookData(book.id);
      }
    },

    createScrapbook: async (data) => {
      set({ isLoading: true });
      const { currentUser } = get();
      if (!currentUser) throw new Error('Not logged in');

      const newBook: Scrapbook = {
        id: isSupabaseConfigured ? '' : 'scrapbook-' + Date.now(),
        owner_id: currentUser.id,
        title: data.title,
        description: data.description || null,
        cover_image_url: data.cover_image_url || null,
        theme: data.theme || 'pink_doodle',
        privacy: data.privacy || 'private',
        start_date: data.start_date || new Date().toISOString().split('T')[0],
        show_counter: true,
        created_at: new Date().toISOString(),
      };

      if (!isSupabaseConfigured) {
        const updatedBooks = [newBook, ...get().scrapbooks];
        setLocal('lovelle_scrapbooks', updatedBooks);
        set({
          scrapbooks: updatedBooks,
          activeScrapbook: newBook,
          isLoading: false,
        });
        await get().fetchScrapbookData(newBook.id);
        return newBook;
      }

      const { data: inserted, error } = await supabase
        .from('scrapbooks')
        .insert({
          owner_id: currentUser.id,
          title: data.title,
          description: data.description,
          cover_image_url: data.cover_image_url,
          theme: data.theme || 'pink_doodle',
          privacy: data.privacy || 'private',
          start_date: data.start_date,
        })
        .select()
        .single();

      if (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }

      const created: Scrapbook = inserted;
      set({
        scrapbooks: [created, ...get().scrapbooks],
        activeScrapbook: created,
        isLoading: false,
      });

      await get().fetchScrapbookData(created.id);
      return created;
    },

    updateScrapbook: async (id, updates) => {
      const { scrapbooks, activeScrapbook } = get();
      const updatedList = scrapbooks.map((b) => (b.id === id ? { ...b, ...updates } : b));
      const updatedActive = activeScrapbook?.id === id ? { ...activeScrapbook, ...updates } : activeScrapbook;

      set({ scrapbooks: updatedList, activeScrapbook: updatedActive });

      if (!isSupabaseConfigured) {
        setLocal('lovelle_scrapbooks', updatedList);
        return;
      }

      await supabase.from('scrapbooks').update(updates).eq('id', id);
    },

    deleteScrapbook: async (id) => {
      const remaining = get().scrapbooks.filter((b) => b.id !== id);
      const nextActive = remaining[0] || null;
      set({ scrapbooks: remaining, activeScrapbook: nextActive });

      if (!isSupabaseConfigured) {
        setLocal('lovelle_scrapbooks', remaining);
        return;
      }

      await supabase.from('scrapbooks').delete().eq('id', id);
      if (nextActive) {
        await get().fetchScrapbookData(nextActive.id);
      }
    },

    createInvite: async (scrapbookId: string) => {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      if (!isSupabaseConfigured) {
        return inviteCode;
      }

      const { currentUser } = get();
      if (!currentUser) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('scrapbook_invites')
        .insert({
          scrapbook_id: scrapbookId,
          invite_code: inviteCode,
          created_by: currentUser.id,
        })
        .select('invite_code')
        .single();

      if (error) throw error;
      return data.invite_code;
    },

    joinScrapbook: async (inviteCode: string) => {
      set({ isLoading: true });
      try {
        if (!isSupabaseConfigured) {
          set({ isLoading: false });
          return 'mock-scrapbook-2';
        }

        const { data, error } = await supabase.rpc('join_scrapbook_by_code', {
          p_invite_code: inviteCode.trim().toUpperCase(),
        });

        if (error) throw error;
        await get().fetchUserScrapbooks();
        set({ isLoading: false });
        return data.scrapbook_id;
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
        throw err;
      }
    },

    fetchMembers: async (scrapbookId: string) => {
      if (!isSupabaseConfigured) {
        set({ members: MOCK_MEMBERS });
        return;
      }

      const { data, error } = await supabase
        .from('scrapbook_members')
        .select('id, scrapbook_id, user_id, role, member_nickname, profiles(display_name, avatar_url, profile_title)')
        .eq('scrapbook_id', scrapbookId);

      if (!error && data) {
        const formatted: ScrapbookMember[] = data.map((m: any) => ({
          id: m.id,
          scrapbook_id: m.scrapbook_id,
          user_id: m.user_id,
          role: m.role,
          member_nickname: m.member_nickname,
          display_name: m.profiles?.display_name,
          avatar_url: m.profiles?.avatar_url,
          profile_title: m.profiles?.profile_title,
        }));
        set({ members: formatted });
      }
    },

    // ==========================================
    // SCRAPBOOK CONTENT DATA
    // ==========================================
    fetchScrapbookData: async (scrapbookId: string) => {
      await get().fetchMembers(scrapbookId);

      if (!isSupabaseConfigured) {
        return;
      }

      set({ isLoading: true });
      try {
        const [
          moodsRes,
          countersRes,
          highlightsRes,
          workOnRes,
          plansRes,
          checklistRes,
          lettersRes,
          memoriesRes,
          decksRes,
        ] = await Promise.all([
          supabase.from('moods').select('*').eq('scrapbook_id', scrapbookId),
          supabase.from('interactive_counters').select('*').eq('scrapbook_id', scrapbookId),
          supabase.from('daily_highlights').select('*').eq('scrapbook_id', scrapbookId).order('created_at', { ascending: false }),
          supabase.from('things_to_work_on').select('*').eq('scrapbook_id', scrapbookId).order('created_at', { ascending: false }),
          supabase.from('plans').select('*').eq('scrapbook_id', scrapbookId).order('date', { ascending: true }),
          supabase.from('plans_checklist').select('*').eq('scrapbook_id', scrapbookId).order('created_at', { ascending: true }),
          supabase.from('vault_letters').select('*').eq('scrapbook_id', scrapbookId).order('created_at', { ascending: false }),
          supabase.from('memories').select('*').eq('scrapbook_id', scrapbookId).order('memory_date', { ascending: false }),
          supabase.from('card_decks').select('*, deck_cards(*)').eq('scrapbook_id', scrapbookId),
        ]);

        const totalTaps = (countersRes.data || []).map((c: any) => ({ user_id: c.user_id, count: c.count }));

        set({
          moods: moodsRes.data || [],
          interactiveCounters: countersRes.data || [],
          dailyHighlights: highlightsRes.data || [],
          thingsToWorkOn: workOnRes.data || [],
          plans: plansRes.data || [],
          checklist: checklistRes.data || [],
          vaultLetters: lettersRes.data || [],
          memories: memoriesRes.data || [],
          cardDecks: decksRes.data || [],

          // Aliases
          goodThings: highlightsRes.data || [],
          oopsies: workOnRes.data || [],
          loveTaps: totalTaps,
          loveLetters: lettersRes.data || [],
          isLoading: false,
        });
      } catch (err: any) {
        set({ error: err.message, isLoading: false });
      }
    },

    updateMood: async (moodType) => {
      const { activeScrapbook, currentUser, moods } = get();
      if (!activeScrapbook || !currentUser) return;

      const existingIndex = moods.findIndex(
        (m) => m.scrapbook_id === activeScrapbook.id && m.user_id === currentUser.id
      );

      let updatedMoods: Mood[];
      if (existingIndex >= 0) {
        updatedMoods = moods.map((m, idx) => (idx === existingIndex ? { ...m, mood_type: moodType } : m));
      } else {
        updatedMoods = [
          ...moods,
          {
            id: 'mood-' + Date.now(),
            scrapbook_id: activeScrapbook.id,
            user_id: currentUser.id,
            mood_type: moodType,
          },
        ];
      }

      set({ moods: updatedMoods });
      setLocal('lovelle_moods', updatedMoods);

      if (isSupabaseConfigured) {
        await supabase.from('moods').upsert(
          {
            scrapbook_id: activeScrapbook.id,
            user_id: currentUser.id,
            mood_type: moodType,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'scrapbook_id,user_id' }
        );
      }
    },

    incrementCounter: async () => {
      const { activeScrapbook, currentUser, interactiveCounters } = get();
      if (!activeScrapbook || !currentUser) return;

      const record = interactiveCounters.find(
        (c) => c.scrapbook_id === activeScrapbook.id && c.user_id === currentUser.id
      );
      const newCount = (record?.count || 0) + 1;

      const updatedCounters = record
        ? interactiveCounters.map((c) =>
            c.id === record.id ? { ...c, count: newCount } : c
          )
        : [
            ...interactiveCounters,
            {
              id: 'ctr-' + Date.now(),
              scrapbook_id: activeScrapbook.id,
              user_id: currentUser.id,
              count: newCount,
            },
          ];

      const taps = updatedCounters.map((c) => ({ user_id: c.user_id, count: c.count }));

      set({ interactiveCounters: updatedCounters, loveTaps: taps });
      setLocal('lovelle_counters', updatedCounters);

      if (isSupabaseConfigured) {
        await supabase.from('interactive_counters').upsert(
          {
            scrapbook_id: activeScrapbook.id,
            user_id: currentUser.id,
            count: newCount,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'scrapbook_id,user_id' }
        );
      }
    },

    incrementLoveTaps: async () => {
      await get().incrementCounter();
    },

    // DAILY HIGHLIGHTS
    addDailyHighlight: async (highlight) => {
      const { activeScrapbook, currentUser, dailyHighlights } = get();
      if (!activeScrapbook || !currentUser) return;

      const newHighlight: DailyHighlight = {
        ...highlight,
        id: 'h-' + Date.now(),
        scrapbook_id: activeScrapbook.id,
        user_id: currentUser.id,
        created_at: new Date().toISOString(),
      };

      const updated = [newHighlight, ...dailyHighlights];
      set({ dailyHighlights: updated, goodThings: updated });
      setLocal('lovelle_highlights', updated);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('daily_highlights')
          .insert({
            scrapbook_id: activeScrapbook.id,
            user_id: currentUser.id,
            title: highlight.title,
            description: highlight.description,
            time: highlight.time,
            tags: highlight.tags,
            image_url: highlight.image_url,
          })
          .select()
          .single();

        if (!error && data) {
          const fresh = [data, ...dailyHighlights];
          set({ dailyHighlights: fresh, goodThings: fresh });
        }
      }
    },

    addGoodThing: async (thing) => {
      await get().addDailyHighlight(thing);
    },

    deleteDailyHighlight: async (id) => {
      const remaining = get().dailyHighlights.filter((h) => h.id !== id);
      set({ dailyHighlights: remaining, goodThings: remaining });
      setLocal('lovelle_highlights', remaining);

      if (isSupabaseConfigured) {
        await supabase.from('daily_highlights').delete().eq('id', id);
      }
    },

    deleteGoodThing: async (id) => {
      await get().deleteDailyHighlight(id);
    },

    // THINGS TO WORK ON
    addThingToWorkOn: async (item) => {
      const { activeScrapbook, currentUser, thingsToWorkOn } = get();
      if (!activeScrapbook || !currentUser) return;

      const newItem: ThingToWorkOn = {
        ...item,
        id: 'w-' + Date.now(),
        scrapbook_id: activeScrapbook.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const updated = [newItem, ...thingsToWorkOn];
      set({ thingsToWorkOn: updated, oopsies: updated });
      setLocal('lovelle_work_on', updated);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('things_to_work_on')
          .insert({
            scrapbook_id: activeScrapbook.id,
            user_id: item.user_id,
            title: item.title,
            description: item.description,
            tags: item.tags,
            image_url: item.image_url,
            status: 'pending',
          })
          .select()
          .single();

        if (!error && data) {
          const fresh = [data, ...thingsToWorkOn];
          set({ thingsToWorkOn: fresh, oopsies: fresh });
        }
      }
    },

    addOopsie: async (oopsie) => {
      await get().addThingToWorkOn(oopsie);
    },

    promiseThingToWorkOn: async (id) => {
      const updated = get().thingsToWorkOn.map((w) =>
        w.id === id ? { ...w, status: 'promised' as const } : w
      );
      set({ thingsToWorkOn: updated, oopsies: updated });
      setLocal('lovelle_work_on', updated);

      if (isSupabaseConfigured) {
        await supabase.from('things_to_work_on').update({ status: 'promised' }).eq('id', id);
      }
    },

    promiseOopsie: async (id) => {
      await get().promiseThingToWorkOn(id);
    },

    deleteThingToWorkOn: async (id) => {
      const remaining = get().thingsToWorkOn.filter((w) => w.id !== id);
      set({ thingsToWorkOn: remaining, oopsies: remaining });
      setLocal('lovelle_work_on', remaining);

      if (isSupabaseConfigured) {
        await supabase.from('things_to_work_on').delete().eq('id', id);
      }
    },

    deleteOopsie: async (id) => {
      await get().deleteThingToWorkOn(id);
    },

    // PLANS
    addPlan: async (plan) => {
      const { activeScrapbook, plans } = get();
      if (!activeScrapbook) return;

      const newPlan: Plan = {
        ...plan,
        id: 'p-' + Date.now(),
        scrapbook_id: activeScrapbook.id,
        created_at: new Date().toISOString(),
      };

      const updated = [newPlan, ...plans];
      set({ plans: updated });
      setLocal('lovelle_plans', updated);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('plans')
          .insert({
            scrapbook_id: activeScrapbook.id,
            title: plan.title,
            description: plan.description,
            time: plan.time,
            image_url: plan.image_url,
            tags: plan.tags,
            date: plan.date,
          })
          .select()
          .single();

        if (!error && data) {
          set({ plans: [data, ...plans] });
        }
      }
    },

    deletePlan: async (id) => {
      const remaining = get().plans.filter((p) => p.id !== id);
      set({ plans: remaining });
      setLocal('lovelle_plans', remaining);

      if (isSupabaseConfigured) {
        await supabase.from('plans').delete().eq('id', id);
      }
    },

    // CHECKLIST
    addChecklistItem: async (task) => {
      const { activeScrapbook, checklist } = get();
      if (!activeScrapbook) return;

      const newItem: ChecklistItem = {
        id: 'c-' + Date.now(),
        scrapbook_id: activeScrapbook.id,
        task,
        is_completed: false,
        created_at: new Date().toISOString(),
      };

      const updated = [...checklist, newItem];
      set({ checklist: updated });
      setLocal('lovelle_checklist', updated);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('plans_checklist')
          .insert({
            scrapbook_id: activeScrapbook.id,
            task,
            is_completed: false,
          })
          .select()
          .single();

        if (!error && data) {
          set({ checklist: [...checklist, data] });
        }
      }
    },

    toggleChecklistItem: async (id, isCompleted) => {
      const updated = get().checklist.map((c) =>
        c.id === id ? { ...c, is_completed: isCompleted } : c
      );
      set({ checklist: updated });
      setLocal('lovelle_checklist', updated);

      if (isSupabaseConfigured) {
        await supabase.from('plans_checklist').update({ is_completed: isCompleted }).eq('id', id);
      }
    },

    deleteChecklistItem: async (id) => {
      const remaining = get().checklist.filter((c) => c.id !== id);
      set({ checklist: remaining });
      setLocal('lovelle_checklist', remaining);

      if (isSupabaseConfigured) {
        await supabase.from('plans_checklist').delete().eq('id', id);
      }
    },

    // VAULT LETTERS
    addVaultLetter: async (letter) => {
      const { activeScrapbook, currentUser, vaultLetters } = get();
      if (!activeScrapbook || !currentUser) return;

      const newLetter: VaultLetter = {
        ...letter,
        id: 'l-' + Date.now(),
        scrapbook_id: activeScrapbook.id,
        sender_id: currentUser.id,
        created_at: new Date().toISOString(),
      };

      const updated = [newLetter, ...vaultLetters];
      set({ vaultLetters: updated, loveLetters: updated });
      setLocal('lovelle_letters', updated);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('vault_letters')
          .insert({
            scrapbook_id: activeScrapbook.id,
            sender_id: currentUser.id,
            category: letter.category,
            title: letter.title,
            content: letter.content,
          })
          .select()
          .single();

        if (!error && data) {
          const fresh = [data, ...vaultLetters];
          set({ vaultLetters: fresh, loveLetters: fresh });
        }
      }
    },

    addLoveLetter: async (letter) => {
      await get().addVaultLetter(letter);
    },

    deleteVaultLetter: async (id) => {
      const remaining = get().vaultLetters.filter((l) => l.id !== id);
      set({ vaultLetters: remaining, loveLetters: remaining });
      setLocal('lovelle_letters', remaining);

      if (isSupabaseConfigured) {
        await supabase.from('vault_letters').delete().eq('id', id);
      }
    },

    deleteLoveLetter: async (id) => {
      await get().deleteVaultLetter(id);
    },

    // MEMORIES
    addMemory: async (memory) => {
      const { activeScrapbook, currentUser, memories } = get();
      if (!activeScrapbook || !currentUser) return;

      const newMemory: Memory = {
        ...memory,
        id: 'm-' + Date.now(),
        scrapbook_id: activeScrapbook.id,
        user_id: currentUser.id,
        created_at: new Date().toISOString(),
      };

      const updated = [newMemory, ...memories];
      set({ memories: updated });
      setLocal('lovelle_memories', updated);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('memories')
          .insert({
            scrapbook_id: activeScrapbook.id,
            user_id: currentUser.id,
            title: memory.title,
            description: memory.description,
            image_url: memory.image_url,
            memory_date: memory.memory_date,
          })
          .select()
          .single();

        if (!error && data) {
          set({ memories: [data, ...memories] });
        }
      }
    },

    deleteMemory: async (id) => {
      const remaining = get().memories.filter((m) => m.id !== id);
      set({ memories: remaining });
      setLocal('lovelle_memories', remaining);

      if (isSupabaseConfigured) {
        await supabase.from('memories').delete().eq('id', id);
      }
    },

    // CARD DECKS
    fetchCardDecks: async (scrapbookId: string) => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await supabase
        .from('card_decks')
        .select('*, deck_cards(*)')
        .eq('scrapbook_id', scrapbookId);

      if (!error && data) {
        set({ cardDecks: data });
      }
    },

    createCardDeck: async (title, description, icon = 'favorite', cards = []) => {
      const { activeScrapbook, cardDecks } = get();
      if (!activeScrapbook) return;

      const newDeckId = 'deck-' + Date.now();
      const generatedCards: DeckCard[] = cards.map((text, i) => ({
        id: `card-${Date.now()}-${i}`,
        deck_id: newDeckId,
        card_number: i + 1,
        content: text,
        is_revealed: false,
        created_at: new Date().toISOString(),
      }));

      const newDeck: CardDeck = {
        id: newDeckId,
        scrapbook_id: activeScrapbook.id,
        title,
        description: description || null,
        icon,
        cards: generatedCards,
        created_at: new Date().toISOString(),
      };

      const updated = [newDeck, ...cardDecks];
      set({ cardDecks: updated });
      setLocal('lovelle_decks', updated);

      if (isSupabaseConfigured) {
        const { data: deckData, error: deckErr } = await supabase
          .from('card_decks')
          .insert({
            scrapbook_id: activeScrapbook.id,
            title,
            description,
            icon,
          })
          .select()
          .single();

        if (!deckErr && deckData && cards.length > 0) {
          const cardsToInsert = cards.map((content, idx) => ({
            deck_id: deckData.id,
            card_number: idx + 1,
            content,
            is_revealed: false,
          }));
          await supabase.from('deck_cards').insert(cardsToInsert);
          await get().fetchCardDecks(activeScrapbook.id);
        }
      }
    },

    toggleCardReveal: async (cardId) => {
      const updatedDecks = get().cardDecks.map((deck) => ({
        ...deck,
        cards: deck.cards?.map((card) =>
          card.id === cardId ? { ...card, is_revealed: !card.is_revealed } : card
        ),
      }));

      set({ cardDecks: updatedDecks });
      setLocal('lovelle_decks', updatedDecks);

      if (isSupabaseConfigured) {
        const currentCard = get()
          .cardDecks.flatMap((d) => d.cards || [])
          .find((c) => c.id === cardId);
        if (currentCard) {
          await supabase
            .from('deck_cards')
            .update({ is_revealed: currentCard.is_revealed })
            .eq('id', cardId);
        }
      }
    },

    // REALTIME SUBSCRIPTIONS
    subscribeRealtime: () => {
      if (!isSupabaseConfigured) return () => {};

      const { activeScrapbook } = get();
      if (!activeScrapbook) return () => {};

      const channel = supabase
        .channel(`scrapbook-${activeScrapbook.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', filter: `scrapbook_id=eq.${activeScrapbook.id}` },
          () => {
            get().fetchScrapbookData(activeScrapbook.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
  };
});
