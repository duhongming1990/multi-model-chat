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
        'md.taskDone': '已完成',
        'md.taskTodo': '未完成',
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
        'md.taskDone': 'Completed',
        'md.taskTodo': 'Not completed',
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

    /* Brand artwork is generated from assets/icons/ into BRAND_ART below. */
    /* brand-icons:start */
    // Generated by scripts/build-icons.mjs from assets/icons/*. Do not edit by hand.
    const BRAND_ART = {
      "deepseek"     : 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjFlbSIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkRlZXBTZWVrPC90aXRsZT48cGF0aCBkPSJNMjMuNzQ4IDQuNDgyYy0uMjU0LS4xMjQtLjM2NC4xMTMtLjUxMi4yMzQtLjA1MS4wMzktLjA5NC4wOS0uMTM3LjEzNi0uMzcyLjM5Ny0uODA2LjY1Ny0xLjM3My42MjYtLjgyOS0uMDQ2LTEuNTM3LjIxNC0yLjE2My44NDgtLjEzMy0uNzgyLS41NzUtMS4yNDgtMS4yNDctMS41NDgtLjM1Mi0uMTU2LS43MDgtLjMxMS0uOTU1LS42NS0uMTcyLS4yNDEtLjIxOS0uNTEtLjMwNS0uNzc0LS4wNTUtLjE2LS4xMS0uMzIzLS4yOTMtLjM1LS4yLS4wMzEtLjI3OC4xMzYtLjM1Ni4yNzYtLjMxMy41NzItLjQzNCAxLjIwMi0uNDIyIDEuODQuMDI3IDEuNDM2LjYzMyAyLjU4IDEuODM4IDMuMzkzLjEzNy4wOTMuMTcyLjE4Ny4xMjkuMzIzLS4wODIuMjgtLjE4LjU1Mi0uMjY2LjgzMy0uMDU1LjE3OS0uMTM3LjIxNy0uMzI5LjE0YTUuNTI2IDUuNTI2IDAgMDEtMS43MzYtMS4xOGMtLjg1Ny0uODI4LTEuNjMxLTEuNzQyLTIuNTk3LTIuNDU4YTExLjM2NSAxMS4zNjUgMCAwMC0uNjg5LS40NzFjLS45ODUtLjk1Ny4xMy0xLjc0My4zODgtMS44MzYuMjctLjA5OC4wOTMtLjQzMi0uNzc5LS40MjgtLjg3Mi4wMDQtMS42Ny4yOTUtMi42ODcuNjg0YTMuMDU1IDMuMDU1IDAgMDEtLjQ2NS4xMzcgOS41OTcgOS41OTcgMCAwMC0yLjg4My0uMTAyYy0xLjg4NS4yMS0zLjM5IDEuMTAyLTQuNDk3IDIuNjIzQy4wODIgOC42MDYtLjIzMSAxMC42ODQuMTUyIDEyLjg1Yy40MDMgMi4yODQgMS41NjkgNC4xNzUgMy4zNiA1LjY1MyAxLjg1OCAxLjUzMyAzLjk5NyAyLjI4NCA2LjQzOCAyLjE0IDEuNDgyLS4wODUgMy4xMzMtLjI4NCA0Ljk5NC0xLjg2LjQ3LjIzNC45NjIuMzI3IDEuNzguMzk3LjYzLjA1OSAxLjIzNi0uMDMgMS43MDUtLjEyOC43MzUtLjE1Ni42ODQtLjgzNy40MTktLjk2MS0yLjE1NS0xLjAwNC0xLjY4Mi0uNTk1LTIuMTEzLS45MjYgMS4wOTYtMS4yOTYgMi43NDYtMi42NDIgMy4zOTItNy4wMDMuMDUtLjM0Ny4wMDctLjU2NSAwLS44NDUtLjAwNC0uMTcuMDM1LS4yMzcuMjMtLjI1NmE0LjE3MyA0LjE3MyAwIDAwMS41NDUtLjQ3NWMxLjM5Ni0uNzYzIDEuOTYtMi4wMTUgMi4wOTMtMy41MTcuMDItLjIzLS4wMDQtLjQ2Ny0uMjQ3LS41ODh6TTExLjU4MSAxOGMtMi4wODktMS42NDItMy4xMDItMi4xODMtMy41Mi0yLjE2LS4zOTIuMDI0LS4zMjEuNDcxLS4yMzUuNzYzLjA5LjI4OC4yMDcuNDg2LjM3MS43MzkuMTE0LjE2Ny4xOTIuNDE2LS4xMTMuNjAzLS42NzMuNDE2LTEuODQyLS4xNC0xLjg5Ny0uMTY3LTEuMzYxLS44MDItMi41LTEuODYtMy4zMDEtMy4zMDctLjc3NC0xLjM5My0xLjIyNC0yLjg4Ny0xLjI5OC00LjQ4Mi0uMDItLjM4Ni4wOTMtLjUyMi40NzctLjU5MmE0LjY5NiA0LjY5NiAwIDAxMS41MjktLjAzOWMyLjEzMi4zMTIgMy45NDYgMS4yNjUgNS40NjggMi43NzQuODY4Ljg2IDEuNTI1IDEuODg3IDIuMjAyIDIuODkxLjcyIDEuMDY2IDEuNDk0IDIuMDgyIDIuNDggMi45MTQuMzQ4LjI5Mi42MjUuNTE0Ljg5MS42NzctLjgwMi4wOS0yLjE0LjExLTMuMDU0LS42MTR6bTEtNi40NGEuMzA2LjMwNiAwIDAxLjQxNS0uMjg3LjMwMi4zMDIgMCAwMS4yLjI4OC4zMDYuMzA2IDAgMDEtLjMxLjMwNy4zMDMuMzAzIDAgMDEtLjMwNC0uMzA4em0zLjExIDEuNTk2Yy0uMi4wODEtLjM5OS4xNTEtLjU5LjE2YTEuMjQ1IDEuMjQ1IDAgMDEtLjc5OC0uMjU0Yy0uMjc0LS4yMy0uNDctLjM1OC0uNTUyLS43NThhMS43MyAxLjczIDAgMDEuMDE2LS41ODhjLjA3LS4zMjctLjAwOC0uNTM3LS4yMzktLjcyNy0uMTg3LS4xNTYtLjQyNi0uMTk5LS42ODgtLjE5OWEuNTU5LjU1OSAwIDAxLS4yNTQtLjA3OGMtLjExLS4wNTQtLjItLjE5LS4xMTQtLjM1OC4wMjgtLjA1NC4xNi0uMTg2LjE5Mi0uMjEuMzU2LS4yMDIuNzY3LS4xMzYgMS4xNDYuMDE2LjM1Mi4xNDQuNjE4LjQwOCAxLjAwMS43ODIuMzkxLjQ1MS40NjIuNTc2LjY4NS45MTQuMTc2LjI2NS4zMzYuNTM3LjQ0NS44NDguMDY3LjE5NS0uMDE5LjM1NC0uMjUuNDUyeiIgZmlsbD0iIzRENkJGRSI+PC9wYXRoPjwvc3ZnPg==',
      "doubao"       : 'data:image/webp;base64,UklGRqoHAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSPcBAAANZ0GQbZMK7P7KJ4iIHpicmiDBtm2nbYz1zVfUe6eEGAeRnPmPT+g33ptARP8ZSJISBw8IYNiY1UcAAAAAAACYWW5MZoCu737atgMAAAAASPfMFsvgF2Qmt7Zvi0bKk+02SWisXZtz08lYI7byaJpitLHbv1GNMDa/isc4XHd/W8YkzOYjnM4qAaMsrqmILh9S//XYn9Pw3AVpdZpsU8B8i/Jys5uK2mks3EXNI7y6rJkfIoU+Ee97rkE+DlUlenSngkfgN2ERO56XQE7IFr4c7NXzrRm6iuvWOwWcoePaXB09Q7RH2FK81TA0lUNZne6+s9DTXiHTDNmqfVlhdWVRmwzdx6DWIr+62HwQ5cXaMnEzNamvPqkPAAAAAAAAAAAAAAAAAAAAAADtx85oj157Ya8+PZ8TZWlbqy3NTFu6F3V1B9QLbamWqlJA87o6NFnbvUNrRTm/866bTFE71C92mnFPaenmVcBRt6Ne3FN2pqQDELYXWZe3W6vgJxRHLV/A9bGTHzEY++lautbfKJDN3sqe12sClOl+LWk7I25+yb3s9p0I5/TvmMlUPf8PIorUKUqJO6Q5xDEF+TefHc1obzsS16OYrdMM/4Q+3G0Z5Xz8MZGE8Ol4SJ3Hs9nkNo6mrjqfVxL/5vHTW5ubzLzX9t2zbZIhAgBWUDggjAUAABAdAJ0BKkAAQAA+USKNRSOiIRUJndA4BQSzG4B/ZvFT0m/r341/zO/C/6B/ZNMO2J/jNIw/sf4gdAI9n/gPQty7/B/Qd/MP6R/tUKAzwDTQNgAswj+IfzP8gK05wNUeFWYfexcyO3Xs7ivqJ2yHmA6FP+A9KDqGN59rInK4SYyUeA/an/tP458R1jv+5faBQQfHj9I+wR/KP6l/uexV6DR3r4Pmm/eFhcL39Ny/eyUp1Cd+lsdToasaSv5w0j+beJqLbhPf4Npq4PZQZOx5mSPvMwI3ZE+DKXKZ9RS3u4Ih/7ry3fwCS/0hw9TLaq9fP6AA/v+w1v+ZKk/yOVeQz064a4F97JJv9SgYZApuKvBaTS7XOOBkhlvk6rXvdJ3nfYHBTUvFdZt4TUk52NC1HU9nodLBz6aKFNS2eZiCLJGCo1sFx15HqeLnTQGhdx11kgN5Hz2RWVdvJTc1cbxlm4x1K6MUFg+MIc36z/4n20HWe6yVabNCg41x2ry4TJTHiUSPdEc34vDxgX401wRqQh0TWhil+Emw71o3dY2YbAHwU+QwxJent1Rd1SWT/no2L5/uBrbNnJFyLF/0xZ8uBCoflYwIi2LtJhRemV6aBz7iWM5nEtU+gdGZrlvnFf/ujn9mHaEfbD//ap1A2MNmbP/7/nMGfyEFsWT85dpl/+e2hssj+VdQ0gGe26oSaafuJRdP/24HkXw55TXVCZ3Hu3DFMOzotYG72pdlr4gKSfKq+2/DYpyN/eUA0hE/uLfchPQqakPEQNGF7bSrLt/wRWV483f/8fD4UnNycToXTGbqfq5a1/8n+ZX7eunXwlb+YCFCgn1b1/u/Sb691vMZCxuKZJa/eSzql9S5sqOMuLlbN3Ve6yq6QJI0hz3BdjPV3ZGL0V/bYSsjcDXVE94z1JycHqkEHFdfIP4lYJhVAiM+BNjqDAT49CsESoV4uK3P5sRt+cCv/lZ9467b9j6wbf9qpWYf/i+t8jdn/7B//+JWHgzM53LQB1EIW6H+1O14L/3afyWZvzv//NkN1NBFKoXUx/7gtXekSNR45Vp8ex+k8gBUV2ff2nA7ho8OL2nLmjRJ2hXm/mTKbWdOEV+yCbNpkKIV+leBThS0Vjj4W9VbsJC6TCuY/V9zFpr17v9+Adk+/LbaM0aGus2Q1xHIAZo8Ydvj3brfJSsjCFz0oco0WquonjiE9BiWrZUNTOtEQGMjvgugBgel9jfj1gvOzep/7h9CFq1A6ojn6blbdt4J2kr855RameaHfNL7CH/ycH+1cfoof+95eBQc///z4bvuD5s4cVuXl6BXw9vZsjPtj/ClLtaSXGwYzP9XRFHc89jbmCJ8PERKnKlxo6Y6oThmW+pff6rX0tt31rBQ953SrQ+KxgCSjb30nW4/8lc/nuHp9qbey+ppB//x0Va0nBdzQJA6C8+gjUxIyb0Rv4YhJz/PTnb7Vzay6N/B5MguZNgkXqS42CYpztDnJ15NcOQfGB7MdY74+X85NbA//ZOEJjPHbAbb3ukNS89/CKz7iXjQDKr0b96+Pznr3tl6JeT6Q+uyF/3Qz+S+yf/8MV33Pb9/Etqde3q/Hf/hr7DtK0G2rJL5y+3HELO6aunMK47uY4zrQROJ+472+SLqak5tK8+RxWiOfLvF994TQVzthJ4ddqHebb20IP3FCL9CnZh0AlFFr6DNhtdcYutZGe9MZsrGWjtl/noLhRdjYijOsvGlLLzvznwagQyYsU77kKVXvxcjkdr7huljBWMKjlrGZIOVmzYv1Uw4YDfTICTmrww2krz+vA1UZ8j96xbuP2q4GXjtZZGJf6dA2L/iPhrmsA3o8ZM8+ASDmSJWF1Of+BbCrq+jIhBNnTNAPXmkhuhXBf/+fFIMee0AAAA=',
      "glm"          : 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjFlbSIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkNoYXRHTE08L3RpdGxlPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ibG9iZS1pY29ucy1jaGF0LWdsbS1maWxsIiB4MT0iLTE4Ljc1NiUiIHgyPSI3MC44OTQlIiB5MT0iNDkuMzcxJSIgeTI9IjkwLjk0NCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1MDRBRjQiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzNDg1RkYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNOS45MTcgMmM0LjkwNiAwIDEwLjE3OCAzLjk0NyA4LjkzIDEwLjU4LS4wMTQuMDctLjAzNy4xNC0uMDU3LjIxbC0uMDAzLS4yNzdjLS4wODMtMy0xLjUzNC04LjkzNC04Ljg3LTguOTM0LTMuMzkzIDAtOC4xMzcgMy4wNTQtNy45MyA4LjE1OC0uMDQgNC43NzggMy41NTUgOC40IDcuOTUgOC4zMzJsLjA3My0uMDAxYzEuMi0uMDMzIDIuNzYzLS40MjkgMy4xLTEuNjU3LjA2My0uMDMxLjI2LjUzNC4yNjguNTk4LjA0OC4yNTYuMTEyLjM2OS4xOTIuMzQuOTgxLS4zNDggMi4yODYtMS4yMjIgMS45NTItMi4zOC0uMTc2LS42MS0xLjc3NS0uMTQ3LTEuOTIxLS4zNDcuNDE4LS45NzkgMi4yMzQtLjkyNiAzLjE1My0uNzE2LjQ0My4xMDIuNjU3LjM4IDEuMDEyLjQ0Mi4yOS4wNTIuOTgxLS4yLjk2LjI0Mi0xLjUgMy4wNDItNC44OTMgNS40MS04LjgwOCA1LjQxQzMuNjU0IDIyIDAgMTYuNTc0IDAgMTEuNzM3IDAgNS45NDcgNC45NTkgMiA5LjkxNyAyek05LjkgNS4zYy40ODQgMCAxLjEyNS4yMjUgMS4zOC41ODUgMy42NjkuMTQ1IDQuMzEzIDIuNjg2IDQuNjk0IDUuNDQ0LjI1NSAxLjgzOC4zMTUgMi4zLjE4MiAxLjM4N2wuMDgzLjU5Yy4wNjguNDQ4LjU1NC43MzcuOTgyLjUxNi4xNDQtLjA3NS4yNTQtLjIzMS4zMjgtLjQ3YS4yLjIgMCAwMS4yNTgtLjEzbC42MjUuMjJhLjIuMiAwIDAxLjEyNC4yMzggMi4xNzIgMi4xNzIgMCAwMS0uNTEuOTJjLS44NzguOTE3LTIuNzU3LjY2NC0zLjA4LS42Mi0uMTQtLjU1NC0uMDU1LS42MjYtLjM0NS0xLjI0Mi0uMjkyLS42MjEtMS4yMzgtLjcwOS0xLjY5LS4yOTUtLjM0NS4zMTUtLjQwNy44MDUtLjQwNiAxLjI4MkwxMi42IDE1LjlhLjkuOSAwIDAxLS45LjloLTEuNGEuOS45IDAgMDEtLjktLjl2LS42NWExLjE1IDEuMTUgMCAxMC0yLjMgMHYuNjVhLjkuOSAwIDAxLS45LjlINC44YS45LjkgMCAwMS0uOS0uOWwuMDM1LTMuMjM5Yy4wMTItMS44ODQuMzU2LTMuNjU4IDIuNDctNC4xMzQuMi0uMDQ1LjI1Mi4xMy4yOS4zNDIuMDI1LjE1NC4wNDMuMjUyLjA1My4yOTQuNzAxIDMuMDU4IDEuNzUgNC4yOTkgMy4xNDQgMy43MjJsLjY2LS4zMzEuMjU0LS4xM2MuMTU4LS4wODIuMjUtLjEzMS4yNzYtLjE1LjAxMi0uMDEtLjE2NS0uMjA2LS40MDctLjQ2NGwtMS4wMTItMS4wNjdhOC45MjUgOC45MjUgMCAwMS0uMTk5LS4yMTZjLS4wNDctLjAzNC0uMTE2LjA2OC0uMjA4LjMwNi0uMDc0LjE1Ny0uMjUxLjI1Mi0uMjcyLjMyNi0uMDEzLjA1OC4xMDguMjk4LjM2Mi43Mi4xNjQuMjg4LjIyLjUwOC0uMzEuMzQzLTEuMDQtLjgtMS41MTgtMi4yNzMtMS42ODQtMy43MjUtLjAwNC0uMDM1LS4xNjItMS45MTMtLjE2Mi0xLjkxM2ExLjIgMS4yIDAgMDExLjExMy0xLjI4MUw5LjkgNS4zem0xMi45OTQgOC42OGMuMDM3LjY5Ny0uNDAzLjcwNC0xLjIxMy41OTFsLTEuNzgzLS4yNzZjLS4yNjUtLjA1My0uMzg1LS4wOTktLjMxMy0uMTQ3LjQ3LS4zMTUgMy4yNjgtLjkzIDMuMzEtLjE2OHptLS45MTUtLjA4M2wtLjkyNi4wNDJjLS44NS4wNzctMS40NTIuMjQuMzM4LjMzNmwuMTAzLjAwM2MuODE1LjAxMiAxLjI2NC0uMzU5LjQ4NS0uMzgxem0xLjY2Ny0zLjYwMWguMDFjLjc5LjM5OC4wNjcgMS4wMy0uNjUgMS4zOTMtLjE0LjA3LS40OTEuMTc2LTEuMDUyLjMxNS0uMjQxLjA0LS40NTcuMDkyLS4zMzMuMTZsLjAxLjAwNWMxLjk1Mi45NTgtMy4xMjMgMS41MzQtMi40OTUgMS4yODVsLjM4LS4xNDhjLjY4LS4yNjYgMS42MTQtLjY4MiAxLjY2Ni0xLjMzNy4wMzgtLjQ4IDEuMjUzLS40NDIgMS40OTMtLjk2OC4wNDgtLjEwNiAwLS4yMzYtLjE0NC0uMzg5LS4wNS0uMDQ3LS4wOTQtLjA5NC0uMTA3LS4xNDgtLjA3My0uMzA1LjctLjQzMSAxLjIyMi0uMTY4em0tMi41NjgtLjQ3NGMtLjEzNSAxLjE5OC0yLjQ3OSA0LjE5Mi0xLjk0OSAyLjg2M2wuMDE3LS4wNDJjLjI5OC0uNzE3LjM3Ni0yLjIyMSAxLjMzNy0zLjIyMS4yNS0uMjYuNjM2LjAzNS41OTUuNHptLTcuOTc2LS4yNTNjLjAyLS42OTQgMS4wMDItLjk2OCAxLjM0Ni0uMzQ3LjAxLTEuMjc0LTEuOTQxLS43NjgtMS4zNDYuMzQ3eiIgZmlsbD0idXJsKCNsb2JlLWljb25zLWNoYXQtZ2xtLWZpbGwpIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjwvcGF0aD48L3N2Zz4=',
      "kimi"         : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczp4b2RtPSJodHRwOi8vd3d3LmNvcmVsLmNvbS9jb3JlbGRyYXcvb2RtLzIwMDMiIHhtbDpzcGFjZT0icHJlc2VydmUiIHZlcnNpb249IjEuMCIgc3R5bGU9InNoYXBlLXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IHRleHQtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgaW1hZ2UtcmVuZGVyaW5nOm9wdGltaXplUXVhbGl0eTsgZmlsbC1ydWxlOmV2ZW5vZGQ7IGNsaXAtcnVsZTpldmVub2RkIiB2aWV3Qm94PSIyNTg5LjkzIDUyOS4zIDQyMjUuMDMgNDIyNS4wMyI+CiA8ZGVmcz4KICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgogICA8IVtDREFUQVsKICAgIC5maWwzIHtmaWxsOiMyQjJBMjl9CiAgICAuZmlsNSB7ZmlsbDojMDE3OUZGfQogICAgLmZpbDQge2ZpbGw6d2hpdGV9CiAgIF1dPgogIDwvc3R5bGU+CiA8L2RlZnM+CiA8ZyBpZD0iTGF5ZXJfeDAwMjBfMSI+CiAgPG1ldGFkYXRhIGlkPSJDb3JlbENvcnBJRF8wQ29yZWwtTGF5ZXIiLz4KICA8cmVjdCBjbGFzcz0iZmlsMyIgeD0iMjU4OS45MyIgeT0iNTI5LjMiIHdpZHRoPSI0MjI1LjAzIiBoZWlnaHQ9IjQyMjUuMDMiIHJ4PSIzMDQuNTkiIHJ5PSIzMDQuNTkiLz4KICA8ZyBpZD0iXzI0NDgxNjkxNjExMjAiPgogICA8cGF0aCBjbGFzcz0iZmlsNCIgZD0iTTQzNTQuODIgMjM5NS4xNWwtNjQxLjI5IDAgMCAtMTA0My42NyAtNTE4LjY5IDAgMCAyNzAwLjM1IDUxOC42OSAwIDAgLTExMzcuOTkgOTMwLjUgMGM5OS4zMSwwIDE4Ny4xNiwtNDIuNTEgMjU3LjAyLC0xMDQuNDkgMjkuMTcsLTI1Ljg3IDQzLjc2LC00Mi4wOSA2Ny40NSwtNzcuMTZsMjcuNjIgLTQ0LjY4IDAgMTM2NC4zMiA1MjEuODQgMCAwIC0xMTI4LjU1YzAsLTI3NS45IC0xOTMuMzUsLTQ4My42OCAtNDQxLjg3LC01MjMuMjIgLTUzLjE0LC04LjQ2IC0yNTAuOTUsLTQuOTEgLTMxOC44OSwtNC45MSAyNS4yMywtMjEuOTMgMTMzLjQ0LC0yOC44NiAyNjMuMjEsLTIwOC4zMyA4LjAzLC0xMS4xMSAxMy4yMSwtMjEuOTkgMTkuODgsLTMzLjU2IDIzLjYzLC00MC45OSA4MS44LC0xNzMuOTMgMTAxLjM0LC0yMTkuMzFsMTE0LjM2IC0yNTYuNThjMjcuMzQsLTU2LjkxIDU2LjM2LC0xMzEuOTggODEuNzYsLTE4Mi4zMSA2LjE2LC0xMi4yMiAxMS40OSwtMjUuMTYgMTYuNjksLTM2Ljc0IDguMzcsLTE4LjYzIDQ2LC05OC42NSA0Ny4yMSwtMTEzLjEybC01NzguNDIgMGMtMTAuNzYsMjAuMzQgLTE4Ljc3LDQyLjk2IC0yOS4zNSw2NC45NyAtNS4yNiwxMC45NSAtMTAuMTYsMjMuMDYgLTE0LjIxLDMyLjkzbC0zOTAuMjEgODg5LjI0Yy04LjQzLDE4Ljc2IC0yMy4wMyw2Mi44MSAtMzQuNjQsNjIuODF6Ii8+CiAgIDxwYXRoIGNsYXNzPSJmaWw1IiBkPSJNNTYyNC44MyAxNTMzLjgxYzAsMTYyLjM2IDgxLjc0LDIyNC4zMyA4MS43NCwyNDIuMDYgMCwyMy4yNSAtMTEuOTcsMjcuNSAtMzIuODEsNTUuMjEgLTExLjYxLDE1LjQ0IC0yNC42OCwyOS4yOCAtMzMuMjEsNDUuMzlsODEuNTggLTMuMzFjMTEuNzUsLTAuOTcgMTAuOTgsLTIuNjcgMjUuMjEsLTMuMDhsODEuODUgLTMuMDRjMTMuNjksLTAuNyAxMS40NSwtMi40OSAyNS4xNCwtMy4xNSA5My4xLC00LjUgMTk3LjcyLC0xNS45MyAyNjEuNzYsLTc3Ljc1IDExOC42MSwtMTE0LjUxIDEyNS42NywtMzYwLjI5IDE3LjIyLC00NjguNDYgLTQ1LjEzLC00NS4wMSAtMTEyLjYsLTgxLjAzIC0xNzguNCwtODIuNTIgLTE3LjA1LC0wLjM5IC0xOS42MywtMy4zNCAtMzQuNTgsLTMuMzQgLTI5Ljc0LDAgLTk4LjI5LDExLjE2IC0xMjUuODEsMjIuMTUgLTM0LjQsMTMuNzMgLTY2LjQxLDMyLjE1IC05MS45Nyw1OC45MiAtNDAuODQsNDIuNzkgLTc3LjcyLDEzNy42NiAtNzcuNzIsMjIwLjkyeiIvPgogIDwvZz4KIDwvZz4KPC9zdmc+',
      "mimo"         : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzc1MjQ2NTY1ODI5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjczNTEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPjxwYXRoIGQ9Ik03MTYuOCAwYzE2OS42NjQgMCAzMDcuMiAxMzcuNTM2IDMwNy4yIDMwNy4ydjQwOS42YzAgMTY5LjY2NC0xMzcuNTM2IDMwNy4yLTMwNy4yIDMwNy4ySDMwNy4yQzEzNy41MzYgMTAyNCAwIDg4Ni40NjQgMCA3MTYuOFYzMDcuMkMwIDEzNy41MzYgMTM3LjUzNiAwIDMwNy4yIDBoNDA5LjZ6TTUyOS42MTI4IDMyMC41MjQ4SDIyOC42MDhhNC4yMzY4IDQuMjM2OCAwIDAgMC00LjE5ODQgNC4yNzUydjM3Mi42MDhhNC4yMjQgNC4yMjQgMCAwIDAgNC4xOTg0IDQuMjQ5Nmg4MC40MDk2YzIuMzE2OCAwIDQuMTk4NC0xLjkyIDQuMTk4NC00LjI4OFY0MDQuOTI4YzAtMi4zNjggMS44ODE2LTQuMzAwOCA0LjE5ODQtNC4zMDA4aDE3Mi45MDI0YzMyLjQ3MzYgMCA1OC44MDMyIDI3LjAwOCA1OC44MDMyIDYwLjMwMDh2MjM2LjQ0MTZjMCAyLjM2OCAxLjg4MTYgNC4yODggNC4xODU2IDQuMjg4aDc5LjIzMmE0LjIyNCA0LjIyNCAwIDAgMCA0LjE3MjgtNC4yNzUyVjQzMC4zODcyYzAtNjAuNjcyLTQ3LjkzNi0xMDkuODYyNC0xMDcuMDg0OC0xMDkuODYyNHpNNDcwLjE0NCA0NjguOTkyaC04MC4zODRhNC4yNDk2IDQuMjQ5NiAwIDAgMC00LjE5ODQgNC4zMDA4djIyNC4wODk2YzAgMi4zODA4IDEuODY4OCA0LjI4OCA0LjE5ODQgNC4yODhoODAuMzg0YzEuMTEzNiAwIDIuMTc2LTAuNDQ4IDIuOTU2OC0xLjI0MTZhNC4zMzkyIDQuMzM5MiAwIDAgMCAxLjIyODgtMy4wNDY0VjQ3My4yOGE0LjM1MiA0LjM1MiAwIDAgMC0xLjIyODgtMy4wNDY0IDQuMTM0NCA0LjEzNDQgMCAwIDAtMi45NTY4LTEuMjU0NHogbTMyMS40MzM2LTE0OC40NDE2aC04MC4zNTg0Yy0yLjMyOTYgMC00LjIyNCAxLjkyLTQuMjI0IDQuMzAwOHYzNzIuNTMxMmMwIDIuMzgwOCAxLjg5NDQgNC4yODggNC4yMjQgNC4yODhoODAuMzU4NGMyLjMyOTYgMCA0LjIxMTItMS45MiA0LjIxMTItNC4yODhWMzI0LjgzODRhNC4zNTIgNC4zNTIgMCAwIDAtMS4yMjg4LTMuMDQ2NCA0LjE0NzIgNC4xNDcyIDAgMCAwLTIuOTgyNC0xLjI1NDR6IiBmaWxsPSIjRkY2QTAwIiBwLWlkPSI3MzUyIj48L3BhdGg+PC9zdmc+',
      "minimax"      : 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjFlbSIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPk1pbmltYXg8L3RpdGxlPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ibG9iZS1pY29ucy1taW5pbWF4LWZpbGwiIHgxPSIwJSIgeDI9IjEwMC4xODIlIiB5MT0iNTAuMDU3JSIgeTI9IjUwLjA1NyUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFMjE2N0UiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRTYwM0MiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMTYuMjc4IDJjMS4xNTYgMCAyLjA5My45MjcgMi4wOTMgMi4wN3YxMi41MDFhLjc0Ljc0IDAgMDAuNzQ0LjcwOS43NC43NCAwIDAwLjc0My0uNzA5VjkuMDk5YTIuMDYgMi4wNiAwIDAxMi4wNzEtMi4wNDlBMi4wNiAyLjA2IDAgMDEyNCA5LjF2Ni41NjFhLjY0OS42NDkgMCAwMS0uNjUyLjY0NS42NDkuNjQ5IDAgMDEtLjY1My0uNjQ1VjkuMWEuNzYyLjc2MiAwIDAwLS43NjYtLjc1OC43NjIuNzYyIDAgMDAtLjc2Ni43NTh2Ny40NzJhMi4wMzcgMi4wMzcgMCAwMS0yLjA0OCAyLjAyNiAyLjAzNyAyLjAzNyAwIDAxLTIuMDQ4LTIuMDI2di0xMi41YS43ODUuNzg1IDAgMDAtLjc4OC0uNzUzLjc4NS43ODUgMCAwMC0uNzg5Ljc1MmwtLjAwMSAxNS45MDRBMi4wMzcgMi4wMzcgMCAwMTEzLjQ0MSAyMmEyLjAzNyAyLjAzNyAwIDAxLTIuMDQ4LTIuMDI2VjE4LjA0YzAtLjM1Ni4yOTItLjY0NS42NTItLjY0NS4zNiAwIC42NTIuMjg5LjY1Mi42NDV2MS45MzRjMCAuMjYzLjE0Mi41MDYuMzcyLjYzOC4yMy4xMzEuNTE0LjEzMS43NDQgMGEuNzM0LjczNCAwIDAwLjM3Mi0uNjM4VjQuMDdjMC0xLjE0My45MzctMi4wNyAyLjA5My0yLjA3em0tNS42NzQgMGMxLjE1NiAwIDIuMDkzLjkyNyAyLjA5MyAyLjA3djExLjUyM2EuNjQ4LjY0OCAwIDAxLS42NTIuNjQ1LjY0OC42NDggMCAwMS0uNjUyLS42NDVWNC4wN2EuNzg1Ljc4NSAwIDAwLS43ODktLjc4Ljc4NS43ODUgMCAwMC0uNzg5Ljc4djE0LjAxM2EyLjA2IDIuMDYgMCAwMS0yLjA3IDIuMDQ4IDIuMDYgMi4wNiAwIDAxLTIuMDcxLTIuMDQ4VjkuMWEuNzYyLjc2MiAwIDAwLS43NjYtLjc1OC43NjIuNzYyIDAgMDAtLjc2Ni43NTh2My44YTIuMDYgMi4wNiAwIDAxLTIuMDcxIDIuMDQ5QTIuMDYgMi4wNiAwIDAxMCAxMi45di0xLjM3OGMwLS4zNTcuMjkyLS42NDYuNjUyLS42NDYuMzYgMCAuNjUzLjI5LjY1My42NDZWMTIuOWMwIC40MTguMzQzLjc1Ny43NjYuNzU3cy43NjYtLjMzOS43NjYtLjc1N1Y5LjA5OWEyLjA2IDIuMDYgMCAwMTIuMDctMi4wNDggMi4wNiAyLjA2IDAgMDEyLjA3MSAyLjA0OHY4Ljk4NGMwIC40MTkuMzQzLjc1OC43NjcuNzU4LjQyMyAwIC43NjYtLjMzOS43NjYtLjc1OFY0LjA3YzAtMS4xNDMuOTM3LTIuMDcgMi4wOTMtMi4wN3oiIGZpbGw9InVybCgjbG9iZS1pY29ucy1taW5pbWF4LWZpbGwpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD48L3N2Zz4=',
      "model-mapping": 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzcyOTAzMjI2Mzk0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE5Mzk1IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cGF0aCBkPSJNMCAwbTI1NiAwbDUxMiAwcTI1NiAwIDI1NiAyNTZsMCA1MTJxMCAyNTYtMjU2IDI1NmwtNTEyIDBxLTI1NiAwLTI1Ni0yNTZsMC01MTJxMC0yNTYgMjU2LTI1NloiIGZpbGw9IiMwMDcwRkYiIHAtaWQ9IjE5Mzk2Ij48L3BhdGg+PHBhdGggZD0iTTU3NiA3OTAuMzE0NjY3YTIzOS4zNiAyMzkuMzYgMCAwIDEtMjA3Ljc4NjY2Ny00MC4xNDkzMzQgMTEwLjE2NTMzMyAxMTAuMTY1MzMzIDAgMCAwLTI5LjM5NzMzMy0xNTEuNDI0IDEwNy4wMDggMTA3LjAwOCAwIDAgMC0xNDkuNTQ2NjY3IDI5LjMxMiAxMTAuMTY1MzMzIDExMC4xNjUzMzMgMCAwIDAgMjguNDE2IDE1MS41OTQ2NjdjMzIuNDI2NjY3IDIyLjA1ODY2NyA3My45ODQgMjQuNzQ2NjY3IDEwOC44ODUzMzQgNy4xMjUzMzNhMjkxLjYyNjY2NyAyOTEuNjI2NjY3IDAgMCAwIDI2My40NjY2NjYgNTUuODkzMzM0IDI3LjUyIDI3LjUyIDAgMCAwIDE4LjA0OC0zNC4wNDggMjguMDMyIDI4LjAzMiAwIDAgMC0zMi41OTczMzMtMTguNzczMzM0bDAuNDY5MzMzIDAuNDY5MzM0eiIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iLjc0NyIgcC1pZD0iMTkzOTciPjwvcGF0aD48cGF0aCBkPSJNNTEyLjI1NiAxNzAuNjY2NjY3Yy01Ni40OTA2NjcgMC4xMjgtMTAzLjIxMDY2NyA0NC41ODY2NjctMTA2Ljg4IDEwMS42NzQ2NjZhMjk4LjExMiAyOTguMTEyIDAgMCAwLTE3OS42MjY2NjcgMjAzLjMwNjY2NyAyNy45ODkzMzMgMjcuOTg5MzMzIDAgMCAwIDE5LjAyOTMzNCAzMy41Nzg2NjcgMjcuNTYyNjY3IDI3LjU2MjY2NyAwIDAgMCAzMy4xNTItMTkuMzI4QTI0My4xMTQ2NjcgMjQzLjExNDY2NyAwIDAgMSA0MTUuOTE0NjY3IDMyNy4yNTMzMzNhMTA3LjM5MiAxMDcuMzkyIDAgMCAwIDEyOS4xMDkzMzMgNTcuMTMwNjY3IDEwOS4zNTQ2NjcgMTA5LjM1NDY2NyAwIDAgMCA3NC43OTQ2NjctMTIwLjk2QTEwOC4zMzA2NjcgMTA4LjMzMDY2NyAwIDAgMCA1MTIuNzI1MzMzIDE3MC42NjY2NjdoLTAuNDY5MzMzeiBtMjkzLjAzNDY2NyA0MjguMDMyYTMwMi45MzMzMzMgMzAyLjkzMzMzMyAwIDAgMC04Mi4zMDQtMjU5LjI4NTMzNCAyNi44OCAyNi44OCAwIDAgMC00Ny4zNiAxMS4yMjEzMzQgMjcuNjQ4IDI3LjY0OCAwIDAgMCA5LjIxNiAyNy40MzQ2NjYgMjQ3LjkzNiAyNDcuOTM2IDAgMCAxIDcwLjI3MiAyMDMuMzQ5MzM0IDEwOS4wNTYgMTA5LjA1NiAwIDAgMC0xMTYuOTA2NjY3IDg1LjUwNCAxMTAuNTQ5MzMzIDExMC41NDkzMzMgMCAwIDAgNjkuMzMzMzMzIDEyOCAxMDguMzMwNjY3IDEwOC4zMzA2NjcgMCAwIDAgMTMzLjk3MzMzNC01My44NDUzMzQgMTExLjE0NjY2NyAxMTEuMTQ2NjY3IDAgMCAwLTM2LjI2NjY2Ny0xNDEuMzk3MzMzdi0wLjk4MTMzM3oiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjE5Mzk4Ij48L3BhdGg+PC9zdmc+',
      "perplexity"   : 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjFlbSIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPlBlcnBsZXhpdHk8L3RpdGxlPjxwYXRoIGQ9Ik0xOS43ODUgMHY3LjI3MkgyMi41VjE3LjYyaC0yLjkzNVYyNGwtNy4wMzctNi4xOTR2Ni4xNDVoLTEuMDkxdi02LjE1Mkw0LjM5MiAyNHYtNi40NjVIMS41VjcuMTg4aDIuODg0VjBsNy4wNTMgNi40OTRWLjE5aDEuMDl2Ni40OUwxOS43ODYgMHptLTcuMjU3IDkuMDQ0djcuMzE5bDUuOTQ2IDUuMjM0VjE0LjQ0bC01Ljk0Ni01LjM5N3ptLTEuMDk5LS4wOGwtNS45NDYgNS4zOTh2Ny4yMzVsNS45NDYtNS4yMzRWOC45NjV6bTguMTM2IDcuNThoMS44NDRWOC4zNDlIMTMuNDZsNi4xMDUgNS41NHYyLjY1NXptLTguOTgyLTguMjhIMi41OXY4LjE5NWgxLjh2LTIuNTc2bDYuMTkyLTUuNjJ6TTUuNDc1IDIuNDc2djQuNzFoNS4xMTVsLTUuMTE1LTQuNzF6bTEzLjIxOSAwbC01LjExNSA0LjcxaDUuMTE1di00LjcxeiIgZmlsbD0iIzIyQjhDRCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+PC9zdmc+',
      "qwen"         : 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjFlbSIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPlF3ZW48L3RpdGxlPjxwYXRoIGQ9Ik0xMi42MDQgMS4zNGMuMzkzLjY5Ljc4NCAxLjM4MiAxLjE3NCAyLjA3NWEuMTguMTggMCAwMC4xNTcuMDkxaDUuNTUyYy4xNzQgMCAuMzIyLjExLjQ0Ni4zMjdsMS40NTQgMi41N2MuMTkuMzM3LjI0LjQ3OC4wMjQuODM3LS4yNi40My0uNTEzLjg2NC0uNzYgMS4zbC0uMzY3LjY1OGMtLjEwNi4xOTYtLjIyMy4yOC0uMDQuNTEybDIuNjUyIDQuNjM3Yy4xNzIuMzAxLjExMS40OTQtLjA0My43Ny0uNDM3Ljc4NS0uODgyIDEuNTY0LTEuMzM1IDIuMzQtLjE1OS4yNzItLjM1Mi4zNzUtLjY4LjM3LS43NzctLjAxNi0xLjU1Mi0uMDEtMi4zMjcuMDE2YS4wOTkuMDk5IDAgMDAtLjA4MS4wNSA1NzUuMDk3IDU3NS4wOTcgMCAwMS0yLjcwNSA0Ljc0Yy0uMTY5LjI5My0uMzguMzYzLS43MjUuMzY0LS45OTcuMDAzLTIuMDAyLjAwNC0zLjAxNy4wMDJhLjUzNy41MzcgMCAwMS0uNDY1LS4yNzFsLTEuMzM1LTIuMzIzYS4wOS4wOSAwIDAwLS4wODMtLjA0OUg0Ljk4MmMtLjI4NS4wMy0uNTUzLS4wMDEtLjgwNS0uMDkybC0xLjYwMy0yLjc3YS41NDMuNTQzIDAgMDEtLjAwMi0uNTRsMS4yMDctMi4xMmEuMTk4LjE5OCAwIDAwMC0uMTk3IDU1MC45NTEgNTUwLjk1MSAwIDAxLTEuODc1LTMuMjcybC0uNzktMS4zOTVjLS4xNi0uMzEtLjE3My0uNDk2LjA5NS0uOTY1LjQ2NS0uODEzLjkyNy0xLjYyNSAxLjM4Ny0yLjQzNi4xMzItLjIzNC4zMDQtLjMzNC41ODQtLjMzNWEzMzguMyAzMzguMyAwIDAxMi41ODktLjAwMS4xMjQuMTI0IDAgMDAuMTA3LS4wNjNsMi44MDYtNC44OTVhLjQ4OC40ODggMCAwMS40MjItLjI0NmMuNTI0LS4wMDEgMS4wNTMgMCAxLjU4My0uMDA2TDExLjcwNCAxYy4zNDEtLjAwMy43MjQuMDMyLjkuMzR6bS0zLjQzMi40MDNhLjA2LjA2IDAgMDAtLjA1Mi4wM0w2LjI1NCA2Ljc4OGEuMTU3LjE1NyAwIDAxLS4xMzUuMDc4SDMuMjUzYy0uMDU2IDAtLjA3LjAyNS0uMDQxLjA3NGw1LjgxIDEwLjE1NmMuMDI1LjA0Mi4wMTMuMDYyLS4wMzQuMDYzbC0yLjc5NS4wMTVhLjIxOC4yMTggMCAwMC0uMi4xMTZsLTEuMzIgMi4zMWMtLjA0NC4wNzgtLjAyMS4xMTguMDY4LjExOGw1LjcxNi4wMDhjLjA0NiAwIC4wOC4wMi4xMDQuMDYxbDEuNDAzIDIuNDU0Yy4wNDYuMDgxLjA5Mi4wODIuMTM5IDBsNS4wMDYtOC43Ni43ODMtMS4zODJhLjA1NS4wNTUgMCAwMS4wOTYgMGwxLjQyNCAyLjUzYS4xMjIuMTIyIDAgMDAuMTA3LjA2MmwyLjc2My0uMDJhLjA0LjA0IDAgMDAuMDM1LS4wMi4wNDEuMDQxIDAgMDAwLS4wNGwtMi45LTUuMDg2YS4xMDguMTA4IDAgMDEwLS4xMTNsLjI5My0uNTA3IDEuMTItMS45NzdjLjAyNC0uMDQxLjAxMi0uMDYyLS4wMzUtLjA2Mkg5LjJjLS4wNTkgMC0uMDczLS4wMjYtLjA0My0uMDc3bDEuNDM0LTIuNTA1YS4xMDcuMTA3IDAgMDAwLS4xMTRMOS4yMjUgMS43NzRhLjA2LjA2IDAgMDAtLjA1My0uMDMxem02LjI5IDguMDJjLjA0NiAwIC4wNTguMDIuMDM0LjA2bC0uODMyIDEuNDY1LTIuNjEzIDQuNTg1YS4wNTYuMDU2IDAgMDEtLjA1LjAyOS4wNTguMDU4IDAgMDEtLjA1LS4wMjlMOC40OTggOS44NDFjLS4wMi0uMDM0LS4wMS0uMDUyLjAyOC0uMDU0bC4yMTYtLjAxMiA2LjcyMi0uMDEyeiIgZmlsbD0idXJsKCNsb2JlLWljb25zLXF3ZW4tZmlsbCkiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0ibG9iZS1pY29ucy1xd2VuLWZpbGwiIHgxPSIwJSIgeDI9IjEwMCUiIHkxPSIwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjMzNkU3IiBzdG9wLW9wYWNpdHk9Ii44NCI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzZGNjlGNyIgc3RvcC1vcGFjaXR5PSIuODQiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=',
      "yuanbao"      : 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjFlbSIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxZW0iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPll1YW5iYW88L3RpdGxlPjxwYXRoIGQ9Ik03LjA2MyAxLjY2NEM1LjE5OCAzLjMzOCA0LjM5NSA2LjY3IDUuNzgyIDguNTY4YzEuNDcgMi4wMTQgNC43OSAxLjc0NSA2Ljk1My4xMTMgMi40MzQtMS44NCA2LjAzMy0xLjc5MyA3LjIzLjk1My45MSAyLjIwNy4wNjcgNC45MjctMi4xMTMgNi40ODMtNC4zMDIgMy4wOTctMTAuNTc3IDIuNTItMTMuNDcyLTEuNDQ0LTIuODYtMy45MTUtMS4zNS05LjY5NiAyLjY4My0xMy4wMTF2LjAwMnoiIGZpbGw9IiNmZmYiPjwvcGF0aD48cGF0aCBkPSJNMTIuMDA3LjY0N0M1LjM4NC42NDcuMDE1IDUuNzM0LjAxNSAxMi4wMDdzNS4zNjkgMTEuMzYgMTEuOTkyIDExLjM2QzE4LjYzMSAyMy4zNjYgMjQgMTguMjggMjQgMTIuMDA2IDI0IDUuNzMyIDE4LjYzMS42NDcgMTIuMDA3LjY0N3ptNS44NDYgMTUuNDcyQzEzLjU1IDE5LjIxNiA3LjI3NSAxOC42NCA0LjM4IDE0LjY3NSAxLjUyMSAxMC43NTkgMy4wMyA0Ljk3OSA3LjA2NCAxLjY2NCA1LjE5OSAzLjMzOCA0LjM5NiA2LjY3IDUuNzgyIDguNTY4YzEuNDcgMi4wMTQgNC43OTEgMS43NDUgNi45NTQuMTEyIDIuNDMzLTEuODM4IDYuMDMyLTEuNzkyIDcuMjMuOTU0LjkxIDIuMjA3LjA2NyA0LjkyNi0yLjExMyA2LjQ4M3YuMDAyeiIgZmlsbD0iIzAwQ0M3MCI+PC9wYXRoPjxwYXRoIGQ9Ik0xNC44MDEgMTQuOTA0YS42NjkuNjY5IDAgMDEtLjUzNi0uMjY5bC0xLjAyLTEuMzdhLjY3LjY3IDAgMDEuMDA2LS44MDZsMS4wMi0xLjMyOGEuNjY4LjY2OCAwIDAxMS4wNTkuODE1bC0uNzEyLjkyNS43Mi45NjNhLjY3LjY3IDAgMDEtLjUzNSAxLjA2NmwtLjAwMi4wMDR6bS0zLjkzMS0yLjAwMWMwIDEuNzk3LS4zNTYgMi4xMzUtMS4xNiAyLjEzNS0uODA2IDAtMS4xNjItLjMzOC0xLjE2Mi0yLjEzNSAwLTEuNzk2LjM1Ny0yLjEzNCAxLjE2MS0yLjEzNC44MDUgMCAxLjE2Mi4zMzggMS4xNjIgMi4xMzRoLS4wMDF6IiBmaWxsPSIjMUMxQzFDIj48L3BhdGg+PC9zdmc+Cg==',
      "zai"          : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjMuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDMwIDMwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMCAzMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtvcGFjaXR5OjAuMztmaWxsOiNFMkU0RTc7fQoJLnN0MXtvcGFjaXR5OjAuODtmaWxsOiNFMkU0RTc7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MntmaWxsOnVybCgjU1ZHSURfMV8pO30KCS5zdDN7ZmlsbDpub25lO3N0cm9rZTojRTBFNEU5O3N0cm9rZS13aWR0aDowLjI1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDR7ZmlsbDpub25lO30KCS5zdDV7ZmlsbDojOURBMUE1O30KCS5zdDZ7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDpub25lO30KCS5zdDd7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojREZFMkU3O30KCS5zdDh7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojQ0RENERBO30KCS5zdDl7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojQjNCQ0M3O30KCS5zdDEwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzlEQUFCNzt9Cgkuc3QxMXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiM4Njk4QTg7fQoJLnN0MTJ7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI1NWR0lEXzJfKTt9Cgkuc3QxM3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfM18pO30KCS5zdDE0e2ZpbGw6IzFGNjNFQzt9Cgkuc3QxNXtmaWxsOiMyRDJEMkQ7fQoJLnN0MTZ7ZmlsbDpub25lO3N0cm9rZTojRTBFNEU5O3N0cm9rZS13aWR0aDowLjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTd7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI1NWR0lEXzRfKTt9Cgkuc3QxOHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNV8pO30KCS5zdDE5e2ZpbGw6bm9uZTtzdHJva2U6IzY3NzM4MDtzdHJva2Utd2lkdGg6MC41O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDIwe2ZpbGw6bm9uZTtzdHJva2U6dXJsKCNTVkdJRF82Xyk7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MjF7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI1NWR0lEXzdfKTt9Cgkuc3QyMntmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfOF8pO30KCS5zdDIze2ZpbGw6I0ZGRkZGRjt9Cgkuc3QyNHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiMyRDJEMkQ7fQoJLnN0MjV7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTBfKTt9Cgkuc3QyNntjbGlwLXBhdGg6dXJsKCNTVkdJRF8xMl8pO30KCS5zdDI3e2ZpbGw6dXJsKCNTVkdJRF8xM18pO30KCS5zdDI4e2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6dXJsKCNTVkdJRF8xNF8pO30KCS5zdDI5e2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6dXJsKCNTVkdJRF8xNV8pO30KCS5zdDMwe2NsaXAtcGF0aDp1cmwoI1NWR0lEXzE3Xyk7fQoJLnN0MzF7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTlfKTt9Cgkuc3QzMntmaWxsOnVybCgjU1ZHSURfMjBfKTt9Cgkuc3QzM3tmaWxsOm5vbmU7c3Ryb2tlOnVybCgjU1ZHSURfMjFfKTtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QzNHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfMjJfKTt9Cgkuc3QzNXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfMjNfKTt9Cgkuc3QzNntjbGlwLXBhdGg6dXJsKCNTVkdJRF8yNV8pO30KCS5zdDM3e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzI3Xyk7fQoJLnN0Mzh7ZmlsbDp1cmwoI1NWR0lEXzI4Xyk7fQoJLnN0Mzl7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMzBfKTt9Cgkuc3Q0MHtjbGlwLXBhdGg6dXJsKCNTVkdJRF8zMl8pO30KCS5zdDQxe2ZpbGw6dXJsKCNTVkdJRF8zM18pO30KCS5zdDQye2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzEyNkVGNjt9Cgkuc3Q0M3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNGRkZGRkY7fQoJLnN0NDR7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMzVfKTt9Cgkuc3Q0NXtjbGlwLXBhdGg6dXJsKCNTVkdJRF8zN18pO30KCS5zdDQ2e2ZpbGw6dXJsKCNTVkdJRF8zOF8pO30KCS5zdDQ3e2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzlEQTFBNTt9Cgkuc3Q0OHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfMzlfKTt9Cgkuc3Q0OXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDBfKTt9Cgkuc3Q1MHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDFfKTt9Cgkuc3Q1MXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDJfKTt9Cgkuc3Q1MntmaWxsOm5vbmU7c3Ryb2tlOnVybCgjU1ZHSURfNDNfKTtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Q1M3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOm5vbmU7c3Ryb2tlOiNFMEU0RTk7c3Ryb2tlLXdpZHRoOjAuNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Q1NHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDRfKTt9Cgkuc3Q1NXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDVfKTt9Cgkuc3Q1NntmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDZfKTt9Cgkuc3Q1N3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDdfKTt9Cgkuc3Q1OHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDhfKTt9Cgkuc3Q1OXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNDlfKTt9Cgkuc3Q2MHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNTBfKTt9Cgkuc3Q2MXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNTFfKTt9Cgkuc3Q2MntmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNTJfKTt9Cgkuc3Q2M3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfNTNfKTt9Cgkuc3Q2NHtjbGlwLXBhdGg6dXJsKCNTVkdJRF81NV8pO30KCS5zdDY1e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzU3Xyk7fQoJLnN0NjZ7ZmlsbDp1cmwoI1NWR0lEXzU4Xyk7fQoJLnN0Njd7Y2xpcC1wYXRoOnVybCgjU1ZHSURfNjBfKTt9Cgkuc3Q2OHtjbGlwLXBhdGg6dXJsKCNTVkdJRF82Ml8pO30KCS5zdDY5e2ZpbGw6dXJsKCNTVkdJRF82M18pO30KCS5zdDcwe2ZpbGw6bm9uZTtzdHJva2U6dXJsKCNTVkdJRF82NF8pO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDcxe2NsaXAtcGF0aDp1cmwoI1NWR0lEXzY2Xyk7fQoJLnN0NzJ7Y2xpcC1wYXRoOnVybCgjU1ZHSURfNjhfKTt9Cgkuc3Q3M3tmaWxsOnVybCgjU1ZHSURfNjlfKTt9Cgkuc3Q3NHtjbGlwLXBhdGg6dXJsKCNTVkdJRF83MV8pO30KCS5zdDc1e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzczXyk7fQoJLnN0NzZ7ZmlsbDp1cmwoI1NWR0lEXzc0Xyk7fQoJLnN0Nzd7Y2xpcC1wYXRoOnVybCgjU1ZHSURfNzZfKTt9Cgkuc3Q3OHtjbGlwLXBhdGg6dXJsKCNTVkdJRF83OF8pO30KCS5zdDc5e2ZpbGw6dXJsKCNTVkdJRF83OV8pO30KCS5zdDgwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6dXJsKCNTVkdJRF84MF8pO30KCS5zdDgxe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6dXJsKCNTVkdJRF84MV8pO30KCS5zdDgye2NsaXAtcGF0aDp1cmwoI1NWR0lEXzgzXyk7fQoJLnN0ODN7Y2xpcC1wYXRoOnVybCgjU1ZHSURfODVfKTt9Cgkuc3Q4NHtmaWxsOnVybCgjU1ZHSURfODZfKTt9Cgkuc3Q4NXtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfODdfKTt9Cgkuc3Q4NntmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOnVybCgjU1ZHSURfODhfKTt9Cgkuc3Q4N3tjbGlwLXBhdGg6dXJsKCNTVkdJRF85MF8pO30KCS5zdDg4e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzkyXyk7fQoJLnN0ODl7ZmlsbDp1cmwoI1NWR0lEXzkzXyk7fQoJLnN0OTB7ZmlsbDpub25lO3N0cm9rZTp1cmwoI1NWR0lEXzk0Xyk7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0OTF7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI1NWR0lEXzk1Xyk7fQoJLnN0OTJ7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDp1cmwoI1NWR0lEXzk2Xyk7fQoJLnN0OTN7Y2xpcC1wYXRoOnVybCgjU1ZHSURfOThfKTt9Cgkuc3Q5NHtjbGlwLXBhdGg6dXJsKCNTVkdJRF8xMDBfKTt9Cgkuc3Q5NXtmaWxsOnVybCgjU1ZHSURfMTAxXyk7fQoJLnN0OTZ7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTAzXyk7fQoJLnN0OTd7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMTA1Xyk7fQoJLnN0OTh7ZmlsbDp1cmwoI1NWR0lEXzEwNl8pO30KCS5zdDk5e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzEwOF8pO30KCS5zdDEwMHtjbGlwLXBhdGg6dXJsKCNTVkdJRF8xMTBfKTt9Cgkuc3QxMDF7ZmlsbDp1cmwoI1NWR0lEXzExMV8pO30KCS5zdDEwMntmaWxsOiNGRkZGRkY7c3Ryb2tlOiNCM0JDQzc7c3Ryb2tlLXdpZHRoOjAuMjc1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDEwM3tjbGlwLXBhdGg6dXJsKCNTVkdJRF8xMTNfKTt9Cgkuc3QxMDR7ZmlsbDojRkREMTM4O30KCS5zdDEwNXtmaWxsOiNGQ0E2MkY7fQoJLnN0MTA2e2ZpbGw6I0ZCNzkyNzt9Cgkuc3QxMDd7ZmlsbDojRjQ0QjIyO30KCS5zdDEwOHtmaWxsOiNEODE5MTU7fQoJLnN0MTA5e2ZpbGw6IzJEMkQyRDtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MC4zMzU0O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDExMHtmaWxsOm5vbmU7c3Ryb2tlOiM2NTcyN0Y7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTExe2ZpbGw6bm9uZTtzdHJva2U6IzY1NzI3RjtzdHJva2Utd2lkdGg6MC43NTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxMTJ7ZmlsbDp1cmwoI1NWR0lEXzExNF8pO30KCS5zdDExM3tmaWxsOiNEMDZDNTA7fQoJLnN0MTE0e2ZpbGw6IzJEMkQyRDtzdHJva2U6I0IzQkNDNztzdHJva2Utd2lkdGg6MC4yNzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTE1e29wYWNpdHk6MC4yO30KCS5zdDExNntmaWxsOm5vbmU7c3Ryb2tlOiM2NzczODA7c3Ryb2tlLXdpZHRoOjAuMzU2NDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxMTd7ZmlsbDpub25lO3N0cm9rZTojNjc3MzgwO3N0cm9rZS13aWR0aDowLjM1NjQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheToxLjAyMTIsMS4wMjEyO30KCS5zdDExOHtmaWxsOm5vbmU7c3Ryb2tlOiM2NzczODA7c3Ryb2tlLXdpZHRoOjAuMzU2NDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjEuMDIwNSwxLjAyMDU7fQoJLnN0MTE5e29wYWNpdHk6MC4yO2ZpbGw6bm9uZTt9Cgkuc3QxMjB7ZmlsbDpub25lO3N0cm9rZTojNjc3MzgwO3N0cm9rZS13aWR0aDowLjM2ODk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTIxe2ZpbGw6bm9uZTtzdHJva2U6IzY3NzM4MDtzdHJva2Utd2lkdGg6MC4zNjg5O3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6MS4wNTA5LDEuMDUwOTt9Cgkuc3QxMjJ7b3BhY2l0eTowLjM7ZmlsbDojMUY2M0VDO30KCS5zdDEyM3tmaWxsOiMyRDJEMkQ7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjAuMzE2MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxMjR7ZmlsbDojRkZGRkZGO3N0cm9rZTojQjNCQ0M3O3N0cm9rZS13aWR0aDowLjMxNjI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTI1e2NsaXAtcGF0aDp1cmwoI1NWR0lEXzExOF8pO30KCS5zdDEyNntmaWxsOnVybCgjU1ZHSURfMTE5Xyk7fQoJLnN0MTI3e2ZpbGw6bm9uZTtzdHJva2U6I0RGRTJFNztzdHJva2Utd2lkdGg6MC43NTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxMjh7ZmlsbDojOURBMUE1O3N0cm9rZTojRkZGRkZGO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDEyOXtmaWxsOnVybCgjU1ZHSURfMTIwXyk7fQoJLnN0MTMwe2ZpbGw6bm9uZTtzdHJva2U6IzY3NzM4MDtzdHJva2Utd2lkdGg6MC43NTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxMzF7b3BhY2l0eTowLjQ7fQoJLnN0MTMye2NsaXAtcGF0aDp1cmwoI1NWR0lEXzEyMl8pO30KCS5zdDEzM3tjbGlwLXBhdGg6dXJsKCNTVkdJRF8xMjRfKTt9Cgkuc3QxMzR7ZmlsbDp1cmwoI1NWR0lEXzEyNV8pO30KCS5zdDEzNXtmaWxsOm5vbmU7c3Ryb2tlOiM4MzkyQTM7c3Ryb2tlLXdpZHRoOjAuMzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTM2e2ZpbGw6bm9uZTtzdHJva2U6IzgzOTJBMztzdHJva2Utd2lkdGg6MC4zNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjAuOTk1MSwwLjk5NTE7fQoJLnN0MTM3e2ZpbGw6bm9uZTtzdHJva2U6IzgzOTJBMztzdHJva2Utd2lkdGg6MC4zNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjEuMDA0LDEuMDA0O30KCS5zdDEzOHtmaWxsOm5vbmU7c3Ryb2tlOnVybCgjU1ZHSURfMTI2Xyk7c3Ryb2tlLXdpZHRoOjEuNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxMzl7ZmlsbDp1cmwoI1NWR0lEXzEyN18pO30KCS5zdDE0MHtmaWxsOm5vbmU7c3Ryb2tlOiNEREUwRTQ7c3Ryb2tlLXdpZHRoOjAuMzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTQxe2ZpbGw6IzJEMkQyRDtzdHJva2U6I0E5QjNCRTtzdHJva2Utd2lkdGg6MC4yNzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTQye2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6IzEyNkVGNDt9Cgkuc3QxNDN7ZmlsbDojRkZGRkZGO3N0cm9rZTojQjFCQUM0O3N0cm9rZS13aWR0aDowLjI3NTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxNDR7ZmlsbDojQ0U2QzUwO30KCS5zdDE0NXtmaWxsOiM1QjVCNUI7fQoJLnN0MTQ2e2ZpbGw6IzgzOTJBMzt9Cgkuc3QxNDd7ZmlsbDpub25lO3N0cm9rZTp1cmwoI1NWR0lEXzEyOF8pO3N0cm9rZS13aWR0aDoxLjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTQ4e2ZpbGw6dXJsKCNTVkdJRF8xMjlfKTt9Cgkuc3QxNDl7ZmlsbDpub25lO3N0cm9rZTojQjVCREM0O3N0cm9rZS13aWR0aDowLjc7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTUwe29wYWNpdHk6MC42O2ZpbGw6bm9uZTtzdHJva2U6Izc4ODM4RTtzdHJva2Utd2lkdGg6MC4zNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxNTF7b3BhY2l0eTowLjI7ZmlsbDpub25lO3N0cm9rZTojODM5MkEzO3N0cm9rZS13aWR0aDowLjM1O3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6MSwxO30KCS5zdDE1MntmaWxsOm5vbmU7c3Ryb2tlOiNEREUwRTQ7c3Ryb2tlLXdpZHRoOjAuNzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTUze2ZpbGw6bm9uZTtzdHJva2U6IzgzOTJBMztzdHJva2Utd2lkdGg6MC41O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDE1NHtvcGFjaXR5OjAuMjtmaWxsOm5vbmU7c3Ryb2tlOiM2NzczODA7c3Ryb2tlLXdpZHRoOjAuMzU2NDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2UtZGFzaGFycmF5OjEuMDE4MiwxLjAxODI7fQoJLnN0MTU1e2ZpbGw6bm9uZTtzdHJva2U6I0RERTBFNDtzdHJva2Utd2lkdGg6MC43NjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTU2e2ZpbGw6dXJsKCNTVkdJRF8xMzBfKTt9Cgkuc3QxNTd7ZmlsbDp1cmwoI1NWR0lEXzEzMV8pO30KCS5zdDE1OHtmaWxsOiNCMUJBQzQ7fQoJLnN0MTU5e2ZpbGw6I0NCRDFEODt9Cgkuc3QxNjB7ZmlsbDojMEIxQjJCO30KCS5zdDE2MXtmaWxsOiM5MUQxMTk7fQoJLnN0MTYye29wYWNpdHk6MC43O30KCS5zdDE2M3tmaWxsOiNGRkZGRkY7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjAuNDQxODtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxNjR7ZmlsbDpub25lO3N0cm9rZTojOTM5Q0FBO3N0cm9rZS13aWR0aDowLjIyMDk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTY1e2ZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6My4wOTI0O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDE2NntmaWxsOnVybCgjU1ZHSURfMTMyXyk7fQoJLnN0MTY3e2ZpbGw6bm9uZTtzdHJva2U6dXJsKCNTVkdJRF8xMzNfKTtzdHJva2Utd2lkdGg6MS43MTQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTY4e2ZpbGw6dXJsKCNTVkdJRF8xMzRfKTt9Cgkuc3QxNjl7ZmlsbDp1cmwoI1NWR0lEXzEzNV8pO30KCS5zdDE3MHtmaWxsOnVybCgjU1ZHSURfMTM2Xyk7fQoJLnN0MTcxe2ZpbGw6dXJsKCNTVkdJRF8xMzdfKTt9Cgkuc3QxNzJ7ZmlsbDp1cmwoI1NWR0lEXzEzOF8pO30KCS5zdDE3M3tmaWxsOnVybCgjU1ZHSURfMTM5Xyk7fQoJLnN0MTc0e2ZpbGw6dXJsKCNTVkdJRF8xNDBfKTt9Cgkuc3QxNzV7ZmlsbDp1cmwoI1NWR0lEXzE0MV8pO30KCS5zdDE3NntmaWxsOnVybCgjU1ZHSURfMTQyXyk7fQoJLnN0MTc3e2ZpbGw6dXJsKCNTVkdJRF8xNDNfKTt9Cgkuc3QxNzh7ZmlsbDp1cmwoI1NWR0lEXzE0NF8pO30KCS5zdDE3OXtmaWxsOm5vbmU7c3Ryb2tlOiMxRjYzRUM7c3Ryb2tlLXdpZHRoOjQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTgwe2ZpbGw6bm9uZTtzdHJva2U6IzBCMUIyQjtzdHJva2Utd2lkdGg6NDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxODF7ZmlsbDpub25lO3N0cm9rZTojNjc3MzgwO3N0cm9rZS13aWR0aDowLjM5ODk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTgye2ZpbGw6bm9uZTtzdHJva2U6IzY3NzM4MDtzdHJva2Utd2lkdGg6MC4zOTg5O3N0cm9rZS1taXRlcmxpbWl0OjEwO3N0cm9rZS1kYXNoYXJyYXk6MS4xNCwxLjE0O30KCS5zdDE4M3tmaWxsOiMyNTdBRjE7fQoJLnN0MTg0e29wYWNpdHk6MC4zO2ZpbGw6I0ZGRkZGRjt9Cgkuc3QxODV7ZmlsbDpub25lO3N0cm9rZTojOThBNUIyO3N0cm9rZS13aWR0aDo0O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDE4NntmaWxsOm5vbmU7c3Ryb2tlOiM2NTcyN0Y7c3Ryb2tlLXdpZHRoOjAuMzk4OTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxODd7ZmlsbDpub25lO3N0cm9rZTojNjU3MjdGO3N0cm9rZS13aWR0aDowLjM5ODk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLWRhc2hhcnJheToxLjE0LDEuMTQ7fQoJLnN0MTg4e2ZpbGw6bm9uZTtzdHJva2U6I0REREZFNDtzdHJva2Utd2lkdGg6MC43NTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3QxODl7ZmlsbDojOUE5RUEyO30KCS5zdDE5MHtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiMzMjY3QUM7fQoJLnN0MTkxe2ZpbGw6I0ZGRkZGRjtzdHJva2U6I0FGQjhDMztzdHJva2Utd2lkdGg6MC4yNzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MTkye2ZpbGw6I0M1Njk0RTt9Cgkuc3QxOTN7ZmlsbDojODE5MkEyO30KCS5zdDE5NHtmaWxsOiMyRDJEMkQ7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjAuNjMxNztzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxnIGlkPSLlm77lsYJfMiI+CjwvZz4KPGcgaWQ9IuWbvuWxgl8xIj4KCTxwYXRoIGNsYXNzPSJzdDE5NCIgZD0iTTI0LjUxLDI4LjUxSDUuNDljLTIuMjEsMC00LTEuNzktNC00VjUuNDljMC0yLjIxLDEuNzktNCw0LTRoMTkuMDNjMi4yMSwwLDQsMS43OSw0LDR2MTkuMDMKCQlDMjguNTEsMjYuNzIsMjYuNzIsMjguNTEsMjQuNTEsMjguNTF6Ii8+Cgk8Zz4KCQk8Zz4KCQkJPGc+CgkJCQk8Zz4KCQkJCQk8cGF0aCBjbGFzcz0ic3QyMyIgZD0iTTE1LjQ3LDcuMWwtMS4zLDEuODVjLTAuMiwwLjI5LTAuNTQsMC40Ny0wLjksMC40N2gtNy4xVjcuMDlDNi4xNiw3LjEsMTUuNDcsNy4xLDE1LjQ3LDcuMXoiLz4KCQkJCQk8cG9seWdvbiBjbGFzcz0ic3QyMyIgcG9pbnRzPSIyNC4zLDcuMSAxMy4xNCwyMi45MSA1LjcsMjIuOTEgMTYuODYsNy4xIAkJCQkJIi8+CgkJCQkJPHBhdGggY2xhc3M9InN0MjMiIGQ9Ik0xNC41MywyMi45MWwxLjMxLTEuODZjMC4yLTAuMjksMC41NC0wLjQ3LDAuOS0wLjQ3aDcuMDl2Mi4zM0gxNC41M3oiLz4KCQkJCTwvZz4KCQkJPC9nPgoJCTwvZz4KCTwvZz4KPC9nPgo8L3N2Zz4K',
    };
    /* brand-icons:end */

    const BRANDS = [
      { art: 'deepseek', test: /deepseek/i, label: 'DeepSeek', letter: 'DS', color: '#4d6bfe' },
      { art: 'doubao', test: /doubao|豆包/i, label: '豆包', letter: 'D', color: '#3b9bf0' },
      { art: 'glm', test: /glm|chatglm|zhipu|智谱/i, label: 'GLM', letter: 'Z', color: '#405cf5' },
      { art: 'kimi', test: /kimi|moonshot/i, label: 'Kimi', letter: 'K', color: '#111827' },
      { art: 'mimo', test: /mimo|小米|xiaomi/i, label: 'MiMo', letter: 'Mi', color: '#ff6a00' },
      { art: 'minimax', test: /minimax|abab/i, label: 'MiniMax', letter: 'M', color: '#f2502a' },
      { art: 'qwen', test: /qwen|qwq|tongyi|通义/i, label: 'Qwen', letter: 'Q', color: '#615ced' },
      { art: 'yuanbao', test: /yuanbao|元宝/i, label: '元宝', letter: 'Y', color: '#00cc70' },
      { art: 'perplexity', test: /perplexity|pplx/i, label: 'Perplexity', letter: 'P', color: '#22b8cd' },
      { art: 'zai', test: /(^|[^a-z])z\.?ai([^a-z]|$)/i, label: 'Z.ai', letter: 'Z', color: '#111827' },
      { art: '', test: /hunyuan|混元/i, label: '混元', letter: 'H', color: '#0d9488' },
      { art: '', test: /ernie|文心/i, label: '文心', letter: 'E', color: '#2563eb' }
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
      const art = (brand.art && BRAND_ART[brand.art]) || BRAND_ART['model-mapping'] || '';
      const style = { width: size + 'px', height: size + 'px' };
      if (art) {
        style.backgroundImage = 'url("' + art + '")';
      } else {
        style.fontSize = Math.max(8, Math.round(size * 0.46)) + 'px';
        style['--mmc-glyph-color'] = brand.color;
      }
      return h(
        'span',
        {
          className: cls('mmc-glyph', art ? 'mmc-glyph--art' : ''),
          title: String(model || ''),
          'aria-hidden': 'true',
          style
        },
        art ? null : brand.letter
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

    /* markdown:start ---------------------------------------------------- *
     * A deliberately small, dependency-free Markdown renderer.
     *
     * Everything becomes React elements, so raw HTML in model output is
     * always displayed as text (no innerHTML / dangerouslySetInnerHTML).
     * Links and images are limited to http(s) (and mailto for links).
     * -------------------------------------------------------------------- */
    const MD_MAX_LENGTH = 120000;
    const MD_ESCAPABLE = /[\\`*_{}\[\]()#+\-.!>~|]/;
    const MD_FENCE = /^( {0,3})(`{3,}|~{3,})[ \t]*([^`~]*)$/;
    const MD_HR = /^ {0,3}(?:([-*_])[ \t]*)(?:\1[ \t]*){2,}$/;
    const MD_HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;
    const MD_SETEXT = /^ {0,3}(=+|-+)[ \t]*$/;
    const MD_QUOTE = /^ {0,3}>[ \t]?(.*)$/;
    const MD_BULLET = /^( *)([-*+]|\d{1,9}[.)])[ \t]+([\s\S]*)$/;
    const MD_URL = /^https?:\/\/[^\s<>"'\u2018-\u201f\u3000-\u303f\uff01-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65]+/;

    function mdSafeUrl(url, image) {
      const value = String(url == null ? '' : url).trim();
      if (!value) return '';
      if (image) return /^https?:\/\//i.test(value) ? value : '';
      return /^(?:https?:|mailto:)/i.test(value) ? value : '';
    }

    function mdPlain(src) {
      return String(src == null ? '' : src)
        .replace(/^[ \t]{0,3}(?:`{3,}|~{3,})[^\n]*$/gm, ' ')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^[ \t]{0,3}(?:#{1,6}|>|[-*+]|\d{1,9}[.)])[ \t]+/gm, '')
        .replace(/(\*\*|__)([\s\S]*?)\1/g, '$2')
        .replace(/~~([\s\S]*?)~~/g, '$1')
        .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function mdLeadingSpaces(line) {
      let n = 0;
      while (n < line.length && line.charCodeAt(n) === 32) n += 1;
      return n;
    }

    function mdFenceOf(line) {
      const match = MD_FENCE.exec(line);
      if (!match) return null;
      return {
        indent: match[1].length,
        marker: match[2][0],
        len: match[2].length,
        info: (match[3] || '').trim().split(/\s+/)[0] || ''
      };
    }

    function mdIsFenceClose(line, marker, len) {
      const match = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line);
      return Boolean(match) && match[1][0] === marker && match[1].length >= len;
    }

    function mdHeadingOf(line) {
      const match = MD_HEADING.exec(line);
      if (!match) return null;
      return {
        level: match[1].length,
        text: String(match[2] || '').replace(/[ \t]+#+[ \t]*$/, '').trim()
      };
    }

    function mdListItemOf(line) {
      const match = MD_BULLET.exec(line);
      if (!match) return null;
      const marker = match[2];
      const ordered = /^\d/.test(marker);
      return {
        indent: match[1].length,
        marker,
        ordered,
        start: ordered ? parseInt(marker, 10) || 1 : 1,
        text: match[3]
      };
    }

    function mdSplitRow(line) {
      let row = String(line).trim();
      if (row.startsWith('|')) row = row.slice(1);
      if (row.endsWith('|') && !row.endsWith('\\|')) row = row.slice(0, -1);
      const cells = [];
      let cell = '';
      let inCode = false;
      for (let i = 0; i < row.length; i += 1) {
        const ch = row[i];
        if (ch === '\\' && row[i + 1] === '|') {
          cell += '|';
          i += 1;
          continue;
        }
        if (ch === '`') inCode = !inCode;
        if (ch === '|' && !inCode) {
          cells.push(cell.trim());
          cell = '';
          continue;
        }
        cell += ch;
      }
      cells.push(cell.trim());
      return cells;
    }

    function mdTableAlign(line) {
      if (!line || line.indexOf('|') < 0) return null;
      const cells = mdSplitRow(line);
      if (!cells.length) return null;
      const align = [];
      for (const cell of cells) {
        const match = /^(:?)-+(:?)$/.exec(cell.replace(/\s+/g, ''));
        if (!match) return null;
        align.push(match[1] && match[2] ? 'center' : match[2] ? 'right' : match[1] ? 'left' : null);
      }
      return align;
    }

    function mdIsBlockStart(line) {
      if (!line) return false;
      if (mdFenceOf(line) || mdHeadingOf(line) || MD_HR.test(line) || MD_QUOTE.test(line)) return true;
      if (MD_BULLET.test(line) || /^ {4,}\S/.test(line)) return true;
      return line.trimStart().startsWith('|');
    }

    function mdParseInline(src) {
      const text = String(src == null ? '' : src);
      const nodes = [];
      let buffer = '';
      let i = 0;

      const flush = () => {
        if (buffer) {
          nodes.push(buffer);
          buffer = '';
        }
      };
      const push = (node) => {
        flush();
        nodes.push(node);
      };

      while (i < text.length) {
        const ch = text[i];

        if (ch === '\n') {
          if (/ {2,}$/.test(buffer)) buffer = buffer.replace(/ {2,}$/, '');
          push({ type: 'br' });
          i += 1;
          continue;
        }

        if (ch === '\\') {
          const next = text[i + 1];
          if (next === '\n') {
            push({ type: 'br' });
            i += 2;
            continue;
          }
          if (next && MD_ESCAPABLE.test(next)) {
            buffer += next;
            i += 2;
            continue;
          }
          buffer += ch;
          i += 1;
          continue;
        }

        if (ch === '`') {
          let run = 1;
          while (text[i + run] === '`') run += 1;
          const close = text.indexOf('`'.repeat(run), i + run);
          if (close > i) {
            let code = text.slice(i + run, close).replace(/\n/g, ' ');
            if (code.length > 2 && code.startsWith(' ') && code.endsWith(' ') && code.trim() !== '') {
              code = code.slice(1, -1);
            }
            push({ type: 'code', text: code });
            i = close + run;
            continue;
          }
        }

        if (ch === '!' && text[i + 1] === '[') {
          const image = mdLinkAt(text, i + 1);
          if (image) {
            const src = mdSafeUrl(image.url, true);
            if (src) push({ type: 'image', src, alt: image.text });
            else if (image.text) buffer += image.text;
            i = image.end;
            continue;
          }
        }

        if (ch === '[') {
          const link = mdLinkAt(text, i);
          if (link) {
            const href = mdSafeUrl(link.url, false);
            if (href) {
              push({
                type: 'link',
                href,
                title: link.title,
                nodes: mdParseInline(link.text)
              });
            } else {
              buffer += link.text;
            }
            i = link.end;
            continue;
          }
        }

        if (ch === '<') {
          const auto = /^<(https?:\/\/[^\s<>]+|mailto:[^\s<>]+)>/.exec(text.slice(i));
          if (auto) {
            const href = mdSafeUrl(auto[1], false);
            if (href) push({ type: 'link', href, nodes: [auto[1]] });
            else buffer += auto[0];
            i += auto[0].length;
            continue;
          }
        }

        if (ch === '*' || ch === '_') {
          const triple = text.startsWith(ch.repeat(3), i) && text[i + 3] && !/\s/.test(text[i + 3]);
          const double = text.startsWith(ch.repeat(2), i) && text[i + 2] && !/\s/.test(text[i + 2]);
          const single = text[i + 1] && !/[\s*_]/.test(text[i + 1]);
          const wordBefore = i > 0 && /[A-Za-z0-9]/.test(text[i - 1]);

          if (ch === '_' && wordBefore) {
            buffer += ch;
            i += 1;
            continue;
          }

          if (triple) {
            const close = mdFindDelim(text, i + 3, ch.repeat(3));
            if (close > i) {
              push({ type: 'em', nodes: [{ type: 'strong', nodes: mdParseInline(text.slice(i + 3, close)) }] });
              i = close + 3;
              continue;
            }
          }
          if (double) {
            const close = mdFindDelim(text, i + 2, ch.repeat(2));
            if (close > i) {
              push({ type: 'strong', nodes: mdParseInline(text.slice(i + 2, close)) });
              i = close + 2;
              continue;
            }
          }
          if (single) {
            const close = mdFindDelim(text, i + 1, ch);
            if (close > i) {
              push({ type: 'em', nodes: mdParseInline(text.slice(i + 1, close)) });
              i = close + 1;
              continue;
            }
          }
        }

        if (ch === '~' && text[i + 1] === '~' && text[i + 2] && !/\s/.test(text[i + 2])) {
          const close = mdFindDelim(text, i + 2, '~~');
          if (close > i) {
            push({ type: 'del', nodes: mdParseInline(text.slice(i + 2, close)) });
            i = close + 2;
            continue;
          }
        }

        if (ch === 'h' && /^https?:\/\//.test(text.slice(i, i + 8))) {
          const before = i > 0 ? text[i - 1] : '';
          const atWord = i === 0 || !/[A-Za-z0-9._~:/?#\[\]@!$&*+,;=%-]/.test(before);
          if (atWord) {
            const match = MD_URL.exec(text.slice(i));
            if (match) {
              const bare = match[0].replace(/[.,;:!?)\]}'"\u3002\uff0c\uff1b\uff1a\uff01\uff1f\u3001\u300d\u300f]+$/, '');
              if (bare.length > 8) {
                push({ type: 'link', href: bare, nodes: [bare] });
                i += bare.length;
                continue;
              }
            }
          }
        }

        buffer += ch;
        i += 1;
      }

      flush();
      return nodes;
    }

    function mdFindDelim(text, from, delim) {
      let index = text.indexOf(delim, from);
      while (index !== -1) {
        const before = text[index - 1];
        const after = text[index + delim.length];
        const valid = index > from && before && !/\s/.test(before)
          && after !== delim[0]
          && before !== delim[0];
        if (valid) return index;
        index = text.indexOf(delim, index + delim.length);
      }
      return -1;
    }

    function mdLinkAt(text, start) {
      if (text[start] !== '[') return null;
      let depth = 0;
      let i = start;
      for (; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === '\\') {
          i += 1;
          continue;
        }
        if (ch === '[') depth += 1;
        else if (ch === ']') {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      if (depth !== 0 || text[i + 1] !== '(') return null;
      const label = text.slice(start + 1, i);
      const dest = mdDestination(text, i + 2);
      if (!dest) return null;
      return { text: label, url: dest.url, title: dest.title, end: dest.end };
    }

    function mdDestination(text, from) {
      let i = from;
      const skip = () => {
        while (i < text.length && /\s/.test(text[i])) i += 1;
      };
      skip();
      let url = '';
      if (text[i] === '<') {
        const close = text.indexOf('>', i + 1);
        if (close === -1) return null;
        url = text.slice(i + 1, close);
        i = close + 1;
      } else {
        const start = i;
        let depth = 0;
        while (i < text.length) {
          const ch = text[i];
          if (ch === '\\') {
            i += 2;
            continue;
          }
          if (ch === '(') depth += 1;
          else if (ch === ')') {
            if (depth === 0) break;
            depth -= 1;
          } else if (/\s/.test(ch)) break;
          i += 1;
        }
        url = text.slice(start, i);
      }
      skip();
      let title = '';
      const quote = text[i];
      if (quote === '"' || quote === "'") {
        const close = text.indexOf(quote, i + 1);
        if (close !== -1) {
          title = text.slice(i + 1, close);
          i = close + 1;
        }
      }
      skip();
      if (text[i] !== ')') return null;
      return { url, title, end: i + 1 };
    }

    function mdParse(text) {
      const source = String(text == null ? '' : text)
        .replace(/\r\n?/g, '\n')
        .replace(/\t/g, '    ');
      return mdParseBlocks(source.split('\n'));
    }

    function mdParseBlocks(lines) {
      const blocks = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        if (/^[ \t]*$/.test(line)) {
          i += 1;
          continue;
        }

        const fence = mdFenceOf(line);
        if (fence) {
          i += 1;
          const body = [];
          while (i < lines.length) {
            if (mdIsFenceClose(lines[i], fence.marker, fence.len)) {
              i += 1;
              break;
            }
            body.push(fence.indent ? lines[i].replace(new RegExp('^ {0,' + fence.indent + '}'), '') : lines[i]);
            i += 1;
          }
          blocks.push({ type: 'code', lang: fence.info, code: body.join('\n') });
          continue;
        }

        const heading = mdHeadingOf(line);
        if (heading) {
          blocks.push({
            type: 'heading',
            level: heading.level,
            nodes: mdParseInline(heading.text)
          });
          i += 1;
          continue;
        }

        if (MD_HR.test(line)) {
          blocks.push({ type: 'hr' });
          i += 1;
          continue;
        }

        if (MD_QUOTE.test(line)) {
          const inner = [];
          while (i < lines.length) {
            const quoted = MD_QUOTE.exec(lines[i]);
            if (quoted) {
              inner.push(quoted[1]);
              i += 1;
              continue;
            }
            if (/^[ \t]*$/.test(lines[i]) && MD_QUOTE.test(lines[i + 1] || '')) {
              inner.push('');
              i += 1;
              continue;
            }
            break;
          }
          blocks.push({ type: 'blockquote', blocks: mdParseBlocks(inner) });
          continue;
        }

        const align = mdTableAlign(lines[i + 1] || '');
        if (line.indexOf('|') >= 0 && align) {
          const head = mdSplitRow(line);
          i += 2;
          const rows = [];
          while (i < lines.length && lines[i].trim() !== '' && lines[i].indexOf('|') >= 0) {
            rows.push(mdSplitRow(lines[i]));
            i += 1;
          }
          blocks.push({
            type: 'table',
            align,
            head: head.map((cell) => mdParseInline(cell)),
            rows: rows.map((row) => row.map((cell) => mdParseInline(cell)))
          });
          continue;
        }

        const setext = i + 1 < lines.length ? MD_SETEXT.exec(lines[i + 1]) : null;
        if (setext && !/^ {4,}/.test(line)) {
          blocks.push({
            type: 'heading',
            level: setext[1][0] === '=' ? 1 : 2,
            nodes: mdParseInline(line.trim())
          });
          i += 2;
          continue;
        }

        if (/^ {4,}/.test(line)) {
          const body = [];
          while (i < lines.length && (/^ {4,}/.test(lines[i]) || /^[ \t]*$/.test(lines[i]))) {
            body.push(lines[i].replace(/^ {4}/, ''));
            i += 1;
          }
          while (body.length && /^[ \t]*$/.test(body[body.length - 1])) body.pop();
          blocks.push({ type: 'code', lang: '', code: body.join('\n') });
          continue;
        }

        const item = mdListItemOf(line);
        if (item) {
          const baseIndent = item.indent;
          const ordered = item.ordered;
          const list = { type: 'list', ordered, start: item.start, tight: true, items: [] };

          while (i < lines.length) {
            const current = mdListItemOf(lines[i]);
            if (!current || current.indent !== baseIndent || current.ordered !== ordered) break;

            const contentIndent = current.indent + current.marker.length + 1;
            const itemLines = [current.text];
            let loose = false;
            i += 1;

            while (i < lines.length) {
              const next = lines[i];
              if (/^[ \t]*$/.test(next)) {
                let j = i + 1;
                while (j < lines.length && /^[ \t]*$/.test(lines[j])) j += 1;
                if (j >= lines.length) {
                  i = j;
                  loose = true;
                  break;
                }
                if (mdLeadingSpaces(lines[j]) > baseIndent) {
                  itemLines.push('');
                  i += 1;
                  loose = true;
                  continue;
                }
                break;
              }
              const indent = mdLeadingSpaces(next);
              if (indent >= contentIndent) {
                itemLines.push(next.slice(contentIndent));
                i += 1;
                continue;
              }
              if (indent > baseIndent) {
                itemLines.push(next.slice(Math.min(indent, contentIndent)));
                i += 1;
                continue;
              }
              if (!mdIsBlockStart(next)) {
                itemLines.push(next);
                i += 1;
                continue;
              }
              break;
            }

            let task = null;
            const taskMatch = /^\[([ xX])\][ \t]+([\s\S]*)$/.exec(itemLines[0]);
            if (taskMatch) {
              task = taskMatch[1].toLowerCase() === 'x';
              itemLines[0] = taskMatch[2];
            }

            list.items.push({
              task,
              tight: !loose && itemLines.indexOf('') === -1,
              blocks: mdParseBlocks(itemLines)
            });
            if (loose || itemLines.indexOf('') !== -1) list.tight = false;

            const gap = i < lines.length && /^[ \t]*$/.test(lines[i]);
            let j = i;
            while (j < lines.length && /^[ \t]*$/.test(lines[j])) j += 1;
            const following = mdListItemOf(lines[j] || '');
            if (following && following.indent === baseIndent && following.ordered === ordered) {
              if (gap) list.tight = false;
              i = j;
              continue;
            }
            i = j;
            break;
          }

          blocks.push(list);
          continue;
        }

        const paragraph = [];
        while (i < lines.length) {
          const line2 = lines[i];
          if (/^[ \t]*$/.test(line2)) break;
          if (paragraph.length > 0 && mdIsBlockStart(line2)) break;
          paragraph.push(line2.replace(/^ {0,3}/, ''));
          i += 1;
        }
        blocks.push({ type: 'paragraph', nodes: mdParseInline(paragraph.join('\n')) });
      }

      return blocks;
    }

    function mdRenderInline(nodes, keyPrefix) {
      return nodes.map((node, index) => {
        const key = keyPrefix + 'i' + index;
        if (typeof node === 'string') return node;
        switch (node.type) {
          case 'br':
            return h('br', { key });
          case 'code':
            return h('code', { key, className: 'mmc-md-code-inline' }, node.text);
          case 'strong':
            return h('strong', { key, className: 'mmc-md-strong' }, mdRenderInline(node.nodes, key));
          case 'em':
            return h('em', { key, className: 'mmc-md-em' }, mdRenderInline(node.nodes, key));
          case 'del':
            return h('del', { key, className: 'mmc-md-del' }, mdRenderInline(node.nodes, key));
          case 'link':
            return h(
              'a',
              {
                key,
                className: 'mmc-md-link',
                href: node.href,
                title: node.title || undefined,
                target: '_blank',
                rel: 'noopener noreferrer'
              },
              mdRenderInline(node.nodes, key)
            );
          case 'image':
            return h('img', {
              key,
              className: 'mmc-md-img',
              src: node.src,
              alt: node.alt || '',
              loading: 'lazy',
              decoding: 'async',
              referrerPolicy: 'no-referrer'
            });
          default:
            return node.value || '';
        }
      });
    }

    function mmcMarkdownCode(props) {
      const code = props.code;
      const lang = props.lang;
      const t = props.t;
      const [state, setState] = useState('idle');
      const timer = useRef(null);

      useEffect(() => {
        return () => {
          if (timer.current) clearTimeout(timer.current);
        };
      }, []);

      const copy = () => {
        copyText(code).then((ok) => {
          setState(ok ? 'copied' : 'failed');
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => setState('idle'), 1600);
        });
      };

      const label = state === 'copied'
        ? t('action.copied')
        : state === 'failed' ? t('notice.copyFailed') : t('action.copy');

      return h(
        'div',
        { className: 'mmc-md-codeblock' },
        h(
          'div',
          { className: 'mmc-md-codebar' },
          h('span', { className: 'mmc-md-codelang' }, lang || 'code'),
          h(
            'button',
            {
              type: 'button',
              className: cls(
                'mmc-md-copy',
                state === 'copied' ? 'mmc-md-copy--done' : '',
                state === 'failed' ? 'mmc-md-copy--error' : ''
              ),
              onClick: copy,
              title: label,
              'aria-live': 'polite'
            },
            label
          )
        ),
        h('pre', { className: 'mmc-md-pre' }, h('code', null, code))
      );
    }

    function mdRenderBlocks(blocks, keyPrefix, t) {
      return blocks.map((block, index) => {
        const key = keyPrefix + 'b' + index;
        switch (block.type) {
          case 'heading':
            return h(
              'div',
              { key, className: 'mmc-md-h mmc-md-h' + block.level },
              mdRenderInline(block.nodes, key)
            );
          case 'code':
            return h(mmcMarkdownCode, { key, t, lang: block.lang, code: block.code });
          case 'hr':
            return h('hr', { key, className: 'mmc-md-hr' });
          case 'blockquote':
            return h('blockquote', { key, className: 'mmc-md-quote' }, mdRenderBlocks(block.blocks, key, t));
          case 'table': {
            const align = block.align || [];
            const columns = block.head.length;
            const cellStyle = (col) => (align[col] ? { textAlign: align[col] } : undefined);
            return h(
              'div',
              { key, className: 'mmc-md-tablewrap' },
              h(
                'table',
                { className: 'mmc-md-table' },
                h(
                  'thead',
                  null,
                  h(
                    'tr',
                    null,
                    block.head.map((cell, col) =>
                      h('th', { key: 'h' + col, style: cellStyle(col) }, mdRenderInline(cell, key + 'h' + col))
                    )
                  )
                ),
                h(
                  'tbody',
                  null,
                  block.rows.map((row, rowIndex) =>
                    h(
                      'tr',
                      { key: 'r' + rowIndex },
                      Array.from({ length: columns }, (_, col) =>
                        h(
                          'td',
                          { key: 'c' + col, style: cellStyle(col) },
                          mdRenderInline(row[col] || [], key + 'r' + rowIndex + 'c' + col)
                        )
                      )
                    )
                  )
                )
              )
            );
          }
          case 'list': {
            const tag = block.ordered ? 'ol' : 'ul';
            const attrs = { key, className: cls('mmc-md-list', block.tight ? 'mmc-md-list--tight' : '') };
            if (block.ordered && block.start !== 1) attrs.start = block.start;
            return h(
              tag,
              attrs,
              block.items.map((item, itemIndex) => {
                const itemKey = key + 'i' + itemIndex;
                const children = item.blocks.map((child, childIndex) => {
                  const childKey = itemKey + 'c' + childIndex;
                  if (child.type === 'paragraph') {
                    return block.tight
                      ? h('span', { key: childKey, className: 'mmc-md-li-line' }, mdRenderInline(child.nodes, childKey))
                      : h('p', { key: childKey, className: 'mmc-md-p' }, mdRenderInline(child.nodes, childKey));
                  }
                  return mdRenderBlocks([child], childKey, t);
                });
                return h(
                  'li',
                  { key: itemKey, className: item.task == null ? undefined : 'mmc-md-li--task' },
                  item.task == null
                    ? null
                    : h(
                        'span',
                        {
                          className: cls('mmc-md-check', item.task ? 'mmc-md-check--on' : ''),
                          role: 'img',
                          'aria-label': item.task ? t('md.taskDone') : t('md.taskTodo')
                        },
                        item.task ? '✓' : ''
                      ),
                  children
                );
              })
            );
          }
          default:
            return h('p', { key, className: 'mmc-md-p' }, mdRenderInline(block.nodes || [], key));
        }
      });
    }

    function Markdown(props) {
      const text = props.text == null ? '' : String(props.text);
      const t = props.t || ((key) => key);
      const blocks = useMemo(() => (text.length > MD_MAX_LENGTH ? null : mdParse(text)), [text]);
      const body = useMemo(() => (blocks ? mdRenderBlocks(blocks, 'md', t) : null), [blocks, t]);

      if (!body) {
        return h('div', { className: cls('mmc-md', 'mmc-md--raw', props.className || '') }, text);
      }
      return h('div', { className: cls('mmc-md', props.className || '') }, body);
    }
    /* markdown:end ------------------------------------------------------ */

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
                ? h(Markdown, { text: response.content, t, className: 'mmc-md--answer' })
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
              h('div', { className: 'mmc-reasoning-body' }, h(Markdown, { text: response.reasoning, t }))
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
                  'aria-pressed': response.model === (active && active.model),
                  title: response.model,
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
        h('div', { className: 'mmc-prompt' }, h(Markdown, { text: group.prompt, t })),
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
        h('div', { className: 'mmc-prompt' }, h(Markdown, { text: pending.prompt, t })),
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
                  h('span', { className: 'mmc-history-item-title' }, mdPlain(group.title || group.prompt)),
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
                      h('span', { className: 'mmc-recent-prompt' }, mdPlain(String(item.prompt || '').slice(0, 200))),
                      h('span', { className: 'mmc-recent-snippet' }, mdPlain(String(item.content || '').slice(0, 400)))
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
.mmc-prompt{margin:8px 0 12px;padding:10px 14px;border-radius:12px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);color:var(--mmc-text);font-size:13px;white-space:normal;word-break:break-word}
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
.mmc-answer-body{margin-top:9px;font-size:13px;line-height:1.65;white-space:normal;word-break:break-word;color:var(--mmc-text)}
.mmc-muted{color:var(--mmc-muted)}
.mmc-badge{display:inline-flex;align-items:center;gap:5px;max-width:100%;padding:1px 8px 1px 2px;border-radius:999px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2);font-size:11px;color:var(--mmc-muted);min-width:0}
.mmc-badge-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px;color:var(--mmc-text);font-weight:550}
.mmc-glyph{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:7px;background:color-mix(in srgb,var(--mmc-glyph-color) 16%,transparent);color:color-mix(in srgb,var(--mmc-glyph-color) 58%,var(--mmc-text));font-weight:700;letter-spacing:-.02em}
.mmc-glyph--art{background-color:transparent;background-image:none;background-position:center;background-repeat:no-repeat;background-size:contain}
/* ---- markdown answers ---- */
.mmc-md{min-width:0;white-space:normal;word-break:break-word;overflow-wrap:anywhere}
.mmc-md .mmc-md-p{margin:0 0 8px}
.mmc-md .mmc-md-h{margin:14px 0 6px;font-weight:650;line-height:1.35;color:var(--mmc-text)}
.mmc-md .mmc-md-h1{font-size:17px}
.mmc-md .mmc-md-h2{font-size:16px}
.mmc-md .mmc-md-h3{font-size:14.5px}
.mmc-md .mmc-md-h4,.mmc-md .mmc-md-h5,.mmc-md .mmc-md-h6{font-size:13.5px}
.mmc-md .mmc-md-list{margin:0 0 8px;padding-left:20px}
.mmc-md .mmc-md-list .mmc-md-list{margin:3px 0 2px}
.mmc-md li{margin:2px 0}
.mmc-md li>.mmc-md-p{margin:0 0 4px}
.mmc-md .mmc-md-li-line{display:inline}
.mmc-md .mmc-md-li--task{list-style:none;position:relative}
.mmc-md .mmc-md-check{display:inline-grid;place-items:center;width:13px;height:13px;margin:0 6px 0 -18px;border-radius:4px;border:1px solid color-mix(in srgb,var(--mmc-muted) 45%,transparent);vertical-align:-2px;font-size:9px;line-height:1;color:var(--mmc-surface)}
.mmc-md .mmc-md-check--on{background:var(--mmc-success);border-color:var(--mmc-success)}
.mmc-md .mmc-md-code-inline{padding:1px 5px;border-radius:5px;border:1px solid color-mix(in srgb,var(--mmc-line) 70%,transparent);background:color-mix(in srgb,var(--mmc-text) 6%,var(--mmc-surface-2));font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em}
.mmc-md .mmc-md-codeblock{margin:9px 0;border-radius:10px;border:1px solid var(--mmc-line);background:color-mix(in srgb,var(--mmc-text) 5%,var(--mmc-surface-2));overflow:hidden}
.mmc-md .mmc-md-codebar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 10px;border-bottom:1px solid color-mix(in srgb,var(--mmc-line) 60%,transparent);font-size:10px;color:var(--mmc-muted)}
.mmc-md .mmc-md-codelang{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.04em;text-transform:lowercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mmc-md .mmc-md-copy{border:none;background:transparent;color:var(--mmc-muted);font-size:10.5px;line-height:1;padding:3px 5px;border-radius:5px;cursor:pointer}
.mmc-md .mmc-md-copy:hover{color:var(--mmc-text);background:color-mix(in srgb,var(--mmc-line) 45%,transparent)}
.mmc-md .mmc-md-copy--done{color:var(--mmc-success)}
.mmc-md .mmc-md-copy--error{color:var(--mmc-error)}
.mmc-md .mmc-md-pre{margin:0;padding:10px 12px;overflow:auto;max-height:360px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.6;tab-size:2}
.mmc-md .mmc-md-pre code{padding:0;border:none;background:none;font:inherit;white-space:pre}
.mmc-md .mmc-md-link{color:var(--mmc-accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--mmc-accent) 35%,transparent)}
.mmc-md .mmc-md-link:hover{border-bottom-color:var(--mmc-accent)}
.mmc-md .mmc-md-img{max-width:100%;height:auto;border-radius:8px;border:1px solid var(--mmc-line);vertical-align:middle}
.mmc-md .mmc-md-quote{margin:8px 0;padding:2px 0 2px 12px;border-left:3px solid color-mix(in srgb,var(--mmc-accent) 45%,var(--mmc-line));color:var(--mmc-muted)}
.mmc-md .mmc-md-quote .mmc-md-p{margin:0 0 6px}
.mmc-md .mmc-md-tablewrap{margin:9px 0;max-width:100%;overflow-x:auto;border:1px solid var(--mmc-line);border-radius:9px}
.mmc-md .mmc-md-table{border-collapse:collapse;width:100%;font-size:12px}
.mmc-md .mmc-md-table th,.mmc-md .mmc-md-table td{padding:5px 10px;border-bottom:1px solid color-mix(in srgb,var(--mmc-line) 65%,transparent);border-right:1px solid color-mix(in srgb,var(--mmc-line) 45%,transparent);vertical-align:top}
.mmc-md .mmc-md-table th:last-child,.mmc-md .mmc-md-table td:last-child{border-right:none}
.mmc-md .mmc-md-table th{background:color-mix(in srgb,var(--mmc-text) 5%,var(--mmc-surface-2));font-weight:600;white-space:nowrap}
.mmc-md .mmc-md-table tr:last-child td{border-bottom:none}
.mmc-md .mmc-md-hr{margin:12px 0;border:none;border-top:1px solid var(--mmc-line)}
.mmc-md .mmc-md-strong{font-weight:650}
.mmc-md>:first-child{margin-top:0}
.mmc-md>:last-child{margin-bottom:0}
.mmc-md--raw{white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.65}
.mmc-errorbox{margin-top:9px;padding:10px 12px;border-radius:10px;border:1px solid color-mix(in srgb,var(--mmc-error) 42%,transparent);background:color-mix(in srgb,var(--mmc-error) 7%,transparent);color:var(--mmc-error)}
.mmc-error-title{font-size:12.5px;font-weight:600}
.mmc-error-msg{margin-top:3px;font-size:11.5px;white-space:pre-wrap;word-break:break-word;opacity:.95}
.mmc-error-details{margin-top:6px;font-size:11px;color:var(--mmc-muted)}
.mmc-error-details summary{cursor:pointer;user-select:none}
.mmc-error-raw{margin-top:4px;padding:6px 8px;border-radius:8px;background:color-mix(in srgb,var(--mmc-error) 6%,transparent);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10.5px;white-space:pre-wrap;word-break:break-word}
.mmc-reasoning{margin-top:9px;padding:10px 12px;border-radius:10px;border:1px solid var(--mmc-line);background:var(--mmc-surface-2)}
.mmc-reasoning-head{font-size:11px;font-weight:600;color:var(--mmc-muted);margin-bottom:4px}
.mmc-reasoning-body{font-size:12px;line-height:1.6;white-space:normal;word-break:break-word;color:var(--mmc-muted);max-height:260px;overflow:auto}
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
