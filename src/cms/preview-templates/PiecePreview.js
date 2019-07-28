import React from 'react'
import Markdown from 'react-markdown'

import fileType from '../../common/fileType.js'

const style = {
  height: '100px',
  width: 'auto'
}

export default ({ piece }) => {
  return <div style={{ backgroundColor: '#dfdfe3', padding: '5px', marginBottom: '5px', borderRadius: '3px'}}>
      { fileType(piece.media) === 'IMAGE' ?
        <img alt={piece.title} src={piece.media} style={style} />
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
      <div>{ piece.title }</div>
      <div>
        <Markdown source={piece.description && piece.description.replace(/\\/g, '  ')} />
      </div>
    </div>
}