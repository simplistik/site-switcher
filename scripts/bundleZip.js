/* eslint-disable no-console */
/**
 * Bundle the plugin for distribution, excluding dev/build files
 * Usage: node scripts/bundleZip.js
 */
const fs = require( 'fs' );
const path = require( 'path' );
const archiver = require( 'archiver' );
const { exec } = require( 'child_process' );
const { promisify } = require( 'util' );

const execAsync = promisify( exec );
const projectRoot = process.cwd();
const releaseDir = path.join( projectRoot, '.release' );

// List of files/directories to exclude from the zip
const EXCLUDES = [
  // Development directories
  'scripts',
  'node_modules',
  'src',
  'docs',
  'tests',
  'vendor',
  '.claude',
  '.cursor',
  '.release',

  // Git files
  '.git',
  '.gitignore',
  '.gitattributes',

  // Development config files
  '.prettierrc',
  '.prettierignore',
  '.eslintrc*',
  'eslint.config.mjs',
  'phpcs.xml.dist',
  'phpcs.xml',
  '.php-cs-fixer.php',
  '.editorconfig',
  'webpack.config.js',
  'postcss.config.js',

  // Package management files
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'composer.json',
  'composer.lock',

  // Documentation and meta files
  'CLAUDE.md',
  'README.md',
  'CHANGELOG.md',
  'stubs.php',

  // Build artifacts and logs
  '*.zip',
  '*.log',
  '.DS_Store',
  'Thumbs.db',

  // IDE files
  '.vscode',
  '.idea',
  '*.swp',
  '*.swo',
];

/**
 * Get plugin version from the main plugin file
 */
async function getPluginVersion() {
  try {
    const pluginFile = await fs.promises.readFile( path.join( projectRoot, 'tprt-site-switcher.php' ), 'utf8' );
    const versionMatch = pluginFile.match( /Version:\s*([0-9.]+)/i );
    if ( versionMatch && versionMatch[1] ) {
      return versionMatch[1];
    }
  } catch ( err ) {
    console.warn( 'Could not determine plugin version, using "latest":', err.message );
  }
  return 'latest';
}

/**
 * Ensure production build is created
 */
async function ensureProductionBuild() {
  console.log( '🔨 Creating production build...' );
  try {
    const { stderr } = await execAsync( 'pnpm run build', { cwd: projectRoot } );

    if ( stderr && !stderr.includes( 'webpack' ) && !stderr.includes( 'compiled successfully' ) ) {
      console.warn( 'Build warnings:', stderr );
    }

    console.log( '✅ Production build completed' );
    return true;
  } catch ( err ) {
    console.error( '❌ Production build failed:', err.message );
    throw new Error( 'Failed to create production build: ' + ( err.stderr || err.message ) );
  }
}

/**
 * Create the zip file
 */
async function createZip( version ) {
  const zipFileName = `tprt-site-switcher-${version}.zip`;

  // Ensure .release directory exists
  await fs.promises.mkdir( releaseDir, { recursive: true } );
  const outputPath = path.join( releaseDir, zipFileName );

  // Remove existing zip if present
  try {
    await fs.promises.unlink( outputPath );
    console.log( `Removed existing ${zipFileName}` );
  } catch ( err ) {
    // File doesn't exist, which is fine
  }

  console.log( `📦 Creating ${zipFileName}...` );

  return new Promise( ( resolve, reject ) => {
    const output = fs.createWriteStream( outputPath );
    const archive = archiver( 'zip', { zlib: { level: 9 } } );

    output.on( 'close', () => {
      const fileSizeMB = ( archive.pointer() / 1024 / 1024 ).toFixed( 2 );
      console.log( `✅ ${zipFileName} created (${fileSizeMB} MB)` );
      resolve( outputPath );
    } );

    output.on( 'error', reject );
    archive.on( 'error', reject );
    archive.on( 'warning', err => {
      if ( err.code === 'ENOENT' ) {
        console.warn( 'Warning:', err.message );
      } else {
        reject( err );
      }
    } );

    archive.pipe( output );

    // Add files to archive, but inside a "tprt-site-switcher" directory
    archive.directory( projectRoot, 'tprt-site-switcher', entry => {
      // Check if this entry should be excluded
      const relativePath = path.relative( projectRoot, entry.name );

      // Check against exclusion patterns
      for ( const exclude of EXCLUDES ) {
        // Exact match
        if ( relativePath === exclude ) {
          return false;
        }

        // Directory prefix match
        if ( relativePath.startsWith( exclude + path.sep ) ) {
          return false;
        }

        // Wildcard patterns
        if ( exclude.includes( '*' ) ) {
          const regexPattern = exclude.replace( /\./g, '\\.' ).replace( /\*/g, '.*' );
          if ( new RegExp( `^${regexPattern}$` ).test( relativePath ) ) {
            return false;
          }
        }
      }

      return entry;
    } );

    archive.finalize();
  } );
}

/**
 * Main function
 */
async function main() {
  console.log( '🚀 Starting plugin bundling process...' );
  const startTime = Date.now();

  try {
    // Get plugin version
    const version = await getPluginVersion();
    console.log( `Plugin version: ${version}` );

    // Ensure production build
    await ensureProductionBuild();

    // Create zip
    const zipPath = await createZip( version );

    const executionTime = ( ( Date.now() - startTime ) / 1000 ).toFixed( 2 );
    console.log( `✨ Bundle process completed successfully in ${executionTime}s` );
    console.log( `📦 Plugin bundle: ${path.basename( zipPath )}` );

    return true;
  } catch ( err ) {
    console.error( '❌ Error during bundling:', err.message );
    return false;
  }
}

// Run if called directly
const isMainScript = process.argv[1] && process.argv[1].endsWith( 'bundleZip.js' );

if ( isMainScript ) {
  main()
    .then( success => {
      process.exit( success ? 0 : 1 );
    } )
    .catch( err => {
      console.error( 'Fatal error:', err );
      process.exit( 1 );
    } );
}

module.exports = { main };
