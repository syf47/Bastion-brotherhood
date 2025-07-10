import axios, {
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

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
    if (response.status === 200) {
      return response
    }
    if (response.status === 401) {
      // TODO: logout and a error toast
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
      // TODO: logout and a error toast
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
    return Promise.reject(error)
  },
)

export default service
