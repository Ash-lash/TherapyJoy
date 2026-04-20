import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Card from '../components/Card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button from '../components/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (currentUser) {
      api.getProgress().then(setProgress).catch(console.error);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="hero" style={{ textAlign: 'center' }}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="hero-title" style={{ fontSize: 'clamp(28px, 5vw, 48px)', backgroundImage: 'linear-gradient(135deg, #6c63ff, #38bdf8)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to TherapyJoy
            </div>
            <div className="hero-subtitle" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', marginTop: 12 }}>
              Your personal mental wellness companion. Track emotions, practice mindfulness, and connect with support.
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 24 }}>
              <Button
                text="Get Started"
                icon="play"
                onClick={() => navigate('/login')}
                variant="primary"
              />
              <Button
                text="Learn More"
                icon="sparkles"
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                variant="ghost"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} style={{ marginTop: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#6C63FF' }}>10K+</div>
                <div style={{ fontSize: '13px', color: 'rgba(15, 23, 42, 0.7)', marginTop: 4 }}>Happy Users</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#38BDF8' }}>50K+</div>
                <div style={{ fontSize: '13px', color: 'rgba(15, 23, 42, 0.7)', marginTop: 4 }}>Sessions</div>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.15)' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#34D399' }}>4.9★</div>
                <div style={{ fontSize: '13px', color: 'rgba(15, 23, 42, 0.7)', marginTop: 4 }}>Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const getScoreBadge = (score) => {
    const n = Number(score);
    if (Number.isNaN(n)) return { label: 'Score', className: 'badge' };
    if (n >= 80) return { label: `Score: ${n}`, className: 'badge badge-good' };
    if (n >= 50) return { label: `Score: ${n}`, className: 'badge badge-primary' };
    return { label: `Score: ${n}`, className: 'badge badge-warn' };
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Welcome Section */}
      <motion.section className="hero" variants={itemVariants}>
        <div className="hero-grid">
          <div>
            <div className="hero-title">
              Welcome back, <span style={{ backgroundImage: 'linear-gradient(135deg, #6c63ff, #38bdf8)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{currentUser?.email?.split('@')[0] || 'friend'}</span> 👋
            </div>
            <div className="hero-subtitle">
              Your mental wellness journey continues. Let's practice mindfulness, track your emotions, and build a healthier mind together.
            </div>
            <div className="hero-actions">
              <Button
                text="Start Session"
                icon="play"
                onClick={() => navigate('/game')}
                variant="primary"
              />
              <Button
                text="Guided Videos"
                icon="video"
                onClick={() => navigate('/videos')}
                variant="ghost"
              />
            </div>
          </div>

          <motion.div className="hero-side" variants={itemVariants}>
            <motion.span className="badge badge-primary" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Icon name="sparkles" size={16} />
              Daily Practice
            </motion.span>
            <motion.span className="badge badge-good" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Icon name="heart" size={16} />
              Mood Tracking
            </motion.span>
            <motion.span className="badge" style={{ borderColor: 'rgba(6,182,212,0.25)', color: 'rgba(6,182,212,0.95)' }} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Icon name="doctor" size={16} />
              Expert Support
            </motion.span>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" style={{ marginTop: 32 }} variants={itemVariants}>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, marginBottom: 8 }}>What You Get</h2>
          <p style={{ color: 'rgba(15, 23, 42, 0.7)', fontSize: 'clamp(14px, 2vw, 16px)' }}>Everything you need for emotional wellness</p>
        </div>

        <motion.div className="grid-features" variants={containerVariants}>
          <motion.div whileHover={{ scale: 1.05 }} variants={itemVariants}>
            <Card className="feature-card">
              <div className="feature-header">
                <span className="feature-icon">
                  <Icon name="play" size={20} />
                </span>
                <div>
                  <div className="feature-title">Emotion Game</div>
                  <div className="muted">Recognition & Practice</div>
                </div>
              </div>
              <p className="muted" style={{ marginTop: 8, fontWeight: 700, color: 'rgba(15,23,42,0.7)', fontSize: 14 }}>
                Interactive games that help you recognize and understand your emotions better. Practice emotional intelligence in just 5 minutes.
              </p>
              <div className="hero-actions" style={{ marginTop: 16 }}>
                <Button text="Play Now" icon="play" onClick={() => navigate('/game')} variant="primary" />
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} variants={itemVariants}>
            <Card className="feature-card">
              <div className="feature-header">
                <span className="feature-icon" style={{ background: 'rgba(6,182,212,0.12)', borderColor: 'rgba(6,182,212,0.18)', color: 'rgba(6,182,212,0.95)' }}>
                  <Icon name="video" size={20} />
                </span>
                <div>
                  <div className="feature-title">Therapy Videos</div>
                  <div className="muted">Guided Sessions</div>
                </div>
              </div>
              <p className="muted" style={{ marginTop: 8, fontWeight: 700, color: 'rgba(15,23,42,0.7)', fontSize: 14 }}>
                Professional guided videos for meditation, breathing exercises, and stress relief. Created by certified therapists.
              </p>
              <div className="hero-actions" style={{ marginTop: 16 }}>
                <Button text="Watch" icon="video" onClick={() => navigate('/videos')} variant="primary" />
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} variants={itemVariants}>
            <Card className="feature-card">
              <div className="feature-header">
                <span className="feature-icon" style={{ background: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.18)', color: 'rgba(249,115,22,0.95)' }}>
                  <Icon name="doctor" size={20} />
                </span>
                <div>
                  <div className="feature-title">Professional Help</div>
                  <div className="muted">Connect & Support</div>
                </div>
              </div>
              <p className="muted" style={{ marginTop: 8, fontWeight: 700, color: 'rgba(15,23,42,0.7)', fontSize: 14 }}>
                Browse verified therapists and mental health professionals. Get support when you need it most.
              </p>
              <div className="hero-actions" style={{ marginTop: 16 }}>
                <Button text="Find Therapists" icon="doctor" onClick={() => navigate('/doctors')} variant="primary" />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Progress Section */}
      {progress.length > 0 && (
        <motion.section style={{ marginTop: 40 }} variants={itemVariants}>
          <div className="feature-header" style={{ marginBottom: 20 }}>
            <span className="feature-icon" style={{ width: 48, height: 48 }}>
              <Icon name="heart" size={20} />
            </span>
            <div>
              <div className="feature-title">Your Progress</div>
              <div className="muted">Keep up your wellness journey</div>
            </div>
          </div>

          <motion.div className="progress-grid" variants={containerVariants}>
            {progress.slice(0, 5).map((entry, i) => {
              const badge = getScoreBadge(entry.score);
              return (
                <motion.div key={entry.id} whileHover={{ y: -3 }} variants={itemVariants} transition={{ delay: i * 0.05 }}>
                  <div className="progress-item">
                    <div className="feature-header" style={{ marginBottom: 8 }}>
                      <span className="feature-icon" style={{ width: 40, height: 40, borderRadius: 14 }}>
                        <Icon name="heart" size={16} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className="feature-title" style={{ fontSize: 16 }}>
                          {entry.mood || 'Session'}
                        </div>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {entry.date || '—'}
                        </div>
                      </div>
                    </div>

                    <span className={badge.className}>
                      <Icon name="sparkles" size={14} />
                      {badge.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>
      )}

      {/* CTA Section */}
      <motion.section className="cta-section" style={{ marginTop: 48 }} variants={itemVariants}>
        <h2 className="cta-title">Ready to improve your mental wellness?</h2>
        <p className="cta-subtitle">Start with a free session today. No credit card required.</p>
        <div className="cta-actions">
          <Button
            text="Start Free Session"
            icon="play"
            onClick={() => navigate('/game')}
            variant="primary"
          />
          <Button
            text="Contact Support"
            icon="doctor"
            onClick={() => navigate('/doctors')}
            variant="ghost"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}
