import React from 'react'
import styled from 'styled-components'

import fileType from '../fileType.js'

const StyledDiv = styled.div`
  height: 100vh;
  padding-left: 150px;
  padding-top: 80px;

  @media only screen and (max-width: 758px) {
    padding-left: 5px;
    padding-top: 5px;
  }
`

const StyledImg = styled.img`
  display: block;
  width: auto;
  height: calc(100vh - 160px);
  cursor: pointer;
  
  @media only screen and (max-width: 758px) {
    max-width: calc(100vw - 10px);
    max-height: calc(100vh - 20px);
    height: calc(100vh - 160px);
    width: 100%;
    object-fit: contain;
  }
`

const StyledVideo = styled.video`
  display: block;
  width: auto;
  max-width: calc(100vw - 300px);
  height: calc(100vh - 160px);
  cursor: pointer;

  @media only screen and (max-width: 758px) {
    max-width: calc(100vw - 10px);
    max-height: calc(100vh - 20px);
  }
`

export default  ({ piece, onClick }) => {
  const type = fileType(piece.media)

  return <StyledDiv onClick={onClick}>
    { type === 'IMAGE' &&
      <StyledImg src={piece.media} />
    }
    { type === 'VIDEO' && 
      <StyledVideo
        src={piece.media}
        poster={piece.poster}
        muted
        autoPlay
        loop
        playsInline
      />
    }
  </StyledDiv>
}

