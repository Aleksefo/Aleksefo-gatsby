import { graphql, useStaticQuery } from 'gatsby'
import { MediumAuthor, MediumPost } from '../types'
import { MEDIUM_CDN, MEDIUM_URL } from '../utils/constants'

export type QueryResponse = {
  site: {
    siteMetadata: {
      isMediumUserDefined: boolean
    }
  }
  mediumUser: {
    id: string
    username: string
    name: string
    posts: {
      id: string
      uniqueSlug: string
      title: string
      createdAt: string
      virtuals: {
        subtitle: string
        readingTime: number
        previewImage: {
          imageId: string
        }
      }
    }[]
  }
}

type Response = {
  posts: MediumPost[]
  author: MediumAuthor | null
}

const EMPTY_RESPONSE = { author: null, posts: [] }

export const useMediumQuery = (): Response => {
  const data = useStaticQuery<any>(graphql`
    query MediumPostQuery {
      allMediumUser {
        nodes {
          id
          name
          username
          posts {
            id
            uniqueSlug
            title
            createdAt
            virtuals {
              subtitle
              readingTime
              previewImage {
                imageId
              }
            }
          }
        }
      }
    }
  `)

  const mediumUser = data.allMediumUser?.nodes?.[0]

  // Handle case where mediumUser is null/undefined
  if (!mediumUser) {
    return EMPTY_RESPONSE
  }

  const { posts: rawPosts, ...author } = mediumUser

  // Handle case where author username is the default
  if (author.username === '@medium') {
    return EMPTY_RESPONSE
  }

  // Handle case where rawPosts is null/undefined
  if (!rawPosts || !Array.isArray(rawPosts)) {
    return {
      posts: [],
      author,
    }
  }

  const posts = rawPosts.map((p) => ({
    title: p.title,
    text: p.virtuals.subtitle,
    cover: p.virtuals.previewImage.imageId
      ? p.virtuals.previewImage.imageId.startsWith('http')
        ? p.virtuals.previewImage.imageId
        : `${MEDIUM_CDN}/${p.virtuals.previewImage.imageId}`
      : '',
    url: `${MEDIUM_URL}/@${mediumUser.username}/${p.uniqueSlug}`,
    date: p.createdAt,
    time: p.virtuals.readingTime,
  }))

  return {
    posts,
    author,
  }
}
