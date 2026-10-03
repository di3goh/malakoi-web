import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, ChevronDown, ChevronRight, Heart, X } from 'lucide-react';
import StoreHeader from './components/StoreHeader.jsx';
import StoreFooter from './components/StoreFooter.jsx';
import useScrollReveal from './useScrollReveal.js';
import { products, lowerProducts } from './data/products.js';
import { formatPrice, readCurrency } from './data/currency.js';
import './styles.css';
import './catalog.css';

const allProducts = [...products, ...lowerProducts];
const productHref = (name) => name === 'KIMONO JACKET' ? '/kimono-jacket.html' : `/producto.html?item=${encodeURIComponent(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))}`;
const filters = [
  ['all', 'Todas las prendas'], ['CHAQUETAS', 'Chaquetas'], ['DENIM', 'Denim'],
  ['PANTALONES', 'Pantalones'], ['CAMISAS', 'Camisas'], ['BÁSICOS', 'Tops'], ['POLOS', 'Polos'],
];

function Catalog() {
  useScrollReveal();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currency, setCurrency] = useState(readCurrency);
  const setStoreCurrency = (value) => { setCurrency(value); localStorage.setItem('malakoiCurrency', value); };

  const visibleProducts = useMemo(() => {
    const list = allProducts.filter((product) => (category === 'all' || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'newest') list.reverse();
    return list;
  }, [category, sort, query]);

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const addToBag = () => {
    if (!selected) return;
    const bag = JSON.parse(localStorage.getItem('malakoiBag') || '[]');
    bag.push({ name: selected.name, price: `S/ ${selected.price || 145}.00`, image: selected.image });
    localStorage.setItem('malakoiBag', JSON.stringify(bag));
    setSelected(null);
  };
  const toggleSaved = (name) => setSaved((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return <>
    <StoreHeader active="catalog" />
    <main className="catalog-main">
      <div className="catalog-breadcrumb"><a href="/">Inicio</a><ChevronRight size={14} aria-hidden="true" /><span>Catálogo</span></div>
      <section className="catalog-intro" aria-labelledby="catalog-title">
        <div><h1 id="catalog-title">Catálogo</h1><p className="catalog-subtitle">Prendas para moverte y vestir a tu manera.</p></div>
        <label className="sort-control"><span>Ordenar por</span><span className="select-wrap"><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar productos"><option value="featured">Recomendados</option><option value="newest">Más recientes</option><option value="az">Nombre A–Z</option></select><ChevronDown size={15} aria-hidden="true" /></span></label>
      </section>
      <section className="catalog-tools" aria-label="Filtrar catálogo">
        <div className="filter-row">{filters.map(([value, label]) => <button key={value} type="button" className={`catalog-filter ${category === value ? 'active' : ''}`} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div>
        <label className="catalog-search"><input aria-label="Buscar por nombre de prenda" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar…" /></label>
      </section>
      <div className="catalog-results"><p>{visibleProducts.length} prendas</p><div className="catalog-price-tools"><label htmlFor="catalog-currency">Moneda</label><select id="catalog-currency" value={currency} onChange={(event) => setStoreCurrency(event.target.value)} aria-label="Elegir moneda"><option value="PEN">PEN · S/</option><option value="USD">USD · $</option></select><span className="currency-note">USD referencial</span></div></div>
      <section className="product-grid catalog-product-grid" aria-label="Productos del catálogo">
        {visibleProducts.map((product) => <article className="product-card catalog-product-card" data-reveal key={product.name} role="link" tabIndex={0} onClick={(event) => { if (!event.target.closest('button')) window.location.href = productHref(product.name); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.location.href = productHref(product.name); } }}>
          <div className="product-image catalog-image-button"><img src={product.image} alt={product.alt} loading="lazy" /></div>
          <button className={`save-button ${saved.includes(product.name) ? 'is-saved' : ''}`} type="button" aria-label={`${saved.includes(product.name) ? 'Quitar de' : 'Añadir a'} favoritos: ${product.name}`} aria-pressed={saved.includes(product.name)} onClick={() => toggleSaved(product.name)}><Heart size={18} fill={saved.includes(product.name) ? 'currentColor' : 'none'} /></button>
          <div className="product-info"><p className="product-category">{product.category}</p><h2>{product.name}</h2><div className="product-bottom"><div className="swatches" aria-label={`Colores disponibles para ${product.name}`}>{product.colors.map((color) => <span className="swatch" key={color.name} title={color.name} aria-label={color.name} style={{ '--swatch': color.value }} />)}</div><span className="price">{formatPrice(product.price || 145, currency)}</span></div></div>
        </article>)}
        {visibleProducts.length === 0 && <p className="catalog-empty">No encontramos prendas con ese nombre.</p>}
      </section>
    </main>
    <StoreFooter />
    {selected && <div className="catalog-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="catalog-modal-close" type="button" aria-label="Cerrar detalles" onClick={() => setSelected(null)}><X /></button><img src={selected.image} alt={selected.alt} /><div className="catalog-modal-copy"><p className="eyebrow">{selected.category}</p><h2 id="modal-title">{selected.name}</h2><p>Una prenda Malakoi para acompañarte temporada tras temporada.</p><strong>{formatPrice(selected.price || 145, currency)}</strong><button className="catalog-add-button" type="button" onClick={addToBag}>Añadir a la bolsa <ArrowRight size={16} /></button></div></section></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Catalog /></React.StrictMode>);
