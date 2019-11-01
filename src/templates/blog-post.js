import React from 'react'
import Layout from '../components/Layout'
// import get from 'lodash/get'
// import Img from 'gatsby-image'
// import Layout from '../components/layout'
//
// import heroStyles from '../components/hero.module.css'

export default ({ pageContext }) => {
  return (
    <Layout>
      <div>
        <p>{pageContext.title}</p>
        <p>{pageContext.subtitle}</p>
        <p>{pageContext.readingTime} readingTime</p>
        <p>{pageContext.createdAt}</p>
        <p>tags {pageContext.tags}</p>
        <p>heroImage {pageContext.heroImage.fluid.src}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: pageContext.body.childMarkdownRemark.html,
          }}
        />
      </div>
    </Layout>
  )
}
