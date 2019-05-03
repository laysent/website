import React from 'react'
import { rhythm } from '../utils/typography'
import cc from '../utils/cc.png';

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
    <hr />
  </main>
);

export default TIL
