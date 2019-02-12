export default (url) => {
  if (!url) {
    return null
  }
  const ending = url.split('.').pop()
  return ['gif','jpg','jpeg','png'].includes(ending) ? 'IMAGE' : 'VIDEO'
}