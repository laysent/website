import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { rhythm, scale } from '../../utils/typography';

function aggregate(nodes) {
  const categories = new Map();
  nodes.forEach(({ node }) => {
    const { category } = node.frontmatter;
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category).push(node);
  });
  return Array.from(categories).sort((a, z) => {
    if (a[1].length < z[1].length) return 1;
    if (a[1].length > z[1].length) return -1;
    if (a[0] < z[0]) return -1;
    if (a[0] > z[0]) return 1;
    return 0;
  }).map(list => {
    list[1].sort((a, z) => {
      if (a.frontmatter.date < z.frontmatter.date) return 1;
      if (a.frontmatter.date > z.frontmatter.date) return -1;
      return 0;
    });
    return list;
  });
}

const linkStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  marginRight: rhythm(1),
};
const dateStyle = {
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
  fontFamily: "-apple-system,'BlinkMacSystemFont','PingFang SC','Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue','Helvetica','Arial','Hiragino Sans GB','Microsoft Yahei','WenQuanYi Micro Hei',sans-serif",
};

class TilToc extends React.Component {
  render() {
    const { data } = this.props;
    const categories = aggregate(data.allMarkdownRemark.edges);
    return (
      <Layout
        location={this.props.location}
        title="Home"
        to="/"
        subtitle="Things I Learn - Table of Contents"
      >
        <SEO
          title="Things I Learn - Table of Contents"
          keywords={['JavaScript', 'Web', 'Blog', 'LaySent', 'Things I Learn']}
          location={this.props.location}
        />
        {categories.map(([key, list], i) => (
          <details open={i === 0}>
            <summary style={{ ...scale(1 / 2), marginBottom: rhythm(1) }}>
              <Link to={`/til/category/${key.toLowerCase()}`}>{key}</Link>
            </summary>
            <ul>
              {list.map(node => {
                const { date, title } = node.frontmatter;
                return (
                  <li key={node.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link style={linkStyle} to={`/til/${date}_${title.toLowerCase().replace(/ /g, '-')}`} title={title}>
                      {title}
                    </Link>
                    <span style={dateStyle}>{date}</span>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </Layout>
    );
  }
}

export default TilToc;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fields: { type: { eq: "til" } } }
    ) {
      edges {
        node {
          id
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
