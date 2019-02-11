import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import scroll from 'scroll'
// import Layout from '../components/Layout'

import Project from '../components/Project'

const ProjectContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`

export default class IndexPage extends React.Component {
  constructor () {
    super()
    this.handleRef = this.handleRef.bind(this)
    this.projectIndex = 0
    this.pieceIndex = 0 // where 0 is the cover, and 1 is the first piece
  }

  componentDidMount () {

    const { data } = this.props
    let { edges: projects } = data.allMarkdownRemark

    const verticalScroll = () => {
      // the project we're scrolling to will always start with the cover,
      // so we first reset the scroll position of that project
      const projectElement = this.projectsContainer.children[this.projectIndex]
      projectElement.scrollLeft = 0
      this.pieceIndex = 0
      scroll.top(this.projectsContainer, window.innerHeight * this.projectIndex, { duration: 500 })
    }

    const horizontalScroll = () => {
      const projectElement = this.projectsContainer.children[this.projectIndex]
      const offset = projectElement.children[this.pieceIndex].offsetLeft
      scroll.left(projectElement, offset, { duration: 500 })
    }

    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp':
          if (this.projectIndex > 0) {
            this.projectIndex -= 1
            verticalScroll()
          }
        break
        case 'ArrowDown':
          if (this.projectIndex < projects.length - 1) {
            this.projectIndex += 1
            verticalScroll()
          }
        break
        case 'ArrowLeft':
          if (this.pieceIndex > 0) {
            this.pieceIndex -= 1
            horizontalScroll()
          }
        break
        case 'ArrowRight':
          const pieces = projects[this.projectIndex].node.frontmatter.pieces
          if (this.pieceIndex < pieces.length) {
            this.pieceIndex += 1
            horizontalScroll()
          }
        break
      }
    })
  }

  handleRef (el) {
    this.projectsContainer = el
    window.projectsContainer = el
    console.log('got project container', el)
  }

  render () {
    const { data } = this.props
    let { edges: projects } = data.allMarkdownRemark
    
    projects = projects.map(p => p.node)
    console.log(projects)

    return <ProjectContainer ref={this.handleRef}>
      { projects.map(p => <Project key={p.id} project={p} />)}
    </ProjectContainer>
  }

}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "project-page" } }}
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            templateKey,
            cover,
            pieces {
              title,
              description
            }
          }
        }
      }
    }
  }
`

// media {
//   childImageSharp {
//     fluid(maxWidth: 1075, quality: 72) {
//       ...GatsbyImageSharpFluid
//     }
//   }
// }