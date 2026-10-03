/* ============================================================
   Logs Page — logs.js
   Displays, filters, and exports activity logs
   ============================================================ */

var PAGE_SIZE = 50;
var currentPage = 1;
var filteredLogs = [];

function initLogsPage() {
  populateUserFilter();
  renderLogs();
}

function getActivity() {
  return getData('activity_log', []);
}

function populateUserFilter() {
  var logs = getActivity();
  var users = {};
  logs.forEach(function (l) {
    if (l.username) users[l.username] = l.user || l.username;
  });
  var sel = document.getElementById('filterUser');
  sel.innerHTML = '<option value="">All Users</option>';
  Object.keys(users).sort().forEach(function (key) {
    var opt = document.createElement('option');
    opt.value = key;
    opt.textContent = users[key];
    sel.appendChild(opt);
  });
}

function renderLogs() {
  var logs = getActivity();
  var actionFilter = document.getElementById('filterAction').value;
  var userFilter = document.getElementById('filterUser').value;
  var dateFilter = document.getElementById('filterDate').value;
  var searchFilter = document.getElementById('filterSearch').value.toLowerCase();

  filteredLogs = logs.filter(function (l) {
    if (actionFilter && l.action !== actionFilter) return false;
    if (userFilter && l.username !== userFilter) return false;
    if (dateFilter) {
      var logDate = (l.timestamp || '').substring(0, 10);
      if (logDate !== dateFilter) return false;
    }
    if (searchFilter) {
      var text = ((l.user || '') + ' ' + (l.action || '') + ' ' + (l.details || '') + ' ' + (l.username || '')).toLowerCase();
      if (text.indexOf(searchFilter) === -1) return false;
    }
    return true;
  });

  currentPage = 1;
  renderTable();
}

function renderTable() {
  var tbody = document.getElementById('logsTable');
  var emptyState = document.getElementById('emptyState');
  var total = filteredLogs.length;
  var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  var start = (currentPage - 1) * PAGE_SIZE;
  var end = Math.min(start + PAGE_SIZE, total);
  var pageLogs = filteredLogs.slice(start, end);

  document.getElementById('logCount').textContent = total + ' log' + (total !== 1 ? 's' : '');
  document.getElementById('pageInfo').textContent = 'Page ' + currentPage + ' of ' + totalPages;
  document.getElementById('prevBtn').disabled = currentPage <= 1;
  document.getElementById('nextBtn').disabled = currentPage >= totalPages;

  if (pageLogs.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  var html = '';
  pageLogs.forEach(function (l) {
    var actionClass = getActionClass(l.action);
    var actionLabel = formatActivityAction(l.action);
    var time = formatDateTime(l.timestamp);
    html += '<tr class="log-row" style="border-bottom:1px solid var(--border);">';
    html += '<td class="log-time" style="padding:10px 12px;">' + time + '</td>';
    html += '<td class="log-user" style="padding:10px 12px;">' + escapeHtml(l.user || 'Unknown') + '<br><span style="font-weight:400;font-size:11px;color:var(--text-dim);">' + escapeHtml(l.username || '') + '</span></td>';
    html += '<td style="padding:10px 12px;"><span class="action-badge ' + actionClass + '">' + escapeHtml(actionLabel) + '</span></td>';
    html += '<td class="log-detail" style="padding:10px 12px;" title="' + escapeHtml(l.details || '') + '">' + escapeHtml(l.details || '-') + '</td>';
    html += '</tr>';
  });
  tbody.innerHTML = html;
}

function getActionClass(action) {
  if (!action) return 'action-default';
  if (action.indexOf('login') !== -1 || action.indexOf('logout') !== -1) return action.indexOf('login') !== -1 ? 'action-login' : 'action-logout';
  if (action.indexOf('order') !== -1) return 'action-order';
  if (action.indexOf('product') !== -1) return 'action-product';
  if (action.indexOf('user') !== -1) return 'action-user';
  if (action.indexOf('backup') !== -1 || action.indexOf('restore') !== -1) return 'action-backup';
  return 'action-default';
}

function formatActivityAction(action) {
  var map = {
    'login': 'Logged in',
    'logout': 'Logged out',
    'order_created': 'Created order',
    'order_status': 'Changed order status',
    'order_deleted': 'Deleted order',
    'product_created': 'Created product',
    'product_updated': 'Updated product',
    'product_deleted': 'Deleted product',
    'user_created': 'Created user',
    'user_updated': 'Updated user',
    'user_deleted': 'Deleted user',
    'backup': 'Backed up data',
    'restore': 'Restored data'
  };
  return map[action] || action;
}

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    var d = new Date(iso);
    var day = String(d.getDate()).padStart(2, '0');
    var mon = String(d.getMonth() + 1).padStart(2, '0');
    var yr = d.getFullYear();
    var hr = String(d.getHours()).padStart(2, '0');
    var min = String(d.getMinutes()).padStart(2, '0');
    var sec = String(d.getSeconds()).padStart(2, '0');
    return day + '/' + mon + '/' + yr + ' ' + hr + ':' + min + ':' + sec;
  } catch (e) { return iso; }
}

function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function prevPage() {
  if (currentPage > 1) { currentPage--; renderTable(); }
}

function nextPage() {
  var totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  if (currentPage < totalPages) { currentPage++; renderTable(); }
}

function refreshLogs() {
  populateUserFilter();
  renderLogs();
  showToast('Logs refreshed', 'success');
}

function exportLogs() {
  if (!filteredLogs.length) {
    showToast('No logs to export', 'warning');
    return;
  }
  var csv = 'Time,User,Username,Action,Details\n';
  filteredLogs.forEach(function (l) {
    csv += '"' + (l.timestamp || '') + '","' + (l.user || '') + '","' + (l.username || '') + '","' + (l.action || '') + '","' + (l.details || '').replace(/"/g, '""') + '"\n';
  });
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'activity-logs-' + new Date().toISOString().substring(0, 10) + '.csv';
  link.click();
  showToast('Logs exported as CSV', 'success');
}

function showToast(msg, type) {
  var toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:9999;animation:fadeIn 0.3s ease;';
  if (type === 'success') { toast.style.background = '#198754'; toast.style.color = '#fff'; }
  else if (type === 'warning') { toast.style.background = '#ffc107'; toast.style.color = '#000'; }
  else { toast.style.background = '#d82c0d'; toast.style.color = '#fff'; }
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3000);
}

document.addEventListener('DOMContentLoaded', initLogsPage);
