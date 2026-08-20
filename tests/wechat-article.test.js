'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

/**
 * Acceptance test for WeChat article
 * 「有感情朗读」的有声书，AI 为什么还做不到？
 *
 * GIVEN  公众号发布员把洞察报告《洞察：用户可定义的有声书与「真人有感情朗读」》
 *        （docs/insights/有声书-真人有感情朗读-洞察.md）改写为微信公众号文章
 * WHEN   验收方打开 docs/insights/有声书-真人有感情朗读-洞察.wechat.md
 * THEN   文章满足公众号发布的外部可观测语义：
 *        1) YAML frontmatter 含 title / author / digest；
 *        2) 正文忠实传达源文档核心结论（音色可定义已成熟 / 自然度达人类水平 /
 *           情感需显式控制 / 根因排序 情感>合规>音色）；
 *        3) 关键结论可追溯到源文档 URL（ElevenLabs / GPT-SoVITS / ChatTTS /
 *           StyleTTS 2 / NaturalSpeech 3 / Azure SSML）。
 *
 * 运行：node --test tests/wechat-article.test.js
 * 退出码：0 = 通过；1 = 失败。仅依赖 Node 内置模块。
 */

const repoRoot = process.env.ARGO_REPO_ROOT
  || process.env.WORKSPACE_FOLDER
  || path.resolve(__dirname, '..');

const ARTICLE_PATH = path.join(
  repoRoot,
  'docs',
  'insights',
  '有声书-真人有感情朗读-洞察.wechat.md'
);

function readArticle() {
  return fs.readFileSync(ARTICLE_PATH, 'utf8');
}

test('GIVEN-WHEN-THEN 验收：微信文章文件存在', () => {
  assert.ok(fs.existsSync(ARTICLE_PATH), `应存在 ${ARTICLE_PATH}`);
});

test('frontmatter 含 title / author / digest', () => {
  const text = readArticle();
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(fm, '应有 YAML frontmatter');
  const frontmatter = fm[1];
  for (const key of ['title', 'author', 'digest']) {
    assert.match(
      frontmatter,
      new RegExp(`^${key}:\\s*.+`, 'm'),
      `frontmatter 应含 ${key}`
    );
  }
  assert.match(frontmatter, /banner_path|banner|thumb_media_id/, 'frontmatter 应提供封面图（banner_path / banner / thumb_media_id）');
});

test('正文忠实传达源文档核心结论', () => {
  const text = readArticle();
  const body = text.replace(/^---[\s\S]*?---/, '');

  // 结论1：音色可定义已成熟
  assert.match(body, /5\s*秒|零样本克隆|音色/, '应传达「音色可定义已成熟」');
  // 结论2：自然度达/超人类水平
  assert.match(body, /人类录音|人类水平|超越/, '应传达「朗读自然度达人类水平」');
  // 结论3：情感仍需显式控制
  assert.match(body, /显式|标注|SSML|\[laugh\]/, '应传达「有感情朗读仍需显式控制」');
  // 结论5：根因排序 情感 > 合规 > 音色
  assert.match(body, /情感.*合规.*音色|情感\s*>\s*合规\s*>\s*音色/, '应传达根因排序「情感 > 合规 > 音色」');
  assert.match(body, /CC BY-NC/, '应提及非商用许可合规约束');
});

