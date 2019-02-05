const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

function urlTransform(text) {
  return text.replace(/ /g, '-').replace(/\./g, '').toLowerCase();
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const categoryComponent = path.resolve(`./src/templates/category.js`)
  const tagComponent = path.resolve(`./src/templates/tag.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
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
        path: post.node.fields.slug,
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
        path: `/category/${urlTransform(cat)}/`,
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
        path: `/tag/${urlTransform(tag)}/`,
        component: tagComponent,
        context: {
          tag,
          tagPattern: `/(?:^|, )${tag.replace(/\./g, '\\.')}(?:$|,)/i`,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
