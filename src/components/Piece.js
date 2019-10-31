import React from 'react'
import styled from 'styled-components'

import AudioPlayer2 from './AudioPlayer2.js'
import fileType from '../common/fileType.js'
import { transformCloudinaryUrlForHeight } from '../common/transformCloudinaryUrl.js'

import { portraitSelector, landscapeSelector } from '../mediaSelectors.js'
import { pieceSizeCss } from '../styles/elements.js'

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
  ${pieceSizeCss}
`

const StyledVideo = styled.video`
  ${pieceSizeCss}
`

export default class Piece extends React.Component {
  constructor () {
    super()
    this.state = { height: 300, imgHeightCalculated: false }
    this.shouldLoadContent = false
  }

  render () {
    const { piece, onClick, shouldLoad, onImageLoad, innerHeight, isMobile } = this.props
    const type = fileType(piece.media)
    this.shouldLoadContent = this.shouldLoadContent || shouldLoad
  
    const imgHeight = innerHeight - (isMobile ? 40 : 160)

    const sizeStyles = {
      height: imgHeight
    }

    return <StyledDiv onClick={onClick}>

      { this.shouldLoadContent ?
        <>
          { type === 'IMAGE' &&
            <StyledImg 
              style={sizeStyles}
              src={transformCloudinaryUrlForHeight(piece.media, imgHeight)} 
              onLoad={onImageLoad} 
            />
          }
          { type === 'VIDEO' && 
            <StyledVideo
              style={sizeStyles}
              src={transformCloudinaryUrlForHeight(piece.media, imgHeight)}
              poster={transformCloudinaryUrlForHeight(piece.poster, imgHeight)}
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
              imgSrc={transformCloudinaryUrlForHeight(piece.poster, imgHeight)}
            />
          }
        </> : <StyledImg src='img/grey-square.gif' onLoad={onImageLoad} />
      }
    </StyledDiv>
  
  }
}
