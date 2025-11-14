import { defineStore } from 'pinia'
import type { PersonCreator, Person } from '@type/personnel'
import { fetchPersons, insertPerson, removePerson } from '@/api/personnel'
import { filterPersons } from './personal.helper'
import type { HttpOptions } from '@/network'

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    persons: [] as Person[],

    activePerson: null as Person | null,
    fulfilled: false,
    loading: false,
    error: false,

    query: '',
  }),

  getters: {
    personsCount: (state) => state.persons.length,
    filteredPersons: (state) => filterPersons(state.persons, state.query),
    firstPerson: (state) => state.persons[0],
    lastPerson: (state) => state.persons[state.persons.length - 1],
  },

  actions: {
    async fetchPersons({
      onDownloadProgress,
    }: { onDownloadProgress?: HttpOptions['onDownloadProgress'] } = {}) {
      try {
        this.loading = true
        const ps = await fetchPersons({ onDownloadProgress })
        this.persons = ps
        this.fulfilled = true
      } catch (error) {
        this.error = true
        console.error('[fetchPersons error]:', error)
      } finally {
        this.loading = false
      }
    },

    async createPerson(data: PersonCreator) {
      const person = await insertPerson(data)
      this.persons.push(person)
    },

    async removePerson(id: number) {
      await removePerson(id)
      this.persons = this.persons.filter((p) => p.id !== id)
    },

    updatePersonLocal(id: number, person: Partial<Person>) {
      this.persons = this.persons.map((p) =>
        p.id === id ? { ...p, ...person } : p,
      )
    },

    setActivePerson(person: Person | null) {
      this.activePerson = person
    },

    resetActivePerson() {
      this.setActivePerson(null)
    },

    setQuery(query: string) {
      this.query = query
    },
  },
})
