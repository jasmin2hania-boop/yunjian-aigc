<script setup>
import { withBase } from 'vitepress';
defineProps({notes:{type:Array,default:()=>[]}});
</script>
<template>
  <div v-if="notes.length" class="note-list"><div v-for="note in notes" :key="note.id" class="ca-note"><a class="note-title" :href="withBase(note.url)"><span class="note-title-text">{{note.title}}</span><span class="note-arrow" aria-hidden="true">↗</span></a><p v-if="note.summary&&!note.title.includes(note.summary)">{{note.summary}}</p><div class="ca-note-meta"><time :datetime="note.updated">{{note.updated.replaceAll('-','.')}}</time><span v-if="note.star" aria-label="星标">✧</span><a v-for="tag in note.tags" :key="tag" :href="withBase('/tags.html')+'?tag='+encodeURIComponent(tag)"># {{tag}}</a></div></div></div>
  <p v-else class="ca-empty">这里先留一页空白，等待下一次值得记录的发现。</p>
</template>
