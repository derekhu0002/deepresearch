// 生成《deepresearch · Agent 组织与协作》讲解视频 13 张幻灯片（SVG → PNG）
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
const TEAL = '#4fd8c8';
const AMBER = '#ffb547';
const GREEN = '#5ee0a0';
const PINK = '#ff7a9c';
const PURPLE = '#9d7bff';
const ORANGE = '#ff8a5c';
const TOTAL = 13;

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
  <text x="${W - 100}" y="${H - 38}" font-family="${FONT}" font-size="22" fill="#5a6a85" text-anchor="end">${page} / ${TOTAL}</text>`;
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

function tag(x, y, text, color, w = 0) {
  const tw = w || text.length * 34 + 50;
  return `<rect x="${x}" y="${y}" width="${tw}" height="50" rx="10" fill="${color}" opacity="0.16" stroke="${color}" stroke-width="1.5"/>
  <text x="${x + tw / 2}" y="${y + 34}" font-family="${FONT}" font-size="25" font-weight="bold" fill="${color}" text-anchor="middle">${esc(text)}</text>`;
}

// ---------- 场景 ----------
const slides = {};

// S1 开场
slides.s1 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('deepresearch · Agent 组织与协作', '研究智能体 × 媒体/视频生产 · 全部 Agent 能力/协作/业务流程', 1, BLUE)}
<rect x="300" y="320" width="1320" height="210" rx="24" fill="#131b2e" stroke="#2a3a55" stroke-width="2"/>
<text x="960" y="410" font-family="${FONT}" font-size="54" font-weight="bold" fill="#ffffff" text-anchor="middle">梳理全部 Agent</text>
<text x="960" y="486" font-family="${FONT}" font-size="32" fill="#9fb0cf" text-anchor="middle">研究智能体（单/多智能体） · 媒体/视频生产 Actor</text>
${tag(560, 620, 'gpt-researcher Agent 行为模型', TEAL, 420)}
${tag(1010, 620, 'AgentOrganization 生产组织', AMBER, 420)}
<text x="960" y="780" font-family="${FONT}" font-size="30" fill="#7fd1ff" text-anchor="middle">数据源：意图架构图谱 design/KG/SystemArchitecture.json</text>
<text x="960" y="900" font-family="${FONT}" font-size="28" fill="#5a6a85" text-anchor="middle">2026-08-23</text>
</svg>`;

// S2 Agent 全景
slides.s2 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('Agent 全景', '两大体系：gpt-researcher Agent 行为模型 + AgentOrganization 生产组织', 2, BLUE)}
${flowBox(700, 220, 520, 80, 'deepresearch Agent 体系', BLUE, '意图图谱')}
${arrow(840, 300, 460, 390)}
${arrow(1080, 300, 1460, 390)}
${flowBox(200, 390, 520, 90, 'gpt-researcher Agent 行为模型', TEAL, '2010 · 研究智能体')}
${flowBox(1200, 390, 520, 90, 'AgentOrganization', AMBER, '1962 · 生产 Actor')}
${arrow(460, 480, 300, 570)}
${arrow(460, 480, 640, 570)}
${arrow(1380, 480, 1260, 570)}
${arrow(1500, 480, 1560, 570)}
${flowBox(120, 570, 320, 90, '单智能体系统', TEAL, '2011 · GPTResearcher')}
${flowBox(480, 570, 360, 90, '多智能体协作系统', PURPLE, '2012 · 10 角色')}
${flowBox(1160, 570, 280, 90, '媒体创作团队', LBLUE, '媒体艺术家')}
${flowBox(1500, 570, 300, 90, '视频制作团队', AMBER, 'Leader/制作/审核')}
${arrow(420, 660, 420, 760)}
${arrow(660, 660, 660, 760)}
${flowBox(120, 760, 320, 90, 'GPTResearcher', TEAL, 'choose/plan/conduct/write')}
${flowBox(480, 760, 360, 130, '10 角色团队', PURPLE, 'ChiefEditor/Editor/Research/Writer/Reviewer/Reviser/FactChecker/Human/Visualizer/Publisher')}
<text x="960" y="850" font-family="${FONT}" font-size="26" fill="#9fb0cf" text-anchor="middle">生产 Actor：媒体艺术家 / 视频制作Leader / 视频制作 / 视频审核（4 个 Business Actor）</text>
</svg>`;

// S3 单智能体系统 GPTResearcher
slides.s3 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('单智能体系统 GPTResearcher', 'gpt-researcher Agent 行为模型 · 从查询到报告的全流程', 3, TEAL)}
${card(140, 260, 820, 620, '行为函数（能力）', TEAL, `
  ${bullet(170, 380, TEAL, 'choose_agent 选择智能体角色')}
  ${bullet(170, 450, TEAL, 'plan_research 规划研究子查询')}
  ${bullet(170, 520, TEAL, 'conduct_research 按来源执行检索')}
  ${bullet(170, 590, TEAL, 'curate_sources 来源可信度策展')}
  ${bullet(170, 660, TEAL, 'write_report 撰写报告')}
  ${bullet(170, 730, TEAL, 'deep_research 广度×深度递归下钻')}
