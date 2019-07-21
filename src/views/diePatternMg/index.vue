<template>
  <div class="app-container banner-wrapper">
    <el-input v-model="currentSearch" placeholder="查找 刀模图" clearable class="width-50p" />
    <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
    <el-button type="primary" class="add-btn" size="small" icon="el-icon-plus" @click="handleAdd">添加刀模图</el-button>
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
      <el-table-column align="center" label="笔记本品牌">
        <template slot-scope="scope">
          <span>{{ scope.row.computerType.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="笔记本型号">
        <template slot-scope="scope">
          <span>{{ scope.row.diePatternType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="主页默认显示">
        <template slot-scope="scope">
          <span>{{ scope.row.recommendedStatus.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="线模图">
        <template slot-scope="scope">
          <template v-if="scope.row.linePatternimagePath">
            <viewer :img-src="baseImgUrl + scope.row.linePatternimagePath" :zoom="1" />
            <!--            <img :src="'http://th.minio.boyuanziben.cn' + scope.row.diePatternimagePath" :alt="scope.row.diePatternType" width="50px;">-->
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="刀模图">
        <template slot-scope="scope">
          <template v-if="scope.row.diePatternimagePath">
            <viewer :img-src="baseImgUrl + scope.row.diePatternimagePath" :zoom="1" />
            <!--            <img :src="'http://th.minio.boyuanziben.cn' + scope.row.diePatternimagePath" :alt="scope.row.diePatternType" width="50px;">-->
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" class="del-btn" size="small" icon="el-icon-error" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- 编辑刀模图弹框 -->
    <el-dialog
      v-if="showMask"
      :visible.sync="showMask"
      :title="maskTitle + '刀模图'"
      top="5vh"
      class="product-edit__dialog"
      @close="handleClose"
    >
      <add-page :form-data="curProd" :button-text="maskTitle" />
    </el-dialog>

  </div>
</template>

<script>
import * as Api from '@/api/die-pattern'
import Pagination from '@/components/Pagination'
import { removeRemoteImage } from '@/utils/file-uploader.js'
import Viewer from '@/components/Viewer'
import config from '@/utils/config.js'
import AddPage from './add.vue'
export default {
  name: 'DiePatternList',
  components: { AddPage, Pagination, Viewer },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      currentSearch: '',
      listQuery: {
        page: 1,
        pageSize: 10
      },
      baseImgUrl: config.baseImgUrl,
      maskTitle: '',
      showMask: false,
      curProd: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList()
    })
  },
  created() {
    this.loadAll()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize
      }).then(response => {
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
      this.maskTitle = '编辑'
    },
    handleAdd() {
      this.showMask = true
      this.maskTitle = '添加'
    },
    handleClose() {
      this.curProd = {}
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗?确认刀模图是否有订单使用，如果有定制订单使用则无法删除！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelete(row.id).then(response => {
          if (response && response.status === 204) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getList()
          }
          if (row.diePatternimagePath) {
            this.removeImageFromMinio(row.diePatternimagePath).then(() => {
              console.log(`Remove remote image successed!`)
            })
          }
        }).catch(err => {
          this.$message({
            message: '删除失败，确认刀模图是否有订单使用，如果有订单使用则无法删除！',
            type: 'error'
          })
          console.error(err)
        })
      }).catch(() => {
        // Do nothing
      })
    },
    /**
     * 删除Minio 服务器上的图片
     */
    removeImageFromMinio(url) {
      const fileName = url ? url.split('/')[2] : ''
      return removeRemoteImage('die-pattern', fileName)
    },
    doDelete(id) {
      return Api.deleteById(id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
