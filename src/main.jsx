import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import useScrollReveal from './useScrollReveal.js';
import { products, lowerProducts } from './data/products.js';
import './styles.css';

const productHref = (name) => name === 'KIMONO JACKET' ? '/kimono-jacket.html' : `/producto-${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}.html`;

const featuredProducts = [
  lowerProducts.find((product) => product.name === 'CLASP JACKET'),
  products.find((product) => product.name === 'KNOT ZIP-UP JACKET'),
  lowerProducts.find((product) => product.name === 'KIMONO V3'),
  products.find((product) => product.name === 'MORI DENIM JACKET'),
  products.find((product) => product.name === 'J-JACKET'),
  lowerProducts.find((product) => product.name === 'CAMISA LOTUS'),
  products.find((product) => product.name === 'KIMONO JACKET'),
  lowerProducts.find((product) => product.name === 'BASIC TANK TOP'),
];

const nextProducts = ['PARACHUTE JOGGER', 'POLO 3/4', 'WIDE RAW DENIM PANTS', 'WIDE BAGGY CORDUROY']
  .map((name) => lowerProducts.find((product) => product.name === name));
const homePrices = { 'MORI DENIM JACKET': 180, 'POLO 3/4': 65 };
const homeImages = {
  'CLASP JACKET': '/assets/images/home-clasp.jpg',
  'KNOT ZIP-UP JACKET': '/assets/images/home-knot.jpg',
  'KIMONO V3': '/assets/images/home-kimono-v3.jpg',
  'MORI DENIM JACKET': '/assets/images/home-mori.jpg',
  'J-JACKET': '/assets/images/home-j-jacket.jpg',
  'CAMISA LOTUS': '/assets/images/home-lotus.jpg',
  'KIMONO JACKET': '/assets/images/home-kimono.jpg',
  'BASIC TANK TOP': '/assets/images/home-tank.jpg',
  'PARACHUTE JOGGER': '/assets/images/home-parachute.jpg',
  'POLO 3/4': '/assets/images/home-polo.jpg',
  'WIDE RAW DENIM PANTS': '/assets/images/home-wide-raw.jpg',
  'WIDE BAGGY CORDUROY': '/assets/images/home-wide-baggy.jpg',
};

function ProductCard({ product }) {
  return <a className="home-product-card" href={productHref(product.name)} data-reveal>
    <span className="home-product-image"><img src={homeImages[product.name] || product.image} alt={product.alt} loading="lazy" /></span>
    <span className="home-product-info">
      <span className="home-product-name">{product.name}</span>
      <span className="home-product-details">
        <span className="home-product-swatches" aria-label={`Colores disponibles: ${product.colors.map((color) => color.name).join(', ')}`}>
          {product.colors.map((color) => <span className="home-product-swatch" key={color.name} title={color.name} style={{ '--swatch': color.value }} />)}
        </span>
        <span className="home-product-price">S/.{homePrices[product.name] || product.price || 145}.00</span>
      </span>
    </span>
  </a>;
}

gsap.registerPlugin(ScrollToPlugin);

function App() {
  useScrollReveal();
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    let wheelTarget = window.scrollY;
    let wheelTween = null;
    let wheelIdleTimer;
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
    return () => { window.removeEventListener('wheel', handleWheel); window.removeEventListener('pointerdown', resetWheelTarget); window.removeEventListener('touchstart', resetWheelTarget); window.removeEventListener('keydown', resetWheelTarget); window.clearTimeout(wheelIdleTimer); document.removeEventListener('click', handleClick); wheelTween?.kill(); };
  }, []);

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <StoreHeader active="home" home />
    <main id="contenido" className="home-page">
      <h1 className="home-page-title">Malakoi · prendas con carácter para todos los días</h1>
      <section className="home-hero" aria-label="Campaña Malakoi">
        <img src="/assets/images/figma-home-hero.jpg" alt="Campaña Malakoi con dos modelos y el emblema de la marca" fetchPriority="high" />
      </section>
      <section className="home-products-section" id="novedades" aria-labelledby="products-title">
        <h2 id="products-title">PARA CUALQUIER TIPO DE TEMPORADA</h2>
        <div className="home-product-grid home-product-grid-featured">
          {featuredProducts.map((product) => <ProductCard key={product.name} product={product} />)}
        </div>
      </section>
      <section className="home-editorial" id="nosotros" aria-label="Looks de la colección Malakoi" data-reveal>
        <img src="/assets/images/figma-home-editorial.jpg" alt="Tres looks Malakoi: denim amplio, polerón negro y chaqueta azul" loading="lazy" />
      </section>
      <section className="home-products-section home-next-products" id="seleccion" aria-labelledby="second-products-title">
        <h2 id="second-products-title">TU PRÓXIMA PIEZA FAVORITA</h2>
        <div className="home-product-grid home-product-grid-next">
          {nextProducts.map((product) => <ProductCard key={product.name} product={product} />)}
        </div>
      </section>
      <section className="community-section" aria-labelledby="community-title">
        <div className="community-heading"><h2 id="community-title">Etiqu&#233;tanos para que compartamos tu look <span>@MALAKOI.PE</span></h2></div>
        <div className="community-track-window"><div className="community-track">
          {[0, 1].map((copy) => <div className="community-track-group" key={copy} aria-hidden={copy === 1}>
            {['look-1.jpg','look-2.jpg','look-3.jpg','look-4.jpg','look-5.jpg','look-6.jpg','look-7.jpg','look-8.jpg'].map((image, index) => <div className="community-card" key={`${copy}-${image}`} aria-hidden="true"><img src={`/assets/images/community/${image}`} alt={`Look Malakoi de la comunidad ${index + 1}`} loading="lazy" /><span>@malakoi.pe</span></div>)}
          </div>)}
        </div></div>
      </section>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
