import React from 'react'

import styled from 'styled-components'

import {
  ProjectLandingScreen,
  ProjectTitle,
  ProjectVideoWrapper,
} from '../styles/elements.js'

import fileType from '../fileType.js'
import Piece from './Piece.js'

const StyledProjectPaginator = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

const EndPadding = styled.div`
 width: 100vw;
 height: 100vh;
`

const ProjectArrow = styled.div`
  position: absolute;
  top: 50%;
  right: 24px;
  margin-top: 8px;
  transform: translateY(-50%);

  img {
    display: block;
    width: auto;
    height: 32px;
  }
`

export default ({ project }) => (
  <StyledProjectPaginator>
    <ProjectLandingScreen backgroundImage={project.image}>
      <ProjectVideoWrapper
          videoWidth={project.videoWidth}
          videoHeight={project.videoHeight}
        >
        { fileType(project.frontmatter.cover) === 'IMAGE' ?
          <img src={project.frontmatter.cover} />
          :
          <video
            src={project.frontmatter.cover}
            poster={project.image}
            muted
            autoPlay
            loop
            playsInline
          />
        }
      </ProjectVideoWrapper>
      <ProjectTitle>
        {project.frontmatter.title}
        <ProjectArrow>
          <img alt="" src="/img/arrow.svg" />
        </ProjectArrow>
      </ProjectTitle>
      
    </ProjectLandingScreen>
    
      { project.frontmatter.pieces.map(piece => <Piece key={piece.title} piece={piece} />)}
      <EndPadding />
    </StyledProjectPaginator>
)