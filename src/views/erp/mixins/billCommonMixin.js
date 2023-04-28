/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction, putAction, downFile, getFileAccessHttpUrl } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"
import store from '@/store'
import {Modal} from 'ant-design-vue'
import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'

export const billCommonMixin = {
  data(){
    return {

    }
  },
  created() {

  },
  computed: {
    //token header
    tokenHeader(){
      let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
      let tenantid = Vue.ls.get(TENANT_ID)
      if(tenantid){
        head['tenant-id'] = tenantid
      }
      return head;
    }
  },
  methods:{
    getPreRecords(url,params,callback) {
      if(!url){
        this.$message.error("请设置url属性!")
        return
      }
      getAction(url, params).then((res) => {
        if (res.success) {
          if (typeof callback === 'function') {
            if(res.result)
              callback(res.result.records)
          }
        }

        if(res.code===510){
          this.$message.warning(res.message)
        }

      })
    },
    // handleOnlCgreportSelectCallback(props, selectedRows,subTablePropName,subTableRef,callback){
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
    //
    //   typeof callback === 'function' ?  callback(props, selectedRows,subTablePropName,subTableRef) : ''
    // },
  }

}