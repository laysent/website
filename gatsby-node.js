const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

function urlTransform(text) {
  return text.replace(/ /g, '-').replace(/\./g, '').toLowerCase()
}

function createTILPages(graphql, createPage) {
  const tilTemplate = path.resolve(`./src/templates/til-per-month.js`)
  const tilCategoryTemplate = path.resolve(`./src/templates/til-category.js`)
  const tilPage = path.resolve(`./src/templates/til.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { fields: { type: { eq: "til" } } }
        ) {
          edges {
            node {
              frontmatter {
                category
                title
                date(formatString: "YYYY-MM-DD")
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    const things = result.data.allMarkdownRemark.edges
    const dates = [...new Set(things.map(thing => {
      const date = thing.node.frontmatter.date
      const [year, month] = date.split('-')
      return `${year}-${month}`
    }))]

    dates.forEach((date, index) => {
      const [ year, month ] = date.split('-')
      const previous = index === dates.length - 1 ? null : dates[index + 1]
      const next = index === 0 ? null : dates[index - 1]
      createPage({
        path: `/til/${year}/${month}`,
        component: tilTemplate,
        context: {
          startInMonth: `${year}-${month}-01`,
          endInMonth: `${year}-${month}-31`,
          time: date,
          previous,
          next,
        },
      })
    })

    things.forEach((til, index) => {
      const { date, title } = til.node.frontmatter
      const previous = index === things.length - 1 ? null : {
        time: things[index + 1].node.frontmatter.date,
        title: things[index + 1].node.frontmatter.title
      }
      const next = index === 0 ? null : {
        time: things[index - 1].node.frontmatter.date,
        title: things[index - 1].node.frontmatter.title
      }
      createPage({
        path: `/til/${date}_${title.toLowerCase().replace(/ /g, '-')}`,
        component: tilPage,
        context: {
          time: date,
          title,
          previous,
          next
        }
      })
    })

    const categories = [...new Set(things.map(thing => thing.node.frontmatter.category))]
    categories.forEach((category) => {
      createPage({
        path: `/til/category/${category.toLowerCase()}`,
        component: tilCategoryTemplate,
        context: {
          category
        }
      })
    })
  })
}

function createPostPages(graphql, createPage) {
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const categoryComponent = path.resolve(`./src/templates/category.js`)
  const tagComponent = path.resolve(`./src/templates/tag.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
          filter: { fields: { type: { ne: "til" } } }
        ) {
          edges {
            node {
              fields {
                slug
                type
              }
              frontmatter {
                title
                category
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `/blog/post${post.node.fields.slug}`,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // create category pages
    const categories = posts.reduce((categorySet, post) => {
      categorySet.add(post.node.frontmatter.category)
      return categorySet
    }, new Set())

    Array.from(categories).forEach((cat) => {
      createPage({
        path: `/blog/category/${urlTransform(cat)}/`,
        component: categoryComponent,
        context: {
          category: cat,
        },
      })
    })

    // create tag pages
    const tags = posts.reduce((tagSet, post) => {
      post.node.frontmatter.tags.split(',').forEach((t) => {
        tagSet.add(t.trim())
      })
      return tagSet
    }, new Set())

    Array.from(tags).forEach((tag) => {
      createPage({
        path: `/blog/tag/${urlTransform(tag)}/`,
        component: tagComponent,
        context: {
          tag,
          tagPattern: `/(?:^|, )${tag.replace(/\./g, '\\.')}(?:$|,)/i`,
        },
      })
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return Promise.all([
    createPostPages(graphql, createPage),
    createTILPages(graphql, createPage),
  ])
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const content = path.resolve(__dirname, 'content')
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const relative = path.relative(content, node.fileAbsolutePath)
    const folder = relative.split('/')[0]
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
    createNodeField({
      name: `type`,
      node,
      value: folder,
    })
  }
}
