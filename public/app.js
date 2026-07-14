const $ = (id) => document.getElementById(id);
const BACKEND_URL_STORAGE_KEY = 'adsmanager_backend_url';
const ADMIN_API_KEY_STORAGE_KEY = 'adsmanager_admin_api_key';
const OPERATOR_NAME_STORAGE_KEY = 'adsmanager_operator_name';

const els = {
  backendUrl: $('backendUrl'),
  adAccountId: $('adAccountId'),
  objective: $('objective'),
  postId: $('postId'),
  defaultPageName: $('defaultPageName'),
  defaultBudget: $('defaultBudget'),
  operatorName: $('operatorName'),
  adminApiKey: $('adminApiKey'),
  batchInput: $('batchInput'),
  permissionCheckBtn: $('permissionCheckBtn'),
  autoFixPermissionsBtn: $('autoFixPermissionsBtn'),
  runFullFlowBtn: $('runFullFlowBtn'),
  openAdsManagerBtn: $('openAdsManagerBtn'),
  refreshReportBtn: $('refreshReportBtn'),
  exportReportBtn: $('exportReportBtn'),
  reportSummary: $('reportSummary'),
  reportStatus: $('reportStatus'),
  reportAdAccount: $('reportAdAccount'),
  reportFrom: $('reportFrom'),
  reportTo: $('reportTo'),
  status: $('status'),
  authStatus: $('authStatus'),
  fbIdentity: $('fbIdentity'),
  authConfigHint: $('authConfigHint'),
  loginFacebookBtn: $('loginFacebookBtn'),
  checkBackendBtn: $('checkBackendBtn'),
  businessId: document.getElementById('businessId'),
requestAccessBtn: document.getElementById('requestAccessBtn'),
permissionInput: document.getElementById('permissionInput'),
};

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setStatusHtml(html) {
  els.status.innerHTML = html;
}

function setStatus(message) {
  setStatusHtml(`<div class="log-line">${escapeHtml(message)}</div>`);
}

function appendStatus(message, type = 'normal') {
  const cls = `log-line log-${type}`;
  const icon =
    type === 'success' ? '✅' :
    type === 'error' ? '❌' :
    type === 'running' ? '⏳' :
    type === 'section' ? '📌' :
    '•';

  els.status.innerHTML += `<div class="${cls}">${icon} ${escapeHtml(message)}</div>`;
}

function appendStatusLink(label, url) {
  const safeLabel = escapeHtml(label);
  const safeUrl = escapeHtml(url);

  els.status.innerHTML += `
    <div class="log-line log-link">
      🔗 ${safeLabel}: <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Mở Ads Manager</a>
    </div>
  `;
}

function appendNameLink(name, url) {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);

  els.status.innerHTML += `
    <div class="log-line log-success">
      ✅ ${safeName} - <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">Mở link</a>
    </div>
  `;
}

function appendDivider() {
  els.status.innerHTML += `<div class="log-divider"></div>`;
}

function normalizeBackendUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';

  // Let users paste host without protocol.
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return '';
  }
}

function resolveDefaultBackendUrl() {
  if (typeof window === 'undefined') return '';
  if (window.location?.origin) return window.location.origin;
  return '';
}

function normalizeAdAccountIdInput(raw) {
  const cleaned = String(raw || '').trim().replace(/\s+/g, '');
  if (!cleaned) return '';

  const numeric = cleaned.replace(/^act_/i, '');
  if (!/^\d+$/.test(numeric)) return cleaned;
  return `act_${numeric}`;
}

function setupBackendUrlInput() {
  if (!els.backendUrl) return;

  const saved = normalizeBackendUrl(localStorage.getItem(BACKEND_URL_STORAGE_KEY) || '');
  const fromInput = normalizeBackendUrl(els.backendUrl.value || '');
  const fallback = resolveDefaultBackendUrl();
  const resolved = saved || fromInput || fallback;

  if (resolved) {
    els.backendUrl.value = resolved;
  }

  localStorage.setItem(BACKEND_URL_STORAGE_KEY, resolved || '');
}

function setupOperatorInput() {
  if (!els.operatorName) return;
  const saved = String(localStorage.getItem(OPERATOR_NAME_STORAGE_KEY) || '').trim();
  if (saved) {
    els.operatorName.value = saved;
  }
}

