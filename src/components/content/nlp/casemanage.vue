<template>
    <div>
      <Card>
        <p slot="title">
          <Icon type="filing"></Icon>
          用例导入
        </p>
        <Form :model="formItem" :label-width="80">
          <FormItem label="moduleName" style="width: 400px;">
            <Input v-model="formItem.moduleName" placeholder="Enter something..." style="margin-left: 25px;"></Input>
          </FormItem>

          <FormItem label="file" style="width: 400px;">
            <Upload action="//jsonplaceholder.typicode.com/posts/" :before-upload="handleUpload" style="margin-left: 25px;">
              <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
            <div v-if="formItem.file !== null" style="margin-left: 25px;">{{formItem.file.name}}</div>
          </FormItem>

          <FormItem label="fullScale">
            <RadioGroup v-model="formItem.fullScale" style="margin-left: 25px;" @on-change="selectBox">
              <Radio label="true">on</Radio>
              <Radio label="false">off</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem style="margin-left: 25px;">
            <Button type="primary" @click="handleSubmit" :loading="loading">Submit</Button>
            <Button type="ghost" style="margin-left: 25px">Cancel</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    components: {},
    data () {
      return {
        loading: false,
        formItem: {
          file: null,
          moduleName: '',
          fullScale: 'true'
        }
      }
    },
    methods: {
      handleUpload (file) {
        this.formItem.file = null
        this.formItem.file = file
        return false
      },
      uploading (event) {
        this.formItem.file = event.target.files[0]
      },
      selectBox (status) {
        console.log(status)
        console.log('select:', this.formItem.fullScale)
      },
      handleSubmit () {
        event.preventDefault()
        let formData = new FormData()
        formData.append('file', this.formItem.file)
        formData.append('moduleName', this.formItem.moduleName)
        formData.append('fullScale', this.formItem.fullScale)
        this.$Message.info('开始批量导入用例，请等待。。。')
        this.loading = true
        console.log('fileslist:', this.file)
        let url = window.serverurl + '/task/upload'
        $.ajax({
          url: url,
          type: 'POST',
          cache: false,
          data: formData,
          processData: false,
          success: (result) => {
            this.loading = false
            this.$Message.success('批量导入用例成功!')
          },
          error: (errorMsg) => {
            this.$Message.error('批量导入用例失败!')
            this.loading = false
            console.log(errorMsg)
          }

        })
      }
    },
    created () {}
  }
</script>

<style>
</style>
