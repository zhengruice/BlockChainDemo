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
            <a-form-model-item label="采购日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="purchaseTime">
              <j-date placeholder="请选择采购日期" v-model="model.purchaseTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="采购员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="employeeId">
              <j-dict-select-tag type="list" v-model="model.employeeId" dictCode="sys_employee,name,id" placeholder="请选择采购员" />
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
            <a-form-model-item label="是否送货" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isSend">
              <j-dict-select-tag type="list" v-model="model.isSend" dictCode="yn" placeholder="请选择是否送货" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="是否付款" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isPay">
              <j-dict-select-tag type="list"  @change="isPayChange"  v-model="model.isPay" dictCode="yn" placeholder="请选择是否付款" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentMethodId">
              <j-dict-select-tag type="list" :disabled="model.isPayControl" v-model="model.paymentMethodId" dictCode="fin_payment_method,name,id" placeholder="请选择付款方式" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="付款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hasPaymentMoney">
              <a-input-number v-model="model.hasPaymentMoney" :disabled="model.isPayControl"  placeholder="请输入付款金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="订单金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentMoney">
              <a-input-number v-model="model.paymentMoney" :disabled="true"  placeholder="请输入订单金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="未付款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nonPaymentMoney">
              <a-input-number v-model="nonPaymentMoney" :disabled="true"  placeholder="请输入未付款金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" >
            <a-form-model-item label="供应商欠款" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierWallet">
              <a-input-number v-model="model.supplierWallet" :disabled="true" placeholder="请输入供应商欠款" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="16">
            <a-form-model-item label="摘要" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="summary">
              <a-textarea v-model="model.summary" rows="1" placeholder="请输入摘要" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="采购订单明细表" :key="refKeys[0]" :forceRender="true">
        <a-button @click="handleBatchNoSelect(purchaseMaterialBillDetailTable.table.props)" icon="plus" type="primary">选择</a-button>
        <onl-cgreport-select-modal
          ref="selectModal"
          title="选择供应商材料"
          reportId="1410053843480694786"
          :width="1100"
          :params="purchaseMaterialBillDetailTable.table.params"
          :multiSelectable="true"
          :selectedRowKeys="purchaseMaterialBillDetailTable.table.selectedRowKeys"
          :selectedRows="purchaseMaterialBillDetailTable.table.selectedRows"
          @callback="(selectedRows)=>handleBatchNoSelectCallback(purchaseMaterialBillDetailTable.table.props, selectedRows)"/>

        <j-editable-table
          :ref="refKeys[0]"
          :loading="purchaseMaterialBillDetailTable.loading"
          :columns="purchaseMaterialBillDetailTable.columns"
          :dataSource="purchaseMaterialBillDetailTable.dataSource"
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
  import { getFormatDate} from '../../utils/util'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'
  import {billCommonMixin}  from '@/views/erp/mixins/billCommonMixin'

  export default {
    name: 'PurchaseMaterialBillForm',
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
            isSend:1,
            isPay:0,
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
            { validator: this.validatorPaymentMethodId},
          ],
          hasPaymentMoney: [
            // { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
            { pattern: /^(-?\+?(0|([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/, message: '请输入正确的金额!'},
            { validator: this.validatorPaymentMoney},
          ],
        },
        refKeys: ['purchaseMaterialBillDetail', ],
        tableKeys:['purchaseMaterialBillDetail', ],
        activeKey: 'purchaseMaterialBillDetail',
        // 采购订单明细表
        purchaseMaterialBillDetailTable: {
          loading: false,
          dataSource: [],
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                  orgFields: "id,category_id,code,unit,model,price,purchase_num,purchase_money",
                  destFields: "materialId,materialCategoryId,materialCode,materialUnit,materialModel,materialPrice,purchaseNum,purchaseMoney",
              },
            },
          },
          columns: [
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
              dictCode: 'bas_material,name,id',
              disabled: true,
            },
            {
              title: '材料类别',
              key: 'materialCategoryId',
              type: FormTypes.hidden,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode: 'bas_material_category,name,id',
              disabled: true,
            },
            {
              title: '材料编号',
              key: 'materialCode',
              type: FormTypes.input,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '计量单位',
              key: 'materialUnit',
              type: FormTypes.input,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '规格型号',
              key: 'materialModel',
              type: FormTypes.input,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '材料单价',
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
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '订单金额',
              key: 'purchaseMoney',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            /* {
              title: '未付款金额',
              key: 'nonPaymentMoney',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '未退款金额',
              key: 'nonRefundMoney',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '未收货数量',
              key: 'nonReceiveNum',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '未退货数量',
              key: 'nonReturnNum',
              type: FormTypes.inputNumber,
              width:"150px",
              placeholder: '请输入${title}',
              defaultValue:'',
            }, */
          ]
        },
        url: {
          add: "/purchaseMaterialBill/purchaseMaterialBill/add",
          edit: "/purchaseMaterialBill/purchaseMaterialBill/edit",
          queryById: "/purchaseMaterialBill/purchaseMaterialBill/queryById",
          purchaseMaterialBillDetail: {
            list: '/purchaseMaterialBill/purchaseMaterialBill/queryPurchaseMaterialBillDetailByMainId'
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
      nonPaymentMoney() {
        let paymentMoney = Number(this.model.paymentMoney)
        let hasPaymentMoney = Number(this.model.hasPaymentMoney)
        hasPaymentMoney = isNaN(hasPaymentMoney) ? 0 : hasPaymentMoney
        if(!isNaN(paymentMoney) && !isNaN(hasPaymentMoney)){
          this.model.nonPaymentMoney = (paymentMoney - hasPaymentMoney)
          return (paymentMoney - hasPaymentMoney)
        }
        return ""
      },
    },
    created () {
    },
    methods: {

      addBefore(){
        this.purchaseMaterialBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'purchase_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.purchaseTime = getFormatDate();
            this.model = Object.assign({}, record)
            console.log(this.model);
            //this.edit(record);
          }
        })

        let that = this
        //处理记录上一次的记录人
        this.getPreRecords("/purchaseMaterialBill/purchaseMaterialBill/list",{},function(res){
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
        console.log("editAfter",this.model)
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.purchaseMaterialBillDetail.list, params,
          this.purchaseMaterialBillDetailTable, this.classifySubTableData)
        }
        //更新ispay联动选择框
        if(this.model.isPay){
          this.model.isPayControl = false
        }else{
          this.model.isPayControl = true
          this.model.paymentMethodId = ""
          this.model.hasPaymentMoney = ""
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
          purchaseMaterialBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

      /* 整理子表数据 */
      classifySubTableData(res){
        let { result } = res
        let dataSource = []
        let table = this.purchaseMaterialBillDetailTable.table
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
            this.purchaseMaterialBillDetailTable.table.params['supplier_id'] = this.model.supplierId;
            this.$refs.selectModal.initSqlParams();
            // queryParams['supplier_id'] = this.model.supplierId;
            // this.$refs.selectModal.initQueryParams(queryParams);
            this.$refs.selectModal.visible = true;
          }
        });

      },
      /* 处理在线报表选择回调 */
      handleBatchNoSelectCallback(props, selectedRows){
        let orgFields = props.column.orgFields.split(',');
        let destFields = props.column.destFields.split(',');
        //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
        this.purchaseMaterialBillDetailTable.table.selectedRowKeys
        .splice(0,this.purchaseMaterialBillDetailTable.table.selectedRowKeys.length);//清空数组
        this.purchaseMaterialBillDetailTable.table.selectedRows
        .splice(0,this.purchaseMaterialBillDetailTable.table.selectedRows.length);//清空数组
        //setp2:将表单中子表项全部清空，重新添加报表重选项
        this.eachAllTable((table, index) => {
          table.rows.forEach(function(item, idnex, array){
              table.removeRows(item.id);
          });
          //子表单赋值
          for(let i = 0; i < selectedRows.length; i++) {
            this.purchaseMaterialBillDetailTable.table.selectedRowKeys[i] = selectedRows[i][table.rowKey]; //记录子表已经选择项
            this.purchaseMaterialBillDetailTable.table.selectedRows[i] = selectedRows[i]; //记录子表已经选择项
            let values = {};
            for(let j = 0; j < orgFields.length; j++) {
              if(!isEmpty(selectedRows[i][orgFields[j]])){
                values[destFields[j]] = selectedRows[i][orgFields[j]];
              }
            }
            table.add();
            let rowId = table.rows[table.rows.length - 1].id;
            table.setValues([{rowKey: rowId, values: values}]);
          }
          //子表单赋值end
        })

      },
      /* JEditableTable检测单元格变化 */
      onValueChange(event) {
        // console.log("event",event.target.statisticsColumns)

        const { type, row, column, value, target } = event
        //checkNum 实存数量 --> profitAndLoss 盈亏数量
        if (column.key === 'purchaseNum') {
          let purchaseNum = Number(value);
          let materialPrice = Number(row.materialPrice);
          if (!isNaN(purchaseNum) && !isNaN(materialPrice)){
            target.setValues([{rowKey: row.id, values: {purchaseMoney:  purchaseNum * materialPrice}}]);
          }
        }

        //表单订单金额
        if(target.statisticsColumns.purchaseMoney){
          let totalPurchaseMoney = Number(target.statisticsColumns.purchaseMoney)
          if(!isNaN(totalPurchaseMoney)){
            this.model.paymentMoney = totalPurchaseMoney
            // this.$set(this.model,'paymentMoney',totalPurchaseMoney) //vue官方建议方法添加新属性到已经加载的对象当中
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
          // this.model.hasPaymentMoney = 0
        }else{
          this.model.isPayControl = true
          this.model.paymentMethodId = ""
          // this.model.hasPaymentMoney = ""
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
            // this.model.hasPaymentMoney = ""
          }
        }
        callback()
      },


    }
  }
</script>

<style scoped>
</style>