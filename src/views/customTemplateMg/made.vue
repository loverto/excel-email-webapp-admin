<template>
  <div class="app-container banner-wrapper">
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

      <el-table-column align="center" label="用户状态" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.finishedCondition.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="制造进度" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.customState.value }}</span>
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
          <!--          <el-button type="primary" class="edit-btn" size="small" icon="el-icon-edit" @click="handleDetail(scope.row)">素材</el-button>-->
          <el-button type="danger" class="del-btn" size="small" icon="el-icon-error" @click="handleCustomState(scope.row)">定制完成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import * as Api from '@/api/custom-template'
import Pagination from '@/components/Pagination'
import Viewer from '@/components/Viewer'
import config from '@/utils/config.js'
export default {
  name: 'MadeList',
  components: { Pagination, Viewer },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      baseImgUrl: config.baseImgUrl
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      Api.getListByCustomState(2, {
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
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCustomState(row) {
      this.$confirm('您真的已经定制完成？一旦确认操作流程不可逆，请再次确认！！！', '重要提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.customState = { 'id': 3 }
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-btn {
    margin-bottom: 20px;
  }
</style>
