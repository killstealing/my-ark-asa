/**
 * server.cjs — ARK ASA 服务器管理后端
 *
 * 用法: node server.cjs
 * 然后在浏览器打开 ark-config-manager.html，部署页即可一键启动/停止服务器。
 *
 * 端口: 3456 (仅监听 localhost)
 */

const http = require('http');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 3456;
const HOST = '127.0.0.1';

// ============================================================================
// 服务器进程管理
// ============================================================================
let serverProcess = null;
let serverStartTime = null;
const logClients = new Set(); // SSE 客户端列表

/** 广播日志到所有 SSE 客户端 */
function broadcastLog(line) {
  for (const res of logClients) {
    try { res.write(`data: ${JSON.stringify({ text: line, time: Date.now() })}\n\n`); }
    catch (_) { logClients.delete(res); }
  }
}

/** 从 start.txt 模板构建启动命令行 */
function buildCommandLine(config) {
  // 尝试读取 start.txt 模板
  let tplLine = '';
  try {
    const tpl = fs.readFileSync(path.join(__dirname, 'start.txt'), 'utf-8');
    const lines = tpl.split(/\r?\n/);
    for (const line of lines) {
      if (line.trim().startsWith('start ') && line.includes(config.selectedMap)) {
        tplLine = line.trim(); break;
      }
    }
  } catch (_) {}

  if (tplLine) {
    // 基于模板行，替换用户配置
    let cmd = tplLine
      .replace(/SessionName=[^?]+/, 'SessionName=' + config.sessionName)
      .replace(/QueryPort=\d+/, 'QueryPort=' + config.queryPort)
      .replace(/-port=\d+/, '-port=' + config.gamePort)
      .replace(/-WinLiveMaxPlayers=\d+/, '-WinLiveMaxPlayers=' + config.maxPlayers);

    if (config.modIds && config.modIds.length > 0) {
      if (/-mods=/.test(cmd)) {
        cmd = cmd.replace(/-mods=[\d,]+/, '-mods=' + config.modIds.join(','));
      } else {
        cmd += ' -mods=' + config.modIds.join(',');
      }
    }
    if (config.useBattleEye) {
      cmd = cmd.replace(/\s*-NoBattlEye\s*/, ' ');
    } else if (!/-NoBattlEye/.test(cmd)) {
      cmd += ' -NoBattlEye';
    }
    if (config.clusterId) {
      cmd = cmd.replace(/-clusterid=\S+/, '-clusterid=' + config.clusterId);
    }
    if (config.clusterDir) {
      if (/-ClusterDirOverride=/.test(cmd)) {
        cmd = cmd.replace(/-ClusterDirOverride="[^"]*"/, '-ClusterDirOverride="' + config.clusterDir + '"');
      } else {
        cmd += ' -ClusterDirOverride="' + config.clusterDir + '"';
      }
    }
    return cmd.replace(/\s+/g, ' ').trim();
  }

  // 无模板时用硬编码格式
  const mapUrl = `${config.selectedMap}?listen` +
    `?SessionName=${config.sessionName}` +
    `?QueryPort=${config.queryPort}` +
    (config.enableRCON ? `?RCONEnabled=True?RCONPort=${config.rconPort}` : '');
  const flags = [
    `-port=${config.gamePort}`,
    `-WinLiveMaxPlayers=${config.maxPlayers}`,
  ];
  if (config.modIds && config.modIds.length > 0) flags.push(`-mods=${config.modIds.join(',')}`);
  if (!config.useBattleEye) flags.push('-NoBattlEye');
  if (config.clusterId) flags.push(`-clusterid=${config.clusterId}`);
  if (config.clusterDir) flags.push(`-ClusterDirOverride="${config.clusterDir}"`);
  return `start "${config.sessionName}" ArkAscendedServer.exe ${mapUrl} ${flags.join(' ')}`;
}

/** 将密码注入 GameUserSettings.ini 的 [ServerSettings] */
function injectPasswords(iniContent, adminPassword, serverPassword) {
  let result = iniContent || '';
  if (!result.includes('[ServerSettings]')) {
    result = result + '\n[ServerSettings]\n';
  }
  // 移除已有的密码行，再追加
  result = result.replace(/^ServerAdminPassword=.*$/gm, '').replace(/^ServerPassword=.*$/gm, '');
  const inject = [];
  if (adminPassword) inject.push(`ServerAdminPassword=${adminPassword}`);
  if (serverPassword) inject.push(`ServerPassword=${serverPassword}`);
  if (inject.length > 0) {
    result = result.replace(/\[ServerSettings\]/, `[ServerSettings]\n${inject.join('\n')}`);
  }
  // 清理多余空行
  return result.replace(/\n{3,}/g, '\n\n');
}

/** 写入配置文件到服务器目录 */
function writeConfigFiles(config) {
  const configDir = path.join(config.serverPath, 'ShooterGame', 'Saved', 'Config', 'WindowsServer');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let gusIni = config.gameusersettingsIni || '';
  if (config.adminPassword || config.serverPassword) {
    gusIni = injectPasswords(gusIni, config.adminPassword, config.serverPassword);
  }
  if (gusIni) {
    fs.writeFileSync(path.join(configDir, 'GameUserSettings.ini'), gusIni, 'utf-8');
    broadcastLog(`[系统] GameUserSettings.ini 已写入`);
  }
  if (config.gameIni) {
    fs.writeFileSync(path.join(configDir, 'Game.ini'), config.gameIni, 'utf-8');
    broadcastLog(`[系统] Game.ini 已写入`);
  }
}

