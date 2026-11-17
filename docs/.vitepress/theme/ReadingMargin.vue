<script setup>
import { computed,ref,onMounted,onBeforeUnmount } from 'vue';
import { withBase } from 'vitepress';
const props=defineProps({note:{type:Object,required:true},headers:{type:Array,default:()=>[]},sources:{type:Array,default:()=>[]},sourceLink:{type:Object,default:null}});
// This is article-specific stationery, never a fixed/global navigation rail.
const minutes=computed(()=>Math.max(1,Math.ceil(props.note.text.length/450)));
const arrived=ref(false);let arrivalFrame=0;
onMounted(()=>{arrivalFrame=requestAnimationFrame(()=>{arrivalFrame=requestAnimationFrame(()=>{arrived.value=true;});});});
onBeforeUnmount(()=>cancelAnimationFrame(arrivalFrame));
</script>
<template>
  <div class="margin-heading" aria-hidden="true"><span>IN THE MARGINS</span><i>Little notes,</i></div>
  <section v-if="headers.length" class="margin-slip margin-outline" :class="{'is-arriving':!arrived}">
    <p class="margin-label"><span>01 / READ</span><small>约 {{minutes}} 分钟</small></p>
    <h2>这一封，读什么</h2>
    <nav aria-label="本篇阅读提纲"><ol><li v-for="(h,i) in headers" :key="h.slug"><a :href="'#'+h.slug"><span aria-hidden="true">{{String(i+1).padStart(2,'0')}}</span>{{h.title}}</a></li></ol></nav>
  </section>
  <section class="margin-slip margin-reference" :class="{'is-arriving':!arrived}">
    <p class="margin-label">02 / KEEP THE SOURCE</p><h2>{{sources.length?'夹在这里的底稿':'这条知识的来处'}}</h2>
    <template v-if="sources.length"><a v-for="source in sources" :key="source.id" class="margin-source-link" :href="withBase(source.url)">{{source.title}}<span aria-hidden="true">↗</span></a></template>
    <a v-else-if="sourceLink" class="margin-source-link" :href="sourceLink.url" target="_blank" rel="noopener noreferrer">{{sourceLink.label}}<span aria-hidden="true">↗</span></a>
    <p v-else class="margin-source-text">{{note.source}}</p>
    <div v-if="note.tags.length" class="margin-tags"><a v-for="tag in note.tags" :key="tag" :href="withBase('/tags.html')+'?tag='+encodeURIComponent(tag)"># {{tag}}</a></div>
  </section>
  <div class="desk-stationery" aria-hidden="true"><span class="desk-envelope"></span><span class="desk-thread"></span><span class="desk-seal">LH</span></div>
  <div class="margin-signoff" aria-hidden="true"><span>LH</span><p>A thought worth keeping.<small>HANIA’S FIELD NOTES</small></p></div>
</template>
