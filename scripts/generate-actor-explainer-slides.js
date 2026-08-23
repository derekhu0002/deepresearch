// 生成《ArchGraph · Agent 组织与协作》讲解视频 9 张幻灯片（SVG → PNG）
// 运行：node scripts/generate-actor-explainer-slides.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'docs', 'diagrams', 'actor-explainer');
const SLIDE_DIR = path.join(OUT_DIR, 'slides');
fs.mkdirSync(SLIDE_DIR, { recursive: true });

const W = 1920;
const H = 1080;
const FONT = "'Microsoft YaHei','PingFang SC','Noto Sans CJK SC',sans-serif";

const BLUE = '#5b8cff';
const LBLUE = '#7fd1ff';
const AMBER = '#ffb547';
const GREEN = '#5ee0a0';
const PINK = '#ff7a9c';
const PURPLE = '#9d7bff';
const ORANGE = '#ff8a5c';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function header(title, subtitle, page, accent) {
  return `
  <rect x="0" y="0" width="${W}" height="${H}" fill="#0e1420"/>
  <rect x="0" y="0" width="${W}" height="12" fill="${accent}"/>
  <text x="80" y="104" font-family="${FONT}" font-size="60" font-weight="bold" fill="#f2f6ff">${esc(title)}</text>
  <text x="82" y="162" font-family="${FONT}" font-size="28" fill="#9aa7bd">${esc(subtitle)}</text>
  <line x1="80" y1="196" x2="${W - 80}" y2="196" stroke="#1f2a3d" stroke-width="2"/>
  <text x="80" y="${H - 38}" font-family="${FONT}" font-size="22" fill="#5a6a85">deepresearch · Agent 组织与协作</text>
  <text x="${W - 100}" y="${H - 38}" font-family="${FONT}" font-size="22" fill="#5a6a85" text-anchor="end">${page} / 9</text>`;
}

function card(x, y, w, h, title, accent, body) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#141c2c" stroke="#2a3a55" stroke-width="2"/>
  <rect x="${x}" y="${y}" width="8" height="${h}" rx="4" fill="${accent}"/>
  <text x="${x + 30}" y="${y + 58}" font-family="${FONT}" font-size="32" font-weight="bold" fill="#e8eefb">${esc(title)}</text>
  ${body}`;
}

function bullet(x, y, color, text) {
  return `<circle cx="${x + 10}" cy="${y - 10}" r="7" fill="${color}"/>
  <text x="${x + 32}" y="${y}" font-family="${FONT}" font-size="30" fill="#c7d2e8">${esc(text)}</text>`;
}

function skill(x, y, label, color) {
  const w = Math.max(220, label.length * 30 + 70);
  return `<rect x="${x}" y="${y}" width="${w}" height="58" rx="29" fill="${color}" opacity="0.14" stroke="${color}" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + 39}" font-family="${FONT}" font-size="26" font-weight="bold" fill="${color}" text-anchor="middle">${esc(label)}</text>`;
}

