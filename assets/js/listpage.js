/* MyStore Admin Panel - generic CRUD list page engine */
(function () {
  "use strict";

  const { toast, money, esc, store, saveStore } = window.MyStore;

  function isMobile() {
    return window.matchMedia("(max-width: 992px)").matches;
  }

  function render(cfg) {
    const app = document.getElementById("pageSlot");
    let rows = store(cfg.storageKey, cfg.seed || []);

    let search = "";
    let filterValue = "";
    let page = 1;
    const perPage = cfg.perPage || 8;
    let editId = null;
    let deleteId = null;

    let viewModal = null;
    let confirmModal = null;

    /* ---------- markup ---------- */
    const statsHtml = (cfg.stats || []).map((s) =>
      '<div class="stat-card">' +
      '<div class="stat-icon ' + (s.tone || "blue") + '"><i class="bi ' + s.icon + '"></i></div>' +
      '<div class="stat-title">' + esc(s.label) + "</div>" +
      '<div class="stat-value" data-stat="' + s.key + '">0</div>' +
      '<div class="stat-change">' + esc(s.note || "") + "</div>" +
      "</div>"
    ).join("");

    const filterOptions = (cfg.filterOptions || [])
      .map((o) => '<option value="' + esc(o) + '">' + esc(o) + "</option>").join("");

    app.insertAdjacentHTML("beforeend",
      '<main class="main-content">' +
      '<div class="stats-grid">' + statsHtml + "</div>" +
      '<section class="products-section">' +
      '<div class="section-header"><div>' +
      '<div class="section-title">' + esc(cfg.title) + "</div>" +
      '<div class="section-subtitle">' + esc(cfg.subtitle) + "</div>" +
      '</div><button class="btn-primary" data-add><i class="bi bi-plus"></i> ' +
      esc(cfg.addLabel || "Add New") + "</button></div>" +
      '<div class="filters-bar">' +
      '<div class="search-wrapper" style="width:320px"><i class="bi bi-search"></i>' +
      '<input type="text" class="search-input" data-search placeholder="Search ' + esc(cfg.title.toLowerCase()) + '..."></div>' +
      (cfg.filterOptions
        ? '<select class="form-select" data-filter style="width:180px"><option value="">All</option>' + filterOptions + "</select>"
        : "") +
      '<button class="btn-ghost" data-reset>Reset</button>' +
      "</div>" +
      '<div class="table-responsive"><table class="table"><thead><tr>' +
      cfg.columns.map((c) => "<th>" + esc(c.label) + "</th>").join("") +
      '<th>Actions</th></tr></thead><tbody data-body></tbody></table></div>' +
      '<div class="pagination-wrapper"><div class="page-info" data-info></div>' +
      '<ul class="pagination" data-pagination></ul></div>' +
      "</section></main>" +
      '<div class="overlay" data-drawer-overlay></div>' +
      '<aside class="drawer" data-drawer aria-hidden="true">' +
      '<div class="drawer-header"><h5 class="drawer-title" data-drawer-title>' + esc(cfg.addLabel || "Add New") + "</h5>" +
      '<button class="btn-close" data-drawer-close aria-label="Close"><i class="bi bi-x-lg"></i></button></div>' +
      '<div class="drawer-body"><form data-form novalidate>' +
      cfg.fields.map(fieldHtml).join("") +
      "</form></div>" +
      '<div class="drawer-footer"><button class="btn-ghost" data-cancel>Cancel</button>' +
      '<button class="btn-primary" data-save>Save</button></div></aside>' +
      '<div class="modal fade" id="viewModal" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content">' +
      '<div class="modal-header"><h5 class="modal-title">Details</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body" data-view-body></div></div></div></div>' +
      '<div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' +
      '<div class="modal-header"><h5 class="modal-title">Confirm</h5>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '<div class="modal-body" data-confirm-text></div>' +
      '<div class="modal-footer"><button type="button" class="btn-ghost" data-bs-dismiss="modal">Cancel</button>' +
      '<button type="button" class="btn btn-danger" data-confirm-yes>Delete</button></div>' +
      "</div></div></div>"
    );

    /* ---------- field + cell rendering ---------- */
    function fieldHtml(f) {
      const label = '<label class="form-label" for="f_' + f.key + '">' + esc(f.label) +
        (f.required ? ' <span class="required">*</span>' : "") + "</label>";

      if (f.type === "select") {
        return '<div class="mb-3">' + label +
          '<select class="form-select" id="f_' + f.key + '" data-field="' + f.key + '">' +
          (f.options || []).map((o) => "<option>" + esc(o) + "</option>").join("") +
          "</select></div>";
      }

      if (f.type === "textarea") {
        return '<div class="mb-3">' + label +
          '<textarea class="form-control" id="f_' + f.key + '" data-field="' + f.key +
          '" rows="' + (f.rows || 3) + '" placeholder="' + esc(f.placeholder || "") + '"></textarea></div>';
      }

      if (f.type === "switch") {
        return '<div class="mb-3"><div class="form-check form-switch">' +
          '<input class="form-check-input" type="checkbox" id="f_' + f.key + '" data-field="' + f.key + '">' +
          '<label class="form-check-label" for="f_' + f.key + '">' + esc(f.label) + "</label></div></div>";
      }

      if (f.width === 6) {
        return "";
      }

      return '<div class="mb-3">' + label +
        '<input type="' + (f.type === "number" ? "number" : "text") + '" class="form-control" id="f_' + f.key +
        '" data-field="' + f.key + '" placeholder="' + esc(f.placeholder || "") + '"></div>';
    }

    function cellHtml(col, row) {
      const val = row[col.key];

      if (col.type === "money") return '<td class="price-cell">' + money(val) + "</td>";
      if (col.type === "badge") {
        const tone = (col.map && col.map[val]) || "badge-success";
        return "<td><span class=\"badge " + tone + "\">" + esc(val) + "</span></td>";
      }
      if (col.type === "bool") {
        return '<td><input type="checkbox" class="form-check-input" data-toggle="' + col.key +
          '" data-id="' + row.id + '"' + (val ? " checked" : "") + "></td>";
      }
      if (col.type === "img") {
        return '<td><img class="product-img" src="' + esc(val) +
          '" alt="' + esc(row[col.titleKey || col.key] || "") + '"></td>';
      }
      if (col.type === "secondary") {
        return "<td><div class=\"product-name-cell\">" + esc(val) + "</div></td>";
      }
      return "<td>" + esc(val) + "</td>";
    }

    /* ---------- data ---------- */
    function persist() {
      saveStore(cfg.storageKey, rows);
    }

    function filtered() {
      const term = search.trim().toLowerCase();
      return rows.filter((r) => {
        if (filterValue && (r[cfg.filterKey] || "") !== filterValue) return false;
        if (!term) return true;
        return Object.keys(r).some((k) => {
          if (k === "id") return false;
          const v = r[k];
          return typeof v === "string" && v.toLowerCase().indexOf(term) !== -1;
        });
      });
    }

    function renderStats() {
      (cfg.stats || []).forEach((s) => {
        const el = document.querySelector('[data-stat="' + s.key + '"]');
        if (el) el.textContent = s.calc ? s.calc(rows) : rows.length;
      });
    }

    function renderTable() {
      const list = filtered();
      const maxPage = Math.max(1, Math.ceil(list.length / perPage));
      if (page > maxPage) page = maxPage;

      const start = (page - 1) * perPage;
      const slice = list.slice(start, start + perPage);
      const body = document.querySelector("[data-body]");

      if (!slice.length) {
        const isEmpty = rows.length === 0;
        body.innerHTML =
          '<tr><td colspan="' + (cfg.columns.length + 1) + '"><div class="empty-state">' +
          '<i class="bi ' + (isEmpty ? cfg.emptyIcon || "bi-inbox" : "bi-search") + '"></i>' +
          (isEmpty ? "No " + cfg.title.toLowerCase() + " yet" : "No matching records") +
          "<div>" + (isEmpty ? "Click the button above to add your first one."
            : "Try a different search or filter.") + "</div></div></td></tr>";
      } else {
        body.innerHTML = slice.map((r) => {
          const idx = rows.indexOf(r) + 1;
          return "<tr>" + cfg.columns.map((c) => cellHtml(c, r)).join("") +
            '<td>' + (cfg.columns[0].type === "img" || cfg.indexFirst === false ? "" : "<span>" + idx + "</span>") +
            '<button class="action-btn" data-view="' + r.id + '" title="View"><i class="bi bi-eye"></i></button>' +
            '<button class="action-btn" data-edit="' + r.id + '" title="Edit"><i class="bi bi-pencil"></i></button>' +
            '<button class="action-btn danger" data-del="' + r.id + '" title="Delete"><i class="bi bi-trash"></i></button>' +
            "</td></tr>";
        }).join("");
      }

      document.querySelector("[data-info]").textContent = rows.length
        ? "Showing " + (start + 1) + "-" + (start + slice.length) + " of " + list.length + " records"
        : "No records yet";

      let ph = '<li><button data-page="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + ">Prev</button></li>";
      for (let i = 1; i <= maxPage; i += 1) {
        ph += '<li><button data-page="' + i + '"' + (i === page ? ' class="active"' : "") + ">" + i + "</button></li>";
      }
      ph += '<li><button data-page="' + (page + 1) + '"' + (page === maxPage ? " disabled" : "") + ">Next</button></li>";
      document.querySelector("[data-pagination]").innerHTML = ph;
    }

    function refresh() {
      renderStats();
      renderTable();
    }

    /* ---------- drawer ---------- */
    function openDrawer(mode, record) {
      editId = mode === "edit" ? record.id : null;
      document.querySelector("[data-drawer-title]").textContent =
        mode === "edit" ? "Edit " + cfg.singular : cfg.addLabel;

      cfg.fields.forEach((f) => {
        const el = document.querySelector('[data-field="' + f.key + '"]');
        if (!el) return;
        if (f.type === "switch") { el.checked = record ? !!record[f.key] : false; return; }
        if (!record && f.type === "select") { el.selectedIndex = 0; return; }
        el.value = record && record[f.key] !== undefined && record[f.key] !== null ? record[f.key] : "";
      });

      const drawer = document.querySelector("[data-drawer]");
      drawer.classList.add("show");
      drawer.setAttribute("aria-hidden", "false");
      document.querySelector("[data-drawer-overlay]").classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      document.querySelector("[data-drawer]").classList.remove("show");
      document.querySelector("[data-drawer]").setAttribute("aria-hidden", "true");
      document.querySelector("[data-drawer-overlay]").classList.remove("show");
      document.body.style.overflow = "";
      editId = null;
    }

    function save() {
      const rec = {};
      let bad = null;

      cfg.fields.forEach((f) => {
        const el = document.querySelector('[data-field="' + f.key + '"]');
        if (!el) return;

        if (f.type === "switch") { rec[f.key] = el.checked; return; }

        let v = el.value;
        if (typeof v === "string") v = v.trim();

        if (f.required && !v) { bad = bad || f.label; return; }
        if (f.type === "number") v = v === "" ? 0 : Number(v);
        rec[f.key] = v;
      });

      if (bad) {
        toast(bad + " is required.", "danger");
        return;
      }

      if (editId) {
        const i = rows.findIndex((r) => r.id === editId);
        if (i !== -1) rows[i] = Object.assign({}, rows[i], rec);
        toast(cfg.singular + " updated.", "success");
      } else {
        rec.id = Date.now();
        rows.unshift(rec);
        toast(cfg.singular + " added.", "success");
      }

      persist();
      closeDrawer();
      refresh();
    }

    function viewRecord(id) {
      const r = rows.find((x) => x.id === id);
      if (!r) return;

      document.querySelector("[data-view-body]").innerHTML =
        '<dl class="detail-grid">' +
        cfg.fields.filter((f) => !f.typeSwitchOnly).map((f) => {
          let v = r[f.key];
          if (f.type === "switch") v = v ? "Yes" : "No";
          if (f.type === "money") v = money(v);
          if (v === "" || v === undefined || v === null) v = "-";
          return "<dt>" + esc(f.label) + "</dt><dd>" + esc(v) + "</dd>";
        }).join("") +
        "</dl>";
      viewModal.show();
    }

    function askDelete(id) {
      const r = rows.find((x) => x.id === id);
      if (!r) return;
      deleteId = id;
      document.querySelector("[data-confirm-text]").textContent =
        'Delete "' + (r[cfg.titleKey || cfg.fields[0].key] || "this record") + '"? This cannot be undone.';
      confirmModal.show();
    }

    function doDelete() {
      const i = rows.findIndex((r) => r.id === deleteId);
      if (i !== -1) {
        rows.splice(i, 1);
        persist();
        refresh();
        toast(cfg.singular + " deleted.", "success");
      }
      deleteId = null;
    }

    /* ---------- wiring ---------- */
    viewModal = new bootstrap.Modal(document.getElementById("viewModal"));
    confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));

    document.querySelector("[data-add]").addEventListener("click", () => openDrawer("add"));
    document.querySelector("[data-save]").addEventListener("click", save);
    document.querySelector("[data-cancel]").addEventListener("click", closeDrawer);
    document.querySelector("[data-drawer-close]").addEventListener("click", closeDrawer);
    document.querySelector("[data-drawer-overlay]").addEventListener("click", closeDrawer);
    document.querySelector("[data-confirm-yes]").addEventListener("click", doDelete);

    document.querySelector("[data-search]").addEventListener("input", (e) => {
      search = e.target.value; page = 1; renderTable();
    });

    const filterEl = document.querySelector("[data-filter]");
    if (filterEl) {
      filterEl.addEventListener("change", (e) => { filterValue = e.target.value; page = 1; renderTable(); });
    }

    document.querySelector("[data-reset]").addEventListener("click", () => {
      search = ""; filterValue = ""; page = 1;
      document.querySelector("[data-search]").value = "";
      if (filterEl) filterEl.value = "";
      renderTable();
      toast("Filters cleared.");
    });

    document.querySelector("[data-pagination]").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-page]");
      if (!b || b.disabled) return;
      page = Number(b.dataset.page);
      renderTable();
    });

    document.querySelector("[data-body]").addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]");
      const ed = e.target.closest("[data-edit]");
      const del = e.target.closest("[data-del]");

      if (v) viewRecord(Number(v.dataset.view));
      if (ed) openDrawer("edit", rows.find((r) => r.id === Number(ed.dataset.edit)));
      if (del) askDelete(Number(del.dataset.del));
    });

    document.querySelector("[data-body]").addEventListener("change", (e) => {
      const t = e.target.closest("[data-toggle]");
      if (!t) return;
      const r = rows.find((x) => x.id === Number(t.dataset.id));
      if (!r) return;
      r[t.dataset.toggle] = t.checked;
      persist();
      toast("Updated.", "success");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.querySelector("[data-drawer]").classList.contains("show")) {
        closeDrawer();
      }
    });

    refresh();
  }

  window.MyStorePage = function (cfg) {
    window.MyStoreReady.then(function () {
      render(cfg);
    });
  };
})();