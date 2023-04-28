<template>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      @ok="handleOk"
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :spinning="spinning" tip="数据处理中...">
      <j-form-container>
        <a-form-model ref="form" :model="model" slot="detail">
          <a-row>
            <a-col :span="24">
              <a-textarea v-model="model.datas"  :labelCol="labelCol" :wrapperCol="wrapperCol" placeholder="请输入要处理的数据" :rows="4"  />
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>
      </a-spin>
    </j-modal>


</template>

<script>

  import BlockForm from './BlockForm'
  import {httpAction} from "../../../api/manage";
  import {message} from "ant-design-vue";
  export default {
    name: 'DataProcessModal',
    components: {
      BlockForm
    },
    data () {
      return {
        url:{
          dataProcess:"/block/block/dataProcess"
        },
        spinning : false,
        handleClose: false,
        messages:"",
        model:{
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      process () {
        this.visible=true
      },
      close () {
        this.visible = false;
      },
      handleOk () {
        const that = this;
        console.log("提交");
        that.spinning = true;
        // message.loading("数据处理中");
        // setTimeout(() => {
        //   message.success({
        //     content: 'Loaded!',
        //     key,
        //     duration: 2,
        //   });
        // }, 1000);
        httpAction(this.url.dataProcess,this.model,"post").then((res)=>{
          if (res.success){
            this.messages = "数据处理成功！";
            // message.destroy()
            message.success({
              content: this.messages,
              duration: 3,
            })
          }else {
            message.error("数据处理失败");
          }
        }).finally(()=>{
          that.spinning = false;
          this.close();
        });

      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>