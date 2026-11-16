/**
 * Host half of dsh-multi-model-chat.
 *
 * 一次提问 → 并发调用多个 OpenAI 兼容模型 → 把这一组问答保存下来 → 用户可以逐条点赞
 * → 汇总成模型点赞分析统计。
 *
 * 两个调用方，同一套实现：
 *   - 页面（client.js）调用同源 HTTP 路由 `/plugins-local/multi-model-chat/*`；
 *   - Agent 调用 `multi_model_chat` 工具。
 *
 * 路由：
 *   GET    /health                 配置概览（绝不返回 apiKey）
 *   GET    /config                 /health + 上游模型目录探测
 *   GET    /models                 上游 /models 目录（探测失败回退配置）
 *   GET    /groups                 已保存的对话组摘要（?limit=&q=）
 *   POST   /groups                 并发调用多个模型并保存一组对话
 *   GET    /groups/<id>            一组对话的完整内容
 *   DELETE /groups/<id>            删除一组对话
 *   POST   /groups/<id>/like       对某个模型的回答点赞/取消点赞 {model, liked?}
 *   POST   /groups/<id>/retry      重新生成某个模型的回答 {model}
 *   GET    /stats                  模型点赞分析统计
 *
 * 数据文件默认 `$DSH_HOME/storages/multi-model-chat/groups.json`（原子写入，
 * 串行保存；历史超过 historyLimit 时丢弃最旧的一组）。
 */

import { realpathSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

/* ------------------------------------------------------------------ DSH imports
 * A locally linked bundle carries no dependencies, so DSH-internal packages
 * resolve through the running launcher's module tree. */
async function importDshPackage(spec) {
  try {
    return await import(spec);
  } catch {
    /* not resolvable from this package's own directory */
  }
  const markers = [];
  if (typeof process.argv[1] === 'string' && process.argv[1] !== '') markers.push(process.argv[1]);
  if (typeof process.execPath === 'string' && process.execPath !== '') markers.push(process.execPath);
  if (typeof process.env.DSH_PROFILE_DIR === 'string' && process.env.DSH_PROFILE_DIR !== '') {
    markers.push(join(process.env.DSH_PROFILE_DIR, 'package.json'));
  }
  for (const marker of markers) {
    let base;
    try {
      base = realpathSync(marker);
    } catch {
      continue;
    }
    let resolved;
    try {
      resolved = createRequire(base).resolve(spec);
    } catch {
      continue;
    }
    return await import(pathToFileURL(resolved).href);
  }
  throw new Error(`dsh-multi-model-chat: cannot locate ${spec} from ${import.meta.url}`);
}

const { default: z } = await importDshPackage('@deepseek-ai/schemastery');

/* --------------------------------------------------------------- constants */

const PLUGIN_NAME = 'multi-model-chat';
const PACKAGE_NAME = 'dsh-multi-model-chat';
const BASE = '/plugins-local/multi-model-chat';
const GROUPS_PREFIX = `${BASE}/groups`;
const TOOL_NAME = 'multi_model_chat';

const DEFAULT_ENDPOINT = 'http://localhost:8080/v1/chat/completions';
const DEFAULT_API_KEY = '';
const DEFAULT_MODELS = [
  'deepseek-v4-pro-think-search',
  'Doubao-pro-thinking',
  'GLM-5.1',
  'Qwen3.7-Max',
  'Kimi-K2.6'
];
const LAYOUTS = ['tags', 'stack', 'row', 'cards'];
const DEFAULT_LAYOUT = 'stack';
const MAX_MODELS = 12;
const MAX_PROMPT_CHARS = 20000;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_ERROR_CHARS = 1200;
const MODEL_CACHE_MS = 60000;
const UPSTREAM_MODELS_TIMEOUT_MS = 8000;
const DEFAULT_TIMEOUT_MS = 180000;
const DEFAULT_HISTORY_LIMIT = 200;
const STORE_VERSION = 1;

/* ------------------------------------------------------------------- config */

export const name = PLUGIN_NAME;

export const Config = z.object({
  endpoint: z
    .string()
    .description('OpenAI 兼容的 chat/completions 地址（默认本机 Chat2API）')
    .default(DEFAULT_ENDPOINT)
    .volatile(),
  apiKey: z
    .string()
    .role('secret')
    .description('接口 API Key（Bearer 令牌，页面只显示是否已配置）')
    .default(DEFAULT_API_KEY)
    .volatile(),
  models: z
    .array(z.string())
    .description('默认并发调用的模型列表')
    .default(DEFAULT_MODELS)
    .volatile(),
  timeoutMs: z
    .number()
    .step(1)
    .min(5000)
    .max(900000)
    .description('单个模型请求超时（毫秒）')
    .default(DEFAULT_TIMEOUT_MS)
    .volatile(),
  historyLimit: z
    .number()
    .step(1)
    .min(10)
    .max(2000)
    .description('本地最多保留多少组对话（超出后丢弃最旧的）')
    .default(DEFAULT_HISTORY_LIMIT)
    .volatile(),
  dataDir: z
    .string()
    .description('对话数据目录（留空使用 $DSH_HOME/storages/multi-model-chat）')
    .default('')
    .volatile()
});

/* -------------------------------------------------------------------- utils */

function dshHome() {
  const fromEnv = String(process.env.DSH_HOME || '').trim();
  if (fromEnv) return fromEnv;
  const profileDir = String(process.env.DSH_PROFILE_DIR || '').trim();
  if (profileDir) return dirname(dirname(profileDir));
  return join(homedir(), '.dsh');
}

function clampInt(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(number)));
}

/** Read one Config field, which is a live ref once marked volatile. */
function readField(field, fallback) {
  try {
    const value = field && typeof field.get === 'function' ? field.get() : field;
    return value === undefined || value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function stringField(value, fallback = '') {
  const text = String(readField(value, fallback) ?? '').trim();
  return text === '' ? fallback : text;
}

function normalizeStringList(value) {
  const raw = readField(value, []);
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/[,，\n]/) : [];
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const model = String(item ?? '').trim();
    if (!model || seen.has(model)) continue;
    seen.add(model);
    out.push(model);
    if (out.length >= MAX_MODELS) break;
  }
  return out;
}

