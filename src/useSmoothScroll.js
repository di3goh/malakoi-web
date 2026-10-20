import { useEffect } from 'react';

export default function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 800px)');
    let smoother;
    let cancelled = false;
    let modules;
    let loadPlugins;

    const ensurePlugins = () => {
      if (!loadPlugins) {
        loadPlugins = Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('gsap/ScrollSmoother'),
        ]).then(([gsapModule, triggerModule, smootherModule]) => {
          modules = {
            gsap: gsapModule.gsap,
            ScrollTrigger: triggerModule.ScrollTrigger,
            ScrollSmoother: smootherModule.ScrollSmoother,
          };
        }).catch(() => {});
      }
      return loadPlugins;
    };

    const syncSmoother = async () => {
      smoother?.kill();
      smoother = undefined;
      if (reducedMotion.matches || mobileViewport.matches) return;
      await ensurePlugins();
      if (cancelled || reducedMotion.matches || mobileViewport.matches || !modules) return;
      modules.gsap.registerPlugin(modules.ScrollTrigger, modules.ScrollSmoother);
      smoother = modules.ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 0.75,
        effects: false,
        smoothTouch: 0,
      });
    };

    syncSmoother();
    reducedMotion.addEventListener('change', syncSmoother);
    mobileViewport.addEventListener('change', syncSmoother);
    return () => {
      cancelled = true;
      reducedMotion.removeEventListener('change', syncSmoother);
      mobileViewport.removeEventListener('change', syncSmoother);
      smoother?.kill();
    };
  }, []);
}