`)}
${card(1000, 260, 780, 300, '数据对象', TEAL, `
  ${bullet(1030, 380, TEAL, '研究上下文 · 研究来源')}
  ${bullet(1030, 450, TEAL, '报告（Markdown）· 子主题')}
`)}
${card(1000, 600, 780, 280, '业务流程：单智能体研究-报告流程', TEAL, `
  <text x="1030" y="700" font-family="${FONT}" font-size="28" fill="#c7d2e8">choose → plan → conduct → curate → write_report</text>
  <text x="1030" y="760" font-family="${FONT}" font-size="24" fill="#93a4c2">（deep_research 分支独立下钻；可选图片预生成）</text>
`)}
</svg>`;

// S4 多智能体协作团队总览
slides.s4 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('多智能体协作团队', '2012 · 10 个角色由 LangGraph StateGraph 统一编排', 4, PURPLE)}
${flowBox(600, 230, 720, 90, 'LangGraph StateGraph 编排', PURPLE, 'ResearchState 共享状态')}
${arrow(960, 320, 960, 400)}
${flowBox(600, 400, 720, 70, '研究团队 · 10 个 Application Component', PURPLE, 'multi_agents/agents/')}
${tag(150, 520, 'ChiefEditor 主编', PURPLE)}
${tag(470, 520, 'Editor 编辑', PURPLE)}
${tag(790, 520, 'Research 研究员', PURPLE)}
${tag(1110, 520, 'Writer 写手', PURPLE)}
${tag(1430, 520, 'Reviewer 评审', PURPLE)}
${tag(150, 620, 'Reviser 修订', PURPLE)}
${tag(470, 620, 'FactChecker 核查', PURPLE)}
${tag(790, 620, 'Human 人工', PURPLE)}
${tag(1110, 620, 'Visualizer 图表', PURPLE)}
${tag(1430, 620, 'Publisher 发布', PURPLE)}
<text x="960" y="790" font-family="${FONT}" font-size="30" fill="#c7d2e8" text-anchor="middle">主编编排 → 编辑规划 → 研究/撰写 → 评审修订 → 核查 → 人工 → 图表 → 发布</text>
<text x="960" y="880" font-family="${FONT}" font-size="26" fill="#9fb0cf" text-anchor="middle">每个角色的能力与源码路径见意图图谱（multi_agents/agents/*.py）</text>
</svg>`;

// S5 编排与规划
slides.s5 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('编排与规划', 'ChiefEditorAgent · EditorAgent', 5, PURPLE)}
${card(160, 270, 800, 580, 'ChiefEditorAgent 主编', PURPLE, `
  ${bullet(190, 400, PURPLE, 'run_research_task 编排研究任务')}
  ${bullet(190, 470, PURPLE, '构建 LangGraph StateGraph')}
  ${bullet(190, 540, PURPLE, '以 ResearchState 承载顶层状态')}
  ${bullet(190, 610, PURPLE, '源码 orchestrator.py')}
`)}
${card(1000, 270, 800, 580, 'EditorAgent 编辑', PURPLE, `
  ${bullet(1030, 400, PURPLE, 'run_parallel_research 并行章节研究')}
  ${bullet(1030, 470, PURPLE, '规划章节大纲（≥3 章）')}
  ${bullet(1030, 540, PURPLE, '为各章节并行启动子工作流')}
  ${bullet(1030, 610, PURPLE, '源码 editor.py')}
`)}
<text x="960" y="910" font-family="${FONT}" font-size="28" fill="#b9a6ff" text-anchor="middle">编排 → 规划 → 并行研究（research → review → revise）</text>
</svg>`;

// S6 研究与撰写
slides.s6 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('研究与撰写', 'ResearchAgent · WriterAgent', 6, BLUE)}
${card(160, 270, 800, 580, 'ResearchAgent 研究员', BLUE, `
  ${bullet(190, 400, BLUE, 'run_initial_research 初始研究')}
  ${bullet(190, 470, BLUE, 'run_depth_research 章节深度研究')}
  ${bullet(190, 540, BLUE, '包装单智能体 GPTResearcher')}
  ${bullet(190, 610, BLUE, '采集带来源证据（URL + 原文段落）')}
`)}
${card(1000, 270, 800, 580, 'WriterAgent 写手', BLUE, `
  ${bullet(1030, 400, BLUE, '撰写章节内容')}
  ${bullet(1030, 470, BLUE, '修订章节标题')}
  ${bullet(1030, 540, BLUE, '基于研究上下文落稿')}
  ${bullet(1030, 610, BLUE, '源码 writer.py')}
`)}
<text x="960" y="910" font-family="${FONT}" font-size="28" fill="#9fb0cf" text-anchor="middle">研究产出证据 → 写手落稿 → 交质量保障关卡</text>
</svg>`;

// S7 质量保障
slides.s7 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('质量保障', 'ReviewerAgent ↔ ReviserAgent 循环 + FactCheckerAgent 核查', 7, GREEN)}
${flowBox(240, 300, 360, 90, 'ReviewerAgent 评审', GREEN, 'review_draft 按规范评审')}
${arrow(600, 345, 760, 345, '#5ee0a0')}
${flowBox(760, 300, 360, 90, 'ReviserAgent 修订', GREEN, 'revise_draft 按意见修改')}
<path d="M760 390 L760 460 L960 460 L960 430" fill="none" stroke="#5ee0a0" stroke-width="4"/>
<polygon points="960 414 952 434 968 434" fill="#5ee0a0"/>
<text x="960" y="490" font-family="${FONT}" font-size="24" fill="#a8ecc9" text-anchor="middle">循环直至接受</text>
${flowBox(1380, 300, 340, 90, 'FactCheckerAgent 核查', GREEN, '核对事实与幻觉')}
${card(240, 620, 700, 220, '评审要点', GREEN, `
  ${bullet(270, 710, GREEN, '按 guidelines 评审草稿')}
  ${bullet(270, 780, GREEN, '输出修订意见')}
`)}
${card(1000, 620, 700, 220, '核查要点', GREEN, `
  ${bullet(1030, 710, GREEN, '核查事实准确性')}
  ${bullet(1030, 780, GREEN, '识别幻觉 / 无来源断言')}
`)}
</svg>`;

// S8 人工与呈现
slides.s8 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('人工与呈现', 'HumanAgent · VisualizerAgent · PublisherAgent', 8, ORANGE)}
${card(120, 280, 540, 560, 'HumanAgent 人工', ORANGE, `
  ${bullet(150, 400, ORANGE, 'review_plan 人工在环')}
  ${bullet(150, 470, ORANGE, '评审研究计划（条件分支）')}
  ${bullet(150, 540, ORANGE, '人机协作把关方向')}
`)}
${card(700, 280, 540, 560, 'VisualizerAgent 图表', ORANGE, `
  ${bullet(730, 400, ORANGE, '生成 Mermaid 图表')}
  ${bullet(730, 470, ORANGE, '将关系可视化')}
  ${bullet(730, 540, ORANGE, '辅助报告呈现')}
`)}
${card(1280, 280, 540, 560, 'PublisherAgent 发布', ORANGE, `
  ${bullet(1310, 400, ORANGE, '生成布局')}
  ${bullet(1310, 470, ORANGE, '按 pdf / docx / markdown')}
  ${bullet(1310, 540, ORANGE, '输出最终交付物')}
`)}
<text x="960" y="900" font-family="${FONT}" font-size="28" fill="#ffc3a0" text-anchor="middle">人工评审计划 → 图表化 → 多格式发布</text>
</svg>`;

// S9 多智能体工作流
slides.s9 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('多智能体 LangGraph 工作流', '2082 · 端到端编排 + 章节评审修订子工作流', 9, AMBER)}
<text x="960" y="250" font-family="${FONT}" font-size="28" fill="#ffd9a0" text-anchor="middle">端到端工作流</text>
${flowBox(70, 290, 210, 80, 'browser', AMBER, 'initial_research')}
${arrow(280, 330, 340, 330)}
${flowBox(340, 290, 210, 80, 'planner', AMBER, 'plan_research')}
${arrow(550, 330, 610, 330)}
${flowBox(610, 290, 210, 80, 'human', AMBER, 'review_plan')}
${arrow(820, 330, 880, 330)}
${flowBox(880, 290, 220, 80, 'researcher', AMBER, 'parallel')}
${arrow(1100, 330, 1160, 330)}
${flowBox(1160, 290, 180, 80, 'writer', AMBER, '撰写')}
${arrow(1340, 330, 1400, 330)}
${flowBox(1400, 290, 200, 80, 'fact_checker', AMBER, '条件')}
${arrow(1600, 330, 1650, 330)}
${flowBox(1650, 290, 200, 80, 'visualizer', AMBER, '图表')}
<text x="960" y="440" font-family="${FONT}" font-size="26" fill="#ffd9a0" text-anchor="middle">… → publisher → END</text>
<text x="960" y="560" font-family="${FONT}" font-size="28" fill="#ffd9a0" text-anchor="middle">章节草稿评审修订子工作流（2083）</text>
${flowBox(420, 600, 300, 90, 'researcher', GREEN, 'run_depth_research')}
${arrow(720, 645, 840, 645, '#5ee0a0')}
${flowBox(840, 600, 300, 90, 'reviewer', GREEN, 'review_draft')}
${arrow(1140, 645, 1260, 645, '#5ee0a0')}
${flowBox(1260, 600, 300, 90, 'reviser', GREEN, 'revise_draft')}
<path d="M1260 690 L1260 770 L1000 770 L1000 730" fill="none" stroke="#5ee0a0" stroke-width="4"/>
<polygon points="1000 714 992 734 1008 734" fill="#5ee0a0"/>
<text x="1140" y="800" font-family="${FONT}" font-size="24" fill="#a8ecc9" text-anchor="middle">循环直至接受</text>
</svg>`;

// S10 媒体艺术家
slides.s10 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('媒体艺术家 · media-artist-001', '媒体创作团队 · 图片与视频的创作执行', 10, LBLUE)}
${card(120, 260, 520, 580, '图片生成', LBLUE, `
  ${bullet(150, 380, LBLUE, 'DashScope 原生 text2image')}
  ${bullet(150, 450, LBLUE, '模型：qwen-image / plus')}
  ${bullet(150, 520, LBLUE, '异步任务轮询下载 PNG')}
  ${bullet(150, 590, LBLUE, '输出至 docs/diagrams/')}
  ${skill(150, 680, 'dashscope-media-generator', LBLUE)}
`)}
${card(700, 260, 520, 580, '视觉验收', LBLUE, `
  ${bullet(730, 380, LBLUE, 'qwen3-vl-plus 视觉模型')}
  ${bullet(730, 450, LBLUE, '画面元素完整性')}
  ${bullet(730, 520, LBLUE, '角色标注坐标定位')}
  ${bullet(730, 590, LBLUE, '确认标注无遮挡')}
  ${skill(730, 680, 'qwen3-vl-visual-inspection', LBLUE)}
`)}
${card(1280, 260, 520, 580, '视频生成', LBLUE, `
  ${bullet(1310, 380, LBLUE, '万相 wan2.7-t2v / HappyHorse')}
  ${bullet(1310, 450, LBLUE, '异步 video-synthesis')}
  ${bullet(1310, 520, LBLUE, '链接 24h 有效须转存')}
  ${bullet(1310, 590, LBLUE, '输出 MP4')}
  ${skill(1310, 680, 'dashscope-video-generator', LBLUE)}
`)}
<text x="960" y="940" font-family="${FONT}" font-size="28" fill="#9fb0cf" text-anchor="middle">媒体创作团队 · 被指派为「图片视频生成」Role · 对最终图片/视频可视质量负责</text>
</svg>`;

// S11 视频团队
slides.s11 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('视频团队', '视频制作Leader · 视频制作 · 视频审核', 11, AMBER)}
${card(120, 280, 560, 560, '视频制作Leader', AMBER, `
  ${bullet(150, 400, AMBER, '接收/解析需求')}
  ${bullet(150, 470, AMBER, '指派制作 / 指派审核')}
  ${bullet(150, 540, AMBER, '通过后交付 MP4')}
  ${bullet(150, 610, AMBER, '负最终责任')}
`)}
${card(720, 280, 540, 560, '视频制作', GREEN, `
  ${bullet(750, 400, GREEN, 'dashscope-video-generator')}
  ${bullet(750, 470, GREEN, 'happyhorse / wan2.7-t2v')}
  ${bullet(750, 540, GREEN, '异步轮询下载')}
  ${bullet(750, 610, GREEN, '链接 24h 有效')}
  ${skill(750, 700, 'dashscope-video-generator', GREEN)}
`)}
${card(1300, 280, 520, 560, '视频审核', PINK, `
  ${bullet(1330, 400, PINK, '抽取关键帧')}
  ${bullet(1330, 470, PINK, 'qwen3-vl-plus 分析')}
  ${bullet(1330, 540, PINK, '元素/主题/时长/标注')}
  ${bullet(1330, 610, PINK, '输出符合/不符合')}
  ${skill(1330, 700, 'qwen3-vl-visual-inspection', PINK)}
`)}
<text x="960" y="940" font-family="${FONT}" font-size="28" fill="#9fb0cf" text-anchor="middle">deepresearch 生产 Actor · 与研究智能体协作，将研究成果可视化交付</text>
</svg>`;

// S12 生产协作与流程
slides.s12 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('生产协作与业务流程', '媒体创作流程 + 视频制作流程 + 协作关系', 12, PINK)}
<text x="960" y="250" font-family="${FONT}" font-size="28" fill="#ffc3d2" text-anchor="middle">协作关系</text>
${flowBox(200, 280, 320, 80, '媒体艺术家', LBLUE, '媒体创作团队')}
${arrow(360, 360, 300, 430, '#9d7bff')}
${flowBox(140, 430, 320, 80, '图片视频生成 Role', PURPLE, 'Assignment 指派')}
${arrow(230, 510, 180, 590, '#5b8cff')}
${arrow(330, 510, 430, 590, '#5ee0a0')}
${arrow(430, 510, 660, 590, '#ff7a9c')}
${flowBox(60, 590, 300, 70, '图像生成 Skill', LBLUE)}
${flowBox(420, 590, 300, 70, '视觉验收 Skill', PINK)}
${flowBox(780, 590, 320, 70, '视频生成 Skill', GREEN)}
${flowBox(1420, 280, 380, 80, '视频制作Leader', AMBER, '视频制作团队')}
${arrow(1340, 360, 1220, 430, AMBER)}
${arrow(1620, 360, 1620, 430, AMBER)}
${flowBox(1100, 430, 280, 80, '视频制作', GREEN, 'Aggregation 归属')}
${flowBox(1560, 430, 280, 80, '视频审核', PINK, 'Aggregation 归属')}
<text x="960" y="740" font-family="${FONT}" font-size="28" fill="#ffc3d2" text-anchor="middle">业务流程</text>
${flowBox(140, 770, 300, 80, '媒体创作流程', LBLUE, '需求→生成→视觉验收→交付')}
${flowBox(900, 770, 300, 80, '视频制作流程', AMBER, '需求→指派制作→指派审核→交付/返工')}
</svg>`;

// S13 结尾
slides.s13 = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${header('总结', '研究智能体 + 生产 Actor · 能力边界清晰 · 协作高效', 13, BLUE)}
<text x="960" y="270" font-family="${FONT}" font-size="34" fill="#7fd1ff" text-anchor="middle">研究智能体（gpt-researcher Agent 行为模型）</text>
${tag(140, 320, 'GPTResearcher 单智能体', TEAL, 360)}
${tag(560, 320, '多智能体协作团队', PURPLE, 360)}
${tag(980, 320, '10 个角色', PURPLE, 300)}
<text x="960" y="470" font-family="${FONT}" font-size="34" fill="#ffd9a0" text-anchor="middle">生产 Actor（AgentOrganization）</text>
${tag(300, 520, '媒体艺术家', LBLUE, 300)}
${tag(660, 520, '视频制作Leader', AMBER, 340)}
${tag(1060, 520, '视频制作', GREEN, 300)}
${tag(1420, 520, '视频审核', PINK, 300)}
<text x="960" y="660" font-family="${FONT}" font-size="32" fill="#c7d2e8" text-anchor="middle">研究智能体负责证据型深度研究 · 生产 Actor 负责成果的可视化呈现</text>
<text x="960" y="740" font-family="${FONT}" font-size="28" fill="#9fb0cf" text-anchor="middle">梳理文档：docs/diagrams/actor-explainer/00-ACTOR梳理与协作关系.md</text>
<text x="960" y="880" font-family="${FONT}" font-size="60" font-weight="bold" fill="#7fd1ff" text-anchor="middle">谢谢观看</text>
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
