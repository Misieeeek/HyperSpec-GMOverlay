export function save(storageKey, data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export function load(storageKey) {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
}

export function clear(storageKey) {
  localStorage.removeItem(storageKey);
}

