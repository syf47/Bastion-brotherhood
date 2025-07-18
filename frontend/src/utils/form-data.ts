export function objectToFormData(
  obj: Record<string, any>,
  form?: FormData,
  namespace?: string,
): FormData {
  const fd = form || new FormData()

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue

    const value = obj[key]
    const formKey = namespace ? `${namespace}[${key}]` : key

    if (value instanceof Date) {
      fd.append(formKey, value.toISOString())
    } else if (value instanceof File || value instanceof Blob) {
      fd.append(formKey, value)
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayKey = `${formKey}[${index}]`
        if (typeof item === 'object' && item !== null) {
          objectToFormData(item, fd, arrayKey)
        } else {
          fd.append(arrayKey, item)
        }
      })
    } else if (typeof value === 'object' && value !== null) {
      objectToFormData(value, fd, formKey)
    } else if (value !== undefined && value !== null) {
      fd.append(formKey, value)
    }
  }

  return fd
}
