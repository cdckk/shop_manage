<template>
  <div class="page">
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区 -->
      <el-card class="box-card">
          <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="_getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="_getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 用户列表区 -->
        <el-table
            :data="userInfo"
            style="width: 100%"
            border
            stripe>
            <el-table-column
                type="index">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="role_name"
                label="角色">
            </el-table-column>
            <el-table-column
                prop="mg_state"
                label="状态">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    
                    <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                    </el-tooltip>
                    
                    <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="userInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="userInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="30%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editForm.email" prop="email"></el-input>
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="editForm.mobile" prop="mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
      </el-card>

      
  </div>
</template>

<script type="text/ecmascript-6">
import { getUserList, putUserState, addUserForm, getUserInfoById, putEditUserInfo, deleteUser} from '../../api/user'

export default {
  components: {

  },
  data() {
    //   验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
         const regEmail = /^\w+@\w+(\.\w+)+$/
        if (regEmail.test(value)) {
            return cb()
        }
        //返回一个错误提示
        cb(new Error('请输入合法的邮箱'))
    }
    //   验证手机号的规则
    var checkMobile = (rule, value, cb) => {
        const regMobile = /^1[34578]\d{9}$/
        if (regMobile.test(value)) {
            return cb()
        }
         //返回一个错误提示
        cb(new Error('请输入合法的手机号码'))
    }
    return {
        queryInfo: {
            query: '',
            //当前的页数
            pagenum: 1,
            //当前每页显示多少条数据
            pagesize: 2
        },
        userInfo: [],
        total: 0,
        addDialogVisible: false,  //控制对话框的显示与隐藏
        editDialogVisible: false,  //控制编辑对话框的显示与隐藏
        addForm: {
            username: '',
            password: '',
            email: '',
            mobile: ''
        },  //添加用户的表单数据
        addFormRules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ],
        },  //添加表单的验证规则对象
        editForm: {},  //查询到的用户信息对象
        // 修改表单的验证规则对象
        editFormRules: {
            email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],
            mobile: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ],
        }
    }
  },
  mounted() {
      this._getUserList()
  },
  methods: {
      _getUserList() {
          getUserList(this.queryInfo).then(res => {
              console.log('用户列表数据',res)
              this.userInfo = res.data.data.users
              this.total = res.data.data.total
          })
      },

      //监听PageSize改变事件
      handleSizeChange(newSize) {
          console.log(newSize)
          this.queryInfo.pagesize = newSize
          this._getUserList()
      },

      //监听页码值改变的事件
      handleCurrentChange(newPage) {
          console.log(newPage)
          this.queryInfo.pagesize = newPage
          this._getUserList()
      },

      //监听状态的改变
      userStateChanged(userInfo) {

        //修改用户状态请求
        putUserState(userInfo).then(res => {
              //设置状态不成功
              if(res.data.meta.status !== 200) {
                  userInfo.mg_state = !userInfo.mg_state
                  return this.$message.error('更新用户状态失败！');
              }
              this.$message.success('更新用户状态成功！');
          })
      },

      //监听用户对话框的关闭
      addDialogClosed() {
          this.$refs.addFormRef.resetFields()
      },

      //点击按钮添加新用户
      addUser() {
          this.$refs.addFormRef.validate(async valid => {
              if(!valid) {
                  return
              }
              //可以发起添加用户的网络请求
              await addUserForm(this.addForm).then(res => {
                  console.log('添加用户网络请求', res)
                  if(res.status != 200) {
                      this.$message.error('添加用户失败！')
                  }
                  this.$message.success('添加用户成功！')
              })

              this.addDialogVisible = false

            //   重新获取用户列表的数据
              this._getUserList()
          })
      },

      //展示编辑用户的对话框
      showEditDialog(id) {
          this.editDialogVisible = true
          console.log('id',id)
          getUserInfoById(id).then(res => {
              console.log('根据id获取用户的信息', res)
              if(res.data.meta.status !=200) {
                  return this.$message.error('获取失败')
              }
              this.$message.success('获取成功')
              this.editForm = res.data.data
              this.editDialogVisible = true
          })
      },

      //监听修改用户对话框的重置事件
      editDialogClosed() {
          this.$refs.editFormRef.resetFields()
      },

      //修改用户信息并提交（预验证）
      editUserInfo() {
          this.$refs.editFormRef.validate(async valid => {
              if(!valid) return 
              await putEditUserInfo(this.editForm).then(res => {
                  console.log('修改用户信息并提交（预验证）', res)
                    if(res.data.meta.status !=200) {
                        return this.$message.error('更新用户信息失败！')
                    }
              })
              
              console.log(1111111111111)
              //关闭对话框
              this.editDialogVisible = false
              //刷新数据列表
              this._getUserList()
              //提示修改成功
              this.$message.success('更新用户信息成功！')
          })
      },

      //删除用户信息
      removeUserById(id) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {
            console.log('确认删除',res)
            this.$message.success('已删除用户')
            deleteUser(id).then(res => {
                console.log('删除用户请求',res)
            })
            //删除成功后重新刷新用户列表
            this._getUserList()
        }).catch(err => {
            console.log('取消删除',err)
            this.$message.error('已取消删除用户')
        })
      }
  }
}
</script>

<style scoped lang="less">
    .el-breadcrumb {
        margin-bottom: 20px;
    }
    .el-card {
        box-shadow: 0 1px 1px rgba(0,0,0,0.15) !important;
    }
    .el-table {
        margin-top: 15px;
    }
    .el-switch {
        position: relative;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
    .el-pagination {
        margin-top: 15px;
    }
</style>