test('关键结论可追溯到源文档 URL', () => {
  const body = readArticle();
  const requiredUrls = [
    'https://github.com/RVC-Boss/GPT-SoVITS',
    'https://elevenlabs.io/',
    'https://github.com/2noise/ChatTTS',
    'https://arxiv.org/abs/2306.07691',
    'https://arxiv.org/abs/2403.03100',
    'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice',
  ];
  for (const url of requiredUrls) {
    assert.ok(body.includes(url), `正文应引用来源 URL：${url}`);
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
 * Acceptance test for WeChat article
 * 「游戏场景永不重复？程序化内容生成正在重塑游戏世界」
 *
 * GIVEN  公众号发布员把洞察报告《自由生成的游戏——程序化内容生成（PCG）的现状与技术趋势》
 *        （docs/insights/自由生成游戏-程序化内容生成-洞察.md）改写为微信公众号文章
 * WHEN   验收方打开 docs/insights/自由生成游戏-程序化内容生成-洞察.wechat.md
 * THEN   文章满足公众号发布的外部可观测语义：
 *        1) YAML frontmatter 含 title / author / digest；
 *        2) 正文忠实传达源文档核心结论（三层技术栈 / WFC 已被商业游戏采用 /
 *           四种产品形态 / AI 原生生成 / 三个趋势判断）；
 *        3) 关键结论可追溯到源文档 URL（FastNoiseLite / WaveFunctionCollapse /
 *           MarkovJunior / Veloren / Cultivation World Simulator / img2threejs）。
 *
 * 运行：node --test tests/wechat-article.test.js
 * 退出码：0 = 通过；1 = 失败。仅依赖 Node 内置模块。
 * ─────────────────────────────────────────────────────────────────────────── */

const PCG_ARTICLE_PATH = path.join(
  repoRoot,
  'docs',
  'insights',
  '自由生成游戏-程序化内容生成-洞察.wechat.md'
);

function readPcgArticle() {
  return fs.readFileSync(PCG_ARTICLE_PATH, 'utf8');
}

test('PCG | GIVEN-WHEN-THEN 验收：微信文章文件存在', () => {
  assert.ok(fs.existsSync(PCG_ARTICLE_PATH), `应存在 ${PCG_ARTICLE_PATH}`);
});

test('PCG | frontmatter 含 title / author / digest', () => {
  const text = readPcgArticle();
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(fm, '应有 YAML frontmatter');
  const frontmatter = fm[1];
  for (const key of ['title', 'author', 'digest']) {
    assert.match(
      frontmatter,
      new RegExp(`^${key}:\\s*.+`, 'm'),
      `frontmatter 应含 ${key}`
    );
  }
});

test('PCG | 正文忠实传达源文档核心结论', () => {
  const text = readPcgArticle();
  const body = text.replace(/^---[\s\S]*?---/, '');

  // 结论1：三层技术栈（噪声 / 约束求解 / AI 驱动）
  assert.match(body, /噪声|Perlin|FastNoiseLite/, '应传达「底层：噪声算法」');
  assert.match(body, /WaveFunctionCollapse|WFC|约束/, '应传达「中层：约束求解」');
  assert.match(body, /AI|LLM|Agent/, '应传达「上层：AI 驱动」');

  // 结论2：WFC 已被商业游戏采用
  assert.match(body, /Bad North|Caves of Qud|Townscaper|Matrix/, '应提及 WFC 的商业游戏采用案例');

  // 结论3：四种产品形态
  assert.match(body, /Roguelike|地牢/, '应提及 Roguelike 地牢探索');
  assert.match(body, /开放世界|沙盒|沙箱/, '应提及开放世界沙盒');

  // 结论4：AI 原生生成——修仙世界模拟器
  assert.match(body, /修仙|cultivation|Agent/, '应传达「AI 原生生成」方向');

  // 结论5：三个趋势判断
  assert.match(body, /基础设施|标准工具/, '应传达「约束求解已成基础设施」');
  assert.match(body, /爆发点|下一个/, '应传达「LLM 驱动是下一个爆发点」');
});

test('PCG | 关键结论可追溯到源文档 URL', () => {
  const body = readPcgArticle();
  const requiredUrls = [
    'https://github.com/Auburn/FastNoiseLite',
    'https://github.com/mxgmn/WaveFunctionCollapse',
    'https://github.com/mxgmn/MarkovJunior',
    'https://github.com/veloren/veloren',
    'https://github.com/4thfever/cultivation-world-simulator',
    'https://github.com/img2threejs/img2threejs',
  ];
  for (const url of requiredUrls) {
    assert.ok(body.includes(url), `正文应引用来源 URL：${url}`);
  }
});
