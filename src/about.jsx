import React from 'react';
import { createRoot } from 'react-dom/client';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import './styles.css';
import './about.css';

function AboutPage() {
  return <>
    <StoreHeader active="about" />
    <main id="contenido" className="about-coming-soon" tabIndex={-1}>
      <div className="about-coming-soon-content">
        <img src="/imagen_2026-10-02_215000798-Photoroom.png" alt="Malakoi" />
        <h1>Nosotros</h1>
        <p>En construcción.</p>
      </div>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><AboutPage /></React.StrictMode>);
