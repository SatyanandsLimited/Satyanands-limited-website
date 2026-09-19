const DEFAULT_STORE = {
  settings: {
    vatRate: 12.5,
    currency: "TT$",
    adminPassword: "SL2024!"
  },

  products: [
    {
      id: "ladoo",
      name: "Ladoo",
      price: 3.00,
      tax: "taxable",
      unit: "pc",
      active: true
    },
    {
      id: "gulab-jamun",
      name: "Gulab Jamun",
      price: 3.00,
      tax: "taxable",
      unit: "pc",
      active: true
    },
    {
      id: "milk-barfi",
      name: "Milk Barfi",
      price: 4.50,
      tax: "taxable",
      unit: "pc",
      active: true
    },
    {
      id: "hanuman-roat",
      name: "Hanuman Roat",
      price: 8.00,
      tax: "taxable",
      unit: "pc",
      active: true
    },
    {
      id: "hanuman-roat-banana",
      name: "Hanuman Roat with Banana",
      price: 8.00,
      tax: "taxable",
      unit: "pc",
      active: true
    },
    {
      id: "sweet-rice",
      name: "Sweet Rice",
      price: 0,
      tax: "quote",
      unit: "16 oz container",
      active: true
    },
    {
      id: "flour-parsad",
      name: "Flour Parsad",
      price: 150.00,
      tax: "taxable",
      unit: "lb",
      active: true
    },
    {
      id: "raksha-thread",
      name: "Plaited Raksha Thread",
      price: 14.00,
      tax: "inclusive",
      unit: "pc",
      active: true
    }
  ],

  sales: [],

  freeItems: [
    {
      name: "Fresh Flowers",
      description: "Free"
    },
    {
      name: "Neem Leaf",
      description: "Free"
    },
    {
      name: "Bay Leaf",
      description: "Free"
    }
  ]
};


