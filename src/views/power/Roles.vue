<template>
  <div class="page">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图 -->
      <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" style="position:relative;right:493px;margin-bottom:15px;">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table
            :data="rolesList"
            border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['bottom-border', (index === 0) ? 'top-border' : '', 'vcenter']">
                  <!-- 渲染一级权限 -->
                  <el-col :span="5">
                    <el-tag closable>{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二三级权限 -->
                  <el-col :span="19">
                    <el-row v-for="(item2,index2) in item.children" :key="item2.id" :class="['bottom-border', (index2 ===0) ? 'top-border' : '', 'vcenter']">
                      <el-col :span="6">
                        <el-tag type="success" closable>{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">
                          {{item3.authName}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete">删除</el-button>
                  <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
        </el-table>
      </el-card>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="30%"
        @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { getRolesList, deleteRights, getRightsList, roleByPower } from '../../api/power'
export default {
  components: {

  },
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //属性控件的绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点id
      defKeys: [],
      //当前即将分配权限的用户id
      roleId: ''
    }
  },
  created() {
    this._getRolesList()
  },
  methods: {
    _getRolesList() {
        getRolesList().then(res => {
            console.log('请求角色列表数据', res)
            if(res.data.meta.status !==200) {
                return this.$message.error('获取角色数据失败！')
            }
            this.rolesList = res.data.data
        })
    },

    //根据对应的id删除对应的权限
    async removeRightById(role,rights) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm') {
          return this.$message.info('取消了删除')
        }

        //删除指定角色权限
        deleteRights(role,rights).then(res => {
          console.log('删除指定角色权限',res)
          if(res.data.meta.status !== 200) {
            return this.$message.error('删除权限失败！')
          }
          role.children = res.data.data
        })
    },
    
    //展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const type = 'tree';
      await getRightsList(type).then(res => {
        console.log('获取所有权限的数据，树形展示', res)
        if(res.data.meta.status !== 200) {
          this.$message.error('获取权限数据失败！')
        }
        this.rightsList = res.data.data
      })
      this.getLeafKeys(role)
      this.setRightDialogVisible = true
    },

    //通过递归函数获取角色下所有三级权限的id
    getLeafKeys(node, arr) {
      if(!node.children) {
        // 如果当前节点不包含children属性，则是三级节点
        return arr.push(node.id)
      }
      //此处没有return，则不是三级节点
      node.children.forEach(item => {
        this.getLeafKeys(item, this.defKeys)
      })
    },

    //监听对话框的关闭
    setRightDialogClosed() {
      this.defKeys = []
    },

    //为角色分配权限处理函数
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log('为角色分配权限处理函数',keys)
      const idStr = keys.join(',')
      console.log('为角色分配权限处理函数2',idStr)

      //分配权限请求函数
      await roleByPower(idStr,this.roleId).then(res => {
        console.log('分配权限请求',res)
        if(res.data.meta.status !== 200) {
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！')

        //重新刷新数据列表
        this._getRolesList()

        //隐藏对话框
        this.setRightDialogVisible = false
      })

    }
  }
}
</script>

<style scoped lang="less">
  .el-tag {
    margin: 7px;
  }
  .top-border {
    border-top: 1px solid #eee;
  }
  .bottom-border {
    border-bottom: 1px solid #eee;
  }
  // 纵向剧中对齐
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
