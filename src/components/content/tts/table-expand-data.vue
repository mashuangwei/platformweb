<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <i-col span="8">
        <span class="expand-key">lang：</span>
        <span class="expand-value">{{ row.lang }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">环境：</span>
        <span class="expand-value">{{ row.environment }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">codec：</span>
        <span class="expand-value">{{ row.codec }}</span>
      </i-col>

    </Row>
    <Row>
      <i-col span="6">
        <span class="expand-key">采样率：</span>
        <span class="expand-value">{{ row.sampleRate}}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">请求类型：</span>
        <span class="expand-value">{{ row.service}}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">创建时间：</span>
        <span class="expand-value">{{ row.createTime }}</span>
      </i-col>
      <i-col span="6">
        <span class="expand-key">更新时间：</span>
        <span class="expand-value">{{ row.updateTime }}</span>
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
