
module.exports = {
  NODE_ENV: '"production"',
  ASSETS_URL: '"."',
  LEVEL_CAP: 'LEVEL_CAP', // the level cap
  BUILD_VERSION: 'BUILD_VERSION', // the build version (eg v203, etc)
  REGION: '"' + process.env.REGION + '"',
  REGIONS_URL: '"http://dnmaze.com/regions.json"', // this I will hard code
  VERSION: 'VERSION', // the version of MAZE
  VERSION_URL: '"/version.json"',
  LOCALE: require('./locale')(process.env.REGION),
}
