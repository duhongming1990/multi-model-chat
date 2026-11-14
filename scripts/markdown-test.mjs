#!/usr/bin/env node
/**
 * Unit tests for the two browser-only additions in client.js:
 *   1. the dependency-free Markdown renderer, and
 *   2. the brand artwork lookup used by model badges.
 *
 * The Client bundle cannot be imported by Node (it is a browser module), so
 * the tested sections are extracted between their markers and executed with a
 * tiny createElement stub. Rendering is asserted on the element tree; no DOM is
 * created and no browser is required.
 *
 *   node scripts/markdown-test.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(path.join(root, 'client.js'), 'utf8');

function extract(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`markers not found: ${startMarker}`);
  return source.slice(start, end);
}

const markdownSource = extract('/* markdown:start', '/* markdown:end');

function h(type, props, ...children) {
  return { type, props: props || {}, children: children.flat(Infinity) };
}

const md = new Function(
  'h',
  'useState',
  'useMemo',
  'useEffect',
  'useRef',
  'cls',
  'copyText',
  `${markdownSource}
   return { Markdown, mdParse, mdParseInline, mdPlain };`
)(
  h,
  (value) => [typeof value === 'function' ? value() : value, () => {}],
  (factory) => factory(),
  () => {},
  (value) => ({ current: value }),
  (...parts) => parts.filter(Boolean).join(' '),
  async () => true
);

const { Markdown, mdPlain } = md;
const t = (key) => key;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(node) {
  if (node == null || node === false || node === true) return '';
  if (Array.isArray(node)) return node.map(render).join('');
  if (typeof node === 'string' || typeof node === 'number') return escapeHtml(node);
  const { type, props, children } = node;
  if (typeof type === 'function') return render(type({ ...props, children }));
  const attrs = Object.entries(props || {})
    .filter(([key, value]) => key !== 'key' && key !== 'children' && value != null && value !== false)
    .map(([key, value]) => {
      const name = key === 'className' ? 'class' : key;
      const text = key === 'style' && value && typeof value === 'object'
        ? Object.entries(value)
            .map(([prop, val]) => `${prop.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}: ${val}`)
            .join('; ')
        : value;
      return ` ${name}="${escapeHtml(text)}"`;
    })
    .join('');
  if (type === 'img' || type === 'br' || type === 'hr') return `<${type}${attrs}>`;
  return `<${type}${attrs}>${render(children)}</${type}>`;
}

const html = (markdown) => render(h(Markdown, { text: markdown, t }));

let passed = 0;
function check(name, markdown, assertor) {
  const output = html(markdown);
  assertor(output, markdown);
  passed += 1;
}

/* ------------------------------------------------------------------ *
 * Markdown
 * ------------------------------------------------------------------ */

check('heading and paragraph', '## 速度分析\n千兆网卡理论值 125 MB/s。', (out) => {
  assert.match(out, /<div class="mmc-md-h mmc-md-h2">速度分析<\/div>/);
  assert.match(out, /<p class="mmc-md-p">千兆网卡理论值 125 MB\/s。<\/p>/);
});

check('inline styles', '**粗体** 与 *斜体* 和 ~~删除~~ 以及 `code()`', (out) => {
  assert.match(out, /<strong class="mmc-md-strong">粗体<\/strong>/);
  assert.match(out, /<em class="mmc-md-em">斜体<\/em>/);
  assert.match(out, /<del class="mmc-md-del">删除<\/del>/);
  assert.match(out, /<code class="mmc-md-code-inline">code\(\)<\/code>/);
});

check('triple emphasis', '***同时粗斜***', (out) => {
  assert.match(out, /<em class="mmc-md-em"><strong class="mmc-md-strong">同时粗斜<\/strong><\/em>/);
});

check('emphasis around strong', '**a *b* c** 和 *a **b** c*', (out) => {
  assert.match(out, /<strong class="mmc-md-strong">a <em class="mmc-md-em">b<\/em> c<\/strong>/);
  assert.match(out, /<em class="mmc-md-em">a <strong class="mmc-md-strong">b<\/strong> c<\/em>/);
});

check('links, titles and autolinks', '[官网](https://example.com/a?b=1&c=2 "标题") 和 <https://a.io/x> 以及裸链 https://b.io/path，继续', (out) => {
  assert.match(out, /<a class="mmc-md-link" href="https:\/\/example.com\/a\?b=1&amp;c=2" title="标题" target="_blank" rel="noopener noreferrer">官网<\/a>/);
  assert.match(out, /href="https:\/\/a.io\/x"/);
  assert.match(out, /href="https:\/\/b.io\/path"/);
  assert.doesNotMatch(out, /href="https:\/\/b.io\/path，"/);
});

check('autolink after Chinese punctuation', '参考链接：https://example.com/a 和 详见https://b.io/x', (out) => {
  assert.match(out, /href="https:\/\/example.com\/a"/);
  assert.match(out, /href="https:\/\/b.io\/x"/);
});

