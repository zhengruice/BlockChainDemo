<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="订单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入订单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customerId">
              <j-search-select-tag v-model="model.customerId" dict="bas_customer,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="业务员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salesmanId">
              <j-search-select-tag v-model="model.salesmanId" dict="sys_salesman,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="收款日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentTime">
              <j-date placeholder="请选择收款日期" v-model="model.paymentTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="摘要" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="summary">
              <a-textarea v-model="model.summary" rows="4" placeholder="请输入摘要" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="remark">
              <a-textarea v-model="model.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="产品销售收款订单明细表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="saleProductPaymentBillDetailTable.loading"
          :columns="saleProductPaymentBillDetailTable.columns"
          :dataSource="saleProductPaymentBillDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { httpAction, getAction, putAction} from '@/api/manage'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'
  import { getFormatDate } from '../../utils/util'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'SaleProductPaymentBillForm',
    mixins: [JEditableTableModelMixin],
    components: {
      OnlCgreportSelectModal,
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        model:{
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 0,
        validatorRules: {
           customerId: [
              { required: true, message: '请输入客户!'},
           ],
           salesmanId: [
              { required: true, message: '请输入业务员!'},
           ],
           paymentTime: [
              { required: true, message: '请输入收款日期!'},
           ],
        },
        refKeys: ['saleProductPaymentBillDetail', ],
        tableKeys:['saleProductPaymentBillDetail', ],
        activeKey: 'saleProductPaymentBillDetail',
        // 产品销售收款订单明细表
        saleProductPaymentBillDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '销售订单号',
              key: 'superBillNo',
              type: FormTypes.input,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '产品编号',
              key: 'productCode',
              type: FormTypes.input,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '产品',
              key: 'productId',
              type: FormTypes.sel_search,
              dictCode:"bas_product,name,id",
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '产品类别',
              key: 'productCategoryId',
              type: FormTypes.sel_search,
              dictCode:"bas_product_category,name,id",
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '产品计量组',
              key: 'productMeasureGroupId',
              type: FormTypes.sel_search,
              dictCode:"bas_product_measure_group,name,id",
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '单价',
              key: 'productPrice',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '库存数量',
              key: 'inventoryNum',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '销售数量',
              key: 'saleNum',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '销售金额',
              key: 'saleMoney',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '未收款金额',
              key: 'nonPaymentMoney',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '收款金额',
              key: 'paymentMoney',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/saleProductPaymentBill/saleProductPaymentBill/add",
          edit: "/saleProductPaymentBill/saleProductPaymentBill/edit",
          queryById: "/saleProductPaymentBill/saleProductPaymentBill/queryById",
          saleProductPaymentBillDetail: {
            list: '/saleProductPaymentBill/saleProductPaymentBill/querySaleProductPaymentBillDetailByMainId'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      addBefore(){
        this.saleProductPaymentBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'sale_payment_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            //record.saleTime = getFormatDate();
            this.model = Object.assign({}, record)
          }
        })
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.saleProductPaymentBillDetail.list, params, this.saleProductPaymentBillDetailTable)
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
          saleProductPaymentBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

    }
  }
</script>

<style scoped>
</style>