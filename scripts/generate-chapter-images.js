const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const outDir = path.join(projectRoot, 'docs', 'insights', 'images');
fs.mkdirSync(outDir, { recursive: true });

const W = 800, H = 500;
const FONT = 'sans-serif';

function svgText(x, y, text, size = 16, fill = '#fff', anchor = 'start', weight = 'normal') {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${text}</text>`;
}

function svgRect(x, y, w, h, fill, rx = 8) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${rx}"/>`;
}

function svgLine(x1, y1, x2, y2, stroke = '#fff', sw = 2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function svgArrow(x1, y1, x2, y2, color = '#fff') {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 10;
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5"/>` +
    `<polygon points="${x2},${y2} ${x2 + headLen * Math.cos(a1)},${y2 + headLen * Math.sin(a1)} ${x2 + headLen * Math.cos(a2)},${y2 + headLen * Math.sin(a2)}" fill="${color}"/>`;
}

async function genChapter1() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a237e"/><stop offset="100%" stop-color="#0d47a1"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg1)"/>
    ${svgText(400, 40, 'PCG 技术演进时间线', 22, '#fff', 'middle', 'bold')}
    ${svgLine(80, 120, 720, 120, '#64b5f6', 3)}
    ${svgRect(80, 95, 180, 50, '#1565c0', 25)}
    ${svgText(170, 126, '1999 纹理合成', 14, '#fff', 'middle')}
    ${svgRect(290, 95, 180, 50, '#1976d2', 25)}
    ${svgText(380, 126, '2009 模型合成', 14, '#fff', 'middle')}
    ${svgRect(500, 95, 220, 50, '#1e88e5', 25)}
    ${svgText(610, 126, '2016 WFC 实用化', 14, '#fff', 'middle')}
    ${svgArrow(260, 120, 290, 120, '#64b5f6')}
    ${svgArrow(470, 120, 500, 120, '#64b5f6')}
    ${svgText(400, 185, '三层技术栈架构', 18, '#fff', 'middle', 'bold')}
    ${svgRect(60, 210, 200, 70, '#e65100', 10)}
    ${svgText(160, 240, '底层：噪声/分形', 15, '#fff', 'middle', 'bold')}
    ${svgText(160, 262, 'Perlin / Simplex / Voronoi', 11, '#ffe0b2', 'middle')}
    ${svgRect(300, 210, 200, 70, '#ef6c00', 10)}
    ${svgText(400, 240, '中层：约束求解', 15, '#fff', 'middle', 'bold')}
    ${svgText(400, 262, 'WFC / MarkovJunior', 11, '#ffe0b2', 'middle')}
    ${svgRect(540, 210, 200, 70, '#f57c00', 10)}
    ${svgText(640, 240, '上层：AI 驱动', 15, '#fff', 'middle', 'bold')}
    ${svgText(640, 262, 'LLM Agent / 扩散模型', 11, '#ffe0b2', 'middle')}
    ${svgArrow(260, 245, 300, 245, '#ffcc80')}
    ${svgArrow(500, 245, 540, 245, '#ffcc80')}
    ${svgText(400, 320, 'GitHub 开源生态 3,750 仓库', 16, '#fff', 'middle', 'bold')}
    ${svgRect(60, 345, 120, 55, '#263238', 8)}
    ${svgText(120, 367, 'C#', 13, '#4fc3f7', 'middle', 'bold')}
    ${svgText(120, 387, '619', 18, '#fff', 'middle')}
    ${svgRect(195, 345, 120, 55, '#263238', 8)}
    ${svgText(255, 367, 'JS', 13, '#4fc3f7', 'middle', 'bold')}
    ${svgText(255, 387, '601', 18, '#fff', 'middle')}
    ${svgRect(330, 345, 120, 55, '#263238', 8)}
    ${svgText(390, 367, 'Python', 13, '#4fc3f7', 'middle', 'bold')}
    ${svgText(390, 387, '540', 18, '#fff', 'middle')}
    ${svgRect(465, 345, 120, 55, '#263238', 8)}
    ${svgText(525, 367, 'C++', 13, '#4fc3f7', 'middle', 'bold')}
    ${svgText(525, 387, '354', 18, '#fff', 'middle')}
    ${svgRect(600, 345, 120, 55, '#263238', 8)}
    ${svgText(660, 367, 'Rust', 13, '#4fc3f7', 'middle', 'bold')}
    ${svgText(660, 387, '169', 18, '#fff', 'middle')}
    ${svgText(400, 470, '10+ 语言 · 覆盖噪声库到完整游戏引擎', 13, '#90caf9', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'ch1-overview.png'));
  console.log('ch1 done');
}

