import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const namer = z.object({
  name: z.string().min(2),
  realname: z.string().min(2),
})

const extra = z.object({
  phone: z.string().min(11).optional(),
  wechat: z.string().min(2).optional(),
  email: z.email().optional(),
  region: z.string().min(2).optional(),
})

const creatorSchema = [toTypedSchema(namer), toTypedSchema(extra)]

const getCreatorSchema = (index: number) => {
  return creatorSchema[index]
}

export { getCreatorSchema }
