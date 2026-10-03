import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown } from 'lucide-react';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import useScrollReveal from './useScrollReveal.js';
import './styles.css';
import './faq.css';

const questions = [
  ['¿Qué tallas tienen?', 'Las tallas disponibles aparecen en cada producto. Algunas prendas son talla única; revisa sus medidas en los detalles antes de elegir.'],
  ['¿Cuánto demora el envío?', 'El tiempo depende de tu ubicación. Escríbenos por WhatsApp con tu distrito o ciudad y te confirmaremos el plazo y el costo de envío.'],
  ['¿Puedo cambiar o devolver una prenda?', 'Si necesitas un cambio o tienes un inconveniente con tu pedido, contáctanos por WhatsApp indicando tu número de pedido para revisar tu caso.'],
  ['¿Cómo puedo seguir mi pedido?', 'Escríbenos por WhatsApp con el nombre y número asociado a tu pedido; te ayudaremos a revisar su estado.'],
  ['¿Cómo hago un pedido?', 'Puedes añadir prendas a tu bolsa desde la tienda o usar el botón “Pedir por WhatsApp” en la página del producto para coordinar directamente.'],
  ['¿Tienen tarjetas de regalo?', 'Por ahora no ofrecemos tarjetas de regalo. Puedes escribirnos si buscas una alternativa para regalar una prenda.'],
];

function FAQPage() {
  useScrollReveal();
  return <>
    <StoreHeader active="faq" />
    <main className="faq-page" id="contenido">
      <section className="faq-content" data-reveal>
        <p className="eyebrow">Ayuda</p>
        <h1>Preguntas frecuentes</h1>
        <p className="faq-intro">Respuestas rápidas para elegir tus prendas y coordinar tu pedido.</p>
        <div className="faq-list">
          {questions.map(([question, answer]) => <details className="faq-item" key={question} data-reveal>
            <summary><span>{question}</span><ChevronDown size={18} aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>)}
        </div>
        <a className="faq-contact-link" href="https://wa.me/51906575746" target="_blank" rel="noreferrer">¿Sigues con dudas? Escríbenos por WhatsApp</a>
      </section>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><FAQPage /></React.StrictMode>);
