import React from 'react'
import styled from 'styled-components'

import AudioPlayer2 from './AudioPlayer2.js'
import fileType from '../common/fileType.js'
import transformCloudinaryUrl from '../common/transformCloudinaryUrl.js'


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
    height: calc(100vh - 40px);
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
    height: calc(100vh - 40px);
  }
`

export default class Piece extends React.Component {
  constructor () {
    super()
    this.state = { height: 300, imgHeightCalculated: false }
    this.shouldLoadContent = false
  }

  componentDidMount () {
    const imgHeight = (document.body.clientHeight - 60)
    this.setState({ imgHeightCalculated: true, imgHeight })
  }

  render () {
    const { piece, onClick, shouldLoad, onImageLoad } = this.props
    const { imgHeight, imgHeightCalculated } = this.state

    if (!imgHeightCalculated) {
      return null
    }

    const type = fileType(piece.media)
    this.shouldLoadContent = this.shouldLoadContent || shouldLoad
    
    return <StyledDiv onClick={onClick}>

      { this.shouldLoadContent ?
        <>
          { type === 'IMAGE' &&
            <StyledImg src={transformCloudinaryUrl(piece.media, imgHeight)} onLoad={onImageLoad} />
          }
          { type === 'VIDEO' && 
            <StyledVideo
              src={transformCloudinaryUrl(piece.media, imgHeight)}
              poster={transformCloudinaryUrl(piece.poster, imgHeight)}
              muted
              autoPlay
              loop
              playsInline
            />
          }
          { type === 'AUDIO' && 
            <AudioPlayer2
              height={imgHeight}
              audioSrc={piece.media}
              imgSrc={transformCloudinaryUrl(piece.poster, imgHeight)}
            />
          }
        </> : <StyledImg src='img/grey-square.gif' onLoad={onImageLoad} />
      }
    </StyledDiv>
  
  }
}
