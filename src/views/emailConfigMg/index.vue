<template>
  <div class="app-container product-wrapper">
    <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus" @click="handleAdd">添加邮箱设置</el-button>
    <el-button type="text" icon="el-icon-refresh" @click="getList">刷新</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="发送邮箱用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送邮箱的密码或授权码">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送邮箱的端口">
        <template slot-scope="scope">
          <span>{{ scope.row.smtpPort }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送邮箱的IP或域名">
        <template slot-scope="scope">
          <span>{{ scope.row.smtpServer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 编辑产品弹框 -->
    <el-dialog
      v-if="showMask"
      :visible.sync="showMask"
      :title="maskTitle+ '邮箱'"
      top="5vh"
      class="product-edit__dialog"
      @close="handleClose"
    >
      <add-page :form-data="curProd" :button-text="maskTitle" />
    </el-dialog>

  </div>
</template>

<script>
import * as Api from '@/api/email-config'
import { types } from '@/utils/role.js'
import Pagination from '@/components/Pagination'
import AddPage from './add.vue'
export default {
  name: 'ProductList',
  components: { AddPage, Pagination },
  data() {
    return {
      list: [],
      currentSearch: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      maskTitle: '',
      showMask: false,
      curProd: null
    }
  },
  created() {
    this.loadAll()

    // 监听一个保存成功的回调
    // 用于修改产品后触发列表刷新
    this.$on('saveNotify', (flag) => {
      this.showMask = false
      if (flag) this.loadAll()
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = {
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'lastModifiedDate,desc'
      }
      Api.getList(data).then(response => {
        this.list = response.data
        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
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
          size: this.listQuery.pageSize
        }).then(response => {
          this.list = response.data
          this.total = Number(response.headers['x-total-count']) || 0
          this.listLoading = false
        })
        return
      }
      this.getList()
    },
    handleAdd() {
      this.showMask = true
      this.maskTitle = '新增'
    },
    search(query) {
      if (!query) {
        return this.clear()
      }
      this.page = 0
      this.currentSearch = query
      this.loadAll()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleEdit(row) {
      this.showMask = true
      this.curProd = row
    },
    handleClose() {
      this.curProd = null
    },
    formatType(val) {
      return types.get(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
