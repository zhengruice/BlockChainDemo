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
            <a-form-model-item label="付款时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentTime">
              <j-date placeholder="请选择付款时间" v-model="model.paymentTime" style="width: 100%" />
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
              <a-input v-model="model.supplierWallet" placeholder="请输入供应商欠款" :disabled="true" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierContracts">
              <a-input v-model="model.supplierContacts" placeholder="请输入联系人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierPhone">
              <a-input v-model="model.supplierPhone" placeholder="请输入电话" ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="8" >
            <a-form-model-item label="是否送货" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isSend">
              <j-dict-select-tag type="list" v-model="model.isSend" dictCode="yn" placeholder="请选择是否送货" />
            </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="8" >
            <a-form-model-item label="是否付款" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isPay">
              <j-dict-select-tag type="list" @change="isPayChange" v-model="model.isPay" dictCode="yn" placeholder="请选择是否付款" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="8" >
            <a-form-model-item label="付款类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentMethodId">
              <j-dict-select-tag type="list" v-model="model.paymentMethodId" dictCode="fin_payment_method,name,id" placeholder="请选择付款类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentMoney">
              <a-input-number v-model="model.paymentMoney" :disabled="true" placeholder="请输入付款金额" style="width: 100%" />
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
      <a-tab-pane tab="采购付款订单明细表" :key="refKeys[0]" :forceRender="true">
        <a-button @click="handleBatchNoSelect(purchaseMaterialPaymentBillDetailTable.table.props)" icon="plus" type="primary">选择采购订单</a-button>
        <onl-cgreport-select-modal
          ref="selectModal"
          title="选择采购订单"
          reportId="1411586114989838337"
          :width="1100"
          :params="purchaseMaterialPaymentBillDetailTable.table.params"
          :multiSelectable="true"
          :selectedRowKeys="purchaseMaterialPaymentBillDetailTable.table.selectedRowKeys"
          :selectedRows="purchaseMaterialPaymentBillDetailTable.table.selectedRows"
          @callback="(selectedRows)=>handleBatchNoSelectCallback(purchaseMaterialPaymentBillDetailTable.table.props, selectedRows)"/>


        <j-editable-table
          :ref="refKeys[0]"
          :loading="purchaseMaterialPaymentBillDetailTable.loading"
          :columns="purchaseMaterialPaymentBillDetailTable.columns"
          :dataSource="purchaseMaterialPaymentBillDetailTable.dataSource"
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
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'
  import {billCommonMixin}  from '@/views/erp/mixins/billCommonMixin'

  export default {
    name: 'PurchaseMaterialPaymentBillForm',
    mixins: [JEditableTableModelMixin, billCommonMixin],
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
            paymentMoney: 0, //vue初始化set get方法，绑定到视图
            isPayControl: true,
            isSend: 1,
            isPay: 1, //默认为付款
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 0,
        validatorRules: {
          supplierId: [
             { required: true, message: '请选择供应商!'},
          ],
          employeeId: [
             { required: true, message: '请选择采购员!'},
          ],
          isPay: [
            { validator: this.validatorIsPay},
          ],
          paymentMethodId:[
            { required: true, message: '请选择付款方式!'},
            // { validator: this.validatorPaymentMethodId},
          ],
        },
        refKeys: ['purchaseMaterialPaymentBillDetail', ],
        tableKeys:['purchaseMaterialPaymentBillDetail', ],
        activeKey: 'purchaseMaterialPaymentBillDetail',
        // 采购付款订单明细表
        purchaseMaterialPaymentBillDetailTable: {
          loading: false,
          dataSource: [],
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                  orgFields: "id,payment_money,has_payment_money,non_payment_money,current_payment_money",
                  destFields: "superBillId,paymentMoney,hasPaymentMoney,nonPaymentMoney,currentPaymentMoney",
              },
            },
          },
          columns: [
            {
              title: '采购订单',
              key: 'superBillId',
              type: FormTypes.select,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode:'purchase_material_bill,bill_no,id',
              disabled: true,
            },
            /* {
              title: '源单ID',
              key: 'sourceBillId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            }, */
            {
              title: '订单金额',
              key: 'paymentMoney',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            {
              title: '已付款金额',
              key: 'hasPaymentMoney',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            {
              title: '未付款金额',
              key: 'nonPaymentMoney',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              disabled: true,
            },
            {
              title: '本次付款金额',
              key: 'currentPaymentMoney',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/purchaseMaterialPaymentBill/purchaseMaterialPaymentBill/add",
          edit: "/purchaseMaterialPaymentBill/purchaseMaterialPaymentBill/edit",
          queryById: "/purchaseMaterialPaymentBill/purchaseMaterialPaymentBill/queryById",
          purchaseMaterialPaymentBillDetail: {
            list: '/purchaseMaterialPaymentBill/purchaseMaterialPaymentBill/queryPurchaseMaterialPaymentBillDetailByMainId'
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
        this.purchaseMaterialPaymentBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'purchase_payment_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.paymentTime = getFormatDate();
            this.model = Object.assign({}, record)
            console.log(this.model);
            //this.edit(record);
          }
        })

        let that = this
        //处理记录上一次的记录人
        this.getPreRecords("/purchaseMaterialPaymentBill/purchaseMaterialPaymentBill/list",{},function(res){
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
          this.requestSubTableData(this.url.purchaseMaterialPaymentBillDetail.list, params,
          this.purchaseMaterialPaymentBillDetailTable, this.classifySubTableData)
        }

        //更新ispay联动选择框
        if(this.model.isPay){
          this.model.isPayControl = false
        }else{
          this.model.isPayControl = true
          // this.model.paymentMethodId = ""
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
          purchaseMaterialPaymentBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

      /* 整理子表数据 */
      classifySubTableData(res){
        let { result } = res
        let dataSource = []
        let table = this.purchaseMaterialPaymentBillDetailTable.table
        //step1:获取表单配置
        let orgFields = table.props.column.orgFields.split(',');
        let destFields = table.props.column.destFields.split(',')
        if (result) {
          if (Array.isArray(result)) {
            dataSource = result
          } else if (Array.isArray(result.records)) {
            dataSource = result.records
          }
        }
       console.log('fields', orgFields, destFields)
        dataSource.forEach(function(item,index,array){
          let row = {}
          for(let i = 0; i < destFields.length; i++) {
            row[orgFields[i]] = item[destFields[i]]; //记录子表已经选择项
          }
          table.selectedRows[index] = row
          table.selectedRowKeys[index] = row[table.rowKey]; //记录子表已经选择项
        });
        this.$refs.selectModal.initTable()
        console.log('classify', table.selectedRows, table.selectedRowKeys)
      },


      /* 处理在线报表选择 */
      handleBatchNoSelect(props){
        // let row = props.getValue();
        let orgFields = props.column.orgFields.split(',');
        let destFields = props.column.destFields.split(',');
        let queryParams = {};
        /* for(let i = 0; i < orgFields.length; i++) {
          queryParams[orgFields[i]] = row[destFields[i]];
        } */
        this.$refs.form.validate((pass,obj)=>{
          if(pass){
            // this.purchaseMaterialPaymentBillDetailTable.table.params['supplier_id'] = this.model.supplierId;
            // this.$refs.selectModal.initSqlParams();
            queryParams['supplier_id'] = this.model.supplierId;
            this.$refs.selectModal.initQueryParams(queryParams);
            this.$refs.selectModal.visible = true;
          }
        });

      },
      /* 处理在线报表选择回调 */
      handleBatchNoSelectCallback(props, selectedRows){
        console.log('handleBatchNoSelectCallback',selectedRows)
        let orgFields = props.column.orgFields.split(',');
        let destFields = props.column.destFields.split(',');
        //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
        this.purchaseMaterialPaymentBillDetailTable.table.selectedRowKeys
        .splice(0,this.purchaseMaterialPaymentBillDetailTable.table.selectedRowKeys.length);//清空数组
        this.purchaseMaterialPaymentBillDetailTable.table.selectedRows
        .splice(0,this.purchaseMaterialPaymentBillDetailTable.table.selectedRows.length);//清空数组
        //setp2:将表单中子表项全部清空，重新添加报表重选项
        this.eachAllTable((table, index) => {
          table.rows.forEach(function(item, idnex, array){
              table.removeRows(item.id);
          });
          //子表单赋值
          for(let i = 0; i < selectedRows.length; i++) {
            this.purchaseMaterialPaymentBillDetailTable.table.selectedRowKeys[i] = selectedRows[i][table.rowKey]; //记录子表已经选择项
            this.purchaseMaterialPaymentBillDetailTable.table.selectedRows[i] = selectedRows[i]; //记录子表已经选择项
            let values = {};
            for(let j = 0; j < orgFields.length; j++) {
              if(!isEmpty(selectedRows[i][orgFields[j]])){
                values[destFields[j]] = selectedRows[i][orgFields[j]];
              }
            }
            console.log('values',values)
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
        if (column.key === 'currentPaymentMoney') {
          let currentPaymentMoney = Number(value);
          let nonPaymentMoney = Number(row.nonPaymentMoney);
          if (!isNaN(currentPaymentMoney) && !isNaN(nonPaymentMoney)){
            if(currentPaymentMoney > nonPaymentMoney){
              this.validateError("本次付款金额不能大于未付款金额")
              return false;
            }
          }
        }
        //表单订单金额
        if(target.statisticsColumns){
          let totalPaymentMoney = Number(target.statisticsColumns.currentPaymentMoney)
          if(!isNaN(totalPaymentMoney)){
            this.model.paymentMoney = totalPaymentMoney
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

      //是否付款选择回调
      isPayChange(value){
        console.log("this.model.paymentMethodId",this.model.paymentMethodId)
        if(value>0){
          this.model.isPayControl = false
        }else{
          this.model.isPayControl = true
          this.model.paymentMethodId = ""
        }

      },
      //验证收款方式
      validatorPaymentMethodId(rule, value, callback){
        let isPayControl = this.model.isPayControl
        if(!isPayControl && isNaN(value)){
          callback("请选择收款方式！")
        }else{
          callback()
        }

      },
      //验证付款金额
      validatorPaymentMoney(rule, value, callback){
        let isPayControl = this.model.isPayControl
        if(!isPayControl && isNaN(value)){
          callback("请填写付款金额！")
        }
        else{
          callback()
        }
      },
      //验证是否付款
      validatorIsPay(rule, value, callback) {
        console.info(value)
        if(!value){
          callback()
        }else{
          if(value>0)
            this.model.isPayControl = false
          else{
            this.model.isPayControl = true
            this.model.paymentMethodId = ""
          }
        }
        callback()
      },

    }
  }
</script>

<style scoped>
</style>