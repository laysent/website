module.exports = {
  pathPrefix: `/`,
  siteMetadata: {
    title: `LaySent's Blog`,
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
    process.env.NODE_ENV === 'production' ? undefined : {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/draft`,
        name: `draft`,
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
        path: `${__dirname}/content/daily`,
        name: `daily`,
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
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `LaySent's Blog`,
        short_name: `LaySent`,
        start_url: `/blog`,
        background_color: `#ffffff`,
        theme_color: `#007acc`,
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
    // redirection of pages is currently not necessary any more.
    // comment out for now.
    // still keeps this configuration here as it might be used later some day.
    // `gatsby-plugin-meta-redirect`,
  ].filter(_ => _),
}
