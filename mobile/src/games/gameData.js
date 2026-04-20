export const emotions = [
  { id: 'happy', emoji: '😊', label: 'Happy', hint: 'This face is smiling — that means happy!' },
  { id: 'sad', emoji: '😢', label: 'Sad', hint: 'Tears and a frown mean sad.' },
  { id: 'angry', emoji: '😠', label: 'Angry', hint: 'Furrowed eyebrows show anger.' },
  { id: 'surprised', emoji: '😲', label: 'Surprised', hint: 'Wide eyes and open mouth = surprised!' },
  { id: 'scared', emoji: '😨', label: 'Scared', hint: 'Tense face means scared.' },
  { id: 'excited', emoji: '🤩', label: 'Excited', hint: 'Sparkly eyes mean excited!' },
  { id: 'calm', emoji: '😌', label: 'Calm', hint: 'Relaxed face means calm.' },
  { id: 'love', emoji: '🥰', label: 'Love', hint: 'Hearts and smiles mean love.' },
];

export const colors = [
  { id: 'red', label: 'Red', hex: '#EF4444', item: '🍎' },
  { id: 'orange', label: 'Orange', hex: '#F97316', item: '🍊' },
  { id: 'yellow', label: 'Yellow', hex: '#FACC15', item: '🍌' },
  { id: 'green', label: 'Green', hex: '#22C55E', item: '🥬' },
  { id: 'blue', label: 'Blue', hex: '#3B82F6', item: '🫐' },
  { id: 'purple', label: 'Purple', hex: '#A855F7', item: '🍇' },
  { id: 'pink', label: 'Pink', hex: '#EC4899', item: '🌸' },
  { id: 'brown', label: 'Brown', hex: '#92400E', item: '🍫' },
];

export const patternShapes = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠'];

export function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function pickN(arr, n) {
  return shuffled(arr).slice(0, n);
}
