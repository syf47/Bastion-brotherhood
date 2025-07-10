import { Skeleton } from '@/components/ui/skeleton'

export function PersonSkeleton() {
  return (
    <div class="flex gap-4 p-6 items-center justify-between border rounded-2xl">
      <Skeleton class="size-14 rounded-full" />
      <div class="flex flex-col gap-4 items-end">
        <Skeleton class="h-4 w-18" />
        <Skeleton class="h-3 w-24" />
      </div>
    </div>
  )
}

export function PersonGroupSkeleton() {
  return (
    <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
      {Array.from({ length: 16 }).map((_, index) => (
        <PersonSkeleton key={index} />
      ))}
    </div>
  )
}
