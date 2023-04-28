<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="仓库">
              <j-tree-select
                ref="treeSelect"
                placeholder="请选择仓库"
                v-model="queryParam.warehouseId"
                dict="bas_warehouse,name,id"
                condition='{"is_enabled":"1"}'
                pidField="pid"
                pidValue="0"
                hasChildField="has_child">
              </j-tree-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="材料">
              <j-dict-select-tag placeholder="请选择材料" v-model="queryParam.materialId" dictCode="bas_material,name,id,is_enabled=1"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="供应商">
                <j-dict-select-tag placeholder="请选择供应商" v-model="queryParam.supplierId" dictCode="bas_supplier,name,id,is_enabled=1"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('材料实时库存')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
      <!-- 高级查询区域 -->
      <!-- <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a> -->
                <a @click="handleDetail(record)">详情</a>

<!--          <a-divider type="vertical" />-->
<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item>-->
<!--                <a @click="handleDetail(record)">详情</a>-->
<!--              </a-menu-item>-->
<!--               <a-menu-item>-->
<!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
<!--              </a-menu-item> -->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <stock-material-inventory-modal ref="modalForm" @ok="modalFormOk"></stock-material-inventory-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StockMaterialInventoryModal from './modules/StockMaterialInventoryModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'StockMaterialInventoryList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      StockMaterialInventoryModal
    },
    data () {
      return {
        description: '材料实时库存管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'仓库',
            align:"center",
            dataIndex: 'warehouseId_dictText'
          },
          {
            title:'材料',
            align:"center",
            dataIndex: 'materialId_dictText'
          },
          {
            title:'材料类别',
            align:"center",
            dataIndex: 'materialCategoryId_dictText'
          },
          {
            title:'材料编码',
            align:"center",
            dataIndex: 'materialCode'
          },
          {
            title:'供应商',
            align:"center",
            dataIndex: 'supplierId_dictText'
          },
          {
            title:'计量单位',
            align:"center",
            dataIndex: 'materialUnit'
          },
          {
            title:'规格型号',
            align:"center",
            dataIndex: 'materialModel'
          },
          /* {
            title:'成本',
            align:"center",
            dataIndex: 'materialCost'
          }, */
          {
            title:'库存数量',
            align:"center",
            dataIndex: 'inventoryNum'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/stockMaterialInventory/stockMaterialInventory/list",
          delete: "/stockMaterialInventory/stockMaterialInventory/delete",
          deleteBatch: "/stockMaterialInventory/stockMaterialInventory/deleteBatch",
          exportXlsUrl: "/stockMaterialInventory/stockMaterialInventory/exportXls",
          importExcelUrl: "stockMaterialInventory/stockMaterialInventory/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'warehouseId',text:'仓库'})
        fieldList.push({type:'string',value:'materialId',text:'材料',dictCode:'bas_material,name,id'})
        fieldList.push({type:'string',value:'supplierId',text:'供应商',dictCode:'bas_supplier,name,id'})
        fieldList.push({type:'string',value:'unit',text:'计量单位',dictCode:''})
        fieldList.push({type:'string',value:'model',text:'规格型号',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'cost',text:'成本',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'inventoryNum',text:'库存数量',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>