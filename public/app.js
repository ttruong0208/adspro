const $ = (id) => document.getElementById(id);
const ADMIN_API_KEY_STORAGE_KEY = 'adsmanager_admin_api_key';
const OPERATOR_NAME_STORAGE_KEY = 'adsmanager_operator_name';
const LANGUAGE_STORAGE_KEY = 'adsmanager_language';

const els = {
  mainTitle: $('mainTitle'),
  mainSubtitle: $('mainSubtitle'),
  systemStatusText: $('systemStatusText'),
  langViBtn: $('langViBtn'),
  langEnBtn: $('langEnBtn'),
  fbCardTitle: $('fbCardTitle'),
  fbCardSubtitle: $('fbCardSubtitle'),
  authTitle: $('authTitle'),
  backendUrl: $('backendUrl'),
  backendOriginText: $('backendOriginText'),
  backendUrlLabel: $('backendUrlLabel'),
  backendUrlHint: $('backendUrlHint'),
  permissionCardTitle: $('permissionCardTitle'),
  permissionCardSubtitle: $('permissionCardSubtitle'),
  businessIdLabel: $('businessIdLabel'),
  businessIdHint: $('businessIdHint'),
  permissionInputLabel: $('permissionInputLabel'),
  permissionInputHint: $('permissionInputHint'),
  configCardTitle: $('configCardTitle'),
  configCardSubtitle: $('configCardSubtitle'),
  adAccountLabel: $('adAccountLabel'),
  adAccountHint: $('adAccountHint'),
  objectiveLabel: $('objectiveLabel'),
  postIdLabel: $('postIdLabel'),
  postIdHint: $('postIdHint'),
  defaultPageNameLabel: $('defaultPageNameLabel'),
  defaultPageNameHint: $('defaultPageNameHint'),
  defaultBudgetLabel: $('defaultBudgetLabel'),
  defaultBudgetHint: $('defaultBudgetHint'),
  operatorNameLabel: $('operatorNameLabel'),
  adminApiKeyLabel: $('adminApiKeyLabel'),
  batchInputLabel: $('batchInputLabel'),
  batchInputHint: $('batchInputHint'),
  runCardTitle: $('runCardTitle'),
  runCardSubtitle: $('runCardSubtitle'),
  reportCardTitle: $('reportCardTitle'),
  reportCardSubtitle: $('reportCardSubtitle'),
  reportStatusLabel: $('reportStatusLabel'),
  reportAdAccountLabel: $('reportAdAccountLabel'),
  reportFromLabel: $('reportFromLabel'),
  reportToLabel: $('reportToLabel'),
  logCardTitle: $('logCardTitle'),
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

const I18N = {
  vi: {
    appTitle: 'Bot Ads Manager',
    mainSubtitle: 'Bên trái quản lý kết nối/quyền, bên phải chạy full luồng ads.',
    systemStatus: 'Hệ thống hoạt động tốt',
    fbCardTitle: 'Kết nối Facebook',
    fbCardSubtitle: 'Đăng nhập để tool lấy token tự động và gọi Meta API.',
    authTitle: 'Trạng thái kết nối',
    loginFacebook: 'f Đăng nhập Facebook',
    reconnectFacebook: 'Kết nối lại Facebook',
    checkBackend: 'Kiểm tra backend/config',
    permissionCardTitle: 'Quản lý quyền Page',
    permissionCardSubtitle: 'Dùng để check quyền hoặc thêm/request quyền Page vào Business.',
    businessIdLabel: 'Business ID cần thêm quyền vào',
    businessIdHint: 'Lấy trong Business Settings -> Business Info -> Business ID.',
    businessIdPlaceholder: 'VD: 1568088500224087',
    permissionInputLabel: 'Danh sách ID cần thêm/check quyền',
    permissionInputHint:
      'Mỗi dòng 1 ID. Có thể nhập ID sếp gửi, URL Page, hoặc Page ID thật. Nếu để trống, tool sẽ dùng danh sách pageId chạy ads bên phải.',
    permissionCheckBtn: '✓ Check quyền ID',
    requestAccessBtn: '✚ Thêm quyền vào Business',
    autoFixBtn: '⚙ Auto Fix quyền',
    configCardTitle: 'Cấu hình chạy ads',
    configCardSubtitle: 'Nhập thông tin để tạo campaign, ad set, ad và publish.',
    backendUrlLabel: 'Backend URL',
    backendUrlHintPrefix: 'Tự động dùng domain hiện tại:',
    backendUnknown: '(không xác định)',
    adAccountLabel: 'Ad Account ID',
    adAccountHint: 'Dán ID TKQC vào đây. Nhập `289285...` hoặc `act_289285...` đều được.',
    objectiveLabel: 'Objective',
    postIdLabel: 'Post ID dùng cho ad',
    postIdHint: 'Để trống nếu muốn backend tự chọn bài viết hợp lệ đầu tiên.',
    postIdPlaceholder: '123456789_987654321',
    defaultPageNameLabel: 'Page Name dùng chung',
    defaultPageNameHint: 'Nếu để trống, mỗi page sẽ tự dùng pageId làm pageName.',
    defaultPageNamePlaceholder: 'Để trống để lấy pageName = pageId',
    defaultBudgetLabel: 'Budget áp dụng cho tất cả pageId',
    defaultBudgetHint: 'Nếu tài khoản chạy VND thì nhập ngân sách theo VND (ví dụ `100000`).',
    operatorNameLabel: 'Operator (người chạy)',
    operatorNamePlaceholder: 'VD: Truong Nguyen',
    adminApiKeyLabel: 'Admin API Key (nếu bật bảo mật)',
    adminApiKeyPlaceholder: 'Để trống nếu server không bật ADMIN_API_KEY',
    batchInputLabel: 'Danh sách pageId để chạy ads',
    batchInputHint: 'Mỗi dòng 1 pageId để chạy ads. Có thể dùng format: ID sếp gửi | Page ID thật.',
    runCardTitle: 'Chạy full luồng',
    runCardSubtitle: 'Chạy bằng Ad Account và danh sách pageId ở phần cấu hình phía trên.',
    runFullFlowBtn: '▶ Chạy full luồng 1-7',
    openAdsManagerBtn: '↗ Mở Ads Manager',
    refreshReportBtn: '⟳ Tải báo cáo',
    exportReportBtn: '⤓ Export CSV',
    reportCardTitle: 'Báo cáo vận hành',
    reportCardSubtitle: 'Tổng hợp lịch sử chạy ads để gửi khách nhanh.',
    reportStatusLabel: 'Lọc trạng thái',
    reportStatusAll: 'Tất cả',
    reportStatusSuccess: 'Success',
    reportStatusFailed: 'Failed',
    reportAdAccountLabel: 'Lọc theo TKQC',
    reportAdAccountPlaceholder: 'act_123...',
    reportFromLabel: 'Từ ngày',
    reportToLabel: 'Đến ngày',
    reportEmpty: 'Chưa có dữ liệu report. Hãy chạy full flow để sinh báo cáo.',
    reportLoadError: 'Không tải được báo cáo: {{error}}',
    reportSummary:
      'Tổng: {{total}} | Success: {{success}} | Failed: {{failed}} | Tỉ lệ thành công: {{rate}}% | Avg thời gian: {{avg}}ms | Tổng budget: {{budget}} | Lỗi nhiều nhất: {{errors}} | Lần chạy gần nhất: {{latest}}',
    logCardTitle: 'Log',
    statusIdle: 'Chưa chạy.',
    checkingConnection: 'Đang kiểm tra trạng thái kết nối...',
    profileUnknownName: 'Không rõ tên',
    profileUnknownId: 'Không rõ ID',
    connectedAs: 'Đang kết nối: {{name}} | Facebook ID: {{id}}',
    backendInvalidUrl: 'Backend URL chưa hợp lệ.',
    backendHealthFailed: 'Backend health check failed',
    oauthMissing: 'Backend thiếu config OAuth: {{missing}}',
    missingOnBackend: 'Thiếu {{missing}} trên backend',
    setupEnvHint: 'Set env ({{missing}}) rồi restart backend. Redirect hiện tại: {{redirect}}',
    adminKeyRequiredHint: 'Server đang bật ADMIN_API_KEY. Hãy nhập Admin API Key để chạy các API ghi dữ liệu.',
    tokenStatusReadFailed: 'Backend OK nhưng chưa đọc được trạng thái token',
    authStatusDetail: 'Chi tiết auth/status: {{error}}',
    connected: 'Đã kết nối Facebook',
    notConnected: 'Chưa kết nối Facebook',
    backendUnreachable: 'Không kết nối được backend',
    backendUnreachableReason: 'Backend chưa reachable hoặc URL sai',
    detailPrefix: 'Chi tiết: {{error}}',
    noError: 'Không có',
    openAdsManagerLink: 'Mở Ads Manager',
    openLink: 'Mở link',
    invalidBudget: 'Budget chung không hợp lệ: {{value}}',
    missingPageIdAtLine: 'Dòng {{line}} thiếu pageId',
    missingAdAccount: 'Thiếu Ad Account ID.',
    missingPageIdsForCheck: 'Không có pageId để check quyền.',
    actNoPermission: 'ACT không có quyền',
    allIdsAllowed: 'Tất cả {{count}} ID đều có quyền',
    someIdsBlocked: '{{blocked}}/{{total}} ID không có quyền',
    pageNoPermission: '{{id}} không có quyền',
    inputError: 'Lỗi input:\n{{details}}',
    noValidRecord: 'Không có record hợp lệ.',
    startPermissionCheck: 'Bắt đầu check quyền trước khi chạy',
    finishPermissionCheck: 'Check quyền xong.',
    missingBusinessId: 'Thiếu Business ID.',
    noIdToRequest: 'Không có ID để thêm quyền.',
    requestingAccess: 'Đang thêm/request quyền cho {{count}} ID...',
    requestAccessResult: 'Đã gửi request/thêm quyền: {{success}}/{{total}} ID',
    pageErrorLine: '{{id}} lỗi: {{error}}',
    noPageIdForAutoFix: 'Không có pageId để Auto Fix.',
    autoFixFirstCheck: 'Auto Fix: check quyền lần 1',
    adAccountNoPermissionNeedGrant: 'Ad Account chưa có quyền. Cần cấp quyền BM/TKQC trước.',
    noNeedAutoFix: 'Tất cả pageId đã có quyền. Không cần Auto Fix.',
    autoFixRequesting: 'Auto Fix: đang request quyền cho {{count}} page',
    autoFixRecheck: 'Auto Fix: check lại quyền sau khi request',
    stillBlockedNeedManual: 'Còn {{count}} page chưa có quyền. Cần cấp tay trong Business Settings.',
    autoFixDone: 'Auto Fix hoàn tất: tất cả page đã có quyền.',
    autoFixError: 'Auto Fix lỗi: {{error}}',
    startRunRows: 'Bắt đầu chạy {{count}} dòng',
    adAccountNoPermissionInToken: 'Ad Account chưa có quyền trong token/BM: {{id}}',
    runningRow: 'Dòng {{index}}/{{total}}: {{name}} ({{id}})',
    skipNoPermission: '{{name}} - SKIP: page chưa cấp quyền vào Business/token',
    runSuccess: '{{name}} - Thành công',
    runSummary: 'Tổng kết: SUCCESS {{success}} | SKIP_NO_PERMISSION {{skip}} | FAILED {{failed}}',
    runSummaryFailFastSkipped: 'Bỏ qua {{count}} dòng còn lại do fail-fast lỗi quyền.',
    runDone: 'Đã chạy xong tất cả các dòng.',
    failFastPermissionStop: 'Dừng sớm: lỗi quyền ad account/token. Ngừng chạy các dòng còn lại để tránh mất thời gian.',
    adSetPrefix: 'Nhóm QC',
    exportCsvBackendInvalid: 'Backend URL chưa hợp lệ, không export được CSV.',
    noPermissionInputIds: 'Chưa nhập ID nào trong ô Danh sách pageId.',
    requestDoneRecheck: 'Xong. Bấm Check quyền lại để kiểm tra.',
    requestError: 'Lỗi thêm quyền: {{error}}'
  },
  en: {
    appTitle: 'Ads Manager Bot',
    mainSubtitle: 'Manage auth/permissions on the left, run the full ads flow on the right.',
    systemStatus: 'System healthy',
    fbCardTitle: 'Facebook Connection',
    fbCardSubtitle: 'Sign in to fetch token automatically and call Meta APIs.',
    authTitle: 'Connection status',
    loginFacebook: 'f Login with Facebook',
    reconnectFacebook: 'Reconnect Facebook',
    checkBackend: 'Check backend/config',
    permissionCardTitle: 'Page Permission Manager',
    permissionCardSubtitle: 'Check page permissions or request/add page access to Business.',
    businessIdLabel: 'Business ID for page access requests',
    businessIdHint: 'Get it from Business Settings -> Business Info -> Business ID.',
    businessIdPlaceholder: 'e.g. 1568088500224087',
    permissionInputLabel: 'IDs to check/request access',
    permissionInputHint:
      'One ID per line. You can enter IDs from your manager, page URLs, or real Page IDs. If empty, the app uses page IDs from the ads list on the right.',
    permissionCheckBtn: '✓ Check ID permissions',
    requestAccessBtn: '✚ Request/Add access',
    autoFixBtn: '⚙ Auto Fix permissions',
    configCardTitle: 'Ads Run Configuration',
    configCardSubtitle: 'Fill settings to create campaign, ad set, ad, and publish.',
    backendUrlLabel: 'Backend URL',
    backendUrlHintPrefix: 'Auto-using current domain:',
    backendUnknown: '(unknown)',
    adAccountLabel: 'Ad Account ID',
    adAccountHint: 'Paste your ad account ID here. `289285...` or `act_289285...` both work.',
    objectiveLabel: 'Objective',
    postIdLabel: 'Post ID for ads',
    postIdHint: 'Leave empty to let backend auto-pick the first valid post.',
    postIdPlaceholder: '123456789_987654321',
    defaultPageNameLabel: 'Default Page Name',
    defaultPageNameHint: 'If empty, each page uses its own pageId as name.',
    defaultPageNamePlaceholder: 'Leave empty to use pageName = pageId',
    defaultBudgetLabel: 'Default budget for all page IDs',
    defaultBudgetHint: 'For VND accounts, enter VND budget (e.g. `100000`).',
    operatorNameLabel: 'Operator',
    operatorNamePlaceholder: 'E.g. Truong Nguyen',
    adminApiKeyLabel: 'Admin API Key (if security enabled)',
    adminApiKeyPlaceholder: 'Leave empty if ADMIN_API_KEY is disabled on server',
    batchInputLabel: 'Page IDs to run ads',
    batchInputHint: 'One page ID per line. You can use: manager ID | real Page ID format.',
    runCardTitle: 'Run full flow',
    runCardSubtitle: 'Runs with the ad account and page IDs configured above.',
    runFullFlowBtn: '▶ Run full flow 1-7',
    openAdsManagerBtn: '↗ Open Ads Manager',
    refreshReportBtn: '⟳ Refresh report',
    exportReportBtn: '⤓ Export CSV',
    reportCardTitle: 'Operations report',
    reportCardSubtitle: 'Summarized run history for quick client updates.',
    reportStatusLabel: 'Status filter',
    reportStatusAll: 'All',
    reportStatusSuccess: 'Success',
    reportStatusFailed: 'Failed',
    reportAdAccountLabel: 'Filter by ad account',
    reportAdAccountPlaceholder: 'act_123...',
    reportFromLabel: 'From date',
    reportToLabel: 'To date',
    reportEmpty: 'No report data yet. Run the full flow to generate report data.',
    reportLoadError: 'Cannot load report: {{error}}',
    reportSummary:
      'Total: {{total}} | Success: {{success}} | Failed: {{failed}} | Success rate: {{rate}}% | Avg duration: {{avg}}ms | Total budget: {{budget}} | Top errors: {{errors}} | Latest run: {{latest}}',
    logCardTitle: 'Log',
    statusIdle: 'Not started yet.',
    checkingConnection: 'Checking connection status...',
    profileUnknownName: 'Unknown name',
    profileUnknownId: 'Unknown ID',
    connectedAs: 'Connected as: {{name}} | Facebook ID: {{id}}',
    backendInvalidUrl: 'Backend URL is invalid.',
    backendHealthFailed: 'Backend health check failed',
    oauthMissing: 'Backend missing OAuth config: {{missing}}',
    missingOnBackend: 'Missing {{missing}} on backend',
    setupEnvHint: 'Set env ({{missing}}) and restart backend. Current redirect: {{redirect}}',
    adminKeyRequiredHint: 'Server has ADMIN_API_KEY enabled. Enter Admin API Key to use write APIs.',
    tokenStatusReadFailed: 'Backend is healthy but cannot read token status',
    authStatusDetail: 'auth/status detail: {{error}}',
    connected: 'Facebook connected',
    notConnected: 'Facebook not connected',
    backendUnreachable: 'Cannot connect to backend',
    backendUnreachableReason: 'Backend is unreachable or URL is incorrect',
    detailPrefix: 'Detail: {{error}}',
    noError: 'None',
    openAdsManagerLink: 'Open Ads Manager',
    openLink: 'Open link',
    invalidBudget: 'Invalid default budget: {{value}}',
    missingPageIdAtLine: 'Line {{line}} is missing pageId',
    missingAdAccount: 'Missing Ad Account ID.',
    missingPageIdsForCheck: 'No page IDs to check permissions.',
    actNoPermission: 'Ad account has no permission',
    allIdsAllowed: 'All {{count}} IDs have permission',
    someIdsBlocked: '{{blocked}}/{{total}} IDs have no permission',
    pageNoPermission: '{{id}} has no permission',
    inputError: 'Input error:\n{{details}}',
    noValidRecord: 'No valid records found.',
    startPermissionCheck: 'Start permission check before run',
    finishPermissionCheck: 'Permission check completed.',
    missingBusinessId: 'Missing Business ID.',
    noIdToRequest: 'No IDs to request access for.',
    requestingAccess: 'Requesting/adding access for {{count}} IDs...',
    requestAccessResult: 'Requested/added access: {{success}}/{{total}} IDs',
    pageErrorLine: '{{id}} error: {{error}}',
    noPageIdForAutoFix: 'No page IDs for Auto Fix.',
    autoFixFirstCheck: 'Auto Fix: first permission scan',
    adAccountNoPermissionNeedGrant: 'Ad account has no permission. Grant BM/Ad Account access first.',
    noNeedAutoFix: 'All page IDs already have permission. Auto Fix not needed.',
    autoFixRequesting: 'Auto Fix: requesting access for {{count}} pages',
    autoFixRecheck: 'Auto Fix: re-checking permissions after request',
    stillBlockedNeedManual: '{{count}} pages still blocked. Manual grant needed in Business Settings.',
    autoFixDone: 'Auto Fix completed: all pages now have permission.',
    autoFixError: 'Auto Fix error: {{error}}',
    startRunRows: 'Starting run for {{count}} rows',
    adAccountNoPermissionInToken: 'Ad account has no permission in token/BM: {{id}}',
    runningRow: 'Row {{index}}/{{total}}: {{name}} ({{id}})',
    skipNoPermission: '{{name}} - SKIP: page is not granted in Business/token',
    runSuccess: '{{name}} - Success',
    runSummary: 'Summary: SUCCESS {{success}} | SKIP_NO_PERMISSION {{skip}} | FAILED {{failed}}',
    runSummaryFailFastSkipped: 'Skipped {{count}} remaining rows due to permission fail-fast.',
    runDone: 'Completed all rows.',
    failFastPermissionStop: 'Fail-fast: ad account/token permission error. Stopping remaining rows to save time.',
    adSetPrefix: 'Ad Set',
    exportCsvBackendInvalid: 'Backend URL is invalid, cannot export CSV.',
    noPermissionInputIds: 'No IDs entered in the page ID list box.',
    requestDoneRecheck: 'Done. Click Check permissions again to verify.',
    requestError: 'Request access error: {{error}}'
  }
};

let currentLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'vi';
if (!I18N[currentLanguage]) currentLanguage = 'vi';

function t(key, vars = {}) {
  const table = I18N[currentLanguage] || I18N.vi;
  const fallback = I18N.vi[key] || key;
  let text = table[key] || fallback;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replaceAll(`{{${k}}}`, String(v ?? ''));
  }
  return text;
}

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLanguage = lang;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  applyI18n();
  checkFacebookAuth();
  refreshReportSummary();
}

