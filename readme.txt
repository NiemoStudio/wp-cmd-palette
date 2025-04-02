# WordPress Command Palette

A command palette for WordPress that enhances the navigation on your website.

## Features

- Lightning-fast search and navigation
- Keyboard-first interface (Press `Cmd/Ctrl + K` to open)
- Search through pages
- Real-time results as you type

## Installation

1. Download the plugin from WordPress.org or clone this repository
2. Upload to your `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

1. Press `Cmd/Ctrl + K` anywhere in the WordPress admin to open the command palette
2. Start typing to search for pages
3. Use arrow keys to navigate results
4. Press `Enter` to select an item

## Styling

Go to `Settings > Command Palette > Styling`

## Settings

Go to `Settings > Command Palette > Settings`

## Manually open the command palette

You can manually open the command palette by calling the `open` function.
This is useful if you want to open the command palette via a button or link.

```js
window.wpCmd.open();
```

## Requirements

- WordPress 6.0 or higher
- PHP 8.0 or higher
- Modern browser support

## Credits

Created and maintained by Niemo Studio

---

Made with ❤️ for the WordPress community
