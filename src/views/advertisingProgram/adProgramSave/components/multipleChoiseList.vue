<template>
  <div class="multiple-choise-list">
    <div class="multiple-choise-list-search">
      <el-checkbox v-model="isSelecteAll" @change="selecteAll"></el-checkbox>

      <span>全选</span>

      <el-input v-model="searchName" class="search-input"></el-input>
    </div>

    <ul class="list-content">
      <li
        class="list-content-item"
        v-show="searchName === '' || dataItem.name.indexOf(searchName) !== -1"
        v-for="(dataItem, index) in dataList"
        :key="index">
        <el-checkbox v-model="dataItem.checkStatus" @change="selectData(index)"></el-checkbox>

        <span class="list-item-name" v-if="getChildren">
          <el-popover
            placement="right"
            :value="dataItem.isShowPopover"
            width="200"
            @show="getChildData(dataItem)"
            popper-class="multiple-choise-children"
            trigger="click">

            <el-checkbox-group v-model="dataItem.checkList" @change="selectDataChild(dataItem)">
              <ul class="list-children" v-loading="loading.getChildren">
                <li
                  class="list-children-item"
                  v-for="(childrenItem, index) in dataItem.children"
                  :key="index">
                  <el-checkbox
                    :label="childrenItem.name">
                    {{childrenItem.name}}
                  </el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>

            <span slot="reference">{{dataItem.name}}</span>
          </el-popover>
        </span>
        <span class="list-item-name" v-show="!getChildren">{{dataItem.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSelecteAll: false, // 是否全选
      searchName: '',
      loading: {
        getChildren: false
      },
      dataList: [],
      checkList: {}
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 默认选中的数据
    defaultData: {
      type: Array,
      default() {
        return []
      }
    },
    // 获取子数据的方法
    getChildren: {
      type: Function
    },
    // 需要删除的数据信息
    deleteInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    checkList: {
      handler(val) {
        this.$emit('change', val)
      },
      deep: true
    },

    // 监听默认数据，动态赋值
    defaultData() {
      // console.log(this.dataList);
    },

    // 需要删除的对象信息，用来删除已选择的数据
    deleteInfo: {
      handler(val) {
        let _this = this,
          dataList = _this.dataList,
          currentData = dataList.find(item => {
            return item.id === val.data.id
          })

        if (!currentData) {
          return false
        }

        // 判断类型，根据是否有子数据属性来判断
        if (val.childData) {
          let currentChildIndex = currentData.checkList.findIndex(item => {
            return val.childData === item
          })

          currentData.checkList.splice(currentChildIndex, 1)
          _this.selectDataChild(currentData)
        } else {
          currentData.checkStatus = false
        }
      }
    },

    // 监听处理列表数据
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        let _this = this,
          handlerData = _this.handlerData(val)

        handlerData.forEach(item => {
          item.checkList = []
        })

        _this.dataList = handlerData

        _this.$nextTick(() => {
          _this.handlerDefaultData()
        })
      }
    }
  },
  methods: {
    // 全选
    selecteAll(val) {
      let _this = this,
        dataList = _this.dataList

      dataList.forEach((dataListItem, index) => {
        dataListItem.checkStatus = val
        _this.selectData(index, 'all')
      })
    },

    /**
     * 处理后台返回的列表数据
     * @param data 后台返回的数据
     * @return 返回处理之后的数据
     */
    handlerData(data) {
      let _this = this,
        cloneData = JSON.parse(JSON.stringify(data))

      cloneData.forEach(item => {
        item.checkStatus = false
        _this.getChildren && (item.isShowPopover = false)
        item.name = item.name || item['zh-CN']
      })

      return cloneData
    },

    /**
     * 获取子列表数据
     * @params data 父列表数据
     */
    getChildData(data, callback) {
      let _this = this

      if (data.children) return

      _this.loading.getChildren = true

      _this.getChildren(data).then((res) => {
        data.children = _this.handlerData(res)
        _this.loading.getChildren = false
        callback && (callback(data.children))
      })
    },

    /**
     * 选择主数据执行的方法
     * @param index 当前选择的数据的下标
     * @param type 类型
     */
    selectData(index, type) {
      let _this = this,
        parent = _this.dataList[index]

      if (type !== 'all') {
        parent.isShowPopover = parent.checkStatus
      }

      // 如果当前选择的是true, 并且需要获取子元素 并且没有获取过子元素
      if (parent.checkStatus && _this.getChildren && !parent.children) {
        _this.getChildren(parent).then((res) => {
          let handlerData = _this.handlerData(res)

          _this.$set(parent, 'children', handlerData)

          _this.handlerSelectData(parent)
        })
      } else {
        _this.handlerSelectData(parent)
      };
    },

    /**
     * 处理选择的主数据
     * @param parent 当前选择的主数据
     */
    handlerSelectData(parent) {
      let _this = this,
        parentId = parent.id,
        childrenList = parent.children,
        childrenNameList = [],
        checkList = _this.checkList

      if (childrenList) {
        // 修改子数据的选中状态
        childrenList.forEach(child => {
          childrenNameList.push(child.name)
        })

        if (parent.checkStatus) {
          parent.checkList = childrenNameList
        } else {
          parent.checkList = []
        }
      }

      // 处理选择执行的操作
      if (parent.checkStatus) {
        let setData = {
          name: parent.name,
          id: parent.id
        }

        childrenNameList.length && (setData.child = childrenNameList)

        _this.$set(checkList, parentId, setData)
      } else {
        checkList[parentId] && (_this.$delete(checkList, parentId))
      }

      // 判断是否全选
      _this.isSelecteAll = Object.keys(checkList).length === _this.dataList.length
    },

    /**
     * 已选择的子数据改变执行的方法
     * @param parent 父数据
     */
    selectDataChild(parent) {
      let _this = this,
        parentCheckList = parent.checkList, // 父数据的选择数据
        checkList = _this.checkList, // 已选择的列表数据
        parentId = parent.id,
        currentSelectItem = checkList[parentId]

      if (parentCheckList.length) {
        parent.checkStatus = true

        // 判断已选择的列表数据中是否存在改值
        if (currentSelectItem) {
          currentSelectItem.child = parentCheckList
        } else {
          currentSelectItem = {
            name: parent.name,
            id: parent.id,
            child: parentCheckList
          }
        }
        _this.$set(_this.checkList, parentId, currentSelectItem)
      } else {
        parent.checkStatus = false
        _this.$delete(_this.checkList, parentId)
      }
    },

    // 处理默认数据
    handlerDefaultData() {
      let _this = this,
        defaultData = _this.defaultData,
        dataList = _this.dataList

      if (defaultData.length) {
        defaultData.forEach(defaultDataItem => {
          // 遍历父元素，从父元素的子数据中查找
          dataList.forEach(dataListItem => {
            // 先从主数据中查找是否存在，
            let currentDataIndex = dataList.findIndex(dataListItem => {
              return dataListItem.id == defaultDataItem
            })

            // 如果从主数据中查找到选择的数据，就直接选中主数据
            if (currentDataIndex > -1) {
              let currentDataListItem = dataList[currentDataIndex]

              // 将数据选中
              currentDataListItem.checkStatus = true
              dataList.splice(currentDataIndex, 1, currentDataListItem)
              _this.selectData(currentDataIndex, 'all')
            } else {
              if (!dataListItem.children) {
                _this.getChildData(dataListItem, childList => {
                  _this.handlerDefaultChild(dataListItem, childList, defaultDataItem)
                })
              } else {
                _this.handlerDefaultChild(dataListItem, dataListItem.children, defaultDataItem)
              }
            }
          })
        })
      }
    },

    // 处理默认子数据
    handlerDefaultChild(parent, childList, findId) {
      childList = childList || []

      let currentChild = childList.length && childList.find(childListItem => {
        return childListItem.id == findId
      })

      if (currentChild) {
        let _this = this,
          parentId = parent.id,
          currentSelectItem = _this.checkList[parentId] // 父数据的选择数据

        // 改变多选框选择状态
        parent.checkStatus = true
        parent.checkList.push(currentChild.name)

        // 将选择的值添加到已选择列表
        if (currentSelectItem) {
          currentSelectItem.child.push(currentChild.name)
        } else {
          currentSelectItem = {
            name: parent.name,
            id: parentId,
            child: [currentChild.name]
          }
        }

        _this.$set(_this.checkList, parentId, currentSelectItem)
      }
    },

    /**
     * 对外提供的接口，用于获取最终数据
     */
    getValue() {
      let _this = this,
        checkList = _this.checkList,
        dataList = _this.dataList,
        result = []

      for (let key in checkList) {
        let currentData,
          setData = {}

        // 找到父数据
        currentData = dataList.find(item => {
          return item.id === checkList[key].id
        })

        setData = {
          name: currentData.name,
          id: currentData.id
        }

        // 判断是否存在子数据
        if (_this.getChildren) {
          let selectedChildList = currentData.checkList,
            handlerdSelectedChildList = [] // 处理之后的子数据

          // 如果是全选，就不返回子数据
          if (currentData.children.length !== selectedChildList.length) {
            selectedChildList.forEach(selectedChildItem => {
              let selectedChildItemOrigin = currentData.children.find(childrenItem => {
                return childrenItem.name === selectedChildItem
              })

              selectedChildItemOrigin && (handlerdSelectedChildList.push(selectedChildItemOrigin))
            })

            setData.child = handlerdSelectedChildList
          }
        }

        result.push(setData)
      }

      return result
    }
  }
}
</script>

<style lang="less">
  .multiple-choise-list {
    padding-left: 20px;

    .el-checkbox  {
      margin-right: 6px;
    }

    .multiple-choise-list-search {
      padding: 36px 0 25px 0;
      display: flex;
      align-items: center;

      .search-input {
        width: 400px;
        margin-left: 25px;
      }
    }

    .list-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .list-content-item {
        box-sizing: border-box;
        padding-right: 10px;
        min-width: 100px;

        .list-item-name {
          user-select: none;
          cursor: pointer;
        }
      }
    }
  }

  .multiple-choise-children {
    .list-children {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      min-height: 50px;

      .list-children-item {
        box-sizing: border-box;
        padding-right: 10px;
        min-width: 100px;
        height: 40px;
      }
    }
  }
</style>
