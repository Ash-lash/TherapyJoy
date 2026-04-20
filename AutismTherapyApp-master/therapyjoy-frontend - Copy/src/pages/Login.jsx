import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Icon from '../components/Icon';

function friendlyAuthError(error) {
  const code = error?.code || '';
  if (code === 'auth/configuration-not-found') {
    return 'Login is not available right now. Please contact the clinic admin to finish Firebase setup.';
  }
  if (code === 'auth/invalid-api-key') {
    return 'Firebase is not configured correctly. Check the frontend .env values for REACT_APP_FIREBASE_API_KEY and related settings.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This browser domain is not allowed in Firebase Auth. Add your localhost address in Firebase Console → Authentication → Settings → Authorized domains.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Email/password sign-in is disabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method.';
  }
  if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
    return 'Incorrect email or password. Please try again.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
    return 'That email or password does not match. Please check and try again.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'That email already has an account. Try signing in instead.';
  }
  if (code === 'auth/weak-password') {
    return 'Your password is too short. Use at least 6 characters.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network error. Check your connection and make sure Firebase is reachable.';
  }
  return 'Unable to sign in right now. Please try again.';
}

function ClinicIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/40 bg-white/20 backdrop-blur-[12px]"
    >
      <div className="absolute -left-12 -top-14 h-56 w-56 rounded-full bg-[#6C63FF]/30 blur-3xl blob" />
      <div className="absolute -right-12 top-10 h-56 w-56 rounded-full bg-[#34D399]/25 blur-3xl blob" />
      <div className="absolute left-10 bottom-[-60px] h-56 w-56 rounded-full bg-[#38BDF8]/25 blur-3xl blob" />

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/55 shadow-glass">
            <Icon name="stethoscope" size={22} className="text-[#6C63FF]" />
          </div>
          <div>
            <div className="font-heading text-[18px] font-extrabold text-tj-heading">
              TherapyJoy Clinic
            </div>
            <div className="text-[13px] font-medium text-tj-body">
              Calm care • Progress tracking • Trusted support
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/35 bg-white/40 p-4 shadow-glass">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#34D399]/15">
                <Icon name="shieldCheck" size={18} className="text-[#34D399]" />
              </span>
              <div>
                <div className="font-heading text-[15px] font-extrabold text-tj-heading">
                  Privacy-first
                </div>
                <div className="text-[12px] font-medium text-tj-body">
                  Encrypted access with secure authentication
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/35 bg-white/40 p-4 shadow-glass">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#38BDF8]/15">
                <Icon name="heart" size={18} className="text-[#38BDF8]" />
              </span>
              <div>
                <div className="font-heading text-[15px] font-extrabold text-tj-heading">
                  Better outcomes
                </div>
                <div className="text-[12px] font-medium text-tj-body">
                  Track mood, sessions, and clinician guidance
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[12px] font-semibold text-tj-body">
          “Healing, one step at a time.”
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (error) {
      setError(friendlyAuthError(error));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-[-120px] h-[340px] w-[340px] rounded-full bg-[#6C63FF]/30 blur-3xl blob" />
        <div className="absolute right-[-140px] top-[60px] h-[360px] w-[360px] rounded-full bg-[#34D399]/25 blur-3xl blob" />
        <div className="absolute left-[20%] bottom-[-160px] h-[420px] w-[420px] rounded-full bg-[#38BDF8]/25 blur-3xl blob" />
      </div>

      <div className="mx-auto w-full max-w-[1080px] px-4 py-10">
        <div className="mb-6 text-center">
          <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/60 px-4 py-2 shadow-glass backdrop-blur-[12px]">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[#6C63FF]/15">
              <Icon name="stethoscope" size={18} className="text-[#6C63FF]" />
            </span>
            <div className="font-heading text-[14px] font-extrabold text-tj-heading">
              Secure clinic login
            </div>
            <span className="text-[13px] font-semibold text-tj-body">TherapyJoy</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="hidden lg:block">
            <ClinicIllustration />
          </div>

          <Card className="rounded-[28px] border border-white/40 bg-white/60 p-6 shadow-glass backdrop-blur-[12px]">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#38BDF8]/12">
                <Icon name="userCircle" size={20} className="text-[#38BDF8]" />
              </span>
              <div>
                <div className="font-heading text-[22px] font-extrabold text-tj-heading">
                  {isRegister ? 'Create account' : 'Welcome back'}
                </div>
                <div className="text-[13px] font-medium text-tj-body">
                  {isRegister ? 'Create your secure patient access.' : 'Sign in to your secure portal.'}
                </div>
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-tj-body">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="name@domain.com"
                  className="h-12 w-full rounded-full border border-slate-200 bg-white/75 px-4 text-[14px] font-medium text-tj-heading outline-none transition focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/15"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-tj-body">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-full border border-slate-200 bg-white/75 px-4 text-[14px] font-medium text-tj-heading outline-none transition focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/15"
                />
              </label>

              <div className="pt-1">
                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  style={{
                    background: 'linear-gradient(135deg, #6C63FF, #38BDF8)',
                    boxShadow: '0 10px 24px rgba(108, 99, 255, 0.22)',
                  }}
                >
                  {isRegister ? 'Register' : 'Login'}
                  <Icon name="arrowRight" size={18} />
                </button>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                className="text-[13px] font-semibold text-tj-body underline decoration-slate-300 underline-offset-4 hover:text-tj-heading"
                onClick={() => {
                  setIsRegister((v) => !v);
                  setError('');
                }}
              >
                {isRegister ? 'Already have an account? Login' : "Don’t have an account? Register"}
              </button>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-tj-body">
                <Icon name="shieldCheck" size={16} className="text-[#34D399]" />
                HIPAA-style UX (demo)
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}