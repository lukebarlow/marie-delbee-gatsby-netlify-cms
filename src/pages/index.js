import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// import Layout from '../components/Layout'

import Project from '../components/Project'

export default class IndexPage extends React.Component {

  render () {

    const { data } = this.props
    let { edges: projects } = data.allMarkdownRemark
    
    projects = projects.map(p => p.node)

    console.log(projects)

    return <div>
      { projects.map(p => <Project key={p.id} project={p} />)}
    </div>
  }

  // render() {
  //   const { data } = this.props
  //   const { edges: posts } = data.allMarkdownRemark

  //   return (
  //     <Layout>
  //       <section className="section">
  //         <div className="container">
  //           <div className="content">
  //             <h1 className="has-text-weight-bold is-size-2">Latest Stories</h1>
  //           </div>
  //           {posts
  //             .map(({ node: post }) => (
  //               <div
  //                 className="content"
  //                 style={{ border: '1px solid #333', padding: '2em 4em' }}
  //                 key={post.id}
  //               >
  //                 <p>
  //                   <Link className="has-text-primary" to={post.fields.slug}>
  //                     {post.frontmatter.title}
  //                   </Link>
  //                   <span> &bull; </span>
  //                   <small>{post.frontmatter.date}</small>
  //                 </p>
  //                 <p>
  //                   {post.excerpt}
  //                   <br />
  //                   <br />
  //                   <Link className="button is-small" to={post.fields.slug}>
  //                     Keep Reading →
  //                   </Link>
  //                 </p>
  //               </div>
  //             ))}
  //         </div>
  //       </section>
  //     </Layout>
  //   )
  // }
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
          fields {
            slug
          }
          frontmatter {
            title
            templateKey,
            pieces {
              title,
              media {
                childImageSharp {
                  fluid(maxWidth: 1075, quality: 72) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              description
            }
          }
        }
      }
    }
  }
`
