# MainSubTableSelectModal

Jeecg 选择组件的公共可复用组件-主子表选择器


## 引用方式

```js
import MainSubTableSelectModal from '../../MainSubTableSelectModal'

export default {
  components: { MainSubTableSelectModal }
}
```

```html

<a-button @click="handleBatchNoSelect()" icon="plus" type="primary">选择</a-button>
<main-sub-table-select-modal ref="selectModal" :tables="params.tables" 
@callback="(selectedRowKeys1,selectedRows1,selectedRowKeys2,selectedRows2)=>handleBatchNoSelectCallback()"/>
```

```js
  handleBatchNoSelect()方法处理打开选择器前，进行sql参数传入（queryParams），判断表单是否填写必填项，最后打开选择器模态框
  handleBatchNoSelectCallback()方法处理选择完后回调，将已选内容填写到表单中

```
## 配置实例
```js
data() {
  
  return{
    tables: {
      
      table1: { ### 必填
        multiSelectable: true, ### 非必填，默认单选
        selectedRowKeys: [], ### 必填，记录已经选择的key值
        selectedRows: [], ### 必填，记录已经选择的项
        props: { ### 必填
          column: {
              ### 选择器中主表字段
              orgFields: "materialId,materialCode,materialUnit,materialModel,materialCost,inventoryNum",
              ### 表单中填写字段
              destFields: "materialId,materialCode,materialUnit,materialModel,materialPrice,inventoryNum",
          },
        },
        columns: [ ### 展示字段，必填
          {
            title: '订单编号',
            align: 'center',
            dataIndex: 'billNo'
          },
          {
            title: '采购日期',
            align: 'center',
            dataIndex: 'purchaseTime'
          },
          {
            title: '付款金额',
            align: 'center',
            dataIndex: 'payMoney'
          },
        ],
        queryParams: { ### 查询参数，非必填，此项为多条件动态查询参数绑定，用于表格条件查询
          
        },
        queryConfigs: [ ### 查询配置，非必填，此项为选择器多条件动态查询，需要正确填写对应表格对应字段dataIndex值,带有字典解释的字段dataIndex需要去掉_dictText
          {
            key: 'billNo',
            label: '订单编号',
          },
          {
            key: 'supplierId',
            label: '供应商',
          },
        ],
        url: { ### 数据查询url，如果该查询不支持分页，请将分页关闭->ipagination: false, 否则报错
          list: '/purchaseMaterialBill/purchaseMaterialBill/list'
        },
        
      },
      table2: {
        sourceTableId: 'sourceBillId', ### 必填，子表字段中，关联主表id字段key值（子表特殊参数）
        queryTableId: 'id', ### 必填，子表字段中，查询子表数据参数，记录当前上级表格id（子表特殊参数）
        ipagination: false, ### 非必填，关闭分页
        multiSelectable: true, ### 非必填，是否多选，默认单选
        selectedRowKeys: [], ### 必填，记录已经选择的key值
        selectedRows: [], ### 必填，记录已经选择项
        props: { ### 必填
          column: {
              ### 选择器中主表字段
              orgFields: "materialId,materialCode,materialUnit,materialModel,materialCost,inventoryNum",
              ### 表单中填写字段
              destFields: "materialId,materialCode,materialUnit,materialModel,materialPrice,inventoryNum",
          },
        },
        columns: [ ### 展示字段，必填
          {
            title: '材料编号',
            align: 'center',
            dataIndex: 'materialCode'
          },
          {
            title: '计量单位',
            align: 'center',
            dataIndex: 'materialUnit'
          },
          {
            title: '规格型号',
            align: 'center',
            dataIndex: 'materialModel'
          },
        ],
        queryConfigs: [ ### 查询配置，非必填，此项为选择器多条件动态查询，需要正确填写对应表格对应字段dataIndex值,带有字典解释的字段dataIndex需要去掉_dictText
          {
            key: 'materialCode',
            label: '材料编号',
          },
        ],
        url: { ### 数据查询url，如果该查询不支持分页，请将分页关闭->ipagination: false, 否则报错
          list: '/purchaseMaterialBill/purchaseMaterialBill/queryPurchaseMaterialBillDetailByMainId'
        },
        
      },
      
    },
  }
  
}

```

