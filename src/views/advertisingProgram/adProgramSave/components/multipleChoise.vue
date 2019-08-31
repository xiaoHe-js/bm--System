<template>
  <div class="multiple-choise">
    <div class="multiple-choise-content">
      <div class="multiple-choise-result">
        <vue-scroll v-show="Object.keys(selectedList).length">
          <div
            class="multiple-choise-result-group"
            v-for="(item, key) in selectedList" :key="key">
            <div class="multiple-choise-result-group-title">
              {{item.name}}
            </div>

            <ul class="multiple-choise-result-list" v-if="item.child">
              <li
                class="multiple-choise-result-item"
                v-for="(childItem, index) in item.child"
                :key="index">
                {{childItem}}
                <span class="close-btn" @click="deleteSelectedData(item, childItem)">
                  <i class="el-icon-close"></i>
                </span>
              </li>
            </ul>
          </div>
        </vue-scroll>

        <div class="multiple-choise-result-empty" v-show="Object.keys(selectedList).length === 0">
          暂无选择
        </div>
      </div>

      <div class="multiple-choise-list-wrap">
        <vue-scroll>
          <multipleChoiseList
            ref="multipleChoiseList"
            :data="data"
            :defaultData="defaultData"
            :getChildren="getChildren"
            :deleteInfo="deleteInfo"
            @change="getSelectedList">
          </multipleChoiseList>
        </vue-scroll>
      </div>
    </div>

    <p class="multiple-choise-error" v-if="errorMsg">
      {{errorMsg}}
    </p>
  </div>
</template>

<script>
import vuescroll from 'vuescroll'
import multipleChoiseList from './multipleChoiseList'
export default {
  components: {
    multipleChoiseList,
    'vue-scroll': vuescroll
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },

    // 获取子元素方法
    getChildren: {
      type: Function
    },

    // 校验规则
    rule: {
      type: Function
    },

    // 默认数据
    defaultData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectedList: [],
      deleteInfo: {}, // 需要删除的对象信息
      errorMsg: '' // 错误信息
    }
  },
  methods: {
    getSelectedList(val) {
      let _this = this

      _this.selectedList = val
      _this.$emit('change', val)
    },

    // 删除已选择的数据
    deleteSelectedData(data, childData) {
      let _this = this

      _this.deleteInfo = {
        data,
        childData
      }
    },

    /**
     * 校验
     * @param {Function} callback 回调函数
     */
    validate() {
      let _this = this,
        rule = _this.rule

      if (rule) {
        let errorMsg = rule(_this.getValue())

        _this.errorMsg = errorMsg
        return !errorMsg
      }

      return true
    },

    /**
     * 对外提供的接口，用于获取数据
     * @param {Function} callback 回调函数 用于校验
     * @returns 校验成功，返回数据，否则返回false
     */
    getValue(callback) {
      return this.$refs.multipleChoiseList.getValue()
    }
  }
}
</script>

<style lang="less">
.multiple-choise {
  margin-top: 20px;

  .multiple-choise-content {
    display: flex;
    height: 460px;
  }

  .multiple-choise-result {
    box-sizing: border-box;
    position: relative;
    width: 250px;
    height: 100%;
    padding: 10px;
    border: 1px solid #E9EBEF;
    border-right: none;

    .multiple-choise-result-group {
      padding: 20px 0;
      border-bottom: 1px solid #E9EBEF;
      font-size: 14px;
      line-height: 20px;
      color: #333333;

      .multiple-choise-result-group-title {
        padding-left: 10px;
        font-weight: bold;
      }

      .multiple-choise-result-list {
        display: flex;
        flex-wrap: wrap;

        .multiple-choise-result-item {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 26px;
          margin: 10px 0 0 0;
          padding: 0 8px;
          border: 1px solid transparent;
          cursor: pointer;

          .close-btn {
            visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 12px;
            height: 12px;
            margin-left: 10px;
            font-size: 12px;
            color: #fff;
            background: #166AFF;
            border-radius: 50%;

            .el-icon-close {
              transform: scale(.8);
            }
          }

          &:hover {
            border-color: #166AFF;
            color: #166AFF;
            background: #F2F6F9;

            .close-btn {
              visibility: visible;
            }
          }
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .multiple-choise-result-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .multiple-choise-list-wrap {
    width: 530px;
    height: 100%;
    border: 1px solid #E9EBEF;
  }

  .multiple-choise-error {
    position: absolute;
    bottom: -20px;
    color: red;
    line-height: 20px;
  }
}
</style>
