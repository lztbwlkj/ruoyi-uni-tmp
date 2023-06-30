<template>
  <view class="da-tree">
    <scroll-view class="da-tree-scroll" :scroll-y="true" :scroll-x="false">
      <view
        class="da-tree-item"
        :class="{'is-show': item.show}"
        :style="{paddingLeft:item.level * indent + (item.isLeaf ? 40 : 0) + 'rpx'}"
        v-for="item in datalist"
        :key="item.key">
        <view
          v-show="!item.isLeaf"
          class="da-tree-item__icon"
          @click="handleExpandedChange(item)">
          <slot name="expand-icon" :data="{ expanded: item.expand }"><view :class="['da-tree-item__icon--arr','da-tree-arrow-down', {'is-right':!item.expand}]" /></slot>
        </view>
        <view
          class="da-tree-item__checkbox"
          :class="[`da-tree-item__checkbox--${checkboxPlacement}`]"
          v-if="showCheckbox || showRadioIcon"
          @click="handleCheckChange(item)">
          <template v-if="showCheckbox">
            <view class="da-tree-item__checkbox--icon da-tree-checkbox-checked" v-if="item.checkedStatus === isCheckedStatus" />
            <view class="da-tree-item__checkbox--icon da-tree-checkbox-indeterminate" v-else-if="item.checkedStatus === halfCheckedStatus" />
            <view class="da-tree-item__checkbox--icon da-tree-checkbox-outline" v-else />
          </template>
          <template v-else-if="showRadioIcon">
            <view class="da-tree-item__checkbox--icon da-tree-radio-checked" :class="{'is--disabled': !item.isLeaf&&onlyRadioLeaf}" v-if="item.checkedStatus === isCheckedStatus" />
            <view class="da-tree-item__checkbox--icon da-tree-radio-indeterminate" :class="{'is--disabled': !item.isLeaf&&onlyRadioLeaf}" v-else-if="item.checkedStatus === halfCheckedStatus" />
            <view class="da-tree-item__checkbox--icon da-tree-radio-outline" :class="{'is--disabled': !item.isLeaf&&onlyRadioLeaf}" v-else />
          </template>
        </view>
        <view class="da-tree-item__label" :class="'da-tree-item__label--'+item.checkedStatus" @click="handleCheckChange(item,'item')">
         <!-- <view class="da-tree-item__label--prefix">
            <slot name="prefix" :data="item"></slot>
          </view> -->
          <slot name="label" :data="item">{{ item.label }}</slot>
          <!-- <view class="da-tree-item__label--suffix">
            <slot name="suffix" :data="item"></slot>
          </view> -->
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {
  unCheckedStatus,
  halfCheckedStatus,
  isCheckedStatus,
} from './utils'

