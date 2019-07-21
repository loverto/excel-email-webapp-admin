<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('ROLE_ADMIN') && !this.roles.includes('ROLE_DISTRIBUTION') && !this.roles.includes('ROLE_DEVELOPMENT')) {
      this.$message('你没有权限，系统稍后退出')
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
      // this.currentRole = 'editorDashboard'
    }
  }
}
</script>
