/* MyStore - Categories page */
MyStorePage({
  title: "Categories",
  singular: "Category",
  addLabel: "Add Category",
  subtitle: "Organise your catalogue into categories.",
  storageKey: "mystore_categories_v1",
  perPage: 8,
  emptyIcon: "bi-grid",
  titleKey: "name",
  filterKey: "status",
  filterOptions: ["Active","Inactive"],
  seed: [{"id":1,"name":"Health","slug":"health","products":3,"status":"Active","featured":true},{"id":2,"name":"Electronics","slug":"electronics","products":3,"status":"Active","featured":true},{"id":3,"name":"Footwear","slug":"footwear","products":1,"status":"Active","featured":false},{"id":4,"name":"Bags","slug":"bags","products":1,"status":"Inactive","featured":false}],
  columns: [{"key":"name","label":"Category","type":"secondary"},{"key":"slug","label":"Slug"},{"key":"products","label":"Products"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Inactive":"badge-secondary"}},{"key":"featured","label":"Featured","type":"bool"}],
  fields: [{"key":"name","label":"Category Name","required":true},{"key":"slug","label":"URL Slug"},{"key":"products","label":"Product Count","type":"number"},{"key":"status","label":"Status","type":"select","options":["Active","Inactive"]},{"key":"featured","label":"Featured Category","type":"switch"}],
  stats: [
  { key: "total", label: "Total Categories", icon: "bi-grid", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "featured", label: "Featured", icon: "bi-star", tone: "orange", calc: (r) => r.filter((x) => x.featured).length },
  { key: "products", label: "Products Covered", icon: "bi-box-seam", tone: "purple", calc: (r) => r.reduce((s, x) => s + Number(x.products || 0), 0) }
  ]
});
