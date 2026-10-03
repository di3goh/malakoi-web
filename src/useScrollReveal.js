import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const selector = '[data-reveal]';
    const elements = document.querySelectorAll(selector);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
    const observe = (element) => {
      if (element.matches?.(selector)) observer.observe(element);
      element.querySelectorAll?.(selector).forEach((child) => observer.observe(child));
    };
    elements.forEach((element) => observer.observe(element));
    const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node instanceof Element) observe(node);
    })));
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, []);
}
