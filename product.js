/* =========================================================
   SATYANAND'S LIMITED
   PRODUCT + STORE DATA
   Compatible with updated admin.html
   ========================================================= */

const SATYANANDS_DEFAULT_STORE = {
  settings: {
    businessName: "Satyanand's Limited",
    established: "Est. 2024",

    phone: "8687870821",
    displayPhone: "(868) 787-0821",

    email: "satyanandslimitedest.24@yahoo.com",
    instagram: "Satyanand's Limited",

    vatRate: 12.5,

    // Admin login password
    adminPassword: "SL2024"
  },

  products: [
    {
      id: "raksha-thread",
      name: "Plaited Raksha Thread",
      price: 12.44,
      tax: "taxable",
      image: "raksha-thread.png",
      active: true
    },

    {
      id: "ladoo",
      name: "Ladoo",
      price: 3,
      tax: "zero",
      active: true
    },

    {
      id: "gulab-jamun",
      name: "Gulab Jamun",
      price: 3,
      tax: "zero",
      active: true
    },

    {
      id: "milk-barfi",
      name: "Milk Barfi",
      price: 4.5,
      tax: "zero",
      active: true
    },

    {
      id: "hanuman-roat-banana",
      name: "Hanuman Roat - Banana",
      price: 8,
      tax: "zero",
      active: true
    },

    {
      id: "hanuman-roat-plain",
      name: "Hanuman Roat - Plain",
      price: 8,
      tax: "zero",
      active: true
    },

    {
      id: "sweet-rice",
      name: "Sweet Rice",
      price: 0,
      unit: "16 oz container",
      tax: "quote",
      active: true
    },

    {
      id: "flour-parsad",
      name: "Flour Parsad",
      price: 150,
      unit: "lb",
      tax: "zero",
      active: true
    }
  ],

  freeItems: [
    {
      id: "fresh-flowers",
      name: "Fresh Flowers",
      active: true
    },

    {
      id: "neem-leaf",
      name: "Neem Leaf",
      active: true
    },

    {
      id: "bay-leaf",
      name: "Bay Leaf",
      active: true
    }
  ],

  // Sales are kept separately in localStorage by the admin system.
  // This is included so older/newer versions remain compatible.
  sales: []
};


/* =========================================================
   SAFE STORE LOADING
   ========================================================= */

function SATYANANDS_LOAD() {
  const storageKey = "satyanandsStore";

  let saved = null;

  try {
    const raw = localStorage.getItem(storageKey);

    if (raw) {
      saved = JSON.parse(raw);
    }
  } catch (error) {
    console.warn("Could not read saved Satyanand's store data:", error);
  }

  /*
    If there is existing data, preserve it.
    We only add missing sections/fields.
    Nothing is deliberately reset or deleted.
  */

  if (saved && typeof saved === "object") {

    if (!saved.settings || typeof saved.settings !== "object") {
      saved.settings = {};
    }

    if (!Array.isArray(saved.products)) {
      saved.products = [];
    }

    if (!Array.isArray(saved.freeItems)) {
      saved.freeItems = [];
    }

    if (!Array.isArray(saved.sales)) {
      saved.sales = [];
    }

    // Add missing settings without replacing existing settings.
    Object.keys(SATYANANDS_DEFAULT_STORE.settings).forEach(function(key) {
      if (
        saved.settings[key] === undefined ||
        saved.settings[key] === null
      ) {
        saved.settings[key] =
          SATYANANDS_DEFAULT_STORE.settings[key];
      }
    });

    return saved;
  }


  /*
    No saved store exists yet.
    Create a fresh copy of the default store.
  */

  const freshStore = JSON.parse(
    JSON.stringify(SATYANANDS_DEFAULT_STORE)
  );

  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify(freshStore)
    );
  } catch (error) {
    console.warn("Could not save initial store data:", error);
  }

  return freshStore;
}


/* =========================================================
   SAVE STORE
   ========================================================= */

