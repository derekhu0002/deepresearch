#!/usr/bin/env node
/**
 * Acceptance test for Skill element 3001
 * 「market-research 市场研究技能」
 *
 * GIVEN  已将 D:/Projects/Argo/.cursor/skills/market-research/SKILL.md 纳入意图架构图谱
 * WHEN   验收方读取意图架构图谱 design/KG/SystemArchitecture.json
 * THEN   图谱从外部可观测地包含该技能：
 *        1) 存在名为 market-research、类型为 Skill 的元素；
 *        2) 其描述涵盖研究标准（来源 / 时效 / 反面证据 / 决策导向 / 事实-推断-建议区分）
 *           与研究模式（投资人尽调 / 竞争分析 / 市场规模 / 技术供应商）；
 *        3) 元素标注了技能来源文件路径（source 属性）；
 *        4) 该元素挂载于 AgentCapabilities 视图；
 *        5) 该元素与「所有洞察结论都必须给出论据来源」约束存在 Association 关联；
 *        6) 该元素挂载了指向本测试文件、且采用 GIVEN-WHEN-THEN 格式的验收用例。
 *
 * 退出码：0 = 通过；1 = 失败。仅依赖 Node 内置模块。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = process.env.ARGO_REPO_ROOT
  || process.env.WORKSPACE_FOLDER
  || path.resolve(__dirname, '..', '..');

const GRAPH_PATH = path.join(repoRoot, 'design', 'KG', 'SystemArchitecture.json');

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
  console.log(`[ACCEPT] graph: ${GRAPH_PATH}`);

  let graph;
  try {
    graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
  } catch (err) {
    console.error(`  FAIL  graph-loadable — ${err.message}`);
    process.exit(1);
  }

  const elements = graph.elements || [];
  const relationships = graph.relationships || [];
  const views = graph.views || [];

  const skill = elements.find((e) => e.name === 'market-research');
  record('元素「market-research」存在', !!skill);
  if (!skill) {
    console.error(`[ACCEPT] FAIL — 未找到 market-research 元素`);
    process.exit(1);
  }

  record('元素类型为 Skill', skill.type === 'Skill', `type=${skill.type}`);

  const desc = skill.description || '';
  const stdMarkers = ['来源', '时效', '反面证据', '决策', '事实', '推断', '建议'];
  const missingStd = stdMarkers.filter((m) => !desc.includes(m));
  record(
    '描述涵盖研究标准（来源/时效/反面证据/决策导向/事实-推断-建议区分）',
    missingStd.length === 0,
    missingStd.length ? `缺失: ${missingStd.join(',')}` : ''
  );

  const modeMarkers = ['尽职调查', '竞争分析', '市场规模', '供应商'];
  const missingMode = modeMarkers.filter((m) => !desc.includes(m));
  record(
    '描述涵盖研究模式（投资人尽调/竞争分析/市场规模/技术供应商）',
    missingMode.length === 0,
    missingMode.length ? `缺失: ${missingMode.join(',')}` : ''
  );

  const sourceAttr = (skill.attributes || []).find((a) => a.name === 'source');
  record(
    '元素标注技能来源文件路径',
    !!sourceAttr && /SKILL\.md/.test(sourceAttr.value || ''),
    sourceAttr ? sourceAttr.value : '无 source 属性'
  );

  const nameToId = new Map(elements.map((e) => [e.name, e.id]));
  const agentView = views.find((v) => v.view_name === 'AgentCapabilities');
  record('视图「AgentCapabilities」存在', !!agentView);
  if (agentView) {
    record(
      '元素挂载于 AgentCapabilities 视图',
      (agentView.included_elements || []).includes(skill.id)
    );
  }

  const sourceConstraintId = nameToId.get('所有洞察结论都必须给出论据来源');
  const assoc = relationships.find(
    (r) => r.source_id === skill.id
      && r.target_id === sourceConstraintId
      && r.type === 'Association'
  );
  record(
    '与「所有洞察结论都必须给出论据来源」存在 Association 关联',
    !!assoc,
    assoc ? assoc.statement : '无关联'
  );

  const tc = (skill.testcases || []).find((t) => t.type === 'Acceptance Test');
  record('元素挂载可执行验收用例', !!tc);
  if (tc) {
    const refersThisFile = (tc.acceptanceCriteria || '').includes('test-market-research-skill.js');
    record('验收用例指向本测试文件', refersThisFile);
    const gwt = (tc.description || '');
    const hasGwt = gwt.includes('GIVEN') && gwt.includes('WHEN') && gwt.includes('THEN');
    record('验收用例采用 GIVEN-WHEN-THEN 格式', hasGwt);
  }

  if (failures.length === 0) {
    console.log(`[ACCEPT] PASS — market-research 技能已纳入意图架构图谱`);
    process.exit(0);
  }

  console.error(`[ACCEPT] FAIL — ${failures.length} 处失败: ${failures.join(', ')}`);
  process.exit(1);
}

main();
