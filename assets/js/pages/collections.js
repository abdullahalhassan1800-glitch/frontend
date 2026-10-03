/* MyStore - Collections page */
MyStorePage({
  title: "Collections",
  singular: "Collection",
  addLabel: "Add Collection",
  subtitle: "Group products into curated collections.",
  storageKey: "mystore_collections_v1",
  perPage: 8,
  emptyIcon: "bi-layers",
  titleKey: "name",
  filterKey: "status",
  filterOptions: ["Active","Inactive"],
  seed: [{"id":1,"name":"Festive Sale","slug":"festive-sale","products":8,"status":"Active","featured":true},{"id":2,"name":"New Arrivals","slug":"new-arrivals","products":5,"status":"Active","featured":true},{"id":3,"name":"Best Sellers","slug":"best-sellers","products":6,"status":"Active","featured":false},{"id":4,"name":"Clearance","slug":"clearance","products":2,"status":"Inactive","featured":false}],
  columns: [{"key":"name","label":"Collection","type":"secondary"},{"key":"slug","label":"Slug"},{"key":"products","label":"Products"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Inactive":"badge-secondary"}},{"key":"featured","label":"Featured","type":"bool"}],
  fields: [{"key":"name","label":"Collection Name","required":true},{"key":"slug","label":"URL Slug"},{"key":"products","label":"Product Count","type":"number"},{"key":"status","label":"Status","type":"select","options":["Active","Inactive"]},{"key":"featured","label":"Featured","type":"switch"}],
  stats: [
  { key: "total", label: "Total Collections", icon: "bi-layers", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "featured", label: "Featured", icon: "bi-star", tone: "orange", calc: (r) => r.filter((x) => x.featured).length },
  { key: "products", label: "Products Grouped", icon: "bi-box-seam", tone: "purple", calc: (r) => r.reduce((s, x) => s + Number(x.products || 0), 0) }
  ]
});
