import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const products = [
  { name: 'KIMONO JACKET', category: 'CHAQUETAS', image: '/1.png', alt: 'Chaqueta Kimono negra de corte amplio', colors: [{ name: 'Negro', value: '#171717' }, { name: 'Hueso', value: '#e5ded0' }, { name: 'Oliva', value: '#676b50' }] },
  { name: 'J-JACKET', category: 'ESENCIALES', image: '/2.png', alt: 'Chaqueta J negra de estilo urbano', colors: [{ name: 'Negro', value: '#171717' }, { name: 'Gris', value: '#aaa9a4' }, { name: 'Oliva', value: '#676b50' }, { name: 'Vino', value: '#673c43' }] },
  { name: 'MORI DENIM JACKET', category: 'DENIM', image: '/3.png', alt: 'Chaqueta denim azul Mori', colors: [{ name: 'Azul lavado', value: '#546579' }, { name: 'Índigo', value: '#28394d' }, { name: 'Negro', value: '#252525' }] },
  { name: 'KNOT ZIP-UP JACKET', category: 'CAPAS LIGERAS', image: '/4.png', alt: 'Chaqueta ligera con cierre frontal', colors: [{ name: 'Gris', value: '#aaa9a4' }, { name: 'Negro', value: '#171717' }, { name: 'Hueso', value: '#e5ded0' }] },
];
const lowerProducts = [
  { ...products[0], name: 'PARACHUTE JOGGER', category: 'PANTALONES', image: '/assets/images/parachute.png', alt: 'Parachute jogger gris de pierna amplia' },
  { ...products[1], name: 'CAMISA LOTUS', category: 'CAMISAS', image: '/assets/images/lotus.png', alt: 'Camisa Lotus negra con cierres orientales' },
  { ...products[2], name: 'CLASP JACKET', category: 'CHAQUETAS', image: '/assets/images/clasp-jacket.png', alt: 'Clasp Jacket negra con cierres metálicos' },
  { ...products[3], name: 'KIMONO V3', category: 'CHAQUETAS', image: '/assets/images/kimono-v3.png', alt: 'Kimono V3 negro de manga amplia' },
];

