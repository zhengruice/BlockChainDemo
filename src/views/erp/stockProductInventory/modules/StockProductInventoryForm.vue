<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
  	          <j-tree-select
                ref="treeSelect"
                placeholder="请选择仓库"
                v-model="model.warehouseId"
                dict="bas_warehouse,name,id"
                pidValue="0"
                >
              </j-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productId">
              <j-dict-select-tag type="list" v-model="model.productId" dictCode="bas_product,name,id" placeholder="请选择产品" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productCategoryId">
              <j-dict-select-tag type="list" v-model="model.productCategoryId" dictCode="bas_product_category,name,id" placeholder="请选择产品类别" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="产品编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productCode">
              <a-input v-model="model.productCode" placeholder="请输入产品编码" style="width: 100%" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="计量组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productMeasureGroupId">
              <j-dict-select-tag type="list" v-model="model.productMeasureGroupId" dictCode="bas_product_measure_group,name,id" placeholder="请选择计量组" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="成本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="productCost">
              <a-input-number v-model="model.productCost" placeholder="请输入成本" style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inventoryNum">
              <a-input-number v-model="model.inventoryNum" placeholder="请输入数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'StockProductInventoryForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/stockProductInventory/stockProductInventory/add",
          edit: "/stockProductInventory/stockProductInventory/edit",
          queryById: "/stockProductInventory/stockProductInventory/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>