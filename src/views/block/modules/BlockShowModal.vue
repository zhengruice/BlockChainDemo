<template>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :spinning="spinning" tip="数据处理中...">
<!--      <j-form-container>-->
<!--        <a-form-model ref="form" :model="model" slot="detail">-->
<!--          <a-row :gutter="10">-->
<!--            <a-col :span="10">-->
<!--              <a-input v-model="model.types"  :labelCol="labelCol" :wrapperCol="wrapperCol" placeholder="请输入类别" :rows="4"  />-->
<!--            </a-col>-->
<!--            <a-col :span="4">-->
<!--              <a-button>查询</a-button>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-form-model>-->
<!--      </j-form-container>-->

        <div style="margin-top: 20px;height: 500px;width: 100%;display: flex;overflow-x: scroll">
          <div
            v-for="(item, index) in dataList"
            :style="index===0?'':'margin-left: 10px'"
            style="border: 1px solid #e3e3e3;border-radius: 4px;min-width: 350px;height:95%;background-color: rgb(223, 240, 216);">
              <a-row style="padding: 15px">
                <a-col :span="4" class="names1">
                  <span >区块:</span>
                </a-col>
                <a-col :span="20" style="line-height: 34px">
                  <span class="data1">{{ '#' + (index+1) }}</span>
                </a-col>


                <a-col :span="4" class="names2">
                  <span >随机数:</span>
                </a-col>
                <a-col :span="20" style="line-height: 34px;margin-top: 15px">
                  <span class="data1">{{ item.nonce }}</span>
                </a-col>


                <a-col :span="4" class="names2">
                  <span>数据:</span>
                </a-col>
                <a-col :span="20" style="line-height: 34px;margin-top: 15px">
                  <div class="data2">
                    <span >{{ item.datas }}</span>
                  </div>
                </a-col>

                <a-col :span="4" class="names2">
                  <span >前指针:</span>
                </a-col>
                <a-col :span="20" style="line-height: 23px;margin-top: 15px">
                  <div class="data3">
                    <span >{{ item.previousHash }}</span>
                  </div>
                </a-col>

                <a-col :span="4" class="names2">
                  <span >哈希:</span>
                </a-col>
                <a-col :span="20" style="line-height: 23px;margin-top: 15px">
                  <div class="data3">
                    <span>{{ item.hash }}</span>
                  </div>
                </a-col>

              </a-row>

          </div>

        </div>
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
        dataList: [
          // {
          //   nonce: '1999dsadsadasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdsadsadsadasdasdasd'
          // },
          // {
          //   nonce: 11561
          // },
          // {
          //   nonce: 11561
          // },
          // {
          //   nonce: 11561
          // },
          // {
          //   nonce: 11561
          // },
          // {
          //   nonce: 11561
          // },
        ],
        url:{
          dataProcess:"/block/block/dataProcess",
          queryByType:"/block/block/queryByType",
        },
        spinning : false,
        handleClose: false,
        messages:"",
        model:{
          types: '',
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
        width: 850,
        visible: false,
        disableSubmit: false
      }
    },
    watch: {
      "model.types": function (nVal, oVal) {
        console.log(nVal , oVal)
      }
    },
    methods: {
      process (params) {
        this.visible = true;
        if (params) {
          this.model.types = params;
          httpAction(this.url.queryByType,this.model,"post").then((res)=>{
            if (res.success){
              console.log(res);
              this.dataList = res.result;
            }
          });
        }
      },
      close () {
        this.visible = false;
      },
      handleOk () {
        // const that = this;
        // console.log("提交");
        // that.spinning = true;
        // // message.loading("数据处理中");
        // // setTimeout(() => {
        // //   message.success({
        // //     content: 'Loaded!',
        // //     key,
        // //     duration: 2,
        // //   });
        // // }, 1000);
        // httpAction(this.url.dataProcess,this.model,"post").then((res)=>{
        //   if (res.success){
        //     this.messages = "数据处理成功！";
        //     // message.destroy()
        //     message.success({
        //       content: this.messages,
        //       duration: 3,
        //     })
        //   }else {
        //     message.error("数据处理失败");
        //   }
        // }).finally(()=>{
        //   that.spinning = false;
        //   this.close();
        // });
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

<style lang="less" scoped>
  .names1 {
    line-height: 34px;
    font-weight: 700;
  }
  .names2 {
    line-height: 34px;
    font-weight: 700;
    margin-top: 15px
  }
  .data1 {
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    display: block;
  }
  .data2 {
    display: block;
    width: 100%;
    height: 150px;
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  }
  .data3 {
    display: block;
    width: 100%;
    height: 70px;
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  }
</style>