import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import cc from '../utils/cc.png';

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
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext
    const { date, modified, title, description } = post.frontmatter;

    const hasBeenModified = modified && (modified !== date);
    return (
      <Layout location={this.props.location} title={siteTitle}>
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
            <div className="license" style={{ marginBottom: rhythm(1), fontSize: rhythm(0.5) }}>
              <a
                rel="license noopener noreferrer"
                href="http://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
              >
                <img
                  alt="Creative Commons License"
                  src={cc}
                />
              </a>
              <div>
                {React.createElement('span', {
                  'xmlns:dct': 'http://purl.org/dc/terms/',
                  href: 'http://purl.org/dc/dcmitype/Text',
                  property: 'dct:title',
                  rel: 'dct:type',
                }, 'Every blog post in this site')}
                <span> by </span>
                {React.createElement('a', {
                  'xmlns:cc': 'http://creativecommons.org/ns#',
                  href: 'https://github.com/laysent',
                  property: 'cc:attributionName',
                  rel: 'cc:attributionURL noopener noreferrer',
                  target: '_blank',
                }, 'LaySent')}
                <span> is licensed under a </span>
                <a
                  rel="license noopener noreferrer"
                  href="http://creativecommons.org/licenses/by-nc/4.0/"
                  target="_blank"
                >
                  CC 4.0 License
                </a>
                <span>, based on a work at </span>
                {React.createElement('a', {
                  'xmlns:dct': 'http://purl.org/dc/terms/',
                  href: 'http://github.com/laysent/blog',
                  rel: 'dct:source noopener noreferrer',
                  target: '_blank',
                }, 'GitHub')}
                <span>. You can see the source code of this blog site </span>
                <a
                  href="https://github.com/laysent/blog/tree/gh-pages"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/laysent/blog
                </a>
                <span>.</span>
              </div>
            </div>
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
        title
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
