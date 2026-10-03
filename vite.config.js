import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'index.html'),
        catalogo: resolve(process.cwd(), 'catalogo.html'),
        producto: resolve(process.cwd(), 'producto.html'),
        contacto: resolve(process.cwd(), 'contacto.html'),
        carrito: resolve(process.cwd(), 'carrito.html'),
      },
    },
  },
});
