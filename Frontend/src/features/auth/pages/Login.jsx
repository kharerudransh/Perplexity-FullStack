import { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { Cursor } from '@/components/LandingPage/core/cursor';
import FloatingShapes from '@/components/LandingPage/three/FloatingShapes';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Loader from '@/app/components/Loader';
import {Navigate} from "react-router";


/* ── Inline SVG icons ── */
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
   LOGIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true });


  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const navigate=useNavigate();
  const {handleLogin}=useAuth();

  const handleSubmit = async(e) => {
    try{
      e.preventDefault();
      await handleLogin({email,password})
      navigate("/dashboard")
    }catch(error){
      toast.error(error.response?.data?.message || "Login failed")
    }
  };

  if(user && !loading){
    return <Navigate to="/dashboard" replace />
  }
  
  return (
    <>
      {loading && <Loader message="Signing in..." />}
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
            <div className="text-center mb-10">
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
                Welcome back
              </motion.h1>

              <motion.p
                className="mt-3 text-sm"
                style={{ color: '#6b6b6b' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to continue your conversation
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6b6b6b' }}>
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
                transition={{ delay: 0.55, duration: 0.6 }}
              >
                <label className="block text-xs font-medium tracking-wider uppercase mb-2" style={{ color: '#6b6b6b' }}>
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

              {/* Forgot password */}
              <motion.div
                className="text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <a
                  href="#"
                  className="text-xs transition-colors duration-300 hover:text-[#e8e8e8]"
                  style={{ color: '#6b6b6b' }}
                >
                  Forgot password?
                </a>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
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
                  Sign In
                  <ArrowIcon />
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-4 my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex-1 h-px" style={{ background: 'rgba(192,192,192,0.08)' }} />
              <span className="text-xs" style={{ color: '#6b6b6b' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(192,192,192,0.08)' }} />
            </motion.div>

            {/* Register link */}
            <motion.p
              className="text-center text-sm"
              style={{ color: '#6b6b6b' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="transition-colors duration-300 hover:text-[#e8e8e8]"
                style={{ color: '#a8a8a8' }}
              >
                Create one
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