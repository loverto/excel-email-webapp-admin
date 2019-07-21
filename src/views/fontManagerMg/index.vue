<template>
  <div class="app-container product-wrapper">
    <el-button type="primary" class="add-btn" size="small" icon="el-icon-more" @click="handleAddFont(studioConfig)">管理字体包</el-button>
    <el-button type="primary" class="add-btn" size="small" icon="el-icon-download" @click="downloadFont(studioConfig)">下载字体包</el-button>

    <!-- 编辑产品弹框 -->
    <el-dialog
      v-if="showMask"
      :visible.sync="showMask"
      :title="title"
      top="5vh"
      class="product-edit__dialog"
      @close="handleClose"
    >
      <add-page :form-data="curProd" :button-text="buttonText" />
    </el-dialog>
    <!-- 上传字体包弹框 -->
    <el-dialog
      v-if="showFontMask"
      :visible.sync="showFontMask"
      :title="fontTitle"
      top="5vh"
      class="product-edit__dialog"
      @close="handleFontClose"
    >
      <upload-font :form-data="curProd" :button-text="buttonFontText" />
    </el-dialog>

  </div>
</template>

<script>
import * as ConfigApi from '@/api/config'
import { types } from '@/utils/role.js'
import { download } from '@/utils'
import AddPage from './add.vue'
import UploadFont from './edit.vue'
import config from '@/utils/config.js'
export default {
  name: 'FontList',
  components: { AddPage, UploadFont },
  data() {
    return {
      list: [],
      total: 0,
      title: '编辑字体名称',
      fontTitle: '编辑字体名称',
      buttonFontText: '',
      buttonText: '',
      listLoading: true,
      currentSearch: '',
      studioConfig: {},
      listQuery: {
        page: 1,
        pageSize: 10
      },
      showMask: false,
      showFontMask: false,
      curProd: null,
      baseImgUrl: config.baseImgUrl,
      baseFileUrl: config.baseFileUrl
    }
  },
  created() {
    // 获取配置
    this.getConfig()

    // 监听一个保存成功的回调
    // 用于修改产品后触发列表刷新
    this.$on('saveNotify', (flag) => {
      this.showMask = false
      if (flag) this.loadAll()
    })
  },
  methods: {
    getConfig() {
      ConfigApi.getList().then(response => {
        if (response.status === 200) {
          this.studioConfig = response.data[0]
          this.list = response.data
        }
      })
    },
    clear() {
      this.page = 0
      this.currentSearch = ''
      this.loadAll()
    },
    handleAddFont(row) {
      this.showFontMask = true
      this.curProd = row
      this.fontTitle = '添加字体包'
      this.buttonFontText = '添加'
    },
    downloadFont(row) {
      download(this.baseFileUrl + row.productionRenderingSaveLocation, '字体.zip')
    },
    handleClose() {
      this.curProd = null
    },
    handleFontClose() {
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