async function genChapter2() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1b5e20"/><stop offset="100%" stop-color="#2e7d32"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg2)"/>
    ${svgText(400, 38, '噪声算法族谱与封装层次', 22, '#fff', 'middle', 'bold')}
    ${svgRect(40, 60, 340, 200, '#1b5e20', 12)}
    ${svgText(210, 85, '噪声算法族', 16, '#a5d6a7', 'middle', 'bold')}
    ${svgRect(60, 100, 140, 36, '#388e3c', 6)}
    ${svgText(130, 123, 'Perlin 1983', 13, '#fff', 'middle')}
    ${svgRect(220, 100, 140, 36, '#388e3c', 6)}
    ${svgText(290, 123, 'Simplex', 13, '#fff', 'middle')}
    ${svgRect(60, 148, 140, 36, '#388e3c', 6)}
    ${svgText(130, 171, 'OpenSimplex2', 13, '#fff', 'middle')}
    ${svgRect(220, 148, 140, 36, '#388e3c', 6)}
    ${svgText(290, 171, 'Cellular/Voronoi', 13, '#fff', 'middle')}
    ${svgRect(60, 196, 140, 36, '#388e3c', 6)}
    ${svgText(130, 219, 'Value Cubic', 13, '#fff', 'middle')}
    ${svgRect(220, 196, 140, 36, '#388e3c', 6)}
    ${svgText(290, 219, 'Domain Warp', 13, '#fff', 'middle')}
    ${svgArrow(210, 260, 210, 285, '#a5d6a7')}
    ${svgRect(40, 285, 340, 55, '#e65100', 10)}
    ${svgText(210, 310, 'FastNoiseLite 3.5k★', 18, '#fff', 'middle', 'bold')}
    ${svgText(210, 330, '15+ 语言 · 多重分形 · 域扭曲', 12, '#ffe0b2', 'middle')}
    ${svgArrow(210, 340, 210, 365, '#a5d6a7')}
    ${svgRect(40, 365, 340, 110, '#263238', 10)}
    ${svgText(210, 390, '应用层', 14, '#90caf9', 'middle', 'bold')}
    ${svgRect(55, 405, 100, 50, '#37474f', 6)}
    ${svgText(105, 425, 'Fantasy Map', 11, '#fff', 'middle')}
    ${svgText(105, 443, '5.9k★', 13, '#ffcc80', 'middle')}
    ${svgRect(165, 405, 100, 50, '#37474f', 6)}
    ${svgText(215, 425, 'Procedural', 11, '#fff', 'middle')}
    ${svgText(215, 443, 'Toolkit', 11, '#ffcc80', 'middle')}
    ${svgRect(275, 405, 90, 50, '#37474f', 6)}
    ${svgText(320, 425, 'Realtime', 11, '#fff', 'middle')}
    ${svgText(320, 443, 'Mesh', 11, '#ffcc80', 'middle')}
    ${svgRect(420, 60, 340, 420, '#1b5e20', 12)}
    ${svgText(590, 85, 'MarkovJunior 8.2k★', 18, '#fff', 'middle', 'bold')}
    ${svgText(590, 115, '概率编程语言', 14, '#a5d6a7', 'middle')}
    ${svgRect(440, 135, 300, 40, '#388e3c', 6)}
    ${svgText(590, 160, '改写规则 + 约束传播', 14, '#fff', 'middle')}
    ${svgRect(440, 185, 300, 40, '#388e3c', 6)}
    ${svgText(590, 210, '153 个示例模型', 14, '#fff', 'middle')}
    ${svgRect(440, 235, 145, 80, '#263238', 6)}
    ${svgText(512, 260, '迷宫生成', 13, '#fff', 'middle')}
    ${svgText(512, 280, 'MazeBacktracker', 11, '#a5d6a7', 'middle')}
    ${svgRect(595, 235, 145, 80, '#263238', 6)}
    ${svgText(667, 260, '建筑生成', 13, '#fff', 'middle')}
    ${svgText(667, 280, 'ModernHouse', 11, '#a5d6a7', 'middle')}
    ${svgRect(440, 325, 145, 80, '#263238', 6)}
    ${svgText(512, 350, '地牢生成', 13, '#fff', 'middle')}
    ${svgText(512, 370, 'NystromDungeon', 11, '#a5d6a7', 'middle')}
    ${svgRect(595, 325, 145, 80, '#263238', 6)}
    ${svgText(667, 350, '概率推理', 13, '#fff', 'middle')}
    ${svgText(667, 370, 'Sokoban 求解', 11, '#a5d6a7', 'middle')}
    ${svgRect(440, 420, 300, 45, '#e65100', 8)}
    ${svgText(590, 448, 'Embark Studios 资助', 14, '#fff', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'ch2-algorithms.png'));
  console.log('ch2 done');
}

