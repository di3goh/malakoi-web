import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronRight, MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import useScrollReveal from './useScrollReveal.js';
import { products, lowerProducts } from './data/products.js';
import { formatPrice, readCurrency } from './data/currency.js';
import './styles.css';
import './product.css';

const allProducts = [...products, ...lowerProducts];
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const productHref = (name) => `/producto.html?item=${encodeURIComponent(slug(name))}`;

function ProductPage() {
  useScrollReveal();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('item') || '';
  const product = useMemo(() => allProducts.find((item) => slug(item.name) === requested) || products[0], [requested]);
  const isMori = product.name === 'MORI DENIM JACKET';
  const isKnot = product.name === 'KNOT ZIP-UP JACKET';
  const isLotus = product.name === 'CAMISA LOTUS';
  const [variant, setVariant] = useState(() => isKnot || isLotus ? product.colors[0] : null);
  const [size, setSize] = useState(isKnot || isLotus ? 'Estándar' : 'S/M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [currency, setCurrency] = useState(readCurrency);
  const setStoreCurrency = (value) => { setCurrency(value); localStorage.setItem('malakoiCurrency', value); };
  const image = variant?.image || product.image;
  const price = product.price || 145;
  const recommendations = allProducts.filter((item) => item.name !== product.name).slice(0, 5);
  const whatsappText = `Hola Malakoi, quiero pedir ${product.name}${variant ? ` en color ${variant.name}` : ''}, talla ${size}, cantidad ${quantity}.`;
  const whatsappHref = `https://wa.me/51906575746?text=${encodeURIComponent(whatsappText)}`;

  const addToBag = () => {
    const bag = JSON.parse(localStorage.getItem('malakoiBag') || '[]');
    bag.push({ name: product.name, price: `S/ ${price}.00`, image, color: variant?.name || '', size, quantity });
    localStorage.setItem('malakoiBag', JSON.stringify(bag));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return <>
    <StoreHeader active="catalog" />
    <main className="product-page">
      <nav className="product-breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><ChevronRight size={14} /><a href="/catalogo.html">Catálogo</a><ChevronRight size={14} /><span aria-current="page">{product.name}</span></nav>
      <div className="product-detail-layout" data-reveal>
        <section className="product-gallery" aria-label={`Fotos de ${product.name}`}>
          <div className="product-main-photo"><img src={image} alt={variant ? `${product.name}, color ${variant.name}` : product.alt} /></div>
          {product.colors.some((color) => color.image) && <div className="product-thumbnails" aria-label="Fotos por color">
            {product.colors.filter((color) => color.image).map((color) => <button key={color.name} className={variant?.name === color.name ? 'is-selected' : ''} type="button" onClick={() => setVariant(color)} aria-label={`Ver color ${color.name}`}><img src={color.image} alt={`Color ${color.name}`} /></button>)}
          </div>}
        </section>

        <section className="product-detail-copy" aria-labelledby="product-title">
          <p className="product-detail-category">{product.category}</p>
          <h1 id="product-title">{product.name}</h1>
          <p className="product-detail-subtitle">{product.description || 'Una pieza Malakoi para vestir a tu manera.'}</p>
          <div className="product-detail-price-row"><p className="product-detail-price">{formatPrice(price, currency)}</p><label className="product-currency-control">Moneda<select value={currency} onChange={(event) => setStoreCurrency(event.target.value)} aria-label="Elegir moneda"><option value="PEN">PEN · S/</option><option value="USD">USD · $</option></select><span className="currency-note">USD referencial</span></label></div>

          {product.colors.length > 0 && <fieldset className="product-option product-color-option"><legend>Color{variant ? `: ${variant.name}` : ''}</legend><div className="product-color-list">{product.colors.map((color) => <button type="button" key={color.name} className={`product-color ${variant?.name === color.name ? 'is-selected' : ''}`} onClick={() => setVariant(color)} aria-label={`Seleccionar color ${color.name}`} aria-pressed={variant?.name === color.name} title={color.name} style={{ '--product-swatch': color.value }}><span /></button>)}</div><p className="selected-color">{variant?.name || 'Selecciona un color'}</p></fieldset>}

          <fieldset className="product-option"><legend>Talla</legend><div className="product-size-list">{(product.sizes || (isKnot ? ['Estándar', 'L'] : isMori ? ['S/M', 'L'] : ['S', 'M', 'L', 'XL'])).map((item) => <button type="button" key={item} className={size === item ? 'is-selected' : ''} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div></fieldset>

          <div className="product-quantity-row"><span>Cantidad</span><div className="quantity-control"><button type="button" aria-label="Reducir cantidad" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={15} /></button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((value) => value + 1)}><Plus size={15} /></button></div></div>
          <button className="product-add-button" type="button" onClick={addToBag}><ShoppingBag size={17} />{added ? 'Añadido a tu bolsa' : 'Añadir a la bolsa'}</button>
          <a className="product-whatsapp-button" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />Pedir por WhatsApp</a>

          {isMori && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 10 ONZAS 100% ALGODON</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar (equivalente a una S o M)</strong><p>Largo 61 cm · Ancho 62 cm · Hombro 24 cm · Manga 50 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 65 cm · Ancho 64 cm · Hombro 25,5 cm · Manga 53 cm</p></div></section>}
          {isLotus && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 5 ONZAS</p><p className="material-label">Botones chinos hechos de cordón elástico · Corte boxy · Botones de camisa convencionales.</p><h3>TALLA ÚNICA ESTÁNDAR</h3><div className="measurement"><strong>Estándar</strong><p>Largo 61 cm · Ancho 60 cm</p></div></section>}
          {isKnot && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: FRANELA 20/1. CONTIENE REACTIVO, ANTIPEELING Y NO SE DEFORMA.</p><p className="material-label">Nudos de cordones de algodón.</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Largo 57 cm · Ancho axila a axila 60 cm · Manga 55 cm (sin contar el hombro) · Hombro 18 cm · Cintura 60 cm regulable</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 62 cm · Ancho axila a axila 63 cm · Manga 58 cm · Hombro 19 cm · Cintura 62 cm</p></div></section>}
        </section>
      </div>
      <section className="related-products" aria-labelledby="related-title">
        <div className="related-heading"><p className="eyebrow">Completa tu look</p><h2 id="related-title">También te podría gustar</h2></div>
        <div className="related-grid">{recommendations.map((item) => <a className="related-card" data-reveal href={productHref(item.name)} key={item.name}>
          <span className="related-image"><img src={item.image} alt={item.alt} loading="lazy" /></span>
          <span className="related-category">{item.category}</span><strong>{item.name}</strong><span className="related-price">{formatPrice(item.price || 145, currency)}</span>
        </a>)}</div>
      </section>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ProductPage /></React.StrictMode>);