/** 启动服务器 */
function startServer(config) {
  if (serverProcess) {
    return { error: '服务器已在运行中' };
  }

  const exeDir = path.join(config.serverPath, 'ShooterGame', 'Binaries', 'Win64');
  const exePath = path.join(exeDir, 'ArkAscendedServer.exe');

  if (!fs.existsSync(exePath)) {
    return { error: `找不到 ArkAscendedServer.exe: ${exePath}` };
  }

  // 写入配置文件
  try { writeConfigFiles(config); } catch (e) {
    return { error: `写入配置文件失败: ${e.message}` };
  }

  const cmdLine = buildCommandLine(config);

  // 从 start "title" ArkAscendedServer.exe MAP?params -flags 中解析参数
  // 去掉 start "title" 前缀，拆分 mapUrl 和 flags
  let spawnArgs = cmdLine.replace(/^start\s+"[^"]*"\s+ArkAscendedServer\.exe\s+/, '');
  const flagIdx = spawnArgs.indexOf(' -');
  const mapUrl = flagIdx >= 0 ? spawnArgs.substring(0, flagIdx) : spawnArgs;
  const flagsStr = flagIdx >= 0 ? spawnArgs.substring(flagIdx + 1) : '';
  const flags = flagsStr ? flagsStr.match(/(?:-{1,2}[^\s-]+(?:="[^"]*")?)/g) || flagsStr.split(/\s+/) : [];

  broadcastLog(`[系统] 正在启动服务器...`);
  broadcastLog(`[命令] ArkAscendedServer.exe ${mapUrl} ${flags.join(' ')}`);

  try {
    serverProcess = spawn(exePath, [mapUrl, ...flags], {
      cwd: exeDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });

    serverStartTime = Date.now();

    serverProcess.stdout.on('data', (data) => {
      for (const line of data.toString().split(/\r?\n/).filter(Boolean)) {
        broadcastLog(line);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      for (const line of data.toString().split(/\r?\n/).filter(Boolean)) {
        broadcastLog(`[stderr] ${line}`);
      }
    });

    serverProcess.on('close', (code) => {
      broadcastLog(`[系统] 服务器已停止 (退出码: ${code})`);
      serverProcess = null;
      serverStartTime = null;
    });

    serverProcess.on('error', (err) => {
      broadcastLog(`[错误] 启动失败: ${err.message}`);
      serverProcess = null;
      serverStartTime = null;
    });

    return { success: true, pid: serverProcess.pid };
  } catch (e) {
    return { error: `启动失败: ${e.message}` };
  }
}

/** 停止服务器 */
function stopServer() {
  if (!serverProcess) {
    return { error: '服务器未在运行' };
  }

  broadcastLog('[系统] 正在关闭服务器...');

  try {
    // 先尝试优雅关闭 (Ctrl+C 信号)
    serverProcess.kill('SIGINT');

    // 3 秒后强制终止
    setTimeout(() => {
      if (serverProcess) {
        broadcastLog('[系统] 强制终止服务器进程...');
        try { serverProcess.kill('SIGKILL'); } catch (_) {}
        // Windows 上 SIGKILL 可能无效，用 taskkill
        exec(`taskkill /PID ${serverProcess.pid} /T /F`, () => {});
      }
    }, 3000);

    return { success: true };
  } catch (e) {
    return { error: `停止失败: ${e.message}` };
  }
}

// ============================================================================
// HTTP 服务器
// ============================================================================
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (_) { resolve({}); }
    });
  });
}

function sendJSON(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  // ---- GET /status ----
  if (req.method === 'GET' && url.pathname === '/status') {
    sendJSON(res, 200, {
      running: !!serverProcess,
      pid: serverProcess ? serverProcess.pid : null,
      startTime: serverStartTime,
    });
    return;
  }

  // ---- GET /logs (SSE) ----
  if (req.method === 'GET' && url.pathname === '/logs') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(':connected\n\n');
    logClients.add(res);
    req.on('close', () => { logClients.delete(res); });
    return;
  }

  // ---- POST /start ----
  if (req.method === 'POST' && url.pathname === '/start') {
    const config = await parseBody(req);
    if (!config.serverPath) {
      sendJSON(res, 400, { error: '缺少 serverPath' });
      return;
    }
    const result = startServer(config);
    sendJSON(res, result.error ? 400 : 200, result);
    return;
  }

  // ---- POST /stop ----
  if (req.method === 'POST' && url.pathname === '/stop') {
    const result = stopServer();
    sendJSON(res, result.error ? 400 : 200, result);
    return;
  }

  // ---- 404 ----
  sendJSON(res, 404, { error: 'Not found' });
});

// 进程退出时清理
process.on('exit', () => {
  if (serverProcess) {
    try { serverProcess.kill(); } catch (_) {}
  }
});
process.on('SIGINT', () => { process.exit(); });
process.on('SIGTERM', () => { process.exit(); });

server.listen(PORT, HOST, () => {
  console.log(`🦖 ARK ASA 服务器管理后端已启动`);
  console.log(`   地址: http://${HOST}:${PORT}`);
  console.log(`   HTML 部署页现在可以一键启停服务器`);
  console.log('');
  console.log(`   按 Ctrl+C 停止后端`);
});
