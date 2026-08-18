#!/usr/bin/env node
/**
 * Acceptance test for Work Package 2001
 * 「对 gpt-researcher 的 Agent 行为进行全量建模」
 *
 * GIVEN  工作包「对 gpt-researcher 的 Agent 行为进行全量建模」已被领取并产出模型交付物
 * WHEN   验收方读取意图架构图谱 design/KG/SystemArchitecture.json
 * THEN   图谱从外部可观测地覆盖 gpt-researcher 的两条 Agent 主线：
 *        1) 单智能体系统 (gpt_researcher/)：GPTResearcher 编排器 + 6 类研究技能组件；
 *        2) 多智能体协作系统 (multi_agents/)：ChiefEditorAgent 编排器 + 9 类协作 Agent；
 *        3) 两条端到端工作流（单智能体研究-报告流程、多智能体 LangGraph 工作流）
 *           与章节草稿评审修订子工作流，且关键步骤之间存在 Triggering 流转边；
 *        4) 关键数据对象（研究上下文/报告/ResearchState/DraftState）；
 *        5) 每个 Agent 组件的描述均映射到 gpt-researcher 源文件路径。
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

function byName(elements, name) {
  return elements.find((e) => e.name === name);
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

  // 1) Work Package exists and owns an acceptance test pointing at this file.
  const wp = byName(elements, '对 gpt-researcher 的 Agent 行为进行全量建模');
  record('工作包「对 gpt-researcher 的 Agent 行为进行全量建模」存在', !!wp);
  if (wp) {
    const tc = (wp.testcases || []).find((t) => t.type === 'Acceptance Test');
    record('工作包挂载可执行验收用例', !!tc);
    if (tc) {
      const refersThisFile = (tc.acceptanceCriteria || '').includes('test-gpt-researcher-agent-model.js');
      record('验收用例指向本测试文件', refersThisFile);
      const gwt = (tc.description || '');
      const hasGwt = gwt.includes('GIVEN') && gwt.includes('WHEN') && gwt.includes('THEN');
      record('验收用例采用 GIVEN-WHEN-THEN 格式', hasGwt);
    }
  }

  // 2) Two subsystems grouped under the model root.
  record('根分组「gpt-researcher Agent 行为模型」存在', !!byName(elements, 'gpt-researcher Agent 行为模型'));
  record('子系统「GPTResearcher 单智能体系统」存在', !!byName(elements, 'GPTResearcher 单智能体系统'));
  record('子系统「多智能体协作系统」存在', !!byName(elements, '多智能体协作系统'));

  // 3) Single-agent orchestrator + skill components.
  const singleAgents = [
    'GPTResearcher',
    'ResearchConductor',
    'ReportGenerator',
    'SourceCurator',
    'ContextManager',
    'DeepResearchSkill',
    'BrowserManager',
    'ImageGenerator',
  ];
  for (const name of singleAgents) {
    const el = byName(elements, name);
    record(`单智能体组件「${name}」存在`, !!el);
    if (el) {
      const desc = el.description || '';
      record(
        `单智能体组件「${name}」描述含源文件路径`,
        /gpt_researcher\/|gpt_researcher\\/.test(desc),
        desc.slice(0, 40)
      );
    }
  }

  // 4) Multi-agent orchestration + collaboration agents.
  const multiAgents = [
    'ChiefEditorAgent',
    'EditorAgent',
    'ResearchAgent',
    'WriterAgent',
    'ReviewerAgent',
    'ReviserAgent',
    'FactCheckerAgent',
    'HumanAgent',
    'PublisherAgent',
    'VisualizerAgent',
  ];
  for (const name of multiAgents) {
    const el = byName(elements, name);
    record(`多智能体组件「${name}」存在`, !!el);
    if (el) {
      const desc = el.description || '';
      record(
        `多智能体组件「${name}」描述含源文件路径`,
        /multi_agents\/|multi_agents\\/.test(desc),
        desc.slice(0, 40)
      );
    }
  }

  // 5) Workflows + sub-workflow.
  for (const name of ['单智能体研究-报告流程', '多智能体 LangGraph 工作流', '章节草稿评审修订子工作流']) {
    record(`工作流「${name}」存在`, !!byName(elements, name));
  }

  // 6) Key data objects.
  for (const name of ['研究上下文', '研究来源', '报告', 'ResearchState', 'DraftState']) {
    record(`数据对象「${name}」存在`, !!byName(elements, name));
  }

  // 7) Triggering edges exist for both main flows.
  const triggerPairs = [
    ['plan_research 规划研究子查询', 'conduct_research 按来源执行检索'],
    ['conduct_research 按来源执行检索', 'curate_sources 来源策展'],
    ['curate_sources 来源策展', 'write_report 撰写报告'],
    ['run_initial_research 初始研究', 'plan_research 规划章节大纲'],
    ['run_parallel_research 并行章节研究', 'write_sections 撰写章节'],
    ['write_sections 撰写章节', 'check_facts 事实核查'],
    ['run_depth_research 章节深度研究', 'review_draft 评审草稿'],
    ['review_draft 评审草稿', 'revise_draft 修订草稿'],
  ];
  const relIndex = new Map();
  for (const r of relationships) {
    const key = `${r.source_name}->${r.target_name}:${r.type}`;
    relIndex.set(key, r);
  }
  const nameToId = new Map(elements.map((e) => [e.name, e.id]));
  for (const [src, dst] of triggerPairs) {
    const s = nameToId.get(src);
    const d = nameToId.get(dst);
    const found = s && d && [...relIndex.values()].some(
      (r) => r.source_id === s && r.target_id === d && r.type === 'Triggering'
    );
    record(`流转边「${src} → ${dst}」存在`, !!found);
  }

  // 8) The AgentCapabilities view hosts the root groupings, and layered
  //    sub-views host the lower-level elements.
  const agentView = views.find((v) => v.view_name === 'AgentCapabilities');
  record('视图「AgentCapabilities」存在', !!agentView);
  if (agentView) {
    const included = agentView.included_elements || [];
    const rootNames = ['gpt-researcher Agent 行为模型', 'GPTResearcher 单智能体系统', '多智能体协作系统'];
    const hasRoots = rootNames.every((n) => included.includes(nameToId.get(n)));
    record('视图「AgentCapabilities」承载三个根分组', hasRoots);
  }

  const subViews = views.filter((v) => /单智能体|多智能体/.test(v.view_name));
  record('存在分层子视图（≥4 个）', subViews.length >= 4, `子视图数: ${subViews.length}`);
  const totalViewElements = views.reduce(
    (sum, v) => sum + (v.included_elements || []).length,
    0
  );
  record('模型元素已分布到各视图（视图元素总数 ≥ 50）', totalViewElements >= 50, `总数: ${totalViewElements}`);

  if (failures.length === 0) {
    console.log(`[ACCEPT] PASS — 元素 ${elements.length} 个, 关系 ${relationships.length} 条, 视图 ${views.length} 个`);
    process.exit(0);
  }

  console.error(`[ACCEPT] FAIL — ${failures.length} 处失败: ${failures.join(', ')}`);
  process.exit(1);
}

main();
