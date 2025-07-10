import axios from 'axios'

// 根据环境设置API基础URL
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : '/api'

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 用户API
export const personAPI = {
  // 获取用户列表
  getPersons: () => api.get('/persons'),
  
  // 获取单个用户
  getPerson: (id) => api.get(`/persons/${id}`),
  
  // 创建用户
  createPerson: (formData) => api.post('/persons', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // 更新用户
  updatePerson: (id, formData) => api.put(`/persons/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // 删除用户
  deletePerson: (id) => api.delete(`/persons/${id}`)
}

export default api 