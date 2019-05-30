function parseCloudinaryUrl(url) {
  const re = /https:\/\/res\.cloudinary\.com\/([a-z]+)\/([a-z]+)\/upload\/v[0-9]+\/(.+)/
  const match = url.match(re)
  return match ? { cloudName: match[1], type: match[2], path: match[3] } : null
}

function transformCloudinaryUrl(url, height) {
  const parsed = parseCloudinaryUrl(url)
  if (!parsed) {
    return url
  }
  const { cloudName, path, type } = parsed
  return `https://res.cloudinary.com/${cloudName}/${type}/upload/q_auto,h_${height},fl_progressive:steep/${path}`
}

export default transformCloudinaryUrl