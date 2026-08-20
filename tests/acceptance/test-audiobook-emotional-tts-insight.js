#!/usr/bin/env node
/**
 * Acceptance test for Work Package 2013
 * 「洞察用户可定义的有声书与真人有感情朗读」
 *
 * GIVEN  工作包「洞察用户可定义的有声书与真人有感情朗读」已被领取并产出洞察交付物
 * WHEN   验收方打开洞察交付物文档 docs/insights/有声书-真人有感情朗读-洞察.md
 * THEN   文档满足以下外部可观测的业务验收语义：
 *        1) 包含 SMART（S/M/A/R/T）问题定义；
 *        2) 包含至少 3 层的 MECE 决策树；
 *        3) 每个假设具备可证伪条件，并携带唯一三态结论（supported/refuted/undetermined）；
 *        4) 每个假设结论均给出 URL 链接与原文段落来源。
 *
 * 退出码：0 = 通过；1 = 失败。仅依赖 Node 内置模块。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = process.env.ARGO_REPO_ROOT
  || process.env.WORKSPACE_FOLDER
  || path.resolve(__dirname, '..', '..');

const DOC_PATH = path.join(
  repoRoot,
  'docs',
  'insights',
  '有声书-真人有感情朗读-洞察.md'
);

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
  console.log(`[ACCEPT] deliverable: ${DOC_PATH}`);

  let text;
  try {
    text = fs.readFileSync(DOC_PATH, 'utf8');
  } catch (err) {
    console.error(`  FAIL  deliverable-document-exists — ${err.message}`);
    console.error('[ACCEPT] FAIL');
    process.exit(1);
  }

  // 1) SMART problem definition
  const smartTokens = ['Specific', 'Measurable', 'Achievable', 'Relevant', 'Time-bound'];
  const missing = smartTokens.filter(token => !text.includes(token));
  record('SMART 问题定义（S/M/A/R/T 五要素齐全）', missing.length === 0, `缺失: ${missing.join(', ') || '无'}`);

  // 2) MECE decision tree with at least 3 layers
  const layerSet = new Set();
  const layerRe = /第(\d+)层/g;
  let lm;
  while ((lm = layerRe.exec(text)) !== null) layerSet.add(lm[1]);
  record('决策树至少 3 层', layerSet.size >= 3, `实际层数: ${layerSet.size}`);

  // 3) falsifiable hypotheses, each with exactly one three-state verdict + source
  const headerRe = /^### 假设 H(\d+)[^\n]*$/gm;
  const headers = [];
  let hm;
  while ((hm = headerRe.exec(text)) !== null) headers.push({ num: hm[1], index: hm.index });

  record('至少存在 1 个假设', headers.length >= 1, `假设数: ${headers.length}`);

  const verdictRe = /验证结论[：:]\s*(supported|refuted|undetermined)/;
  const urlRe = /https?:\/\//;
  const statesUsed = new Set();

  for (let i = 0; i < headers.length; i += 1) {
    const start = headers[i].index;
    const end = i + 1 < headers.length ? headers[i + 1].index : text.length;
    const body = text.slice(start, end);
    const label = `H${headers[i].num}`;

    if (!body.includes('可证伪条件')) {
      record(`${label}-可证伪条件`, false, '缺少「可证伪条件」');
    }

    const verdictMatch = body.match(verdictRe);
    if (!verdictMatch) {
      record(`${label}-唯一三态结论`, false, '缺少「验证结论：supported|refuted|undetermined」');
    } else {
      statesUsed.add(verdictMatch[1]);
    }

    if (!urlRe.test(body)) {
      record(`${label}-URL来源`, false, '缺少 URL 链接');
    }

    if (!body.includes('原文段落')) {
      record(`${label}-原文段落来源`, false, '缺少「原文段落」');
    }
  }

  // 4) every conclusion carries a URL citation (coarse global invariant)
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  record('每个假设结论均有 URL 来源（URL 总数 >= 假设数）', urlCount >= headers.length, `URL 数: ${urlCount}, 假设数: ${headers.length}`);

  if (failures.length === 0) {
    console.log(`[ACCEPT] PASS — 假设 ${headers.length} 个, 决策树 ${layerSet.size} 层, 结论三态: ${[...statesUsed].join(',') || '无'}, URL ${urlCount} 个`);
    process.exit(0);
  }

  console.error(`[ACCEPT] FAIL — ${failures.length} 处失败: ${failures.join(', ')}`);
  process.exit(1);
}

main();
