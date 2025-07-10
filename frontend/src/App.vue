<template>
  <div id="app">
    <div class="header">
      <h1>用户管理系统</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>
    
    <div class="main-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>用户列表</span>
            <el-button @click="loadPersons" :loading="loading">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </template>
        
        <el-table 
          :data="persons" 
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" />
          
          <el-table-column label="头像" width="100">
            <template #default="scope">
              <div class="avatar-container">
                <img 
                  v-if="scope.row.avatar" 
                  :src="scope.row.avatar" 
                  class="table-avatar"
                  alt="头像"
                />
                <el-icon v-else class="no-avatar"><User /></el-icon>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="name" label="用户名" />
          <el-table-column prop="realname" label="真实姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="wechat" label="微信号" />
          <el-table-column prop="position" label="职位" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="region" label="地区" />
          
          <el-table-column label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button 
                size="small" 
                @click="handleEdit(scope.row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDelete(scope.row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    
    <!-- 用户表单对话框 -->
    <PersonForm 
      v-model:visible="formVisible"
      :person="currentPerson"
      :is-edit="isEdit"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Edit, Delete, User } from '@element-plus/icons-vue'
import PersonForm from './components/PersonForm.vue'
import { personAPI } from './api/person'

const persons = ref([])
const loading = ref(false)
const formVisible = ref(false)
const currentPerson = ref({})
const isEdit = ref(false)

// 加载用户列表
const loadPersons = async () => {
  try {
    loading.value = true
    const response = await personAPI.getPersons()
    persons.value = response.data || []
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 添加用户
const handleAdd = () => {
  currentPerson.value = {}
  isEdit.value = false
  formVisible.value = true
}

// 编辑用户
const handleEdit = (person) => {
  currentPerson.value = { ...person }
  isEdit.value = true
  formVisible.value = true
}

// 删除用户
const handleDelete = async (person) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${person.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await personAPI.deletePerson(person.id)
    ElMessage.success('用户删除成功')
    loadPersons()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

// 表单提交成功
const handleFormSuccess = () => {
  loadPersons()
}

// 页面加载时获取用户列表
onMounted(() => {
  loadPersons()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.main-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
}

.table-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.no-avatar {
  font-size: 30px;
  color: #c0c4cc;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-button {
  margin-right: 8px;
}

.el-button:last-child {
  margin-right: 0;
}
</style> 