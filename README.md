# 🦖 ARK ASA 服务器配置管理器

方舟生存飞升 (ARK: Survival Ascended) 服务器配置文件可视化管理工具 —— 纯前端单文件 HTML，双击即用。

## 功能

- 📋 **配置文件管理** — 加载、编辑、保存 `Game.ini` 和 `GameUserSettings.ini`
- 🔍 **参数可视化** — 200+ 个服务器参数，分类、搜索、排序、中英文说明
- ✏️ **双击编辑** — 点击参数行即可修改，自动校验类型（数字/布尔/字符串）
- 📦 **模版下载** — 内置官服 / 高倍率两种预设，一键下载
- 🔌 **Mod 搜索** — 内置 **6700+ CurseForge Mod** 全量数据，按名称/分类/ID 搜索
- 🌓 **暗色/亮色主题** — 自动跟随系统或手动切换
- 💾 **File System Access API** — Chrome/Edge 支持直接写回原文件

## 环境准备

### 使用工具（日常）

只需浏览器即可，无需安装任何东西：

- **Chrome** 或 **Edge**（推荐，支持直接保存回原文件）
- 双击 `ark-config-manager.html` 即可打开

### 更新 Mod 数据（偶尔）

需要 Node.js 环境来运行数据拉取脚本：

1. **安装 Node.js** ≥18（已安装可跳过）

   | 系统 | 方式 |
   |------|------|
   | Windows | [nodejs.org](https://nodejs.org) 下载 LTS 安装包，一路下一步 |
   | macOS | `brew install node` 或 [nodejs.org](https://nodejs.org) |
   | Linux | `sudo apt install nodejs` 或 [nodejs.org](https://nodejs.org) |

   ```bash
   node -v   # 确认版本 ≥ v18.0.0
   ```

2. **获取 CurseForge API Key**（免费）

   访问 [console.curseforge.com](https://console.curseforge.com/) 注册账号 → 创建应用 → 复制 API Key

3. **运行拉取脚本**

   ```bash
   cd d:\vsCode\my-ark-asa   # 进入项目目录

   # Windows PowerShell:
   $env:CURSEFORGE_API_KEY="你的API Key"
   node fetch-mods.cjs

   # Windows cmd:
   set CURSEFORGE_API_KEY=你的API Key && node fetch-mods.cjs

   # Linux / Mac:
   export CURSEFORGE_API_KEY=你的API Key && node fetch-mods.cjs
   ```

   API Key 只存在于终端的环境变量中，**不会写入任何文件**，用完即销毁。

## 快速开始

### 基本使用

1. 用 Chrome 或 Edge 打开 `ark-config-manager.html`
2. 点击 **📂 打开文件** 加载你的 `GameUserSettings.ini` 或 `Game.ini`
3. 或者直接 **拖拽** `.ini` 文件到窗口
4. 编辑参数后 **💾 保存到原文件** 或 **📥 下载文件**

> 也支持无文件的场景：直接选模版下载，修改后保存。

### Mod 搜索

切换到 **🔌 Mod搜索** 标签页即可搜索 6709 个 CurseForge Mod。

> 确保 `mods-data.js` 与 HTML 在同一目录下。如果没有这个文件，页面会使用内置的 32 个精选 Mod 列表，并在顶部显示警告提示。

## 架构

```
┌─────────────────────────────────────────────────────────┐
│              ark-config-manager.html                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Vue 3 (CDN) — 响应式 UI                          │   │
│  │                                                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │   │
│  │  │ Game.ini │  │  GUS.ini │  │  Mod 搜索      │  │   │
│  │  │ 配置管理  │  │ 配置管理  │  │  6709 条数据   │  │   │
│  │  └──────────┘  └──────────┘  └────────────────┘  │   │
│  │                                                    │   │
│  │  INI Parser / Writer    META 元数据 (200+ 参数)    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  数据来源:                                               │
│  ├── mods-data.js      (fetch-mods.cjs 生成，独立文件)   │
│  └── META 对象         (手写维护，200+ 配置参数)         │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┐
│       fetch-mods.cjs          │
│  ┌────────────────────────┐  │
│  │ CurseForge API v1       │  │
│  │ /v1/games → 找游戏 ID   │  │
│  │ /v1/mods/search → 分页  │  │
│  │   拉取 6709 个 Mod      │  │
│  └────────────────────────┘  │
│           ↓                   │
│  写入 mods-data.js            │
│  (HTML 通过 script src 加载)   │
└──────────────────────────────┘
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `ark-config-manager.html` | ⭐ 主程序，双击即用 |
| `mods-data.js` | Mod 全量数据（6709 条），HTML 通过 `<script src>` 加载 |
| `fetch-mods.cjs` | 数据拉取脚本，从 CurseForge API 更新 `mods-data.js` |
| `package.json` | Node.js 项目元数据 |

## 技术栈

| 层 | 技术 |
|----|------|
| UI 框架 | Vue 3 (CDN, `vue.global.prod.js`) |
| 样式 | CSS Variables + 暗色/亮色主题 |
| INI 解析 | 手写解析器（支持注释、Section、Key=Value） |
| 文件读写 | File System Access API（Chrome/Edge） |
| 数据拉取 | Node.js + CurseForge REST API |
| 运行环境 | 纯浏览器端，无需服务器 |

## 浏览器兼容性

| 功能 | Chrome | Edge | Firefox | Safari |
|------|--------|------|---------|--------|
| 基本使用（拖拽/下载） | ✅ | ✅ | ✅ | ✅ |
| 直接保存到原文件 | ✅ | ✅ | ❌ | ❌ |
| Mod 搜索 | ✅ | ✅ | ✅ | ✅ |

> Firefox/Safari 不支持 File System Access API，但仍可下载修改后的文件再手动覆盖。

## License

MIT
