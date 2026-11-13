# 多模型对话 · @local/multi-model-chat (v1.1)

一次提问，并发调用多个 OpenAI 兼容模型；每一组问答自动保存到本地；每条模型的回答都可以点赞，并提供模型点赞分析统计。

## 功能

- **并发多模型**：同一个问题同时发给多个模型（默认本机 Chat2API），全部返回后保存为一组对话。
- **四种展示样式**（对应参考图 1–4）：
  - `tags` 标签模式：模型名作为标签页，一次看一个回答；
  - `stack` 纵向堆叠：每个模型的回答自上而下排列；
  - `row` 横向排列：卡片横向滚动对比；
  - `cards` 卡片布局：两列卡片网格。
- **每组对话保存**：每次发送都会在 Host 落盘（`groups.json`，原子写入），页面左侧历史记录可回看、搜索、定位、删除。
- **逐条点赞**：每个模型的每条回答都能点赞 / 取消，卡片与历史会即时反映。
- **点赞分析统计**：模型点赞排名（点赞数、点赞率、回答数、平均耗时、失败数）、近 14 天点赞趋势、回答样式分布、最近点赞的回答。
- **Agent 工具**：`multi_model_chat`，与页面共用同一套实现（ask / list / get / like / delete / stats）。

## 页面入口

安装后左侧边栏出现“多模型对话”图标（order 26，在“多模态数据流水线”之后），点击打开主面板。主面板顶部有三个页签：

- **对话**：提问、四种回答样式、逐条点赞、历史记录；
- **点赞统计**：模型点赞排名、趋势、样式分布、最近点赞；
- **设置**：在插件里配置 API 密钥 / API 地址（带“检测”）、同步上游模型、勾选默认模型并保存。

首次安装/启用后请刷新一次浏览器页面，新客户端插件才会加载。

## 配置

两种入口修改同一份配置：

- **插件内“设置”页签**（推荐）：API 密钥（掩码显示、可显示/隐藏、可清除）、API 地址（可直接填 `http://localhost:8080/v1` 这类基础地址，保存时自动补全 `/chat/completions`）、**检测**按钮（实测上游 `/models` 并显示模型数量与耗时）、**同步模型**（按 provider 分组列出上游模型，可搜索/折叠）、每个模型可单独“测试”（真实发一条“你好”并显示耗时或错误）、勾选**默认模型**后保存。
- **插件中心 → 插件 → 多模型对话 → 配置**：同一份 schema 的表单。

在插件内保存会通过 profile 的 config editor 写入 `$DSH_HOME/profiles/<profile>/cordis.patch.yml`（只覆盖本插件这一行），并立即生效。字段如下：

| 字段 | 默认 | 说明 |
|---|---|---|
| `endpoint` | `http://localhost:8080/v1/chat/completions` | OpenAI 兼容 chat/completions 地址 |
| `apiKey` | — | Bearer 令牌（secret，页面只显示是否已配置） |
| `models` | 5 个模型 | 默认参与并发调用的模型（页面可临时增减，最多 12 个） |
| `timeoutMs` | `180000` | 单个模型请求超时 |
| `historyLimit` | `200` | 本地最多保留多少组对话，超出丢最旧的 |
| `dataDir` | 空 | 留空时使用 `$DSH_HOME/storages/multi-model-chat` |

模型目录通过把 `endpoint` 的 `/chat/completions` 换成 `/models` 探测（60 秒缓存），探测失败时回退配置里的模型列表。

## HTTP 路由

同源前缀 `/plugins-local/multi-model-chat`：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 配置概览（不含 apiKey） |
| GET | `/config` | health + 上游模型目录 |
| GET | `/models` | 模型目录 |
| GET | `/groups?limit=&q=&full=1` | 已保存对话组（`full=1` 带完整回答） |
| POST | `/groups` | `{prompt, models, layout}` 并发调用并保存 |
| GET | `/groups/<id>` | 一组对话 |
| DELETE | `/groups/<id>` | 删除一组 |
| POST | `/groups/<id>/like` | `{model, liked?}` 点赞/取消（省略 liked 则切换） |
| POST | `/groups/<id>/retry` | `{model}` 重新生成某模型回答（会清空该条点赞） |
| GET | `/stats` | 点赞分析统计 |
| GET | `/settings` | 当前连接配置 + 上游模型目录（按 provider 分组，不返回真实密钥） |
| POST | `/settings` | `{endpoint?, apiKey?, clearApiKey?, models?}` 保存配置并立即生效 |
| POST | `/probe` | `{endpoint?, apiKey?}` 检测连接；`{model}` 时对该模型做一次真实闲聊测试 |
| POST | `/models/sync` | 强制刷新上游模型目录 |

