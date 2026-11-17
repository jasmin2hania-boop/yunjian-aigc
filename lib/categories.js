// One source of truth for folders, homepage objects and article return links.
export const categories = [
  {id:'collection',name:'合集教程总览库',label:'合集教程',en:'COLLECTION',object:'folio',x:50,y:17,desc:'完整底稿与拆分知识点的起点。'},
  {id:'ai-tool',name:'AI工具实操库',label:'AI 实操',en:'AI STUDIO',object:'prism',x:74,y:25,desc:'把工具转化为可以执行的工作流。'},
  {id:'theory',name:'编导理论与创作逻辑',label:'编导思维',en:'DIRECTING',object:'petal',x:87,y:47,desc:'叙事、情绪与视听表达。'},
  {id:'prompt',name:'提示词工程库',label:'提示词',en:'PROMPTS',object:'quote',x:79,y:70,desc:'把创作意图写成可调用的表达。'},
  {id:'breakdown',name:'爆款拆解库',label:'作品拆解',en:'BREAKDOWN',object:'film',x:61,y:85,desc:'观察作品怎样建立吸引力。'},
  {id:'review',name:'实战复盘库',label:'实战复盘',en:'REFLECTIONS',object:'loop',x:38,y:85,desc:'记录项目中的判断、问题与修正。'},
  {id:'reference',name:'素材参考库',label:'灵感参考',en:'REFERENCES',object:'memory',x:20,y:70,desc:'保留画面，也保留它的来处。'},
  {id:'template',name:'模板库',label:'创作模板',en:'TEMPLATES',object:'grid',x:13,y:47,desc:'能在下一个项目直接复用的框架。'},
  {id:'resource-index',name:'资源索引库',label:'资源索引',en:'RESOURCES',object:'path',x:26,y:25,desc:'为来源和资料保留清楚的入口。'}
];

// These are code-owned decorative shapes, never supplied by note content.
export const art = {
  folio:'<span class="ca-leaf ca-art-piece"></span><span class="ca-leaf ca-art-piece"></span><span class="ca-leaf ca-art-piece"></span>',
  prism:'<span class="ca-prism-core"></span>',
  petal:'<span class="ca-petal"></span><span class="ca-petal"></span><span class="ca-petal"></span>',
  quote:'<span class="ca-quote-paper ca-art-piece"></span><span class="ca-quote-mark"><b></b><b></b></span>',
  film:'<span class="ca-film-frame"><i></i><i></i><i></i></span>',
  loop:'<span class="ca-loop-back"></span><span class="ca-loop-front ca-art-piece"></span>',
  memory:'<span class="ca-memory-back"></span><span class="ca-memory-front ca-art-piece"></span><span class="ca-memory-cloud"></span>',
  grid:'<span class="ca-grid-shadow"></span><span class="ca-grid-paper ca-art-piece"><i></i><i></i><i></i><i></i></span>',
  path:'<span class="ca-thread"></span><span class="ca-pearl"></span><span class="ca-pearl"></span><span class="ca-pearl"></span>'
};
