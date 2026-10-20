import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const mobileHeroSlides = [
  { src: '/assets/images/home-mobile-01.png', alt: 'Modelo Malakoi con polerón negro frente a un edificio' },
  { src: '/assets/images/home-mobile-02.png', alt: 'Look Malakoi con polo marrón y denim amplio' },
  { src: '/assets/images/home-mobile-03.png', alt: 'Modelo Malakoi con top negro y bolso estampado' },
];

function MobileHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let intervalId;
    const syncAutoplay = () => {
      window.clearInterval(intervalId);
      if (!paused && !document.hidden && !reducedMotionQuery.matches) {
        intervalId = window.setInterval(() => setActiveSlide((current) => (current + 1) % mobileHeroSlides.length), 4800);
      }
    };
    syncAutoplay();
    reducedMotionQuery.addEventListener('change', syncAutoplay);
    document.addEventListener('visibilitychange', syncAutoplay);
    return () => {
      window.clearInterval(intervalId);
      reducedMotionQuery.removeEventListener('change', syncAutoplay);
      document.removeEventListener('visibilitychange', syncAutoplay);
    };
  }, [paused]);

  const currentSlide = mobileHeroSlides[activeSlide];
  return <div className="home-hero-mobile-carousel" role="region" aria-roledescription="carrusel" aria-label="Campaña Malakoi para móvil" aria-live="off">
    <img
      key={currentSlide.src}
      className="home-hero-mobile-slide is-active"
      src={currentSlide.src}
      alt={currentSlide.alt}
      loading="eager"
      decoding="async"
      fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
    />
    <div className="home-hero-pagination" role="group" aria-label="Elegir imagen del carrusel">
      {mobileHeroSlides.map((slide, index) => <button
        key={slide.src}
        type="button"
        aria-label={`Mostrar imagen ${index + 1}`}
        aria-pressed={activeSlide === index}
        className={activeSlide === index ? 'is-active' : ''}
        onClick={() => setActiveSlide(index)}
      />)}
      <button className="carousel-toggle" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Reanudar carrusel' : 'Pausar carrusel'}>{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>
    </div>
  </div>;
}

export default function CampaignHero() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 800px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 800px)');
    const update = () => setIsMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <section className="home-hero" aria-label="Campaña Malakoi">
    {isMobile ? <MobileHeroCarousel /> : <img className="home-hero-desktop" src="/assets/images/figma-home-hero.jpg" alt="Campaña Malakoi con dos modelos y el emblema de la marca" fetchPriority="high" decoding="async" />}
  </section>;
}
