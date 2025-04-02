<?php
class WP_Cmd_Palette_Admin
{
  public function __construct()
  {
    add_action('admin_menu', [$this, 'add_menu_page']);
  }

  public function add_menu_page()
  {
    add_options_page(
      'Command Palette Settings',
      'Command Palette',
      'manage_options',
      'wp-cmd-palette',
      [$this, 'render_settings_page']
    );
  }

  public function render_settings_page()
  {
    if (!current_user_can('manage_options')) {
      return;
    }

    add_filter('admin_footer_text', '__return_empty_string');
    add_filter('update_footer', '__return_empty_string', 11);

    include WP_CMD_PALETTE_PATH . 'admin/views/settings.php';
  }
}
