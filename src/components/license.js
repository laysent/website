import React from 'react';
import cc from '../utils/cc.png';
import { rhythm } from '../utils/typography'

const License = () => (
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
        href: 'http://github.com/laysent/website',
        rel: 'dct:source noopener noreferrer',
        target: '_blank',
      }, 'GitHub')}
      <span>. You can see the source code of this blog site at </span>
      <a
        href="https://github.com/laysent/laysent.github.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/laysent/laysent.github.io
      </a>
      <span>.</span>
    </div>
  </div>
);

export default License;
