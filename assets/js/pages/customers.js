/* MyStore - Customers page */
MyStorePage({
  title: "Customers",
  singular: "Customer",
  addLabel: "Add Customer",
  subtitle: "Your customer base, segments and lifetime value.",
  storageKey: "mystore_customers_v1",
  perPage: 8,
  emptyIcon: "bi-people",
  titleKey: "name",
  filterKey: "status",
  filterOptions: ["Active","Inactive","Blocked"],
  seed: [{"id":1,"name":"Rahul Sharma","email":"rahul@example.com","phone":"98110 12345","orders":12,"spent":24500,"status":"Active"},{"id":2,"name":"Priya Verma","email":"priya@example.com","phone":"98111 22345","orders":7,"spent":11200,"status":"Active"},{"id":3,"name":"Aman Khan","email":"aman@example.com","phone":"98112 32345","orders":3,"spent":4300,"status":"Active"},{"id":4,"name":"Neha Gupta","email":"neha@example.com","phone":"98113 42345","orders":1,"spent":999,"status":"Inactive"}],
  columns: [{"key":"name","label":"Customer","type":"secondary"},{"key":"email","label":"Email"},{"key":"phone","label":"Phone"},{"key":"orders","label":"Orders"},{"key":"spent","label":"Total Spent","type":"money"},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Inactive":"badge-secondary","Blocked":"badge-danger"}}],
  fields: [{"key":"name","label":"Full Name","required":true},{"key":"email","label":"Email","required":true},{"key":"phone","label":"Phone"},{"key":"orders","label":"Total Orders","type":"number"},{"key":"spent","label":"Total Spent","type":"number"},{"key":"status","label":"Status","type":"select","options":["Active","Inactive","Blocked"]}],
  stats: [
  { key: "total", label: "Total Customers", icon: "bi-people", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-person-check", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "repeat", label: "Repeat Buyers", icon: "bi-arrow-repeat", tone: "orange", calc: (r) => r.filter((x) => Number(x.orders) > 1).length },
  { key: "ltv", label: "Avg Lifetime Value", icon: "bi-graph-up-arrow", tone: "purple", calc: (r) => '₹' + Math.round(r.reduce((s, x) => s + Number(x.spent || 0), 0) / (r.length || 1)).toLocaleString('en-IN') }
  ]
});
