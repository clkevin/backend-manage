<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'routers'
    ]),
    routes() {
      //return this.$router.options.routes
      return this.$store.getters.routers;
    },
    //true 表示菜单向右展开，false向下展开
    isCollapse() {
      return !this.$store.getters.sidebar.opened
    }
  }
}
</script>
