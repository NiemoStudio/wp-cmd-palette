<?php

/**
 * Plugin Name: WP Command Palette
 * Description: A customizable command palette (CMD/CTRL + K) for WordPress.
 * Version: 1.0.0
 * Author: Niemo
 * Author URI: https://niemo.be
 * License: GPL v2 or later
 * Text Domain: wp-cmd-palette
 * Requires at least: 6.0
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
  exit;
}

define('WP_CMD_PALETTE_VERSION', '1.0.0');
define('WP_CMD_PALETTE_PATH', plugin_dir_path(__FILE__));
define('WP_CMD_PALETTE_URL', plugin_dir_url(__FILE__));
define('WP_CMD_PALETTE_BASENAME', plugin_basename(__FILE__));
define('WP_CMD_PALETTE_MINIMUM_WP_VERSION', '6.0');
define('WP_CMD_PALETTE_MINIMUM_PHP_VERSION', '8.0');

require_once WP_CMD_PALETTE_PATH . 'includes/class-api.php';
require_once WP_CMD_PALETTE_PATH . 'includes/class-enqueue-frontend.php';
require_once WP_CMD_PALETTE_PATH . 'includes/class-enqueue-backend.php';
require_once WP_CMD_PALETTE_PATH . 'includes/class-admin.php';

class WP_Cmd_Palette
{
  private static $instance = null;

  public static function get_instance()
  {
    if (null === self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  private function __construct()
  {
    add_action('init', [$this, 'init']);
  }

  public function init()
  {
    if (!$this->check_requirements()) {
      return;
    }

    new WP_Cmd_Palette_API();
    new WP_Cmd_Palette_Enqueue_Frontend();
    new WP_Cmd_Palette_Enqueue_Backend();
    new WP_Cmd_Palette_Admin();
  }

  private function check_requirements()
  {
    if (version_compare(PHP_VERSION, WP_CMD_PALETTE_MINIMUM_PHP_VERSION, '<')) {
      add_action('admin_notices', function () {
        $message = sprintf(
          esc_html__('WP Command Palette requires PHP version %s or higher.', 'wp-cmd-palette'),
          WP_CMD_PALETTE_MINIMUM_PHP_VERSION
        );
        echo '<div class="error"><p>' . $message . '</p></div>';
      });
      return false;
    }

    if (version_compare($GLOBALS['wp_version'], WP_CMD_PALETTE_MINIMUM_WP_VERSION, '<')) {
      add_action('admin_notices', function () {
        $message = sprintf(
          esc_html__('WP Command Palette requires WordPress version %s or higher.', 'wp-cmd-palette'),
          WP_CMD_PALETTE_MINIMUM_WP_VERSION
        );
        echo '<div class="error"><p>' . $message . '</p></div>';
      });
      return false;
    }

    return true;
  }

  public function activate()
  {
    if (!$this->check_requirements()) {
      deactivate_plugins(WP_CMD_PALETTE_BASENAME);
      wp_die(
        sprintf(
          esc_html__('WP Command Palette requires PHP version %1$s or higher and WordPress version %2$s or higher.', 'wp-cmd-palette'),
          WP_CMD_PALETTE_MINIMUM_PHP_VERSION,
          WP_CMD_PALETTE_MINIMUM_WP_VERSION
        )
      );
    }

    flush_rewrite_rules();
  }

  public function deactivate()
  {
    flush_rewrite_rules();
  }
}

WP_Cmd_Palette::get_instance();

register_activation_hook(__FILE__, [WP_Cmd_Palette::get_instance(), 'activate']);
register_deactivation_hook(__FILE__, [WP_Cmd_Palette::get_instance(), 'deactivate']);
register_uninstall_hook(__FILE__, 'wp_cmd_palette_uninstall');

function wp_cmd_palette_uninstall()
{
  delete_option('wp_cmd_palette_settings');
  delete_option('wp_cmd_palette_styling');

  $pages = get_pages([
    'posts_per_page' => -1,
  ]);

  foreach ($pages as $page) {
    delete_post_meta($page->ID, 'wp_cmd_palette_settings');
  }

  flush_rewrite_rules();
}
