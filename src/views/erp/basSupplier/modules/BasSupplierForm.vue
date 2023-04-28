<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入编号" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contacts">
              <a-input v-model="model.contacts" placeholder="请输入联系人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入联系电话"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isEnabled">
              <j-dict-select-tag type="list" v-model="model.isEnabled" dictCode="yn" placeholder="请选择是否启用" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否送货" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isSend">
              <j-dict-select-tag type="list" v-model="model.isSend" dictCode="yn" placeholder="请选择是否送货" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="钱包" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="wallet">
              <a-input-number v-model="model.wallet" placeholder="请输入钱包" style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" rows="1" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs" v-show="visible">
      <a-tab-pane tab="供应商详细信息" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="basSupplierDetailTable.loading"
          :columns="basSupplierDetailTable.columns"
          :dataSource="basSupplierDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="false"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { httpAction, getAction, putAction} from '@/api/manage'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'BasSupplierForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
            isEnabled:1,
            isSend:1,
            wallet:0,
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
           phone: [
              { required: false},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
           ],
           wallet: [
              { required: false},
              { pattern: /^(-?\+?(0|([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/, message: '请输入正确的金额!'},
           ],
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 0,
        refKeys: ['basSupplierDetail', ],
        tableKeys:['basSupplierDetail', ],
        activeKey: 'basSupplierDetail',
        // 供应商详细信息
        basSupplierDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '材料名称',
              key: 'name',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '材料类别',
              key: 'categoryId',
              type: FormTypes.select,
              dictCode: "bas_material_category,name,id",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '规格',
              key: 'model',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '计量单位',
              key: 'unit',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '单价',
              key: 'price',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
          ]
        },
        url: {
          add: "/basSupplier/basSupplier/add",
          edit: "/basSupplier/basSupplier/edit",
          queryById: "/basSupplier/basSupplier/queryById",
          basSupplierDetail: {
            list: '/basSupplier/basSupplier/queryBasSupplierDetailByMainId'
          },
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      addBefore(){
        this.basSupplierDetailTable.dataSource=[];

      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'supplier_code'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.code =  res.result;
            this.model = Object.assign({}, record)
            //this.edit(record);
          }
        })
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter (record) {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.basSupplierDetail.list, params, this.basSupplierDetailTable)
        }
      },
      //校验所有一对一子表表单
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
              if (e.error === VALIDATE_NO_PASSED) {
                // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
              } else {
                console.error(e)
              }
            })
          })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          basSupplierDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
      submitForm () {
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
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
    }
  }
</script>