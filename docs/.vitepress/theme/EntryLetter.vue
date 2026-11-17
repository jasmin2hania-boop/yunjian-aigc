<script setup>
import { ref,onMounted,onBeforeUnmount } from 'vue';
const visible=ref(true),ready=ref(false);
const INTRO_VERSION='letter-v2',CLOSED_HOLD_MS=2200,OPEN_HOLD_MS=1900;
const timers=new Set();let cancelled=false;
function delay(ms){return new Promise(resolve=>{const id=setTimeout(()=>{timers.delete(id);resolve();},ms);timers.add(id);});}
function enter(){visible.value=false;timers.forEach(clearTimeout);timers.clear();try{sessionStorage.setItem('yunjian-intro-seen',INTRO_VERSION);}catch{}}
onMounted(async()=>{
  let seen=false;try{seen=sessionStorage.getItem('yunjian-intro-seen')===INTRO_VERSION;}catch{}
  if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){enter();return;}
  // Let the closed letter and the opening each remain visible long enough to read.
  // Resource readiness has a cap; the visitor can skip at any point.
  const fonts=document.fonts?.ready||Promise.resolve();
  await Promise.all([Promise.race([fonts,delay(2500)]),delay(CLOSED_HOLD_MS)]);
  if(cancelled||!visible.value)return;
  ready.value=true;
  await delay(OPEN_HOLD_MS);
  if(!cancelled&&visible.value)enter();
});
onBeforeUnmount(()=>{cancelled=true;timers.forEach(clearTimeout);timers.clear();});
</script>
<template>
  <Transition name="entry"><div v-if="visible" class="entry-veil" :class="{'is-ready':ready}" role="status" aria-label="正在准备云间来信">
    <span class="entry-index" aria-hidden="true">HANIA / AIGC DIRECTOR’S ARCHIVE</span>
    <div class="entry-composition"><span class="entry-orbit" aria-hidden="true"></span><div class="entry-envelope" aria-hidden="true"><span class="entry-card">A little idea<br>for your next story.</span><span class="entry-flap"></span><span class="entry-front"></span><b>LH</b></div><p class="entry-script">A letter from the clouds.</p><h2>云间来信</h2><p class="entry-progress">{{ready?'信已备好，轻轻启封':'正在整理信笺与灵感'}}<span aria-hidden="true"></span></p></div>
    <button type="button" class="entry-skip" @click="enter">直接进入 <span aria-hidden="true">↗</span></button>
  </div></Transition>
</template>