async function genChapter3() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a148c"/><stop offset="100%" stop-color="#6a1b9a"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg3)"/>
    ${svgText(400, 38, 'WFC 算法流程与商业应用', 22, '#fff', 'middle', 'bold')}
    ${svgRect(40, 60, 370, 280, '#4a148c', 12)}
    ${svgText(225, 85, 'WFC 算法核心流程', 16, '#ce93d8', 'middle', 'bold')}
    ${svgRect(60, 100, 160, 40, '#7b1fa2', 6)}
    ${svgText(140, 125, '输入示例图像', 13, '#fff', 'middle')}
    ${svgArrow(140, 140, 140, 155, '#ce93d8')}
    ${svgRect(60, 155, 160, 40, '#7b1fa2', 6)}
    ${svgText(140, 180, '提取 NxN 模式', 13, '#fff', 'middle')}
    ${svgArrow(140, 195, 140, 210, '#ce93d8')}
    ${svgRect(60, 210, 160, 40, '#7b1fa2', 6)}
    ${svgText(140, 235, '初始化波函数', 13, '#fff', 'middle')}
    ${svgArrow(140, 250, 140, 265, '#ce93d8')}
    ${svgRect(240, 100, 160, 40, '#e65100', 6)}
    ${svgText(320, 125, '最小熵观测', 13, '#fff', 'middle')}
    ${svgArrow(320, 140, 320, 155, '#ffcc80')}
    ${svgRect(240, 155, 160, 40, '#e65100', 6)}
    ${svgText(320, 180, '波函数坍缩', 13, '#fff', 'middle')}
    ${svgArrow(320, 195, 320, 210, '#ffcc80')}
    ${svgRect(240, 210, 160, 40, '#e65100', 6)}
    ${svgText(320, 235, '约束传播', 13, '#fff', 'middle')}
    ${svgArrow(320, 250, 280, 270, '#ffcc80')}
    ${svgRect(60, 270, 340, 45, '#388e3c', 8)}
    ${svgText(230, 298, '输出：局部相似的大尺寸图像', 14, '#fff', 'middle')}
    ${svgText(225, 365, '6 款商业游戏采用', 16, '#fff', 'middle', 'bold')}
    ${svgRect(40, 385, 115, 50, '#263238', 8)}
    ${svgText(97, 405, 'Bad North', 12, '#fff', 'middle')}
    ${svgText(97, 423, '岛屿关卡', 11, '#ce93d8', 'middle')}
    ${svgRect(165, 385, 115, 50, '#263238', 8)}
    ${svgText(222, 405, 'Caves of Qud', 12, '#fff', 'middle')}
    ${svgText(222, 423, '地牢生成', 11, '#ce93d8', 'middle')}
    ${svgRect(290, 385, 115, 50, '#263238', 8)}
    ${svgText(347, 405, 'Townscaper', 12, '#fff', 'middle')}
    ${svgText(347, 423, '城镇生成', 11, '#ce93d8', 'middle')}
    ${svgRect(420, 60, 340, 180, '#4a148c', 12)}
    ${svgText(590, 85, '15+ 语言移植', 16, '#ce93d8', 'middle', 'bold')}
    ${svgRect(440, 100, 130, 35, '#7b1fa2', 6)}
    ${svgText(505, 122, 'C++ / Python', 12, '#fff', 'middle')}
    ${svgRect(580, 100, 130, 35, '#7b1fa2', 6)}
    ${svgText(645, 122, 'Rust / Go', 12, '#fff', 'middle')}
    ${svgRect(440, 145, 130, 35, '#7b1fa2', 6)}
    ${svgText(505, 167, 'Kotlin / Java', 12, '#fff', 'middle')}
    ${svgRect(580, 145, 130, 35, '#7b1fa2', 6)}
    ${svgText(645, 167, 'JS / Dart', 12, '#fff', 'middle')}
    ${svgRect(440, 190, 270, 35, '#7b1fa2', 6)}
    ${svgText(575, 212, 'Julia / Haxe / Clojure / Pascal', 12, '#fff', 'middle')}
    ${svgText(590, 270, '主流引擎集成', 16, '#ce93d8', 'middle', 'bold')}
    ${svgRect(440, 290, 130, 45, '#e65100', 8)}
    ${svgText(505, 310, 'Unity', 14, '#fff', 'middle', 'bold')}
    ${svgText(505, 326, 'WFC Plugin', 11, '#ffe0b2', 'middle')}
    ${svgRect(580, 290, 130, 45, '#e65100', 8)}
    ${svgText(645, 310, 'UE5', 14, '#fff', 'middle', 'bold')}
    ${svgText(645, 326, 'Blueprint API', 11, '#ffe0b2', 'middle')}
    ${svgRect(440, 345, 130, 45, '#e65100', 8)}
    ${svgText(505, 365, 'Godot 4', 14, '#fff', 'middle', 'bold')}
    ${svgText(505, 381, 'Fast WFC', 11, '#ffe0b2', 'middle')}
    ${svgRect(580, 345, 130, 45, '#e65100', 8)}
    ${svgText(645, 365, 'Houdini', 14, '#fff', 'middle', 'bold')}
    ${svgText(645, 381, 'SideFX Labs', 11, '#ffe0b2', 'middle')}
    ${svgRect(440, 420, 300, 55, '#263238', 8)}
    ${svgText(590, 443, 'Matrix Awakens 城市建筑生成', 13, '#fff', 'middle')}
    ${svgText(590, 463, 'GDC 2019 · Roguelike Celebration 2019', 11, '#ce93d8', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'ch3-wfc.png'));
  console.log('ch3 done');
}

