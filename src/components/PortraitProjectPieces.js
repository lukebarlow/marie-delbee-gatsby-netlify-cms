import React from 'react'

import PortraitPiece from './PortraitPiece.js'

export default class PortraitProjectPieces extends React.Component {
  render () {
    const { project, onPieceClick, innerHeight, innerWidth } = this.props

    return <div style={{ display: 'flex', flexDirection: 'row' }}>
      {
        project.pieces.map((piece, i) => <PortraitPiece 
          key={piece.media} 
          piece={piece} 
          shouldLoad={true}
          onClick={onPieceClick}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
        />)
      }
    </div>
  }
}