function setText(el, text) {
  if (el) el.textContent = text;
}

function applyI18n() {
  document.documentElement.lang = currentLanguage === 'vi' ? 'vi' : 'en';
  document.title = t('appTitle');

  els.langViBtn?.classList.toggle('active', currentLanguage === 'vi');
  els.langEnBtn?.classList.toggle('active', currentLanguage === 'en');

  setText(els.mainTitle, t('appTitle'));
  setText(els.mainSubtitle, t('mainSubtitle'));
  setText(els.systemStatusText, t('systemStatus'));
  setText(els.fbCardTitle, t('fbCardTitle'));
  setText(els.fbCardSubtitle, t('fbCardSubtitle'));
  setText(els.authTitle, t('authTitle'));
  if (!els.authStatus.classList.contains('ok') && !els.authStatus.classList.contains('warn')) {
    setText(els.authStatus, t('checkingConnection'));
  }
  setLoginButtonState({ text: t('loginFacebook') });
  setText(els.checkBackendBtn, t('checkBackend'));
  setText(els.permissionCardTitle, t('permissionCardTitle'));
  setText(els.permissionCardSubtitle, t('permissionCardSubtitle'));
  setText(els.businessIdLabel, t('businessIdLabel'));
  setText(els.businessIdHint, t('businessIdHint'));
  setText(els.permissionInputLabel, t('permissionInputLabel'));
  setText(els.permissionInputHint, t('permissionInputHint'));
  setText(els.permissionCheckBtn, t('permissionCheckBtn'));
  setText(els.requestAccessBtn, t('requestAccessBtn'));
  setText(els.autoFixPermissionsBtn, t('autoFixBtn'));
  setText(els.configCardTitle, t('configCardTitle'));
  setText(els.configCardSubtitle, t('configCardSubtitle'));
  setText(els.backendUrlLabel, t('backendUrlLabel'));
  setText(els.adAccountLabel, t('adAccountLabel'));
  setText(els.adAccountHint, t('adAccountHint'));
  setText(els.objectiveLabel, t('objectiveLabel'));
  setText(els.postIdLabel, t('postIdLabel'));
  setText(els.postIdHint, t('postIdHint'));
  setText(els.defaultPageNameLabel, t('defaultPageNameLabel'));
  setText(els.defaultPageNameHint, t('defaultPageNameHint'));
  setText(els.defaultBudgetLabel, t('defaultBudgetLabel'));
  setText(els.defaultBudgetHint, t('defaultBudgetHint'));
  setText(els.operatorNameLabel, t('operatorNameLabel'));
  setText(els.adminApiKeyLabel, t('adminApiKeyLabel'));
  setText(els.batchInputLabel, t('batchInputLabel'));
  setText(els.batchInputHint, t('batchInputHint'));
  setText(els.runCardTitle, t('runCardTitle'));
  setText(els.runCardSubtitle, t('runCardSubtitle'));
  setText(els.runFullFlowBtn, t('runFullFlowBtn'));
  setText(els.openAdsManagerBtn, t('openAdsManagerBtn'));
  setText(els.refreshReportBtn, t('refreshReportBtn'));
  setText(els.exportReportBtn, t('exportReportBtn'));
  setText(els.reportCardTitle, t('reportCardTitle'));
  setText(els.reportCardSubtitle, t('reportCardSubtitle'));
  setText(els.reportStatusLabel, t('reportStatusLabel'));
  setText(els.reportAdAccountLabel, t('reportAdAccountLabel'));
  setText(els.reportFromLabel, t('reportFromLabel'));
  setText(els.reportToLabel, t('reportToLabel'));
  setText(els.logCardTitle, t('logCardTitle'));

  if (els.reportStatus) {
    for (const option of els.reportStatus.options) {
      if (option.value === 'all') option.textContent = t('reportStatusAll');
      if (option.value === 'success') option.textContent = t('reportStatusSuccess');
      if (option.value === 'failed') option.textContent = t('reportStatusFailed');
    }
  }

  if (els.operatorName && !els.operatorName.value) {
    els.operatorName.placeholder = t('operatorNamePlaceholder');
  }
  if (els.businessId) {
    els.businessId.placeholder = t('businessIdPlaceholder');
  }
  if (els.postId) {
    els.postId.placeholder = t('postIdPlaceholder');
  }
  if (els.defaultPageName) {
    els.defaultPageName.placeholder = t('defaultPageNamePlaceholder');
  }
  if (els.adminApiKey && !els.adminApiKey.value) {
    els.adminApiKey.placeholder = t('adminApiKeyPlaceholder');
  }
  if (els.reportAdAccount) {
    els.reportAdAccount.placeholder = t('reportAdAccountPlaceholder');
  }
  if (els.status && (!els.status.textContent || els.status.textContent.trim() === 'Chưa chạy.' || els.status.textContent.trim() === 'Not started yet.')) {
    els.status.textContent = t('statusIdle');
  }

  const backendOrigin = resolveDefaultBackendUrl() || t('backendUnknown');
  if (els.backendOriginText) {
    els.backendOriginText.textContent = backendOrigin;
  }
  if (els.backendUrlHint) {
    els.backendUrlHint.innerHTML = `${escapeHtml(t('backendUrlHintPrefix'))} <span id="backendOriginText">${escapeHtml(backendOrigin)}</span>`;
    els.backendOriginText = $('backendOriginText');
  }
}

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
      🔗 ${safeLabel}: <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openAdsManagerLink'))}</a>
    </div>
  `;
}

function appendNameLink(name, url) {
  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);

  els.status.innerHTML += `
    <div class="log-line log-success">
      ✅ ${safeName} - <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLink'))}</a>
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
  const resolved = resolveDefaultBackendUrl() || normalizeBackendUrl(els.backendUrl?.value || '');
  if (els.backendUrl) {
    els.backendUrl.value = resolved || '';
  }
  if (els.backendOriginText) {
    els.backendOriginText.textContent = resolved || t('backendUnknown');
  }
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
  const byDomain = resolveDefaultBackendUrl();
  if (byDomain) return byDomain;
  return normalizeBackendUrl(els.backendUrl?.value || '');
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
  if (!backend) throw new Error(t('backendInvalidUrl'));

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
    const requestError = new Error(data?.error || `HTTP ${response.status}`);
    requestError.status = response.status;
    requestError.errorType = data?.errorType || null;
    requestError.meta = data?.meta || null;
    throw requestError;
  }

  return data;
}