function SocialLinks({ className }) {
  return <nav className={className} aria-label="Redes sociales">
    <a href="https://www.tiktok.com/" aria-label="TikTok" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.9 6.9 0 0 1-4.2-1.5v8.1a6.2 6.2 0 1 1-5.4-6.1v3.4a2.9 2.9 0 1 0 2.1 2.8V2.5h3.3c.2 2.2 1.8 4 4.2 4.3z" fill="currentColor" /></svg></a>
    <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.6" r="1.2" fill="currentColor" /></svg></a>
    <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z" /></svg></a>
  </nav>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState([]);
  const hero = useRef(null);
  const navLinks = [['Novedades', '#novedades'], ['Catálogo', '/catalogo.html'], ['Contacto', '/contacto.html']];

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    let wheelTarget = window.scrollY;
    let wheelTween = null;
    let wheelIdleTimer;
    const context = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 28, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.15 });
      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 28, opacity: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
      });
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
      setMenuOpen(false);
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
    <div className="announcement">
      <p className="announcement-message">TE AMO, PERO ESCOJO MALAKOI <span aria-hidden="true">♥</span></p>
      <SocialLinks className="social-links" />
    </div>
    <header className="site-header">
      <a className="brand" href="/" aria-label="Malakoi, ir al inicio"><img src="/imagen_2026-10-02_215000798-Photoroom.png" alt="Malakoi" /></a>
      <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        {navLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="icon-link search-link" href="/catalogo.html" aria-label="Buscar en el catálogo"><Search size={19} strokeWidth={1.7} /></a>
        <a className="bag-link" href="/carrito.html"><ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" /><span>Bolsa</span></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
    <main id="contenido">
      <section className="hero" ref={hero} aria-labelledby="hero-title">
        <picture className="hero-media">
          {/* Reemplaza /hero-mobile.jpg con tu arte vertical; el banner existente sigue para escritorio. */}
          <source media="(max-width: 700px)" srcSet="/MALAKOI-BANNER.png" />
          <img src="/MALAKOI-BANNER.png" alt="Campaña Malakoi: prendas contemporáneas en una composición editorial" fetchPriority="high" />
        </picture>
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="hero-label"><h1 id="hero-title">Prendas con carácter para todos los días.</h1></div>
          <a className="button hero-button" href="/catalogo.html">Ver catálogo <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <a className="hero-scroll" href="#novedades"><span>Desliza para explorar</span><ArrowDown size={16} aria-hidden="true" /></a>
      </section>
      <section className="section products-section" id="novedades" aria-labelledby="products-title" data-reveal>
        <div className="section-heading"><div><p className="eyebrow">Selección Malakoi</p><h2 id="products-title">Para cada tipo de temporada</h2></div><a className="text-link" href="/catalogo.html">Ver catálogo <ArrowRight size={16} aria-hidden="true" /></a></div>
        <div className="product-grid">
          {products.map((product) => <article className="product-card" key={product.name}>
            <a className="product-image" href="/catalogo.html" aria-label={`Ver ${product.name}`}><img src={product.image} alt={product.alt} loading="lazy" /></a>
            <button className={`save-button ${saved.includes(product.name) ? 'is-saved' : ''}`} type="button" aria-label={`${saved.includes(product.name) ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`} aria-pressed={saved.includes(product.name)} onClick={() => toggleSaved(product.name)}><Heart size={18} fill={saved.includes(product.name) ? 'currentColor' : 'none'} /></button>
            <div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><div className="product-bottom"><div className="swatches" aria-label={`Colores disponibles para ${product.name}`}>{product.colors.map((color) => <span className="swatch" key={color.name} title={color.name} aria-label={color.name} style={{ '--swatch': color.value }} />)}</div><span className="price">S/ 145.00</span></div></div>
          </article>)}
        </div>
      </section>
      <section className="section products-section second-products" id="seleccion" aria-labelledby="second-products-title" data-reveal>
        <div className="section-heading"><div><p className="eyebrow">Encuentra tus favoritos</p><h2 id="second-products-title">Tu próxima pieza favorita</h2></div><a className="text-link" href="/catalogo.html">Explorar todo <ArrowRight size={16} aria-hidden="true" /></a></div>
        <div className="product-grid">
          {lowerProducts.map((product) => <article className="product-card" key={`second-${product.name}`}>
            <a className="product-image" href="/catalogo.html" aria-label={`Ver ${product.name}`}><img src={product.image} alt={product.alt} loading="lazy" /></a>
            <button className={`save-button ${saved.includes(product.name) ? 'is-saved' : ''}`} type="button" aria-label={`${saved.includes(product.name) ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`} aria-pressed={saved.includes(product.name)} onClick={() => toggleSaved(product.name)}><Heart size={18} fill={saved.includes(product.name) ? 'currentColor' : 'none'} /></button>
            <div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><div className="product-bottom"><div className="swatches" aria-label={`Colores disponibles para ${product.name}`}>{product.colors.map((color) => <span className="swatch" key={color.name} title={color.name} aria-label={color.name} style={{ '--swatch': color.value }} />)}</div><span className="price">S/ 145.00</span></div></div>
          </article>)}
        </div>
      </section>
      <section className="brand-story" aria-labelledby="story-title" data-reveal>
        <div className="story-image"><img src="/assets/images/hero-confirmed.png" alt="Imagen editorial de la colección Malakoi" loading="lazy" /></div>
        <div className="story-copy"><div className="hero-label"><h2 id="story-title">Una forma propia de vestir.</h2></div><a className="button hero-button" href="/catalogo.html">Descubrir Malakoi <ArrowRight size={17} aria-hidden="true" /></a></div>
      </section>
      <section className="club-section" aria-labelledby="club-title" data-reveal><p className="eyebrow">Únete a Malakoi</p><h2 id="club-title">Tu estilo, tus reglas</h2><p>Recibe lanzamientos, ideas para combinar y acceso anticipado a nuestras nuevas colecciones.</p><a className="text-link" href="/contacto.html">Conversemos <ArrowRight size={16} aria-hidden="true" /></a></section>
    </main>
    <footer className="footer"><div className="footer-branding"><a className="brand footer-brand" href="/" aria-label="Malakoi, inicio"><img src="/imagen_2026-10-02_215000798-Photoroom.png" alt="Malakoi" /></a><p>Tu estilo, tus reglas.</p></div><nav className="footer-nav" aria-label="Enlaces del pie de página"><a href="/catalogo.html">Catálogo</a><a href="/contacto.html">Contacto</a><a href="/carrito.html">Bolsa</a></nav><SocialLinks className="footer-social" /><small>© {new Date().getFullYear()} Malakoi Studio · Perú</small></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
