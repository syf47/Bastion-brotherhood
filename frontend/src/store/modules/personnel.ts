import { defineStore } from 'pinia'
import type { Person } from '@type/personnel'
import { fetchPersons } from '@/api/personnel'
import { filterPersons } from './personal.helper'

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
