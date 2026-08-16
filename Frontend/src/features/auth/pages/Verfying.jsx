import { useState, useCallback, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { Cursor } from '@/components/LandingPage/core/cursor';
import FloatingShapes from '@/components/LandingPage/three/FloatingShapes';

/* ── Inline SVG icons ── */
const MailOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8l9 6 9-6" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8V18a2 2 0 002 2h16a2 2 0 002-2V8" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

/* ── Animated mail ring ── */
function MailRing() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-8">
      {/* Outer pulsing halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: '1px solid rgba(192,192,192,0.15)' }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0.1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Middle halo */}
      <motion.div
        className="absolute inset-3 rounded-full"
        style={{ border: '1px solid rgba(192,192,192,0.2)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      {/* Icon circle */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(192,192,192,0.25)',
          backdropFilter: 'blur(12px)',
        }}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
      >
        <motion.div
          className="w-7 h-7"
          style={{ color: '#c0c0c0' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <MailOpenIcon />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Step item ── */
function Step({ number, text, delay }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(192,192,192,0.2)',
          color: '#c0c0c0',
        }}
      >
        {number}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#8a8a8a' }}>
        {text}
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VERIFYING PAGE  —  "Please verify your email"
   ═══════════════════════════════════════════════════════════ */
export default function Verfying() {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <>
      <PageCursor />
      <FloatingShapes />

      <div className="relative z-[1] min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          ref={cardRef}
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
            {/* Eyebrow */}
            <motion.p
              className="eyebrow text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              PERPLEXITY
            </motion.p>

            {/* Mail ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <MailRing />
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-3xl md:text-4xl text-center font-semibold tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif", color: '#e8e8e8', letterSpacing: '-0.01em' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              Verify your email
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="mt-3 text-sm text-center leading-relaxed"
              style={{ color: '#6b6b6b' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              A verification link has been sent to your inbox.
              <br />
              Please verify your email to proceed further.
            </motion.p>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-4 my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex-1 h-px" style={{ background: 'rgba(192,192,192,0.08)' }} />
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(192,192,192,0.1)',
                  color: '#6b6b6b',
                }}
              >
                <div className="w-4 h-4">
                  <ShieldIcon />
                </div>
                Steps to follow
              </div>
              <div className="flex-1 h-px" style={{ background: 'rgba(192,192,192,0.08)' }} />
            </motion.div>

            {/* Steps */}
            <div className="flex flex-col gap-4 mb-8">
              <Step
                number="1"
                text="Open the email we sent you and click the verification link inside."
                delay={0.65}
              />
              <Step
                number="2"
                text="Once verified, return here and sign in again to access your account."
                delay={0.72}
              />
            </div>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link
                to="/login"
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
                Already verified? Sign In
                <ArrowIcon />
              </Link>
            </motion.div>
          </div>

          {/* Back to home */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
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