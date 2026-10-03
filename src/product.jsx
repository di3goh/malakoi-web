import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronRight, MessageCircle, Minus, Plus, ShoppingBag } from 'lucide-react';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import useScrollReveal from './useScrollReveal.js';
import { products, lowerProducts } from './data/products.js';
import { formatPrice, formatProductPrice, readCurrency } from './data/currency.js';
import './styles.css';
import './product.css';

const allProducts = [...products, ...lowerProducts];
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const productHref = (name) => name === 'KIMONO JACKET' ? '/kimono-jacket.html' : `/producto.html?item=${encodeURIComponent(slug(name))}`;

function ProductPage() {
  useScrollReveal();
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('item') || '';
  const product = useMemo(() => allProducts.find((item) => slug(item.name) === requested) || products[0], [requested]);
  const isMori = product.name === 'MORI DENIM JACKET';
  const isKnot = product.name === 'KNOT ZIP-UP JACKET';
  const isLotus = product.name === 'CAMISA LOTUS';
  const isKimono = product.name === 'KIMONO JACKET';
  const isClasp = product.name === 'CLASP JACKET';
  const isJJacket = product.name === 'J-JACKET';
  const isKimonoV3 = product.name === 'KIMONO V3';
  const isWideBaggy = product.name === 'WIDE BAGGY CORDUROY';
  const isParachute = product.name === 'PARACHUTE JOGGER';
  const isPolo34 = product.name === 'POLO 3/4';
  const isBasicTank = product.name === 'BASIC TANK TOP';
  const isWideRaw = product.name === 'WIDE RAW DENIM PANTS';
  const [variant, setVariant] = useState(() => isKnot || isLotus || isKimono || isClasp || isJJacket || isKimonoV3 || isWideBaggy || isParachute || isPolo34 || isBasicTank || isWideRaw ? product.colors[0] : null);
  const [size, setSize] = useState(isKnot || isLotus || isKimono || isClasp || isKimonoV3 || isWideBaggy || isParachute || isBasicTank || isWideRaw ? 'Estándar' : isJJacket ? 'M' : isPolo34 ? 'S' : 'S/M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [currency, setCurrency] = useState(readCurrency);
  const setStoreCurrency = (value) => { setCurrency(value); localStorage.setItem('malakoiCurrency', value); };
  const image = variant?.image || product.detailImage || product.image;
  const price = variant?.price || product.price || 145;
  const recommendations = allProducts.filter((item) => item.name !== product.name).slice(0, 5);
  useEffect(() => {
    const title = `${product.name} · Malakoi`;
    const description = product.description || `Descubre ${product.name} en Malakoi. ${product.alt}.`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', new URL(image, window.location.origin).href);
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', product.alt);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href);
    document.querySelector('meta[property="product:price:amount"]')?.setAttribute('content', String(price));
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', new URL(image, window.location.origin).href);
  }, [product, image, price]);
  const whatsappText = `Hola Malakoi, quiero pedir ${product.name}${variant ? ` en color ${variant.name}` : ''}, talla ${size}, cantidad ${quantity}.`;
  const whatsappHref = `https://wa.me/51906575746?text=${encodeURIComponent(whatsappText)}`;

  const addToBag = () => {
    const bag = JSON.parse(localStorage.getItem('malakoiBag') || '[]');
    bag.push({ name: product.name, price: `S/ ${price}.00`, usdPrice: product.usdPrice, image, color: variant?.name || '', size, quantity });
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
          <div className="product-detail-price-row"><p className="product-detail-price">{formatProductPrice(price, currency, product.usdPrice)}</p><label className="product-currency-control">Moneda<select value={currency} onChange={(event) => setStoreCurrency(event.target.value)} aria-label="Elegir moneda"><option value="PEN">PEN · S/</option><option value="USD">USD · $</option></select><span className="currency-note">{product.usdPrice != null ? 'Precio en USD indicado' : 'USD referencial'}</span></label></div>
          {isClasp && <p className="product-shipping-note">Envío no incluido</p>}

          {product.colors.length > 0 && <fieldset className="product-option product-color-option"><legend>Color{variant ? `: ${variant.name}` : ''}</legend><div className="product-color-list">{product.colors.map((color) => <button type="button" key={color.name} className={`product-color ${variant?.name === color.name ? 'is-selected' : ''}`} onClick={() => setVariant(color)} aria-label={`Seleccionar color ${color.name}`} aria-pressed={variant?.name === color.name} title={color.name} style={{ '--product-swatch': color.value }}><span /></button>)}</div><p className="selected-color">{variant?.name || 'Selecciona un color'}</p></fieldset>}

          <fieldset className="product-option"><legend>Talla</legend><div className="product-size-list">{(product.sizes || (isKnot ? ['Estándar', 'L'] : isMori ? ['S/M', 'L'] : ['S', 'M', 'L', 'XL'])).map((item) => <button type="button" key={item} className={size === item ? 'is-selected' : ''} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div></fieldset>

          <div className="product-quantity-row"><span>Cantidad</span><div className="quantity-control"><button type="button" aria-label="Reducir cantidad" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={15} /></button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((value) => value + 1)}><Plus size={15} /></button></div></div>
          <button className="product-add-button" type="button" onClick={addToBag}><ShoppingBag size={17} />{added ? 'Añadido a tu bolsa' : 'Añadir a la bolsa'}</button>
          <a className="product-whatsapp-button" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />Pedir por WhatsApp</a>

          {isMori && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 10 ONZAS 100% ALGODON</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar (equivalente a una S o M)</strong><p>Largo 61 cm · Ancho 62 cm · Hombro 24 cm · Manga 50 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 65 cm · Ancho 64 cm · Hombro 25,5 cm · Manga 53 cm</p></div></section>}
          {isKimono && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: RAW DENIM · PRENDA UNISEX</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Largo 60 cm · Ancho 63 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 65 cm · Ancho 64 cm</p></div></section>}
          {isLotus && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 5 ONZAS</p><p className="material-label">Botones chinos hechos de cordón elástico · Corte boxy · Botones de camisa convencionales.</p><h3>TALLA ÚNICA ESTÁNDAR</h3><div className="measurement"><strong>Estándar</strong><p>Largo 61 cm · Ancho 60 cm</p></div></section>}
          {isJJacket && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">CASACA DE RAW DENIM RÍGIDO · FIT BOXY OVERSIZE · INSPIRADA EN EL ESTILO JAPANDI</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Talla S</strong><p>Largo 57 cm · Ancho 60 cm · Hombro 18 cm · Manga 55 cm</p></div><div className="measurement"><strong>Talla M</strong><p>Largo 59 cm · Ancho 62 cm · Hombro 18 cm · Manga 58 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 63 cm · Ancho 65 cm · Hombro 19 cm · Manga 60 cm</p></div></section>}
          {isKimonoV3 && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 10 ONZAS</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Largo 65 cm · Ancho 54 cm · Hombro 29 cm · Manga 46 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 68 cm · Ancho 56 cm · Hombro 30 cm · Manga 48 cm</p></div></section>}
          {isWideBaggy && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: CORDUROY DE VENA ANCHA · CINTURA CON ELÁSTICO EN LA PARTE TRASERA</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Cintura 72–94 cm · Cadera 114 cm · Largo 103 cm · Ancho de pierna 72 cm (toda la vuelta) · Botapie 44 cm (toda la vuelta)</p></div><div className="measurement"><strong>Talla L</strong><p>Cintura 75–96 cm · Cadera 115 cm · Largo 104 cm · Ancho de pierna 74 cm (toda la vuelta) · Botapie 45 cm (toda la vuelta)</p></div></section>}
          {isParachute && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">FIT SUPER WIDE</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Cintura 65–92 cm · Largo 107 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Cintura 67–95 cm · Largo 107 cm</p></div><div className="measurement"><strong>Medidas de pierna (ambas tallas)</strong><p>Ancho 37 cm · Contorno 74 cm · Basta 18 cm</p></div></section>}
          {isPolo34 && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: 20/1 · ESTAMPADO EN 3D · FIT CORTE BOXY</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Talla S</strong><p>Largo 57 cm · Ancho 62 cm</p></div><div className="measurement"><strong>Talla M</strong><p>Largo 59 cm · Ancho 63 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 61 cm · Ancho 64 cm</p></div></section>}
          {isBasicTank && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: RIB GRUESO 100% ALGODÓN</p><h3>TALLA ESTÁNDAR (EQUIVALE A S/M)</h3><div className="measurement"><strong>Estándar</strong><p>Largo 60 cm · Ancho de 37 a 59 cm, se amolda al cuerpo</p></div></section>}
          {isWideRaw && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 7 ONZAS · CINTURA ELÁSTICA</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Cintura 60–95 cm · Cadera 110 cm · Largo 103 cm · Botapie 88 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Cintura 62–99 cm · Cadera 112 cm · Largo 105 cm · Botapie 90 cm</p></div></section>}
          {isClasp && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: DENIM 12 ONZAS · PRENDA UNISEX</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Largo 62 cm · Ancho 64 cm · Hombro 17 cm · Manga 54 cm</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 66 cm · Ancho 65 cm · Hombro 18 cm · Manga 56 cm</p></div></section>}
          {isKnot && <section className="product-specifications" aria-labelledby="spec-title"><h2 id="spec-title">Detalles y medidas</h2><p className="material-label">MATERIAL: FRANELA 20/1. CONTIENE REACTIVO, ANTIPEELING Y NO SE DEFORMA.</p><p className="material-label">Nudos de cordones de algodón.</p><h3>TALLAS Y MEDIDAS</h3><div className="measurement"><strong>Estándar</strong><p>Largo 57 cm · Ancho axila a axila 60 cm · Manga 55 cm (sin contar el hombro) · Hombro 18 cm · Cintura 60 cm regulable</p></div><div className="measurement"><strong>Talla L</strong><p>Largo 62 cm · Ancho axila a axila 63 cm · Manga 58 cm · Hombro 19 cm · Cintura 62 cm</p></div></section>}
        </section>
      </div>
      <section className="related-products" aria-labelledby="related-title">
        <div className="related-heading"><p className="eyebrow">Completa tu look</p><h2 id="related-title">También te podría gustar</h2></div>
        <div className="related-grid">{recommendations.map((item) => <a className="related-card" data-reveal href={productHref(item.name)} key={item.name}>
          <span className="related-image"><img src={item.image} alt={item.alt} loading="lazy" /></span>
          <span className="related-category">{item.category}</span><strong>{item.name}</strong><span className="related-price">{formatProductPrice(item.price || 145, currency, item.usdPrice)}</span>
        </a>)}</div>
      </section>
    </main>
    <StoreFooter />
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><ProductPage /></React.StrictMode>);
