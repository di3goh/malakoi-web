import React, { useEffect, useState } from 'react';
import { Menu, Moon, Search, ShoppingBag, Sun, X } from 'lucide-react';
import './store-header.css';

function SocialLinks({ className }) {
  return <nav className={className} aria-label="Redes sociales">
    <a href="https://www.tiktok.com/@malakoi.pe" aria-label="TikTok" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.9 6.9 0 0 1-4.2-1.5v8.1a6.2 6.2 0 1 1-5.4-6.1v3.4a2.9 2.9 0 1 0 2.1 2.8V2.5h3.3c.2 2.2 1.8 4 4.2 4.3z" fill="currentColor" /></svg></a>
    <a href="https://www.instagram.com/malakoi.co" aria-label="Instagram" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.6" r="1.2" fill="currentColor" /></svg></a>
    <a href="https://www.facebook.com/malakoi.pe" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z" /></svg></a>
  </nav>;
}

export { SocialLinks };

export default function StoreHeader({ active = 'home' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('malakoiTheme') === 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('malakoiTheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  const links = [['CATÁLOGO', '/catalogo.html', 'catalog'], ['PREGUNTAS', '/contacto.html', 'faq']];
  return <>
    <div className="shipping-marquee" role="region" aria-label="Envíos a todo el Perú, Lima y provincias"><div className="shipping-marquee-track" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <span key={index}>ENVÍOS A TODO EL PERÚ, LIMA Y PROVINCIAS <b>✦</b></span>)}</div></div>
    <div className="announcement"><p className="announcement-message">TE AMO, PERO ESCOJO MALAKOI <span aria-hidden="true">♥</span></p><SocialLinks className="social-links" /></div>
    <header className="site-header">
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <a className="brand" href="/" aria-label="Malakoi, ir al inicio"><img src="/imagen_2026-10-02_215000798-Photoroom.png" alt="Malakoi" /></a>
      <nav id="primary-navigation" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        {links.map(([label, href, key]) => <a key={key} className={active === key ? 'is-active' : ''} href={href}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <a className="icon-link search-link" href="/catalogo.html" aria-label="Buscar en el catálogo"><Search size={19} strokeWidth={1.7} /></a>
        <button className="theme-toggle" type="button" aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'} aria-pressed={darkMode} onClick={() => setDarkMode((value) => !value)}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
        <a className="bag-link" href="/carrito.html"><ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" /><span>Bolsa</span></a>
      </div>
    </header>
  </>;
}