function setupAdminKeyInput() {
  if (!els.adminApiKey) return;
  const saved = String(localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY) || '').trim();
  if (saved) {
    els.adminApiKey.value = saved;
  }
}

function getBackendUrl() {
  const fromInput = normalizeBackendUrl(els.backendUrl?.value || '');
  if (fromInput) {
    localStorage.setItem(BACKEND_URL_STORAGE_KEY, fromInput);
    return fromInput;
  }

  const saved = normalizeBackendUrl(localStorage.getItem(BACKEND_URL_STORAGE_KEY) || '');
  if (saved) return saved;

  return resolveDefaultBackendUrl();
}

function getAdminApiKey() {
  const value = String(els.adminApiKey?.value || '').trim();
  if (value) {
    localStorage.setItem(ADMIN_API_KEY_STORAGE_KEY, value);
  }
  return value;
}

function getOperatorName() {
  const value = String(els.operatorName?.value || '').trim();
  if (value) {
    localStorage.setItem(OPERATOR_NAME_STORAGE_KEY, value);
  }
  return value;
}

function buildApiHeaders(extra = {}) {
  const headers = { ...extra };
  const key = getAdminApiKey();
  if (key) headers['x-admin-key'] = key;
  return headers;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

function isRetryableStatus(status) {
  return status === 408 || status === 429 || status >= 500;
}

async function fetchWithRetry(url, options = {}, { retries = 2, timeoutMs = 20000 } = {}) {
  let lastErr = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs);
      if (attempt < retries && isRetryableStatus(res.status)) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastErr || new Error('Network request failed');
}

async function apiRequest(path, { method = 'GET', body = null, retries = 2, timeoutMs = 20000 } = {}) {
  const backend = getBackendUrl();
  if (!backend) throw new Error('Backend URL chưa hợp lệ.');

  const headers = buildApiHeaders();
  if (String(method).toUpperCase() !== 'GET') {
    const operator = getOperatorName();
    const businessId = String(els.businessId?.value || '').trim();
    if (operator) headers['x-operator-name'] = operator;
    if (businessId) headers['x-business-id'] = businessId;
  }
  if (body !== null) headers['Content-Type'] = 'application/json';

  const response = await fetchWithRetry(
    `${backend}${path}`,
    {
      method,
      headers,
      body: body !== null ? JSON.stringify(body) : undefined
    },
    { retries, timeoutMs }
  );

  let data = null;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return data;
}

function setLoginButtonState({ disabled = false, text = null, reason = '' } = {}) {
  if (!els.loginFacebookBtn) return;
  els.loginFacebookBtn.disabled = disabled;
  if (text) els.loginFacebookBtn.textContent = text;
  els.loginFacebookBtn.title = reason || '';
}

function renderFacebookIdentity(profile) {
  if (!els.fbIdentity) return;

  if (!profile) {
    els.fbIdentity.style.display = 'none';
    els.fbIdentity.textContent = '';
    return;
  }

  const name = profile.name || 'Không rõ tên';
  const id = profile.id || 'Không rõ ID';

  els.fbIdentity.style.display = 'block';
  els.fbIdentity.textContent = `Đang kết nối: ${name} | Facebook ID: ${id}`;
}

