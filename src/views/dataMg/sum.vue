<template>
  <div class="app-container agent-wrapper">
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-date-picker
          v-model="currentSearch"
          :picker-options="pickerOptions"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button type="success" icon="el-icon-search" @click="search(currentSearch)">查询</el-button>
        <el-select v-model="currentUser" placeholder="选择用户" @change="changeUser()">
          <el-option
            v-for="item in usersOptions"
            :key="item.login"
            :label="item.login"
            :value="item.login"
          />
        </el-select>
        <el-button type="success" icon="el-icon-download" @click="handleDownload">导出明细</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      />

      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.login }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="代理名称">
        <template slot-scope="scope">
          <span>{{ scope.row.lastName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="贴膜使用次数">
        <template slot-scope="scope">
          <span>{{ scope.row.tmCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="鼠标垫使用次数">
        <template slot-scope="scope">
          <span>{{ scope.row.sbdCount }}</span>
        </template>
      </el-table-column>

    </el-table>

    <template>
      <div>贴膜使用次数：<span style="color: red">{{ totalTm }}</span></div>
      <div>鼠标垫使用次数：<span style="color: red">{{ totalSbd }}</span></div>
    </template>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import * as Api from '@/api/agent'
import { types } from '@/utils/role'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
export default {
  name: 'SumList',
  components: { Pagination },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      currentSearch: [],
      list: [],
      exportlist: [],
      usersOptions: [],
      total: 0,
      begin: new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 30)),
      end: new Date(),
      listLoading: true,
      downloadLoading: false,
      currentUser: '',
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      totalTm: 0,
      totalSbd: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.currentSearch.push(this.begin)
    this.currentSearch.push(this.end)
    this.getList()
    this.getUsersOptionList()
  },
  methods: {
    changeUser() {
      this.getList()
    },
    handleDownload() {
      this.listLoading = true
      this.downloadLoading = true
      Api.getWorkListData({
        begin: this.begin,
        end: this.end,
        login: this.currentUser
      }).then(response => {
        this.exportlist = response.data
        import('@/vendor/Export2ExcelJs').then(excel => {
          const tHeader = ['账号', '代理姓名', '代理名称', '贴膜使用次数', '鼠标垫使用次数']
          const filterVal = ['login', 'firstName', 'lastName', 'tmCount', 'sbdCount']
          const list = this.exportlist
          let text = ''
          if (this.currentUser) {
            text = this.currentUser
          } else {
            text = '所有用户'
          }
          const s = parseTime(this.begin, '{y}-{m}-{d}') + '至' + parseTime(this.end, '{y}-{m}-{d}')
          this.filename = s + text + '作品汇总表'

          const data = this.formatJson(filterVal, list)
          const multiHeader = [['', '', '新路通来图个性定制系统', '', ''], ['', '', '作品定制汇总表', '', ''], ['查询日期：' + s, '', '', '', '查询范围：' + text]]
          console.log(data)
          excel.export_json_to_excel_sheet({
            headers: [tHeader],
            datas: [data],
            multiHeader: multiHeader,
            sheetnames: ['作品定制汇总表'],
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
        this.listLoading = false
      })
    },
    getList() {
      this.listLoading = true
      Api.getWorkList({
        page: this.listQuery.page - 1,
        size: this.listQuery.pageSize,
        begin: this.begin,
        end: this.end,
        login: this.currentUser
      }).then(response => {
        this.list = response.data
        this.totalTm = 0
        this.totalSbd = 0
        this.list.forEach((item) => {
          // 遍历 tmCount 这个字段，并累加
          this.totalTm += item.tmCount
          // 遍历 sbdCount 这个字段，并累加
          this.totalSbd += item.sbdCount
        })

        this.total = Number(response.headers['x-total-count']) || 0
        this.listLoading = false
      })
    },
    search(query) {
      // 初始化查询时间
      this.begin = query[0]
      this.end = query[1]
      this.getList()
    },
    getUsersOptionList() {
      Api.getList({ page: 0, size: 1000000 }).then(response => {
        this.usersOptions = response.data
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
    formatRole(val) {
      return types.get(val)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createdDate') {
          return parseTime(v[j], '{y}-{m}-{d}')
        } else {
          if (j.indexOf('.') > 0) {
            const t = j.split('.')
            return v[t[0]][t[1]]
          }
          return v[j]
        }
      }))
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
