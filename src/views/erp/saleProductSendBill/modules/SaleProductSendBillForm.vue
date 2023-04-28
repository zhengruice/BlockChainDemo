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
            <a-form-model-item label="发货日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendTime">
              <j-date placeholder="请选择发货日期" v-model="model.sendTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customerId">
              <j-search-select-tag v-model="model.customerId" dict="bas_customer,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-search-select-tag v-model="model.warehouseId" dict="bas_warehouse,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="业务员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salesmanId">
              <j-search-select-tag v-model="model.salesmanId" dict="sys_salesman,name,id"  />
            </a-form-model-item>
          </a-col>

          <a-col :span="12" >
            <a-form-model-item label="运输方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="transportWayId">
              <j-search-select-tag v-model="model.transportWayId" dict="bas_transport_way,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="运输单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="transportUnitId">
              <j-search-select-tag v-model="model.transportUnitId" dict="bas_transport_unit,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="运输单据" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="transportBillUrl">
              <j-image-upload isMultiple  v-model="model.transportBillUrl" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="运输费用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="transportCost">
              <a-input-number v-model="model.transportCost" placeholder="请输入运输费用" style="width: 100%" />
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
      <a-tab-pane tab="产品销售发货订单明细" :key="refKeys[0]" :forceRender="true">
        <a-button @click="handleBatchNoSelect(saleProductSendBillDetailTable.props)" :disabled="formDisabled" icon="search" type="primary">选择</a-button>
        <main-sub-table-select-modal
          ref="selectModal"
          :fullscreen="true"
          :tables="saleProductSendBillDetailTable.tables"
          @callback="handleBatchNoSelectCallback"/>
        <j-editable-table
          :ref="refKeys[0]"
          :loading="saleProductSendBillDetailTable.loading"
          :columns="saleProductSendBillDetailTable.columns"
          :dataSource="saleProductSendBillDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          @valueChange="onValueChange"
          :rowSelection="true"
          :actionButton="false"/>
      </a-tab-pane>
    </a-tabs>

<!--    <basCustomer-modal ref="basCustomerModal" @ok="basCustomerModalFormOk"></basCustomer-modal>-->
  </a-spin>
</template>

