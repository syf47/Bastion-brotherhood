import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { toast } from 'vue-sonner'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60 * 1000 * 10, // 10 min
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // TODO: add token
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200 || response.status === 201) {
      return response
    }
    if (response.status === 401) {
      // TODO: logout
      toast.error('登录过期，请重新登录')
      throw new Error(response.status.toString())
    }
    // a error toast
    throw new Error(response.status.toString())
  },
  (error: AxiosError) => {
    const status = error.response?.status
    const message = error.message
    const code = error.code
    if (status === 401) {
      // TODO: logout
      toast.error('登录过期，请重新登录')
      return
    }
    if (
      axios.isCancel(error) ||
      message === 'canceled' ||
      code === 'ERR_CANCELED'
    ) {
      return Promise.reject(error)
    }
    // TODO: a error toast
    toast.error(error ?? '未知错误, 请稍后重试')
    return Promise.reject(error)
  },
)

export default service