function SATYANANDS_SAVE(store) {
  try {
    localStorage.setItem(
      "satyanandsStore",
      JSON.stringify(store)
    );

    return true;
  } catch (error) {
    console.error("Could not save Satyanand's store:", error);
    return false;
  }
}


/* =========================================================
   MONEY FORMAT
   ========================================================= */

function SATYANANDS_MONEY(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "TT$0.00";
  }

  return "TT$" + number.toFixed(2);
}


/* =========================================================
   VAT CALCULATION
   ========================================================= */

function SATYANANDS_VAT_RATE(store) {
  const rate = Number(
    store &&
    store.settings &&
    store.settings.vatRate
  );

  return Number.isFinite(rate) ? rate : 0;
}


/*
  Returns VAT amount for a product.

  tax values:
  - taxable  = VAT applies
  - inclusive = price already includes VAT
  - zero     = zero-rated
  - quote     = price to be quoted
*/

function SATYANANDS_CALCULATE_VAT(
  product,
  quantity,
  store
) {
  if (!product) return 0;

  const qty = Number(quantity) || 0;
  const price = Number(product.price) || 0;

  if (product.tax === "zero") {
    return 0;
  }

  if (product.tax === "quote") {
    return 0;
  }

  const vatRate = SATYANANDS_VAT_RATE(store);

  if (product.tax === "inclusive") {
    return (
      price -
      price / (1 + vatRate / 100)
    ) * qty;
  }

  if (product.tax === "taxable") {
    return (
      price *
      qty *
      (vatRate / 100)
    );
  }

  return 0;
}


/* =========================================================
   PRODUCT TOTAL
   ========================================================= */

function SATYANANDS_PRODUCT_TOTAL(
  product,
  quantity
) {
  if (!product) return 0;

  const price = Number(product.price) || 0;
  const qty = Number(quantity) || 0;

  return price * qty;
}


/* =========================================================
   STORE DATA EXPORTS
   ========================================================= */

window.SATYANANDS_DEFAULT_STORE =
  SATYANANDS_DEFAULT_STORE;

window.SATYANANDS_LOAD =
  SATYANANDS_LOAD;

window.SATYANANDS_SAVE =
  SATYANANDS_SAVE;

window.SATYANANDS_MONEY =
  SATYANANDS_MONEY;

window.SATYANANDS_VAT_RATE =
  SATYANANDS_VAT_RATE;

window.SATYANANDS_CALCULATE_VAT =
  SATYANANDS_CALCULATE_VAT;

window.SATYANANDS_PRODUCT_TOTAL =
  SATYANANDS_PRODUCT_TOTAL;


/* =========================================================
   BACKWARD COMPATIBILITY
   ========================================================= */

window.loadStore = SATYANANDS_LOAD;
window.saveStore = SATYANANDS_SAVE;
window.money = SATYANANDS_MONEY;


/* =========================================================
   INITIALIZE STORE
   ========================================================= */

(function initializeSatyanandsStore() {
  const store = SATYANANDS_LOAD();

  /*
    Do not overwrite existing information.

    If an older version of product.js was used and the store
    already exists, its products, prices, VAT settings,
    zero-rated settings and sales remain untouched.
  */

  let changed = false;

  if (!store.settings) {
    store.settings = {};
    changed = true;
  }

  if (!Array.isArray(store.products)) {
    store.products = [];
    changed = true;
  }

  if (!Array.isArray(store.freeItems)) {
    store.freeItems = [];
    changed = true;
  }

  if (!Array.isArray(store.sales)) {
    store.sales = [];
    changed = true;
  }

  /*
    Make sure the fixed owner password exists.
    This does NOT delete any other store information.
  */

  if (
    !store.settings.adminPassword ||
    store.settings.adminPassword !== "SL2024"
  ) {
    store.settings.adminPassword = "SL2024";
    changed = true;
  }

  if (changed) {
    SATYANANDS_SAVE(store);
  }
})();
