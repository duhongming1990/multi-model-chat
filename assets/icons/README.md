# 品牌图标

这些图标只用于在对话卡片上标识“这条回答来自哪个模型”，商标与图形版权归各品牌方所有。

| 文件 | 说明 |
|---|---|
| `deepseek.svg` `glm.svg` `kimi.svg` `minimax.svg` `perplexity.svg` `qwen.svg` `yuanbao.svg` | 各品牌官方标识（24×24 视图） |
| `doubao.webp` | 豆包 App 头像，64×64 |
| `mimo.svg` `model-mapping.svg` | 1024×1024 视图图标；后者用作未知模型的通用图标 |
| `zai.svg` | Z.ai 标识，30×30 视图 |

图标由用户提供。替换任意文件后，运行：

```bash
node scripts/build-icons.mjs
```

就会把 `assets/icons/*` 重新编码成 data URI，写入 `client.js` 的 `brand-icons` 区块（客户端 bundle 是单个文件，内联可以避免额外请求并规避 CSP 差异）。`node scripts/build-icons.mjs --check` 用于确认生成结果没有过期。
