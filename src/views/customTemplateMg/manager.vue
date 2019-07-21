<template>
  <div class="app-container banner-wrapper">
    <el-input v-model="currentSearch" placeholder="查找 定单" clearable class="width-50p" />
    <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
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
      <el-table-column align="center" label="定制编号">
        <template slot-scope="scope">
          <span>{{ scope.row.customNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="品牌" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.diePattern.computerType.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="笔记本型号">
        <template slot-scope="scope">
          <span>{{ scope.row.diePattern.diePatternType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数量" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.customQuantity }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="淘宝ID" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.taobaoNickname }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收件人姓名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.theRecipientName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="定制类型" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.modelType.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="客户设计状态" width="130">
        <template slot-scope="scope">
          <el-select v-model="scope.row.finishedCondition">
            <el-option
              v-for="item in finishedStateOptions"
              :key="item.id"
              :label="item.value"
              :value="item"
            />
          </el-select>
          <!--          <span>{{ scope.row.finishedCondition.value }}</span>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="制造进度" width="130">
        <template slot-scope="scope">
          <el-select v-model="scope.row.customState">
            <el-option
              v-for="item in customStateOptions"
              :key="item.id"
              :label="item.value"
              :value="item"
            />
          </el-select>
          <!--          <span>{{ scope.row.customState.value }}</span>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="添加日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="成品图" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.productionRenderingImageUrl">
            <viewer :img-src="baseImgUrl + scope.row.productionRenderingImageUrl" :zoom="1" />
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属用户" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.user.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="功能">
        <template slot-scope="scope">
          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleCustomState(scope.row)">保存</el-button>
          <!--          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleDetail(scope.row)">素材</el-button>-->
          <el-button type="danger" class="del-btn" size="small" icon="el-icon-error" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import * as Api from '@/api/custom-template'
import * as FabricApi from '@/api/fabric-design-materials'
import * as StateApi from '@/api/custom-state'
import * as FinishedApi from '@/api/finished-condition'
import Pagination from '@/components/Pagination'
import Viewer from '@/components/Viewer'
import config from '@/utils/config.js'
export default {
  name: 'ManagerList',
  components: { Pagination, Viewer },
  data() {
    return {
      list: [],
      customStateOptions: [],
      finishedStateOptions: [],
      total: 0,
      listLoading: true,
      currentSearch: '',
      listQuery: {
        page: 1,
        pageSize: 10
      },
      baseImgUrl: config.baseImgUrl
    }
  },
  created() {
    this.getFinishedStateList()
    this.getStateList()
    this.loadAll()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        sort: 'lastModifiedDate,desc'
      }).then(response => {
        this.list = response.data
        this.list.forEach(function(item, index, array) {
          if (item.modelType.id === 2) {
            Api.queryCustomTemplatesByCustomNumber(item.customNumber).then(response => {
              if (response.status === 200 && response.data && response.data.length > 0) {
                // 遍历数据
                response.data.forEach(function(item1, index, array) {
                  if (item1.modelType.id === 1) {
                    // 品牌
                    item.diePattern.computerType.value = item1.diePattern.computerType.value
                    // 型号
                    item.diePattern.diePatternType = item1.diePattern.diePatternType
                  }
                })
              }
            })
          }
        })
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
          size: this.listQuery.pageSize,
          sort: 'lastModifiedDate,desc'
        }).then(response => {
          this.list = response.data
          this.list.forEach(function(item, index, array) {
            if (item.modelType.id === 2) {
              Api.queryCustomTemplatesByCustomNumber(item.customNumber).then(response => {
                if (response.status === 200 && response.data && response.data.length > 0) {
                  // 遍历数据
                  response.data.forEach(function(item1, index, array) {
                    if (item1.modelType.id === 1) {
                      // 品牌
                      item.diePattern.computerType.value = item1.diePattern.computerType.value
                      // 型号
                      item.diePattern.diePatternType = item1.diePattern.diePatternType
                    }
                  })
                }
              })
            }
          })
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
    getStateList() {
      this.listLoading = true
      StateApi.getList().then(response => {
        this.customStateOptions = response.data
        this.listLoading = false
      })
    },
    getFinishedStateList() {
      FinishedApi.getList().then(response => {
        this.finishedStateOptions = response.data
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
    handleCustomState(row) {
      // row.customState = { 'id': 3 }
      this.$confirm('您对此操作可能会存在争议，请再次确认！！！', '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const method = 'put'
        Api.saveOrUpdate(row, method).then(response => {
          if (response.status === 200) {
            // 更新成功后刷新列表
            this.getList()
            //
          }
        })
      }).catch(() => {
        // Do nothing
      })
    },
    handleDetail(row) {
      //
    },
    handleDelete(row) {
      //
      this.$confirm('您此操作会很严重，将会删除两条记录和记录下的所有素材，请再次确认！！！', '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const self = this
        FabricApi.getAllDesignMaterialByCustomNumber(row.customNumber).then(response => {
          return new Promise(resolve => {
            if (response.status === 200 && response.data && response.data.length > 0) {
              const data = response.data
              // 遍历数据
              data.forEach(function(item, index, array) {
                FabricApi.deleteById(item.id).then(response => {
                  return Api.deleteById(item.customTemplate.id)
                }).then(response => {
                  if (response.status === 204) {
                    // 删除成功时刷新页面
                    self.getList()
                    resolve()
                  }
                })
              })
            } else {
              Api.deleteById(row.id).then(response => {
                if (response.status === 204) {
                  // 删除成功时刷新页面
                  self.getList()
                  resolve()
                }
              })
            }
          })
        }).then(response => {
          Api.queryCustomTemplatesByCustomNumber(row.customNumber).then(response => {
            if (response.status === 200 && response.data && response.data.length > 0) {
              // 遍历数据
              response.data.forEach(function(item1, index, array) {
                Api.deleteById(item1.id).then(response => {
                  if (response.status === 204) {
                    // 删除成功时刷新页面
                    self.getList()
                  }
                })
              })
            }
          })
        })
      }).catch(() => {
        // Do nothing
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
