<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item label="用户:">
        <el-input v-model="currentSearch" placeholder="查找 用户" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加用户</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="登录账号" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户姓名" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.firstName" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录密码" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.password" type="password" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理名称" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.lastName" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.imageUrl" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="常用邮箱" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.email" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.authorities" multiple class="width-192" placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item"
              :label="formatRole(item)"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账户状态" width="100">
        <template slot-scope="scope">
          <el-select v-model="scope.row.activated">
            <el-option
              v-for="item in activatedOptions"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column align="center" label="加入日期-有效日期" width="350">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.currentDate"
            :picker-options="pickerOptions"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="加入日期"
            end-placeholder="有效日期"
          />
        </template>

      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleSave(scope.row)">
            <svg-icon icon-class="password" /> 保存
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 新增编辑用户弹框 -->
    <el-dialog v-if="showMask" :visible.sync="showMask" :title="maskTitle" width="350px">
      <div class="dialog-form__wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rule" label-width="100px">
          <el-form-item label="用户名称:" prop="firstName">
            <el-input v-model="ruleForm.firstName" class="width-192" placeholder="用户姓名" />
          </el-form-item>

          <el-form-item label="代理名称:" prop="lastName">
            <el-input v-model="ruleForm.lastName" class="width-192" placeholder="代理名称" />
          </el-form-item>

          <el-form-item label="联系电话:" prop="lastName">
            <el-input v-model="ruleForm.imageUrl" class="width-192" placeholder="联系电话" />
          </el-form-item>

          <el-form-item label="登录账号:" prop="login">
            <el-input v-model="ruleForm.login" class="width-192" placeholder="登录账号" />
          </el-form-item>

          <el-form-item label="角色:" prop="login">
            <el-select v-model="ruleForm.authorities" multiple class="width-192" placeholder="请选择">
              <el-option
                v-for="item in roleOptions"
                :key="item"
                :label="formatRole(item)"
                :value="item"
              />
            </el-select>
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
        <el-button type="primary" @click="submitForm('ruleForm')">{{ maskTitle }}</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from '@/api/agent'
import { types } from '@/utils/role'
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
      pickerOptions: {
        shortcuts: [{
          text: '一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 360)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '二年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 720)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '五年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 1800)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '十年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 3600)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      list: [],
      currentDate: [],
      currentSearch: '',
      activatedOptions: [{ id: true, value: '启用' }, { id: false, value: '禁用' }],
      roleOptions: [],
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
    this.loadAll()
    this.getRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'lastModifiedDate,desc'
      }).then(response1 => {
        const data = response1.data
        data.forEach(item => {
          Api.getUserExtendByUserId(item.id).then(response => {
            item.currentDate = []
            item.currentDate.push(response.data.joinDate, response.data.endDate)
            this.list = data
            this.total = Number(response1.headers['x-total-count']) || 0
            this.listLoading = false
          })
        })
      })
    },
    getRoleList() {
      Api.getRoleList().then(response => {
        this.roleOptions = response.data
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
    handleDelete(row) {
      this.$confirm('您此操作会很严重，将会删除当前选中用户，请再次确认！！！', '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Api.deleteByLogin(row.login).then(response => {
          if (response.status === 204) {
            this.getList()
          }
        })
      })
    },
    handleSave(row) {
      // 有密码处理密码
      if (row.password) {
        Api.resetpwd({
          authorities: row.authorities,
          id: row.id,
          firstName: row.firstName,
          login: row.login,
          password: row.password,
          activated: row.activated,
          langKey: row.langKey,
          email: row.email
        }).then(response => {
          Api.getUserExtendByUserId(row.id).then(response => {
            if (response.status !== 200) {
              return null
            }
            const userExtend = response.data
            userExtend.endDate = row.currentDate[1]
            userExtend.joinDate = row.currentDate[0]
            return Api.update(userExtend)
          }).then(response => {
            return Api.modify(row)
          }).then(response => {
            if (response.status === 200) {
              this.getList()
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            }
          })
        })
      } else {
        Api.getUserExtendByUserId(row.id).then(response => {
          if (response.status !== 200) {
            return null
          }
          const userExtend = response.data
          userExtend.endDate = row.currentDate[1]
          userExtend.joinDate = row.currentDate[0]
          return Api.update(userExtend)
        }).then(response => {
          return Api.modify(row)
        }).then(response => {
          if (response.status === 200) {
            this.getList()
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          }
        })
      }
    },
    modify(row) {
      Api.modify(row).then(response => {
        if (response.status === 200) {
          this.getList()
        }
      })
    },
    clear() {
      this.page = 0
      this.currentSearch = ''
      this.loadAll()
    },
    loadAll() {
      if (this.currentSearch) {
        this.listLoading = true
        Api.getSearchList({
          query: this.currentSearch,
          page: this.listQuery.page - 1,
          size: this.listQuery.pageSize,
          sort: 'lastModifiedDate,desc'
        }).then(response => {
          this.list = response.data
          this.total = Number(response.headers['x-total-count']) || 0
          this.listLoading = false
        })
        return
      }
      this.getList()
    },
    search(query) {
      if (!query) {
        return this.clear()
      }
      this.page = 0
      this.currentSearch = query
      this.loadAll()
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
            // 获取登录用户
            return Api.getByLogin(this.ruleForm.login)
          }).then(response => {
            // 保存
            return Api.save({
              'user': {
                'id': response.data.id
              }
            })
          }).then(response => {
            if (response.status === 201) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.showMask = false
              this.getList()
              this.resetRuleForm()
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
    },
    formatRole(val) {
      return types.get(val)
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
