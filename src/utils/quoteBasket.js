// Shared "pending quotes" basket, persisted to localStorage so pieces added on
// the standalone /wall-art and /sculpture gallery pages survive the jump to the
// home page's Contact section (they are separate page loads). The home site
// (App.jsx) and the gallery pages read/write the same key.

const KEY = "roj-quote-basket";

export function loadBasket() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveBasket(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.isArray(items) ? items : []));
  } catch {
    /* private-mode / quota — ignore */
  }
}

export function clearBasket() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
