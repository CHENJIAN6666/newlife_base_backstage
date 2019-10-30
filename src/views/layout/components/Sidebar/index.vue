<template>
  <scroll-bar>
  <el-row>
    <el-col :span="24">
      <img :src="img_nav_logo" v-show="img_nav_logo_visible">
      <img :src="img_nav_logo_small" v-show="img_nav_logo_small_visible">
    </el-col>
  </el-row>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse"
             background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>
<script>
  import {mapGetters} from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'
  import img_nav_logo from '@/assets/nav-logo.png'
  import img_nav_logo_small from '@/assets/nav-logo-small.png'
  import 'element-ui/lib/theme-chalk/display.css'

  export default {
    data() {
      return {
        img_nav_logo,
        img_nav_logo_small,
        img_nav_logo_visible:true,
        img_nav_logo_small_visible:false
      }
    },
    components: {SidebarItem, ScrollBar},
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        this.img_nav_logo_visible=this.sidebar.opened;
        this.img_nav_logo_small_visible=!this.sidebar.opened;
        return !this.sidebar.opened
      }
    }
  }
</script>
