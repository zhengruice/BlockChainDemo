<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="10" :lg="11" :md="12" :sm="24">
            <a-form-item label="销售日期">
              <j-date placeholder="请选择开始日期" class="query-group-cust" v-model="queryParam.saleTime_begin"></j-date>
              <span class="query-group-split-cust"></span>
              <j-date placeholder="请选择结束日期" class="query-group-cust" v-model="queryParam.saleTime_end"></j-date>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="业务员">
              <j-search-select-tag placeholder="请选择业务员" v-model="queryParam.salesmanId" dict="sys_salesman,name,id"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="客户">
                <j-search-select-tag placeholder="请选择客户" v-model="queryParam.customerId" dict="bas_customer,name,id"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否付款">
                <j-dict-select-tag placeholder="请选择是否付款" v-model="queryParam.isPay" dictCode="yn"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否送货">
                <j-dict-select-tag placeholder="请选择是否送货" v-model="queryParam.isSend" dictCode="yn"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否启用">
                <j-dict-select-tag placeholder="请选择是否启用" v-model="queryParam.isEnabled" dictCode="yn"/>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
<!--      <a-button type="primary" icon="download" @click="handleExportXls('产品销售订单表')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
      <!-- 高级查询区域 -->
<!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <span v-if="!record.isClosed">
             <a @click="handleEdit(record)" >编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleDetail(record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                    <a  >删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
          <span v-if="!!record.isClosed">
             <a @click="handleDetail(record)">详情</a>
          </span>
        </span>

      </a-table>
    </div>

    <sale-product-bill-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SaleProductBillModal from './modules/SaleProductBillModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "SaleProductBillList",
    mixins:[JeecgListMixin],
    components: {
      SaleProductBillModal
    },
    data () {
      return {
        description: '产品销售订单表管理页面',
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
            title:'销售单号',
            align:"center",
            dataIndex: 'billNo'
          },
          {
            title:'销售日期',
            align:"center",
            dataIndex: 'saleTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'业务员',
            align:"center",
            dataIndex: 'salesmanId_dictText'
          },
          {
            title:'客户',
            align:"center",
            dataIndex: 'customerId_dictText'
          },
          // {
          //   title:'客户未付款金额',
          //   align:"center",
          //   dataIndex: 'customerWallet'
          // },
          // {
          //   title:'收款金额',
          //   align:"center",
          //   dataIndex: 'receiveMoney'
          // },
          // {
          //   title:'收款方式',
          //   align:"center",
          //   dataIndex: 'paymentMethodId_dictText'
          // },
          // {
          //   title:'是否付款',
          //   align:"center",
          //   dataIndex: 'isPay_dictText'
          // },
          // {
          //   title:'是否送货',
          //   align:"center",
          //   dataIndex: 'isSend_dictText'
          // },
          {
            title:'是否启用',
            align:"center",
            dataIndex: 'isEnabled_dictText'
          },
          // {
          //   title:'摘要',
          //   align:"center",
          //   dataIndex: 'summary'
          // },
          // {
          //   title:'备注',
          //   align:"center",
          //   dataIndex: 'remark'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/saleProductBill/saleProductBill/list",
          delete: "/saleProductBill/saleProductBill/delete",
          deleteBatch: "/saleProductBill/saleProductBill/deleteBatch",
          exportXlsUrl: "/saleProductBill/saleProductBill/exportXls",
          importExcelUrl: "saleProductBill/saleProductBill/importExcel",

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
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'billNo',text:'销售单号',dictCode:''})
         fieldList.push({type:'date',value:'saleTime',text:'销售日期'})
         fieldList.push({type:'sel_search',value:'salesmanId',text:'业务员',dictTable:'sys_salesman', dictText:'name', dictCode:'id'})
         fieldList.push({type:'sel_search',value:'customerId',text:'客户',dictTable:'bas_customer', dictText:'name', dictCode:'id'})
         fieldList.push({type:'BigDecimal',value:'customerWallet',text:'客户未付款金额',dictCode:''})
         fieldList.push({type:'BigDecimal',value:'receiveMoney',text:'收款金额',dictCode:''})
         fieldList.push({type:'sel_search',value:'paymentMethodId',text:'收款方式',dictTable:'fin_payment_method', dictText:'name', dictCode:'id'})
         fieldList.push({type:'int',value:'isPay',text:'是否付款',dictCode:'yn'})
         fieldList.push({type:'int',value:'isSend',text:'是否送货',dictCode:'yn'})
         fieldList.push({type:'int',value:'isEnabled',text:'是否启用',dictCode:'yn'})
         fieldList.push({type:'string',value:'summary',text:'摘要',dictCode:''})
         fieldList.push({type:'string',value:'remark',text:'备注',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>