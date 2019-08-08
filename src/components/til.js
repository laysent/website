import React from 'react'
import { rhythm } from '../utils/typography'
import License from '../components/license';

class TIL extends React.Component {
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
    const { nodes } = this.props;
    return (
      <main>
        {nodes.map((node) => (
          <article key={node.id} itemScope itemType="http://schema.org/BlogPosting">
            <h1
              style={{
                marginBottom: rhythm(1 / 4),
              }}
            >
              {node.frontmatter.title}
            </h1>
            <p>
              <small>
                <time itemProp="datePublished" dateTime={node.frontmatter.date}>
                  {node.frontmatter.date}
                </time>
              </small>
              {!!node.frontmatter.category && (
                <small>
                  {` • `}
                  {node.frontmatter.category}
                </small>
              )}
              <small>
                <span itemScope itemType="http://schema.org/Person" itemProp="author"> • by <span itemProp="name">LaySent</span></span>
              </small>
            </p>
            <div dangerouslySetInnerHTML={{ __html: node.html }} itemProp="articleBody" />
            <hr />
          </article>
        ))}
        <footer>
          <License />
        </footer>
        <hr />
      </main>
    );
  }
}

export default TIL
