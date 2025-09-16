/**
 * serena-logger.mjs
 * - SERENA_ENDPOINT に対してログをPOST送信します。
 * - SERENA_TOKEN があれば Authorization: Bearer を付与します。
 * - 環境変数が無い場合は標準出力にフォールバックします（失敗しない）。
 */

export async function logSerena(payload) {
  try {
    const endpoint = process.env.SERENA_ENDPOINT;
    if (!endpoint) {
      console.log('[serena-log]', JSON.stringify(payload));
      return { ok: true, offline: true };
    }
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.SERENA_TOKEN) headers['Authorization'] = `Bearer ${process.env.SERENA_TOKEN}`;
    const body = {
      project: 'haqei-analyzer',
      timestamp: new Date().toISOString(),
      ...payload
    };
    const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
    const ok = res.ok;
    if (!ok) {
      const txt = await res.text().catch(()=> '');
      console.warn('[serena-log] failed', res.status, txt);
    }
    return { ok };
  } catch (e) {
    console.warn('[serena-log] error', e?.message || e);
    return { ok: false, error: String(e) };
  }
}

