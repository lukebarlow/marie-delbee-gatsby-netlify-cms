import React from 'react'

import fileType from '../../fileType.js'

const style = {
  height: '100%',
  marginLeft: '20px'
}

export default ({ piece }) => {
  return <div>
      { fileType(piece.media) === 'IMAGE' ?
        <img src={piece.media} style={style} />
        :
        <video
          style={style}
          src={piece.media}
          poster={piece.poster}
          muted
          autoPlay
          loop
          playsInline
        />
      }
    </div>
}