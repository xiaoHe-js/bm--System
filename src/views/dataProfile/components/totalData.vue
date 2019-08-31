<template>
  <div class="total-data" :class="{ 'horizontal' : mode === 'horizontal' }">
    <div class="total-data-item" v-for="item in data" :key="item.name">
      <div v-if="mode === 'horizontal'" class="el-icon-sort"></div>
      <div class="name">{{ item.name }}</div>
      <div class="value">
        <div class="prefix">
          {{item.prefix}}
        </div>
        {{ item.value | add_comma_toThousands }}
      </div>
      <!-- <router-link
        class="link"
        v-if="item.link"
        :to="{name: item.link, query: item.params || {}}">
        查看明细 &gt;
      </router-link> -->
      <div
        class="link"
        v-if="item.link"
        @click="toDetail(item)">
        查看明细 &gt;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'totalData',
  props: {
    /**
     * 数据列表
     * [
     *  {
     *    name: '' // 名称
     *    value: 1 // 数值
     *    link: '' // 跳转链接（非必填）用于跳转到详情页面
     *    prefix: '' // 值前面的前缀
     *  }
     * ]
     */
    data: {
      type: Array,
      default() {
        return []
      }
    },

    // 模式 horizontal 垂直 / vertical 水平 vertical
    mode: {
      type: String,
      default: 'vertical'
    }
  },
  data() {
    return {
      // dwa:
    }
  },
  methods: {
    toDetail(data) {
      this.$store.dispatch('setChangedAsideActiveName', data.link)

      this.$router.push({
        name: data.link,
        query: data.params
      })
    }
  }
}
</script>

<style lang="less" scoped>
.total-data {
  display: flex;
  align-items: center;
  padding: 24px 0;

  &.horizontal {
    flex-direction: column;

    .total-data-item {

      &:first-child {
        .el-icon-sort {
          display: none;
        }
      }

      .el-icon-sort {
        margin-bottom: 16px;
        color: #333;
        font-size: 18px;
        font-weight: bold;
      }

      & + .total-data-item {
        margin-top: 16px;
      }

    }
  }

  .total-data-item {
    flex: 1;
    text-align: center;

    .name {
      font-size: 14px;
      line-height: 20px;
      color: #606166;
    }

    .value  {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      font-size: 40px;
      line-height: 56px;
      color: #4D5AFF;

      .prefix {
        margin-right: 6px;
        font-size: 16px;
        line-height: 42px;
        color: #606166;
      }
    }

    .link {
      font-size: 14px;
      line-height: 20px;
      color: #606166;
      text-decoration: none;
      cursor: pointer;
    }
  }
}
</style>
