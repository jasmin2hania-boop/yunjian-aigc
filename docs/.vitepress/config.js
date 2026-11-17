import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  lang:'zh-CN',title:'云间来信 · Hania',description:'Hania 的 AIGC 编导知识库：把偶然的发现，慢慢变成自己的创作语言。',
  base:process.env.SITE_BASE || '/',
  outDir:fileURLToPath(new URL('../../dist/',import.meta.url)),
  cleanUrls:false,lastUpdated:false,scrollOffset:20,
  head:[['meta',{name:'theme-color',content:'#ede5f1'}],['link',{rel:'icon',href:(process.env.SITE_BASE||'/')+'favicon.svg'}]],
  markdown:{
    headers:{level:[2,3]},
    config(md) {
      // Prompt fences are escaped and get a real clipboard action in the reader.
      const normal=md.renderer.rules.fence;
      md.renderer.rules.fence=(tokens,index,options,env,self)=>{
        const t=tokens[index];
        if(!['prompt','text'].includes(t.info.trim())) return normal(tokens,index,options,env,self);
        return '<div class="read-prompt"><div class="read-prompt-head"><span>PROMPT / 可替换后复用</span><button type="button" class="read-copy" data-copy>复制提示词</button></div><pre tabindex="0">'+md.utils.escapeHtml(t.content)+'</pre></div>';
      };
    }
  },
  vite:{ssr:{noExternal:['minisearch']}}
});
