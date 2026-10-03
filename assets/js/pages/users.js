/* MyStore - Users & Roles page */
MyStorePage({
  title: "Users & Roles",
  singular: "User",
  addLabel: "Invite User",
  subtitle: "Control who can access your store.",
  storageKey: "mystore_users_v1",
  perPage: 8,
  emptyIcon: "bi-person-gear",
  titleKey: "name",
  filterKey: "status",
  filterOptions: ["Active","Invited","Suspended"],
  seed: [{"id":1,"name":"Abdul Hassan","email":"admin@mystore.com","role":"Admin","status":"Active"},{"id":2,"name":"Sana Khan","email":"sana@mystore.com","role":"Manager","status":"Active"},{"id":3,"name":"Ravi Patel","email":"ravi@mystore.com","role":"Staff","status":"Invited"}],
  columns: [{"key":"name","label":"User","type":"secondary"},{"key":"email","label":"Email"},{"key":"role","label":"Role","type":"badge","map":{"Admin":"badge-danger","Manager":"badge-info","Staff":"badge-secondary"}},{"key":"status","label":"Status","type":"badge","map":{"Active":"badge-success","Invited":"badge-warning","Suspended":"badge-danger"}}],
  fields: [{"key":"name","label":"Full Name","required":true},{"key":"email","label":"Email","required":true},{"key":"role","label":"Role","type":"select","options":["Admin","Manager","Staff"]},{"key":"status","label":"Status","type":"select","options":["Active","Invited","Suspended"]}],
  stats: [
  { key: "total", label: "Total Users", icon: "bi-people", tone: "blue", calc: (r) => r.length },
  { key: "active", label: "Active", icon: "bi-person-check", tone: "green", calc: (r) => r.filter((x) => x.status === 'Active').length },
  { key: "admins", label: "Admins", icon: "bi-shield-lock", tone: "orange", calc: (r) => r.filter((x) => x.role === 'Admin').length },
  { key: "invited", label: "Invited", icon: "bi-envelope", tone: "purple", calc: (r) => r.filter((x) => x.status === 'Invited').length }
  ]
});
