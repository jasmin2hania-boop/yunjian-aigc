import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import MiniSearch from 'minisearch';import {loadLibrary,resolveNoteLink} from '../lib/content.mjs';import {tokenize,makeSearchOptions} from '../lib/search.js';
import {groupNotes} from '../lib/reading.js';

test('Chinese search covers body, tags and source, not just titles',()=>{
  const index=new MiniSearch(makeSearchOptions());index.addAll([
    {id:'1',title:'镜头A',text:'人物先接收信息再反应',tagsText:'自然表演',source:'V2 03:48'},
    {id:'2',title:'资产B',text:'门窗位置要符合空间关系',tagsText:'一致性',source:'V3 04:26'}
  ]);
  for(const query of ['接收信息','自然表演','V2','03:48'])assert.equal(index.search(query)[0]?.id,'1',query);
  assert.equal(index.search('门窗')[0]?.id,'2');assert.equal(index.search('完全无关').length,0);
  assert.ok(tokenize('AI 人物一致性').includes('一致'));
});
test('relative links, anchors and encoded paths resolve to the same note',()=>{
  assert.equal(resolveNoteLink('prompt/a.md','../collection/v2.md#知识点'),'collection/v2.md');
  assert.equal(resolveNoteLink('prompt/a.md','../collection/v2.html'),'collection/v2.md');
  assert.equal(resolveNoteLink('prompt/a.md','https://example.com/x.md'),null);
  assert.equal(resolveNoteLink('prompt/a.md','../../escape.md'),null);
});
test('directory keeps separate notes and puts the reading path before sources',()=>{
  const notes=[
    {id:'source',title:'原视频',reading:'source',group:'原视频底稿',order:1,updated:'2026-11-15'},
    {id:'detail',title:'细分记录',reading:'detail',updated:'2026-11-16'},
    {id:'main',title:'主线',reading:'main',group:'合集精读',order:0,updated:'2026-11-16'},
    {id:'topic-b',title:'主题二',reading:'topic',order:20,updated:'2026-11-16'},
    {id:'topic-a',title:'主题一',reading:'topic',order:10,updated:'2026-11-16'}
  ];
  const groups=groupNotes(notes);
  assert.equal(groups[0].notes[0].id,'main');
  assert.deepEqual(groups[1].notes.map(n=>n.id),['topic-a','topic-b']);
  assert.equal(groups.find(g=>g.title==='原视频底稿').collapsed,true);
  assert.equal(groups.flatMap(g=>g.notes).length,notes.length);
  assert.equal(new Set(groups.flatMap(g=>g.notes.map(n=>n.id))).size,notes.length);
});
test('star and backlinks derive from Markdown frontmatter and authored links',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'yunjian-test-'));
  try {
    for(const folder of ['collection','theory'])fs.mkdirSync(path.join(root,folder));
    const front=(title,category,star)=>`---\ntitle: ${title}\ndate: 2026-11-15\ncategory: ${category}\ntags: [测试]\nstar: ${star}\nsource: 自写笔记\n---\n\n`;
    fs.writeFileSync(path.join(root,'collection/a.md'),front('底稿','合集教程总览库',true)+'[知识](../theory/b.md)');
    fs.writeFileSync(path.join(root,'theory/b.md'),front('知识','编导理论与创作逻辑',false)+'[底稿](../collection/a.md)');
    const library=loadLibrary(root);assert.deepEqual(library.errors,[]);assert.equal(library.notes.filter(n=>n.star).length,1);assert.deepEqual(library.notes.find(n=>n.id==='theory/b').backlinks,['collection/a']);
    fs.appendFileSync(path.join(root,'theory/b.md'),'\n[失效](./missing.md)');assert.ok(loadLibrary(root).errors.some(e=>e.includes('missing.md')));
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
