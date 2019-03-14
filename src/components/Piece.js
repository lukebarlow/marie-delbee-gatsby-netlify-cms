import React from 'react'
import styled from 'styled-components'

import AudioPlayer from './AudioPlayer.js'
import fileType from '../fileType.js'

import { portraitSelector, landscapeSelector } from '../mediaSelectors.js'

const StyledDiv = styled.div`
  height: 100vh;
  padding-left: 150px;
  padding-top: 80px;

  @media ${portraitSelector} {
    padding-left: 5px;
    padding-top: 5px;
  }

  @media ${landscapeSelector} {
    padding-left: 10px;
    padding-top: 10px;
  }
`

const StyledImg = styled.img`
  display: block;
  width: auto;
  height: calc(100vh - 160px);
  cursor: pointer;
  
  @media ${portraitSelector} {
    max-width: calc(100vw - 10px);
    max-height: calc(100vh - 20px);
    height: calc(100vh - 160px);
    width: 100%;
    object-fit: contain;
  }

  @media ${landscapeSelector} {
    width: auto;
    height: calc(100vh - 60px);
  }

`

const StyledVideo = styled.video`
display: block;
width: auto;
height: calc(100vh - 160px);
cursor: pointer;

@media ${portraitSelector} {
  max-width: calc(100vw - 10px);
  max-height: calc(100vh - 20px);
  height: calc(100vh - 160px);
  width: 100%;
  object-fit: contain;
}

@media ${landscapeSelector} {
  width: auto;
  height: calc(100vh - 60px);
}

`

export default class Piece extends React.Component {
  constructor () {
    super()
    this.state = { height: 300 }
  }

  render () {
    const { piece, onClick } = this.props
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
      { type === 'AUDIO' && 
        <AudioPlayer
          audioSrc={piece.media}
          imgSrc={piece.poster}
        />
      }
    </StyledDiv>
  }
}