function SATYANANDS_LOAD() {
  try {
    const saved = localStorage.getItem("satyanandsStore");

    if (!saved) {
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }

    const store = JSON.parse(saved);

    if (!store.settings) {
      store.settings = {};
    }

    if (!Array.isArray(store.products)) {
      store.products = [];
    }

    if (!Array.isArray(store.sales)) {
      store.sales = [];
    }

    if (!Array.isArray(store.freeItems)) {
      store.freeItems = [];
    }

    if (store.settings.vatRate == null) {
      store.settings.vatRate = 12.5;
    }

    if (!store.settings.currency) {
      store.settings.currency = "TT$";
    }

    return store;

  } catch (error) {
    console.error("Could not load Satyanand's store:", error);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
}


function SATYANANDS_SAVE(store) {
  localStorage.setItem(
    "satyanandsStore",
    JSON.stringify(store)
  );
}


function ensureSales(store) {
  if (!Array.isArray(store.sales)) {
    store.sales = [];
  }

  return store;
}


/*
  Calculate the tax information for one product.

  taxable:
    Amount before VAT.

  vat:
    VAT amount.

  zeroRated:
    Amount treated as zero-rated.

  total:
    Final amount paid.
*/
function calculateProductTax(product, quantity, vatRate) {

  quantity = Number(quantity) || 0;

  const price = Number(product.price) || 0;

  const lineTotal = price * quantity;

  let taxable = 0;
  let vat = 0;
  let zeroRated = 0;

  if (product.tax === "inclusive") {

    taxable = lineTotal / (1 + vatRate / 100);

    vat = lineTotal - taxable;

  } else if (product.tax === "taxable") {

    taxable = lineTotal;

    vat = taxable * vatRate / 100;

  } else if (
    product.tax === "zero" ||
    product.tax === "zero-rated"
  ) {

    zeroRated = lineTotal;

  } else if (product.tax === "quote") {

    taxable = 0;
    vat = 0;
    zeroRated = 0;
  }

  return {
    lineTotal: Number(lineTotal.toFixed(2)),
    taxable: Number(taxable.toFixed(2)),
    vat: Number(vat.toFixed(2)),
    zeroRated: Number(zeroRated.toFixed(2)),
    total: Number((taxable + vat + zeroRated).toFixed(2))
  };
}


/*
  Create a complete sales record.

  This is used by the website when an order is submitted.
*/
function createSaleRecord(customerName, phone, orderItems, status = "order-sent") {

  const store = ensureSales(SATYANANDS_LOAD());

  let taxable = 0;
  let vat = 0;
  let zeroRated = 0;

  const items = [];

  orderItems.forEach(item => {

    const product = store.products.find(
      p => p.id === item.productId
    );

    if (!product) {
      return;
    }

    const quantity = Number(item.quantity) || 0;

    if (quantity <= 0) {
      return;
    }

    const calculation = calculateProductTax(
      product,
      quantity,
      Number(store.settings.vatRate) || 12.5
    );

    taxable += calculation.taxable;
    vat += calculation.vat;
    zeroRated += calculation.zeroRated;

    items.push({
      productId: product.id,
      name: product.name,
      quantity: quantity,
      unitPrice: product.price,
      taxType: product.tax,
      lineTotal: calculation.lineTotal,
      taxable: calculation.taxable,
      vat: calculation.vat,
      zeroRated: calculation.zeroRated
    });
  });


  const total =
    taxable +
    vat +
    zeroRated;


  const sale = {

    id: "sale-" + Date.now(),

    date: new Date().toISOString(),

    status: status,

    customerName: customerName || "",

    phone: phone || "",

    items: items,

    taxable: Number(taxable.toFixed(2)),

    vat: Number(vat.toFixed(2)),

    zeroRated: Number(zeroRated.toFixed(2)),

    total: Number(total.toFixed(2))
  };


  store.sales.push(sale);

  SATYANANDS_SAVE(store);

  return sale;
}


/*
  Get sales for a selected date range.
*/
function getSalesReport(fromDate = "", toDate = "", status = "all") {

  const store = ensureSales(SATYANANDS_LOAD());

  return store.sales.filter(sale => {

    const saleDate = String(sale.date || "").slice(0, 10);

    const dateOK =
      (!fromDate || saleDate >= fromDate) &&
      (!toDate || saleDate <= toDate);

    const statusOK =
      status === "all" ||
      sale.status === status;

    return dateOK && statusOK;
  });
}


/*
  Create the totals used by the VAT and
  zero-rated reports.
*/
function calculateReportTotals(sales) {

  let taxable = 0;
  let vat = 0;
  let zeroRated = 0;
  let total = 0;

  sales.forEach(sale => {

    taxable += Number(sale.taxable) || 0;

    vat += Number(sale.vat) || 0;

    zeroRated += Number(sale.zeroRated) || 0;

    total += Number(sale.total) || 0;
  });


  return {

    taxable: Number(taxable.toFixed(2)),

    vat: Number(vat.toFixed(2)),

    zeroRated: Number(zeroRated.toFixed(2)),

    total: Number(total.toFixed(2))
  };
}


/*
  Change an order from "order-sent"
  to "completed".
*/
function markSaleCompleted(saleId) {

  const store = ensureSales(SATYANANDS_LOAD());

  const sale = store.sales.find(
    s => s.id === saleId
  );

  if (!sale) {
    return false;
  }

  sale.status = "completed";

  SATYANANDS_SAVE(store);

  return true;
}


/*
  Delete one sales record.
*/
function deleteSaleRecord(saleId) {

  const store = ensureSales(SATYANANDS_LOAD());

  store.sales = store.sales.filter(
    s => s.id !== saleId
  );

  SATYANANDS_SAVE(store);
}


/*
  Export sales records as JSON.
*/
function exportSalesData() {

  const store = ensureSales(SATYANANDS_LOAD());

  const data = {
    business: "Satyanand's Limited",
    vatRate: store.settings.vatRate,
    exported: new Date().toISOString(),
    sales: store.sales
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "satyanands-sales-report.json";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


/*
  Import previously exported sales.
*/
function importSalesData(file, callback) {

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {

    try {

      const data = JSON.parse(reader.result);

      if (!Array.isArray(data.sales)) {
        throw new Error("Invalid sales file");
      }

      const store = ensureSales(SATYANANDS_LOAD());

      const existingIDs = new Set(
        store.sales.map(s => s.id)
      );

      data.sales.forEach(sale => {

        if (!existingIDs.has(sale.id)) {
          store.sales.push(sale);
        }
      });

      SATYANANDS_SAVE(store);

      if (typeof callback === "function") {
        callback(true);
      }

    } catch (error) {

      console.error(
        "Could not import sales:",
        error
      );

      if (typeof callback === "function") {
        callback(false);
      }
    }
  };

  reader.readAsText(file);
}


/*
  Return only active products.
*/
function activeProducts() {

  const store = SATYANANDS_LOAD();

  return store.products.filter(
    product => product.active !== false
  );
        }
