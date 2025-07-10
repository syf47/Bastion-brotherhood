function delay(ms: number = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export { delay }
