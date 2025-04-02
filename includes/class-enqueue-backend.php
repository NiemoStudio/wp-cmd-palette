<?php
class WP_Cmd_Palette_Enqueue_Backend
{
  public function __construct()
  {
    add_action('admin_enqueue_scripts', [$this, 'enqueue_backend']);
  }

  private function get_manifest_entry($entry)
  {
    $manifest_path = WP_CMD_PALETTE_PATH . 'admin/dist/.vite/manifest.json';

    if (!file_exists($manifest_path)) {
      return false;
    }

    $manifest = json_decode(file_get_contents($manifest_path), true);

    if (!isset($manifest[$entry])) {
      return false;
    }

    return $manifest[$entry]['file'];
  }

  private function has_dev_server()
  {
    static $has_server = null;

    if ($has_server === null) {
      $dev_server = @fsockopen('localhost', 5175);
      $has_server = false;

      if ($dev_server) {
        fclose($dev_server);
        $has_server = true;
      }
    }

    return $has_server;
  }

  private function get_dev_server_url()
  {
    return 'http://localhost:5175';
  }

  /**
   * Inject React refresh runtime
   */
  public function inject_react_refresh_runtime()
  {
    $vite_server = $this->get_dev_server_url();

    $refresh_code = sprintf(
      '<script type="module">
        import RefreshRuntime from "%s/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
      </script>',
      $vite_server
    );

    add_action('admin_head', function () use ($refresh_code) {
      echo $refresh_code;
    });
  }

  public function enqueue_backend()
  {
    if ('settings_page_wp-cmd-palette' !== get_current_screen()->id) {
      return;
    }

    // Enqueue Remix Icon stylesheet
    wp_enqueue_style(
      'remixicon',
      'https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css',
      [],
      '3.5.0'
    );

    if ($this->has_dev_server()) {
      $this->inject_react_refresh_runtime();

      wp_enqueue_script(
        'wp-cmd-palette-hot',
        $this->get_dev_server_url() . '/@vite/client',
        [],
        null,
        true
      );

      wp_enqueue_script(
        'wp-cmd-palette',
        $this->get_dev_server_url() . '/src/main.tsx',
        ['wp-cmd-palette-hot'],
        null,
        true
      );

      add_filter('script_loader_tag', function ($tag, $handle) {
        if (in_array($handle, ['wp-cmd-palette-hot', 'wp-cmd-palette'])) {
          return str_replace('<script', '<script type="module"', $tag);
        }
        return $tag;
      }, 10, 2);
    } else {
      $main_js = $this->get_manifest_entry('src/main.tsx');

      if ($main_js) {
        $manifest_path = WP_CMD_PALETTE_PATH . 'admin/dist/.vite/manifest.json';
        $manifest = json_decode(file_get_contents($manifest_path), true);

        if (isset($manifest['src/main.tsx']['css'])) {
          foreach ($manifest['src/main.tsx']['css'] as $css_file) {
            wp_enqueue_style(
              'wp-cmd-palette',
              WP_CMD_PALETTE_URL . 'admin/dist/' . $css_file,
              [],
              WP_CMD_PALETTE_VERSION
            );
          }
        }

        wp_enqueue_script(
          'wp-cmd-palette',
          WP_CMD_PALETTE_URL . 'admin/dist/' . $main_js,
          [],
          WP_CMD_PALETTE_VERSION,
          true
        );
      }
    }
  }
}
