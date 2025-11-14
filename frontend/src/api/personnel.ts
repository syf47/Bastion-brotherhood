import { get, post, remove, type HttpOptions } from '@/network'
import type { Person, PersonCreator } from '@type/personnel'

export function fetchPersons({
  onDownloadProgress,
}: { onDownloadProgress?: HttpOptions['onDownloadProgress'] } = {}) {
  return get<Person[]>({
    url: '/api/persons',
    onDownloadProgress,
  })
}

export function insertPerson(data: PersonCreator) {
  return post<Person>({
    url: '/api/persons',
    data,
  })
}

export function removePerson(id: number) {
  return remove<Person>({
    url: `/api/persons/${id}`,
  })
}

export function updateAvatar(id: number, avatar: File) {
  const fm = new FormData()
  fm.append('avatar', avatar)
  return post<{ avatar_url: string }>({
    url: `/api/persons/${id}/avatar`,
    data: fm,
  })
}
