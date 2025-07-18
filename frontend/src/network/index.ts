import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import request from './axios'
import { toast } from 'vue-sonner'

export interface Response<T> {
  data: T
  message: string
  code: 200 | 500
}

interface HttpOptions extends AxiosRequestConfig {
  url: string
  skipStandardTransform?: boolean
  beforeRequest?: () => void
  afterRequest?: () => void
}

function http<T>({
  url,
  data,
  method,
  responseType,
  afterRequest,
  beforeRequest,
  skipStandardTransform = false,
  ...config
}: HttpOptions): Promise<T> {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (skipStandardTransform) {
      return res.data as T
    }
    // TODO: handle string and blob
    if (res.data.code === 200) {
      return res.data.data
    }
    // TODO: a error toast
    toast.error(res.data.message ?? '未知错误, 请稍后重试')
    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || '[network]: unknown error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = data
  if (method === 'GET') {
    return request
      .get(url, { params, responseType, ...config })
      .then(successHandler, failHandler)
  }
  if (method === 'POST') {
    return request
      .post(url, params, {
        responseType,
        ...config,
      })
      .then(successHandler, failHandler)
  }
  if (method === 'PUT') {
    return request
      .put(url, params, {
        responseType,
        ...config,
      })
      .then(successHandler, failHandler)
  }
  return request
    .delete(url, {
      params,
      responseType,
      ...config,
    })
    .then(successHandler, failHandler)
}

function post<T>(props: HttpOptions): Promise<T> {
  return http<T>({ method: 'POST', ...props })
}

function get<T>(props: HttpOptions): Promise<T> {
  return http<T>({ method: 'GET', ...props })
}

function put<T>(props: HttpOptions): Promise<T> {
  return http<T>({ method: 'PUT', ...props })
}

function remove<T>(props: HttpOptions): Promise<T> {
  return http<T>({ method: 'DELETE', ...props })
}

export { http, post, get, put, remove }

export default post
