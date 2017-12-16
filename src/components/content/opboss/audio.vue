<template>
  <audio :src="src" controls="controls" style="width:100%;">
    {{ name }}
  </audio>
</template>

<script>
export default {
  props: {
    src: {
      default () {
        return ''
      }
    },
    name: {
      default () {
        return 'wav文件'
      }
    }
  }
}
</script>
