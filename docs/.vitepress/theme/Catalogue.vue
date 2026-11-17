<script setup>
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { art,categories } from '../../../lib/categories.js';
import NoteGroups from './NoteGroups.vue';
const props=defineProps({category:{type:Object,required:true},notes:{type:Array,default:()=>[]}});
const tagCount=computed(()=>new Set(props.notes.flatMap(n=>n.tags)).size);
const volume=computed(()=>String(categories.findIndex(c=>c.id===props.category.id)+1).padStart(2,'0'));
</script>
<template>
  <section class="catalogue" aria-label="分类笔记目录">
    <a class="catalogue-back ca-back" :href="withBase('/')">← 返回首页</a>
    <div class="catalogue-volume">
      <div class="catalogue-edition" aria-hidden="true"><span>HANIA’S KNOWLEDGE ATELIER</span><span>VOL. {{volume}} / 09</span></div>
      <header class="catalogue-header">
        <div class="catalogue-title-block"><p class="catalogue-kicker">{{category.en}} / NOTE DIRECTORY</p><h1>{{category.name}}</h1><p class="catalogue-description">{{category.desc}}</p><p class="catalogue-count">分类目录 <span aria-hidden="true">·</span> {{notes.length}} 篇独立笔记 <span v-if="tagCount" class="catalogue-topics">· {{tagCount}} 个主题</span></p></div>
        <div class="catalogue-emblem" aria-hidden="true"><span class="catalogue-emblem-orbit"></span><span :class="'ca-art ca-art-'+category.object" v-html="art[category.object]"></span></div>
      </header>
      <div class="catalogue-directory"><p v-if="notes.length" class="catalogue-instruction">挑一张纸签，开始这一回的阅读 <span aria-hidden="true">↘</span></p><NoteGroups :notes="notes" :show-sources="category.id==='collection'" /></div>
      <p class="catalogue-colophon" aria-hidden="true">COLLECT A THOUGHT. OPEN A LETTER.<span>HANIA’S ARCHIVE</span></p>
    </div>
  </section>
</template>
