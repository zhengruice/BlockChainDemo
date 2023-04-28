<template>
  <j-modal
    :visible.sync="visible"
    :width="width"
    :title="title"
    :fullscreen.sync="fullscreen"
    :switchFullscreen="switchFullscreen"
    @ok="handleOk">
    
    <a-row :gutter="10">
      <!-- 主表 -->
      <a-col :md="leftColMd" :sm="24" style="margin-bottom: 20px">
        <a-card :bordered="false">
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <!-- 搜索区域 -->
            <a-form layout="inline" @keyup.enter.native="searchQuery1">
              <a-row :gutter="24">
                <!-- 动态生成的查询条件 -->
                <main-sub-table-select-query-item v-if="table1.queryConfigs.length > 0" v-show="table1.showMoreQueryItems" 
                  :queryParams="table1.queryParams" :queryConfigs="table1.queryConfigs" @pressEnter="searchQuery1"/>
                <!-- 按钮 -->
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-col :md="12" :sm="24">
                    <a-button type="primary" @click="searchQuery1" icon="search">查询</a-button>
                    <a-button type="primary" @click="searchReset1" icon="reload" style="margin-left: 8px">重置</a-button>
                    <a v-if="table1.queryConfigs.length > 0" @click="table1.showMoreQueryItems=!table1.showMoreQueryItems" style="margin-left: 8px">
                      {{ table1.showMoreQueryItems ? '收起' : '展开' }}
                      <a-icon :type="table1.showMoreQueryItems ? 'up' : 'down'"/>
                    </a>
                  </a-col>
                </span>
                
              </a-row>
            </a-form>
          </div>
          
          <!-- 操作按钮区域 -->
          <!-- <div class="table-operator" style="margin: 5px 0 10px 2px">
            <a-button @click="handleAdd" type="primary" icon="plus">新建角色</a-button>
            <a-button @click="handleEdit(model1)" type="primary" icon="plus">角色编辑</a-button>
            <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
              <a-button type="primary" icon="import">导入</a-button>
            </a-upload>
            <a-button type="primary" icon="download" @click="handleExportXls('角色管理')">导出</a-button>
          </div> -->
          <!-- 已选记录 -->
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon">
            </i> 已选择 <a><b>{{ table1.selectedRowKeys.length }}</b></a>项
            <a style="margin-left: 24px" @click="onClearSelected1">清空</a>
          </div>
          <!-- 表格 -->
          <div style="margin-top: 15px">
            <a-table
              ref="table1"
              size="small"
              bordered
              rowKey="id"
              :columns="table1.columns"
              :dataSource="table1.dataSource"
              :pagination="table1.ipagination"
              :loading="table1.loading"
              :rowSelection="{
                selectedRowKeys: table1.selectedRowKeys, 
                type: table1.multiSelectable ? 'checkbox':'radio',
                onSelect: onSelectChange1}"
              @change="handleTableChange1"
              :customRow="customRowFn1">
              <!-- 表格操作区域 -->
              <!-- <span slot="action" slot-scope="text, record">
                <a @click="handleOpen(record)">用户</a>
                <a-divider type="vertical"/>
                <a-dropdown>
                  <a class="ant-dropdown-link">
                    更多 <a-icon type="down"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click="handlePerssion(record.id)">授权</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="handleEdit(record)">编辑</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete1(record.id)">
                        <a>删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
            </span> -->
            </a-table>
          </div>
          <!-- 操作栏区域 -->
        </a-card>
      </a-col>
      <!-- 子表 -->
      <a-col :md="rightColMd" :sm="24" v-if="this.rightcolval">
        <a-card :bordered="false">
          <!-- 查询区域 -->
          <div class="table-page-search-wrapper">
            <!-- 搜索区域 -->
            <a-form layout="inline" @keyup.enter.native="searchQuery2">
              <a-row :gutter="24">
                <!-- 动态生成的查询条件 -->
                <main-sub-table-select-query-item v-if="table2.queryConfigs.length > 0" v-show="table2.showMoreQueryItems" 
                  :queryParams="table2.queryParams" :queryConfigs="table2.queryConfigs" @pressEnter="searchQuery1"/>
                <!-- 按钮 -->
                <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <a-col :md="12" :sm="24">
                    <a-button type="primary" @click="searchQuery2" icon="search">查询</a-button>
                    <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
                    <a v-if="table2.queryConfigs.length > 0" @click="table2.showMoreQueryItems=!table2.showMoreQueryItems" style="margin-left: 8px">
                      {{ table2.showMoreQueryItems ? '收起' : '展开' }}
                      <a-icon :type="table2.showMoreQueryItems ? 'up' : 'down'"/>
                    </a>
                  </a-col>
                </span>
                
              </a-row>
            </a-form>
          </div>
          <!-- 操作按钮区域 -->
          <!-- <div class="table-operator" :md="24" :sm="24">
            <a-button @click="handleAdd2" type="primary" icon="plus" style="margin-top: 16px">新增用户</a-button>
            <a-button @click="handleEdit2" type="primary" icon="edit" style="margin-top: 16px">用户编辑</a-button>
            <a-button @click="handleAddUserRole" type="primary" icon="plus" style="margin-top: 16px">已有用户</a-button>
    
            <a-dropdown v-if="selectedRowKeys2.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="batchDel2">
                  <a-icon type="delete"/>
                  删除
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px"> 批量操作
                <a-icon type="down"/>
              </a-button>
            </a-dropdown>
          </div> -->
          <!-- table区域-begin -->
          <div>
            <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
              <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">
              {{table2.selectedRowKeys.length }}</a>项
              <a style="margin-left: 24px" @click="onClearSelected2">清空</a>
            </div>
            <a-table
              ref="table2"
              bordered
              size="small"
              rowKey="id"
              :columns="table2.columns"
              :dataSource="table2.dataSource"
              :pagination="table2.ipagination"
              :loading="table2.loading"
              :rowSelection="{
                selectedRowKeys: table2.selectedRowKeys,
                type: table2.multiSelectable ? 'checkbox':'radio',
                onSelect: onSelectChange2}"
              @change="handleTableChange2"
              :customRow="customRowFn2">
              <!-- 表格操作区域 -->
             <!-- <span slot="action" slot-scope="text, record">
                 <a @click="handleEdit2(record)">编辑</a>
                <a-divider type="vertical"/>
                <a-dropdown>
                  <a class="ant-dropdown-link">
                    更多 <a-icon type="down"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete2(record.id)">
                        <a>删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span> -->
            </a-table>
          </div>
          <!-- 操作栏区域 -->
        </a-card>
      </a-col>
    </a-row>
  </j-modal>
  
  
