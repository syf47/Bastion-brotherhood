import post from '@/network'

export function uploadAvatar(avatar: File) {
  return post<{ avatar_url: string }>({
    url: '/api/upload/avatar',
    data: avatar,
  })
}
