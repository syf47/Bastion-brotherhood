import type { Person } from '@type/personnel'

function filterPersons(persons: Person[], query: string) {
  console.log('query', query)

  if (!query) return persons
  return persons.filter((person) => {
    return (
      person.name.toLowerCase().includes(query.toLowerCase()) ||
      person.realname.toLowerCase().includes(query.toLowerCase()) ||
      person.phone.toLowerCase().includes(query.toLowerCase()) ||
      person.wechat.toLowerCase().includes(query.toLowerCase()) ||
      person.email.toLowerCase().includes(query.toLowerCase()) ||
      person.position.toLowerCase().includes(query.toLowerCase()) ||
      person.region.toLowerCase().includes(query.toLowerCase()) ||
      person.id.toString().includes(query)
    )
  })
}

export { filterPersons }
