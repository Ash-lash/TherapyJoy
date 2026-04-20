import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Button from '../components/Button';

const VIDEO_CARDS = [
  { title: 'Breathing Reset', subtitle: '5 minutes to calm your body', icon: 'sparkles', tag: 'Calming' },
  { title: 'Mindful Grounding', subtitle: 'Reduce stress with senses', icon: 'heart', tag: 'Focus' },
  { title: 'Relaxation Stretch', subtitle: 'Gentle movement & relief', icon: 'doctor', tag: 'Recovery' },
  { title: 'Sleep Wind-Down', subtitle: 'Breathe and let go', icon: 'video', tag: 'Night' },
];

export default function Videos() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="hero">
        <div className="hero-title" style={{ textAlign: 'center' }}>
          Login to access Therapy Videos
        </div>
        <div className="hero-subtitle" style={{ textAlign: 'center' }}>
          Track your calm habits and keep your progress consistent.
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
            <div className="hero-title">Therapy Videos</div>
            <div className="hero-subtitle">
              Short, guided sessions for calm, clarity, and emotional balance.
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
              <Icon name="video" size={16} />
              Guided Sessions
            </span>
            <span className="badge badge-good">
              <Icon name="sparkles" size={16} />
              Easy to Follow
            </span>
            <span
              className="badge"
              style={{ borderColor: 'rgba(249,115,22,0.25)', color: 'rgba(249,115,22,0.95)' }}
            >
              <Icon name="heart" size={16} />
              Mood Friendly
            </span>
          </div>
        </div>
      </section>

      <div className="grid-features">
        {VIDEO_CARDS.map((c) => (
          <motion.div key={c.title} whileHover={{ scale: 1.03 }}>
            <Card className="feature-card">
              <div className="feature-header">
                <span className="feature-icon">
                  <Icon name={c.icon} size={20} />
                </span>
                <div>
                  <div className="feature-title">{c.title}</div>
                  <div className="muted">{c.subtitle}</div>
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="badge">{c.tag}</span>
                <span className="badge badge-primary" style={{ fontWeight: 900 }}>
                  <Icon name="sparkles" size={16} />
                  1 session
                </span>
              </div>

              <div className="hero-actions" style={{ marginTop: 16 }}>
                <Button
                  text="Open"
                  icon="video"
                  variant="primary"
                  onClick={() => alert(`Demo: Opening "${c.title}"`)}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