export default {
  name: 'DaTreeVue2',
  props: {
    /**
     * 树的数据
     */
    data: {
      type: Array,
      default: () => [],
    },
    /**
     * 默认选中的节点，注意单选时为单个key，多选时为key的数组
     */
    defaultCheckedKeys: {
      type: [Array, String, Number],
      default: null,
    },
    /**
     * 选择框的位置，可选 left/right
     */
    checkboxPlacement: {
      type: String,
      default: 'left',
    },
    /**
     * 是否默认展开全部
     */
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    /**
     * 默认展开的节点
     */
    defaultExpandedKeys: {
      type: Array,
      default: null,
    },
    /**
     * 子项缩进距离，默认40，单位rpx
     */
    indent: {
      type: Number,
      default: 40,
    },
    /**
     * 字段对应内容，默认为 {label: 'label',key: 'key', children: 'children'}
     */
    field: {
      type: Object,
      default: null,
    },
    /**
     * 是否开启多选，默认单选
     */
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示单选图标，默认显示
     */
    showRadioIcon: {
      type: Boolean,
      default: true,
    },
    /**
     * 单选时只允许选中末级，默认可随意选中
     */
    onlyRadioLeaf: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      unCheckedStatus,
      halfCheckedStatus,
      isCheckedStatus,
      /** 处理后的树数据 */
      treeDatalist: [],
      /** 处理后的一维树项数据 */
      datalist: [],
      /** 处理后的以key为键值的树项数据 */
      datamap: {},
      /** 默认的展开数据 */
      expandedKeys: [],
      /** 默认的已选数据 */
      checkedKeys: null,
    }
  },
  watch: {
    defaultExpandedKeys: {
      // deep: true,
      immediate: true,
      handler: function(v) {
        this.expandedKeys = v
        if (v?.length) {
          this.checkInitData(this.datalist)
        }
      },
    },
    defaultCheckedKeys: {
      // deep: true,
      immediate: true,
      handler: function(v) {
        if (v) {
          this.checkedKeys = v
        }
        if (v || v === 0) {
          this.checkInitData(this.datalist)
        }
      },
    },
    data: {
      // deep: true,
      immediate: true,
      handler: function(v) {
        this.initData(v)
      },
    },
  },
  methods: {
    /**
     * 初始化内容
     * @param treeData
     */
    initData(treeData) {
      if (!this.data || this.data.length === 0) {
        this.treeDatalist = []
        this.datalist = []
        return
      }
      const newDatalist = []

      const handleTreeData = (data, parent = null, level = 0) => {
        return data.reduce((p, item) => {
          const key = item[this.field?.key || 'key']
          const label = item[this.field?.label || 'label']
          const children = item[this.field?.children || 'children']
		  
          const hasChildren = children && children.length > 0
		  
          const isLeaf = !hasChildren 
		  
		  
          const parentKey = parent ? parent.key : null
          const show = this.defaultExpandAll ? true : level === 0

          const newItem = {
            key,
            parentKey,
            label,
            isLeaf,
            level,
            expand: this.defaultExpandAll,
            show,
            checkedStatus: unCheckedStatus,
            parentKeys: [],
            childrenKeys: [],
            children: [],
            originItem: item,
          }

          if (parent) {
            newItem.parentKeys = [parent.key, ...parent.parentKeys]
          }

          newDatalist.push(newItem)
          this.datamap[key] = newItem

          if (hasChildren) {
            const childrenData = handleTreeData(children, newItem, level + 1)
            const childrenKeys = childrenData.reduce((p, k) => {
              const keys = k.childrenKeys
              p.push(...keys, k.key)
              return p
            }, [])
            newItem.children = childrenData
            newItem.childrenKeys = childrenKeys
          }
          p.push(newItem)
          return p
        }, [])
      }

      // clean tree
      this.treeDatalist = handleTreeData(treeData)
      // flat tree
      this.datalist = this.checkInitData(newDatalist)
      // console.log('init treeDatalist', treeDatalist.value)
      // console.log('init datalist', datalist.value)
      // console.log('init datamap', datamap.value)
    },
    /**
     * 处理初始化内容
     * @param list
     */
    checkInitData(list) {
      const checkedKeyList = this.checkedKeys
      const expandedKeyList = this.expandedKeys
      let lightItem = null
      const expandParentNode = (item) => {
        if (item?.parentKeys?.length) {
          item.parentKeys.forEach(pk => {
            if (!this.datamap[pk].expand) {
              this.datamap[pk].expand = true
            }
          })
        }
      }

      for (let i = 0; i < list.length; i++) {
        const item = list[i]

        // 处理初始展开
        if (!this.defaultExpandAll && expandedKeyList?.includes(item.key)) {
          item.expand = true
          expandParentNode(item)
        }

        // 处理初始选中
        if (this.showCheckbox) {
          if (checkedKeyList?.includes(item.key)) {
            expandParentNode(item)
            this.handleCheckChange(item, 'checkbox', true)
          }
        } else {
          if (item.key === checkedKeyList) {
            expandParentNode(item)
            lightItem = item
          }
        }
      }

      // 处理默认初始单选
      if (lightItem && !this.showCheckbox) {
        this.handleCheckChange(lightItem, 'item', true)
      }

      // 处理初始显示
      if (!this.defaultExpandAll) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          if (item.level > 0) {
            const parentItem = this.datamap[item.parentKey]
            if (parentItem.expand && parentItem.show || parentItem.checkedStatus === halfCheckedStatus) {
              // if (parentItem.checkedStatus === halfCheckedStatus) {
              //   item.expand = true
              // }
              item.show = true
            }
          } else {
            if (item.checkedStatus === halfCheckedStatus) {
              item.expand = true
            }
          }
        }
      }

      return list
    },

    /**
     * 点击选框
     * @param item
     */
    handleCheckChange(item, type = 'checkbox', init = false) {
      const { childrenKeys, parentKeys } = item
      // const { showCheckbox, onlyRadioLeaf } = props

      // 不支持多选时点击项
      if (type === 'item' && this.showCheckbox) {
        return
      }

      // 单选-重置所有选择
      if (!this.showCheckbox) {
        if (this.onlyRadioLeaf && !item.isLeaf) {
          return
        }
        if (this.datalist?.length) {
          for (let i = 0; i < this.datalist.length; i++) {
            const k = this.datalist[i]
            k.checkedStatus = unCheckedStatus
          }
        }
      }

      // 当前
      item.checkedStatus = item.checkedStatus === isCheckedStatus ? unCheckedStatus : isCheckedStatus

      // 子类
      if (this.showCheckbox) {
        childrenKeys.forEach(k => {
          const childrenItem = this.datamap[k]
          childrenItem.checkedStatus = item.checkedStatus
        })
      }

      // 父类
      parentKeys.forEach(k => {
        const parentItem = this.datamap[k]
        parentItem.checkedStatus = this.getParentCheckedStatus(parentItem)
      })

      if (this.showCheckbox) {
        this.checkedKeys = []
        for (let i = 0; i < this.datalist.length; i++) {
          const k = this.datalist[i]
          if (k.checkedStatus === isCheckedStatus) {
            this.checkedKeys.push(k.key)
          }
        }
      } else {
        this.checkedKeys = item.key
      }

      // 初始化时不返回选中内容
      if (init) {
        return
      }

      this.$emit('change', this.checkedKeys, item.originItem)
    },

    /**
     * 点击展开收起
     * @param item
     */
    handleExpandedChange(item) {
      if (item.childrenKeys?.length) {
        item.childrenKeys.forEach(k => {
          if (this.datamap[k]) {
            this.datamap[k].show = !item.expand
          }
        })
      }

      item.expand = !item.expand

      this.$emit('expand', item.expand, item.originItem)
    },

    /**
     * 获取父类的选中状态
     * @param item
     */
    getParentCheckedStatus(item) {
      if (!item) {
        return unCheckedStatus
      }

      const children = item.children
      // 单选时，父类永远为半选
      if (!this.showCheckbox) {
        return halfCheckedStatus
      }

      // 子类全选中
      const childrenCheckedAll = children.every(k => k.checkedStatus === isCheckedStatus)
      if (childrenCheckedAll) {
        return isCheckedStatus
      }

      // 子类全不选中
      const childrenUncheckedAll = children.every(k => k.checkedStatus === unCheckedStatus)
      if (childrenUncheckedAll) {
        return unCheckedStatus
      }

      return halfCheckedStatus
    },

    /**
     * 获取所有指定的节点
     * @param type
     * @param value
     */
    getAllNodes(type, value) {
      const list = this.datalist
      if (!list || list.length === 0) {
        return []
      }

      const res = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item[type] === value) {
          res.push(item)
        }
      }

      return res
    },

    /**
     * 获取所有指定的key值
     * @param type
     * @param value
     */
    getAllNodeKeys(type, value) {
      const list = this.datalist
      if (!list || list.length === 0) {
        return []
      }

      const res = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item[type] === value) {
          res.push(item.key)
        }
      }

      return res
    },
    getCheckedKeys: () => this.getAllNodeKeys('checkedStatus', isCheckedStatus),
    getHalfCheckedKeys: () => this.getAllNodeKeys('checkedStatus', halfCheckedStatus),
    getExpandedKeys: () => this.getAllNodeKeys('expand', true),
    getCheckedNodes: () => this.getAllNodes('checkedStatus', isCheckedStatus),
    getHalfCheckedNodes: () => this.getAllNodes('checkedStatus', halfCheckedStatus),
    getExpandedNodes: () => this.getAllNodes('expand', true),
  },
}
</script>

