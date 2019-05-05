import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import TilPosts from '../components/til'

const TilPerMonthTemplate = ({ data, location, pageContext }) => {
  const nodes = data.allMarkdownRemark.edges.map(edge => edge.node);
  const { previous, next } = pageContext

  return (
    <Layout
      location={location}
      title="Latest"
      to="/til/"
      subtitle={`Things I Learned (${pageContext.time})`}
    >
      <SEO
        title={data.site.siteMetadata.title}
        keywords={['JavaScript', 'Web', 'Blog', 'LaySent']}
        location={location}
      />
      <TilPosts nodes={nodes} />
      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`til/${previous.replace('-', '/')}`} rel="prev">
                ← {previous}
              </Link>
            )}
          </li>
          <li>
            {next ? (
              <Link to={`til/${next.replace('-', '/')}`} rel="next">
                {next} →
              </Link>
            ) : (
              <Link to="/til" rel="latest">
                Latest
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
}

export default TilPerMonthTemplate

export const pageQuery = graphql`
  query TilPerMonth($glob: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "til" } } frontmatter: { date: { glob: $glob } } }
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
