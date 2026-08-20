#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const repoRoot = process.env.ARGO_REPO_ROOT || process.env.WORKSPACE_FOLDER || path.resolve(__dirname, '..', '..');
const DOC_PATH = path.join(repoRoot, 'docs', 'insights', '自由生成游戏-程序化内容生成-洞察.md');
const GRAPH_PATH = path.join(repoRoot, 'design', 'KG', 'SystemArchitecture.json');
const failures = [];
function record(name, ok, detail) { if (ok) console.log(`  PASS  ${name}`); else { console.error(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`); failures.push(name); } }
function main() {
  console.log(`[ACCEPT] deliverable: ${DOC_PATH}`);
  let text; try { text = fs.readFileSync(DOC_PATH, 'utf8'); } catch (err) { console.error(`  FAIL  deliverable-document-exists — ${err.message}`); console.error('[ACCEPT] FAIL'); process.exit(1); }
  record('deliverable-document-exists', true);
  let graph = null; try { graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8')); } catch (err) { graph = null; }
  const wp = graph && (graph.elements || []).find((e) => e.id === '3000');
  record('工作包存在', !!wp);
  if (wp) { const tc = (wp.testcases || []).find((t) => t.type === 'Acceptance Test'); record('工作包挂载可执行验收用例', !!tc); if (tc) { record('验收用例指向本测试文件', (tc.acceptanceCriteria || '').includes('test-procedural-generation-games-insight.js')); const gwt = (tc.description || ''); record('验收用例采用 GIVEN-WHEN-THEN 格式', gwt.includes('GIVEN') && gwt.includes('WHEN') && gwt.includes('THEN')); } }
  record('编排声明含 ChiefEditorAgent', text.includes('编排') && text.includes('ChiefEditorAgent'));
  const roles = ['ChiefEditorAgent','EditorAgent','ResearchAgent','WriterAgent','ReviewerAgent','ReviserAgent','FactCheckerAgent','HumanAgent','PublisherAgent','VisualizerAgent'];
  const missingRoles = roles.filter((r) => !text.includes(r));
  record('多智能体团队角色齐全（10 个）', missingRoles.length === 0, missingRoles.length ? `缺失: ${missingRoles.join(', ')}` : '');
  record('包含章节大纲', text.includes('章节大纲'));
  const chapterRe = /^## 第(\d+)章/mg; const chapters = []; let cm; while ((cm = chapterRe.exec(text)) !== null) chapters.push({ num: cm[1], index: cm.index });
  record('章节大纲 ≥3 章', chapters.length >= 3, `章节数: ${chapters.length}`);
  const urlRe = /https?:\/\//; let chaptersWithSource = 0;
  for (let i = 0; i < chapters.length; i += 1) { const start = chapters[i].index; const end = i + 1 < chapters.length ? chapters[i + 1].index : text.length; const body = text.slice(start, end); if (urlRe.test(body) && body.includes('原文段落')) chaptersWithSource += 1; }
  record('≥3 个章节含来源（URL + 原文段落）', chaptersWithSource >= 3, `含来源章节数: ${chaptersWithSource}/${chapters.length}`);
  record('包含评审记录（ReviewerAgent）', text.includes('评审') && text.includes('ReviewerAgent'));
  record('包含修订记录（ReviserAgent）', text.includes('修订') && text.includes('ReviserAgent'));
  record('包含事实核查记录（FactCheckerAgent）', text.includes('事实核查') && text.includes('FactCheckerAgent'));
  const mermaidCount = (text.match(/```mermaid/g) || []).length;
  record('包含 ≥1 个 Mermaid 图（VisualizerAgent）', mermaidCount >= 1, `Mermaid 图数: ${mermaidCount}`);
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  const quoteCount = (text.match(/原文段落/g) || []).length;
  record('URL 来源数 ≥ 章节数', urlCount >= chapters.length, `URL 数: ${urlCount}, 章节数: ${chapters.length}`);
  record('「原文段落」来源数 ≥ 章节数', quoteCount >= chapters.length, `原文段落数: ${quoteCount}, 章节数: ${chapters.length}`);
  if (failures.length === 0) { console.log(`[ACCEPT] PASS — 章节 ${chapters.length} 个, 角色 ${roles.length} 个, Mermaid ${mermaidCount} 个, URL ${urlCount} 个`); process.exit(0); }
  console.error(`[ACCEPT] FAIL — ${failures.length} 处失败: ${failures.join(', ')}`); process.exit(1);
}
main();