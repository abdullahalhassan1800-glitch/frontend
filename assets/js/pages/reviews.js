/* MyStore - Reviews page */
MyStorePage({
  title: "Reviews",
  singular: "Review",
  addLabel: "Add Review",
  subtitle: "Moderate customer reviews and ratings.",
  storageKey: "mystore_reviews_v1",
  perPage: 8,
  emptyIcon: "bi-star",
  titleKey: "product",
  filterKey: "status",
  filterOptions: ["Pending","Approved","Rejected"],
  seed: [{"id":1,"product":"SUGAR PRO MAX","customer":"Rahul Sharma","rating":5,"comment":"Very effective, results in 2 weeks.","status":"Approved"},{"id":2,"product":"Running Shoes","customer":"Aman Khan","rating":4,"comment":"Comfortable fit, size runs small.","status":"Pending"},{"id":3,"product":"Travel Backpack","customer":"Priya Verma","rating":3,"comment":"OK for the price.","status":"Pending"}],
  columns: [{"key":"product","label":"Product","type":"secondary"},{"key":"customer","label":"Customer"},{"key":"rating","label":"Rating"},{"key":"comment","label":"Comment"},{"key":"status","label":"Status","type":"badge","map":{"Approved":"badge-success","Pending":"badge-warning","Rejected":"badge-danger"}}],
  fields: [{"key":"product","label":"Product","required":true},{"key":"customer","label":"Customer","required":true},{"key":"rating","label":"Rating (1-5)","type":"number"},{"key":"comment","label":"Comment","type":"textarea"},{"key":"status","label":"Status","type":"select","options":["Pending","Approved","Rejected"]}],
  stats: [
  { key: "total", label: "Total Reviews", icon: "bi-star", tone: "blue", calc: (r) => r.length },
  { key: "pending", label: "Pending", icon: "bi-hourglass-split", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Pending').length },
  { key: "approved", label: "Approved", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Approved').length },
  { key: "avg", label: "Avg Rating", icon: "bi-award", tone: "purple", calc: (r) => (r.length ? (r.reduce((s, x) => s + Number(x.rating || 0), 0) / r.length).toFixed(1) : '0.0') }
  ]
});