function isPermissionDeniedError(err) {
  const errorType = String(err?.errorType || '').toUpperCase();
  const message = String(err?.message || '').toLowerCase();
  const looksLikeAdAccountPermission =
    message.includes('tài khoản quảng cáo') ||
    message.includes('tai khoan quang cao') ||
    message.includes('ad account') ||
    message.includes('account') ||
    message.includes('token');
  const looksLikePagePermission =
    message.includes('page') ||
    message.includes('trang');

  if (errorType === 'NO_PERMISSION' && looksLikeAdAccountPermission && !looksLikePagePermission) {
    return true;
  }

  return (
    (message.includes('không có quyền ghi') || message.includes('khong co quyen ghi')) &&
      looksLikeAdAccountPermission
  );
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

  const name = profile.name || t('profileUnknownName');
  const id = profile.id || t('profileUnknownId');

  els.fbIdentity.style.display = 'block';
  els.fbIdentity.textContent = t('connectedAs', { name, id });
}

async function checkFacebookAuth() {
  els.authStatus.className = 'auth-status';
  els.authStatus.textContent = t('checkingConnection');
  if (els.authConfigHint) {
    els.authConfigHint.style.display = 'none';
    els.authConfigHint.textContent = '';
  }

  try {
    const [healthData, configData] = await Promise.all([
      apiRequest('/health', { method: 'GET', retries: 1, timeoutMs: 12000 }),
      apiRequest('/auth/config', { method: 'GET', retries: 1, timeoutMs: 12000 })
    ]);

    if (!healthData?.ok) {
      throw new Error(t('backendHealthFailed'));
    }

    if (configData?.ok === false) {
      const missing = Array.isArray(configData?.missing) ? configData.missing : [];
      const missingText = missing.length ? missing.join(', ') : 'META_APP_ID/META_APP_SECRET';
      els.authStatus.textContent = t('oauthMissing', { missing: missingText });
      els.authStatus.className = 'auth-status warn';
      setLoginButtonState({
        disabled: true,
        text: t('loginFacebook'),
        reason: t('missingOnBackend', { missing: missingText })
      });
      renderFacebookIdentity(null);

      if (els.authConfigHint) {
        els.authConfigHint.style.display = 'block';
        els.authConfigHint.textContent = t('setupEnvHint', {
          missing: missingText,
          redirect: configData?.redirectUri || t('backendUnknown')
        });
      }
      return;
    }

    setLoginButtonState({ disabled: false, reason: '' });

    if (configData?.adminKeyRequired && !getAdminApiKey() && els.authConfigHint) {
      els.authConfigHint.style.display = 'block';
      els.authConfigHint.textContent = t('adminKeyRequiredHint');
    }

    let statusData = null;
    try {
      statusData = await apiRequest('/auth/status', {
        method: 'GET',
        retries: 1,
        timeoutMs: 12000
      });
    } catch (statusErr) {
      els.authStatus.textContent = t('tokenStatusReadFailed');
      els.authStatus.className = 'auth-status warn';
      setLoginButtonState({ text: t('loginFacebook'), disabled: false, reason: '' });
      renderFacebookIdentity(null);
      if (els.authConfigHint) {
        els.authConfigHint.style.display = 'block';
        els.authConfigHint.textContent = t('authStatusDetail', {
          error: statusErr.message || 'Unknown error'
        });
      }
      return;
    }

    if (statusData?.hasToken) {
      els.authStatus.textContent = t('connected');
      els.authStatus.className = 'auth-status ok';
      setLoginButtonState({ text: t('reconnectFacebook') });
      renderFacebookIdentity(statusData.profile || null);
    } else {
      els.authStatus.textContent = t('notConnected');
      els.authStatus.className = 'auth-status warn';
      setLoginButtonState({ text: t('loginFacebook') });
      renderFacebookIdentity(null);
    }
  } catch (err) {
    els.authStatus.textContent = t('backendUnreachable');
    els.authStatus.className = 'auth-status warn';
    setLoginButtonState({
      disabled: true,
      text: t('loginFacebook'),
      reason: t('backendUnreachableReason')
    });
    renderFacebookIdentity(null);
    if (els.authConfigHint) {
      els.authConfigHint.style.display = 'block';
      els.authConfigHint.textContent = t('detailPrefix', { error: err.message || 'Unknown error' });
    }
  }
}

