import React from 'react'

import Piece from './Piece.js'

export default ({ project }) => (
  <div>
    Project {project.frontmatter.title} <br />
    { project.frontmatter.pieces.map(piece => <Piece key={piece.title} piece={piece} />)}
  </div>
)