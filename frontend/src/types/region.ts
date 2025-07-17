interface Region {
  code: string
  name: string
  children?: Region[]
}

export type { Region }
