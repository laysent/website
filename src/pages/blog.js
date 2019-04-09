import React from 'react'
import { graphql } from 'gatsby'

import Posts from '../components/posts';

class BlogIndex extends React.Component {
  render() {
    return (
      <Posts
        {...this.props}
        title="All posts"
      />
    );
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { ne: "til" } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          timeToRead
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            description
            tags
            category
          }
        }
      }
    }
  }
`
