<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="图片类型:" prop="imageType">
          <el-select v-model="ruleForm.imageType" filterable clearable class="width-50p" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.value"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="图片:">
          <el-upload
            :multiple="false"
            :show-file-list="showFileList"
            :limit="1"
            :http-request="uploadSectionFile"
            :on-remove="removeImage"
            :before-upload="beforeUpload"
            list-type="picture"
            action="string"
            accept=".jpeg,.jpg,.png"
          >
            <el-button
              :disabled="ruleForm.imgeUrl ? true : false"
              size="small"
              type="primary"
            >
              <i :class="'el-icon-' + (uploading ? 'loading' : 'upload')" />  点击上传
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png格式的文件哦~</div>
          </el-upload>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { saveOrUpdate } from '@/api/official-gallerie'
import { getList } from '@/api/image-type'
import { uploader, removeRemoteImage } from '@/utils/file-uploader.js'
export default {
  data() {
    return {
      ruleForm: {
        imageType: {},
        imgeUrl: ''
      },
      total: 0,
      options: [],
      listQuery: {
        page: 1,
        pageSize: 10000
      },
      rules: {
        imageType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        imgeUrl: [
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
      uploader('official-gallerie', data.file).then(response => {
        this.uploading = false
        const { bucketName, fileName } = response
        this.ruleForm.imgeUrl = `/${bucketName}/${fileName}`
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
      const url = this.ruleForm.imgeUrl
      const fileName = url.split('/')[2]
      removeRemoteImage('official-gallerie', fileName).then(() => {
        console.log(`Remove image '${fileName}' successed!`)
        this.ruleForm.imgeUrl = ''
        this.showFileList = false
      })
    },
    getList() {
      getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
        this.options = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 检查当前是新增还是保存
          let method = 'post'
          if (this.ruleForm.id || this.buttonText === '编辑') {
            method = 'put'
          }
          const data = this.ruleForm
          // debugger
          // data.computerType = this.ruleForm.ct
          saveOrUpdate(data, method).then(response => {
            if (response.status === 201 || response.status === 200) {
              this.$message({
                message: '添加官方图库成功！',
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
