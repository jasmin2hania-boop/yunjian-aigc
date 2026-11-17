// CJK unigrams + bigrams allow Chinese searches without a remote search service.
export function tokenize(value) {
  const text = String(value).normalize('NFKC').toLowerCase();
  const tokens = text.match(/[a-z0-9]+(?:[._:-][a-z0-9]+)*/g) || [];
  for (const run of text.match(/[\p{Script=Han}]+/gu) || []) {
    const chars = [...run];
    tokens.push(...chars);
    for(let i=0;i<chars.length-1;i++) tokens.push(chars[i]+chars[i+1]);
  }
  return tokens;
}

export function snippet(text, query, limit = 110) {
  const normalized = text.toLowerCase(), terms = tokenize(query).sort((a,b)=>b.length-a.length);
  let at = normalized.indexOf(query.toLowerCase());
  if(at < 0) for(const term of terms) { at=normalized.indexOf(term); if(at>=0) break; }
  const start=Math.max(0,at-30), end=Math.min(text.length,start+limit);
  return (start ? '…' : '') + text.slice(start,end).replace(/\s+/g,' ') + (end<text.length ? '…' : '');
}

export function makeSearchOptions() {
  return {fields:['title','text','tagsText','source'],storeFields:['title','url','summary','category','tags','source','text','reading'],tokenize,
    searchOptions:{boost:{title:8,tagsText:4,source:3},prefix:true,combineWith:'AND'}};
}
