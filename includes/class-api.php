<?php
class WP_Cmd_Palette_API
{
  private $default_settings = [
    'pinned_pages' => []
  ];

  public function __construct()
  {
    add_action('rest_api_init', [$this, 'register_routes']);
    add_action('admin_enqueue_scripts', function () {
      wp_enqueue_script('wp-api');
      wp_localize_script('wp-api', 'wpApiSettings', array(
        'nonce' => wp_create_nonce('wp_rest'),
        'root' => esc_url_raw(rest_url())
      ));
    });
  }

  public function register_routes()
  {
    register_rest_route('wp-cmd-palette/v1', '/list', [
      'methods' => 'POST',
      'callback' => [$this, 'get_pages'],
      'permission_callback' => [$this, 'check_guest'],
      'args' => [
        'currentUrl' => [
          'required' => true,
          'type' => 'string',
        ],
      ],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/pinned', [
      'methods' => 'GET',
      'callback' => [$this, 'get_pinned_pages'],
      'permission_callback' => [$this, 'check_guest'],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/pinned', [
      'methods' => 'POST',
      'callback' => [$this, 'pin_page'],
      'permission_callback' => [$this, 'check_admin'],
      'args' => [
        'pageId' => [
          'required' => true,
          'type' => 'integer',
        ],
      ],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/pinned/(?P<id>\d+)', [
      'methods' => 'DELETE',
      'callback' => [$this, 'unpin_page'],
      'permission_callback' => [$this, 'check_admin'],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/pages/(?P<id>\d+)', [
      'methods' => 'PATCH',
      'callback' => [$this, 'update_page_settings'],
      'permission_callback' => [$this, 'check_admin'],
      'args' => [
        'color' => ['type' => 'string'],
        'icon' => ['type' => 'string'],
        'hidden' => ['type' => 'boolean'],
        'order' => ['type' => 'integer'],
        'pinned' => ['type' => 'boolean'],
      ],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/styling', [
      'methods' => 'GET',
      'callback' => [$this, 'get_styling_settings'],
      'permission_callback' => [$this, 'check_admin'],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/styling', [
      'methods' => 'POST',
      'callback' => [$this, 'update_styling_settings'],
      'permission_callback' => [$this, 'check_admin'],
      'args' => [
        'colors' => [
          'type' => 'object',
          'required' => true,
          'properties' => [
            'activeItem' => ['type' => 'string'],
            'cursor' => ['type' => 'string'],
          ],
        ],
        'container' => [
          'type' => 'object',
          'required' => true,
          'properties' => [
            'opacity' => ['type' => 'string'],
            'radius' => ['type' => 'string'],
          ],
        ],
        'icon' => [
          'type' => 'object',
          'required' => true,
          'properties' => [
            'radius' => ['type' => 'string'],
          ],
        ],
        'overlay' => [
          'type' => 'object',
          'required' => true,
          'properties' => [
            'opacity' => ['type' => 'string'],
          ],
        ],
      ],
    ]);

    register_rest_route('wp-cmd-palette/v1', '/reset', [
      'methods' => 'POST',
      'callback' => [$this, 'reset_to_default'],
      'permission_callback' => [$this, 'check_admin'],
    ]);
  }

  public function check_guest()
  {
    return true;
  }

  public function check_admin()
  {
    // Ensure user is logged in
    if (!is_user_logged_in()) {
      return false;
    }

    // Check if user has manage_options capability
    return current_user_can('manage_options');
  }

  public function get_pages($request)
  {
    $current_url = $request->get_param('currentUrl');
    $results = [];

    $pages = get_pages([
      'sort_column' => 'menu_order',
      'sort_order' => 'ASC',
      'post_status' => 'publish',
      'posts_per_page' => -1,
    ]);

    foreach ($pages as $page) {
      $page_settings = get_post_meta($page->ID, 'wp_cmd_palette_settings', true) ?: [];
      $page_url = get_permalink($page->ID);
      $is_current = trailingslashit($page_url) === trailingslashit($current_url);

      $page_data = [
        'id' => $page->ID,
        'title' => $page->post_title,
        'url' => $page_url,
        'type' => 'page',
        'current' => $is_current,
        'color' => $page_settings['color'] ?? 'gray',
        'icon' => $page_settings['icon'] ?? 'pages-line',
        'hidden' => $page_settings['hidden'] ?? false,
        'order' => $page_settings['order'] ?? 0
      ];

      $results[] = $page_data;
    }

    // Sort pages by order, ensuring pinned pages come first
    usort($results, function ($a, $b) {
      return ($a['order'] ?? PHP_INT_MAX) - ($b['order'] ?? PHP_INT_MAX);
    });

    return new WP_REST_Response($results, 200);
  }

