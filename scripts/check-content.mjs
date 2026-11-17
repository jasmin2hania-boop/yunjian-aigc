import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLibrary } from '../lib/content.mjs';
const docs=fileURLToPath(new URL('../docs/',import.meta.url));
const {notes,errors,tags}=loadLibrary(docs);
for(const note of notes) for(const image of note.images){
  if(/^(?:https?:|data:)/.test(image))continue;
  const target=image.startsWith('/')?path.join(docs,'public',decodeURIComponent(image)):path.resolve(docs,path.dirname(note.file),decodeURIComponent(image));
  if(!fs.existsSync(target))errors.push(`${note.file}: 图片不存在 ${image}`);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`内容检查通过：${notes.length} 篇笔记，${tags.length} 个标签，${notes.filter(n=>n.star).length} 篇星标，${notes.reduce((sum,n)=>sum+n.backlinks.length,0)} 条双向关联。`);
