/* MyStore - Brands page */
MyStorePage({
  title: "Brands",
  singular: "Brand",
  addLabel: "Add Brand",
  subtitle: "Manage the brands you sell.",
  storageKey: "mystore_brands_v1",
  perPage: 8,
  emptyIcon: "bi-tags",
  titleKey: "name",
  filterKey: "status",
  filterOptions: ["Active","Inactive"],
  seed: [{"id":1,"name":"Taiva Naturals","slug":"taiva-naturals","products":3,"status":"Active","featured":true},{"id":2,"name":"SoundMax","slug":"soundmax","products":2,"status":"Active","featured":false},{"id":3,"name":"FitPro","slug":"fitpro","products":2,"status":"Active","featured":false},{"id":4,"name":"Traveller","slug":"traveller","products":1,"status":"Inactive","featured":false}],
  columns: [{"key":"name","label":"Brand","type":"secondary"},{"key":"slug","label":"Slug"},{"key":"products","label":"Products"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Inactive":"badge-secondary"}},{"key":"featured","label":"Featured","type":"bool"}],
  fields: [{"key":"name","label":"Brand Name","required":true},{"key":"slug","label":"URL Slug"},{"key":"products","label":"Product Count","type":"number"},{"key":"status","label":"Status","type":"select","options":["Active","Inactive"]},{"key":"featured","label":"Featured Brand","type":"switch"}],
  stats: [
  { key: "total", label: "Total Brands", icon: "bi-tags", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "featured", label: "Featured", icon: "bi-star", tone: "orange", calc: (r) => r.filter((x) => x.featured).length },
  { key: "products", label: "Products Covered", icon: "bi-box-seam", tone: "purple", calc: (r) => r.reduce((s, x) => s + Number(x.products || 0), 0) }
  ]
});
