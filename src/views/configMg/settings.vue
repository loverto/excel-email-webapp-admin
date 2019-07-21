<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      该功能未实现
    </div>
  </div>
</template>

<script>
import * as Api from '@/api/config'
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
import { uploader, removeRemoteImage } from '@/utils/file-uploader.js'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { ElSelectDropdown },
  data() {
    return {
      ruleForm: {
        deleteNotCompletedDate: 7,
        deleteUnpaid: 700
      },
      total: 0,
      options: [],
      listQuery: {
        page: 1,
        pageSize: 10000
      },
      rules: {
        deleteNotCompletedDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        deleteUnpaid: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      uploading: false,
      showFileList: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    beforeUpload(file) {
      if (!file) return false

      const ext = /\.[^\.]+$/.exec(file.name)[0]

      if (!/\.(jpe?g|png)/.test(ext)) {
        this.showFileList = false
        this.$message({
          message: '只允许上传 jpg/jpeg/png 格式的图片哦~',
          type: 'warning'
        })
        return false
      }
    },
    /**
     * 新版上传方法
     */
    uploadSectionFile(data) {
      this.uploading = true
      this.ruleForm.diePatternType = data.file.name.split('.')[0]
      uploader('die-pattern', data.file).then(response => {
        this.uploading = false
        const { bucketName, fileName } = response
        this.ruleForm.diePatternimagePath = `/${bucketName}/${fileName}`
      })
        .catch(err => {
          this.uploading = false
          console.error(err)
        })
    },
    /**
     * 删除图片
     */
    removeImage(file) {
      const url = this.ruleForm.diePatternimagePath
      const fileName = url.split('/')[2]
      removeRemoteImage('die-pattern', fileName).then(() => {
        console.log(`Remove image '${fileName}' successed!`)
        this.ruleForm.diePatternimagePath = ''
        this.showFileList = false
      })
    },
    getList() {
      Api.getList().then(response => {
        this.ruleForm = response.data[0]
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.ruleForm
          // debugger
          // data.computerType = this.ruleForm.ct
          Api.update(data).then(response => {
            if (response.status === 201) {
              this.$message({
                message: '设置保存成功！',
                type: 'success'
              })
              // 重置表单
              this.resetForm(formName)
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .width-50p {
    width: 50%;
  }
  .form-wrapper {
    width: 50%;
  }
  .line {
    text-align: center;
  }

  .range-input {
    //
  }
</style>
