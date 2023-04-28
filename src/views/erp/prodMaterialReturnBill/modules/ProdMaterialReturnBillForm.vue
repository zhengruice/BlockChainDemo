<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="退料单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入退料单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="退回日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="returnTime">
              <j-date placeholder="请选择退回日期" v-model="model.returnTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="退料人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="employeeId">
              <j-search-select-tag v-model="model.employeeId" dict="sys_employee,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-search-select-tag @change="warehouseIdChange" v-model="model.warehouseId" dict="bas_warehouse,name,id"  />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="12" >-->
<!--            <a-form-model-item label="材料类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCategoryId">-->
<!--              <j-search-select-tag v-model="model.materialCategoryId" dict="bas_material_category,name,id"  />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="12" >-->
<!--            <a-form-model-item label="供应商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierId">-->
<!--              <j-dict-select-tag type="list" v-model="model.supplierId" dictCode="bas_supplier,name,id" placeholder="请选择供应商" />-->
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
      <a-tab-pane tab="生产原料退回账单明细表" :key="refKeys[0]" :forceRender="true">
<!--        <a-button @click="handleBatchNoSelect(prodMaterialReturnBillDetailTable.props)" icon="plus" type="primary">选择</a-button>-->
        <a-button @click="handleOnlCgReportSelect(prodMaterialReturnBillDetailTable.table.props,'prodMaterialReceiveBillDetailTable')" icon="search" type="primary">选择</a-button>