async function checkFacebookAuth() {
  els.authStatus.className = 'auth-status';
  els.authStatus.textContent = 'Đang kiểm tra trạng thái kết nối...';
  if (els.authConfigHint) {
    els.authConfigHint.style.display = 'none';
    els.authConfigHint.textContent = '';
  }

  try {
    const [healthData, configData, statusData] = await Promise.all([
      apiRequest('/health', { method: 'GET', retries: 1, timeoutMs: 12000 }),
      apiRequest('/auth/config', { method: 'GET', retries: 1, timeoutMs: 12000 }),
      apiRequest('/auth/status', { method: 'GET', retries: 1, timeoutMs: 12000 })
    ]);

    if (!healthData?.ok) {
      throw new Error('Backend health check failed');
    }

    if (configData?.ok === false) {
      const missing = Array.isArray(configData?.missing) ? configData.missing : [];
      const missingText = missing.length ? missing.join(', ') : 'META_APP_ID/META_APP_SECRET';
      els.authStatus.textContent = `Backend thiếu config OAuth: ${missingText}`;
      els.authStatus.className = 'auth-status warn';
      setLoginButtonState({
        disabled: true,
        text: 'f Đăng nhập Facebook',
        reason: `Thiếu ${missingText} trên backend`
      });
      renderFacebookIdentity(null);

      if (els.authConfigHint) {
        els.authConfigHint.style.display = 'block';
        els.authConfigHint.textContent =
          `Set env (${missingText}) rồi restart backend. Redirect hiện tại: ${configData?.redirectUri || '(không xác định)'}`;
      }
      return;
    }

    setLoginButtonState({ disabled: false, reason: '' });

    if (configData?.adminKeyRequired && !getAdminApiKey() && els.authConfigHint) {
      els.authConfigHint.style.display = 'block';
      els.authConfigHint.textContent = 'Server đang bật ADMIN_API_KEY. Hãy nhập Admin API Key để chạy các API ghi dữ liệu.';
    }

    if (statusData?.hasToken) {
      els.authStatus.textContent = 'Đã kết nối Facebook';
      els.authStatus.className = 'auth-status ok';
      setLoginButtonState({ text: 'Kết nối lại Facebook' });
      renderFacebookIdentity(statusData.profile || null);
    } else {
      els.authStatus.textContent = 'Chưa kết nối Facebook';
      els.authStatus.className = 'auth-status warn';
      setLoginButtonState({ text: 'Đăng nhập Facebook' });
      renderFacebookIdentity(null);
    }
  } catch (err) {
    els.authStatus.textContent = 'Không kết nối được backend';
    els.authStatus.className = 'auth-status warn';
    setLoginButtonState({
      disabled: true,
      text: 'f Đăng nhập Facebook',
      reason: 'Backend chưa reachable hoặc URL sai'
    });
    renderFacebookIdentity(null);
    if (els.authConfigHint) {
      els.authConfigHint.style.display = 'block';
      els.authConfigHint.textContent = `Chi tiết: ${err.message || 'Unknown error'}`;
    }
  }
}

function renderReportSummary(data) {
  if (!els.reportSummary) return;

  const summary = data?.summary || {};
  const rows = Array.isArray(data?.rows) ? data.rows : [];
  const topErrors = Array.isArray(summary.topErrors) ? summary.topErrors : [];

  if (!summary.totalRuns) {
    els.reportSummary.textContent = 'Chưa có dữ liệu report. Hãy chạy full flow để sinh báo cáo.';
    return;
  }

  const latest = rows[0];
  const errorText = topErrors.length
    ? topErrors.map((x) => `${x.errorType}: ${x.count}`).join(' | ')
    : 'Không có';

  els.reportSummary.textContent =
    `Tổng: ${summary.totalRuns} | Success: ${summary.successRuns} | Failed: ${summary.failedRuns} | ` +
    `Tỉ lệ thành công: ${summary.successRate}% | Avg thời gian: ${summary.avgDurationMs || 0}ms | ` +
    `Tổng budget: ${formatCurrency(summary.totalBudget)} | ` +
    `Lỗi nhiều nhất: ${errorText} | Lần chạy gần nhất: ${latest?.createdAt || 'N/A'}`;
}

async function refreshReportSummary() {
  if (!els.reportSummary) return;
  try {
    const query = getReportFilters().toString();
    const data = await apiRequest(`/reports/summary?${query}`, {
      method: 'GET',
      retries: 1,
      timeoutMs: 15000
    });
    renderReportSummary(data);
  } catch (err) {
    els.reportSummary.textContent = `Không tải được báo cáo: ${err.message || 'Unknown error'}`;
  }
}

function parseBatchInput(raw) {
  const lines = raw.split('\n').map((s) => s.trim()).filter(Boolean);
  const items = [];
  const errors = [];
  const defaultPageName = (els.defaultPageName?.value || '').trim();
  const budgetRaw = (els.defaultBudget?.value || '').trim();
  const budget = Number(budgetRaw);

  if (!Number.isFinite(budget) || budget <= 0) {
    errors.push(`Budget chung không hợp lệ: ${budgetRaw || '(trống)'}`);
    return { items, errors };
  }

  for (const [index, line] of lines.entries()) {
    const pageId = line.trim();

    if (!pageId) {
      errors.push(`Dòng ${index + 1} thiếu pageId`);
      continue;
    }

    const pageName = defaultPageName || pageId;

    items.push({ pageId, pageName, budget });
  }

  return { items, errors };
}

