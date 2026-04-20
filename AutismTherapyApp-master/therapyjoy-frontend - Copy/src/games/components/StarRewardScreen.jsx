import React, { useEffect, useMemo, useState } from 'react';

export default function StarRewardScreen({
  score,
  total,
  stars,
  onPlayAgain,
  onGoHome,
}) {
  const [filledStars, setFilledStars] = useState(0);
  const confettiBits = useMemo(
    () => Array.from({ length: 24 }, (_, idx) => idx),
    []
  );

  useEffect(() => {
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      setFilledStars(Math.min(current, stars));
      if (current >= stars) clearInterval(id);
    }, 280);

    return () => clearInterval(id);
  }, [stars]);

  return (
    <div style={styles.overlay} role="dialog" aria-label="Game reward">
      {stars === 3 && (
        <div style={styles.confettiLayer} aria-hidden="true">
          {confettiBits.map((bit) => (
            <span
              key={bit}
              className="tj-confetti"
              style={{
                left: `${(bit * 13) % 100}%`,
                animationDelay: `${(bit % 8) * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>Session Complete</h2>
        <div style={styles.starRow}>
          {[1, 2, 3].map((value) => (
            <span
              key={value}
              style={{
                ...styles.star,
                color: value <= filledStars ? '#FFC845' : '#D3DCEB',
                transform: value <= filledStars ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              ★
            </span>
          ))}
        </div>
        <p style={styles.scoreText}>You scored {score} out of {total}!</p>
        <div style={styles.actions}>
          <button type="button" style={styles.playAgain} onClick={onPlayAgain}>Play Again</button>
          <button type="button" style={styles.goHome} onClick={onGoHome}>Go Home</button>
        </div>
      </div>

      <style>{`
        .tj-confetti {
          position: absolute;
          top: -8px;
          width: 10px;
          height: 16px;
          border-radius: 4px;
          background: #7ec8ff;
          animation: fall 2.8s ease-in-out infinite;
        }
        .tj-confetti:nth-child(3n) { background: #ffd36e; }
        .tj-confetti:nth-child(4n) { background: #97e8bc; }
        .tj-confetti:nth-child(5n) { background: #ffb6ad; }

        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.9; }
          100% { transform: translateY(110vh) rotate(220deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 60,
    background: 'rgba(12, 23, 44, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  confettiLayer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  card: {
    width: 'min(420px, 100%)',
    background: 'linear-gradient(160deg, #FFFFFF, #F5FAFF)',
    borderRadius: 28,
    padding: '26px 20px',
    textAlign: 'center',
    boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
  },
  title: {
    margin: 0,
    fontSize: 34,
    color: '#1B2A4A',
  },
  starRow: {
    marginTop: 12,
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
  },
  star: {
    fontSize: 66,
    transition: 'all 300ms ease-in-out',
  },
  scoreText: {
    margin: '8px 0 0 0',
    fontSize: 24,
    color: '#2A3E66',
    fontWeight: 700,
  },
  actions: {
    marginTop: 18,
    display: 'grid',
    gap: 10,
  },
  playAgain: {
    minHeight: 60,
    borderRadius: 16,
    border: 'none',
    background: '#7FC8A9',
    color: '#153A2E',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
  },
  goHome: {
    minHeight: 60,
    borderRadius: 16,
    border: 'none',
    background: '#D4DEEF',
    color: '#1F2F52',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