function flowBox(x, y, w, h, text, color, sub) {
  let extra = '';
  if (sub) {
    extra = `<text x="${x + w / 2}" y="${y + h / 2 + 44}" font-family="${FONT}" font-size="24" fill="#93a4c2" text-anchor="middle">${esc(sub)}</text>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="2.5"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 12}" font-family="${FONT}" font-size="30" font-weight="bold" fill="${color}" text-anchor="middle">${esc(text)}</text>${extra}`;
}

function arrow(x1, y1, x2, y2, color = '#4e6a9c') {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const hx = 16;
  const hw = 9;
  const ex = x2 - hx * Math.cos(ang);
  const ey = y2 - hx * Math.sin(ang);
  const p1 = `${x2},${y2}`;
  const p2 = `${ex - hw * Math.sin(ang)},${ey + hw * Math.cos(ang)}`;
  const p3 = `${ex + hw * Math.sin(ang)},${ey - hw * Math.cos(ang)}`;
  return `<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="4"/>
  <polygon points="${p1} ${p2} ${p3}" fill="${color}"/>`;
}

function tag(x, y, text, color) {
  const w = text.length * 34 + 50;
  return `<rect x="${x}" y="${y}" width="${w}" height="50" rx="10" fill="${color}" opacity="0.16" stroke="${color}" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + 34}" font-family="${FONT}" font-size="25" font-weight="bold" fill="${color}" text-anchor="middle">${esc(text)}</text>`;
}

// ---------- 场景 ----------
const slides = {};

// S1 开场
slides.s1 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('deepresearch · Agent 组织与协作', '4 个 Business Actor · 能力 · 协作关系 · 主要业务流程', 1, BLUE)}
<rect x="300" y="340" width="1320" height="200" rx="24" fill="#131b2e" stroke="#2a3a55" stroke-width="2"/>
<text x="960" y="430" font-family="${FONT}" font-size="54" font-weight="bold" fill="#ffffff" text-anchor="middle">梳理我们注册的 ACTOR 团队</text>
<text x="960" y="500" font-family="${FONT}" font-size="32" fill="#9fb0cf" text-anchor="middle">媒体艺术家  ·  视频制作Leader  ·  视频制作  ·  视频审核</text>
<text x="960" y="640" font-family="${FONT}" font-size="30" fill="#7fd1ff" text-anchor="middle">数据源：意图架构图谱 design/KG/SystemArchitecture.json · AgentOrganization(1962)</text>
<text x="960" y="780" font-family="${FONT}" font-size="28" fill="#5a6a85" text-anchor="middle">2026-08-23</text>
</svg>`;

// S2 团队总览
slides.s2 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('Agent 组织总览', 'AgentOrganization(1962) 下辖两个团队 · 共 4 个业务角色', 2, BLUE)}
${flowBox(730, 240, 460, 80, 'AgentOrganization', BLUE, 'Grouping · 组织根分组')}
${arrow(860, 320, 400, 410)}
${arrow(1060, 320, 1520, 410)}
${flowBox(200, 410, 400, 90, '媒体创作团队', LBLUE, 'media-team-001')}
${flowBox(1320, 410, 400, 90, '视频制作团队', AMBER, 'video-team-001')}
${arrow(400, 500, 400, 610)}
${arrow(1520, 500, 1520, 610)}
${flowBox(200, 610, 400, 90, '媒体艺术家', LBLUE, 'media-artist-001')}
${flowBox(1320, 610, 400, 90, '视频制作Leader', AMBER, 'video-leader-001')}
${arrow(1430, 700, 1390, 790)}
${arrow(1630, 700, 1730, 790)}
${flowBox(1240, 790, 300, 80, '视频制作', GREEN, 'video-producer-001')}
${flowBox(1580, 790, 300, 80, '视频审核', PINK, 'video-reviewer-001')}
</svg>`;

// S3 媒体艺术家
slides.s3 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('媒体艺术家 · media-artist-001', '媒体创作团队 · 图片与视频的创作执行', 3, LBLUE)}
${card(120, 260, 520, 620, '图片生成', LBLUE, `
  ${bullet(150, 380, LBLUE, 'DashScope 原生 text2image')}
  ${bullet(150, 450, LBLUE, '模型：qwen-image / qwen-image-plus')}
  ${bullet(150, 520, LBLUE, '异步任务轮询，下载 PNG')}
  ${bullet(150, 590, LBLUE, '输出至 docs/diagrams/')}
  ${skill(150, 680, 'dashscope-media-generator', LBLUE)}
`)}
${card(700, 260, 520, 620, '视觉验收', LBLUE, `
  ${bullet(730, 380, LBLUE, 'qwen3-vl-plus 视觉模型')}
  ${bullet(730, 450, LBLUE, '画面元素完整性')}
  ${bullet(730, 520, LBLUE, '角色标注坐标定位')}
  ${bullet(730, 590, LBLUE, '确认标注无遮挡 / 无重叠')}
  ${skill(730, 680, 'qwen3-vl-visual-inspection', LBLUE)}
`)}
${card(1280, 260, 520, 620, '视频生成', LBLUE, `
  ${bullet(1310, 380, LBLUE, '万相 wan2.7-t2v / HappyHorse')}
  ${bullet(1310, 450, LBLUE, '异步 video-synthesis 任务')}
  ${bullet(1310, 520, LBLUE, '链接 24h 有效须立即转存')}
  ${bullet(1310, 590, LBLUE, '输出 MP4 至 docs/diagrams/')}
  ${skill(1310, 680, 'dashscope-video-generator', LBLUE)}
`)}
<text x="960" y="940" font-family="${FONT}" font-size="28" fill="#9fb0cf" text-anchor="middle">媒体创作团队 · 被指派为「图片视频生成」Role · 对最终图片/视频可视质量负责</text>
<text x="960" y="985" font-family="${FONT}" font-size="24" fill="#6b7c9c" text-anchor="middle">模型：alibaba-cn/qwen3.7-plus · 创作须符合仓库文档上下文，不得凭空捏造画面事实</text>
</svg>`;

// S4 视频制作Leader
slides.s4 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('视频制作Leader · video-leader-001', '视频团队枢纽 · 统筹编排制作与验收', 4, AMBER)}
${flowBox(730, 230, 460, 80, '接收需求', AMBER, '主题/时长/风格/用途/交付要求')}
${arrow(960, 310, 960, 380)}
${flowBox(730, 380, 460, 80, '解析需求', AMBER, '分辨率 / 宽高比 / 风格')}
${arrow(960, 460, 960, 530)}
${flowBox(730, 530, 460, 80, '指派制作', GREEN, '视频制作 Actor · 异步生成')}
${arrow(960, 610, 960, 680)}
${flowBox(730, 680, 460, 80, '指派审核', PINK, '视频审核 Actor · 抽帧核对')}
${arrow(1190, 720, 1300, 720, '#5ee0a0')}
<text x="1245" y="705" font-family="${FONT}" font-size="26" fill="#a8ecc9" text-anchor="middle">通过</text>
${flowBox(1300, 680, 460, 80, '交付 MP4', AMBER, '向需求提出者交付最终视频')}
<path d="M730 720 L560 720 L560 570 L714 570" fill="none" stroke="#ff8a5c" stroke-width="4"/>
<polygon points="730 570 710 562 710 578" fill="#ff8a5c"/>
<text x="570" y="700" font-family="${FONT}" font-size="26" fill="#ff8a5c" text-anchor="middle">不通过 → 返工重制</text>
<text x="960" y="910" font-family="${FONT}" font-size="30" fill="#ffd9a0" text-anchor="middle">对视频交付是否满足需求提出者要求，负最终责任</text>
</svg>`;