  public function get_pinned_pages()
  {
    $settings = get_option('wp_cmd_palette_settings', $this->default_settings);
    $pinned_pages = $settings['pinned_pages'];

    $results = [];
    foreach ($pinned_pages as $page_id) {
      $page = get_post($page_id);
      if ($page && $page->post_status === 'publish') {
        $page_settings = get_post_meta($page_id, 'wp_cmd_palette_settings', true) ?: [];
        $results[] = [
          'id' => $page->ID,
          'title' => $page->post_title,
          'url' => get_permalink($page->ID),
          'type' => 'page',
          'color' => $page_settings['color'] ?? 'gray',
          'icon' => $page_settings['icon'] ?? 'pages-line',
          'hidden' => $page_settings['hidden'] ?? false,
          'order' => $page_settings['order'] ?? 0
        ];
      }
    }

    // Sort by order
    usort($results, function ($a, $b) {
      return ($a['order'] ?? 0) - ($b['order'] ?? 0);
    });

    return new WP_REST_Response($results, 200);
  }

  public function pin_page($request)
  {
    $page_id = $request->get_param('pageId');
    $settings = get_option('wp_cmd_palette_settings', $this->default_settings);

    if (!in_array($page_id, $settings['pinned_pages'])) {
      $settings['pinned_pages'][] = $page_id;
      update_option('wp_cmd_palette_settings', $settings);
    }

    return new WP_REST_Response($settings['pinned_pages'], 200);
  }

  public function unpin_page($request)
  {
    $page_id = $request->get_param('id');
    $settings = get_option('wp_cmd_palette_settings', $this->default_settings);

    $settings['pinned_pages'] = array_values(array_filter(
      $settings['pinned_pages'],
      fn($id) => $id !== (int)$page_id
    ));

    update_option('wp_cmd_palette_settings', $settings);
    return new WP_REST_Response($settings['pinned_pages'], 200);
  }

  public function update_page_settings($request)
  {
    $page_id = $request->get_param('id');
    $settings = get_post_meta($page_id, 'wp_cmd_palette_settings', true) ?: [];

    if ($request->has_param('color')) {
      $settings['color'] = $request->get_param('color');
    }
    if ($request->has_param('icon')) {
      $settings['icon'] = $request->get_param('icon');
    }
    if ($request->has_param('hidden')) {
      $settings['hidden'] = $request->get_param('hidden');
    }
    if ($request->has_param('order')) {
      $settings['order'] = (int)$request->get_param('order');
    }
    if ($request->has_param('pinned')) {
      $settings['pinned'] = (bool)$request->get_param('pinned');
    }

    update_post_meta($page_id, 'wp_cmd_palette_settings', $settings);
    return new WP_REST_Response($settings, 200);
  }

  public function get_styling_settings()
  {
    $settings = get_option('wp_cmd_palette_styling', [
      'colors' => [
        'activeItem' => 'gray',
        'cursor' => 'gray',
      ],
      'container' => [
        'opacity' => 'Low',
        'radius' => 'Extra Large',
      ],
      'icon' => [
        'radius' => 'Small',
      ],
      'overlay' => [
        'opacity' => 'Low',
      ],
    ]);

    return new WP_REST_Response($settings, 200);
  }

  public function update_styling_settings($request)
  {
    $settings = $request->get_json_params();
    update_option('wp_cmd_palette_styling', $settings);
    return new WP_REST_Response($settings, 200);
  }

  public function reset_to_default()
  {
    delete_option('wp_cmd_palette_settings');
    delete_option('wp_cmd_palette_styling');

    $pages = get_pages([
      'posts_per_page' => -1,
    ]);

    foreach ($pages as $page) {
      delete_post_meta($page->ID, 'wp_cmd_palette_settings');
    }

    return new WP_REST_Response(['success' => true], 200);
  }
}
