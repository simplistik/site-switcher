/* eslint-disable no-console */
/**
 * Script to update WordPress plugin version number from package.json
 */
const fs = require( 'fs' );
const path = require( 'path' );

try {
  // Read package.json to get version
  const packageJsonPath = path.resolve( './package.json' );
  const packageData = JSON.parse( fs.readFileSync( packageJsonPath, 'utf8' ) );
  const newVersion = packageData.version;

  if ( !newVersion ) {
    console.error( 'No version found in package.json' );
    process.exit( 1 );
  }

  // Update tprt-site-switcher.php
  const pluginFilePath = path.resolve( './tprt-site-switcher.php' );
  let pluginFileContent = fs.readFileSync( pluginFilePath, 'utf8' );

  // Update Version: X.X.X in plugin header
  pluginFileContent = pluginFileContent.replace( /(\* Version: )(\d+\.\d+\.\d+)/, `$1${newVersion}` );

  // Update TPRT_SITE_SWITCHER_VERSION constant
  pluginFileContent = pluginFileContent.replace(
    /(define\( 'TPRT_SITE_SWITCHER_VERSION', ')(\d+\.\d+\.\d+)(' \);)/,
    `$1${newVersion}$3`,
  );

  // Write updated content back
  fs.writeFileSync( pluginFilePath, pluginFileContent );

  console.log( `✅ Updated plugin version to ${newVersion} in tprt-site-switcher.php` );
} catch ( error ) {
  console.error( 'Error updating plugin version:', error );
  process.exit( 1 );
}
