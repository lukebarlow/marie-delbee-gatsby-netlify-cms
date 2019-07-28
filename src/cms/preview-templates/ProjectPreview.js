import React from 'react'

import fileType from '../../common/fileType.js'

import PiecePreview from './PiecePreview.js'

const style = {
  height: '100px',
  width: 'auto'
}

export default ({ project }) => {
  return <div >
    <h1>{project.title}</h1>
    <div>
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
    <hr />
  </div>
}