<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-model-item label="销售单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="billNo">
              <a-input v-model="model.billNo" placeholder="请输入销售单号" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="销售日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="saleTime">
              <j-date placeholder="请选择销售日期" v-model="model.saleTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="业务员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salesmanId">
              <j-search-select-tag v-model="model.salesmanId" dict="sys_salesman,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="客户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customerId">
              <a-col :span="14" >
                <j-search-select-tag  :allowClear="false" v-model="model.customerId" @change="customerIdChange" ref="JDictSelectTag" dict="bas_customer,name,id"  />
              </a-col>
              <a-col :span="3" style="margin-left: 10px">
                <a-button  @click="handleCustomerAdd" type="primary" icon="plus">新增</a-button>
              </a-col>
              <a-col :span="4" style="margin-left: 10px">
                <a-button  @click="handleCustomerBillSearch"  :disabled="isCustomerIdControl"  type="dashed" icon="search">查看客户历史订单</a-button>

                <onl-cgreport-select-modal
                  ref="selectCustomerBillModal"
                  title="查看客户历史订单"
                  reportId="1411701427918651394"
                  :width="1100"
                  :multiSelectable="true"
                  :rowSelectionEnabled="false"
                  :okButtonEnabled="false"
                />
              </a-col>
              <a-col :span="24">

              </a-col>
            </a-form-model-item>
          </a-col>

          <a-col :span="12" >
            <a-form-model-item label="是否付款" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isPay">
              <j-dict-select-tag type="list"  @change="isPayChange"   v-model="model.isPay" dictCode="yn" placeholder="请选择是否付款" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12" >
            <a-form-model-item label="客户详情" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customerDetailId">

              <a-col :span="21" >
                <a-input v-model="model.customerDetailId" placeholder="请输入客户详情" hidden ></a-input>
                <j-editable-table
                  :ref="refKeys[1]"
                  :loading="basCustomerDetailTable.loading"
                  :columns="basCustomerDetailTable.columns"
                  :dataSource="basCustomerDetailTable.dataSource"
                  :maxHeight="300"
                  :disabled="true"
                  :rowNumber="false"
                  :rowSelection="false"
                  :actionButton="false"/>
              </a-col>
              <a-col :span="1" style="margin-left: 5px">
                <a-button  @click="handleCustomerCustomerAdd(basCustomerDetailTable.table.props)" :disabled="isCustomerIdControl" type="primary" icon="search"   >选择</a-button>
<!--                <onl-cgreport-select-modal-->
<!--                  ref="selectCustomerDetailModal"-->
<!--                  title="选择客户详细信息"-->
<!--                  reportId="1411305440586805249"-->
<!--                  :width="1100"-->
<!--                  :multiSelectable="false"-->
<!--                  :selectedRowKeys="basCustomerDetailTable.selectedRowKeys"-->
<!--                  :selectedRows="basCustomerDetailTable.selectedRows"-->
<!--                  @callback="(selectedRows)=>handleCustomerCustomerAddCallback(basCustomerDetailTable.props,selectedRows,'basCustomerDetailTable','basCustomerDetail')"/>-->
                <onl-cgreport-select-modal
                  ref="selectCustomerDetailModal"
                  title="选择客户详细信息"
                  reportId="1411305440586805249"
                  :width="1100"
                  :params="basCustomerDetailTable.table.params"
                  :multiSelectable="false"
                  :selectedRowKeys="basCustomerDetailTable.table.selectedRowKeys"
                  :selectedRows="basCustomerDetailTable.table.selectedRows"
                  @callback="(selectedRows)=>handleOnlCgreportSelectCallback(basCustomerDetailTable.table.props, selectedRows,'basCustomerDetailTable','basCustomerDetail',handleCustomerCustomerAddCallback)"/>
              </a-col>
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="收款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receiveMoney">
              <a-input-number :disabled="isPayControl" v-model="model.receiveMoney" placeholder="请输入收款金额" style="width: 100%" />
            </a-form-model-item>
          </a-col>


          <a-col :span="12" >
            <a-form-model-item label="收款方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentMethodId">
              <j-search-select-tag :disabled="isPayControl"  v-model="model.paymentMethodId"  dict="fin_payment_method,name,id"  />
            </a-form-model-item>
          </a-col>



          <a-col :span="12" >
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-search-select-tag @change="warehouseIdChange" v-model="model.warehouseId" dict="bas_warehouse,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="是否送货" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isSend">
              <j-dict-select-tag type="list" v-model="model.isSend" dictCode="yn" placeholder="请选择是否送货" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isEnabled">
              <j-dict-select-tag type="list" v-model="model.isEnabled" dictCode="yn" placeholder="请选择是否启用" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" >
            <a-form-model-item label="客户未付款金额" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="customerWallet">
              <a-input-number v-model="model.customerWallet" :disabled="true" placeholder="请输入客户未付款金额" style="width: 100%" />
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
      <a-tab-pane tab="产品销售订单明细表" :key="refKeys[0]" :forceRender="true">

        <a-button  :disabled="formDisabled" @click="handleProductSelect(saleProductBillDetailTable.props)" icon="plus" type="primary">选择</a-button>