check('no autolink inside a word', 'xhttps://example.com/a', (out) => {
  assert.doesNotMatch(out, /href=/);
});

check('unsafe links are plain text', '[点我](javascript:alert(1)) ![图](javascript:alert(2))', (out) => {
  assert.doesNotMatch(out, /href="javascript:/);
  assert.doesNotMatch(out, /<img/);
  assert.match(out, /点我/);
});

check('raw html is shown as text', '<script>alert(1)</script><b>bold</b>', (out) => {
  assert.match(out, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(out, /<script>/);
  assert.doesNotMatch(out, /<b>/);
});

check('fenced code keeps markdown verbatim', '```python\ndef f(x):\n    return **x**  # not bold\n```', (out) => {
  assert.match(out, /mmc-md-codeblock/);
  assert.match(out, /<span class="mmc-md-codelang">python<\/span>/);
  assert.match(out, /return \*\*x\*\*  # not bold/);
  assert.doesNotMatch(out, /<strong/);
});

check('backticks inside a longer fence', '````md\n```js\nx\n```\n````', (out) => {
  assert.match(out, /```js/);
  assert.match(out, /<span class="mmc-md-codelang">md<\/span>/);
});

check('unclosed fence still renders', '```text\nline one\nline two\n\nline four', (out) => {
  assert.match(out, /line four/);
  assert.match(out, /<pre class="mmc-md-pre">/);
});

check('unordered nested list', '- 一级\n  - 二级\n  - 另一个二级\n- 第二个一级', (out) => {
  assert.match(out, /<ul class="mmc-md-list mmc-md-list--tight">/);
  assert.equal((out.match(/<ul class="mmc-md-list/g) || []).length, 2, 'nested list should render a second ul');
  assert.match(out, /二级/);
});

check('four-space nested list from real answers', [
  '1.  **历史奠基人：**',
  '    *   **路易·巴斯德:** 被誉为微生物学之父。',
  '        *   否定自然发生说。',
  '        *   建立巴斯德消毒法。',
  '    *   **罗伯特·科赫:** 细菌学奠基人。',
  '2.  **现代权威：**',
  '    - 分子微生物学',
  '    - 病毒学'
].join('\n'), (out) => {
  assert.equal((out.match(/<ul class="mmc-md-list/g) || []).length, 3, 'three nested ul levels');
  assert.match(out, /巴斯德消毒法/);
  assert.match(out, /病毒学/);
  assert.doesNotMatch(out, /mmc-md-pre/, 'nested list must not become an indented code block');
});

check('blockquote contains a list', '> 引用\n> - 一\n> - 二', (out) => {
  assert.match(out, /<blockquote class="mmc-md-quote"><p class="mmc-md-p">引用<\/p><ul class="mmc-md-list/);
  assert.match(out, /<li><span class="mmc-md-li-line">一<\/span><\/li>/);
});

check('ordered list start and loose continuation', '3. 第三\n4. 第四\n\n   补充段落', (out) => {
  assert.match(out, /<ol class="mmc-md-list" start="3">/);
  assert.match(out, /<p class="mmc-md-p">补充段落<\/p>/);
});

check('task list', '- [x] 已完成\n- [ ] 未完成', (out) => {
  assert.match(out, /mmc-md-li--task/);
  assert.match(out, /mmc-md-check--on" role="img" aria-label="md.taskDone">✓/);
  assert.match(out, /aria-label="md.taskTodo"><\/span>/);
});

check('blockquote with inline markdown', '> **注意**\n> 第二行', (out) => {
  assert.match(out, /<blockquote class="mmc-md-quote"><p class="mmc-md-p"><strong class="mmc-md-strong">注意<\/strong><br>第二行<\/p><\/blockquote>/);
});

check('gfm table', '| 模型 | 耗时 |\n|:---|---:|\n| GLM-5.3 | 1.2s |', (out) => {
  assert.match(out, /<table class="mmc-md-table">/);
  assert.match(out, /<th style="text-align: left">模型<\/th>/);
  assert.match(out, /<th style="text-align: right">耗时<\/th>/);
  assert.match(out, /<td style="text-align: left">GLM-5.3<\/td>/);
});

check('table with inline code containing a pipe', '| a | b |\n|---|---|\n| `x|y` | 2 |', (out) => {
  assert.match(out, /<code class="mmc-md-code-inline">x\|y<\/code>/);
});

check('hr', '上\n\n---\n\n下', (out) => {
  assert.match(out, /<hr class="mmc-md-hr">/);
});

check('setext heading', '标题\n===', (out) => {
  assert.match(out, /<div class="mmc-md-h mmc-md-h1">标题<\/div>/);
});

check('escaped stars stay literal', '\\*不是斜体\\*', (out) => {
  assert.match(out, /\*不是斜体\*/);
  assert.doesNotMatch(out, /<em/);
});

check('single newline becomes a break', '第一行\n第二行', (out) => {
  assert.match(out, /第一行<br>第二行/);
});

check('crlf input is normalised', '第一行\r\n第二行', (out) => {
  assert.match(out, /第一行<br>第二行/);
});

check('html entities are escaped', 'a < b & c > d', (out) => {
  assert.match(out, /a &lt; b &amp; c &gt; d/);
});

check('snake_case is not emphasis', '变量 user_name 与 model_id', (out) => {
  assert.doesNotMatch(out, /<em/);
  assert.match(out, /user_name/);
});

check('empty input', '', (out) => {
  assert.match(out, /^<div class="mmc-md"><\/div>$/);
});

check('answer resembling the reported cards', [
  '是的，这个速度基本就是**千兆网卡跑满**的水平。',
  '',
  '- **日志里稳定在约 110–115 MB/s**',
  '- 换算：110 MB/s × 8 ≈ **880 Mbps**',
  '',
  '```text',
  'WARNING: Sum of all thin volume sizes (168.00 GiB)',
  '```',
  '',
  '所以如果两端都是千兆网卡，这个迁移速度没问题；如果是万兆环境，那就明显偏低。'
].join('\n'), (out) => {
  assert.match(out, /<strong class="mmc-md-strong">千兆网卡跑满<\/strong>/);
  assert.match(out, /<ul class="mmc-md-list mmc-md-list--tight">/);
  assert.match(out, /WARNING: Sum of all thin volume sizes/);
  assert.doesNotMatch(out, /\*\*/, 'no leftover ** markers');
  assert.doesNotMatch(out, /```/, 'no leftover fences');
});

check('oversized input falls back to raw text', 'x'.repeat(130000), (out) => {
  assert.match(out, /mmc-md mmc-md--raw/);
  assert.doesNotMatch(out, /mmc-md-p/);
});

/* ------------------------------------------------------------------ *
 * Brand artwork
 * ------------------------------------------------------------------ */

const artSource = extract('/* brand-icons:start */', '/* brand-icons:end */');
const brandsSource = extract('const BRANDS = [', 'function tokenSpeed');
const glyphSource = extract('function ModelGlyph(', 'function ModelBadge(');

const { BRAND_ART, ModelGlyph, brandOf } = new Function(
  'h',
  'cls',
  `${artSource}
   ${brandsSource}
   ${glyphSource}
   return { BRAND_ART, ModelGlyph, brandOf };`
)(
  h,
  (...parts) => parts.filter(Boolean).join(' ')
);

const expectedArt = [
  'deepseek', 'doubao', 'glm', 'kimi', 'mimo', 'minimax',
  'model-mapping', 'perplexity', 'qwen', 'yuanbao', 'zai'
];
assert.deepEqual(Object.keys(BRAND_ART).sort(), expectedArt.slice().sort(), 'embedded icon set');

for (const [key, uri] of Object.entries(BRAND_ART)) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(uri);
  assert.ok(match, `${key}: valid data URI`);
  const bytes = Buffer.from(match[2], 'base64');
  assert.ok(bytes.length > 100, `${key}: non-trivial payload`);
  if (match[1] === 'image/svg+xml') {
    assert.match(bytes.toString('utf8'), /<svg[\s>]/i, `${key}: SVG payload`);
  } else if (match[1] === 'image/webp') {
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', `${key}: WebP payload`);
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', `${key}: WebP payload`);
  } else if (match[1] === 'image/png') {
    assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a', `${key}: PNG payload`);
  } else {
    throw new Error(`${key}: unexpected media type ${match[1]}`);
  }
}
passed += 1;

const samples = {
  'deepseek-v4.1-flash-think-search': 'deepseek',
  'Doubao-pro-thinking': 'doubao',
  'GLM-5.3': 'glm',
  'Kimi-K2.6': 'kimi',
  'MiMo-V2.6-Pro-UltraSpeed': 'mimo',
  'MiniMax-M3': 'minimax',
  'Qwen3-Max': 'qwen',
  'Yuanbao-thinking': 'yuanbao',
  'Perplexity-Sonar': 'perplexity',
  'Zai-Air': 'zai'
};
for (const [model, artKey] of Object.entries(samples)) {
  assert.equal(brandOf(model).art, artKey, `${model}: brand mapping`);
  const glyph = ModelGlyph({ model, size: 16 });
  assert.equal(glyph.props.style.width, '16px');
  assert.ok(
    glyph.props.style.backgroundImage.includes(BRAND_ART[artKey]),
    `${model}: uses ${artKey} artwork`
  );
  assert.equal(glyph.props.style.fontSize, undefined, `${model}: no letter fallback`);
}
const unknown = ModelGlyph({ model: 'some-custom-model', size: 22 });
assert.ok(
  unknown.props.style.backgroundImage.includes(BRAND_ART['model-mapping']),
  'unknown models fall back to the generic model icon'
);
passed += 1;

assert.equal(
  mdPlain('## 结论\n**正常** `x` [链接](https://a)\n```text\nfoo\n```\n- 列表'),
  '结论 正常 x 链接 foo 列表',
  'mdPlain strips block and inline markers'
);
passed += 1;

console.log(`${passed} checks passed`);
