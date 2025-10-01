const { createClient } = require('contentful')
const RssParser = require('rss-parser')
const crypto = require('crypto')

const getAbout = (entry) => entry.sys.contentType.sys.id === 'about'

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    type MediumUser implements Node {
      id: ID!
      username: String!
      name: String!
      posts: [MediumPost] @link(by: "parent.id", from: "id")
    }

    type MediumPost implements Node {
      id: ID!
      uniqueSlug: String!
      title: String!
      createdAt: Date @dateformat(formatString: "MMM YYYY")
      virtuals: MediumPostVirtuals!
      parent: MediumUser @link(by: "id")
    }

    type MediumPostVirtuals {
      subtitle: String
      readingTime: Int!
      previewImage: MediumPostPreviewImage!
    }

    type MediumPostPreviewImage {
      imageId: String
    }
  `

  createTypes(typeDefs)
}

// Helper function to extract image from RSS content
const extractImageFromContent = (content, title) => {
  if (!content) return null

  // Try to find img tag in content
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1]
  }

  // Fallback to Medium's default pattern
  return null
}

// Helper function to estimate reading time
const estimateReadingTime = (content) => {
  if (!content) return 1

  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length

  // Average reading speed is ~200 words per minute
  return Math.max(1, Math.ceil(words / 200))
}

// Helper function to extract unique slug from Medium URL
const extractUniqueSlug = (url) => {
  const match = url.match(/\/([^\/]+)$/)
  return match ? match[1] : crypto.randomUUID()
}

exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions

  // Fetch Contentful data
  const client = createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  })

  const { items } = await client.getEntries()
  const about = items.find(getAbout)
  const { mediumUser = '@medium' } = about.fields

  console.log('✅ Contentful data fetched successfully')

  // Skip Medium integration if user is @medium (default)
  if (mediumUser === '@medium') {
    console.log('⚠️  Medium user not configured, skipping RSS feed')
    return
  }

  try {
    console.log(`🔍 Fetching Medium RSS feed for ${mediumUser}...`)

    const parser = new RssParser({
      customFields: {
        item: ['creator', 'content:encoded', 'content', 'description'],
      },
    })

    const feed = await parser.parseURL(`https://medium.com/feed/${mediumUser}`)

    console.log(
      `✅ Successfully fetched ${feed.items.length} posts from Medium RSS`,
    )

    // Create Medium User node
    const userNodeId = createNodeId(`MediumUser-${mediumUser}`)
    const userNode = {
      id: userNodeId,
      username: mediumUser,
      name: feed.title || mediumUser,
      internal: {
        type: 'MediumUser',
        contentDigest: createContentDigest({
          username: mediumUser,
          name: feed.title,
        }),
      },
    }

    createNode(userNode)

    // Create Medium Post nodes
    const posts = feed.items.map((item, index) => {
      const uniqueSlug = extractUniqueSlug(item.link)
      const content =
        item['content:encoded'] || item.content || item.description || ''
      const previewImage = extractImageFromContent(content, item.title)
      const readingTime = estimateReadingTime(content)
      const postNodeId = createNodeId(`MediumPost-${uniqueSlug}`)

      return {
        id: postNodeId,
        uniqueSlug,
        title: item.title,
        createdAt: new Date(item.pubDate),
        virtuals: {
          subtitle: item.description || item.contentSnippet || item.title || '',
          readingTime: readingTime || 1,
          previewImage: {
            imageId: previewImage || '',
          },
        },
        internal: {
          type: 'MediumPost',
          contentDigest: createContentDigest({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
          }),
        },
        parent: userNodeId,
      }
    })

    // Create all post nodes
    posts.forEach((post) => createNode(post))

    console.log(`📝 Created ${posts.length} Medium post nodes`)
  } catch (error) {
    console.warn('⚠️  Failed to fetch Medium RSS feed:', error.message)
    console.warn('   Building without Medium posts...')

    // Create empty user node to prevent GraphQL errors
    const emptyUserNodeId = createNodeId(`MediumUser-${mediumUser}`)
    const emptyUserNode = {
      id: emptyUserNodeId,
      username: mediumUser,
      name: mediumUser,
      posts: [],
      internal: {
        type: 'MediumUser',
        contentDigest: createContentDigest({
          username: mediumUser,
          name: mediumUser,
          posts: [],
        }),
      },
    }

    createNode(emptyUserNode)
  }
}
