/* MyStore Admin Panel - Products module */
(function () {
  "use strict";

  const STORAGE_KEY = "mystore_products_v1";
  const PAGE_SIZE = 6;
  const MAX_IMAGES = 4;

  const SEED = [
    { id: 1,  name: "SUGAR PRO MAX",        category: "Health",     brand: "Taiva Naturals", sku: "SUG-PM-01", price: 999,  salePrice: 799,  stock: 42,  status: "Active",   featured: true,  unit: "Pack", shortDesc: "Daily sugar control capsules.", fullDesc: "Supports healthy blood sugar levels with 500mg of natural extracts.", images: [] },
    { id: 2,  name: "Karela Jamun",          category: "Health",     brand: "Taiva Naturals", sku: "KAR-JM-02", price: 1299, salePrice: 1099, stock: 18,  status: "Active",   featured: false, unit: "Pack", shortDesc: "Karela and jamun wellness blend.", fullDesc: "Traditional Ayurvedic formula for blood sugar and weight support.", images: [] },
    { id: 3,  name: "Wireless Headphones",   category: "Electronics", brand: "SoundMax",     sku: "WH-100-BLK", price: 2499, salePrice: 1999, stock: 0,   status: "Inactive", featured: true,  unit: "Piece", shortDesc: "40h battery over-ear headphones.", fullDesc: "Active noise cancellation, 40 hour battery life, Bluetooth 5.3.", images: [] },
    { id: 4,  name: "Smart Watch",           category: "Electronics", brand: "FitPro",       sku: "SW-22-GLD", price: 3499, salePrice: null, stock: 7,   status: "Active",   featured: false, unit: "Piece", shortDesc: "AMOLED fitness watch with SpO2.", fullDesc: "1.85 inch AMOLED display, heart rate, SpO2, 10 day battery.", images: [] },
    { id: 5,  name: "Running Shoes",         category: "Footwear",    brand: "FitPro",       sku: "RS-09-GRY", price: 2199, salePrice: 1799, stock: 25,  status: "Active",   featured: false, unit: "Pair",  shortDesc: "Lightweight road running shoes.", fullDesc: "Breathable mesh upper with responsive foam midsole.", images: [] },
    { id: 6,  name: "Travel Backpack",       category: "Bags",        brand: "Traveller",    sku: "TB-40-NVY", price: 1899, salePrice: null, stock: 3,   status: "Active",   featured: true,  unit: "Piece", shortDesc: "40L cabin size travel backpack.", fullDesc: "Water resistant, USB charging port, hidden passport pocket.", images: [] },
    { id: 7,  name: "Herbal Cure Oil",       category: "Health",     brand: "Taiva Naturals", sku: "HC-15-ML", price: 599,  salePrice: 449,  stock: 60,  status: "Active",   featured: false, unit: "Bottle", shortDesc: "Ayurvedic hair and scalp oil.", fullDesc: "Bhringraj and amla based oil for stronger hair.", images: [] },
    { id: 8,  name: "Bluetooth Speaker",     category: "Electronics", brand: "SoundMax",     sku: "BS-20-BLU", price: 1499, salePrice: 1199, stock: 0,   status: "Inactive", featured: false, unit: "Piece", shortDesc: "Portable 20W speaker.", fullDesc: "IPX7 waterproof, 12 hour playtime, stereo pairing.", images: [] }
  ];

  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">' +
      '<rect width="44" height="44" rx="8" fill="#eef2f7"/>' +
      '<path d="M14 27l6-8 4 5 3-3 3 6z" fill="#b6c2d6"/>' +
      '<circle cx="17" cy="16" r="3" fill="#d5dde8"/></svg>'
    );

  let products = load();
  let images = [];
  let page = 1;
  let filtered = [];
  let editId = null;
  let deleteId = null;
  let viewModal;
  let confirmModal;

  const $ = (id) => document.getElementById(id);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return SEED.map((p) => Object.assign({}, p));
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length ? parsed : SEED.map((p) => Object.assign({}, p));
    } catch (err) {
      return SEED.map((p) => Object.assign({}, p));
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      /* storage full or blocked - continue in memory */
    }
  }

  function money(n) {
    return "&#8377;" + Number(n || 0).toLocaleString("en-IN");
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function thumb(product, idx) {
    const src = product.images && product.images[idx];
    if (src) {
      return '<img class="product-img" src="' + src + '" alt="' + esc(product.name) + '">';
    }
    return '<img class="product-img" src="' + PLACEHOLDER + '" alt="' + esc(product.name) + '">';
  }

  function renderStats() {
    $("statTotal").textContent = products.length;
    $("statActive").textContent = products.filter((p) => p.status === "Active").length;
    $("statOos").textContent = products.filter((p) => Number(p.stock) === 0).length;

    const cats = {};
    products.forEach((p) => { cats[p.category] = true; });
    $("statCats").textContent = Object.keys(cats).length;
  }

  function renderCategoryFilter() {
    const select = $("categoryFilter");
    const current = select.value;
    const cats = [];
    products.forEach((p) => {
      if (cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    cats.sort();

    select.innerHTML = '<option value="">All Categories</option>' +
      cats.map((c) => '<option value="' + esc(c) + '">' + esc(c) + "</option>").join("");

    if (cats.indexOf(current) !== -1) select.value = current;
  }

  function applyFilters() {
    const term = $("productSearch").value.trim().toLowerCase();
    const cat = $("categoryFilter").value;
    const status = $("statusFilter").value;

    filtered = products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (status && p.status !== status) return false;
      if (!term) return true;
      return (
        (p.name || "").toLowerCase().indexOf(term) !== -1 ||
        (p.sku || "").toLowerCase().indexOf(term) !== -1 ||
        (p.category || "").toLowerCase().indexOf(term) !== -1 ||
        (p.brand || "").toLowerCase().indexOf(term) !== -1
      );
    });

    const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > maxPage) page = maxPage;
    renderTable();
  }

  function renderTable() {
    const body = $("productTableBody");
    const start = (page - 1) * PAGE_SIZE;
    const rows = filtered.slice(start, start + PAGE_SIZE);

    if (!rows.length) {
      body.innerHTML =
        '<tr><td colspan="10"><div class="empty-state">' +
        '<i class="bi bi-inbox"></i>No products match your filters.' +
        "</div></td></tr>";
      $("pageInfo").textContent = "Showing 0 products";
      $("pagination").innerHTML = "";
      return;
    }

    body.innerHTML = rows
      .map((p) => {
        const index = products.indexOf(p) + 1;
        const badge = p.status === "Active"
          ? '<span class="badge badge-success">Active</span>'
          : '<span class="badge badge-danger">Inactive</span>';
        const sale = p.salePrice
          ? '<span class="price-original">' + money(p.price) + "</span>" + money(p.salePrice)
          : money(p.price);
        const stock = Number(p.stock) === 0
          ? '<span class="badge badge-danger">0</span>'
          : p.stock;

        return (
          "<tr>" +
          '<td><input type="checkbox" class="form-check-input row-check" data-id="' + p.id + '"></td>' +
          "<td>" + index + "</td>" +
          "<td>" + thumb(p, 0) + "</td>" +
          '<td><div class="product-name-cell">' + esc(p.name) + '</div><div class="product-sku">' + esc(p.sku) + "</div></td>" +
          "<td>" + esc(p.category) + "</td>" +
          '<td class="price-cell">' + sale + "</td>" +
          "<td>" + stock + "</td>" +
          "<td>" + badge + "</td>" +
          '<td><input type="checkbox" class="form-check-input featured-toggle" data-id="' + p.id + '"' + (p.featured ? " checked" : "") + '></td>' +
          "<td>" +
          '<button class="action-btn" data-action="view" data-id="' + p.id + '" title="View"><i class="bi bi-eye"></i></button>' +
          '<button class="action-btn" data-action="edit" data-id="' + p.id + '" title="Edit"><i class="bi bi-pencil"></i></button>' +
          '<button class="action-btn danger" data-action="delete" data-id="' + p.id + '" title="Delete"><i class="bi bi-trash"></i></button>' +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    const from = start + 1;
    const to = start + rows.length;
    $("pageInfo").textContent =
      "Showing " + from + "-" + to + " of " + filtered.length + " products";

    renderPagination();
  }

  function renderPagination() {
    const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    let html = '<li><button data-page="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + '>Prev</button></li>';

    for (let i = 1; i <= maxPage; i += 1) {
      html += '<li><button data-page="' + i + '"' + (i === page ? ' class="active"' : "") + ">" + i + "</button></li>";
    }

    html += '<li><button data-page="' + (page + 1) + '"' + (page === maxPage ? " disabled" : "") + '>Next</button></li>';
    $("pagination").innerHTML = html;
  }

  function renderImages() {
    const grid = $("imagePreviewGrid");
    grid.innerHTML = images
      .map((src, i) =>
        '<div class="image-preview"><img src="' + src + '" alt="Product ' + (i + 1) + '">' +
        '<button type="button" class="remove-img" data-remove="' + i + '" aria-label="Remove">&times;</button></div>'
      )
      .join("");
  }

  function readFiles(files) {
    const input = $("imageInput");
    const list = Array.prototype.slice.call(files);

    if (!list.length) return;
    if (images.length >= MAX_IMAGES) {
      toast("You can upload up to " + MAX_IMAGES + " images.", "danger");
      input.value = "";
      return;
    }

    list.forEach((file) => {
      if (images.length >= MAX_IMAGES) return;

      if (["image/png", "image/jpeg", "image/webp"].indexOf(file.type) === -1) {
        toast("Unsupported file type: " + file.name, "danger");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast(file.name + " is larger than 5MB.", "danger");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        images.push(e.target.result);
        renderImages();
      };
      reader.readAsDataURL(file);
    });

    input.value = "";
  }

  function openDrawer(mode, product) {
    editId = mode === "edit" ? product.id : null;
    $("drawerTitle").textContent = mode === "edit" ? "Edit Product" : "Add New Product";
    $("productId").value = editId || "";
    $("productName").value = product ? product.name : "";
    $("productCategory").value = product ? product.category : "Health";
    $("productBrand").value = product ? product.brand : "Taiva Naturals";
    $("productSku").value = product ? product.sku : "";
    $("productUnit").value = product ? product.unit : "Piece";
    $("productPrice").value = product ? product.price : "";
    $("productSalePrice").value = product && product.salePrice ? product.salePrice : "";
    $("productStock").value = product ? product.stock : "";
    $("productShortDesc").value = product ? product.shortDesc || "" : "";
    $("productFullDesc").value = product ? product.fullDesc || "" : "";
    $("productStatus").value = product ? product.status : "Active";
    $("productFeatured").checked = product ? !!product.featured : false;
    $("productMetaTitle").value = "";
    $("productMetaDesc").value = "";
    $("productTags").value = "";
    $("productMetaKey").value = "";
    $("productWeight").value = "";
    $("errName").style.display = "none";

    images = product && product.images ? product.images.slice() : [];
    renderImages();
    switchTab("basic");

    $("productDrawer").classList.add("show");
    $("drawerOverlay").classList.add("show");
    $("productDrawer").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    $("productDrawer").classList.remove("show");
    $("drawerOverlay").classList.remove("show");
    $("productDrawer").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    editId = null;
    images = [];
  }

  function switchTab(name) {
    document.querySelectorAll(".drawer-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === name);
    });
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.pane === name);
    });
  }

  function makeSku() {
    const base = ($("productName").value.trim() || "PROD")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toUpperCase()
      .slice(0, 8);
    return base + "-" + Math.floor(Math.random() * 900 + 100);
  }

  function saveProduct() {
    const name = $("productName").value.trim();
    const price = Number($("productPrice").value);
    const shortDesc = $("productShortDesc").value.trim();

    if (!name) {
      $("errName").style.display = "block";
      $("productName").classList.add("is-invalid");
      switchTab("basic");
      $("productName").focus();
      toast("Product name is required.", "danger");
      return;
    }

    if (!price || price < 0) {
      toast("Enter a valid price.", "danger");
      switchTab("basic");
      $("productPrice").focus();
      return;
    }

    if (!shortDesc) {
      toast("Short description is required.", "danger");
      switchTab("basic");
      $("productShortDesc").focus();
      return;
    }

    const saleRaw = $("productSalePrice").value.trim();
    const salePrice = saleRaw === "" ? null : Number(saleRaw);
    if (salePrice !== null && salePrice > price) {
      toast("Sale price cannot be higher than price.", "danger");
      switchTab("basic");
      return;
    }

    const record = {
      id: editId || Date.now(),
      name: name,
      category: $("productCategory").value,
      brand: $("productBrand").value,
      sku: $("productSku").value.trim() || makeSku(),
      unit: $("productUnit").value,
      price: price,
      salePrice: salePrice,
      stock: Number($("productStock").value) || 0,
      shortDesc: shortDesc,
      fullDesc: $("productFullDesc").value.trim(),
      status: $("productStatus").value,
      featured: $("productFeatured").checked,
      images: images.slice()
    };

    if (editId) {
      const i = products.findIndex((p) => p.id === editId);
      if (i !== -1) products[i] = record;
      toast("Product updated.", "success");
    } else {
      products.unshift(record);
      toast("Product added.", "success");
    }

    save();
    closeDrawer();
    page = 1;
    renderCategoryFilter();
    renderStats();
    applyFilters();
  }

  function viewProduct(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;

    const gallery = (p.images && p.images.length)
      ? '<div class="detail-images">' + p.images.map((src) => '<img src="' + src + '" alt="">').join("") + "</div>"
      : '<div class="detail-images"><img src="' + PLACEHOLDER + '" alt=""></div>';

    $("viewModalBody").innerHTML =
      gallery +
      '<dl class="detail-grid">' +
      "<dt>Name</dt><dd>" + esc(p.name) + "</dd>" +
      "<dt>SKU</dt><dd>" + esc(p.sku) + "</dd>" +
      "<dt>Category</dt><dd>" + esc(p.category) + "</dd>" +
      "<dt>Brand</dt><dd>" + esc(p.brand) + "</dd>" +
      "<dt>Price</dt><dd>" + money(p.salePrice || p.price) +
        (p.salePrice ? ' <span class="price-original">' + money(p.price) + "</span>" : "") + "</dd>" +
      "<dt>Stock</dt><dd>" + p.stock + " " + esc(p.unit) + "</dd>" +
      "<dt>Status</dt><dd>" + esc(p.status) + "</dd>" +
      "<dt>Featured</dt><dd>" + (p.featured ? "Yes" : "No") + "</dd>" +
      "<dt>Summary</dt><dd>" + esc(p.shortDesc) + "</dd>" +
      "<dt>Description</dt><dd>" + esc(p.fullDesc || "-") + "</dd>" +
      "</dl>";

    $("viewEditBtn").onclick = () => {
      viewModal.hide();
      openDrawer("edit", p);
    };

    viewModal.show();
  }

  function askDelete(id) {
    const p = products.find((x) => x.id === id);
    if (!p) return;

    deleteId = id;
    $("confirmTitle").textContent = "Delete product";
    $("confirmMessage").textContent =
      'Move "' + p.name + '" to trash? You can restore it from Trash later.';
    confirmModal.show();
  }

  function doDelete() {
    const i = products.findIndex((p) => p.id === deleteId);
    if (i !== -1) {
      products.splice(i, 1);
      save();
      renderCategoryFilter();
      renderStats();
      applyFilters();
      toast("Product moved to trash.", "success");
    }
    deleteId = null;
  }

  function exportCsv() {
    if (!products.length) {
      toast("Nothing to export.", "danger");
      return;
    }

    const head = ["ID", "Name", "SKU", "Category", "Brand", "Price", "Sale Price", "Stock", "Status", "Featured"];
    const lines = [head.join(",")];

    products.forEach((p) => {
      lines.push([
        p.id,
        '"' + String(p.name).replace(/"/g, '""') + '"',
        p.sku,
        p.category,
        p.brand,
        p.price,
        p.salePrice === null ? "" : p.salePrice,
        p.stock,
        p.status,
        p.featured ? "Yes" : "No"
      ].join(","));
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mystore-products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("Export downloaded.", "success");
  }

  function toast(message, kind) {
    const box = $("toastContainer");
    const el = document.createElement("div");
    el.className = "toast show " + (kind === "danger" ? "toast-danger" : "toast-success");
    el.textContent = message;
    box.appendChild(el);

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2600);
  }

  function closeSidebar() {
    $("sidebar").classList.remove("show");
    $("sidebarOverlay").classList.remove("show");
  }

  function init() {
    viewModal = new bootstrap.Modal($("viewModal"));
    confirmModal = new bootstrap.Modal($("confirmModal"));

    renderCategoryFilter();
    renderStats();
    applyFilters();

    $("btnHamburger").addEventListener("click", () => {
      $("sidebar").classList.add("show");
      $("sidebarOverlay").classList.add("show");
    });

    $("sidebarOverlay").addEventListener("click", closeSidebar);

    $("addBtn").addEventListener("click", () => openDrawer("add"));

    document.querySelectorAll('.nav-item[data-action="add"]').forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer("add");
      });
    });

    $("closeDrawerBtn").addEventListener("click", closeDrawer);
    $("cancelBtn").addEventListener("click", closeDrawer);
    $("drawerOverlay").addEventListener("click", closeDrawer);
    $("saveBtn").addEventListener("click", saveProduct);

    $("productSearch").addEventListener("input", () => { page = 1; applyFilters(); });
    $("categoryFilter").addEventListener("change", () => { page = 1; applyFilters(); });
    $("statusFilter").addEventListener("change", () => { page = 1; applyFilters(); });

    $("resetBtn").addEventListener("click", () => {
      $("productSearch").value = "";
      $("categoryFilter").value = "";
      $("statusFilter").value = "";
      page = 1;
      applyFilters();
      toast("Filters cleared.");
    });

    $("exportBtn").addEventListener("click", exportCsv);
    $("confirmBtn").addEventListener("click", doDelete);

    $("pagination").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-page]");
      if (!btn || btn.disabled) return;
      page = Number(btn.dataset.page);
      renderTable();
    });

    $("productTableBody").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = Number(btn.dataset.id);

      if (btn.dataset.action === "view") viewProduct(id);
      if (btn.dataset.action === "edit") {
        const p = products.find((x) => x.id === id);
        if (p) openDrawer("edit", p);
      }
      if (btn.dataset.action === "delete") askDelete(id);
    });

    $("productTableBody").addEventListener("change", (e) => {
      const toggle = e.target.closest(".featured-toggle");
      if (!toggle) return;

      const id = Number(toggle.dataset.id);
      const p = products.find((x) => x.id === id);
      if (!p) return;

      p.featured = toggle.checked;
      save();
      toast(p.name + (p.featured ? " is now featured." : " is no longer featured."), "success");
    });

    $("selectAll").addEventListener("change", (e) => {
      document.querySelectorAll(".row-check").forEach((cb) => { cb.checked = e.target.checked; });
    });

    document.querySelectorAll(".drawer-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    $("uploadArea").addEventListener("click", () => $("imageInput").click());
    $("uploadArea").addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("imageInput").click(); }
    });
    $("imageInput").addEventListener("change", (e) => readFiles(e.target.files));

    ["dragenter", "dragover"].forEach((evt) => {
      $("uploadArea").addEventListener(evt, (e) => {
        e.preventDefault();
        $("uploadArea").classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      $("uploadArea").addEventListener(evt, (e) => {
        e.preventDefault();
        $("uploadArea").classList.remove("dragover");
      });
    });
    $("uploadArea").addEventListener("drop", (e) => readFiles(e.dataTransfer.files));

    $("imagePreviewGrid").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-remove]");
      if (!btn) return;
      images.splice(Number(btn.dataset.remove), 1);
      renderImages();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ($("productDrawer").classList.contains("show")) closeDrawer();
      closeSidebar();
    });

    $("themeBtn").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      toast("Theme toggled.");
    });

    $("notifBtn").addEventListener("click", () => {
      toast("You have 3 unread notifications.");
    });

    $("globalSearch").addEventListener("input", (e) => {
      $("productSearch").value = e.target.value;
      page = 1;
      applyFilters();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();