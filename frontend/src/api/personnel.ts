import { get } from '@/network'
import type { Person } from '@type/personnel'

export function fetchPersons() {
  return get<Person[]>({
    url: '/api/persons',
  })
}
