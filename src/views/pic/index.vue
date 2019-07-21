<template>
  <div class="root">
    <div v-for="x in listp" :key="x.index" class="mce-i-tablecellprops">
      <img :src="'http://th.minio.boyuanziben.cn/boyuanziben/' + x.name + '_500x500'"> <span>/boyuanziben/{{ x.name }}</span>  <span>{{ x.lastModified | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
    </div>
  </div>
</template>

<script>
import { list } from '@/utils/file-uploader.js'
export default {
  data() {
    return {
      listp: []
    }
  },
  created() {
    list().then(response => {
      // console.log(response)
      const bb = []
      response.on('data', function(obj) {
        // console.log(obj.name)
        bb.push(obj)
      })
      this.listp = bb
      console.log(this.listp)
    })
  }
}
</script>

<style lang="scss" scoped>
  .abc{
    clear: both;
  }
</style>
