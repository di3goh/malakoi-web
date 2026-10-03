export const USD_RATE = 0.27;
export const readCurrency = () => localStorage.getItem('malakoiCurrency') === 'USD' ? 'USD' : 'PEN';
export const formatPrice = (price, currency = 'PEN') => currency === 'USD'
  ? `$ ${(price * USD_RATE).toFixed(2)}`
  : `S/ ${price}.00`;
