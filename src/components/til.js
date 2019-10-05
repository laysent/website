import React from 'react'
import { Link } from 'gatsby'
import License from '../components/license';
import Katex from './katex'
import TilPost from './til-post'

class TIL extends React.Component {
  render() {
    const { nodes } = this.props;
    return (
      <main>
        <Katex />
        {nodes.map((node) => (
          <TilPost
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            category={node.frontmatter.category}
            html={node.html}
            key={node.id}
            withLink
          />
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
