import { useEffect } from 'react';

export default function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      if (reducedMotion.matches) return;
      await ensurePlugins();
      if (cancelled || reducedMotion.matches || !modules) return;
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
    return () => {
      cancelled = true;
      reducedMotion.removeEventListener('change', syncSmoother);
      smoother?.kill();
    };
  }, []);
}
