<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="类别">
              <a-input placeholder="请输入类别" v-model="types"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-button @click="blockShow" type="primary" icon="plus">可视化展示</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增 | Add</a-button>
       <!-- <a-button type="primary" icon="download" @click="handleExportXls('区块链')">导出</a-button> -->
                   <a-popover title="自定义列 | Custom Column" trigger="click" placement="leftBottom">
                       <template slot="content">
                         <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
                           <a-row style="width: 400px">
                             <template v-for="(item,index) in defColumns">
                               <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                                 <a-col :span="12"><a-checkbox :value="item.dataIndex"><j-ellipsis :value="item.title" :length="10"></j-ellipsis></a-checkbox></a-col>
                               </template>
                             </template>
                           </a-row>
                         </a-checkbox-group>
                         <a-button type="primary" icon="download" @click="handleExportXls('区块链')">导出 | export</a-button>
                       </template>
                       <a-button type="primary" icon="download">导出 | export</a-button>
                    </a-popover>
                   <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
                     <a-button type="primary" icon="import">导入 | import</a-button>
                   </a-upload> -->
                    <a-popover title="导入 | import" trigger="click" placement="rightBottom">
                           <template slot="content">
                             <a-row >
                               <a-col :span="24">
                                 <!--        <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
                                 <!--                  :action="importExcelUrl"-->
                                 <!--                  @change="handleImportExcel">-->
                                 <!--          <a-button type="primary" icon="import">导入</a-button>-->
                                 <!--        </a-upload>-->
                                 <a-upload-dragger
                                   name="file"
                                   :multiple="false"
                                   :showUploadList="false"
                                   :headers="tokenHeader"
                                   :action="importExcelUrl"
                                   @change="handleImportExcel"
                                 >
                                   <p class="ant-upload-text">点击或拖拽导入</p>
                                   <p class="ant-upload-text">Click or drag file to this area to import</p>
                                 </a-upload-dragger>
                               </a-col>
                             </a-row>
                             <a-row style="margin-top: 24px">
                               <a-col :span="24">
                                 <a-button type="link" block icon="download" @click="handleExportXls('区块链'+'导入模板')">
                                   下载模板 Download Templement
                                 </a-button>
                               </a-col>
                             </a-row>
                            </template>
                           <a-button type="primary" icon="import" >导入 | import</a-button>
                         </a-popover>
      <!-- 高级查询区域 -->
      <a-button @click="dataProcess" type="primary" icon="plus">数据处理 | Process</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除 | Delete</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 | Batch Operation <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 | Selected <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空 | clear</a>
      </div>

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
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片 | No Image</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件 | No file</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载 | Download
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑 | Edit</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 | More <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情 | Detail</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <block-modal ref="modalForm" @ok="modalFormOk"></block-modal>
    <data-process-modal ref="dataForm" @ok="modalFormOk"></data-process-modal>
    <BlockShowModal ref="blockShow"></BlockShowModal>


  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import BlockModal from './modules/BlockModal'
   import Vue from "vue";
  import DataProcessModal from "./modules/DataProcessModal";
  import BlockShowModal from "./modules/BlockShowModal";

  export default {
    name: 'BlockList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      BlockModal,
      DataProcessModal,
      BlockShowModal
    },
    data () {
      return {
        types: '',
        description: '区块链管理页面',
        // 表头
        //列设置
        settingColumns:[],
        // 表头
        columns:[],
        defColumns: [
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
            title:'当前区块',
            align:"center",
            dataIndex: 'hash'
          },
          {
            title:'上一区块',
            align:"center",
            dataIndex: 'previousHash'
          },
          {
            title:'数据',
            align:"center",
            dataIndex: 'datas'
          },
          {
            title:'时间戳',
            align:"center",
            dataIndex: 'timeStamp'
          },
          {
            title:'数字',
            align:"center",
            dataIndex: 'nonce'
          },
          {
            title:'类别',
            align:"center",
            dataIndex: 'types'
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
          list: "/block/block/list",
          delete: "/block/block/delete",
          deleteBatch: "/block/block/deleteBatch",
          exportXlsUrl: "/block/block/exportXls",
          importExcelUrl: "block/block/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.initColumns();
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      blockShow(){
        this.$refs.blockShow.process(this.types);
        this.$refs.blockShow.title = "可视化展示";
        this.$refs.blockShow.disableSubmit = false;
      },
      dataProcess(){
        this.$refs.dataForm.process();
        this.$refs.dataForm.title = "数据处理";
        this.$refs.dataForm.disableSubmit = false;
      },
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'hash',text:'当前区块',dictCode:''})
        fieldList.push({type:'string',value:'previousHash',text:'上一区块',dictCode:''})
        fieldList.push({type:'string',value:'datas',text:'数据',dictCode:''})
        fieldList.push({type:'string',value:'timeStamp',text:'时间戳',dictCode:''})
        fieldList.push({type:'string',value:'nonce',text:'数字',dictCode:''})
        fieldList.push({type:'string',value:'types',text:'类别',dictCode:''})
        this.superFieldList = fieldList
      },

        //列设置更改事件
     onColSettingsChange (checkedValues) {
       var key = this.$route.name+":colsettings";
       Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
       this.settingColumns = checkedValues;
       const cols = this.defColumns.filter(item => {
         if(item.key =='rowIndex'|| item.dataIndex=='action'){
           return true
         }
         if (this.settingColumns.includes(item.dataIndex)) {
           return true
         }
         return false
       })
       this.columns =  cols;
     },
     initColumns(){
       var key = this.$route.name+":colsettings";
       let colSettings= Vue.ls.get(key);
       if(colSettings==null||colSettings==undefined){
         let allSettingColumns = [];
         this.defColumns.forEach(function (item,i,array ) {
           allSettingColumns.push(item.dataIndex);
         })
         this.settingColumns = allSettingColumns;
         this.columns = this.defColumns;
       }else{
         this.settingColumns = colSettings;
         const cols = this.defColumns.filter(item => {
           if(item.key =='rowIndex'|| item.dataIndex=='action'){
             return true;
           }
           if (colSettings.includes(item.dataIndex)) {
             return true;
           }
           return false;
         })
         this.columns =  cols;
       }
     },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>
