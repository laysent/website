import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import TilPosts from '../components/til'

class Til extends React.Component {
  render() {
    const { data } = this.props;
    const nodes = data.allMarkdownRemark.edges.map(edge => edge.node);
    let more
    let isCurrentMonth = false;
    if (nodes.length > 0) {
      const latest = nodes[0].frontmatter.date
      const [ year, month ] = latest.split('-')
      more = `${year}-${month}`
      const now = new Date()
      isCurrentMonth = (now.getFullYear() === year) && (now.getMonth() + 1 === month)
    }

    return (
      <Layout location={this.props.location} title={data.site.siteMetadata.title} isRoot to="/">
        <SEO
          title="Things I Learn"
          keywords={['JavaScript', 'Web', 'Blog', 'LaySent']}
          location={this.props.location}
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
              {more && <Link to={`til/${more.replace('-', '/')}`} rel="more">
                ← {more}
              </Link>}
            </li>
            <li><Link to="/til/table-of-contents" rel="toc">Table of Contents</Link></li>
            <li></li>
          </ul>
        </nav>
      </Layout>
    );
  }
}

export default Til;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "til" } } }
      limit: 10
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
`;
