import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import DailyPosts from '../components/daily'

const DailyPerMonthTemplate = ({ data, location, pageContext }) => {
  const nodes = data.allMarkdownRemark.edges.map(edge => edge.node);
  const { previous, next } = pageContext

  return (
    <Layout
      location={location}
      title="LaySent"
      subtitle={`What did I learn today (${pageContext.time})`}
    >
      <SEO
        title={data.site.siteMetadata.title}
        keywords={['JavaScript', 'Web', 'Blog', 'LaySent']}
        location={location}
      />
      <DailyPosts nodes={nodes} />
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
              <Link to={`daily/${previous.replace('-', '/')}`} rel="prev">
                ← {previous}
              </Link>
            )}
          </li>
          <li>
            {next ? (
              <Link to={`daily/${next.replace('-', '/')}`} rel="next">
                {next} →
              </Link>
            ) : (
              <Link to="daily" rel="latest">
                Latest
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
}

export default DailyPerMonthTemplate

export const pageQuery = graphql`
  query DailyPerMonth($glob: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: ASC }
      filter: { fields: { type: { eq: "daily" } } frontmatter: { date: { glob: $glob } } }
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
