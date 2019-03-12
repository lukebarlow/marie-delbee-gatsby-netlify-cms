export default (url) => {
  if (!url) {
    return null
  }
  const ending = url.split('.').pop()
  if (['gif','jpg','jpeg','png'].includes(ending)) {
    return 'IMAGE'
  } else if (['mp3'].includes(ending)) {
    return 'AUDIO'
  }
  return 'VIDEO'
}