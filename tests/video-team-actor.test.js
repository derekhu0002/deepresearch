'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

/**
 * Acceptance tests for 「视频制作团队」 Business Actors（video-leader-001 / video-producer-001 / video-reviewer-001）
 *
 * AT-video-team-01-视频制作Leader就绪
 * GIVEN 意图图谱已登记 AgentOrganization 团队
 * WHEN  查找视频制作领导团队
 * THEN  图谱中存在 name 为「视频制作Leader」的 Business Actor，
 *       挂载于 AgentOrganization(1962)，有非空 description，
 *       通过 Aggregation 归属「视频制作」与「视频审核」两个 Actor（均挂载于 Leader 之下），
 *       「视频制作」使用 dashscope-video-generator Skill，
 *       「视频审核」使用 qwen3-vl-visual-inspection Skill，
 *       全部包含于「视频制作团队」视图(video-team-001)。
 *
 * 运行：node --test tests/video-team-actor.test.js
 * 退出码：0 = 通过；1 = 失败。仅依赖 Node 内置模块。
 */

const repoRoot = process.env.ARGO_REPO_ROOT
  || process.env.WORKSPACE_FOLDER
  || path.resolve(__dirname, '..');

const GRAPH_PATH = path.join(repoRoot, 'design', 'KG', 'SystemArchitecture.json');

let graph;
try {
  graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
} catch (err) {
  throw new Error(`无法读取意图架构图谱 ${GRAPH_PATH}：${err.message}`);
}

const elements = graph.elements || [];
const relationships = graph.relationships || [];
const views = graph.views || [];

const leader = elements.find((e) => e.id === 'video-leader-001');
const producer = elements.find((e) => e.id === 'video-producer-001');
const reviewer = elements.find((e) => e.id === 'video-reviewer-001');
const videoSkill = elements.find((e) => e.id === 'media-video-skill-001');
const vlSkill = elements.find((e) => e.id === 'media-vl-skill-001');

test('AT-video-team-01 | 存在「视频制作Leader」Business Actor，挂载于 AgentOrganization(1962)', () => {
  assert.ok(leader, '应存在 video-leader-001 元素');
  assert.equal(leader.type, 'Business Actor');
  assert.equal(leader.name, '视频制作Leader');
  assert.equal(leader.parent, '1962');
  assert.ok(leader.description && leader.description.trim(), '应有非空 description');
  const agentAttr = (leader.attributes || []).find((a) => a.name === 'agent');
  assert.equal(agentAttr && agentAttr.value, 'video-leader', '应登记 agent 属性');
});

test('AT-video-team-01 | Leader 通过 Aggregation 归属「视频制作」Actor（挂载于 Leader 之下）', () => {
  assert.ok(producer, '应存在 video-producer-001 元素');
  assert.equal(producer.type, 'Business Actor');
  assert.equal(producer.name, '视频制作');
  assert.equal(producer.parent, 'video-leader-001', '「视频制作」应挂载于 Leader 之下');
  const rel = relationships.find((r) => r.id === 'video-lead-producer-001');
  assert.ok(rel, '应存在 video-lead-producer-001 关系');
  assert.equal(rel.type, 'Aggregation');
  assert.equal(rel.source_id, 'video-leader-001');
  assert.equal(rel.target_id, 'video-producer-001');
});

test('AT-video-team-01 | Leader 通过 Aggregation 归属「视频审核」Actor（挂载于 Leader 之下）', () => {
  assert.ok(reviewer, '应存在 video-reviewer-001 元素');
  assert.equal(reviewer.type, 'Business Actor');
  assert.equal(reviewer.name, '视频审核');
  assert.equal(reviewer.parent, 'video-leader-001', '「视频审核」应挂载于 Leader 之下');
  const rel = relationships.find((r) => r.id === 'video-lead-reviewer-001');
  assert.ok(rel, '应存在 video-lead-reviewer-001 关系');
  assert.equal(rel.type, 'Aggregation');
  assert.equal(rel.source_id, 'video-leader-001');
  assert.equal(rel.target_id, 'video-reviewer-001');
});

test('AT-video-team-01 | 「视频制作」使用 dashscope-video-generator Skill', () => {
  assert.ok(videoSkill, '应存在 media-video-skill-001 元素');
  assert.equal(videoSkill.type, 'Skill');
  const rel = relationships.find((r) => r.id === 'video-producer-use-skill-001');
  assert.ok(rel, '应存在 video-producer-use-skill-001 关系');
  assert.equal(rel.source_id, 'video-producer-001');
  assert.equal(rel.target_id, 'media-video-skill-001');
  const desc = videoSkill.description || '';
  assert.match(desc, /video-synthesis/, 'Skill 应含 video-synthesis 接口');
  assert.match(desc, /wan2\.7-t2v|wan2\.6-t2v/, 'Skill 应含万相视频模型');
});

test('AT-video-team-01 | 「视频审核」使用 qwen3-vl-visual-inspection Skill 分析视频是否符合需求', () => {
  assert.ok(vlSkill, '应存在 media-vl-skill-001 元素');
  assert.equal(vlSkill.type, 'Skill');
  const rel = relationships.find((r) => r.id === 'video-reviewer-use-vl-001');
  assert.ok(rel, '应存在 video-reviewer-use-vl-001 关系');
  assert.equal(rel.source_id, 'video-reviewer-001');
  assert.equal(rel.target_id, 'media-vl-skill-001');
  assert.match(reviewer.description, /需求/, '「视频审核」应核对是否符合需求提出者要求');
  assert.match(reviewer.description, /qwen3-vl/, '「视频审核」描述应含视觉模型');
});

test('AT-video-team-01 | 全部元素与关系包含于「视频制作团队」视图(video-team-001)', () => {
  const view = views.find((v) => v.view_id === 'video-team-001');
  assert.ok(view, '应存在 video-team-001 视图');
  assert.equal(view.view_name, '视频制作团队');
  assert.equal(view.parent_element_id, '1962', '视图应挂载于 AgentOrganization(1962)');

  const memberIds = new Set(view.included_elements || []);
  for (const id of ['video-leader-001', 'video-producer-001', 'video-reviewer-001']) {
    assert.ok(memberIds.has(id), `视图应包含元素 ${id}`);
  }

  const relIds = new Set(view.included_relationships || []);
  for (const id of ['video-lead-producer-001', 'video-lead-reviewer-001', 'video-producer-use-skill-001', 'video-reviewer-use-vl-001']) {
    assert.ok(relIds.has(id), `视图应包含关系 ${id}`);
  }
});

test('AT-video-team-01 | Leader 挂载可执行验收用例（GIVEN-WHEN-THEN）', () => {
  const tcs = (leader.testcases || []).filter((t) => t.type === 'Acceptance Test');
  assert.ok(tcs.length >= 1, '应挂载至少一个验收用例');
  for (const tc of tcs) {
    assert.ok(
      (tc.description || '').includes('GIVEN')
        && (tc.description || '').includes('WHEN')
        && (tc.description || '').includes('THEN'),
      '验收用例应采用 GIVEN-WHEN-THEN 格式'
    );
    assert.ok((tc.acceptanceCriteria || '').includes('video-team-actor.test.js'), '验收用例应指向本测试文件');
  }
});
