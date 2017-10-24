<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <i-col span="8">
        <span class="expand-key">用例描述：</span>
        <span class="expand-value">{{ row.description }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">意图：</span>
        <span class="expand-value">{{ row.projectName }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">domain：</span>
        <span class="expand-value">{{ row.moduleName }}</span>
      </i-col>
    </Row>
    <Row>
      <i-col span="8">
        <span class="expand-key">author：</span>
        <span class="expand-value">{{ row.author }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">createtime：</span>
        <span class="expand-value">{{ row.createTime }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">是否执行：</span>
        <span class="expand-value">{{ row.switchType }}</span>
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
