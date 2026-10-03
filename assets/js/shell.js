/* MyStore Admin Panel - shared shell (sidebar + header + global behaviours) */
(function () {
  "use strict";

  const THEME_KEY = "mystore_theme";

  const NAV = [
    { section: "MAIN" },
    { href: "dashboard.html", icon: "bi-speedometer2", label: "Dashboard", key: "dashboard" },

    { section: "PRODUCTS" },
    { href: "products.html", icon: "bi-box-seam", label: "Products", key: "products" },
    { href: "collections.html", icon: "bi-layers", label: "Collections", key: "collections" },
    { href: "inventory.html", icon: "bi-clipboard-data", label: "Inventory", key: "inventory" },
    { href: "categories.html", icon: "bi-grid", label: "Categories", key: "categories" },
    { href: "brands.html", icon: "bi-tags", label: "Brands", key: "brands" },
    { href: "reviews.html", icon: "bi-star", label: "Reviews", key: "reviews" },

    { section: "SALES" },
    { href: "purchase-orders.html", icon: "bi-bag-check", label: "Purchase Orders", key: "purchase-orders" },
    { href: "orders.html", icon: "bi-cart3", label: "Orders", key: "orders" },
    { href: "gift-cards.html", icon: "bi-gift", label: "Gift Cards", key: "gift-cards" },

    { section: "CUSTOMERS" },
    { href: "customers.html", icon: "bi-people", label: "Customers", key: "customers" },

    { section: "MEDIA & MARKETING" },
    { href: "media.html", icon: "bi-folder2-open", label: "Media Library", key: "media" },
    { href: "banners.html", icon: "bi-image", label: "Banners", key: "banners" },
    { href: "coupons.html", icon: "bi-percent", label: "Coupons", key: "coupons" },

    { section: "SETTINGS" },
    { href: "settings.html", icon: "bi-gear", label: "General Settings", key: "settings" },
    { href: "users.html", icon: "bi-person-gear", label: "Users & Roles", key: "users" },
    { href: "auth/login.html", icon: "bi-box-arrow-right", label: "Logout", key: "logout" }
  ];

  function activeKey() {
    const file = window.location.pathname.split("/").pop();
    return (file || "index.html").replace(".html", "");
  }

  function sidebarHtml(active) {
    let links = "";
    NAV.forEach((item) => {
      if (item.section) {
        links += '<div class="nav-section">' + item.section + "</div>";
        return;
      }
      const cls = "nav-item" + (item.key === active ? " active" : "");
      links +=
        '<a href="' + item.href + '" class="' + cls + '">' +
        '<i class="bi ' + item.icon + '"></i><span>' + item.label + "</span></a>";
    });

    return (
      '<aside class="sidebar" id="sidebar">' +
      '<div class="sidebar-header">' +
      '<div class="logo-icon"><i class="bi bi-bag-fill"></i></div>' +
      "<div><div class=\"logo-text\">MyStore</div><div class=\"logo-sub\">Admin Panel</div></div>" +
      "</div>" +
      '<nav class="sidebar-nav">' + links + "</nav>" +
      '<div class="sidebar-footer">' +
      '<div class="upgrade-card">' +
      '<i class="bi bi-rocket-takeoff upgrade-icon"></i>' +
      '<div class="upgrade-title">Upgrade to Pro</div>' +
      '<button class="upgrade-btn" id="upgradeBtn">View Plans</button>' +
      "</div></div></aside>"
    );
  }

  function headerHtml() {
    return (
      '<header class="top-header">' +
      '<div class="header-left">' +
      '<button class="btn-hamburger" id="btnHamburger" aria-label="Menu"><i class="bi bi-list"></i></button>' +
      '<div class="search-wrapper header-search">' +
      '<i class="bi bi-search"></i>' +
      '<input type="text" class="search-input" id="globalSearch" placeholder="Search anything...">' +
      "</div></div>" +
      '<div class="header-right">' +
      '<button class="header-icon-btn" id="themeBtn" title="Toggle theme"><i class="bi bi-sun" id="themeIcon"></i></button>' +
      '<div class="notif-wrap">' +
      '<button class="header-icon-btn" id="notifBtn" aria-label="Notifications">' +
      '<i class="bi bi-bell"></i><span class="notification-badge" id="notifBadge">3</span></button>' +
      '<div class="notif-panel" id="notifPanel">' +
      '<div class="notif-panel-head">Notifications</div>' +
      '<div class="notif-item"><i class="bi bi-box-seam"></i><div><div>New product awaiting review</div><div class="notif-when">2 minutes ago</div></div></div>' +
      '<div class="notif-item"><i class="bi bi-exclamation-triangle"></i><div><div>3 items are low in stock</div><div class="notif-when">1 hour ago</div></div></div>' +
      '<div class="notif-item"><i class="bi bi-truck"></i><div><div>Order #4821 has shipped</div><div class="notif-when">Yesterday</div></div></div>' +
      "</div></div>" +
      '<button class="user-menu" id="userMenuBtn">' +
      '<span class="user-avatar">AH</span>' +
      '<span class="user-info"><span class="user-name">Admin</span><span class="user-role">Administrator</span></span>' +
      "</button></div></header>"
    );
  }

  function upgradeModalHtml() {
    return (
      '<div class="modal fade" id="upgradeModal" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
      '<div class="modal-header"><h5 class="modal-title">Upgrade to Pro</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body"><p class="mb-3">Unlock everything your store needs to grow.</p>' +
      '<div class="detail-grid"><dt>Unlimited products</dt><dd>10,000 listings</dd>' +
      "<dt>Team members</dt><dd>Up to 25 seats</dd>" +
      "<dt>Storage</dt><dd>250 GB media</dd>" +
      "<dt>Support</dt><dd>Priority 24/7</dd></div></div>" +
      '<div class="modal-footer"><button type="button" class="btn-ghost" data-bs-dismiss="modal">Not now</button>' +
      '<button type="button" class="btn-primary" id="upgradeCta">Contact Sales</button></div>' +
      "</div></div></div>"
    );
  }

  function isMobile() {
    return window.matchMedia("(max-width: 992px)").matches;
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main-wrapper");
    const overlay = document.getElementById("sidebarOverlay");

    if (isMobile()) {
      const open = sidebar.classList.toggle("mobile-open");
      overlay.classList.toggle("show", open);
      return;
    }

    const collapsed = sidebar.classList.toggle("collapsed");
    main.classList.toggle("collapsed", collapsed);
    overlay.classList.remove("show");
  }

  function closeSidebar() {
    document.getElementById("sidebar").classList.remove("mobile-open");
    document.getElementById("sidebarOverlay").classList.remove("show");
  }

  function toast(message, kind) {
    let box = document.getElementById("toastContainer");
    if (!box) {
      box = document.createElement("div");
      box.className = "toast-container";
      box.id = "toastContainer";
      document.body.appendChild(box);
    }

    const el = document.createElement("div");
    el.className = "toast show " + (kind === "danger" ? "toast-danger" : "toast-success");
    el.textContent = message;
    box.appendChild(el);

    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2600);
  }

  function money(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN");
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function store(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function saveStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* ignore */
    }
  }

  function applyTheme(mode) {
    document.body.classList.toggle("dark-mode", mode === "dark");
    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = mode === "dark" ? "bi bi-moon-stars" : "bi bi-sun";
  }

  function mount() {
    const active = activeKey();
    const app = document.getElementById("app");
    if (!app) return;

    app.insertAdjacentHTML("afterbegin", sidebarHtml(active));
    app.insertAdjacentHTML("beforeend",
      '<div class="overlay" id="sidebarOverlay"></div>' +
      '<div class="main-wrapper">' + headerHtml() + '<div id="pageSlot"></div></div>');
    document.body.insertAdjacentHTML("beforeend", upgradeModalHtml());

    if (!document.querySelector('link[href="admin.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "admin.css";
      document.head.appendChild(link);
    }

    applyTheme(localStorage.getItem(THEME_KEY) || "light");

    document.getElementById("btnHamburger").addEventListener("click", toggleSidebar);
    document.getElementById("sidebarOverlay").addEventListener("click", closeSidebar);

    document.getElementById("themeBtn").addEventListener("click", () => {
      const dark = document.body.classList.toggle("dark-mode");
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
      applyTheme(dark ? "dark" : "light");
    });

    document.getElementById("notifBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      const panel = document.getElementById("notifPanel");
      panel.classList.toggle("show");
      if (panel.classList.contains("show")) {
        const badge = document.getElementById("notifBadge");
        if (badge) badge.remove();
      }
    });

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!t || typeof t.closest !== "function") return;
      if (!t.closest(".notif-wrap")) {
        const panel = document.getElementById("notifPanel");
        if (panel) panel.classList.remove("show");
      }
    });

    const upgradeModal = new bootstrap.Modal(document.getElementById("upgradeModal"));
    document.getElementById("upgradeBtn").addEventListener("click", () => upgradeModal.show());
    document.getElementById("upgradeCta").addEventListener("click", () => {
      upgradeModal.hide();
      toast("We will contact you shortly.");
    });

    document.getElementById("userMenuBtn").addEventListener("click", () => {
      toast("Signed in as Admin");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });
  }

  window.MyStore = { toast, money, esc, store, saveStore };

  window.MyStoreReady = new Promise(function (resolve) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        mount();
        resolve();
      });
    } else {
      mount();
      resolve();
    }
  });
})();