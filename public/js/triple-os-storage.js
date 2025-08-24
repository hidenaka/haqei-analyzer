// triple-os-storage.js  —  P1: 保存専用。読取は次段階（有料ページ）。
export const TRIPLE_OS_KEY = 'haqei.tripleOS.v1';
export const TRIPLE_OS_VERSION = 'v1';

/**
 * @typedef {Object} TripleOSPayload
 * @property {string} engineOS
 * @property {string} interfaceOS
 * @property {string} safeModeOS
 * @property {string} [source]
 * @property {string} [notes]
 */

/**
 * 保存（失敗は UI/ログで明示。握りつぶさない）
 * @param {TripleOSPayload} payload
 * @param {{ttlHours?: number}} [opts]
 */
export function saveTripleOSResults(payload, opts = {}) {
  const ttlHours = Number.isFinite(opts.ttlHours) ? opts.ttlHours : 24;

  // 1) 基本バリデーション（逃げない）
  assertNonEmptyString(payload?.engineOS, 'engineOS');
  assertNonEmptyString(payload?.interfaceOS, 'interfaceOS');
  assertNonEmptyString(payload?.safeModeOS, 'safeModeOS');

  // 2) 時刻計算
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlHours * 60 * 60 * 1000);

  const record = {
    version: TRIPLE_OS_VERSION,
    engineOS: payload.engineOS,
    interfaceOS: payload.interfaceOS,
    safeModeOS: payload.safeModeOS,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    source: payload.source || 'os-analyzer@web',
    notes: payload.notes || ''
  };

  // 3) 整合性チェック
  if (expiresAt <= createdAt) {
    throw new Error('expiresAt must be later than createdAt');
  }

  // 4) 保存（例外は表面化）
  try {
    const json = JSON.stringify(record);
    window.localStorage.setItem(TRIPLE_OS_KEY, json);
    // 開発時ログ（本番は静かに成功）
    if (typeof window !== 'undefined' && window?.HAQEI_DEBUG) {
      console.info('[HAQEI] Triple OS saved:', record);
    }
    return record; // 呼び出し側で確認可能
  } catch (e) {
    // 失敗を隠さない：UIに出す用のイベントを投げる（ページ側が拾える）
    dispatchStorageError('保存に失敗しました（容量不足/プライベートモードなど）', e);
    throw e;
  }
}

/**
 * （今回 Future Simulator では使用しないが、検証用/将来用）
 */
export function readTripleOSRaw() {
  const raw = window.localStorage.getItem(TRIPLE_OS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearTripleOS() {
  window.localStorage.removeItem(TRIPLE_OS_KEY);
}

/** ユーティリティ */
function assertNonEmptyString(v, name) {
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new TypeError(`Invalid ${name}: non-empty string required.`);
  }
}

function dispatchStorageError(message, error) {
  try {
    const ev = new CustomEvent('haqei:tripleos:save-error', { detail: { message, error }});
    window.dispatchEvent(ev);
  } catch (_) {
    // イベント生成が禁止されていても落とさない
  }
  console.error('[HAQEI] Triple OS save error:', message, error);
}