/** Snapshot the live Config on every operation, so Plugin Center edits apply. */
function readConfig(config) {
  return {
    endpoint: normalizeEndpoint(stringField(config.endpoint, DEFAULT_ENDPOINT)),
    apiKey: stringField(config.apiKey, ''),
    models: normalizeStringList(config.models).length
      ? normalizeStringList(config.models)
      : DEFAULT_MODELS.slice(),
    timeoutMs: clampInt(readField(config.timeoutMs, DEFAULT_TIMEOUT_MS), 5000, 900000, DEFAULT_TIMEOUT_MS),
    historyLimit: clampInt(readField(config.historyLimit, DEFAULT_HISTORY_LIMIT), 10, 2000, DEFAULT_HISTORY_LIMIT),
    dataDir: stringField(config.dataDir, '')
  };
}

function resolveDataFile(cfg) {
  const dir = cfg.dataDir || join(dshHome(), 'storages', 'multi-model-chat');
  return { dir, file: join(dir, 'groups.json') };
}

/** Accept either a complete endpoint or a base such as `http://host/v1`. */
function normalizeEndpoint(value) {
  let text = String(value ?? '').trim();
  if (!text) return DEFAULT_ENDPOINT;
  text = text.replace(/\/+$/, '');
  if (/\/chat\/completions$/i.test(text)) return text;
  return `${text}/chat/completions`;
}

/** `/v1/chat/completions` → `/v1/models`; an unknown shape disables the probe. */
function modelsEndpoint(cfg) {
  const match = /^(.*)\/chat\/completions$/i.exec(cfg.endpoint);
  return match ? `${match[1]}/models` : '';
}

/** Upstream provider labels mapped onto the short names the page groups by. */
const PROVIDER_ALIASES = {
  '豆包': 'doubao',
  '腾讯元宝': 'yuanbao',
  'kimi': 'kimi',
  'glm': 'glm',
  'mimo': 'mimo',
  'minimax': 'minimax',
  'qwen': 'qwen',
  'deepseek': 'deepseek'
};

function providerOf(entry) {
  const id = String((entry && entry.id) || '');
  if (/^deepseek/i.test(id)) return 'deepseek';
  const owner = String((entry && entry.owner) || '').trim();
  const alias = PROVIDER_ALIASES[owner.toLowerCase()];
  if (alias) return alias;
  if (owner && owner.toLowerCase() !== 'model-mapping') return owner.toLowerCase();
  const prefix = id.split(/[-_]/)[0] || 'other';
  return prefix.toLowerCase();
}

/** Normalize an upstream `/models` body into stable `{id, owner}` entries. */
function catalogEntriesOf(data) {
  const list = Array.isArray(data && data.data) ? data.data : [];
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const id = String((item && item.id) || '').trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, owner: String((item && item.owned_by) || '').trim() });
  }
  return out;
}

/** `sk-...yowD` → `sk*****yowD`; the page never receives the real key. */
function maskKey(key) {
  const text = String(key || '');
  if (!text) return '';
  if (text.length <= 8) return '****';
  return `${text.slice(0, 2)}*****${text.slice(-4)}`;
}

function normalizeModels(input, fallback) {
  const list = Array.isArray(input) ? input : [];
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const model = String(item ?? '').trim();
    if (!model || seen.has(model)) continue;
    seen.add(model);
    out.push(model);
    if (out.length >= MAX_MODELS) break;
  }
  if (out.length) return out;
  return normalizeStringList(fallback);
}

function normalizeLayout(input) {
  const layout = String(input ?? '').trim();
  return LAYOUTS.includes(layout) ? layout : DEFAULT_LAYOUT;
}

function errorMessage(error) {
  if (!error) return '未知错误';
  if (typeof error === 'string') return error;
  if (typeof error.message === 'string' && error.message) return error.message;
  return String(error);
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function statusForError(error) {
  const status = error && Number.isInteger(error.status) ? error.status : 500;
  return status >= 400 && status < 600 ? status : 500;
}

function sendJson(res, status, value) {
  if (res.headersSent) return;
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(value));
}

function sendMethodNotAllowed(res, allow) {
  res.statusCode = 405;
  res.setHeader('allow', allow);
  res.end();
}

function readJsonBody(req, limit = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.byteLength;
      if (size > limit) {
        reject(httpError(413, '请求体过大'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (size === 0) {
        resolve({});
        return;
      }
      const text = Buffer.concat(chunks, size).toString('utf8');
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        reject(httpError(400, '请求体不是合法 JSON'));
        return;
      }
      resolve(parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {});
    });
    req.on('error', reject);
  });
}

