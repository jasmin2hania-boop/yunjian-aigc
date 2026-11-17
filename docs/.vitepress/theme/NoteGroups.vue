<script setup>
import { computed } from 'vue';
import { groupNotes } from '../../../lib/reading.js';
import NoteList from './NoteList.vue';
const props=defineProps({notes:{type:Array,default:()=>[]},showSources:{type:Boolean,default:false}});
const groups=computed(()=>groupNotes(props.notes));
</script>
<template>
  <NoteList v-if="!notes.length" :notes="[]" />
  <div v-else class="note-groups">
    <template v-for="group in groups" :key="group.title">
      <details v-if="group.collapsed&&!(showSources&&group.rank===80)" class="archive-group"><summary>{{group.title}}<small>{{group.notes.length}} 篇 · 按需展开</small></summary><NoteList :notes="group.notes" /></details>
      <section v-else class="reading-group" :class="{'reading-start':group.rank===0}" :aria-label="group.title">
        <div v-if="group.title!=='笔记'||groups.length>1" class="reading-group-heading"><h2>{{group.title}}</h2><span>{{group.notes.length}} 篇</span></div>
        <NoteList :notes="group.notes" />
      </section>
    </template>
  </div>
</template>
