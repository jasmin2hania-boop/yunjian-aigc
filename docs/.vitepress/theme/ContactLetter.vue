<script setup>
import { ref,onMounted,onBeforeUnmount } from 'vue';
const emit=defineEmits(['close']),dialog=ref(null),close=ref(null),copyLabel=ref('复制邮箱');
const email='cnclh0420@163.com';let timer,oldOverflow;
onMounted(()=>{oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';close.value.focus();});
onBeforeUnmount(()=>{clearTimeout(timer);document.body.style.overflow=oldOverflow;});
async function copy(){try{await navigator.clipboard.writeText(email);copyLabel.value='已复制邮箱';}catch{const range=document.createRange();range.selectNodeContents(dialog.value.querySelector('.contact-email'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);copyLabel.value='已选中，请手动复制';}clearTimeout(timer);timer=setTimeout(()=>copyLabel.value='复制邮箱',2400);}
function key(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();emit('close');}if(e.key==='Tab'){const els=[...dialog.value.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}}}
</script>
<template>
  <div class="search-backdrop contact-backdrop" @click.self="emit('close')" @keydown="key">
    <section ref="dialog" class="contact-letter" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <button ref="close" class="contact-close" type="button" aria-label="关闭联系方式" @click="emit('close')">×</button>
      <span class="contact-postmark" aria-hidden="true">LH<small>LETTERS & IDEAS</small></span>
      <p class="contact-kicker">A LETTER, A NEW POSSIBILITY</p>
      <p class="contact-script" aria-hidden="true">Dear fellow creator,</p>
      <h2 id="contact-title">让下一个故事，<br>从一封来信开始。</h2>
      <p class="contact-intro">关于 AIGC、影像创作，或一个值得聊聊的灵感。</p>
      <div class="contact-address"><span>TO / HANIA</span><p class="contact-email">{{email}}</p></div>
      <div class="contact-actions"><button class="copy-email" type="button" @click="copy" aria-live="polite">{{copyLabel}}<span aria-hidden="true">↗</span></button></div>
      <p class="contact-signature">Warmly,<span>Hania</span></p>
    </section>
  </div>
</template>
