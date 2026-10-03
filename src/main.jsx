import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import useScrollReveal from './useScrollReveal.js';
import { products, lowerProducts } from './data/products.js';
import './styles.css';

const productHref = (name) => `/producto.html?item=${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}`;

gsap.registerPlugin(ScrollToPlugin);

function App() {
  useScrollReveal();
  const [saved, setSaved] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);
  const hero = useRef(null);

  useEffect(() => {
    const tabletOrSmaller = window.matchMedia('(max-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!tabletOrSmaller.matches || reduceMotion) return;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % 3), 4800);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    let wheelTarget = window.scrollY;
    let wheelTween = null;
    let wheelIdleTimer;
    const context = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 28, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.15 });
    }, hero);
    // Smooth both wheel input and in-page links with GSAP ScrollToPlugin.
    const handleWheel = (event) => {
      if (event.ctrlKey || event.defaultPrevented || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const eventElement = event.target instanceof Element ? event.target : null;
      if (eventElement?.closest('input, textarea, select, [contenteditable="true"], [data-native-scroll]')) return;
      let delta = event.deltaY;
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight;
      if (!delta) return;
      if (!wheelTween?.isActive()) wheelTarget = window.scrollY;
      const nextTarget = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight, wheelTarget + delta));
      if (nextTarget === wheelTarget) return;
      event.preventDefault();
      wheelTarget = nextTarget;
      wheelTween?.kill();
      wheelTween = gsap.to(window, { duration: 0.72, scrollTo: { y: wheelTarget, autoKill: false }, ease: 'power2.out', overwrite: true, onComplete: () => { wheelTarget = window.scrollY; wheelTween = null; } });
      window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(() => { if (!wheelTween?.isActive()) wheelTarget = window.scrollY; }, 220);
    };
    const resetWheelTarget = () => { wheelTween?.kill(); wheelTween = null; wheelTarget = window.scrollY; };
    const handleClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      resetWheelTarget();
      wheelTarget = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 90);
      wheelTween = gsap.to(window, { duration: 1.15, scrollTo: { y: target, offsetY: 90, autoKill: false }, ease: 'power2.inOut', overwrite: true, onComplete: () => { wheelTarget = window.scrollY; wheelTween = null; } });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('pointerdown', resetWheelTarget, { passive: true });
    window.addEventListener('touchstart', resetWheelTarget, { passive: true });
    window.addEventListener('keydown', resetWheelTarget);
    document.addEventListener('click', handleClick);
    return () => { window.removeEventListener('wheel', handleWheel); window.removeEventListener('pointerdown', resetWheelTarget); window.removeEventListener('touchstart', resetWheelTarget); window.removeEventListener('keydown', resetWheelTarget); window.clearTimeout(wheelIdleTimer); document.removeEventListener('click', handleClick); wheelTween?.kill(); context.revert(); };
  }, []);

  const toggleSaved = (name) => setSaved((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <StoreHeader active="home" />
    <main id="contenido">
      <section className="hero" ref={hero} aria-labelledby="hero-title">
        <picture className="hero-media">
          {/* Reemplaza /hero-mobile.jpg con tu arte vertical; el banner existente sigue para escritorio. */}
          <source media="(max-width: 700px)" srcSet="/MALAKOI-BANNER.png" />
          <img src="/MALAKOI-BANNER.png" alt="Campaña Malakoi: prendas contemporáneas en una composición editorial" fetchPriority="high" />
        </picture>
        <div className="hero-mobile-carousel" aria-label="Campañas Malakoi" aria-roledescription="carrusel">
          {['/assets/images/hero-mobile-1.png', '/assets/images/hero-mobile-2.png', '/assets/images/hero-mobile-3.png'].map((image, index) => <img key={image} className={heroSlide === index ? 'is-active' : ''} src={image} alt={['Look Malakoi con polo blanco y denim amplio', 'Look Malakoi con top negro y bolso estampado', 'Look Malakoi con tank top verde oliva y denim'][index]} loading={index === 0 ? 'eager' : 'lazy'} />)}
        </div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="hero-label"><h1 id="hero-title">Prendas con carácter para todos los días.</h1></div>
          <a className="button hero-button" href="/catalogo.html">Ver catálogo <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="hero-pagination" role="group" aria-label="Elegir imagen de campaña">
          {[0, 1, 2].map((index) => <button key={index} type="button" className={heroSlide === index ? 'is-active' : ''} aria-label={`Mostrar imagen ${index + 1}`} aria-pressed={heroSlide === index} onClick={() => setHeroSlide(index)} />)}
        </div>
        <a className="hero-scroll" href="#novedades"><span>Desliza para explorar</span><ArrowDown size={16} aria-hidden="true" /></a>
      </section>
      <section className="section products-section" id="novedades" aria-labelledby="products-title" data-reveal>
        <div className="section-heading"><div><p className="eyebrow">Selección Malakoi</p><h2 id="products-title">Para cada tipo de temporada</h2></div></div>
        <div className="product-grid">
          {products.map((product) => <article className="product-card" data-reveal key={product.name} role="link" tabIndex={0} onClick={(event) => { if (!event.target.closest('button')) window.location.href = productHref(product.name); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.location.href = productHref(product.name); } }}>
            <div className="product-image"><img src={product.image} alt={product.alt} loading="lazy" /></div>
            <button className={`save-button ${saved.includes(product.name) ? 'is-saved' : ''}`} type="button" aria-label={`${saved.includes(product.name) ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`} aria-pressed={saved.includes(product.name)} onClick={() => toggleSaved(product.name)}><Heart size={18} fill={saved.includes(product.name) ? 'currentColor' : 'none'} /></button>
            <div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><div className="product-bottom"><div className="swatches" aria-label={`Colores disponibles para ${product.name}`}>{product.colors.map((color) => <span className="swatch" key={color.name} title={color.name} aria-label={color.name} style={{ '--swatch': color.value }} />)}</div><span className="price">S/ {product.price || 145}.00</span></div></div>
          </article>)}
        </div>
      </section>
      <section className="section products-section second-products" id="seleccion" aria-labelledby="second-products-title" data-reveal>
        <div className="section-heading"><div><p className="eyebrow">Encuentra tus favoritos</p><h2 id="second-products-title">Tu próxima pieza favorita</h2></div></div>
        <div className="product-grid">
          {lowerProducts.map((product) => <article className="product-card" data-reveal key={`second-${product.name}`} role="link" tabIndex={0} onClick={(event) => { if (!event.target.closest('button')) window.location.href = productHref(product.name); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.location.href = productHref(product.name); } }}>
            <div className="product-image"><img src={product.image} alt={product.alt} loading="lazy" /></div>
            <button className={`save-button ${saved.includes(product.name) ? 'is-saved' : ''}`} type="button" aria-label={`${saved.includes(product.name) ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`} aria-pressed={saved.includes(product.name)} onClick={() => toggleSaved(product.name)}><Heart size={18} fill={saved.includes(product.name) ? 'currentColor' : 'none'} /></button>
            <div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><div className="product-bottom"><div className="swatches" aria-label={`Colores disponibles para ${product.name}`}>{product.colors.map((color) => <span className="swatch" key={color.name} title={color.name} aria-label={color.name} style={{ '--swatch': color.value }} />)}</div><span className="price">S/ {product.price || 145}.00</span></div></div>
          </article>)}
        </div>
      </section>
      <section className="community-section" aria-labelledby="community-title">
        <div className="community-heading"><h2 id="community-title">Etiqu&#233;tanos para que compartamos tu look <span>@MALAKOI.PE</span></h2></div>
        <div className="community-track-window"><div className="community-track">
          {[0, 1].map((copy) => <div className="community-track-group" key={copy} aria-hidden={copy === 1}>
            {['look-1.png','look-2.png','look-3.png','look-4.png','look-5.png','look-6.png','look-7.png','look-8.png'].map((image, index) => <div className="community-card" key={`${copy}-${image}`} aria-hidden="true"><img src={`/assets/images/community/${image}`} alt={`Look Malakoi de la comunidad ${index + 1}`} loading="lazy" /><span>@malakoi.pe</span></div>)}
          </div>)}
        </div></div>
      </section>
      <section className="brand-story" aria-labelledby="story-title" data-reveal>
        <div className="story-image"><img src="/assets/images/bg2.png" alt="Tres looks Malakoi: denim amplio, camiseta blanca y camisa clara con pantalón de pana" loading="lazy" /></div>
        <div className="story-copy"><div className="hero-label"><h2 id="story-title">Una forma propia de vestir.</h2></div><a className="button hero-button" href="/catalogo.html">Descubrir Malakoi <ArrowRight size={17} aria-hidden="true" /></a></div>
      </section>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
