import React from 'react'

class Katex extends React.Component {
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
    return null;
  }
}

export default Katex;
