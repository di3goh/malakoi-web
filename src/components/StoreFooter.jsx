import React from 'react';
import { SocialLinks } from './StoreHeader.jsx';

export default function StoreFooter() {
  return <footer className="site-footer">
    <div className="site-footer-main">
        <section className="site-footer-column site-footer-branding" aria-label="Malakoi">
        <a className="brand" href="/" aria-label="Malakoi, inicio"><img src="/imagen_2026-10-02_215000798-Photoroom.png" alt="Malakoi" /></a>
        <p>Tu estilo, tus reglas.</p>
      </section>
      <nav className="site-footer-column" aria-label="Explora Malakoi">
        <h2>Explora</h2><a href="/catalogo.html">Catálogo</a><a href="/#novedades">Novedades</a><a href="/carrito.html">Bolsa</a><a href="/contacto.html">Preguntas frecuentes</a>
      </nav>
        <section className="site-footer-column site-footer-contact">
        <h2>Contacto</h2><p>¿Tienes una pregunta o necesitas ayuda?</p><a href="tel:+51906575746"><strong>+51 906 575 746</strong></a><a href="https://wa.me/51906575746" className="site-footer-contact-link" target="_blank" rel="noreferrer">WhatsApp</a>
        <SocialLinks className="site-footer-social" />
      </section>
    </div>
    <div className="site-footer-bottom"><small>© {new Date().getFullYear()} Malakoi · Perú</small><span aria-hidden="true">MALAKOI</span></div>
  </footer>;
}
