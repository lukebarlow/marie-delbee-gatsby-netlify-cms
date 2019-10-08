import React from 'react'

import fileType from '../common/fileType.js'

export default class ProjectCover extends React.Component {
  render () {
    const { innerWidth, innerHeight, isPortrait, project } = this.props

    const width = innerWidth
    const height = isPortrait ? null : innerHeight

    const coverStyle = { width, height, marginBottom: '-8px', objectFit: 'cover' }

    return <div>covere here</div>

    // return <div style={{  }}>{ 
    //   fileType(project.cover) === 'IMAGE' ?
    //     <img src={project.cover} style={coverStyle} />
    //     :
    //     <video
    //       style={coverStyle}
    //       src={project.cover}
    //       poster={project.poster}
    //       muted
    //       autoPlay
    //       loop
    //       playsInline
    //     />
    //   }
    // </div>
  }
}