const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            contentfulAbout {
              name
              profile {
                fluid {
                  src
                }
              }
              articles {
                title
                subtitle
                uniqueSlug
                readingTime
                createdAt(formatString: "MMMM Do, YYYY")
                body {
                  childMarkdownRemark {
                    html
                  }
                }
                tags
                heroImage {
                  title
                  description
                  fluid: resize(width: 200, quality: 100) {
                    src
                  }
                }
              }
            }
          }
        `,
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.contentfulAbout.articles
        posts.forEach((post, index) => {
          createPage({
            path: `/blog/${post.uniqueSlug}/`,
            component: blogPost,
            context: {
              ...post,
              name: result.data.contentfulAbout.name,
              profile: result.data.contentfulAbout.profile,
            },
          })
        })
      }),
    )
  })
}
