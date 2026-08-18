#!/usr/bin/env node
/**
 * Extract the gpt-researcher Agent-behaviour subgraph from the canonical
 * intent architecture graph into a standalone, importable JSON file.
 *
 * Source : design/KG/SystemArchitecture.json
 * Output : design/KG/gpt-researcher-subgraph.json
 *
 * Extraction rules:
 *   - Elements: traverse descendants of seeds [2001 (Work Package), 2010 (root grouping)].
 *   - Relationships: keep only those whose source_id AND target_id are both in the element set.
 *   - Views: keep views fully contained in the element set (all included_elements belong to the set).
 *
 * Usage: node scripts/extract-gpt-researcher-subgraph.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = process.env.ARGO_REPO_ROOT
  || process.env.WORKSPACE_FOLDER
  || path.resolve(__dirname, '..');

const SRC = path.join(repoRoot, 'design', 'KG', 'SystemArchitecture.json');
const OUT = path.join(repoRoot, 'design', 'KG', 'gpt-researcher-subgraph.json');

function main() {
  const graph = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const elements = graph.elements || [];
  const relationships = graph.relationships || [];
  const views = graph.views || [];

  const byId = new Map(elements.map((e) => [e.id, e]));

  // 1) Collect element ids by traversing descendants of the two seeds.
  const seeds = ['2001', '2010']; // Work Package + root Grouping
  const ids = new Set();
  const queue = [...seeds];
  while (queue.length > 0) {
    const id = queue.shift();
    if (!id || ids.has(id) || !byId.has(id)) continue;
    ids.add(id);
    for (const e of elements) {
      if (e.parent === id && !ids.has(e.id)) queue.push(e.id);
    }
  }

  // 2) Elements (preserve source order).
  const outElements = elements.filter((e) => ids.has(e.id));

  // 3) Relationships with both endpoints inside the subgraph.
  const outRelationships = relationships.filter(
    (r) => ids.has(r.source_id) && ids.has(r.target_id)
  );
  const relIds = new Set(outRelationships.map((r) => r.id));

  // 4) Views fully contained in the subgraph.
  const outViews = views
    .filter((v) => {
      const inc = v.included_elements || [];
      return inc.length > 0 && inc.every((id) => ids.has(id));
    })
    .map((v) => ({
      ...v,
      included_relationships: (v.included_relationships || []).filter((id) =>
        relIds.has(id)
      ),
    }));

  let sourceCommit = '';
  try {
    sourceCommit = execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
    }).trim();
  } catch (_) {
    /* not a git checkout — leave empty */
  }

  const result = {
    name: 'gpt-researcher Agent 行为模型',
    description:
      '从 design/KG/SystemArchitecture.json 提取的 gpt-researcher 子图（元素 2001/2010–2083、关系 1200–1244、视图 AgentCapabilities 与子视图 1761–1766）' +
      (sourceCommit ? `；来源 commit: ${sourceCommit}` : '') +
      '。注意：元素 2001/2010 与视图 AgentCapabilities 的 parent 引用 1249（Implementation and Migration Viewpoint）未包含在本文件中，导入其他项目时需重映射。',
    elements: outElements,
    relationships: outRelationships,
    views: outViews,
  };

  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n', 'utf8');

  console.log(`elements     : ${outElements.length}`);
  console.log(`relationships: ${outRelationships.length}`);
  console.log(`views        : ${outViews.length}`);
  console.log(`written      : ${path.relative(repoRoot, OUT)}`);
}

main();
