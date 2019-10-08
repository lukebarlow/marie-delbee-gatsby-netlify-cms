import React from 'react'

import Piece from './Piece.js'

export default class ProjectPieces extends React.Component {
  render () {
    const { project, onPieceClick, onImageLoad, innerHeight, innerWidth } = this.props

    return <div style={{ display: 'flex', flexDireciton: 'column '}}>
      {
        project.pieces.map((piece, i) => <Piece 
          key={piece.media} 
          piece={piece} 
          shouldLoad={true}
          onClick={onPieceClick}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
        />)
      }
    </div>

    return 
  }
}