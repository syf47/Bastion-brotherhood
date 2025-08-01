const __DEV__ = process.env.NODE_ENV === 'development'

const __PROD__ = process.env.NODE_ENV === 'production'

export { __DEV__, __PROD__ }