async function genChapter4() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#b71c1c"/><stop offset="100%" stop-color="#c62828"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg4)"/>
    ${svgText(400, 38, 'PCG 产品形态矩阵', 22, '#fff', 'middle', 'bold')}
    ${svgRect(40, 60, 350, 180, '#b71c1c', 12)}
    ${svgText(215, 85, 'Roguelike / Roguelite', 16, '#ef9a9a', 'middle', 'bold')}
    ${svgRect(55, 100, 150, 50, '#263238', 8)}
    ${svgText(130, 120, 'Caves of Qud', 13, '#fff', 'middle', 'bold')}
    ${svgText(130, 140, 'WFC 地牢生成', 11, '#ef9a9a', 'middle')}
    ${svgRect(220, 100, 155, 50, '#263238', 8)}
    ${svgText(297, 120, 'Hades / Dead Cells', 13, '#fff', 'middle', 'bold')}
    ${svgText(297, 140, 'Roguelite 子品类', 11, '#ef9a9a', 'middle')}
    ${svgRect(55, 165, 320, 55, '#37474f', 8)}
    ${svgText(215, 187, '核心机制：永久死亡 + 随机生成 + 回合制', 13, '#fff', 'middle')}
    ${svgText(215, 207, '→ meta-progression 降低入门门槛', 12, '#ef9a9a', 'middle')}
    ${svgRect(420, 60, 340, 180, '#b71c1c', 12)}
    ${svgText(590, 85, '开放世界 / 沙盒', 16, '#ef9a9a', 'middle', 'bold')}
    ${svgRect(435, 100, 150, 50, '#263238', 8)}
    ${svgText(510, 120, 'Veloren 7.5k★', 13, '#fff', 'middle', 'bold')}
    ${svgText(510, 140, 'Rust 体素 RPG', 11, '#ef9a9a', 'middle')}
    ${svgRect(600, 100, 145, 50, '#263238', 8)}
    ${svgText(672, 120, 'Cubyz 3.6k★', 13, '#fff', 'middle', 'bold')}
    ${svgText(672, 140, 'Zig 体素沙盒', 11, '#ef9a9a', 'middle')}
    ${svgRect(435, 165, 310, 55, '#37474f', 8)}
    ${svgText(590, 187, 'Pioneer 1.9k★ · 太空探索', 13, '#fff', 'middle')}
    ${svgText(590, 207, '18,487 次提交 · 牛顿力学', 12, '#ef9a9a', 'middle')}
    ${svgRect(40, 270, 720, 200, '#263238', 12)}
    ${svgText(400, 300, 'PCG 产品形态演进', 18, '#fff', 'middle', 'bold')}
    ${svgRect(60, 320, 160, 60, '#c62828', 8)}
    ${svgText(140, 345, 'Roguelike', 15, '#fff', 'middle', 'bold')}
    ${svgText(140, 365, '1980s-至今', 12, '#ef9a9a', 'middle')}
    ${svgArrow(220, 350, 260, 350, '#ef9a9a')}
    ${svgRect(260, 320, 160, 60, '#d32f2f', 8)}
    ${svgText(340, 345, '开放世界', 15, '#fff', 'middle', 'bold')}
    ${svgText(340, 365, '2009-至今', 12, '#ef9a9a', 'middle')}
    ${svgArrow(420, 350, 460, 350, '#ef9a9a')}
    ${svgRect(460, 320, 160, 60, '#e53935', 8)}
    ${svgText(540, 345, '策略模拟', 15, '#fff', 'middle', 'bold')}
    ${svgText(540, 365, 'Dwarf Fortress', 12, '#ef9a9a', 'middle')}
    ${svgArrow(620, 350, 660, 350, '#ef9a9a')}
    ${svgRect(660, 320, 80, 60, '#ff5722', 8)}
    ${svgText(700, 345, 'AI 原生', 15, '#fff', 'middle', 'bold')}
    ${svgText(700, 365, '2024+', 12, '#ef9a9a', 'middle')}
    ${svgRect(60, 400, 680, 50, '#37474f', 8)}
    ${svgText(400, 420, 'Godot 4 PCG 1.9k★ · UE5 RealtimeMesh 1.8k★ · Unity ProceduralToolkit 2.9k★', 13, '#90caf9', 'middle')}
    ${svgText(400, 440, '三大引擎均提供开箱即用的 PCG 组件', 12, '#ef9a9a', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'ch4-products.png'));
  console.log('ch4 done');
}

