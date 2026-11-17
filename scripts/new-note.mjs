import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {categories} from '../lib/categories.js';
// Example: pnpm note theory my-story "先有故事，再有镜头"
const [categoryId,slug,...titleParts]=process.argv.slice(2),category=categories.find(c=>c.id===categoryId),title=titleParts.join(' ').trim();
if(!category||!slug||!title||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug==='index'){
  console.error('用法：pnpm note <目录> <英文短文件名> "标题"\n目录：'+categories.map(c=>c.id).join(', '));process.exit(1);
}
const root=fileURLToPath(new URL('../',import.meta.url)),target=path.join(root,'docs',category.id,slug+'.md');
if(fs.existsSync(target)){console.error('该文件已存在，不会覆盖：'+target);process.exit(1);}
const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let text=fs.readFileSync(path.join(root,'templates',categoryId==='collection'?'collection.md':'note.md'),'utf8');
// JSON quoting is valid YAML and safely preserves quotes and punctuation in titles.
text=text.replace('"{{title}}"',JSON.stringify(title)).replaceAll('{{date}}',date).replaceAll('{{category}}',category.name);
if(categoryId==='collection')text=text.replace('"【合集底稿】博主名称｜视频标题"',JSON.stringify(title.startsWith('【合集底稿】')?title:'【合集底稿】'+title));
fs.writeFileSync(target,text,{encoding:'utf8',flag:'wx'});console.log('已新建：'+target);
