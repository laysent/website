import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import DailyPosts from '../components/daily'

class Daily extends React.Component {
  render() {
    const { data } = this.props;
    const nodes = data.allMarkdownRemark.edges.map(edge => edge.node);
    let more
    if (nodes.length > 0) {
      const latest = nodes[0].frontmatter.date
      const [ year, month ] = latest.split('-')
      more = `${year}-${month}`
    }

    return (
      <Layout location={this.props.location} title="LaySent" subtitle="What did I learn today">
        <SEO
          title={this.props.data.site.siteMetadata.title}
          keywords={['JavaScript', 'Web', 'Blog', 'LaySent']}
          location={this.props.location}
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
              {more && <Link to={`daily/${more.replace('-', '/')}`} rel="more">
                ← {more}
              </Link>}
            </li>
            <li></li>
          </ul>
        </nav>
      </Layout>
    );
  }
}

export default Daily;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "daily" } } }
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
