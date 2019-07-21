<template>
  <div class="app-container agent-wrapper">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="日期">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录账号">
        <template slot-scope="scope">
          <span>{{ scope.row.principal }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="其他">
        <template slot-scope="scope">
          <span v-if="scope.row.data && scope.row.data.message">{{ scope.row.data.message }}</span>
          <span v-if="scope.row.data && scope.row.data.remoteAddress"><span>远程地址</span> {{ scope.row.data.remoteAddress }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 新增编辑代理商弹框 -->
    <el-dialog v-if="showMask" :visible.sync="showMask" :title="maskTitle" width="350px">
      <div class="dialog-form__wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rule" label-width="100px">
          <el-form-item label="代理商名称:" prop="firstName">
            <el-input v-model="ruleForm.firstName" class="width-192" placeholder="代理商名字" />
          </el-form-item>

          <el-form-item label="登录账号:" prop="login">
            <el-input v-model="ruleForm.login" class="width-192" placeholder="登录账号" />
          </el-form-item>

          <template v-if="maskTitle !== '编辑'">
            <el-form-item label="登录密码:" prop="password">
              <el-input v-model="ruleForm.password" class="width-192" placeholder="登录密码" />
            </el-form-item>
          </template>

          <el-form-item label="常用邮箱:" prop="email">
            <el-input v-model="ruleForm.email" class="width-192" placeholder="your@email.com" />
            <div class="el-form-item__tip">Tips: 用来接收审核通知</div>
          </el-form-item>

          <el-form-item label="是否激活:">
            <el-radio-group v-model="ruleForm.activated">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/agent'
import Pagination from '@/components/Pagination'
export default {
  name: 'AgentList',
  components: { Pagination },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value) {
        const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if (!reg.test(value)) {
          callback(new Error('请输入您正确邮箱'))
        } else {
          callback()
        }
      }
    }
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      ruleForm: null,
      rule: {
        firstName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        login: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '必填项', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      showMask: false,
      maskTitle: '新增'
    }
  },
  created() {
    this.resetRuleForm()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getAudits({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'auditEventDate,desc'
      }).then(response => {
        this.list = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleAdd() {
      this.showMask = true
      this.maskTitle = '新增'
    },
    handleEdit(row) {
      this.showMask = true
      this.maskTitle = '编辑'
      this.ruleForm = Object.assign({}, row || {})
    },
    modify(row) {
      Api.modify(row).then(response => {
        if (response.status === 200) {
          this.getList()
        }
      })
    },
    handleActived(row) {
      const r = JSON.parse(JSON.stringify(row))
      r.activated = true
      this.modify(r)
    },
    handleDisabled(row) {
      const r = JSON.parse(JSON.stringify(row))
      r.activated = false
      this.modify(r)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Api.register(this.ruleForm).then(response => {
            if (response.status === 201) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.showMask = false
              this.getList()
            }
          }).catch(err => {
            console.error(err)
          })
        } else {
          return false
        }
      })
    },
    resetPwd(row) {
      this.$confirm('确定要重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.resetpwd({
          authorities: row.authorities,
          id: row.id,
          firstName: row.firstName,
          login: row.login,
          password: '123456',
          activated: row.activated,
          langKey: row.langKey,
          email: row.email
        }).then(response => {
          if (response.status === 200) {
            this.$message({
              message: '重置密码成功！默认密码为：123456',
              type: 'success'
            })
          } else {
            this.$message.error('重置密码失败！')
          }
        })
      }).catch(() => {
        // Do nothing
      })
    },
    resetRuleForm() {
      this.ruleForm = {
        firstName: '',
        login: '',
        password: '123456',
        activated: false,
        langKey: 'zh-cn',
        email: ''
      }
    },
    resetForm() {
      this.showMask = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .width-192 {
    max-width: 192px;
  }
  .el-form-item__tip {
    font-size: 12px;
    color: #C0C4CC;
  }
</style>
