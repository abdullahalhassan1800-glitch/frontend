/* MyStore - Dashboard */
(function () {
  "use strict";

  const { money, esc, store } = window.MyStore;

  const STATUS_TONE = {
    Delivered: "badge-success",
    Shipped: "badge-info",
    Processing: "badge-warning",
    Pending: "badge-warning",
    Cancelled: "badge-danger",
    Refunded: "badge-secondary"
  };

  function orders() {
    const rows = store("mystore_orders_v1", null);
    if (rows) return rows;
    return [];
  }

  function products() {
    return store("mystore_products_v2", []);
  }

  function customers() {
    return store("mystore_customers_v1", []);
  }

  function render() {
    const slot = document.getElementById("pageSlot");
    const list = orders();
    const prods = products();
    const custs = customers();

    const revenue = list
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    const stats = [
      { label: "Total Products", icon: "bi-box-seam", tone: "blue", value: prods.length },
      { label: "Orders", icon: "bi-cart3", tone: "orange", value: list.length },
      { label: "Revenue", icon: "bi-currency-rupee", tone: "green", value: money(revenue) },
      { label: "Customers", icon: "bi-people", tone: "purple", value: custs.length }
    ];

    const recent = list.slice(0, 5);
    const recentRows = recent.length
      ? recent
          .map(
            (o) =>
              "<tr><td><div class=\"product-name-cell\">#" + esc(o.id) + "</div></td>" +
              "<td>" + esc(o.customer) + "</td>" +
              '<td class="price-cell">' + money(o.total) + "</td>" +
              '<td><span class="badge ' + (STATUS_TONE[o.status] || "badge-secondary") + '">' +
              esc(o.status) + "</span></td></tr>"
          )
          .join("")
      : '<tr><td colspan="4"><div class="empty-state"><i class="bi bi-cart3"></i>No orders yet' +
        "<div>Orders you create will appear here.</div></div></td></tr>";

    const lowStock = prods
      .filter((p) => Number(p.stock || 0) <= 10)
      .slice(0, 6);

    const lowRows = lowStock.length
      ? lowStock
          .map((p) => {
            const stock = Number(p.stock || 0);
            const tone = stock === 0 ? "red" : "amber";
            const meta = stock === 0 ? "Out of stock" : stock + " left in stock";
            return (
              '<li><div class="mini-icon ' + tone + '"><i class="bi bi-exclamation-triangle"></i></div>' +
              '<div class="mini-text"><div class="mini-name">' + esc(p.name) + "</div>" +
              '<div class="mini-meta">' + esc(p.category || "Uncategorised") + " &middot; " + meta + "</div></div>" +
              '<a class="btn-ghost" href="products.html">Fix</a></li>'
            );
          })
          .join("")
      : '<li><div class="mini-icon green"><i class="bi bi-check-circle"></i></div>' +
        '<div class="mini-text"><div class="mini-name">Stock levels look good</div>' +
        '<div class="mini-meta">No products are running low.</div></div></li>';

    slot.insertAdjacentHTML(
      "beforeend",
      '<main class="main-content">' +
        '<div class="stats-grid">' +
        stats
          .map(
            (s) =>
              '<div class="stat-card"><div class="stat-icon ' + s.tone + '"><i class="bi ' + s.icon +
              '"></i></div><div class="stat-title">' + esc(s.label) + "</div>" +
              '<div class="stat-value">' + esc(s.value) + "</div></div>"
          )
          .join("") +
        "</div>" +
        '<div class="dash-grid">' +
        '<section class="panel"><div class="panel-head">' +
        '<div><h6 class="panel-title">Recent Orders</h6>' +
        '<div class="panel-sub">Your five most recent orders</div></div>' +
        '<a class="btn-ghost" href="orders.html">View All</a></div>' +
        '<div class="table-responsive"><table class="table"><thead><tr>' +
        "<th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>" +
        recentRows +
        "</tbody></table></div></section>" +
        "<div>" +
        '<section class="panel"><div class="panel-head"><div>' +
        '<h6 class="panel-title">Low Stock</h6>' +
        '<div class="panel-sub">Items at or below 10 units</div></div>' +
        '<a class="btn-ghost" href="inventory.html">Inventory</a></div>' +
        '<ul class="mini-list">' + lowRows + "</ul></section>" +
        '<section class="panel"><div class="panel-head"><div>' +
        '<h6 class="panel-title">Quick Actions</h6>' +
        '<div class="panel-sub">Jump straight into common tasks</div></div></div>' +
        '<div class="panel-body"><div class="quick-actions">' +
        '<a href="products.html"><i class="bi bi-plus-circle"></i>Add Product</a>' +
        '<a href="orders.html"><i class="bi bi-cart-plus"></i>Create Order</a>' +
        '<a href="customers.html"><i class="bi bi-person-plus"></i>Add Customer</a>' +
        '<a href="media.html"><i class="bi bi-cloud-upload"></i>Upload Media</a>' +
        "</div></div></section>" +
        "</div></div></main>"
    );
  }

  window.MyStoreReady.then(render);
})();