import React from 'react'
import styled from 'styled-components'

import AudioPlayer from './AudioPlayer.js'
import fileType from '../fileType.js'

const StyledDiv = styled.div`
  height: 100vh;
  padding-left: 150px;
  padding-top: 80px;

  @media only screen and (max-width: 758px) and (orientation: portrait) {
    padding-left: 5px;
    padding-top: 5px;
  }

  @media only screen and (max-width: 758px) and (orientation: landscape) {
    padding-left: 10px;
    padding-top: 10px;
  }

`

const StyledImg = styled.img`
  display: block;
  width: auto;
  height: calc(100vh - 160px);
  cursor: pointer;
  
  @media only screen and (max-width: 758px) and (orientation: portrait) {
    max-width: calc(100vw - 10px);
    max-height: calc(100vh - 20px);
    height: calc(100vh - 160px);
    width: 100%;
    object-fit: contain;
  }

  @media only screen and (max-width: 758px) and (orientation: landscape) {
    width: auto;
    height: calc(100vh - 60px);
  }

`

const StyledVideo = styled.video`
display: block;
width: auto;
height: calc(100vh - 160px);
cursor: pointer;

@media only screen and (max-width: 758px) and (orientation: portrait) {
  max-width: calc(100vw - 10px);
  max-height: calc(100vh - 20px);
  height: calc(100vh - 160px);
  width: 100%;
  object-fit: contain;
}

@media only screen and (max-width: 758px) and (orientation: landscape) {
  width: auto;
  height: calc(100vh - 60px);
}

`

export default  ({ piece, onClick }) => {
  const type = fileType(piece.media)
  let height = 300
  
  try {
    height = document.body.clientHeight - 160
  } catch (e) {
    console.log('Audio height not set, because document not defined')
  }

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
    { type === 'AUDIO' && 
      <AudioPlayer
        height={height}
        audioSrc={piece.media}
        imgSrc={piece.poster}
      />
    }
  </StyledDiv>
}

