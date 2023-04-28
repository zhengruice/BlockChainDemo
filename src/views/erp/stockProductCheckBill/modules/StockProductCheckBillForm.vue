<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="账单编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入账单编号" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="盘点日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkTime">
              <j-date placeholder="请选择盘点日期" v-model="model.checkTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="盘点人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="employeeId">
              <j-dict-select-tag type="list" v-model="model.employeeId" dictCode="sys_employee,name,id" placeholder="请选择盘点人" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol2" :wrapperCol="wrapperCol2" prop="remark">
              <a-textarea v-model="model.remark" rows="1" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider orientation="left" style="font-size: 14px; color: #bfbfbf;">盘点范围</a-divider>
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="盘点仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-tree-select
                ref="treeSelect"
                placeholder="请选择仓库"
                v-model="model.warehouseId"
                dict="bas_warehouse,name,id"
                condition='{"is_enabled":"1"}'
                pidValue="0"
                >
              </j-tree-select>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="12" >
            <a-form-model-item label="产品类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productCategoryId">
              <j-tree-select
                ref="treeSelect"
                placeholder="请选择产品类别"
                v-model="model.productCategoryId"
                dict="bas_product_category,name,id"
                condition='{"is_enabled":"1"}'
                pidValue="0"
                >
              </j-tree-select>
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="产品库存盘点明细" :key="refKeys[0]" :forceRender="true">
        <a-button @click="handleBatchNoSelect(stockProductCheckBillDetailTable.table.props)" icon="plus" type="primary">选择</a-button>
        <onl-cgreport-select-modal
          ref="selectModal"
          title="选择产品库存"
          reportId="1408406865902465026"
          :width="1100"
          :multiSelectable="true"
          :selectedRowKeys="stockProductCheckBillDetailTable.table.selectedRowKeys"
          :selectedRows="stockProductCheckBillDetailTable.table.selectedRows"
          @callback="(selectedRows)=>handleBatchNoSelectCallback(stockProductCheckBillDetailTable.table.props, selectedRows)"/>

        <j-editable-table
          :ref="refKeys[0]"
          :loading="stockProductCheckBillDetailTable.loading"
          :columns="stockProductCheckBillDetailTable.columns"
          :dataSource="stockProductCheckBillDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="false"
          @valueChange="onValueChange">

          <!-- <template v-slot:batchNoSelectModal="props" style="padding-left: 0">
            <a-button @click="handleBatchNoSelect(props)" icon="ellipsis"></a-button>
            <onl-cgreport-select-modal
              ref="selectModal"
              title="选择产品"
              reportId="1408406865902465026"
              :width="1100"
              :multiSelectable="true"
              :selectedRowKeys="stockProductCheckBillDetailTable.selectedRowKeys"
              :selectedRows="stockProductCheckBillDetailTable.selectedRows"
              @callback="(selectedRows)=>handleBatchNoSelectCallback(props,selectedRows)"/>
          </template> -->

          </j-editable-table>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction, putAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue ,isEmpty} from '@/utils/util'
  import { getFormatDate } from '../../utils/util'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'

  export default {
    name: 'StockProductCheckBillForm',
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
          employeeId: [
             { required: true, message: '请选择盘点员!'},
          ],
          checkTime: [
             { required: true, message: '请选择盘点日期!'},
          ],
          warehouseId: [
             { required: true, message: '请选择盘点仓库!'},
          ],
          /* productCategoryId: [
             { required: true, message: '请选择产品类别!'},
          ], */
        },
        refKeys: ['stockProductCheckBillDetail', ],
        tableKeys:['stockProductCheckBillDetail', ],
        activeKey: 'stockProductCheckBillDetail',
        // 产品库存盘点明细
        stockProductCheckBillDetailTable: {
          loading: false,
          dataSource: [],
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                  orgFields: "id,product_id,product_category_id,product_code,product_measure_group_id,inventory_num,check_num,profit_and_loss",
                  destFields: "productInventoryId,productId,productCategoryId,productCode,productMeasureGroupId,inventoryNum,checkNum,profitAndLoss",
              },
            },
          },
          columns: [
            /* {
              title: '源单ID',
              key: 'sourceBillId',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            }, */
            /* {
              title: '',
              key: 'batchNoSelectModal',
              type: FormTypes.slot,
              slotName: 'batchNoSelectModal',
               orgFields: "product_id,product_category_id,product_code,product_measure_group_id,inventory_num",
               destFields: "productId,productCategoryId,productCode,productMeasureGroupId,inventoryNum",
              width:"45px",
            }, */
            {
              title: '产品实时库存ID',
              key: 'productInventoryId',
              type: FormTypes.hidden,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '产品',
              key: 'productId',
              type: FormTypes.select,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode: 'bas_product,name,id',
              disabled: true,
            },
            {
              title: '产品类别',
              key: 'productCategoryId',
              type: FormTypes.hidden,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode: 'bas_product_category,name,id',
              disabled: true,
            },
            {
              title: '产品编码',
              key: 'productCode',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '产品计量组',
              key: 'productMeasureGroupId',
              type: FormTypes.select,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              dictCode: 'bas_product_measure_group,name,id',
              disabled: true,
            },
            {
              title: '库存数量',
              key: 'inventoryNum',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
            },
            {
              title: '实存数量',
              key: 'checkNum',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '盈亏',
              key: 'profitAndLoss',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled: true,
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/stockProductCheckBill/stockProductCheckBill/add",
          edit: "/stockProductCheckBill/stockProductCheckBill/edit",
          queryById: "/stockProductCheckBill/stockProductCheckBill/queryById",
          stockProductCheckBillDetail: {
            list: '/stockProductCheckBill/stockProductCheckBill/queryStockProductCheckBillDetailByMainId'
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
        this.stockProductCheckBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'product_check_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.checkTime = getFormatDate();
            this.model = Object.assign({}, record)
            console.log(this.model);
            //this.edit(record);
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
          this.requestSubTableData(this.url.stockProductCheckBillDetail.list, params,
            this.stockProductCheckBillDetailTable, this.classifySubTableData)
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
          stockProductCheckBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

      /* 整理子表数据 */
      classifySubTableData(res){
        let { result } = res
        let dataSource = []
        let table = this.stockProductCheckBillDetailTable.table
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
            queryParams['warehouse_id'] = this.model.warehouseId;
            queryParams['product_category_id'] = this.model.productCategoryId;
            this.$refs.selectModal.initQueryParams(queryParams);
            this.$refs.selectModal.visible = true;
          }
        });
      },
      /* 处理在线报表选择回调 */
      handleBatchNoSelectCallback(props, selectedRows){
        let rowKey = 'id';
        let orgFields = props.column.orgFields.split(',');
        let destFields = props.column.destFields.split(',');
        //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
        this.stockProductCheckBillDetailTable.table.selectedRowKeys
        .splice(0,this.stockProductCheckBillDetailTable.table.selectedRowKeys.length);//清空数组
        this.stockProductCheckBillDetailTable.table.selectedRows
        .splice(0,this.stockProductCheckBillDetailTable.table.selectedRows.length);//清空数组
        //setp2:将表单中子表项全部清空，重新添加报表重选项
        this.eachAllTable((table, index) => {
          table.rows.forEach(function(item, idnex, array){
              table.removeRows(item.id);
          });
          //子表单赋值
          for(let i = 0; i < selectedRows.length; i++) {
            this.stockProductCheckBillDetailTable.table.selectedRowKeys[i] = selectedRows[i][rowKey]; //记录子表已经选择项
            this.stockProductCheckBillDetailTable.table.selectedRows[i] = selectedRows[i]; //记录子表已经选择项
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
        const { type, row, column, value, target } = event
        //checkNum 实存数量 --> profitAndLoss 盈亏数量
        if (column.key === 'checkNum') {
          let checkNum = Number(value);
          let inventoryNum = Number(row.inventoryNum);
          if (!isNaN(checkNum) && !isNaN(inventoryNum)){
            target.setValues([{rowKey: row.id, values: {profitAndLoss:  checkNum - inventoryNum}}]);
          }
        }
      },

    }
  }
</script>

<style scoped>
</style>