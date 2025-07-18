import { get, post } from '@/network'
import type { Person, PersonCreator } from '@type/personnel'

export function fetchPersons() {
  return get<Person[]>({
    url: '/api/persons',
  })
}

export function insertPerson(data: PersonCreator) {
  return post<Person>({
    url: '/api/persons',
    data,
  })
}
