<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" :icon="Plus" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel(chooseData)">
          <template #reference>
            <el-button type="danger" :icon="Delete" :disabled="chooseData.length === 0">{{ $t('message.common.delBat') }}</el-button>
          </template>
        </el-popconfirm>
      </div>
      <div class="layout-container-form-search">
        <el-input v-model="query.input" :placeholder="$t('message.common.searchTip')" @change="getTableData(true)"></el-input>
        <el-button type="primary" :icon="Search" class="search-btn" @click="getTableData(true)">{{ $t('message.common.search') }}</el-button>
      </div>
    </div>
    <div class="layout-container-table">
      <Table
              ref="table"
              v-model:page="page"
              v-loading="loading"
              :showIndex="true"
              :showSelection="true"
              :data="tableData"
              @getTableData="getTableData"
              @selection-change="handleSelectionChange"
      >
          <el-table-column prop="name" label="商品名称" align="center"/>
          <el-table-column prop="categoryName" label="分类名称" align="center"/>
          <el-table-column prop="stockQuantity" label="商品库存" align="center"/>
          <el-table-column prop="onsaleQuantity" label="上架数量" align="center"/>

          <!-- <el-table-column prop="chooseName" label="选择器" align="center" />
          <el-table-column prop="radioName" label="单选框" align="center" /> -->

          <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" width="200">
              <template #default="scope">
                  <el-button @click="handleEdit(scope.row)">{{ $t('message.common.update') }}</el-button>
                  <el-popconfirm :title="$t('message.common.delTip')" @confirm="handleDel([scope.row])">
                      <template #reference>
                          <el-button type="danger">{{ $t('message.common.del') }}</el-button>
                      </template>
                  </el-popconfirm>
              </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from 'vue'
import Table from '@/components/table/index.vue'
import {Page} from '@/components/table/type'
import {del, getData} from '@/api/table'
import Layer from './layer.vue'
import {ElMessage} from 'element-plus'
import type {LayerInterface} from '@/components/layer/index.vue'
import {Delete, Plus, Search} from '@element-plus/icons'

export default defineComponent({
  name: 'crudTable',
  components: {
    Table,
    Layer
  },
  setup() {
    // 存储搜索用的数据
    const query = reactive({
      input: ''
    })
    // 弹窗控制器
    const layer: LayerInterface = reactive({
      show: false,
      title: '新增',
      showButton: true
    })
    // 分页参数, 供table使用
    const page: Page = reactive({
      index: 1,
      size: 20,
      total: 0
    })
    const loading = ref(true)
    const tableData = ref([])
    const chooseData = ref([])
    const handleSelectionChange = (val: []) => {
      chooseData.value = val
    }
    // 获取表格数据
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = (init: boolean) => {
        loading.value = true
        if (init) {
            page.index = 1
        }
        let data = {
            pageNum: page.index,
            pageSize: page.size,
            //...query
        }
        console.log(getData(data).then + "////")
        getData(data)
            .then(res => {
                let data = res.result.content
                console.log(data + "123123")
                // if (Array.isArray(data)) {
                //     data.forEach(d => {
                //         // 处理数据中的字段
                //         d.name = d.name // 对应商品名称
                //         d.categoryName = d.categoryName // 对应分类名称
                //         d.stockQuantity = d.stockQuantity // 对应商品库存
                //         d.onsaleQuantity = d.onsaleQuantity // 对应上架数量
                //     })
                // }
                tableData.value = data
                console.log(tableData.value)

                page.total = Number(res.data.pager.total)
            })


            // .then(res => {
            //   let data = res.result
            //   console.log(res.result)
            //   if (Array.isArray(data)) {
            //     data.forEach(d => {
            //       const select = selectData.find(select => select.value === d.choose)
            //       select ? d.chooseName = select.label : d.chooseName = d.choose
            //       const radio = radioData.find(select => select.value === d.radio)
            //       radio ? d.radioName = radio.label : d.radio
            //     })
            //   }
            //   tableData.value = res.data.list
            //   page.total = Number(res.data.pager.total)
            // })
            .catch(error => {
                //console.log(tableData.value + "*********------------*****")
                console.error(error)
                let data = error.result.content
                console.log(data + "123123")

                tableData.value = data
                console.log(tableData.value)

                page.total = Number(error.result.count)
                //     tableData.value = []
                //     page.index = 1
                //     page.total = 0
            })
      .finally(() => {
        loading.value = false
      })
    }
    // 删除功能
    const handleDel = (data: object[]) => {
      let params = {
        ids: data.map((e:any)=> {
          return e.id
        }).join(',')
      }
      del(params)
      .then(res => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getTableData(tableData.value.length === 1 ? true : false)
      })
    }
    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = '新增数据'
      layer.show = true
      delete layer.row
    }
    // 编辑弹窗功能
    const handleEdit = (row: object) => {
      layer.title = '编辑数据'
      layer.row = row
      layer.show = true
    }
    getTableData(true)
    return {
      Plus,
      Search,
        Delete,
        query,
        tableData,
        chooseData,
        loading,
        page,
        layer,
        handleSelectionChange,
        handleAdd,
        handleEdit,
        handleDel,
        getTableData
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>