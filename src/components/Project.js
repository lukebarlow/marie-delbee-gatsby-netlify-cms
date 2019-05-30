import React from 'react'
import MediaQuery from 'react-responsive'
import styled from 'styled-components'

import {
  ProjectLandingScreen,
  ProjectTitle,
  ProjectVideoWrapper,
} from '../styles/elements.js'

import fileType from '../common/fileType.js'
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

const StyledImg = styled.img`
  display: block;
  width: auto;
  min-width: calc(100vw);
  min-height: calc(100vh);
  max-width: calc(100vmax);
  max-height: calc(100vmax);
  object-fit: cover;
`

const StyledVideo = styled.video`
  display: block;
  width: auto;
  min-width: calc(100vw);
  min-height: calc(100vh);
`

export default ({ project, isCurrent = false, pieceIndex, onPieceClick, onImageLoad }) => (
  <StyledProjectPaginator>
    <ProjectLandingScreen backgroundImage={project.image} onClick={onPieceClick}>
      <ProjectVideoWrapper>
        { fileType(project.cover) === 'IMAGE' ?
          <StyledImg src={project.cover} />
          :
          <StyledVideo
            src={project.cover}
            poster={project.poster}
            muted
            autoPlay
            loop
            playsInline
          />
        }
      </ProjectVideoWrapper>
      <ProjectTitle>
        {project.title}
        <MediaQuery minWidth={768}>
          <ProjectArrow>
            <img alt="" src="/img/arrow.svg" />
          </ProjectArrow>
        </MediaQuery>
      </ProjectTitle>
      
    </ProjectLandingScreen>
      { project.pieces.map((piece, i) => <Piece 
          key={i} 
          piece={piece} 
          shouldLoad={isCurrent && (i - pieceIndex < 3)} 
          onClick={onPieceClick}
          onImageLoad={onImageLoad}
        />)
      }
      <EndPadding />
    </StyledProjectPaginator>
)