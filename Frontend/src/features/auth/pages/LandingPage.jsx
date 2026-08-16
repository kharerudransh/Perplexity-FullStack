import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router';
import { Cursor } from '@/components/LandingPage/core/cursor';
import FloatingShapes from '@/components/LandingPage/three/FloatingShapes';
import { CgLivePhoto } from 'react-icons/cg';

/* ═══════════════════════════════════════════════════════════
   SVG ICONS (inline, no external icon libraries)
   ═══════════════════════════════════════════════════════════ */
const WeatherIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" />
    <path d="M16 16l5 5" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4L12 13 2 4" />
  </svg>
);

const ForexIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);


const LoginIcon = () => (
  <svg className="card-icon" viewBox="0 0 24 24">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const RegisterIcon = () => (
  <svg className="card-icon" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const VerifyIcon = () => (
  <svg className="card-icon" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   FEATURE PILLS
   ═══════════════════════════════════════════════════════════ */
const features = [
  { icon: WeatherIcon, label: 'Weather' },
  { icon: SearchIcon, label: 'Web Search' },
  { icon: EmailIcon, label: 'Email' },
  { icon: ForexIcon, label: 'Forex' },
  { icon: () => <CgLivePhoto size={14} />, label: 'Live Train & Flight Status' },
];

/* ═══════════════════════════════════════════════════════════
   CARD DATA
   ═══════════════════════════════════════════════════════════ */
const cards = [
  {
    icon: LoginIcon,
    title: 'Login',
    sub: 'Already have an account? Welcome back.',
    cta: 'Sign In',
    path: '/login',
  },
  {
    icon: RegisterIcon,
    title: 'Register',
    sub: 'New here? Create your account in seconds.',
    cta: 'Create Account',
    path: '/register',
  },
  {
    icon: VerifyIcon,
    title: 'Verify Email',
    sub: 'Confirm your email to unlock full access.',
    cta: 'Verify Now',
    path: '/login',
  },
];

/* ═══════════════════════════════════════════════════════════
   REVEAL WRAPPER — fade + rise on scroll into view
   ═══════════════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3D TILT CARD
   ═══════════════════════════════════════════════════════════ */
function TiltCard({ icon: Icon, title, sub, cta, path, delay = 0 }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setTilt({
      rotateX: ((y - cy) / cy) * -8,
      rotateY: ((x - cx) / cx) * 8,
      scale: 1.03,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return (
    <Reveal delay={delay} className="flex-1 min-w-[280px]">
      <motion.div
        ref={cardRef}
        className="glass-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: tilt.scale,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ perspective: 800, transformStyle: 'preserve-3d' }}
      >
        <Icon />
        <h3>{title}</h3>
        <p>{sub}</p>
        <Link to={path} className="cta-btn">{cta}</Link>
      </motion.div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR WRAPPER
   ═══════════════════════════════════════════════════════════ */
function PageCursor() {
  const [isHovering, setIsHovering] = useState(false);

  // Track whether cursor is over any interactive element
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
   LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <>
      {/* Custom cursor (hidden on touch devices via CSS) */}
      <PageCursor />

      {/* Three.js 3D background */}
      <FloatingShapes />

      {/* Content layer */}
      <div className="relative z-[1]">

        {/* ── SECTION 1: HERO ── */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              PERPLEXITY
            </motion.p>

            <motion.h1
              className="heading-3d text-5xl md:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              One assistant.<br />Every answer.
            </motion.h1>

            <motion.p
              className="mt-6 text-base md:text-lg leading-relaxed max-w-[540px] mx-auto"
              style={{ color: '#a8a8a8' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              Real-time weather, live web search, email, forex, and live train &amp; flight status&nbsp;— all in one conversation.
            </motion.p>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <a href="#get-started" className="cta-btn">Get Started</a>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 2: ABOUT ── */}
        <section id="about" className="py-28 md:py-36 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <p className="eyebrow">PERPLEXITY</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="heading-3d text-3xl md:text-5xl font-bold">
                What it actually does
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="mt-8 text-base leading-[1.7] max-w-[650px] mx-auto"
                style={{ color: '#a8a8a8' }}
              >
                Perplexity isn't just another chatbot — it's the one tab you keep open all&nbsp;day.
                Ask it what the weather's doing tomorrow and it'll actually check, not guess.
                Need to know something happening right now? It searches the live web and brings back real answers, not stale training data.
                Drafting an email at 11&nbsp;PM because you forgot? It'll write it, and send it, so you don't have to switch tabs.
                Wondering what the dollar's doing against the rupee today? It's got that too.
                Need to know if your train is running late or your flight is delayed? Just ask — it tracks live train and flight status in real time.
              </p>
            </Reveal>

            {/* Feature pills */}
            <Reveal delay={0.3}>
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                {features.map((f) => (
                  <span key={f.label} className="glass-pill">
                    <f.icon />
                    {f.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SECTION 3: GET STARTED ── */}
        <section id="get-started" className="py-28 md:py-36 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <Reveal>
              <p className="eyebrow">GET STARTED</p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="heading-3d text-3xl md:text-5xl font-bold mb-14">
                Pick up where you left off
              </h2>
            </Reveal>

            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {cards.map((card, i) => (
                <TiltCard key={card.title} {...card} delay={0.15 + i * 0.15} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="landing-footer py-12 text-center">
          <p className="text-sm font-semibold tracking-widest" style={{ color: '#6b6b6b' }}>
            PERPLEXITY
          </p>
          <p className="mt-2" style={{ color: '#6b6b6b', fontSize: 12 }}>
            &copy; 2026 Perplexity. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
