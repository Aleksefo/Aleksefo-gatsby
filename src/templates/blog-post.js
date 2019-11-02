import React from 'react'
import { Heading, Image, Text, Box } from 'rebass'
import Layout from '../components/Layout'

export default props => {
  const {
    name,
    profile,
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
      {/*<SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />*/}
      <Box
        p={[3, 4, 5]}
        fontSize={3}
        maxWidth={'50em'}
        margin={[0, 'auto']}
        fontFamily={'AvenirNext-Regular'}
        // sx={{
        //   ul: {
        //     listStyle: 'none',
        //     display: 'grid',
        //     padding: 0,
        //     gridGap: 3,
        //     gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
        //   },
        //   li: {
        //     fontWeight: 'bold',
        //   },
        // }}
      >
        <Text fontSize={[4, 5, 6]} mb={[3, 4]}>
          {title}
        </Text>
        <Text
          fontSize={[3, 4, 5]}
          mb={[3, 4]}
          color="subtitle"
          // letterSpacing={'-.02em'}
          // fontWeight={900}
        >
          {subtitle}
        </Text>
        {/*<Image src={profile.fluid.src} variant="avatar" />*/}
        <Text fontSize={[2, 3, 4]} color="subtitle" letterSpacing={'-.02em'}>
          {name} · {createdAt} · {readingTime} min read
        </Text>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          // flex="auto"
        >
          <Image
            src={heroImage.fluid.src}
            borderRadius={4}
            alt={heroImage.title}
          />
          <Text color="subtitle">{heroImage.description}</Text>
        </Box>
        <div
          dangerouslySetInnerHTML={{
            __html: body.childMarkdownRemark.html,
          }}
        />
        <Text fontSize={[2, 3, 4]} fontWeight="bold">
          Tags: {tags}
        </Text>
      </Box>
    </Layout>
  )
}
//
