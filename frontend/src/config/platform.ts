export interface ProfileTitlePreset {
  id: string;
  label: string;
  emoji: string;
}

export const PROFILE_TITLE_PRESETS: ProfileTitlePreset[] = [
  { id: 'dreamer', label: 'Little Dreamer', emoji: '✨' },
  { id: 'cozy', label: 'Cozy Bean', emoji: '☕' },
  { id: 'sunshine', label: 'Sunshine', emoji: '☀️' },
  { id: 'doodlebug', label: 'Doodlebug', emoji: '🐛' },
  { id: 'moonbeam', label: 'Moonbeam', emoji: '🌙' },
  { id: 'strawberry', label: 'Strawberry', emoji: '🍓' },
  { id: 'artist', label: 'Little Artist', emoji: '🎨' },
  { id: 'cloudnine', label: 'Cloud Nine', emoji: '☁️' },
];

export interface AvatarPreset {
  id: string;
  label: string;
  url: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'bunny',
    label: 'Cute Bunny',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M 28 32 L 18 10 L 40 22%22 fill=%22white%22 stroke=%22black%22 stroke-width=%223%22 stroke-linejoin=%22round%22 /%3E%3Cpath d=%22M 72 32 L 82 10 L 60 22%22 fill=%22white%22 stroke=%22black%22 stroke-width=%223%22 stroke-linejoin=%22round%22 /%3E%3Cellipse cx=%2250%22 cy=%2250%22 rx=%2236%22 ry=%2228%22 fill=%22white%22 stroke=%22black%22 stroke-width=%223%22 /%3E%3Cellipse cx=%2236%22 cy=%2248%22 rx=%223.5%22 ry=%225.5%22 fill=%22black%22 /%3E%3Cellipse cx=%2264%22 cy=%2248%22 rx=%223.5%22 ry=%225.5%22 fill=%22black%22 /%3E%3Cellipse cx=%2250%22 cy=%2256%22 rx=%224%22 ry=%222.5%22 fill=%22%23FFE01B%22 stroke=%22black%22 stroke-width=%221.5%22 /%3E%3Ccircle cx=%2228%22 cy=%2224%22 r=%226%22 fill=%22%23FF1744%22 stroke=%22black%22 stroke-width=%222%22 /%3E%3Ccircle cx=%2242%22 cy=%2228%22 r=%226%22 fill=%22%23FF1744%22 stroke=%22black%22 stroke-width=%222%22 /%3E%3Ccircle cx=%2235%22 cy=%2226%22 r=%224.5%22 fill=%22%23FF1744%22 stroke=%22black%22 stroke-width=%222%22 /%3E%3C/svg%3E',
  },
  {
    id: 'bear',
    label: 'Gentle Bear',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2226%22 cy=%2228%22 r=%2214%22 fill=%22%23D7CCC8%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2274%22 cy=%2228%22 r=%2214%22 fill=%22%23D7CCC8%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2250%22 cy=%2254%22 r=%2236%22 fill=%22%23EFEBE9%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Cellipse cx=%2250%22 cy=%2262%22 rx=%2216%22 ry=%2212%22 fill=%22white%22 stroke=%22black%22 stroke-width=%222%22/%3E%3Ccircle cx=%2250%22 cy=%2258%22 r=%224%22 fill=%22black%22/%3E%3Ccircle cx=%2238%22 cy=%2248%22 r=%224%22 fill=%22black%22/%3E%3Ccircle cx=%2262%22 cy=%2248%22 r=%224%22 fill=%22black%22/%3E%3C/svg%3E',
  },
  {
    id: 'kitty',
    label: 'Playful Kitty',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M 20 40 L 15 15 L 40 30 Z%22 fill=%22%23FFF3E0%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Cpath d=%22M 80 40 L 85 15 L 60 30 Z%22 fill=%22%23FFF3E0%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2250%22 cy=%2255%22 r=%2234%22 fill=%22%23FFF3E0%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2238%22 cy=%2252%22 r=%224%22 fill=%22black%22/%3E%3Ccircle cx=%2262%22 cy=%2252%22 r=%224%22 fill=%22black%22/%3E%3Cellipse cx=%2250%22 cy=%2260%22 rx=%223%22 ry=%222%22 fill=%22%23FF8A80%22/%3E%3Cline x1=%2220%22 y1=%2255%22 x2=%2232%22 y2=%2255%22 stroke=%22black%22 stroke-width=%222%22/%3E%3Cline x1=%2280%22 y1=%2255%22 x2=%2268%22 y2=%2255%22 stroke=%22black%22 stroke-width=%222%22/%3E%3C/svg%3E',
  },
  {
    id: 'puppy',
    label: 'Happy Puppy',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cellipse cx=%2220%22 cy=%2246%22 rx=%2210%22 ry=%2220%22 fill=%22%23A1887F%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Cellipse cx=%2280%22 cy=%2246%22 rx=%2210%22 ry=%2220%22 fill=%22%23A1887F%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2250%22 cy=%2252%22 r=%2232%22 fill=%22%23FFF9C4%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2238%22 cy=%2248%22 r=%224%22 fill=%22black%22/%3E%3Ccircle cx=%2262%22 cy=%2248%22 r=%224%22 fill=%22black%22/%3E%3Cellipse cx=%2250%22 cy=%2258%22 rx=%226%22 ry=%224%22 fill=%22black%22/%3E%3Cpath d=%22M 46 64 Q 50 72 54 64%22 fill=%22none%22 stroke=%22black%22 stroke-width=%222%22/%3E%3C/svg%3E',
  },
  {
    id: 'tulip',
    label: 'Sweet Tulip',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M50 45 C50 65 52 80 50 92%22 stroke=%22%234CAF50%22 stroke-width=%224%22 stroke-linecap=%22round%22 /%3E%3Cpath d=%22M50 75 C35 70 28 58 32 48 C36 50 42 62 50 72%22 fill=%22%2381C784%22 stroke=%22%234CAF50%22 stroke-width=%222.5%22 /%3E%3Cpath d=%22M50 82 C65 78 72 68 68 58 C64 60 58 70 50 78%22 fill=%22%2381C784%22 stroke=%22%234CAF50%22 stroke-width=%222.5%22 /%3E%3Cpath d=%22M50 12 C40 28 60 28 50 12Z%22 fill=%22%23FF8FA3%22 stroke=%22%23C2185B%22 stroke-width=%222.5%22 /%3E%3Cpath d=%22M50 45 C28 42 22 20 40 18 C50 25 48 38 50 45Z%22 fill=%22%23FF6B8B%22 stroke=%22%23C2185B%22 stroke-width=%222.5%22 /%3E%3Cpath d=%22M50 45 C72 42 78 20 60 18 C50 25 52 38 50 45Z%22 fill=%22%23FF6B8B%22 stroke=%22%23C2185B%22 stroke-width=%222.5%22 /%3E%3C/svg%3E',
  },
  {
    id: 'sun',
    label: 'Sunny Day',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2226%22 fill=%22%23FFE082%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2242%22 cy=%2246%22 r=%223%22 fill=%22black%22/%3E%3Ccircle cx=%2258%22 cy=%2246%22 r=%223%22 fill=%22black%22/%3E%3Cpath d=%22M 44 54 Q 50 60 56 54%22 fill=%22none%22 stroke=%22black%22 stroke-width=%222.5%22 stroke-linecap=%22round%22/%3E%3Ccircle cx=%2236%22 cy=%2252%22 r=%223%22 fill=%22%23FF8A80%22/%3E%3Ccircle cx=%2264%22 cy=%2252%22 r=%223%22 fill=%22%23FF8A80%22/%3E%3C/svg%3E',
  },
  {
    id: 'star',
    label: 'Twinkling Star',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M 50 15 L 59 38 L 84 38 L 63 54 L 71 78 L 50 63 L 29 78 L 37 54 L 16 38 L 41 38 Z%22 fill=%22%23FFF176%22 stroke=%22black%22 stroke-width=%223%22 stroke-linejoin=%22round%22/%3E%3Ccircle cx=%2244%22 cy=%2248%22 r=%222.5%22 fill=%22black%22/%3E%3Ccircle cx=%2256%22 cy=%2248%22 r=%222.5%22 fill=%22black%22/%3E%3Cpath d=%22M 47 54 Q 50 57 53 54%22 fill=%22none%22 stroke=%22black%22 stroke-width=%222%22/%3E%3C/svg%3E',
  },
  {
    id: 'cloud',
    label: 'Fluffy Cloud',
    url: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M 30 65 Q 18 65 18 52 Q 18 40 30 40 Q 32 26 48 26 Q 64 26 68 40 Q 82 40 82 52 Q 82 65 70 65 Z%22 fill=%22%23E1F5FE%22 stroke=%22black%22 stroke-width=%223%22/%3E%3Ccircle cx=%2242%22 cy=%2248%22 r=%223%22 fill=%22black%22/%3E%3Ccircle cx=%2258%22 cy=%2248%22 r=%223%22 fill=%22black%22/%3E%3Cpath d=%22M 46 54 Q 50 58 54 54%22 fill=%22none%22 stroke=%22black%22 stroke-width=%222%22/%3E%3C/svg%3E',
  }
];

