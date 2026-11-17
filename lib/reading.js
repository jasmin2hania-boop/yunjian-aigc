// Presentation order is editorial; chronological order remains available in
// recent updates. Original URLs and full-text indexing are preserved.
export function groupNotes(notes) {
  const buckets=new Map();
  for(const note of notes){
    const reading=note.reading||'';
    const fallback=reading==='main'?'先读这篇':reading==='topic'?'主题精读':reading==='source'?'原视频底稿':reading==='detail'?'细分记录':'笔记';
    const key=note.group||fallback;
    if(!buckets.has(key))buckets.set(key,{title:key,collapsed:reading==='source'||reading==='detail',rank:reading==='main'?0:reading==='topic'?10:reading==='source'?80:reading==='detail'?90:20,notes:[]});
    buckets.get(key).notes.push(note);
  }
  const compare=(a,b)=>(a.order??100)-(b.order??100)||b.updated.localeCompare(a.updated)||a.title.localeCompare(b.title,'zh-CN');
  const groups=[...buckets.values()];for(const g of groups)g.notes.sort(compare);
  return groups.sort((a,b)=>a.rank-b.rank||compare(a.notes[0],b.notes[0]));
}

export const readingWeight=reading=>reading==='main'?1.25:reading==='topic'?1.2:reading==='detail'?.55:reading==='source'?.75:1;
