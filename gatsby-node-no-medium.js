const { createClient } = require('contentful');

const getAbout = (entry) => entry.sys.contentType.sys.id === 'about';

exports.sourceNodes = async (gatsbyConfig, themeOptions) => {
  const client = createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  });

  const { items } = await client.getEntries();
  const about = items.find(getAbout);

  console.log('✅ Contentful data fetched successfully (Medium integration disabled)');

  // Medium integration disabled due to Cloudflare 403 issues
  // To re-enable: uncomment the lines below and ensure Medium API is accessible

  // const { mediumUser = '@medium' } = about.fields;
  // const gatsbySourceMedium = require('gatsby-source-medium/gatsby-node');
  // await gatsbySourceMedium.sourceNodes(gatsbyConfig, { username: mediumUser });
};