/* MyStore - Coupons page */
MyStorePage({
  title: "Coupons",
  singular: "Coupon",
  addLabel: "Create Coupon",
  subtitle: "Discount codes and campaign offers.",
  storageKey: "mystore_coupons_v1",
  perPage: 8,
  emptyIcon: "bi-percent",
  titleKey: "code",
  filterKey: "status",
  filterOptions: ["Active","Expired","Disabled"],
  seed: [{"id":1,"code":"SAVE10","type":"Percentage","value":10,"usage":42,"expiry":"2026-12-31","status":"Active"},{"id":2,"code":"FLAT200","type":"Fixed","value":200,"usage":17,"expiry":"2026-11-30","status":"Active"},{"id":3,"code":"FESTIVE25","type":"Percentage","value":25,"usage":130,"expiry":"2026-10-15","status":"Expired"}],
  columns: [{"key":"code","label":"Code","type":"secondary"},{"key":"type","label":"Type","type":"badge","map":{"Percentage":"badge-info","Fixed":"badge-secondary"}},{"key":"value","label":"Value"},{"key":"usage","label":"Used"},{"key":"expiry","label":"Expires"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Expired":"badge-danger","Disabled":"badge-secondary"}}],
  fields: [{"key":"code","label":"Coupon Code","required":true},{"key":"type","label":"Discount Type","type":"select","options":["Percentage","Fixed"]},{"key":"value","label":"Discount Value","type":"number"},{"key":"usage","label":"Times Used","type":"number"},{"key":"expiry","label":"Expiry Date","placeholder":"YYYY-MM-DD"},{"key":"status","label":"Status","type":"select","options":["Active","Expired","Disabled"]}],
  stats: [
  { key: "total", label: "Total Coupons", icon: "bi-percent", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "expired", label: "Expired", icon: "bi-hourglass", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Expired').length },
  { key: "usage", label: "Total Redemptions", icon: "bi-ticket-perforated", tone: "purple", calc: (r) => r.reduce((s, x) => s + Number(x.usage || 0), 0) }
  ]
});
