window.__ModuleLoader__.load({
  id: '@local/multi-model-chat',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

    const NS = 'multiModelChat';
    const PANEL_ID = 'multi-model-chat';
    const API = '/plugins-local/multi-model-chat';
    const LAYOUTS = ['tags', 'stack', 'row', 'cards'];
    const DEFAULT_LAYOUT = 'stack';
    const MAX_MODELS = 12;
    const PREFS_KEY = 'mmc.prefs';
    const API_JSON = { 'content-type': 'application/json' };

    /* ------------------------------------------------------------------ *
     * Dictionaries
     * ------------------------------------------------------------------ */

    const DICT = {
      zh: {
        'nav.label': '多模型对话',
        'page.crumb': '智能助手 · 多模型对比',
        'page.title': '多模型对话',
        'page.subtitle': '一次提问并发调用多个模型，每组回答自动保存；对认可的回答点赞，并查看模型点赞分析与统计。',
        'view.chat': '对话',
        'view.stats': '点赞统计',
        'action.refresh': '刷新',
        'action.send': '发送',
        'action.sending': '生成中…',
        'action.copy': '复制',
        'action.copied': '已复制',
        'action.retry': '重新生成',
        'action.retrying': '生成中…',
        'action.reasoning': '思考过程',
        'action.reasoningHide': '收起思考',
        'action.like': '点赞',
        'action.liked': '已点赞',
        'action.deleteGroup': '删除这组对话',
        'action.history': '历史记录',
        'action.historyHide': '隐藏记录',
        'action.selectAll': '全选',
        'action.clearAll': '清空',
        'health.endpoint': '接口',
        'health.apiKeySet': 'Key 已配置',
        'health.apiKeyMissing': 'Key 未配置',
        'health.saved': '组对话',
        'health.loading': '配置读取中…',
        'health.loadError': '配置读取失败',
        'composer.placeholder': '输入一个问题，同时问多个模型…',
        'composer.models': '参与模型',
        'composer.emptyModels': '请至少选择一个模型',
        'composer.hint': 'Enter 发送 · Shift+Enter 换行',
        'composer.limit': '最多同时选择 12 个模型',
        'layout.label': '多模型回答样式',
        'layout.tags': '标签模式',
        'layout.stack': '纵向堆叠',
        'layout.row': '横向排列',
        'layout.cards': '卡片布局',
        'thread.you': '你',
        'thread.assistant': '默认助手',
        'thread.duration': '{v} 秒',
        'thread.tokensUnknown': '— Tokens',
        'thread.tokenSpeed': '{v} Token/秒',
        'thread.emptyAnswer': '（模型返回了空内容）',
        'thread.errorTitle': '服务器错误，请稍后再试',
        'thread.errorUnknown': '未知错误',
        'thread.errorDetail': '详情',
        'thread.reasoningTitle': '思考过程',
        'thread.pending': '正在并发调用 {n} 个模型…',
        'thread.models': '{n} 个模型',
        'thread.likes': '{n} 个赞',
        'thread.empty.title': '开始你的第一组多模型对话',
        'thread.empty.desc': '选择模型、输入问题，所有模型会并发回答；这一组问答会自动保存到本地。',
        'thread.empty.s1': '你好，介绍一下你自己',
        'thread.empty.s2': '用一句话解释什么是向量数据库',
        'thread.empty.s3': '写一个 Python 快速排序',
        'history.title': '历史记录',
        'history.search': '搜索提问或回答…',
        'history.empty': '还没有保存的对话',
        'history.noMatch': '没有匹配的记录',
        'history.total': '共 {n} 组',
        'notice.saved': '已保存这一组对话',
        'notice.sendFailed': '发送失败',
        'notice.likeFailed': '点赞失败',
        'notice.retryFailed': '重新生成失败',
        'notice.deleteFailed': '删除失败',
        'notice.deleted': '已删除这组对话',
        'notice.copied': '已复制到剪贴板',
        'notice.copyFailed': '复制失败',
        'notice.loadFailed': '接口读取失败',
        'stats.title': '模型点赞分析',
        'stats.subtitle': '统计基于本地已保存的 {n} 组对话、{m} 条模型回答。',
        'stats.groups': '对话组',
        'stats.responses': '模型回答',
        'stats.likes': '总点赞',
        'stats.likeRate': '点赞率',
        'stats.rank.title': '模型点赞排名',
        'stats.rank.aside': '按点赞数 → 点赞率 → 模型名排序',
        'stats.rank.model': '模型',
        'stats.rank.likes': '点赞',
        'stats.rank.responses': '回答',
        'stats.rank.rate': '点赞率',
        'stats.rank.latency': '平均耗时',
        'stats.rank.errors': '失败',
        'stats.trend.title': '近 14 天点赞趋势',
        'stats.trend.aside': '每天被点赞的回答数',
        'stats.layouts.title': '回答样式分布',
        'stats.layouts.aside': '按对话组保存时使用的样式',
        'stats.layouts.pill': '{groups} 组 · {responses} 回答 · {likes} 赞',
        'stats.recent.title': '最近点赞的回答',
        'stats.recent.empty': '还没有点赞记录，去对话页给喜欢的回答点个赞吧。',
        'stats.empty': '还没有可统计的对话。',
        'stats.loading': '统计加载中…',
        'stats.retry': '重新加载',
        'stats.likesUnit': '个',
        'stats.answersUnit': '条',
        'stats.groupsUnit': '组',
        'view.settings': '设置',
        'settings.title': '插件设置',
        'settings.subtitle': '在这里配置 API 连接与默认模型；保存后立即生效，并写入当前 profile 的插件配置。',
        'settings.loading': '设置加载中…',
        'settings.loadFailed': '设置读取失败',
        'settings.retry': '重新加载',
        'settings.api.title': 'API 连接',
        'settings.api.key': 'API 密钥',
        'settings.api.keyPlaceholder': '粘贴新的 API Key',
        'settings.api.keyHint': '已保存：{mask} · 留空表示不修改',
        'settings.api.keyEmpty': '还没有配置 API Key',
        'settings.api.keyWillClear': '保存后将清除已保存的密钥',
        'settings.api.show': '显示密钥',
        'settings.api.hide': '隐藏密钥',
        'settings.api.clear': '清除 Key',
        'settings.api.endpoint': 'API 地址',
        'settings.api.endpointHint': '模型目录：{url} · 可填 http://localhost:8080/v1，保存时自动补全 /chat/completions',
        'settings.api.probe': '检测',
        'settings.api.probing': '检测中…',
        'settings.api.probeOk': '连接正常：{models} 个模型 · {ms} ms',
        'settings.api.probeFailed': '检测失败',
        'settings.api.save': '保存',
        'settings.api.saving': '保存中…',
        'settings.saved': '配置已保存',
        'settings.saveFailed': '保存失败',
        'settings.models.title': '默认模型',
        'settings.models.subtitle': '选中的模型会作为对话页的初始选择，最多 {max} 个',
        'settings.models.selected': '已选 {n} / {total}',
        'settings.models.sync': '同步模型',
        'settings.models.syncing': '同步中…',
        'settings.models.synced': '已同步 {n} 个模型',
        'settings.models.syncFailed': '同步失败',
        'settings.models.search': '搜索模型…',
        'settings.models.selectAll': '全选',
        'settings.models.clearAll': '清空',
        'settings.models.save': '保存默认模型',
        'settings.models.max': '最多选择 {max} 个默认模型',
        'settings.models.test': '测试',
        'settings.models.testing': '测试中…',
        'settings.models.testOk': '{ms} ms',
        'settings.models.testFailed': '失败',
        'settings.models.empty': '还没有模型，点「同步模型」从上游读取',
        'settings.models.noMatch': '没有匹配的模型',
        'settings.models.default': '默认',
        'settings.models.groupSelected': '{n} 个默认',
        'settings.models.savedHint': '保存后对话页会默认勾选这些模型'
      },
      en: {
        'nav.label': 'Multi-model chat',
        'page.crumb': 'Assistant · model comparison',
        'page.title': 'Multi-model chat',
        'page.subtitle': 'Ask once and several models answer at the same time. Every round is saved, each answer can be liked, and the like analysis page ranks the models.',
        'view.chat': 'Chat',
        'view.stats': 'Like analysis',
        'action.refresh': 'Refresh',
        'action.send': 'Send',
        'action.sending': 'Generating…',
        'action.copy': 'Copy',
        'action.copied': 'Copied',
        'action.retry': 'Regenerate',
        'action.retrying': 'Generating…',
        'action.reasoning': 'Reasoning',
        'action.reasoningHide': 'Hide reasoning',
        'action.like': 'Like',
        'action.liked': 'Liked',
        'action.deleteGroup': 'Delete this round',
        'action.history': 'History',
        'action.historyHide': 'Hide history',
        'action.selectAll': 'Select all',
        'action.clearAll': 'Clear',
        'health.endpoint': 'Endpoint',
        'health.apiKeySet': 'Key configured',
        'health.apiKeyMissing': 'Key missing',
        'health.saved': 'rounds',
        'health.loading': 'Loading configuration…',
        'health.loadError': 'Cannot read configuration',
        'composer.placeholder': 'Ask one question and send it to several models…',
        'composer.models': 'Models',
        'composer.emptyModels': 'Select at least one model',
        'composer.hint': 'Enter sends · Shift+Enter adds a line',
        'composer.limit': 'Select at most 12 models',
        'layout.label': 'Answer style',
        'layout.tags': 'Tabs',
        'layout.stack': 'Stacked',
        'layout.row': 'Side by side',
        'layout.cards': 'Cards',
        'thread.you': 'You',
        'thread.assistant': 'Assistant',
        'thread.duration': '{v} s',
        'thread.tokensUnknown': '— Tokens',
        'thread.tokenSpeed': '{v} Token/s',
        'thread.emptyAnswer': '(the model returned no text)',
        'thread.errorTitle': 'Server error, please try again',
        'thread.errorUnknown': 'Unknown error',
        'thread.errorDetail': 'Details',
        'thread.reasoningTitle': 'Reasoning',
        'thread.pending': 'Calling {n} models at the same time…',
        'thread.models': '{n} models',
        'thread.likes': '{n} likes',
        'thread.empty.title': 'Start your first multi-model round',
        'thread.empty.desc': 'Pick the models, ask a question, and every model answers at once. The round is saved locally.',
        'thread.empty.s1': 'Hello, introduce yourself',
        'thread.empty.s2': 'Explain a vector database in one sentence',
        'thread.empty.s3': 'Write a quicksort in Python',
        'history.title': 'History',
        'history.search': 'Search prompts or answers…',
        'history.empty': 'No saved rounds yet',
        'history.noMatch': 'No matching round',
        'history.total': '{n} rounds',
        'notice.saved': 'This round has been saved',
        'notice.sendFailed': 'Send failed',
        'notice.likeFailed': 'Like failed',
        'notice.retryFailed': 'Regenerate failed',
        'notice.deleteFailed': 'Delete failed',
        'notice.deleted': 'Round deleted',
        'notice.copied': 'Copied to clipboard',
        'notice.copyFailed': 'Copy failed',
        'notice.loadFailed': 'Cannot read the plugin endpoint',
        'stats.title': 'Model like analysis',
        'stats.subtitle': 'Based on {n} saved rounds and {m} model answers.',
        'stats.groups': 'Rounds',
        'stats.responses': 'Answers',
        'stats.likes': 'Likes',
        'stats.likeRate': 'Like rate',
        'stats.rank.title': 'Model like ranking',
        'stats.rank.aside': 'Ordered by likes → like rate → name',
        'stats.rank.model': 'Model',
        'stats.rank.likes': 'Likes',
        'stats.rank.responses': 'Answers',
        'stats.rank.rate': 'Like rate',
        'stats.rank.latency': 'Avg latency',
        'stats.rank.errors': 'Errors',
        'stats.trend.title': 'Likes over the last 14 days',
        'stats.trend.aside': 'Liked answers per day',
        'stats.layouts.title': 'Answer style usage',
        'stats.layouts.aside': 'The style each saved round used',
        'stats.layouts.pill': '{groups} rounds · {responses} answers · {likes} likes',
        'stats.recent.title': 'Recently liked answers',
        'stats.recent.empty': 'No likes yet. Open the chat and like an answer you find useful.',
        'stats.empty': 'No rounds to analyse yet.',
        'stats.loading': 'Loading statistics…',
        'stats.retry': 'Reload',
        'stats.likesUnit': '',
        'stats.answersUnit': '',
        'stats.groupsUnit': '',
        'view.settings': 'Settings',
        'settings.title': 'Plugin settings',
        'settings.subtitle': 'Configure the API connection and the default models here. Saving persists them in the active profile plugin configuration and applies immediately.',
        'settings.loading': 'Loading settings…',
        'settings.loadFailed': 'Cannot read settings',
        'settings.retry': 'Reload',
        'settings.api.title': 'API connection',
        'settings.api.key': 'API key',
        'settings.api.keyPlaceholder': 'Paste a new API key',
        'settings.api.keyHint': 'Saved: {mask} · leave blank to keep it',
        'settings.api.keyEmpty': 'No API key configured yet',
        'settings.api.keyWillClear': 'Saving removes the stored key',
        'settings.api.show': 'Show key',
        'settings.api.hide': 'Hide key',
        'settings.api.clear': 'Clear key',
        'settings.api.endpoint': 'API URL',
        'settings.api.endpointHint': 'Models URL: {url} · a base such as http://localhost:8080/v1 is completed to /chat/completions on save',
        'settings.api.probe': 'Test',
        'settings.api.probing': 'Testing…',
        'settings.api.probeOk': 'Connection OK: {models} models · {ms} ms',
        'settings.api.probeFailed': 'Test failed',
        'settings.api.save': 'Save',
        'settings.api.saving': 'Saving…',
        'settings.saved': 'Settings saved',
        'settings.saveFailed': 'Save failed',
        'settings.models.title': 'Default models',
        'settings.models.subtitle': 'The selected models start selected on the chat page, at most {max}',
        'settings.models.selected': '{n} / {total} selected',
        'settings.models.sync': 'Sync models',
        'settings.models.syncing': 'Syncing…',
        'settings.models.synced': 'Synced {n} models',
        'settings.models.syncFailed': 'Sync failed',
        'settings.models.search': 'Search models…',
        'settings.models.selectAll': 'Select all',
        'settings.models.clearAll': 'Clear',
        'settings.models.save': 'Save defaults',
        'settings.models.max': 'Select at most {max} default models',
        'settings.models.test': 'Test',
        'settings.models.testing': 'Testing…',
        'settings.models.testOk': '{ms} ms',
        'settings.models.testFailed': 'failed',
        'settings.models.empty': 'No models yet. Use “Sync models” to read them from the upstream.',
        'settings.models.noMatch': 'No matching model',
        'settings.models.default': 'Default',
        'settings.models.groupSelected': '{n} defaults',
        'settings.models.savedHint': 'The chat page will start with these models selected'
      }
    };

    /* ------------------------------------------------------------------ *
     * Helpers
     * ------------------------------------------------------------------ */

    function interpolate(text, vars) {
      if (!vars) return text;
      return String(text).replace(/\{(\w+)\}/g, (match, key) =>
        Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
      );
    }

    function cls(...parts) {
      return parts.filter(Boolean).join(' ');
    }

    function readPrefs() {
      try {
        const raw = window.localStorage.getItem(PREFS_KEY);
        const value = raw ? JSON.parse(raw) : null;
        return value && typeof value === 'object' ? value : {};
      } catch {
        return {};
      }
    }

    function writePrefs(patch) {
      try {
        const current = readPrefs();
        window.localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...patch }));
      } catch {
        /* storage may be unavailable; preferences then stay in memory only */
      }
    }

    function fmtTime(timestamp) {
      const date = new Date(Number(timestamp) || Date.now());
      const now = new Date();
      const pad = (value) => String(value).padStart(2, '0');
      const sameDay =
        date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
      if (sameDay) return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
      return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function fmtLatency(ms) {
      const value = Number(ms) || 0;
      if (value <= 0) return '—';
      if (value < 1000) return `${Math.round(value)} ms`;
      return `${(value / 1000).toFixed(1)} s`;
    }

    function fmtPercent(ratio) {
      const value = Number(ratio);
      if (!Number.isFinite(value) || value <= 0) return '0%';
      const percent = value * 100;
      return `${percent >= 10 ? Math.round(percent) : Math.round(percent * 10) / 10}%`;
    }

    function hostOf(url) {
      try {
        return new URL(String(url)).host;
      } catch {
        return String(url || '—');
      }
    }

    const BRANDS = [
      { test: /kimi/i, label: 'Kimi', letter: 'K', color: '#111827' },
      { test: /mimo/i, label: 'MiMo', letter: 'Mi', color: '#e11d48' },
      { test: /minimax/i, label: 'MiniMax', letter: 'M', color: '#f97316' },
      { test: /yuanbao/i, label: '元宝', letter: 'Y', color: '#ca8a04' },
      { test: /deepseek/i, label: 'DeepSeek', letter: 'DS', color: '#2563eb' },
      { test: /doubao/i, label: '豆包', letter: 'D', color: '#0ea5e9' },
      { test: /glm/i, label: 'GLM', letter: 'Z', color: '#475569' },
      { test: /qwen/i, label: 'Qwen', letter: 'Q', color: '#7c3aed' },
      { test: /hunyuan/i, label: '混元', letter: 'H', color: '#0d9488' },
      { test: /ernie/i, label: '文心', letter: 'E', color: '#2563eb' }
    ];

    function brandOf(model) {
      const name = String(model || '');
      const found = BRANDS.find((brand) => brand.test.test(name));
      if (found) return found;
      const letter = (name.trim()[0] || '?').toUpperCase();
      return { label: name, letter, color: '#64748b' };
    }

    function tokenSpeed(response) {
      const tokens = response && response.tokens;
      const latency = Number(response && response.latencyMs) || 0;
      if (!tokens || latency <= 0) return 0;
      const count = tokens.completion > 0 ? tokens.completion : tokens.total;
      return count > 0 ? count / (latency / 1000) : 0;
    }

    function apiFetch(path, options) {
      const init = options || {};
      const { timeoutMs, ...rest } = init;
      const budget = Number(timeoutMs) > 0 ? Number(timeoutMs) : 30000;
      const signal = rest.signal || AbortSignal.timeout(budget);
      return fetch(API + path, { ...rest, signal })
        .catch((error) => {
          throw new Error('无法连接 Host 端接口：' + (error && error.message ? error.message : String(error)));
        })
        .then(async (response) => {
          const text = await response.text();
          let body = {};
          if (text) {
            try {
              body = JSON.parse(text);
            } catch {
              throw new Error('接口返回格式异常：' + text.slice(0, 160));
            }
          }
          if (!response.ok) {
            throw new Error((body && body.error) || 'HTTP ' + response.status);
          }
          return body;
        });
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* fall through to the legacy path */
      }
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(area);
        return ok;
      } catch {
        return false;
      }
    }

    /* ------------------------------------------------------------------ *
     * Icons (inline SVG, currentColor)
     * ------------------------------------------------------------------ */

    function svg(children, extra) {
      return h(
        'svg',
        {
          width: 16,
          height: 16,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          focusable: 'false',
          ...(extra || {})
        },
        children
      );
    }

    function IconSpark(props) {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'currentColor', 'aria-hidden': 'true', focusable: 'false', ...(props || {}) },
        h('path', { d: 'M8 1.6l1.5 3.6 3.6 1.5-3.6 1.5L8 11.8 6.5 8.2 2.9 6.7l3.6-1.5z' }),
        h('path', { d: 'M12.6 10.6l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z', opacity: 0.7 })
      );
    }

    function IconCopy() {
      return svg([
        h('rect', { key: 'a', x: 5.2, y: 5.2, width: 8.2, height: 8.2, rx: 1.6 }),
        h('path', { key: 'b', d: 'M10.8 5.2V3.8A1.6 1.6 0 0 0 9.2 2.2H3.8A1.6 1.6 0 0 0 2.2 3.8v5.4a1.6 1.6 0 0 0 1.6 1.6h1.4' })
      ]);
    }

    function IconRefresh() {
      return svg([
        h('path', { key: 'a', d: 'M13.2 8a5.2 5.2 0 1 1-1.6-3.7' }),
        h('path', { key: 'b', d: 'M13.5 2.4v3.2h-3.2' })
      ]);
    }

    function IconThumb() {
      return svg([
        h('path', { key: 'a', d: 'M5.4 7.2v6.6H3.6A1.4 1.4 0 0 1 2.2 12.4V8.6a1.4 1.4 0 0 1 1.4-1.4z' }),
        h('path', { key: 'b', d: 'M5.4 7.4l2.5-4.9a1 1 0 0 1 1.8.3l.2 2.2h2.6a1.4 1.4 0 0 1 1.4 1.7l-1 4.6a1.4 1.4 0 0 1-1.4 1.1H5.4z' })
      ]);
    }

    function IconChevron(props) {
      const open = props && props.open;
      return svg([h('path', { key: 'a', d: open ? 'M4 10l4-4 4 4' : 'M6 4l4 4-4 4' })]);
    }

    function IconTrash() {
      return svg([
        h('path', { key: 'a', d: 'M2.8 4.4h10.4' }),
        h('path', { key: 'b', d: 'M6.2 4.4V3a.8.8 0 0 1 .8-.8h2a.8.8 0 0 1 .8.8v1.4' }),
        h('path', { key: 'c', d: 'M4 4.4l.5 8.2a1 1 0 0 0 1 .9h5a1 1 0 0 0 1-.9l.5-8.2' })
      ]);
    }

    function IconSearch() {
      return svg([h('circle', { key: 'a', cx: 7, cy: 7, r: 4.4 }), h('path', { key: 'b', d: 'M10.4 10.4l3 3' })]);
    }

    function IconClose() {
      return svg([h('path', { key: 'a', d: 'M4 4l8 8M12 4l-8 8' })]);
    }

    function IconChat() {
      return svg([
        h('path', { key: 'a', d: 'M2.4 3.8h11.2v6.6H7.6L4.4 13V10.4H2.4z' })
      ]);
    }

    function IconChart() {
      return svg([
        h('path', { key: 'a', d: 'M2.6 13.4V2.6' }),
        h('path', { key: 'b', d: 'M2.6 13.4h10.8' }),
        h('rect', { key: 'c', x: 4.6, y: 8.2, width: 2.2, height: 5.2, rx: 0.6 }),
        h('rect', { key: 'c2', x: 7.6, y: 5.4, width: 2.2, height: 8, rx: 0.6 }),
        h('rect', { key: 'c3', x: 10.6, y: 3.2, width: 2.2, height: 10.2, rx: 0.6 })
      ]);
    }

    function IconSend() {
      return svg([h('path', { key: 'a', d: 'M2.4 8l11.2-5-3 11-3.2-4.4z' }), h('path', { key: 'b', d: 'M13.6 3L7.4 9.6' })]);
    }

    function IconHistory() {
      return svg([
        h('path', { key: 'a', d: 'M2.6 8a5.4 5.4 0 1 0 1.7-3.9' }),
        h('path', { key: 'b', d: 'M2.2 2.6v3.2h3.2' }),
        h('path', { key: 'c', d: 'M8 5.2V8l2 1.4' })
      ]);
    }

    function IconGear() {
      return svg([
        h('circle', { key: 'a', cx: 8, cy: 8, r: 2.3 }),
        h('path', { key: 'b', d: 'M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1' })
      ]);
    }

    function IconEye(props) {
      const off = props && props.off;
      return svg([
        h('path', { key: 'a', d: 'M1.7 8S4.1 3.7 8 3.7 14.3 8 14.3 8 11.9 12.3 8 12.3 1.7 8 1.7 8z' }),
        h('circle', { key: 'b', cx: 8, cy: 8, r: 2.1 }),
        off ? h('path', { key: 'c', d: 'M2.6 2.6l10.8 10.8' }) : null
      ]);
    }

    function LayoutIcon(props) {
      const mode = props && props.mode;
      if (mode === 'tags') {
        return svg([
          h('rect', { key: 'a', x: 2.4, y: 2.6, width: 5.2, height: 3.2, rx: 0.8 }),
          h('rect', { key: 'b', x: 8.4, y: 2.6, width: 5.2, height: 3.2, rx: 0.8 }),
          h('path', { key: 'c', d: 'M2.6 8.6h10.8M2.6 11.2h10.8M2.6 13.4h6.4' })
        ]);
      }
      if (mode === 'stack') {
        return svg([
          h('rect', { key: 'a', x: 2.4, y: 2.4, width: 11.2, height: 3.2, rx: 0.8 }),
          h('rect', { key: 'b', x: 2.4, y: 6.4, width: 11.2, height: 3.2, rx: 0.8 }),
          h('rect', { key: 'c', x: 2.4, y: 10.4, width: 11.2, height: 3.2, rx: 0.8 })
        ]);
      }
      if (mode === 'row') {
        return svg([
          h('rect', { key: 'a', x: 2.2, y: 3.0, width: 3.2, height: 10, rx: 0.8 }),
          h('rect', { key: 'b', x: 6.4, y: 3.0, width: 3.2, height: 10, rx: 0.8 }),
          h('rect', { key: 'c', x: 10.6, y: 3.0, width: 3.2, height: 10, rx: 0.8 })
        ]);
      }
      return svg([
        h('rect', { key: 'a', x: 2.4, y: 2.4, width: 5, height: 5, rx: 0.8 }),
        h('rect', { key: 'b', x: 8.6, y: 2.4, width: 5, height: 5, rx: 0.8 }),
        h('rect', { key: 'c', x: 2.4, y: 8.6, width: 5, height: 5, rx: 0.8 }),
        h('rect', { key: 'd', x: 8.6, y: 8.6, width: 5, height: 5, rx: 0.8 })
      ]);
    }

    function PanelIcon(props) {
      const size = (props && props.size) || 18;
      const active = props && props.active;
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          focusable: 'false',
          style: { display: 'block', opacity: active ? 1 : 0.9 }
        },
        h('rect', { key: 'a', x: 1.8, y: 2.2, width: 12.4, height: 4.2, rx: 1.2 }),
        h('rect', { key: 'b', x: 1.8, y: 7.8, width: 7.4, height: 4.2, rx: 1.2 }),
        h('path', { key: 'c', d: 'M11.6 9.2v3.6M9.8 11h3.6' })
      );
    }

    function Spinner() {
      return h('span', { className: 'mmc-spinner', 'aria-hidden': true });
    }

    function Avatar() {
      return h('span', { className: 'mmc-avatar', 'aria-hidden': true }, h(IconSpark));
    }

    function ModelGlyph(props) {
      const model = props && props.model;
      const size = (props && props.size) || 20;
      const brand = brandOf(model);
      return h(
        'span',
        {
          className: 'mmc-glyph',
          title: String(model || ''),
          style: {
            width: size + 'px',
            height: size + 'px',
            fontSize: Math.max(8, Math.round(size * 0.46)) + 'px',
            '--mmc-glyph-color': brand.color
          }
        },
        brand.letter
      );
    }

    function ModelBadge(props) {
      return h(
        'span',
        { className: 'mmc-badge', title: String(props.model || '') },
        h(ModelGlyph, { model: props.model, size: 16 }),
        h('span', { className: 'mmc-badge-name' }, String(props.model || ''))
      );
    }

    function Notice(props) {
      const notice = props.notice;
      if (!notice) return null;
      return h(
        'div',
        { className: cls('mmc-notice', 'mmc-notice--' + (notice.tone || 'info')), role: 'status' },
        h('span', { className: 'mmc-notice-text' }, notice.text),
        h(
          'button',
          { type: 'button', className: 'mmc-notice-close', onClick: props.onClose, 'aria-label': 'close' },
          h(IconClose)
        )
      );
    }

    /* ------------------------------------------------------------------ *
     * Thread pieces
     * ------------------------------------------------------------------ */

    function usageText(response, t) {
      const tokens = response && response.tokens;
      if (!tokens || !Number.isFinite(tokens.total) || tokens.total <= 0) return t('thread.tokensUnknown');
      const parts = [tokens.total + ' Tokens'];
      const speed = tokenSpeed(response);
      if (speed > 0) parts.push(interpolate(t('thread.tokenSpeed'), { v: speed.toFixed(1) }));
      return parts.join(' · ');
    }

    function ResponseCard(props) {
      const group = props.group;
      const response = props.response;
      const t = props.t;
      const compact = props.compact;
      const retrying = props.retrying;
      const [showReasoning, setShowReasoning] = useState(false);

      const copy = () => props.onCopy(response.content || '');
      const like = () => props.onLike(group, response);
      const retry = () => props.onRetry(group, response);

      return h(
        'article',
        { className: cls('mmc-answer', compact ? 'mmc-answer--compact' : '', response.ok ? '' : 'mmc-answer--error') },
        h(
          'div',
          { className: 'mmc-answer-head' },
          h(Avatar),
          h(
            'div',
            { className: 'mmc-answer-title' },
            h('span', { className: 'mmc-assistant-name' }, t('thread.assistant')),
            h(ModelBadge, { model: response.model })
          ),
          h('span', { className: 'mmc-answer-meta' }, response.ok ? fmtLatency(response.latencyMs) : '')
        ),
        response.ok
          ? h(
              'div',
              { className: 'mmc-answer-body' },
              response.content
                ? response.content
                : h('span', { className: 'mmc-muted' }, t('thread.emptyAnswer'))
            )
          : h(
              'div',
              { className: 'mmc-errorbox' },
              h('div', { className: 'mmc-error-title' }, '⚠ ' + t('thread.errorTitle')),
              h('div', { className: 'mmc-error-msg' }, response.error || t('thread.errorUnknown')),
              h(
                'details',
                { className: 'mmc-error-details' },
                h('summary', null, t('thread.errorDetail')),
                h('div', { className: 'mmc-error-raw' }, response.error || '')
              )
            ),
        showReasoning && response.reasoning
          ? h(
              'div',
              { className: 'mmc-reasoning' },
              h('div', { className: 'mmc-reasoning-head' }, t('thread.reasoningTitle')),
              h('div', { className: 'mmc-reasoning-body' }, response.reasoning)
            )
          : null,
        h(
          'div',
          { className: 'mmc-answer-actions' },
          h(
            'button',
            { type: 'button', className: 'mmc-act', onClick: copy, title: t('action.copy'), disabled: !response.content },
            h(IconCopy),
            h('span', null, t('action.copy'))
          ),
          h(
            'button',
            { type: 'button', className: 'mmc-act', onClick: retry, title: t('action.retry'), disabled: retrying },
            retrying ? h(Spinner) : h(IconRefresh),
            h('span', null, retrying ? t('action.retrying') : t('action.retry'))
          ),
          response.reasoning
            ? h(
                'button',
                { type: 'button', className: 'mmc-act', onClick: () => setShowReasoning((value) => !value) },
                h(IconChevron, { open: showReasoning }),
                h('span', null, showReasoning ? t('action.reasoningHide') : t('action.reasoning'))
              )
            : null,
          h(
            'button',
            {
              type: 'button',
              className: cls('mmc-act', 'mmc-act--like', response.liked ? 'mmc-act--on' : ''),
              onClick: like,
              title: response.liked ? t('action.liked') : t('action.like'),
              'aria-pressed': response.liked === true
            },
            h(IconThumb),
            h('span', null, response.liked ? t('action.liked') : t('action.like'))
          ),
          h('span', { className: 'mmc-answer-usage' }, usageText(response, t))
        )
      );
    }

    function GroupBlock(props) {
      const group = props.group;
      const layout = props.layout;
      const t = props.t;
      const responses = group.responses || [];
      const [activeModel, setActiveModel] = useState(() => {
        const first = responses.find((response) => response.ok) || responses[0];
        return first ? first.model : '';
      });

      useEffect(() => {
        if (!responses.some((response) => response.model === activeModel)) {
          const first = responses.find((response) => response.ok) || responses[0];
          setActiveModel(first ? first.model : '');
        }
      }, [responses, activeModel]);

      const retryingOf = (model) => Boolean(props.retrying[group.id + '|' + model]);
      const cardFor = (response, compact) =>
        h(ResponseCard, {
          key: response.model,
          group,
          response,
          t,
          compact,
          retrying: retryingOf(response.model),
          onLike: props.onLike,
          onRetry: props.onRetry,
          onCopy: props.onCopy
        });

      let body = null;
      if (layout === 'tags') {
        const active = responses.find((response) => response.model === activeModel) || responses[0];
        body = h(
          'div',
          { className: 'mmc-tags' },
          h(
            'div',
            { className: 'mmc-tabs' },
            responses.map((response) =>
              h(
                'button',
                {
                  key: response.model,
                  type: 'button',
                  className: cls('mmc-tab-model', response.model === (active && active.model) ? 'mmc-tab-model--on' : ''),
                  onClick: () => setActiveModel(response.model)
                },
                h(ModelGlyph, { model: response.model, size: 16 }),
                h('span', { className: 'mmc-tab-model-name' }, response.model),
                response.liked ? h('span', { className: 'mmc-tab-like' }, '♥') : null,
                response.ok ? null : h('span', { className: 'mmc-tab-alert' }, '!')
              )
            )
          ),
          active ? cardFor(active, false) : null
        );
      } else if (layout === 'row') {
        body = h('div', { className: 'mmc-rowwrap' }, responses.map((response) => cardFor(response, true)));
      } else if (layout === 'cards') {
        body = h('div', { className: 'mmc-grid' }, responses.map((response) => cardFor(response, true)));
      } else {
        body = h('div', { className: 'mmc-stack' }, responses.map((response) => cardFor(response, false)));
      }

      return h(
        'section',
        { className: 'mmc-group', 'data-group-id': group.id },
        h(
          'div',
          { className: 'mmc-group-head' },
          h(
            'div',
            { className: 'mmc-group-title' },
            h('span', { className: 'mmc-role-user' }, t('thread.you')),
            h('span', { className: 'mmc-group-time' }, fmtTime(group.createdAt))
          ),
          h(
            'div',
            { className: 'mmc-group-tools' },
            h('span', { className: 'mmc-group-stat' }, interpolate(t('thread.models'), { n: group.models.length })),
            group.likes > 0 ? h('span', { className: 'mmc-group-stat mmc-group-stat--like' }, interpolate(t('thread.likes'), { n: group.likes })) : null,
            h(
              'button',
              {
                type: 'button',
                className: 'mmc-icon-btn',
                title: t('action.deleteGroup'),
                'aria-label': t('action.deleteGroup'),
                onClick: () => props.onDelete(group)
              },
              h(IconTrash)
            )
          )
        ),
        h('div', { className: 'mmc-prompt' }, group.prompt),
        body
      );
    }

    function PendingGroup(props) {
      const pending = props.pending;
      const layout = props.layout;
      const t = props.t;
      const models = pending.models || [];
      const shell = (model) =>
        h(
          'article',
          { key: model, className: 'mmc-answer mmc-answer--pending' },
          h(
            'div',
            { className: 'mmc-answer-head' },
            h(Avatar),
            h(
              'div',
              { className: 'mmc-answer-title' },
              h('span', { className: 'mmc-assistant-name' }, t('thread.assistant')),
              h(ModelBadge, { model })
            ),
            h(Spinner)
          ),
          h('div', { className: 'mmc-answer-body mmc-skeleton' },
            h('span', { className: 'mmc-skeleton-line' }),
            h('span', { className: 'mmc-skeleton-line mmc-skeleton-line--short' })
          )
        );
      let body;
      if (layout === 'row') body = h('div', { className: 'mmc-rowwrap' }, models.map(shell));
      else if (layout === 'cards') body = h('div', { className: 'mmc-grid' }, models.map(shell));
      else body = h('div', { className: 'mmc-stack' }, models.map(shell));

      return h(
        'section',
        { className: 'mmc-group mmc-group--pending' },
        h(
          'div',
          { className: 'mmc-group-head' },
          h(
            'div',
            { className: 'mmc-group-title' },
            h('span', { className: 'mmc-role-user' }, t('thread.you')),
            h('span', { className: 'mmc-group-time' }, interpolate(t('thread.pending'), { n: models.length }))
          )
        ),
        h('div', { className: 'mmc-prompt' }, pending.prompt),
        body
      );
    }

    function EmptyThread(props) {
      const t = props.t;
      const suggestions = ['thread.empty.s1', 'thread.empty.s2', 'thread.empty.s3'];
      return h(
        'div',
        { className: 'mmc-empty' },
        h('div', { className: 'mmc-empty-mark' }, h(IconSpark)),
        h('h2', { className: 'mmc-empty-title' }, t('thread.empty.title')),
        h('p', { className: 'mmc-empty-desc' }, t('thread.empty.desc')),
        h(
          'div',
          { className: 'mmc-suggest' },
          suggestions.map((key) =>
            h(
              'button',
              { key, type: 'button', className: 'mmc-suggest-btn', onClick: () => props.onPick(t(key)) },
              h(IconSpark),
              h('span', null, t(key))
            )
          )
        )
      );
    }

    /* ------------------------------------------------------------------ *
     * Composer
     * ------------------------------------------------------------------ */

    function Composer(props) {
      const t = props.t;
      const draft = props.draft;
      const sending = props.sending;
      const selected = props.selectedModels;
      const catalog = props.catalog;
      const textareaRef = useRef(null);

      useEffect(() => {
        const node = textareaRef.current;
        if (!node) return;
        node.style.height = 'auto';
        node.style.height = Math.min(200, Math.max(52, node.scrollHeight)) + 'px';
      }, [draft]);

      const disabled = sending || String(draft).trim() === '' || selected.length === 0;

      const onKeyDown = (event) => {
        if (event.key !== 'Enter' || event.shiftKey) return;
        if (event.nativeEvent && event.nativeEvent.isComposing) return;
        event.preventDefault();
        if (!disabled) props.onSend();
      };

      return h(
        'div',
        { className: 'mmc-composer' },
        h(
          'div',
          { className: 'mmc-modelbar' },
          h(
            'div',
            { className: 'mmc-modelchips', role: 'group', 'aria-label': t('composer.models') },
            catalog.map((model) => {
              const on = selected.includes(model);
              return h(
                'button',
                {
                  key: model,
                  type: 'button',
                  className: cls('mmc-modelchip', on ? 'mmc-modelchip--on' : ''),
                  'aria-pressed': on,
                  onClick: () => props.onToggleModel(model),
                  title: model
                },
                h(ModelGlyph, { model, size: 16 }),
                h('span', { className: 'mmc-modelchip-name' }, model),
                on ? h('span', { className: 'mmc-modelchip-dot' }, '✓') : null
              );
            })
          ),
          h(
            'div',
            { className: 'mmc-modelbar-side' },
            h('span', { className: 'mmc-modelbar-count' }, selected.length + ' / ' + catalog.length),
            h('button', { type: 'button', className: 'mmc-mini-btn', onClick: props.onSelectAll, disabled: sending }, t('action.selectAll')),
            h('button', { type: 'button', className: 'mmc-mini-btn', onClick: props.onClearAll, disabled: sending || selected.length === 0 }, t('action.clearAll'))
          )
        ),
        h('textarea', {
          ref: textareaRef,
          className: 'mmc-textarea',
          rows: 2,
          value: draft,
          placeholder: t('composer.placeholder'),
          onChange: (event) => props.onDraftChange(event.target.value),
          onKeyDown,
          disabled: sending
        }),
        h(
          'div',
          { className: 'mmc-inputbar' },
          h(
            'div',
            { className: 'mmc-layouts' },
            h('span', { className: 'mmc-layouts-label' }, t('layout.label')),
            LAYOUTS.map((mode) =>
              h(
                'button',
                {
                  key: mode,
                  type: 'button',
                  className: 'mmc-layout-btn',
                  'data-on': props.layout === mode,
                  'data-tip': t('layout.' + mode),
                  'aria-pressed': props.layout === mode,
                  'aria-label': t('layout.' + mode),
                  onClick: () => props.onLayoutChange(mode)
                },
                h(LayoutIcon, { mode })
              )
            )
          ),
          h(
            'div',
            { className: 'mmc-sendbar' },
            h('span', { className: 'mmc-hint' }, sending ? t('action.sending') : t('composer.hint')),
            h(
              'button',
              { type: 'button', className: 'mmc-send', disabled, onClick: props.onSend },
              sending ? h(Spinner) : h(IconSend),
              h('span', null, sending ? t('action.sending') : t('action.send'))
            )
          )
        )
      );
    }

    /* ------------------------------------------------------------------ *
     * History
     * ------------------------------------------------------------------ */

    function HistoryPanel(props) {
      const t = props.t;
      const query = props.query.trim().toLowerCase();
      const groups = props.groups.filter((group) => {
        if (!query) return true;
        if (String(group.prompt || '').toLowerCase().includes(query)) return true;
        return (group.responses || []).some(
          (response) => String(response.model || '').toLowerCase().includes(query) || String(response.content || '').toLowerCase().includes(query)
        );
      });
      return h(
        'aside',
        { className: 'mmc-history' },
        h(
          'div',
          { className: 'mmc-history-head' },
          h('div', { className: 'mmc-history-title' }, h(IconHistory), h('span', null, t('history.title')), h('span', { className: 'mmc-badge-count' }, props.total)),
          h(
            'button',
            { type: 'button', className: 'mmc-icon-btn', onClick: props.onClose, 'aria-label': t('action.historyHide'), title: t('action.historyHide') },
            h(IconClose)
          )
        ),
        h('label', { className: 'mmc-search' },
          h(IconSearch),
          h('input', {
            className: 'mmc-search-input',
            type: 'search',
            value: props.query,
            placeholder: t('history.search'),
            onChange: (event) => props.onQueryChange(event.target.value)
          })
        ),
        groups.length
          ? h(
              'div',
              { className: 'mmc-history-list' },
              groups.map((group) =>
                h(
                  'button',
                  {
                    key: group.id,
                    type: 'button',
                    className: cls('mmc-history-item', props.activeId === group.id ? 'mmc-history-item--active' : ''),
                    onClick: () => props.onSelect(group.id)
                  },
                  h('span', { className: 'mmc-history-item-title' }, group.title || group.prompt),
                  h(
                    'span',
                    { className: 'mmc-history-item-meta' },
                    fmtTime(group.createdAt),
                    ' · ',
                    interpolate(t('thread.models'), { n: (group.responses || []).length }),
                    group.likes > 0 ? ' · ♥ ' + group.likes : ''
                  )
                )
              )
            )
          : h('p', { className: 'mmc-empty-small' }, props.groups.length ? t('history.noMatch') : t('history.empty'))
      );
    }

    /* ------------------------------------------------------------------ *
     * Statistics
     * ------------------------------------------------------------------ */

    function StatsView(props) {
      const t = props.t;
      const stats = props.stats;
      if (stats.status === 'loading' && !stats.value) {
        return h('div', { className: 'mmc-stats-mm' }, h(Spinner), h('span', null, t('stats.loading')));
      }
      if (stats.status === 'error' && !stats.value) {
        return h(
          'div',
          { className: 'mmc-stats-mm' },
          h('span', { className: 'mmc-error-inline' }, t('thread.errorTitle') + '：' + stats.error),
          h('button', { type: 'button', className: 'mmc-btn', onClick: props.onRefresh }, t('stats.retry'))
        );
      }
      const value = stats.value;
      if (!value) return null;
      if (!value.totalGroups) {
        return h('div', { className: 'mmc-stats-mm' }, h('span', null, t('stats.empty')));
      }

      const maxLikes = Math.max(1, ...value.models.map((model) => model.likes));
      const maxDaily = Math.max(1, ...value.daily.map((day) => day.likes));

      return h(
        'div',
        { className: 'mmc-stats' },
        h('div', { className: 'mmc-stats-head' },
          h('div', null,
            h('h2', { className: 'mmc-stats-title' }, t('stats.title')),
            h('p', { className: 'mmc-stats-sub' }, interpolate(t('stats.subtitle'), { n: value.totalGroups, m: value.totalResponses }))
          ),
          h('button', { type: 'button', className: 'mmc-btn mmc-btn--ghost', onClick: props.onRefresh }, h(IconRefresh), t('action.refresh'))
        ),
        h(
          'div',
          { className: 'mmc-stat-cards' },
          h('div', { className: 'mmc-stat-card' }, h('span', { className: 'mmc-stat-value' }, value.totalGroups), h('span', { className: 'mmc-stat-label' }, t('stats.groups'))),
          h('div', { className: 'mmc-stat-card' }, h('span', { className: 'mmc-stat-value' }, value.totalResponses), h('span', { className: 'mmc-stat-label' }, t('stats.responses'))),
          h('div', { className: 'mmc-stat-card' }, h('span', { className: 'mmc-stat-value mmc-stat-value--accent' }, value.totalLikes), h('span', { className: 'mmc-stat-label' }, t('stats.likes'))),
          h('div', { className: 'mmc-stat-card' }, h('span', { className: 'mmc-stat-value' }, fmtPercent(value.likeRate)), h('span', { className: 'mmc-stat-label' }, t('stats.likeRate')))
        ),
        h(
          'section',
          { className: 'mmc-section' },
          h('div', { className: 'mmc-section-head' },
            h('h3', { className: 'mmc-section-title' }, t('stats.rank.title')),
            h('span', { className: 'mmc-section-aside' }, t('stats.rank.aside'))
          ),
          h('div', { className: 'mmc-rank-head' },
            h('span', { className: 'mmc-rank-pos' }, '#'),
            h('span', { className: 'mmc-rank-model' }, t('stats.rank.model')),
            h('span', { className: 'mmc-rank-bar' }),
            h('span', { className: 'mmc-rank-num' }, t('stats.rank.likes')),
            h('span', { className: 'mmc-rank-num' }, t('stats.rank.responses')),
            h('span', { className: 'mmc-rank-num' }, t('stats.rank.rate')),
            h('span', { className: 'mmc-rank-num' }, t('stats.rank.latency')),
            h('span', { className: 'mmc-rank-num' }, t('stats.rank.errors'))
          ),
          value.models.map((model, index) =>
            h(
              'div',
              { key: model.model, className: cls('mmc-rank-row', model.likes > 0 ? 'mmc-rank-row--liked' : '') },
              h('span', { className: 'mmc-rank-pos' }, index + 1),
              h('span', { className: 'mmc-rank-model' }, h(ModelBadge, { model: model.model })),
              h('span', { className: 'mmc-rank-bar' },
                h('span', {
                  className: 'mmc-rank-fill',
                  style: { width: Math.max(model.likes > 0 ? 3 : 0, (model.likes / maxLikes) * 100) + '%' }
                })
              ),
              h('span', { className: 'mmc-rank-num mmc-rank-num--strong' }, model.likes),
              h('span', { className: 'mmc-rank-num' }, model.responses),
              h('span', { className: 'mmc-rank-num' }, fmtPercent(model.likeRate)),
              h('span', { className: 'mmc-rank-num' }, fmtLatency(model.avgLatencyMs)),
              h('span', { className: 'mmc-rank-num' }, model.errors)
            )
          )
        ),
        h(
          'div',
          { className: 'mmc-cols' },
          h(
            'section',
            { className: 'mmc-section' },
            h('div', { className: 'mmc-section-head' },
              h('h3', { className: 'mmc-section-title' }, t('stats.trend.title')),
              h('span', { className: 'mmc-section-aside' }, t('stats.trend.aside'))
            ),
            h(
              'div',
              { className: 'mmc-trend' },
              value.daily.map((day) =>
                h(
                  'div',
                  { key: day.date, className: 'mmc-trend-col', title: day.date + ' · ' + day.likes },
                  h('span', { className: 'mmc-trend-value' }, day.likes > 0 ? day.likes : ''),
                  h('span', { className: 'mmc-trend-track' },
                    h('span', {
                      className: 'mmc-trend-fill',
                      style: { height: Math.max(day.likes > 0 ? 6 : 0, (day.likes / maxDaily) * 100) + '%' }
                    })
                  ),
                  h('span', { className: 'mmc-trend-label' }, day.date.slice(5))
                )
              )
            )
          ),
          h(
            'section',
            { className: 'mmc-section' },
            h('div', { className: 'mmc-section-head' },
              h('h3', { className: 'mmc-section-title' }, t('stats.layouts.title')),
              h('span', { className: 'mmc-section-aside' }, t('stats.layouts.aside'))
            ),
            h(
              'div',
              { className: 'mmc-layout-pills' },
              value.layouts.map((entry) =>
                h(
                  'div',
                  { key: entry.layout, className: 'mmc-layout-pill' },
                  h('strong', null, t('layout.' + entry.layout)),
                  h('span', null, interpolate(t('stats.layouts.pill'), {
                    groups: entry.groups,
                    responses: entry.responses,
                    likes: entry.likes
                  }))
                )
              )
            )
          )
        ),
        h(
          'section',
          { className: 'mmc-section' },
          h('div', { className: 'mmc-section-head' },
            h('h3', { className: 'mmc-section-title' }, t('stats.recent.title')),
            h('span', { className: 'mmc-section-aside' }, value.recentLikes.length ? '' : t('stats.recent.empty'))
          ),
          value.recentLikes.length
            ? h(
                'div',
                { className: 'mmc-recent' },
                value.recentLikes.map((item, index) =>
                  h(
                    'button',
                    {
                      key: item.groupId + '|' + item.model + '|' + index,
                      type: 'button',
                      className: 'mmc-recent-row',
                      onClick: () => props.onOpenGroup(item.groupId)
                    },
                    h(ModelBadge, { model: item.model }),
                    h(
                      'span',
                      { className: 'mmc-recent-text' },
                      h('span', { className: 'mmc-recent-prompt' }, item.prompt),
                      h('span', { className: 'mmc-recent-snippet' }, item.content || '')
                    ),
                    h('span', { className: 'mmc-recent-meta' }, fmtTime(item.likedAt))
                  )
                )
              )
            : null
        )
      );
    }

    /* ------------------------------------------------------------------ *
     * Plugin settings
     * ------------------------------------------------------------------ */

    function modelsUrlOf(endpoint) {
      const text = String(endpoint || '').trim().replace(/\/+$/, '');
      if (!text) return '';
      if (/\/chat\/completions$/i.test(text)) return text.replace(/\/chat\/completions$/i, '/models');
      return text + '/models';
    }

    function SettingsView(props) {
      const t = props.t;
      const [data, setData] = useState({ status: 'loading', value: null, error: null });
      const [endpointDraft, setEndpointDraft] = useState('');
      const [keyDraft, setKeyDraft] = useState('');
      const [showKey, setShowKey] = useState(false);
      const [clearKey, setClearKey] = useState(false);
      const [defaults, setDefaults] = useState(function () {
        return new Set();
      });
      const [catalog, setCatalog] = useState([]);
      const [query, setQuery] = useState('');
      const [collapsed, setCollapsed] = useState(function () {
        return new Set();
      });
      const [probe, setProbe] = useState({ status: 'idle' });
      const [saving, setSaving] = useState(false);
      const [syncing, setSyncing] = useState(false);
      const [tests, setTests] = useState({});
      const [notice, setNotice] = useState(null);
      const mountedRef = useRef(true);

      useEffect(function () {
        mountedRef.current = true;
        return function () {
          mountedRef.current = false;
        };
      }, []);

      useEffect(function () {
        if (!notice) return undefined;
        const timer = setTimeout(function () {
          setNotice(null);
        }, notice.tone === 'error' ? 9000 : 4000);
        return function () {
          clearTimeout(timer);
        };
      }, [notice]);

      const hydrate = useCallback(function (value) {
        if (!value || !value.settings) return;
        setEndpointDraft(value.settings.endpoint || '');
        setDefaults(new Set(Array.isArray(value.settings.models) ? value.settings.models : []));
        setCatalog(Array.isArray(value.catalog) ? value.catalog : []);
      }, []);

      const load = useCallback(async function () {
        setData(function (previous) {
          return { ...previous, status: 'loading', error: null };
        });
        try {
          const body = await apiFetch('/settings');
          if (!mountedRef.current) return;
          setData({ status: 'ready', value: body, error: null });
          hydrate(body);
        } catch (error) {
          if (!mountedRef.current) return;
          setData({ status: 'error', value: null, error: error.message });
        }
      }, [hydrate]);

      useEffect(function () {
        load();
      }, [load]);

      const save = useCallback(async function (payload) {
        setSaving(true);
        try {
          const body = await apiFetch('/settings', { method: 'POST', headers: API_JSON, body: JSON.stringify(payload) });
          if (!mountedRef.current) return;
          setData({ status: 'ready', value: body, error: null });
          hydrate(body);
          setKeyDraft('');
          setClearKey(false);
          setNotice({ tone: 'success', text: t('settings.saved') });
          if (props.onUpdated) props.onUpdated(body, 'save');
        } catch (error) {
          if (!mountedRef.current) return;
          setNotice({ tone: 'error', text: t('settings.saveFailed') + '：' + error.message });
        } finally {
          if (mountedRef.current) setSaving(false);
        }
      }, [hydrate, props, t]);

      const saveApi = useCallback(function () {
        const payload = { endpoint: endpointDraft };
        if (keyDraft.trim()) payload.apiKey = keyDraft.trim();
        if (clearKey) payload.clearApiKey = true;
        save(payload);
      }, [clearKey, endpointDraft, keyDraft, save]);

      const saveDefaults = useCallback(function () {
        if (!catalog.length) {
          setNotice({ tone: 'warn', text: t('settings.models.empty') });
          return;
        }
        save({ models: Array.from(defaults) });
      }, [catalog, defaults, save, t]);

      const runProbe = useCallback(async function () {
        setProbe({ status: 'probing' });
        const payload = { endpoint: endpointDraft };
        if (keyDraft.trim()) payload.apiKey = keyDraft.trim();
        try {
          const body = await apiFetch('/probe', { method: 'POST', headers: API_JSON, body: JSON.stringify(payload), timeoutMs: 20000 });
          if (!mountedRef.current) return;
          setProbe({ status: 'ok', data: body });
        } catch (error) {
          if (!mountedRef.current) return;
          setProbe({ status: 'error', error: error.message });
        }
      }, [endpointDraft, keyDraft]);

      const syncModels = useCallback(async function () {
        setSyncing(true);
        try {
          const body = await apiFetch('/models/sync', { method: 'POST', headers: API_JSON, body: '{}', timeoutMs: 40000 });
          if (!mountedRef.current) return;
          setData({ status: 'ready', value: body, error: null });
          hydrate(body);
          setNotice({ tone: 'success', text: interpolate(t('settings.models.synced'), { n: (body.catalog || []).length }) });
          if (props.onUpdated) props.onUpdated(body, 'sync');
        } catch (error) {
          if (!mountedRef.current) return;
          setNotice({ tone: 'error', text: t('settings.models.syncFailed') + '：' + error.message });
        } finally {
          if (mountedRef.current) setSyncing(false);
        }
      }, [hydrate, props, t]);

      const testModel = useCallback(async function (model) {
        setTests(function (previous) {
          return { ...previous, [model]: { status: 'running' } };
        });
        const payload = { model, endpoint: endpointDraft };
        if (keyDraft.trim()) payload.apiKey = keyDraft.trim();
        try {
          const body = await apiFetch('/probe', { method: 'POST', headers: API_JSON, body: JSON.stringify(payload), timeoutMs: 70000 });
          if (!mountedRef.current) return;
          setTests(function (previous) {
            return {
              ...previous,
              [model]: body.ok
                ? { status: 'ok', latencyMs: body.latencyMs }
                : { status: 'error', error: body.error || t('settings.models.testFailed') }
            };
          });
        } catch (error) {
          if (!mountedRef.current) return;
          setTests(function (previous) {
            return { ...previous, [model]: { status: 'error', error: error.message } };
          });
        }
      }, [endpointDraft, keyDraft, t]);

      const toggleDefault = useCallback(function (model) {
        setDefaults(function (previous) {
          const next = new Set(previous);
          if (next.has(model)) {
            next.delete(model);
            return next;
          }
          if (next.size >= MAX_MODELS) {
            setNotice({ tone: 'warn', text: interpolate(t('settings.models.max'), { max: MAX_MODELS }) });
            return previous;
          }
          next.add(model);
          return next;
        });
      }, [t]);

      const selectAll = useCallback(function () {
        setDefaults(new Set(catalog.slice(0, MAX_MODELS).map(function (entry) {
          return entry.id;
        })));
      }, [catalog]);

      const clearAll = useCallback(function () {
        setDefaults(new Set());
      }, []);

      const groups = useMemo(function () {
        const needle = query.trim().toLowerCase();
        const filtered = needle
          ? catalog.filter(function (entry) {
              return String(entry.id || '').toLowerCase().includes(needle) || String(entry.provider || '').toLowerCase().includes(needle);
            })
          : catalog;
        const map = new Map();
        for (const entry of filtered) {
          const provider = entry.provider || 'other';
          if (!map.has(provider)) map.set(provider, []);
          map.get(provider).push(entry);
        }
        return [...map.entries()]
          .sort(function (a, b) {
            return a[0].localeCompare(b[0]);
          })
          .map(function (pair) {
            return {
              provider: pair[0],
              entries: pair[1].slice().sort(function (a, b) {
                return a.id.localeCompare(b.id);
              })
            };
          });
      }, [catalog, query]);

      if (data.status === 'loading' && !data.value) {
        return h('div', { className: 'mmc-settings-wrap' }, h('div', { className: 'mmc-stats-mm' }, h(Spinner), h('span', null, t('settings.loading'))));
      }
      if (data.status === 'error' && !data.value) {
        return h(
          'div',
          { className: 'mmc-settings-wrap' },
          h(
            'div',
            { className: 'mmc-stats-mm' },
            h('span', { className: 'mmc-error-inline' }, t('settings.loadFailed') + '：' + data.error),
            h('button', { type: 'button', className: 'mmc-btn', onClick: load }, t('settings.retry'))
          )
        );
      }

      const settings = (data.value && data.value.settings) || {};
      const mask = settings.apiKeyMask || '';
      const hasKey = settings.hasApiKey === true;
      const total = catalog.length;
      const selectedCount = defaults.size;

      return h(
        'div',
        { className: 'mmc-settings-wrap' },
        h(
          'div',
          { className: 'mmc-settings' },
          h(
            'div',
            { className: 'mmc-settings-head' },
            h(
              'div',
              null,
              h('h2', { className: 'mmc-stats-title' }, t('settings.title')),
              h('p', { className: 'mmc-stats-sub' }, t('settings.subtitle'))
            ),
            h(
              'button',
              { type: 'button', className: 'mmc-btn mmc-btn--ghost', onClick: load, disabled: saving || syncing },
              h(IconRefresh),
              h('span', null, t('action.refresh'))
            )
          ),
          h(Notice, { notice, onClose: function () { setNotice(null); } }),

          h(
            'section',
            { className: 'mmc-section mmc-set-card' },
            h(
              'div',
              { className: 'mmc-section-head' },
              h('h3', { className: 'mmc-section-title' }, t('settings.api.title')),
              h('span', { className: 'mmc-section-aside' }, hasKey ? interpolate(t('settings.api.keyHint'), { mask }) : t('settings.api.keyEmpty'))
            ),
            h(
              'div',
              { className: 'mmc-set-fields' },
              h(
                'label',
                { className: 'mmc-set-field' },
                h('span', { className: 'mmc-set-label' }, t('settings.api.key')),
                h(
                  'div',
                  { className: 'mmc-input-wrap' },
                  h('input', {
                    className: 'mmc-input',
                    type: showKey ? 'text' : 'password',
                    value: keyDraft,
                    placeholder: mask || t('settings.api.keyPlaceholder'),
                    autoComplete: 'off',
                    spellCheck: false,
                    disabled: saving,
                    onChange: function (event) {
                      setKeyDraft(event.target.value);
                      if (event.target.value) setClearKey(false);
                    }
                  }),
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'mmc-input-btn',
                      onClick: function () {
                        setShowKey(function (value) {
                          return !value;
                        });
                      },
                      title: showKey ? t('settings.api.hide') : t('settings.api.show'),
                      'aria-label': showKey ? t('settings.api.hide') : t('settings.api.show')
                    },
                    h(IconEye, { off: !showKey })
                  )
                ),
                h(
                  'span',
                  { className: 'mmc-set-hint' },
                  clearKey
                    ? t('settings.api.keyWillClear')
                    : hasKey
                      ? interpolate(t('settings.api.keyHint'), { mask })
                      : t('settings.api.keyEmpty')
                )
              ),
              h(
                'div',
                { className: 'mmc-set-actions' },
                h(
                  'button',
                  { type: 'button', className: 'mmc-btn', onClick: runProbe, disabled: probe.status === 'probing' },
                  probe.status === 'probing' ? h(Spinner) : null,
                  h('span', null, probe.status === 'probing' ? t('settings.api.probing') : t('settings.api.probe'))
                ),
                h(
                  'button',
                  { type: 'button', className: 'mmc-btn mmc-btn--primary', onClick: saveApi, disabled: saving },
                  saving ? h(Spinner) : null,
                  h('span', null, saving ? t('settings.api.saving') : t('settings.api.save'))
                )
              )
            ),
            h(
              'div',
              { className: 'mmc-set-fields' },
              h(
                'label',
                { className: 'mmc-set-field mmc-set-field--grow' },
                h('span', { className: 'mmc-set-label' }, t('settings.api.endpoint')),
                h(
                  'div',
                  { className: 'mmc-input-wrap' },
                  h('input', {
                    className: 'mmc-input mmc-input--mono',
                    value: endpointDraft,
                    spellCheck: false,
                    disabled: saving,
                    onChange: function (event) {
                      setEndpointDraft(event.target.value);
                    }
                  })
                ),
                h('span', { className: 'mmc-set-hint' }, interpolate(t('settings.api.endpointHint'), { url: modelsUrlOf(endpointDraft) }))
              ),
              h(
                'div',
                { className: 'mmc-set-actions' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'mmc-btn mmc-btn--ghost',
                    onClick: function () {
                      setKeyDraft('');
                      setClearKey(true);
                    },
                    disabled: saving || !hasKey
                  },
                  h('span', null, t('settings.api.clear'))
                )
              )
            ),
            probe.status === 'ok'
              ? h(
                  'div',
                  { className: 'mmc-set-result mmc-set-result--ok' },
                  interpolate(t('settings.api.probeOk'), { models: (probe.data.models || []).length, ms: probe.data.latencyMs })
                )
              : null,
            probe.status === 'error'
              ? h('div', { className: 'mmc-set-result mmc-set-result--error' }, t('settings.api.probeFailed') + '：' + probe.error)
              : null
          ),

          h(
            'section',
            { className: 'mmc-section mmc-set-card' },
            h(
              'div',
              { className: 'mmc-section-head' },
              h('h3', { className: 'mmc-section-title' }, t('settings.models.title')),
              h('span', { className: 'mmc-section-aside' }, interpolate(t('settings.models.selected'), { n: selectedCount, total }))
            ),
            h(
              'div',
              { className: 'mmc-set-toolbar' },
              h(
                'button',
                { type: 'button', className: 'mmc-btn', onClick: syncModels, disabled: syncing || saving },
                syncing ? h(Spinner) : h(IconRefresh),
                h('span', null, syncing ? t('settings.models.syncing') : t('settings.models.sync'))
              ),
              h(
                'button',
                { type: 'button', className: 'mmc-btn mmc-btn--primary', onClick: saveDefaults, disabled: saving || !catalog.length },
                saving ? h(Spinner) : null,
                h('span', null, t('settings.models.save'))
              ),
              h('button', { type: 'button', className: 'mmc-btn mmc-btn--ghost', onClick: selectAll, disabled: saving }, h('span', null, t('settings.models.selectAll'))),
              h('button', { type: 'button', className: 'mmc-btn mmc-btn--ghost', onClick: clearAll, disabled: saving || selectedCount === 0 }, h('span', null, t('settings.models.clearAll'))),
              h(
                'label',
                { className: 'mmc-search mmc-set-search' },
                h(IconSearch),
                h('input', {
                  className: 'mmc-search-input',
                  type: 'search',
                  value: query,
                  placeholder: t('settings.models.search'),
                  onChange: function (event) {
                    setQuery(event.target.value);
                  }
                })
              )
            ),
            h(
              'p',
              { className: 'mmc-set-hint' },
              t('settings.models.savedHint') + ' · ' + interpolate(t('settings.models.subtitle'), { max: MAX_MODELS })
            ),
            groups.length === 0
              ? h('p', { className: 'mmc-empty-small' }, catalog.length ? t('settings.models.noMatch') : t('settings.models.empty'))
              : null,
            groups.map(function (group) {
              const isCollapsed = collapsed.has(group.provider);
              const groupSelected = group.entries.filter(function (entry) {
                return defaults.has(entry.id);
              }).length;
              return h(
                'div',
                { key: group.provider, className: 'mmc-set-group' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'mmc-set-group-head',
                    'aria-expanded': !isCollapsed,
                    onClick: function () {
                      setCollapsed(function (previous) {
                        const next = new Set(previous);
                        if (next.has(group.provider)) next.delete(group.provider);
                        else next.add(group.provider);
                        return next;
                      });
                    }
                  },
                  h(IconChevron, { open: !isCollapsed }),
                  h('span', { className: 'mmc-set-group-name' }, group.provider),
                  h('span', { className: 'mmc-set-group-count' }, group.entries.length),
                  groupSelected
                    ? h('span', { className: 'mmc-set-group-selected' }, interpolate(t('settings.models.groupSelected'), { n: groupSelected }))
                    : null
                ),
                isCollapsed
                  ? null
                  : h(
                      'div',
                      { className: 'mmc-set-rows' },
                      group.entries.map(function (entry) {
                        const on = defaults.has(entry.id);
                        const test = tests[entry.id];
                        return h(
                          'div',
                          { key: entry.id, className: cls('mmc-set-row-item', on ? 'is-on' : '') },
                          h(ModelGlyph, { model: entry.id, size: 22 }),
                          h('span', { className: 'mmc-set-model-name', title: entry.id }, entry.id),
                          test
                            ? h(
                                'span',
                                {
                                  className: cls('mmc-set-test', test.status === 'error' ? 'mmc-set-test--error' : ''),
                                  title: test.error || ''
                                },
                                test.status === 'running'
                                  ? t('settings.models.testing')
                                  : test.status === 'ok'
                                    ? interpolate(t('settings.models.testOk'), { ms: test.latencyMs })
                                    : t('settings.models.testFailed')
                              )
                            : null,
                          h(
                            'button',
                            {
                              type: 'button',
                              className: 'mmc-mini-btn',
                              onClick: function () {
                                testModel(entry.id);
                              },
                              disabled: Boolean(test && test.status === 'running')
                            },
                            test && test.status === 'running' ? h(Spinner) : h('span', null, t('settings.models.test'))
                          ),
                          h(
                            'button',
                            {
                              type: 'button',
                              role: 'switch',
                              'aria-checked': on,
                              'aria-label': t('settings.models.default'),
                              title: t('settings.models.default'),
                              className: cls('mmc-switch-toggle', on ? 'is-on' : ''),
                              onClick: function () {
                                toggleDefault(entry.id);
                              },
                              disabled: saving
                            },
                            h('span', null)
                          )
                        );
                      })
                    )
              );
            })
          )
        )
      );
    }

    /* ------------------------------------------------------------------ *
     * Page
     * ------------------------------------------------------------------ */

    function MultiModelPage(props) {
      const t = props.t;
      const prefsRef = useRef(readPrefs());
      const prefs = prefsRef.current;

      const [health, setHealth] = useState({ status: 'loading', value: null, error: null });
      const [catalog, setCatalog] = useState([]);
      const [groups, setGroups] = useState([]);
      const [totalGroups, setTotalGroups] = useState(0);
      const [counts, setCounts] = useState({ groups: 0, responses: 0, likes: 0 });
      const [stats, setStats] = useState({ status: 'loading', value: null, error: null });
      const [view, setView] = useState('chat');
      const [layout, setLayout] = useState(() => (LAYOUTS.includes(prefs.layout) ? prefs.layout : DEFAULT_LAYOUT));
      const [selectedModels, setSelectedModels] = useState(() => (Array.isArray(prefs.models) ? prefs.models.slice(0, MAX_MODELS) : []));
      const [draft, setDraft] = useState('');
      const [sending, setSending] = useState(false);
      const [pending, setPending] = useState(null);
      const [historyOpen, setHistoryOpen] = useState(true);
      const [historyQuery, setHistoryQuery] = useState('');
      const [notice, setNotice] = useState(null);
      const [activeGroupId, setActiveGroupId] = useState('');
      const [retrying, setRetrying] = useState({});

      const mountedRef = useRef(true);
      const threadRef = useRef(null);
      const groupRefs = useRef(new Map());

      useEffect(() => {
        mountedRef.current = true;
        return () => {
          mountedRef.current = false;
        };
      }, []);

      useEffect(() => {
        writePrefs({ layout });
      }, [layout]);

      useEffect(() => {
        writePrefs({ models: selectedModels });
      }, [selectedModels]);

      useEffect(() => {
        if (!notice) return undefined;
        const timer = setTimeout(() => setNotice(null), notice.tone === 'error' ? 8000 : 4000);
        return () => clearTimeout(timer);
      }, [notice]);

      const loadHealth = useCallback(async () => {
        try {
          const body = await apiFetch('/config');
          if (!mountedRef.current) return;
          setHealth({ status: 'ready', value: body, error: null });
          const list = Array.isArray(body.catalog) && body.catalog.length ? body.catalog : Array.isArray(body.models) ? body.models : [];
          setCatalog(list.slice(0, 60));
          if (body.counts) setCounts(body.counts);
        } catch (error) {
          if (!mountedRef.current) return;
          setHealth({ status: 'error', value: null, error: error.message });
        }
      }, []);

      const loadGroups = useCallback(async () => {
        try {
          const body = await apiFetch('/groups?limit=200&full=1');
          if (!mountedRef.current) return;
          setGroups(Array.isArray(body.groups) ? body.groups : []);
          setTotalGroups(Number(body.total) || 0);
          if (body.counts) setCounts(body.counts);
        } catch (error) {
          if (!mountedRef.current) return;
          setNotice({ tone: 'error', text: t('notice.loadFailed') + '：' + error.message });
        }
      }, [t]);

      const loadStats = useCallback(async () => {
        setStats((previous) => ({ ...previous, status: 'loading' }));
        try {
          const body = await apiFetch('/stats');
          if (!mountedRef.current) return;
          setStats({ status: 'ready', value: body.stats || null, error: null });
        } catch (error) {
          if (!mountedRef.current) return;
          setStats({ status: 'error', value: null, error: error.message });
        }
      }, []);

      useEffect(() => {
        loadHealth();
        loadGroups();
        loadStats();
      }, [loadHealth, loadGroups, loadStats]);

      /* Keep the selection aligned with the catalog, falling back to the
       * configured models so a first visit always has a usable selection. */
      useEffect(() => {
        if (!health.value) return;
        const available = catalog.length ? catalog : Array.isArray(health.value.models) ? health.value.models : [];
        const configured = Array.isArray(health.value.models) ? health.value.models : [];
        setSelectedModels((previous) => {
          const kept = previous.filter((model) => available.includes(model)).slice(0, MAX_MODELS);
          if (kept.length) return kept;
          const fallback = configured.filter((model) => available.length === 0 || available.includes(model));
          return (fallback.length ? fallback : configured).slice(0, MAX_MODELS);
        });
      }, [health.value, catalog]);

      const scrollToBottom = useCallback(() => {
        const node = threadRef.current;
        if (node) node.scrollTop = node.scrollHeight;
      }, []);

      useEffect(() => {
        if (view !== 'chat') return;
        const timer = setTimeout(scrollToBottom, 30);
        return () => clearTimeout(timer);
      }, [groups.length, pending, view, scrollToBottom]);

      const layoutCatalog = useMemo(() => {
        const seen = new Set();
        const list = [];
        for (const model of [...selectedModels, ...catalog]) {
          if (!model || seen.has(model)) continue;
          seen.add(model);
          list.push(model);
        }
        return list;
      }, [catalog, selectedModels]);

      const toggleModel = useCallback(
        (model) => {
          setSelectedModels((previous) => {
            if (previous.includes(model)) return previous.filter((item) => item !== model);
            if (previous.length >= MAX_MODELS) {
              setNotice({ tone: 'warn', text: t('composer.limit') });
              return previous;
            }
            return [...previous, model];
          });
        },
        [t]
      );

      const selectAll = useCallback(() => {
        setSelectedModels(catalog.slice(0, MAX_MODELS));
      }, [catalog]);

      const clearAll = useCallback(() => {
        setSelectedModels([]);
      }, []);

      const refreshAll = useCallback(() => {
        loadHealth();
        loadGroups();
        loadStats();
      }, [loadHealth, loadGroups, loadStats]);

      /** Apply a `/settings` save (or model sync) to the page's own state. */
      const updateFromSettings = useCallback(
        (result, kind) => {
          if (!result || !result.settings) return;
          const next = result.settings;
          setHealth((previous) =>
            previous.value
              ? {
                  ...previous,
                  value: {
                    ...previous.value,
                    endpoint: next.endpoint || previous.value.endpoint,
                    modelsUrl: next.modelsUrl || previous.value.modelsUrl,
                    models: Array.isArray(next.models) ? next.models : previous.value.models,
                    hasApiKey: next.hasApiKey === true,
                    historyLimit: next.historyLimit || previous.value.historyLimit
                  }
                }
              : previous
          );
          if (Array.isArray(result.catalog) && result.catalog.length > 0) {
            setCatalog(
              result.catalog
                .map((entry) => entry.id)
                .filter(Boolean)
                .slice(0, 60)
            );
          }
          if (kind === 'save' && Array.isArray(next.models)) {
            const models = next.models.slice(0, MAX_MODELS);
            setSelectedModels(models);
            writePrefs({ models });
            loadStats();
          }
        },
        [loadStats]
      );

      const send = useCallback(async () => {
        const prompt = String(draft).trim();
        if (!prompt || sending) return;
        if (!selectedModels.length) {
          setNotice({ tone: 'warn', text: t('composer.emptyModels') });
          return;
        }
        setSending(true);
        setPending({ prompt, models: selectedModels.slice() });
        setDraft('');
        try {
          const body = await apiFetch('/groups', {
            method: 'POST',
            headers: API_JSON,
            body: JSON.stringify({ prompt, models: selectedModels, layout }),
            timeoutMs: (health.value && health.value.timeoutMs ? health.value.timeoutMs : 180000) + 20000
          });
          if (!mountedRef.current) return;
          setGroups((previous) => [body.group, ...previous]);
          setTotalGroups((previous) => previous + 1);
          if (body.counts) setCounts(body.counts);
          if (body.stats) setStats({ status: 'ready', value: body.stats, error: null });
          setPending(null);
          setActiveGroupId(body.group.id);
          setNotice({ tone: 'success', text: t('notice.saved') });
        } catch (error) {
          if (!mountedRef.current) return;
          setPending(null);
          setDraft(prompt);
          setNotice({ tone: 'error', text: t('notice.sendFailed') + '：' + error.message });
        } finally {
          if (mountedRef.current) setSending(false);
        }
      }, [draft, sending, selectedModels, layout, health.value, t]);

      const toggleLike = useCallback(
        async (group, response) => {
          const nextLiked = !response.liked;
          const patch = (liked) =>
            setGroups((previous) =>
              previous.map((item) =>
                item.id === group.id
                  ? {
                      ...item,
                      responses: item.responses.map((entry) =>
                        entry.model === response.model ? { ...entry, liked, likedAt: liked ? Date.now() : null } : entry
                      ),
                      likes: item.responses.reduce(
                        (total, entry) =>
                          total + (entry.model === response.model ? (liked ? 1 : 0) : entry.liked ? 1 : 0),
                        0
                      )
                    }
                  : item
              )
            );
          patch(nextLiked);
          try {
            const body = await apiFetch('/groups/' + encodeURIComponent(group.id) + '/like', {
              method: 'POST',
              headers: API_JSON,
              body: JSON.stringify({ model: response.model, liked: nextLiked })
            });
            if (!mountedRef.current) return;
            setGroups((previous) => previous.map((item) => (item.id === group.id ? body.group : item)));
            if (body.stats) setStats({ status: 'ready', value: body.stats, error: null });
            if (body.counts) setCounts(body.counts);
          } catch (error) {
            if (!mountedRef.current) return;
            patch(response.liked === true);
            setNotice({ tone: 'error', text: t('notice.likeFailed') + '：' + error.message });
          }
        },
        [t]
      );

      const retryResponse = useCallback(
        async (group, response) => {
          const key = group.id + '|' + response.model;
          setRetrying((previous) => ({ ...previous, [key]: true }));
          try {
            const body = await apiFetch('/groups/' + encodeURIComponent(group.id) + '/retry', {
              method: 'POST',
              headers: API_JSON,
              body: JSON.stringify({ model: response.model }),
              timeoutMs: (health.value && health.value.timeoutMs ? health.value.timeoutMs : 180000) + 20000
            });
            if (!mountedRef.current) return;
            setGroups((previous) => previous.map((item) => (item.id === group.id ? body.group : item)));
            if (body.stats) setStats({ status: 'ready', value: body.stats, error: null });
          } catch (error) {
            if (!mountedRef.current) return;
            setNotice({ tone: 'error', text: t('notice.retryFailed') + '：' + error.message });
          } finally {
            if (mountedRef.current) {
              setRetrying((previous) => {
                const next = { ...previous };
                delete next[key];
                return next;
              });
            }
          }
        },
        [health.value, t]
      );

      const deleteGroup = useCallback(
        async (group) => {
          if (typeof window.confirm === 'function' && !window.confirm(t('action.deleteGroup') + '？')) return;
          try {
            const body = await apiFetch('/groups/' + encodeURIComponent(group.id), { method: 'DELETE' });
            if (!mountedRef.current) return;
            setGroups((previous) => previous.filter((item) => item.id !== group.id));
            setTotalGroups((previous) => Math.max(0, previous - 1));
            if (body.stats) setStats({ status: 'ready', value: body.stats, error: null });
            if (body.counts) setCounts(body.counts);
            setNotice({ tone: 'success', text: t('notice.deleted') });
          } catch (error) {
            if (!mountedRef.current) return;
            setNotice({ tone: 'error', text: t('notice.deleteFailed') + '：' + error.message });
          }
        },
        [t]
      );

      const copy = useCallback(
        async (text) => {
          const ok = await copyText(String(text || ''));
          setNotice({ tone: ok ? 'success' : 'error', text: ok ? t('notice.copied') : t('notice.copyFailed') });
        },
        [t]
      );

      const openGroup = useCallback(
        (id) => {
          setView('chat');
          setActiveGroupId(id);
          setTimeout(() => {
            const node = groupRefs.current.get(id);
            if (node && typeof node.scrollIntoView === 'function') {
              node.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 60);
        },
        []
      );

      const orderedGroups = useMemo(() => groups.slice().reverse(), [groups]);

      const thread = useMemo(() => {
        const rows = [];
        for (const group of orderedGroups) {
          rows.push(
            h(
              'div',
              {
                key: group.id,
                ref: (node) => {
                  if (node) groupRefs.current.set(group.id, node);
                  else groupRefs.current.delete(group.id);
                }
              },
              h(GroupBlock, {
                group,
                layout,
                t,
                retrying,
                onLike: toggleLike,
                onRetry: retryResponse,
                onCopy: copy,
                onDelete: deleteGroup
              })
            )
          );
        }
        if (pending) rows.push(h(PendingGroup, { key: 'pending', pending, layout, t }));
        return rows;
      }, [orderedGroups, layout, t, retrying, pending, toggleLike, retryResponse, copy, deleteGroup]);

      const endpointHost = health.value ? hostOf(health.value.endpoint) : '';

      return h(
        'div',
        { className: 'mmc-root' },
        h('style', null, CSS),
        h(
          'header',
          { className: 'mmc-head' },
          h(
            'div',
            { className: 'mmc-head-main' },
            h('p', { className: 'mmc-crumb' }, t('page.crumb')),
            h('h1', { className: 'mmc-title' }, t('page.title')),
            h('p', { className: 'mmc-sub' }, t('page.subtitle')),
            h(
              'div',
              { className: 'mmc-chips' },
              health.status === 'ready'
                ? h('span', { className: 'mmc-chip' }, t('health.endpoint') + '：', h('code', null, endpointHost || '—'))
                : h('span', { className: 'mmc-chip' }, t('health.loading')),
              health.status === 'ready'
                ? h(
                    'span',
                    { className: 'mmc-chip' },
                    h('b', null, catalog.length || (health.value.models || []).length),
                    ' ',
                    t('composer.models')
                  )
                : null,
              health.status === 'ready'
                ? h('span', { className: 'mmc-chip' }, h('b', null, counts.groups), ' ', t('health.saved'))
                : null,
              health.status === 'ready'
                ? health.value.hasApiKey
                  ? h('span', { className: 'mmc-chip mmc-chip--ok' }, t('health.apiKeySet'))
                  : h(
                      'button',
                      {
                        type: 'button',
                        className: 'mmc-chip mmc-chip--warn mmc-chip--action',
                        onClick: () => setView('settings'),
                        title: t('settings.api.title')
                      },
                      t('health.apiKeyMissing')
                    )
                : null,
              health.status === 'error' ? h('span', { className: 'mmc-chip mmc-chip--warn' }, t('health.loadError')) : null
            )
          ),
          h(
            'div',
            { className: 'mmc-head-side' },
            h(
              'div',
              { className: 'mmc-switch' },
              h(
                'button',
                {
                  type: 'button',
                  className: cls('mmc-switch-btn', view === 'chat' ? 'mmc-switch-btn--on' : ''),
                  onClick: () => setView('chat')
                },
                h(IconChat),
                h('span', null, t('view.chat'))
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: cls('mmc-switch-btn', view === 'stats' ? 'mmc-switch-btn--on' : ''),
                  onClick: () => {
                    setView('stats');
                    loadStats();
                  }
                },
                h(IconChart),
                h('span', null, t('view.stats')),
                counts.likes > 0 ? h('span', { className: 'mmc-switch-badge' }, counts.likes) : null
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: cls('mmc-switch-btn', view === 'settings' ? 'mmc-switch-btn--on' : ''),
                  onClick: () => setView('settings')
                },
                h(IconGear),
                h('span', null, t('view.settings'))
              )
            ),
            h('button', { type: 'button', className: 'mmc-btn mmc-btn--ghost', onClick: refreshAll, title: t('action.refresh') }, h(IconRefresh), h('span', null, t('action.refresh'))),
            h(
              'button',
              {
                type: 'button',
                className: cls('mmc-btn', historyOpen ? 'mmc-btn--on' : ''),
                onClick: () => setHistoryOpen((value) => !value),
                title: historyOpen ? t('action.historyHide') : t('action.history')
              },
              h(IconHistory),
              h('span', null, t('action.history'))
            )
          )
        ),
        h(Notice, { notice, onClose: () => setNotice(null) }),
        view === 'settings'
          ? h(SettingsView, { t, onUpdated: updateFromSettings })
          : view === 'stats'
          ? h('div', { className: 'mmc-stats-wrap' }, h(StatsView, { stats, t, onRefresh: loadStats, onOpenGroup: openGroup }))
          : h(
              'div',
              { className: 'mmc-body' },
              historyOpen
                ? h(HistoryPanel, {
                    t,
                    groups,
                    total: totalGroups,
                    activeId: activeGroupId,
                    query: historyQuery,
                    onQueryChange: setHistoryQuery,
                    onSelect: openGroup,
                    onClose: () => setHistoryOpen(false)
                  })
                : null,
              h(
                'section',
                { className: 'mmc-chat' },
                h('div', { className: 'mmc-thread', ref: threadRef }, thread.length ? thread : h(EmptyThread, { t, onPick: setDraft })),
                h(Composer, {
                  t,
                  draft,
                  sending,
                  layout,
                  catalog: layoutCatalog,
                  selectedModels,
                  onToggleModel: toggleModel,
                  onSelectAll: selectAll,
                  onClearAll: clearAll,
                  onDraftChange: setDraft,
                  onLayoutChange: setLayout,
                  onSend: send
                })
              )
            )
      );
    }

    /* ------------------------------------------------------------------ *
     * Styles (theme tokens only)
     * ------------------------------------------------------------------ */

    const CSS = `
.mmc-root{
  --mmc-surface:var(--dsw-alias-bg-layer-1);
  --mmc-surface-2:var(--dsw-alias-bg-layer-2);
  --mmc-line:var(--dsw-alias-border-l1);
  --mmc-line-strong:var(--dsw-alias-border-l2);
  --mmc-text:var(--dsw-alias-label-primary);
  --mmc-muted:var(--dsw-alias-label-secondary);
  --mmc-accent:var(--dsw-alias-brand-primary);
  --mmc-success:var(--dsw-alias-state-success-primary);
  --mmc-warn:var(--dsw-alias-state-warn-primary);
  --mmc-error:var(--dsw-alias-state-error-primary);
  --mmc-idle:var(--dsw-alias-state-idle-primary);
  box-sizing:border-box;display:flex;flex-direction:column;width:100%;height:100%;min-height:0;
  padding:18px clamp(14px,2vw,28px) 16px;
  background:radial-gradient(120% 90% at 50% -30%,color-mix(in srgb,var(--mmc-accent) 7%,transparent),transparent 62%),var(--dsw-alias-bg-base);
  color:var(--mmc-text);font-size:13px;line-height:1.55;-webkit-font-smoothing:antialiased;
}
.mmc-root *{box-sizing:border-box}
.mmc-root :where(button,select,input,textarea):focus-visible{outline:2px solid color-mix(in srgb,var(--mmc-accent) 60%,transparent);outline-offset:2px}
.mmc-root button{font-family:inherit}
.mmc-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.mmc-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;flex-wrap:wrap;flex:0 0 auto;padding-bottom:14px;border-bottom:1px solid var(--mmc-line)}
.mmc-crumb{margin:0 0 5px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mmc-muted)}
.mmc-title{margin:0;font-size:clamp(19px,2.2vw,25px);font-weight:650;letter-spacing:-.01em}
.mmc-sub{margin:7px 0 0;max-width:780px;color:var(--mmc-muted);font-size:12.5px}
.mmc-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.mmc-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface);font-size:11.5px;color:var(--mmc-muted)}
.mmc-chip b{font-weight:600;color:var(--mmc-text);font-variant-numeric:tabular-nums}
.mmc-chip code{font-size:11px;color:var(--mmc-text);word-break:break-all}
.mmc-chip--ok{border-color:color-mix(in srgb,var(--mmc-success) 45%,transparent);color:var(--mmc-success)}
.mmc-chip--warn{border-color:color-mix(in srgb,var(--mmc-warn) 50%,transparent);color:var(--mmc-warn)}
.mmc-chip--action{cursor:pointer}
.mmc-chip--action:hover{background:color-mix(in srgb,var(--mmc-warn) 10%,transparent)}
.mmc-head-side{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.mmc-switch{display:inline-flex;gap:2px;padding:3px;border-radius:10px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2)}
.mmc-switch-btn{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:3px 12px;border-radius:8px;border:none;background:transparent;color:var(--mmc-muted);font-size:12px;font-weight:550;cursor:pointer;transition:background .15s,color .15s}
.mmc-switch-btn:hover{color:var(--mmc-text)}
.mmc-switch-btn--on{background:color-mix(in srgb,var(--mmc-accent) 14%,transparent);color:var(--mmc-accent)}
.mmc-switch-badge{min-width:17px;padding:0 5px;border-radius:999px;background:color-mix(in srgb,var(--mmc-accent) 18%,transparent);color:var(--mmc-accent);font-size:10.5px;line-height:17px;text-align:center;font-variant-numeric:tabular-nums}
.mmc-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px;padding:5px 13px;border-radius:8px;border:1px solid var(--mmc-line-strong);background:var(--mmc-surface-2);color:var(--mmc-text);font-size:12.5px;cursor:pointer;transition:background .15s,border-color .15s,opacity .15s}
.mmc-btn:hover:not(:disabled){border-color:var(--mmc-accent)}
.mmc-btn:disabled{opacity:.5;cursor:not-allowed}
.mmc-btn--ghost{border-color:transparent;background:transparent;color:var(--mmc-muted)}
.mmc-btn--ghost:hover:not(:disabled){color:var(--mmc-text);border-color:var(--mmc-line)}
.mmc-btn--on{border-color:color-mix(in srgb,var(--mmc-accent) 55%,transparent);background:color-mix(in srgb,var(--mmc-accent) 12%,transparent);color:var(--mmc-accent)}
.mmc-mini-btn{border:none;background:transparent;color:var(--mmc-muted);font-size:11.5px;cursor:pointer;padding:2px 6px;border-radius:6px}
.mmc-mini-btn:hover:not(:disabled){color:var(--mmc-text);background:color-mix(in srgb,var(--mmc-line) 40%,transparent)}
.mmc-mini-btn:disabled{opacity:.45;cursor:not-allowed}
.mmc-body{flex:1 1 auto;display:flex;gap:16px;min-height:0;margin-top:14px}
.mmc-history{display:flex;flex-direction:column;gap:10px;width:238px;flex:0 0 238px;min-height:0;padding:12px;border:1px solid var(--mmc-line);border-radius:14px;background:var(--mmc-surface);overflow:hidden}
.mmc-history-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.mmc-history-title{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:var(--mmc-text);min-width:0}
.mmc-history-title svg{color:var(--mmc-muted);flex:0 0 auto}
.mmc-badge-count{min-width:18px;padding:0 6px;border-radius:999px;background:color-mix(in srgb,var(--mmc-line) 55%,transparent);color:var(--mmc-muted);font-size:10.5px;line-height:17px;text-align:center;font-variant-numeric:tabular-nums}
.mmc-search{display:flex;align-items:center;gap:6px;padding:5px 9px;border-radius:8px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);color:var(--mmc-muted)}
.mmc-search svg{flex:0 0 auto}
.mmc-search-input{flex:1 1 auto;min-width:0;border:none;background:transparent;color:var(--mmc-text);font-size:12px;outline:none;font-family:inherit}
.mmc-search-input::placeholder{color:var(--mmc-muted);opacity:.75}
.mmc-history-list{display:flex;flex-direction:column;gap:4px;overflow-y:auto;min-height:0;padding-right:2px;scrollbar-width:thin}
.mmc-history-item{display:flex;flex-direction:column;gap:3px;width:100%;padding:8px 9px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--mmc-text);text-align:left;cursor:pointer;min-width:0}
.mmc-history-item:hover{background:var(--mmc-surface-2)}
.mmc-history-item--active{border-color:color-mix(in srgb,var(--mmc-accent) 45%,transparent);background:color-mix(in srgb,var(--mmc-accent) 10%,transparent)}
.mmc-history-item-title{font-size:12px;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.mmc-history-item-meta{font-size:10.5px;color:var(--mmc-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-empty-small{margin:6px 2px;font-size:11.5px;color:var(--mmc-muted);line-height:1.6}
.mmc-chat{flex:1 1 auto;display:flex;flex-direction:column;min-width:0;min-height:0}
.mmc-thread{flex:1 1 auto;overflow-y:auto;overflow-x:hidden;min-height:0;padding:2px 4px 8px 2px;scrollbar-width:thin}
.mmc-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:100%;min-height:320px;text-align:center;padding:24px}
.mmc-empty-mark{display:grid;place-items:center;width:52px;height:52px;border-radius:16px;border:1px solid var(--mmc-line);background:color-mix(in srgb,var(--mmc-accent) 10%,transparent);color:var(--mmc-accent)}
.mmc-empty-title{margin:6px 0 0;font-size:17px;font-weight:650}
.mmc-empty-desc{margin:0;max-width:520px;color:var(--mmc-muted);font-size:12.5px}
.mmc-suggest{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px}
.mmc-suggest-btn{display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface);color:var(--mmc-text);font-size:12px;cursor:pointer;transition:border-color .15s,background .15s}
.mmc-suggest-btn:hover{border-color:var(--mmc-line-strong);background:var(--mmc-surface-2)}
.mmc-suggest-btn svg{color:var(--mmc-accent)}
.mmc-group{padding:14px 0 18px;border-bottom:1px solid var(--mmc-line)}
.mmc-group:last-child{border-bottom:none}
.mmc-group--pending{opacity:.92}
.mmc-group-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.mmc-group-title{display:flex;align-items:center;gap:9px;min-width:0}
.mmc-role-user{font-size:12px;font-weight:650;color:var(--mmc-text)}
.mmc-group-time{font-size:10.5px;color:var(--mmc-muted)}
.mmc-group-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.mmc-group-stat{font-size:10.5px;color:var(--mmc-muted);padding:1px 8px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface)}
.mmc-group-stat--like{color:var(--mmc-success);border-color:color-mix(in srgb,var(--mmc-success) 40%,transparent)}
.mmc-icon-btn{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--mmc-muted);cursor:pointer;transition:color .15s,border-color .15s,background .15s}
.mmc-icon-btn:hover{color:var(--mmc-error);border-color:color-mix(in srgb,var(--mmc-error) 35%,transparent);background:color-mix(in srgb,var(--mmc-error) 8%,transparent)}
.mmc-prompt{margin:8px 0 12px;padding:10px 14px;border-radius:12px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);color:var(--mmc-text);font-size:13px;white-space:pre-wrap;word-break:break-word}
.mmc-stack{display:flex;flex-direction:column;gap:12px}
.mmc-rowwrap{display:flex;gap:12px;overflow-x:auto;padding-bottom:6px;scrollbar-width:thin;scroll-snap-type:x proximity}
.mmc-rowwrap .mmc-answer{flex:0 0 380px;max-width:420px;height:auto;max-height:460px;scroll-snap-align:start;display:flex;flex-direction:column}
.mmc-rowwrap .mmc-answer-body{overflow:auto;max-height:300px}
.mmc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:12px;align-items:start}
.mmc-grid .mmc-answer{display:flex;flex-direction:column}
.mmc-grid .mmc-answer-body{max-height:340px;overflow:auto}
.mmc-answer{min-width:0;padding:12px 14px;border-radius:14px;border:1px solid var(--mmc-line);background:var(--mmc-surface);box-shadow:0 1px 2px color-mix(in srgb,var(--mmc-line) 22%,transparent)}
.mmc-answer--error{border-color:color-mix(in srgb,var(--mmc-error) 38%,transparent)}
.mmc-answer-head{display:flex;align-items:center;gap:9px;min-width:0}
.mmc-avatar{display:grid;place-items:center;flex:0 0 auto;width:26px;height:26px;border-radius:9px;background:linear-gradient(180deg,color-mix(in srgb,var(--mmc-warn) 32%,transparent),color-mix(in srgb,var(--mmc-warn) 14%,transparent));color:color-mix(in srgb,var(--mmc-warn) 82%,var(--mmc-text))}
.mmc-answer-title{display:flex;align-items:center;gap:9px;flex-wrap:wrap;min-width:0}
.mmc-assistant-name{font-size:12px;font-weight:650;color:var(--mmc-text)}
.mmc-answer-meta{margin-left:auto;font-size:10.5px;color:var(--mmc-muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.mmc-answer-body{margin-top:9px;font-size:13px;line-height:1.65;white-space:pre-wrap;word-break:break-word;color:var(--mmc-text)}
.mmc-muted{color:var(--mmc-muted)}
.mmc-badge{display:inline-flex;align-items:center;gap:5px;max-width:100%;padding:1px 8px 1px 2px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);font-size:11px;color:var(--mmc-muted);min-width:0}
.mmc-badge-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px;color:var(--mmc-text);font-weight:550}
.mmc-glyph{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:7px;background:color-mix(in srgb,var(--mmc-glyph-color) 16%,transparent);color:color-mix(in srgb,var(--mmc-glyph-color) 58%,var(--mmc-text));font-weight:700;letter-spacing:-.02em}
.mmc-errorbox{margin-top:9px;padding:10px 12px;border-radius:10px;border:1px solid color-mix(in srgb,var(--mmc-error) 42%,transparent);background:color-mix(in srgb,var(--mmc-error) 7%,transparent);color:var(--mmc-error)}
.mmc-error-title{font-size:12.5px;font-weight:600}
.mmc-error-msg{margin-top:3px;font-size:11.5px;white-space:pre-wrap;word-break:break-word;opacity:.95}
.mmc-error-details{margin-top:6px;font-size:11px;color:var(--mmc-muted)}
.mmc-error-details summary{cursor:pointer;user-select:none}
.mmc-error-raw{margin-top:4px;padding:6px 8px;border-radius:8px;background:color-mix(in srgb,var(--mmc-error) 6%,transparent);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;white-space:pre-wrap;word-break:break-word}
.mmc-reasoning{margin-top:9px;padding:10px 12px;border-radius:10px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2)}
.mmc-reasoning-head{font-size:11px;font-weight:600;color:var(--mmc-muted);margin-bottom:4px}
.mmc-reasoning-body{font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-word;color:var(--mmc-muted);max-height:260px;overflow:auto}
.mmc-answer-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:9px}
.mmc-act{display:inline-flex;align-items:center;gap:5px;min-height:26px;padding:2px 8px;border-radius:7px;border:1px solid transparent;background:transparent;color:var(--mmc-muted);font-size:11.5px;cursor:pointer;transition:color .15s,border-color .15s,background .15s}
.mmc-act:hover:not(:disabled){color:var(--mmc-text);border-color:var(--mmc-line);background:var(--mmc-surface-2)}
.mmc-act:disabled{opacity:.45;cursor:not-allowed}
.mmc-act--on{color:var(--mmc-success);border-color:color-mix(in srgb,var(--mmc-success) 40%,transparent);background:color-mix(in srgb,var(--mmc-success) 10%,transparent)}
.mmc-act--on:hover:not(:disabled){color:var(--mmc-success)}
.mmc-answer-usage{margin-left:auto;font-size:10.5px;color:var(--mmc-muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.mmc-tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin}
.mmc-tab-model{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;padding:4px 10px 4px 5px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface);color:var(--mmc-muted);font-size:11.5px;cursor:pointer;transition:border-color .15s,color .15s,background .15s}
.mmc-tab-model:hover{color:var(--mmc-text);border-color:var(--mmc-line-strong)}
.mmc-tab-model--on{border-color:color-mix(in srgb,var(--mmc-accent) 55%,transparent);background:color-mix(in srgb,var(--mmc-accent) 12%,transparent);color:var(--mmc-accent)}
.mmc-tab-model-name{max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-tab-like{color:var(--mmc-success);font-size:11px}
.mmc-tab-alert{display:inline-grid;place-items:center;width:14px;height:14px;border-radius:50%;background:color-mix(in srgb,var(--mmc-error) 18%,transparent);color:var(--mmc-error);font-size:9.5px;font-weight:700}
.mmc-tags{display:flex;flex-direction:column}
.mmc-skeleton{display:flex;flex-direction:column;gap:8px;min-height:44px}
.mmc-skeleton-line{display:block;height:10px;width:86%;border-radius:999px;background:linear-gradient(90deg,var(--mmc-surface-2),color-mix(in srgb,var(--mmc-line) 45%,transparent),var(--mmc-surface-2));background-size:220% 100%;animation:mmc-shimmer 1.4s linear infinite}
.mmc-skeleton-line--short{width:54%}
@keyframes mmc-shimmer{0%{background-position:120% 0}100%{background-position:-120% 0}}
.mmc-spinner{width:12px;height:12px;border-radius:50%;border:2px solid color-mix(in srgb,var(--mmc-accent) 35%,transparent);border-top-color:var(--mmc-accent);animation:mmc-spin .8s linear infinite;display:inline-block;flex:0 0 auto}
@keyframes mmc-spin{to{transform:rotate(360deg)}}
.mmc-composer{flex:0 0 auto;margin-top:10px;padding:10px 12px 10px;border-radius:16px;border:1px solid var(--mmc-line-strong);background:var(--mmc-surface);box-shadow:0 8px 22px color-mix(in srgb,var(--mmc-line) 20%,transparent)}
.mmc-modelbar{display:flex;align-items:flex-start;gap:10px;min-width:0}
.mmc-modelchips{flex:1 1 auto;display:flex;gap:6px;overflow-x:auto;padding:1px 1px 4px;scrollbar-width:thin;min-width:0}
.mmc-modelchip{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;padding:3px 10px 3px 4px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);color:var(--mmc-muted);font-size:11.5px;cursor:pointer;transition:border-color .15s,color .15s,background .15s}
.mmc-modelchip:hover{color:var(--mmc-text);border-color:var(--mmc-line-strong)}
.mmc-modelchip--on{border-color:color-mix(in srgb,var(--mmc-accent) 55%,transparent);background:color-mix(in srgb,var(--mmc-accent) 12%,transparent);color:var(--mmc-accent)}
.mmc-modelchip-name{max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-modelchip-dot{font-size:10px;font-weight:700;color:var(--mmc-accent)}
.mmc-modelbar-side{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;padding-top:1px}
.mmc-modelbar-count{font-size:10.5px;color:var(--mmc-muted);font-variant-numeric:tabular-nums;margin-right:2px}
.mmc-textarea{display:block;width:100%;min-height:52px;max-height:200px;margin-top:6px;padding:8px 4px;border:none;background:transparent;color:var(--mmc-text);font-size:13px;line-height:1.6;font-family:inherit;resize:none;outline:none}
.mmc-textarea::placeholder{color:var(--mmc-muted);opacity:.8}
.mmc-textarea:disabled{opacity:.6}
.mmc-inputbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:4px}
.mmc-layouts{display:inline-flex;align-items:center;gap:4px}
.mmc-layouts-label{font-size:10.5px;color:var(--mmc-muted);margin-right:3px}
.mmc-layout-btn{position:relative;display:grid;place-items:center;width:28px;height:28px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--mmc-muted);cursor:pointer;transition:color .15s,border-color .15s,background .15s}
.mmc-layout-btn:hover{color:var(--mmc-text);border-color:var(--mmc-line);background:var(--mmc-surface-2)}
.mmc-layout-btn[data-on="true"]{color:var(--mmc-accent);border-color:color-mix(in srgb,var(--mmc-accent) 55%,transparent);background:color-mix(in srgb,var(--mmc-accent) 12%,transparent)}
.mmc-layout-btn::after{content:attr(data-tip);position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%) translateY(3px);padding:4px 8px;border-radius:7px;border:1px solid var(--mmc-line-strong);background:var(--mmc-surface);color:var(--mmc-text);font-size:11px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s;box-shadow:0 6px 18px color-mix(in srgb,var(--mmc-text) 16%,transparent);z-index:5}
.mmc-layout-btn:hover::after{opacity:1;transform:translateX(-50%) translateY(0)}
.mmc-sendbar{display:inline-flex;align-items:center;gap:10px;margin-left:auto}
.mmc-hint{font-size:10.5px;color:var(--mmc-muted);white-space:nowrap}
.mmc-send{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:6px 18px;border-radius:10px;border:1px solid var(--mmc-accent);background:linear-gradient(180deg,color-mix(in srgb,var(--mmc-accent) 22%,transparent),color-mix(in srgb,var(--mmc-accent) 12%,transparent));color:var(--mmc-accent);font-size:12.5px;font-weight:600;cursor:pointer;transition:background .15s,opacity .15s}
.mmc-send:hover:not(:disabled){background:color-mix(in srgb,var(--mmc-accent) 26%,transparent)}
.mmc-send:disabled{opacity:.5;cursor:not-allowed}
.mmc-notice{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-top:10px;padding:8px 12px;border-radius:10px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);font-size:12px;color:var(--mmc-text);flex:0 0 auto}
.mmc-notice--error{border-color:color-mix(in srgb,var(--mmc-error) 45%,transparent);color:var(--mmc-error)}
.mmc-notice--warn{border-color:color-mix(in srgb,var(--mmc-warn) 45%,transparent);color:var(--mmc-warn)}
.mmc-notice--success{border-color:color-mix(in srgb,var(--mmc-success) 45%,transparent);color:var(--mmc-text)}
.mmc-notice-text{word-break:break-word}
.mmc-notice-close{border:none;background:transparent;color:inherit;font-size:12px;line-height:1;cursor:pointer;padding:2px;display:grid;place-items:center}
.mmc-stats-wrap{flex:1 1 auto;overflow-y:auto;min-height:0;margin-top:14px;padding-right:4px;scrollbar-width:thin}
.mmc-stats{display:flex;flex-direction:column;gap:14px;padding-bottom:16px}
.mmc-stats-mm{display:flex;align-items:center;gap:10px;justify-content:center;min-height:260px;color:var(--mmc-muted);font-size:12.5px;flex-direction:column}
.mmc-stats-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
.mmc-stats-title{margin:0;font-size:16px;font-weight:650}
.mmc-stats-sub{margin:4px 0 0;font-size:12px;color:var(--mmc-muted)}
.mmc-stat-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.mmc-stat-card{display:flex;flex-direction:column;gap:2px;padding:14px 16px;border-radius:12px;border:1px solid var(--mmc-line);background:var(--mmc-surface)}
.mmc-stat-value{font-size:26px;font-weight:650;line-height:1.1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.mmc-stat-value--accent{color:var(--mmc-accent)}
.mmc-stat-label{font-size:11.5px;color:var(--mmc-muted)}
.mmc-section{display:flex;flex-direction:column;gap:10px;padding:14px 16px 16px;border-radius:12px;border:1px solid var(--mmc-line);background:var(--mmc-surface);min-width:0}
.mmc-section-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap}
.mmc-section-title{margin:0;font-size:13px;font-weight:650}
.mmc-section-aside{font-size:11px;color:var(--mmc-muted)}
.mmc-rank-head,.mmc-rank-row{display:grid;grid-template-columns:28px minmax(150px,1.1fr) minmax(120px,1.6fr) 54px 54px 62px 74px 48px;gap:8px;align-items:center;min-width:0}
.mmc-rank-head{padding:0 2px 6px;border-bottom:1px solid var(--mmc-line);font-size:10.5px;color:var(--mmc-muted)}
.mmc-rank-row{padding:7px 2px;border-bottom:1px solid color-mix(in srgb,var(--mmc-line) 55%,transparent);font-size:12px}
.mmc-rank-row:last-child{border-bottom:none}
.mmc-rank-pos{font-size:11px;color:var(--mmc-muted);font-variant-numeric:tabular-nums;text-align:center}
.mmc-rank-row--liked .mmc-rank-pos{color:var(--mmc-accent);font-weight:650}
.mmc-rank-model{min-width:0;display:flex;align-items:center;gap:6px}
.mmc-rank-model .mmc-badge{max-width:100%}
.mmc-rank-bar{position:relative;display:block;height:8px;border-radius:999px;background:color-mix(in srgb,var(--mmc-line) 70%,transparent);overflow:hidden}
.mmc-rank-fill{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,color-mix(in srgb,var(--mmc-accent) 70%,transparent),var(--mmc-accent));transition:width .4s ease}
.mmc-rank-num{font-size:11.5px;color:var(--mmc-muted);text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.mmc-rank-num--strong{color:var(--mmc-success);font-weight:650}
.mmc-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px}
.mmc-trend{display:flex;align-items:flex-end;gap:6px;height:150px;padding-top:8px}
.mmc-trend-col{flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;min-width:0}
.mmc-trend-value{font-size:10px;color:var(--mmc-muted);height:13px;font-variant-numeric:tabular-nums}
.mmc-trend-track{position:relative;flex:1 1 auto;width:100%;max-width:22px;display:flex;align-items:flex-end;border-radius:5px;background:color-mix(in srgb,var(--mmc-line) 55%,transparent)}
.mmc-trend-fill{display:block;width:100%;border-radius:5px;background:linear-gradient(180deg,var(--mmc-accent),color-mix(in srgb,var(--mmc-accent) 55%,transparent));min-height:0;transition:height .4s ease}
.mmc-trend-label{font-size:9.5px;color:var(--mmc-muted);white-space:nowrap;transform:scale(.92)}
.mmc-layout-pills{display:flex;gap:8px;flex-wrap:wrap}
.mmc-layout-pill{display:flex;flex-direction:column;gap:2px;padding:9px 12px;border-radius:10px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);min-width:150px}
.mmc-layout-pill strong{font-size:12px;font-weight:600;color:var(--mmc-text)}
.mmc-layout-pill span{font-size:10.5px;color:var(--mmc-muted);font-variant-numeric:tabular-nums}
.mmc-recent{display:flex;flex-direction:column;gap:4px}
.mmc-recent-row{display:flex;align-items:flex-start;gap:10px;width:100%;padding:8px 10px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--mmc-text);text-align:left;cursor:pointer;min-width:0}
.mmc-recent-row:hover{background:var(--mmc-surface-2);border-color:var(--mmc-line)}
.mmc-recent-row .mmc-badge{flex:0 0 auto}
.mmc-recent-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1 1 auto}
.mmc-recent-prompt{font-size:12px;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-recent-snippet{font-size:11px;color:var(--mmc-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.mmc-recent-meta{flex:0 0 auto;font-size:10.5px;color:var(--mmc-muted);white-space:nowrap}
.mmc-error-inline{font-size:12px;color:var(--mmc-error);word-break:break-word}
/* ---- plugin settings ---- */
.mmc-input{width:100%;min-height:34px;padding:7px 11px;border-radius:9px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);color:var(--mmc-text);font-size:12.5px;font-family:inherit;transition:border-color .15s,background .15s}
.mmc-input:hover:not(:disabled){border-color:var(--mmc-line-strong)}
.mmc-input:focus{outline:none;border-color:var(--mmc-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--mmc-accent) 14%,transparent)}
.mmc-input::placeholder{color:var(--mmc-muted);opacity:.75}
.mmc-input:disabled{opacity:.6;cursor:not-allowed}
.mmc-input--mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px}
.mmc-input-wrap{position:relative;display:flex;align-items:center;width:100%}
.mmc-input-wrap .mmc-input{padding-right:40px}
.mmc-input-btn{position:absolute;right:4px;display:grid;place-items:center;width:28px;height:28px;border:none;border-radius:7px;background:transparent;color:var(--mmc-muted);cursor:pointer}
.mmc-input-btn:hover{color:var(--mmc-text);background:color-mix(in srgb,var(--mmc-line) 40%,transparent)}
.mmc-settings-wrap{flex:1 1 auto;min-height:0;overflow-y:auto;margin-top:14px;padding-right:4px;scrollbar-width:thin}
.mmc-settings{display:flex;flex-direction:column;gap:14px;padding-bottom:16px}
.mmc-settings-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
.mmc-set-card{gap:12px}
.mmc-set-fields{display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap}
.mmc-set-field{display:flex;flex-direction:column;gap:5px;flex:1 1 300px;min-width:0}
.mmc-set-field--grow{flex:2 1 420px}
.mmc-set-label{font-size:11.5px;font-weight:500;color:var(--mmc-muted)}
.mmc-set-hint{font-size:10.5px;line-height:1.55;color:var(--mmc-muted);word-break:break-word}
.mmc-set-actions{display:flex;align-items:center;gap:8px;padding-top:18px;flex:0 0 auto}
.mmc-set-result{font-size:11.5px;line-height:1.5;word-break:break-word}
.mmc-set-result--ok{color:var(--mmc-success)}
.mmc-set-result--error{color:var(--mmc-error)}
.mmc-set-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.mmc-set-search{margin-left:auto;min-width:190px}
.mmc-set-group{border:1px solid var(--mmc-line);border-radius:10px;overflow:hidden;background:var(--mmc-surface-2)}
.mmc-set-group+.mmc-set-group{margin-top:8px}
.mmc-set-group-head{display:flex;align-items:center;gap:8px;width:100%;padding:8px 12px;border:none;background:var(--mmc-surface);color:var(--mmc-text);font-size:12.5px;font-weight:600;cursor:pointer;text-align:left}
.mmc-set-group-head:hover{background:color-mix(in srgb,var(--mmc-line) 25%,var(--mmc-surface))}
.mmc-set-group-head svg{color:var(--mmc-muted)}
.mmc-set-group-name{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-set-group-count{min-width:20px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--mmc-line) 55%,transparent);color:var(--mmc-muted);font-size:10.5px;line-height:17px;text-align:center;font-variant-numeric:tabular-nums}
.mmc-set-group-selected{font-size:10.5px;color:var(--mmc-accent);white-space:nowrap}
.mmc-set-rows{display:flex;flex-direction:column}
.mmc-set-row-item{display:flex;align-items:center;gap:10px;padding:7px 12px;border-top:1px solid color-mix(in srgb,var(--mmc-line) 60%,transparent);min-height:42px;min-width:0}
.mmc-set-row-item:hover{background:color-mix(in srgb,var(--mmc-line) 18%,transparent)}
.mmc-set-row-item.is-on{background:color-mix(in srgb,var(--mmc-accent) 6%,transparent)}
.mmc-set-model-name{flex:1 1 auto;min-width:0;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-set-test{flex:0 0 auto;font-size:10.5px;color:var(--mmc-success);white-space:nowrap}
.mmc-set-test--error{color:var(--mmc-error);max-width:170px;overflow:hidden;text-overflow:ellipsis}
.mmc-switch-toggle{position:relative;flex:0 0 auto;width:34px;height:20px;border-radius:999px;border:1px solid var(--mmc-line-strong);background:color-mix(in srgb,var(--mmc-line) 55%,transparent);cursor:pointer;padding:0;transition:background .15s,border-color .15s}
.mmc-switch-toggle>span{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--mmc-surface);box-shadow:0 1px 2px color-mix(in srgb,var(--mmc-text) 25%,transparent);transition:left .15s,background .15s}
.mmc-switch-toggle.is-on{background:var(--mmc-accent);border-color:var(--mmc-accent)}
.mmc-switch-toggle.is-on>span{left:16px;background:var(--dsw-alias-bg-base)}
.mmc-switch-toggle:disabled{opacity:.5;cursor:not-allowed}
@media (max-width:860px){.mmc-history{display:none}}
@media (max-width:760px){
  .mmc-root{padding:14px 12px 12px}
  .mmc-head-side{width:100%}
  .mmc-rowwrap .mmc-answer{flex:0 0 82vw}
  .mmc-rank-head,.mmc-rank-row{grid-template-columns:24px minmax(110px,1.1fr) minmax(70px,1fr) 42px 42px 52px}
  .mmc-rank-head span:nth-child(7),.mmc-rank-head span:nth-child(8),
  .mmc-rank-row span:nth-child(7),.mmc-rank-row span:nth-child(8){display:none}
  .mmc-set-actions{padding-top:0}
  .mmc-set-search{margin-left:0;width:100%}
}
`;

    /* ------------------------------------------------------------------ *
     * Plugin
     * ------------------------------------------------------------------ */

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: DICT.zh, en: DICT.en }), 'multi-model-chat: dictionaries');

        const bound = ctx.locale.bind(NS);
        const t = (key, vars) => {
          const value = bound(key);
          const text = value === key ? DICT.zh[key] || key : value;
          return vars ? interpolate(text, vars) : text;
        };

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: PANEL_ID,
              order: 26,
              label: () => t('nav.label')
            },
            function SidebarEntry(props) {
              return h(PanelIcon, { size: props.size || 18, active: props.active === true });
            }
          )
        );

        ctx.slots.inject('main', () =>
          ctx.slots.register(
            {
              name: 'main',
              key: PANEL_ID,
              locale: NS
            },
            function MainEntry(props) {
              return h(MultiModelPage, { ...props, t: props.t || t });
            }
          )
        );
      }
    };
  }
});
