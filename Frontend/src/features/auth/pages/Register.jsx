import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { Cursor } from '@/components/LandingPage/core/cursor';
import FloatingShapes from '@/components/LandingPage/three/FloatingShapes';
import Loader from '@/app/components/Loader';

/* ── Inline SVG icons ── */
const UserIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AtSignIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4L12 13 2 4" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b] hover:stroke-[#c0c0c0] transition-colors cursor-none" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5 stroke-[#6b6b6b] hover:stroke-[#c0c0c0] transition-colors cursor-none" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── Page Cursor ── */
function PageCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const handlePositionChange = useCallback((x, y) => {
    const el = document.elementFromPoint(x, y);
    const hovering = !!el?.closest('button, a, input, label, .interactive, .glass-card, .cta-btn, .glass-pill');
    setIsHovering(hovering);
  }, []);

  return (
    <Cursor
      variants={{
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.3, opacity: 0 },
      }}
      springConfig={{ stiffness: 120, damping: 20, mass: 0.5 }}
      transition={{ ease: 'easeInOut', duration: 0.15 }}
      onPositionChange={handlePositionChange}
    >
      <motion.div
        animate={{
          width: isHovering ? 40 : 16,
          height: isHovering ? 40 : 16,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="rounded-full bg-gray-500/40 backdrop-blur-md"
      />
    </Cursor>
  );
}

/* ═══════════════════════════════════════════════════════════
   REGISTER PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Register() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const [isFocused, setIsFocused] = useState({
    name: false,
    dob: false,
    username: false,
    email: false,
    password: false,
  });

  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, dob, username, email, password });
  };

  return (
    <>
      {loading && <Loader message="Creating account..." />}
      <PageCursor />
      <FloatingShapes />

      <div className="relative z-[1] min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          ref={formRef}
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Card ── */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(192,192,192,0.1)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                PERPLEXITY
              </motion.p>

              <motion.h1
                className="heading-3d text-3xl md:text-4xl font-bold mt-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                Create Account
              </motion.h1>

              <motion.p
                className="mt-3 text-sm"
                style={{ color: '#6b6b6b' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Start your journey with Perplexity AI
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5" style={{ color: '#6b6b6b' }}>
                  Full Name
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused.name ? 'rgba(192,192,192,0.35)' : 'rgba(192,192,192,0.08)'}`,
                    boxShadow: isFocused.name ? '0 0 20px rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <UserIcon />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setIsFocused((p) => ({ ...p, name: true }))}
                    onBlur={() => setIsFocused((p) => ({ ...p, name: false }))}
                    required
                    className="flex-1 bg-transparent outline-none text-sm cursor-none"
                    style={{ color: '#e8e8e8', caretColor: '#c0c0c0' }}
                  />
                </div>
              </motion.div>

              {/* Date of Birth */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5" style={{ color: '#6b6b6b' }}>
                  Date of Birth
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused.dob ? 'rgba(192,192,192,0.35)' : 'rgba(192,192,192,0.08)'}`,
                    boxShadow: isFocused.dob ? '0 0 20px rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <CalendarIcon />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    onFocus={() => setIsFocused((p) => ({ ...p, dob: true }))}
                    onBlur={() => setIsFocused((p) => ({ ...p, dob: false }))}
                    required
                    className="flex-1 bg-transparent outline-none text-sm cursor-none [color-scheme:dark]"
                    style={{ color: '#e8e8e8', caretColor: '#c0c0c0' }}
                  />
                </div>
              </motion.div>

              {/* Username */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5" style={{ color: '#6b6b6b' }}>
                  Username
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused.username ? 'rgba(192,192,192,0.35)' : 'rgba(192,192,192,0.08)'}`,
                    boxShadow: isFocused.username ? '0 0 20px rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <AtSignIcon />
                  <input
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused((p) => ({ ...p, username: true }))}
                    onBlur={() => setIsFocused((p) => ({ ...p, username: false }))}
                    required
                    className="flex-1 bg-transparent outline-none text-sm cursor-none"
                    style={{ color: '#e8e8e8', caretColor: '#c0c0c0' }}
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5" style={{ color: '#6b6b6b' }}>
                  Email
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused.email ? 'rgba(192,192,192,0.35)' : 'rgba(192,192,192,0.08)'}`,
                    boxShadow: isFocused.email ? '0 0 20px rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <MailIcon />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused((p) => ({ ...p, email: true }))}
                    onBlur={() => setIsFocused((p) => ({ ...p, email: false }))}
                    required
                    className="flex-1 bg-transparent outline-none text-sm cursor-none"
                    style={{ color: '#e8e8e8', caretColor: '#c0c0c0' }}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-1.5" style={{ color: '#6b6b6b' }}>
                  Password
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused.password ? 'rgba(192,192,192,0.35)' : 'rgba(192,192,192,0.08)'}`,
                    boxShadow: isFocused.password ? '0 0 20px rgba(255,255,255,0.04)' : 'none',
                  }}
                >
                  <LockIcon />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused((p) => ({ ...p, password: true }))}
                    onBlur={() => setIsFocused((p) => ({ ...p, password: false }))}
                    required
                    className="flex-1 bg-transparent outline-none text-sm cursor-none"
                    style={{ color: '#e8e8e8', caretColor: '#c0c0c0' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex-shrink-0 interactive"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-350 cursor-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(192,192,192,0.2)',
                    color: '#e8e8e8',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(192,192,192,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(192,192,192,0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                >
                  Create Account
                  <ArrowIcon />
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-4 my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <div className="flex-1 h-px" style={{ background: 'rgba(192,192,192,0.08)' }} />
              <span className="text-xs" style={{ color: '#6b6b6b' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(192,192,192,0.08)' }} />
            </motion.div>

            {/* Login link */}
            <motion.p
              className="text-center text-sm"
              style={{ color: '#6b6b6b' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="transition-colors duration-300 hover:text-[#e8e8e8]"
                style={{ color: '#a8a8a8' }}
              >
                Sign In
              </Link>
            </motion.p>
          </div>

          {/* Back to home */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
          >
            <Link
              to="/"
              className="text-xs tracking-wider uppercase transition-colors duration-300 hover:text-[#a8a8a8]"
              style={{ color: '#6b6b6b' }}
            >
              ← Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}