'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

/**
 * Acceptance tests for Business Actor 「媒体艺术家」 (media-artist-001)
 * 导入接口文档：媒体艺术家 Business Actor 导入接口（ARCHGRAPH → ARGO）
 *
 * AT-media-artist-01-媒体艺术家角色就绪
 * GIVEN 意图图谱已登记 AgentOrganization 团队
 * WHEN  查找专门负责图片视频生成的 Business Actor
 * THEN  图谱中存在全局唯一 name 为「媒体艺术家」的 Business Actor，
 *       挂载于 AgentOrganization(1962)，有非空 description，
 *       并通过 Assignment 指派给「图片视频生成」Role，
 *       均包含于「媒体创作团队」视图(media-team-001)。
 *
 * AT-media-artist-02-媒体艺术家Agent属性就绪
 * GIVEN 媒体艺术家需要以自定义 agent 方式被调用
 * WHEN  读取图谱中「媒体艺术家」元素属性
 * THEN  元素挂载 agent 属性（media-artist）且含 model、tools 与 agentPrompt 属性，
 *       agentPrompt 涵盖 text2image 端点、qwen-image 模型、qwen3-vl-plus 与 QWEN_KEY 约束。
 *
 * AT-media-artist-03-视频生成能力就绪
 * GIVEN 媒体艺术家需要完成视频生成任务
 * WHEN  读取图谱中视频生成能力
 * THEN  存在 dashscope-video-generator Skill（含 wan 文生视频接口 video-synthesis、
 *       模型 wan2.7-t2v 等、异步轮询与 video_url 下载说明），
 *       图片视频生成 Role 通过 Association 使用该 Skill，
 *       且媒体艺术家 agentPrompt 含视频生成接口与模型约束。
 *
 * 运行：node --test tests/media-artist-actor.test.js
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

const actor = elements.find((e) => e.id === 'media-artist-001');
const role = elements.find((e) => e.id === 'media-role-001');
const skill = elements.find((e) => e.id === 'media-skill-001');
const vlSkill = elements.find((e) => e.id === 'media-vl-skill-001');
const videoSkill = elements.find((e) => e.id === 'media-video-skill-001');

/* ── AT-media-artist-01-媒体艺术家角色就绪 ─────────────────────────────── */

test('AT-media-artist-01 | 图谱中存在「媒体艺术家」Business Actor，且全局唯一', () => {
  assert.ok(actor, '应存在 media-artist-001 元素');
  assert.equal(actor.type, 'Business Actor');
  const sameName = elements.filter((e) => e.name === '媒体艺术家');
  assert.equal(sameName.length, 1, 'name 应全局唯一');
});

test('AT-media-artist-01 | Actor 挂载于 AgentOrganization(1962)，有非空 description 与 agent 属性', () => {
  assert.equal(actor.parent, '1962', 'Actor 应挂载于 AgentOrganization(1962)');
  assert.ok(actor.description && actor.description.trim(), '应有非空 description');
  const agentAttr = (actor.attributes || []).find((a) => a.name === 'agent');
  assert.equal(agentAttr && agentAttr.value, 'media-artist', '应登记 agent 属性');
});

test('AT-media-artist-01 | AgentOrganization(1962) 为挂载于 Implementation and Migration Viewpoint 的 Grouping', () => {
  const org = elements.find((e) => e.id === '1962');
  assert.ok(org, '应存在 AgentOrganization(1962)');
  assert.equal(org.type, 'Grouping');
  assert.equal(org.parent, '1249', 'AgentOrganization 应挂载于 Implementation and Migration Viewpoint');
});

test('AT-media-artist-01 | 通过 Assignment 指派给「图片视频生成」Role', () => {
  assert.ok(role, '应存在 media-role-001 元素');
  assert.equal(role.type, 'Business Role');
  assert.equal(role.name, '图片视频生成');
  assert.equal(role.parent, '1962');

  const assign = relationships.find((r) => r.id === 'media-assign-001');
  assert.ok(assign, '应存在 Assignment 关系 media-assign-001');
  assert.equal(assign.type, 'Assignment');
  assert.equal(assign.source_id, 'media-artist-001');
  assert.equal(assign.target_id, 'media-role-001');
});

test('AT-media-artist-01 | Actor 关联 dashscope-media-generator 与 qwen3-vl-visual-inspection 两个 Skill', () => {
  assert.ok(skill, '应存在 media-skill-001 元素');
  assert.equal(skill.type, 'Skill');
  assert.equal(skill.parent, '1249');
  assert.ok(vlSkill, '应存在 media-vl-skill-001 元素');
  assert.equal(vlSkill.type, 'Skill');
  assert.equal(vlSkill.parent, '1249');

  const useSkill = relationships.find((r) => r.id === 'media-use-skill-001');
  assert.ok(useSkill, '应存在 media-use-skill-001 关联');
  assert.equal(useSkill.source_id, 'media-role-001');
  assert.equal(useSkill.target_id, 'media-skill-001');

  const useVl = relationships.find((r) => r.id === 'media-use-vl-001');
  assert.ok(useVl, '应存在 media-use-vl-001 关联');
  assert.equal(useVl.source_id, 'media-role-001');
  assert.equal(useVl.target_id, 'media-vl-skill-001');
});