async function genChapter5() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#004d40"/><stop offset="100%" stop-color="#00695c"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg5)"/>
    ${svgText(400, 38, 'AI 驱动的程序化生成新范式', 22, '#fff', 'middle', 'bold')}
    ${svgRect(40, 60, 350, 200, '#004d40', 12)}
    ${svgText(215, 85, '修仙世界模拟器 2k★', 16, '#80cbc4', 'middle', 'bold')}
    ${svgText(215, 108, 'LLM 驱动的涌现式游戏', 13, '#a5d6a7', 'middle')}
    ${svgRect(55, 120, 150, 45, '#00695c', 8)}
    ${svgText(130, 138, '规则系统', 13, '#fff', 'middle', 'bold')}
    ${svgText(130, 155, '灵根/境界/功法', 11, '#80cbc4', 'middle')}
    ${svgRect(225, 120, 150, 45, '#00695c', 8)}
    ${svgText(300, 138, 'LLM Agent', 13, '#fff', 'middle', 'bold')}
    ${svgText(300, 155, '性格/记忆/决策', 11, '#80cbc4', 'middle')}
    ${svgArrow(205, 142, 225, 142, '#80cbc4')}
    ${svgRect(55, 180, 320, 55, '#263238', 8)}
    ${svgText(215, 200, '确定性计算 + LLM 叙事 分离', 14, '#fff', 'middle', 'bold')}
    ${svgText(215, 220, '数字由代码计算 · 叙述由 LLM 生成 · 全程可追溯', 11, '#80cbc4', 'middle')}
    ${svgRect(55, 245, 320, 10, '#e65100', 4)}
    ${svgRect(420, 60, 340, 200, '#004d40', 12)}
    ${svgText(590, 85, 'img2threejs 12.3k★', 16, '#80cbc4', 'middle', 'bold')}
    ${svgText(590, 108, 'AI 图像理解 → 3D 模型', 13, '#a5d6a7', 'middle')}
    ${svgRect(435, 120, 140, 45, '#00695c', 8)}
    ${svgText(505, 138, '参考图像', 13, '#fff', 'middle', 'bold')}
    ${svgText(505, 155, 'Image Input', 11, '#80cbc4', 'middle')}
    ${svgArrow(575, 142, 610, 142, '#80cbc4')}
    ${svgRect(610, 120, 140, 45, '#00695c', 8)}
    ${svgText(680, 138, 'Three.js 模型', 13, '#fff', 'middle', 'bold')}
    ${svgText(680, 155, '可动画 · 3D', 11, '#80cbc4', 'middle')}
    ${svgRect(435, 180, 310, 55, '#263238', 8)}
    ${svgText(590, 200, 'Token 高效 · 代码级 · 质量门控', 14, '#fff', 'middle', 'bold')}
    ${svgText(590, 220, 'image-to-3D 新方向', 11, '#80cbc4', 'middle')}
    ${svgRect(40, 280, 720, 200, '#263238', 12)}
    ${svgText(400, 310, 'AI 驱动 PCG 架构模式', 18, '#fff', 'middle', 'bold')}
    ${svgRect(60, 330, 200, 60, '#00695c', 8)}
    ${svgText(160, 355, '传统 PCG', 15, '#fff', 'middle', 'bold')}
    ${svgText(160, 375, '算法 → 地形/关卡', 12, '#80cbc4', 'middle')}
    ${svgArrow(260, 360, 320, 360, '#80cbc4')}
    ${svgRect(320, 330, 200, 60, '#e65100', 8)}
    ${svgText(420, 355, 'AI 驱动 PCG', 15, '#fff', 'middle', 'bold')}
    ${svgText(420, 375, 'LLM → 理解 → 生成', 12, '#ffe0b2', 'middle')}
    ${svgArrow(520, 360, 580, 360, '#ffe0b2')}
    ${svgRect(580, 330, 160, 60, '#ff5722', 8)}
    ${svgText(660, 355, '涌现式游戏', 15, '#fff', 'middle', 'bold')}
    ${svgText(660, 375, '无预设剧本', 12, '#ffccbc', 'middle')}
    ${svgRect(60, 410, 200, 50, '#37474f', 8)}
    ${svgText(160, 430, 'Graphite 26.9k★', 13, '#fff', 'middle', 'bold')}
    ${svgText(160, 448, '节点式程序化引擎', 11, '#90caf9', 'middle')}
    ${svgRect(280, 410, 200, 50, '#37474f', 8)}
    ${svgText(380, 430, '修仙模拟器', 13, '#fff', 'middle', 'bold')}
    ${svgText(380, 448, 'Epic Games Store', 11, '#90caf9', 'middle')}
    ${svgRect(500, 410, 240, 50, '#37474f', 8)}
    ${svgText(620, 430, 'img2threejs', 13, '#fff', 'middle', 'bold')}
    ${svgText(620, 448, 'AI 图像 → 3D 模型', 11, '#90caf9', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'ch5-ai-driven.png'));
  console.log('ch5 done');
}

(async () => {
  await genChapter1();
  await genChapter2();
  await genChapter3();
  await genChapter4();
  await genChapter5();
  console.log('All chapter images generated in docs/insights/images/');
})();