import React from 'react';
import { graphql } from 'gatsby';

import Posts from '../components/posts';

class CategoryTemplate extends React.Component {
  render() {
    return (
      <Posts
        {...this.props}
        title={`${this.props.pageContext.category} Posts`}
      />
    )
  }
}

export default CategoryTemplate;

export const pageQuery = graphql`
  query Category($category: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter:  { category: { eq: $category } } }
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
