import React from 'react'

import fileType from '../common/fileType.js'

// import {
//   ProjectLandingScreen,
//   ProjectTitle,
//   ProjectVideoWrapper,
// } from '../styles/elements.js'

export default class ProjectCover extends React.Component {
  render () {
    const { innerWidth, innerHeight, isPortrait, project, onClick, onCoverTouch } = this.props
    const width = innerWidth
    const height = isPortrait ? null : innerHeight

    const coverStyle = { width: width, height, marginBottom: '-8px', objectFit: 'cover' }
    const estimatedPieceHeight = width / 1.4

    return <div 
        style={{position: 'relative', cursor: 'pointer' }} 
        onClick={onClick} 
        onTouchStart={onCoverTouch}
        onWheel={onCoverTouch}
      >
      { 
      fileType(project.cover) === 'IMAGE' ?
        <img src={project.cover} style={coverStyle}  alt={project.title}/>
        :
        <video
          style={coverStyle}
          src={project.cover}
          poster={project.poster}
          muted
          autoPlay
          loop
          playsInline
        />
      }
      <div style={{ 
        color: 'white', 
        zIndex: 1, 
        position: 'absolute', 
        top: estimatedPieceHeight / 4,
        fontSize: innerWidth > 500 ? '40px' : '30px',
        width,
        textAlign: 'center'
      }}>
        {project.title}
      </div>
    </div>
  }
}