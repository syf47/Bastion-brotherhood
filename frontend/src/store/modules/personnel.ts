import { defineStore } from 'pinia'
import type { PersonCreator, Person } from '@type/personnel'
import { fetchPersons, insertPerson } from '@/api/personnel'
import { filterPersons } from './personal.helper'
import { objectToFormData } from '@/utils/form-data'

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    persons: [] as Person[],

    activePerson: null as Person | null,
    fulfilled: false,
    loading: false,
    error: false,

    filteredPersons: [] as Person[],
  }),

  getters: {
    personsCount: (state) => state.persons.length,
  },

  actions: {
    async fetchPersons() {
      try {
        this.loading = true
        const ps = await fetchPersons()
        this.persons = ps
        this.filteredPersons = ps
        this.fulfilled = true
      } catch (error) {
        this.error = true
        console.error('[fetchPersons error]:', error)
      } finally {
        this.loading = false
      }
    },

    async createPerson(data: PersonCreator) {
      // const formData = objectToFormData(data)
      const person = await insertPerson(data)
      // 添加之后修改现有数据，避免额外请求
      this.persons.push(person)
    },

    setActivePerson(person: Person | null) {
      this.activePerson = person
    },

    resetActivePerson() {
      this.setActivePerson(null)
    },

    filterPersons(query: string) {
      this.filteredPersons = filterPersons(this.persons, query)
    },
  },
})
