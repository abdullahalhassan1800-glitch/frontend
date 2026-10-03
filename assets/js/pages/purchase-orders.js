/* MyStore - Purchase Orders page */
MyStorePage({
  title: "Purchase Orders",
  singular: "Purchase Order",
  addLabel: "Create Purchase Order",
  subtitle: "Restock inventory from your suppliers.",
  storageKey: "mystore_purchaseorders_v1",
  perPage: 8,
  emptyIcon: "bi-bag-check",
  titleKey: "supplier",
  filterKey: "status",
  filterOptions: ["Open","Received","Cancelled"],
  seed: [{"id":1,"supplier":"Taiva Naturals LLP","items":4,"total":42000,"expected":"2026-10-08","status":"Open"},{"id":2,"supplier":"SoundMax Distributors","items":2,"total":18500,"expected":"2026-10-05","status":"Received"},{"id":3,"supplier":"FitPro India","items":6,"total":31200,"expected":"2026-10-12","status":"Open"}],
  columns: [{"key":"supplier","label":"Supplier","type":"secondary"},{"key":"items","label":"Items"},{"key":"total","label":"Total","type":"money"},{"key":"expected","label":"Expected"},{"key":"status","label":"Status","type":"badge","map":{"Open":"badge-warning","Received":"badge-success","Cancelled":"badge-danger"}}],
  fields: [{"key":"supplier","label":"Supplier","required":true},{"key":"items","label":"Line Items","type":"number"},{"key":"total","label":"Total Amount","type":"number"},{"key":"expected","label":"Expected Date","placeholder":"YYYY-MM-DD"},{"key":"status","label":"Status","type":"select","options":["Open","Received","Cancelled"]}],
  stats: [
  { key: "total", label: "Total POs", icon: "bi-bag-check", tone: "blue", calc: (r) => r.length },
  { key: "open", label: "Open", icon: "bi-hourglass-split", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Open').length },
  { key: "received", label: "Received", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Received').length },
  { key: "value", label: "Committed Value", icon: "bi-currency-rupee", tone: "purple", calc: (r) => '₹' + r.filter((x) => x.status !== 'Cancelled').reduce((s, x) => s + Number(x.total || 0), 0).toLocaleString('en-IN') }
  ]
});
