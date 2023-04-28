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
            <a-form-model-item label="材料" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialId">
              <j-dict-select-tag type="list" v-model="model.materialId" dictCode="bas_material,name,id" placeholder="请选择材料" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="材料类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCategoryId">
              <j-dict-select-tag type="list" v-model="model.materialCategoryId" dictCode="bas_material_category,name,id" placeholder="请选择材料类别" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="材料编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCode">
              <a-input  v-model="model.materialCode"  placeholder="请输入材料编码" style="width: 100%" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="供应商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="supplierId">
              <j-dict-select-tag type="list" v-model="model.supplierId" dictCode="bas_supplier,name,id" placeholder="请选择供应商" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="计量单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialUnit">
              <a-input v-model="model.materialUnit" placeholder="请输入计量单位"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="规格型号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialModel">
              <a-input v-model="model.materialModel" placeholder="请输入规格型号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="成本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCost">
              <a-input-number v-model="model.materialCost" placeholder="请输入成本" style="width: 100%" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inventoryNum">
              <a-input-number v-model="model.inventoryNum" placeholder="请输入库存数量" style="width: 100%" />
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
    name: 'StockMaterialInventoryForm',
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
          add: "/stockMaterialInventory/stockMaterialInventory/add",
          edit: "/stockMaterialInventory/stockMaterialInventory/edit",
          queryById: "/stockMaterialInventory/stockMaterialInventory/queryById"
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