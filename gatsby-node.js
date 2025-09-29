const gatsbySourceMedium = require('gatsby-source-medium/gatsby-node');
const { createClient } = require('contentful');

const getAbout = (entry) => entry.sys.contentType.sys.id === 'about';

exports.sourceNodes = async (gatsbyConfig, themeOptions) => {
  const client = createClient({
    space: process.env.SPACE_ID,
    accessToken: process.env.ACCESS_TOKEN,
  });

  const { items } = await client.getEntries();
  const about = items.find(getAbout);
  const { mediumUser = '@medium' } = about.fields;

  // Try to fetch Medium posts, but continue build if it fails due to Cloudflare protection
  try {
    await gatsbySourceMedium.sourceNodes(gatsbyConfig, { username: mediumUser });
    console.log('✅ Successfully fetched Medium posts');
  } catch (error) {
    console.warn('⚠️  Failed to fetch Medium posts (likely due to Cloudflare protection):', error.message);
    console.warn('   Building without Medium posts...');
    // Continue build without Medium posts
  }
};
