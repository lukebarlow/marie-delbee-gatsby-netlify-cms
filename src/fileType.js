export default (url) => {
  const ending = url.split('.').pop()
  return ['gif','jpg','jpeg','png'].includes(ending) ? 'IMAGE' : 'VIDEO'
}