import { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'motion/react';

export function Cursor({
  children,
  className = '',
  springConfig = { stiffness: 120, damping: 20, mass: 0.5 },
  variants = {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.3, opacity: 0 },
  },
  transition = { ease: 'easeInOut', duration: 0.15 },
  onPositionChange,
  attachToParent = false,
}) {
  const cursorX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const cursorY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!attachToParent);

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback(
    (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (onPositionChange) {
        onPositionChange(e.clientX, e.clientY);
      }
    },
    [cursorX, cursorY, onPositionChange]
  );

  const handleMouseEnter = useCallback(() => {
    if (attachToParent) setIsVisible(true);
  }, [attachToParent]);

  const handleMouseLeave = useCallback(() => {
    if (attachToParent) setIsVisible(false);
  }, [attachToParent]);

  useEffect(() => {
    if (!attachToParent) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }

    const parent = cursorRef.current?.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true });
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [attachToParent, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <motion.div
      ref={cursorRef}
      className={`pointer-events-none fixed top-0 left-0 z-[9999] ${className}`}
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
