<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <i-col span="8">
        <span class="expand-key">时间：</span>
        <span class="expand-value">{{ row.asrtime }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">AppId：</span>
        <span class="expand-value">{{ row.app_id }}</span>
      </i-col>

    </Row>
    <Row>
      <i-col span="8">
        <span class="expand-key">deviceId：</span>
        <span class="expand-value">{{ row.asrdeviceid}}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">intent：</span>
        <span class="expand-value">{{ row.intent }}</span>
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
