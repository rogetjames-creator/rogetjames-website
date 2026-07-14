const PC_KEY = "roj_postcode";

export const loadPostcode = () => { try { const s = localStorage.getItem(PC_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
export const savePostcode = (info) => { try { localStorage.setItem(PC_KEY, JSON.stringify(info)); } catch { /* private mode / quota — non-fatal */ } };