// S5 视频制作
slides.s5 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('视频制作 · video-producer-001', '实际生成视频 · 异步合成 + 立即转存', 5, GREEN)}
${card(140, 270, 800, 600, '视频生成（Skill）', GREEN, `
  ${bullet(170, 390, GREEN, 'dashscope-video-generator')}
  ${bullet(170, 460, GREEN, '模型：happyhorse-1.1-t2v / 万相 wan2.7-t2v')}
  ${bullet(170, 530, GREEN, '提交 video-synthesis 异步任务')}
  ${bullet(170, 600, GREEN, '轮询 task_id（约 15s 间隔）')}
  ${bullet(170, 670, GREEN, 'SUCCEEDED → output.video_url 下载 MP4')}
`)}
${card(980, 270, 800, 600, '关键约束', GREEN, `
  ${bullet(1010, 390, GREEN, '视频链接 24 小时有效')}
  ${bullet(1010, 460, GREEN, '须立即下载转存')}
  ${bullet(1010, 530, GREEN, '输出至 docs/diagrams/')}
  ${bullet(1010, 600, GREEN, '分辨率 / 宽高比按需求指定')}
  ${skill(1010, 700, 'dashscope-video-generator', GREEN)}
`)}
<text x="960" y="940" font-family="${FONT}" font-size="28" fill="#9fb0cf" text-anchor="middle">视频制作团队 · 由视频制作Leader 指派执行生成 · 受视频审核抽帧把关</text>
</svg>`;

// S6 视频审核
slides.s6 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('视频审核 · video-reviewer-001', '质量把关 · 抽帧 + 视觉模型逐条核对', 6, PINK)}
${card(200, 280, 760, 560, '验收流程', PINK, `
  ${bullet(230, 400, PINK, '接收 Leader 指派的验收任务')}
  ${bullet(230, 470, PINK, '读取需求提出者的原始要求')}
  ${bullet(230, 540, PINK, '抽取生成视频的关键帧')}
  ${bullet(230, 610, PINK, 'qwen3-vl-plus 分析帧画面')}
`)}
${card(1000, 280, 720, 560, '核对维度', PINK, `
  ${bullet(1030, 400, PINK, '画面元素完整性')}
  ${bullet(1030, 470, PINK, '内容是否符合需求主题')}
  ${bullet(1030, 540, PINK, '时长与分辨率是否达标')}
  ${bullet(1030, 610, PINK, '文字 / 标注是否准确无遮挡')}
`)}
<text x="960" y="900" font-family="${FONT}" font-size="30" fill="#ffc3d2" text-anchor="middle">输出「符合 / 不符合 + 依据」→ 供 Leader 决定交付或返工</text>
${skill(700, 730, 'qwen3-vl-visual-inspection', PINK)}
</svg>`;

// S7 协作关系图
slides.s7 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('协作关系', 'Assignment 指派 · Aggregation 归属 · Association 使用', 7, PURPLE)}
${flowBox(140, 230, 460, 90, '媒体艺术家', LBLUE, 'media-artist-001')}
${arrow(370, 320, 370, 400, PURPLE)}
<text x="380" y="370" font-family="${FONT}" font-size="25" fill="#b9a6ff" text-anchor="middle">Assignment 指派</text>
${flowBox(140, 400, 460, 90, '图片视频生成 Role', PURPLE, 'media-role-001')}
${arrow(250, 490, 250, 620, '#5b8cff')}
${arrow(400, 490, 720, 620, '#5ee0a0')}
${arrow(520, 490, 1160, 620, '#ff7a9c')}
<text x="230" y="565" font-family="${FONT}" font-size="24" fill="#9fb0cf">uses</text>
${flowBox(140, 620, 360, 90, '图像生成 Skill', LBLUE, 'media-skill-001')}
${flowBox(560, 620, 360, 90, '视频生成 Skill', GREEN, 'media-video-skill-001')}
${flowBox(980, 620, 360, 90, '视觉验收 Skill', PINK, 'media-vl-skill-001')}