<style lang="scss" scoped>
.da-tree {
  width: 100%;
  height: 100%;

  &-scroll {
    width: 100%;
    height: 100%;
  }

  &-item {
    display: flex;
    align-items: center;
    height: 0;
    padding: 0;
    overflow: hidden;
    font-size: 28rpx;
    line-height: 1;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s linear;

    &.is-show {
      height: auto;
      padding: 12rpx 24rpx;
      visibility: visible;
      opacity: 1;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40rpx;
      height: 40rpx;
      overflow: hidden;

      &--arr {
        width: 20rpx;
        height: 20rpx;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;

        &.is-right {
          transform: rotate(-90deg);
        }
      }
    }

    &__checkbox {
      width: 40rpx;
      height: 40rpx;
      overflow: hidden;

      &--left {
        order: 0;
      }

      &--right {
        order: 1;
      }

      &--icon {
        width: 40rpx;
        height: 40rpx;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;

        &.is--disabled {
          opacity: 0.2;
        }
      }
    }

    &__label {
      flex: 1;
      margin-left: 4rpx;
      color: #555;

      &--2 {
        color: #007aff;
      }
    }
  }
}

// 灰色三角
.da-tree-arrow-down {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDE3MDcgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjEzLjM3NSIgaGVpZ2h0PSIxMjgiPjxwYXRoIGQ9Ik0xMjIuODcgMi4yMjRMODUxLjk4NyAwbDczMi45MzMgNi40NzJjNDQuNTUzIDAgODMuNzE4IDIuNDExIDk2LjczMSAxMi4zNzUgMzEuNDIgMjQuMDU0IDI3Ljk4NiA3My4xODQgMCAxMDEuMDQ2TDkwNS44NzQgOTY5LjM1N2MtMTQuNzg3IDE0Ljg1LTM0LjUyNCAyMS4yLTUzLjk0NiAyMC4yNDYtMTkuNDI2Ljk1Ni0zOS4xMDEtNS4zOTUtNTMuOTUyLTIwLjI0NkwyMi4yIDExOS44OTVjLTI3LjkyMi0yNy44NjItMzAuOTctNzYuNTQzIDAtMTAwLjk4QzM2LjYwOCA3LjU1MiA2MS42ODQgMi4yMjQgMTIyLjg3IDIuMjI0eiIgZmlsbD0iIzhhOGE4YSIvPjwvc3ZnPg==');
}

