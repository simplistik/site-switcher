<?php

/**
 * Plugin Name: Site Switcher by The Taproot Agency
 * Description: Replaces the default multisite "My Sites" admin bar dropdown with a searchable command palette.
 * Version: 1.0.1
 * Author: The Taproot Agency
 * Author URI: https://taproot.agency
 * Text Domain: tprt-site-switcher
 * Domain Path: /languages
 * Requires at least: 5.9
 * Requires PHP: 8.2
 * Network: true
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) exit;

// Define plugin constants
define( 'TPRT_SITE_SWITCHER_VERSION', '1.0.1' );
define( 'TPRT_SITE_SWITCHER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TPRT_SITE_SWITCHER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load required files
require_once TPRT_SITE_SWITCHER_PLUGIN_DIR . 'includes/class-site-switcher.php';

// Initialize — only on multisite
add_action( 'init', function () {
  if ( ! is_multisite() ) return;

  $switcher = new TPRT_Site_Switcher();
  $switcher->init();
} );
