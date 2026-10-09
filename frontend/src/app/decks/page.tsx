'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { triggerSparkles } from '@/utils/sparkles';

export default function CardDecksPage() {
  const { cardDecks, createCardDeck, toggleCardReveal, activeScrapbook, currentUser } = useStore();
  const [selectedDeckId, setSelectedDeckId] = useState<string>(cardDecks[0]?.id || '');
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newCardsText, setNewCardsText] = useState('');

  const currentDeck = cardDecks.find((d) => d.id === selectedDeckId) || cardDecks[0];

  const handleCardClick = (cardId: string, isRevealed: boolean, e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRevealed) {
      triggerSparkles(e.clientX, e.clientY, 'dashboard');
    }
    toggleCardReveal(cardId);
  };

  const handleCreateDeckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    const cardsArray = newCardsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    await createCardDeck(
      newDeckTitle.trim(),
      newDeckDesc.trim() || undefined,
      'auto_awesome',
      cardsArray.length > 0 ? cardsArray : ['First sweet prompt or affirmation! ✨']
    );

    setIsCreatingDeck(false);
    setNewDeckTitle('');
    setNewDeckDesc('');
    setNewCardsText('');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-24 doodle-bg-dots min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <span className="material-symbols-outlined text-primary text-5xl animate-bounce mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
          style
        </span>
        <h2 className="font-gloria text-4xl text-primary">Customizable Card Decks</h2>
        <p className="font-patrick text-lg text-on-surface-variant max-w-lg mt-2">
          Decks of daily affirmations, gratitude notes, memory prompts, and customized cards to reveal one by one!
        </p>

        {/* Deck Selectors & Create Button */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {cardDecks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => setSelectedDeckId(deck.id)}
              className={`px-4 py-2 rounded-full font-patrick text-base transition-all border-2 ${
                (currentDeck?.id === deck.id)
                  ? 'bg-primary text-white border-primary shadow-sm scale-105 font-bold'
                  : 'bg-white text-on-surface border-outline-variant hover:bg-primary-container/20'
              }`}
            >
              ✨ {deck.title}
            </button>
          ))}

          <button
            onClick={() => setIsCreatingDeck(!isCreatingDeck)}
            className="sketchy-border px-4 py-2 bg-secondary text-white font-patrick text-base hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Card Deck
          </button>
        </div>
      </div>

      {/* CREATE NEW DECK MODAL / FORM */}
      {isCreatingDeck && (
        <div className="taped-paper sketchy-border p-6 max-w-lg mx-auto bg-white mb-10 animate-scaleUp">
          <h3 className="font-gloria text-2xl text-primary mb-3">Create New Card Deck 🎴</h3>
          <form onSubmit={handleCreateDeckSubmit} className="space-y-3">
            <div>
              <label className="font-patrick text-base text-primary block mb-1">Deck Title</label>
              <input
                type="text"
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                placeholder="e.g. 50 Reasons I Love You, Daily Gratitude Sparks"
                className="w-full px-3 py-2 doodle-border font-patrick text-lg"
                required
              />
            </div>

            <div>
              <label className="font-patrick text-base text-primary block mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newDeckDesc}
                onChange={(e) => setNewDeckDesc(e.target.value)}
                placeholder="A collection of thoughts to brighten the day"
                className="w-full px-3 py-2 doodle-border font-patrick text-base"
              />
            </div>

            <div>
              <label className="font-patrick text-base text-primary block mb-1">
                Cards Content (Enter one card per line)
              </label>
              <textarea
                value={newCardsText}
                onChange={(e) => setNewCardsText(e.target.value)}
                placeholder={'Your sweet morning laugh\nThe way you drink hot chocolate\nThat funny movie night'}
                rows={5}
                className="w-full px-3 py-2 doodle-border font-patrick text-base"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="sticker-btn flex-1 py-2 bg-primary text-white font-patrick text-lg"
              >
                Create Deck ✨
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingDeck(false)}
                className="sketchy-border px-4 py-2 font-patrick text-lg text-outline hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ACTIVE DECK CARDS GRID */}
      {currentDeck ? (
        <div>
          <div className="text-center mb-8">
            <h3 className="font-gloria text-2xl text-primary">{currentDeck.title}</h3>
            {currentDeck.description && (
              <p className="font-patrick text-lg text-on-surface-variant italic">&quot;{currentDeck.description}&quot;</p>
            )}
            <span className="font-patrick text-sm text-outline mt-1 inline-block">
              {currentDeck.cards?.filter((c) => c.is_revealed).length || 0} / {currentDeck.cards?.length || 0} revealed
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentDeck.cards?.map((card) => {
              return (
                <div
                  key={card.id}
                  onClick={(e) => handleCardClick(card.id, card.is_revealed, e)}
                  className={`cursor-pointer transition-all duration-300 min-h-[170px] p-4 flex flex-col justify-between select-none ${
                    card.is_revealed
                      ? 'taped-paper sketchy-border bg-white rotate-1 shadow-sm'
                      : 'sketchy-border bg-primary-container/30 hover:bg-primary-container/50 -rotate-1 hover:scale-105'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-patrick text-outline">
                    <span>Card #{card.card_number}</span>
                    <span className="material-symbols-outlined text-sm">
                      {card.is_revealed ? 'lock_open' : 'lock'}
                    </span>
                  </div>

                  <div className="my-auto text-center py-2">
                    {card.is_revealed ? (
                      <p className="font-patrick text-lg text-on-surface leading-snug">
                        {card.content}
                      </p>
                    ) : (
                      <div className="flex flex-col items-center gap-1 opacity-75">
                        <span className="material-symbols-outlined text-2xl text-primary">touch_app</span>
                        <span className="font-patrick text-sm text-primary font-bold">Tap to Reveal ✨</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-patrick text-[11px] text-outline">
                      {card.is_revealed ? 'Revealed' : 'Secret'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="taped-paper sketchy-border p-8 text-center bg-white max-w-md mx-auto">
          <p className="font-patrick text-xl text-outline italic">No card decks created yet. Click New Card Deck to start!</p>
        </div>
      )}
    </main>
  );
}
