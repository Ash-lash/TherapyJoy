import React, { useEffect, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { colorItems } from './data/colors';
import GameProgressBar from './components/GameProgressBar';
import AIHintBubble, { getAIHint } from './components/AIHintBubble';
import StarRewardScreen from './components/StarRewardScreen';

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function ColorGame({ onGoHome }) {
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [feedback, setFeedback] = useState('idle');
  const [hint, setHint] = useState('');
  const [associationList, setAssociationList] = useState([]);

  const {
    currentRound,
    totalRounds,
    score,
    stars,
    isSaving,
    isGameOver,
    submitRound,
    resetGame,
  } = useGameState('color-game', 10);

  useEffect(() => {
    if (isGameOver) return;

    const answerColor = colorItems[Math.floor(Math.random() * colorItems.length)];
    const object = answerColor.objects[Math.floor(Math.random() * answerColor.objects.length)];

    const distractors = shuffle(colorItems.filter((item) => item.id !== answerColor.id)).slice(0, 3);

    setQuestion({ color: answerColor, object });
    setChoices(shuffle([answerColor, ...distractors]));
    setSelectedId('');
    setFeedback('idle');
    setHint('');
    setAssociationList([]);
  }, [currentRound, isGameOver]);

  const handleAnswer = async (choice) => {
    if (!question || feedback !== 'idle') return;

    setSelectedId(choice.id);

    if (choice.id === question.color.id) {
      setFeedback('correct');
      const others = question.color.objects.filter((obj) => obj.name !== question.object.name).slice(0, 2);
      setAssociationList(others);
      setTimeout(async () => {
        await submitRound(true);
      }, 2200);
      return;
    }

    setFeedback('wrong');
  };

  const handleGetHelp = async () => {
    if (!question) return;
    const aiHint = await getAIHint('color', {
      object: question.object.name,
      wrongColor: choices.find((choice) => choice.id === selectedId)?.name,
      rightColor: question.color.name,
    });
    setHint(aiHint);
  };

  const onCloseHint = () => {
    setHint('');
    if (feedback === 'wrong') {
      setFeedback('idle');
      setSelectedId('');
    }
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
      <div style={styles.header}>
        <button type="button" style={styles.backBtn} onClick={onGoHome}>Back</button>
        <h2 style={styles.title}>Color Recognition</h2>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} color="#78B7FA" />

      <div style={styles.objectCard}>
        <div style={styles.objectEmoji}>{question.object.emoji}</div>
      </div>

      <h3 style={styles.question}>What color is this?</h3>

      {feedback === 'correct' && (
        <div style={{ ...styles.correctBanner, color: question.color.hex }}>
          Yes! That is {question.color.name.toUpperCase()}!
        </div>
      )}

      {feedback === 'correct' && associationList.length > 0 && (
        <div style={styles.associationWrap}>
          <div style={styles.associationTitle}>{question.color.name} is also:</div>
          <div style={styles.associationItems}>
            {associationList.map((item) => (
              <div key={item.name} style={styles.associationItem}>
                <span style={styles.associationEmoji}>{item.emoji}</span>
                <span style={styles.associationName}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.choiceRow}>
        {choices.map((choice) => {
          const selected = selectedId === choice.id;
          let buttonStyle = { ...styles.choiceBtn, background: choice.hex };

          if (selected && feedback === 'wrong') {
            buttonStyle = { ...buttonStyle, border: '4px solid #D9DDE8' };
          }
          if (selected && feedback === 'correct') {
            buttonStyle = { ...buttonStyle, transform: 'scale(1.08)' };
          }
          if (choice.id === 'white') {
            buttonStyle.border = '2px solid #DADFE9';
          }

          const textColor = ['white', 'yellow', 'pink'].includes(choice.id) ? '#24324D' : '#FFFFFF';

          return (
            <button
              key={choice.id}
              type="button"
              style={buttonStyle}
              className={selected && feedback === 'wrong' ? 'shake-soft' : ''}
              onClick={() => handleAnswer(choice)}
              disabled={feedback === 'correct'}
            >
              <span style={{ ...styles.choiceText, color: textColor }}>{choice.name}</span>
            </button>
          );
        })}
      </div>

      {feedback === 'wrong' && (
        <>
          <p style={styles.inlineHint}>{question.color.hint}</p>
          <button type="button" style={styles.helpBtn} onClick={handleGetHelp}>Get Help</button>
        </>
      )}

      <AIHintBubble hint={hint} onClose={onCloseHint} />

      <style>{`
        .shake-soft {
          animation: shakeSoft 260ms ease-in-out;
        }
        @keyframes shakeSoft {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-3px); }
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
    paddingBottom: 20,
    background: 'linear-gradient(180deg, #EAF6FF 0%, #FFF9E4 100%)',
  },
  loading: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 12px 8px',
  },
  backBtn: {
    minHeight: 60,
    minWidth: 80,
    border: 'none',
    borderRadius: 16,
    fontSize: 20,
    fontWeight: 700,
    background: '#FFFFFF',
    color: '#30507F',
    cursor: 'pointer',
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: '#244A73',
  },
  objectCard: {
    width: 200,
    height: 200,
    margin: '10px auto 0',
    borderRadius: 28,
    background: '#FFFFFF',
    display: 'grid',
    placeItems: 'center',
    boxShadow: '0 14px 28px rgba(42, 76, 133, 0.14)',
  },
  objectEmoji: {
    fontSize: 120,
    lineHeight: 1,
  },
  question: {
    textAlign: 'center',
    margin: '14px 0 0',
    fontSize: 30,
    color: '#1E3D68',
  },
  correctBanner: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 30,
    fontWeight: 800,
  },
  associationWrap: {
    width: 'calc(100% - 24px)',
    margin: '12px auto 0',
    borderRadius: 20,
    background: '#FFFFFF',
    padding: '12px 10px',
  },
  associationTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700,
    color: '#25385F',
  },
  associationItems: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: 8,
  },
  associationItem: {
    display: 'grid',
    justifyItems: 'center',
    gap: 4,
  },
  associationEmoji: {
    fontSize: 36,
  },
  associationName: {
    fontSize: 18,
    color: '#41557A',
    fontWeight: 700,
  },
  choiceRow: {
    marginTop: 14,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 14,
    padding: '0 18px',
  },
  choiceBtn: {
    height: 96,
    borderRadius: 100,
    border: '4px solid transparent',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    transition: 'all 260ms ease-in-out',
    boxShadow: '0 8px 16px rgba(0,0,0,0.16)',
  },
  choiceText: {
    fontSize: 20,
    fontWeight: 800,
    textShadow: '0 1px 2px rgba(0,0,0,0.24)',
  },
  inlineHint: {
    margin: '14px auto 0',
    width: 'calc(100% - 24px)',
    fontSize: 20,
    lineHeight: 1.35,
    color: '#425276',
    textAlign: 'center',
  },
  helpBtn: {
    display: 'block',
    width: 'calc(100% - 24px)',
    margin: '12px auto 0',
    minHeight: 60,
    border: 'none',
    borderRadius: 16,
    background: '#FFE6A5',
    color: '#5F3E00',
    fontSize: 22,
    fontWeight: 800,
    cursor: 'pointer',
  },
};
