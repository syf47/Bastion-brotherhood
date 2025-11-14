import type { RoleBadge } from '@type/personnel'
import {
  ShieldUser,
  Terminal,
  Palette,
  InfinityIcon,
  FlaskConical,
  ShoppingBag,
  Rainbow,
  Citrus,
  Bone,
} from 'lucide-vue-next'
import { h } from 'vue'

export interface BadgeGroupConfig {
  role: RoleBadge
  icon?: any
  label?: string
  className?: string
  tip?: string
}

export const badgeGroupConfig: BadgeGroupConfig[] = [
  {
    role: 'admin',
    label: '管理员',
    icon: ShieldUser,
    className: 'bg-gradient-to-r from-primary to-destructive/80',
  },
  {
    role: 'developer',
    label: '开发者',
    icon: Terminal,
    className: 'bg-gradient-to-r from-blue-500 to-green-600',
  },
  {
    role: 'designer',
    label: '设计师',
    icon: Palette,
    className: 'bg-gradient-to-r from-green-500 to-pink-600',
  },
  {
    role: 'creator',
    label: '创造者',
    icon: InfinityIcon,
    className: 'bg-gradient-to-r from-red-500 via-orange-500 to-blue-500',
  },
  {
    role: 'beta',
    label: '内测用户',
    icon: FlaskConical,
    className: 'bg-gradient-to-r from-purple-500 to-purple-600',
  },
  {
    role: 'gay',
    label: 'GAY',
    icon: Rainbow,
  },
  {
    role: '0',
    label: '小烧 0',
    icon: h('div', { class: 'font-semibold text-xs' }, '0'),
  },
  {
    role: '1',
    label: '大猛 1',
    icon: h('div', { class: 'font-semibold text-xs' }, '1'),
  },
  {
    role: 'shopping-bag',
    label: '沃尔玛购物袋',
    icon: ShoppingBag,
    tip: '这个用户认为自己是 沃尔玛购物袋',
  },
  {
    role: 'orange',
    label: 'ORANGE',
    icon: Citrus,
    tip: '这个用户是一个橙子',
    className: 'bg-gradient-to-r from-orange-600 to-orange-300',
  },
  {
    role: 'dog',
    label: '舔狗',
    icon: Bone,
    tip: '这个用户喜欢出生在合肥的女生',
    className: 'bg-gradient-to-r from-red-300 to-pink-600',
  },
]
