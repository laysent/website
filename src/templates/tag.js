import React from 'react';
import { graphql } from 'gatsby';

import Posts from '../components/posts';

class TagTemplate extends React.Component {
  render() {
    return (
      <Posts
        {...this.props}
        title={`#${this.props.pageContext.tag}`}
        subtitle={`#${this.props.pageContext.tag}`}
      />
    )
  }
}

export default TagTemplate;

export const pageQuery = graphql`
  query Tag($tagPattern: String!) {
    site {
      siteMetadata {
        title
        blogTitle
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter:  { tags: { regex: $tagPattern } } }
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
          }
        }
      }
    }
  }
`;
