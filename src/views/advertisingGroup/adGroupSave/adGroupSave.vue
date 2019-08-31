<template>
  <div class="ad-group-save" v-loading="loading">
    <!-- 进度条 -->
    <stepsToCreateAnAd :active="0"></stepsToCreateAnAd>

    <div class="title">
      {{ form._id ? '编辑广告组' : '新增广告组' }}
    </div>

    <!-- 表单 -->
    <el-form ref="form" class="form" :rules="rules" :model="form" label-width="100px">

      <!-- 推广目标 -->
      <el-form-item label="推广目标" prop="device">
        <el-radio-group v-model="form.device">
          <el-radio
            v-for="(item, index) in device"
            :key="index"
            :label="index"
            border>
            {{ item }}
            </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 推广小程序 -->
      <el-form-item label="推广小程序" prop="appId">
        <el-select v-model="form.appId" placeholder="选择推广小程序">
          <el-option
            v-for="(item, index) in appletList"
            :key="index"
            :label="item.name"
            :value="item.miniProgramId">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 推广预算 -->
      <el-form-item label="推广日预算" prop="budget">
        <el-radio-group v-model="form.budget">
          <el-radio-button
            v-for="(item, index) in budgetList"
            :key="index"
            :label="item.value">
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <!-- 日预算 -->
      <el-form-item v-if="form.budget == '1'" label="推广日预算" prop="daySettlement">
        <el-input class="input" v-model="form.daySettlement"></el-input>
        元
      </el-form-item>

      <!-- 广告主名称 -->
      <el-form-item label="广告组名称" prop="name">
        <el-input class="input" v-model="form.name"></el-input>
      </el-form-item>

      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSaveCreatedPlan">保存并创建计划</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import stepsToCreateAnAd from '@/components/adComponents/stepsToCreateAnAd'
import { getPlanApi, promotionPlanSaveApi } from '@/api/services/advertisingGroup'
import { checkPositiveInt } from '@/utils/index'
export default {
  name: 'ad-group-save',
  components: {
    stepsToCreateAnAd
  },
  data() {
    let _this = this
    return {
      loading: false,

      // 推广目标
      device: [],
      // 小程序列表
      appletList: [],
      // 预算列表
      budgetList: [
        { name: '不限预算', value: '0' },
        { name: '指定预算', value: '1' }
      ],

      form: {
        _id: '',
        device: '', // 目标
        appId: '', // 小程序
        budget: '0', // 预算
        daySettlement: '', // 预算值
        name: '' // 名称
      },

      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        device: [
          { required: true, message: '请选择推广目标', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '请输入推广小程序', trigger: 'change' }
        ],
        daySettlement: [
          { required: true, message: '请输入日预算', trigger: 'blur' },
          { validator: _this.validateInt, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created() {
    let _this = this,
      id = _this.$route.query.id

    _this.form._id = id
    _this.getAdDetails()
  },
  methods: {
    getAdDetails() {
      let _this = this,
        id = _this.form._id

      getPlanApi({
        id
      }).then(res => {
        let planInfo = res.planInfo || {},
          form = _this.form,
          firstApp = (res.appList[0] && res.appList[0].miniProgramId)

        _this.appletList = res.appList || []
        _this.device = res.device || []

        form.name = planInfo.name
        form.device = planInfo.device
        form.daySettlement = planInfo.daySettlement
        form.appId = planInfo.appId || firstApp
      })
    },

    // 校验整数
    validateInt(rule, value, callback) {
      if (value === '') {
        callback()
      }

      if (!checkPositiveInt(value)) {
        return callback(new Error('请输入正确的数值'))
      }

      callback()
    },

    // 取消
    handleCancel() {
      this.$router.go(-1)
    },

    // 保存
    handleSave() {
      let _this = this

      _this.onSubmit().then(res => {
        _this.$router.push({
          name: 'adProgramList'
        })
      })
    },

    // 保存并创建计划
    handleSaveCreatedPlan() {
      let _this = this

      _this.onSubmit().then(res => {
        _this.$router.push({
          name: 'adProgramSave',
          query: {
            id: res.id
          }
        })
      })
    },

    // 获取参数
    getParameter() {
      let _this = this,
        form = _this.form,
        budget = form.budget,
        appletList = _this.appletList,
        appletInfo = appletList.find(item => { return item.miniProgramId == form.appId })

      return {
        _id: form._id || undefined,
        appId: form.appId,
        appName: appletInfo.name,
        daySettlement: (budget == 0) ? -1 : form.daySettlement,
        device: form.device,
        name: form.name
      }
    },

    // 提交
    onSubmit() {
      let _this = this

      return new Promise((resolve, reject) => {
        _this.$refs.form.validate((valid) => {
          if (valid) {
            promotionPlanSaveApi(
              _this.getParameter()
            ).then(res => {
              resolve(res)
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.ad-group-save {
  min-height: 100%;
  box-sizing: border-box;
  padding: 15px 0 0 30px;
  background: #fff;

  .title {
    margin: 24px 0;
    font-size: 18xp;
    font-weight: 700;
    display: inline-block;
    padding: 0 0 12px 0;
    border-bottom: 2px solid #4D5AFF;
  }

  .form {
    padding: 0 24px 24px 24px;

    .input {
      width: 200px;
    }
  }
}
</style>
