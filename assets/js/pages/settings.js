/* MyStore - General Settings */
(function () {
  "use strict";

  const { esc, store, saveStore, toast } = window.MyStore;

  const KEY = "mystore_settings_v1";

  const DEFAULTS = {
    storeName: "MyStore",
    email: "support@mystore.com",
    phone: "98110 00000",
    address: "12 Linking Road, Mumbai 400050",
    currency: "₹ (INR)",
    taxRate: 18,
    lowStockAlert: true,
    newOrderEmail: true,
    weeklyReport: false,
    freeShippingOver: 999,
    defaultWeight: 0.5
  };

  const TOGGLES = [
    { key: "lowStockAlert", label: "Low stock alerts", hint: "Notify me when an item falls below its reorder level." },
    { key: "newOrderEmail", label: "New order emails", hint: "Send an email every time a new order is placed." },
    { key: "weeklyReport", label: "Weekly sales report", hint: "A Monday summary of revenue and top products." }
  ];

  function render() {
    const slot = document.getElementById("pageSlot");
    const cfg = Object.assign({}, DEFAULTS, store(KEY, {}));

    slot.insertAdjacentHTML(
      "beforeend",
      '<main class="main-content">' +
        '<section class="panel settings-form">' +
        '<div class="panel-head"><div>' +
        '<h6 class="panel-title">General Settings</h6>' +
        '<div class="panel-sub">Store identity, tax, shipping and notifications</div></div>' +
        '<button class="btn-primary" data-save><i class="bi bi-check2"></i> Save Changes</button></div>' +
        '<div class="settings-section"><h6>Store Information</h6>' +
        '<p>Shown on invoices, emails and the storefront footer.</p>' +
        '<div class="row g-3">' +
        '<div class="col-md-6"><label class="form-label" for="s_storeName">Store Name</label>' +
        '<input class="form-control" id="s_storeName" data-set="storeName" value="' + esc(cfg.storeName) + '"></div>' +
        '<div class="col-md-6"><label class="form-label" for="s_email">Support Email</label>' +
        '<input class="form-control" id="s_email" data-set="email" value="' + esc(cfg.email) + '"></div>' +
        '<div class="col-md-6"><label class="form-label" for="s_phone">Phone</label>' +
        '<input class="form-control" id="s_phone" data-set="phone" value="' + esc(cfg.phone) + '"></div>' +
        '<div class="col-md-6"><label class="form-label" for="s_address">Address</label>' +
        '<input class="form-control" id="s_address" data-set="address" value="' + esc(cfg.address) + '"></div>' +
        "</div></div>" +
        '<div class="settings-section"><h6>Currency &amp; Tax</h6>' +
        "<p>Applies to every price shown in the panel.</p>" +
        '<div class="row g-3">' +
        '<div class="col-md-6"><label class="form-label" for="s_currency">Currency</label>' +
        '<select class="form-select" id="s_currency" data-set="currency">' +
        ["₹ (INR)", "$ (USD)", "€ (EUR)", "£ (GBP)"]
          .map((c) => '<option' + (c === cfg.currency ? " selected" : "") + ">" + esc(c) + "</option>")
          .join("") +
        "</select></div>" +
        '<div class="col-md-6"><label class="form-label" for="s_taxRate">Default Tax Rate (%)</label>' +
        '<input class="form-control" type="number" id="s_taxRate" data-set="taxRate" value="' + esc(cfg.taxRate) + '"></div>' +
        "</div></div>" +
        '<div class="settings-section"><h6>Shipping</h6>' +
        "<p>Used to estimate delivery cost and free-shipping eligibility.</p>" +
        '<div class="row g-3">' +
        '<div class="col-md-6"><label class="form-label" for="s_freeShippingOver">Free Shipping Over</label>' +
        '<input class="form-control" type="number" id="s_freeShippingOver" data-set="freeShippingOver" value="' + esc(cfg.freeShippingOver) + '"></div>' +
        '<div class="col-md-6"><label class="form-label" for="s_defaultWeight">Default Weight (kg)</label>' +
        '<input class="form-control" type="number" step="0.1" id="s_defaultWeight" data-set="defaultWeight" value="' + esc(cfg.defaultWeight) + '"></div>' +
        "</div></div>" +
        '<div class="settings-section"><h6>Notifications</h6>' +
        "<p>Choose which alerts land in your inbox.</p>" +
        TOGGLES.map(
          (t) =>
            '<div class="form-check form-switch mb-2"><input class="form-check-input" type="checkbox" id="s_' +
            t.key + '" data-toggle="' + t.key + '"' + (cfg[t.key] ? " checked" : "") + ">" +
            '<label class="form-check-label" for="s_' + t.key + '"><strong>' + esc(t.label) + "</strong><br>" +
            '<span class="panel-sub">' + esc(t.hint) + "</span></label></div>"
        ).join("") +
        "</div></div>" +
        '<div class="panel-body d-flex justify-content-end gap-2">' +
        '<button class="btn-ghost" data-reset-form>Discard</button>' +
        '<button class="btn-primary" data-save>Save Changes</button>' +
        "</div></section></main>"
    );

    function collect() {
      const out = Object.assign({}, cfg);
      document.querySelectorAll("[data-set]").forEach((el) => {
        out[el.dataset.set] = el.type === "number" ? Number(el.value || 0) : el.value.trim();
      });
      document.querySelectorAll("[data-toggle]").forEach((el) => {
        out[el.dataset.toggle] = el.checked;
      });
      return out;
    }

    document.querySelectorAll("[data-save]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const next = collect();
        saveStore(KEY, next);
        toast("Settings saved.");
      })
    );

    document.querySelector("[data-reset-form]").addEventListener("click", () => {
      renderSlotAgain();
      toast("Changes discarded.", "danger");
    });

    function renderSlotAgain() {
      const fresh = Object.assign({}, DEFAULTS, store(KEY, {}));
      document.querySelectorAll("[data-set]").forEach((el) => {
        if (el.type === "number") el.value = fresh[el.dataset.set];
        else el.value = fresh[el.dataset.set];
      });
      document.querySelectorAll("[data-toggle]").forEach((el) => {
        el.checked = !!fresh[el.dataset.toggle];
      });
    }
  }

  window.MyStoreReady.then(render);
})();