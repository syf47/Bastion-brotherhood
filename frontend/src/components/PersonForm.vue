<template>
  <el-dialog 
    :title="isEdit ? '编辑用户' : '添加用户'" 
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    width="600px"
    @close="handleClose"
  >
    <el-form 
      ref="formRef" 
      :model="form" 
      :rules="rules" 
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="form.name" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realname">
            <el-input v-model="form.realname" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信号" prop="wechat">
            <el-input v-model="form.wechat" placeholder="请输入微信号" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位" prop="position">
            <el-input v-model="form.position" placeholder="请输入职位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="地区" prop="region">
        <el-input v-model="form.region" placeholder="请输入地区" />
      </el-form-item>
      
      <el-form-item label="头像">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          accept="image/*"
        >
          <div class="avatar-upload">
            <img v-if="avatarPreview" :src="avatarPreview" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { personAPI } from '../api/person'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  person: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref()
const uploadRef = ref()
const loading = ref(false)
const avatarPreview = ref('')
const avatarFile = ref(null)

const form = reactive({
  name: '',
  realname: '',
  phone: '',
  wechat: '',
  position: '',
  email: '',
  region: ''
})

const rules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  realname: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 监听props变化
watch(() => props.visible, (newVal) => {
  if (newVal && props.isEdit && props.person) {
    // 编辑模式，填充表单
    Object.assign(form, props.person)
    avatarPreview.value = props.person.avatar || ''
  } else if (newVal && !props.isEdit) {
    // 新建模式，清空表单
    resetForm()
  }
})

// 处理头像上传
const handleAvatarChange = (file) => {
  avatarFile.value = file.raw
  
  // 预览图片
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: '',
    realname: '',
    phone: '',
    wechat: '',
    position: '',
    email: '',
    region: ''
  })
  avatarPreview.value = ''
  avatarFile.value = null
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 创建FormData
    const formData = new FormData()
    Object.keys(form).forEach(key => {
      if (form[key]) {
        formData.append(key, form[key])
      }
    })
    
    // 添加头像文件
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }
    
    // 调用API
    if (props.isEdit) {
      await personAPI.updatePerson(props.person.id, formData)
      ElMessage.success('用户更新成功')
    } else {
      await personAPI.createPerson(formData)
      ElMessage.success('用户创建成功')
    }
    
    emit('success')
    handleClose()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}
</script>

<style scoped>
.avatar-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style> 