<script setup>
import { computed,ref,onMounted,onBeforeUnmount,watch,nextTick } from 'vue';
import { Content,useData,useRoute,useRouter,withBase } from 'vitepress';
import { data } from './library.data.js';
import { categories } from '../../../lib/categories.js';
import Home from './Home.vue';import Paper from './Paper.vue';import Lead from './Lead.vue';import NoteGroups from './NoteGroups.vue';
import Catalogue from './Catalogue.vue';
import ReadingMargin from './ReadingMargin.vue';
const {page,frontmatter}=useData(),route=useRoute(),router=useRouter();
const layout=computed(()=>frontmatter.value.layout||'article');
const note=computed(()=>data.notes.find(n=>n.file===page.value.relativePath));
const category=computed(()=>categories.find(c=>c.id===(frontmatter.value.categoryId||note.value?.category)));
const back=computed(()=>withBase(layout.value==='article'&&category.value?'/'+category.value.id+'/index.html':'/'));
const backLabel=computed(()=>layout.value==='article'&&category.value?'返回'+category.value.name:'返回首页');
const selectedTag=ref('');
function syncTag(){selectedTag.value=typeof location!=='undefined'?new URL(location.href).searchParams.get('tag')||'':'';}
// VitePress route.path excludes the query: changing tags on the same page must
// also observe completed navigation, rather than only the pathname.
let previousAfter;
async function afterRoute(href){await previousAfter?.(href);syncTag();}
onMounted(()=>{syncTag();previousAfter=router.onAfterRouteChange;router.onAfterRouteChange=afterRoute;window.addEventListener('popstate',syncTag);});
onBeforeUnmount(()=>{window.removeEventListener('popstate',syncTag);if(router.onAfterRouteChange===afterRoute)router.onAfterRouteChange=previousAfter;});
watch(()=>route.path,()=>{syncTag();if(lightbox.value)closeImage();});
const title=computed(()=>layout.value==='tags'?(selectedTag.value?'# '+selectedTag.value:'主题索引'):frontmatter.value.title||'这封来信暂未找到');
const list=computed(()=>layout.value==='category'?data.notes.filter(n=>n.category===category.value?.id):layout.value==='star'?data.notes.filter(n=>n.star):layout.value==='tags'&&selectedTag.value?data.notes.filter(n=>n.tags.includes(selectedTag.value)):[]);
const eyebrow=computed(()=>category.value?.en||(layout.value==='star'?'FAVOURITE LETTERS':'TOPIC INDEX'));
const description=computed(()=>layout.value==='category'?category.value?.desc:layout.value==='star'?'那些想反复翻阅、再次带入创作的手稿。':layout.value==='tags'?'从不同板块，找到同一个主题的资料。':note.value?.summary||'');
const backlinks=computed(()=>note.value?note.value.backlinks.map(id=>data.notes.find(n=>n.id===id)).filter(Boolean):[]);
const headers=computed(()=>page.value.headers||[]);
const sourceNotes=computed(()=>note.value?note.value.outgoing.map(id=>data.notes.find(n=>n.id===id)).filter(n=>n?.category==='collection').slice(0,3):[]);
const sourceLink=computed(()=>{const raw=note.value?.source||'';const m=raw.match(/https?:\/\/[^\s｜|]+/);return m?{url:m[0],label:raw.slice(0,m.index).replace(/[｜|]\s*$/,'')||'查看来源'}:null;});
const lightbox=ref(null),imageClose=ref(null);let previousFocus=null,oldOverflow='',stampTimers=new Set();
let headingTimer=0,highlightedHeading=null;
function onHeadingJump(e){
  const link=e.target.closest('a[href^="#"]');
  if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
  let target;try{target=document.getElementById(decodeURIComponent(link.hash.slice(1)));}catch{return;}
  if(!target?.matches('.ca-prose h2,.ca-prose h3'))return;
  // VitePress updates fragments with pushState, which does not set CSS :target.
  // Explicit feedback also works when clicking the same outline item twice.
  clearTimeout(headingTimer);highlightedHeading?.classList.remove('is-jump-target');
  target.classList.remove('is-jump-target');void target.offsetWidth;target.classList.add('is-jump-target');highlightedHeading=target;
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  headingTimer=setTimeout(()=>{target.classList.remove('is-jump-target');highlightedHeading=null;},1700);
}
async function onBodyClick(e){
  const copy=e.target.closest('[data-copy]');
  if(copy){
    const box=copy.closest('.read-prompt'),pre=box.querySelector('pre');let copied=false;
    try{await navigator.clipboard.writeText(pre.textContent);copied=true;}catch{const range=document.createRange();range.selectNodeContents(pre);const s=window.getSelection();s.removeAllRanges();s.addRange(range);}
    copy.textContent=copied?'已复制':'已选中，请手动复制';copy.classList.add('is-selected');copy.setAttribute('aria-live','polite');
    box.querySelector('.letter-receipt')?.remove();const stamp=document.createElement('span');stamp.className='letter-receipt';stamp.setAttribute('aria-hidden','true');
    const b=document.createElement('b');b.textContent=copied?'已复制':'已选中';const small=document.createElement('small');small.textContent=copied?'COPIED':'SELECTED';stamp.append(b,small);box.append(stamp);
    const timer=setTimeout(()=>{stamp.remove();if(copy.isConnected){copy.textContent='复制提示词';copy.classList.remove('is-selected');}stampTimers.delete(timer);},2300);stampTimers.add(timer);return;
  }
  const img=e.target.closest('.ca-prose img');if(img){previousFocus=document.activeElement;lightbox.value={src:img.currentSrc||img.src,alt:img.alt};oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';await nextTick();imageClose.value.focus();}
}
function closeImage(){lightbox.value=null;if(typeof document!=='undefined')document.body.style.overflow=oldOverflow;previousFocus?.focus?.();}
function imageKey(e){if(e.key==='Escape')closeImage();if(e.key==='Tab'){e.preventDefault();imageClose.value.focus();}}
function imageKeyboard(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches('.ca-prose img')){e.preventDefault();e.target.click();}}
function enhanceImages(){document.querySelectorAll('.ca-prose img').forEach(img=>{img.loading='lazy';img.setAttribute('tabindex','0');img.setAttribute('role','button');img.setAttribute('aria-label','放大查看：'+img.alt);});}
watch(()=>page.value.relativePath,async()=>{await nextTick();if(typeof document!=='undefined')enhanceImages();});
onMounted(enhanceImages);
onBeforeUnmount(()=>{stampTimers.forEach(clearTimeout);clearTimeout(headingTimer);highlightedHeading?.classList.remove('is-jump-target');if(lightbox.value)closeImage();});
</script>

