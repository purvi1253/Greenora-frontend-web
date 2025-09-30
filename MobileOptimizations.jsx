import { useEffect, useState } from 'react';

export const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    // Detect PWA mode
    const checkPWA = () => {
      setIsPWA(window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone ||
               document.referrer.includes('android-app://'));
    };

    checkMobile();
    checkPWA();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isPWA };
};

// Mobile-friendly touch hook
export const useTouchOptimizations = () => {
  useEffect(() => {
    // Prevent zoom on double-tap
    const preventDoubleTapZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventDoubleTapZoom);
    return () => document.removeEventListener('touchstart', preventDoubleTapZoom);
  }, []);
};