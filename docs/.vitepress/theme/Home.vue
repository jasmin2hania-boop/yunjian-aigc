<script setup>
import { ref,onMounted,onBeforeUnmount } from 'vue';
import { withBase } from 'vitepress';
import { categories,art } from '../../../lib/categories.js';
import { data } from './library.data.js';
import SearchDialog from './SearchDialog.vue';
import ContactLetter from './ContactLetter.vue';
import EntryLetter from './EntryLetter.vue';
import { mountCloud } from './cloud.js';
const scene=ref(null),expanded=ref(false),searchOpen=ref(false),recentOpen=ref(false),contactOpen=ref(false),searchButton=ref(null),contactButton=ref(null);
let dispose;
onMounted(()=>{try{expanded.value=sessionStorage.getItem('yunjian-open')==='true';}catch{} dispose=mountCloud(scene.value);});
onBeforeUnmount(()=>dispose?.());
function toggle(){expanded.value=!expanded.value;try{sessionStorage.setItem('yunjian-open',String(expanded.value));}catch{}}
function escape(e){if(searchOpen.value)return;if(e.key==='Escape'&&expanded.value){toggle();scene.value.querySelector('.ca-hub').focus();}}
</script>

<template>
  <section ref="scene" class="ca-scene" :class="{'is-open':expanded}" aria-label="云间来信首页" @keydown="escape">
    <div class="ca-brand"><strong>云间</strong><span>AIGC DIRECTOR<br>HANIA’S ARCHIVE</span></div>
    <div class="home-tools" aria-label="资料查找">
      <button ref="searchButton" class="home-tool" type="button" @click="searchOpen=true"><span class="tool-magnifier" aria-hidden="true"></span>找一封手稿</button>
      <a class="home-tool" :href="withBase('/star.html')"><span class="tool-star" aria-hidden="true">✧</span>星标</a>
      <button class="home-tool" type="button" :aria-expanded="recentOpen" aria-controls="recent-notes" @click="recentOpen=!recentOpen"><span class="tool-letter" aria-hidden="true"></span>最近来信</button>
    </div>
    <div class="ca-world">
      <div v-for="name in ['light','aura','sweep','mist ca-mist-back','mist ca-mist-front','mist ca-mist-right']" :key="name" :class="'ca-'+name" aria-hidden="true"></div>
      <div class="ca-intro"><div class="ca-intro-kicker">WHERE IDEAS GENTLY GROW</div><h1><span class="ca-title-first">让灵感</span><span class="ca-title-second">在<span class="ca-word-cloud">云间</span>生长<span class="ca-title-dot">。</span></span></h1><div class="ca-intro-rule"></div><p>把偶然的发现，<br>慢慢变成自己的创作语言。</p></div>
      <div class="ca-floor" aria-hidden="true"></div>
      <nav id="ca-orbits" class="ca-orbits" aria-label="九个知识板块" :aria-hidden="!expanded" :inert="!expanded">
        <a v-for="(c,i) in categories" :key="c.id" class="ca-node" :href="withBase('/'+c.id+'/index.html')" :aria-label="'进入'+c.name" :style="{'--nx':c.x,'--ny':c.y,'--mx':[17,50,83][i%3],'--my':49+Math.floor(i/3)*16,'--delay':i*48+'ms'}">
          <span class="ca-object" aria-hidden="true"><span :class="'ca-art ca-art-'+c.object" v-html="art[c.object]"></span></span><span class="ca-node-name">{{c.label}}</span><span class="ca-node-en">{{c.en}}</span>
        </a>
      </nav>
      <button class="ca-hub" type="button" :aria-label="expanded?'点击云朵，收起知识板块':'点击云朵，展开九个知识板块'" aria-controls="ca-orbits" :aria-expanded="expanded" @click="toggle">
        <span class="ca-envelope" aria-hidden="true"><span class="envelope-back"></span><span class="envelope-lining"></span><span class="envelope-letter"></span><span class="envelope-flap"></span><span class="envelope-front"></span><span class="envelope-seal">LH</span></span>
        <span class="ca-cloud-body"><span class="ca-fallback" aria-hidden="true"></span><canvas class="ca-cloud-canvas" aria-hidden="true"></canvas></span>
      </button>
      <div class="ca-hint" aria-live="polite">{{expanded?'选一封手稿，带走一点灵感':'轻触云朵，拆开一封来信'}}<span>{{expanded?'轻触云朵可收起':'靠近，感受一点柔软'}}</span></div>
      <canvas class="ca-atmosphere" aria-hidden="true"></canvas>
    </div>
    <div class="ca-coordinate">01 — 09 / KNOWLEDGE ISLANDS<br>{{data.notes.length}} 份手稿 · 写给下一次创作</div>
    <button ref="contactButton" type="button" class="contact-stamp" aria-label="联系 Hania" :aria-expanded="contactOpen" @click="contactOpen=true"><span aria-hidden="true" class="stamp-envelope"></span><span>联系 Hania<small>LET’S CREATE SOMETHING</small></span><span class="stamp-arrow" aria-hidden="true">↗</span></button>
    <Transition name="letter-panel"><aside v-if="recentOpen" id="recent-notes" class="recent-panel" aria-label="最近更新手稿"><div class="panel-heading"><span>RECENT LETTERS / 最近来信</span><button type="button" aria-label="关闭最近来信" @click="recentOpen=false">×</button></div><a v-for="note in data.notes.slice(0,5)" :key="note.id" :href="withBase(note.url)"><span>{{note.title}}</span><time :datetime="note.updated">{{note.updated}}</time></a></aside></Transition>
    <SearchDialog v-if="searchOpen" @close="searchOpen=false;searchButton?.focus()" />
    <ContactLetter v-if="contactOpen" @close="contactOpen=false;contactButton?.focus()" />
    <EntryLetter />
  </section>
</template>
