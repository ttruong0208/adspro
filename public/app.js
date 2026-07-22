const $ = (id) => document.getElementById(id);
const ADMIN_API_KEY_STORAGE_KEY = 'adsmanager_admin_api_key';
const OPERATOR_NAME_STORAGE_KEY = 'adsmanager_operator_name';
const LANGUAGE_STORAGE_KEY = 'adsmanager_language';
const BUDGET_CURRENCY_STORAGE_KEY = 'adsmanager_budget_currency';
const USD_FX_RATE_STORAGE_KEY = 'adsmanager_usd_fx_rate';
const DEFAULT_USD_FX_RATE = 25000;

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
  campaignType: $('campaignType'),
  leadFormId: $('leadFormId'),
  leadFormIdField: $('leadFormIdField'),
  targetLatitude: $('targetLatitude'),
  targetLongitude: $('targetLongitude'),
  targetRadiusKm: $('targetRadiusKm'),
  postId: $('postId'),
  defaultPageName: $('defaultPageName'),
  defaultBudget: $('defaultBudget'),
  budgetCurrency: $('budgetCurrency'),
  usdFxRate: $('usdFxRate'),
  fxRateField: $('fxRateField'),
  budgetConvertPreview: $('budgetConvertPreview'),
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
    mainSubtitle: 'Batch Facebook Ads Automation',
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
    defaultBudgetLabel: 'Budget / ngày',
    defaultBudgetHint: 'Chọn USD: nhập đô (1 = $1). Chọn VND: hiện tỷ giá, nhập tiền Việt rồi tool đổi sang USD. Dưới min sẽ báo đỏ.',
    operatorNameLabel: 'Operator (người chạy)',
    operatorNamePlaceholder: 'VD: Truong Nguyen',
    adminApiKeyLabel: 'Admin API Key (nếu bật bảo mật)',
    adminApiKeyPlaceholder: 'Để trống nếu server không bật ADMIN_API_KEY',
    batchInputLabel: 'Danh sách pageId để chạy ads',
    batchInputHint: '1 dòng: cách nhau bằng dấu cách / phẩy. Có thể: pageId|formId.',
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
    missingLeadFormId: 'Chế độ thu lead cần Lead Form ID. Nhập ở ô Lead Form ID, hoặc theo từng dòng dạng: pageId|formId. Thiếu ở dòng: {{lines}}',
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
    mainSubtitle: 'Batch Facebook Ads Automation',
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
    defaultBudgetLabel: 'Daily budget',
    defaultBudgetHint: 'USD: enter dollars (1 = $1). VND: show FX rate, convert to USD. Below min shows a red error.',
    operatorNameLabel: 'Operator',
    operatorNamePlaceholder: 'E.g. Truong Nguyen',
    adminApiKeyLabel: 'Admin API Key (if security enabled)',
    adminApiKeyPlaceholder: 'Leave empty if ADMIN_API_KEY is disabled on server',
    batchInputLabel: 'Page IDs to run ads',
    batchInputHint: 'One line: separate by space/comma. Optional: pageId|formId.',
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
    missingLeadFormId: 'Lead form mode needs a Lead Form ID. Enter it in the Lead Form ID box, or per line as: pageId|formId. Missing at lines: {{lines}}',
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

  const reportsBadge = document.getElementById('navBadgeReports');
  if (reportsBadge) {
    const total = Number(summary.totalRuns) || 0;
    reportsBadge.style.display = total > 0 ? '' : 'none';
    reportsBadge.textContent = total > 999 ? '999+' : String(total);
  }

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
  const tokens = String(raw || '')
    .replaceAll('\t', ' ')
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const items = [];
  const errors = [];
  const defaultPageName = (els.defaultPageName?.value || '').trim();
  const budgetRaw = (els.defaultBudget?.value || '').trim();
  const budgetInput = Number(budgetRaw);
  const resolved = resolveCampaignMetaBudget(budgetInput);

  if (!resolved.ok) {
    errors.push(resolved.error || t('invalidBudget', { value: budgetRaw || '(empty)' }));
    return { items, errors, resolvedBudget: null };
  }

  for (const [index, token] of tokens.entries()) {
    const [rawPageId, rawFormId] = token.split('|').map((x) => (x || '').trim());
    const pageId = rawPageId;
    const leadFormId = rawFormId || '';

    if (!pageId) {
      errors.push(t('missingPageIdAtLine', { line: index + 1 }));
      continue;
    }

    const pageName = defaultPageName || pageId;

    items.push({ pageId, pageName, budget: resolved.metaBudget, leadFormId });
  }

  return { items, errors, resolvedBudget: resolved };
}

function parsePageIdsOnly(raw) {
  return [
    ...new Set(
      String(raw || '')
        .replaceAll('\t', ' ')
        .split(/[\s,;\n\r]+/)
        .map((line) => line.trim())
        .filter(Boolean)
    )
  ];
}

function normalizeIdListToSingleColumn(raw) {
  const values = String(raw || '')
    .replaceAll('\t', '\n')
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter(Boolean);

  return [...new Set(values)].join('\n');
}

/** Chuẩn hóa list page thành 1 dòng (cách nhau bằng space). */
function normalizeIdListToSingleLine(raw) {
  const values = String(raw || '')
    .replaceAll('\t', ' ')
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter(Boolean);

  return [...new Set(values)].join(' ');
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

/** Fallback min Meta (USD cent) nếu API chưa trả — thường $1/ngày. */
const DEFAULT_MIN_DAILY_BUDGET_CENTS = 100;

let adAccountBudgetInfo = {
  currency: null,
  minDailyBudgetRaw: DEFAULT_MIN_DAILY_BUDGET_CENTS,
  loaded: false,
  adAccountId: ''
};

/** Meta: USD/offset 100 = cent; VND/JPY... offset 1 = đơn vị nguyên. */
function getCurrencyOffset(currency) {
  const c = String(currency || '').toUpperCase();
  if (['VND', 'JPY', 'KRW', 'CLP', 'ISK', 'UGX', 'VUV', 'XAF', 'XOF', 'XPF'].includes(c)) {
    return 1;
  }
  return 100;
}

function interpretAdAccountMin(minRaw, currency) {
  const raw = Number(minRaw);
  const cur = String(currency || '').toUpperCase();
  const rate = getUsdFxRate();

  if (!Number.isFinite(raw) || raw <= 0) {
    return {
      minRaw: DEFAULT_MIN_DAILY_BUDGET_CENTS,
      minUsd: 1,
      label: '$1.00 (mặc định)'
    };
  }

  // TK VND: min_daily_budget là số VND (VD 26411), KHÔNG phải cent USD.
  if (cur === 'VND' || (!cur && raw >= 1000)) {
    const minUsd = raw / rate;
    return {
      minRaw: raw,
      minUsd,
      accountCurrency: cur || 'VND',
      label: `${formatCurrency(raw)} VND ≈ $${formatUsd(minUsd)}`
    };
  }

  // USD và tiền có cent: raw là cent
  const minUsd = raw / 100;
  // Min USD thực tế hiếm khi > $50/ngày — nếu lớn bất thường, có thể API trả VND.
  if (cur === 'USD' && raw > 5000) {
    const asVndUsd = raw / rate;
    return {
      minRaw: raw,
      minUsd: asVndUsd,
      accountCurrency: 'VND?',
      label: `${formatCurrency(raw)} (có vẻ VND) ≈ $${formatUsd(asVndUsd)}`
    };
  }

  return {
    minRaw: raw,
    minUsd,
    accountCurrency: cur || 'USD',
    label: `$${formatUsd(minUsd)}`
  };
}

/** Đổi budget người dùng nhập → số gửi Meta (đúng đơn vị tiền TKQC). */
function resolveMetaDailyBudget(rawAmount, currency, fxRate) {
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, metaBudget: 0, usd: 0, error: 'Budget không hợp lệ' };
  }

  const mode = String(currency || 'USD').toUpperCase();
  const rate = Number(fxRate);
  const safeRate = Number.isFinite(rate) && rate >= 1000 ? rate : DEFAULT_USD_FX_RATE;
  const acctCur = String(adAccountBudgetInfo.currency || '').toUpperCase();
  const acctIsVnd = acctCur === 'VND' || (!acctCur && Number(adAccountBudgetInfo.minDailyBudgetRaw) >= 1000);

  // TK VND: Meta nhận số VND nguyên (không nhân 100).
  if (acctIsVnd) {
    if (mode === 'USD') {
      const vnd = Math.round(amount * safeRate);
      return {
        ok: vnd > 0,
        metaBudget: vnd,
        usd: amount,
        input: amount,
        currency: 'USD',
        fxRate: safeRate,
        label: `$${formatUsd(amount)} ≈ ${formatCurrency(vnd)} VND • gửi Meta ${formatCurrency(vnd)} (TK VND)`,
        error: vnd > 0 ? null : 'Budget không hợp lệ'
      };
    }
    const vnd = Math.round(amount);
    const usd = vnd / safeRate;
    return {
      ok: vnd > 0,
      metaBudget: vnd,
      usd,
      input: amount,
      currency: 'VND',
      fxRate: safeRate,
      label: `${formatCurrency(vnd)} VND ≈ $${formatUsd(usd)} • gửi Meta ${formatCurrency(vnd)} (TK VND)`,
      error: vnd > 0 ? null : 'Budget không hợp lệ'
    };
  }

  // TK USD: Meta nhận cent.
  if (mode === 'VND') {
    const usd = amount / safeRate;
    const cents = Math.round(usd * 100);
    return {
      ok: cents > 0,
      metaBudget: cents,
      usd,
      input: amount,
      currency: 'VND',
      fxRate: safeRate,
      label: `${formatCurrency(amount)} VND ≈ $${formatUsd(usd)} (gửi Meta ${cents} cent)`,
      error: cents > 0 ? null : 'Sau quy đổi budget = 0'
    };
  }

  const cents = Math.round(amount * 100);
  const vndEq = Math.round(amount * safeRate);
  return {
    ok: cents > 0,
    metaBudget: cents,
    usd: amount,
    input: amount,
    currency: 'USD',
    fxRate: safeRate,
    label: `$${formatUsd(amount)} ≈ ${formatCurrency(vndEq)} VND (tỷ giá ${formatCurrency(safeRate)}) • gửi Meta ${cents} cent`,
    error: cents > 0 ? null : 'Budget không hợp lệ'
  };
}

