/* MyStore - Orders page */
MyStorePage({
  title: "Orders",
  singular: "Order",
  addLabel: "Create Order",
  subtitle: "Track, manage and fulfil customer orders.",
  storageKey: "mystore_orders_v1",
  perPage: 8,
  emptyIcon: "bi-cart3",
  titleKey: "customer",
  filterKey: "status",
  filterOptions: ["Pending","Processing","Shipped","Delivered","Cancelled","Refunded"],
  seed: [{"id":4821,"customer":"Rahul Sharma","date":"2026-10-02","items":3,"total":2499,"status":"Pending","payment":"Unpaid"},{"id":4820,"customer":"Priya Verma","date":"2026-10-02","items":1,"total":1299,"status":"Shipped","payment":"Paid"},{"id":4819,"customer":"Aman Khan","date":"2026-10-01","items":5,"total":8499,"status":"Delivered","payment":"Paid"},{"id":4818,"customer":"Neha Gupta","date":"2026-09-30","items":2,"total":3098,"status":"Cancelled","payment":"Refunded"},{"id":4817,"customer":"Vikram Singh","date":"2026-09-29","items":1,"total":999,"status":"Delivered","payment":"Paid"}],
  columns: [{"key":"id","label":"Order ID"},{"key":"customer","label":"Customer","type":"secondary"},{"key":"date","label":"Date"},{"key":"items","label":"Items"},{"key":"total","label":"Total","type":"money"},{"key":"payment","label":"Payment","type":"badge","map":{"Paid":"badge-success","Unpaid":"badge-warning","Refunded":"badge-secondary"}},{"key":"status","label":"Status","type":"badge","map":{"Delivered":"badge-success","Shipped":"badge-info","Processing":"badge-warning","Pending":"badge-warning","Cancelled":"badge-danger","Refunded":"badge-secondary"}}],
  fields: [{"key":"customer","label":"Customer","required":true},{"key":"date","label":"Order Date","required":true,"placeholder":"YYYY-MM-DD"},{"key":"items","label":"Items","type":"number"},{"key":"total","label":"Total Amount","type":"number"},{"key":"status","label":"Status","type":"select","options":["Pending","Processing","Shipped","Delivered","Cancelled","Refunded"]},{"key":"payment","label":"Payment","type":"select","options":["Paid","Unpaid","Refunded"]}],
  stats: [
  { key: "total", label: "Total Orders", icon: "bi-cart3", tone: "blue", calc: (r) => r.length },
  { key: "pending", label: "Pending", icon: "bi-hourglass-split", tone: "orange", calc: (r) => r.filter((x) => x.status === 'Pending').length },
  { key: "delivered", label: "Delivered", icon: "bi-truck", tone: "green", calc: (r) => r.filter((x) => x.status === 'Delivered').length },
  { key: "revenue", label: "Revenue", icon: "bi-currency-rupee", tone: "purple", calc: (r) => '₹' + r.filter((x) => x.status !== 'Cancelled').reduce((s, x) => s + Number(x.total || 0), 0).toLocaleString('en-IN') }
  ]
});