function newGroupId() {
  return `mmc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function titleOf(prompt) {
  const firstLine = String(prompt).split(/\r?\n/).find((line) => line.trim() !== '') || '';
  return firstLine.trim().slice(0, 60);
}

function dayKey(timestamp) {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function textOfContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part && typeof part.text === 'string') return part.text;
        if (part && typeof part.content === 'string') return part.content;
        return '';
      })
      .join('');
  }
  return '';
}

function usageOf(data) {
  const usage = data && data.usage;
  if (!usage || typeof usage !== 'object') return null;
  const prompt = Number(usage.prompt_tokens) || 0;
  const completion = Number(usage.completion_tokens) || 0;
  const total = Number(usage.total_tokens) || prompt + completion;
  if (!prompt && !completion && !total) return null;
  return { prompt, completion, total };
}

/* ------------------------------------------------------------------- storage */

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeResponse(raw) {
  if (!isRecord(raw)) return null;
  const model = String(raw.model ?? '').trim();
  if (!model) return null;
  return {
    model,
    ok: raw.ok === true,
    content: typeof raw.content === 'string' ? raw.content : '',
    reasoning: typeof raw.reasoning === 'string' ? raw.reasoning : '',
    error: typeof raw.error === 'string' && raw.error ? raw.error.slice(0, MAX_ERROR_CHARS) : null,
    latencyMs: Number.isFinite(Number(raw.latencyMs)) ? Math.max(0, Math.trunc(Number(raw.latencyMs))) : 0,
    tokens: isRecord(raw.tokens)
      ? {
          prompt: Math.max(0, Math.trunc(Number(raw.tokens.prompt) || 0)),
          completion: Math.max(0, Math.trunc(Number(raw.tokens.completion) || 0)),
          total: Math.max(0, Math.trunc(Number(raw.tokens.total) || 0))
        }
      : null,
    responseModel: typeof raw.responseModel === 'string' ? raw.responseModel : '',
    liked: raw.liked === true,
    likedAt: raw.liked === true && Number.isFinite(Number(raw.likedAt)) ? Number(raw.likedAt) : null
  };
}

function sanitizeGroup(raw) {
  if (!isRecord(raw)) return null;
  const id = String(raw.id ?? '').trim();
  const createdAt = Number(raw.createdAt);
  if (!id || !Number.isFinite(createdAt)) return null;
  const responses = Array.isArray(raw.responses)
    ? raw.responses.map(sanitizeResponse).filter((item) => item !== null)
    : [];
  return {
    id,
    createdAt: Math.trunc(createdAt),
    prompt: typeof raw.prompt === 'string' ? raw.prompt : '',
    title: typeof raw.title === 'string' ? raw.title : '',
    layout: normalizeLayout(raw.layout),
    models: Array.isArray(raw.models) ? raw.models.map((model) => String(model)) : responses.map((item) => item.model),
    responses,
    durationMs: Number.isFinite(Number(raw.durationMs)) ? Math.max(0, Math.trunc(Number(raw.durationMs))) : 0
  };
}

function countLikes(group) {
  return group.responses.reduce((total, response) => total + (response.liked ? 1 : 0), 0);
}

function toSummary(group) {
  const okCount = group.responses.reduce((total, response) => total + (response.ok ? 1 : 0), 0);
  return {
    id: group.id,
    createdAt: group.createdAt,
    prompt: group.prompt,
    title: group.title || titleOf(group.prompt),
    layout: group.layout,
    models: group.models.slice(),
    responses: group.responses.length,
    okCount,
    errorCount: group.responses.length - okCount,
    likes: countLikes(group),
    durationMs: group.durationMs
  };
}

function toView(group) {
  return {
    id: group.id,
    createdAt: group.createdAt,
    prompt: group.prompt,
    title: group.title || titleOf(group.prompt),
    layout: group.layout,
    models: group.models.slice(),
    responses: group.responses.map((response) => ({ ...response, tokens: response.tokens ? { ...response.tokens } : null })),
    durationMs: group.durationMs,
    okCount: group.responses.reduce((total, response) => total + (response.ok ? 1 : 0), 0),
    errorCount: group.responses.reduce((total, response) => total + (response.ok ? 0 : 1), 0),
    likes: countLikes(group)
  };
}

class GroupStore {
  constructor(file, limit, onError) {
    this.file = file;
    this.limit = limit;
    this.onError = onError;
    this.groups = [];
    this.loaded = false;
    this.loading = null;
    this.saving = Promise.resolve();
    this.writeCounter = 0;
  }

  async load() {
    if (this.loaded) return;
    if (!this.loading) {
      this.loading = this.loadOnce().catch((error) => {
        this.loading = null;
        throw error;
      });
    }
    await this.loading;
  }

  async loadOnce() {
    let text = null;
    try {
      text = await readFile(this.file, 'utf8');
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        this.loaded = true;
        return;
      }
      throw error;
    }
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    const rows = isRecord(data) && Array.isArray(data.groups) ? data.groups : null;
    if (rows === null) {
      /* A corrupted ledger is preserved beside the live file, never discarded. */
      try {
        await rename(this.file, `${this.file}.broken-${Date.now()}`);
      } catch {
        /* best effort */
      }
      this.loaded = true;
      return;
    }
    this.groups = rows
      .map(sanitizeGroup)
      .filter((group) => group !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
    this.trim();
    this.loaded = true;
  }

  /** @returns {boolean} whether the retention limit dropped old groups. */
  trim() {
    if (this.groups.length <= this.limit) return false;
    this.groups.length = this.limit;
    return true;
  }

  get(id) {
    return this.groups.find((group) => group.id === id);
  }

  counts() {
    return {
      groups: this.groups.length,
      responses: this.groups.reduce((total, group) => total + group.responses.length, 0),
      likes: this.groups.reduce((total, group) => total + countLikes(group), 0)
    };
  }

  async add(group) {
    this.groups.unshift(group);
    this.trim();
    await this.persist();
  }

  async remove(id) {
    const index = this.groups.findIndex((group) => group.id === id);
    if (index < 0) return false;
    this.groups.splice(index, 1);
    await this.persist();
    return true;
  }

  async persist() {
    const payload = JSON.stringify({ version: STORE_VERSION, groups: this.groups });
    /* The chain keeps writes serialized; a failed write reaches the caller so a
     * request never reports success for data it could not save. */
    const next = this.saving.catch(() => {}).then(() => this.writeAtomic(payload));
    this.saving = next;
    next.catch((error) => {
      if (typeof this.onError === 'function') this.onError(error);
    });
    return next;
  }

  async writeAtomic(payload) {
    await mkdir(dirname(this.file), { recursive: true });
    this.writeCounter += 1;
    const temp = `${this.file}.tmp-${process.pid}-${this.writeCounter}`;
    await writeFile(temp, payload, 'utf8');
    await rename(temp, this.file);
  }
}

/* --------------------------------------------------------------- statistics */

function computeStats(groups, configuredModels) {
  const models = new Map();
  const ensure = (model) => {
    let entry = models.get(model);
    if (!entry) {
      entry = {
        model,
        responses: 0,
        ok: 0,
        errors: 0,
        likes: 0,
        latencySum: 0,
        latencyCount: 0,
        tokens: 0,
        lastLikedAt: 0
      };
      models.set(model, entry);
    }
    return entry;
  };

  for (const model of configuredModels) ensure(model);

  const layouts = new Map();
  for (const layout of LAYOUTS) {
    layouts.set(layout, { layout, groups: 0, responses: 0, likes: 0 });
  }

  let totalResponses = 0;
  let okResponses = 0;
  let errorResponses = 0;
  let totalLikes = 0;
  const recentLikes = [];

  for (const group of groups) {
    const layoutEntry = layouts.get(group.layout) || { layout: group.layout, groups: 0, responses: 0, likes: 0 };
    layoutEntry.groups += 1;
    layouts.set(group.layout, layoutEntry);

    for (const response of group.responses) {
      totalResponses += 1;
      layoutEntry.responses += 1;
      const entry = ensure(response.model);
      entry.responses += 1;
      if (response.ok) {
        okResponses += 1;
        entry.ok += 1;
        entry.latencySum += response.latencyMs || 0;
        entry.latencyCount += 1;
        if (response.tokens) entry.tokens += response.tokens.total || 0;
      } else {
        errorResponses += 1;
        entry.errors += 1;
      }
      if (response.liked) {
        totalLikes += 1;
        entry.likes += 1;
        layoutEntry.likes += 1;
        const likedAt = response.likedAt || group.createdAt;
        if (likedAt > entry.lastLikedAt) entry.lastLikedAt = likedAt;
        recentLikes.push({
          groupId: group.id,
          model: response.model,
          prompt: group.prompt,
          content: String(response.content || '').slice(0, 180),
          likedAt
        });
      }
    }
  }

  const modelStats = [...models.values()]
    .map((entry) => ({
      model: entry.model,
      responses: entry.responses,
      ok: entry.ok,
      errors: entry.errors,
      likes: entry.likes,
      likeRate: entry.ok > 0 ? entry.likes / entry.ok : 0,
      avgLatencyMs: entry.latencyCount > 0 ? Math.round(entry.latencySum / entry.latencyCount) : 0,
      tokens: entry.tokens,
      lastLikedAt: entry.lastLikedAt
    }))
    .sort((a, b) => b.likes - a.likes || b.likeRate - a.likeRate || a.model.localeCompare(b.model));

  /* Last 14 local days, oldest first, including days with no activity. */
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  const dayIndex = new Map();
  for (let offset = 13; offset >= 0; offset -= 1) {
    const date = new Date(today.getTime() - offset * 24 * 60 * 60 * 1000);
    const key = dayKey(date.getTime());
    const entry = { date: key, groups: 0, responses: 0, likes: 0 };
    days.push(entry);
    dayIndex.set(key, entry);
  }
  for (const group of groups) {
    const entry = dayIndex.get(dayKey(group.createdAt));
    if (entry) {
      entry.groups += 1;
      entry.responses += group.responses.length;
    }
    /* A like belongs to the day it was given, not to the day the question ran. */
    for (const response of group.responses) {
      if (!response.liked) continue;
      const likeEntry = dayIndex.get(dayKey(response.likedAt || group.createdAt));
      if (likeEntry) likeEntry.likes += 1;
    }
  }

  recentLikes.sort((a, b) => b.likedAt - a.likedAt);

  return {
    totalGroups: groups.length,
    totalResponses,
    okResponses,
    errorResponses,
    totalLikes,
    likeRate: okResponses > 0 ? totalLikes / okResponses : 0,
    models: modelStats,
    layouts: [...layouts.values()].sort((a, b) => b.groups - a.groups),
    daily: days,
    recentLikes: recentLikes.slice(0, 12)
  };
}

/* ------------------------------------------------------------- model calls */

const modelCache = { at: 0, key: '', value: null };

async function upstreamModels(cfg, force = false) {
  const url = modelsEndpoint(cfg);
  if (!url) return { models: cfg.models, entries: [], source: 'config' };
  const key = `${url}|${cfg.apiKey}`;
  if (!force && modelCache.value && modelCache.key === key && Date.now() - modelCache.at < MODEL_CACHE_MS) {
    return modelCache.value;
  }
  let value;
  try {
    const headers = cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {};
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(UPSTREAM_MODELS_TIMEOUT_MS) });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!response.ok) {
      const detail =
        (isRecord(data) && isRecord(data.error) && (data.error.message || data.error.code)) ||
        text.slice(0, 300) ||
        `HTTP ${response.status}`;
      throw new Error(`HTTP ${response.status}：${detail}`);
    }
    const entries = catalogEntriesOf(data);
    value = entries.length
      ? { models: entries.map((entry) => entry.id), entries, source: 'upstream' }
      : { models: cfg.models, entries: [], source: 'config' };
  } catch (error) {
    if (force) throw httpError(502, `同步模型失败：${errorMessage(error)}`);
    return { models: cfg.models, entries: [], source: 'config', warning: errorMessage(error) };
  }
  modelCache.at = Date.now();
  modelCache.key = key;
  modelCache.value = value;
  return value;
}

async function askModel(cfg, model, prompt, externalSignal) {
  const startedAt = Date.now();
  const base = {
    model,
    ok: false,
    content: '',
    reasoning: '',
    error: null,
    latencyMs: 0,
    tokens: null,
    responseModel: '',
    liked: false,
    likedAt: null
  };
  if (!cfg.apiKey) {
    return { ...base, error: '未配置 API Key：请在「插件中心 → 插件 → 多模型对话 → 配置」中填写' };
  }
  if (!/^https?:\/\//i.test(cfg.endpoint)) {
    return { ...base, error: `接口地址无效：${cfg.endpoint}` };
  }
  const messages = [];
  const payload = { model, messages, stream: false };
  messages.push({ role: 'user', content: prompt });

  const timeout = AbortSignal.timeout(cfg.timeoutMs);
  let signal = timeout;
  if (externalSignal) {
    try {
      signal = AbortSignal.any([externalSignal, timeout]);
    } catch {
      signal = timeout;
    }
  }

  try {
    const response = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify(payload),
      signal
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!response.ok || (isRecord(data) && data.error)) {
      const detail =
        (isRecord(data) && isRecord(data.error) && (data.error.message || data.error.code)) ||
        (text ? text.slice(0, MAX_ERROR_CHARS) : '') ||
        `HTTP ${response.status}`;
      return {
        ...base,
        latencyMs: Date.now() - startedAt,
        error: String(detail).slice(0, MAX_ERROR_CHARS)
      };
    }
    const choice = isRecord(data) && Array.isArray(data.choices) ? data.choices[0] : null;
    if (!isRecord(choice)) {
      return {
        ...base,
        latencyMs: Date.now() - startedAt,
        error: `接口返回格式异常（没有 choices）：${(text || '').slice(0, MAX_ERROR_CHARS)}`
      };
    }
    const message = isRecord(choice.message) ? choice.message : {};
    const content = textOfContent(message.content);
    const reasoning =
      typeof message.reasoning_content === 'string'
        ? message.reasoning_content
        : typeof message.reasoning === 'string'
          ? message.reasoning
          : '';
    const responseModel = isRecord(data) && typeof data.model === 'string' ? data.model : '';
    return {
      ...base,
      ok: true,
      content,
      reasoning,
      responseModel,
      latencyMs: Date.now() - startedAt,
      tokens: usageOf(data)
    };
  } catch (error) {
    const name = error && error.name;
    const aborted = name === 'TimeoutError' || name === 'AbortError';
    return {
      ...base,
      latencyMs: Date.now() - startedAt,
      error: aborted
        ? `请求超时（超过 ${Math.round(cfg.timeoutMs / 1000)} 秒）`
        : errorMessage(error).slice(0, MAX_ERROR_CHARS)
    };
  }
}

/* ------------------------------------------------------------------- plugin */

export const inject = ['webServer', 'tools'];

export function apply(ctx, config) {
  const cfg = () => readConfig(config);
  const stores = new Map();

  function warn(message) {
    try {
      if (ctx.logger && typeof ctx.logger.warn === 'function') ctx.logger.warn(`multi-model-chat: ${message}`);
    } catch {
      /* logging must never break the caller */
    }
  }

  async function storeFor(current) {
    const resolved = resolveDataFile(current);
    let store = stores.get(resolved.file);
    if (!store) {
      store = new GroupStore(resolved.file, current.historyLimit, (error) =>
        warn(`could not save ${resolved.file} (${errorMessage(error)})`)
      );
      stores.set(resolved.file, store);
    }
    store.limit = current.historyLimit;
    await store.load();
    if (store.trim()) await store.persist();
    return store;
  }

  async function createGroup(input, signal) {
    const current = cfg();
    const prompt = String((input && input.prompt) || '').trim();
    if (!prompt) throw httpError(400, '提问内容不能为空');
    if (prompt.length > MAX_PROMPT_CHARS) {
      throw httpError(413, `提问内容过长（最多 ${MAX_PROMPT_CHARS} 个字符）`);
    }
    const models = normalizeModels(input && input.models, current.models);
    if (!models.length) throw httpError(400, '至少选择一个模型');

    const group = {
      id: newGroupId(),
      createdAt: Date.now(),
      prompt,
      title: titleOf(prompt),
      layout: normalizeLayout(input && input.layout),
      models,
      responses: [],
      durationMs: 0
    };
    const startedAt = Date.now();
    const results = await Promise.all(models.map((model) => askModel(current, model, prompt, signal)));
    group.responses = results;
    group.durationMs = Date.now() - startedAt;

    const store = await storeFor(current);
    await store.add(group);
    return { group, store };
  }

  async function likeResponse(id, model, likedInput) {
    const current = cfg();
    const store = await storeFor(current);
    const group = store.get(id);
    if (!group) throw httpError(404, '对话组不存在');
    const response = group.responses.find((item) => item.model === model);
    if (!response) throw httpError(404, `该对话组里没有模型 ${model} 的回答`);
    const liked = typeof likedInput === 'boolean' ? likedInput : !response.liked;
    response.liked = liked;
    response.likedAt = liked ? Date.now() : null;
    await store.persist();
    return { group, store };
  }

  async function retryResponse(id, model, signal) {
    const current = cfg();
    const store = await storeFor(current);
    const group = store.get(id);
    if (!group) throw httpError(404, '对话组不存在');
    const index = group.responses.findIndex((item) => item.model === model);
    if (index < 0) throw httpError(404, `该对话组里没有模型 ${model} 的回答`);
    const fresh = await askModel(current, model, group.prompt, signal);
    group.responses[index] = { ...fresh, liked: false, likedAt: null };
    await store.persist();
    return { group, store };
  }

  async function statsPayload() {
    const current = cfg();
    const store = await storeFor(current);
    return computeStats(store.groups, current.models);
  }

  async function healthPayload() {
    const current = cfg();
    const store = await storeFor(current);
    return {
      ok: true,
      name: PLUGIN_NAME,
      version: '1.1.0',
      endpoint: current.endpoint,
      modelsUrl: modelsEndpoint(current),
      models: current.models,
      hasApiKey: current.apiKey.length > 0,
      dataFile: store.file,
      historyLimit: current.historyLimit,
      timeoutMs: current.timeoutMs,
      counts: store.counts()
    };
  }

  /* --------------------------------------------------------- settings (UI) */

  /** Test an endpoint/API key pair against the upstream `/models` catalog. */
  async function probeConnection(input) {
    const current = cfg();
    const endpoint = normalizeEndpoint((input && input.endpoint) || current.endpoint);
    if (!/^https?:\/\//i.test(endpoint)) throw httpError(400, 'API 地址必须是以 http:// 或 https:// 开头的地址');
    const draftKey = typeof (input && input.apiKey) === 'string' ? input.apiKey.trim() : '';
    const apiKey = draftKey || current.apiKey;
    if (!apiKey) throw httpError(400, '还没有配置 API Key');
    const url = modelsEndpoint({ endpoint });
    const startedAt = Date.now();
    let response;
    try {
      response = await fetch(url, {
        headers: { authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(12000)
      });
    } catch (error) {
      throw httpError(502, `无法连接上游（${url}）：${errorMessage(error)}`);
    }
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!response.ok) {
      const detail =
        (isRecord(data) && isRecord(data.error) && (data.error.message || data.error.code)) ||
        text.slice(0, 300) ||
        `HTTP ${response.status}`;
      throw httpError(502, `上游返回 HTTP ${response.status}：${detail}`);
    }
    const entries = catalogEntriesOf(data);
    if (!entries.length) throw httpError(502, '上游 /models 没有返回任何模型');
    return {
      ok: true,
      endpoint,
      modelsUrl: url,
      apiKeyMask: maskKey(apiKey),
      latencyMs: Date.now() - startedAt,
      models: entries.map((entry) => entry.id),
      entries: entries.map((entry) => ({ ...entry, provider: providerOf(entry) }))
    };
  }

  /** Test one model with a real chat completion (the page's per-model 测试). */
  async function probeModelCall(input) {
    const current = cfg();
    const endpoint = normalizeEndpoint((input && input.endpoint) || current.endpoint);
    const draftKey = typeof (input && input.apiKey) === 'string' ? input.apiKey.trim() : '';
    const model = String((input && input.model) || '').trim();
    if (!model) throw httpError(400, '缺少 model');
    const probeConfig = {
      ...current,
      endpoint,
      apiKey: draftKey || current.apiKey,
      timeoutMs: Math.min(current.timeoutMs, 45000)
    };
    const response = await askModel(probeConfig, model, '你好');
    return {
      ok: response.ok,
      model,
      latencyMs: response.latencyMs,
      error: response.error || null,
      preview: response.content.slice(0, 160),
      tokens: response.tokens
    };
  }

  async function settingsPayload(forceCatalog = false) {
    const current = cfg();
    const catalog = await upstreamModels(current, forceCatalog);
    const defaults = new Set(current.models);
    const entries = (catalog.entries || []).map((entry) => ({
      id: entry.id,
      owner: entry.owner || '',
      provider: providerOf(entry),
      isDefault: defaults.has(entry.id)
    }));
    const store = await storeFor(current);
    return {
      settings: {
        endpoint: current.endpoint,
        modelsUrl: modelsEndpoint(current),
        apiKeyMask: maskKey(current.apiKey),
        hasApiKey: current.apiKey.length > 0,
        models: current.models.slice(),
        timeoutMs: current.timeoutMs,
        historyLimit: current.historyLimit,
        dataFile: store.file
      },
      catalog: entries,
      catalogSource: catalog.source,
      catalogWarning: catalog.warning || null,
      counts: store.counts()
    };
  }

  /** Persist the plugin's own settings through the profile config editor. */
  async function saveSettings(input) {
    const entry = ctx.fiber && ctx.fiber.entry;
    const editor = typeof ctx.get === 'function' ? ctx.get('configEditor') : undefined;
    if (!entry || !editor) throw httpError(503, '当前 profile 不能保存配置（缺少 configEditor）');
    const current = cfg();
    const patch = input && typeof input === 'object' ? input : {};
    const endpoint = patch.endpoint === undefined ? current.endpoint : normalizeEndpoint(patch.endpoint);
    if (!/^https?:\/\//i.test(endpoint)) throw httpError(400, 'API 地址必须是以 http:// 或 https:// 开头的地址');
    let apiKey = current.apiKey;
    if (patch.clearApiKey === true) apiKey = '';
    else if (typeof patch.apiKey === 'string' && patch.apiKey.trim() !== '') apiKey = patch.apiKey.trim();
    const models = patch.models === undefined ? current.models : normalizeModels(patch.models, []);
    const next = {
      endpoint,
      apiKey,
      models,
      timeoutMs: current.timeoutMs,
      historyLimit: current.historyLimit,
      dataDir: current.dataDir
    };
    await editor.edit(entry, () => next);
    modelCache.value = null;
    modelCache.key = '';
    modelCache.at = 0;
    return settingsPayload();
  }

  /* ----------------------------------------------------------- HTTP routes */

  function groupSegments(req) {
    const pathname = new URL(String(req.url || '/'), 'http://localhost').pathname;
    if (!pathname.startsWith(GROUPS_PREFIX)) return null;
    return pathname
      .slice(GROUPS_PREFIX.length)
      .split('/')
      .filter((segment) => segment !== '');
  }

  function searchOf(req) {
    const url = new URL(String(req.url || '/'), 'http://localhost');
    return {
      q: String(url.searchParams.get('q') || '').trim(),
      limit: clampInt(url.searchParams.get('limit'), 1, 500, 100),
      full: url.searchParams.get('full') === '1'
    };
  }

  const routes = [
    {
      kind: 'exact',
      path: `${BASE}/health`,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return sendMethodNotAllowed(res, 'GET, HEAD');
        try {
          sendJson(res, 200, await healthPayload());
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'exact',
      path: `${BASE}/config`,
      handler: async (req, res) => {
        if (req.method !== 'GET') return sendMethodNotAllowed(res, 'GET');
        try {
          const current = cfg();
          const catalog = await upstreamModels(current);
          const health = await healthPayload();
          sendJson(res, 200, {
            ...health,
            catalog: catalog.models,
            catalogSource: catalog.source,
            catalogWarning: catalog.warning || null
          });
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'exact',
      path: `${BASE}/models`,
      handler: async (req, res) => {
        if (req.method !== 'GET') return sendMethodNotAllowed(res, 'GET');
        try {
          const catalog = await upstreamModels(cfg());
          sendJson(res, 200, {
            models: catalog.models,
            source: catalog.source,
            warning: catalog.warning || null
          });
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'exact',
      path: `${BASE}/stats`,
      handler: async (req, res) => {
        if (req.method !== 'GET') return sendMethodNotAllowed(res, 'GET');
        try {
          sendJson(res, 200, { stats: await statsPayload() });
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'exact',
      path: `${BASE}/settings`,
      handler: async (req, res) => {
        try {
          if (req.method === 'GET') {
            sendJson(res, 200, await settingsPayload());
            return;
          }
          if (req.method === 'POST') {
            const body = await readJsonBody(req);
            sendJson(res, 200, { ok: true, saved: true, ...(await saveSettings(body)) });
            return;
          }
          sendMethodNotAllowed(res, 'GET, POST');
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'exact',
      path: `${BASE}/probe`,
      handler: async (req, res) => {
        if (req.method !== 'POST') return sendMethodNotAllowed(res, 'POST');
        try {
          const body = await readJsonBody(req);
          sendJson(res, 200, body && body.model ? await probeModelCall(body) : await probeConnection(body));
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'exact',
      path: `${BASE}/models/sync`,
      handler: async (req, res) => {
        if (req.method !== 'POST') return sendMethodNotAllowed(res, 'POST');
        try {
          sendJson(res, 200, await settingsPayload(true));
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    },
    {
      kind: 'prefix',
      path: GROUPS_PREFIX,
      handler: async (req, res) => {
        const segments = groupSegments(req);
        if (segments === null) return sendJson(res, 404, { error: 'not found' });
        try {
          /* /groups */
          if (segments.length === 0) {
            if (req.method === 'GET') {
              const current = cfg();
              const store = await storeFor(current);
              const { q, limit, full } = searchOf(req);
              const needle = q.toLowerCase();
              const rows = store.groups
                .filter((group) => {
                  if (!needle) return true;
                  if (group.prompt.toLowerCase().includes(needle)) return true;
                  return group.responses.some((response) => response.content.toLowerCase().includes(needle));
                })
                .slice(0, limit)
                .map(full ? toView : toSummary);
              sendJson(res, 200, {
                groups: rows,
                total: store.groups.length,
                counts: store.counts()
              });
              return;
            }
            if (req.method === 'POST') {
              const body = await readJsonBody(req);
              const result = await createGroup(body, req.signal);
              const stats = computeStats(result.store.groups, cfg().models);
              sendJson(res, 200, { group: toView(result.group), stats, counts: result.store.counts() });
              return;
            }
            return sendMethodNotAllowed(res, 'GET, POST');
          }

          const id = segments[0];

          /* /groups/<id> */
          if (segments.length === 1) {
            const current = cfg();
            const store = await storeFor(current);
            if (req.method === 'GET') {
              const group = store.get(id);
              if (!group) return sendJson(res, 404, { error: '对话组不存在' });
              sendJson(res, 200, { group: toView(group) });
              return;
            }
            if (req.method === 'DELETE') {
              const removed = await store.remove(id);
              if (!removed) return sendJson(res, 404, { error: '对话组不存在' });
              sendJson(res, 200, { ok: true, id, stats: computeStats(store.groups, current.models), counts: store.counts() });
              return;
            }
            return sendMethodNotAllowed(res, 'GET, DELETE');
          }

          const action = segments[1];

          /* /groups/<id>/like */
          if (segments.length === 2 && action === 'like') {
            if (req.method !== 'POST') return sendMethodNotAllowed(res, 'POST');
            const body = await readJsonBody(req);
            const model = String((body && body.model) || '').trim();
            if (!model) throw httpError(400, '缺少 model');
            const result = await likeResponse(id, model, body && body.liked);
            sendJson(res, 200, {
              group: toView(result.group),
              stats: computeStats(result.store.groups, cfg().models),
              counts: result.store.counts()
            });
            return;
          }

          /* /groups/<id>/retry */
          if (segments.length === 2 && action === 'retry') {
            if (req.method !== 'POST') return sendMethodNotAllowed(res, 'POST');
            const body = await readJsonBody(req);
            const model = String((body && body.model) || '').trim();
            if (!model) throw httpError(400, '缺少 model');
            const result = await retryResponse(id, model, req.signal);
            sendJson(res, 200, {
              group: toView(result.group),
              stats: computeStats(result.store.groups, cfg().models),
              counts: result.store.counts()
            });
            return;
          }

          return sendJson(res, 404, { error: 'not found' });
        } catch (error) {
          sendJson(res, statusForError(error), { error: errorMessage(error) });
        }
      }
    }
  ];

  for (const route of routes) {
    ctx.effect(
      () => {
        try {
          return ctx.webServer.register(route);
        } catch (error) {
          warn(`route ${route.path} is owned by another plugin (${errorMessage(error)})`);
          return () => {};
        }
      },
      `multi-model-chat: ${route.kind} ${route.path}`
    );
  }

  /* -------- Agent tool (the natural-language caller of the same operations) */

  const TOOL_PARAMETERS = {
    type: 'object',
    additionalProperties: false,
    properties: {
      action: {
        type: 'string',
        enum: ['ask', 'list', 'get', 'like', 'delete', 'stats'],
        description:
          'ask 并发询问多个模型并保存一组对话；list 列出已保存的对话组；get 读取一组对话；like 对某个模型的回答点赞/取消；delete 删除一组对话；stats 模型点赞分析统计'
      },
      prompt: { type: 'string', description: 'ask 的提问内容' },
      models: {
        type: 'array',
        items: { type: 'string' },
        description: 'ask 参与并发调用的模型列表（默认沿用配置的模型，最多 12 个）'
      },
      layout: {
        type: 'string',
        enum: LAYOUTS,
        description: '保存这组对话时记录的展示样式'
      },
      groupId: { type: 'string', description: 'like/delete/get 的对话组 id' },
      model: { type: 'string', description: 'like 的目标模型名' },
      liked: { type: 'boolean', description: 'like 时显式设置点赞状态；不传则切换' },
      limit: { type: 'integer', description: 'list 返回多少组（默认 20，最多 100）' }
    },
    required: ['action']
  };

  const RESPONSE_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      model: { type: 'string' },
      ok: { type: 'boolean' },
      content: { type: 'string' },
      error: { type: 'string' },
      latencyMs: { type: 'integer' },
      liked: { type: 'boolean' }
    }
  };

  const SUMMARY_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
      createdAt: { type: 'integer' },
      prompt: { type: 'string' },
      title: { type: 'string' },
      layout: { type: 'string' },
      models: { type: 'array', items: { type: 'string' } },
      responses: { type: 'integer' },
      okCount: { type: 'integer' },
      errorCount: { type: 'integer' },
      likes: { type: 'integer' },
      durationMs: { type: 'integer' }
    }
  };

  const GROUP_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
      createdAt: { type: 'integer' },
      prompt: { type: 'string' },
      title: { type: 'string' },
      layout: { type: 'string' },
      models: { type: 'array', items: { type: 'string' } },
      responses: { type: 'array', items: RESPONSE_SCHEMA },
      durationMs: { type: 'integer' },
      okCount: { type: 'integer' },
      errorCount: { type: 'integer' },
      likes: { type: 'integer' }
    }
  };

  const MODEL_STAT_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      model: { type: 'string' },
      responses: { type: 'integer' },
      ok: { type: 'integer' },
      errors: { type: 'integer' },
      likes: { type: 'integer' },
      likeRate: { type: 'number' },
      avgLatencyMs: { type: 'integer' },
      tokens: { type: 'integer' },
      lastLikedAt: { type: 'integer' }
    }
  };

  const STATS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      totalGroups: { type: 'integer' },
      totalResponses: { type: 'integer' },
      okResponses: { type: 'integer' },
      errorResponses: { type: 'integer' },
      totalLikes: { type: 'integer' },
      likeRate: { type: 'number' },
      models: { type: 'array', items: MODEL_STAT_SCHEMA }
    }
  };

  const TOOL_OUTPUT_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
      ok: { type: 'boolean' },
      action: { type: 'string' },
      message: { type: 'string' },
      group: GROUP_SCHEMA,
      groups: { type: 'array', items: SUMMARY_SCHEMA },
      stats: STATS_SCHEMA
    }
  };

  function toolGroupView(group) {
    const view = toView(group);
    return {
      ...view,
      responses: view.responses.map((response) => ({
        model: response.model,
        ok: response.ok,
        content: response.content.slice(0, 4000),
        error: response.error || '',
        latencyMs: response.latencyMs,
        liked: response.liked
      }))
    };
  }

  function toolText(value) {
    const payload = value || {};
    if (!payload.ok) return `失败：${payload.message || '未知错误'}`;
    const action = String(payload.action || '');
    if (action === 'ask' || action === 'get') {
      const group = payload.group || {};
      const lines = [`对话组 ${group.id || ''}：${group.prompt || ''}`];
      for (const response of group.responses || []) {
        lines.push(response.ok ? `\n【${response.model}】(${response.latencyMs}ms)` : `\n【${response.model}】调用失败：${response.error || ''}`);
        if (response.ok) lines.push(String(response.content || '').slice(0, 1200));
        if (response.liked) lines.push('（已点赞）');
      }
      return lines.join('\n');
    }
    if (action === 'list') {
      const groups = payload.groups || [];
      if (!groups.length) return '还没有保存的对话组。';
      return [
        `${payload.message || ''}`,
        ...groups.map(
          (group) =>
            `- ${group.id} · ${new Date(group.createdAt).toLocaleString()} · ${group.models.length} 个模型 · 点赞 ${group.likes} · ${group.title || group.prompt}`
        )
      ].join('\n');
    }
    if (action === 'stats') {
      const stats = payload.stats || {};
      const lines = [
        `${payload.message || ''}`,
        `对话组 ${stats.totalGroups || 0} 组，回答 ${stats.totalResponses || 0} 条，点赞 ${stats.totalLikes || 0} 条（点赞率 ${Math.round((stats.likeRate || 0) * 1000) / 10}%）。`
      ];
      for (const model of stats.models || []) {
        lines.push(
          `- ${model.model}：点赞 ${model.likes} / 回答 ${model.responses}（${Math.round(model.likeRate * 1000) / 10}%），平均 ${model.avgLatencyMs}ms，失败 ${model.errors}`
        );
      }
      return lines.join('\n');
    }
    return payload.message || '完成';
  }

  ctx.effect(
    () => {
      try {
        return ctx.tools.register({
          name: TOOL_NAME,
          description:
            '多模型对话：一次提问并发调用多个 OpenAI 兼容模型（默认本机 Chat2API），把这一组回答保存到本地历史，并支持逐条点赞与模型点赞分析统计。' +
            'action=ask 并发提问并保存（prompt + models）；action=list 列出已保存的对话组；action=get 读取一组对话；action=like 对某个模型回答点赞/取消（groupId + model）；action=delete 删除一组；action=stats 返回模型点赞排名与趋势。' +
            '展示样式 layout 可选 tags（标签）/stack（纵向堆叠）/row（横向排列）/cards（卡片布局）。',
          parameters: TOOL_PARAMETERS,
          output: {
            schema: TOOL_OUTPUT_SCHEMA,
            render: (_args, value) => [{ type: 'text', text: toolText(value || {}) }]
          },
          timeoutMs: 900000,
          execute: async (args, exec) => {
            const input = args && typeof args === 'object' ? args : {};
            const action = String(input.action || 'stats');
            const signal = exec && exec.signal ? exec.signal : undefined;

            if (action === 'ask') {
              const result = await createGroup(input, signal);
              return {
                ok: true,
                action,
                message: `${result.group.responses.length} 个模型已返回，已保存对话组 ${result.group.id}`,
                group: toolGroupView(result.group)
              };
            }

            if (action === 'list') {
              const current = cfg();
              const store = await storeFor(current);
              const limit = clampInt(input.limit, 1, 100, 20);
              const groups = store.groups.slice(0, limit).map(toSummary);
              return {
                ok: true,
                action,
                message: `共 ${store.groups.length} 组对话，返回最近 ${groups.length} 组`,
                groups
              };
            }

            if (action === 'get') {
              const id = String(input.groupId || '').trim();
              if (!id) throw httpError(400, 'get 需要 groupId');
              const store = await storeFor(cfg());
              const group = store.get(id);
              if (!group) throw httpError(404, '对话组不存在');
              return { ok: true, action, message: `对话组 ${id}`, group: toolGroupView(group) };
            }

            if (action === 'like') {
              const id = String(input.groupId || '').trim();
              const model = String(input.model || '').trim();
              if (!id) throw httpError(400, 'like 需要 groupId');
              if (!model) throw httpError(400, 'like 需要 model');
              const result = await likeResponse(id, model, input.liked);
              const target = result.group.responses.find((response) => response.model === model);
              return {
                ok: true,
                action,
                message: `${model} 的这条回答已${target && target.liked ? '点赞' : '取消点赞'}`,
                group: toolGroupView(result.group)
              };
            }

            if (action === 'delete') {
              const id = String(input.groupId || '').trim();
              if (!id) throw httpError(400, 'delete 需要 groupId');
              const store = await storeFor(cfg());
              const removed = await store.remove(id);
              if (!removed) throw httpError(404, '对话组不存在');
              return { ok: true, action, message: `已删除对话组 ${id}` };
            }

            if (action === 'stats') {
              const stats = await statsPayload();
              const best = stats.models.find((model) => model.likes > 0);
              return {
                ok: true,
                action,
                message: best
                  ? `共 ${stats.totalGroups} 组对话、${stats.totalResponses} 条回答、${stats.totalLikes} 个点赞；当前点赞最多的是 ${best.model}（${best.likes} 个）`
                  : `共 ${stats.totalGroups} 组对话、${stats.totalResponses} 条回答，还没有点赞记录`,
                stats: {
                  totalGroups: stats.totalGroups,
                  totalResponses: stats.totalResponses,
                  okResponses: stats.okResponses,
                  errorResponses: stats.errorResponses,
                  totalLikes: stats.totalLikes,
                  likeRate: stats.likeRate,
                  models: stats.models
                }
              };
            }

            throw httpError(400, `未知 action：${action}`);
          }
        });
      } catch (error) {
        warn(`tool registration failed (${errorMessage(error)})`);
        return () => {};
      }
    },
    `multi-model-chat: tool ${TOOL_NAME}`
  );
}
