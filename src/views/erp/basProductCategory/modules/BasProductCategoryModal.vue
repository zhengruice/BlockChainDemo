<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <j-form-container :disabled="disableSubmit">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail" >
        <a-form-model-item label="父级节点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pid">
          <j-tree-select
            ref="treeSelect"
            placeholder="请选择父级节点"
            v-model="model.pid"
            dict="bas_product_category,name,id"
            pidField="pid"
            pidValue="0"
            hasChildField="has_child"
            >
          </j-tree-select>
        </a-form-model-item>
        <a-form-model-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
          <a-input v-model="model.code" placeholder="请输入编码" disabled></a-input>
        </a-form-model-item>
        <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
          <a-input v-model="model.name" placeholder="请输入名称" ></a-input>
        </a-form-model-item>
        <a-form-model-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isEnabled">
          <j-dict-select-tag type="list" v-model="model.isEnabled"  dictCode="yn" placeholder="请选择是否启用" />
        </a-form-model-item>
        <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
          <a-input v-model="model.remark" placeholder="请输入备注" ></a-input>
        </a-form-model-item>

      </a-form-model>
      </j-form-container>


      <!-- 子表单区域 -->
      <a-tabs v-model="activeKey"  v-show="disableSubmit">
        <a-tab-pane tab="产品详细信息" :key="refKeys[0]" :forceRender="true">
          <j-editable-table
            :ref="refKeys[0]"
            :loading="basProductDetailTable.loading"
            :columns="basProductDetailTable.columns"
            :dataSource="basProductDetailTable.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :disabled="disableSubmit"
            :rowSelection="false"
            :actionButton="false"/>
        </a-tab-pane>
      </a-tabs>

    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction, getAction,putAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'


  export default {
    name: "BasProductCategoryModal",
    mixins: [JEditableTableModelMixin],
    components: {

    },
    data () {
      return {
        title:"操作",
        disableSubmit:false,
        width:800,
        visible: false,
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
        validatorRules: {
           name: [
              { required: true, message: '请输入名称!'},
           ],
        },
        url: {
          add: "/basProductCategory/basProductCategory/add",
          edit: "/basProductCategory/basProductCategory/edit",
          productList: "/basProduct/basProduct/list",
        },
        expandedRowKeys:[],
        pidField:"pid",
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 0,
        refKeys: ['basProductDetail', ],
        tableKeys:['basProductDetail', ],
        activeKey: 'basProductDetail',
        basProductDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            // {
            //   title: '#',
            //   dataIndex: '',
            //   key:'rowIndex',
            //   width:60,
            //   align:"center",
            //   customRender:function (t,r,index) {
            //     return parseInt(index)+1;
            //   }
            // },
            {
              title: '编码',
              key: 'code',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '名称',
              key: 'name',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },

            {
              title: '备注',
              key: 'remark',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ],
        },

      }
    },
    created () {
       //备份model原始值
       this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add (obj) {

        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'product_category_code'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            //return res.result;
            this.modelDefault.code = res.result;
            this.modelDefault.pid = ''
            this.modelDefault.isEnabled = 1;
            this.edit(Object.assign(this.modelDefault, obj));
          }
        });
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
        // 加载子表数据
        if (this.model.id) {
          let params = { categoryId: this.model.id }
          this.requestSubTableData(this.url.productList, params, this.basProductDetailTable)
        }
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.clearValidate()
      },
      handleOk () {
        const that = this;
        // 触发表单验证
       this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
             if(this.model.id && this.model.id === this.model[this.pidField]){
              that.$message.warning("父级节点不能选择自己");
              that.confirmLoading = false;
              return;
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                this.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }else{
             return false
          }
        })
      },
      handleCancel () {
        this.close()
      },
      submitSuccess(formData,flag){
        if(!formData.id){
          let treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys=[]
          this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
          this.$emit('ok',formData,this.expandedRowKeys.reverse());
        }else{
          this.$emit('ok',formData,flag);
        }
      },
      getExpandKeysByPid(pid,arr,all){
        if(pid && arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid){
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'],all,all)
            }else{
              this.getExpandKeysByPid(pid,arr[i].children,all)
            }
          }
        }
      }


    }
  }
</script>