import type { MakeRequired } from '@/utils/types'

type RoleBadge =
  | 'admin'
  | 'developer'
  | 'designer'
  | 'creator'
  | 'beta'

interface BasePerson {
  id: number
  name: string
  realname: string
  avatar: string
  phone: string
  wechat: string
  position: string
  email: string
  region: string
}

type PersonCreator = MakeRequired<BasePerson, 'name' | 'realname'>

interface Person extends BasePerson {
  created_at: string
  updated_at: string
}

export type { Person, BasePerson, PersonCreator, RoleBadge }
