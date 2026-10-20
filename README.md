# Malakoi Storefront

Sitio de comercio electrónico de Malakoi, construido con React y Vite como una aplicación multipágina y desplegado en Vercel.

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo

```bash
npm ci
npm run dev
```

Vite muestra la URL local en la terminal.

## Build y preview

```bash
npm run build
npm run preview
```

La compilación genera `dist/`. Es un directorio generado y no debe versionarse; Vercel lo reconstruye a partir del código fuente.

## Estructura

- `src/`: aplicación React, estilos, componentes y datos de productos.
- `src/components/`: componentes compartidos, como header y footer.
- `src/data/`: catálogo y utilidades de moneda.
- `public/`: recursos estáticos publicados con sus rutas conservadas, incluidas imágenes y favicon.
- `assets/source-images/`: imágenes originales de referencia; no son necesarias para la compilación.
- `index.html`, `catalogo.html`, `producto.html`, `carrito.html`, `contacto.html`: entradas multipágina de Vite.
- `vite.config.js`: entradas de compilación y generación de páginas SEO para productos.

## Rutas principales

- `/` — portada
- `/catalogo.html` — catálogo
- `/producto.html` — plantilla de producto
- `/carrito.html` — carrito
- `/contacto.html` — preguntas y contacto

Vite genera además las páginas individuales de producto durante el build.

## Despliegue

La configuración de Vercel usa `npm run build` y publica `dist/`. Mantén el código fuente y `package-lock.json` en Git; no subas `node_modules/` ni el resultado generado.
