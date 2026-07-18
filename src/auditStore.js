import fs from 'fs';
import path from 'path';

const DATA_DIR =
  process.env.RAILWAY_VOLUME_MOUNT_PATH ||
  process.env.DATA_DIR ||
  (process.env.VERCEL ? '/tmp/adsmanager-data' : path.resolve('data'));
const AUDIT_FILE = path.join(DATA_DIR, 'audits.json');
const MAX_AUDITS = Number(process.env.AUDIT_MAX || 2000);
const REVIEW_NUMBER_BASE = Number(process.env.AUDIT_NUMBER_BASE || 1000);

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(AUDIT_FILE)) {
    fs.writeFileSync(AUDIT_FILE, '[]', 'utf8');
  }
}

export function readAudits() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAudits(rows) {
  ensureStore();
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(rows, null, 2), 'utf8');
}

function generateShortId(existingIds) {
  let id = '';
  do {
    id = Math.random().toString(36).slice(2, 8);
  } while (existingIds.has(id));
  return id;
}

export function saveAudit(record = {}) {
  const rows = readAudits();
  const existingIds = new Set(rows.map((r) => r.id));

  const maxNumber = rows.reduce(
    (max, r) => (Number(r.reviewNumber) > max ? Number(r.reviewNumber) : max),
    REVIEW_NUMBER_BASE
  );

  const saved = {
    id: generateShortId(existingIds),
    reviewNumber: maxNumber + 1,
    createdAt: new Date().toISOString(),
    ...record
  };

  const next = [...rows, saved];
  const trimmed = next.length > MAX_AUDITS ? next.slice(next.length - MAX_AUDITS) : next;
  writeAudits(trimmed);
  return saved;
}

export function getAudit(id) {
  const rows = readAudits();
  return rows.find((r) => r.id === String(id)) || null;
}

export function listAudits(limit = 50) {
  const rows = readAudits();
  const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(500, Number(limit))) : 50;
  return rows
    .slice(-safeLimit)
    .reverse()
    .map((r) => ({
      id: r.id,
      reviewNumber: r.reviewNumber,
      createdAt: r.createdAt,
      score: r.score,
      grade: r.grade,
      confidence: r.confidence?.percent ?? null,
      adAccountId: r.adAccountId || '',
      operatorName: r.operatorName || ''
    }));
}