<!--        <onl-cgreport-select-modal-->
<!--          ref="selectProductModal"-->
<!--          title="选择产品"-->
<!--          reportId="1408406865902465026"-->
<!--          :width="1100"-->
<!--          :multiSelectable="true"-->
<!--          :selectedRowKeys="saleProductBillDetailTable.selectedRowKeys"-->
<!--          :selectedRows="saleProductBillDetailTable.selectedRows"-->
<!--          @callback="(selectedRows)=>handleProductSelectCallback(saleProductBillDetailTable.props, selectedRows,'saleProductBillDetailTable','saleProductBillDetail')"/>-->
        <onl-cgreport-select-modal
          ref="selectProductModal"
          title="选择产品"
          reportId="1408406865902465026"
          :width="1100"
          :params="saleProductBillDetailTable.table.params"
          :multiSelectable="true"
          :selectedRowKeys="saleProductBillDetailTable.table.selectedRowKeys"
          :selectedRows="saleProductBillDetailTable.table.selectedRows"
          @callback="(selectedRows)=>handleOnlCgreportSelectCallback(saleProductBillDetailTable.table.props, selectedRows,'saleProductBillDetailTable','saleProductBillDetail')"/>
        <j-editable-table
          :ref="refKeys[0]"
          :loading="saleProductBillDetailTable.loading"
          :columns="saleProductBillDetailTable.columns"
          :dataSource="saleProductBillDetailTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          @valueChange="onSaleProductBillDetailTableValueChange"
          :actionButton="false"/>
      </a-tab-pane>
    </a-tabs>
    <basCustomer-modal ref="basCustomerModal" @ok="basCustomerModalFormOk"></basCustomer-modal>

  </a-spin>
</template>

