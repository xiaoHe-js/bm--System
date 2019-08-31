<template>
  <div class="steps-to-create-an-ad">
    <el-steps :space="200" :active="active" finish-status="success">
      <el-step title="新建广告组"></el-step>
      <el-step title="新建广告计划"></el-step>
      <el-step title="新建广告创意"></el-step>
      <el-step title="开始广告投放"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  props: {
    // 激活项 第几个，从0开始
    active: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped lang="less">

</style>
