import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import TilPosts from '../components/til'

const linkStyle = {
  width: '33%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}

const TilPerMonthTemplate = ({ data, location, pageContext }) => {
  const nodes = data.allMarkdownRemark.edges.map(edge => edge.node);
  const { previous, next } = pageContext

  const headTitle = `Things I Learned (${pageContext.time})`;
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
      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-around`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li style={linkStyle}>
            {previous && (
              <Link to={`til/${previous.replace('-', '/')}`} rel="prev">
                ← {previous}
              </Link>
            )}
          </li>
          <li style={{ ...linkStyle, textAlign: 'center' }}>
            <Link to="/til/table-of-contents" rel="toc" title="Table of Contents">Table of Contents</Link>
          </li>
          <li style={{ ...linkStyle, textAlign: 'right' }}>
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
  query TilPerMonth($startInMonth: Date!, $endInMonth: Date!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "til" } } frontmatter: { date: { gte: $startInMonth, lte: $endInMonth } } }
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
