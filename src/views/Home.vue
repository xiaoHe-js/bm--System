<template>
  <div class="home">
    <el-container class="home-wrap">
      <el-header style="height: 88px">
        <div class="logo">
          <span class="logo-title">广告投放后台</span>
        </div>

        <div class="header-nav">
          <div class="username">{{ userName }}</div>
          <router-link to="/login" class="layout">退出登录</router-link>
        </div>
      </el-header>

      <el-container class="home-inner">
        <el-aside width="215px">
          <el-menu class="home-aside-menu" :default-active="activeKey" @select="handlerMenuClick">
            <el-submenu v-for="(item1,index1) in asideList"
                :key="index1"
                :index="item1.key">
              <template slot="title"><i :class="item1.icon" v-if="item1.icon"></i>{{ item1.name }}</template>

              <span v-for="(item2, index2) in item1.children"
                  :key="index2"
                  :index="item2.key">
                <el-menu-item-group v-if="item2.children">
                  <template slot="title">{{item2.name}}</template>
                  <el-menu-item
                    :route="{name: item3.key}"
                    v-for="(item3, index3) in item2.children"
                    :key="index3"
                    :index="item3.key">
                    <i v-if="item3.icon"></i>{{ item3.name }}
                  </el-menu-item>
                </el-menu-item-group>

                <el-menu-item v-if="!item2.children" :index="item2.key" :route="{name: item2.key}">
                  <i v-if="item2.icon"></i>{{ item2.name }}
                </el-menu-item>

              </span>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <div class="home-header">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="概览" name="dataProfile"></el-tab-pane>
              <el-tab-pane label="广告组" name="advertisingGroup"></el-tab-pane>
              <el-tab-pane label="广告计划" name="advertisingProgram"></el-tab-pane>
              <el-tab-pane label="广告创意" name="adCreativeList"></el-tab-pane>
              <el-tab-pane label="创意库" name="creativeList"></el-tab-pane>
              <el-tab-pane label="账户&财务" name="financialInfo"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="home-content">
            <router-view></router-view>
          </div>
        </el-main >

      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      activeName: 'dataProfile',
      activeKey: 'adOne', // 默认显示的菜单key
      activeTab: '', // 默认打开的菜单
      asideList: [{
        name: '广告组1',
        icon: 'el-icon-goods',
        key: 'adGroupOne',
        children: [
          {
            name: '广告计划1',
            icon: 'el-icon-goods',
            key: 'adOne'
          }
        ]
      }, {
        name: '广告组2',
        icon: 'el-icon-goods',
        key: 'adGroupTwo',
        children: [
          {
            name: '广告计划2',
            icon: 'el-icon-goods',
            key: 'adTwo'
          }
        ]
      }]
    }
  },
  computed: {
    userName() {
      return sessionStorage.getItem('userName') || this.$store.state.userName
    },

    changedAsideActiveName() {
      return this.$store.state.changedAsideActiveName
    }
  },
  watch: {
    changedAsideActiveName(val) {
      if (val) {
        this.activeKey = val
      }
    }
  },
  created() {
    let _this = this,
      route = _this.$route
    console.log(route.meta.parent)
    _this.activeName = route.meta.parent
    _this.activeKey = route.name
  },
  methods: {
    // 处理菜单点击事件
    handlerMenuClick(data) {
      this.$router.push({
        name: data
      })

      this.$store.dispatch('setChangedAsideActiveName', data)
    },
    handleClick(tab, event) {
      this.$router.push({
        name: tab.name
      })
    }
  }
}
</script>

<style lang="less">
.home {
  position: relative;
  background: #2D3340;

  .el-header,
  .el-aside,
  .el-main {
    box-sizing: border-box;
    color: #fff;
    background: #2D3340;
    height: 100%;
  }

  .home-wrap {
    height: 100vh;
  }

  .home-inner {
    display: flex;
    overflow: auto;
  }

  .main {
    display: flex;
    flex-direction: column;

    .home-header {
      height: 60px;
      background: #fff;
      color: #333;
      margin-bottom: 10px;
      padding-left: 15px;
      .is-top {
        line-height: 60px;
        font-size: 18px;
      }
    }
    .home-content {
      flex: 1;
      // background: #fff;
      color: #333;
      border-radius: 10px;
      overflow-y: auto;
      // padding: 15px;
    }
  }

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 34px;

    .logo {
      display: flex;
      align-items: flex-end;

      .logo-title {
        margin-right: 8px;
        font-size: 28px;
      }

      .logo-sub-title {
        font-size: 18px;
      }
    }

    .header-nav {
      display: flex;
      align-items: center;
      line-height: 14px;

      .username {
        font-size: 14px;
      }

      .layout {
        color: #fff;
        font-size: 12px;
        text-decoration: none;
        margin-left: 8px;
      }
    }
  }

  .el-aside {
    padding: 0 16px;
    overflow: initial;

    .home-aside-menu {
      border: none;
      background: #2D3340;

      .el-menu {
        background: #2D3340;
      }

      & > .el-menu-item,
      .el-submenu .el-submenu__title {
        padding: 0 16px !important;
      }

      .el-submenu .el-submenu__title,
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        color: #fff;
        background: #2D3340;

        i {
          color: #fff;
        }
      }

      .el-menu-item {
        box-sizing: border-box;
        min-width: 176px;
        border-radius: 4px;

        &.is-active {
          background: #4D5AFF;
        }
      }

      .el-submenu {
        .el-submenu__title {
          display: flex;
          align-items: center;

          i {
            color: #fff;
          }
        }

        .el-menu-item {
          padding-left: 45px !important;
        }
      }
    }
  }
}
</style>