function getBudgetCurrency() {
  return String(els.budgetCurrency?.value || localStorage.getItem(BUDGET_CURRENCY_STORAGE_KEY) || 'USD').toUpperCase();
}

function getUsdFxRate() {
  const fromInput = Number(els.usdFxRate?.value);
  // Tỷ giá VND/USD hợp lệ thường > 10.000; tránh giá trị lỗi (1, 2...) làm quy đổi sai.
  if (Number.isFinite(fromInput) && fromInput >= 1000) return fromInput;
  const saved = Number(localStorage.getItem(USD_FX_RATE_STORAGE_KEY));
  if (Number.isFinite(saved) && saved >= 1000) return saved;
  return DEFAULT_USD_FX_RATE;
}

function formatUsd(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '0';
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

function resolveCampaignMetaBudget(rawAmount) {
  return resolveMetaDailyBudget(rawAmount, getBudgetCurrency(), getUsdFxRate());
}

function getEffectiveMinInfo() {
  return interpretAdAccountMin(
    adAccountBudgetInfo.minDailyBudgetRaw,
    adAccountBudgetInfo.currency
  );
}

function applyBudgetMinError(el, resolved) {
  if (!el) return true;
  if (!resolved?.ok) {
    el.style.display = 'block';
    el.textContent = `❌ ${resolved?.error || 'Budget không hợp lệ'}`;
    return false;
  }
  const minInfo = getEffectiveMinInfo();
  // Chỉ so theo USD để tránh lệch đơn vị (cent USD vs VND).
  if (resolved.usd + 1e-9 < minInfo.minUsd) {
    el.style.display = 'block';
    el.textContent =
      `❌ Ngân sách không đủ — min TK ≈ ${minInfo.label}. Bạn đang đặt $${formatUsd(resolved.usd)}.`;
    return false;
  }
  el.style.display = 'none';
  el.textContent = '';
  return true;
}

function applyCurrencyUi({ currencySelect, budgetInput, fxField, iconEl, isBulk = false }) {
  const currency = String(currencySelect?.value || 'USD').toUpperCase();
  if (fxField) fxField.style.display = currency === 'VND' ? '' : 'none';
  if (iconEl) iconEl.textContent = currency === 'VND' ? '₫' : '$';
  if (budgetInput) {
    if (currency === 'USD') {
      budgetInput.step = '0.01';
      budgetInput.placeholder = '1';
      // Đổi từ VND sang USD: nếu số đang lớn kiểu VND thì reset về 1
      const n = Number(budgetInput.value);
      if (Number.isFinite(n) && n >= 100) budgetInput.value = '1';
    } else {
      budgetInput.step = '1000';
      budgetInput.placeholder = '100000';
      const n = Number(budgetInput.value);
      if (Number.isFinite(n) && n > 0 && n < 100) {
        budgetInput.value = String(Math.round(n * getUsdFxRate()));
      } else if (!Number.isFinite(n) || n <= 0) {
        budgetInput.value = '100000';
      }
    }
  }
}

function updateBudgetConvertPreview() {
  const currency = getBudgetCurrency();
  if (els.fxRateField) els.fxRateField.style.display = currency === 'VND' ? '' : 'none';
  const iconEl = $('budgetInputIcon');
  if (iconEl) iconEl.textContent = currency === 'VND' ? '₫' : '$';

  const preview = els.budgetConvertPreview;
  const errEl = $('budgetMinError');
  const amount = Number(els.defaultBudget?.value);

  if (!preview) return;
  if (!Number.isFinite(amount) || amount <= 0) {
    preview.textContent = currency === 'USD' ? 'Nhập số đô (VD 1 = $1/ngày).' : 'Nhập số VND để quy đổi sang USD.';
    preview.style.color = 'var(--primary)';
    if (errEl) {
      errEl.style.display = 'none';
      errEl.textContent = '';
    }
    return;
  }

  const resolved = resolveCampaignMetaBudget(amount);
  const okMin = applyBudgetMinError(errEl, resolved);
  preview.style.color = okMin ? 'var(--primary)' : '#b91c1c';
  preview.textContent = resolved.ok
    ? `↔ ${resolved.label}${adAccountBudgetInfo.loaded ? ` • Min TK: ${getEffectiveMinInfo().label}` : ''}`
    : resolved.error;

  try {
    localStorage.setItem(BUDGET_CURRENCY_STORAGE_KEY, currency);
    localStorage.setItem(USD_FX_RATE_STORAGE_KEY, String(getUsdFxRate()));
  } catch {
    // ignore
  }
}

function syncBulkBudgetCurrencyFromCampaign() {
  const bulkCur = $('bulkBudgetCurrency');
  const bulkFx = $('bulkUsdFxRate');
  if (bulkCur && els.budgetCurrency) bulkCur.value = els.budgetCurrency.value;
  if (bulkFx && els.usdFxRate) bulkFx.value = els.usdFxRate.value;
  applyCurrencyUi({
    currencySelect: bulkCur,
    budgetInput: $('bulkBudget'),
    fxField: $('bulkFxRateField'),
    iconEl: $('bulkBudgetInputIcon'),
    isBulk: true
  });
  updateBulkBudgetConvertPreview();
}

function updateBulkBudgetConvertPreview() {
  const currencySelect = $('bulkBudgetCurrency');
  const currency = String(currencySelect?.value || 'USD').toUpperCase();
  if ($('bulkFxRateField')) $('bulkFxRateField').style.display = currency === 'VND' ? '' : 'none';
  const iconEl = $('bulkBudgetInputIcon');
  if (iconEl) iconEl.textContent = currency === 'VND' ? '₫' : '$';

  const preview = $('bulkBudgetConvertPreview');
  const errEl = $('bulkBudgetMinError');
  if (!preview) return;

  const amount = Number($('bulkBudget')?.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    preview.textContent = currency === 'USD' ? 'Nhập số đô (VD 1 = $1/ngày).' : 'Nhập số VND để quy đổi sang USD.';
    preview.style.color = 'var(--primary)';
    if (errEl) {
      errEl.style.display = 'none';
      errEl.textContent = '';
    }
    return;
  }
  const fx = Number($('bulkUsdFxRate')?.value) || getUsdFxRate();
  const resolved = resolveMetaDailyBudget(amount, currency, fx);
  const okMin = applyBudgetMinError(errEl, resolved);
  preview.style.color = okMin ? 'var(--primary)' : '#b91c1c';
  preview.textContent = resolved.ok ? `↔ ${resolved.label}` : resolved.error;
}

async function refreshAdAccountBudgetInfo(adAccountIdRaw) {
  const adAccountId = normalizeAdAccountIdInput(adAccountIdRaw || els.adAccountId?.value || '');
  if (!adAccountId) return null;
  try {
    const data = await apiRequest(`/accounts/${encodeURIComponent(adAccountId)}`, {
      method: 'GET',
      retries: 1,
      timeoutMs: 15000
    });
    const min = Number(data?.min_daily_budget);
    adAccountBudgetInfo = {
      currency: data?.currency || null,
      minDailyBudgetRaw: Number.isFinite(min) && min > 0 ? min : DEFAULT_MIN_DAILY_BUDGET_CENTS,
      loaded: true,
      adAccountId
    };
    updateBudgetConvertPreview();
    updateBulkBudgetConvertPreview();
    return adAccountBudgetInfo;
  } catch {
    adAccountBudgetInfo = {
      currency: null,
      minDailyBudgetRaw: DEFAULT_MIN_DAILY_BUDGET_CENTS,
      loaded: false,
      adAccountId
    };
    updateBudgetConvertPreview();
    updateBulkBudgetConvertPreview();
    return null;
  }
}

function assertBudgetMeetsMinimum(resolved) {
  if (!resolved?.ok) throw new Error(resolved?.error || 'Budget không hợp lệ');
  const minInfo = getEffectiveMinInfo();
  if (resolved.usd + 1e-9 < minInfo.minUsd) {
    throw new Error(
      `Ngân sách không đủ: min TK ≈ ${minInfo.label}, bạn đang đặt $${formatUsd(resolved.usd)}`
    );
  }
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

  const campaignType = String(els.campaignType?.value || 'messenger');
  const isLeadForm = campaignType === 'lead_form';
  const leadFormId = String(item.leadFormId || els.leadFormId?.value || '').trim();

  return {
    adAccountId,
    campaignName: `AUTO ${item.pageName} - ${item.pageId}`,
    adSetName: `${t('adSetPrefix')} - ${item.pageName} - ${item.pageId}`,
    adName: `Ad - ${item.pageName} - ${item.pageId}`,
    objective: els.objective?.value || '',
    dailyBudget: item.budget,
    pageId: item.pageId,
    pageName: item.pageName,
    optimizationGoal: '',
    postId: els.postId.value.trim() || '',
    campaignType,
    leadFormId: isLeadForm ? leadFormId : '',
    targetLatitude: String(els.targetLatitude?.value || '').trim(),
    targetLongitude: String(els.targetLongitude?.value || '').trim(),
    targetRadiusKm: String(els.targetRadiusKm?.value || '').trim()
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
    const { items, errors, resolvedBudget } = parseBatchInput(els.batchInput.value || '');

    if (errors.length) {
      throw new Error(t('inputError', { details: errors.join('\n') }));
    }

    if (!items.length) {
      throw new Error(t('noValidRecord'));
    }

    await refreshAdAccountBudgetInfo();
    assertBudgetMeetsMinimum(resolvedBudget);

    const isLeadForm = String(els.campaignType?.value || 'messenger') === 'lead_form';
    if (isLeadForm) {
      const defaultLeadFormId = String(els.leadFormId?.value || '').trim();
      const missingLines = items
        .map((item, idx) => ({ idx: idx + 1, formId: String(item.leadFormId || defaultLeadFormId || '').trim() }))
        .filter((x) => !x.formId)
        .map((x) => x.idx);

      if (missingLines.length) {
        throw new Error(t('missingLeadFormId', { lines: missingLines.join(', ') }));
      }
    }

    appendStatus(t('startRunRows', { count: items.length }), 'section');
    if (resolvedBudget?.label) {
      appendStatus(`Budget: ${resolvedBudget.label}`, 'section');
    }

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
  refreshAdAccountBudgetInfo(normalized);
});

function updateCampaignTypeUI() {
  const isLeadForm = String(els.campaignType?.value || 'messenger') === 'lead_form';
  if (els.leadFormIdField) {
    els.leadFormIdField.style.display = isLeadForm ? '' : 'none';
  }
  // Lead Form ID nằm trong accordion Creative → mở ra khi chọn thu lead.
  if (isLeadForm) {
    const creativeAcc = els.leadFormIdField?.closest('details.acc');
    if (creativeAcc) creativeAcc.open = true;
  }
}
els.campaignType?.addEventListener('change', updateCampaignTypeUI);
updateCampaignTypeUI();
els.permissionInput?.addEventListener('paste', () => {
  setTimeout(() => {
    const normalized = normalizeIdListToSingleColumn(els.permissionInput.value);
    els.permissionInput.value = normalized;
  }, 0);
});
els.permissionInput?.addEventListener('blur', () => {
  const normalized = normalizeIdListToSingleColumn(els.permissionInput.value);
  els.permissionInput.value = normalized;
});

// ---------------------------------------------------------------------------
// AI Ads Assistant (frontend)
// ---------------------------------------------------------------------------
const aiEls = {
  output: $('aiOutput'),
  auditBody: $('auditBody'),
  chatLog: $('aiChatLog'),
  statusBadge: $('aiStatusBadge'),
  reviewBtn: $('aiReviewBtn'),
  clearBtn: $('aiClearBtn'),
  suggestBtn: $('aiSuggestTargetBtn'),
  contentBtn: $('aiContentBtn'),
  chatSendBtn: $('aiChatSendBtn'),
  chatInput: $('aiChatInput'),
  industry: $('aiIndustry'),
  targetLocation: $('aiTargetLocation'),
  product: $('aiProduct'),
  auditMeta: $('auditMeta'),
  auditResultActions: $('auditResultActions'),
  auditHistory: $('auditHistory'),
  auditPdfBtn: $('auditPdfBtn'),
  auditPngBtn: $('auditPngBtn'),
  auditShareBtn: $('auditShareBtn'),
  auditHistoryBtn: $('auditHistoryBtn')
};

const aiChatHistory = [];
let lastReview = null;
let lastHealthScore = 0;

// Đếm số + hiệu ứng thanh cho Campaign Audit (AI "sống").
function animateNumber(el, from, to, format) {
  const start = performance.now();
  const dur = 500;
  const delta = to - from;
  function frame(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(from + delta * eased);
    el.textContent = format ? format(val) : String(val);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function animateAuditPanel() {
  if (!aiEls.auditBody) return;
  requestAnimationFrame(() => {
    aiEls.auditBody.querySelectorAll('.health-bar-fill[data-w]').forEach((el) => {
      el.style.width = `${el.getAttribute('data-w')}%`;
    });
  });
  const scoreEl = aiEls.auditBody.querySelector('.health-score[data-target]');
  if (scoreEl) {
    const target = Number(scoreEl.getAttribute('data-target')) || 0;
    animateNumber(scoreEl, lastHealthScore, target, (v) => `${v}/100`);
    lastHealthScore = target;
  }
}

function showAiOutput(text) {
  if (!aiEls.output) return;
  aiEls.output.style.display = 'block';
  aiEls.output.textContent = text;
}

function showAiOutputHtml(html) {
  if (!aiEls.output) return;
  aiEls.output.style.display = 'block';
  aiEls.output.innerHTML = html;
}

// Campaign Audit panel (sticky, realtime) — separate from AI Assistant output.
function showAuditText(text) {
  if (!aiEls.auditBody) return;
  aiEls.auditBody.style.display = 'block';
  aiEls.auditBody.textContent = text;
}

function showAuditHtml(html) {
  if (!aiEls.auditBody) return;
  aiEls.auditBody.style.display = 'block';
  aiEls.auditBody.innerHTML = html;
}

function healthColor(score) {
  if (score >= 85) return '#16a34a';
  if (score >= 65) return '#22c55e';
  if (score >= 45) return '#f59e0b';
  return '#dc2626';
}

function renderCheckStatus(status) {
  const map = {
    pass: { dot: '🟢', cls: 'check-pass', text: 'OK' },
    warn: { dot: '🟡', cls: 'check-warn', text: 'Cần lưu ý' },
    fail: { dot: '🔴', cls: 'check-fail', text: 'Thiếu' },
    na: { dot: '⚪', cls: 'check-na', text: 'Không áp dụng' },
    unknown: { dot: '⚪', cls: 'check-unknown', text: 'Chưa kiểm tra' }
  };
  return map[status] || map.unknown;
}

function renderReviewDashboard(data) {
  const score = Number(data.score) || 0;
  const color = healthColor(score);
  const pct = Math.max(0, Math.min(100, score));

  const prioHtml = (data.priorities || [])
    .map((p, i) => {
      const lvl = p.level === 'high' ? 'high' : p.level === 'medium' ? 'medium' : 'low';
      const lvlText = lvl === 'high' ? '🔴 Cao' : lvl === 'medium' ? '🟡 Trung bình' : '🟢 Thấp';
      const explainBtn = p.explain
        ? `<button type="button" class="ai-explain prio-explain-btn" data-idx="${i}">Giải thích</button>`
        : '';
      const explainBox = p.explain
        ? `<div class="prio-explain" data-idx="${i}" style="display:none;">${escapeHtml(p.explain)}</div>`
        : '';
      return `
        <li class="prio-item">
          <span class="prio-dot prio-${lvl}"></span>
          <span style="flex:1;">
            <span class="prio-title">${escapeHtml(lvlText)} — ${escapeHtml(p.title || '')}</span>
            ${explainBtn}<br/>
            <span class="prio-action">${escapeHtml(p.action || '')}</span>
            ${explainBox}
          </span>
        </li>`;
    })
    .join('');

  const conf = data.confidence || null;
  const confColor = conf ? healthColor(conf.percent) : '#94a3b8';
  const confReasons = conf && conf.reasons?.length
    ? `<div class="conf-reasons"><b>Thiếu dữ liệu:</b><ul class="conf-missing">${conf.reasons
        .map((r) => `<li>${escapeHtml(r)}</li>`)
        .join('')}</ul></div>`
    : '';
  const confHtml = conf
    ? `
      <div class="conf-wrap">
        <div class="conf-top">
          <span class="conf-label">Analysis Confidence <span style="font-weight:600;color:var(--muted);">(độ tin cậy của AI)</span></span>
          <span class="conf-percent" style="color:${confColor};">${conf.percent}%</span>
        </div>
        <div class="health-bar"><div class="health-bar-fill" data-w="${conf.percent}" style="width:0%;background:${confColor};"></div></div>
        ${confReasons}
        ${conf.note ? `<div class="conf-note">ⓘ ${escapeHtml(conf.note)}</div>` : ''}
      </div>`
    : '';

  const checkHtml = (data.checklist || [])
    .map((c) => {
      const s = renderCheckStatus(c.status);
      return `<li class="check-item ${s.cls}">${s.dot} ${escapeHtml(c.label)} <span style="font-weight:600;opacity:0.75;">${s.text}</span></li>`;
    })
    .join('');

  const aiSummaryHtml = data.aiSummary
    ? `<div class="ai-section-title">Nhận xét AI</div><div style="font-size:12px;white-space:pre-wrap;line-height:1.5;">${escapeHtml(data.aiSummary)}</div>`
    : '';

  const goodsHtml = (data.goods || []).length
    ? `<div class="ai-section-title">Điểm ổn</div><ul class="check-list">${(data.goods || [])
        .map((g) => `<li class="check-item check-pass">🟢 ${escapeHtml(g)}</li>`)
        .join('')}</ul>`
    : '';

  const readyIcon = score >= 65 ? '✓' : score >= 45 ? '⚠' : '✕';
  const bd = Array.isArray(data.breakdown) ? data.breakdown : [];
  const bdSum = bd.reduce((s, b) => s + (Number(b.points) || 0), 0);
  const missingCount = bd.filter((b) => (Number(b.points) || 0) < (Number(b.max) || 0)).length;
  const gapHtml =
    score < 90 && missingCount > 0
      ? `<div class="gap-wrap">
          <span class="gap-text">Thiếu ${missingCount} mục để đạt 90+</span>
          <button type="button" class="auto-fix-btn">⚡ Auto Fix</button>
        </div>`
      : '';
  const breakdownHtml = bd.length
    ? `
      <button type="button" class="score-why-btn">📋 Vì sao được ${score} điểm?</button>
      <div class="score-why" style="display:none;">
        ${bd
          .map((b) => {
            const pts = Number(b.points) || 0;
            const max = Number(b.max) || 0;
            const c = pts >= max ? '#16a34a' : pts > 0 ? '#f59e0b' : '#dc2626';
            return `<div class="score-why-row"><span>${escapeHtml(b.label)}</span><b style="color:${c};">+${pts}</b></div>`;
          })
          .join('')}
        <div class="score-why-row score-why-total"><span>Tổng</span><b>${bdSum}/100</b></div>
      </div>`
    : '';

  return `
    <div class="health-wrap">
      <div class="ai-section-title" style="margin-top:0;">Setup Score <span style="font-weight:600;color:var(--muted);">(trước khi chạy)</span></div>
      <div class="health-top">
        <span class="health-score" data-target="${score}" style="color:${color};">${score}/100</span>
        <span class="health-grade">${readyIcon} ${escapeHtml(data.readiness || data.grade || '')}</span>
      </div>
      <div class="health-bar"><div class="health-bar-fill" data-w="${pct}" style="width:${lastHealthScore}%;background:${color};"></div></div>
      ${gapHtml}
      ${breakdownHtml}
    </div>

    ${confHtml}

    ${prioHtml ? `<div class="ai-section-title">Ưu tiên xử lý (làm gì trước)</div><ul class="prio-list">${prioHtml}</ul>` : ''}

    <div class="ai-section-title">Checklist</div>
    <ul class="check-list">${checkHtml}</ul>

    ${goodsHtml}
    ${aiSummaryHtml}
  `;
}

async function updateAiBadge() {
  if (!aiEls.statusBadge) return;
  try {
    const data = await apiRequest('/ai/status', { method: 'GET', retries: 1, timeoutMs: 10000 });
    const on = Boolean(data?.configured);
    aiEls.statusBadge.textContent = on ? `AI: ${data.provider}` : 'AI: rule-based';
    aiEls.statusBadge.className = `ai-badge ${on ? 'on' : 'off'}`;
  } catch {
    aiEls.statusBadge.textContent = 'AI: off';
    aiEls.statusBadge.className = 'ai-badge off';
  }
}

function formatExplanation(exp) {
  if (!exp) return 'Không có dữ liệu.';
  if (exp.freeText) return `📘 ${exp.title || ''}\n\n${exp.freeText}`;
  const lines = [`📘 ${exp.title || ''}`, ''];
  if (exp.definition) lines.push(`• Định nghĩa: ${exp.definition}`);
  if (exp.whenToUse) lines.push(`• Khi nào dùng: ${exp.whenToUse}`);
  if (exp.example) lines.push(`• Ví dụ: ${exp.example}`);
  if (exp.commonMistakes) lines.push(`• Lỗi hay gặp: ${exp.commonMistakes}`);
  return lines.join('\n');
}

async function explainFieldAi(field) {
  showAuditText('Đang tải giải thích...');
  try {
    const data = await apiRequest('/ai/explain-field', {
      method: 'POST',
      body: { field },
      retries: 1,
      timeoutMs: 30000
    });
    if (!data.ok) {
      showAuditText(data.error || 'Không có giải thích cho trường này.');
      return;
    }
    showAuditText(formatExplanation(data.explanation));
  } catch (err) {
    showAuditText(`Lỗi: ${err.message}`);
  }
}

function collectCampaignConfigForReview() {
  const parsed = parseBatchInput(els.batchInput?.value || '');
  const campaignType = String(els.campaignType?.value || 'messenger');
  return {
    campaignType,
    dailyBudget: Number(els.defaultBudget?.value || 0),
    leadFormId: String(els.leadFormId?.value || '').trim(),
    objective: els.objective?.value || '',
    optimizationGoal: '',
    postId: String(els.postId?.value || '').trim(),
    targetLatitude: String(els.targetLatitude?.value || '').trim(),
    targetLongitude: String(els.targetLongitude?.value || '').trim(),
    targetRadiusKm: String(els.targetRadiusKm?.value || '').trim(),
    pageCount: parsed.items.length
  };
}

// Realtime audit: chạy tự động khi người dùng đổi cấu hình (không lưu, không gọi LLM).
let liveAuditTimer = null;
let liveAuditSeq = 0;

async function runLiveAudit() {
  const seq = ++liveAuditSeq;
  try {
    const cfg = collectCampaignConfigForReview();
    cfg.save = false;
    cfg.skipAiSummary = true;
    const data = await apiRequest('/ai/review-campaign', {
      method: 'POST',
      body: cfg,
      retries: 0,
      timeoutMs: 20000
    });
    if (seq !== liveAuditSeq) return; // đã có lần chạy mới hơn
    if (!data.ok) return;
    showAuditHtml(renderReviewDashboard(data));
    animateAuditPanel();
  } catch {
    // Bỏ qua lỗi live audit để không làm phiền người dùng.
  }
}

function scheduleLiveAudit() {
  if (liveAuditTimer) clearTimeout(liveAuditTimer);
  liveAuditTimer = setTimeout(runLiveAudit, 450);
}

// Auto Fix: chỉ tự điền những gì SUY RA HỢP LÝ được (mặc định an toàn).
// Những gì cần dữ liệu thật của người dùng thì KHÔNG bịa — chỉ chỉ ra để họ nhập.
function showAutoFixSummary(applied, needUser) {
  const el = document.getElementById('autoFixNote');
  if (!el) return;
  el.style.display = 'block';
  let html = '';
  if (applied.length) {
    html += `<div><b>✓ Đã tự tối ưu:</b> ${applied.map((a) => escapeHtml(a)).join('; ')}</div>`;
  }
  if (needUser.length) {
    const links = needUser
      .map((n) => `<a class="autofix-jump" data-field="${n.field}">${escapeHtml(n.label)}</a>`)
      .join(', ');
    html += `<div style="margin-top:4px;color:#b45309;"><b>Cần bạn nhập để đạt 90+:</b> ${links}<div style="margin-top:2px;font-weight:600;">AI không tự bịa các mục này vì cần dữ liệu thật của bạn.</div></div>`;
  }
  if (!applied.length && !needUser.length) {
    html = 'Không có gì để tự sửa — cấu hình đã ổn.';
  }
  el.innerHTML = html;
}

function autoFixCampaign() {
  const applied = [];
  const needUser = [];
  const isLeadForm = String(els.campaignType?.value || 'messenger') === 'lead_form';

  const budgetVal = Number(els.defaultBudget?.value);
  if ((!Number.isFinite(budgetVal) || budgetVal <= 0) && els.defaultBudget) {
    const cur = getBudgetCurrency();
    els.defaultBudget.value = cur === 'USD' ? '1' : '100000';
    applied.push(cur === 'USD' ? 'Budget = $1 (mặc định)' : 'Budget = 100.000 VND (mặc định)');
  }

  if (isLeadForm && els.objective?.value && els.objective.value !== 'OUTCOME_LEADS') {
    els.objective.value = '';
    applied.push('Objective = tự động (khớp thu lead)');
  }

  const hasCoords =
    String(els.targetLatitude?.value || '').trim() && String(els.targetLongitude?.value || '').trim();
  const radiusVal = Number(els.targetRadiusKm?.value);
  if (hasCoords && (!Number.isFinite(radiusVal) || radiusVal < 2 || radiusVal > 50)) {
    if (els.targetRadiusKm) els.targetRadiusKm.value = '10';
    applied.push('Bán kính = 10km');
  }

  if (!hasCoords) needUser.push({ label: 'Tọa độ target', field: 'targetLatitude' });
  if (isLeadForm && !String(els.leadFormId?.value || '').trim()) {
    needUser.push({ label: 'Lead Form ID', field: 'leadFormId' });
  }
  const pageN = parseBatchInput(els.batchInput?.value || '').items.length;
  if (pageN === 0) needUser.push({ label: 'Danh sách page', field: 'batchInput' });

  updatePageCount();
  scheduleLiveAudit();
  showAutoFixSummary(applied, needUser);
}

function jumpToField(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  switchPage('campaign');
  const acc = el.closest('details.acc');
  if (acc) acc.open = true;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => el.focus(), 250);
}

async function aiReview() {
  showAuditText('Đang lưu báo cáo Campaign Audit...');
  try {
    const cfg = collectCampaignConfigForReview();
    const data = await apiRequest('/ai/review-campaign', {
      method: 'POST',
      body: cfg,
      retries: 1,
      timeoutMs: 40000
    });
    if (!data.ok) {
      showAuditText(data.error || 'Review lỗi.');
      return;
    }

    showAuditHtml(renderReviewDashboard(data));
    animateAuditPanel();

    lastReview = {
      id: data.reviewId || null,
      reviewNumber: data.reviewNumber || null,
      shareUrl: data.shareUrl || null,
      createdAt: data.createdAt || null
    };

    if (aiEls.auditMeta) {
      if (lastReview.reviewNumber) {
        const dateStr = lastReview.createdAt
          ? new Date(lastReview.createdAt).toLocaleString('vi-VN')
          : '';
        aiEls.auditMeta.style.display = 'block';
        aiEls.auditMeta.textContent = `Review #${lastReview.reviewNumber}${dateStr ? ' • ' + dateStr : ''}`;
      } else {
        aiEls.auditMeta.style.display = 'none';
      }
    }
    if (aiEls.auditResultActions) {
      aiEls.auditResultActions.style.display = lastReview.id ? '' : 'none';
    }
  } catch (err) {
    showAuditText(`Lỗi: ${err.message}`);
  }
}

function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) return resolve(window.html2canvas);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error('Không tải được thư viện tạo ảnh (cần internet).'));
    document.head.appendChild(script);
  });
}

