import React from 'react';
import { graphql } from 'gatsby';

import Posts from '../components/posts';

class CategoryTemplate extends React.Component {
  render() {
    return (
      <Posts
        {...this.props}
        title={`${this.props.pageContext.category} Posts`}
        subtitle={this.props.pageContext.category}
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
        blogTitle
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter:  { category: { eq: $category } }, fields: { type: { ne: "til" } } }
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
