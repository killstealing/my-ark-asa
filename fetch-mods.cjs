/**
 * fetch-mods.cjs
 * ==============
 * 从 CurseForge API 拉取方舟生存飞升 (ARK: Survival Ascended) 的全部 Mod 列表，
 * 输出为 mods-data.js 文件，供 ark-config-manager.html 加载。
 *
 * 使用方法:
 *   1. 在 https://console.curseforge.com/ 注册并获取 API Key
 *   2. 设置环境变量: set CURSEFORGE_API_KEY=你的key   (Windows)
 *                    export CURSEFORGE_API_KEY=你的key  (Linux/Mac)
 *   3. node fetch-mods.cjs
 *
 * 输出文件: mods-data.js — 定义 window.__ALL_MODS__ 全局变量
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// 配置
// ============================================================================
const CF_API = 'https://api.curseforge.com/v1';
const OUTPUT_FILE = path.join(__dirname, 'mods-data.js');
const CHECKPOINT_FILE = path.join(__dirname, '.mods-checkpoint.json');
const PAGE_SIZE = 50;        // CurseForge 每页最多 50
const REQUEST_DELAY_MS = 300; // 请求间隔，避免触发限流
const MAX_SUMMARY_LENGTH = 300; // 摘要最长字符数

// ============================================================================
// 工具函数
// ============================================================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ').trim();
}

// ============================================================================
// CurseForge API 封装
// ============================================================================
const API_KEY = process.env.CURSEFORGE_API_KEY;

if (!API_KEY) {
  console.error('❌ 错误: 未设置 CURSEFORGE_API_KEY 环境变量');
  console.error('');
  console.error('   请先在 https://console.curseforge.com/ 注册并获取 API Key，然后:');
  console.error('   Windows (cmd):  set CURSEFORGE_API_KEY=你的key && node fetch-mods.cjs');
  console.error('   Windows (ps):   $env:CURSEFORGE_API_KEY="你的key"; node fetch-mods.cjs');
  console.error('   Linux/Mac:      export CURSEFORGE_API_KEY=你的key && node fetch-mods.cjs');
  process.exit(1);
}

async function cfRequest(endpoint) {
  const url = `${CF_API}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'x-api-key': API_KEY,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${body.slice(0, 500)}`);
  }

  return res.json();
}

// ============================================================================
// 主流程
// ============================================================================

/** 步骤1: 查找 ARK ASA 的游戏 ID */
async function findGameId() {
  console.log('🔍 正在获取 CurseForge 游戏列表…');
  const data = await cfRequest('/games');

  // 精确匹配
  let game = data.data.find(g =>
    g.name === 'ARK: Survival Ascended' ||
    g.slug === 'ark-survival-ascended'
  );

  // 模糊匹配
  if (!game) {
    game = data.data.find(g =>
      g.name && g.name.toLowerCase().includes('ark') &&
      g.name.toLowerCase().includes('ascended')
    );
  }

  if (!game) {
    console.error('❌ 未在 CurseForge 游戏列表中找到 ARK: Survival Ascended');
    console.error('   请检查 API Key 是否有权限访问游戏列表');
    console.error('   已知的游戏列表:');
    data.data.filter(g => g.name).forEach(g => console.error(`     ${g.id}: ${g.name}`));
    process.exit(1);
  }

  console.log(`✅ 找到游戏: "${game.name}" (ID: ${game.id}, slug: ${game.slug})`);
  return game.id;
}

/** 步骤2: 分页拉取全部 Mod */
async function fetchAllMods(gameId) {
  // 尝试从断点续传
  let allMods = [];
  let startIndex = 0;
  let totalCount = null;

  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      const cp = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
      if (cp.gameId === gameId && Array.isArray(cp.mods)) {
        allMods = cp.mods;
        startIndex = cp.nextIndex || 0;
        totalCount = cp.totalCount;
        console.log(`📦 从断点恢复: 已有 ${allMods.length} 个 Mod, 从第 ${startIndex} 继续`);
      }
    } catch (_) { /* 断点损坏，忽略 */ }
  }

  // 第一页: 获取总数
  if (totalCount === null) {
    console.log('📡 获取第一页以确定总数…');
    const firstPage = await cfRequest(
      `/mods/search?gameId=${gameId}&pageSize=${PAGE_SIZE}&index=0&sortField=1&sortOrder=desc`
    );
    totalCount = firstPage.pagination.totalCount;
    console.log(`📊 总计 ${totalCount} 个 Mod, 需要 ${Math.ceil(totalCount / PAGE_SIZE)} 次请求`);

    if (startIndex === 0) {
      allMods = firstPage.data.map(normalizeMod);
      startIndex = PAGE_SIZE;
    }
  }

  // 分页拉取
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  let pageNum = Math.floor(startIndex / PAGE_SIZE);

  while (startIndex < totalCount) {
    pageNum++;
    console.log(`📥 正在拉取第 ${pageNum}/${totalPages} 页 (index=${startIndex})…`);

    try {
      const page = await cfRequest(
        `/mods/search?gameId=${gameId}&pageSize=${PAGE_SIZE}&index=${startIndex}&sortField=1&sortOrder=desc`
      );

      const mods = page.data.map(normalizeMod);
      allMods.push(...mods);
      startIndex += PAGE_SIZE;

      // 实时显示进度
      console.log(`   ✅ 已获取 ${allMods.length}/${totalCount} (${(allMods.length/totalCount*100).toFixed(1)}%)`);

      // 每 10 页保存断点
      if (pageNum % 10 === 0) {
        saveCheckpoint(gameId, allMods, startIndex, totalCount);
        console.log('   💾 断点已保存');
      }

      // 请求间隔
      await sleep(REQUEST_DELAY_MS);

    } catch (err) {
      console.error(`   ⚠️ 请求失败 (index=${startIndex}): ${err.message}`);
      console.log('   💾 保存断点，稍后可续传…');
      saveCheckpoint(gameId, allMods, startIndex, totalCount);
      throw err;
    }
  }

  // 清理断点
  if (fs.existsSync(CHECKPOINT_FILE)) {
    fs.unlinkSync(CHECKPOINT_FILE);
  }

  return allMods;
}

