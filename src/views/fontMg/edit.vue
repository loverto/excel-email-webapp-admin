<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="字体文件包:" prop="name">
          <el-upload
            :multiple="false"
            :show-file-list="showFileList"
            :limit="1"
            :http-request="uploadSectionFile"
            :on-remove="removeImage"
            :before-upload="beforeUpload"
            list-type="text"
            action="string"
            accept=".zip,.rar"
          >
            <el-button
              :disabled="ruleForm.productionRenderingSaveLocation ? true : false"
              size="small"
              type="primary"
            >
              <i :class="'el-icon-' + (uploading ? 'loading' : 'upload')" /> 点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip/rar格式的文件哦~</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即{{ buttonText }}</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { update, getList } from '@/api/config'
import { uploader, removeRemoteImage } from '@/utils/file-uploader.js'

export default {
  name: 'UploadFontPage',
  props: {
    formData: {
      type: Object,
      default: null
    },
    buttonText: {
      type: String,
      default: '添加'
    }
  },
  data() {
    return {
      ruleForm: {
        id: 0,
        // 品牌代码值
        productionRenderingSaveLocation: ''
      },
      rules: {
        productionRenderingSaveLocation: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      getList().then(response => {
        if (response.status === 200) {
          this.ruleForm = response.data[0]
        }
      })
    },
    beforeUpload(file) {
      if (!file) return false

      const ext = /\.[^\.]+$/.exec(file.name)[0]
      debugger
      if (!/\.(zip|rar)/.test(ext)) {
        this.showFileList = false
        this.$message({
          message: '只能上传zip/rar格式的文件哦~',
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
      uploader('font', data.file).then(response => {
        this.uploading = false
        const { bucketName, fileName } = response
        this.ruleForm.productionRenderingSaveLocation = `/${bucketName}/${fileName}`
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
      const url = this.ruleForm.productionRenderingSaveLocation
      const fileName = url.split('/')[2]
      removeRemoteImage('font', fileName).then(() => {
        console.log(`Remove font '${fileName}' successed!`)
        this.ruleForm.productionRenderingSaveLocation = ''
        this.showFileList = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.productionRenderingSaveLocation = this.ruleForm.productionRenderingSaveLocation
          // 保存操作
          update(this.formData).then(response => {
            if (response.status === 201 || response.status === 200) {
              this.$message({
                message: `${this.buttonText}产品成功！`,
                type: 'success'
              })

              // 产品列表组件
              const productIndexComp = this.$parent.$parent
              if (this.buttonText === '编辑' || productIndexComp.$options.name === 'ProductList') {
                // 通知父组件中的监听回调方法
                productIndexComp.$emit('saveNotify', true)
              } else {
                // 新增完重置表单
                this.resetForm(formName)
              }
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
    },
    uploadIcon() {
      const self = this
      const fileNode = document.getElementById('file')
      fileNode.click()
      fileNode.onchange = (evt) => {
        const reader = new FileReader()
        const file = evt.target.files[0]
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          const result = this.result
          self.ruleForm.icon = result.substring(result.indexOf(',') + 1, result.length)
          self.ruleForm.iconContentType = file.type

          self.$message({
            message: '上传成功！',
            type: 'success'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // .width-50p {
  //   width: 50%;
  // }
  // .form-wrapper {
  //   width: 50%;
  // }
  .line {
    text-align: center;
  }

  .range-input {
    //
  }
</style>
