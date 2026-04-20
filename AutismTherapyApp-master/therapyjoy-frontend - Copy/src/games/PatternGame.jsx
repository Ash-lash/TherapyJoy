import React, { useEffect, useState } from 'react';
import { patternLevels } from './data/patterns';
import { useGameState } from './hooks/useGameState';
import GameProgressBar from './components/GameProgressBar';
import StarRewardScreen from './components/StarRewardScreen';
import AIHintBubble, { getAIHint } from './components/AIHintBubble';

const LEVELS = ['easy', 'medium', 'hard'];

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function sameChoice(level, a, b) {
  if (level === 'hard') {
    return a?.shape === b?.shape && a?.color === b?.color;
  }
  return a === b;
}

export default function PatternGame({ onGoHome }) {
  const [level, setLevel] = useState('easy');
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [hint, setHint] = useState('');
  const [timeLeft, setTimeLeft] = useState(12);

  const {
    currentRound,
    totalRounds,
    score,
    stars,
    isSaving,
    isGameOver,
    submitRound,
    resetGame,
    sessionStartTime,
  } = useGameState('pattern-game', 10);

  useEffect(() => {
    if (isGameOver) return;
    const nextQuestion = { ...randomFrom(patternLevels[level]) };

    setQuestion(nextQuestion);
    setSelected(null);
    setStatus('idle');
    setAttemptsLeft(3);
    setHint('');
    setTimeLeft(12);
  }, [currentRound, isGameOver, level]);

  useEffect(() => {
    if (level !== 'hard' || status !== 'idle' || isGameOver) return;

    if (timeLeft <= 0) {
      setStatus('timeout');
      setSelected(question.answer);
      setTimeout(async () => {
        const isFinal = currentRound >= totalRounds;
        const elapsedSeconds = (Date.now() - sessionStartTime) / 1000;
        const bonus = isFinal && elapsedSeconds < 60 ? 1 : 0;
        await submitRound(false, bonus);
      }, 1400);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [currentRound, isGameOver, level, question, sessionStartTime, status, submitRound, timeLeft, totalRounds]);

  const renderToken = (item) => {
    if (level === 'hard') {
      return <span style={{ fontSize: 46, color: item.color }}>{item.shape}</span>;
    }
    return <span style={{ fontSize: 46, color: '#2D4770' }}>{item}</span>;
  };

  const onChoose = async (choice) => {
    if (!question || status !== 'idle') return;

    setSelected(choice);
    const correct = sameChoice(level, choice, question.answer);

    if (correct) {
      setStatus('correct');
      setTimeout(async () => {
        const isFinal = currentRound >= totalRounds;
        const elapsedSeconds = (Date.now() - sessionStartTime) / 1000;
        const bonus = level === 'hard' && isFinal && elapsedSeconds < 60 ? 1 : 0;
        await submitRound(true, bonus);
      }, 1300);
      return;
    }

    const remaining = attemptsLeft - 1;
    setAttemptsLeft(remaining);
    setStatus('wrong');

    if (remaining <= 0) {
      setSelected(question.answer);
      setTimeout(async () => {
        const isFinal = currentRound >= totalRounds;
        const elapsedSeconds = (Date.now() - sessionStartTime) / 1000;
        const bonus = level === 'hard' && isFinal && elapsedSeconds < 60 ? 1 : 0;
        await submitRound(false, bonus);
      }, 1400);
      return;
    }

    if (remaining === 1) {
      setHint(`Try this pattern unit: ${question.repeatUnit.map((unit) => (typeof unit === 'string' ? unit : unit.shape)).join(' -> ')}`);
    }

    setTimeout(() => {
      setStatus('idle');
      setSelected(null);
    }, 380);
  };

  const onHelp = async () => {
    if (!question) return;
    const aiHint = await getAIHint('pattern', {
      sequence: question.sequence,
      wrongAnswer: selected,
    });
    setHint(aiHint);
  };

  if (isSaving) return <div style={styles.loading}>Saving your stars...</div>;

  if (isGameOver) {
    return (
      <StarRewardScreen
        score={score}
        total={totalRounds}
        stars={stars}
        onPlayAgain={resetGame}
        onGoHome={onGoHome}
      />
    );
  }

  if (!question) return null;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <button type="button" style={styles.backBtn} onClick={onGoHome}>Back</button>
        <div style={styles.levelRow}>
          {LEVELS.map((levelItem) => {
            const active = levelItem === level;
            return (
              <button
                key={levelItem}
                type="button"
                onClick={() => {
                  setLevel(levelItem);
                  resetGame();
                }}
                style={{ ...styles.levelBtn, ...(active ? styles.levelBtnActive : {}) }}
              >
                {levelItem[0].toUpperCase() + levelItem.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} color="#F2C96A" />

      {level === 'hard' && (
        <div style={styles.timerTrack}>
          <div style={{ ...styles.timerFill, width: `${(timeLeft / 12) * 100}%` }} />
        </div>
      )}

      <p style={styles.attemptText}>Attempts left: {attemptsLeft}</p>

      {status === 'timeout' && <p style={styles.infoText}>Oops! Time is up. Here is the right answer.</p>}
      {status === 'correct' && <p style={styles.successText}>Pattern master!</p>}

      <section style={styles.sequencePanel}>
        <div style={styles.sequenceScroller}>
          {question.sequence.map((item, index) => (
            <React.Fragment key={`${index}-${typeof item === 'string' ? item : item.shape}`}>
              <div style={{ ...styles.tile, ...(status === 'correct' ? styles.correctWave : {}) }}>{renderToken(item)}</div>
              <span style={styles.arrow}>→</span>
            </React.Fragment>
          ))}
          <div style={{ ...styles.tile, ...styles.questionTile }}>
            {status === 'correct' || status === 'timeout' || attemptsLeft <= 0 ? renderToken(selected) : <span style={styles.questionMark}>?</span>}
          </div>
        </div>
      </section>

      <section style={styles.choiceRow}>
        {question.choices.map((choice, index) => {
          const picked = sameChoice(level, selected, choice);
          return (
            <button
              key={`${index}-${typeof choice === 'string' ? choice : `${choice.shape}-${choice.color}`}`}
              type="button"
              style={{
                ...styles.choiceBtn,
                ...(picked && status === 'wrong' ? styles.wrongChoice : {}),
              }}
              className={picked && status === 'wrong' ? 'shake-soft' : ''}
              onClick={() => onChoose(choice)}
              disabled={status === 'correct' || status === 'timeout'}
            >
              {renderToken(choice)}
            </button>
          );
        })}
      </section>

      {attemptsLeft <= 1 && status !== 'correct' && (
        <button type="button" style={styles.helpBtn} onClick={onHelp}>Get Help</button>
      )}

      <AIHintBubble hint={hint} onClose={() => setHint('')} />

      <style>{`
        .shake-soft {
          animation: shakeSoft 260ms ease-in-out;
        }
        @keyframes pulseQuestion {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.07); opacity: 0.8; }
        }
        @keyframes shakeSoft {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          80% { transform: translateX(-3px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    maxWidth: 480,
    margin: '0 auto',
    paddingBottom: 24,
    background: 'linear-gradient(180deg, #FFF7DF 0%, #FFF3E9 40%, #EDF8FF 100%)',
  },
  loading: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
  },
  headerRow: {
    padding: '14px 12px 8px',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  backBtn: {
    minHeight: 60,
    minWidth: 80,
    borderRadius: 16,
    border: 'none',
    background: '#FFFFFF',
    color: '#4B617F',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
  },
  levelRow: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  levelBtn: {
    minHeight: 60,
    borderRadius: 16,
    border: '2px solid #E6DEC8',
    background: '#FFFCF4',
    color: '#5A4B27',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },
  levelBtnActive: {
    background: '#FFF2C6',
    borderColor: '#F4D87C',
  },
  timerTrack: {
    width: 'calc(100% - 28px)',
    margin: '4px auto 0',
    height: 10,
    borderRadius: 99,
    background: '#F5EBCD',
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    background: '#EDB389',
    transition: 'width 300ms ease-in-out',
  },
  attemptText: {
    margin: '8px 0 0',
    textAlign: 'center',
    color: '#5E5032',
    fontSize: 20,
    fontWeight: 700,
  },
  infoText: {
    margin: '8px 0 0',
    textAlign: 'center',
    fontSize: 20,
    color: '#6A5C3E',
  },
  successText: {
    margin: '8px 0 0',
    textAlign: 'center',
    fontSize: 28,
    color: '#2A8A5E',
    fontWeight: 800,
  },
  sequencePanel: {
    marginTop: 10,
    padding: '0 12px',
  },
  sequenceScroller: {
    background: '#FFFFFF',
    borderRadius: 22,
    padding: '14px 10px',
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  },
  tile: {
    minWidth: 80,
    width: 80,
    height: 80,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    background: '#F8F8FB',
    border: '2px solid #ECEEF7',
    flexShrink: 0,
  },
  questionTile: {
    border: '2px dashed #E7C363',
    background: '#FFF8DE',
  },
  questionMark: {
    fontSize: 40,
    color: '#C59A2F',
    animation: 'pulseQuestion 1200ms ease-in-out infinite',
  },
  correctWave: {
    borderColor: '#83CCAA',
  },
  arrow: {
    margin: '0 8px',
    color: '#A8B1C5',
    fontSize: 22,
    flexShrink: 0,
  },
  choiceRow: {
    marginTop: 14,
    padding: '0 12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  choiceBtn: {
    minHeight: 88,
    borderRadius: 16,
    border: '2px solid #E9E2CC',
    background: '#FFFFFF',
    cursor: 'pointer',
  },
  wrongChoice: {
    borderColor: '#E9B5AA',
    background: '#FFF7F5',
  },
  helpBtn: {
    display: 'block',
    width: 'calc(100% - 24px)',
    margin: '12px auto 0',
    minHeight: 60,
    borderRadius: 16,
    border: 'none',
    background: '#FFE6A5',
    color: '#5F3E00',
    fontSize: 22,
    fontWeight: 800,
    cursor: 'pointer',
  },
};
