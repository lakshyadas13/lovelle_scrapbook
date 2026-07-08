export interface LoveReason {
  id: number;
  text: string;
}

export const LOVE_REASONS: LoveReason[] = [
  { id: 1, text: "Your smile can brighten even my darkest day." },
  { id: 2, text: "Your adorable puppy eyes melt my heart every single time." },
  { id: 3, text: "Watching you dominate in Rocket League makes me smile." },
  { id: 4, text: "Your rings (ifykyk ❤️) will always have a special place in my heart." },
  { id: 5, text: "You’re the only person who knows exactly how to manao me." },
  { id: 6, text: "Your dressing sense is effortlessly beautiful." },
  { id: 7, text: "I could listen to you sing forever." },
  { id: 8, text: "Watching you dance makes me fall for you all over again." },
  { id: 9, text: "Your emotional maturity inspires me every day." },
  { id: 10, text: "The effort you put into our relationship never goes unnoticed." },
  { id: 11, text: "Even during exams, you travel back and forth just to see me, and I’ll never stop appreciating that." },
  { id: 12, text: "Your laugh is my favorite sound." },
  { id: 13, text: "You make every ordinary day feel special." },
  { id: 14, text: "You make me want to become a better person." },
  { id: 15, text: "You make me feel safe, loved, and understood." },
  { id: 16, text: "You always support my dreams." },
  { id: 17, text: "You somehow know what I’m thinking before I say it." },
  { id: 18, text: "Every hug from you feels like home." },
  { id: 19, text: "Every call with you instantly makes my day better." },
  { id: 20, text: "You choose us, every single day." },
  // Placeholders for reasons 21 to 99
  ...Array.from({ length: 79 }, (_, i) => ({
    id: i + 21,
    text: `Reason ${i + 21} - To be filled with another reason I love you ❤️`
  })),
  // Reason #100
  {
    id: 100,
    text: `I promised you 100 reasons… but the truth is, I’d never be able to stop at 100. Every single day you give me a brand new reason to fall in love with you all over again.

Happy 100 Days, WIFEYYY.

Thank you for choosing me, loving me, forgiving me, supporting me, and growing with me.

Here’s to hundreds, thousands, and forever more.

I love you endlessly. ❤️`
  }
];
