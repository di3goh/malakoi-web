export const BAG_UPDATED_EVENT = 'malakoi:bag-updated';

export function readBag() {
  try {
    const bag = JSON.parse(localStorage.getItem('malakoiBag') || '[]');
    return Array.isArray(bag) ? bag : [];
  } catch {
    return [];
  }
}

export function addBagItem(item) {
  const bag = [...readBag(), item];
  localStorage.setItem('malakoiBag', JSON.stringify(bag));
  window.dispatchEvent(new CustomEvent(BAG_UPDATED_EVENT, { detail: { item } }));
  return bag;
}

export function removeBagItem(index) {
  const bag = readBag();
  if (index < 0 || index >= bag.length) return bag;
  bag.splice(index, 1);
  localStorage.setItem('malakoiBag', JSON.stringify(bag));
  window.dispatchEvent(new CustomEvent(BAG_UPDATED_EVENT, { detail: { removed: true } }));
  return bag;
}