export type ScrapbookThemeKey = 'pink_doodle' | 'lavender_dreams' | 'vintage_journal' | 'cozy_memories' | 'minimal_pastel';

export interface ThemeOption {
  key: ScrapbookThemeKey;
  name: string;
  tagline: string;
  previewColor: string;
  badgeBg: string;
  accentColor: string;
  accentBorder: string;
  cardBg: string;
}

export const THEME_OPTIONS: Record<ScrapbookThemeKey, ThemeOption> = {
  pink_doodle: {
    key: 'pink_doodle',
    name: 'Pink Doodle',
    tagline: 'Warm rose, sweet pinks, and classic handwritten notes',
    previewColor: '#FF6B8B',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    accentColor: '#d81b60',
    accentBorder: 'border-pink-300',
    cardBg: 'bg-white',
  },
  lavender_dreams: {
    key: 'lavender_dreams',
    name: 'Lavender Dreams',
    tagline: 'Muted lilac, twilight purple, and dreamy night skies',
    previewColor: '#9C88FF',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    accentColor: '#6a1b9a',
    accentBorder: 'border-purple-300',
    cardBg: 'bg-purple-50/40',
  },
  vintage_journal: {
    key: 'vintage_journal',
    name: 'Vintage Journal',
    tagline: 'Aged parchment, sepia stamps, and timeless scrapbook texture',
    previewColor: '#8D6E63',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    accentColor: '#5d4037',
    accentBorder: 'border-amber-400',
    cardBg: 'bg-amber-50/50',
  },
  cozy_memories: {
    key: 'cozy_memories',
    name: 'Cozy Memories',
    tagline: 'Warm honey, butter yellow, and comforting fireplace tones',
    previewColor: '#FFA726',
    badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    accentColor: '#e65100',
    accentBorder: 'border-yellow-300',
    cardBg: 'bg-orange-50/30',
  },
  minimal_pastel: {
    key: 'minimal_pastel',
    name: 'Minimal Pastel',
    tagline: 'Soft sage, mint breeze, and modern gentle sketches',
    previewColor: '#26A69A',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentColor: '#004d40',
    accentBorder: 'border-emerald-300',
    cardBg: 'bg-emerald-50/30',
  },
};
