import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import License from '../components/license'
import TilPost from '../components/til-post'
import { rhythm } from '../utils/typography'


class TilPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const { date, category, title } = post.frontmatter;

    const [year, month] = date.split('-')
    const header = `Things I Learned (${year}-${month})`
    return (
      <Layout location={this.props.location} title={header} to={`/til/${year}/${month}`}>
        <SEO title={title} location={this.props.location} keywords={['JavaScript', 'Web', 'Blog', 'LaySent']} />
        <TilPost
          title={title}
          date={date}
          category={category}
          html={post.html}
        />
        <footer>
          <License />
        </footer>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
      </Layout>
    )
  }
}

export default TilPostTemplate

export const pageQuery = graphql`
  query TilPost($time: Date!, $title: String!) {
    markdownRemark(
      fields: { type: { eq: "til" } } frontmatter: { date: { eq: $time } title: { eq: $title } }
    ) {
      id
      html
      frontmatter {
        title
        category
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
