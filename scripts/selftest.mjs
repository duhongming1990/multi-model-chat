/**
 * End-to-end self test for @local/multi-model-chat.
 *
 *   node scripts/selftest.mjs [origin]
 *
 * Exercises the installed Host routes: health → create a group with two models
 * → like → stats → retry → delete. It never calls the page UI, so it verifies
 * the Host half plus the shared storage/like/stats implementation the page and
 * the Agent tool both use.
 *
 * Default origin: http://127.0.0.1:3080 (override with the first argument or
 * DSH_WEB_ORIGIN, e.g. http://10.121.87.5:3080).
 */

const ORIGIN = (process.argv[2] || process.env.DSH_WEB_ORIGIN || 'http://127.0.0.1:3080').replace(/\/+$/, '');
const BASE = ORIGIN + '/plugins-local/multi-model-chat';
const MODELS = ['GLM-5.1', 'Qwen3.7-Max'];

let failures = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ok   ${name}`);
    return true;
  }
  failures += 1;
  console.log(`  FAIL ${name}${detail === undefined ? '' : ' — ' + JSON.stringify(detail)}`);
  return false;
}

async function call(path, options = {}) {
  const { method = 'GET', body, timeoutMs = 240000 } = options;
  const init = { method, signal: AbortSignal.timeout(timeoutMs) };
  if (body !== undefined) {
    init.headers = { 'content-type': 'application/json' };
    init.body = JSON.stringify(body);
  }
  const response = await fetch(BASE + path, init);
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  return { status: response.status, payload };
}

console.log(`origin: ${ORIGIN}`);
console.log('health');
const health = await call('/health');
check('GET /health → 200', health.status === 200, health.status);
check('apiKey configured', health.payload?.hasApiKey === true, health.payload?.hasApiKey);
check('endpoint reported', typeof health.payload?.endpoint === 'string', health.payload?.endpoint);

console.log('create group');
const created = await call('/groups', {
  method: 'POST',
  body: { prompt: '你好，请用一句话介绍你自己', models: MODELS, layout: 'stack' }
});
check('POST /groups → 200', created.status === 200, created.payload);
const group = created.payload?.group;
check('group saved with responses', Array.isArray(group?.responses) && group.responses.length === MODELS.length, group?.responses?.length);
const okResponses = (group?.responses || []).filter((item) => item.ok);
check('at least one model answered', okResponses.length > 0, okResponses.length);

console.log('like / stats');
const like = await call(`/groups/${group.id}/like`, { method: 'POST', body: { model: MODELS[0], liked: true } });
check('POST like → 200', like.status === 200, like.status);
check('response is liked', (like.payload?.group?.responses || []).find((item) => item.model === MODELS[0])?.liked === true);
const stats = await call('/stats');
check('GET /stats → 200', stats.status === 200, stats.status);
check('stats counts the like', stats.payload?.stats?.totalLikes >= 1, stats.payload?.stats?.totalLikes);
const modelStat = (stats.payload?.stats?.models || []).find((item) => item.model === MODELS[0]);
check('model like appears in ranking', modelStat?.likes >= 1, modelStat);

console.log('retry');
const retried = await call(`/groups/${group.id}/retry`, { method: 'POST', body: { model: MODELS[1] } });
check('POST retry → 200', retried.status === 200, retried.status);
check('retried response cleared its like', (retried.payload?.group?.responses || []).find((item) => item.model === MODELS[1])?.liked === false);

console.log('delete');
const removed = await call(`/groups/${group.id}`, { method: 'DELETE' });
check('DELETE /groups/<id> → 200', removed.status === 200, removed.status);
const after = await call(`/groups/${group.id}`);
check('deleted group is gone', after.status === 404, after.status);

console.log(failures === 0 ? '\nall checks passed' : `\n${failures} check(s) failed`);
process.exitCode = failures === 0 ? 0 : 1;
