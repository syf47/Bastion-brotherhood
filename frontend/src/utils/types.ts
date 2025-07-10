type Nullable<T> = T | null

type NonNullable<T> = T extends null | undefined ? never : T

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

type PartiallyOptional<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>

type AnyPromiseFunction<A extends any[] = any[], R = void> = (
  ...arg: A
) => PromiseLike<R>

type AnyNormalFunction<A extends any[] = any[], R = void> = (...arg: A) => R

type AnyFunction<A extends any[] = any[], R = void> =
  | AnyNormalFunction<A, R>
  | AnyPromiseFunction<A, R>

type Getter<T = any> = () => T

type Setter<T = any> = (value: T) => void

export type {
  AnyPromiseFunction,
  AnyNormalFunction,
  AnyFunction,
  DeepPartial,
  Nullable,
  NonNullable,
  PartiallyOptional,
  Getter,
  Setter,
}
