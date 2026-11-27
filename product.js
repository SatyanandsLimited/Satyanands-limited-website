const DEFAULT_STORE = {
  businessName: "Satyanand's Limited",
  currency: "TTD",
  vatRate: 12.5,
  products: [
    { id: "raksha-thread", name: "Plaited Raksha Thread", price: 14, unit: "pc", tax: "inclusive", active: true },
    { id: "gulab-jamun", name: "Gulab Jamun", price: 3, unit: "pc", tax: "zero", active: true },
    { id: "ladoo", name: "Ladoo", price: 3, unit: "pc", tax: "zero", active: true },
    { id: "milk-barfi", name: "Milk Barfi", price: 4.5, unit: "pc", tax: "zero", active: true },
    { id: "hanuman-roat", name: "Hanuman Roat", price: 8, unit: "pc", tax: "zero", active: true },
    { id: "sweet-rice", name: "Sweet Rice", price: 0, unit: "container", tax: "quote", active: true },
    { id: "flour-parsad", name: "Flour Parsad", price: 150, unit: "lb", tax: "zero", active: true }
  ]
};

function loadStore() {
  try {
    const saved = localStorage.getItem("satyanands_store");
    if (!saved) return structuredClone(DEFAULT_STORE);
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(DEFAULT_STORE),
      ...parsed,
      products: Array.isArray(parsed.products) ? parsed.products : structuredClone(DEFAULT_STORE.products)
    };
  } catch (error) {
    console.error("Could not load store settings:", error);
    return structuredClone(DEFAULT_STORE);
  }
}

function saveStore(storeData) {
  try {
    localStorage.setItem("satyanands_store", JSON.stringify(storeData));
    return true;
  } catch (error) {
    console.error("Could not save store settings:", error);
    return false;
  }
}

function money(value) {
  return new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: "TTD",
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
}

window.SATYANANDS_DEFAULT_STORE = DEFAULT_STORE;
window.SATYANANDS_LOAD = loadStore;
window.SATYANANDS_SAVE = saveStore;
window.SATYANANDS_MONEY = money;