单个模型失败（例如上游 token 失效）不会让整组失败：该条回答记录 `ok:false` 与错误信息，页面显示“服务器错误，请稍后再试 + 详情”，其余模型照常保存与点赞。

## 统计口径

- “点赞率 = 点赞数 / 成功回答数”：失败的回答（`ok:false`，无法点赞）不计入分母，失败数量单独展示。
- “近 14 天点赞趋势”按点赞发生的那一天（`likedAt`）归日；对话组数与回答数仍按发起提问的那一天归日。
- 统计只覆盖本地当前保留的对话组（`historyLimit` 之外的旧组会被丢弃）。

## 数据

```json
{ "version": 1, "groups": [ { "id", "createdAt", "prompt", "title", "layout", "models", "responses": [ { "model", "ok", "content", "reasoning", "error", "latencyMs", "tokens", "liked", "likedAt" } ], "durationMs" } ] }
```

默认文件：`$DSH_HOME/storages/multi-model-chat/groups.json`。文件损坏时保留为 `groups.json.broken-<时间戳>` 并以空历史启动。写盘为临时文件 + rename 的原子写入，并串行化；写盘失败会让对应请求返回 500（不会假装保存成功）。

## 安全提示

- 路由与页面同源、不额外鉴权（与 profile 中其他本地插件一致）：任何能访问 Web 端口（默认 `10.121.87.5:3080`）的客户端都能读取已保存的提问/回答并删除数据。请只在可信网络开放该端口。
- `apiKey` 是 OpenAI 兼容网关的静态令牌，保存在 profile 的 `cordis.patch.yml`（文件权限 600）与 Config 中，标记为 secret 但并非凭据记录；用插件“设置”页轮换或清除即可。

## 验证

已完成的实测（2026-11-12，profile `web`，Host `http://10.121.87.5:3080`）：

- `node --check index.js client.js`；manifest、`dsh.bundle`/`dsh.client` 声明、locale `meta.title/description`、icon 合法性校验通过。
- `plugin_manager install_bundle` → `application: applied`，bundle 在 profile 中启用。
- `scripts/selftest.mjs` 全部通过：health → 并发创建一组 → 点赞 → 统计 → 重试 → 删除。
- 额外点测：4 模型并发 16.5s（小于各模型耗时之和 37.5s）；Kimi（`Token invalid or expired`）等单模型失败只记 `ok:false`，整组仍保存；点赞切换/显式设置/并发点赞均落盘；`retry` 清空该条点赞；`GET /groups?full=1&q=` 命中提问与回答；404/400/405/413 语义正确；按 `likedAt` 归日的 14 天趋势已用回填数据验证。
- `multi_model_chat` 工具已注册，`list` / `stats` 实跑通过。
- 插件内设置：`GET /settings` 返回掩码密钥与 24 个模型（按 deepseek/qwen/mimo/doubao/yuanbao/glm/kimi/minimax 分组）；`POST /probe` 对基础地址 `http://localhost:8080/v1` 检测通过（12ms 模型目录）并对 Qwen3.7-Max 真实测试通过；`POST /settings` 多次保存默认模型后 `GET /health` 立即反映新默认值，profile patch 中出现本插件的覆盖行；`POST /models/sync` 强制刷新通过。
- 客户端 bundle 由 `/plugins` 200 提供，HMR 图包含 entry；用等价 stub 实跑 factory + `apply`，确认注册 `sidebar.panellist`（id `multi-model-chat`）与 `main`（key `multi-model-chat`）；实际页面刷新后，live Slot 检查确认这两个 occupant 均为 active，现场还完成了一组真实多模型对话（`hi`，卡片布局，GLM-5.1 点赞）并落盘。中英字典各 143 key（含设置页）齐全；四种 layout 与设置页分支存在；仅引用 `--dsw-alias-*` 主题 token；无 `innerHTML` / `eval` / 第三方 Client 包引用。
- 测试数据已清理，`groups.json` 为 `{version:1,groups:[]}`。

未验证（环境限制）：本次会话没有浏览器控制，无法确认四种布局与深色主题的实际渲染效果。另外，安装时已经打开的页面不会自动出现新客户端插件，**刷新一次页面**后由启动图加载即可（HMR 图与 bundle 已就绪，客户端注册逻辑已通过 stub 实跑验证）。

排查：刷新后若左侧仍没有“多模型对话”图标，打开浏览器控制台看是否有该 bundle 的加载错误，并确认「插件中心 → 插件」中 `@local/multi-model-chat` 处于启用状态。

## 目录

```
index.js            Host：配置、存储、并发调用、路由、统计、Agent 工具
client.js           Client：主面板页面、四种样式、点赞、统计、历史
cordis.patch.yml    Bundle patch（含默认配置）
locale/{en,zh}.json 插件中心显示名称与描述
icon.svg            插件图标
scripts/selftest.mjs 端到端 HTTP 自检
```