${flowBox(1380, 230, 400, 90, '视频制作Leader', AMBER, 'video-leader-001')}
${arrow(1450, 320, 1320, 400, AMBER)}
${arrow(1650, 320, 1700, 400, AMBER)}
<text x="1390" y="375" font-family="${FONT}" font-size="24" fill="#ffd9a0">Aggregation 归属</text>
<text x="1710" y="375" font-family="${FONT}" font-size="24" fill="#ffd9a0">Aggregation 归属</text>
${flowBox(1180, 400, 280, 90, '视频制作', GREEN, 'video-producer-001')}
${flowBox(1580, 400, 280, 90, '视频审核', PINK, 'video-reviewer-001')}
${arrow(1240, 490, 740, 620, '#5ee0a0')}
${arrow(1700, 490, 1180, 620, '#ff7a9c')}
<text x="960" y="545" font-family="${FONT}" font-size="24" fill="#a8ecc9" text-anchor="middle">uses 视频生成</text>
<text x="1500" y="585" font-family="${FONT}" font-size="24" fill="#ffc3d2" text-anchor="middle">uses 视觉验收</text>
</svg>`;

// S8 业务流程
slides.s8 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('主要业务流程 · 视频制作流程', '需求 → 指派制作 → 指派验收 → 交付 / 返工', 8, ORANGE)}
${flowBox(730, 230, 460, 80, '需求提出者', '#8fb4ff', '提出主题/时长/风格需求')}
${arrow(960, 310, 960, 380)}
${flowBox(730, 380, 460, 80, 'Leader 解析需求', AMBER, '视频制作Leader')}
${arrow(960, 460, 960, 530)}
${flowBox(730, 530, 460, 80, '指派 视频制作', GREEN, 'DashScope 异步生成 MP4')}
${arrow(960, 610, 960, 680)}
${flowBox(730, 680, 460, 80, '指派 视频审核', PINK, 'qwen3-vl-plus 抽帧核对')}
${arrow(1190, 720, 1300, 720, '#5ee0a0')}
<text x="1245" y="705" font-family="${FONT}" font-size="26" fill="#a8ecc9" text-anchor="middle">通过</text>
${flowBox(1300, 680, 460, 80, 'Leader 交付 MP4', AMBER, '向需求提出者交付')}
<path d="M730 720 L560 720 L560 570 L714 570" fill="none" stroke="#ff8a5c" stroke-width="4"/>
<polygon points="730 570 710 562 710 578" fill="#ff8a5c"/>
<text x="570" y="700" font-family="${FONT}" font-size="26" fill="#ff8a5c" text-anchor="middle">不通过 → 返工重制</text>
<text x="960" y="900" font-family="${FONT}" font-size="30" fill="#ffc3a0" text-anchor="middle">媒体创作流程：需求 → 图像/视频生成 → 视觉验收迭代 → 输出 docs/diagrams/</text>
</svg>`;

// S9 结尾
slides.s9 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('总结', '4 个业务角色 · 明确的能力边界与协作关系', 9, BLUE)}
${tag(150, 300, '媒体艺术家', LBLUE)}
${tag(620, 300, '视频制作Leader', AMBER)}
${tag(1090, 300, '视频制作', GREEN)}
${tag(1560, 300, '视频审核', PINK)}
<text x="960" y="500" font-family="${FONT}" font-size="34" fill="#c7d2e8" text-anchor="middle">共同支撑 deepresearch 的媒体与视频高效交付</text>
<text x="960" y="620" font-family="${FONT}" font-size="30" fill="#9fb0cf" text-anchor="middle">梳理文档：docs/diagrams/actor-explainer/00-ACTOR梳理与协作关系.md</text>
<text x="960" y="760" font-family="${FONT}" font-size="60" font-weight="bold" fill="#7fd1ff" text-anchor="middle">谢谢观看</text>
</svg>`;

// ---------- 渲染 ----------
(async () => {
  for (const [key, svg] of Object.entries(slides)) {
    const svgPath = path.join(SLIDE_DIR, `${key}.svg`);
    const pngPath = path.join(SLIDE_DIR, `${key}.png`);
    fs.writeFileSync(svgPath, svg, 'utf8');
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log(`OK ${key}.png`);
  }
  console.log('All slides generated.');
})().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
