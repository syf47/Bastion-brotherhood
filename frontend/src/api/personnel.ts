import { get, post } from '@/network'
import type { Person } from '@type/personnel'

export function fetchPersons() {
  return get<Person[]>({
    url: '/api/persons',
  })
}

export function insertPerson(data: FormData) {
  return post<Person>({
    url: '/api/persons',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
}
