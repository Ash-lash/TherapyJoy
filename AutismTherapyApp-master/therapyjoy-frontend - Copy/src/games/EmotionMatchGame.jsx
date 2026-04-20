import React, { useEffect, useMemo, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { emotionList, encouragements } from './data/emotions';
import StarRewardScreen from './components/StarRewardScreen';
import AIHintBubble, { getAIHint } from './components/AIHintBubble';
import GameProgressBar from './components/GameProgressBar';

const LEVELS = {
  easy: { label: 'Easy', count: 4, choices: 4, timed: false },
  medium: { label: 'Medium', count: 6, choices: 4, timed: false },
  hard: { label: 'Hard', count: 6, choices: 6, timed: true },
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function EmotionMatchGame({ onGoHome }) {
  const [level, setLevel] = useState('easy');
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [feedback, setFeedback] = useState('idle');
  const [hint, setHint] = useState('');
  const [softHint, setSoftHint] = useState('');
  const [praise, setPraise] = useState('');
  const [timeLeft, setTimeLeft] = useState(8);

  const {
    currentRound,
    totalRounds,
    score,
    stars,
    isSaving,
    isGameOver,
    submitRound,
    resetGame,
  } = useGameState('emotion-match', 10);

  const activeLevel = LEVELS[level];
  const progressColor = '#AFA1FF';

  useEffect(() => {
    if (isGameOver) return;

    const pool = emotionList.slice(0, activeLevel.count);
    const answer = pool[Math.floor(Math.random() * pool.length)];
    const rest = shuffle(pool.filter((item) => item.id !== answer.id)).slice(0, activeLevel.choices - 1);

    setQuestion(answer);
    setChoices(shuffle([answer, ...rest]));
    setSelectedId('');
    setFeedback('idle');
    setHint('');
    setSoftHint('');
    setPraise('');
    setTimeLeft(8);
  }, [activeLevel.choices, activeLevel.count, currentRound, isGameOver]);

  useEffect(() => {
    if (!activeLevel.timed || feedback !== 'idle' || isGameOver) return;

    if (timeLeft <= 0) {
      setFeedback('wrong');
      setSoftHint('Oops! Time is up. Watch the face and try this one again.');
      setTimeout(async () => {
        await submitRound(false);
      }, 1300);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [activeLevel.timed, feedback, isGameOver, submitRound, timeLeft]);

  const roundLabel = useMemo(
    () => `Round ${Math.min(currentRound, totalRounds)} of ${totalRounds}`,
    [currentRound, totalRounds]
  );

  const handleSelectChoice = async (choice) => {
    if (!question || feedback !== 'idle') return;

    setSelectedId(choice.id);

    if (choice.id === question.id) {
      setFeedback('correct');
      setPraise(encouragements[Math.floor(Math.random() * encouragements.length)]);
      setTimeout(async () => {
        await submitRound(true);
      }, 1100);
      return;
    }

    setFeedback('wrong');
    setSoftHint(question.hint || 'Look at the face one more time.');
  };

  const handleGetHelp = async () => {
    if (!question) return;
    const response = await getAIHint('emotion', question.label);
    setHint(response);
  };

  const handleCloseHint = () => {
    setHint('');
    if (feedback === 'wrong') {
      setSelectedId('');
      setFeedback('idle');
    }
  };

  const handleLevelChange = (nextLevel) => {
    setLevel(nextLevel);
    resetGame();
  };

  if (isSaving) {
    return <div style={styles.loading}>Saving your stars...</div>;
  }

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
        <div style={styles.levelPills}>
          {Object.keys(LEVELS).map((levelKey) => {
            const active = levelKey === level;
            return (
              <button
                key={levelKey}
                type="button"
                onClick={() => handleLevelChange(levelKey)}
                style={{ ...styles.levelBtn, ...(active ? styles.levelBtnActive : {}) }}
              >
                {LEVELS[levelKey].label}
              </button>
            );
          })}
        </div>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} color={progressColor} />

      {activeLevel.timed && (
        <div style={styles.timerTrack}>
          <div style={{ ...styles.timerFill, width: `${(timeLeft / 8) * 100}%` }} />
        </div>
      )}

      <div style={styles.roundText}>{roundLabel}</div>

      <section style={styles.stageCard}>
        <div style={styles.emojiWrap}>{question.emoji}</div>
        {feedback === 'correct' && <div style={styles.praise}>{praise}</div>}
        {feedback === 'wrong' && softHint && <p style={styles.hintText}>{softHint}</p>}
      </section>

      <section style={styles.answerGrid}>
        {choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isRight = choice.id === question.id;

          let cardStyle = { ...styles.answerCard };
          if (feedback === 'correct' && isRight) {
            cardStyle = { ...cardStyle, ...styles.correctCard };
          }
          if (feedback === 'wrong' && isSelected) {
            cardStyle = { ...cardStyle, ...styles.wrongCard };
          }

          return (
            <button
              key={choice.id}
              type="button"
              style={cardStyle}
              onClick={() => handleSelectChoice(choice)}
              disabled={feedback === 'correct'}
              className={feedback === 'wrong' && isSelected ? 'shake-soft' : ''}
            >
              <span style={styles.answerText}>{choice.label}</span>
            </button>
          );
        })}
      </section>

      {feedback === 'wrong' && (
        <button type="button" style={styles.helpBtn} onClick={handleGetHelp}>
          Get Help
        </button>
      )}

      <AIHintBubble hint={hint} onClose={handleCloseHint} />

      <style>{`
        .shake-soft {
          animation: shakeSoft 260ms ease-in-out;
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
    background: 'linear-gradient(170deg, #F7EEFF, #E9F1FF 50%, #FFF9DD)',
    paddingBottom: 24,
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
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    padding: '14px 12px 8px',
  },
  backBtn: {
    minHeight: 60,
    minWidth: 70,
    borderRadius: 16,
    border: 'none',
    background: '#FFFFFF',
    color: '#334B7A',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
  },
  levelPills: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    width: '100%',
  },
  levelBtn: {
    minHeight: 60,
    borderRadius: 16,
    border: '2px solid #DADDF7',
    background: '#F8FAFF',
    color: '#355086',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },
  levelBtnActive: {
    borderColor: '#9A8DFA',
    background: '#EFE9FF',
  },
  timerTrack: {
    width: 'calc(100% - 32px)',
    margin: '4px auto 0',
    height: 10,
    borderRadius: 99,
    background: '#E9EEFF',
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    background: '#F1A77A',
    transition: 'width 300ms ease-in-out',
  },
  roundText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 700,
    color: '#2A4272',
    marginTop: 6,
  },
  stageCard: {
    margin: '12px 14px 0',
    padding: '16px 12px',
    borderRadius: 28,
    background: '#FFFFFF',
    textAlign: 'center',
    boxShadow: '0 12px 24px rgba(30, 42, 82, 0.12)',
  },
  emojiWrap: {
    fontSize: 128,
    lineHeight: 1,
  },
  praise: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 800,
    color: '#2A8A5E',
  },
  hintText: {
    margin: '10px auto 0',
    fontSize: 20,
    lineHeight: 1.3,
    color: '#4C5775',
    maxWidth: 360,
  },
  answerGrid: {
    margin: '16px 14px 0',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  answerCard: {
    minHeight: 86,
    borderRadius: 20,
    border: '3px solid #E4E8FA',
    background: '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 260ms ease-in-out',
  },
  correctCard: {
    borderColor: '#7CCFA3',
    boxShadow: '0 0 0 4px rgba(124, 207, 163, 0.28)',
    transform: 'translateY(-1px)',
  },
  wrongCard: {
    borderColor: '#E9A8A0',
    background: '#FFF7F6',
  },
  answerText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1D3565',
  },
  helpBtn: {
    display: 'block',
    width: 'calc(100% - 28px)',
    margin: '14px auto 0',
    minHeight: 60,
    borderRadius: 16,
    border: 'none',
    background: '#FFE7A6',
    color: '#5F3E00',
    fontSize: 22,
    fontWeight: 800,
    cursor: 'pointer',
  },
};
