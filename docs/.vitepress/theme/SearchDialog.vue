<script setup>
import { ref,computed,onMounted,onBeforeUnmount,nextTick } from 'vue';
import { withBase } from 'vitepress';
import { data } from './library.data.js';
import { snippet,makeSearchOptions } from '../../../lib/search.js';
import { readingWeight } from '../../../lib/reading.js';
const emit=defineEmits(['close']),query=ref(''),input=ref(null),dialog=ref(null),ready=ref(false);
let index,oldOverflow;
onMounted(async()=>{
  oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';await nextTick();input.value.focus();
  const {default:MiniSearch}=await import('minisearch');index=new MiniSearch(makeSearchOptions());index.addAll(data.notes);ready.value=true;
});
onBeforeUnmount(()=>{document.body.style.overflow=oldOverflow;});
const results=computed(()=>ready.value&&query.value.trim()?index.search(query.value.trim()).sort((a,b)=>b.score*readingWeight(b.reading)-a.score*readingWeight(a.reading)).slice(0,30):[]);
function keydown(e){
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();emit('close');}
  if(e.key==='Tab'){
    const els=[...dialog.value.querySelectorAll('button,input,a[href]')],first=els[0],last=els.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
}
</script>
<template>
  <div class="search-backdrop" @click.self="emit('close')" @keydown="keydown">
    <section ref="dialog" class="search-letter" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div class="panel-heading"><h2 id="search-title">找一封手稿</h2><button type="button" aria-label="关闭搜索" @click="emit('close')">×</button></div>
      <label class="search-input-wrap"><span class="tool-magnifier" aria-hidden="true"></span><span class="sr-only">搜索标题、正文、标签与来源</span><input ref="input" v-model="query" type="search" placeholder="故事、自然表演、V2、光线……" autocomplete="off"></label>
      <p class="search-caption" role="status">{{!ready?'正在整理信件索引…':!query.trim()?'搜索 '+data.notes.length+' 份手稿的标题、正文、标签与来源':results.length?'找到 '+results.length+' 份相关手稿'+(results.length===30?'（最多展示 30 份）':''):'暂未找到，试试更短的关键词。'}}</p>
      <div class="search-results"><a v-for="result in results" :key="result.id" :href="withBase(result.url)" @click="emit('close')"><strong>{{result.title}}</strong><p>{{snippet(result.text,query)}}</p><small><span v-if="result.reading==='main'||result.reading==='topic'">{{result.reading==='main'?'阅读主线':'主题精读'}} · </span>{{result.source}}</small></a></div>
      <div v-if="!query.trim()" class="search-suggestions"><span>也许你在找</span><button v-for="word in ['人物一致性','自然表演','分镜','原画面提示词','新增模板']" :key="word" type="button" @click="query=word">{{word}}</button></div>
    </section>
  </div>
</template>