test('AT-media-artist-01 | 全部元素与关系包含于「媒体创作团队」视图(media-team-001)', () => {
  const view = views.find((v) => v.view_id === 'media-team-001');
  assert.ok(view, '应存在 media-team-001 视图');
  assert.equal(view.view_name, '媒体创作团队');
  assert.equal(view.parent_element_id, '1962', '视图应挂载于 AgentOrganization(1962)');

  const memberIds = new Set(view.included_elements || []);
  for (const id of ['media-artist-001', 'media-role-001', 'media-skill-001', 'media-vl-skill-001', 'media-video-skill-001']) {
    assert.ok(memberIds.has(id), `视图应包含元素 ${id}`);
  }

  const relIds = new Set(view.included_relationships || []);
  for (const id of ['media-assign-001', 'media-use-skill-001', 'media-use-vl-001', 'media-use-video-001']) {
    assert.ok(relIds.has(id), `视图应包含关系 ${id}`);
  }
});

test('AT-media-artist-01 | Actor 挂载可执行验收用例（GIVEN-WHEN-THEN）', () => {
  const tcs = (actor.testcases || []).filter((t) => t.type === 'Acceptance Test');
  assert.ok(tcs.length >= 1, '应挂载至少一个验收用例');
  for (const tc of tcs) {
    assert.ok(
      (tc.description || '').includes('GIVEN')
        && (tc.description || '').includes('WHEN')
        && (tc.description || '').includes('THEN'),
      '验收用例应采用 GIVEN-WHEN-THEN 格式'
    );
    assert.ok((tc.acceptanceCriteria || '').includes('media-artist-actor.test.js'), '验收用例应指向本测试文件');
  }
});

/* ── AT-media-artist-02-媒体艺术家Agent属性就绪 ────────────────────────── */

test('AT-media-artist-02 | 元素挂载 agent 属性（media-artist）', () => {
  const agentAttr = (actor.attributes || []).find((a) => a.name === 'agent');
  assert.ok(agentAttr, '应挂载 agent 属性');
  assert.equal(agentAttr.value, 'media-artist');
});

test('AT-media-artist-02 | 元素含 model 与 tools 属性', () => {
  const attrNames = (actor.attributes || []).map((a) => a.name);
  assert.ok(attrNames.includes('model'), '应含 model 属性');
  assert.ok(attrNames.includes('tools'), '应含 tools 属性');
});

test('AT-media-artist-02 | agentPrompt 涵盖 text2image 端点、qwen-image 模型、qwen3-vl-plus 与 QWEN_KEY 约束', () => {
  const promptAttr = (actor.attributes || []).find((a) => a.name === 'agentPrompt');
  assert.ok(promptAttr, '应含 agentPrompt 属性');
  const prompt = promptAttr.value || '';
  assert.match(prompt, /text2image/, 'agentPrompt 应含 text2image 端点');
  assert.match(prompt, /qwen-image/, 'agentPrompt 应含 qwen-image 模型约束');
  assert.match(prompt, /qwen3-vl-plus/, 'agentPrompt 应含 qwen3-vl-plus 视觉验收');
  assert.match(prompt, /QWEN_KEY/, 'agentPrompt 应含 QWEN_KEY 凭据约束');
});

/* ── AT-media-artist-03-视频生成能力就绪 ──────────────────────────────── */

test('AT-media-artist-03 | 存在 dashscope-video-generator Skill（video-synthesis + wan 模型 + 异步轮询 + video_url）', () => {
  assert.ok(videoSkill, '应存在 media-video-skill-001 元素');
  assert.equal(videoSkill.type, 'Skill');
  assert.equal(videoSkill.name, 'dashscope-video-generator');
  assert.equal(videoSkill.parent, '1249');
  const desc = videoSkill.description || '';
  assert.match(desc, /video-synthesis/, 'Skill 应含 video-synthesis 接口');
  assert.match(desc, /wan2\.7-t2v/, 'Skill 应含 wan2.7-t2v 模型');
  assert.match(desc, /X-DashScope-Async/, 'Skill 应含异步请求头说明');
  assert.match(desc, /video_url/, 'Skill 应含 video_url 下载说明');
  assert.match(desc, /QWEN_KEY/, 'Skill 应含凭据约束');
});

test('AT-media-artist-03 | 图片视频生成 Role 通过 Association 使用 dashscope-video-generator', () => {
  const useVideo = relationships.find((r) => r.id === 'media-use-video-001');
  assert.ok(useVideo, '应存在 media-use-video-001 关联');
  assert.equal(useVideo.type, 'Association');
  assert.equal(useVideo.source_id, 'media-role-001');
  assert.equal(useVideo.target_id, 'media-video-skill-001');
});

test('AT-media-artist-03 | 媒体艺术家 agentPrompt 含视频生成接口与模型约束', () => {
  const promptAttr = (actor.attributes || []).find((a) => a.name === 'agentPrompt');
  assert.ok(promptAttr, '应含 agentPrompt 属性');
  const prompt = promptAttr.value || '';
  assert.match(prompt, /video-synthesis/, 'agentPrompt 应含视频生成接口');
  assert.match(prompt, /wan2\.7-t2v/, 'agentPrompt 应含 wan 视频模型约束');
});
