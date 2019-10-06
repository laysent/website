import React from 'react';
import { rhythm } from '../utils/typography'
import { Link } from 'gatsby'

class TilPost extends React.Component {
  render() {
    const { withLink, title, date, category, html } = this.props
    return (
      <article itemScope itemType="http://schema.org/BlogPosting">
        <h1
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          {title}
          {
            withLink &&
            <Link
              to={`/til/${date}_${title.toLowerCase().replace(/ /g, '-')}`}
              className="no-link-style"
              style={{ fontSize: rhythm(1 / 2), marginLeft: rhythm(1 / 2) }}
            >
              🔗
            </Link>
          }
        </h1>
        <p>
          <small>
            <time itemProp="datePublished" dateTime={date}>
              {date}
            </time>
          </small>
          {!!category && (
            <small>
              {` • `}
              <Link to={`/til/category/${category.toLowerCase()}`}>
                {category}
              </Link>
            </small>
          )}
          <small>
            <span itemScope itemType="http://schema.org/Person" itemProp="author"> • by <span itemProp="name">LaySent</span></span>
          </small>
        </p>
        <div dangerouslySetInnerHTML={{ __html: html }} itemProp="articleBody" />
        <hr />
      </article>
    );
  }
}

export default TilPost
