const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const outDir = path.join(projectRoot, 'docs', 'insights', 'images');
fs.mkdirSync(outDir, { recursive: true });

const W = 1000, H = 750;
const FONT = 'sans-serif';

function svgText(x, y, text, size = 16, fill = '#fff', anchor = 'middle', weight = 'normal') {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${text}</text>`;
}

function svgRect(x, y, w, h, fill, rx = 10, stroke = 'none', sw = 0) {
  const s = stroke !== 'none' ? `stroke="${stroke}" stroke-width="${sw}"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" rx="${rx}" ${s}/>`;
}

function svgArrow(x1, y1, x2, y2, color = '#fff', sw = 2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 10;
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"/>` +
    `<polygon points="${x2},${y2} ${x2 + headLen * Math.cos(a1)},${y2 + headLen * Math.sin(a1)} ${x2 + headLen * Math.cos(a2)},${y2 + headLen * Math.sin(a2)}" fill="${color}"/>`;
}

function svgCircle(cx, cy, r, fill, stroke = 'none', sw = 0) {
  const s = stroke !== 'none' ? `stroke="${stroke}" stroke-width="${sw}"` : '';
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${s}/>`;
}

function svgPersonIcon(cx, cy, size, color) {
  const headR = size * 0.2;
  const bodyH = size * 0.5;
  const armW = size * 0.4;
  return `
    <circle cx="${cx}" cy="${cy - size * 0.3}" r="${headR}" fill="${color}"/>
    <line x1="${cx}" y1="${cy - size * 0.1}" x2="${cx}" y2="${cy + size * 0.2}" stroke="${color}" stroke-width="3"/>
    <line x1="${cx - armW}" y1="${cy + size * 0.05}" x2="${cx + armW}" y2="${cy + size * 0.05}" stroke="${color}" stroke-width="3"/>
    <line x1="${cx}" y1="${cy + size * 0.2}" x2="${cx - size * 0.2}" y2="${cy + size * 0.45}" stroke="${color}" stroke-width="3"/>
    <line x1="${cx}" y1="${cy + size * 0.2}" x2="${cx + size * 0.2}" y2="${cy + size * 0.45}" stroke="${color}" stroke-width="3"/>
  `;
}

function svgRobotIcon(cx, cy, size, color) {
  const w = size * 0.5;
  const h = size * 0.5;
  return `
    <rect x="${cx - w/2}" y="${cy - h/2}" width="${w}" height="${h}" fill="${color}" rx="4"/>
    <circle cx="${cx - size * 0.1}" cy="${cy - size * 0.05}" r="${size * 0.06}" fill="#0d1b2a"/>
    <circle cx="${cx + size * 0.1}" cy="${cy - size * 0.05}" r="${size * 0.06}" fill="#0d1b2a"/>
    <line x1="${cx - size * 0.1}" y1="${cy + size * 0.1}" x2="${cx + size * 0.1}" y2="${cy + size * 0.1}" stroke="#0d1b2a" stroke-width="2"/>
    <line x1="${cx}" y1="${cy - h/2}" x2="${cx}" y2="${cy - h/2 - size * 0.15}" stroke="${color}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy - h/2 - size * 0.18}" r="${size * 0.04}" fill="${color}"/>
  `;
}

async function genArchGraphCoreDiagram() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a1628"/><stop offset="50%" stop-color="#0d1b2a"/><stop offset="100%" stop-color="#1a1a2e"/></linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4fc3f7" stop-opacity="0.15"/><stop offset="100%" stop-color="#4fc3f7" stop-opacity="0"/></radialGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    
    <!-- Title -->
    ${svgText(500, 32, 'ArchGraph：一张图谱，统一 Harness 设计与产品设计', 20, '#4fc3f7', 'middle', 'bold')}
    
    <!-- ===== TOP: Commanders &amp; Advisors ===== -->
    ${svgText(500, 65, '指挥官 &amp; 参谋层', 13, '#ffcc80', 'middle', 'bold')}
    
    <!-- Human Commander -->
    ${svgRect(380, 78, 240, 70, '#1565c0', 12, '#42a5f5', 2)}
    ${svgPersonIcon(420, 113, 40, '#42a5f5')}
    ${svgText(500, 100, '人类指挥官', 15, '#fff', 'middle', 'bold')}
    ${svgText(500, 120, '定义意图 · 验收决策 · 最终裁定', 11, '#bbdefb', 'middle')}
    
    <!-- Advisor Agents -->
    ${svgRect(40, 78, 150, 70, '#4a148c', 10, '#7b1fa2', 1.5)}
    ${svgRobotIcon(75, 113, 35, '#ce93d8')}
    ${svgText(140, 100, '规划专家', 12, '#fff', 'middle')}
    ${svgText(140, 118, 'tanwen', 10, '#e1bee7', 'middle')}
    
    ${svgRect(200, 78, 150, 70, '#4a148c', 10, '#7b1fa2', 1.5)}
    ${svgRobotIcon(235, 113, 35, '#ce93d8')}
    ${svgText(300, 100, '系统架构师', 12, '#fff', 'middle')}
    ${svgText(300, 118, 'laodong', 10, '#e1bee7', 'middle')}
    
    ${svgRect(650, 78, 150, 70, '#4a148c', 10, '#7b1fa2', 1.5)}
    ${svgRobotIcon(685, 113, 35, '#ce93d8')}
    ${svgText(750, 100, 'Reviewer', 12, '#fff', 'middle')}
    ${svgText(750, 118, 'adam', 10, '#e1bee7', 'middle')}
    
    ${svgRect(810, 78, 150, 70, '#4a148c', 10, '#7b1fa2', 1.5)}
    ${svgRobotIcon(845, 113, 35, '#ce93d8')}
    ${svgText(910, 100, '产品经理', 12, '#fff', 'middle')}
    ${svgText(910, 118, 'xiaoniu', 10, '#e1bee7', 'middle')}
    
    <!-- Arrows from top to center -->
    ${svgArrow(500, 148, 500, 195, '#ffcc80', 2)}
    ${svgText(520, 175, '读图', 10, '#ffcc80', 'start')}
    ${svgArrow(500, 195, 500, 148, '#a5d6a7', 2)}
    ${svgText(480, 175, '写回', 10, '#a5d6a7', 'end')}
    
    <!-- ===== CENTER: Knowledge Graph Map ===== -->
    <ellipse cx="500" cy="370" rx="380" ry="160" fill="url(#glow)"/>
    
    ${svgRect(120, 200, 760, 340, '#1a237e', 16, '#4fc3f7', 2)}
    ${svgText(500, 228, '意图架构知识图谱 (Single Source of Truth)', 17, '#4fc3f7', 'middle', 'bold')}
    ${svgText(500, 248, 'Harness 设计 + 产品设计 统一建模 · ArchiMate 3.2 + AML 扩展', 11, '#90caf9', 'middle')}
    
    <!-- Graph nodes -->
    <!-- Work Package -->
    ${svgRect(150, 270, 160, 55, '#283593', 8)}
    ${svgText(230, 292, 'Work Package', 13, '#fff', 'middle', 'bold')}
    ${svgText(230, 310, '任务 · 验收用例', 10, '#90caf9', 'middle')}
    
    <!-- Skill -->
    ${svgRect(340, 270, 130, 55, '#e65100', 8)}
    ${svgText(405, 292, 'Skill', 13, '#fff', 'middle', 'bold')}
    ${svgText(405, 310, '可加载技能', 10, '#ffe0b2', 'middle')}
    
    <!-- Rule -->
    ${svgRect(500, 270, 130, 55, '#e65100', 8)}
    ${svgText(565, 292, 'Rule', 13, '#fff', 'middle', 'bold')}
    ${svgText(565, 310, '可复用规则', 10, '#ffe0b2', 'middle')}
    
    <!-- Business Actor -->
    ${svgRect(660, 270, 190, 55, '#1b5e20', 8)}
    ${svgText(755, 292, 'Business Actor', 13, '#fff', 'middle', 'bold')}
    ${svgText(755, 310, 'Agent 本体 · 长期记忆', 10, '#c8e6c9', 'middle')}
    
    <!-- Relationships -->
    ${svgArrow(310, 297, 340, 297, '#4fc3f7', 1.5)}
    ${svgArrow(470, 297, 500, 297, '#4fc3f7', 1.5)}
    ${svgArrow(630, 297, 660, 297, '#4fc3f7', 1.5)}
    
    <!-- Long-term Memory sub-graph -->
    ${svgRect(150, 345, 340, 90, '#004d40', 10, '#26a69a', 1.5)}
    ${svgText(320, 370, '长期记忆 (Subview Hierarchy)', 14, '#fff', 'middle', 'bold')}
    ${svgRect(165, 385, 100, 35, '#00695c', 6)}
    ${svgText(215, 407, 'Session 总结', 10, '#b2dfdb', 'middle')}
    ${svgRect(275, 385, 100, 35, '#00695c', 6)}
    ${svgText(325, 407, '踩坑记录', 10, '#b2dfdb', 'middle')}
    ${svgRect(385, 385, 90, 35, '#00695c', 6)}
    ${svgText(430, 407, '决策记录', 10, '#b2dfdb', 'middle')}
    
    <!-- Target System Design -->
    ${svgRect(520, 345, 330, 90, '#311b92', 10, '#7c4dff', 1.5)}
    ${svgText(685, 370, '目标系统设计 (Product Design)', 14, '#fff', 'middle', 'bold')}
    ${svgRect(535, 385, 100, 35, '#4527a0', 6)}
    ${svgText(585, 407, '架构元素', 10, '#d1c4e9', 'middle')}
    ${svgRect(645, 385, 100, 35, '#4527a0', 6)}
    ${svgText(695, 407, '关系定义', 10, '#d1c4e9', 'middle')}
    ${svgRect(755, 385, 80, 35, '#4527a0', 6)}
    ${svgText(795, 407, '视图', 10, '#d1c4e9', 'middle')}
    
    <!-- ARGO MCP -->
    ${svgRect(250, 455, 500, 55, '#263238', 10, '#4fc3f7', 1.5)}
    ${svgText(500, 478, 'ARGO MCP Server · 15+ 工具 · Graph RAG 语义检索', 14, '#4fc3f7', 'middle', 'bold')}
    ${svgText(500, 498, 'getSystemArchitecture · getIntentElementContext · applyMutation · validate...', 10, '#90caf9', 'middle')}
    
    <!-- Arrows from top to graph -->
    <line x1="200" y1="148" x2="300" y2="200" stroke="#ffcc80" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="800" y1="148" x2="700" y2="200" stroke="#ffcc80" stroke-width="1.5" stroke-dasharray="4,3"/>
    
    <!-- ===== BOTTOM: Worker Agents (Soldiers) ===== -->
    ${svgArrow(500, 510, 500, 545, '#a5d6a7', 2)}
    ${svgText(520, 530, '执行指令', 10, '#a5d6a7', 'start')}
    ${svgArrow(500, 545, 500, 510, '#ffcc80', 2)}
    ${svgText(480, 530, '经验回写', 10, '#ffcc80', 'end')}
    
    ${svgText(500, 565, '执行层（士兵）', 13, '#a5d6a7', 'middle', 'bold')}
    
    <!-- Worker agents -->
    ${svgRect(40, 580, 140, 70, '#1b5e20', 10, '#4caf50', 1.5)}
    ${svgRobotIcon(75, 615, 35, '#69f0ae')}
    ${svgText(135, 605, 'Developer', 12, '#fff', 'middle', 'bold')}
    ${svgText(135, 623, 'Xiaoming', 10, '#c8e6c9', 'middle')}
    ${svgText(110, 643, '编码 · 自测', 9, '#a5d6a7', 'middle')}
    
    ${svgRect(200, 580, 140, 70, '#1b5e20', 10, '#4caf50', 1.5)}
    ${svgRobotIcon(235, 615, 35, '#69f0ae')}
    ${svgText(295, 605, '测试工程师', 12, '#fff', 'middle', 'bold')}
    ${svgText(295, 623, 'chenlin', 10, '#c8e6c9', 'middle')}
    ${svgText(270, 643, '验收测试', 9, '#a5d6a7', 'middle')}
    
    ${svgRect(360, 580, 140, 70, '#1b5e20', 10, '#4caf50', 1.5)}
    ${svgRobotIcon(395, 615, 35, '#69f0ae')}
    ${svgText(455, 605, '设计师', 12, '#fff', 'middle', 'bold')}
    ${svgText(455, 623, 'caoyang', 10, '#c8e6c9', 'middle')}
    ${svgText(430, 643, '方案设计', 9, '#a5d6a7', 'middle')}
    
    ${svgRect(520, 580, 140, 70, '#1b5e20', 10, '#4caf50', 1.5)}
    ${svgRobotIcon(555, 615, 35, '#69f0ae')}
    ${svgText(615, 605, '发布员', 12, '#fff', 'middle', 'bold')}
    ${svgText(615, 623, 'wechat-publisher', 9, '#c8e6c9', 'middle')}
    ${svgText(590, 643, '公众号发布', 9, '#a5d6a7', 'middle')}
    
    ${svgRect(680, 580, 140, 70, '#1b5e20', 10, '#4caf50', 1.5)}
    ${svgRobotIcon(715, 615, 35, '#69f0ae')}
    ${svgText(775, 605, '新 Agent', 12, '#fff', 'middle', 'bold')}
    ${svgText(775, 623, '从零开始', 10, '#c8e6c9', 'middle')}
    ${svgText(750, 643, '探索图谱 → 自武装', 9, '#a5d6a7', 'middle')}
    
    <!-- Feedback loop arrows -->
    <path d="M 110 580 Q 110 555 200 520 Q 350 490 500 510" fill="none" stroke="#a5d6a7" stroke-width="1.5" stroke-dasharray="4,3"/>
    <path d="M 890 580 Q 890 555 800 520 Q 650 490 500 510" fill="none" stroke="#ffcc80" stroke-width="1.5" stroke-dasharray="4,3"/>
    
    <!-- Bottom legend -->
    ${svgRect(40, 670, 920, 65, '#0d1b2a', 10)}
    ${svgText(500, 692, '核心机制：Agent 从「小白」到「专家」的完整闭环', 14, '#4fc3f7', 'middle', 'bold')}
    ${svgRect(60, 705, 12, 12, '#4fc3f7', 2)}
    ${svgText(80, 716, '读图（语义检索）', 10, '#90caf9', 'start')}
    ${svgRect(200, 705, 12, 12, '#a5d6a7', 2)}
    ${svgText(220, 716, '执行（Agent 行动）', 10, '#90caf9', 'start')}
    ${svgRect(360, 705, 12, 12, '#ffcc80', 2)}
    ${svgText(380, 716, '写回（经验 → 长期记忆）', 10, '#90caf9', 'start')}
    ${svgRect(560, 705, 12, 12, '#ce93d8', 2)}
    ${svgText(580, 716, '指挥官/参谋（人类 + Advisor Agent）', 10, '#90caf9', 'start')}
    ${svgRect(800, 705, 12, 12, '#69f0ae', 2)}
    ${svgText(820, 716, '士兵（Worker Agent）', 10, '#90caf9', 'start')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-core-concept.png'));
  console.log('archgraph-core-concept done');
}

// 图2: Agent 从"小白"到"专家"的探索路径
async function genAgentJourney() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0d1b2a"/><stop offset="100%" stop-color="#1b2838"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg2)"/>
    ${svgText(500, 35, 'Agent 从「小白」到「专家」的图谱探索路径', 20, '#4fc3f7', 'middle', 'bold')}
    
    <!-- Step 1: Wakeup -->
    ${svgRect(40, 60, 200, 100, '#1565c0', 10)}
    ${svgText(140, 85, 'Step 1: 唤醒', 16, '#fff', 'middle', 'bold')}
    ${svgText(140, 108, '识别自己是哪个', 11, '#bbdefb', 'middle')}
    ${svgText(140, 123, 'Business Actor', 11, '#bbdefb', 'middle')}
    ${svgText(140, 145, '读取长期记忆 SubView', 10, '#90caf9', 'middle')}
    
    ${svgArrow(240, 110, 280, 110, '#4fc3f7')}
    
    <!-- Step 2: Explore -->
    ${svgRect(280, 60, 200, 100, '#1a237e', 10)}
    ${svgText(380, 85, 'Step 2: 探索图谱', 16, '#fff', 'middle', 'bold')}
    ${svgText(380, 108, 'getSystemArchitecture', 11, '#ffcc80', 'middle')}
    ${svgText(380, 123, '语义检索任务/技能/规则', 11, '#bbdefb', 'middle')}
    ${svgText(380, 145, '理解「干什么」「怎么干」', 10, '#90caf9', 'middle')}
    
    ${svgArrow(480, 110, 520, 110, '#4fc3f7')}
    
    <!-- Step 3: Arm -->
    ${svgRect(520, 60, 200, 100, '#e65100', 10)}
    ${svgText(620, 85, 'Step 3: 自武装', 16, '#fff', 'middle', 'bold')}
    ${svgText(620, 108, '加载 Skill (SKILL.md)', 11, '#ffe0b2', 'middle')}
    ${svgText(620, 123, '加载 Rule (*.instructions.md)', 11, '#ffe0b2', 'middle')}
    ${svgText(620, 145, '装配上下文 → 可执行', 10, '#90caf9', 'middle')}
    
    ${svgArrow(720, 110, 760, 110, '#4fc3f7')}
    
    <!-- Step 4: Execute -->
    ${svgRect(760, 60, 200, 100, '#1b5e20', 10)}
    ${svgText(860, 85, 'Step 4: 执行任务', 16, '#fff', 'middle', 'bold')}
    ${svgText(860, 108, '领取 Work Package', 11, '#c8e6c9', 'middle')}
    ${svgText(860, 123, '按验收用例执行', 11, '#c8e6c9', 'middle')}
    ${svgText(860, 145, 'testcases 全绿？', 10, '#a5d6a7', 'middle')}
    
    <!-- Step 5: Commit &amp; Register -->
    ${svgRect(760, 200, 200, 100, '#4a148c', 10)}
    ${svgText(860, 225, 'Step 5: 提交注册', 16, '#fff', 'middle', 'bold')}
    ${svgText(860, 248, 'git commit', 11, '#e1bee7', 'middle')}
    ${svgText(860, 263, '回写 deliveryCommit', 11, '#e1bee7', 'middle')}
    ${svgText(860, 285, 'deliveryStatus: delivered', 10, '#ce93d8', 'middle')}
    
    ${svgArrow(860, 160, 860, 200, '#4fc3f7')}
    
    <!-- Step 6: Memory -->
    ${svgRect(520, 200, 200, 100, '#004d40', 10)}
    ${svgText(620, 225, 'Step 6: 写入记忆', 16, '#fff', 'middle', 'bold')}
    ${svgText(620, 248, '总结本次经验', 11, '#b2dfdb', 'middle')}
    ${svgText(620, 263, '记录踩坑/关键决策', 11, '#b2dfdb', 'middle')}
    ${svgText(620, 285, '写入 SubView 长期记忆', 10, '#80cbc4', 'middle')}
    
    ${svgArrow(760, 250, 720, 250, '#4fc3f7')}
    
    <!-- Step 7: Report up -->
    ${svgRect(280, 200, 200, 100, '#c62828', 10)}
    ${svgText(380, 225, 'Step 7: 上报指挥官', 16, '#fff', 'middle', 'bold')}
    ${svgText(380, 248, '人类审阅交付物', 11, '#ffcdd2', 'middle')}
    ${svgText(380, 263, 'Advisor Agent 分析', 11, '#ffcdd2', 'middle')}
    ${svgText(380, 285, '反馈 → 下一轮迭代', 10, '#ef9a9a', 'middle')}
    
    ${svgArrow(520, 250, 480, 250, '#4fc3f7')}
    
    <!-- Loop back -->
    ${svgArrow(280, 250, 240, 250, '#4fc3f7')}
    <path d="M 240 250 Q 140 250 140 160" fill="none" stroke="#4fc3f7" stroke-width="2" stroke-dasharray="4,3"/>
    ${svgArrow(140, 165, 140, 160, '#4fc3f7')}
    ${svgText(170, 200, '循环', 10, '#4fc3f7', 'start')}
    
    <!-- Bottom: Key insight -->
    ${svgRect(40, 330, 920, 120, '#1a237e', 12, '#4fc3f7', 1.5)}
    ${svgText(500, 360, '关键洞察：Harness 设计 与 产品设计 在同一张图谱中', 17, '#4fc3f7', 'middle', 'bold')}
    
    ${svgRect(60, 380, 280, 55, '#283593', 8)}
    ${svgText(200, 400, 'Harness 设计', 14, '#fff', 'middle', 'bold')}
    ${svgText(200, 420, 'Agent 如何工作：Skill / Rule / 工作流', 11, '#90caf9', 'middle')}
    
    ${svgRect(370, 380, 260, 55, '#283593', 8)}
    ${svgText(500, 400, '统一建模', 14, '#ffcc80', 'middle', 'bold')}
    ${svgText(500, 420, 'ArchiMate 3.2 + AML 扩展', 11, '#ffe0b2', 'middle')}
    
    ${svgRect(660, 380, 280, 55, '#283593', 8)}
    ${svgText(800, 400, '产品设计', 14, '#fff', 'middle', 'bold')}
    ${svgText(800, 420, 'Agent 做什么：Work Package / 验收用例', 11, '#90caf9', 'middle')}
    
    ${svgArrow(340, 407, 370, 407, '#ffcc80')}
    ${svgArrow(630, 407, 660, 407, '#ffcc80')}
    
    <!-- Bottom: Three advantages -->
    ${svgRect(40, 470, 290, 80, '#1b5e20', 10)}
    ${svgText(185, 495, '优势 1: Agent 可自举', 14, '#fff', 'middle', 'bold')}
    ${svgText(185, 515, '新 Agent 从「小白」开始', 11, '#c8e6c9', 'middle')}
    ${svgText(185, 533, '通过探索图谱自我武装', 11, '#c8e6c9', 'middle')}
    
    ${svgRect(355, 470, 290, 80, '#1b5e20', 10)}
    ${svgText(500, 495, '优势 2: 经验可积累', 14, '#fff', 'middle', 'bold')}
    ${svgText(500, 515, '每次任务完成后写入记忆', 11, '#c8e6c9', 'middle')}
    ${svgText(500, 533, '下次唤醒时恢复上下文', 11, '#c8e6c9', 'middle')}
    
    ${svgRect(670, 470, 290, 80, '#1b5e20', 10)}
    ${svgText(815, 495, '优势 3: 人机可协同', 14, '#fff', 'middle', 'bold')}
    ${svgText(815, 515, '指挥官看同一张地图', 11, '#c8e6c9', 'middle')}
    ${svgText(815, 533, '可随时介入/调整/委派', 11, '#c8e6c9', 'middle')}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'archgraph-agent-journey.png'));
  console.log('archgraph-agent-journey done');
}

(async () => {
  await genArchGraphCoreDiagram();
  await genAgentJourney();
  console.log('All ArchGraph concept images generated!');
})();