export const products = [
  { name: 'KIMONO JACKET', category: 'CHAQUETAS', image: '/1.png', alt: 'Chaqueta Kimono negra de corte amplio', colors: [{ name: 'Negro', value: '#171717' }, { name: 'Hueso', value: '#e5ded0' }, { name: 'Oliva', value: '#676b50' }] },
  { name: 'J-JACKET', category: 'ESENCIALES', image: '/2.png', alt: 'Chaqueta J negra de estilo urbano', colors: [{ name: 'Negro', value: '#171717' }, { name: 'Gris', value: '#aaa9a4' }, { name: 'Oliva', value: '#676b50' }, { name: 'Vino', value: '#673c43' }] },
  { name: 'MORI DENIM JACKET', category: 'DENIM', image: '/3.png', alt: 'Chaqueta denim azul Mori', colors: [{ name: 'Azul lavado', value: '#546579' }, { name: 'Índigo', value: '#28394d' }, { name: 'Negro', value: '#252525' }] },
  { name: 'KNOT ZIP-UP JACKET', category: 'CAPAS LIGERAS', image: '/4.png', alt: 'Chaqueta ligera con cierre frontal', colors: [{ name: 'Gris', value: '#aaa9a4' }, { name: 'Negro', value: '#171717' }, { name: 'Hueso', value: '#e5ded0' }] },
];

export const lowerProducts = [
  { ...products[0], name: 'PARACHUTE JOGGER', category: 'PANTALONES', image: '/assets/images/parachute.png', alt: 'Parachute jogger gris de pierna amplia' },
  { ...products[1], name: 'CAMISA LOTUS', category: 'CAMISAS', image: '/assets/images/lotus.png', alt: 'Camisa Lotus negra con cierres orientales' },
  { ...products[2], name: 'CLASP JACKET', category: 'CHAQUETAS', image: '/assets/images/clasp-jacket.png', alt: 'Clasp Jacket negra con cierres metálicos' },
  { ...products[3], name: 'KIMONO V3', category: 'CHAQUETAS', image: '/assets/images/kimono-v3.png', alt: 'Kimono V3 negro de manga amplia' },
  { ...products[0], name: 'BASIC TANK TOP', category: 'BÁSICOS', image: '/assets/images/basic-tank-top.png', alt: 'Basic Tank Top Malakoi en cuatro colores' },
  { ...products[1], name: 'POLO 3/4', category: 'POLOS', image: '/assets/images/polo-34.png', alt: 'Polos Malakoi de manga tres cuartos' },
  { ...products[2], name: 'WIDE RAW DENIM PANTS', category: 'DENIM', image: '/assets/images/wide-raw.png', alt: 'Pantalón Wide Raw Denim negro de pierna amplia' },
  { ...products[3], name: 'WIDE BAGGY CORDUROY', category: 'PANTALONES', image: '/assets/images/wide-baggy.png', alt: 'Pantalón Wide Baggy de pana color café' },
];
