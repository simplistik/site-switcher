# Site Switcher by The Taproot Agency

Replaces the default WordPress multisite "My Sites" admin bar dropdown with a fast, searchable command palette. Built with React.

## Requirements

- WordPress 5.9+
- PHP 8.2+
- Multisite enabled

## Features

- **Searchable command palette** — filter sites by name or URL
- **Recent sites** — tracks the 5 most recently visited sites per user
- **Dark mode** — toggle between light/dark themes, persisted in localStorage
- **Keyboard navigation** — full keyboard support for navigating and selecting sites
- **Network admin access** — network admins see a link to the network dashboard
- **Quick actions** — visit site frontend, open dashboard, or create a new post

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+Shift+K` / `Ctrl+Shift+K` | Toggle modal |
| `Arrow Up` / `Arrow Down` | Navigate site list |
| `Enter` | Select site |
| `Escape` | Close modal |

Clicking "My Sites" in the admin bar also opens the modal.

## Development

### Setup

```bash
pnpm install
pnpm start      # development mode with hot reload
pnpm run build   # production build
```

### Scripts

| Script | Description |
|---|---|
| `pnpm start` | Dev server with hot reload |
| `pnpm run build` | Production build |
| `pnpm run lint:js` | Lint JS files |
| `pnpm run lint:js:fix` | Lint and auto-fix |
| `pnpm run bundle` | Create distribution zip |
| `pnpm run release` | Interactive release (prompts for type) |
| `pnpm run release:patch` | Patch release |
| `pnpm run release:minor` | Minor release |
| `pnpm run release:major` | Major release |
| `pnpm run release:zip` | Zip-only, no versioning or git |

### Project Structure

```
tprt-site-switcher/
├── tprt-site-switcher.php          # Plugin entry point
├── includes/
│   └── class-site-switcher.php     # PHP: assets, REST API, data localization
├── src/
│   ├── index.js                    # React entry point
│   ├── style.scss                  # Styles
│   ├── components/
│   │   ├── SiteSwitcherModal.js    # Main modal
│   │   ├── SearchInput.js          # Search field
│   │   ├── SiteList.js             # Site list with sections
│   │   ├── SiteItem.js             # Individual site row
│   │   ├── NetworkAdmin.js         # Network admin link
│   │   └── KeyboardHint.js         # Shortcut hints
│   └── hooks/
│       ├── useSiteSwitcher.js      # Core state management
│       ├── useDarkMode.js          # Dark mode toggle
│       ├── useKeyboardNavigation.js # Arrow key navigation
│       └── useRecentSites.js       # Recent sites (localStorage)
├── build/                          # Compiled output (generated)
├── scripts/
│   ├── bundleZip.js                # Zip bundler
│   ├── updatePluginVersion.js      # Version sync (package.json → PHP)
│   └── create-release.sh           # Release automation
├── .release/                       # Release zip output (gitignored)
├── eslint.config.mjs
├── webpack.config.js
├── postcss.config.js
├── package.json
└── composer.json
```

### How It Works

**PHP** — `class-site-switcher.php` enqueues the React bundle on multisite admin pages, hides the default "My Sites" dropdown via CSS, and localizes site data to `window.tprtSiteSwitcher`.

**React** — On `DOMContentLoaded`, the app mounts a modal component that intercepts the admin bar "My Sites" click and listens for the global keyboard shortcut. Sites are filtered, sectioned (current / recent / all), and navigable via keyboard. Recent sites and dark mode preferences are persisted in localStorage.

## License

GPL-2.0-or-later
