<template>
  <div class="page">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRightsList } from '../../api/power'
export default {
  components: {

  },
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this._getRightsList()
  },
  methods: {
    _getRightsList() {
      const type = 'list'
      getRightsList(type).then(res => {
        console.log('请求权限列表数据',res)
        this.rightsList = res.data.data
        if(res.data.meta.status != 200) {
          this.$message.error('请求数据列表失败！')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