// 多选-灰色选择边框
.da-tree-checkbox-outline {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTgwOS45ODQgMTI4cTM0LjAwNSAwIDU5Ljk5IDI1Ljk4NHQyNS45ODMgNTkuOTl2NTk2LjAxcTAgMzQuMDA1LTI1Ljk4NCA1OS45OXQtNTkuOTg5IDI1Ljk4M2gtNTk2LjAxcS0zNC4wMDYgMC01OS45OS0yNS45ODRUMTI4IDgwOS45ODR2LTU5Ni4wMXEwLTM0LjAwNiAyNS45ODQtNTkuOTlUMjEzLjk3NCAxMjhoNTk2LjAxem0wIDg2LjAxNmgtNTk2LjAxdjU5Ni4wMWg1OTYuMDF2LTU5Ni4wMXoiIGZpbGw9IiM4YThhOGEiLz48L3N2Zz4=');

  // 颜色太深了，减淡一点
  opacity: 0.4;
}

// 多选-蓝色选中
.da-tree-checkbox-checked {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTQyNS45ODQgNzI2LjAxNmwzODQtMzg0LTU5Ljk5LTYxLjk5NS0zMjQuMDEgMzI0LjAxMS0xNTIuMDIxLTE1Mi4wMjFMMjEzLjk3MyA1MTJ6bTM4NC01OTguMDE2cTM2LjAxIDAgNjEuMDEzIDI1Ljk4NFQ4OTYgMjEzLjk3NHY1OTYuMDFxMCAzNC4wMDUtMjUuMDAzIDU5Ljk5dC02MS4wMTMgMjUuOTgzaC01OTYuMDFxLTM2LjAxMSAwLTYxLjAxNC0yNS45ODR0LTI1LjAwMy01OS45ODl2LTU5Ni4wMXEwLTM0LjAwNiAyNS4wMDMtNTkuOTlUMjEzLjk3MyAxMjhoNTk2LjAxMXoiIGZpbGw9IiMwMDdhZmYiLz48L3N2Zz4=');
}

// 多选-蓝色半选中
.da-tree-checkbox-indeterminate {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTcyNi4wMTYgNTUzLjk4NHYtODQuMDFoLTQyNy45OXY4NC4wMWg0MjcuOTl6TTgwOS45ODQgMTI4cTM0LjAwNSAwIDU5Ljk5IDI1Ljk4NHQyNS45ODMgNTkuOTl2NTk2LjAxcTAgMzQuMDA1LTI1Ljk4NCA1OS45OXQtNTkuOTg5IDI1Ljk4M2gtNTk2LjAxcS0zNC4wMDYgMC01OS45OS0yNS45ODRUMTI4IDgwOS45ODR2LTU5Ni4wMXEwLTM0LjAwNiAyNS45ODQtNTkuOTlUMjEzLjk3NCAxMjhoNTk2LjAxeiIgZmlsbD0iIzAwN2FmZiIvPjwvc3ZnPg==');
}

