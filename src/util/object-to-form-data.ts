const toFormData = (obj:object) => {
  const data = new FormData
  Object.keys(obj).forEach(key => {
    data.append(key, obj[key])
  })

  return data
}

export default toFormData