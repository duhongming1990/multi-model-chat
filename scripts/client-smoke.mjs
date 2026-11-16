#!/usr/bin/env node
/**
 * Load client.js the way the browser module system does and run `apply`.
 *
 * This catches module-level mistakes (missing artwork data, a typo in a
 * component factory, a broken registration) without needing a browser. It is
 * a structural smoke test only: it does not render the panel or verify any
 * visual output.
 *
 *   node scripts/client-smoke.mjs
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(path.join(root, 'client.js'), 'utf8');
const PACKAGE = 'dsh-multi-model-chat';

let captured = null;
globalThis.window = {
  __ModuleLoader__: {
    load(registration) {
      captured = registration;
    }
  }
};

const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  useState: (value) => [typeof value === 'function' ? value() : value, () => {}],
  useEffect: () => {},
  useRef: (value) => ({ current: value }),
  useCallback: (fn) => fn,
  useMemo: (factory) => factory()
};

const require = (name) => {
  if (name === 'react') return React;
  throw new Error(`unexpected external module: ${name}`);
};

new Function('window', 'require', source)(globalThis.window, require);
if (!captured) throw new Error('client.js did not register a module factory');
if (captured.id !== PACKAGE) throw new Error(`unexpected module id: ${captured.id}`);

const plugin = captured.factory(require);
if (!plugin || typeof plugin.apply !== 'function') throw new Error('client plugin is missing apply()');

const registrations = [];
const ctx = {
  effect(fn) {
    fn();
  },
  locale: {
    register: () => () => {},
    bind: () => (key) => key
  },
  slots: {
    inject(name, cb) {
      cb();
    },
    register(def, component) {
      registrations.push({ def, component });
      return () => {};
    }
  }
};
plugin.apply(ctx);

const names = registrations.map((entry) => `${entry.def.name}:${entry.def.id || entry.def.key}`);
for (const expected of ['sidebar.panellist:multi-model-chat', 'main:multi-model-chat']) {
  if (!names.includes(expected)) throw new Error(`missing registration: ${expected}`);
}

const sidebar = registrations.find((entry) => entry.def.name === 'sidebar.panellist').component;
const tree = sidebar({ size: 18, active: true });
if (!tree || typeof tree.type !== 'function') throw new Error('sidebar entry did not render');
const icon = tree.type(tree.props);
if (!icon || icon.type !== 'svg') throw new Error('sidebar icon did not render');

console.log(`client smoke test passed (${names.join(', ')})`);
