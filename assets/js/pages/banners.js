/* MyStore - Banners page */
MyStorePage({
  title: "Banners",
  singular: "Banner",
  addLabel: "Add Banner",
  subtitle: "Homepage and category promotional banners.",
  storageKey: "mystore_banners_v1",
  perPage: 8,
  emptyIcon: "bi-image",
  titleKey: "title",
  filterKey: "status",
  filterOptions: ["Active","Scheduled","Disabled"],
  seed: [{"id":1,"title":"Festive Sale 2026","position":"Homepage Hero","scheduled":"2026-10-20","status":"Scheduled"},{"id":2,"title":"New Arrivals","position":"Homepage Strip","scheduled":"2026-10-01","status":"Active"},{"id":3,"title":"Clearance","position":"Sidebar","scheduled":"2026-09-01","status":"Disabled"}],
  columns: [{"key":"title","label":"Banner","type":"secondary"},{"key":"position","label":"Position"},{"key":"scheduled","label":"Scheduled For"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Scheduled":"badge-info","Disabled":"badge-secondary"}}],
  fields: [{"key":"title","label":"Banner Title","required":true},{"key":"position","label":"Position","type":"select","options":["Homepage Hero","Homepage Strip","Category Top","Sidebar"]},{"key":"scheduled","label":"Scheduled For","placeholder":"YYYY-MM-DD"},{"key":"status","label":"Status","type":"select","options":["Active","Scheduled","Disabled"]}],
  stats: [
  { key: "total", label: "Total Banners", icon: "bi-image", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "scheduled", label: "Scheduled", icon: "bi-calendar-event", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Scheduled').length },
  { key: "disabled", label: "Disabled", icon: "bi-x-circle", tone: "purple", calc: (r) => r.filter((x) => x.status === 'Disabled').length }
  ]
});
