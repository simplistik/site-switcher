/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
  ...defaultConfig,

  entry: {
    index: path.resolve( __dirname, 'src', 'index.js' ),
  },

  output: {
    ...defaultConfig.output,
    path: path.resolve( __dirname, 'build' ),
  },

  devtool: defaultConfig.mode === 'production' ? false : 'source-map',

  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      '@components': path.resolve( __dirname, 'src/components' ),
      '@hooks': path.resolve( __dirname, 'src/hooks' ),
    },
  },
};