function renderReportSummary(data) {
  if (!els.reportSummary) return;

  const summary = data?.summary || {};
  const rows = Array.isArray(data?.rows) ? data.rows : [];
  const topErrors = Array.isArray(summary.topErrors) ? summary.topErrors : [];

  if (!summary.totalRuns) {
    els.reportSummary.textContent = t('reportEmpty');
    return;
  }

  const latest = rows[0];
  const errorText = topErrors.length
    ? topErrors.map((x) => `${x.errorType}: ${x.count}`).join(' | ')
    : t('noError');

  els.reportSummary.textContent = t('reportSummary', {
    total: summary.totalRuns,
    success: summary.successRuns,
    failed: summary.failedRuns,
    rate: summary.successRate,
    avg: summary.avgDurationMs || 0,
    budget: formatCurrency(summary.totalBudget),
    errors: errorText,
    latest: latest?.createdAt || 'N/A'
  });
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
    els.reportSummary.textContent = t('reportLoadError', { error: err.message || 'Unknown error' });
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
    errors.push(t('invalidBudget', { value: budgetRaw || '(empty)' }));
    return { items, errors };
  }

  for (const [index, line] of lines.entries()) {
    const pageId = line.trim();

    if (!pageId) {
      errors.push(t('missingPageIdAtLine', { line: index + 1 }));
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
    adSetName: `${t('adSetPrefix')} - ${item.pageName} - ${item.pageId}`,
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
    throw new Error(t('missingAdAccount'));
  }
  if (els.adAccountId.value !== adAccountId) {
    els.adAccountId.value = adAccountId;
  }

  if (!pageIds.length) {
    throw new Error(t('missingPageIdsForCheck'));
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
      appendStatus(t('actNoPermission'), 'error');
      return data;
    }

    if (!blockedPages.length) {
      appendStatus(t('allIdsAllowed', { count: allowedPages.length }), 'success');
    } else {
      appendStatus(
        t('someIdsBlocked', { blocked: blockedPages.length, total: data.pages.length }),
        'error'
      );

      for (const page of blockedPages) {
        appendStatus(t('pageNoPermission', { id: page.pageId }), 'error');
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
      throw new Error(t('inputError', { details: errors.join('\n') }));
    }

    if (!items.length) {
      throw new Error(t('noValidRecord'));
    }

    appendStatus(t('startPermissionCheck'), 'section');
    await scanPermissionsForItems(items, { render: true });
    appendDivider();
    appendStatus(t('finishPermissionCheck'), 'section');
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
    throw new Error(t('missingBusinessId'));
  }

  if (!pageIds.length) {
    throw new Error(t('noIdToRequest'));
  }

  appendStatus(t('requestingAccess', { count: pageIds.length }), 'running');

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

  appendStatus(
    t('requestAccessResult', { success: success.length, total: data.total || pageIds.length }),
    failed.length ? 'running' : 'success'
  );

  for (const item of failed) {
    appendStatus(t('pageErrorLine', { id: item.pageId, error: item.error || item.status }), 'error');
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
      throw new Error(t('noPageIdForAutoFix'));
    }

    appendStatus(t('autoFixFirstCheck'), 'section');
    const firstScan = await scanPermissionsForItems(items, { render: true });
    if (!firstScan.adAccount?.ok) {
      throw new Error(t('adAccountNoPermissionNeedGrant'));
    }

    const blockedPageIds = (firstScan.pages || [])
      .filter((x) => !x.ok)
      .map((x) => x.pageId);

    if (!blockedPageIds.length) {
      appendDivider();
      appendStatus(t('noNeedAutoFix'), 'success');
      return;
    }

    appendDivider();
    appendStatus(t('autoFixRequesting', { count: blockedPageIds.length }), 'running');
    await requestPageAccessForItems(blockedPageIds);

    appendDivider();
    appendStatus(t('autoFixRecheck'), 'section');
    const secondScan = await scanPermissionsForItems(items, { render: true });
    const stillBlocked = (secondScan.pages || []).filter((x) => !x.ok);

    appendDivider();
    if (stillBlocked.length) {
      appendStatus(t('stillBlockedNeedManual', { count: stillBlocked.length }), 'error');
    } else {
      appendStatus(t('autoFixDone'), 'success');
    }
  } catch (err) {
    appendStatus(t('autoFixError', { error: err.message || 'Unknown error' }), 'error');
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
      throw new Error(t('inputError', { details: errors.join('\n') }));
    }

    if (!items.length) {
      throw new Error(t('noValidRecord'));
    }

    appendStatus(t('startRunRows', { count: items.length }), 'section');

    const permissionScan = await scanPermissionsForItems(items, { render: true });
    if (!permissionScan.adAccount?.ok) {
      throw new Error(t('adAccountNoPermissionInToken', { id: els.adAccountId.value.trim() }));
    }

    const blockedPageMap = new Map(
      (permissionScan.pages || [])
        .filter((x) => !x.ok)
        .map((x) => [String(x.pageId), x])
    );

    const summary = {
      success: 0,
      failed: 0,
      skippedNoPermission: 0,
      skippedByFailFast: 0
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const payload = buildPayloadFromFirstItem(item);

      appendDivider();
      appendStatus(
        t('runningRow', { index: i + 1, total: items.length, name: item.pageName, id: item.pageId }),
        'running'
      );

      const blocked = blockedPageMap.get(String(item.pageId));
      if (blocked) {
        summary.skippedNoPermission += 1;
        appendStatus(t('skipNoPermission', { name: item.pageName }), 'error');
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
          appendStatus(t('runSuccess', { name: item.pageName }), 'success');
        }
      } catch (err) {
        summary.failed += 1;
        appendStatus(`${item.pageName} - ${err.message}`, 'error');

        if (isPermissionDeniedError(err)) {
          const remain = Math.max(items.length - (i + 1), 0);
          summary.skippedByFailFast += remain;
          appendStatus(t('failFastPermissionStop'), 'section');
          break;
        }
      }
    }

    appendDivider();
    appendStatus(
      t('runSummary', {
        success: summary.success,
        skip: summary.skippedNoPermission,
        failed: summary.failed
      }),
      'section'
    );
    if (summary.skippedByFailFast > 0) {
      appendStatus(
        t('runSummaryFailFastSkipped', { count: summary.skippedByFailFast }),
        'section'
      );
    }
    appendStatus(t('runDone'), 'section');
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
    appendStatus(t('exportCsvBackendInvalid'), 'error');
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
      appendStatus(t('noPermissionInputIds'), 'error');
      return;
    }

    await requestPageAccessForItems(pageIds);

    appendStatus(t('requestDoneRecheck'), 'success');
  } catch (err) {
    appendStatus(t('requestError', { error: err.message || 'Unknown error' }), 'error');
  }
});

els.permissionCheckBtn.addEventListener('click', checkPermissionsOnly);
els.runFullFlowBtn.addEventListener('click', runFullFlow);
els.openAdsManagerBtn.addEventListener('click', openAdsManager);
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
els.langViBtn?.addEventListener('click', () => setLanguage('vi'));
els.langEnBtn?.addEventListener('click', () => setLanguage('en'));
els.adAccountId?.addEventListener('blur', () => {
  const normalized = normalizeAdAccountIdInput(els.adAccountId.value);
  if (normalized) els.adAccountId.value = normalized;
});

setupBackendUrlInput();
setupOperatorInput();
setupAdminKeyInput();
applyI18n();
checkFacebookAuth();
refreshReportSummary();