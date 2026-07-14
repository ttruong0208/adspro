import fs from 'fs';
import path from 'path';

const DATA_DIR =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  process.env.DATA_DIR ||
  (process.env.VERCEL ? '/tmp/adsmanager-data' : path.resolve('data'));
const RUNS_FILE = path.join(DATA_DIR, 'run-history.json');
const MAX_RUNS = Number(process.env.REPORT_MAX_RUNS || 2000);

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(RUNS_FILE)) {
    fs.writeFileSync(RUNS_FILE, '[]', 'utf8');
  }
}

export function readRunHistory() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(RUNS_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRunHistory(rows) {
  ensureStore();
  fs.writeFileSync(RUNS_FILE, JSON.stringify(rows, null, 2), 'utf8');
}

export function appendRunEvent(event) {
  const rows = readRunHistory();
  const next = [
    ...rows,
    {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
      ok: false,
      adAccountId: '',
      pageId: '',
      budget: null,
      durationMs: null,
      operatorName: '',
      businessId: '',
      errorType: null,
      errorMessage: null,
      ...event
    }
  ];

  const trimmed = next.length > MAX_RUNS ? next.slice(next.length - MAX_RUNS) : next;
  writeRunHistory(trimmed);
  return trimmed;
}

function parseBudget(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function escapeCsvCell(value) {
  const raw = String(value ?? '');
  const escaped = raw.replaceAll('"', '""');
  return `"${escaped}"`;
}

export function getRunReport(limit = 50) {
  return getRunReportWithFilters({ limit });
}

function normalizeDateInput(value, endOfDay = false) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const suffix = endOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z';
  const date = new Date(raw.includes('T') ? raw : `${raw}${suffix}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function filterRows(rows, { status = 'all', adAccountId = '', from = '', to = '' } = {}) {
  const statusValue = String(status || 'all').toLowerCase();
  const accountValue = String(adAccountId || '').trim();
  const fromDate = normalizeDateInput(from, false);
  const toDate = normalizeDateInput(to, true);

  return rows.filter((row) => {
    if (statusValue === 'success' && !row.ok) return false;
    if (statusValue === 'failed' && row.ok) return false;
    if (accountValue && String(row.adAccountId || '').trim() !== accountValue) return false;

    const createdAt = new Date(row.createdAt);
    if (fromDate && createdAt < fromDate) return false;
    if (toDate && createdAt > toDate) return false;
    return true;
  });
}

export function getRunReportWithFilters({
  limit = 50,
  status = 'all',
  adAccountId = '',
  from = '',
  to = ''
} = {}) {
  const rows = readRunHistory();
  const filteredRows = filterRows(rows, { status, adAccountId, from, to });
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(1000, Number(limit))) : 50;
  const latestRows = filteredRows.slice(-safeLimit).reverse();

  const total = filteredRows.length;
  const success = filteredRows.filter((x) => x.ok).length;
  const failed = total - success;
  const totalBudget = filteredRows.reduce((sum, row) => sum + parseBudget(row.budget), 0);
  const avgDurationMs = filteredRows.length
    ? Math.round(
        filteredRows.reduce((sum, row) => sum + Number(row.durationMs || 0), 0) / filteredRows.length
      )
    : 0;

  const errorTypeCounts = {};
  for (const row of filteredRows) {
    if (row.ok) continue;
    const key = row.errorType || 'UNKNOWN';
    errorTypeCounts[key] = (errorTypeCounts[key] || 0) + 1;
  }

  const topErrors = Object.entries(errorTypeCounts)
    .map(([errorType, count]) => ({ errorType, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    summary: {
      totalRuns: total,
      successRuns: success,
      failedRuns: failed,
      successRate: total ? Number(((success / total) * 100).toFixed(1)) : 0,
      totalBudget,
      avgDurationMs,
      topErrors
    },
    rows: latestRows
  };
}

export function buildRunReportCsv({
  limit = 500,
  status = 'all',
  adAccountId = '',
  from = '',
  to = ''
} = {}) {
  const { rows } = getRunReportWithFilters({ limit, status, adAccountId, from, to });
  const headers = [
    'createdAt',
    'ok',
    'adAccountId',
    'pageId',
    'budget',
    'durationMs',
    'operatorName',
    'businessId',
    'campaignId',
    'adSetId',
    'adId',
    'errorType',
    'errorMessage'
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(
      [
        row.createdAt,
        row.ok ? 'SUCCESS' : 'FAILED',
        row.adAccountId,
        row.pageId,
        row.budget,
        row.durationMs || '',
        row.operatorName || '',
        row.businessId || '',
        row.campaignId || '',
        row.adSetId || '',
        row.adId || '',
        row.errorType || '',
        row.errorMessage || ''
      ].map(escapeCsvCell).join(',')
    );
  }

  return lines.join('\n');
}
