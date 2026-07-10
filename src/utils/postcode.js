const PC_KEY = "roj_postcode";

export const loadPostcode = () => { try { const s = localStorage.getItem(PC_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
export const savePostcode = (info) => localStorage.setItem(PC_KEY, JSON.stringify(info));