<template>
  <div id="cloud-archive">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <main id="main-content" tabindex="-1" @click="onHeadingJump">
      <Home v-if="layout==='home'" />
      <Catalogue v-else-if="layout==='category'&&category" :key="category.id" :category="category" :notes="list" />
      <Paper v-else :key="page.relativePath" :back="back" :back-label="backLabel" :editorial="layout==='article'&&!!note">
        <template #margin><ReadingMargin v-if="note" :note="note" :headers="headers" :sources="sourceNotes" :source-link="sourceLink" /></template>
        <div class="ca-eyebrow">{{eyebrow}} <span>{{layout==='article'?'云间手稿':'云间 · 分卷目录'}}</span></div>
        <p class="letter-salutation" aria-hidden="true">Dear ideas,</p>
        <h1>{{title}}</h1>
        <template v-if="layout==='article'&&note">
          <div class="ca-description"><time :datetime="note.date">整理于 {{note.date.replaceAll('-','.')}}</time><span v-if="note.updated!==note.date"> · 更新于 {{note.updated.replaceAll('-','.')}}</span> · {{note.reading==='main'?'阅读主线':note.reading==='topic'?'主题精读':note.category==='collection'?'视频底稿':'知识笔记'}}<span v-if="note.star"> · ✧ 星标</span></div>
          <div class="read-tags"><a v-for="tag in note.tags" :key="tag" class="read-tag" :href="withBase('/tags.html')+'?tag='+encodeURIComponent(tag)"># {{tag}}</a></div>
          <Lead>{{description}}</Lead>
          <p v-if="note.reading==='detail'&&note.guide" class="read-consolidated">这条方法已整理进主题精读：<a :href="withBase(note.guide)">{{data.notes.find(n=>n.url===note.guide)?.title||'查看整合后的笔记'}}</a></p>
          <details v-if="headers.length" class="read-toc"><summary>本篇目录</summary><ol><li v-for="h in headers" :key="h.slug"><a :href="'#'+h.slug">{{h.title}}</a></li></ol></details>
          <div class="ca-prose" @click="onBodyClick" @keydown="imageKeyboard"><Content /></div>
          <div class="read-source">来源：<a v-if="sourceLink" class="ca-textlink" :href="sourceLink.url" target="_blank" rel="noopener noreferrer">{{sourceLink.label}}</a><span v-else>{{note.source}}</span><span class="letter-postmark" aria-hidden="true"><b>LH</b><small>ARCHIVE</small></span><div class="letter-signature" aria-hidden="true"><span>Until the next idea.</span>云间 · 写给下一次创作</div></div>
          <details v-if="backlinks.length" class="read-related"><summary>哪些手稿引用了本篇 · {{backlinks.length}}</summary><ul><li v-for="other in backlinks" :key="other.id"><a class="ca-textlink" :href="withBase(other.url)">{{other.title}}</a></li></ul></details>
        </template>
        <template v-else-if="['category','star','tags'].includes(layout)">
          <Lead>{{description}}</Lead>
          <div v-if="layout==='tags'&&!selectedTag" class="tag-cloud"><a v-for="tag in data.tags" :key="tag" class="read-tag" :href="withBase('/tags.html')+'?tag='+encodeURIComponent(tag)"># {{tag}} <small>{{data.notes.filter(n=>n.tags.includes(tag)).length}}</small></a></div>
          <template v-else><NoteGroups :notes="list" /></template>
        </template>
        <div v-else class="ca-prose"><p>这封来信暂未找到。可以通过页面上方的入口回到首页。</p></div>
      </Paper>
    </main>
    <div v-if="lightbox" class="image-backdrop" role="dialog" aria-modal="true" aria-label="原画面放大查看" @click.self="closeImage" @keydown="imageKey"><button ref="imageClose" type="button" class="image-close" aria-label="关闭图片" @click="closeImage">×</button><figure><img :src="lightbox.src" :alt="lightbox.alt"><figcaption>{{lightbox.alt}}</figcaption></figure></div>
  </div>
</template>
