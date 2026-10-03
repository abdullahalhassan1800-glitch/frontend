/* MyStore - Inventory page */
MyStorePage({
  title: "Inventory",
  singular: "Stock Item",
  addLabel: "Add Stock Item",
  subtitle: "Stock levels across your warehouses.",
  storageKey: "mystore_inventory_v1",
  perPage: 8,
  emptyIcon: "bi-clipboard-data",
  titleKey: "product",
  filterKey: "status",
  filterOptions: ["Healthy","Low","Out of Stock"],
  seed: [{"id":1,"product":"SUGAR PRO MAX","sku":"SUG-PM-01","stock":42,"reorder":10,"warehouse":"Mumbai","status":"Healthy"},{"id":2,"product":"Wireless Headphones","sku":"WH-100-BLK","stock":0,"reorder":5,"warehouse":"Delhi","status":"Out of Stock"},{"id":3,"product":"Running Shoes","sku":"RS-09-GRY","stock":4,"reorder":8,"warehouse":"Mumbai","status":"Low"},{"id":4,"product":"Travel Backpack","sku":"TB-40-NVY","stock":18,"reorder":6,"warehouse":"Bengaluru","status":"Healthy"}],
  columns: [{"key":"product","label":"Product","type":"secondary"},{"key":"sku","label":"SKU"},{"key":"stock","label":"In Stock"},{"key":"reorder","label":"Reorder Level"},{"key":"warehouse","label":"Warehouse"},{"key":"status","label":"Status","type":"badge","map":{"Healthy":"badge-success","Low":"badge-warning","Out of Stock":"badge-danger"}}],
  fields: [{"key":"product","label":"Product Name","required":true},{"key":"sku","label":"SKU"},{"key":"stock","label":"Stock Quantity","type":"number"},{"key":"reorder","label":"Reorder Level","type":"number"},{"key":"warehouse","label":"Warehouse","type":"select","options":["Mumbai","Delhi","Bengaluru","Chennai"]},{"key":"status","label":"Status","type":"select","options":["Healthy","Low","Out of Stock"]}],
  stats: [
  { key: "total", label: "Tracked Items", icon: "bi-clipboard-data", tone: "blue", calc: (r) => r.length },
  { key: "healthy", label: "Healthy", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Healthy').length },
  { key: "low", label: "Low Stock", icon: "bi-exclamation-triangle", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Low').length },
  { key: "units", label: "Total Units", icon: "bi-box-seam", tone: "purple", calc: (r) => r.reduce((s, x) => s + Number(x.stock || 0), 0) }
  ]
});
