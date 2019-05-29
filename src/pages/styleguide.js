import React from 'react';
import License from '../components/license';
import Layout from '../components/layout';
import SEO from '../components/seo';

const content = [
  'Cupcake ipsum dolor sit amet gummi bears candy.',
  'Gummi bears jelly apple pie toffee candy canes.',
  'Marshmallow oat cake pie lollipop ice cream apple pie oat cake.',
  'Gummies dragée candy canes.',
].join(' ');
const paragraph = <p>{content}</p>;

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

const StyleGuide = (props) => (
  <Layout location={props.location} title="Homepage" to="/">
    <SEO title="Style Guide" description="Style Guide of Website" location={props.location} />
    <header>
      <h1>Style Guide</h1>
      <p>
        This style guide was based on <ExternalLink href="https://www.chenhuijing.com/styleguide/">
          Style Guide
        </ExternalLink> created by <ExternalLink href="https://www.chenhuijing.com/">
          Chen Hui Jing
        </ExternalLink>.
      </p>
    </header>
    <article>
      <section>
        <header><h1>Headings</h1></header>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </section>
      <hr />
      <section>
        <header><h1>Headings with Text</h1></header>
        <h1>Heading 1</h1>
        {paragraph}
        <h2>Heading 2</h2>
        {paragraph}
        <h3>Heading 3</h3>
        {paragraph}
        <h4>Heading 4</h4>
        {paragraph}
        <h5>Heading 5</h5>
        {paragraph}
        <h6>Heading 6</h6>
        {paragraph}
      </section>
      <hr />
      <section>
        <header>
          <h1>Generic Content</h1>
          {paragraph}
          {paragraph}
          <p>
            <img
              alt="Placeholder Image and Some Alt Text"
              src="http://lorempixel.com/400/200/sports"
              title="A title element for this placeholder image."
            />
          </p>
          {paragraph}
          <blockquote>
            "Computers will not be perfected until they can compute
            how much more than the estimate the job will cost."
          </blockquote>
        </header>
      </section>
      <hr />
      <section>
        <header><h1>Text Elements</h1></header>
        <p>The <a href="#">a element</a> example</p>
        <p>The <abbr>abbr element</abbr> and an <abbr title="Abbreviation">abbr</abbr> element with title examples</p>
        <p>The <acronym title="A Cowboy Ran One New York Marathon">ACRONYM</acronym> element example</p>
        <p>The <b>b element</b> example</p>
        <p>The <cite>cite element</cite> example</p>
        <p>The <code>code element</code> example</p>
        <p>The <em>em element</em> example</p>
        <p>The <del>del element</del> example</p>
        <p>The <dfn>dfn element</dfn> and <dfn title="Title text">dfn element with title</dfn> examples</p>
        <p>The <i>i element</i> example</p>
        <p>The <ins>ins element</ins> example</p>
        <p>The <kbd>kbd element</kbd> example</p>
        <p>The <mark>mark element</mark> example</p>
        <p>The <q>q element</q> example</p>
        <p>The <q>q element <q>inside</q> a q element</q> example</p>
        <p>The <s>s element</s> example</p>
        <p>The <samp>samp element</samp> example</p>
        <p>The <small>small element</small> example</p>
        <p>The <span>span element</span> example</p>
        <p>The <strong>strong element</strong> example</p>
        <p>The <sub>sub element</sub> example</p>
        <p>The <sup>sup element</sup> example</p>
        <p>The <u>u element</u> example</p>
        <p>The <var>var element</var> example</p>
        <p>The <ruby>ruby element<rp>(</rp><rt>注音符号</rt><rp>)</rp></ruby> example</p>
      </section>
      <hr />
      <section>
        <header><h1>Monospace / Preformatted</h1></header>
        <p>Code block wrapped in "pre" and "code" tags</p>
        <div className="gatsby-highlight" data-language="javascript">
          <pre className="language-javascript">
            <code class="language-javascript">
              <span class="token comment">// Loop through Divs using Javascript.</span>
              {'\n'}
              <span class="token keyword">var</span> divs <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelectorAll</span><span class="token punctuation">(</span><span class="token string">'div'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> i<span class="token punctuation">;</span>
              {'\n\n'}
              <span class="token keyword">for</span> <span class="token punctuation">(</span>i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> divs<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{'{'}</span>
              {'\n'}
              {'  divs'}<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>style<span class="token punctuation">.</span>color <span class="token operator">=</span> <span class="token string">"green"</span><span class="token punctuation">;</span>
              {'\n'}
              <span class="token punctuation">{'}'}</span>
            </code>
          </pre>
        </div>
        <p>Monospace Text wrapped in "pre" tags</p>
        <pre>{paragraph}</pre>
      </section>
      <hr />
      <section>
        <header><h1>List Types</h1></header>
        <h3>Ordered List</h3>
        <ol>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>List Item 3</li>
        </ol>
        <h3>Unordered List</h3>
        <ul>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>List Item 3</li>
        </ul>
        <h3>Definition List</h3>
        <dl>
          <dt>Definition List Term 1</dt>
          <dd>This is a definition list description.</dd>
          <dt>Definition List Term 2</dt>
          <dd>This is a definition list description.</dd>
          <dt>Definition List Term 3</dt>
          <dd>This is a definition list description.</dd>
        </dl>
      </section>
      <hr />
      <section>
        <header><h1>Tables</h1></header>
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th>Table Header 1</th>
              <th>Table Header 2</th>
              <th>Table Header 3</th>
            </tr>
            <tr>
              <td>Division 1</td>
              <td>Division 2</td>
              <td>Division 3</td>
            </tr>
            <tr class="even">
              <td>Division 1</td>
              <td>Division 2</td>
              <td>Division 3</td>
            </tr>
            <tr>
              <td>Division 1</td>
              <td>Division 2</td>
              <td>Division 3</td>
            </tr>
          </tbody>
        </table>
      </section>
      <hr />
      <section>
        <header><h1>Media Elements</h1></header>
        <p>The Audio Element:</p>
        <audio controls="controls">
          <source src="http://www.w3schools.com/tags/horse.ogg" type="audio/ogg" />
          <source src="http://www.w3schools.com/tags/horse.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <p>The Video Element:</p>
        <video width="320" height="240" controls="controls">
          <source src="http://www.w3schools.com/tags/movie.mp4" type="video/mp4" />
          <source src="http://www.w3schools.com/tags/movie.ogg" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </section>
      <hr />
      <footer>
        <License />
      </footer>
    </article>
  </Layout>
);

export default StyleGuide;