<!--        <onl-cgreport-select-modal-->
<!--          ref="selectModal"-->
<!--          title="选择材料"-->
<!--          reportId="1408404767391510530"-->
<!--          :width="1100"-->
<!--          :multiSelectable="true"-->
<!--          :selectedRowKeys="prodMaterialReturnBillDetailTable.selectedRowKeys"-->
<!--          :selectedRows="prodMaterialReturnBillDetailTable.selectedRows"-->
<!--          @callback="(selectedRows)=>handleBatchNoSelectCallback(prodMaterialReturnBillDetailTable.props, selectedRows,'prodMaterialReturnBillDetailTable')"/>-->

        <onl-cgreport-select-modal
          ref="selectModal"
          title="选择材料"
          reportId="1408404767391510530"
          :width="1100"
          :params="prodMaterialReturnBillDetailTable.table.params"
          :multiSelectable="true"
          :selectedRowKeys="prodMaterialReturnBillDetailTable.table.selectedRowKeys"
          :selectedRows="prodMaterialReturnBillDetailTable.table.selectedRows"
          @callback="(selectedRows)=>handleOnlCgreportSelectCallback(prodMaterialReturnBillDetailTable.table.props, selectedRows,'prodMaterialReturnBillDetailTable')"/>
        <j-editable-table
          :ref="refKeys[0]"
          :loading="prodMaterialReturnBillDetailTable.loading"
          :columns="prodMaterialReturnBillDetailTable.columns"
          :dataSource="prodMaterialReturnBillDetailTable.dataSource"
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
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'
  import { getFormatDate } from '../../utils/util'
  import  {billCommonMixin} from '@/views/erp/mixins/billCommonMixin'
  import  {OnlCgreportSelectModalMixin} from '@/views/erp/mixins/OnlCgreportSelectModalMixin'
  export default {
    name: 'ProdMaterialReturnBillForm',
    mixins: [JEditableTableModelMixin,billCommonMixin,OnlCgreportSelectModalMixin],
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
           returnTime: [
              { required: true, message: '请输入退回日期!'},
           ],
           employeeId: [
              { required: true, message: '请输入退料人!'},
           ],
           warehouseId: [
              { required: true, message: '请输入仓库!'},
           ],
           materialCategoryId: [
              { required: true, message: '请输入材料类别!'},
           ],
          supplierId:[
            { required: true, message: '请输入供应商!'},
          ],
        },
        refKeys: ['prodMaterialReturnBillDetail', ],
        tableKeys:['prodMaterialReturnBillDetail', ],
        activeKey: 'prodMaterialReturnBillDetail',
        // 生产原料退回账单明细表
        prodMaterialReturnBillDetailTable: {
          loading: false,
          dataSource: [],
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                orgFields: "id,material_code,material_id,supplier_id,inventory_num,returnNum",
                destFields: "inventoryId,materialCode,materialId,supplierId,inventoryNum,returnNum",
              },
            },
          },
          columns: [
            {
              title: '库存Id',
              key: 'inventoryId',
              type: FormTypes.hidden,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '材料编码',
              key: 'materialCode',
              type: FormTypes.input,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],

            },
            {
              title: '材料',
              key: 'materialId',
              type: FormTypes.select,
              dictCode:"bas_material,name,id",
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '供应商',
              key: 'supplierId',
              type: FormTypes.hidden,
              dictCode:"bas_material,name,id",
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '库存数量',
              key: 'inventoryNum',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ pattern: "money", message: "${title}格式不正确" }],
            },
            {
              title: '退回数量',
              key: 'returnNum',
              type: FormTypes.inputNumber,
              width:"200px",
              statistics: true,
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/prodMaterialReturnBill/prodMaterialReturnBill/add",
          edit: "/prodMaterialReturnBill/prodMaterialReturnBill/edit",
          queryById: "/prodMaterialReturnBill/prodMaterialReturnBill/queryById",
          prodMaterialReturnBillDetail: {
            list: '/prodMaterialReturnBill/prodMaterialReturnBill/queryProdMaterialReturnBillDetailByMainId'
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
        this.prodMaterialReturnBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'prod_material_return_bill_on'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.returnTime = getFormatDate();
            //处理记录上一次的记录人
            let that = this
            this.getPreRecords("/prodMaterialReturnBill/prodMaterialReturnBill/list",{},function(res){
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
          let  that = this
          this.requestSubTableData(this.url.prodMaterialReturnBillDetail.list, params, this.prodMaterialReturnBillDetailTable,function (res) {
            that.classifySubTableData(res,'prodMaterialReturnBillDetailTable')
          })
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
          prodMaterialReturnBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },

      /* 处理在线报表选择 */
      handleOnlCgReportSelect(props,subTableAttributeName){
        let queryParams = {};
        this.$refs.form.validate((pass,obj)=>{
          if(pass){
            queryParams['warehouse_id'] = this.model.warehouseId;
            //queryParams['supplier_id'] = this.model.supplierId;
            this.$refs.selectModal.initQueryParams(queryParams);
            this.$refs.selectModal.visible = true;
          }
        });
      },
      // /* 处理在线报表选择回调 */
      // handleBatchNoSelectCallback(props, selectedRows,subTableName){
      //   let rowKey = 'id';
      //   let orgFields = props.column.orgFields.split(',');
      //   let destFields = props.column.destFields.split(',');
      //   //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
      //   this[`${subTableName}`].selectedRowKeys
      //     .splice(0, this[`${subTableName}`].selectedRowKeys.length);//清空数组
      //   this[`${subTableName}`].selectedRows
      //     .splice(0,this[`${subTableName}`].selectedRows.length);//清空数组
      //   //setp2:将表单中子表项全部清空，重新添加报表重选项
      //   this.eachAllTable((table, index) => {
      //     table.rows.forEach(function(row){
      //       table.removeRows(row.id);
      //     });
      //     //子表单赋值
      //     for(let i = 0; i < selectedRows.length; i++) {
      //       this[`${subTableName}`].selectedRowKeys[i] = selectedRows[i][rowKey]; //记录子表已经选择项
      //       this[`${subTableName}`].selectedRows[i] = selectedRows[i]; //记录子表已经选择项
      //       let values = {};
      //       for(let j = 0; j < orgFields.length; j++) {
      //         values[destFields[j]] = selectedRows[i][orgFields[j]];
      //       }
      //       table.add();
      //       let rowId = table.rows[table.rows.length - 1].id;
      //       table.setValues([{rowKey: rowId, values: values}]);
      //     }
      //     //子表单赋值
      //   })
      //
      // },
      warehouseIdChange(value){
        if(value)
          this.clearJEditTableByRef("prodMaterialReturnBillDetail")
      },
    }
  }
</script>

<style scoped>
</style>