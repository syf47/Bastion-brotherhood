interface HealthResponse {
  status: 'ok' | 'error'
  message: string
  data_file: string
  persons_count: number
}

export type { HealthResponse }
