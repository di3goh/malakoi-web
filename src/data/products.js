export const products = [
  { name: 'KIMONO JACKET', category: 'CHAQUETAS', image: '/assets/images/kimono-jacket-black.png', alt: 'Kimono Jacket negra de denim raw con bolsillos amplios', price: 145, description: 'Chaqueta unisex de raw denim, con corte amplio y cierre frontal de broches.', sizes: ['Estándar', 'L'], measurements: 'Estándar: largo 60 cm · ancho 63 cm. Talla L: largo 65 cm · ancho 64 cm.', colors: [{ name: 'Negro', value: '#171717', image: '/assets/images/kimono-jacket-black.png' }, { name: 'Azul', value: '#334967', image: '/assets/images/kimono-jacket-black.png' }] },
  { name: 'J-JACKET', category: 'ESENCIALES', image: '/2.png', alt: 'Chaqueta J negra de estilo urbano', colors: [{ name: 'Negro', value: '#171717' }, { name: 'Gris', value: '#aaa9a4' }, { name: 'Oliva', value: '#676b50' }, { name: 'Vino', value: '#673c43' }] },
  { name: 'MORI DENIM JACKET', category: 'DENIM', image: '/3.png', alt: 'Chaqueta denim azul Mori', colors: [{ name: 'Azul', value: '#546579', image: '/assets/images/mori-denim-azul.png' }, { name: 'Pure Black', value: '#252525', image: '/assets/images/mori-denim-black.png' }, { name: 'Verde Sage', value: '#858873', image: '/assets/images/mori-denim-sage.png' }] },
  { name: 'KNOT ZIP-UP JACKET', category: 'CAPAS LIGERAS', image: '/4.png', alt: 'Chaqueta Knot Zip-Up con nudos de cordones', price: 130, colors: [{ name: 'VOID · Negro', value: '#292a2d', image: '/assets/images/knot-void.png' }, { name: 'FROST · Agatha', value: '#d8d9d8', image: '/assets/images/knot-frost.png' }, { name: 'CHERRY · Rojo', value: '#991c32', image: '/assets/images/knot-cherry.png' }] },
];

export const lowerProducts = [
  { ...products[0], name: 'PARACHUTE JOGGER', category: 'PANTALONES', image: '/assets/images/parachute.png', alt: 'Parachute jogger gris de pierna amplia' },
  { ...products[1], name: 'CAMISA LOTUS', category: 'CAMISAS', image: '/assets/images/lotus.png', alt: 'Camisa Lotus negra con botones chinos', price: 125, description: 'Denim de 5 onzas con botones chinos hechos de cordón elástico. Camisa de corte boxy.', sizes: ['Estándar'], measurements: 'Largo 61 cm · Ancho 60 cm', colors: [{ name: 'Negro', value: '#252528', image: '/assets/images/lotus.png' }, { name: 'Azul', value: '#334967', image: '/assets/images/lotus-azul.png' }] },
  { ...products[2], name: 'CLASP JACKET', category: 'CHAQUETAS', image: '/assets/images/clasp-jacket.png', alt: 'Clasp Jacket negra con cierres metÃ¡licos' },
  { ...products[3], name: 'KIMONO V3', category: 'CHAQUETAS', image: '/assets/images/kimono-v3.png', alt: 'Kimono V3 negro de manga amplia' },
  { ...products[0], name: 'BASIC TANK TOP', category: 'BÃSICOS', image: '/assets/images/basic-tank-top.png', alt: 'Basic Tank Top Malakoi en cuatro colores' },
  { ...products[1], name: 'POLO 3/4', category: 'POLOS', image: '/assets/images/polo-34.png', alt: 'Polos Malakoi de manga tres cuartos' },
  { ...products[2], name: 'WIDE RAW DENIM PANTS', category: 'DENIM', image: '/assets/images/wide-raw.png', alt: 'PantalÃ³n Wide Raw Denim negro de pierna amplia' },
  { ...products[3], name: 'WIDE BAGGY CORDUROY', category: 'PANTALONES', image: '/assets/images/wide-baggy.png', alt: 'PantalÃ³n Wide Baggy de pana color cafÃ©' },
];
