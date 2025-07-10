import { get } from '@/network'
import type { HealthResponse } from '@type/system'

export function checkHealth() {
  return get<HealthResponse>({
    url: '/api/health',
    skipStandardTransform: true,
  })
}
