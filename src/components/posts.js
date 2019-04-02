import React from 'react'
import { Link } from 'gatsby'

import Layout from './Layout'
import SEO from './seo'
import { rhythm } from '../utils/typography'

function urlTransform(text) {
  return text.trim().replace(/ /g, '-').replace(/\./g, '').toLowerCase();
}

class Posts extends React.Component {
  render() {
    const { data, title, subtitle } = this.props
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title="LaySent's Blog" subtitle={subtitle}>
        <SEO
          title={title}
          keywords={['JavaScript', 'Web', 'Blog', 'LaySent']}
          location={this.props.location}
        />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          const date = node.frontmatter.date;
          const hasTags = node.frontmatter.tags && node.frontmatter.tags.length > 0;
          const hasCategory = !!node.frontmatter.category;

          return (
            <article key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={`blog/post${node.fields.slug}`}>
                  {title}
                </Link>
              </h3>
              <small><time dateTime={date}>{date}</time></small>
              <small lang="en"> • {node.timeToRead}min to read</small>
              {hasCategory && (
                <small>
                  {` • `}
                  <Link style={{ boxShadow: `none` }} to={`/blog/category/${urlTransform(node.frontmatter.category)}/`}>
                    {node.frontmatter.category}
                  </Link>
                </small>
              )}
              {hasTags && (
                <small>
                {` • `}
                {node.frontmatter.tags.split(',').map((tag, i, tags) => (
                  <React.Fragment key={tag}>
                    <Link style={{ boxShadow: `none`, color: '#ffb600' }} to={`/blog/tag/${urlTransform(tag)}/`}>
                      #{tag.trim()}
                    </Link>
                    {i !== tags.length - 1 && ` / `}
                  </React.Fragment>
                ))}
                </small>
              )}
              <p dangerouslySetInnerHTML={{ __html: node.frontmatter.description }} />
            </article>
          )
        })}
      </Layout>
    )
  }
}

export default Posts
