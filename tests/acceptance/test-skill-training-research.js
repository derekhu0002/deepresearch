#!/usr/bin/env node
/**
 * Acceptance test for Work Package skill-training-wp-001
 * 「AI Agent Skills 培训调研与大纲」（ChiefEditorAgent 承接）
 *
 * GIVEN  工作包「AI Agent Skills 培训调研与大纲」已被 ChiefEditorAgent 领取并产出交付物
 * WHEN   验收方打开交付物文档 docs/insights/skill-培训-AI-Agent-Skills-大纲.md
 * THEN   文档包含：
 *        1) 培训大纲（含面向新手的概念入门小节、面向熟悉者的业界全景/最佳实践小节）；
 *        2) 参考材料清单（含已验证权威来源：agentskills.io、Anthropic 官方 skills 仓库、
 *           MCP 官网、Anthropic Building effective agents），每个来源给出 URL；
 *        3) Skill 与 MCP/Tool/Agent 概念关系说明；
 *        4) 覆盖 Anthropic / OpenAI / Microsoft / Google 主流实现。
 *
 * 退出码：0 = 通过；1 = 失败。仅依赖 Node 内置模块。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = process.env.ARGO_REPO_ROOT
  || process.env.WORKSPACE_FOLDER
  || path.resolve(__dirname, '..', '..');

const DELIVERABLE = path.join(repoRoot, 'docs', 'insights', 'skill-培训-AI-Agent-Skills-大纲.md');

const failures = [];

function record(name, ok, detail) {
  if (ok) {
    console.log(`  PASS  ${name}`);
  } else {
    console.error(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`);
    failures.push(name);
  }
}

function main() {
  console.log(`[ACCEPT] deliverable: ${DELIVERABLE}`);

  if (!fs.existsSync(DELIVERABLE)) {
    console.error('  FAIL  交付物文档存在 — 文件不存在');
    process.exit(1);
  }
  const text = fs.readFileSync(DELIVERABLE, 'utf8');

  // 1) 培训大纲结构：新手入门 + 熟悉者进阶/业界全景
  record('包含培训大纲主标题', /培训大纲|## 二、培训大纲/.test(text));
  record('含面向新手的概念入门小节', /概念入门|什么是 Agent Skill/.test(text));
  record('含面向熟悉者的业界全景小节', /业界全景|主流实现/.test(text));
  record('含实战/动手小节', /实战|动手|演练/.test(text));
  record('含团队落地/治理小节', /治理|团队落地|分发/.test(text));

  // 2) 参考材料清单：已验证权威来源 + URL
  record('含参考材料清单', /参考材料清单|## 四、参考材料/.test(text));
  const requiredSources = [
    ['Agent Skills 开放标准官网', 'agentskills.io'],
    ['Anthropic 官方 skills 仓库', 'github.com/anthropics/skills'],
    ['MCP 官网', 'modelcontextprotocol.io'],
    ['Anthropic Building effective agents', 'building-effective-agents'],
  ];
  for (const [label, marker] of requiredSources) {
    record(`参考材料含「${label}」`, text.includes(marker));
  }
  record('参考材料带 URL（至少 8 个 http 链接）', (text.match(/https?:\/\//g) || []).length >= 8,
    `链接数: ${(text.match(/https?:\/\//g) || []).length}`);

  // 3) Skill 与 MCP/Tool/Agent 概念关系说明
  record('含 Skill 与 MCP/Tool/Agent 概念关系说明', /Skill 与 MCP\/Tool\/Agent|概念辨析|关系图|SOP/.test(text));

  // 4) 覆盖四家主流实现
  record('覆盖 Anthropic', /Anthropic/.test(text));
  record('覆盖 OpenAI', /OpenAI/.test(text));
  record('覆盖 Microsoft', /Microsoft|GitHub Copilot|VS Code/.test(text));
  record('覆盖 Google', /Google|Gemini/.test(text));

  if (failures.length === 0) {
    console.log('[ACCEPT] PASS — Skill 培训大纲与参考材料交付物验收通过');
    process.exit(0);
  }

  console.error(`[ACCEPT] FAIL — ${failures.length} 处失败: ${failures.join(', ')}`);
  process.exit(1);
}

main();