/** 将 API 返回的 Mod 对象精简为前端需要的字段 */
function normalizeMod(raw) {
  // 尝试从中文字段或 CurseForge category 推断分类
  let cat = '';
  if (raw.categories && raw.categories.length > 0) {
    // 用第一个分类名
    const catName = raw.categories[0].name;
    cat = mapCategory(catName);
  }

  return {
    id: raw.id,
    name: raw.name,
    summary: truncate(stripHtml(raw.summary || ''), MAX_SUMMARY_LENGTH),
    cat: cat,
    downloads: raw.downloadCount || 0,
    author: raw.authors && raw.authors.length > 0 ? raw.authors[0].name : '',
    updated: raw.dateModified || ''
  };
}

/** 将 CurseForge 英文分类映射为中文分类 */
function mapCategory(catName) {
  const map = {
    'Mods': '综合',
    'Server Utility': '工具',
    'Admin': '管理',
    'Building': '建筑',
    'Structures': '建筑',
    'Creatures': '生物',
    'Dinos': '生物',
    'Maps': '地图',
    'New Maps': '地图',
    'Weapons': '武器',
    'Armor': '装备',
    'Items': '物品',
    'Cosmetic': '外观',
    'Skins': '外观',
    'Quality of Life': '便利',
    'Utility': '便利',
    'Gameplay': '玩法',
    'Balance': '平衡',
    'Breeding': '繁殖',
    'Crafting': '制作',
    'Automation': '自动化',
    'Economy': '经济',
    'UI': '界面',
    'Sound': '音频',
    'Total Conversion': '大型模组',
    'Tweaks': '微调',
    'PvP': 'PVP',
    'PvE': 'PVE',
  };

  if (!catName) return '';
  // 精确匹配
  if (map[catName]) return map[catName];
  // 模糊匹配
  const lower = catName.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key.toLowerCase())) return val;
  }
  return catName; // 保留原名
}

function saveCheckpoint(gameId, mods, nextIndex, totalCount) {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify({
    gameId,
    nextIndex,
    totalCount,
    modCount: mods.length,
    mods
  }, null, 2), 'utf-8');
}

/** 输出 mods-data.js 文件 */
function writeOutput(mods) {
  console.log(`\n📝 正在生成 ${OUTPUT_FILE}…`);

  // 按下载量降序排列
  mods.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

  // 生成紧凑 JSON (去掉 downloads/author/updated 以减小体积)
  const compact = mods.map(m => ({
    id: m.id,
    name: m.name,
    summary: m.summary || '',
    cat: m.cat || ''
  }));

  const json = JSON.stringify(compact);
  const content = [
    '// 自动生成 — 请勿手动编辑',
    '// 由 fetch-mods.cjs 从 CurseForge API 拉取',
    `// 生成时间: ${new Date().toISOString()}`,
    `// Mod 总数: ${compact.length}`,
    `//`,
    `// 更新方式: 设置 CURSEFORGE_API_KEY 后运行 node fetch-mods.cjs`,
    '',
    `window.__ALL_MODS__ = ${json};`,
    ''
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`✅ 完成! 共 ${compact.length} 个 Mod 写入 ${OUTPUT_FILE}`);
  console.log(`   文件大小: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);
}

// ============================================================================
// 入口
// ============================================================================
(async () => {
  console.log('🦖 ARK ASA Mod 列表抓取工具');
  console.log('=============================\n');

  try {
    const gameId = await findGameId();
    const mods = await fetchAllMods(gameId);
    writeOutput(mods);
  } catch (err) {
    console.error(`\n❌ 抓取失败: ${err.message}`);
    process.exit(1);
  }
})();
