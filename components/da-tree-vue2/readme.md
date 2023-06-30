# da-tree-vue2

一个基于 Vue2 的 tree(树)组件，可能是最适合你的 tree(树)组件

内容同步于 Vue3 版本，在此查看 ===> **[Vue3 版](https://ext.dcloud.net.cn/plugin?id=12384)**

_与 Vue3 版本版本不同的是，此版本兼容更全面，比如 360 小程序、快应用等均支持_

### 关于使用

可在右侧的`使用 HBuilderX 导入插件`或`下载示例项目ZIP`，方便快速上手。

可通过下方的示例及文档说明，进一步了解使用组件相关细节参数。

插件地址：https://ext.dcloud.net.cn/plugin?id=12384

### 组件示例

```vue
<template>
  <div>
    <div>多选</div>
    <DaTreeVue2
      :data="roomTreeData"
      :field="{ label: 'name', key: 'id' }"
      defaultExpandAll
      showCheckbox
      :defaultCheckedKeys="defaultCheckedKeysValue"
      @change="handleTreeChange"
      @expand="handleExpandChange" />
    <div>单选</div>
    <DaTreeVue2
      :data="roomTreeData"
      :field="{ label: 'name', key: 'id' }"
      defaultExpandAll
      :defaultCheckedKeys="defaultCheckedKeysValue2"
      @change="handleTreeChange"
      @expand="handleExpandChange" />
    <div>默认展开指定节点</div>
    <DaTreeVue2
      :data="roomTreeData"
      :field="{ label: 'name', key: 'id' }"
      showCheckbox
      :defaultExpandedKeys="defaultExpandKeysValue3"
      @change="handleTreeChange"
      @expand="handleExpandChange" />
  </div>
</template>
```

```js
import DaTreeVue2 from '@/components/da-tree-vue2/index.vue'

export default {
  components: { DaTreeVue2 },
  data() {
    return {
      // key的类型必须对应树数据key的类型
      defaultCheckedKeysValue: ['211', '222'],
      defaultCheckedKeysValue2: '222',
      defaultExpandKeysValue3: ['212', '231'],
      roomTreeData: [
        {
          id: '2',
          name: '行政中心',
          children: [
            {
              id: '21',
              name: '行政部',
              children: [
                {
                  id: '211',
                  name: '行政一部',
                },
                {
                  id: '212',
                  name: '行政二部',
                },
              ],
            },
            {
              id: '22',
              name: '财务部',
              children: [
                {
                  id: '221',
                  name: '财务一部',
                },
                {
                  id: '222',
                  name: '财务二部',
                },
              ],
            },
            {
              id: '23',
              name: '人力资源部',
              children: [
                {
                  id: '231',
                  name: '人力一部',
                },
                {
                  id: '232',
                  name: '人力二部',
                },
              ],
            },
          ],
        },
      ],
    }
  },
  methods: {
    handleTreeChange(allSelectedKeys, currentItem) {
      console.log('handleTreeChange ==>', allSelectedKeys, currentItem)
    },
    handleExpandChange(expand, currentItem) {
      console.log('handleExpandChange ==>', expand, currentItem)
    },
  },
}
```

** 更多示例请下载/导入示例项目 ZIP 查看 **

### 组件参数

| 属性                | 类型                            | 默认值  | 必填 | 说明                                                                |
| :------------------ | :------------------------------ | :------ | :--- | :------------------------------------------------------------------ |
| data                | `Array`                         | -       | 是   | 树的数据                                                            |
| defaultCheckedKeys  | `Array` \| `Number` \| `String` | -       | 否   | 默认选中的节点，单选为单个 key，多选为 key 的数组                   |
| showCheckbox        | `Boolean`                       | `false` | 否   | 是否开启多选，默认单选                                              |
| field               | `Object`                        | -       | 否   | 字段对应内容，格式为`{label:'label',key:'key',children:'children'}` |
| showRadioIcon       | `Boolean`                       | `true`  | 否   | 是否显示单选图标，默认显示                                          |
| onlyRadioLeaf       | `Boolean`                       | `true`  | 否   | 单选时只允许选中末级，默认可随意选中                                |
| defaultExpandAll    | `Boolean`                       | `false` | 否   | 是否默认展开全部                                                    |
| defaultExpandedKeys | `Array`                         | -       | 否   | 默认展开的节点                                                      |
| indent              | `Number`                        | `40`    | 否   | 子项缩进距离，单位 rpx                                              |
| checkboxPlacement   | `String`                        | `left`  | 否   | 选择框的位置，可选 left/right                                       |

### 组件事件

| 事件名称 | 回调参数                                | 说明            |
| :------- | :-------------------------------------- | :-------------- |
| change   | `(allCheckedKeys, currentItem) => void` | 选中时回调      |
| expand   | `(expandState, currentItem) => void`    | 展开/收起时回调 |

### 组件版本

v1.0.5

### 差异化

已通过测试

> - H5 页面
> - 微信小程序
> - 支付宝、钉钉小程序
> - 字节跳动、抖音、今日头条小程序
> - 百度小程序
> - 飞书小程序
> - QQ 小程序
> - 飞书小程序
> - 快应用
> - 360 小程序

未测试

> - 京东、快手小程序由于非企业用户暂无演示
