import React from 'react'
import styled from 'styled-components'

import fileType from '../fileType.js'

const StyledDiv = styled.div`
  height: 100vh;
  padding-left: 150px;
  padding-top: 80px;
`

const StyledImg = styled.img`
  display: block;
  width: auto;
  max-width: calc(100vw - 300px);
  max-height: calc(100vh - 160px);
`

export default  ({ piece, onClick }) => {
  const type = fileType(piece.media)

  return <StyledDiv onClick={onClick}>
    { type === 'IMAGE' &&
      <StyledImg src={piece.media} />
    }
    { type === 'VIDEO' && 
      <video
        src={piece.media}
        muted
        autoPlay
        loop
        playsInline
      />
    }
  </StyledDiv>
}

