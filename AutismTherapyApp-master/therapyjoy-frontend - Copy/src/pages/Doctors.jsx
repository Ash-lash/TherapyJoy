import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Button from '../components/Button';

const DOCTORS = [
  { name: 'Dr. Amina Rahman', specialty: 'Anxiety & Calm', initials: 'AR' },
  { name: 'Dr. Carlos Mendes', specialty: 'Stress Recovery', initials: 'CM' },
  { name: 'Dr. Priya Sharma', specialty: 'Emotional Support', initials: 'PS' },
  { name: 'Dr. James Watson', specialty: 'Mindful Habits', initials: 'JW' },
];

function DoctorAvatar({ initials }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 42,
        height: 42,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        background: 'rgba(6,182,212,0.12)',
        border: '1px solid rgba(6,182,212,0.18)',
        color: 'rgba(6,182,212,0.95)',
      }}
    >
      {initials}
    </div>
  );
}

export default function Doctors() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="hero">
        <div className="hero-title" style={{ textAlign: 'center' }}>
          Login to access Doctors
        </div>
        <div className="hero-subtitle" style={{ textAlign: 'center' }}>
          Find guidance that fits your goals and pace.
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
            <div className="hero-title">Doctors</div>
            <div className="hero-subtitle">
              Explore supportive professionals and resources. (Demo UI)
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
              <Icon name="doctor" size={16} />
              Trusted Guidance
            </span>
            <span className="badge badge-good">
              <Icon name="sparkles" size={16} />
              Personalized Pace
            </span>
            <span
              className="badge"
              style={{ borderColor: 'rgba(79,70,229,0.25)', color: 'rgba(79,70,229,0.95)' }}
            >
              <Icon name="heart" size={16} />
              Emotional Support
            </span>
          </div>
        </div>
      </section>

      <div className="grid-features">
        {DOCTORS.map((d) => (
          <motion.div key={d.name} whileHover={{ scale: 1.03 }}>
            <Card className="feature-card">
              <div className="feature-header">
                <DoctorAvatar initials={d.initials} />
                <div>
                  <div className="feature-title">{d.name}</div>
                  <div className="muted">{d.specialty}</div>
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-primary">
                  <Icon name="shield" size={16} />
                  Verified Profile
                </span>
                <span className="badge">{d.specialty.includes('Anxiety') ? 'Calm Sessions' : 'Support Sessions'}</span>
              </div>

              <div className="hero-actions" style={{ marginTop: 16 }}>
                <Button
                  text="Request Info"
                  icon="doctor"
                  variant="primary"
                  onClick={() => alert(`Demo: Requesting info for "${d.name}"`)}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