<script>

  import { httpAction, getAction, putAction} from '@/api/manage'
  import OnlCgreportSelectModal from '../../components/OnlCgreportSelectModal'

  import { getFormatDate } from '../../utils/util'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import BasCustomerModal from '../../basCustomer/modules/BasCustomerModal'
  import {billCommonMixin}  from '@/views/erp/mixins/billCommonMixin'
   import  {OnlCgreportSelectModalMixin} from '@/views/erp/mixins/OnlCgreportSelectModalMixin'
  export default {
    name: 'SaleProductBillForm',
    mixins: [JEditableTableModelMixin, billCommonMixin,OnlCgreportSelectModalMixin],
    components: {
      OnlCgreportSelectModal,
      BasCustomerModal,
      JDictSelectTag,

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
        isPayControl:true,
        isCustomerIdControl:true,
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 0,
        validatorRules: {
           saleTime: [
              { required: true, message: '请输入销售日期!'},
           ],
           salesmanId: [
              { required: true, message: '请输入业务员!'},
           ],
          warehouseId:[
            { required: true, message: '请选择仓库!'},
          ],
           customerId: [
              { required: true, message: '请输入客户!'},
           ],
          customerDetailId: [
            {validator: this.validatorCustomerDetailId},
          ],
          isPay: [{required: true, message: '请选择是否收款'},
              {validator: this.validatorIsPay}],
          paymentMethodId:[ {validator: this.validatorPaymentMethodId}],
           receiveMoney: [
              { required: false},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
             {validator: this.validatorReceiveMoney},
           ],
        },
        refKeys: ['saleProductBillDetail','basCustomerDetail' ],
        tableKeys:['saleProductBillDetail','basCustomerDetail' ],
        activeKey: 'saleProductBillDetail',
        // 产品销售订单明细表
        saleProductBillDetailTable: {
          loading: false,
          dataSource: [],
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                orgFields: "id,product_id,product_code,product_category_id,product_measure_group_id,inventory_num",
                destFields: "selectedRowKey,productId,productCode,productCategoryId,productMeasureGroupId,inventoryNum",
              },
            },
          },
          columns: [
            {
              title: '选中编号',
              key: 'selectedRowKey',
              type: FormTypes.hidden,
              width:"100px",
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
              disabled:true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '产品类别',
              key: 'productCategoryId',
              type: FormTypes.sel_search,
              dictCode:"bas_product_category,name,id",
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
              title: '产品单价',
              key: 'productPrice',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
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
              title: '销售数量',
              key: 'saleNum',
              type: FormTypes.inputNumber,
              width:"200px",
              statistics: true,
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '销售金额',
              key: 'saleMoney',
              type: FormTypes.inputNumber,
              disabled:true,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              statistics: true,
              validateRules: [{ pattern: "money", message: "${title}格式不正确" }],
            },
          ]
        },
        // 客户详细信息
        basCustomerDetailTable: {
          loading: false,
          dataSource: [],
          selectedRowKeys: [],//子表已经选择项
          selectedRows: [],//子表已经选择项
          table: {
            params: {},
            rowKey: 'id',
            selectedRowKeys: [],//子表已经选择项
            selectedRows: [],//子表已经选择项
            props: {//子表属性
              column: {
                orgFields: "receive_name,phone,address",
                destFields: "receiveName,phone,address",
              },
            },
          },
          columns: [
            // {
            //   title: '客户',
            //   key: 'customerId',
            //   type: FormTypes.select,
            //   dictCode:"bas_customer,name,id",
            //   disabled:true,
            //   width:"200px",
            //   placeholder: '请输入${title}',
            //   defaultValue:'',
            //   // validateRules: [{ required: true, message: '${title}不能为空' }],
            // },
            {
              title: '收货人名称',
              key: 'receiveName',
              type: FormTypes.input,
              placeholder: '请输入${title}',
              defaultValue:'',
              //validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '联系电话',
              key: 'phone',
              type: FormTypes.input,
              placeholder: '请输入${title}',
              defaultValue:'',
              // validateRules: [
              //   { required: true, message: '${title}不能为空' },
              //   { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'}],
            },
            {
              title: '地址',
              key: 'address',
              type: FormTypes.input,

              placeholder: '请输入${title}',
              defaultValue:'',
              //validateRules: [{ required: true, message: '${title}不能为空' }],
            },

          ]
        },
        url: {
          add: "/saleProductBill/saleProductBill/add",
          edit: "/saleProductBill/saleProductBill/edit",
          queryById: "/saleProductBill/saleProductBill/queryById",
          saleProductBillDetail: {
            list: '/saleProductBill/saleProductBill/querySaleProductBillDetailByMainId'
          },
          basCustomerDetail: {
            list: '/basCustomer/basCustomer/queryBasCustomerDetailById'
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
      warehouseIdChange(value){
        if(value)
          this.clearJEditTableByRef("saleProductBillDetail")
      },
      // 查看客户历史订单
      handleCustomerBillSearch(){
        // if(this.model.customerId==""||this.model.customerId==null)
        //   this.$message.error("请先选择供应商！")
        let queryParams = {};
        queryParams['customer_id'] = this.model.customerId;
        this.$refs.selectCustomerBillModal.initQueryParams(queryParams);
        this.$refs.selectCustomerBillModal.visible = true;
      },
      /* 处理在线报表选择 */
      handleProductSelect(props){
        console.info(props)
        // let row = props.getValue();

        let queryParams = {};
        /* for(let i = 0; i < orgFields.length; i++) {
          queryParams[orgFields[i]] = row[destFields[i]];
        } */
        this.$refs.form.validate((pass,obj)=>{
          if(pass){
            // if(this.model.outWarehouseId == this.model.inWarehouseId){
            //   this.validateError('调入仓库与调出仓库不能相同!');
            //   return;
            // }
            queryParams['warehouse_id'] = this.model.warehouseId;
            this.$refs.selectProductModal.initQueryParams(queryParams);
            this.$refs.selectProductModal.visible = true;
          }
        });
      },
      /* 处理在线报表选择回调 */
      // handleProductSelectCallback(props, selectedRows,subTableName,ref){
      //
      //   let rowKey = 'id';
      //   let orgFields = props.column.orgFields.split(',');
      //   let destFields = props.column.destFields.split(',');
      //   //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
      //   this[`${subTableName}`].selectedRowKeys
      //     .splice(0, this[`${subTableName}`].selectedRowKeys.length);//清空数组
      //   this[`${subTableName}`].selectedRows
      //     .splice(0,this[`${subTableName}`].selectedRows.length);//清空数组
      //   //setp2:将表单中子表项全部清空，重新添加报表重选项
      //    //this.eachAllTable((table, index) => {
      //   //   table.rows.forEach(function(row){
      //   //     table.removeRows(row.id);
      //   //   });
      //   //   //子表单赋值
      //   //   for(let i = 0; i < selectedRows.length; i++) {
      //   //     this[`${subTableName}`].selectedRowKeys[i] = selectedRows[i][rowKey]; //记录子表已经选择项
      //   //     this[`${subTableName}`].selectedRows[i] = selectedRows[i]; //记录子表已经选择项
      //   //     let values = {};
      //   //     for(let j = 0; j < orgFields.length; j++) {
      //   //       values[destFields[j]] = selectedRows[i][orgFields[j]];
      //   //     }
      //   //     table.add();
      //   //     let rowId = table.rows[table.rows.length - 1].id;
      //   //     table.setValues([{rowKey: rowId, values: values}]);
      //   //   }
      //   //   //子表单赋值
      //   // })
      //   //setp2:将表单中子表项全部清空，重新添加报表重选项
      //   if (!(this.refKeys instanceof Array)) {
      //     throw this.throwNotArray('refKeys')
      //   }
      //   this.refKeys.map(key =>{
      //     if(key===ref){
      //       getRefPromise(this, key).then(table => {
      //         //清空表格数据
      //         table.rows.forEach(function(row){
      //           table.removeRows(row.id);
      //         });
      //         //子表单赋值
      //         for(let i = 0; i < selectedRows.length; i++) {
      //           this[`${subTableName}`].selectedRowKeys[i] = selectedRows[i][rowKey]; //记录子表已经选择项
      //           this[`${subTableName}`].selectedRows[i] = selectedRows[i]; //记录子表已经选择项
      //           let values = {};
      //           for(let j = 0; j < orgFields.length; j++) {
      //             values[destFields[j]] = selectedRows[i][orgFields[j]];
      //           }
      //           table.add();
      //           let rowId = table.rows[table.rows.length - 1].id;
      //           table.setValues([{rowKey: rowId, values: values}]);
      //         }
      //       });
      //
      //     }
      //   })
      //
      // },
      /* JEditableTable检测单元格变化 */
      onSaleProductBillDetailTableValueChange(event) {
        const { type, row, column, value, target } = event
        //checkNum 实存数量 --> profitAndLoss 盈亏数量
        if (column.key === 'saleNum'||column.key === "productPrice") {
          let saleNum = Number(row.saleNum);
          let productPrice = Number(row.productPrice);

          if (!isNaN(saleNum) && !isNaN(productPrice)) {
            target.setValues([{rowKey: row.id, values: {saleMoney: saleNum * productPrice}}]);
          }
        }
      },
      handleCustomerCustomerAdd(props){
        if(this.model.customerId==""||this.model.customerId==null)
          this.$message.error("请先选择供应商！")
        // let row = props.getValue();
        // let orgFields = props.column.orgFields.split(',');
        // let destFields = props.column.destFields.split(',');
         let queryParams = {};
        // for(let i = 0; i < orgFields.length; i++) {
        //   queryParams[orgFields[i]] = row[destFields[i]];
        // }
        queryParams['customer_id'] =this.model.customerId;
        this.$refs.selectCustomerDetailModal.initQueryParams(queryParams);
        this.$refs.selectCustomerDetailModal.visible = true;
      },
      handleCustomerCustomerAddCallback(props, selectedRows,subTableName,ref){

        if(selectedRows!=undefined && selectedRows.length>0)
          this.model.customerDetailId = selectedRows[0].id

      },
      // handleCustomerOnlCgreportSelectCallback(props, selectedRows,subTablePropName,subTableRef){
      //   // 给customerDetailId赋值
      //   console.info("handleCustomerCustomerAddCallback",selectedRows)
      //   if(selectedRows!=undefined && selectedRows.length>0)
      //     this.model.customerDetailId = selectedRows[0].id
      //
      //   let orgFields = props.column.orgFields.split(',');
      //   let destFields = props.column.destFields.split(',');
      //   //step1:将报表中选择项与表单中已有项比较，删除没有项，添加新选择项
      //   this[`${subTablePropName}`].table.selectedRowKeys
      //     .splice(0, this[`${subTablePropName}`].table.selectedRowKeys.length);//清空数组
      //   this[`${subTablePropName}`].table.selectedRows
      //     .splice(0, this[`${subTablePropName}`].table.selectedRows.length);//清空数组
      //   //setp2:将表单中子表项全部清空，重新添加报表重选项
      //   if(subTableRef!=undefined&&subTableRef!=null){
      //     if (!(this.refKeys instanceof Array)) {
      //       throw this.throwNotArray('refKeys')
      //     }
      //     this.refKeys.map(key =>{
      //       if(key===subTableRef){
      //         getRefPromise(this, key).then(table => {
      //
      //           table.rows.forEach(function(item, idnex, array){
      //             table.removeRows(item.id);
      //           });
      //           //子表单赋值
      //           for(let i = 0; i < selectedRows.length; i++) {
      //             this[`${subTablePropName}`].table.selectedRowKeys[i] = selectedRows[i][table.rowKey]; //记录子表已经选择项
      //             this[`${subTablePropName}`].table.selectedRows[i] = selectedRows[i]; //记录子表已经选择项
      //             let values = {};
      //             for(let j = 0; j < orgFields.length; j++) {
      //               if(!isEmpty(selectedRows[i][orgFields[j]])){
      //                 values[destFields[j]] = selectedRows[i][orgFields[j]];
      //               }
      //             }
      //             table.add();
      //             let rowId = table.rows[table.rows.length - 1].id;
      //             table.setValues([{rowKey: rowId, values: values}]);
      //           }
      //           //子表单赋值end
      //         })
      //       }
      //     })
      //   }else{
      //     this.eachAllTable((table, index) => {
      //       table.rows.forEach(function(item, idnex, array){
      //         table.removeRows(item.id);
      //       });
      //       //子表单赋值
      //       for(let i = 0; i < selectedRows.length; i++) {
      //         this[`${subTablePropName}`].table.selectedRowKeys[i] = selectedRows[i][table.rowKey]; //记录子表已经选择项
      //         this[`${subTablePropName}`].table.selectedRows[i] = selectedRows[i]; //记录子表已经选择项
      //         let values = {};
      //         for(let j = 0; j < orgFields.length; j++) {
      //           if(!isEmpty(selectedRows[i][orgFields[j]])){
      //             values[destFields[j]] = selectedRows[i][orgFields[j]];
      //           }
      //         }
      //         table.add();
      //         let rowId = table.rows[table.rows.length - 1].id;
      //         table.setValues([{rowKey: rowId, values: values}]);
      //       }
      //       //子表单赋值end
      //     })
      //   }
      //   //callback(props, selectedRows,subTablePropName,subTableRef)
      //   //typeof callback === 'function' ?   : ''
      // },
      isPayChange(value){
        if(value>0)
          this.isPayControl = false
        else{
          this.isPayControl = true
          this.model.paymentMethodId=""
          this.model.receiveMoney=""
        }

      },
      validatorCustomerDetailId(rule, value, callback){
        console.info(value)
        if(!value){
          callback("请点击选择，先择客户详细信息！")
        } else
          callback()
      },
      validatorIsPay(rule, value, callback) {
        console.info(value)
         if(!value){
          callback()
        }else{

          if(value>0)
            this.isPayControl = false
          else{
            this.isPayControl = true
            this.model.paymentMethodId=""
            this.model.receiveMoney=""
          }

        }
        callback()
      },
      validatorPaymentMethodId(rule, value, callback){
        let isPayControl = this.isPayControl
        if(!isPayControl&&(value==""||value==null)){
          callback("请选择收款方式！")
        }
        else
          callback()
      },
      validatorReceiveMoney(rule, value, callback){
        // let customerWallet = Number(this.model.customerWallet);
        // let receiveMoney = Number(value);
        // this.model.customerWallet = customerWallet-receiveMoney;
        let isPayControl = this.isPayControl
        if(!isPayControl&&(value==""||value==null)){
          callback("请填写金额！")
        }
        else
          callback()
      },
      handleCustomerAdd: function () {
        this.$refs.basCustomerModal.add();
        this.$refs.basCustomerModal.title = "新增";
        this.$refs.basCustomerModal.disableSubmit = false;
      },
      basCustomerModalFormOk() {
        this.$refs.JDictSelectTag.initDictData();
        this.loading = true;
      },
      customerIdChange(val){
        const url = '/basCustomer/basCustomer/queryById';
        const params = {id: val};

        getAction(url, params).then(res => {
        if (res.success) {
          //客户欠款
          this.model.customerWallet =0;
          this.model.customerWallet =res.result.wallet;
          //清除客户子表数据
          this.model.customerDetailId = undefined;
          this.basCustomerDetailTable.dataSource=[];
          if (val) {
            this.isCustomerIdControl = false;
          }else{
            this.isCustomerIdControl = true;
          }
        }
        });

      },
      addBefore(){
        this.saleProductBillDetailTable.dataSource=[];
        this.basCustomerDetailTable.dataSource=[]

      },
      addAfter (record) {
        this.visible = false;
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'sale_bill_no'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            record.billNo =  res.result;
            record.saleTime = getFormatDate();
            record.isSend = "1";
            record.isPay ="0";
            record.isEnabled="1";
            this.model = Object.assign({}, record)
            let that = this

            //处理记录上一次的记录人
            this.getPreRecords("/saleProductBill/saleProductBill/list",{},function(res){
              if(res){
                record.salesmanId = res[0].salesmanId

              }
              that.model = Object.assign({}, record)
            })
          }
        })
      },

      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          let that = this
          this.requestSubTableData(this.url.saleProductBillDetail.list, params, this.saleProductBillDetailTable, function(res){

            that.classifySubTableData(res,'saleProductBillDetailTable')

          })
          //this.requestSubTableDataWithPromise(this.url.saleProductBillDetail.list, params, this.saleProductBillDetailTable)
        }
        //加载客户子表
        if(this.model.customerDetailId){
          //选择按钮
          this.isCustomerIdControl = false;
          // 选择框选中回显
          this.basCustomerDetailTable.table.selectedRowKeys=[this.model.customerDetailId];
          //客户子表内容
          let params = { id: this.model.customerDetailId }
          this.requestSubTableData(this.url.basCustomerDetail.list, params, this.basCustomerDetailTable)
        }
        if(this.model.isPay){
          this.isPayControl = false
        }else{
          this.isPayControl = true
          this.model.paymentMethodId=""
          this.model.receiveMoney=""
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
          saleProductBillDetailList: allValues.tablesValue[0].values,
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