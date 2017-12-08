<template lang="html">
  <div class="login-form">
    <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="Username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formInline.password" placeholder="Password">
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem class="loginbtn-wrap">
        <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import { Form, Icon, FormItem, Input, Col, Row } from 'iview'

  export default {
    components: {
      Form,
      FormItem,
      Input,
      Row,
      'i-col': Col,
      Icon
    },
    data () {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {required: true, message: 'Please fill in the user name', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please fill in the password.', trigger: 'blur'},
            {type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur'}
          ]
        }
      }
    },

    mounted () {
      document.getElementsByTagName('body')[0].addEventListener('click', () => {
        this.isShowLogin = false
      })
    },

    methods: {
      login () {
        this.isShowLogin = !this.isShowLogin
      },

      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')
          }
        })
        // history.go(-1) 登录成功后回到上个页面
      }
    }
    // 进入路由时判断当前登录状态，已登录则跳转到首页
    // beforeRouteEnter (to, from, next) {
    //   next(VM => {
    //     if (VM.$AV.User.current()) {
    //       console.log('当前登录')
    //       VM.$router.push('/')
    //     } else {
    //       console.log('当前未登录')
    //     }
    //   })
    // },
    // data () {
    //   // 验证名字
    //   let validatorName = function (rule, value, callback) {
    //     if (!value) {
    //       callback(new Error('请输入账号'))
    //     } else if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(value) || value.length < 6) {
    //       callback(new Error('账号只能是6位以上中英文或者数字'))
    //     } else {
    //       callback()
    //     }
    //   }
    //   // 验证密码
    //   let validatorPass = (rule, value, callback) => {
    //     if (!value) {
    //       callback(new Error('请输入密码'))
    //     } else if (!/^[A-Za-z0-9]+$/.test(value) || value.length < 6) {
    //       callback(new Error('密码只能是6位以上英文或者数字'))
    //     } else {
    //       callback()
    //     }
    //   }
    //   return {
    //     ruleForm: {
    //       name: '',
    //       password: ''
    //     },
    //     rules: {
    //       name: [
    //         { validator: validatorName, trigger: 'blur' }
    //       ],
    //       password: [
    //         { validator: validatorPass, trigger: 'blur' }
    //       ]
    //     }
    //   }
    // },
    // methods: {
    //   // 表单提交
    //   handleSubmit () {
    //     // 验证表单
    //     this.$refs.ruleForm.validate(valid => {
    //       if (valid) {
    //         console.log('验证通过')
    //         // 调用SDK登录方法，执行登录过程
    //         this.$AV.User.logIn(this.ruleForm.name, this.ruleForm.password).then(loginedUser => {
    //           console.log(loginedUser)
    //           this.$message('成功登录')
    //           // 登录成功跳转到首页
    //           this.$router.push('/')
    //         }, error => {
    //           console.log(error)
    //           this.$message('登录失败，请重试')
    //           // 登录失败清空表单
    //           this.handleReset()
    //         })
    //       } else {
    //         console.log('验证不通过')
    //       }
    //     })
    //   },
    //   // 重置表单
    //   handleReset () {
    //     this.$refs.ruleForm.resetFields()
    //   }
    // }
  }
</script>

<style lang="css">
  .loginbtn-wrap {
    text-align: center;
  }

  .login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -200px 0 0 -250px;
    background-color: #fff;
    width: 500px;
    padding: 50px;
    border: 1px solid #eee;
    border-radius: 12px;
  }

  .login-form .ivu-btn {
    width: 100%;
  }
</style>
