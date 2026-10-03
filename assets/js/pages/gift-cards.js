/* MyStore - Gift Cards page */
MyStorePage({
  title: "Gift Cards",
  singular: "Gift Card",
  addLabel: "Create Gift Card",
  subtitle: "Issue and track prepaid gift cards.",
  storageKey: "mystore_giftcards_v1",
  perPage: 8,
  emptyIcon: "bi-gift",
  titleKey: "code",
  filterKey: "status",
  filterOptions: ["Active","Redeemed","Expired"],
  seed: [{"id":1,"code":"GC-1001","value":1000,"used":false,"expires":"2027-01-01","status":"Active"},{"id":2,"code":"GC-1002","value":2500,"used":true,"expires":"2027-01-01","status":"Redeemed"},{"id":3,"code":"GC-1003","value":500,"used":false,"expires":"2026-06-30","status":"Expired"}],
  columns: [{"key":"code","label":"Card Code","type":"secondary"},{"key":"value","label":"Value","type":"money"},{"key":"used","label":"Redeemed","type":"bool"},{"key":"expires","label":"Expires"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Redeemed":"badge-info","Expired":"badge-danger"}}],
  fields: [{"key":"code","label":"Card Code","required":true},{"key":"value","label":"Value","type":"number"},{"key":"expires","label":"Expiry Date","placeholder":"YYYY-MM-DD"},{"key":"status","label":"Status","type":"select","options":["Active","Redeemed","Expired"]},{"key":"used","label":"Already Redeemed","type":"switch"}],
  stats: [
  { key: "total", label: "Total Cards", icon: "bi-gift", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-check-circle", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "redeemed", label: "Redeemed", icon: "bi-ticket-perforated", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Redeemed').length },
  { key: "value", label: "Outstanding Value", icon: "bi-currency-rupee", tone: "purple", calc: (r) => '₹' + r.filter((x) => !x.used).reduce((s, x) => s + Number(x.value || 0), 0).toLocaleString('en-IN') }
  ]
});