function parsePageIdsOnly(raw) {
  return [
    ...new Set(
      String(raw || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    )
  ];
}

function getInputPageIds() {
  const rawPermissionInput = els.permissionInput?.value || els.batchInput?.value || '';
  return parsePageIdsOnly(rawPermissionInput);
}

function formatCurrency(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('vi-VN');
}

function getReportFilters() {
  const params = new URLSearchParams();
  const status = String(els.reportStatus?.value || 'all').trim();
  const adAccountId = String(els.reportAdAccount?.value || '').trim();
  const from = String(els.reportFrom?.value || '').trim();
  const to = String(els.reportTo?.value || '').trim();

  params.set('limit', '200');
  if (status && status !== 'all') params.set('status', status);
  if (adAccountId) params.set('adAccountId', normalizeAdAccountIdInput(adAccountId));
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  return params;
}

function buildPayloadFromFirstItem(item) {
  const adAccountId = normalizeAdAccountIdInput(els.adAccountId.value);
  if (adAccountId && els.adAccountId.value !== adAccountId) {
    els.adAccountId.value = adAccountId;
  }

  return {
    adAccountId,
    campaignName: `AUTO ${item.pageName} - ${item.pageId}`,
    adSetName: `Nhóm QC - ${item.pageName} - ${item.pageId}`,
    adName: `Ad - ${item.pageName} - ${item.pageId}`,
    objective: els.objective.value || 'OUTCOME_ENGAGEMENT',
    dailyBudget: item.budget,
    pageId: item.pageId,
    pageName: item.pageName,
    optimizationGoal: 'CONVERSATIONS',
    postId: els.postId.value.trim() || ''
  };
}

let running = false;

async function scanPermissionsForItems(items, { render = true } = {}) {
  const adAccountId = normalizeAdAccountIdInput(els.adAccountId.value);
  const pageIds = [
    ...new Set(
      items
        .map((item) => String(item.pageId || '').trim())
        .filter(Boolean)
    )
  ];

  if (!adAccountId) {
    throw new Error('Thiếu Ad Account ID.');
  }
  if (els.adAccountId.value !== adAccountId) {
    els.adAccountId.value = adAccountId;
  }

  if (!pageIds.length) {
    throw new Error('Không có pageId để check quyền.');
  }

  const data = await apiRequest('/permissions/scan', {
    method: 'POST',
    body: { adAccountId, pageIds },
    retries: 1
  });

  const blockedPages = (data.pages || []).filter((x) => !x.ok);
  const allowedPages = (data.pages || []).filter((x) => x.ok);

  if (render) {
    if (!data.adAccount?.ok) {
      appendStatus('ACT không có quyền', 'error');
      return data;
    }

    if (!blockedPages.length) {
      appendStatus(`Tất cả ${allowedPages.length} ID đều có quyền`, 'success');
    } else {
      appendStatus(`${blockedPages.length}/${data.pages.length} ID không có quyền`, 'error');

      for (const page of blockedPages) {
        appendStatus(`${page.pageId} không có quyền`, 'error');
      }
    }
  }

  return data;
}

async function checkPermissionsOnly() {
  if (running) return;
  running = true;
  setStatusHtml('');

  try {
    const pageIds = getInputPageIds();
    const items = pageIds.map((pageId) => ({
      pageId,
      pageName: pageId,
      budget: Number(els.defaultBudget?.value || 100)
    }));
    const errors = [];

    if (errors.length) {
      throw new Error(`Lỗi input:\n${errors.join('\n')}`);
    }

    if (!items.length) {
      throw new Error('Không có record hợp lệ.');
    }

    appendStatus('Bắt đầu check quyền trước khi chạy', 'section');
    await scanPermissionsForItems(items, { render: true });
    appendDivider();
    appendStatus('Check quyền xong.', 'section');
  } catch (err) {
    appendStatus(err.message, 'error');
  } finally {
    running = false;
  }
}
async function requestPageAccessForItems(pageIds = []) {
  const businessId = els.businessId?.value?.trim();

  pageIds = [
    ...new Set(
      (pageIds || [])
        .map((id) => String(id || '').trim())
        .filter(Boolean)
    )
  ];

  if (!businessId) {
    throw new Error('Thiếu Business ID.');
  }

  if (!pageIds.length) {
    throw new Error('Không có ID để thêm quyền.');
  }

  appendStatus(`Đang thêm/request quyền cho ${pageIds.length} ID...`, 'running');

  const data = await apiRequest('/permissions/request-page-access', {
    method: 'POST',
    body: {
      businessId,
      pageIds,
      permittedTasks: ['ADVERTISE', 'CREATE_CONTENT']
    },
    retries: 1
  });

  const failed = (data.results || []).filter((x) => !x.ok);
  const success = (data.results || []).filter((x) => x.ok);

  appendStatus(`Đã gửi request/thêm quyền: ${success.length}/${data.total || pageIds.length} ID`, failed.length ? 'running' : 'success');

  for (const item of failed) {
    appendStatus(`${item.pageId} lỗi: ${item.error || item.status}`, 'error');
  }

  return data;
}

async function autoFixPermissionsFlow() {
  if (running) return;
  running = true;
  setStatusHtml('');

  try {
    const pageIds = getInputPageIds();
    const items = pageIds.map((pageId) => ({
      pageId,
      pageName: pageId,
      budget: Number(els.defaultBudget?.value || 100)
    }));

    if (!items.length) {
      throw new Error('Không có pageId để Auto Fix.');
    }

    appendStatus('Auto Fix: check quyền lần 1', 'section');
    const firstScan = await scanPermissionsForItems(items, { render: true });
    if (!firstScan.adAccount?.ok) {
      throw new Error('Ad Account chưa có quyền. Cần cấp quyền BM/TKQC trước.');
    }

    const blockedPageIds = (firstScan.pages || [])
      .filter((x) => !x.ok)
      .map((x) => x.pageId);

    if (!blockedPageIds.length) {
      appendDivider();
      appendStatus('Tất cả pageId đã có quyền. Không cần Auto Fix.', 'success');
      return;
    }

    appendDivider();
    appendStatus(`Auto Fix: đang request quyền cho ${blockedPageIds.length} page`, 'running');
    await requestPageAccessForItems(blockedPageIds);

    appendDivider();
    appendStatus('Auto Fix: check lại quyền sau khi request', 'section');
    const secondScan = await scanPermissionsForItems(items, { render: true });
    const stillBlocked = (secondScan.pages || []).filter((x) => !x.ok);

    appendDivider();
    if (stillBlocked.length) {
      appendStatus(`Còn ${stillBlocked.length} page chưa có quyền. Cần cấp tay trong Business Settings.`, 'error');
    } else {
      appendStatus('Auto Fix hoàn tất: tất cả page đã có quyền.', 'success');
    }
  } catch (err) {
    appendStatus(`Auto Fix lỗi: ${err.message || 'Unknown error'}`, 'error');
  } finally {
    running = false;
  }
}

async function runFullFlow() {
  if (running) return;
  running = true;

  setStatusHtml('');

  try {
    const { items, errors } = parseBatchInput(els.batchInput.value || '');

    if (errors.length) {
      throw new Error(`Lỗi input:\n${errors.join('\n')}`);
    }

    if (!items.length) {
      throw new Error('Không có record hợp lệ.');
    }

    appendStatus(`Bắt đầu chạy ${items.length} dòng`, 'section');

    const permissionScan = await scanPermissionsForItems(items, { render: true });
    if (!permissionScan.adAccount?.ok) {
      throw new Error(`Ad Account chưa có quyền trong token/BM: ${els.adAccountId.value.trim()}`);
    }

    const blockedPageMap = new Map(
      (permissionScan.pages || [])
        .filter((x) => !x.ok)
        .map((x) => [String(x.pageId), x])
    );

    const summary = {
      success: 0,
      failed: 0,
      skippedNoPermission: 0
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const payload = buildPayloadFromFirstItem(item);

      appendDivider();
      appendStatus(`Dòng ${i + 1}/${items.length}: ${item.pageName} (${item.pageId})`, 'running');

      const blocked = blockedPageMap.get(String(item.pageId));
      if (blocked) {
        summary.skippedNoPermission += 1;
        appendStatus(`${item.pageName} - SKIP: page chưa cấp quyền vào Business/token`, 'error');
        continue;
      }

      try {
        const data = await apiRequest('/flow/run-full-draft', {
          method: 'POST',
          body: {
            ...payload,
            operatorName: getOperatorName(),
            businessId: els.businessId?.value?.trim() || ''
          },
          retries: 2,
          timeoutMs: 30000
        });

        summary.success += 1;
        if (data.adsManagerUrl) {
          appendNameLink(item.pageName, data.adsManagerUrl);
        } else {
          appendStatus(`${item.pageName} - Thành công`, 'success');
        }
      } catch (err) {
        summary.failed += 1;
        appendStatus(`${item.pageName} - ${err.message}`, 'error');
      }
    }

    appendDivider();
    appendStatus(`Tổng kết: SUCCESS ${summary.success} | SKIP_NO_PERMISSION ${summary.skippedNoPermission} | FAILED ${summary.failed}`, 'section');
    appendStatus('Đã chạy xong tất cả các dòng.', 'section');
    await refreshReportSummary();
  } catch (err) {
    setStatusHtml('');
    appendStatus(err.message, 'error');
    console.error(err);
  } finally {
    running = false;
  }
}


function openAdsManager() {
  window.open(`${getBackendUrl()}/auth/status`, '_blank');
}

function exportReportCsv() {
  const backend = getBackendUrl();
  if (!backend) {
    appendStatus('Backend URL chưa hợp lệ, không export được CSV.', 'error');
    return;
  }
  const params = getReportFilters();
  params.set('limit', '1000');
  const query = params.toString();
  window.open(`${backend}/reports/export.csv?${query}`, '_blank');
}

els.loginFacebookBtn.addEventListener('click', () => {
  window.open(`${getBackendUrl()}/auth/facebook/start`, '_blank');
});
els.checkBackendBtn?.addEventListener('click', checkFacebookAuth);
els.autoFixPermissionsBtn?.addEventListener('click', autoFixPermissionsFlow);
els.refreshReportBtn?.addEventListener('click', refreshReportSummary);
els.exportReportBtn?.addEventListener('click', exportReportCsv);

els.requestAccessBtn?.addEventListener('click', async () => {
  try {
    appendDivider();

    const pageIds = getInputPageIds();

    if (!pageIds.length) {
      appendStatus('Chưa nhập ID nào trong ô Danh sách pageId.', 'error');
      return;
    }

    await requestPageAccessForItems(pageIds);

    appendStatus('Xong. Bấm Check quyền lại để kiểm tra.', 'success');
  } catch (err) {
    appendStatus(`Lỗi thêm quyền: ${err.message || 'Unknown error'}`, 'error');
  }
});

els.permissionCheckBtn.addEventListener('click', checkPermissionsOnly);
els.runFullFlowBtn.addEventListener('click', runFullFlow);
els.openAdsManagerBtn.addEventListener('click', openAdsManager);
els.backendUrl.addEventListener('change', () => {
  const normalized = normalizeBackendUrl(els.backendUrl.value || '');
  if (normalized) {
    els.backendUrl.value = normalized;
    localStorage.setItem(BACKEND_URL_STORAGE_KEY, normalized);
  }
  checkFacebookAuth();
  refreshReportSummary();
});
els.operatorName?.addEventListener('change', () => {
  getOperatorName();
});
els.adminApiKey?.addEventListener('change', () => {
  getAdminApiKey();
  checkFacebookAuth();
});
els.reportStatus?.addEventListener('change', refreshReportSummary);
els.reportAdAccount?.addEventListener('change', refreshReportSummary);
els.reportFrom?.addEventListener('change', refreshReportSummary);
els.reportTo?.addEventListener('change', refreshReportSummary);
els.adAccountId?.addEventListener('blur', () => {
  const normalized = normalizeAdAccountIdInput(els.adAccountId.value);
  if (normalized) els.adAccountId.value = normalized;
});

setupBackendUrlInput();
setupOperatorInput();
setupAdminKeyInput();
checkFacebookAuth();
refreshReportSummary();