async function auditDownloadPng() {
  if (!aiEls.auditBody || aiEls.auditBody.style.display === 'none') {
    showAuditText('Chạy Campaign Audit trước khi tải ảnh.');
    return;
  }
  try {
    const html2canvas = await loadHtml2Canvas();
    const canvas = await html2canvas(aiEls.auditBody, { backgroundColor: '#ffffff', scale: 2 });
    const link = document.createElement('a');
    link.download = `campaign-audit${lastReview?.reviewNumber ? '-' + lastReview.reviewNumber : ''}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    showAuditText(`Lỗi tạo ảnh: ${err.message}`);
  }
}

function auditOpenPdf() {
  if (!lastReview?.shareUrl) {
    showAuditText('Chưa có link review. Bấm "Lưu báo cáo" trước.');
    return;
  }
  window.open(lastReview.shareUrl, '_blank');
}

async function auditCopyShare() {
  if (!lastReview?.shareUrl) {
    showAuditText('Chưa có link chia sẻ. Bấm "Lưu báo cáo" trước.');
    return;
  }
  try {
    await navigator.clipboard.writeText(lastReview.shareUrl);
    if (aiEls.auditMeta) {
      aiEls.auditMeta.style.display = 'block';
      aiEls.auditMeta.textContent = `Đã copy link: ${lastReview.shareUrl}`;
    }
  } catch {
    window.prompt('Copy link chia sẻ:', lastReview.shareUrl);
  }
}

async function auditShowHistory() {
  if (!aiEls.auditHistory) return;
  aiEls.auditHistory.style.display = 'block';
  aiEls.auditHistory.textContent = 'Đang tải lịch sử...';
  try {
    const data = await apiRequest('/audit/history?limit=50', { method: 'GET', retries: 1 });
    const rows = data.rows || [];
    if (!rows.length) {
      aiEls.auditHistory.textContent = 'Chưa có lịch sử review.';
      return;
    }
    aiEls.auditHistory.innerHTML = rows
      .map((r) => {
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : '';
        const color = healthColor(Number(r.score) || 0);
        const link = `${getBackendUrl()}/review/${r.id}`;
        return `<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed #e7edf5;">
          <span>#${escapeHtml(String(r.reviewNumber || ''))} • ${escapeHtml(dateStr)}</span>
          <span><b style="color:${color};">${escapeHtml(String(r.score ?? ''))}</b>/100 ${r.confidence != null ? `• Conf ${escapeHtml(String(r.confidence))}%` : ''} • <a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">mở</a></span>
        </div>`;
      })
      .join('');
  } catch (err) {
    aiEls.auditHistory.textContent = `Lỗi tải lịch sử: ${err.message}`;
  }
}

async function aiSuggestTarget() {
  showAiOutput('Đang gợi ý target...');
  try {
    const data = await apiRequest('/ai/suggest-target', {
      method: 'POST',
      body: {
        industry: String(aiEls.industry?.value || '').trim(),
        location: String(aiEls.targetLocation?.value || '').trim()
      },
      retries: 1,
      timeoutMs: 40000
    });
    if (!data.ok) {
      showAiOutput(data.error || 'Không gợi ý được.');
      return;
    }
    showAiOutput(`🎯 Gợi ý target:\n\n${data.suggestion}`);
  } catch (err) {
    showAiOutput(`Lỗi: ${err.message}`);
  }
}

async function aiGenerateContent() {
  const product = String(aiEls.product?.value || '').trim();
  if (!product) {
    showAiOutput('Nhập sản phẩm/dự án trước khi viết content.');
    return;
  }
  showAiOutput('Đang viết content...');
  try {
    const data = await apiRequest('/ai/generate-content', {
      method: 'POST',
      body: { product },
      retries: 1,
      timeoutMs: 40000
    });
    if (!data.ok) {
      showAiOutput(data.error || 'Không viết được content.');
      return;
    }
    showAiOutput(`✍ Content:\n\n${data.content}`);
  } catch (err) {
    showAiOutput(`Lỗi: ${err.message}`);
  }
}

function renderChatLog() {
  if (!aiEls.chatLog) return;
  aiEls.chatLog.style.display = 'block';
  aiEls.chatLog.innerHTML = aiChatHistory
    .map((m) => {
      const who = m.role === 'assistant' ? '🤖 AI' : '🧑 Bạn';
      return `<div style="margin-bottom:8px;"><b>${who}:</b> ${escapeHtml(m.content)}</div>`;
    })
    .join('');
  aiEls.chatLog.scrollTop = aiEls.chatLog.scrollHeight;
}

async function aiSendChat() {
  const msg = String(aiEls.chatInput?.value || '').trim();
  if (!msg) return;

  aiChatHistory.push({ role: 'user', content: msg });
  aiEls.chatInput.value = '';
  renderChatLog();

  aiChatHistory.push({ role: 'assistant', content: 'Đang trả lời...' });
  renderChatLog();

  try {
    const data = await apiRequest('/ai/chat', {
      method: 'POST',
      body: { messages: aiChatHistory.slice(0, -1), userMessage: msg },
      retries: 1,
      timeoutMs: 40000
    });
    aiChatHistory.pop();
    aiChatHistory.push({
      role: 'assistant',
      content: data.ok ? data.reply || '(trống)' : data.error || 'Lỗi chat.'
    });
    renderChatLog();
  } catch (err) {
    aiChatHistory.pop();
    aiChatHistory.push({ role: 'assistant', content: `Lỗi: ${err.message}` });
    renderChatLog();
  }
}

document.querySelectorAll('.ai-explain').forEach((btn) => {
  btn.addEventListener('click', () => explainFieldAi(btn.getAttribute('data-field')));
});
aiEls.reviewBtn?.addEventListener('click', aiReview);
aiEls.clearBtn?.addEventListener('click', () => {
  if (aiEls.auditBody) {
    aiEls.auditBody.innerHTML = 'Nhập cấu hình bên trái để xem đánh giá tự động.';
  }
  if (aiEls.auditMeta) aiEls.auditMeta.style.display = 'none';
  if (aiEls.auditResultActions) aiEls.auditResultActions.style.display = 'none';
  if (aiEls.auditHistory) aiEls.auditHistory.style.display = 'none';
  const autoNote = document.getElementById('autoFixNote');
  if (autoNote) autoNote.style.display = 'none';
  lastReview = null;
});
aiEls.suggestBtn?.addEventListener('click', aiSuggestTarget);
aiEls.contentBtn?.addEventListener('click', aiGenerateContent);
aiEls.chatSendBtn?.addEventListener('click', aiSendChat);
aiEls.chatInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') aiSendChat();
});
aiEls.auditBody?.addEventListener('click', (e) => {
  const fixBtn = e.target.closest('.auto-fix-btn');
  if (fixBtn) {
    autoFixCampaign();
    return;
  }
  const whyBtn = e.target.closest('.score-why-btn');
  if (whyBtn) {
    const box = aiEls.auditBody.querySelector('.score-why');
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    return;
  }
  const btn = e.target.closest('.prio-explain-btn');
  if (!btn) return;
  const idx = btn.getAttribute('data-idx');
  const box = aiEls.auditBody.querySelector(`.prio-explain[data-idx="${idx}"]`);
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
});
aiEls.auditPdfBtn?.addEventListener('click', auditOpenPdf);
aiEls.auditPngBtn?.addEventListener('click', auditDownloadPng);
aiEls.auditShareBtn?.addEventListener('click', auditCopyShare);
aiEls.auditHistoryBtn?.addEventListener('click', auditShowHistory);

document.getElementById('autoFixNote')?.addEventListener('click', (e) => {
  const link = e.target.closest('.autofix-jump');
  if (!link) return;
  e.preventDefault();
  jumpToField(link.getAttribute('data-field'));
});

// ---------------------------------------------------------------------------
// SaaS navigation (sidebar) + realtime Campaign Audit
// ---------------------------------------------------------------------------
function switchPage(pageId) {
  if (!pageId) return;
  document.querySelectorAll('.page').forEach((p) => {
    p.classList.toggle('active', p.getAttribute('data-page') === pageId);
  });
  document.querySelectorAll('.nav-item').forEach((n) => {
    n.classList.toggle('active', n.getAttribute('data-page') === pageId);
  });
}

document.querySelectorAll('.nav-item[data-page]').forEach((btn) => {
  btn.addEventListener('click', () => switchPage(btn.getAttribute('data-page')));
});
document.querySelectorAll('[data-goto]').forEach((btn) => {
  btn.addEventListener('click', () => switchPage(btn.getAttribute('data-goto')));
});

// Đếm số page + badge sidebar.
function updatePageCount() {
  const parsed = parseBatchInput(els.batchInput?.value || '');
  const n = parsed.items.length;
  const countEl = document.getElementById('pageCount');
  if (countEl) countEl.textContent = `${n} page`;
  const badge = document.getElementById('navBadgeCampaign');
  if (badge) {
    badge.style.display = n > 0 ? '' : 'none';
    badge.textContent = n > 999 ? '999+' : String(n);
  }
}

els.batchInput?.addEventListener('input', updatePageCount);
els.batchInput?.addEventListener('paste', () => {
  setTimeout(() => {
    if (!els.batchInput) return;
    els.batchInput.value = normalizeIdListToSingleLine(els.batchInput.value);
    updatePageCount();
    scheduleLiveAudit();
  }, 0);
});
els.batchInput?.addEventListener('blur', () => {
  if (!els.batchInput) return;
  els.batchInput.value = normalizeIdListToSingleLine(els.batchInput.value);
  updatePageCount();
});

// Import danh sách page từ file TXT/CSV.
const importFileInput = document.getElementById('importFileInput');
const importTxtBtn = document.getElementById('importTxtBtn');
const importCsvBtn = document.getElementById('importCsvBtn');
function triggerImport() {
  if (importFileInput) importFileInput.click();
}
importTxtBtn?.addEventListener('click', triggerImport);
importCsvBtn?.addEventListener('click', triggerImport);
importFileInput?.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || '').replace(/[,;\t]+/g, ' ');
    const normalized = normalizeIdListToSingleLine(text);
    if (els.batchInput) {
      els.batchInput.value = normalized;
      updatePageCount();
      scheduleLiveAudit();
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// Cập nhật Campaign Audit theo thời gian thực khi đổi cấu hình.
[
  'adAccountId',
  'campaignType',
  'objective',
  'leadFormId',
  'targetLatitude',
  'targetLongitude',
  'targetRadiusKm',
  'postId',
  'defaultBudget',
  'batchInput'
].forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', scheduleLiveAudit);
  el.addEventListener('change', scheduleLiveAudit);
});

// ---------------------------------------------------------------------------
// Bulk Launcher: ma trận Page × Audience × Creative (giống bulk launcher chuyên nghiệp)
// ---------------------------------------------------------------------------
function elFromHtml(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = String(html || '').trim();
  return tpl.content.firstElementChild;
}

let bulkAudSeq = 0;
let bulkCrSeq = 0;

function addAudienceRow(data = {}) {
  const list = $('audienceList');
  if (!list) return;
  bulkAudSeq += 1;
  const label = data.label || `Audience ${bulkAudSeq}`;
  const row = elFromHtml(`
    <div class="matrix-row">
      <div class="matrix-row-top">
        <input class="matrix-label-input aud-label" value="${escapeHtml(label)}" placeholder="Tên audience" />
        <button type="button" class="matrix-row-remove" title="Xóa audience">✕</button>
      </div>
      <div class="matrix-row-fields">
        <input class="aud-lat" value="${escapeHtml(data.latitude || '')}" placeholder="Latitude (VD 16.05)" />
        <input class="aud-long" value="${escapeHtml(data.longitude || '')}" placeholder="Longitude (VD 108.2)" />
        <input class="aud-radius" type="number" min="1" value="${escapeHtml(data.radiusKm || '')}" placeholder="Bán kính km" />
      </div>
    </div>`);
  list.appendChild(row);
  updateBulkMatrix();
}

function addCreativeRow(data = {}) {
  const list = $('creativeList');
  if (!list) return;
  bulkCrSeq += 1;
  const label = data.label || `Creative ${bulkCrSeq}`;
  const row = elFromHtml(`
    <div class="matrix-row">
      <div class="matrix-row-top">
        <input class="matrix-label-input cr-label" value="${escapeHtml(label)}" placeholder="Tên creative" />
        <button type="button" class="matrix-row-remove" title="Xóa creative">✕</button>
      </div>
      <div class="matrix-row-fields creative">
        <input class="cr-post" value="${escapeHtml(data.postId || '')}" placeholder="Post ID (Messenger) — trống = tự lấy bài" />
        <input class="cr-form" value="${escapeHtml(data.leadFormId || '')}" placeholder="Lead Form ID (thu lead)" />
        <input class="cr-msg full" value="${escapeHtml(data.message || '')}" placeholder="Tin nhắn/nội dung (tuỳ chọn)" />
      </div>
    </div>`);
  list.appendChild(row);
  updateBulkMatrix();
}

function collectBulkAudiences() {
  return [...document.querySelectorAll('#audienceList .matrix-row')].map((row, i) => ({
    label: row.querySelector('.aud-label')?.value?.trim() || `Audience ${i + 1}`,
    latitude: row.querySelector('.aud-lat')?.value?.trim() || '',
    longitude: row.querySelector('.aud-long')?.value?.trim() || '',
    radiusKm: row.querySelector('.aud-radius')?.value?.trim() || ''
  }));
}

function collectBulkCreatives() {
  return [...document.querySelectorAll('#creativeList .matrix-row')].map((row, i) => ({
    label: row.querySelector('.cr-label')?.value?.trim() || `Creative ${i + 1}`,
    postId: row.querySelector('.cr-post')?.value?.trim() || '',
    leadFormId: row.querySelector('.cr-form')?.value?.trim() || '',
    message: row.querySelector('.cr-msg')?.value?.trim() || ''
  }));
}

function parseBulkPages() {
  return String($('bulkPages')?.value || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, name] = line.split('|').map((x) => (x || '').trim());
      return { pageId: id, pageName: name || id };
    })
    .filter((p) => p.pageId);
}

function collectBulkConfig() {
  const acctEl = $('bulkAdAccountId');
  const adAccountId = normalizeAdAccountIdInput(acctEl?.value || '');
  if (acctEl && adAccountId && acctEl.value !== adAccountId) acctEl.value = adAccountId;

  const currency = String($('bulkBudgetCurrency')?.value || 'VND').toUpperCase();
  const fx = Number($('bulkUsdFxRate')?.value) || getUsdFxRate();
  const budgetResolved = resolveMetaDailyBudget($('bulkBudget')?.value, currency, fx);

  return {
    adAccountId,
    campaignType: String($('bulkCampaignType')?.value || 'messenger'),
    objective: $('bulkObjective')?.value || '',
    dailyBudget: budgetResolved.ok ? budgetResolved.metaBudget : 0,
    budgetResolved,
    namePrefix: String($('bulkNamePrefix')?.value || 'AUTO').trim() || 'AUTO',
    publish: Boolean($('bulkPublish')?.checked),
    audiences: collectBulkAudiences(),
    creatives: collectBulkCreatives(),
    pages: parseBulkPages()
  };
}

function validateBulk(cfg) {
  const errs = [];
  if (!cfg.adAccountId) errs.push('Thiếu Ad Account ID');
  if (!cfg.budgetResolved?.ok || !Number.isFinite(cfg.dailyBudget) || cfg.dailyBudget <= 0) {
    errs.push(cfg.budgetResolved?.error || 'Budget không hợp lệ');
  }
  if (!cfg.pages.length) errs.push('Chưa có Page nào');
  if (!cfg.audiences.length) errs.push('Cần ít nhất 1 Audience');
  if (!cfg.creatives.length) errs.push('Cần ít nhất 1 Creative');
  if (cfg.campaignType === 'lead_form') {
    const missing = cfg.creatives.filter((c) => !c.leadFormId).length;
    if (missing) errs.push(`Thu lead: ${missing} creative thiếu Lead Form ID`);
  }
  return errs;
}

function updateBulkMatrix() {
  const pages = parseBulkPages().length;
  const auds = document.querySelectorAll('#audienceList .matrix-row').length;
  const crs = document.querySelectorAll('#creativeList .matrix-row').length;
  const adsets = pages * auds;
  const ads = pages * auds * crs;

  const pc = $('bulkPageCount');
  if (pc) pc.textContent = `${pages} page`;
  const badge = $('navBadgeBulk');
  if (badge) {
    badge.style.display = pages > 0 ? '' : 'none';
    badge.textContent = pages > 999 ? '999+' : String(pages);
  }

  const el = $('bulkMatrixSummary');
  if (!el) return;
  const warnHtml =
    ads > 250
      ? `<div class="matrix-warn">⚠ ${ads} ad là rất nhiều — nên test một phần trước. Meta có thể giới hạn tốc độ tạo (rate limit).</div>`
      : '';
  el.innerHTML = `
    <div class="matrix-stat"><span>📢 Campaigns</span><b>${pages}</b></div>
    <div class="matrix-stat"><span>🎯 Ad Sets</span><b>${adsets}</b></div>
    <div class="matrix-stat total"><span>🖼 Ads (tổng)</span><b>${ads}</b></div>
    <div class="hint">= ${pages} page × ${auds} audience × ${crs} creative</div>
    ${warnHtml}
  `;
}

async function bulkPreview() {
  const el = $('bulkPreview');
  const cfg = collectBulkConfig();
  const errs = validateBulk(cfg);
  if (el) {
    el.style.display = 'block';
    el.textContent = 'Đang kiểm tra quyền...';
  }
  if (errs.length) {
    if (el) el.innerHTML = `<div class="matrix-warn">⚠ ${errs.map(escapeHtml).join('<br>')}</div>`;
    return;
  }
  try {
    const scan = await apiRequest('/permissions/scan', {
      method: 'POST',
      body: { adAccountId: cfg.adAccountId, pageIds: cfg.pages.map((p) => p.pageId) },
      retries: 1
    });
    const blocked = new Set((scan.pages || []).filter((x) => !x.ok).map((x) => String(x.pageId)));
    const perAdsets = cfg.audiences.length;
    const perAds = cfg.audiences.length * cfg.creatives.length;
    const rows = cfg.pages
      .slice(0, 30)
      .map((p) => {
        const ok = scan.adAccount?.ok && !blocked.has(String(p.pageId));
        return `<tr><td>${escapeHtml(p.pageName)}</td><td>${perAdsets}</td><td>${perAds}</td><td>${ok ? '🟢 OK' : '🔴 Chặn'}</td></tr>`;
      })
      .join('');
    const acctLine = scan.adAccount?.ok ? '🟢 Ad Account OK' : '🔴 Ad Account không có quyền';
    const extra =
      cfg.pages.length > 30 ? `<div class="hint">... và ${cfg.pages.length - 30} page nữa</div>` : '';
    if (el) {
      el.innerHTML = `
        <div style="font-weight:800;margin-bottom:8px;">${acctLine} • ${blocked.size} page bị chặn / ${cfg.pages.length}</div>
        <table class="preview-table"><thead><tr><th>Page</th><th>Ad Sets</th><th>Ads</th><th>Quyền</th></tr></thead><tbody>${rows}</tbody></table>
        ${extra}
      `;
    }
  } catch (err) {
    if (el) el.innerHTML = `<div class="matrix-warn">Lỗi kiểm tra: ${escapeHtml(err.message)}</div>`;
  }
}

async function bulkRun() {
  if (running) return;
  const cfg = collectBulkConfig();
  const errs = validateBulk(cfg);
  if (errs.length) {
    setStatusHtml('');
    appendStatus(errs.join(' | '), 'error');
    return;
  }

  try {
    await refreshAdAccountBudgetInfo(cfg.adAccountId);
    assertBudgetMeetsMinimum(cfg.budgetResolved);
  } catch (err) {
    setStatusHtml('');
    appendStatus(err.message, 'error');
    return;
  }

  running = true;
  setStatusHtml('');
  try {
    appendStatus(
      `Bulk Launcher: ${cfg.pages.length} page × ${cfg.audiences.length} audience × ${cfg.creatives.length} creative`,
      'section'
    );
    if (cfg.budgetResolved?.label) {
      appendStatus(`Budget: ${cfg.budgetResolved.label}`, 'section');
    }

    const scan = await apiRequest('/permissions/scan', {
      method: 'POST',
      body: { adAccountId: cfg.adAccountId, pageIds: cfg.pages.map((p) => p.pageId) },
      retries: 1
    });
    if (!scan.adAccount?.ok) {
      appendStatus(t('actNoPermission'), 'error');
      return;
    }
    const blocked = new Set((scan.pages || []).filter((x) => !x.ok).map((x) => String(x.pageId)));

    const summary = { success: 0, failed: 0, skipped: 0, ads: 0 };

    for (let i = 0; i < cfg.pages.length; i++) {
      const page = cfg.pages[i];
      appendDivider();
      appendStatus(`Page ${i + 1}/${cfg.pages.length}: ${page.pageName} (${page.pageId})`, 'running');

      if (blocked.has(String(page.pageId))) {
        summary.skipped += 1;
        appendStatus(`${page.pageName} - SKIP: page chưa cấp quyền vào Business/token`, 'error');
        continue;
      }

      try {
        const data = await apiRequest('/flow/run-matrix-page', {
          method: 'POST',
          body: {
            adAccountId: cfg.adAccountId,
            campaignType: cfg.campaignType,
            objective: cfg.objective,
            dailyBudget: cfg.dailyBudget,
            namePrefix: cfg.namePrefix,
            publish: cfg.publish,
            audiences: cfg.audiences,
            creatives: cfg.creatives,
            pageId: page.pageId,
            pageName: page.pageName,
            operatorName: getOperatorName(),
            businessId: els.businessId?.value?.trim() || ''
          },
          retries: 0,
          timeoutMs: 180000
        });

        summary.success += 1;
        summary.ads += data.counts?.ads || 0;
        appendStatus(
          `${page.pageName} - Tạo ${data.counts?.ads || 0} ad / ${data.counts?.adSets || 0} ad set${
            data.counts?.failed ? `, lỗi ${data.counts.failed}` : ''
          }`,
          'success'
        );
        if (data.adsManagerUrl) appendNameLink(page.pageName, data.adsManagerUrl);
        (data.adResults || [])
          .filter((r) => !r.ok)
          .forEach((r) => appendStatus(`  ✗ ${r.audience} • ${r.creative}: ${r.error}`, 'error'));
      } catch (err) {
        summary.failed += 1;
        appendStatus(`${page.pageName} - ${err.message}`, 'error');
        if (isPermissionDeniedError(err)) {
          appendStatus(t('failFastPermissionStop'), 'section');
          break;
        }
      }
    }

    appendDivider();
    appendStatus(
      `Tổng kết Bulk: SUCCESS ${summary.success} page | ${summary.ads} ad | SKIP ${summary.skipped} | FAILED ${summary.failed}`,
      'section'
    );
    await refreshReportSummary();
  } catch (err) {
    setStatusHtml('');
    appendStatus(err.message, 'error');
    console.error(err);
  } finally {
    running = false;
  }
}

$('audienceList')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.matrix-row-remove');
  if (btn) {
    btn.closest('.matrix-row')?.remove();
    updateBulkMatrix();
  }
});
$('audienceList')?.addEventListener('input', updateBulkMatrix);
$('creativeList')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.matrix-row-remove');
  if (btn) {
    btn.closest('.matrix-row')?.remove();
    updateBulkMatrix();
  }
});
$('creativeList')?.addEventListener('input', updateBulkMatrix);
$('addAudienceBtn')?.addEventListener('click', () => addAudienceRow());
$('addCreativeBtn')?.addEventListener('click', () => addCreativeRow());
$('bulkPages')?.addEventListener('input', updateBulkMatrix);
$('bulkCampaignType')?.addEventListener('change', updateBulkMatrix);
$('bulkPreviewBtn')?.addEventListener('click', bulkPreview);
$('bulkRunBtn')?.addEventListener('click', bulkRun);
$('bulkImportBtn')?.addEventListener('click', () => $('bulkImportFileInput')?.click());
$('bulkImportFileInput')?.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const lines = String(reader.result || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if ($('bulkPages')) {
      $('bulkPages').value = lines.join('\n');
      updateBulkMatrix();
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

function initBulkLauncher() {
  const bulkAcct = $('bulkAdAccountId');
  if (bulkAcct && !bulkAcct.value) bulkAcct.value = els.adAccountId?.value || '';
  if ($('audienceList') && !$('audienceList').children.length) addAudienceRow({ label: 'Mặc định' });
  if ($('creativeList') && !$('creativeList').children.length) {
    addCreativeRow({ label: 'Bài viết tự động' });
  }
  updateBulkMatrix();
  updateBulkBudgetConvertPreview();
}

function setupBudgetCurrencyInputs() {
  const savedCur = localStorage.getItem(BUDGET_CURRENCY_STORAGE_KEY);
  let savedFx = Number(localStorage.getItem(USD_FX_RATE_STORAGE_KEY));
  if (!Number.isFinite(savedFx) || savedFx < 1000) {
    savedFx = DEFAULT_USD_FX_RATE;
    try {
      localStorage.setItem(USD_FX_RATE_STORAGE_KEY, String(DEFAULT_USD_FX_RATE));
    } catch {
      // ignore
    }
  }
  if (els.budgetCurrency && savedCur && ['USD', 'VND'].includes(savedCur)) {
    els.budgetCurrency.value = savedCur;
  }
  if (els.usdFxRate) els.usdFxRate.value = String(savedFx);
  const bulkFx = $('bulkUsdFxRate');
  if (bulkFx) bulkFx.value = String(savedFx);

  applyCurrencyUi({
    currencySelect: els.budgetCurrency,
    budgetInput: els.defaultBudget,
    fxField: els.fxRateField,
    iconEl: $('budgetInputIcon')
  });

  els.defaultBudget?.addEventListener('input', updateBudgetConvertPreview);
  els.budgetCurrency?.addEventListener('change', () => {
    applyCurrencyUi({
      currencySelect: els.budgetCurrency,
      budgetInput: els.defaultBudget,
      fxField: els.fxRateField,
      iconEl: $('budgetInputIcon')
    });
    updateBudgetConvertPreview();
    syncBulkBudgetCurrencyFromCampaign();
  });
  els.usdFxRate?.addEventListener('input', () => {
    updateBudgetConvertPreview();
    syncBulkBudgetCurrencyFromCampaign();
  });

  $('bulkBudget')?.addEventListener('input', updateBulkBudgetConvertPreview);
  $('bulkBudgetCurrency')?.addEventListener('change', () => {
    applyCurrencyUi({
      currencySelect: $('bulkBudgetCurrency'),
      budgetInput: $('bulkBudget'),
      fxField: $('bulkFxRateField'),
      iconEl: $('bulkBudgetInputIcon'),
      isBulk: true
    });
    updateBulkBudgetConvertPreview();
  });
  $('bulkUsdFxRate')?.addEventListener('input', updateBulkBudgetConvertPreview);

  updateBudgetConvertPreview();
  updateBulkBudgetConvertPreview();
  refreshAdAccountBudgetInfo();
}

setupBackendUrlInput();
setupOperatorInput();
setupAdminKeyInput();
setupBudgetCurrencyInputs();
applyI18n();
checkFacebookAuth();
refreshReportSummary();
updateAiBadge();
runLiveAudit();
updatePageCount();
initBulkLauncher();