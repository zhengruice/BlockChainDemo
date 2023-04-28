<template>
  <div>
    <a-row>
      <a-col>
        <a-card>
          <h1 style="text-align: center">食品安全追溯云平台v1.0</h1>
        </a-card>
      </a-col>
    </a-row>
<!--    <index-chart v-if="indexStyle==1"></index-chart>-->
<!--    <index-bdc v-if="indexStyle==2"></index-bdc>-->
<!--    <index-task v-if="indexStyle==3"></index-task>-->
<!--    <div style="width: 100%;text-align: right;margin-top: 20px">-->
<!--      请选择首页样式：-->
<!--      <a-radio-group v-model="indexStyle">-->
<!--        <a-radio :value="1">统计图表</a-radio>-->
<!--        <a-radio :value="2">统计图表2</a-radio>-->
<!--        <a-radio :value="3">任务表格</a-radio>-->
<!--      </a-radio-group>-->
<!--    </div>-->
  </div>
</template>

<script>
  import IndexChart from './IndexChart'
  import IndexTask from "./IndexTask"
  import IndexBdc from './IndexBdc'

  export default {
    name: "Analysis",
    components: {
      IndexChart,
      IndexTask,
      IndexBdc
    },
    data() {
      return {
        indexStyle:1
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>