<template>
  <div class="app-container product-wrapper">
    <div class="form-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
        <el-form-item label="邮件主题:" prop="mailSubject">
          <el-input v-model="ruleForm.mailSubject" placeholder="五险一金缴费基数上调通知..." value="五险一金缴费基数上调通知" class="width-50p" />
        </el-form-item>
        <el-form-item label="邮件内容:" prop="mailContent">
          <tinymce v-model="ruleForm.mailContent" :height="300" />
        </el-form-item>
        <el-form-item label="上传文件:">
          <el-upload
            ref="upload"
            :multiple="false"
            :show-file-list="showFileList"
            :limit="1"
            :http-request="uploadSectionFile"
            :on-remove="removeImage"
            :before-upload="beforeUpload"
            list-type="picture"
            action="string"
            accept=".xlsx,.xls"
          >
            <el-button
              v-if="maskTitle === '添加'"
              size="small"
              type="primary"
            >
              <i :class="'el-icon-' + (uploading ? 'loading' : 'upload')" />  点击{{ buttonText }}
            </el-button>
            <el-button
              v-else
              size="small"
              type="primary"
            >
              <i :class="'el-icon-' + (uploading ? 'loading' : 'upload')" />  点击{{ buttonText }}
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls/xlsx格式的文件哦~</div>
          </el-upload>

        </el-form-item>

        <el-form-item label="选择发送邮箱账户:" prop="mail">
          <el-select v-model="ruleForm.mail" filterable placeholder="请选择发送邮箱账户" style="width: 300px">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.username"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!--
        <el-form-item label="选择发送方式:">
          <el-select v-model="ruleForm.type" filterable placeholder="请选择"  class="width-50p"  >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即发送</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import { saveOrUpdate } from '@/api/gongjijins'
import * as Api from '@/api/email-config'
import * as WxyjApi from '@/api/wxyj'
import * as sheBaosaveOrUpdate from '@/api/she-baos'
import * as mailContent from '@/api/mail-content'
import { deepClone } from '@/utils'
import { uploader, removeRemoteImage } from '@/utils/file-uploader.js'
import Tinymce from '@/components/Tinymce'
import * as Excel from 'exceljs/dist/exceljs'

export default {
  name: 'AddOrEditProductPage',
  components: { Tinymce },
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
      options: [],
      maskTitle: '添加',
      showFileList: true,
      uploading: false,
      users: [], // 用户信息
      ruleForm: {
        // 邮件内容
        mailContent: '',
        // 邮件主题
        mailSubject: ''
      },
      rules: {
        mailContent: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        mailSubject: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.formData) this.ruleForm = deepClone(this.formData)
    this.getOptions()
    mailContent.getList().then(response => {
      if (response.data.length > 0) {
        const datum = response.data[0]
        this.ruleForm.mailContent = datum.mailContent
        this.ruleForm.mailSubject = datum.mailSubject
      }
    })
  },
  methods: {
    getOptions() {
      Api.getList({
        page: 0,
        size: 10000,
        sort: 'lastModifiedDate,desc'
      }).then(response1 => {
        const data = response1.data
        this.options = data
      })
    },
    beforeUpload(file) {
      if (!file) return false

      const ext = /\.[^\.]+$/.exec(file.name)[0]
      if (!/\.(xls|xlsx)/.test(ext)) {
        this.showFileList = false
        this.$message({
          message: '只能上传xls/xlsx格式的文件哦~',
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
      const reader = new FileReader()
      reader.readAsArrayBuffer(data.file)

      reader.onload = function(e) {
        const result = this.result
        const workbook = new Excel.Workbook()
        const s = new Set()
        workbook.xlsx.load(result)
          .then(function() {
            // 按ID获取表格
            //  获取社保数据
            var first = workbook.getWorksheet(1)
            // 迭代工作表中具有值的所有行
            first.eachRow(function(row, rowNumber) {
              if (rowNumber > 3) {
                const value = row.values
                s.add(value[3])
                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(value))
                var sheBao = {
                  'dept': value[2],
                  'dwbfGongshang': value[13].toFixed(3),
                  'dwbfShengyu': value[14].toFixed(2),
                  'dwbfShiye': value[11].toFixed(2),
                  'dwbfTotal': value[15].toFixed(2),
                  'dwbfYaolao': value[10].toFixed(2),
                  'dwbfYiliao': value[12].toFixed(2),
                  'grkkxxShiye': value[7].toFixed(3),
                  'grkkxxTotal': value[9].toFixed(3),
                  'grkkxxYaolang': value[6].toFixed(2),
                  'grkkxxYiliao': value[8].toFixed(2),
                  'name': value[3],
                  'sbjsYanglaoShiye': value[4],
                  'sbjsYiShangSheng': value[5],
                  'xh': value[1]
                }
                sheBaosaveOrUpdate.saveOrUpdate(sheBao).then(response => {
                  if (response.status === 201 || response.status === 200) {
                    this.$message({
                      message: `${this.buttonText}成功！`,
                      type: 'success'
                    })
                  }
                })
              }
            })
            self.users = Array.from(s)

            // 获取公积金数据
            var second = workbook.getWorksheet(2)
            second.eachRow(function(row, rowNumber) {
              if (rowNumber > 3) {
                const value = row.values
                console.log('Row ' + rowNumber + ' = ' + JSON.stringify(value))
                var gongjijin = {
                  'dept': value[2],
                  'dwkkmx': value[6].result,
                  'gjjjs': value[4],
                  'grkkmx': value[5].result,
                  'name': value[3],
                  'total': value[7].result,
                  'xh': value[1]
                }
                saveOrUpdate(gongjijin).then(response => {
                  // x
                })
              }
            })
          })
      }
    },
    /**
     * 删除图片
     */
    removeImage(file) {
      const url = this.ruleForm.name
      const fileName = url.split('/')[2]
      removeRemoteImage('font', fileName).then(() => {
        console.log(`Remove font '${fileName}' successed!`)
        this.ruleForm.name = ''
        this.showFileList = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新增或保存操作
          mailContent.add(this.ruleForm).then(response => {
            if (response.status === 201) {
            }
            const wxyj = { 'mailConfigId': this.ruleForm.mail.id,
              'mailContentId': response.data.id }
            return WxyjApi.send(wxyj)
          }).then(response => {
            this.$message({
              message: `邮件开始发送！`,
              type: 'success'
            })
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
  /*.width-50p {*/
  /*  width: 50%;*/
  /*}*/
  /*.form-wrapper {*/
  /*  width: 50%;*/
  /*}*/
  .line {
    text-align: center;
  }

  .range-input {
    //
  }
</style>
