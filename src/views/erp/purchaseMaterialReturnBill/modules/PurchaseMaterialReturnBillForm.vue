<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8" >
            <a-form-model-item label="订单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入订单号" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="退货日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="returnTime">
              <j-date placeholder="请选择退货日期" v-model="model.returnTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="操作员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="employeeId">
              <j-dict-select-tag type="list" v-model="model.employeeId" dictCode="sys_employee,name,id" placeholder="请选择操作员" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierId">
              <a-col :span="16" >
                <j-dict-select-tag @change="supplierDetail" :disabled="true" type="list" v-model="model.supplierId" dictCode="bas_supplier,name,id" placeholder="请选择供应商" />
              </a-col>
              <a-col :span="8" >
                <j-popup
                  :trigger-change="true"
                  code="report_supplier"
                  orgFields="id,name,wallet,contacts,phone"
                  destFields="supplierId,supplierName,supplierWallet,supplierContacts,supplierPhone"
                  @callback="popupCallback"/>
              </a-col>
            </a-form-model-item>

          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商欠款" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierWallet">
              <a-input-number v-model="model.supplierWallet" :disabled="true" placeholder="请输入供应商欠款" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierContacts">
              <a-input v-model="model.supplierContacts" placeholder="请输入联系人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierPhone">
              <a-input v-model="model.supplierPhone" placeholder="请输入电话" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="退货仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-tree-select
                ref="treeSelect"
                placeholder="请选择退货仓库"
                v-model="model.warehouseId"
                dict="bas_warehouse,name,id"
                pidValue="0"
                >
              </j-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="摘要" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="summary">
              <a-textarea v-model="model.summary" rows="1" placeholder="请输入摘要" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="采购退货订单明细表" :key="refKeys[0]" :forceRender="true">
        <a-button @click="handleBatchNoSelect(purchaseMaterialReturnBillDetailTable.props)" icon="plus" type="primary">选择采购订单</a-button>
        <main-sub-table-select-modal 
          ref="selectModal"
          title="选择采购收货单"
          :tables="purchaseMaterialReturnBillDetailTable.tables"
          @callback="handleBatchNoSelectCallback"/>

        <j-editable-table
          :ref="refKeys[0]"
          :loading="purchaseMaterialReturnBillDetailTable.loading"
          :columns="purchaseMaterialReturnBillDetailTable.columns"
          :dataSource="purchaseMaterialReturnBillDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="false"
          @valueChange="onValueChange"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction ,putAction} from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue ,isEmpty} from '@/utils/util'
  import { getFormatDate } from '../../utils/util'
  import MainSubTableSelectModal from '../../components/MainSubTableSelectModal'
  import {billCommonMixin}  from '@/views/erp/mixins/billCommonMixin'

  export default {
    name: 'PurchaseMaterialReturnBillForm',
    mixins: [JEditableTableModelMixin, billCommonMixin],
    components: {
      MainSubTableSelectModal,
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
          supplierId: [
             { required: true, message: '请选择供应商!'},
          ],
          warehouseId: [
             { required: true, message: '请选择退货仓库!'},
          ],
          employeeId: [
             { required: true, message: '请选择操作员!'},
          ],
        },
        refKeys: ['purchaseMaterialReturnBillDetail', ],
        tableKeys:['purchaseMaterialReturnBillDetail', ],
        activeKey: 'purchaseMaterialReturnBillDetail',
        // 采购退货订单明细表
        purchaseMaterialReturnBillDetailTable: {
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
                    orgFields: "id",
                    destFields: "superBillId",
                },
              },
              columns: [
                {
                  title: '订单编号',
                  align: 'center',
                  dataIndex: 'billNo'
                },
                {
                  title: '采购日期',
                  align: 'center',
                  dataIndex: 'purchaseTime'
                },
                {
                  title: '供应商',
                  align: 'center',
                  dataIndex: 'supplierId_dictText',
                },
                {
                  title: '订单金额',
                  align: 'center',
                  dataIndex: 'paymentMoney'
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
                  key: 'supplierId',
                  label: '供应商',
                  dictCode: 'bas_supplier,name,id',
                },
              ],
              url: {
                list: '/purchaseMaterialBill/purchaseMaterialBill/list'
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
                    orgFields: "id,materialId,materialCode,materialUnit,materialModel,materialPrice,purchaseNum,purchaseMoney,nonReturnNum,currentReturnNum,currentReturnMoney",
                    destFields: "superBillDetailId,materialId,materialCode,materialUnit,materialModel,materialPrice,purchaseNum,purchaseMoney,nonReturnNum,currentReturnNum,currentReturnMoney",
                },
              },
              columns: [
                {
                  title: '材料编号',
                  align: 'center',
                  dataIndex: 'materialCode'
                },
                {
                  title: '计量单位',
                  align: 'center',
                  dataIndex: 'materialUnit'
                },
                {
                  title: '规格型号',
                  align: 'center',
                  dataIndex: 'materialModel'
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
                list: '/purchaseMaterialBill/purchaseMaterialBill/queryPurchaseMaterialBillDetailByMainId'
              },

            },

          },

          columns: [
            {
              title: '采购订单',
              key: 'superBillId',
              type: FormTypes.select,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode:'purchase_material_bill,bill_no,id',
              disabled: true,
            },
            {
              title: '采购订单明细',
              key: 'superBillDetailId',
              type: FormTypes.hidden,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
              //dictCode:'purchase_material_bill_detail,source_bill_id,id',
            },
            /* {
              title: '源单ID',
              key: 'sourceBillId',
              type: FormTypes.input,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
            }, */
            {
              title: '材料',
              key: 'materialId',
              type: FormTypes.select,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode:'bas_material,name,id',
              disabled: true,
            },
            {
              title: '材料编码',
              key: 'materialCode',
              type: FormTypes.hidden,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '计量单位',
              key: 'materialUnit',
              type: FormTypes.hidden,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '规格型号',
              key: 'materialModel',
              type: FormTypes.hidden,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '单价',
              key: 'materialPrice',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            {
              title: '采购数量',
              key: 'purchaseNum',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            {
              title: '采购金额',
              key: 'purchaseMoney',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            {
              title: '未退货数量',
              key: 'nonReturnNum',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            /* {
              title: '未退货金额',
              key: 'nonReturnMoney',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            }, */
            {
              title: '退货数量',
              key: 'currentReturnNum',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '退货金额',
              key: 'currentReturnMoney',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/purchaseMaterialReturnBill/purchaseMaterialReturnBill/add",
          edit: "/purchaseMaterialReturnBill/purchaseMaterialReturnBill/edit",
          queryById: "/purchaseMaterialReturnBill/purchaseMaterialReturnBill/queryById",
          purchaseMaterialReturnBillDetail: {
            list: '/purchaseMaterialReturnBill/purchaseMaterialReturnBill/queryPurchaseMaterialReturnBillDetailByMainId'
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
        this.purchaseMaterialReturnBillDetailTable.dataSource=[]
      },

      addAfter (record) {
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'purchase_return_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.returnTime = getFormatDate();
            this.model = Object.assign({}, record)
            console.log(this.model);
            //this.edit(record);
          }
        })

        let that = this
        //处理记录上一次的记录人
        this.getPreRecords("/purchaseMaterialReturnBill/purchaseMaterialReturnBill/list",{},function(res){
          if(res){
            record.employeeId = res[0].employeeId
            that.model = Object.assign({}, record)
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
          this.requestSubTableData(this.url.purchaseMaterialReturnBillDetail.list, params,
          this.purchaseMaterialReturnBillDetailTable, this.classifySubTableData)
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
          purchaseMaterialReturnBillDetailList: allValues.tablesValue[0].values,
        }
      },

      validateError(msg){
        this.$message.error(msg)
      },

      /* 整理子表数据 */
      classifySubTableData(res){
        let { result } = res
        let dataSource = []
        let table1 = this.purchaseMaterialReturnBillDetailTable.tables.table1
        let table2 = this.purchaseMaterialReturnBillDetailTable.tables.table2
        //step1:获取表单配置
        let orgFields1 = table1.props.column.orgFields.split(',');
        let destFields1 = table1.props.column.destFields.split(',')
        let orgFields2 = table2.props.column.orgFields.split(',');
        let destFields2 = table2.props.column.destFields.split(',')
        if (result) {
          if (Array.isArray(result)) {
            dataSource = result
          } else if (Array.isArray(result.records)) {
            dataSource = result.records
          }
        }
       console.log('fields', orgFields1, destFields1, orgFields2, destFields2)
        dataSource.forEach(function(item,index,array){
          let row1 = {}
          for(let i = 0; i < destFields1.length; i++) {
            row1[orgFields1[i]] = item[destFields1[i]]; //记录子表已经选择项
          }
          table1.selectedRows[index] = row1
          table1.selectedRowKeys[index] = row1[table1.rowKey]; //记录子表已经选择项 TODO可能存在多个superBillId
          let row2 = {}
          for(let i = 0; i < destFields2.length; i++) {
            row2[orgFields2[i]] = item[destFields2[i]]; //记录子表已经选择项
          }
          row2[table2.sourceTableId] = row1[table1.rowKey]//row2['sourceBillId'] = row1['id']
          table2.selectedRows[index] = row2
          table2.selectedRowKeys[index] = row2[table2.rowKey]; //记录子表已经选择项
        });
        this.$refs.selectModal.initTable()
        console.log('classify', table1.selectedRows, table1.selectedRowKeys, table2.selectedRows, table2.selectedRowKeys )
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
            queryParams['supplierId'] = this.model.supplierId;
            // this.purchaseMaterialReturnBillDetailTable.tables.table1.queryParams = queryParams;
            this.$refs.selectModal.initQueryParams1(queryParams);
            this.$refs.selectModal.visible = true;
            console.log('initQueryParams1')
          }
        });

      },

      /* 处理在线报表选择回调 */
      handleBatchNoSelectCallback(selectedRowKeys1,selectedRows1,selectedRowKeys2,selectedRows2){

        console.log("handleBatchNoSelectCallback",selectedRowKeys1,selectedRows1,selectedRowKeys2,selectedRows2)
        let table1 = this.purchaseMaterialReturnBillDetailTable.tables.table1
        let table2 = this.purchaseMaterialReturnBillDetailTable.tables.table2
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
              if(!isEmpty(selectedRows1[i][orgFields1[j]])){
                values[destFields1[j]] = selectedRows1[i][orgFields1[j]];
              }
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
              if(!isEmpty(selectedRows2[i][orgFields2[j]])){
                values[destFields2[j]] = selectedRows2[i][orgFields2[j]];
              }
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
        //checkNum 实存数量 --> profitAndLoss 盈亏数量
        if (column.key === 'currentReturnNum') {
          let currentReturnNum = Number(value);
          let materialPrice = Number(row.materialPrice);
          let nonReturnNum = Number(row.nonReturnNum)
          if (!isNaN(currentReturnNum) && !isNaN(nonReturnNum)){
            if(currentReturnNum > nonReturnNum){
              this.validateError("本次退货数量不能大于未退货数量")
              return false;
            }
          }
          if (!isNaN(currentReturnNum) && !isNaN(materialPrice)){
            target.setValues([{rowKey: row.id, values: {currentReturnMoney:  currentReturnNum * materialPrice}}]);
          }
          if (!isNaN(nonReturnNum) && !isNaN(materialPrice)){
            target.setValues([{rowKey: row.id, values: {nonReturnMoney:  nonReturnNum * materialPrice}}]);
          }

        }
      },


      //加载供应商基本信息，也可以用popup实现
      supplierDetail() {
       console.log("supplierDetail");
      },
      //popup回传
      popupCallback(row){
          console.log(row,this.model);
          this.model = Object.assign({},this.model, row)

          console.log(this.model);
      },


    }
  }
</script>

<style scoped>
</style>