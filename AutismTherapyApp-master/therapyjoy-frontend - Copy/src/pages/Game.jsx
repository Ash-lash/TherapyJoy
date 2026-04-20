import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Button from '../components/Button';
import EmotionMatchGame from '../games/EmotionMatchGame';
import ColorGame from '../games/ColorGame';
import PatternGame from '../games/PatternGame';
import { getWeeklyProgress } from '../services/firebase';

const DIFFICULTIES = [
  { key: 'Easy', hint: 'Start small, build confidence', icon: 'heart' },
  { key: 'Medium', hint: 'More variety, steady pacing', icon: 'play' },
  { key: 'Challenge', hint: 'Timer mode for stronger focus', icon: 'shieldCheck' },
];

const GAMES = [
  {
    id: 'emotion',
    title: 'Emotion Match',
    subtitle: 'Recognize feelings from facial expressions',
    icon: 'heart',
    color: 'linear-gradient(145deg, rgba(177,154,255,0.28), rgba(109,197,255,0.2))',
  },
  {
    id: 'color',
    title: 'Color Game',
    subtitle: 'Learn object and color associations',
    icon: 'play',
    color: 'linear-gradient(145deg, rgba(112,200,135,0.26), rgba(245,214,111,0.24))',
  },
  {
    id: 'pattern',
    title: 'Pattern Match',
    subtitle: 'Build sequence and memory skills',
    icon: 'shieldCheck',
    color: 'linear-gradient(145deg, rgba(243,161,93,0.28), rgba(97,169,247,0.24))',
  },
];

export default function Game() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [difficultyKey, setDifficultyKey] = useState('Easy');
  const [activeGame, setActiveGame] = useState('');
  const [weekly, setWeekly] = useState({ completedGames: 0, averageStars: 0, totalScore: 0 });

  const difficulty = useMemo(
    () => DIFFICULTIES.find((d) => d.key === difficultyKey) || DIFFICULTIES[0],
    [difficultyKey]
  );

  useEffect(() => {
    let mounted = true;

    async function loadWeeklyProgress() {
      if (!currentUser?.uid) return;
      try {
        const result = await getWeeklyProgress(currentUser.uid);
        if (mounted) setWeekly(result);
      } catch (error) {
        console.error('Failed loading weekly progress', error);
      }
    }

    loadWeeklyProgress();
    return () => {
      mounted = false;
    };
  }, [currentUser?.uid]);

  if (activeGame === 'emotion') {
    return <EmotionMatchGame onGoHome={() => setActiveGame('')} />;
  }

  if (activeGame === 'color') {
    return <ColorGame onGoHome={() => setActiveGame('')} />;
  }

  if (activeGame === 'pattern') {
    return <PatternGame onGoHome={() => setActiveGame('')} />;
  }

  if (!currentUser) {
    return (
      <div className="hero">
        <div className="hero-title" style={{ textAlign: 'center' }}>
          Login to start the game
        </div>
        <div className="hero-subtitle" style={{ textAlign: 'center' }}>
          Build emotional recognition with short, supportive sessions.
        </div>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Button
            text="Login"
            icon="login"
            onClick={() => navigate('/login')}
            variant="primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-title">TherapyJoy Games</div>
            <div className="hero-subtitle">
              Choose a game and start a calm 10-round therapy session.
            </div>
            <div className="hero-actions">
              <Button
                text="Back to Home"
                icon="home"
                variant="ghost"
                onClick={() => navigate('/')}
              />
            </div>
          </div>
          <div className="hero-side">
            <span className="badge badge-primary">
              <Icon name="play" size={16} />
              3 Therapy Games
            </span>
            <span className="badge badge-good">
              <Icon name="heart" size={16} />
              Child-Friendly Feedback
            </span>
            <span
              className="badge"
              style={{ borderColor: 'rgba(6,182,212,0.25)', color: 'rgba(6,182,212,0.95)' }}
            >
              <Icon name="shieldCheck" size={16} />
              Firebase Progress Sync
            </span>
          </div>
        </div>
      </section>

      <div className="grid-features">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="feature-card">
            <div className="feature-header">
              <span className="feature-icon">
                <Icon name="sparkles" size={20} />
              </span>
              <div>
                <div className="feature-title">Choose Difficulty</div>
                <div className="muted">Your selection affects pacing and feedback</div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {DIFFICULTIES.map((d) => {
                const active = d.key === difficultyKey;
                return (
                  <button
                    key={d.key}
                    type="button"
                    className={`btn ${active ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setDifficultyKey(d.key)}
                    style={{ padding: '10px 14px' }}
                    aria-pressed={active}
                  >
                    <Icon name={d.icon} size={18} />
                    {d.key}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 14 }}>
              <span className="badge badge-primary">
                <Icon name={difficulty.icon} size={16} />
                {difficulty.key}
              </span>
              <div className="muted" style={{ marginTop: 8 }}>
                {difficulty.hint}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="feature-card">
            <div className="feature-header">
              <span
                className="feature-icon"
                style={{
                  background: 'rgba(34, 197, 94, 0.12)',
                  borderColor: 'rgba(34, 197, 94, 0.18)',
                  color: 'rgba(21, 128, 61, 0.95)',
                }}
              >
                <Icon name="shieldCheck" size={20} />
              </span>
              <div>
                <div className="feature-title">Your Progress</div>
                <div className="muted">Synced from Firestore game records</div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
              <div className="progress-item" style={{ background: 'rgba(255,255,255,0.55)' }}>
                <div className="feature-title" style={{ fontSize: 15 }}>Completed Games</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  {weekly.completedGames}
                </div>
              </div>
              <div className="progress-item" style={{ background: 'rgba(255,255,255,0.55)' }}>
                <div className="feature-title" style={{ fontSize: 15 }}>Average Stars</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  {weekly.averageStars}
                </div>
              </div>
              <div className="progress-item" style={{ background: 'rgba(255,255,255,0.55)' }}>
                <div className="feature-title" style={{ fontSize: 15 }}>Total Score</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  {weekly.totalScore}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
        {GAMES.map((game) => (
          <motion.div key={game.id} whileHover={{ scale: 1.01 }}>
            <button
              type="button"
              onClick={() => setActiveGame(game.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: '1px solid rgba(15,23,42,0.12)',
                borderRadius: 20,
                minHeight: 84,
                padding: '14px 16px',
                cursor: 'pointer',
                background: game.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="feature-icon" style={{ width: 42, height: 42, borderRadius: 12 }}>
                  <Icon name={game.icon} size={20} />
                </span>
                <span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#182A4B' }}>{game.title}</div>
                  <div style={{ fontSize: 16, color: '#2D3D61' }}>{game.subtitle}</div>
                </span>
              </span>
              <Icon name="arrowRight" size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

