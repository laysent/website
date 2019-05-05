import React from 'react'
import { rhythm } from '../utils/typography'
import License from '../components/license';

const TIL = ({ nodes }) => (
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

export default TIL
