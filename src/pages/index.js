import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import MediaQuery from 'react-responsive'

import App from '../components/App.js'
import PortraitApp from '../components/PortraitApp.js'

export default class IndexPage extends React.Component {
  render () {
    const { data } = this.props
    const projects = data.projects.edges[0].node.frontmatter.projects
    const info = data.infoPage.edges[0].node.body
    return <>
      <MediaQuery orientation='landscape'>
        <App projects={projects} info={info} />
      </MediaQuery>
      <MediaQuery orientation='portrait'>
        <PortraitApp projects={projects} info={info} />
      </MediaQuery>
    </>
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
      filter: { frontmatter: { templateKey: { eq: "projects-page" } }}
    ) {
      edges {
        node {
          id
          frontmatter {
            projects {
              title
              cover,
              poster,
              pieces {
                title,
                description,
                media,
                poster
              }
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
