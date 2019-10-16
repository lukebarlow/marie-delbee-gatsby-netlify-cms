import React from 'react'
// import styled from 'styled-components'

import AudioPlayer2 from './AudioPlayer2.js'
import fileType from '../common/fileType.js'
import { transformCloudinaryUrlForWidth } from '../common/transformCloudinaryUrl.js'

// import { portraitSelector, landscapeSelector } from '../mediaSelectors.js'
// import { pieceSizeCss } from '../styles/elements.js'

// const StyledDiv = styled.div`
//   height: 100vh;
//   padding-left: 150px;
//   padding-top: 80px;

//   @media ${portraitSelector} {
//     padding-left: 5px;
//     padding-top: 5px;
//   }

//   @media ${landscapeSelector} {
//     padding-left: 10px;
//     padding-top: 10px;
//   }
// `

// const StyledImg = styled.img`
//   ${pieceSizeCss}
// `

// const StyledVideo = styled.video`
//   ${pieceSizeCss}
// `

export default class Piece extends React.Component {
  constructor () {
    super()
    this.state = { height: 300, imgHeightCalculated: false }
    this.shouldLoadContent = false
  }

  // componentDidMount () {
  //   const imgHeight = (document.body.clientHeight - 60)
  //   this.setState({ imgHeightCalculated: true, imgHeight })
  // }

  render () {
    const { piece, onClick, shouldLoad, onImageLoad, innerHeight, innerWidth } = this.props
    // const { imgHeight, imgHeightCalculated } = this.state

    // if (!imgHeightCalculated) {
    //   return null
    // }

    const imgHeight = innerWidth / 4

    const type = fileType(piece.media)
    this.shouldLoadContent = this.shouldLoadContent || shouldLoad
    
    const mediaWidth = innerWidth - 10
    const mediaUrl = transformCloudinaryUrlForWidth(piece.media, mediaWidth)
    const posterUrl = transformCloudinaryUrlForWidth(piece.poster, mediaWidth)

    const mediaStyle = { margin: '5px', width: mediaWidth, height: innerHeight - 160, objectFit: 'contain' }

    return <div onClick={onClick}>

      { this.shouldLoadContent ?
        <>
          { type === 'IMAGE' &&
            <img src={mediaUrl} onLoad={onImageLoad} style={mediaStyle} alt={piece.title} />
          }
          { type === 'VIDEO' && 
            <video
              style={mediaStyle}
              src={mediaUrl}
              poster={posterUrl}
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
              imgSrc={posterUrl}
            />
          }
        </> : <img src='img/grey-square.gif' onLoad={onImageLoad} alt={'loading...'} />
      }
    </div>
  
  }
}
