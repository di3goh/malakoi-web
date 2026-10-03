import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { products, lowerProducts } from './src/data/products.js';

const siteUrl = 'https://malakoi.web-vercel.app';
const allProducts = [...products, ...lowerProducts];
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

function productPage(html, product, canonicalUrl) {
  const title = `${product.name} · Malakoi`;
  const description = `${product.description || product.alt} Precio: S/ ${product.price || 145}.`;
  const imagePath = product.colors.find((color) => color.image)?.image || product.detailImage || product.image;
  const imageUrl = new URL(imagePath, `${siteUrl}/`).href;
  const setMeta = (source, key, value, content) => source.replace(new RegExp(`<meta\\s+${key}="${value}"\\s+content="[^"]*"\\s*\\/>`), `<meta ${key}="${value}" content="${escapeHtml(content)}" />`);
  let output = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="robots"[^>]*\/>\s*/g, '')
    .replace(/<link\s+rel="canonical"[^>]*\/>\s*/g, '');
  output = setMeta(output, 'name', 'description', description);
  output = setMeta(output, 'property', 'og:type', 'product');
  output = setMeta(output, 'property', 'og:url', canonicalUrl);
  output = setMeta(output, 'property', 'og:title', title);
  output = setMeta(output, 'property', 'og:description', description);
  output = setMeta(output, 'property', 'og:image', imageUrl);
  output = setMeta(output, 'property', 'og:image:secure_url', imageUrl);
  output = setMeta(output, 'property', 'og:image:type', 'image/jpeg');
  output = setMeta(output, 'property', 'og:image:alt', product.alt);
  output = output.replace(/<meta\s+property="og:image:(?:width|height)"[^>]*\/>\s*/g, '');
  output = setMeta(output, 'name', 'twitter:title', title);
  output = setMeta(output, 'name', 'twitter:description', description);
  output = setMeta(output, 'name', 'twitter:image', imageUrl);
  output = setMeta(output, 'property', 'product:price:amount', String(product.price || 145));
  output = setMeta(output, 'property', 'product:price:currency', 'PEN');
  const canonical = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description,
    image: imageUrl,
    brand: { '@type': 'Brand', name: 'Malakoi' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PEN',
      price: String(product.price || 145),
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
    },
  };
  return output.replace('</head>', `${canonical}\n    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>\n  </head>`);
}

function productSeoRoutes() {
  return {
    name: 'malakoi-product-seo-routes',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://localhost').pathname;
        const match = pathname.match(/^\/producto-([a-z0-9-]+)\.html$/);
        if (!match) return next();
        const product = allProducts.find((item) => slugify(item.name) === match[1]);
        if (!product) return next();
        try {
          const template = await readFile(resolve(process.cwd(), 'producto.html'), 'utf8');
          const html = await server.transformIndexHtml(request.url, productPage(template, product, `${siteUrl}${pathname}`));
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
    generateBundle(_options, bundle) {
      const productTemplate = bundle['producto.html'];
      if (!productTemplate || productTemplate.type !== 'asset') return;
      const template = String(productTemplate.source);
      allProducts.forEach((product) => {
        const fileName = product.name === 'KIMONO JACKET' ? 'kimono-jacket.html' : `producto-${slugify(product.name)}.html`;
        const canonicalUrl = `${siteUrl}/${fileName}`;
        const source = productPage(template, product, canonicalUrl);
        if (fileName === 'kimono-jacket.html') {
          const existing = bundle[fileName];
          if (existing?.type === 'asset') existing.source = source;
        } else {
          this.emitFile({ type: 'asset', fileName, source });
        }
      });
      const urls = [
        `${siteUrl}/`,
        `${siteUrl}/catalogo.html`,
        `${siteUrl}/contacto.html`,
        ...allProducts.map((product) => `${siteUrl}/${product.name === 'KIMONO JACKET' ? 'kimono-jacket.html' : `producto-${slugify(product.name)}.html`}`),
      ];
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /carrito.html\nDisallow: /producto.html\nSitemap: ${siteUrl}/sitemap.xml\n` });
    },
  };
}

export default defineConfig({
  plugins: [productSeoRoutes()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'index.html'),
        catalogo: resolve(process.cwd(), 'catalogo.html'),
        producto: resolve(process.cwd(), 'producto.html'),
        kimono: resolve(process.cwd(), 'kimono-jacket.html'),
        preguntas: resolve(process.cwd(), 'contacto.html'),
        carrito: resolve(process.cwd(), 'carrito.html'),
      },
    },
  },
});
