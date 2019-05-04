import React from 'react'
import { rhythm } from '../utils/typography'
import License from '../components/license';

const TIL = ({ nodes }) => (
  <main>
    {nodes.map((node) => (
      <article key={node.id}>
        <h1
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          {node.frontmatter.title}
        </h1>
        <small><time dateTime={node.frontmatter.date}>{node.frontmatter.date}</time></small>
        {!!node.frontmatter.category && (
          <small>
            {` • `}
            {node.frontmatter.category}
          </small>
        )}
        <p dangerouslySetInnerHTML={{ __html: node.html }} />
        <hr />
      </article>
    ))}
    <footer>
      <License />
    </footer>
    <hr />
  </main>
);

export default TIL
