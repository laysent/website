import React from 'react'
import { rhythm } from '../utils/typography'

const Daily = ({ nodes }) => (
  <main>
    {nodes.map((node) => (
      <article key={node.id}>
        <h3
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          {node.frontmatter.title}
        </h3>
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
  </main>
);

export default Daily