## 参数

### 配置参数

唯一参数 tables:{ table1:{}, table2:{}}
唯一回调 callback(selectedRowKeys1, selectedRows1, selectedRowKeys2, selectedRows2)
#### table1配置参数
| 参数名                | 类型    | 必填 | 默认值       | 备注                                                                                 |
|-----------------------|---------|------|--------------|--------------------------------------------------------------------------------------|
| rowKey                | String  |      | "id"         | 唯一标识的字段名                                                                     |
| columns               | Array   | 是   | []           | 表格显示字段， 与antd的table的配置完全一致。                                          |
| queryParams           | Object  |      | {}           | 此项为多条件动态查询参数绑定,与queryConfigs绑定使用                                   |
| queryConfigs          | Array   |      | []           | 表格内部查询字段，筛选表格内容,需要正确填写对应表格对应colmuns字段dataIndex值           |
| dataSource            | Object  |      | {}           | 表格数据集，组件通过用户配置的url数据查询封装到dataSource                              |
| ipagination           | Object  |      |              | 表格分页器，需要dataSource返回分页参数，否则报错                                      | 
| isorter               | Object  |      | `查看示例`   | 表格数据查询排序字段，会自动配街道查询参数上                                           |
| filters               | Object  |      | `查看示例`   | 表格过滤字段，暂未使用                                                                |
| loading               | boolean |      | false        | 表格加载状态                                                                         |
| showMoreQueryItems    | boolean |      | false        | 是否显示查询参数，显示为queryConfigs配置的查询项                                      |
| multiSelectable       | boolean |      | false        | 是否可多选，默认为否                                                                  |
| selectedRowKeys       | Array   | 是   | []           | 表格回显已选key值                                                                    |
| selectedRows         | Array   | 是   | []           | 表格回显已选项                                                                       |
| url                   | String  | 是   | ""           | 表格数据集查询url                                                                    |

#### table2配置参数
| 参数名                | 类型    | 必填 | 默认值       | 备注                                                                                 |
|-----------------------|---------|------|--------------|--------------------------------------------------------------------------------------|
| sourceTableId          | String  | 是   | "id"        | 子表标识主表id字段                                                                  |
| queryTableId          | String  | 是   | "id"         | 子表查询数据id,记录当前选中的主表id,通过子表方法查询为'sourceBillId'，通过主表查询为'id' |
| rowKey                | String  |      | "id"         | 唯一标识的字段名                                                                     |
| columns               | Array   | 是   | []           | 表格显示字段， 与antd的table的配置完全一致。                                          |
| queryParams           | Object  |      | {}           | 此项为多条件动态查询参数绑定,与queryConfigs绑定使用                                   |
| queryConfigs          | Array   |      | []           | 表格内部查询字段，筛选表格内容,需要正确填写对应表格对应colmuns字段dataIndex值            |
| dataSource            | Object  |      | {}           | 表格数据集，组件通过用户配置的url数据查询封装到dataSource                              |
| ipagination           | Object  |      |              | 表格分页器，需要dataSource返回分页参数，否则报错                                      | 
| isorter               | Object  |      | `查看示例`   | 表格数据查询排序字段，会自动配街道查询参数上                                           |
| filters               | Object  |      | `查看示例`   | 表格过滤字段，暂未使用                                                                |
| loading               | boolean |      | false        | 表格加载状态                                                                         |
| showMoreQueryItems    | boolean |      | false        | 是否显示查询参数，显示为queryConfigs配置的查询项                                      |
| multiSelectable       | boolean |      | false        | 是否可多选，默认为否                                                                  |
| selectedRowKeys       | Array   | 是   | []           | 表格回显已选key值                                                                    |
| selectedRows         | Array   | 是   | []           | 表格回显已选项                                                                       |
| url                   | String  | 是   | ""           | 表格数据集查询url                                                                    |


##### 组件tables默认配置，props传值会将props对象中配置属性覆盖组件默认值
```js
  //主表
  table1: {
    //表格key值
    rowKey: 'id',
    //主表展示字段
    columns: [],
    //子表查询条件
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
    sourceTableId: '',
    //子表查询id
    queryTableId: '',
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
```