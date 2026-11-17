<template>
  <div class="read-sequence" aria-label="表演发生的四个阶段">
    <div v-for="(step,i) in [['RECEIVE','接收信息'],['PAUSE','短暂停顿'],['FEEL','眼神与呼吸'],['RESPOND','动作与回应']]" :key="i">
      <i :class="['read-illustrated-step','read-sketch-'+i]" aria-hidden="true"><b></b></i><small>{{step[0]}}</small><span>{{step[1]}}</span>
    </div>
  </div>
</template>
