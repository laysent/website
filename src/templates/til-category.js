import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import TilPosts from '../components/til'

const TilCategoryTemplate = ({ data, location, pageContext }) => {
  const nodes = data.allMarkdownRemark.edges.map(edge => edge.node);
  const { category } = pageContext

  const headTitle = `Things I Learned (${category})`;
  return (
    <Layout
      location={location}
      title="Latest"
      to="/til/"
      subtitle={headTitle}
    >
      <SEO
        title={headTitle}
        keywords={['JavaScript', 'Web', 'Blog', 'LaySent']}
        location={location}
      />
      <TilPosts nodes={nodes} />
    </Layout>
  );
}

export default TilCategoryTemplate

export const pageQuery = graphql`
  query TilCategory($category: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "til" } } frontmatter: { category: { eq: $category } } }
    ) {
      edges {
        node {
          id
          html
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            category
          }
        }
      }
    }
  }
`
