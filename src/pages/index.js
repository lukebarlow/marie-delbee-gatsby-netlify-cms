import React from 'react'
import PropTypes from 'prop-types'

import App from '../components/App.js'

export default class IndexPage extends React.Component {
  render () {
    const { data } = this.props

    const projects = data.projects.edges.map(p => p.node)
    const info = data.infoPage.edges[0].node.body

    return <App projects={projects} info={info} />
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
    projects: allMarkdownRemark(
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
              description,
              media
            }
          }
        }
      }
    }
    infoPage: allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "info-page" } }}
    ) {
      edges {
        
        node {
          id
          body: rawMarkdownBody
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