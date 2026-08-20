const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const outDir = path.join(projectRoot, 'docs', 'insights', 'images');
fs.mkdirSync(outDir, { recursive: true });

const W = 900, H = 560;
const FONT = 'sans-serif';

function svgText(x, y, text, size = 16, fill = '#fff', anchor = 'middle', weight = 'normal') {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${text}</text>`;
}

function svgRect(x, y, w, h, fill, rx = 10) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${rx}"/>`;
}

function svgArrow(x1, y1, x2, y2, color = '#fff', sw = 2.5) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 10;
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"/>` +
    `<polygon points="${x2},${y2} ${x2 + headLen * Math.cos(a1)},${y2 + headLen * Math.sin(a1)} ${x2 + headLen * Math.cos(a2)},${y2 + headLen * Math.sin(a2)}" fill="${color}"/>`;
}

function svgCircle(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

// 图1: ArchGraph 整体架构图
async function genArchGraphOverview() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0d1b2a"/><stop offset="100%" stop-color="#1b2838"/></linearGradient>
      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4fc3f7" stop-opacity="0.3"/><stop offset="100%" stop-color="#4fc3f7" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${svgText(450, 35, 'ArchGraph 意图驱动 AI 工作流框架', 24, '#4fc3f7', 'middle', 'bold')}
    
    ${svgText(450, 75, '用户意图层', 14, '#90caf9', 'middle', 'bold')}
    ${svgRect(60, 90, 180, 50, '#1565c0', 8)}
    ${svgText(150, 120, '用户提问', 16, '#fff', 'middle', 'bold')}
    ${svgRect(360, 90, 180, 50, '#1565c0', 8)}
    ${svgText(450, 120, '业务目标', 16, '#fff', 'middle', 'bold')}
    ${svgRect(660, 90, 180, 50, '#1565c0', 8)}
    ${svgText(750, 120, '验收标准', 16, '#fff', 'middle', 'bold')}
    
    ${svgArrow(150, 140, 150, 165, '#4fc3f7')}
    ${svgArrow(450, 140, 450, 165, '#4fc3f7')}
    ${svgArrow(750, 140, 750, 165, '#4fc3f7')}
    
    ${svgText(450, 185, '意图架构图谱层 (Single Source of Truth)', 14, '#ffcc80', 'middle', 'bold')}
    ${svgRect(40, 200, 820, 120, '#1a237e', 12)}
    ${svgRect(60, 215, 150, 45, '#283593', 6)}
    ${svgText(135, 243, 'Work Package', 13, '#fff', 'middle')}
    ${svgRect(230, 215, 150, 45, '#283593', 6)}
    ${svgText(305, 243, '方法论', 13, '#fff', 'middle')}
    ${svgRect(400, 215, 150, 45, '#283593', 6)}
    ${svgText(475, 243, '约束/原则', 13, '#fff', 'middle')}
    ${svgRect(570, 215, 150, 45, '#283593', 6)}
    ${svgText(645, 243, '验收测试', 13, '#fff', 'middle')}
    ${svgRect(740, 215, 100, 45, '#283593', 6)}
    ${svgText(790, 243, '交付物', 13, '#fff', 'middle')}
    ${svgRect(60, 275, 780, 35, '#0d47a1', 6)}
    ${svgText(450, 298, 'Association · Triggering · Access · Serving  (ArchiMate 3.2)', 12, '#90caf9', 'middle')}
    
    ${svgArrow(450, 320, 450, 345, '#ffcc80')}
    
    ${svgText(450, 365, '多智能体协作层 (LangGraph)', 14, '#a5d6a7', 'middle', 'bold')}
    ${svgRect(40, 380, 820, 80, '#1b5e20', 12)}
    ${svgRect(55, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(100, 415, 'Chief', 11, '#fff', 'middle')}
    ${svgText(100, 433, 'Editor', 11, '#a5d6a7', 'middle')}
    ${svgRect(155, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(200, 415, 'Editor', 11, '#fff', 'middle')}
    ${svgText(200, 433, 'Agent', 11, '#a5d6a7', 'middle')}
    ${svgRect(255, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(300, 415, 'Research', 11, '#fff', 'middle')}
    ${svgText(300, 433, 'Agent', 11, '#a5d6a7', 'middle')}
    ${svgRect(355, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(400, 415, 'Writer', 11, '#fff', 'middle')}
    ${svgText(400, 433, 'Agent', 11, '#a5d6a7', 'middle')}
    ${svgRect(455, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(500, 415, 'Reviewer', 11, '#fff', 'middle')}
    ${svgText(500, 433, 'Agent', 11, '#a5d6a7', 'middle')}
    ${svgRect(555, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(600, 415, 'Fact', 11, '#fff', 'middle')}
    ${svgText(600, 433, 'Checker', 11, '#a5d6a7', 'middle')}
    ${svgRect(655, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(700, 415, 'Visual', 11, '#fff', 'middle')}
    ${svgText(700, 433, 'izer', 11, '#a5d6a7', 'middle')}
    ${svgRect(755, 395, 90, 50, '#2e7d32', 6)}
    ${svgText(800, 415, 'Publisher', 11, '#fff', 'middle')}
    ${svgText(800, 433, 'Agent', 11, '#a5d6a7', 'middle')}
    
    ${svgArrow(450, 460, 450, 480, '#a5d6a7')}
    
    ${svgText(450, 500, '交付物层', 14, '#ce93d8', 'middle', 'bold')}
    ${svgRect(60, 510, 200, 40, '#4a148c', 8)}
    ${svgText(160, 535, '洞察报告 .md', 14, '#fff', 'middle')}
    ${svgRect(340, 510, 220, 40, '#4a148c', 8)}
    ${svgText(450, 535, '公众号 .wechat.md', 14, '#fff', 'middle')}
    ${svgRect(640, 510, 200, 40, '#4a148c', 8)}
    ${svgText(740, 535, '验收测试 .js', 14, '#fff', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-overview.png'));
  console.log('archgraph-overview done');
}

// 图2: 多智能体工作流
async function genMultiAgentWorkflow() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a237e"/><stop offset="100%" stop-color="#283593"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg2)"/>
    ${svgText(450, 35, '多智能体协作工作流 (LangGraph StateGraph)', 22, '#4fc3f7', 'middle', 'bold')}
    
    ${svgRect(40, 60, 130, 60, '#e65100', 10)}
    ${svgText(105, 85, 'browser', 14, '#fff', 'middle', 'bold')}
    ${svgText(105, 105, '初始研究', 12, '#ffe0b2', 'middle')}
    
    ${svgArrow(170, 90, 210, 90, '#4fc3f7')}
    
    ${svgRect(210, 60, 130, 60, '#1565c0', 10)}
    ${svgText(275, 85, 'planner', 14, '#fff', 'middle', 'bold')}
    ${svgText(275, 105, '规划大纲', 12, '#bbdefb', 'middle')}
    
    ${svgArrow(340, 90, 380, 90, '#4fc3f7')}
    
    ${svgRect(380, 60, 130, 60, '#6a1b9a', 10)}
    ${svgText(445, 85, 'human', 14, '#fff', 'middle', 'bold')}
    ${svgText(445, 105, '人工评审', 12, '#e1bee7', 'middle')}
    
    ${svgArrow(510, 90, 550, 90, '#4fc3f7')}
    
    ${svgRect(550, 60, 130, 60, '#2e7d32', 10)}
    ${svgText(615, 85, 'researcher', 14, '#fff', 'middle', 'bold')}
    ${svgText(615, 105, '并行研究', 12, '#c8e6c9', 'middle')}
    
    ${svgArrow(680, 90, 720, 90, '#4fc3f7')}
    
    ${svgRect(720, 60, 130, 60, '#2e7d32', 10)}
    ${svgText(785, 85, 'writer', 14, '#fff', 'middle', 'bold')}
    ${svgText(785, 105, '撰写章节', 12, '#c8e6c9', 'middle')}
    
    ${svgArrow(785, 120, 785, 155, '#4fc3f7')}
    
    ${svgRect(720, 155, 130, 60, '#c62828', 10)}
    ${svgText(785, 180, 'reviewer', 14, '#fff', 'middle', 'bold')}
    ${svgText(785, 200, '评审草稿', 12, '#ffcdd2', 'middle')}
    
    ${svgArrow(720, 185, 680, 185, '#4fc3f7')}
    
    ${svgRect(550, 155, 130, 60, '#c62828', 10)}
    ${svgText(615, 180, 'reviser', 14, '#fff', 'middle', 'bold')}
    ${svgText(615, 200, '修订草稿', 12, '#ffcdd2', 'middle')}
    
    ${svgArrow(550, 185, 510, 185, '#4fc3f7')}
    
    ${svgRect(380, 155, 130, 60, '#e65100', 10)}
    ${svgText(445, 180, 'fact_checker', 13, '#fff', 'middle', 'bold')}
    ${svgText(445, 200, '事实核查', 12, '#ffe0b2', 'middle')}
    
    ${svgArrow(380, 185, 340, 185, '#4fc3f7')}
    
    ${svgRect(210, 155, 130, 60, '#00838f', 10)}
    ${svgText(275, 180, 'visualizer', 14, '#fff', 'middle', 'bold')}
    ${svgText(275, 200, '生成配图', 12, '#b2ebf2', 'middle')}
    
    ${svgArrow(210, 185, 170, 185, '#4fc3f7')}
    
    ${svgRect(40, 155, 130, 60, '#4a148c', 10)}
    ${svgText(105, 180, 'publisher', 14, '#fff', 'middle', 'bold')}
    ${svgText(105, 200, '发布报告', 12, '#ce93d8', 'middle')}
    
    ${svgRect(40, 250, 820, 120, '#1a237e', 12)}
    ${svgText(450, 280, '子工作流：章节草稿评审修订循环', 16, '#ffcc80', 'middle', 'bold')}
    ${svgRect(80, 300, 160, 50, '#283593', 8)}
    ${svgText(160, 330, 'run_depth_research', 12, '#fff', 'middle')}
    ${svgArrow(240, 325, 290, 325, '#ffcc80')}
    ${svgRect(290, 300, 160, 50, '#283593', 8)}
    ${svgText(370, 330, 'review_draft', 12, '#fff', 'middle')}
    ${svgArrow(450, 325, 500, 325, '#ffcc80')}
    ${svgRect(500, 300, 160, 50, '#283593', 8)}
    ${svgText(580, 330, 'revise_draft', 12, '#fff', 'middle')}
    ${svgArrow(660, 325, 710, 325, '#ffcc80')}
    ${svgRect(710, 300, 120, 50, '#283593', 8)}
    ${svgText(770, 330, '接受?', 14, '#fff', 'middle', 'bold')}
    ${svgArrow(770, 300, 770, 280, '#ff5252')}
    ${svgText(790, 270, '否 → 循环', 11, '#ff5252', 'start')}
    
    ${svgRect(40, 400, 820, 140, '#263238', 12)}
    ${svgText(450, 430, '数据流', 16, '#90caf9', 'middle', 'bold')}
    ${svgRect(60, 450, 180, 70, '#37474f', 8)}
    ${svgText(150, 475, 'ResearchState', 14, '#fff', 'middle', 'bold')}
    ${svgText(150, 498, '顶层研究状态', 12, '#90caf9', 'middle')}
    ${svgRect(360, 450, 180, 70, '#37474f', 8)}
    ${svgText(450, 475, 'DraftState', 14, '#fff', 'middle', 'bold')}
    ${svgText(450, 498, '章节草稿状态', 12, '#90caf9', 'middle')}
    ${svgRect(660, 450, 180, 70, '#37474f', 8)}
    ${svgText(750, 475, '交付物', 14, '#fff', 'middle', 'bold')}
    ${svgText(750, 498, '.md / .wechat.md', 12, '#ce93d8', 'middle')}
    ${svgArrow(240, 485, 360, 485, '#4fc3f7')}
    ${svgArrow(540, 485, 660, 485, '#4fc3f7')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-workflow.png'));
  console.log('archgraph-workflow done');
}

// 图3: 意图驱动闭环
async function genIntentLoop() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#004d40"/><stop offset="100%" stop-color="#00695c"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg3)"/>
    ${svgText(450, 35, '意图驱动闭环：从提问到注册', 22, '#4fc3f7', 'middle', 'bold')}
    
    ${svgCircle(450, 280, 200, 'none')}
    <circle cx="450" cy="280" r="200" fill="none" stroke="#4fc3f7" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
    
    ${svgRect(350, 60, 200, 55, '#1565c0', 10)}
    ${svgText(450, 83, '1. 用户提问', 16, '#fff', 'middle', 'bold')}
    ${svgText(450, 103, '"自由生成的游戏"', 12, '#bbdefb', 'middle')}
    
    ${svgArrow(550, 87, 650, 140, '#4fc3f7')}
    
    ${svgRect(650, 120, 200, 55, '#1a237e', 10)}
    ${svgText(750, 143, '2. 图谱定位', 16, '#fff', 'middle', 'bold')}
    ${svgText(750, 163, 'Work Package 3000', 12, '#ffcc80', 'middle')}
    
    ${svgArrow(750, 175, 750, 220, '#4fc3f7')}
    
    ${svgRect(650, 220, 200, 55, '#1a237e', 10)}
    ${svgText(750, 243, '3. 方法论绑定', 16, '#fff', 'middle', 'bold')}
    ${svgText(750, 263, '多智能体协作 1449', 12, '#ffcc80', 'middle')}
    
    ${svgArrow(750, 275, 750, 320, '#4fc3f7')}
    
    ${svgRect(650, 320, 200, 55, '#2e7d32', 10)}
    ${svgText(750, 343, '4. Agent 执行', 16, '#fff', 'middle', 'bold')}
    ${svgText(750, 363, '10 个角色协作', 12, '#c8e6c9', 'middle')}
    
    ${svgArrow(650, 347, 550, 400, '#4fc3f7')}
    
    ${svgRect(350, 380, 200, 55, '#2e7d32', 10)}
    ${svgText(450, 403, '5. 验收测试', 16, '#fff', 'middle', 'bold')}
    ${svgText(450, 423, '10/10 PASS', 12, '#c8e6c9', 'middle')}
    
    ${svgArrow(350, 407, 250, 360, '#4fc3f7')}
    
    ${svgRect(50, 300, 200, 55, '#4a148c', 10)}
    ${svgText(150, 323, '6. 交付物', 16, '#fff', 'middle', 'bold')}
    ${svgText(150, 343, '洞察报告 .md', 12, '#ce93d8', 'middle')}
    
    ${svgArrow(150, 300, 150, 240, '#4fc3f7')}
    
    ${svgRect(50, 180, 200, 55, '#e65100', 10)}
    ${svgText(150, 203, '7. Git 提交', 16, '#fff', 'middle', 'bold')}
    ${svgText(150, 223, 'commit faae892', 12, '#ffe0b2', 'middle')}
    
    ${svgArrow(250, 207, 350, 140, '#4fc3f7')}
    
    ${svgRect(350, 120, 200, 55, '#e65100', 10)}
    ${svgText(450, 143, '8. 注册回图谱', 16, '#fff', 'middle', 'bold')}
    ${svgText(450, 163, 'deliveryStatus: delivered', 12, '#ffe0b2', 'middle')}
    
    ${svgArrow(450, 120, 450, 115, '#4fc3f7')}
    
    ${svgRect(350, 470, 200, 70, '#c62828', 10)}
    ${svgText(450, 498, '闭环完成', 18, '#fff', 'middle', 'bold')}
    ${svgText(450, 523, '意图 → 交付 → 追溯', 13, '#ffcdd2', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-intent-loop.png'));
  console.log('archgraph-intent-loop done');
}

// 图4: 验收测试驱动
async function genAcceptanceTest() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#b71c1c"/><stop offset="100%" stop-color="#c62828"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg4)"/>
    ${svgText(450, 35, '验收测试驱动：GIVEN-WHEN-THEN', 22, '#4fc3f7', 'middle', 'bold')}
    
    ${svgRect(40, 60, 820, 100, '#263238', 12)}
    ${svgText(450, 90, 'GIVEN-WHEN-THEN 格式', 18, '#fff', 'middle', 'bold')}
    ${svgRect(60, 105, 240, 40, '#1565c0', 6)}
    ${svgText(180, 130, 'GIVEN 前提条件', 14, '#fff', 'middle')}
    ${svgRect(330, 105, 240, 40, '#e65100', 6)}
    ${svgText(450, 130, 'WHEN 执行动作', 14, '#fff', 'middle')}
    ${svgRect(600, 105, 240, 40, '#2e7d32', 6)}
    ${svgText(720, 130, 'THEN 预期结果', 14, '#fff', 'middle')}
    
    ${svgRect(40, 180, 820, 350, '#1a237e', 12)}
    ${svgText(450, 210, '本次任务的验收测试 (10/10 PASS)', 16, '#ffcc80', 'middle', 'bold')}
    
    ${svgRect(60, 230, 380, 35, '#283593', 6)}
    ${svgText(250, 253, '✅ deliverable-document-exists', 13, '#a5d6a7', 'middle')}
    ${svgRect(460, 230, 380, 35, '#283593', 6)}
    ${svgText(650, 253, '✅ 工作包存在', 13, '#a5d6a7', 'middle')}
    
    ${svgRect(60, 275, 380, 35, '#283593', 6)}
    ${svgText(250, 298, '✅ 验收用例挂载', 13, '#a5d6a7', 'middle')}
    ${svgRect(460, 275, 380, 35, '#283593', 6)}
    ${svgText(650, 298, '✅ GIVEN-WHEN-THEN 格式', 13, '#a5d6a7', 'middle')}
    
    ${svgRect(60, 320, 380, 35, '#283593', 6)}
    ${svgText(250, 343, '✅ ≥3 章', 13, '#a5d6a7', 'middle')}
    ${svgRect(460, 320, 380, 35, '#283593', 6)}
    ${svgText(650, 343, '✅ ≥3 个章节含来源', 13, '#a5d6a7', 'middle')}
    
    ${svgRect(60, 365, 380, 35, '#283593', 6)}
    ${svgText(250, 388, '✅ ≥1 个 Mermaid 图', 13, '#a5d6a7', 'middle')}
    ${svgRect(460, 365, 380, 35, '#283593', 6)}
    ${svgText(650, 388, '✅ URL 来源数 ≥ 章节数', 13, '#a5d6a7', 'middle')}
    
    ${svgRect(60, 410, 380, 35, '#283593', 6)}
    ${svgText(250, 433, '✅ 原文段落来源数 ≥ 章节数', 13, '#a5d6a7', 'middle')}
    ${svgRect(460, 410, 380, 35, '#283593', 6)}
    ${svgText(650, 433, '✅ 章节数 = 5', 13, '#a5d6a7', 'middle')}
    
    ${svgRect(60, 465, 780, 45, '#388e3c', 8)}
    ${svgText(450, 493, '[ACCEPT] PASS — 章节 5 个, Mermaid 1 个, URL 19 个', 15, '#fff', 'middle', 'bold')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-acceptance.png'));
  console.log('archgraph-acceptance done');
}

// 图5: 核心价值对比
async function genValueComparison() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#311b92"/><stop offset="100%" stop-color="#4527a0"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg5)"/>
    ${svgText(450, 35, 'ArchGraph vs 传统 AI 工作流', 22, '#4fc3f7', 'middle', 'bold')}
    
    ${svgRect(40, 60, 400, 470, '#1a237e', 12)}
    ${svgText(240, 90, '传统 AI 工作流', 18, '#ff5252', 'middle', 'bold')}
    
    ${svgRect(60, 110, 360, 50, '#263238', 8)}
    ${svgText(240, 130, '输入 → ??? → 输出', 14, '#ff5252', 'middle')}
    ${svgText(240, 150, '黑盒，不可追溯', 12, '#ef9a9a', 'middle')}
    
    ${svgRect(60, 175, 360, 50, '#263238', 8)}
    ${svgText(240, 195, '方法论：硬编码在脚本中', 14, '#ff5252', 'middle')}
    ${svgText(240, 215, '不可复用', 12, '#ef9a9a', 'middle')}
    
    ${svgRect(60, 240, 360, 50, '#263238', 8)}
    ${svgText(240, 260, '验收：人工检查', 14, '#ff5252', 'middle')}
    ${svgText(240, 280, '不可执行', 12, '#ef9a9a', 'middle')}
    
    ${svgRect(60, 305, 360, 50, '#263238', 8)}
    ${svgText(240, 325, '交付物：散落在各处', 14, '#ff5252', 'middle')}
    ${svgText(240, 345, '不可追溯', 12, '#ef9a9a', 'middle')}
    
    ${svgRect(60, 370, 360, 50, '#263238', 8)}
    ${svgText(240, 390, '协作：单 Agent 串行', 14, '#ff5252', 'middle')}
    ${svgText(240, 410, '效率低', 12, '#ef9a9a', 'middle')}
    
    ${svgRect(60, 435, 360, 50, '#263238', 8)}
    ${svgText(240, 455, '知识：无结构化存储', 14, '#ff5252', 'middle')}
    ${svgText(240, 475, '易丢失', 12, '#ef9a9a', 'middle')}
    
    ${svgRect(460, 60, 400, 470, '#1b5e20', 12)}
    ${svgText(660, 90, 'ArchGraph 框架', 18, '#69f0ae', 'middle', 'bold')}
    
    ${svgRect(480, 110, 360, 50, '#263238', 8)}
    ${svgText(660, 130, '意图 → 图谱 → Agent → 交付 → 注册', 14, '#69f0ae', 'middle')}
    ${svgText(660, 150, '白盒，完整链路', 12, '#a5d6a7', 'middle')}
    
    ${svgRect(480, 175, 360, 50, '#263238', 8)}
    ${svgText(660, 195, '方法论：图谱元素，可复用', 14, '#69f0ae', 'middle')}
    ${svgText(660, 215, '即插即用', 12, '#a5d6a7', 'middle')}
    
    ${svgRect(480, 240, 360, 50, '#263238', 8)}
    ${svgText(660, 260, '验收：GIVEN-WHEN-THEN', 14, '#69f0ae', 'middle')}
    ${svgText(660, 280, '可执行，自动化', 12, '#a5d6a7', 'middle')}
    
    ${svgRect(480, 305, 360, 50, '#263238', 8)}
    ${svgText(660, 325, '交付物：锚定图谱元素', 14, '#69f0ae', 'middle')}
    ${svgText(660, 345, 'commit 注册，可追溯', 12, '#a5d6a7', 'middle')}
    
    ${svgRect(480, 370, 360, 50, '#263238', 8)}
    ${svgText(660, 390, '协作：10 Agent 并行', 14, '#69f0ae', 'middle')}
    ${svgText(660, 410, 'LangGraph 编排', 12, '#a5d6a7', 'middle')}
    
    ${svgRect(480, 435, 360, 50, '#263238', 8)}
    ${svgText(660, 455, '知识：ArchiMate 图谱', 14, '#69f0ae', 'middle')}
    ${svgText(660, 475, '结构化，可查询', 12, '#a5d6a7', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-value.png'));
  console.log('archgraph-value done');
}

(async () => {
  await genArchGraphOverview();
  await genMultiAgentWorkflow();
  await genIntentLoop();
  await genAcceptanceTest();
  await genValueComparison();
  console.log('All ArchGraph images generated!');
})();