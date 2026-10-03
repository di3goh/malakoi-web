import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Trash2 } from 'lucide-react';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import { formatPrice, readCurrency } from './data/currency.js';
import './styles.css';
import './cart.css';

const readBag = () => {
  try { return JSON.parse(localStorage.getItem('malakoiBag') || '[]'); }
  catch { return []; }
};
const getUnitPrice = (item) => Number.parseFloat(String(item.price || '').replace(/[^\d.]/g, '')) || 0;

function CartPage() {
  const [bag, setBag] = useState(readBag);
  const [currency, setCurrency] = useState(readCurrency);
  const subtotal = useMemo(() => bag.reduce((sum, item) => sum + getUnitPrice(item) * (Number(item.quantity) || 1), 0), [bag]);
  const orderText = `Hola Malakoi, quiero coordinar este pedido:\n${bag.map((item) => `• ${item.name}${item.color ? `, ${item.color}` : ''}${item.size ? `, talla ${item.size}` : ''} × ${Number(item.quantity) || 1} — ${formatPrice(getUnitPrice(item) * (Number(item.quantity) || 1), currency)}`).join('\n')}\nTotal referencial: ${formatPrice(subtotal, currency)}`;
  const checkoutHref = `https://wa.me/51906575746?text=${encodeURIComponent(orderText)}`;
  const removeItem = (index) => setBag((current) => {
    const next = current.filter((_, itemIndex) => itemIndex !== index);
    localStorage.setItem('malakoiBag', JSON.stringify(next));
    return next;
  });
  const changeCurrency = (value) => {
    setCurrency(value);
    localStorage.setItem('malakoiCurrency', value);
  };

  return <>
    <StoreHeader active="cart" />
    <main className="cart-page">
      <p className="eyebrow">Tu selección</p>
      <div className="cart-heading"><h1>La bolsa</h1><label>Moneda<select value={currency} onChange={(event) => changeCurrency(event.target.value)} aria-label="Elegir moneda"><option value="PEN">PEN · S/</option><option value="USD">USD · $</option></select></label></div>
      <div className="cart-layout">
        <section className="cart-items" aria-label="Artículos en tu bolsa" aria-live="polite">
          {bag.length ? bag.map((item, index) => <article className="cart-item" key={`${item.name}-${index}`}>
            <img src={item.image} alt={item.name} />
            <div className="cart-item-copy"><h2>{item.name}</h2><p>{[item.color, item.size && `Talla ${item.size}`, `Cantidad: ${Number(item.quantity) || 1}`].filter(Boolean).join(' · ')}</p><strong>{formatPrice(getUnitPrice(item) * (Number(item.quantity) || 1), currency)}</strong></div>
            <button className="cart-remove" type="button" onClick={() => removeItem(index)} aria-label={`Quitar ${item.name} de la bolsa`}><Trash2 size={17} /><span>Quitar</span></button>
          </article>) : <div className="cart-empty"><h2>Tu bolsa está esperando una nueva prenda.</h2><a href="/catalogo.html">Explorar catálogo <span aria-hidden="true">→</span></a></div>}
        </section>
        <aside className="cart-summary" aria-label="Resumen del pedido">
          <h2>Resumen del pedido</h2>
          <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></div>
          <div className="cart-summary-row"><span>Envío</span><span>A coordinar</span></div>
          <div className="cart-summary-total"><strong>Total referencial</strong><strong>{formatPrice(subtotal, currency)}</strong></div>
          {bag.length > 0 && <a className="cart-checkout" href={checkoutHref} target="_blank" rel="noreferrer">Continuar por WhatsApp</a>}
        </aside>
      </div>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><CartPage /></React.StrictMode>);
