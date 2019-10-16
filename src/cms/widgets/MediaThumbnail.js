import React from 'react'
import fileType from '../../common/fileType.js'
import { transformCloudinaryUrlForHeight } from '../../common/transformCloudinaryUrl.js'

export default ({ height = 100, src, poster }) => {
  const type = fileType(src)

  if (type === 'IMAGE') {
    return <img alt={`thumbnail of ${src}`} height={height} src={transformCloudinaryUrlForHeight(src, height)} />
  }
  if (type === 'VIDEO' || type === 'AUDIO') {
    if (poster) {
      return <img alt={`poster for ${src}`} height={height} src={transformCloudinaryUrlForHeight(poster, height)} />
    } else {
      if (type === 'VIDEO') {
        return <video controls allowFullScreen height={height} src={transformCloudinaryUrlForHeight(src, height * 4)} />
      } else {
        return <audio controls src={src} />
      }
    }
  }

  return <span>media type not recognised</span>
}