</template>
<script>
  import { deleteAction, postAction, getAction } from '@/api/manage'
  import { cloneObject, pushIfNotExist, spliceIfExist, filterObj } from '@/utils/util'
  import MainSubTableSelectQueryItem from './MainSubTableSelectQueryItem'

  export default {
    name: 'MainSubTableSelectModal',
    components: {
      MainSubTableSelectQueryItem,
    },
    props: {
      title: {
        type: String,
        default: '选择'
      },
      params: {//对应sqlParams
        type: Object,
        default:() => ({}) //函数体需带括号
      },
      width: {
        type: Number,
        default: 1000
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      switchFullscreen: {
        type: Boolean,
        default: true
      },
      tables: {//表格信息
        type: Object,
        default:() => ({}) //函数体需带括号
      },
      
    },
    mounted() {
        this.initTable();
        this.loadData1();
    },
    data() {
      return {
        //弹框显示
        visible: false,
        //右侧表格
        rightcolval: false,
        //当前主表ID
        currentTableId: '',
        //主表
        table1: {
          //表格key值
          rowKey: 'id',
          //主表展示字段
          columns: [],
          //主表查询条件
          queryParams: {},
          //主表查询字段
          queryConfigs: [],
          //主表数据
          dataSource: [],
          //主表分页配置
          ipagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '30'],
            showTotal: (total, range) => {
              return range[0] + '-' + range[1] + ' 共' + total + '条'
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0
          },
          //主表排序字段
          isorter: {
            column: 'createTime',
            order: 'desc'
          },
          //过滤字段
          filters: {},
          //表格加载
          loading: false,
          //是否显示多选
          showMoreQueryItems: false,
          //多选
          multiSelectable: false,
          //选择器
          selectedRowKeys: [],
          selectedRows: [],
          //数据url
          url: {
            list: '',
          }
        },
        //子表
        table2: {
          //表格key值
          rowKey: 'id',
          //主表id
          sourceTableId: 'id',
          //子表查询id
          queryTableId: 'id',
          //子表展示字段
          columns: [],
          //子表查询条件
          queryParams: {},
          //子表查询字段
          queryConfigs: [],
          //子表数据
          dataSource: [],
          //子表分页配置
          ipagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '30'],
            showTotal: (total, range) => {
              return range[0] + '-' + range[1] + ' 共' + total + '条'
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0
          },
          //子表排序字段
          isorter: {
            column: 'createTime',
            order: 'desc'
          },
          //过滤字段
          filters: {},
          //表格加载
          loading: false,
          //是否显示多选
          showMoreQueryItems: false,
          //多选
          multiSelectable: false,
          //选择器
          selectedRowKeys: [],
          selectedRows: [],
          //数据url
          url: {
            list: '',
          }
        },
        
      }
    },
    computed: {
      importExcelUrl: function() {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      },
      leftColMd() {
        return this.table1.selectedRowKeys.length === 0 ? 24 : 12
        // return this.rightcolval ? 12 : 24
      },
      rightColMd() {
        return this.table1.selectedRowKeys.length === 0 ? 0 : 12
        // return this.rightcolval ? 12 : 0
      }
    },
    methods: {
      initTable(){
        //step1:加载配置项
        this.table1 = Object.assign({}, this.table1, this.tables.table1);
        this.table2 = Object.assign({}, this.table2, this.tables.table2);
        //step2:加载勾选项
        let selectedRowKeys1 = JSON.parse(JSON.stringify(this.table1.selectedRowKeys))
        let selectedRows1 = JSON.parse(JSON.stringify(this.table1.selectedRows))
        this.table1.selectedRowKeys = selectedRowKeys1
        this.table1.selectedRows = selectedRows1
        let selectedRowKeys2 = JSON.parse(JSON.stringify(this.table2.selectedRowKeys))
        let selectedRows2 = JSON.parse(JSON.stringify(this.table2.selectedRows))
        this.table2.selectedRowKeys = selectedRowKeys2
        this.table2.selectedRows = selectedRows2
        //step3:如果table1有选中，默认加载table1第一项子表
        if (this.table1.selectedRows.length > 0){
          this.currentTableId = this.table1.selectedRows[0][this.table1.rowKey]
          this.rightcolval = true
          this.loadData2()
        }
        console.log('initTable', this.table1, this.table2);
      },
      //主表选择回调 step1：打开子表step2：设置选中键值与行项step3：加载子表数据step4:联动子表选择
      onSelectChange1(record, selected) {
        //selectedRows可能来源于主表不同表
        let key = record[this.table1.rowKey]
        let selectedRowKeys = JSON.parse(JSON.stringify(this.table1.selectedRowKeys))
        let selectedRows = JSON.parse(JSON.stringify(this.table1.selectedRows))
        // let selectedRowKeys = selectedRows.map(data=>{return data[this.table1.rowKey]})
        if (!this.table1.multiSelectable) {
          this.table1.selectedRowKeys = [key]
          this.table1.selectedRows = [record]
        }else{
          if(selected){
            pushIfNotExist(selectedRowKeys, key); this.table1.selectedRowKeys = selectedRowKeys;
            pushIfNotExist(selectedRows, record); this.table1.selectedRows = selectedRows;
            // this.table1.selectedRowKeys.push(key)
            // this.table1.selectedRows.push(record)
            // this.table1.selectedRowKeys = selectedRowKeys
            // this.table1.selectedRows = selectedRows
          }else{
            spliceIfExist(selectedRowKeys, key); this.table1.selectedRowKeys = selectedRowKeys;
            spliceIfExist(selectedRows, record, this.table1.rowKey); this.table1.selectedRows = selectedRows;
            // this.table1.selectedRowKeys.splice(this.table1.selectedRowKeys.indexOf(key), 1)
            // this.table1.selectedRows.splice(this.table1.selectedRows.indexOf(record), 1)
          }
        }
        this.rightcolval = true
        // this.table1.selectedRowKeys = selectedRows.map(data=>{return data[this.table1.rowKey]})
        // this.table1.selectedRows = selectedRows
        this.currentTableId = record[this.table1.rowKey]
        this.loadData2(1, selected, this.onSelectedChange1to2)
        console.log("table1 selected callback",this.table1.selectedRowKeys,this.table1.selectedRows)
      },
      //子表加载数据回调 NOTE:子表分页状态下不能全部选择,只能选择子表当前页
      onSelectedChange1to2(selected) {
        // console.log('selected',selected)
        // TODO 联动子表选择由于异步操作不能获取dataSource
        let that = this
        this.table2.dataSource.forEach(function(record, index, array) {
          that.onSelectChange2(record, selected)
        });
        console.log("table2 selected callback",this.table2.selectedRowKeys,this.table2.selectedRows)
      },
      //子表选择回调 
      onSelectChange2(record, selected) {
        //selectedRows可能来源于主表不同表
        let key = record[this.table2.rowKey]
        let selectedRowKeys = JSON.parse(JSON.stringify(this.table2.selectedRowKeys))
        let selectedRows = JSON.parse(JSON.stringify(this.table2.selectedRows))
        if (!this.table2.multiSelectable) {
          this.table2.selectedRowKeys = [key]
          this.table2.selectedRows = [record]
        }else{
          if(selected){
            pushIfNotExist(selectedRowKeys, key); this.table2.selectedRowKeys = selectedRowKeys;
            pushIfNotExist(selectedRows, record); this.table2.selectedRows = selectedRows;
            // this.table2.selectedRowKeys.push(key)
            // this.table2.selectedRows.push(record)
          }else{
            spliceIfExist(selectedRowKeys, key); this.table2.selectedRowKeys = selectedRowKeys;
            spliceIfExist(selectedRows, record, this.table2.rowKey); this.table2.selectedRows = selectedRows;
            // this.table2.selectedRowKeys.splice(this.table2.selectedRowKeys.indexOf(key), 1)
            // this.table2.selectedRows.splice(this.table2.selectedRows.indexOf(record), 1)
          }
        }
        // this.table2.selectedRowKeys = selectedRows.map(data=>{return data[this.table2.rowKey]})
        // this.table2.selectedRows = selectedRows
      },
      //主表清除已选
      onClearSelected1() {
        this.table1.selectedRowKeys = []
        this.table1.selectedRows = []
        this.table2.selectedRowKeys = []
        this.table2.selectedRows = []
      },
      //子表清除已选
      onClearSelected2() {
        this.table2.selectedRowKeys = []
        this.table2.selectedRows = []
      },
      //主表获取查询条件
      getQueryParams1() {
        //获取查询条件
        let sqp = {}
        if (this.table1.superQueryParams) {
          sqp['superQueryParams'] = encodeURI(this.table1.superQueryParams)
          sqp['superQueryMatchType'] = this.table1.superQueryMatchType
        }
        var param = Object.assign(sqp, this.table1.queryParams, this.table1.isorter, this.table1.filters)
        param.field = this.getQueryField1()
        param.pageNo = this.table1.ipagination.current
        param.pageSize = this.table1.ipagination.pageSize
        return filterObj(param)
      },
      //子表获取查询条件
      getQueryParams2() {
        //获取查询条件
        let sqp = {}
        if (this.table2.superQueryParams) {
          sqp['superQueryParams'] = encodeURI(this.table2.superQueryParams)
          sqp['superQueryMatchType'] = this.table2.superQueryMatchType
        }
        var param = Object.assign(sqp, this.table2.queryParams, this.table2.isorter, this.table2.filters)
        param.field = this.getQueryField2()
        param.pageNo = this.table2.ipagination.current
        param.pageSize = this.table2.ipagination.pageSize
        return filterObj(param)
      },
      //主表获取查询字段
      getQueryField1() {
        //TODO 字段权限控制
        var str = 'id'
        this.table1.columns.forEach(function(value) {
          str += ',' + value.dataIndex
        })
        return str
      },
      //子表获取查询字段
      getQueryField2() {
        //TODO 字段权限控制
        var str = 'id'
        this.table2.columns.forEach(function(value) {
          str += ',' + value.dataIndex
        })
        return str
      },
      modalFormOk1() {
        // 新增/修改 成功时，重载列表
        this.loadData1()
      },
      modalFormOk2() {
        // 新增/修改 成功时，重载列表
        this.loadData2()
      },
      //主表加载数据
      loadData1(arg) {
        if (!this.table1.url.list) {
          this.$message.error('请设置table1.url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          if(this.table1.ipagination){
            this.table1.ipagination.current = 1
          }
        }
        let params = this.getQueryParams1()//查询条件
        //params.id = this.currentTableId
        this.table1.loading = true
        getAction(this.table1.url.list, params).then((res) => {
          if (res.success) {
            if(this.table1.ipagination){
              if(!res.result.records instanceof Array){
                this.$message.error('设置table1返回数据不支持分页!')
                return
              }
              this.table1.dataSource = res.result.records //分页数据
              this.table1.ipagination.total = res.result.total
            }else{
              this.table1.ipagination = false
              this.table1.dataSource = res.result
            }
          }
          this.table1.loading = false
        })
      },
      //子表加载数据
      loadData2(arg, selected, callback) {
        if (!this.table2.url.list) {
          this.$message.error('请设置table2.url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          if(this.table2.ipagination){
            this.table2.ipagination.current = 1
          }
        }
        if (this.currentTableId === '') return
        let params = this.getQueryParams2()//查询条件
        params[this.table2.queryTableId] = this.currentTableId
        this.table2.loading = true
        getAction(this.table2.url.list, params).then((res) => {
          if (res.success) {
            // 待修改 20210629
            if(this.table2.ipagination){
              if(!res.result.records instanceof Array){
                this.$message.error('设置table2返回数据不支持分页!')
                return
              }
              this.table2.dataSource = res.result.records //分页数据
              this.table2.ipagination.total = res.result.total
            } else {
              this.table2.dataSource = res.result
              this.table2.ipagination = false
            }
            typeof callback === 'function' ? callback(selected) : ''
          }
          this.table2.loading = false
        })
      },
      handleOpen(record) {
        this.rightcolval = true
        this.currentTableId = record.id
        this.table1.selectedRowKeys = [record.id]
        this.loadData2()
      },
      searchQuery1() {
        this.loadData1(1)
      },
      searchReset1() {
        let queryParams = {};
        for(let item of this.table1.queryConfigs) {
          if (item.readOnly)  queryParams[item.key] = this.table1.queryParams[item.key];
        }
        this.table1.queryParams = queryParams
        //清空父子表已选
        this.table1.selectedRowKeys = [];
        this.table1.selectedRows = [];
        this.table2.selectedRowKeys = [];
        this.table2.selectedRows = [];
        this.loadData1(1)
      },
      searchQuery2() {
        this.loadData2(1)
      },
      searchReset2() {
        let queryParams = {};
        for(let item of this.table2.queryConfigs) {
          if (item.readOnly)  queryParams[item.key] = this.table2.queryParams[item.key];
        }
        this.table2.queryParams = queryParams
        //清空子表已选
        this.table2.selectedRowKeys = [];
        this.table2.selectedRows = [];
        this.loadData2(1)
      },
      //readonly为true，表示传入的有值参数不能修改。
      initQueryParams1(queryParams, readOnly = true) {
        let queryConfigs = [];
        for(let item of this.table1.queryConfigs) {
          item.readOnly = false;
          if (readOnly){
            for(let x in queryParams){
              if (item.key === x) {
                if (queryParams[x]) item.readOnly = queryParams[x]!=='';
                break;
              }
            }
          }
          queryConfigs.push(item);
        }
        this.table1.queryConfigs = queryConfigs;
        this.table1.queryParams = queryParams;
        
        console.log('initQueryParams1', this.table1.queryParams, this.table1.queryConfigs)
        this.loadData1();
      },
      //readonly为true，表示传入的有值参数不能修改。
      initQueryParams2(queryParams, readOnly = true) {
        let queryConfigs = [];
        for(let item of this.table2.queryConfigs) {
          item.readOnly = false;
          if (readOnly){
            for(let x in queryParams){
              if (item.key === x) {
                if (queryParams[x]) item.readOnly = queryParams[x]!=='';
                break;
              }
            }
          }
          queryConfigs.push(item);
        }
        this.table2.queryConfigs = queryConfigs;
        this.table2.queryParams = queryParams;
        console.log('initQueryParams2', this.table2.queryParams, this.table2.queryConfigs)
        this.loadData2();
      },
      //主表行被选中
      customRowFn1(record) {
        return {
          on: {
            click: () => {
              this.rightcolval = true
              this.currentTableId = record[this.table1.rowKey]
              this.loadData2()
              /* let key = record[this.table1.rowKey]
              let selectedRowKeys = JSON.parse(JSON.stringify(this.table1.selectedRowKeys))
              let selectedRows = JSON.parse(JSON.stringify(this.table1.selectedRows))
              if (!this.table1.multiSelectable) {
                this.table1.selectedRowKeys = [key]
                this.table1.selectedRows = [record]
              } else {
                let index = this.table1.selectedRowKeys.indexOf(key)
                if (index === -1) {
                  pushIfNotExist(selectedRowKeys, key); this.table1.selectedRowKeys = selectedRowKeys;
                  pushIfNotExist(selectedRows, record, this.table1.rowKey); this.table1.selectedRows = selectedRows;
                  // this.table1.selectedRowKeys.push(key)
                  // this.table1.selectedRows.push(record)
                } else {
                  spliceIfExist(selectedRowKeys, key); this.table1.selectedRowKeys = selectedRowKeys;
                  spliceIfExist(selectedRows, record, this.table1.rowKey); this.table1.selectedRows = selectedRows;
                  // this.handleDeleteSelected1(record, index)
                }
              }*/
              
            }
          }
        }
      },
      //子表行被选中
      customRowFn2(record) {
        return {
          on: {
            click: () => {
              let key = record[this.table2.rowKey]
              let selectedRowKeys = JSON.parse(JSON.stringify(this.table2.selectedRowKeys))
              let selectedRows = JSON.parse(JSON.stringify(this.table2.selectedRows))
              if (!this.table2.multiSelectable) {
                this.table2.selectedRowKeys = [key]
                this.table2.selectedRows = [record]
              } else {
                let index = this.table2.selectedRowKeys.indexOf(key)
                if (index === -1) {
                  pushIfNotExist(selectedRowKeys, key); this.table2.selectedRowKeys = selectedRowKeys;
                  pushIfNotExist(selectedRows, record, this.table2.rowKey); this.table2.selectedRows = selectedRows;
                  // this.table2.selectedRowKeys.push(key)
                  // this.table2.selectedRows.push(record)
                } else {
                  spliceIfExist(selectedRowKeys, key); this.table2.selectedRowKeys = selectedRowKeys;
                  spliceIfExist(selectedRows, record, this.table2.rowKey); this.table2.selectedRows = selectedRows;
                  // this.handleDeleteSelected2(record, index)
                }
              }
            }
          }
        }
      },
      /** 删除已选择的 */
      handleDeleteSelected1(record, index) {
        this.table1.selectedRowKeys.splice(this.table1.selectedRowKeys.indexOf(record[this.table1.rowKey]), 1)
        //update--begin--autor:wangshuai-----date:20200722------for：JSelectBizComponent组件切换页数值问题------
        this.table1.selectedRows.splice(this.table1.selectedRows.indexOf(record), 1)
        // this.innerValue.splice(this.innerValue.indexOf(record[this.valueKey]), 1)
        console.log("this.table1.selectedRowKeys:",this.table1.selectedRowKeys)
        console.log("this.table1.selectedRows.:",this.table1.selectedRows)
        //update--begin--autor:wangshuai-----date:20200722------for：JSelectBizComponent组件切换页数值问题------
      },
      /** 删除已选择的 */
      handleDeleteSelected2(record, index) {
        this.table2.selectedRowKeys.splice(this.table2.selectedRowKeys.indexOf(record[this.table2.rowKey]), 1)
        //update--begin--autor:wangshuai-----date:20200722------for：JSelectBizComponent组件切换页数值问题------
        this.table2.selectedRows.splice(this.table2.selectedRows.indexOf(record), 1)
        // this.innerValue.splice(this.innerValue.indexOf(record[this.valueKey]), 1)
        console.log("this.table2.selectedRowKeys:",this.table2.selectedRowKeys)
        console.log("this.table2.selectedRows.:",this.table2.selectedRows)
        //update--begin--autor:wangshuai-----date:20200722------for：JSelectBizComponent组件切换页数值问题------
      },
      handleTableChange1(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.table1.isorter.column = sorter.field
          this.table1.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.table1.ipagination = pagination
        this.loadData1()
      },
      handleTableChange2(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.table2.isorter.column = sorter.field
          this.table2.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
        }
        this.table2.ipagination = pagination
        this.loadData2()
      },
      handleOk(){
        // console.log("handleOk",this.selectedRowKeys,this.selectedRows)
        console.log("table1 handleOk",this.table1.selectedRowKeys,this.table1.selectedRows)
        console.log("table2 handleOk",this.table2.selectedRowKeys,this.table2.selectedRows)
        // console.log("handleOk",this.table1.selectedRowKeys,this.table1.selectedRows,this.table2.selectedRowKeys,this.table2.selectedRows)
        this.$emit("callback", this.table1.selectedRowKeys, this.table1.selectedRows, this.table2.selectedRowKeys, this.table2.selectedRows);
      },
      
    }
  }
</script>
<style scoped>
  /** Button按钮间距 */
  .ant-btn {
    margin-left: 8px
  }
</style>