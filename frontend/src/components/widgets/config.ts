import type { RoleBadge } from '@type/personnel'
import {
  ShieldUser,
  Terminal,
  Palette,
  InfinityIcon,
  FlaskConical,
} from 'lucide-vue-next'

export interface BadgeGroupConfig {
  role: RoleBadge
  icon?: any
  label?: string
  className?: string
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
    className:
      'bg-gradient-to-r from-red-500 via-orange-500 to-blue-500',
  },
  {
    role: 'beta',
    label: '内测用户',
    icon: FlaskConical,
    className: 'bg-gradient-to-r from-purple-500 to-purple-600',
  },
]
