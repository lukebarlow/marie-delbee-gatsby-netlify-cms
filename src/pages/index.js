import React from 'react'
import PropTypes from 'prop-types'

import App from '../components/App.js'

export default class IndexPage extends React.Component {
  render () {
    const { data } = this.props
    let { edges: projects } = data.allMarkdownRemark
    projects = projects.map(p => p.node)
    return <App projects={projects} />
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
              description,
              media
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