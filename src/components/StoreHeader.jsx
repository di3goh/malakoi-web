import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check, Menu, Moon, Search, ShoppingBag, Sun, Trash2, X } from 'lucide-react';
import { BAG_UPDATED_EVENT, readBag, removeBagItem } from '../data/bag.js';
import useSmoothScroll from '../useSmoothScroll.js';
import './store-header.css';

function SocialLinks({ className }) {
  return <nav className={className} aria-label="Redes sociales">
    <a href="https://www.tiktok.com/@malakoi.pe" aria-label="TikTok" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.9 6.9 0 0 1-4.2-1.5v8.1a6.2 6.2 0 1 1-5.4-6.1v3.4a2.9 2.9 0 1 0 2.1 2.8V2.5h3.3c.2 2.2 1.8 4 4.2 4.3z" fill="currentColor" /></svg></a>
    <a href="https://www.instagram.com/malakoi.co" aria-label="Instagram" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.6" r="1.2" fill="currentColor" /></svg></a>
    <a href="https://www.facebook.com/malakoi.pe" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z" /></svg></a>
  </nav>;
}

export { SocialLinks };

export default function StoreHeader({ active = 'home', home = false, shopPage = false }) {
  useSmoothScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('malakoiTheme') === 'dark');
  const [bag, setBag] = useState(readBag);
  const [bagOpen, setBagOpen] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const themeTransitionTimer = useRef(null);
  const bagTriggerRef = useRef(null);
  const bagCloseRef = useRef(null);
  const wasBagOpenRef = useRef(false);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('malakoiTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  useEffect(() => () => window.clearTimeout(themeTransitionTimer.current), []);
  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    window.clearTimeout(themeTransitionTimer.current);
    themeTransitionTimer.current = window.setTimeout(() => root.classList.remove('theme-transitioning'), 450);
    setDarkMode((value) => !value);
  };
  useEffect(() => {
    if (!home) return undefined;
    const updateScrolled = () => setScrolled(window.scrollY > 32);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, [home]);
  useEffect(() => {
    const syncBag = (event) => {
      setBag(readBag());
      if (event?.detail?.item) {
        setAddedItem(event.detail.item);
        setBagOpen(true);
      }
    };
    const handleDrawerKeys = (event) => {
      if (event.key === 'Escape') setBagOpen(false);
      if (event.key !== 'Tab' || !bagOpen) return;
      const drawer = document.querySelector('.bag-drawer');
      const focusable = [...(drawer?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener(BAG_UPDATED_EVENT, syncBag);
    window.addEventListener('storage', syncBag);
    window.addEventListener('keydown', handleDrawerKeys);
    return () => {
      window.removeEventListener(BAG_UPDATED_EVENT, syncBag);
      window.removeEventListener('storage', syncBag);
      window.removeEventListener('keydown', handleDrawerKeys);
    };
  }, [bagOpen]);
  useEffect(() => {
    document.body.classList.toggle('bag-drawer-open', bagOpen);
    return () => document.body.classList.remove('bag-drawer-open');
  }, [bagOpen]);
  useEffect(() => {
    if (bagOpen) bagCloseRef.current?.focus();
    else if (wasBagOpenRef.current) bagTriggerRef.current?.focus();
    wasBagOpenRef.current = bagOpen;
  }, [bagOpen]);
  const removeFromPreview = (displayIndex) => {
    setBag(removeBagItem(bag.length - 1 - displayIndex));
    setAddedItem(null);
    window.requestAnimationFrame(() => {
      const buttons = document.querySelectorAll('.bag-preview-remove');
      if (buttons.length) buttons[Math.min(displayIndex, buttons.length - 1)].focus();
      else bagCloseRef.current?.focus();
    });
  };
  const links = [['CATÁLOGO', '/catalogo.html', 'catalog'], ['NOSOTROS', '/nosotros.html', 'about'], ['ENVÍOS', '/contacto.html', 'shipping']];
  return createPortal(<>
    {!home && <a className="skip-link" href="#contenido">Saltar al contenido</a>}
    {!home && <><div className="shipping-marquee" role="region" aria-label="Envíos a todo el Perú, Lima y provincias"><div className="shipping-marquee-track" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <span key={index}>ENVÍOS A TODO EL PERÚ, LIMA Y PROVINCIAS <b>✦</b></span>)}</div></div>
    <div className="announcement"><p className="announcement-message">TE AMO, PERO ESCOJO MALAKOI <span aria-hidden="true">♥</span></p><SocialLinks className="social-links" /></div></>}
    <header className={`site-header${home ? ` home-header${scrolled ? ' is-scrolled' : ''}` : ' shop-header'}`}>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <a className="brand" href="/" aria-label="Malakoi, ir al inicio"><img src="/imagen_2026-10-02_215000798-Photoroom.png" alt="Malakoi" /></a>
      <nav id="primary-navigation" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        {links.map(([label, href, key]) => <a key={key} className={active === key ? 'is-active' : ''} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="icon-link search-link" href="/catalogo.html" aria-label="Buscar en el catálogo"><Search size={19} strokeWidth={1.7} /></a>
        <button className="theme-toggle" type="button" aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'} aria-pressed={darkMode} onClick={toggleTheme}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button ref={bagTriggerRef} className="bag-link" type="button" aria-label={`Abrir bolsa${bag.length ? `, ${bag.length} productos` : ''}`} aria-expanded={bagOpen} onClick={() => { setAddedItem(null); setBag(readBag()); setBagOpen(true); }}><ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" /><span>Bolsa</span>{bag.length > 0 && <span className="bag-count">{bag.length}</span>}</button>
      </div>
    </header>
    {bagOpen && <div className="bag-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setBagOpen(false); }}>
      <aside className="bag-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-drawer-title">
        <div className="bag-drawer-header"><div><p className="bag-drawer-eyebrow">MALAKOI</p><h2 id="bag-drawer-title">Tu bolsa <span>({bag.length})</span></h2></div><button ref={bagCloseRef} type="button" className="bag-drawer-close" aria-label="Cerrar bolsa" onClick={() => setBagOpen(false)}><X size={20} /></button></div>
        {addedItem && <p className="bag-confirmation" role="status"><Check size={17} />{addedItem.name} se agregó a tu bolsa.</p>}
        {bag.length ? <div className="bag-preview-list" aria-label="Vista previa de productos en la bolsa">{[...bag].reverse().map((item, index) => <article className="bag-preview-item" key={`${item.name}-${index}`}><img src={item.image} alt="" loading="lazy" decoding="async" /><div className="bag-preview-copy"><h3>{item.name}</h3>{(item.color || item.size) && <p>{[item.color, item.size].filter(Boolean).join(' · ')}</p>}<span>{item.price || ''}{item.quantity > 1 ? ` · Cant. ${item.quantity}` : ''}</span></div><button className="bag-preview-remove" type="button" aria-label={`Quitar ${item.name} de la bolsa`} onClick={() => removeFromPreview(index)}><Trash2 size={16} /></button></article>)}</div> : <div className="bag-empty-preview"><ShoppingBag size={28} strokeWidth={1.4} /><p>Tu bolsa está vacía por ahora.</p><button type="button" onClick={() => setBagOpen(false)}>Seguir explorando</button></div>}
        {bag.length > 0 && <div className="bag-drawer-footer"><a href="/carrito.html">Ver carrito completo <ArrowRight size={17} /></a><button type="button" onClick={() => setBagOpen(false)}>Seguir comprando</button></div>}
      </aside>
    </div>}
  </>, document.getElementById('site-header-root'));
}
