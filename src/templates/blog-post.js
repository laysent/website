import React from 'react'
import { Link, graphql } from 'gatsby'
import License from '../components/license';
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'


class BlogPostTemplate extends React.Component {
  componentDidMount() {
    /**
     * Dynamically add KaTeX style support, only when KaTeX is detected.
     * This will save a lot of space for compiled HTML pages,
     * as most of the posts does not have math equations.
     * Thus, no need to pre-compile KaTeX css into HTML <head>.
     */
    if (document.body.querySelector('.katex')) {
      import('katex/dist/katex.min.css'/* webpackChunkName: "katex" */);
    }
  }
  render() {
    const post = this.props.data.markdownRemark
    const blogTitle = this.props.data.site.siteMetadata.blogTitle
    const { previous, next } = this.props.pageContext
    const { date, modified, title, description } = post.frontmatter;

    const hasBeenModified = modified && (modified !== date);
    return (
      <Layout location={this.props.location} title={blogTitle} to="/blog/">
        <SEO title={title} description={description} location={this.props.location} />
        <article itemScope itemType="http://schema.org/BlogPosting">
          <header>
            <h1 itemProp="headline">{title}</h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
                marginTop: rhythm(-1),
              }}
            >
              <time itemProp="datePublished" dateTime={date}>{date}</time>
              {hasBeenModified && (
                <span> • (modified: <time itemProp="dateModified" dateTime={modified}>{modified}</time>)</span>
              )}
              <span itemScope itemType="http://schema.org/Person" itemProp="author"> • by <span itemProp="name">LaySent</span></span>
            </p>
          </header>
          <div dangerouslySetInnerHTML={{ __html: post.html }} itemProp="articleBody" />
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <footer>
            <License />
          </footer>
        </article>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />

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
                <Link to={`blog/post${previous.fields.slug}`} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={`blog/post${next.fields.slug}`} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        blogTitle
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        modified(formatString: "YYYY-MM-DD")
        description
      }
    }
  }
`