// 单选-灰色选择边框
.da-tree-radio-outline {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTUxMiA4NTQuMDE2cTEzOS45OSAwIDI0MC45ODEtMTAwLjk5MnQxMDAuOTkyLTI0MC45ODFUNzUyLjk4MSAyNzEuMDYgNTEyIDE3MC4wNyAyNzEuMDE5IDI3MS4wNjEgMTcwLjAyNyA1MTIuMDQzdDEwMC45OTIgMjQwLjk4MVQ1MTIgODU0LjAxNnptMC03NjhxMTc2IDAgMzAxLjAxMyAxMjUuMDEzdDEyNS4wMTQgMzAxLjAxNC0xMjUuMDE0IDMwMS4wMTNUNTEyIDkzOC4wNjkgMjEwLjk4NyA4MTMuMDU2IDg1Ljk3MyA1MTIuMDQzdDEyNS4wMTQtMzAxLjAxNFQ1MTIgODYuMDE2eiIgZmlsbD0iIzhhOGE4YSIvPjwvc3ZnPg==');

  // 颜色太深了，减淡一点
  opacity: 0.4;
}

// 单选-蓝色选中
.da-tree-radio-checked {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTUxMiA4NTQuMDE2cTEzOS45OSAwIDI0MC45ODEtMTAwLjk5MnQxMDAuOTkyLTI0MC45ODFUNzUyLjk4MSAyNzEuMDYgNTEyIDE3MC4wNyAyNzEuMDE5IDI3MS4wNjEgMTcwLjAyNyA1MTIuMDQzdDEwMC45OTIgMjQwLjk4MVQ1MTIgODU0LjAxNnptMC03NjhxMTc2IDAgMzAxLjAxMyAxMjUuMDEzdDEyNS4wMTQgMzAxLjAxNC0xMjUuMDE0IDMwMS4wMTNUNTEyIDkzOC4wNjkgMjEwLjk4NyA4MTMuMDU2IDg1Ljk3MyA1MTIuMDQzdDEyNS4wMTQtMzAxLjAxNFQ1MTIgODYuMDE2em0wIDIxMS45NjhxODguMDIxIDAgMTUwLjk5NyA2My4wMTlUNzI2LjAxNiA1MTJ0LTYzLjAxOSAxNTAuOTk3VDUxMiA3MjYuMDE2dC0xNTAuOTk3LTYzLjAxOVQyOTcuOTg0IDUxMnQ2My4wMTktMTUwLjk5N1Q1MTIgMjk3Ljk4NHoiIGZpbGw9IiMwMDdhZmYiLz48L3N2Zz4=');
}

// 单选-蓝色半选中
.da-tree-radio-indeterminate {
  background-image: url('data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTY0MCA1MTJxMCA1Mi4wMS0zOC4wMTYgODkuOTg0VDUxMiA2NDB0LTg5Ljk4NC0zOC4wMTZUMzg0IDUxMnQzOC4wMTYtODkuOTg0VDUxMiAzODR0ODkuOTg0IDM4LjAxNlQ2NDAgNTEyek01MTIgODU0LjAxNnExMzkuOTkgMCAyNDAuOTgxLTEwMC45OTJ0MTAwLjk5Mi0yNDAuOTgxVDc1Mi45ODEgMjcxLjA2IDUxMiAxNzAuMDcgMjcxLjAxOSAyNzEuMDYxIDE3MC4wMjcgNTEyLjA0M3QxMDAuOTkyIDI0MC45ODFUNTEyIDg1NC4wMTZ6bTAtNzY4cTE3NiAwIDMwMS4wMTMgMTI1LjAxM3QxMjUuMDE0IDMwMS4wMTQtMTI1LjAxNCAzMDEuMDEzVDUxMiA5MzguMDY5IDIxMC45ODcgODEzLjA1NiA4NS45NzMgNTEyLjA0M3QxMjUuMDE0LTMwMS4wMTRUNTEyIDg2LjAxNnoiIGZpbGw9IiMwMDdhZmYiLz48L3N2Zz4=');
}
</style>
