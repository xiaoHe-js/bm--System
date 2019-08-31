<template>
  <div class="ad-program-save">
    <!-- 进度条 -->
    <stepsToCreateAnAd :active="1"></stepsToCreateAnAd>

    <div class="title">
      {{ unitId ? '编辑广告计划' : '新增广告计划' }}
    </div>

    <!-- 表单 -->
    <el-form ref="form" class="form" :rules="rules" :model="form" label-width="100px">

      <div class="form-item-title">投放范围</div>
      <!-- 投放范围 -->
      <el-form-item label="投放范围" prop="scope">
        <el-radio-group v-model="form.scope">
          <el-radio-button label="0">默认全部</el-radio-button>
          <el-radio-button label="1">指定小程序</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 指定小程序 -->
      <el-form-item label="" prop="applet" v-if="form.scope === '1'">
        <el-select v-model="form.applet" multiple placeholder="请选择指定小程序">
          <el-option
            v-for="(item, index) in appList"
            :key="index"
            :value="item.miniProgramId"
            :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <div class="form-item-title">投放目标</div>
      <!-- 投放目标 -->
      <el-form-item label="投放目标" prop="launchGoal">
        <el-radio-group v-model="form.launchGoal">
          <el-radio-button
            v-for="(item, index) in adUnitAttribute.launchGoal"
            :key="index"
            :label="index">
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 转换目标 -->
      <el-form-item label="转换目标" prop="conversionGoal">
        <el-radio-group v-model="form.conversionGoal">
          <el-radio-button
            v-for="(item, index) in adUnitAttribute.conversionGoal"
            :key="index"
            :label="index">
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div class="form-item-title">预算出价</div>
      <!-- 日预算 -->
      <el-form-item label="日预算" prop="daySettlement">
        <el-input class="input" v-model="form.daySettlement"></el-input>
      </el-form-item>
      <!-- 付费方式 -->
      <el-form-item label="付费方式" prop="payMethod">
        <el-radio-group v-model="form.payMethod">
          <el-radio-button
            v-for="(item, index) in adUnitAttribute.payMethod"
            :key="index"
            :label="index">
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 目标转换价 -->
      <el-form-item label="目标转换价" prop="unitPrice">
        <el-input class="input" v-model="form.unitPrice"></el-input>
      </el-form-item>
      <!-- 投放时间 -->
      <el-form-item label="投放时间" prop="launchDateType">
        <el-radio-group v-model="form.launchDateType">
          <el-radio-button label="0">长期投放</el-radio-button>
          <el-radio-button label="1">指定时间</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 指定时间 -->
      <el-form-item label="指定时间" prop="launchDate" v-if="form.launchDateType === '1'">
        <el-date-picker
          v-model="form.launchDate"
          type="daterange"
          value-format="yyyyMMdd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <!-- 投放时间段 -->
      <el-form-item label="投放时间段" prop="timeParagraphType">
        <el-radio-group v-model="form.timeParagraphType">
          <el-radio-button label="0">不限</el-radio-button>
          <el-radio-button label="1">指定时间段</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 选择时间段 -->
      <el-form-item label="" prop="timeParagraph" v-if="form.timeParagraphType === '1'">
        <selectTimeArea ref="selectTimeArea"></selectTimeArea>
      </el-form-item>

      <div class="form-item-title">用户定向</div>
      <!-- 地域 -->
      <el-form-item label="地域" prop="launchAreaType">
        <el-radio-group v-model="form.launchAreaType">
          <el-radio-button label="0">不限</el-radio-button>
          <el-radio-button label="1">按省市</el-radio-button>
        </el-radio-group>
        <!-- 选择地域 -->
        <multipleChoise
          v-if="form.launchAreaType === '1'"
          v-loading="loading.getCityLoading"
          :data="cityList"
          ref="city"
          :rule="validCity"
          :defaultData="launchArea"
          :getChildren="getCityChildren"
        ></multipleChoise>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio-button
            v-for="(value, key) in adUnitAttribute.sex"
            :key="key"
            :label="key">
            {{ value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <div class="form-item-title">计划名称</div>
      <!-- 计划名称 -->
      <el-form-item label="计划名称" prop="name">
        <el-input class="input" v-model="form.name"></el-input>
      </el-form-item>

      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getCityListApi, getUnitApi, promotionUnitSaveApi } from '@/api/services/advertisingProgram'
import rulesMixins from './components/rulesMixins'
import stepsToCreateAnAd from '@/components/adComponents/stepsToCreateAnAd'
import multipleChoise from './components/multipleChoise'
import selectTimeArea from './components/selectTimeArea'

export default {
  name: 'ad-program-save',
  mixins: [rulesMixins],
  components: {
    stepsToCreateAnAd,
    multipleChoise,
    selectTimeArea
  },
  data() {
    return {
      adPlanId: '', // 所属广告组id
      unitId: '', // 广告计划Id

      form: {
        scope: '0', // 投放范围
        launchLimits: [], // 小程序Id数组
        launchGoal: '0', // 投放目标
        conversionGoal: '0', // 转换目标
        daySettlement: '0', // 预算
        payMethod: '0', // 付费方式
        unitPrice: '0', // 目标转换价
        launchDateType: '0', // 投放时间类型
        launchDate: '', // 投放日期 startDate endDate Ymd格式
        timeParagraphType: '0', // 投放时间段
        launchAreaType: '0', // 地域类型
        launchArea: '0', // 地域
        sex: '0',
        name: '', // 名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        id: ''
      },

      loading: {
        pageLoading: false,
        getCityLoading: false
      },

      // 广告计划的属性列表
      adUnitAttribute: {
        conversionGoal: [], // 转换目标
        launchGoal: [], // 投放目标
        payMethod: [], // 付费方式
        sex: [] // 性别
      },

      cityList: [], // 城市列表
      launchArea: [], // 已选择的城市 （编辑时数据）

      appList: [
        { name: '小程序1', value: '0' },
        { name: '小程序2', value: '1' }
      ]
    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      let _this = this

      Promise.all([_this.getAdDetails(), _this.getCityList()])
        .then(([
          adDetails, cityList
        ]) => {
          _this.appList = adDetails.appList
          _this.adUnitAttribute = adDetails.adUnitAttribute
          _this.cityList = cityList
        })
    },

    // 获取广告默认数据
    getAdDetails() {
      let _this = this,
        id = _this.unitId
      return new Promise((resolve, reject) => {
        getUnitApi({
          id
        }).then(res => {
          resolve(res)
        })
      })
    },

    // 获去城市列表
    getCityList() {
      return new Promise((resolve, reject) => {
        getCityListApi().then(res => {
          resolve(res)
        })
      })
    },

    // 投放区域校验规则
    validCity(city) {
      if (city.length === 0) {
        return '请选择投放区域'
      }
      return ''
    },
    // 获取城市子数据
    getCityChildren(data) {
      return new Promise((resolve, reject) => {
        resolve(data.childList)
      })
    },

    // 取消
    handleCancel() {
      this.$router.push({
        name: 'adProgramList'
      })
    },

    // 校验表单
    validateForm() {
      let _this = this
      return new Promise((resolve, reject) => {
        _this.$refs.form.validate((valid) => {
          if (valid) {
            resolve()
          }
        })
      })
    },

    // 校验 选择时间区域
    validateSelectTimeArea() {
      let _this = this

      return new Promise((resolve, reject) => {
        if (!_this.$refs.selectTimeArea) {
          resolve()
        } else {
          if (_this.$refs.selectTimeArea.validate()) {
            resolve()
          }
        }
      })
    },

    // 校验 选择城市
    validateCity() {
      let _this = this
      return new Promise((resolve, reject) => {
        if (!_this.$refs.city) {
          resolve()
        } else {
          if (_this.$refs.city.validate()) {
            resolve()
          }
        }
      })
    },

    // 获取参数
    getParameter() {
      //       launchDate[startDate]: 20190830
      // launchDate[endDate]: 20991212
      let _this = this,
        form = _this.form

      console.log(_this.$refs.city && _this.$refs.city.getValue())
      console.log(_this.$refs.selectTimeArea && _this.$refs.selectTimeArea.getValue())

      return {
        _id: _this.unitId, // 广告计划ID 编辑必传，新建不用
        adPlanId: _this.adPlanId, // 所属广告组ID 新建必传，编辑不用
        conversionGoal: form.conversionGoal, // 转化目标
        daySettlement: form.daySettlement, // 日预算
        launchArea: form.launchArea, // 投放地区 array key数组
        launchDate: form.launchDate, // 投放日期 array<object>
        launchGoal: form.launchGoal, // 投放目标
        launchLimits: form.launchLimits, // 投放范围 array 小程序id数组
        launchTime: form.launchTime, // 投放时间 array<object>
        name: form.name, // 广告计划名称
        payMethod: form.payMethod, // 付费方式
        sex: form.sex, // 性别 array
        unitPrice: form.unitPrice // 转化价
      }
    },

    // 保存
    promotionUnitSave() {
      let _this = this

      return new Promise((resolve, reject) => {
        // 验证， 获取参数， 发送请求
        Promise.all([
          _this.validateForm(),
          _this.validateSelectTimeArea(),
          _this.validateCity()
        ]).then(() => {
          console.log(_this.getParameter())
          return
          promotionUnitSaveApi(

          ).then(res => {
            resolve(res)
          })
        })
      })
    },

    // 提交
    onSubmit() {
      let _this = this

      _this.promotionUnitSave().then((res) => {

      })
    }
  }
}
</script>

<style scoped lang="less">
.ad-program-save {
  min-height: 100%;
  box-sizing: border-box;
  padding: 15px 0 0 30px;
  background: #fff;

  .title {
    margin: 24px 0;
    font-size: 20px;
    font-weight: 700;
    display: inline-block;
    padding: 0 0 12px 0;
    border-bottom: 2px solid #4D5AFF;
  }

  .form {
    padding: 0 24px 24px 24px;

    .form-item-title {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
