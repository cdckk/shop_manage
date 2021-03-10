<template>
  <div class="home">
      <el-container>
        <el-header>
          <div>
            <img src="../../assets/img/home.png" alt="">
            <span>电商后台管理系统</span>
          </div>
          <el-button type="info" @click="loginOut">退出</el-button>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="togger-button" @click="toggerButton">|||</div>
            <!-- 侧边栏菜单区 -->
            <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              :unique-opened="true"
              :collapse="isCollapse"
              :collapse-transition="false"
              router
              :default-active="activePath">
              <!-- 一级菜单 -->
              <el-submenu :index="item.id + ''" v-for="(item) in menuList" :key="item.id">
                <template slot="title">
                  <!-- 图标 -->
                  <i :class="iconObj[item.id]"></i>
                  <!-- 文本 -->
                  <span>{{item.authName}}</span>
                </template>
                  <!-- 二级菜单 -->
                  <el-menu-item :index="'/' + subItem.path" v-for="(subItem) in item.children" 
                    :key="subItem.id"
                    @click="saveNavState('/' + subItem.path)">
                    <template slot="title">
                      <i class="el-icon-menu"></i>
                      <span>{{subItem.authName}}</span>
                    </template>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import { getHomeMenuList } from '../../api/home'
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  components: {

  },
  methods: {
    loginOut() {
        window.sessionStorage.clear('token')
        this.$router.push('/login')
    },

    //请求首页菜单列表
    _getHomeMenuList() {
      getHomeMenuList().then(res => {
        console.log("首页列表", res)
        this.menuList = res.data.data
      })
    },

    //点击切换菜单的折叠与展开
    toggerButton() {
      this.isCollapse = !this.isCollapse
    },

    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  created() {
    this._getHomeMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped lang="less">
  .home,.el-container{
    height: 100%;
  }
  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    overflow: hidden;
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #EAEDF1;
  }
  .el-menu-item {
    margin-left: 20px;
  }
  .iconfont {
    margin-right: 10px;
  }
  .togger-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
