import React from 'react'

import fileType from '../../common/fileType.js'

import PiecePreview from './PiecePreview.js'

const style = {
  height: '100%'
}

export default ({ project }) => {
  return <div style={{ display: 'flex', margin: '20px', height: '100vh' }}>
    <div style={{backgrondColor: 'red'}}>
      { fileType(project.cover) === 'IMAGE' ?
        <img alt={project.title} src={project.cover} style={style} />
        :
        <video
          style={style}
          src={project.cover}
          poster={project.image}
          muted
          autoPlay
          loop
          playsInline
        />
      }
    </div>
    { project.pieces.map((piece, i) => <PiecePreview key={i} piece={piece} />)}
  </div>
}