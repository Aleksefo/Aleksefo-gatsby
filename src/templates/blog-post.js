import React from 'react'
import { Heading, Image, Text, Box } from 'rebass'
import * as colors from '../../colors'
import Layout from '../components/Layout'

export default props => {
  const {
    title,
    subtitle,
    createdAt,
    readingTime,
    tags,
    heroImage,
    body,
  } = props.pageContext
  return (
    <Layout>
      {/*<SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />*/}{' '}
      <Box
        p={[3, 4, 5]}
        fontSize={3}
        maxWidth={'50em'}
        margin={[0, 'auto']}
        fontFamily={'AvenirNext-Regular'}
        sx={{
          ul: {
            listStyle: 'none',
            display: 'grid',
            padding: 0,
            gridGap: 3,
            gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
          },
          li: {
            fontWeight: 'bold',
          },
        }}
      >
        <Text fontSize={[4, 5, 6]} mb={[3, 4]}>
          {title}
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          mb={[3, 4]}
          style={{ color: colors.subtitle }}
          // letterSpacing={'-.02em'}
          // fontWeight={900}
        >
          {subtitle}
        </Text>
        <Text
          fontSize={[2, 3, 4]}
          style={{ color: colors.subtitle }}
          letterSpacing={'-.02em'}
        >
          {createdAt} · {readingTime} min read
        </Text>
        <Text fontSize={[3, 4, 5]} fontWeight="bold">
          tags {tags}
        </Text>
        <p></p>
        <Box
          alignSelf="center"
          bg={'green'}
          sx={{
            maxWidth: 1512,
            mx: 'auto',
          }}
        >
          <Image
            // width={0.8}
            // alignContent="center"
            src={heroImage.fluid.src}
            borderRadius={8}
            backgroundColor={'red'}
            margin={[0, 'auto']}
            alt={heroImage.title}
            // sx={{
            //   width: ['80%', '50%'],
            //   borderRadius: 8,
            // }}
          />
          <Text>{heroImage.description}</Text>
        </Box>
        <div
          dangerouslySetInnerHTML={{
            __html: body.childMarkdownRemark.html,
          }}
        />
      </Box>
    </Layout>
  )
}
//
