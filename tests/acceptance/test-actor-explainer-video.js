#!/usr/bin/env node
/**
 * Acceptance test for Work Package actor-explainer-wp-001
 * 「制作ACTOR讲解视频」— 梳理 ACTOR 能力/协作/业务流程并产出讲解视频
 *
 * GIVEN  工作包「制作ACTOR讲解视频」已登记到意图架构图谱
 * WHEN   验收方读取意图图谱与交付物
 * THEN   满足以下外部可观测的验收语义：
 *        1) 图谱中存在 id=actor-explainer-wp-001 的 Work Package 元素，
 *           挂载于 Implementation and Migration Viewpoint(1249)，
 *           并包含于「Implementation and Migration」视图(174)；
 *        2) 梳理文档 docs/diagrams/actor-explainer/00-ACTOR梳理与协作关系.md 存在，
 *           且覆盖全部 Agent：研究智能体（GPTResearcher 单智能体、多智能体协作团队
 *           10 角色）与生产 Actor（媒体艺术家/视频制作Leader/视频制作/视频审核），
 *           并覆盖能力、协作关系、业务流程维度；
 *        3) 讲解视频 docs/diagrams/actor-explainer/actor-explainer.mp4 存在且非空。
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
const DOC_PATH = path.join(repoRoot, 'docs', 'diagrams', 'actor-explainer', '00-ACTOR梳理与协作关系.md');
const VIDEO_PATH = path.join(repoRoot, 'docs', 'diagrams', 'actor-explainer', 'actor-explainer.mp4');

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
  // ---- 1) 图谱元素 ----
  let graph;
  try {
    graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
  } catch (err) {
    record('图谱可读取', false, err.message);
    console.error('[ACCEPT] FAIL');
    process.exit(1);
  }
  const elements = graph.elements || [];
  const views = graph.views || [];
  const wp = elements.find((e) => e.id === 'actor-explainer-wp-001');
  record('图谱存在 Work Package 元素 actor-explainer-wp-001', !!wp, '未找到');
  if (wp) {
    record('类型为 Work Package', wp.type === 'Work Package', `实际: ${wp.type}`);
    record('挂载于 1249', wp.parent === '1249', `实际: ${wp.parent}`);
    record('有非空 description', !!(wp.description && wp.description.trim()));
    const view174 = views.find((v) => v.view_id === '174');
    const inView = view174 && (view174.included_elements || []).includes('actor-explainer-wp-001');
    record('包含于视图 174（Implementation and Migration）', !!inView);
  }

  // ---- 2) 梳理文档 ----
  let doc = '';
  try {
    doc = fs.readFileSync(DOC_PATH, 'utf8');
    record('梳理文档存在', true);
  } catch (err) {
    record('梳理文档存在', false, err.message);
  }
  if (doc) {
    const actors = ['媒体艺术家', '视频制作Leader', '视频制作', '视频审核'];
    for (const a of actors) {
      record(`文档覆盖生产 Actor「${a}」`, doc.includes(a));
    }
    const researchAgents = ['GPTResearcher', 'ChiefEditorAgent', 'EditorAgent', 'ResearchAgent', 'WriterAgent', 'ReviewerAgent', 'ReviserAgent', 'FactCheckerAgent', 'HumanAgent', 'VisualizerAgent', 'PublisherAgent'];
    for (const a of researchAgents) {
      record(`文档覆盖研究智能体「${a}」`, doc.includes(a));
    }
    record('文档覆盖「能力」维度', /能力/.test(doc));
    record('文档覆盖「协作关系」维度', /协作/.test(doc));
    record('文档覆盖「业务流程」维度', /业务(流程|过程)/.test(doc));
    record('文档覆盖单智能体流程', /单智能体/.test(doc));
    record('文档覆盖多智能体 LangGraph 工作流', /多智能体/.test(doc) && /LangGraph/.test(doc));
  }

  // ---- 3) 讲解视频 ----
  let vstat = null;
  try {
    vstat = fs.statSync(VIDEO_PATH);
  } catch (err) { /* ignore */ }
  record('讲解视频 actor-explainer.mp4 存在', !!vstat, '未找到');
  if (vstat) {
    record('讲解视频非空（> 100KB）', vstat.size > 100 * 1024, `实际 ${vstat.size} 字节`);
  }

  if (failures.length > 0) {
    console.error(`[ACCEPT] FAIL (${failures.length})`);
    process.exit(1);
  }
  console.log('[ACCEPT] PASS');
  process.exit(0);
}

main();
