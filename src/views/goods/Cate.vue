<template>
  <div class="page">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 卡片里的第一行第一列为button -->
        <el-row>
          <el-col>
            <el-button @click="showAddCateDialog" type="primary">添加分类</el-button>
          </el-col>
        </el-row>
        <el-table
            :data="cateList"
            style="width: 100%"
            border
            :stripe="true">
            <el-table-column
                type="index"
                width="180">
            </el-table-column>
            <el-table-column
                prop="cat_name"
                label="分类名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="cat_deleted"
                label="是否有效"
                width="180">
                <template slot-scope="scope">
                  <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                  <i class="el-icon-error" v-else  style="color: lightgreen"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="cat_level"
                label="排序">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                  <el-tag type="danger" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                  <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="address" 
                label="操作">
                <template>
                  <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      @close="addCateDialogClosed"
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
          {{addCateForm.cat_name}}
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            change-on-select
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getCategory, postCategory } from '../../api/goods.js'
export default {
  components: {

  },
  data() {
    return {
      queryInfo: {
        type: '3',
        pagenum: '1',
        pagesize: '5'
      },
      cateList: [],
      // 总数据条数
      isShow: false,
      addCateDialogVisible: false,
      addCateForm: {
        //将要添加的分类的名称
        cat_name: '',
        //父级id的名称
        cat_pid: 0,
        //分类的等级
        cat_level: 0
      },
      // 添加分类表单的分类规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur'}
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的数组
      selectedKeys: []
    }
  },
  created() {
    this._getCategory()
  },
  methods: {
    async _getCategory() {
      const {data: res} = await getCategory(this.queryInfo)
      if(res.meta.status !== 200) {
        return this.$message.error('请求商品分类数据失败！')
      }
      console.log('请求商品分类数据',res)
      this.cateList = res.data
    },
    showAddCateDialog() {
      this.getParentCategory()
      this.addCateDialogVisible = true
    },

    //获取父级分类列表
    async getParentCategory() {
      const type = 2
      const {data: res} = await getCategory(type)
      if(res.meta.status !== 200) {
        return this.$message.error('请求父级分类数据失败！')
      }
      console.log('请求父级分类数据',res)
      this.parentCateList = res.data
    },

    // 选择项发生变化触发的函数
    parentCateChange() {
      if(this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    //点击按钮添加分类
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) {
          return
        }
        const {data: res} = await postCategory(this.addCateForm)
        console.log('添加分类请求', res)
        if(res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this._getCategory()
        this.addCateDialogVisible = false
      })
    },

    //监听对话框的关闭事件，重置数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
    }
  }
  
}
</script>

<style scoped lang="less">
    .el-card {
        margin-top: 15px;
    }
    .el-table {
      margin-top: 15px;
    }
    .el-cascader {
      width: 100%;
    }
</style>
