<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="领取单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入领取单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="领取日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receiveTime">
              <j-date placeholder="请选择领取日期" v-model="model.receiveTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="领取人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="employeeId">
              <j-search-select-tag v-model="model.employeeId" dict="sys_employee,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-search-select-tag  @change="warehouseIdChange" v-model="model.warehouseId" dict="bas_warehouse,name,id"  />
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
      <a-tab-pane tab="生产产品领取账单明细表" :key="refKeys[0]" :forceRender="true">
<!--        <a-button @click="handleBatchNoSelect(prodProductReceiveBillDetailTable.table.props)" icon="plus" type="primary">选择</a-button>-->

<!--        <onl-cgreport-select-modal-->
<!--          ref="selectModal"-->
<!--          title="选择产品"-->
<!--          reportId="1408406865902465026"-->
<!--          :width="1100"-->
<!--          :multiSelectable="true"-->
<!--          :selectedRowKeys="prodProductReceiveBillDetailTable.table.selectedRowKeys"-->
<!--          :selectedRows="prodProductReceiveBillDetailTable.table.selectedRows"-->
<!--          @callback="(selectedRows)=>handleBatchNoSelectCallback(prodProductReceiveBillDetailTable.table.props, selectedRows,'prodProductReceiveBillDetailTable')"/>-->
        <a-button @click="handleOnlCgreportSelect(prodProductReceiveBillDetailTable.table.props,'prodProductReceiveBillDetailTable')" icon="plus" type="primary">选择</a-button>
        <onl-cgreport-select-modal
          ref="selectModal"
          title="选择产品"
          reportId="1408406865902465026"
          :width="1100"
          :params="prodProductReceiveBillDetailTable.table.params"
          :multiSelectable="true"
          :selectedRowKeys="prodProductReceiveBillDetailTable.table.selectedRowKeys"
          :selectedRows="prodProductReceiveBillDetailTable.table.selectedRows"
          @callback="(selectedRows)=>handleOnlCgreportSelectCallback(prodProductReceiveBillDetailTable.table.props, selectedRows,'prodProductReceiveBillDetailTable')"/>
        <j-editable-table
          :ref="refKeys[0]"
          :loading="prodProductReceiveBillDetailTable.loading"
          :columns="prodProductReceiveBillDetailTable.columns"
          :dataSource="prodProductReceiveBillDetailTable.dataSource"
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
  import { validateDuplicateValue ,isEmpty} from '@/utils/util'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'
  import { getFormatDate } from '../../utils/util'
  import  {billCommonMixin} from '@/views/erp/mixins/billCommonMixin'
  import  {OnlCgreportSelectModalMixin} from '@/views/erp/mixins/OnlCgreportSelectModalMixin'
  export default {
    name: 'ProdProductReceiveBillForm',
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
           billNo: [
              { required: true, message: '请输入领取单号!'},
           ],
           receiveTime: [
              { required: true, message: '请输入领取日期!'},
           ],
           employeeId: [
              { required: true, message: '请输入领取人!'},
           ],
           warehouseId: [
              { required: true, message: '请输入仓库!'},
           ],
           // categoryId: [
           //    { required: true, message: '请输入产品类别!'},
           // ],
        },
        refKeys: ['prodProductReceiveBillDetail', ],
        tableKeys:['prodProductReceiveBillDetail', ],
        activeKey: 'prodProductReceiveBillDetail',
        // 生产产品领取账单明细表
        prodProductReceiveBillDetailTable: {
          loading: false,
          dataSource: [],
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                orgFields: "id,product_id,product_code,product_measure_group_id,inventory_num,receive_num",
                destFields: "inventoryId,productId,productCode,productMeasureGroupId,inventoryNum,receiveNum",
              },
            },
          },
          columns: [
            {
              title: '库存',
              key: 'inventoryId',
              type: FormTypes.hidden,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '产品编码',
              key: 'productCode',
              type: FormTypes.input,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],

            },
            {
              title: '产品',
              key: 'productId',
              type: FormTypes.sel_search,
              dictCode:"bas_product,name,id",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled:true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '产品计量组',
              key: 'productMeasureGroupId',
              type: FormTypes.sel_search,
              dictCode:"bas_product_measure_group,name,id",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              disabled:true,
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

            },
            {
              title: '领取数量',
              key: 'receiveNum',
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
          add: "/prodProductReceiveBill/prodProductReceiveBill/add",
          edit: "/prodProductReceiveBill/prodProductReceiveBill/edit",
          queryById: "/prodProductReceiveBill/prodProductReceiveBill/queryById",
          prodProductReceiveBillDetail: {
            list: '/prodProductReceiveBill/prodProductReceiveBill/queryProdProductReceiveBillDetailByMainId'
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
        this.prodProductReceiveBillDetailTable.dataSource=[]
      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'prod_product_receive_bill_on'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.receiveTime = getFormatDate();

            //this.model = Object.assign({}, record)
            //this.edit(record);
            //处理记录上一次的记录人
            let that = this
            this.getPreRecords("/prodProductReceiveBill/prodProductReceiveBill/list",{},function(res){
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
          let that =this
          this.requestSubTableData(this.url.prodProductReceiveBillDetail.list, params,
          this.prodProductReceiveBillDetailTable, function (res) {
              that.classifySubTableData(res,'prodProductReceiveBillDetailTable')
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
          prodProductReceiveBillDetailList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },





      // /* 处理在线报表选择 */
      // handleBatchNoSelect(props){
      //   console.info(props)
      //   // let row = props.getValue();
      //   let orgFields = props.column.orgFields.split(',');
      //   let destFields = props.column.destFields.split(',');
      //   let queryParams = {};
      //   /* for(let i = 0; i < orgFields.length; i++) {
      //     queryParams[orgFields[i]] = row[destFields[i]];
      //   } */
      //   this.$refs.form.validate((pass,obj)=>{
      //     if(pass){
      //       // if(this.model.outWarehouseId == this.model.inWarehouseId){
      //       //   this.validateError('调入仓库与调出仓库不能相同!');
      //       //   return;
      //       // }
      //       queryParams['warehouse_id'] = this.model.warehouseId;
      //       this.$refs.selectModal.initQueryParams(queryParams);
      //       this.$refs.selectModal.visible = true;
      //     }
      //   });
      // },
      /* 处理在线报表选择 */
      handleOnlCgreportSelect(props,subTableAttributeName){
        console.info(props)
        let queryParams = {};
        this.$refs.form.validate((pass,obj)=>{
          if(pass){
             queryParams['warehouse_id'] = this.model.warehouseId;
            this.$refs.selectModal.initQueryParams(queryParams);
            this.$refs.selectModal.visible = true;
          }
        });
      },
      /* 处理在线报表选择回调 */
      // handleBatchNoSelectCallback(props, selectedRows){
      //   let orgFields = props.column.orgFields.split(',');
      //   let destFields = props.column.destFields.split(',');
      //   //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
      //   this.prodProductReceiveBillDetailTable.table.selectedRowKeys
      //   .splice(0,this.prodProductReceiveBillDetailTable.table.selectedRowKeys.length);//清空数组
      //   this.prodProductReceiveBillDetailTable.table.selectedRows
      //   .splice(0,this.prodProductReceiveBillDetailTable.table.selectedRows.length);//清空数组
      //   //setp2:将表单中子表项全部清空，重新添加报表重选项
      //   this.eachAllTable((table, index) => {
      //     table.rows.forEach(function(item, idnex, array){
      //         table.removeRows(item.id);
      //     });
      //     //子表单赋值
      //     for(let i = 0; i < selectedRows.length; i++) {
      //       this.prodProductReceiveBillDetailTable.table.selectedRowKeys[i] = selectedRows[i][table.rowKey]; //记录子表已经选择项
      //       this.prodProductReceiveBillDetailTable.table.selectedRows[i] = selectedRows[i]; //记录子表已经选择项
      //       let values = {};
      //       for(let j = 0; j < orgFields.length; j++) {
      //         if(!isEmpty(selectedRows[i][orgFields[j]])){
      //           values[destFields[j]] = selectedRows[i][orgFields[j]];
      //         }
      //       }
      //       table.add();
      //       let rowId = table.rows[table.rows.length - 1].id;
      //       table.setValues([{rowKey: rowId, values: values}]);
      //     }
      //     //子表单赋值end
      //   })
      // },
      /* handleBatchNoSelectCallback(props, selectedRows,subTableName){
        let rowKey = 'id';
        let orgFields = props.column.orgFields.split(',');
        let destFields = props.column.destFields.split(',');
        //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
        this[`${subTableName}`].selectedRowKeys
          .splice(0, this[`${subTableName}`].selectedRowKeys.length);//清空数组
        this[`${subTableName}`].selectedRows
          .splice(0,this[`${subTableName}`].selectedRows.length);//清空数组
        //setp2:将表单中子表项全部清空，重新添加报表重选项
        this.eachAllTable((table, index) => {
          table.rows.forEach(function(row){
            table.removeRows(row.id);
          });
          //子表单赋值
          for(let i = 0; i < selectedRows.length; i++) {
            this[`${subTableName}`].selectedRowKeys[i] = selectedRows[i][rowKey]; //记录子表已经选择项
            this[`${subTableName}`].selectedRows[i] = selectedRows[i]; //记录子表已经选择项
            let values = {};
            for(let j = 0; j < orgFields.length; j++) {
              values[destFields[j]] = selectedRows[i][orgFields[j]];
            }
            table.add();
            let rowId = table.rows[table.rows.length - 1].id;
            table.setValues([{rowKey: rowId, values: values}]);
          }
          //子表单赋值
        })

      }, */
      warehouseIdChange(value){
        if(value)
          this.clearJEditTableByRef("prodProductReceiveBillDetail")
      },
    }
  }
</script>

<style scoped>
</style>