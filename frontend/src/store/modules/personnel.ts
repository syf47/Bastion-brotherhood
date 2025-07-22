import { defineStore } from 'pinia'
import type { PersonCreator, Person } from '@type/personnel'
import { fetchPersons, insertPerson } from '@/api/personnel'
import { filterPersons } from './personal.helper'
import { pswDict_S, pswDict_O } from '@/utils/calcTodayPsw'

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
        const names = ps.map(p => p.name)
        pswDict_S.push(...names)
        pswDict_O.push(...names)
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
      const person = await insertPerson(data)
      // 添加之后修改现有数据，避免额外请求
      // 👆这个叫乐观更新，我们李陈哥哥真是个乐观的人啊
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
