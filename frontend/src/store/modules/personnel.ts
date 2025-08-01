import { defineStore } from 'pinia'
import type { PersonCreator, Person } from '@type/personnel'
import { fetchPersons, insertPerson, removePerson } from '@/api/personnel'
import { filterPersons } from './personal.helper'

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
  },

  actions: {
    async fetchPersons() {
      try {
        this.loading = true
        const ps = await fetchPersons()
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
      // 添加之后修改现有数据，避免额外请求
      // 👆这个叫乐观更新，我们李陈哥哥真是个乐观的人啊
      this.persons.push(person)
    },

    async removePerson(id: number) {
      await removePerson(id)
      this.persons = this.persons.filter((p) => p.id !== id)
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
