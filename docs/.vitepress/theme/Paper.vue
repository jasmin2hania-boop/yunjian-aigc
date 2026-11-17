<script setup>
import { ref,onMounted,onBeforeUnmount } from 'vue';
defineProps({back:{type:String,default:'/'},backLabel:{type:String,default:'返回首页'},editorial:{type:Boolean,default:false}});
const reader=ref(null);let raf=0;
function move(e){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=reader.value.getBoundingClientRect(),x=Math.max(-6,Math.min(6,(e.clientX-b.left)/b.width*12-6)),y=Math.max(-5,Math.min(5,(e.clientY-b.top)/Math.min(b.height,900)*10-5));if(!raf)raf=requestAnimationFrame(()=>{raf=0;reader.value?.style.setProperty('--read-look-x',x+'px');reader.value?.style.setProperty('--read-look-y',y+'px');});}
function leave(){reader.value.style.setProperty('--read-look-x','0px');reader.value.style.setProperty('--read-look-y','0px');}
onMounted(()=>{
  // Locally drawn threadwork: a tiny repeating texture rather than a remote asset.
  try{const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d');c.strokeStyle='#c7b69b88';c.lineWidth=.65;
    for(let i=0;i<8;i++){c.save();c.translate(64,64);c.rotate(i*Math.PI/4);c.beginPath();c.ellipse(0,25,9,25,0,0,Math.PI*2);c.stroke();c.restore();}
    for(const r of [13,45,54]){c.beginPath();c.arc(64,64,r,0,Math.PI*2);c.stroke();}
    reader.value.style.setProperty('--letter-lace-pattern',`url(${canvas.toDataURL()})`);
  }catch{/* The CSS lace pattern is a complete fallback. */}
});
onBeforeUnmount(()=>cancelAnimationFrame(raf));
</script>
<template>
  <section ref="reader" class="ca-reader" :class="{'is-editorial':editorial}" @pointermove="move" @pointerleave="leave">
    <a class="ca-back" :href="back">← {{backLabel}}</a>
    <div class="reader-spread">
    <article class="ca-reading" @animationend.self="e=>{e.currentTarget.style.animation='none'}">
      <div class="read-corner" aria-hidden="true" @pointerdown="e=>{if(e.pointerType==='touch'){e.currentTarget.classList.add('is-peeking');const el=e.currentTarget;setTimeout(()=>el.classList.remove('is-peeking'),700);}}"><span class="read-corner-cut"></span><span class="read-flap-shadow"></span><span class="read-flap"></span></div>
      <span class="read-margin-word" aria-hidden="true">READ / CONNECT / CREATE</span><span class="read-watermark" aria-hidden="true">FIELD NOTES · 云间</span>
      <span class="letter-lace letter-lace-top" aria-hidden="true"></span><span class="letter-lace letter-lace-side" aria-hidden="true"></span><span class="letter-lace letter-lace-bottom" aria-hidden="true"></span><span class="letter-ribbon" aria-hidden="true"></span>
      <slot />
    </article>
    <aside v-if="editorial" class="reading-margin" aria-label="本篇旁注"><slot name="margin" /></aside>
    </div>
  </section>
</template>
