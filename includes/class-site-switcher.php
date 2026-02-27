<?php

/**
 * Site Switcher
 *
 * Handles enqueuing assets, inlining site data, hiding the default
 * "My Sites" dropdown, and registering the REST API endpoint.
 */
class TPRT_Site_Switcher
{
  /**
   * Enqueue the site switcher script and styles.
   *
   * @return void
   */
  public function enqueue_assets()
  {
    if ( !is_admin_bar_showing() ) return;
    if ( !is_user_logged_in() ) return;

    $asset_file = TPRT_SITE_SWITCHER_PLUGIN_DIR . 'build/index.asset.php';

    if ( !file_exists( $asset_file ) ) return;

    $asset_data = require $asset_file;

    wp_enqueue_script(
      'tprt-site-switcher',
      TPRT_SITE_SWITCHER_PLUGIN_URL . 'build/index.js',
      $asset_data['dependencies'],
      $asset_data['version'],
      true
    );

    wp_enqueue_style(
      'tprt-site-switcher',
      TPRT_SITE_SWITCHER_PLUGIN_URL . 'build/style-index.css',
      ['dashicons'],
      $asset_data['version']
    );

    wp_localize_script(
      'tprt-site-switcher',
      'tprtSiteSwitcher',
      $this->get_localized_data()
    );
  }

  /**
   * Output inline CSS to hide the default "My Sites" dropdown submenu.
   *
   * @return void
   */
  public function hide_default_dropdown()
  {
    if ( !is_admin_bar_showing() ) return;
    if ( !is_user_logged_in() ) return;

    echo '<style>#wp-admin-bar-my-sites .ab-sub-wrapper{display:none!important}</style>';
  }

  /**
   * Initialize hooks.
   *
   * @return void
   */
  public function init()
  {
    // Enqueue on both frontend and admin
    add_action( 'wp_enqueue_scripts', [$this, 'enqueue_assets'] );
    add_action( 'admin_enqueue_scripts', [$this, 'enqueue_assets'] );

    // Hide default dropdown
    add_action( 'wp_head', [$this, 'hide_default_dropdown'] );
    add_action( 'admin_head', [$this, 'hide_default_dropdown'] );

    // Register REST endpoint
    add_action( 'rest_api_init', [$this, 'register_rest_routes'] );
  }

  /**
   * Register REST API routes.
   *
   * @return void
   */
  public function register_rest_routes()
  {
    register_rest_route( 'tprt-site-switcher/v1', '/sites', [
      'methods'             => 'GET',
      'callback'            => [$this, 'rest_get_user_sites'],
      'permission_callback' => function() {
        return is_user_logged_in();
      },
    ] );
  }

  /**
   * REST callback: return the current user's sites.
   *
   * @return WP_REST_Response
   */
  public function rest_get_user_sites()
  {
    return rest_ensure_response( $this->get_user_sites_data() );
  }

  /**
   * Build the localized data array for the JavaScript app.
   *
   * @return array
   */
  private function get_localized_data()
  {
    $data = [
      'sites'       => $this->get_user_sites_data(),
      'currentSite' => get_current_blog_id(),
      'userId'      => get_current_user_id(),
      'isMultisite' => true,
    ];

    if ( is_super_admin() ) :
      $data['isNetworkAdmin']  = true;
      $data['networkAdminUrl'] = network_admin_url();
    endif;

    return $data;
  }

  /**
   * Get the current user's sites formatted for the switcher.
   *
   * @return array
   */
  private function get_user_sites_data()
  {
    $blogs = get_blogs_of_user( get_current_user_id() );
    $sites = [];

    foreach ( $blogs as $blog ) :
      $blog_id = (int) $blog->userblog_id;

      $sites[] = [
        'blogId'    => $blog_id,
        'name'      => $blog->blogname,
        'siteUrl'   => $blog->siteurl,
        'adminUrl'  => get_admin_url( $blog_id ),
        'path'      => $blog->path,
        'isCurrent' => ( $blog_id === get_current_blog_id() ),
      ];
    endforeach;

    return $sites;
  }
}
