import React from 'react';

export const getAIHint = async (gameType, context) => {
  // Placeholder for Person 4 to replace with Claude API integration.
  return 'Watch carefully and try again! Look for the clue in the pattern.';
};

export default function AIHintBubble({ hint, onClose }) {
  if (!hint) return null;

  return (
    <div style={styles.overlay} role="dialog" aria-label="AI hint">
      <div style={styles.bubbleWrap}>
        <div style={styles.avatar} aria-hidden="true">🧠</div>
        <div style={styles.bubble}>
          <p style={styles.text}>{hint}</p>
          <button type="button" onClick={onClose} style={styles.closeBtn}>
            Close Hint
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 16,
    pointerEvents: 'none',
    zIndex: 40,
  },
  bubbleWrap: {
    width: 'min(480px, 100%)',
    display: 'grid',
    gridTemplateColumns: '72px 1fr',
    gap: 10,
    alignItems: 'end',
    pointerEvents: 'auto',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: '#E3FAF2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
  },
  bubble: {
    borderRadius: '20px 20px 20px 6px',
    background: '#FFFFFF',
    border: '2px solid #A9E9D6',
    boxShadow: '0 14px 26px rgba(0,0,0,0.16)',
    padding: 16,
  },
  text: {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.35,
    color: '#1B2A4A',
  },
  closeBtn: {
    marginTop: 12,
    minHeight: 60,
    minWidth: 160,
    borderRadius: 16,
    border: 'none',
    background: '#FFE39C',
    color: '#5E4300',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
