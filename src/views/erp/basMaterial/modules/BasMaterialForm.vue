<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入编号" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="categoryId">
  	          <j-tree-select
                ref="treeSelect"
                placeholder="请选择类别"
                v-model="model.categoryId"
                dict="bas_material_category,name,id"
                condition='{"is_enabled": "1"}'
                pidValue="0"
                >
              </j-tree-select>
            </a-form-model-item>
          </a-col>
          
          <a-col :span="24">
            <a-form-model-item label="供应商分配" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <!--  dictCode="bas_supplier,name,id" -->
              <j-multi-select-tag
                v-model="model.selectedSuppliers"
                :options="suppliersOptions"
                placeholder="请选择供应商">
              </j-multi-select-tag>
            </a-form-model-item>
          </a-col>
          
          <a-col :span="24">
            <a-form-model-item label="规格型号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="model">
              <a-input v-model="model.model" placeholder="请输入规格型号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="计量单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="unit">
              <a-input v-model="model.unit" placeholder="请输入计量单位"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="单价" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="price">
              <a-input-number v-model="model.price" placeholder="请输入单价" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否含税" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isTax">
              <j-dict-select-tag type="list" v-model="model.isTax" dictCode="yn" placeholder="请选择是否含税" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isEnabled">
              <j-dict-select-tag type="list" v-model="model.isEnabled" dictCode="yn" placeholder="请选择是否启用" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction, putAction} from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
    import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: 'BasMaterialForm',
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
            isTax:0,
            isEnabled:1,
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
           name: [
              { required: true, message: '请输入名称!'},
           ],
           model: [
              { required: true, message: '请输入规格型号!'},
           ],
           unit: [
              { required: true, message: '请输入计量单位!'},
           ],
           price: [
              { required: false},
              { pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/, message: '请输入正确的金额!'},
           ],
        },
        url: {
          add: "/basMaterial/basMaterial/add",
          edit: "/basMaterial/basMaterial/edit",
          queryById: "/basMaterial/basMaterial/queryById",
          // 新增查询供应商列表、供应商材料关联列表
          querySupplierList: "/basSupplier/basSupplier/queryall",
          queryMaterialSupplier: "/basSupplierMaterial/basSupplierMaterial/queryMaterialSupplier"
        },
        // 供应商数据
        suppliersOptions:[],
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
      this.initSupplierList();
    },
    methods: {
      add () {
        // 请求后台的填值规则接口地址
        const url = '/sys/fillRule/executeRuleByCode/'
        const ruleCode = 'material_code'
        putAction(url + ruleCode, {}).then(res => {
          // 执行成功，获取返回的值，并赋到页面上
          if (res.success) {
            this.modelDefault.code =  res.result;
            this.edit(this.modelDefault);
          }
        })
      },
      edit (record) {
        this.model = Object.assign({}, {selectedSuppliers:''}, record);
        this.visible = true;
        if(record.hasOwnProperty("id")){
          this.getSupplierMaterials(record.id);
        }
      },
      // 初始化供应商数据
      initSupplierList(){
        getAction(this.url.querySupplierList).then(res=>{
          if(res.success){
            this.suppliersOptions = res.result.map((item,index,arr)=>{
              let c = {label:item.name, value:item.id}
              return c;
            })
            console.log('this.suppliersOptions: ',this.suppliersOptions)
          }
        });
      },
      // 查询供应商材料关联
      getSupplierMaterials(materialid){
         getAction(this.url.queryMaterialSupplier,{materialid: materialid} ).then(res=>{
          if(res.success){
            this.model.selectedSuppliers = res.result.join(",");
            console.log('this.model.selectedSuppliers=',this.model.selectedSuppliers);
          }
        });
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