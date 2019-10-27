const extraLinks = require('./extra-links');

module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `LaySent's Site`,
    blogTitle: `LaySent's Blog`,
    author: `LaySent`,
    description: `Site where LaySent writes thoughts.`,
    siteUrl: `https://laysent.github.io/`,
    social: {
      twitter: `laysent`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/til`,
        name: `til`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-graphviz`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-sectionize`,
          `gatsby-remark-ruby`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-31656866-1`,
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              blogTitle
              title: blogTitle
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
        `,
        feeds: [
          {
            serialize({ query: { site, allMarkdownRemark }}) {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + 'blog/post' + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + 'blog/post' + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { fields: { type: { ne: "til" } } },
                ) {
                  edges {
                    node {
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: '/blog/rss.xml',
            title: 'LaySent\'s Blog',
            match: '^/blog'
          },
          {
            serialize({ query: { site, allMarkdownRemark }}) {
              return allMarkdownRemark.edges.map(edge => {
                const date = edge.node.frontmatter.date;
                const [ year, month ] = date.split('-');
                const link = site.siteMetadata.siteUrl + 'til/' + year + '/' + month;
                const hash = edge.node.fields.slug.replace(/\//g, '');
                const url = link + '#' + hash;
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description,
                  date,
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { fields: { type: { eq: "til" } } },
                ) {
                  edges {
                    node {
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: '/til/rss.xml',
            title: 'Things I Learn (LaySent)',
            match: '^/til'
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `LaySent's Blog`,
        short_name: `LaySent`,
        start_url: `/blog`,
        background_color: `#ffffff`,
        theme_color: `#339af0`,
        display: `minimal-ui`,
        icon: `content/assets/icon.png`,
      },
    },
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-robots-txt`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: `daily`,
              priority: 0.7,
            }
          }).concat(extraLinks.map(url => ({
            url: site.siteMetadata.siteUrl + url,
            changefreq: 'daily',
            priority: 0.7,
          }))),
      },
    }
    // redirection of pages is currently not necessary any more.
    // comment out for now.
    // still keeps this configuration here as it might be used later some day.
    // `gatsby-plugin-meta-redirect`,
  ].filter(_ => _),
}
