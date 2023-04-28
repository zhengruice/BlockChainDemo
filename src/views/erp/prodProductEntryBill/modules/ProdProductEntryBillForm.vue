<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="入库单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入入库单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="入库日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="entryTime">
              <j-date placeholder="请选择入库日期" v-model="model.entryTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="入库人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="employeeId">
              <j-search-select-tag v-model="model.employeeId" dict="sys_employee,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-search-select-tag @change="warehouseIdChange"  v-model="model.warehouseId" dict="bas_warehouse,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="显影数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="showNum">
              <a-input-number v-model="model.showNum" placeholder="请输入显影数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="定影数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fixNum">
              <a-input-number v-model="model.fixNum" placeholder="请输入定影数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>

<!--          <a-col :span="12" >-->
<!--            <a-form-model-item label="产品类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="categoryId">-->
<!--              <j-search-select-tag v-model="model.categoryId" dict="bas_product_category,name,id"  />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="12" >-->
<!--            <a-form-model-item label="附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="attachment">-->
<!--              <j-upload v-model="model.attachment"  ></j-upload>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
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
      <a-tab-pane tab="生产产品入库账单明细" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="prodProductEntryBillDetailTable.loading"
          :columns="prodProductEntryBillDetailTable.columns"
          :dataSource="prodProductEntryBillDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          @valueChange="onValueChange"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { httpAction, getAction, putAction} from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import { getFormatDate } from '../../utils/util'
  import  {billCommonMixin} from '@/views/erp/mixins/billCommonMixin'

  export default {
    name: 'ProdProductEntryBillForm',
    mixins: [JEditableTableModelMixin,billCommonMixin],
    components: {
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
           entryTime: [
              { required: true, message: '请输入入库日期!'},
           ],
           employeeId: [
              { required: true, message: '请输入入库人!'},
           ],
           showNum: [
              { required: true, message: '请输入显影数量!'},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的数量!'},
           ],
           fixNum: [
              { required: true, message: '请输入定影数量!'},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的数量!'},
           ],
           warehouseId: [
              { required: true, message: '请输入仓库!'},
           ],
           categoryId: [
              { required: true, message: '请输入产品类别!'},
           ],
        },
        refKeys: ['prodProductEntryBillDetail', ],
        tableKeys:['prodProductEntryBillDetail', ],
        activeKey: 'prodProductEntryBillDetail',
        // 生产产品入库账单明细表
        prodProductEntryBillDetailTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '产品编码',
              key: 'productCode',
              type: FormTypes.hidden,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '产品名称',
              key: 'productId',
              type: FormTypes.sel_search,
              dictCode:"bas_product,name,id",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '产品类别',
              key: 'productCategoryId',
              type: FormTypes.hidden,
              dictCode:"bas_product_category,name,id",
              width:"200px",
              disabled:true,
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '产品计量组',
              key: 'productMeasureGroupId',
              type: FormTypes.sel_search,
              dictCode:"bas_product_measure_group,name,id",
              options:[],
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            // {
            //   title: '成本',
            //   key: 'productCost',
            //   type: FormTypes.inputNumber,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            //   validateRules: [{ required: true, message: '${title}不能为空' },
            //     { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},],
            // },
            {
              title: '入库数量',
              key: 'entryNum',
              type: FormTypes.inputNumber,
              statistics: true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' },
                { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的数量!'},],
            },
          ]
        },
        url: {
          add: "/prodProductEntryBill/prodProductEntryBill/add",
          edit: "/prodProductEntryBill/prodProductEntryBill/edit",
          queryById: "/prodProductEntryBill/prodProductEntryBill/queryById",
          prodProductEntryBillDetail: {
            list: '/prodProductEntryBill/prodProductEntryBill/queryProdProductEntryBillDetailByMainId'
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
        this.prodProductEntryBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'prod_product_entry_bill_on'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.entryTime = getFormatDate();
           // this.model = Object.assign({}, record)
            //this.edit(record);
            //处理记录上一次的记录人
            let that = this
            this.getPreRecords("/prodProductEntryBill/prodProductEntryBill/list",{},function(res){
              if(res!=null&&res.length>0){
                console.info(res)
                record.employeeId = res[0].employeeId

              }
              that.model = Object.assign({}, record)
            })
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
          this.requestSubTableData(this.url.prodProductEntryBillDetail.list, params, this.prodProductEntryBillDetailTable)
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
          prodProductEntryBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
      onValueChange(event) {

        const { type, row, column, value, target } = event
        console.info(event)
        if (column.key === "productId") {
          const url = '/basProduct/basProduct/queryById';
          const params = {id: row.productId};
          getAction(url, params).then(res => {
            if (res.success) {
              //设置产品编码和产品类别
              target.setValues([{
                rowKey: row.id, values: {productCode: res.result.code}},
                {rowKey: row.id, values: {productCategoryId: res.result.categoryId}}]);

              //step1.设置计量单位组
              //step1.1 清空值
              this.prodProductEntryBillDetailTable.columns[3].options=[]
              target.setValues([{rowKey: row.id, values: {productMeasureGroupId: ''}}]);
              //step1.2 赋值
              const code = 'bas_product_measure_group,name,id,product_id='+row.productId;
              const url = '/sys/dict/getDictItems/'+code;
              getAction(url, {}).then(res => {
                if (res.success) {
                  this.prodProductEntryBillDetailTable.columns[3].options=res.result;
                }
              })

            }
          });
        }
      },
      warehouseIdChange(value){
        if(value)
          this.clearJEditTableByRef("prodProductEntryBillDetail")
      },

    }
  }
</script>

<style scoped>
</style>