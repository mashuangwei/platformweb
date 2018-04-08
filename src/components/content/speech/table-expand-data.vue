<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <i-col span="6">
        <span class="expand-key">lang：</span>
        <span class="expand-value">{{ row.lang }}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">nonlp：</span>
        <span class="expand-value">{{ row.nonlp }}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">codec：</span>
        <span class="expand-value">{{ row.codec }}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">nointermediateasr：</span>
        <span class="expand-value">{{ row.nointermediateasr }}</span>
      </i-col>

    </Row>
    <Row>
      <i-col span="6">
        <span class="expand-key">vadmode：</span>
        <span class="expand-value">{{ row.vadmode}}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">vendtimeout：</span>
        <span class="expand-value">{{ row.vendtimeout}}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">voicepower：</span>
        <span class="expand-value">{{ row.voicepower }}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">voicetrigger：</span>
        <span class="expand-value">{{ row.voicetrigger }}</span>
      </i-col>
    </Row>
    <br>
    <Row>
      <i-col span="6">
        <span class="expand-key">result：</span>
        <span class="expand-value">{{ row.result }}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">voiceextra：</span>
        <span class="expand-value">{{ row.voiceextra}}</span>
      </i-col>

      <i-col span="12">
        <span class="expand-key">expect：</span>
        <span class="expand-value">{{ row.expect }}</span>
      </i-col>

    </Row>
    <br>
    <Row>
      <i-col span="24">
        <span class="expand-key">fileurl：</span>
        <span class="expand-value">{{ row.fileurl}}</span>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    }
  }
</script>
