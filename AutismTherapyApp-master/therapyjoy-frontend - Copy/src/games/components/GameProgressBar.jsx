import React from 'react';

export default function GameProgressBar({ current, total, color = '#67A6FF' }) {
  const safeCurrent = Math.min(current, total);
  const percent = Math.round((safeCurrent / total) * 100);

  return (
    <div style={styles.wrap} aria-label={`Round ${safeCurrent} of ${total}`}>
      <div style={styles.labelRow}>
        <span style={styles.roundText}>Round {safeCurrent} of {total}</span>
        <span style={styles.percentText}>{percent}%</span>
      </div>
      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    width: '100%',
    maxWidth: 480,
    padding: '8px 16px 14px',
    margin: '0 auto',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 700,
    color: '#1C3259',
  },
  roundText: {
    fontSize: 20,
  },
  percentText: {
    fontSize: 18,
  },
  track: {
    height: 12,
    borderRadius: 999,
    background: '#EAF1FF',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    transition: 'width 300ms ease-in-out',
  },
};