<script>

  import { httpAction, getAction, putAction} from '@/api/manage'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'
  import { getFormatDate } from '../../utils/util'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import BasCustomerModal from '../../basCustomer/modules/BasCustomerModal'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import {billCommonMixin}  from '@/views/erp/mixins/billCommonMixin'
  import MainSubTableSelectModal from '../../components/MainSubTableSelectModal'

  export default {
    name: 'SaleProductSendBillForm',
    mixins: [JEditableTableModelMixin,billCommonMixin],
    components: {
      OnlCgreportSelectModal,
      //BasCustomerModal,
      JDictSelectTag,
      MainSubTableSelectModal
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
              { required: true, message: '请选择客户!'},
           ],
          warehouseId: [
            { required: true, message: '请选择仓库!'},
          ],
          salesmanId: [
            { required: true, message: '请选择业务员!'},
          ],
           sendTime: [
              { required: true, message: '请输入发货日期!'},
           ],
           transportWayId: [
              { required: true, message: '请选择运输方式!'},
           ],
           transportUnitId: [
              { required: true, message: '请选择运输单位!'},
           ],
           // transportBillUrl: [
           //    { required: true, message: '请上传运输单据!'},
           // ],
           transportCost: [
              { required: true, message: '请输入运输费用!'},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
           ],
        },
        refKeys: ['saleProductSendBillDetail', ],
        tableKeys:['saleProductSendBillDetail', ],
        activeKey: 'saleProductSendBillDetail',
        // 产品销售发货订单明细表
        saleProductSendBillDetailTable: {
          loading: false,
          dataSource: [],
          tables: {
            table1: {
              rowKey: 'id',
              multiSelectable: true,//是否多选
              selectedRowKeys: [],//主表已经选择项
              selectedRows: [],//主表已经选择项
              props: {//主表属性
                column: {
                  orgFields: "id,billNo",
                  destFields: "superBillId,superBillNo",
                },
              },
              columns: [
                {
                  title:'销售单号',
                  align:"center",
                  dataIndex: 'billNo'
                },
                {
                  title:'销售日期',
                  align:"center",
                  dataIndex: 'saleTime',
                  customRender:function (text) {
                    return !text?"":(text.length>10?text.substr(0,10):text)
                  }
                },
                {
                  title:'业务员',
                  align:"center",
                  dataIndex: 'salesmanId_dictText'
                },
                {
                  title:'客户',
                  align:"center",
                  dataIndex: 'customerId_dictText'
                },
                {
                  title:'客户未付款金额',
                  align:"center",
                  dataIndex: 'customerWallet'
                },
                {
                  title:'收款金额',
                  align:"center",
                  dataIndex: 'receiveMoney'
                },
                {
                  title:'收款方式',
                  align:"center",
                  dataIndex: 'paymentMethodId_dictText'
                },
                {
                  title:'是否付款',
                  align:"center",
                  dataIndex: 'isPay_dictText'
                },
                {
                  title:'是否送货',
                  align:"center",
                  dataIndex: 'isSend_dictText'
                },
                {
                  title:'是否启用',
                  align:"center",
                  dataIndex: 'isEnabled_dictText'
                },
              ],
              queryParams: {

              },
              queryConfigs: [
                {
                  key: 'billNo',
                  label: '订单编号',
                },
                {
                  key: 'customerId',
                  label: '客户',
                  dictCode: 'bas_supplier,name,id',
                },
                {
                  key: 'warehouseId',
                  label: '仓库',
                  dictCode: 'bas_warehouse,name,id',
                },
              ],
              url: {
                list: '/saleProductBill/saleProductBill/list'
              },

            },
            table2: {
              rowKey: 'id',
              sourceTableId: 'sourceBillId', //子表中主表ID
              queryTableId: 'id', //子表查询ID
              ipagination: false, //子表关闭分页
              multiSelectable: true,//是否多选
              selectedRowKeys: [],//子表已经选择项
              selectedRows: [],//子表已经选择项
              props: {//子表属性
                column: {
                  orgFields: "id,productCode,productId,productCategoryId,productMeasureGroupId,productPrice,saleNum,saleMoney,nonSendNum,saleNum,saleMoney",
                  destFields: "superBillDetailId,productCode,productId,productCategoryId,productMeasureGroupId,productPrice,saleNum,saleMoney,sendNum,sendMoney",
                },
              },
              columns: [
                {
                  title: '产品编号',
                  align: 'center',
                  dataIndex: 'productCode'
                },
                {
                  title: '产品名称',
                  align: 'center',
                  dataIndex: 'productId',
                  dictCode:"bas_product,name,id",
                },
                {
                  title: '产品类别',
                  align: 'center',
                  dataIndex: 'productCategoryId',
                  dictCode:"bas_product_category_id,name,id",
                },
                {
                  title: '产品计量组',
                  align: 'center',
                  dataIndex: 'productMeasureGroupId',
                  dictCode:"bas_product_measure_group,name,id",
                },
                {
                  title: '产品编号',
                  align: 'center',
                  dataIndex: 'productPrice'
                },
                {
                  title: '订单数量',
                  align: 'center',
                  dataIndex: 'saleNum'
                },
                {
                  title: '订单金额',
                  align: 'center',
                  dataIndex: 'saleMoney'
                },
                {
                  title: '未发货数量',
                  align: 'center',
                  dataIndex: 'nonSendNum'
                },

              ],
              //此url不支持查询
              /* queryConfigs: [
                {
                  key: 'materialCode',
                  label: '材料编号',
                },
              ], */
              url: {
                list: '/saleProductBill/saleProductBill/querySaleProductBillDetailByMainId'
              },

            },

          },
          columns: [
            {
              title: '销售订单号ID',
              key: 'superBillId',
              type: FormTypes.hidden,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '销售详情订单号ID',
              key: 'superBillDetailId',
              type: FormTypes.hidden,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '销售订单号',
              key: 'superBillNo',
              type: FormTypes.input,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            // {
            //   title: '产品编号',
            //   key: 'productCode',
            //   type: FormTypes.input,
            //   disabled:true,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
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
            // {
            //   title: '产品类别',
            //   key: 'productCategoryId',
            //   type: FormTypes.sel_search,
            //   dictCode:"bas_product_category,name,id",
            //   disabled:true,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            // },
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
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '订单数量',
              key: 'saleNum',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '订单金额',
              key: 'saleMoney',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '未发货数量',
              key: 'nonSendNum',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '发货数量',
              key: 'sendNum',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '发货金额',
              key: 'sendMoney',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/saleProductSendBill/saleProductSendBill/add",
          edit: "/saleProductSendBill/saleProductSendBill/edit",
          queryById: "/saleProductSendBill/saleProductSendBill/queryById",
          saleProductSendBillDetail: {
            list: '/saleProductSendBill/saleProductSendBill/querySaleProductSendBillDetailByMainId'
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
        this.saleProductSendBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'sale_send_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.sendTime = getFormatDate();
            let that = this
            //处理记录上一次的记录人
            this.getPreRecords("/saleProductSendBill/saleProductSendBill/list",{},function(res){
              if(res!=null&&res.length>0){
                console.info(res)
                record.salesmanId = res[0].salesmanId

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
          this.requestSubTableData(this.url.saleProductSendBillDetail.list, params,
            this.saleProductSendBillDetailTable, this.classifySubTableData)
         // this.requestSubTableData(this.url.saleProductSendBillDetail.list, params, this.saleProductSendBillDetailTable)
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
          saleProductSendBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
      /* 处理在线报表选择 */
      handleBatchNoSelect(props){
        // let row = props.getValue();
        // let orgFields = props.column.orgFields.split(',');
        // let destFields = props.column.destFields.split(',');
        let queryParams = {};
        /* for(let i = 0; i < orgFields.length; i++) {
          queryParams[orgFields[i]] = row[destFields[i]];
        } */
        this.$refs.form.validate((pass,obj)=>{
          if(pass){
            queryParams['customerId'] = this.model.customerId;
            queryParams['warehouseId'] = this.model.warehouseId;
            // this.purchaseMaterialReceiveBillDetailTable.tables.table1.queryParams = queryParams;
            this.$refs.selectModal.initQueryParams1(queryParams);
            this.$refs.selectModal.visible = true;
            console.log('initQueryParams1')
          }
        });

      },
      /* 处理在线报表选择回调 */
      handleBatchNoSelectCallback(selectedRowKeys1,selectedRows1,selectedRowKeys2,selectedRows2){

        console.log("handleBatchNoSelectCallback",selectedRowKeys1,selectedRows1,selectedRowKeys2,selectedRows2)
        let table1 = this.saleProductSendBillDetailTable.tables.table1
        let table2 = this.saleProductSendBillDetailTable.tables.table2
        //step1:获取表单配置
        let orgFields1 = table1.props.column.orgFields.split(',');
        let destFields1 = table1.props.column.destFields.split(',')
        let orgFields2 = table2.props.column.orgFields.split(',');
        let destFields2 = table2.props.column.destFields.split(',')
        //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
        table1.selectedRowKeys.splice(0,table1.selectedRowKeys.length);//清空数组
        table1.selectedRows.splice(0,table1.selectedRows.length);//清空数组

        table2.selectedRowKeys.splice(0,table2.selectedRowKeys.length);//清空数组
        table2.selectedRows.splice(0,table2.selectedRows.length);//清空数组
        //setp2:将表单中子表项全部清空，重新添加报表重选项
        this.eachAllTable((table, index) => {
          table.rows.forEach(function(item, idnex, array){
            table.removeRows(item.id);
          });
          let mainValues = {};
          //加载主表数据，将主表数据包装成map
          console.log(orgFields1,destFields1,selectedRows1)
          for(let i = 0; i < selectedRows1.length; i++) {
            table1.selectedRowKeys[i] = selectedRows1[i][table1.rowKey]; //记录子表已经选择项
            table1.selectedRows[i] = selectedRows1[i]; //记录子表已经选择项
            let values = {};
            for(let j = 0; j < orgFields1.length; j++) {
              values[destFields1[j]] = selectedRows1[i][orgFields1[j]];
            }
            let key = selectedRows1[i][table1.rowKey]
            mainValues[key] = values
          }
          console.log('mainValues',mainValues)
          //加载子表数据
          console.log(orgFields2,destFields2,selectedRows2)
          for(let i = 0; i < selectedRows2.length; i++) {
            table2.selectedRowKeys[i] = selectedRows2[i][table2.rowKey]; //记录子表已经选择项
            table2.selectedRows[i] = selectedRows2[i]; //记录子表已经选择项
            let values = {};
            for(let j = 0; j < orgFields2.length; j++) {
              values[destFields2[j]] = selectedRows2[i][orgFields2[j]];
            }
            let key = selectedRows2[i][table2.sourceTableId]
            console.log('key',key,'mainValues[key]',mainValues[key])
            values = Object.assign({}, values, mainValues[key])
            table.add();
            let rowId = table.rows[table.rows.length - 1].id;
            table.setValues([{rowKey: rowId, values: values}]);
          }
          //子表单赋值end
        })

      },

      /* JEditableTable检测单元格变化 */
      onValueChange(event) {
        const { type, row, column, value, target } = event
        // console.info(event);
        // if (column.key === 'nonSendNum') {
        //
        //   let nonSendNum = Number(value);
        //   let productPrice = Number(row.productPrice);
        //
        //   target.setValues([{rowKey: row.id, values: {sendNum:  nonSendNum}}]);
        //   target.setValues([{rowKey: row.id, values: {sendMoney:  nonSendNum * productPrice}}]);
        //
        // }
        if (column.key === 'sendNum') {

          let sendNum = Number(value);
          let saleNum  =Number(row.saleNum)
          let productPrice = Number(row.productPrice);
          let nonSendNum = Number(row.nonSendNum)
          if (!isNaN(saleNum) && !isNaN(nonSendNum)){
            if(sendNum > nonSendNum){
              this.validateError("本次发货数量不能大于未发货数量")
              target.setValues([{rowKey: row.id, values: {sendNum:  0}}]);
              target.setValues([{rowKey: row.id, values: {sendMoney: 0}}]);

              return false;
            }

            target.setValues([{rowKey: row.id, values: {sendMoney:  sendNum * productPrice}}]);
          }

        }
      },
    }
  }
</script>

<style scoped>
</style>