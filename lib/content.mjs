import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { categories } from './categories.js';

const md = new MarkdownIt({html:true});
const slash = value => value.replace(/\\/g,'/');
export const dateString = value => value instanceof Date ? value.toISOString().slice(0,10) : String(value || '');

export function resolveNoteLink(from, href) {
  if(!href || /^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(href)) return null;
  let clean;
  try { clean=decodeURIComponent(href.split(/[?#]/)[0]); } catch { return null; }
  if(!/\.(?:md|html)$/i.test(clean)) return null;
  clean=clean.replace(/\.html$/i,'.md');
  const target=path.posix.normalize(clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(from),clean));
  return target.startsWith('../') ? null : target;
}

export function markdownInfo(body) {
  const links=[], images=[], texts=[];
  function visit(tokens) {
    for(const t of tokens) {
      if(t.type==='link_open') links.push(t.attrGet('href'));
      if(t.type==='image') images.push(t.attrGet('src'));
      if(t.type==='text'||t.type==='code_inline'||t.type==='fence'||t.type==='code_block') texts.push(t.content);
      if(t.children) visit(t.children);
    }
  }
  visit(md.parse(body,{}));
  return {links,images,text:texts.join(' ').replace(/\s+/g,' ').trim()};
}

export function loadLibrary(docsDir) {
  const notes=[], errors=[];
  for(const c of categories) {
    const folder=path.join(docsDir,c.id);
    function walk(dir) {
      if(!fs.existsSync(dir)) return;
      for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
        const file=path.join(dir,entry.name);
        if(entry.isDirectory()) walk(file);
        else if(entry.name.endsWith('.md')&&entry.name!=='index.md') {
          const relative=slash(path.relative(docsDir,file));
          try {
            const {data:f,content}=matter(fs.readFileSync(file,'utf8'));
            const info=markdownInfo(content);
            if(!f.title || typeof f.title!=='string') errors.push(`${relative}: 缺少 title`);
            if(f.category!==c.name) errors.push(`${relative}: category 应为 ${c.name}`);
            if(!Array.isArray(f.tags)||f.tags.some(t=>typeof t!=='string'||!t.trim())) errors.push(`${relative}: tags 应为非空字符串数组`);
            if(typeof f.star!=='boolean') errors.push(`${relative}: star 应为 true 或 false`);
            const date=dateString(f.date), updated=dateString(f.updated||f.date);
            for(const [name,value] of [['date',date],['updated',updated]]) if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value))) errors.push(`${relative}: ${name} 日期无效`);
            if(typeof f.source!=='string'||!f.source.trim()) errors.push(`${relative}: 缺少 source`);
            if(f.reading&&!['main','topic','source','detail'].includes(f.reading))errors.push(`${relative}: reading 应为 main、topic、source 或 detail`);
            if(f.order!==undefined&&(!Number.isFinite(f.order)))errors.push(`${relative}: order 应为数字`);
            if(f.group!==undefined&&typeof f.group!=='string')errors.push(`${relative}: group 应为文字`);
            notes.push({id:relative.replace(/\.md$/,''),file:relative,url:'/'+relative.replace(/\.md$/,'.html'),title:String(f.title||relative),category:c.id,categoryName:c.name,date,updated,tags:Array.isArray(f.tags)?f.tags:[],tagsText:Array.isArray(f.tags)?f.tags.join(' '):'',star:f.star===true,source:String(f.source||''),summary:String(f.summary||info.text.slice(0,100)),reading:f.reading||'',order:f.order??100,group:f.group||'',guide:f.guide||'',text:info.text,links:info.links,images:info.images,backlinks:[],outgoing:[]});
          } catch(e) { errors.push(`${relative}: ${e.message}`); }
        }
      }
    }
    walk(folder);
  }
  const byFile=new Map(notes.map(n=>[n.file,n]));
  for(const n of notes) for(const link of n.links) {
    const target=resolveNoteLink(n.file,link), other=byFile.get(target);
    if(other&&other!==n) { if(!other.backlinks.includes(n.id)) other.backlinks.push(n.id); if(!n.outgoing.includes(other.id)) n.outgoing.push(other.id); }
    else if(target&&!fs.existsSync(path.join(docsDir,target))) errors.push(`${n.file}: 链接目标不存在 ${link}`);
  }
  notes.sort((a,b)=>b.updated.localeCompare(a.updated)||b.date.localeCompare(a.date)||a.order-b.order||a.id.localeCompare(b.id));
  return {notes,errors,tags:[...new Set(notes.flatMap(n=>n.tags))].sort((a,b)=>a.localeCompare(b,'zh-CN'))};
}
