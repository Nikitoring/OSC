function debounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}

export { debounce }
